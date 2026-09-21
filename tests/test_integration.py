import pytest
from datetime import datetime, timezone, timedelta
from fastapi.testclient import TestClient
from sqlmodel import Session, create_engine, SQLModel
from sqlalchemy.pool import StaticPool

from backend.main import app
from backend.persistence.database import get_session
from backend.persistence.seed import seed_database, CARGO_FUEL_01_ID, MISSION_DEEP_FREEZE_ID, MISSION_GLACIAL_SURVEY_ID
from backend.core.models import Cargo, CargoStatus


def test_canonical_cargo_delay_e2e_integration():
    """
    End-to-End Backend Integration Test:
    HTTP POST disruption -> FastAPI route -> Application Layer -> Deterministic GraphSolver -> SQLite persistence -> HTTP ImpactSet Response
    """
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
        # 1. Ingest disruption via HTTP POST /api/v1/disruptions
        payload = {
            "entity_id": CARGO_FUEL_01_ID,
            "entity_type": "CARGO",
            "disruption_type": "CARGO_DELAY",
            "delay_hours": 24.0,
            "severity": "CRITICAL",
            "description": "Blizzard delay on coastal supply ship",
        }
        res = client.post("/api/v1/disruptions", json=payload)
        assert res.status_code == 201
        impact_set = res.json()

        # 2. Verify deterministic impact output structure
        assert impact_set["target_entity_id"] == CARGO_FUEL_01_ID
        assert impact_set["severity"] == "CRITICAL"

        # Direct impact check
        direct_entity_ids = [item["entity_id"] for item in impact_set["directly_affected"]]
        assert MISSION_DEEP_FREEZE_ID in direct_entity_ids

        # Transitive impact check
        transitive_entity_ids = [item["entity_id"] for item in impact_set["transitively_affected"]]
        assert MISSION_GLACIAL_SURVEY_ID in transitive_entity_ids

        # 3. Verify state persistence in SQLite
        with Session(engine) as db_session:
            cargo = db_session.get(Cargo, CARGO_FUEL_01_ID)
            assert cargo is not None
            assert cargo.delay_hours == 24.0
            assert cargo.status == CargoStatus.DELAYED

    app.dependency_overrides.clear()
