import pytest
from datetime import datetime, timezone
from sqlmodel import Session, create_engine, SQLModel, select
from pydantic import ValidationError

from backend.core.models import (
    Station,
    Mission,
    Cargo,
    Asset,
    Personnel,
    Dependency,
    Disruption,
    Recommendation,
    ApprovalAudit,
    PriorityLevel,
    MissionStatus,
    CargoCategory,
    CargoStatus,
    AssetCategory,
    AssetStatus,
    PersonnelRole,
    DependencyType,
    DisruptionType,
    DisruptionSeverity,
    ProposalStatus,
    ApprovalAction,
)
from backend.persistence.seed import seed_database, STATION_ALPHA_ID, MISSION_DEEP_FREEZE_ID, CARGO_FUEL_01_ID


@pytest.fixture(name="session")
def session_fixture():
    engine = create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False})
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session


def test_database_initialization_and_seed_counts(session: Session):
    counts = seed_database(session)

    assert counts["stations"] >= 3
    assert counts["missions"] >= 5
    assert counts["cargo"] >= 10
    assert counts["assets"] >= 4
    assert counts["personnel"] >= 8
    assert counts["dependencies"] >= 4
    assert counts["disruptions"] >= 1


def test_relationships_and_foreign_keys(session: Session):
    seed_database(session)

    # Fetch Station Alpha and verify linked missions and personnel
    station = session.exec(select(Station).where(Station.id == STATION_ALPHA_ID)).first()
    assert station is not None
    assert station.name == "Outpost Alpha (Main Base)"
    assert len(station.missions) > 0
    assert len(station.personnel) > 0

    # Fetch Mission Deep Freeze and verify assigned assets
    mission = session.exec(select(Mission).where(Mission.id == MISSION_DEEP_FREEZE_ID)).first()
    assert mission is not None
    assert mission.title.startswith("Operation Deep Freeze")
    assert len(mission.assigned_assets) > 0
    assert mission.assigned_assets[0].name.startswith("Snowcat")


def test_crud_operations(session: Session):
    # Create
    new_station = Station(
        name="Test Outpost Delta",
        location="Lat: -80.00, Long: 0.00",
        capacity_fuel_liters=5000.0,
        current_fuel_liters=5000.0,
    )
    session.add(new_station)
    session.commit()
    session.refresh(new_station)

    station_id = new_station.id
    assert station_id is not None

    # Read
    retrieved = session.exec(select(Station).where(Station.id == station_id)).first()
    assert retrieved is not None
    assert retrieved.name == "Test Outpost Delta"

    # Update
    retrieved.current_fuel_liters = 3000.0
    session.add(retrieved)
    session.commit()

    updated = session.exec(select(Station).where(Station.id == station_id)).first()
    assert updated.current_fuel_liters == 3000.0

    # Delete
    session.delete(updated)
    session.commit()

    deleted = session.exec(select(Station).where(Station.id == station_id)).first()
    assert deleted is None


def test_domain_enum_and_required_field_constraints():
    # Invalid Enum value raises ValidationError during Pydantic schema validation
    with pytest.raises(ValidationError):
        Cargo.model_validate({
            "item_name": "Invalid Cargo",
            "category": "INVALID_CATEGORY_NAME",
            "quantity": 100.0,
            "estimated_arrival_time": datetime.now(timezone.utc).isoformat(),
        })


def test_repeatable_seeding_does_not_corrupt_database(session: Session):
    counts1 = seed_database(session)
    counts2 = seed_database(session)

    assert counts1 == counts2
    total_stations = len(session.exec(select(Station)).all())
    assert total_stations == 3
