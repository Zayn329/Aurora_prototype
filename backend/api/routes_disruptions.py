from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from backend.persistence.database import get_session
from backend.core.models import (
    Disruption,
    Station,
    Mission,
    Cargo,
    Asset,
    Personnel,
    Dependency,
    CargoStatus,
)
from backend.core.graph_solver import GraphSolver, ImpactSet
from backend.core.exceptions import EntityNotFoundError, InvalidDisruptionError
from backend.api.schemas import DisruptionCreate

router = APIRouter(prefix="/disruptions", tags=["Disruptions"])


@router.post("", response_model=ImpactSet, status_code=status.HTTP_201_CREATED)
def record_disruption_and_analyze_impact(
    payload: DisruptionCreate, session: Session = Depends(get_session)
):
    """
    Ingests a disruption event (e.g., Cargo Delay), updates target entity status in SQLite,
    and invokes the Phase 2 NetworkX GraphSolver to calculate deterministic impact analysis.
    """
    # 1. Update target cargo delay parameter if target is Cargo
    cargo = session.get(Cargo, payload.entity_id)
    if cargo:
        cargo.delay_hours = payload.delay_hours
        if payload.delay_hours > 0:
            cargo.status = CargoStatus.DELAYED
        session.add(cargo)

    # 2. Persist disruption incident log
    disruption = Disruption(**payload.model_dump())
    session.add(disruption)
    session.commit()
    session.refresh(disruption)

    # 3. Load full state graph from SQLite
    state_entities = {}
    for model in [Station, Mission, Cargo, Asset, Personnel]:
        for item in session.exec(select(model)).all():
            state_entities[item.id] = item

    dependencies = session.exec(select(Dependency)).all()

    # 4. Invoke Phase 2 GraphSolver
    try:
        solver = GraphSolver(dependencies, state_entities)
        impact_set = solver.analyze_disruption(disruption)
        return impact_set
    except (EntityNotFoundError, InvalidDisruptionError) as err:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(err),
        )
