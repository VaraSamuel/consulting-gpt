# consulting-gpt-backend/main.py
from contextlib import asynccontextmanager
import inspect
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.concurrency import run_in_threadpool

from app.api.v1 import patents, technologies
from app.db.database import SessionLocal
from app.db.init_data import init_dental_fees, init_medical_associations


async def _run_maybe_async(fn, *args, **kwargs):
    """Run fn whether it's async or sync."""
    if inspect.iscoroutinefunction(fn):
        return await fn(*args, **kwargs)
    return await run_in_threadpool(fn, *args, **kwargs)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # ----- Startup -----
    db = SessionLocal()
    try:
        # Works if these are async OR regular functions
        await _run_maybe_async(init_dental_fees, db)
        await _run_maybe_async(init_medical_associations, db)
    finally:
        db.close()

    # App is running
    yield

    # ----- Shutdown -----
    # (Add any teardown you need)
    pass


app = FastAPI(
    title="Consulting GPT API",
    description="Backend API for Consulting GPT application",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS — relax during bring-up; tighten to your frontend origin in prod
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],            # TODO: set to ["https://your-frontend-domain"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health endpoint used by Docker/ Railway healthcheck
@app.get("/health")
def health():
    return {"ok": True}

# Routers
app.include_router(patents.router, prefix="/api/v1/patents", tags=["patents"])
app.include_router(technologies.router, prefix="/api/v1/technologies", tags=["technologies"])

@app.get("/")
async def root():
    return {"message": "Welcome to Consulting GPT API"}


if __name__ == "__main__":
    # For local dev only; Railway uses the container CMD
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
