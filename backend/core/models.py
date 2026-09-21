from enum import Enum
from typing import Optional, List
from datetime import datetime, timezone
import uuid
from sqlmodel import SQLModel, Field, Relationship
from pydantic import field_validator


class PriorityLevel(int, Enum):
    P1_CRITICAL = 1
    P2_HIGH = 2
    P3_MEDIUM = 3
    P4_LOW = 4


class MissionStatus(str, Enum):
    DRAFT = "DRAFT"
    SCHEDULED = "SCHEDULED"
    IN_PROGRESS = "IN_PROGRESS"
    DELAYED = "DELAYED"
    IMPACTED = "IMPACTED"
    COMPLETED = "COMPLETED"
    ABORTED = "ABORTED"


class CargoCategory(str, Enum):
    FUEL = "FUEL"
    RATIONS = "RATIONS"
    MEDICAL = "MEDICAL"
    TECHNICAL = "TECHNICAL"
    SURVIVAL = "SURVIVAL"


class CargoStatus(str, Enum):
    STAGED = "STAGED"
    TRANSIT = "TRANSIT"
    DELAYED = "DELAYED"
    DELIVERED = "DELIVERED"


class AssetCategory(str, Enum):
    VEHICLE = "VEHICLE"
    GENERATOR = "GENERATOR"
    HABITAT = "HABITAT"
    COMMS_ANTENNA = "COMMS_ANTENNA"


class AssetStatus(str, Enum):
    OPERATIONAL = "OPERATIONAL"
    MAINTENANCE_REQUIRED = "MAINTENANCE_REQUIRED"
    OFFLINE = "OFFLINE"
    DAMAGED = "DAMAGED"


class PersonnelRole(str, Enum):
    COMMANDER = "COMMANDER"
    DOCTOR = "DOCTOR"
    ENGINEER = "ENGINEER"
    SCOUT = "SCOUT"
    SPECIALIST = "SPECIALIST"


class DependencyType(str, Enum):
    REQUIRED_CARGO = "REQUIRED_CARGO"
    PREREQUISITE_MISSION = "PREREQUISITE_MISSION"
    ASSIGNED_ASSET = "ASSIGNED_ASSET"


class DisruptionType(str, Enum):
    CARGO_DELAY = "CARGO_DELAY"
    ASSET_FAILURE = "ASSET_FAILURE"
    WEATHER_ALERT = "WEATHER_ALERT"


class DisruptionSeverity(str, Enum):
    CRITICAL = "CRITICAL"
    WARNING = "WARNING"
    INFORMATIONAL = "INFORMATIONAL"


class ProposalStatus(str, Enum):
    PENDING_APPROVAL = "PENDING_APPROVAL"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"


class ApprovalAction(str, Enum):
    APPROVE = "APPROVE"
    MODIFY = "MODIFY"
    REJECT = "REJECT"


def generate_uuid() -> str:
    return str(uuid.uuid4())


def get_utc_now() -> datetime:
    return datetime.now(timezone.utc)


class Station(SQLModel, table=True):
    id: str = Field(default_factory=generate_uuid, primary_key=True)
    name: str = Field(index=True, nullable=False)
    location: str = Field(nullable=False)
    capacity_fuel_liters: float = Field(default=10000.0)
    capacity_power_kw: float = Field(default=250.0)
    current_fuel_liters: float = Field(default=8000.0)
    current_power_kw: float = Field(default=200.0)
    created_at: datetime = Field(default_factory=get_utc_now)

    missions: List["Mission"] = Relationship(back_populates="station")
    personnel: List["Personnel"] = Relationship(back_populates="station")


class Mission(SQLModel, table=True):
    id: str = Field(default_factory=generate_uuid, primary_key=True)
    title: str = Field(index=True, nullable=False)
    objective: str = Field(nullable=False)
    priority: PriorityLevel = Field(default=PriorityLevel.P2_HIGH)
    status: MissionStatus = Field(default=MissionStatus.SCHEDULED)
    planned_start_time: datetime = Field(nullable=False)
    planned_end_time: datetime = Field(nullable=False)
    actual_start_time: Optional[datetime] = Field(default=None)
    actual_end_time: Optional[datetime] = Field(default=None)
    station_id: Optional[str] = Field(default=None, foreign_key="station.id")
    created_at: datetime = Field(default_factory=get_utc_now)

    station: Optional[Station] = Relationship(back_populates="missions")
    assigned_assets: List["Asset"] = Relationship(back_populates="assigned_mission")


class Cargo(SQLModel, table=True):
    id: str = Field(default_factory=generate_uuid, primary_key=True)
    item_name: str = Field(index=True, nullable=False)
    category: CargoCategory = Field(default=CargoCategory.FUEL)
    quantity: float = Field(default=1.0)
    unit: str = Field(default="units")
    priority_class: PriorityLevel = Field(default=PriorityLevel.P2_HIGH)
    status: CargoStatus = Field(default=CargoStatus.STAGED)
    location_stage: str = Field(default="Base Depot")
    estimated_arrival_time: datetime = Field(nullable=False)
    delay_hours: float = Field(default=0.0)
    created_at: datetime = Field(default_factory=get_utc_now)


class Asset(SQLModel, table=True):
    id: str = Field(default_factory=generate_uuid, primary_key=True)
    name: str = Field(index=True, nullable=False)
    category: AssetCategory = Field(default=AssetCategory.VEHICLE)
    status: AssetStatus = Field(default=AssetStatus.OPERATIONAL)
    location: str = Field(default="Main Station")
    power_consumption_rate: float = Field(default=0.0)
    fuel_range_km: float = Field(default=500.0)
    assigned_mission_id: Optional[str] = Field(default=None, foreign_key="mission.id")
    created_at: datetime = Field(default_factory=get_utc_now)

    assigned_mission: Optional[Mission] = Relationship(back_populates="assigned_assets")


class Personnel(SQLModel, table=True):
    id: str = Field(default_factory=generate_uuid, primary_key=True)
    name: str = Field(index=True, nullable=False)
    role: PersonnelRole = Field(default=PersonnelRole.SPECIALIST)
    station_id: Optional[str] = Field(default=None, foreign_key="station.id")
    medical_status: str = Field(default="FIT_FOR_DUTY")
    availability_status: str = Field(default="AVAILABLE")
    created_at: datetime = Field(default_factory=get_utc_now)

    station: Optional[Station] = Relationship(back_populates="personnel")


class Dependency(SQLModel, table=True):
    id: str = Field(default_factory=generate_uuid, primary_key=True)
    source_type: str = Field(nullable=False)  # "CARGO", "MISSION", "ASSET"
    source_id: str = Field(nullable=False, index=True)
    target_type: str = Field(nullable=False)  # "MISSION", "ASSET"
    target_id: str = Field(nullable=False, index=True)
    dependency_type: DependencyType = Field(nullable=False)
    notes: Optional[str] = Field(default=None)
    created_at: datetime = Field(default_factory=get_utc_now)


class Disruption(SQLModel, table=True):
    id: str = Field(default_factory=generate_uuid, primary_key=True)
    entity_type: str = Field(nullable=False)  # "CARGO", "ASSET", "FIELD_CONDITION"
    entity_id: str = Field(nullable=False, index=True)
    disruption_type: DisruptionType = Field(nullable=False)
    delay_hours: float = Field(default=0.0)
    severity: DisruptionSeverity = Field(default=DisruptionSeverity.WARNING)
    description: str = Field(nullable=False)
    timestamp_utc: datetime = Field(default_factory=get_utc_now)


class Recommendation(SQLModel, table=True):
    id: str = Field(default_factory=generate_uuid, primary_key=True)
    agent_name: str = Field(nullable=False)
    proposed_action_json: str = Field(nullable=False)  # Serialized JSON
    rag_citations_json: str = Field(default="[]")     # Serialized JSON array
    rationale: str = Field(nullable=False)
    status: ProposalStatus = Field(default=ProposalStatus.PENDING_APPROVAL)
    created_at: datetime = Field(default_factory=get_utc_now)


class ApprovalAudit(SQLModel, table=True):
    id: str = Field(default_factory=generate_uuid, primary_key=True)
    recommendation_id: str = Field(nullable=False, foreign_key="recommendation.id")
    commander_id: str = Field(nullable=False)
    action: ApprovalAction = Field(nullable=False)
    details_json: str = Field(default="{}")
    timestamp_utc: datetime = Field(default_factory=get_utc_now)
