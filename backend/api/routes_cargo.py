from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from backend.persistence.database import get_session
from backend.core.models import Cargo, Asset
from backend.api.schemas import CargoCreate, CargoUpdate, CargoRead
from backend.core.constraints import optimize_cargo_load, SmartCargoLoadPlan, check_equipment_compatibility, EquipmentCompatibilityResult

router = APIRouter(prefix="/cargo", tags=["Cargo"])


@router.get("", response_model=List[CargoRead])
def list_cargo(session: Session = Depends(get_session)):
    """List all cargo items and current arrival/delay statuses."""
    cargos = session.exec(select(Cargo)).all()
    return cargos


@router.get("/smart-load/{asset_id}", response_model=SmartCargoLoadPlan)
def get_smart_cargo_load_plan(asset_id: str, session: Session = Depends(get_session)):
    """Computes deterministic cargo loading optimization for a vehicle asset."""
    asset = session.get(Asset, asset_id)
    if not asset:
        # Fallback dummy asset for demo if asset_id is generic
        asset = Asset(id=asset_id, name="Snowcat Transport-A")

    cargos = session.exec(select(Cargo)).all()
    return optimize_cargo_load(vehicle_asset=asset, cargos=cargos, payload_capacity_kg=2000.0)


@router.get("/compatibility/{asset_id}", response_model=EquipmentCompatibilityResult)
def get_equipment_compatibility(asset_id: str, session: Session = Depends(get_session)):
    """Checks asset compatibility against polar operating temperature and fuel range."""
    asset = session.get(Asset, asset_id)
    if not asset:
        asset = Asset(id=asset_id, name="Snowcat Transport-A", fuel_range_km=500.0)

    return check_equipment_compatibility(asset=asset, ambient_temp_celsius=-40.0)


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
