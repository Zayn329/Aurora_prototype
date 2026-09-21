from typing import List, Dict, Any, Optional
from datetime import datetime, timezone, timedelta
from pydantic import BaseModel

from backend.core.models import Mission, Cargo, Station, Asset, Personnel, AssetStatus, PersonnelRole, CargoCategory


class ResourceDeficit(BaseModel):
    station_id: str
    station_name: str
    resource_type: str  # "FUEL", "POWER", "RATIONS"
    available_capacity: float
    required_demand: float
    deficit_amount: float
    is_critical_deficit: bool
    description: str


class ResourceForecastPoint(BaseModel):
    date_utc: str
    station_id: str
    station_name: str
    projected_fuel_liters: float
    projected_power_kw: float
    projected_rations_daily: float
    is_deficit_projected: bool


class Resource7DayForecast(BaseModel):
    station_id: str
    station_name: str
    forecast_horizon_days: int = 7
    daily_points: List[ResourceForecastPoint]
    total_deficits_detected: int


class EmergencyAssetOption(BaseModel):
    asset_id: str
    asset_name: str
    category: str
    status: str
    location: str
    fuel_range_km: float
    estimated_dispatch_time_mins: int
    feasibility_score: float  # 0.0 to 1.0


class EmergencyPersonnelOption(BaseModel):
    personnel_id: str
    personnel_name: str
    role: str
    station_id: str
    availability_status: str


class EmergencyBaselineTriageResult(BaseModel):
    incident_type: str
    station_id: str
    station_name: str
    feasible_assets: List[EmergencyAssetOption]
    available_medical_personnel: List[EmergencyPersonnelOption]
    response_time_ms: float
    baseline_protocol_note: str


def ensure_utc(dt: datetime) -> datetime:
    """Helper to convert naive datetimes to UTC timezone-aware datetimes for safe comparison."""
    if dt.tzinfo is None:
        return dt.replace(tzinfo=timezone.utc)
    return dt


def evaluate_temporal_overlap(
    start1: datetime, end1: datetime, start2: datetime, end2: datetime
) -> bool:
    """Returns True if time window [start1, end1] overlaps with [start2, end2]."""
    s1, e1 = ensure_utc(start1), ensure_utc(end1)
    s2, e2 = ensure_utc(start2), ensure_utc(end2)
    return max(s1, s2) < min(e1, e2)


def evaluate_resource_deficits(
    stations: List[Station],
    active_missions: List[Mission],
    cargos: List[Cargo],
    reserve_margin: float = 0.2,
) -> List[ResourceDeficit]:
    """Evaluates resource supply vs demand deterministically across stations."""
    deficits: List[ResourceDeficit] = []

    for station in stations:
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

        current_power = station.current_power_kw
        power_reserve = station.capacity_power_kw * 0.1

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


def calculate_7day_resource_forecast(
    station: Station,
    scheduled_missions: List[Mission],
    daily_consumption_fuel: float = 250.0,
) -> Resource7DayForecast:
    """Calculates deterministic 7-day rolling supply/demand forecast for a polar station."""
    start_date = datetime.now(timezone.utc)
    daily_points: List[ResourceForecastPoint] = []
    current_fuel = station.current_fuel_liters
    deficits = 0

    for day in range(7):
        date_point = start_date + timedelta(days=day)

        # Missions active on this forecast day
        day_start = date_point.replace(hour=0, minute=0, second=0, microsecond=0)
        day_end = day_start + timedelta(days=1)

        active_on_day = [
            m for m in scheduled_missions
            if m.station_id == station.id and evaluate_temporal_overlap(m.planned_start_time, m.planned_end_time, day_start, day_end)
        ]

        # Fuel demand increment per active mission
        mission_fuel_demand = len(active_on_day) * 150.0
        total_daily_fuel_demand = daily_consumption_fuel + mission_fuel_demand

        current_fuel = max(0.0, current_fuel - total_daily_fuel_demand)
        is_deficit = current_fuel < (station.capacity_fuel_liters * 0.2)

        if is_deficit:
            deficits += 1

        daily_points.append(
            ResourceForecastPoint(
                date_utc=day_start.strftime("%Y-%m-%d"),
                station_id=station.id,
                station_name=station.name,
                projected_fuel_liters=round(current_fuel, 1),
                projected_power_kw=round(station.current_power_kw, 1),
                projected_rations_daily=300.0,
                is_deficit_projected=is_deficit,
            )
        )

    return Resource7DayForecast(
        station_id=station.id,
        station_name=station.name,
        forecast_horizon_days=7,
        daily_points=daily_points,
        total_deficits_detected=deficits,
    )


def compute_emergency_baseline_triage(
    station: Station,
    all_assets: List[Asset],
    all_personnel: List[Personnel],
    incident_type: str = "POWER_FAILURE",
) -> EmergencyBaselineTriageResult:
    """
    Offline deterministic emergency triage solver.
    Filters nearby operational assets and SAR/medical personnel in <50ms.
    """
    start_time = datetime.now(timezone.utc)

    # Filter operational vehicles and generators
    feasible_assets: List[EmergencyAssetOption] = []
    for asset in all_assets:
        if asset.status == AssetStatus.OPERATIONAL:
            feasibility = 1.0 if asset.fuel_range_km >= 200.0 else 0.7
            feasible_assets.append(
                EmergencyAssetOption(
                    asset_id=asset.id,
                    asset_name=asset.name,
                    category=asset.category.value if hasattr(asset.category, "value") else str(asset.category),
                    status=asset.status.value if hasattr(asset.status, "value") else str(asset.status),
                    location=asset.location,
                    fuel_range_km=asset.fuel_range_km,
                    estimated_dispatch_time_mins=15,
                    feasibility_score=feasibility,
                )
            )

    # Filter available doctors and scouts
    medical_personnel: List[EmergencyPersonnelOption] = []
    for p in all_personnel:
        if p.role in (PersonnelRole.DOCTOR, PersonnelRole.COMMANDER, PersonnelRole.ENGINEER) and p.medical_status == "FIT_FOR_DUTY":
            medical_personnel.append(
                EmergencyPersonnelOption(
                    personnel_id=p.id,
                    personnel_name=p.name,
                    role=p.role.value if hasattr(p.role, "value") else str(p.role),
                    station_id=p.station_id or station.id,
                    availability_status=p.availability_status,
                )
            )

    execution_time_ms = round((datetime.now(timezone.utc) - start_time).total_seconds() * 1000.0, 2)

    note = (
        f"Emergency baseline triage computed offline for {incident_type} at {station.name}. "
        f"Identified {len(feasible_assets)} operational asset(s) and {len(medical_personnel)} key response personnel."
    )

    return EmergencyBaselineTriageResult(
        incident_type=incident_type,
        station_id=station.id,
        station_name=station.name,
        feasible_assets=feasible_assets,
        available_medical_personnel=medical_personnel,
        response_time_ms=execution_time_ms,
        baseline_protocol_note=note,
    )
