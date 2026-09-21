import pytest
from datetime import datetime, timezone, timedelta
from backend.core.models import Station, Mission, Cargo, CargoCategory, MissionStatus, PriorityLevel
from backend.core.constraints import evaluate_temporal_overlap, evaluate_resource_deficits


def test_evaluate_temporal_overlap():
    now = datetime.now(timezone.utc)
    t1_start = now
    t1_end = now + timedelta(hours=5)

    # Overlapping window [now + 2h, now + 7h]
    t2_start = now + timedelta(hours=2)
    t2_end = now + timedelta(hours=7)
    assert evaluate_temporal_overlap(t1_start, t1_end, t2_start, t2_end) is True

    # Non-overlapping window [now + 6h, now + 10h]
    t3_start = now + timedelta(hours=6)
    t3_end = now + timedelta(hours=10)
    assert evaluate_temporal_overlap(t1_start, t1_end, t3_start, t3_end) is False


def test_evaluate_resource_deficits():
    now = datetime.now(timezone.utc)
    station_alpha = Station(
        id="station-a",
        name="Outpost Alpha",
        location="Antarctica",
        capacity_fuel_liters=10000.0,
        current_fuel_liters=1000.0,  # Below 20% reserve (2000.0L)
        capacity_power_kw=500.0,
        current_power_kw=400.0,
    )

    missions = [
        Mission(
            id="m1",
            title="Mission 1",
            objective="Obj",
            station_id="station-a",
            planned_start_time=now,
            planned_end_time=now + timedelta(hours=10),
        )
    ]

    cargos = []

    deficits = evaluate_resource_deficits([station_alpha], missions, cargos, reserve_margin=0.2)

    assert len(deficits) == 1
    assert deficits[0].station_id == "station-a"
    assert deficits[0].resource_type == "FUEL"
    assert deficits[0].deficit_amount == 1000.0  # 2000.0 - 1000.0
