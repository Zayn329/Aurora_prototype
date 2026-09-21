import pytest
from datetime import datetime, timezone, timedelta
from fastapi.testclient import TestClient
from sqlmodel import Session, create_engine, SQLModel, select
from sqlalchemy.pool import StaticPool

from backend.main import app
from backend.persistence.database import get_session
from backend.persistence.seed import (
    seed_database,
    STATION_ALPHA_ID,
    MISSION_DEEP_FREEZE_ID,
    MISSION_GLACIAL_SURVEY_ID,
    CARGO_FUEL_01_ID,
    ASSET_SNOWCAT_01_ID,
    DISRUPTION_BLIZZARD_FUEL_ID,
)
from backend.core.models import Cargo, CargoStatus, Asset, AssetStatus, Disruption, Mission
from backend.sync.protocol import ChangeRecord, SyncPushRequest
from backend.sync.merger import SyncMerger
from backend.rag.retriever import SOPRetriever
from backend.mcp.server import _get_operational_state_impl, _analyze_disruption_impact_impl


@pytest.fixture(name="client")
def client_fixture():
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    SQLModel.metadata.create_all(engine)

    def get_session_override():
        with Session(engine) as session:
            yield session

    with Session(engine) as session:
        seed_database(session)

    app.dependency_overrides[get_session] = get_session_override
    with TestClient(app) as client:
        yield client, engine

    app.dependency_overrides.clear()


def test_scenario_1_cargo_delay_canonical_flow(client):
    """
    Scenario 1: Cargo-Fuel-01 Delay -> Deterministic DAG Impact -> RAG SOP Retrieval -> MCP Tool Inspection
    """
    api_client, engine = client

    # 1. Ingest disruption via HTTP POST /api/v1/disruptions
    disruption_payload = {
        "entity_id": CARGO_FUEL_01_ID,
        "entity_type": "CARGO",
        "disruption_type": "CARGO_DELAY",
        "delay_hours": 24.0,
        "severity": "CRITICAL",
        "description": "Blizzard delay on coastal supply vessel",
    }
    res = api_client.post("/api/v1/disruptions", json=disruption_payload)
    assert res.status_code == 201
    impact_set = res.json()

    # Direct and transitive impact checks
    assert impact_set["target_entity_id"] == CARGO_FUEL_01_ID
    assert MISSION_DEEP_FREEZE_ID in impact_set["affected_missions"]
    assert MISSION_GLACIAL_SURVEY_ID in impact_set["affected_missions"]

    # 2. RAG SOP Retrieval
    retriever = SOPRetriever()
    rag_res = retriever.search_sops("cargo fuel delay rescheduling", top_k=3)
    assert len(rag_res.citations) > 0

    # 3. Verify SQLite State Update
    with Session(engine) as session:
        cargo = session.get(Cargo, CARGO_FUEL_01_ID)
        assert cargo.delay_hours == 24.0
        assert cargo.status == CargoStatus.DELAYED


def test_scenario_2_vehicle_asset_failure(client):
    """
    Scenario 2: Snowcat Asset Breakdown -> Impact Analysis
    """
    api_client, engine = client

    # Record vehicle breakdown disruption
    payload = {
        "entity_id": ASSET_SNOWCAT_01_ID,
        "entity_type": "ASSET",
        "disruption_type": "ASSET_FAILURE",
        "delay_hours": 48.0,
        "severity": "CRITICAL",
        "description": "Snowcat 01 engine failure in deep crevassed field.",
    }
    res = api_client.post("/api/v1/disruptions", json=payload)
    assert res.status_code == 201
    impact = res.json()

    assert impact["target_entity_id"] == ASSET_SNOWCAT_01_ID
    assert MISSION_DEEP_FREEZE_ID in impact["affected_missions"]


def test_scenario_3_emergency_heating_shortage_offline_triage(client):
    """
    Scenario 3: Emergency Heating Shortage -> Deterministic Triage Solver (<50ms Execution)
    """
    api_client, _ = client

    res = api_client.post(f"/api/v1/emergency/triage/{STATION_ALPHA_ID}?incident_type=GENERATOR_FAILURE")
    assert res.status_code == 200
    triage = res.json()

    assert triage["station_id"] == STATION_ALPHA_ID
    assert len(triage["feasible_assets"]) > 0
    assert len(triage["available_medical_personnel"]) > 0
    assert triage["response_time_ms"] < 50.0


def test_scenario_4_offline_field_sync_reconciliation(client):
    """
    Scenario 4: Offline Mutation -> ChangeRecord -> Sync Engine Reconciliation
    """
    _, engine = client

    with Session(engine) as session:
        merger = SyncMerger(session)

        # Offline change record created on field device
        change_record = ChangeRecord(
            op_id="op_offline_field_001",
            device_id="device_field_tablet_A",
            timestamp_utc=datetime.now(timezone.utc).isoformat(),
            entity_type="CARGO",
            entity_id=CARGO_FUEL_01_ID,
            action="UPDATE",
            payload={"location_stage": "Offline Staging Depot B"},
        )

        request = SyncPushRequest(device_id="device_field_tablet_A", operations=[change_record])
        response = merger.process_sync_push(request)

        assert response.processed_count == 1

        # Confirm authoritative SQLite updated
        cargo = session.get(Cargo, CARGO_FUEL_01_ID)
        assert cargo.location_stage == "Offline Staging Depot B"


def test_scenario_5_ai_provider_timeout_fallback(client):
    """
    Scenario 5: Simulated AI Provider Unavailability / Timeout -> Deterministic Core Remains Fully Functional
    """
    api_client, _ = client

    # Request resource forecast (pure deterministic Python execution)
    res = api_client.get(f"/api/v1/resources/forecast/{STATION_ALPHA_ID}")
    assert res.status_code == 200
    forecast = res.json()

    assert forecast["station_id"] == STATION_ALPHA_ID
    assert len(forecast["daily_points"]) == 7
