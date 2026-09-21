import pytest
from datetime import datetime, timezone, timedelta
from fastapi.testclient import TestClient
from sqlmodel import Session, create_engine, SQLModel
from sqlalchemy.pool import StaticPool

from backend.main import app
from backend.persistence.database import get_session
from backend.persistence.seed import seed_database, CARGO_FUEL_01_ID, MISSION_DEEP_FREEZE_ID


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

    # Seed test database using the shared engine session
    with Session(engine) as session:
        seed_database(session)

    app.dependency_overrides[get_session] = get_session_override
    with TestClient(app) as client:
        yield client

    app.dependency_overrides.clear()


def test_list_and_get_missions(client: TestClient):
    response = client.get("/api/v1/missions")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 5

    mission_id = data[0]["id"]
    get_res = client.get(f"/api/v1/missions/{mission_id}")
    assert get_res.status_code == 200
    assert get_res.json()["id"] == mission_id


def test_create_and_update_mission(client: TestClient):
    now = datetime.now(timezone.utc)
    create_payload = {
        "title": "New Test Science Mission",
        "objective": "Collect ice cores at outpost",
        "priority": 2,
        "status": "SCHEDULED",
        "planned_start_time": (now + timedelta(hours=10)).isoformat(),
        "planned_end_time": (now + timedelta(hours=30)).isoformat(),
    }
    create_res = client.post("/api/v1/missions", json=create_payload)
    assert create_res.status_code == 201
    created = create_res.json()
    assert created["title"] == "New Test Science Mission"

    mission_id = created["id"]
    update_res = client.put(f"/api/v1/missions/{mission_id}", json={"status": "IN_PROGRESS"})
    assert update_res.status_code == 200
    assert update_res.json()["status"] == "IN_PROGRESS"


def test_list_and_get_cargo(client: TestClient):
    response = client.get("/api/v1/cargo")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 10

    cargo_id = data[0]["id"]
    get_res = client.get(f"/api/v1/cargo/{cargo_id}")
    assert get_res.status_code == 200
    assert get_res.json()["id"] == cargo_id


def test_create_and_update_cargo(client: TestClient):
    now = datetime.now(timezone.utc)
    create_payload = {
        "item_name": "Test Oxygen Tanks",
        "category": "MEDICAL",
        "quantity": 10.0,
        "unit": "tanks",
        "priority_class": 1,
        "status": "STAGED",
        "location_stage": "Infirmary",
        "estimated_arrival_time": (now + timedelta(hours=5)).isoformat(),
    }
    create_res = client.post("/api/v1/cargo", json=create_payload)
    assert create_res.status_code == 201
    created = create_res.json()
    assert created["item_name"] == "Test Oxygen Tanks"

    cargo_id = created["id"]
    update_res = client.put(f"/api/v1/cargo/{cargo_id}", json={"status": "TRANSIT", "quantity": 12.0})
    assert update_res.status_code == 200
    assert update_res.json()["status"] == "TRANSIT"
    assert update_res.json()["quantity"] == 12.0


def test_disruption_impact_analysis_endpoint(client: TestClient):
    payload = {
        "entity_id": CARGO_FUEL_01_ID,
        "entity_type": "CARGO",
        "disruption_type": "CARGO_DELAY",
        "delay_hours": 24.0,
        "severity": "CRITICAL",
        "description": "Blizzard delay on coastal supply ship",
    }
    response = client.post("/api/v1/disruptions", json=payload)
    assert response.status_code == 201
    data = response.json()

    assert data["target_entity_id"] == CARGO_FUEL_01_ID
    assert data["severity"] == "CRITICAL"
    assert MISSION_DEEP_FREEZE_ID in data["affected_missions"]
    assert len(data["directly_affected"]) > 0
    assert len(data["transitively_affected"]) > 0


def test_system_reset_endpoint(client: TestClient):
    reset_res = client.post("/system/reset")
    assert reset_res.status_code == 200
    data = reset_res.json()
    assert data["status"] == "reset_successful"
    assert "counts" in data
