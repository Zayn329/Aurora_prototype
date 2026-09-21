from typing import List, Dict, Any, Optional
from datetime import datetime, timezone
from pydantic import BaseModel, Field
from sqlmodel import SQLModel, Field as SQLField
from backend.core.models import generate_uuid


# Database model to record processed operation GUIDs for idempotent replay protection
class ProcessedOp(SQLModel, table=True):
    op_id: str = SQLField(primary_key=True)
    device_id: str = SQLField(index=True, nullable=False)
    processed_at_utc: datetime = SQLField(default_factory=lambda: datetime.now(timezone.utc))


# Application Sync Protocol ChangeRecord Payload Schema
class ChangeRecord(BaseModel):
    op_id: str = Field(..., description="Unique operation GUID")
    device_id: str = Field(..., description="Originating client device identifier")
    device_seq_num: int = Field(default=1, description="Device sequence counter")
    timestamp_utc: str = Field(..., description="ISO 8601 UTC timestamp")
    entity_type: str = Field(..., description="Entity domain ('CARGO', 'MISSION', 'ASSET', etc.)")
    entity_id: str = Field(..., description="Entity GUID")
    action: str = Field(..., description="Mutation type ('CREATE', 'UPDATE', 'DELETE')")
    payload: Dict[str, Any] = Field(..., description="Key-value field mutations")
    field_revisions: Dict[str, int] = Field(default_factory=dict, description="Field-level revision counters for LWW merge")


class SyncPushRequest(BaseModel):
    device_id: str
    operations: List[ChangeRecord]


class SyncPushResponse(BaseModel):
    status: str
    processed_count: int
    ignored_count: int
    rejected_count: int
    processed_op_ids: List[str]
    rejected_op_ids: List[str]
