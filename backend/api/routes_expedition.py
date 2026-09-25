import json
import os
from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/api/v1/expedition", tags=["Expedition Dataset"])

DATASET_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data", "bharati_mission_dataset.json")


def load_dataset() -> dict:
    if not os.path.exists(DATASET_PATH):
        raise HTTPException(status_code=404, detail="Bharati mission dataset not found.")
    with open(DATASET_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


@router.get("")
def get_full_expedition_dataset():
    """Returns the complete unified Bharati Research Station demonstration dataset."""
    return load_dataset()


@router.get("/overview")
def get_expedition_overview():
    """Returns mission overview, station metadata, and unified KPIs."""
    data = load_dataset()
    return data.get("overview", {})


@router.get("/routes")
def get_expedition_routes():
    """Returns all 9 active operational routes and traversal safety statuses."""
    data = load_dataset()
    return data.get("routes", [])


@router.get("/environmental")
def get_environmental_timeseries(limit: int = 100):
    """Returns time-series weather and polar environmental sensor data."""
    data = load_dataset()
    series = data.get("environmental_timeseries", [])
    return series[-limit:] if limit else series


@router.get("/alerts")
def get_expedition_alerts():
    """Returns all operational alerts including active, investigating, and resolved."""
    data = load_dataset()
    return data.get("alerts", [])


@router.get("/incidents")
def get_expedition_incidents():
    """Returns expedition incidents with focus on active route hazard INC-004."""
    data = load_dataset()
    return data.get("incidents", [])


@router.get("/causality")
def get_causality_chain():
    """Returns the connected causality chain: Environment -> Route -> Mission -> Personnel -> Asset -> Logistics -> AI -> Action."""
    data = load_dataset()
    return data.get("causality_chain", {})
