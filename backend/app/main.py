import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import courts, bookings, admin
from app.supabase_client import get_supabase_client

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger("picklesync.main")


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info(f"Starting {settings.PROJECT_NAME} v{settings.VERSION} on port {settings.PORT}")
    supabase = get_supabase_client()
    if supabase:
        logger.info("Supabase client initialized.")
    else:
        logger.info("Supabase credentials not configured in .env. Running in dual-mode fallback.")
    yield
    logger.info("Shutting down PickleSync API.")


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="FastAPI + Supabase backend for PickleSync court booking and club administration.",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS Configuration for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API v1 Routers
app.include_router(courts.router, prefix="/api/v1")
app.include_router(bookings.router, prefix="/api/v1")
app.include_router(admin.router, prefix="/api/v1")


@app.get("/", tags=["Health"])
def root():
    return {
        "name": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs": "/docs",
        "status": "healthy",
    }


@app.get("/health", tags=["Health"])
def health_check():
    return {
        "status": "online",
        "supabase_configured": bool(settings.SUPABASE_URL and settings.SUPABASE_KEY),
    }

