from typing import List
from fastapi import APIRouter, Depends, status
from sqlmodel import Session, select

from backend.persistence.database import get_session
from backend.sync.protocol import ChangeRecord, SyncPushRequest, SyncPushResponse
from backend.sync.merger import SyncMerger
from backend.core.models import Cargo, Mission, Station, Asset, Personnel

router = APIRouter(prefix="/sync", tags=["Synchronization"])


@router.post("/push", response_model=SyncPushResponse, status_code=status.HTTP_200_OK)
def push_sync_operations(
    request: SyncPushRequest, session: Session = Depends(get_session)
):
    """
    Ingests and reconciles queued ChangeRecord mutations from field devices.
    Applies deduplication and field-level Last-Write-Wins (LWW) conflict resolution.
    """
    merger = SyncMerger(session)
    response = merger.process_sync_push(request)
    return response


@router.get("/pull", status_code=status.HTTP_200_OK)
def pull_authoritative_state(session: Session = Depends(get_session)):
    """Retrieves authoritative master operational state for client replica re-hydration."""
    return {
        "stations": session.exec(select(Station)).all(),
        "missions": session.exec(select(Mission)).all(),
        "cargo": session.exec(select(Cargo)).all(),
        "assets": session.exec(select(Asset)).all(),
        "personnel": session.exec(select(Personnel)).all(),
    }
