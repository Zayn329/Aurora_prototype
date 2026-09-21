from datetime import datetime, timedelta, timezone
from sqlmodel import Session, select, delete
from backend.persistence.database import engine, init_db
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
)

# Standardized GUIDs for deterministic demonstration walkthroughs
STATION_ALPHA_ID = "station-outpost-alpha-001"
STATION_BETA_ID = "station-research-beta-002"
STATION_GAMMA_ID = "station-depot-gamma-003"

MISSION_DEEP_FREEZE_ID = "mission-arctic-outpost-alpha-01"
MISSION_GLACIAL_SURVEY_ID = "mission-glacial-survey-beta-02"
MISSION_GENERATOR_MAINT_ID = "mission-generator-maint-03"
MISSION_RESUPPLY_ID = "mission-outpost-resupply-04"
MISSION_SEISMIC_ID = "mission-seismic-array-05"

CARGO_FUEL_01_ID = "cargo-fuel-crate-001"
CARGO_FUEL_02_ID = "cargo-fuel-crate-002"
CARGO_MEDICAL_01_ID = "cargo-medical-kit-001"
CARGO_RATIONS_01_ID = "cargo-survival-rations-001"
CARGO_RATIONS_02_ID = "cargo-survival-rations-002"
CARGO_TURBINE_01_ID = "cargo-spare-turbine-001"
CARGO_COMMS_01_ID = "cargo-comms-array-001"
CARGO_SOLAR_01_ID = "cargo-solar-panel-001"
CARGO_DRILL_01_ID = "cargo-ice-drill-001"
CARGO_HEATER_01_ID = "cargo-portable-heater-001"

ASSET_SNOWCAT_01_ID = "asset-snowcat-vehicle-001"
ASSET_SNOWCAT_02_ID = "asset-snowcat-vehicle-002"
ASSET_GENERATOR_01_ID = "asset-generator-alpha-001"
ASSET_GENERATOR_02_ID = "asset-generator-beta-002"

DISRUPTION_BLIZZARD_FUEL_ID = "disruption-blizzard-fuel-delay-001"


def seed_database(session: Session = None) -> dict:
    """Populates SQLite database with deterministic synthetic demonstration dataset."""
    init_db()

    close_session_at_end = False
    if session is None:
        session = Session(engine)
        close_session_at_end = True

    try:
        # Clear existing seed data for repeatable initialization
        for model in [ApprovalAudit, Recommendation, Disruption, Dependency, Personnel, Asset, Cargo, Mission, Station]:
            session.exec(delete(model))
        session.commit()

        now = datetime.now(timezone.utc)

        # 1. Stations (3)
        station_alpha = Station(
            id=STATION_ALPHA_ID,
            name="Outpost Alpha (Main Base)",
            location="Lat: -77.85, Long: 166.66 (McMurdo Sound Sector)",
            capacity_fuel_liters=20000.0,
            current_fuel_liters=12000.0,
            capacity_power_kw=500.0,
            current_power_kw=350.0,
        )
        station_beta = Station(
            id=STATION_BETA_ID,
            name="Station Beta (Research Outpost)",
            location="Lat: -75.10, Long: 123.35 (Dome C High Plateau)",
            capacity_fuel_liters=10000.0,
            current_fuel_liters=3500.0,
            capacity_power_kw=200.0,
            current_power_kw=120.0,
        )
        station_gamma = Station(
            id=STATION_GAMMA_ID,
            name="Depot Gamma (Supply Hub)",
            location="Lat: -79.00, Long: 170.00 (Ross Ice Shelf Transfer)",
            capacity_fuel_liters=30000.0,
            current_fuel_liters=22000.0,
            capacity_power_kw=300.0,
            current_power_kw=180.0,
        )
        session.add_all([station_alpha, station_beta, station_gamma])
        session.commit()

        # 2. Missions (5)
        mission_1 = Mission(
            id=MISSION_DEEP_FREEZE_ID,
            title="Operation Deep Freeze (Arctic Outpost Alpha Resupply)",
            objective="Deliver critical fuel reserves and establish main winter survival staging at Outpost Alpha.",
            priority=PriorityLevel.P1_CRITICAL,
            status=MissionStatus.SCHEDULED,
            planned_start_time=now + timedelta(hours=12),
            planned_end_time=now + timedelta(hours=36),
            station_id=STATION_ALPHA_ID,
        )
        mission_2 = Mission(
            id=MISSION_GLACIAL_SURVEY_ID,
            title="Glacial Survey Beta",
            objective="Conduct core ice sampling and seismic array deployment at Dome C plateau.",
            priority=PriorityLevel.P2_HIGH,
            status=MissionStatus.SCHEDULED,
            planned_start_time=now + timedelta(hours=48),
            planned_end_time=now + timedelta(hours=96),
            station_id=STATION_BETA_ID,
        )
        mission_3 = Mission(
            id=MISSION_GENERATOR_MAINT_ID,
            title="Station Beta Power Overhaul",
            objective="Replace worn diesel turbine assembly on Generator Beta before winter storm cycle.",
            priority=PriorityLevel.P1_CRITICAL,
            status=MissionStatus.SCHEDULED,
            planned_start_time=now + timedelta(hours=24),
            planned_end_time=now + timedelta(hours=48),
            station_id=STATION_BETA_ID,
        )
        mission_4 = Mission(
            id=MISSION_RESUPPLY_ID,
            title="Depot Gamma Transfer Run",
            objective="Routine overland transport of rations and medical kits from Depot Gamma to Outpost Alpha.",
            priority=PriorityLevel.P3_MEDIUM,
            status=MissionStatus.SCHEDULED,
            planned_start_time=now + timedelta(hours=60),
            planned_end_time=now + timedelta(hours=84),
            station_id=STATION_GAMMA_ID,
        )
        mission_5 = Mission(
            id=MISSION_SEISMIC_ID,
            title="Seismic Array Deployment",
            objective="Deploy high-sensitivity seismic telemetry sensors across western rift line.",
            priority=PriorityLevel.P4_LOW,
            status=MissionStatus.SCHEDULED,
            planned_start_time=now + timedelta(hours=72),
            planned_end_time=now + timedelta(hours=120),
            station_id=STATION_ALPHA_ID,
        )
        session.add_all([mission_1, mission_2, mission_3, mission_4, mission_5])
        session.commit()

        # 3. Cargo Items (10)
        cargos = [
            Cargo(
                id=CARGO_FUEL_01_ID,
                item_name="Cargo-Fuel-01 (Polar Diesel Grade A)",
                category=CargoCategory.FUEL,
                quantity=2000.0,
                unit="liters",
                priority_class=PriorityLevel.P1_CRITICAL,
                status=CargoStatus.TRANSIT,
                location_stage="Coastal Transport Vessel",
                estimated_arrival_time=now + timedelta(hours=6),
                delay_hours=0.0,
            ),
            Cargo(
                id=CARGO_FUEL_02_ID,
                item_name="Cargo-Fuel-02 (Reserve Aviation Fuel)",
                category=CargoCategory.FUEL,
                quantity=1000.0,
                unit="liters",
                priority_class=PriorityLevel.P2_HIGH,
                status=CargoStatus.STAGED,
                location_stage="Depot Gamma Staging Yard",
                estimated_arrival_time=now + timedelta(hours=18),
            ),
            Cargo(
                id=CARGO_MEDICAL_01_ID,
                item_name="Medical Kit Alpha (Trauma & Freeze Response)",
                category=CargoCategory.MEDICAL,
                quantity=5.0,
                unit="crates",
                priority_class=PriorityLevel.P1_CRITICAL,
                status=CargoStatus.STAGED,
                location_stage="Base Infirmary Bay",
                estimated_arrival_time=now + timedelta(hours=4),
            ),
            Cargo(
                id=CARGO_RATIONS_01_ID,
                item_name="Survival Rations Batch 1 (High Calorie Packs)",
                category=CargoCategory.RATIONS,
                quantity=500.0,
                unit="daily_rations",
                priority_class=PriorityLevel.P2_HIGH,
                status=CargoStatus.STAGED,
                location_stage="Depot Gamma Storage",
                estimated_arrival_time=now + timedelta(hours=12),
            ),
            Cargo(
                id=CARGO_RATIONS_02_ID,
                item_name="Emergency Freeze-Dried Rations Batch 2",
                category=CargoCategory.RATIONS,
                quantity=300.0,
                unit="daily_rations",
                priority_class=PriorityLevel.P3_MEDIUM,
                status=CargoStatus.STAGED,
                location_stage="Station Beta Locker",
                estimated_arrival_time=now + timedelta(hours=24),
            ),
            Cargo(
                id=CARGO_TURBINE_01_ID,
                item_name="Spare Generator Turbine Assembly",
                category=CargoCategory.TECHNICAL,
                quantity=1.0,
                unit="unit",
                priority_class=PriorityLevel.P1_CRITICAL,
                status=CargoStatus.TRANSIT,
                location_stage="Overland Transport Convoy",
                estimated_arrival_time=now + timedelta(hours=18),
            ),
            Cargo(
                id=CARGO_COMMS_01_ID,
                item_name="Satellite Comms Antenna Relay Array",
                category=CargoCategory.TECHNICAL,
                quantity=2.0,
                unit="units",
                priority_class=PriorityLevel.P3_MEDIUM,
                status=CargoStatus.STAGED,
                location_stage="Outpost Alpha Warehouse",
                estimated_arrival_time=now + timedelta(hours=36),
            ),
            Cargo(
                id=CARGO_SOLAR_01_ID,
                item_name="Low-Temp Solar Collector Panels",
                category=CargoCategory.TECHNICAL,
                quantity=10.0,
                unit="panels",
                priority_class=PriorityLevel.P4_LOW,
                status=CargoStatus.STAGED,
                location_stage="Depot Gamma Yard",
                estimated_arrival_time=now + timedelta(hours=48),
            ),
            Cargo(
                id=CARGO_DRILL_01_ID,
                item_name="Thermal Ice Core Drill Rig",
                category=CargoCategory.SURVIVAL,
                quantity=1.0,
                unit="rig",
                priority_class=PriorityLevel.P2_HIGH,
                status=CargoStatus.STAGED,
                location_stage="Station Beta Lab",
                estimated_arrival_time=now + timedelta(hours=30),
            ),
            Cargo(
                id=CARGO_HEATER_01_ID,
                item_name="Portable Emergency Thermal Heaters",
                category=CargoCategory.SURVIVAL,
                quantity=4.0,
                unit="units",
                priority_class=PriorityLevel.P1_CRITICAL,
                status=CargoStatus.STAGED,
                location_stage="Base Supply Depot",
                estimated_arrival_time=now + timedelta(hours=8),
            ),
        ]
        session.add_all(cargos)
        session.commit()

        # 4. Assets (4)
        assets = [
            Asset(
                id=ASSET_SNOWCAT_01_ID,
                name="Snowcat Heavy Transport Vehicle 01",
                category=AssetCategory.VEHICLE,
                status=AssetStatus.OPERATIONAL,
                location="Outpost Alpha Motor Pool",
                fuel_range_km=600.0,
                assigned_mission_id=MISSION_DEEP_FREEZE_ID,
            ),
            Asset(
                id=ASSET_SNOWCAT_02_ID,
                name="Snowcat Heavy Transport Vehicle 02",
                category=AssetCategory.VEHICLE,
                status=AssetStatus.OPERATIONAL,
                location="Depot Gamma Staging",
                fuel_range_km=550.0,
                assigned_mission_id=None,
            ),
            Asset(
                id=ASSET_GENERATOR_01_ID,
                name="Primary Station Diesel Generator Alpha",
                category=AssetCategory.GENERATOR,
                status=AssetStatus.OPERATIONAL,
                location="Outpost Alpha Power Plant",
                power_consumption_rate=25.0,
                assigned_mission_id=None,
            ),
            Asset(
                id=ASSET_GENERATOR_02_ID,
                name="Auxiliary Generator Beta (Turbine Wear)",
                category=AssetCategory.GENERATOR,
                status=AssetStatus.MAINTENANCE_REQUIRED,
                location="Station Beta Power Shack",
                power_consumption_rate=15.0,
                assigned_mission_id=MISSION_GENERATOR_MAINT_ID,
            ),
        ]
        session.add_all(assets)
        session.commit()

        # 5. Personnel (8)
        personnel = [
            Personnel(
                id="personnel-cmd-vance-001",
                name="Commander Sarah Vance",
                role=PersonnelRole.COMMANDER,
                station_id=STATION_ALPHA_ID,
                medical_status="FIT_FOR_DUTY",
                availability_status="AVAILABLE",
            ),
            Personnel(
                id="personnel-dr-romanov-002",
                name="Dr. Alexei Romanov",
                role=PersonnelRole.DOCTOR,
                station_id=STATION_ALPHA_ID,
                medical_status="FIT_FOR_DUTY",
                availability_status="AVAILABLE",
            ),
            Personnel(
                id="personnel-eng-rostova-003",
                name="Elena Rostova",
                role=PersonnelRole.ENGINEER,
                station_id=STATION_BETA_ID,
                medical_status="FIT_FOR_DUTY",
                availability_status="ASSIGNED",
            ),
            Personnel(
                id="personnel-sct-vance-004",
                name="Marcus Vance",
                role=PersonnelRole.SCOUT,
                station_id=STATION_GAMMA_ID,
                medical_status="FIT_FOR_DUTY",
                availability_status="AVAILABLE",
            ),
            Personnel(
                id="personnel-spc-chen-005",
                name="Dr. Lin Chen (Glaciologist)",
                role=PersonnelRole.SPECIALIST,
                station_id=STATION_BETA_ID,
                medical_status="FIT_FOR_DUTY",
                availability_status="ASSIGNED",
            ),
            Personnel(
                id="personnel-spc-jensen-006",
                name="Lars Jensen (Comms Tech)",
                role=PersonnelRole.SPECIALIST,
                station_id=STATION_ALPHA_ID,
                medical_status="FIT_FOR_DUTY",
                availability_status="AVAILABLE",
            ),
            Personnel(
                id="personnel-spc-dubois-007",
                name="Claire Dubois (Logistics)",
                role=PersonnelRole.SPECIALIST,
                station_id=STATION_GAMMA_ID,
                medical_status="FIT_FOR_DUTY",
                availability_status="AVAILABLE",
            ),
            Personnel(
                id="personnel-spc-kowalski-008",
                name="Jan Kowalski (Mechanic)",
                role=PersonnelRole.SPECIALIST,
                station_id=STATION_ALPHA_ID,
                medical_status="FIT_FOR_DUTY",
                availability_status="AVAILABLE",
            ),
        ]
        session.add_all(personnel)
        session.commit()

        # 6. Dependencies (Explicit graph links for canonical demo)
        dependencies = [
            # Mission Deep Freeze requires Cargo Fuel 01
            Dependency(
                id="dep-deepfreeze-fuel01",
                source_type="CARGO",
                source_id=CARGO_FUEL_01_ID,
                target_type="MISSION",
                target_id=MISSION_DEEP_FREEZE_ID,
                dependency_type=DependencyType.REQUIRED_CARGO,
                notes="Mission Deep Freeze requires Cargo-Fuel-01 for station generator refuel.",
            ),
            # Mission Glacial Survey depends on Mission Deep Freeze completion
            Dependency(
                id="dep-survey-deepfreeze-prereq",
                source_type="MISSION",
                source_id=MISSION_DEEP_FREEZE_ID,
                target_type="MISSION",
                target_id=MISSION_GLACIAL_SURVEY_ID,
                dependency_type=DependencyType.PREREQUISITE_MISSION,
                notes="Survey team staging depends on completion of Operation Deep Freeze resupply.",
            ),
            # Mission Generator Maint requires Spare Turbine Cargo
            Dependency(
                id="dep-maint-turbine",
                source_type="CARGO",
                source_id=CARGO_TURBINE_01_ID,
                target_type="MISSION",
                target_id=MISSION_GENERATOR_MAINT_ID,
                dependency_type=DependencyType.REQUIRED_CARGO,
                notes="Turbine replacement requires spare turbine assembly delivery.",
            ),
            # Mission Deep Freeze requires Snowcat 01
            Dependency(
                id="dep-deepfreeze-snowcat01",
                source_type="ASSET",
                source_id=ASSET_SNOWCAT_01_ID,
                target_type="MISSION",
                target_id=MISSION_DEEP_FREEZE_ID,
                dependency_type=DependencyType.ASSIGNED_ASSET,
                notes="Overland transport requires heavy Snowcat 01 vehicle.",
            ),
        ]
        session.add_all(dependencies)
        session.commit()

        # 7. Initial Preconfigured Disruption Data (Pre-configured scenario context)
        initial_disruption = Disruption(
            id=DISRUPTION_BLIZZARD_FUEL_ID,
            entity_type="CARGO",
            entity_id=CARGO_FUEL_01_ID,
            disruption_type=DisruptionType.CARGO_DELAY,
            delay_hours=24.0,
            severity=DisruptionSeverity.CRITICAL,
            description="Coastal blizzard and sea ice formation delayed cargo vessel unloading by 24 hours.",
        )
        session.add(initial_disruption)
        session.commit()

        counts = {
            "stations": session.exec(select(Station)).all(),
            "missions": session.exec(select(Mission)).all(),
            "cargo": session.exec(select(Cargo)).all(),
            "assets": session.exec(select(Asset)).all(),
            "personnel": session.exec(select(Personnel)).all(),
            "dependencies": session.exec(select(Dependency)).all(),
            "disruptions": session.exec(select(Disruption)).all(),
        }

        result_counts = {k: len(v) for k, v in counts.items()}
        print(f"Database seeded successfully: {result_counts}")
        return result_counts

    finally:
        if close_session_at_end:
            session.close()


if __name__ == "__main__":
    seed_database()
