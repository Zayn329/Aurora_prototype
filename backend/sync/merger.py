from typing import List, Dict, Any, Optional
from datetime import datetime, timezone
from sqlmodel import SQLModel, Field, Session, select

from backend.core.models import Cargo, Mission, Station, Asset, Personnel
from backend.sync.protocol import ChangeRecord, ProcessedOp, SyncPushRequest, SyncPushResponse


# Persistent record of field-level mutation revisions for LWW merge
class FieldRevisionRecord(SQLModel, table=True):
    entity_type: str = Field(primary_key=True)
    entity_id: str = Field(primary_key=True)
    field_name: str = Field(primary_key=True)
    last_timestamp_utc: str = Field(nullable=False)
    last_device_id: str = Field(nullable=False)


class SyncMerger:
    """
    Transport-Agnostic Synchronization Merger.
    Applies field-level Last-Write-Wins (LWW) conflict resolution and idempotent operation deduplication.
    """

    def __init__(self, session: Session):
        self.session = session

    def process_sync_push(self, request: SyncPushRequest) -> SyncPushResponse:
        processed_op_ids: List[str] = []
        rejected_op_ids: List[str] = []
        ignored_count = 0

        # Sort operations by timestamp_utc ascending for deterministic processing order
        sorted_ops = sorted(request.operations, key=lambda op: (op.timestamp_utc, op.device_id, op.op_id))

        for op in sorted_ops:
            # 1. Idempotency Check: Drop if op_id already processed
            existing_op = self.session.get(ProcessedOp, op.op_id)
            if existing_op:
                ignored_count += 1
                processed_op_ids.append(op.op_id)
                continue

            try:
                # 2. Reconcile and apply mutation to authoritative SQLite database
                success = self._apply_operation(op)
                if success:
                    # Record op_id in processed_ops deduplication registry
                    processed_record = ProcessedOp(op_id=op.op_id, device_id=op.device_id)
                    self.session.add(processed_record)
                    self.session.commit()
                    processed_op_ids.append(op.op_id)
                else:
                    rejected_op_ids.append(op.op_id)
            except Exception as err:
                self.session.rollback()
                print(f"Error applying operation {op.op_id}: {err}")
                rejected_op_ids.append(op.op_id)

        return SyncPushResponse(
            status="completed",
            processed_count=len(processed_op_ids) - ignored_count,
            ignored_count=ignored_count,
            rejected_count=len(rejected_op_ids),
            processed_op_ids=processed_op_ids,
            rejected_op_ids=rejected_op_ids,
        )

    def _apply_operation(self, op: ChangeRecord) -> bool:
        entity_type = op.entity_type.upper()
        entity_id = op.entity_id

        model_map = {
            "CARGO": Cargo,
            "MISSION": Mission,
            "STATION": Station,
            "ASSET": Asset,
            "PERSONNEL": Personnel,
        }

        model_cls = model_map.get(entity_type)
        if not model_cls:
            return False

        existing_entity = self.session.get(model_cls, entity_id)

        if op.action in ("CREATE", "UPDATE"):
            if not existing_entity:
                payload = dict(op.payload)
                payload["id"] = entity_id
                valid_fields = model_cls.model_fields.keys()
                filtered_payload = {k: v for k, v in payload.items() if k in valid_fields}

                new_entity = model_cls(**filtered_payload)
                self.session.add(new_entity)

                # Record persistent field revisions for new entity
                for field_name in filtered_payload.keys():
                    rev_record = FieldRevisionRecord(
                        entity_type=entity_type,
                        entity_id=entity_id,
                        field_name=field_name,
                        last_timestamp_utc=op.timestamp_utc,
                        last_device_id=op.device_id,
                    )
                    self.session.add(rev_record)
            else:
                # Field-level Last-Write-Wins (LWW) conflict resolution using persistent SQLite records
                for field_name, value in op.payload.items():
                    if hasattr(existing_entity, field_name):
                        rev_record = self.session.get(
                            FieldRevisionRecord, (entity_type, entity_id, field_name)
                        )

                        incoming_rev = (op.timestamp_utc, op.device_id)

                        if rev_record is None:
                            setattr(existing_entity, field_name, value)
                            new_rev = FieldRevisionRecord(
                                entity_type=entity_type,
                                entity_id=entity_id,
                                field_name=field_name,
                                last_timestamp_utc=op.timestamp_utc,
                                last_device_id=op.device_id,
                            )
                            self.session.add(new_rev)
                        else:
                            last_rev = (rev_record.last_timestamp_utc, rev_record.last_device_id)
                            # Apply field update if incoming revision timestamp is later or equal (LWW)
                            if incoming_rev >= last_rev:
                                setattr(existing_entity, field_name, value)
                                rev_record.last_timestamp_utc = op.timestamp_utc
                                rev_record.last_device_id = op.device_id
                                self.session.add(rev_record)

                self.session.add(existing_entity)
            return True

        elif op.action == "DELETE":
            if existing_entity:
                self.session.delete(existing_entity)
            return True

        return False
