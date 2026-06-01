from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import settings
from database import init_db
from routers import profile, courses, resources, path, tutor, assessment

app = FastAPI(title=settings.APP_NAME, version=settings.APP_VERSION)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(profile.router, prefix="/api", tags=["profile"])
app.include_router(courses.router, prefix="/api", tags=["courses"])
app.include_router(resources.router, prefix="/api", tags=["resources"])
app.include_router(path.router, prefix="/api", tags=["path"])
app.include_router(tutor.router, prefix="/api", tags=["tutor"])
app.include_router(assessment.router, prefix="/api", tags=["assessment"])


@app.on_event("startup")
def on_startup():
    init_db()


@app.get("/api/health")
def health_check():
    return {
        "status": "ok",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "llm_provider": settings.LLM_PROVIDER,
    }
