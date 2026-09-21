import pytest
from datetime import datetime, timezone
from sqlmodel import Session, create_engine, SQLModel, select

from backend.core.models import (
    Station,
    Mission,
    Cargo,
    Asset,
    Personnel,
    Dependency,
    Disruption,
    PriorityLevel,
    MissionStatus,
    CargoCategory,
    CargoStatus,
    AssetCategory,
    AssetStatus,
    DependencyType,
    DisruptionType,
    DisruptionSeverity,
)
from backend.core.exceptions import (
    CyclicDependencyError,
    SelfDependencyError,
    InvalidDisruptionError,
)
from backend.core.graph_solver import GraphSolver, ImpactSet
from backend.persistence.seed import (
    seed_database,
    CARGO_FUEL_01_ID,
    MISSION_DEEP_FREEZE_ID,
    MISSION_GLACIAL_SURVEY_ID,
    DISRUPTION_BLIZZARD_FUEL_ID,
)


@pytest.fixture(name="seeded_state")
def seeded_state_fixture():
    engine = create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False})
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        seed_database(session)

        # Collect entities as Dict[entity_id, obj]
        entities = {}
        for m in [Station, Mission, Cargo, Asset, Personnel]:
            for item in session.exec(select(m)).all():
                entities[item.id] = item

        deps = session.exec(select(Dependency)).all()
        disruptions = session.exec(select(Disruption)).all()
        yield session, entities, deps, disruptions


def test_basic_and_transitive_dependency_traversal(seeded_state):
    session, entities, deps, disruptions = seeded_state

    solver = GraphSolver(deps, entities)

    disruption = session.exec(select(Disruption).where(Disruption.id == DISRUPTION_BLIZZARD_FUEL_ID)).first()
    impact_set = solver.analyze_disruption(disruption)

    # 1. Direct impact: Operation Deep Freeze depends directly on Cargo-Fuel-01
    direct_ids = [item.entity_id for item in impact_set.directly_affected]
    assert MISSION_DEEP_FREEZE_ID in direct_ids

    # 2. Transitive impact: Glacial Survey Beta depends on Operation Deep Freeze
    transitive_ids = [item.entity_id for item in impact_set.transitively_affected]
    assert MISSION_GLACIAL_SURVEY_ID in transitive_ids

    # 3. Affected missions list
    assert MISSION_DEEP_FREEZE_ID in impact_set.affected_missions
    assert MISSION_GLACIAL_SURVEY_ID in impact_set.affected_missions

    # 4. Severity
    assert impact_set.severity == DisruptionSeverity.CRITICAL


def test_deterministic_reproducibility(seeded_state):
    session, entities, deps, disruptions = seeded_state
    disruption = session.exec(select(Disruption).where(Disruption.id == DISRUPTION_BLIZZARD_FUEL_ID)).first()

    solver = GraphSolver(deps, entities)

    # Run analysis 20 times and assert identical outputs
    first_result = solver.analyze_disruption(disruption).model_dump_json()

    for _ in range(20):
        new_solver = GraphSolver(deps, entities)
        res = new_solver.analyze_disruption(disruption).model_dump_json()
        assert res == first_result


def test_cycle_prevention(seeded_state):
    session, entities, deps, disruptions = seeded_state

    solver = GraphSolver(deps, entities)

    # Attempting to add a dependency that creates a cycle: Glacial Survey Beta -> Cargo-Fuel-01
    # Existing chain: Cargo-Fuel-01 -> Mission Deep Freeze -> Glacial Survey Beta
    with pytest.raises(CyclicDependencyError) as exc_info:
        solver.validate_new_dependency(
            source_id=MISSION_GLACIAL_SURVEY_ID,
            target_id=CARGO_FUEL_01_ID,
        )

    assert "Cyclic dependency detected" in str(exc_info.value)


def test_self_dependency_rejection(seeded_state):
    session, entities, deps, disruptions = seeded_state
    solver = GraphSolver(deps, entities)

    with pytest.raises(SelfDependencyError):
        solver.validate_new_dependency(
            source_id=MISSION_DEEP_FREEZE_ID,
            target_id=MISSION_DEEP_FREEZE_ID,
        )


def test_invalid_disruption_target(seeded_state):
    session, entities, deps, disruptions = seeded_state
    solver = GraphSolver(deps, entities)

    invalid_disruption = Disruption(
        entity_id="nonexistent-id-9999",
        entity_type="CARGO",
        disruption_type=DisruptionType.CARGO_DELAY,
        delay_hours=12.0,
        description="Fake disruption",
    )

    with pytest.raises(InvalidDisruptionError):
        solver.analyze_disruption(invalid_disruption)


def test_no_false_propagation():
    # Build isolated graph with isolated nodes X -> Y and unrelated node Z
    now = datetime.now(timezone.utc)
    c_x = Cargo(id="cargo-x", item_name="Cargo X", category=CargoCategory.FUEL, estimated_arrival_time=now)
    m_y = Mission(id="mission-y", title="Mission Y", objective="Obj Y", planned_start_time=now, planned_end_time=now)
    m_z = Mission(id="mission-z", title="Mission Z (Unrelated)", objective="Obj Z", planned_start_time=now, planned_end_time=now)

    entities = {"cargo-x": c_x, "mission-y": m_y, "mission-z": m_z}
    deps = [
        Dependency(id="d1", source_type="CARGO", source_id="cargo-x", target_type="MISSION", target_id="mission-y", dependency_type=DependencyType.REQUIRED_CARGO)
    ]

    solver = GraphSolver(deps, entities)
    disruption = Disruption(id="disp-x", entity_type="CARGO", entity_id="cargo-x", disruption_type=DisruptionType.CARGO_DELAY, delay_hours=10.0, description="Delay X")

    impact_set = solver.analyze_disruption(disruption)

    affected_ids = [item.entity_id for item in impact_set.directly_affected + impact_set.transitively_affected]
    assert "mission-y" in affected_ids
    assert "mission-z" not in affected_ids
