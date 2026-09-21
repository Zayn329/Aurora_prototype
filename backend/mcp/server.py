import json
from typing import Dict, Any, List, Optional
from fastmcp import FastMCP
from sqlmodel import Session, select

from backend.persistence.database import engine
from backend.core.models import Station, Mission, Cargo, Asset, Personnel, Dependency, Disruption, Recommendation, ProposalStatus
from backend.core.graph_solver import GraphSolver
from backend.rag.retriever import SOPRetriever

mcp = FastMCP("Aurora Command Tool Gateway")


def _get_operational_state_impl(session: Optional[Session] = None) -> str:
    close_at_end = False
    if session is None:
        session = Session(engine)
        close_at_end = True

    try:
        stations = session.exec(select(Station)).all()
        missions = session.exec(select(Mission)).all()
        cargo = session.exec(select(Cargo)).all()
        assets = session.exec(select(Asset)).all()

        state = {
            "stations_count": len(stations),
            "missions": [m.model_dump() for m in missions],
            "cargo_items": [c.model_dump() for c in cargo],
            "assets": [a.model_dump() for a in assets],
        }
        return json.dumps(state, default=str)
    finally:
        if close_at_end:
            session.close()


@mcp.tool()
def get_operational_state() -> str:
    """Read-only tool: Returns current snapshot of all active polar stations, missions, cargo, and assets."""
    return _get_operational_state_impl()


def _analyze_disruption_impact_impl(disruption_id: str, session: Optional[Session] = None) -> str:
    close_at_end = False
    if session is None:
        session = Session(engine)
        close_at_end = True

    try:
        disruption = session.get(Disruption, disruption_id)
        if not disruption:
            return json.dumps({"error": f"Disruption with ID '{disruption_id}' not found."})

        entities = {}
        for model in [Station, Mission, Cargo, Asset, Personnel]:
            for item in session.exec(select(model)).all():
                entities[item.id] = item

        dependencies = session.exec(select(Dependency)).all()

        solver = GraphSolver(dependencies, entities)
        impact_set = solver.analyze_disruption(disruption)
        return impact_set.model_dump_json()
    finally:
        if close_at_end:
            session.close()


@mcp.tool()
def analyze_disruption_impact(disruption_id: str) -> str:
    """Read-only tool: Calls Phase 2 NetworkX GraphSolver to compute deterministic impact for a disruption incident."""
    return _analyze_disruption_impact_impl(disruption_id)


def _check_cargo_dependencies_impl(cargo_id: str, session: Optional[Session] = None) -> str:
    close_at_end = False
    if session is None:
        session = Session(engine)
        close_at_end = True

    try:
        cargo = session.get(Cargo, cargo_id)
        if not cargo:
            return json.dumps({"error": f"Cargo with ID '{cargo_id}' not found."})

        deps = session.exec(
            select(Dependency).where(
                (Dependency.source_id == cargo_id) | (Dependency.target_id == cargo_id)
            )
        ).all()

        result = {
            "cargo_id": cargo.id,
            "cargo_name": cargo.item_name,
            "status": cargo.status,
            "delay_hours": cargo.delay_hours,
            "dependencies": [d.model_dump() for d in deps],
        }
        return json.dumps(result, default=str)
    finally:
        if close_at_end:
            session.close()


@mcp.tool()
def check_cargo_dependencies(cargo_id: str) -> str:
    """Read-only tool: Queries dependency links and dependent missions for a specific cargo GUID."""
    return _check_cargo_dependencies_impl(cargo_id)


@mcp.tool()
def search_expedition_sops(query: str, top_k: int = 3) -> str:
    """Read-only tool: Performs vector search over indexed expedition SOPs and returns grounded citations."""
    retriever = SOPRetriever()
    result = retriever.search_sops(query, top_k=top_k)
    return result.model_dump_json()


def _propose_mission_reschedule_impl(
    agent_name: str,
    mission_id: str,
    proposed_start_time: str,
    proposed_end_time: str,
    rationale: str,
    rag_citations: List[Dict[str, Any]] = [],
    session: Optional[Session] = None,
) -> str:
    close_at_end = False
    if session is None:
        session = Session(engine)
        close_at_end = True

    try:
        proposed_action = {
            "action_type": "RESCHEDULE_MISSION",
            "mission_id": mission_id,
            "proposed_start_time": proposed_start_time,
            "proposed_end_time": proposed_end_time,
        }

        recommendation = Recommendation(
            agent_name=agent_name,
            proposed_action_json=json.dumps(proposed_action),
            rag_citations_json=json.dumps(rag_citations),
            rationale=rationale,
            status=ProposalStatus.PENDING_APPROVAL,
        )

        session.add(recommendation)
        session.commit()
        session.refresh(recommendation)

        return json.dumps({
            "status": "PROPOSAL_CREATED",
            "recommendation_id": recommendation.id,
            "message": "Reschedule proposal created and routed to Pending Commander Approval queue. Operational state unchanged until explicit human approval.",
        })
    finally:
        if close_at_end:
            session.close()


@mcp.tool()
def propose_mission_reschedule(
    agent_name: str,
    mission_id: str,
    proposed_start_time: str,
    proposed_end_time: str,
    rationale: str,
    rag_citations: List[Dict[str, Any]] = [],
) -> str:
    """
    STATE-MUTATING GATEWAY TOOL:
    Generates a pending Recommendation proposal for human commander review.
    STRICTLY ENFORCES HITL: Does NOT mutate SQLite mission state directly.
    """
    return _propose_mission_reschedule_impl(
        agent_name, mission_id, proposed_start_time, proposed_end_time, rationale, rag_citations
    )
