import time
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)


def test_health_check_status_code_and_schema():
    response = client.get("/health")
    assert response.status_code == 200

    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "aurora-backend"
    assert data["mode"] == "deterministic_core_ready"
    assert "timestamp" in data
    assert isinstance(data["timestamp"], (int, float))
    assert data["timestamp"] <= time.time()
