from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

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

app = FastAPI(
    title="Aurora Command Platform API",
    description="Backend REST service and application boundary for Aurora Polar Expedition Command Platform",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exception handlers mapping domain errors to HTTP statuses
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


# Include API routers under /api/v1 prefix
app.include_router(system_router)
app.include_router(missions_router, prefix="/api/v1")
app.include_router(cargo_router, prefix="/api/v1")
app.include_router(disruptions_router, prefix="/api/v1")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
