import pytest
from datetime import datetime, timezone
from sqlmodel import Session, create_engine, SQLModel, select

from backend.core.models import Cargo, CargoStatus
from backend.sync.protocol import ChangeRecord, SyncPushRequest
from backend.sync.merger import SyncMerger
from backend.persistence.seed import seed_database, CARGO_FUEL_01_ID


@pytest.fixture(name="session")
def session_fixture():
    engine = create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False})
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        seed_database(session)
        yield session


def test_sync_push_idempotent_deduplication(session: Session):
    merger = SyncMerger(session)

    change_record = ChangeRecord(
        op_id="op_unique_12345",
        device_id="device_alpha",
        timestamp_utc=datetime.now(timezone.utc).isoformat(),
        entity_type="CARGO",
        entity_id=CARGO_FUEL_01_ID,
        action="UPDATE",
        payload={"delay_hours": 36.0, "status": "DELAYED"},
    )

    request = SyncPushRequest(device_id="device_alpha", operations=[change_record])

    # First push: should process mutation
    res1 = merger.process_sync_push(request)
    assert res1.processed_count == 1
    assert res1.ignored_count == 0

    # Verify SQLite update
    cargo = session.get(Cargo, CARGO_FUEL_01_ID)
    assert cargo.delay_hours == 36.0

    # Second push with identical op_id: should ignore duplicate safely
    res2 = merger.process_sync_push(request)
    assert res2.processed_count == 0
    assert res2.ignored_count == 1


def test_multi_device_lww_convergence(session: Session):
    merger = SyncMerger(session)

    # Device A operation at T1
    op_device_a = ChangeRecord(
        op_id="op_device_a_001",
        device_id="device_A",
        timestamp_utc="2026-09-21T01:00:00Z",
        entity_type="CARGO",
        entity_id=CARGO_FUEL_01_ID,
        action="UPDATE",
        payload={"location_stage": "Staging Yard Device A"},
    )

    # Device B operation at T2 (Later timestamp)
    op_device_b = ChangeRecord(
        op_id="op_device_b_002",
        device_id="device_B",
        timestamp_utc="2026-09-21T02:00:00Z",
        entity_type="CARGO",
        entity_id=CARGO_FUEL_01_ID,
        action="UPDATE",
        payload={"location_stage": "Coastal Vessel Device B"},
    )

    # Push in reverse order (B first, then A)
    request_b = SyncPushRequest(device_id="device_B", operations=[op_device_b])
    request_a = SyncPushRequest(device_id="device_A", operations=[op_device_a])

    merger.process_sync_push(request_b)
    merger.process_sync_push(request_a)

    # Reconciles via timestamp ordering (Device B timestamp is later)
    cargo = session.get(Cargo, CARGO_FUEL_01_ID)
    assert cargo.location_stage == "Coastal Vessel Device B"
