import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    APP_NAME: str = "CodeMate 智学工坊"
    APP_VERSION: str = "0.1.0"
    LLM_PROVIDER: str = os.getenv("LLM_PROVIDER", "mock")
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./codemate.db")
    CORS_ORIGINS: list[str] = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:3000").split(",")


settings = Settings()
