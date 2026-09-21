from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from backend.persistence.database import get_session
from backend.core.models import Cargo
from backend.api.schemas import CargoCreate, CargoUpdate, CargoRead

router = APIRouter(prefix="/cargo", tags=["Cargo"])


@router.get("", response_model=List[CargoRead])
def list_cargo(session: Session = Depends(get_session)):
    """List all cargo items and current arrival/delay statuses."""
    cargos = session.exec(select(Cargo)).all()
    return cargos


@router.get("/{cargo_id}", response_model=CargoRead)
def get_cargo(cargo_id: str, session: Session = Depends(get_session)):
    """Retrieve details for a specific cargo item by ID."""
    cargo = session.get(Cargo, cargo_id)
    if not cargo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Cargo item with ID '{cargo_id}' not found.",
        )
    return cargo


@router.post("", response_model=CargoRead, status_code=status.HTTP_201_CREATED)
def create_cargo(payload: CargoCreate, session: Session = Depends(get_session)):
    """Register a new cargo item in authoritative operational state."""
    cargo = Cargo(**payload.model_dump())
    session.add(cargo)
    session.commit()
    session.refresh(cargo)
    return cargo


@router.put("/{cargo_id}", response_model=CargoRead)
def update_cargo(
    cargo_id: str, payload: CargoUpdate, session: Session = Depends(get_session)
):
    """Update cargo status, arrival stage, or delay parameters."""
    cargo = session.get(Cargo, cargo_id)
    if not cargo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Cargo item with ID '{cargo_id}' not found.",
        )

    update_data = payload.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(cargo, key, value)

    session.add(cargo)
    session.commit()
    session.refresh(cargo)
    return cargo
