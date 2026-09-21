from typing import List, Dict, Any, Optional
from datetime import datetime
from pydantic import BaseModel

from backend.core.models import Mission, Cargo, Station, Asset, CargoCategory


class ResourceDeficit(BaseModel):
    station_id: str
    station_name: str
    resource_type: str  # "FUEL", "POWER", "RATIONS"
    available_capacity: float
    required_demand: float
    deficit_amount: float
    is_critical_deficit: bool
    description: str


class ScheduleConflict(BaseModel):
    entity_id: str
    entity_name: str
    conflict_type: str  # "TEMPORAL_OVERLAP", "PREREQUISITE_MISMATCH"
    details: str


def evaluate_temporal_overlap(
    start1: datetime, end1: datetime, start2: datetime, end2: datetime
) -> bool:
    """Returns True if time window [start1, end1] overlaps with [start2, end2]."""
    return max(start1, start2) < min(end1, end2)


def evaluate_resource_deficits(
    stations: List[Station],
    active_missions: List[Mission],
    cargos: List[Cargo],
    reserve_margin: float = 0.2,
) -> List[ResourceDeficit]:
    """
    Evaluates resource supply vs. demand deterministically across stations.
    Returns list of calculated ResourceDeficit objects.
    """
    deficits: List[ResourceDeficit] = []

    for station in stations:
        # Filter missions linked to this station
        station_missions = [m for m in active_missions if m.station_id == station.id]

        # Fuel evaluation
        # Calculate fuel demand from missions or minimum reserve thresholds
        current_fuel = station.current_fuel_liters
        fuel_reserve = station.capacity_fuel_liters * reserve_margin

        if current_fuel < fuel_reserve:
            deficit_amount = fuel_reserve - current_fuel
            deficits.append(
                ResourceDeficit(
                    station_id=station.id,
                    station_name=station.name,
                    resource_type="FUEL",
                    available_capacity=current_fuel,
                    required_demand=fuel_reserve,
                    deficit_amount=deficit_amount,
                    is_critical_deficit=current_fuel < (fuel_reserve * 0.5),
                    description=(
                        f"{station.name} fuel level ({current_fuel:.1f}L) is below "
                        f"safety reserve threshold ({fuel_reserve:.1f}L). Deficit: {deficit_amount:.1f}L."
                    ),
                )
            )

        # Power evaluation
        current_power = station.current_power_kw
        power_reserve = station.capacity_power_kw * 0.1  # 10% safety margin

        if current_power < power_reserve:
            deficit_amount = power_reserve - current_power
            deficits.append(
                ResourceDeficit(
                    station_id=station.id,
                    station_name=station.name,
                    resource_type="POWER",
                    available_capacity=current_power,
                    required_demand=power_reserve,
                    deficit_amount=deficit_amount,
                    is_critical_deficit=current_power <= 0.0,
                    description=(
                        f"{station.name} available power ({current_power:.1f}kW) is below "
                        f"minimum reserve threshold ({power_reserve:.1f}kW). Deficit: {deficit_amount:.1f}kW."
                    ),
                )
            )

    return deficits
