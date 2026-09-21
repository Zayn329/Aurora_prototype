import pytest
import json
from sqlmodel import Session, create_engine, SQLModel

from backend.core.models import (
    Station,
    Mission,
    Cargo,
    Asset,
    Personnel,
    Dependency,
    Disruption,
    Recommendation,
    ProposalStatus,
)
from backend.persistence.seed import seed_database, CARGO_FUEL_01_ID, MISSION_DEEP_FREEZE_ID, DISRUPTION_BLIZZARD_FUEL_ID
from backend.mcp.server import (
    _get_operational_state_impl,
    _analyze_disruption_impact_impl,
    _check_cargo_dependencies_impl,
    search_expedition_sops,
    _propose_mission_reschedule_impl,
)


@pytest.fixture(name="seeded_db")
def seeded_db_fixture():
    engine = create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False})
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        seed_database(session)
        yield session


def test_mcp_read_only_tools(seeded_db: Session):
    # 1. Test get_operational_state tool
    state_json = _get_operational_state_impl(session=seeded_db)
    state_data = json.loads(state_json)
    assert state_data["stations_count"] >= 3
    assert len(state_data["missions"]) >= 5

    # 2. Test check_cargo_dependencies tool
    cargo_deps_json = _check_cargo_dependencies_impl(CARGO_FUEL_01_ID, session=seeded_db)
    cargo_deps = json.loads(cargo_deps_json)
    assert cargo_deps["cargo_id"] == CARGO_FUEL_01_ID
    assert len(cargo_deps["dependencies"]) > 0

    # 3. Test analyze_disruption_impact tool via Phase 2 GraphSolver
    impact_json = _analyze_disruption_impact_impl(DISRUPTION_BLIZZARD_FUEL_ID, session=seeded_db)
    impact_data = json.loads(impact_json)
    assert impact_data["target_entity_id"] == CARGO_FUEL_01_ID
    assert MISSION_DEEP_FREEZE_ID in impact_data["affected_missions"]

    # 4. Test search_expedition_sops tool
    sop_json = search_expedition_sops("fuel contingency delay")
    sop_data = json.loads(sop_json)
    assert len(sop_data["citations"]) > 0


def test_mcp_state_mutating_tool_creates_proposal_without_direct_db_mutation(seeded_db: Session):
    # Execute propose_mission_reschedule tool with active session
    res_json = _propose_mission_reschedule_impl(
        agent_name="Mission Rescheduling Agent",
        mission_id=MISSION_DEEP_FREEZE_ID,
        proposed_start_time="2026-09-22T08:00:00Z",
        proposed_end_time="2026-09-23T08:00:00Z",
        rationale="Shift mission start by 20h due to cargo delay.",
        rag_citations=[{"document": "Fuel_and_Power_Contingency.md", "section": "Section 4.2"}],
        session=seeded_db,
    )

    result = json.loads(res_json)
    assert result["status"] == "PROPOSAL_CREATED"
    assert "recommendation_id" in result

    # Verify that database mission state was NOT mutated directly
    mission = seeded_db.get(Mission, MISSION_DEEP_FREEZE_ID)
    assert mission is not None
    assert mission.status.value == "SCHEDULED"  # Unchanged!

    # Verify proposal is recorded in Recommendation table with PENDING_APPROVAL
    rec = seeded_db.get(Recommendation, result["recommendation_id"])
    assert rec is not None
    assert rec.status == ProposalStatus.PENDING_APPROVAL
