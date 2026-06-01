from fastapi import APIRouter
from pydantic import BaseModel
from services import profile_service

router = APIRouter()


class ChatRequest(BaseModel):
    message: str
    history: list[dict] | None = None


class GenerateProfileRequest(BaseModel):
    profile_data: dict | None = None


@router.post("/profile/chat")
def profile_chat(req: ChatRequest):
    return profile_service.chat(req.message, req.history)


@router.post("/profile/generate")
def profile_generate(req: GenerateProfileRequest | None = None):
    return profile_service.generate_profile(req.profile_data if req else None)
