from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import json
import os

from backend.core.exceptions import (
    DomainError,
    CyclicDependencyError,
    SelfDependencyError,
    EntityNotFoundError,
    InvalidDependencyError,
    InvalidDisruptionError,
)
from backend.api.routes_system import router as system_router
from backend.api.routes_missions import router as missions_router
from backend.api.routes_cargo import router as cargo_router
from backend.api.routes_disruptions import router as disruptions_router
from backend.api.routes_sync import router as sync_router
from backend.api.routes_rag import router as rag_router
from backend.api.routes_expedition import router as expedition_router
from backend.persistence.database import init_db
from backend.persistence.seed import seed_database
from backend.rag.ingestion import ingest_sops_to_chroma


def env_flag(name: str, default: bool = False) -> bool:
    """Read a boolean environment variable with an explicit safe default."""
    return os.getenv(name, str(default)).strip().lower() in {"1", "true", "yes", "on"}


def load_cors_origins() -> list[str]:
    """Load CORS origins from JSON, with a comma-separated fallback."""
    raw_origins = os.getenv(
        "CORS_ORIGINS",
        '["http://localhost:5173","http://127.0.0.1:5173"]',
    ).strip()

    try:
        origins = json.loads(raw_origins)
        if isinstance(origins, list) and all(isinstance(origin, str) for origin in origins):
            return origins
    except json.JSONDecodeError:
        pass

    return [origin.strip() for origin in raw_origins.split(",") if origin.strip()]


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Always ensure tables exist. Destructive demo seeding and SOP indexing are opt-in.
    init_db()

    if env_flag("SEED_DATABASE"):
        seed_database()

    if env_flag("REINDEX_SOPS"):
        try:
            ingest_sops_to_chroma()
        except Exception as e:
            print("SOP ChromaDB ingestion warning:", e)

    yield


app = FastAPI(
    title="Aurora Command Platform API",
    description="Backend REST service and application boundary for Aurora Polar Expedition Command Platform",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=load_cors_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(CyclicDependencyError)
@app.exception_handler(SelfDependencyError)
@app.exception_handler(InvalidDependencyError)
def domain_conflict_exception_handler(request: Request, exc: DomainError):
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={"detail": str(exc), "error_type": exc.__class__.__name__},
    )


@app.exception_handler(EntityNotFoundError)
@app.exception_handler(InvalidDisruptionError)
def domain_not_found_exception_handler(request: Request, exc: DomainError):
    return JSONResponse(
        status_code=status.HTTP_404_NOT_FOUND,
        content={"detail": str(exc), "error_type": exc.__class__.__name__},
    )


app.include_router(system_router)
app.include_router(missions_router, prefix="/api/v1")
app.include_router(cargo_router, prefix="/api/v1")
app.include_router(disruptions_router, prefix="/api/v1")
app.include_router(sync_router, prefix="/api/v1")
app.include_router(rag_router, prefix="/api/v1")
app.include_router(expedition_router)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
