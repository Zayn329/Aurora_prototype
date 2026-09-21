import time
from fastapi import APIRouter, Depends, status
from sqlmodel import Session

from backend.persistence.database import get_session
from backend.persistence.seed import seed_database

router = APIRouter(tags=["System"])


@router.get("/health")
def health_check():
    """System health check endpoint."""
    return {
        "status": "healthy",
        "service": "aurora-backend",
        "timestamp": time.time(),
        "mode": "deterministic_core_ready",
    }


@router.post("/system/reset", status_code=status.HTTP_200_OK)
def reset_system_state(session: Session = Depends(get_session)):
    """Resets central SQLite database to initial synthetic seed dataset for repeatable evaluator demos."""
    counts = seed_database(session)
    return {
        "status": "reset_successful",
        "message": "Authoritative state reset to initial synthetic seed dataset.",
        "counts": counts,
    }
