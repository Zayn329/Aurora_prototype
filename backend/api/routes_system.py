import time
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from backend.persistence.database import get_session
from backend.persistence.seed import seed_database
from backend.core.models import Station, Mission, Cargo, Asset, Personnel
from backend.core.constraints import (
    calculate_7day_resource_forecast,
    compute_emergency_baseline_triage,
    Resource7DayForecast,
    EmergencyBaselineTriageResult,
)

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


@router.get("/api/v1/resources/forecast/{station_id}", response_model=Resource7DayForecast)
def get_station_resource_forecast(station_id: str, session: Session = Depends(get_session)):
    """Generates 7-day rolling resource supply/demand forecast for a station."""
    station = session.get(Station, station_id)
    if not station:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Station with ID '{station_id}' not found.",
        )

    missions = session.exec(select(Mission)).all()
    forecast = calculate_7day_resource_forecast(station, missions)
    return forecast


@router.post("/api/v1/emergency/triage/{station_id}", response_model=EmergencyBaselineTriageResult)
def trigger_emergency_triage(
    station_id: str, incident_type: str = "POWER_FAILURE", session: Session = Depends(get_session)
):
    """Executes offline deterministic emergency triage solver in <50ms."""
    station = session.get(Station, station_id)
    if not station:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Station with ID '{station_id}' not found.",
        )

    assets = session.exec(select(Asset)).all()
    personnel = session.exec(select(Personnel)).all()

    triage_result = compute_emergency_baseline_triage(station, assets, personnel, incident_type=incident_type)
    return triage_result
