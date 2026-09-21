from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from backend.persistence.database import get_session
from backend.core.models import Mission
from backend.api.schemas import MissionCreate, MissionUpdate, MissionRead

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
