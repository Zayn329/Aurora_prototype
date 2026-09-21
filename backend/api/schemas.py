from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field
from backend.core.models import (
    PriorityLevel,
    MissionStatus,
    CargoCategory,
    CargoStatus,
    DisruptionType,
    DisruptionSeverity,
)


# --- MISSION SCHEMAS ---

class MissionCreate(BaseModel):
    title: str = Field(..., description="Mission title")
    objective: str = Field(..., description="Mission objective")
    priority: PriorityLevel = Field(default=PriorityLevel.P2_HIGH)
    status: MissionStatus = Field(default=MissionStatus.SCHEDULED)
    planned_start_time: datetime
    planned_end_time: datetime
    station_id: Optional[str] = None


class MissionUpdate(BaseModel):
    title: Optional[str] = None
    objective: Optional[str] = None
    priority: Optional[PriorityLevel] = None
    status: Optional[MissionStatus] = None
    planned_start_time: Optional[datetime] = None
    planned_end_time: Optional[datetime] = None
    actual_start_time: Optional[datetime] = None
    actual_end_time: Optional[datetime] = None
    station_id: Optional[str] = None


class MissionRead(BaseModel):
    id: str
    title: str
    objective: str
    priority: PriorityLevel
    status: MissionStatus
    planned_start_time: datetime
    planned_end_time: datetime
    actual_start_time: Optional[datetime] = None
    actual_end_time: Optional[datetime] = None
    station_id: Optional[str] = None
    created_at: datetime


# --- CARGO SCHEMAS ---

class CargoCreate(BaseModel):
    item_name: str = Field(..., description="Cargo item description")
    category: CargoCategory = Field(default=CargoCategory.FUEL)
    quantity: float = Field(default=1.0, gt=0)
    unit: str = Field(default="units")
    priority_class: PriorityLevel = Field(default=PriorityLevel.P2_HIGH)
    status: CargoStatus = Field(default=CargoStatus.STAGED)
    location_stage: str = Field(default="Base Depot")
    estimated_arrival_time: datetime


class CargoUpdate(BaseModel):
    item_name: Optional[str] = None
    category: Optional[CargoCategory] = None
    quantity: Optional[float] = Field(default=None, gt=0)
    unit: Optional[str] = None
    priority_class: Optional[PriorityLevel] = None
    status: Optional[CargoStatus] = None
    location_stage: Optional[str] = None
    estimated_arrival_time: Optional[datetime] = None
    delay_hours: Optional[float] = None


class CargoRead(BaseModel):
    id: str
    item_name: str
    category: CargoCategory
    quantity: float
    unit: str
    priority_class: PriorityLevel
    status: CargoStatus
    location_stage: str
    estimated_arrival_time: datetime
    delay_hours: float
    created_at: datetime


# --- DISRUPTION SCHEMAS ---

class DisruptionCreate(BaseModel):
    entity_id: str = Field(..., description="Target cargo or asset ID")
    entity_type: str = Field(default="CARGO", description="Target entity type ('CARGO', 'ASSET')")
    disruption_type: DisruptionType = Field(default=DisruptionType.CARGO_DELAY)
    delay_hours: float = Field(..., ge=0, description="Delay in hours")
    severity: DisruptionSeverity = Field(default=DisruptionSeverity.CRITICAL)
    description: str = Field(..., description="Human readable description of the incident")


class DisruptionRead(BaseModel):
    id: str
    entity_id: str
    entity_type: str
    disruption_type: DisruptionType
    delay_hours: float
    severity: DisruptionSeverity
    description: str
    timestamp_utc: datetime
