from typing import List, Dict, Any, Optional
from datetime import datetime, timezone, timedelta
from pydantic import BaseModel

from backend.core.models import Mission, Cargo, Station, Asset, Personnel, AssetStatus, PersonnelRole, CargoCategory, CargoStatus


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


# --- New Additional Intelligence Schemas ---

class MissionRiskAssessment(BaseModel):
    mission_id: str
    mission_title: str
    risk_level: str  # "LOW", "MEDIUM", "HIGH", "CRITICAL"
    primary_risk_factor: str
    contributing_factors: List[str]
    disrupted_dependencies_count: int


class ChecklistItem(BaseModel):
    check: str
    status: str  # "PASS", "WARNING", "BLOCKED"
    reason: str
    severity: str  # "INFO", "WARNING", "CRITICAL"


class MissionReadinessReport(BaseModel):
    mission_id: str
    mission_title: str
    readiness_percentage: float
    blockers_count: int
    warnings_count: int
    checklist: List[ChecklistItem]


class EquipmentCompatibilityResult(BaseModel):
    asset_id: str
    asset_name: str
    is_compatible: bool
    status: str  # "COMPATIBLE", "WARNING", "INCOMPATIBLE"
    reason: str
    recommended_asset_name: Optional[str] = None


class CargoLoadRecommendation(BaseModel):
    cargo_id: str
    cargo_name: str
    priority_class: int
    weight_kg: float
    recommendation: str  # "LOAD_CRITICAL", "LOAD_SECONDARY", "DEFER"


class SmartCargoLoadPlan(BaseModel):
    vehicle_asset_id: str
    vehicle_name: str
    payload_capacity_kg: float
    total_loaded_weight_kg: float
    remaining_capacity_kg: float
    recommendations: List[CargoLoadRecommendation]


class PersonnelPreDeploymentCheck(BaseModel):
    personnel_id: str
    personnel_name: str
    is_fit_for_duty: bool
    is_available: bool
    is_ready: bool
    notes: str


# --- Core Helper Functions ---

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

        day_start = date_point.replace(hour=0, minute=0, second=0, microsecond=0)
        day_end = day_start + timedelta(days=1)

        active_on_day = [
            m for m in scheduled_missions
            if m.station_id == station.id and evaluate_temporal_overlap(m.planned_start_time, m.planned_end_time, day_start, day_end)
        ]

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


# --- New Additional Deterministic Intelligence Logic ---

def calculate_mission_risk_score(
    mission: Mission,
    is_directly_impacted: bool,
    is_transitively_impacted: bool,
    cargo_delays_count: int,
    assigned_assets: List[Asset],
) -> MissionRiskAssessment:
    """Calculates deterministic risk level and factors for a mission."""
    factors = []
    disrupted_deps = 0

    if is_directly_impacted:
        factors.append("Direct cargo/logistics dependency delayed")
        disrupted_deps += 1

    if is_transitively_impacted:
        factors.append("Transitive dependency chain disruption detected")
        disrupted_deps += 1

    if cargo_delays_count > 0:
        factors.append(f"{cargo_delays_count} required cargo items currently delayed")

    # Asset health check
    for a in assigned_assets:
        if a.status != AssetStatus.OPERATIONAL:
            factors.append(f"Assigned asset {a.name} is in {a.status.value} state")

    if is_directly_impacted or cargo_delays_count > 1:
        level = "CRITICAL" if cargo_delays_count > 2 else "HIGH"
        primary = "Logistics supply chain disruption"
    elif is_transitively_impacted:
        level = "MEDIUM"
        primary = "Downstream dependency delay"
    else:
        level = "LOW"
        primary = "Operational constraints satisfied"
        factors.append("All primary dependencies on schedule")

    return MissionRiskAssessment(
        mission_id=mission.id,
        mission_title=mission.title,
        risk_level=level,
        primary_risk_factor=primary,
        contributing_factors=factors,
        disrupted_dependencies_count=disrupted_deps,
    )


def evaluate_mission_readiness_checklist(
    mission: Mission,
    is_impacted: bool,
    station: Optional[Station],
    cargo_items: List[Cargo],
    assigned_assets: List[Asset],
    station_personnel: List[Personnel],
) -> MissionReadinessReport:
    """Evaluates pre-departure readiness checklist deterministically."""
    checklist: List[ChecklistItem] = []
    blockers = 0
    warnings = 0

    # 1. Cargo dependency check
    delayed_cargos = [c for c in cargo_items if c.status == CargoStatus.DELAYED]
    if delayed_cargos:
        checklist.append(
            ChecklistItem(
                check="Logistics & Cargo Delivery",
                status="BLOCKED",
                reason=f"{len(delayed_cargos)} assigned cargo item(s) delayed",
                severity="CRITICAL",
            )
        )
        blockers += 1
    else:
        checklist.append(
            ChecklistItem(
                check="Logistics & Cargo Delivery",
                status="PASS",
                reason="All assigned cargo delivered / staged at base",
                severity="INFO",
            )
        )

    # 2. Fuel reserve check
    if station:
        if station.current_fuel_liters < (station.capacity_fuel_liters * 0.2):
            checklist.append(
                ChecklistItem(
                    check="Base Fuel Reserve Level",
                    status="WARNING",
                    reason=f"Station fuel level ({station.current_fuel_liters:.0f}L) below 20% safety threshold",
                    severity="WARNING",
                )
            )
            warnings += 1
        else:
            checklist.append(
                ChecklistItem(
                    check="Base Fuel Reserve Level",
                    status="PASS",
                    reason=f"Fuel level ({station.current_fuel_liters:.0f}L) satisfies departure margin",
                    severity="INFO",
                )
            )

    # 3. Asset availability check
    offline_assets = [a for a in assigned_assets if a.status != AssetStatus.OPERATIONAL]
    if offline_assets:
        checklist.append(
            ChecklistItem(
                check="Assigned Asset Operational Status",
                status="BLOCKED",
                reason=f"{len(offline_assets)} assigned asset(s) currently offline/damaged",
                severity="CRITICAL",
            )
        )
        blockers += 1
    else:
        checklist.append(
            ChecklistItem(
                check="Assigned Asset Operational Status",
                status="PASS",
                reason="All assigned vehicles and generators fully operational",
                severity="INFO",
            )
        )

    # 4. Personnel fitness check
    fit_personnel = [p for p in station_personnel if p.medical_status == "FIT_FOR_DUTY"]
    if len(fit_personnel) < 2:
        checklist.append(
            ChecklistItem(
                check="Station Personnel Readiness",
                status="WARNING",
                reason="Fewer than 2 fit specialist personnel available on station",
                severity="WARNING",
            )
        )
        warnings += 1
    else:
        checklist.append(
            ChecklistItem(
                check="Station Personnel Readiness",
                status="PASS",
                reason=f"{len(fit_personnel)} fit specialists available on station",
                severity="INFO",
            )
        )

    # Score calculation
    total_checks = len(checklist)
    passed_checks = sum(1 for c in checklist if c.status == "PASS")
    score = round((passed_checks / max(1, total_checks)) * 100.0, 1)

    return MissionReadinessReport(
        mission_id=mission.id,
        mission_title=mission.title,
        readiness_percentage=score,
        blockers_count=blockers,
        warnings_count=warnings,
        checklist=checklist,
    )


def check_equipment_compatibility(
    asset: Asset,
    ambient_temp_celsius: float = -40.0,
) -> EquipmentCompatibilityResult:
    """Evaluates whether an asset is compatible with polar operating conditions."""
    if asset.status != AssetStatus.OPERATIONAL:
        return EquipmentCompatibilityResult(
            asset_id=asset.id,
            asset_name=asset.name,
            is_compatible=False,
            status="INCOMPATIBLE",
            reason=f"Asset status is {asset.status.value}",
            recommended_asset_name="Backup Snowcat-A",
        )

    if ambient_temp_celsius < -45.0 and asset.fuel_range_km < 300.0:
        return EquipmentCompatibilityResult(
            asset_id=asset.id,
            asset_name=asset.name,
            is_compatible=False,
            status="INCOMPATIBLE",
            reason=f"Operating temp {ambient_temp_celsius}°C exceeds thermal range limit for fuel range {asset.fuel_range_km}km",
            recommended_asset_name="Heavy Arctic Vehicle Snowcat-A",
        )

    return EquipmentCompatibilityResult(
        asset_id=asset.id,
        asset_name=asset.name,
        is_compatible=True,
        status="COMPATIBLE",
        reason=f"Operating parameters satisfied for polar temperature {ambient_temp_celsius}°C and range {asset.fuel_range_km}km",
    )


def optimize_cargo_load(
    vehicle_asset: Asset,
    cargos: List[Cargo],
    payload_capacity_kg: float = 2000.0,
) -> SmartCargoLoadPlan:
    """Greedy knapsack cargo loading solver prioritized by PriorityLevel (P1 to P4)."""
    # Sort cargo by priority level (1 is P1_CRITICAL)
    sorted_cargos = sorted(cargos, key=lambda c: c.priority_class.value if hasattr(c.priority_class, 'value') else c.priority_class)

    recs: List[CargoLoadRecommendation] = []
    current_weight = 0.0

    for c in sorted_cargos:
        cargo_weight = getattr(c, 'quantity', 1.0) * 100.0  # Default 100kg per unit
        priority_val = c.priority_class.value if hasattr(c.priority_class, 'value') else int(c.priority_class)

        if current_weight + cargo_weight <= payload_capacity_kg:
            current_weight += cargo_weight
            rec = "LOAD_CRITICAL" if priority_val == 1 else "LOAD_SECONDARY"
        else:
            rec = "DEFER"

        recs.append(
            CargoLoadRecommendation(
                cargo_id=c.id,
                cargo_name=c.item_name,
                priority_class=priority_val,
                weight_kg=cargo_weight,
                recommendation=rec,
            )
        )

    return SmartCargoLoadPlan(
        vehicle_asset_id=vehicle_asset.id,
        vehicle_name=vehicle_asset.name,
        payload_capacity_kg=payload_capacity_kg,
        total_loaded_weight_kg=current_weight,
        remaining_capacity_kg=max(0.0, payload_capacity_kg - current_weight),
        recommendations=recs,
    )
