from typing import List, Dict, Any, Optional, Tuple
from datetime import datetime
from pydantic import BaseModel
import networkx as nx

from backend.core.models import (
    Station,
    Mission,
    Cargo,
    Asset,
    Personnel,
    Dependency,
    Disruption,
    DisruptionSeverity,
    DependencyType,
    MissionStatus,
    CargoStatus,
)
from backend.core.exceptions import (
    CyclicDependencyError,
    SelfDependencyError,
    EntityNotFoundError,
    InvalidDisruptionError,
)


class AffectedEntityImpact(BaseModel):
    entity_id: str
    entity_type: str  # "CARGO", "MISSION", "ASSET", "PERSONNEL"
    entity_name: str
    impact_level: str  # "DIRECT" or "TRANSITIVE"
    broken_prerequisite: Optional[str] = None
    reason: str


class ImpactSet(BaseModel):
    disruption_id: str
    target_entity_id: str
    target_entity_name: str
    severity: DisruptionSeverity
    directly_affected: List[AffectedEntityImpact]
    transitively_affected: List[AffectedEntityImpact]
    affected_missions: List[str]  # Mission IDs
    broken_prerequisites: List[str]  # Human-readable list of broken prerequisites
    summary_reason: str


class GraphSolver:
    """Deterministic NetworkX DAG dependency solver and disruption impact engine."""

    def __init__(self, dependencies: List[Dependency], state_entities: Dict[str, Any]):
        """
        state_entities: Dict mapping entity_id -> SQLModel entity instance
        dependencies: List of Dependency SQLModel objects
        """
        self.dependencies = dependencies
        self.entities = state_entities
        self.graph = nx.DiGraph()
        self._build_graph()

    def _build_graph(self) -> None:
        """Constructs NetworkX directed graph from operational entities and dependencies."""
        # Add all state entities as nodes
        for entity_id, entity in self.entities.items():
            entity_type = entity.__class__.__name__.upper()
            name = getattr(entity, "title", getattr(entity, "item_name", getattr(entity, "name", entity_id)))
            self.graph.add_node(entity_id, type=entity_type, name=name, obj=entity)

        # Add dependency edges (Source -> Target)
        # E.g., Cargo-Fuel-01 (Source) ---> Mission Deep Freeze (Target)
        for dep in self.dependencies:
            if dep.source_id == dep.target_id:
                raise SelfDependencyError(dep.source_id)

            self.graph.add_edge(
                dep.source_id,
                dep.target_id,
                dep_id=dep.id,
                dep_type=dep.dependency_type,
                notes=dep.notes or "",
            )

        # Enforce DAG property
        self.validate_dag()

    def validate_dag(self) -> None:
        """Checks for cycles in the dependency graph and raises CyclicDependencyError if found."""
        if not nx.is_directed_acyclic_graph(self.graph):
            cycles = list(nx.simple_cycles(self.graph))
            if cycles:
                # Format cycle node names for error message
                first_cycle = cycles[0]
                cycle_names = [
                    self.graph.nodes[n].get("name", n) if n in self.graph.nodes else n
                    for n in first_cycle
                ]
                cycle_names.append(cycle_names[0])  # Close cycle visual loop
                raise CyclicDependencyError(cycle_names)

    def validate_new_dependency(self, source_id: str, target_id: str) -> None:
        """Validates if adding source_id -> target_id would create a self-dependency or cycle."""
        if source_id == target_id:
            raise SelfDependencyError(source_id)

        if source_id not in self.entities:
            raise EntityNotFoundError("Entity", source_id)
        if target_id not in self.entities:
            raise EntityNotFoundError("Entity", target_id)

        # Check if adding this edge creates a cycle
        test_graph = self.graph.copy()
        test_graph.add_edge(source_id, target_id)
        if not nx.is_directed_acyclic_graph(test_graph):
            cycles = list(nx.simple_cycles(test_graph))
            first_cycle = cycles[0]
            cycle_names = [
                self.graph.nodes[n].get("name", n) if n in self.graph.nodes else n
                for n in first_cycle
            ]
            cycle_names.append(cycle_names[0])
            raise CyclicDependencyError(cycle_names)

    def analyze_disruption(self, disruption: Disruption) -> ImpactSet:
        """
        Calculates deterministic direct and transitive impact set for a disruption event.
        Returns a structured, 100% reproducible ImpactSet.
        """
        target_id = disruption.entity_id
        if target_id not in self.graph.nodes:
            raise InvalidDisruptionError(f"Target entity '{target_id}' does not exist in operational state graph.")

        target_node = self.graph.nodes[target_id]
        target_name = target_node.get("name", target_id)
        target_type = target_node.get("type", "UNKNOWN")

        directly_affected: List[AffectedEntityImpact] = []
        transitively_affected: List[AffectedEntityImpact] = []
        affected_missions: List[str] = []
        broken_prerequisites: List[str] = []

        delay_hours = disruption.delay_hours

        # 1. Direct Outbound Neighbors in DAG (Direct Impact)
        direct_outbound = list(self.graph.successors(target_id))

        for successor_id in direct_outbound:
            succ_node = self.graph.nodes[successor_id]
            succ_name = succ_node.get("name", successor_id)
            succ_type = succ_node.get("type", "UNKNOWN")
            succ_obj = succ_node.get("obj")

            edge_data = self.graph.get_edge_data(target_id, successor_id)
            dep_type = edge_data.get("dep_type", "REQUIRED_CARGO")

            reason = (
                f"{succ_name} directly depends on {target_name} via {dep_type}. "
                f"Disruption delay of {delay_hours}h invalidates schedule assumption."
            )
            broken_prereq = f"{dep_type}: {target_name} -> {succ_name}"
            broken_prerequisites.append(broken_prereq)

            impact = AffectedEntityImpact(
                entity_id=successor_id,
                entity_type=succ_type,
                entity_name=succ_name,
                impact_level="DIRECT",
                broken_prerequisite=broken_prereq,
                reason=reason,
            )
            directly_affected.append(impact)

            if succ_type == "MISSION" and successor_id not in affected_missions:
                affected_missions.append(successor_id)

        # 2. Transitive Descendants in DAG (Transitive Impact)
        # All descendants reachable from direct_outbound successors
        direct_set = set(direct_outbound)
        all_descendants = set(nx.descendants(self.graph, target_id))
        transitive_set = all_descendants - direct_set

        # Topological sort order guarantees deterministic iteration
        topo_order = list(nx.topological_sort(self.graph))
        transitive_ordered = [node for node in topo_order if node in transitive_set]

        for desc_id in transitive_ordered:
            desc_node = self.graph.nodes[desc_id]
            desc_name = desc_node.get("name", desc_id)
            desc_type = desc_node.get("type", "UNKNOWN")

            # Find predecessor path from target_id to desc_id for explanation
            try:
                shortest_path = nx.shortest_path(self.graph, target_id, desc_id)
                path_names = [self.graph.nodes[n].get("name", n) for n in shortest_path]
                path_str = " -> ".join(path_names)
            except Exception:
                path_str = f"{target_name} -> ... -> {desc_name}"

            reason = (
                f"{desc_name} is transitively impacted along dependency chain: {path_str}. "
                f"Upstream disruption of {delay_hours}h propagates down the operational graph."
            )
            broken_prereq = f"TRANSITIVE_PREREQUISITE: {path_str}"
            broken_prerequisites.append(broken_prereq)

            impact = AffectedEntityImpact(
                entity_id=desc_id,
                entity_type=desc_type,
                entity_name=desc_name,
                impact_level="TRANSITIVE",
                broken_prerequisite=broken_prereq,
                reason=reason,
            )
            transitively_affected.append(impact)

            if desc_type == "MISSION" and desc_id not in affected_missions:
                affected_missions.append(desc_id)

        # 3. Determine Deterministic Severity
        total_affected_count = len(directly_affected) + len(transitively_affected)
        severity = disruption.severity

        if total_affected_count == 0:
            severity = DisruptionSeverity.INFORMATIONAL
        elif len(affected_missions) > 0 and delay_hours >= 12.0:
            severity = DisruptionSeverity.CRITICAL
        elif len(affected_missions) > 0:
            severity = DisruptionSeverity.WARNING

        summary = (
            f"Disruption on '{target_name}' ({disruption.disruption_type.value}, delay: {delay_hours}h) "
            f"directly impacts {len(directly_affected)} entity(ies) and transitively impacts "
            f"{len(transitively_affected)} entity(ies) across {len(affected_missions)} mission(s)."
        )

        return ImpactSet(
            disruption_id=disruption.id,
            target_entity_id=target_id,
            target_entity_name=target_name,
            severity=severity,
            directly_affected=directly_affected,
            transitively_affected=transitively_affected,
            affected_missions=affected_missions,
            broken_prerequisites=broken_prerequisites,
            summary_reason=summary,
        )
