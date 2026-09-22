from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from backend.persistence.database import get_session
from backend.core.models import Mission, Cargo, Asset, Station, Personnel, CargoStatus
from backend.api.schemas import MissionCreate, MissionUpdate, MissionRead
from backend.core.constraints import (
    calculate_mission_risk_score,
    evaluate_mission_readiness_checklist,
    MissionRiskAssessment,
    MissionReadinessReport,
)

router = APIRouter(prefix="/missions", tags=["Missions"])


@router.get("", response_model=List[MissionRead])
def list_missions(session: Session = Depends(get_session)):
    """List all scheduled and active polar missions."""
    missions = session.exec(select(Mission)).all()
    return missions


@router.get("/{mission_id}", response_model=MissionRead)
def get_mission(mission_id: str, session: Session = Depends(get_session)):
    """Retrieve details for a specific mission by ID."""
    mission = session.get(Mission, mission_id)
    if not mission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Mission with ID '{mission_id}' not found.",
        )
    return mission


@router.get("/{mission_id}/risk", response_model=MissionRiskAssessment)
def get_mission_risk(mission_id: str, session: Session = Depends(get_session)):
    """Calculates deterministic risk score and contributing factors for a mission."""
    mission = session.get(Mission, mission_id)
    if not mission:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Mission not found")

    assigned_assets = session.exec(select(Asset).where(Asset.assigned_mission_id == mission_id)).all()
    delayed_cargo = session.exec(select(Cargo).where(Cargo.status == CargoStatus.DELAYED)).all()

    return calculate_mission_risk_score(
        mission=mission,
        is_directly_impacted=len(delayed_cargo) > 0,
        is_transitively_impacted=False,
        cargo_delays_count=len(delayed_cargo),
        assigned_assets=assigned_assets,
    )


@router.get("/{mission_id}/readiness", response_model=MissionReadinessReport)
def get_mission_readiness(mission_id: str, session: Session = Depends(get_session)):
    """Evaluates pre-departure readiness checklist deterministically."""
    mission = session.get(Mission, mission_id)
    if not mission:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Mission not found")

    station = session.get(Station, mission.station_id) if mission.station_id else None
    cargo_items = session.exec(select(Cargo)).all()
    assigned_assets = session.exec(select(Asset).where(Asset.assigned_mission_id == mission_id)).all()
    station_personnel = session.exec(select(Personnel)).all()

    return evaluate_mission_readiness_checklist(
        mission=mission,
        is_impacted=False,
        station=station,
        cargo_items=cargo_items,
        assigned_assets=assigned_assets,
        station_personnel=station_personnel,
    )


@router.post("", response_model=MissionRead, status_code=status.HTTP_201_CREATED)
def create_mission(payload: MissionCreate, session: Session = Depends(get_session)):
    """Register a new polar mission in authoritative operational state."""
    mission = Mission(**payload.model_dump())
    session.add(mission)
    session.commit()
    session.refresh(mission)
    return mission


@router.put("/{mission_id}", response_model=MissionRead)
def update_mission(
    mission_id: str, payload: MissionUpdate, session: Session = Depends(get_session)
):
    """Modify parameters or schedule for an existing mission."""
    mission = session.get(Mission, mission_id)
    if not mission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Mission with ID '{mission_id}' not found.",
        )

    update_data = payload.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(mission, key, value)

    session.add(mission)
    session.commit()
    session.refresh(mission)
    return mission
