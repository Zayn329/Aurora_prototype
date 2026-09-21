import pytest
from datetime import datetime, timezone, timedelta
from sqlmodel import Session, create_engine, SQLModel, select

from backend.core.models import Station, Mission, Cargo, Asset, Personnel
from backend.core.constraints import (
    calculate_7day_resource_forecast,
    compute_emergency_baseline_triage,
)
from backend.persistence.seed import seed_database, STATION_ALPHA_ID


@pytest.fixture(name="session")
def session_fixture():
    engine = create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False})
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        seed_database(session)
        yield session


def test_7day_rolling_resource_forecast(session: Session):
    station = session.get(Station, STATION_ALPHA_ID)
    missions = session.exec(select(Mission)).all()

    forecast = calculate_7day_resource_forecast(station, missions)

    assert forecast.station_id == STATION_ALPHA_ID
    assert forecast.forecast_horizon_days == 7
    assert len(forecast.daily_points) == 7
    assert forecast.daily_points[0].projected_fuel_liters < station.current_fuel_liters


def test_emergency_baseline_triage_solver_offline(session: Session):
    station = session.get(Station, STATION_ALPHA_ID)
    assets = session.exec(select(Asset)).all()
    personnel = session.exec(select(Personnel)).all()

    triage = compute_emergency_baseline_triage(station, assets, personnel, incident_type="GENERATOR_OFFLINE")

    assert triage.station_id == STATION_ALPHA_ID
    assert triage.incident_type == "GENERATOR_OFFLINE"
    assert len(triage.feasible_assets) > 0
    assert len(triage.available_medical_personnel) > 0
    assert triage.response_time_ms < 50.0  # Must execute in <50ms offline
