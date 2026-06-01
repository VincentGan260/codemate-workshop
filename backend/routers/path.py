from fastapi import APIRouter
from pydantic import BaseModel
from services import path_service

router = APIRouter()


class PathGenerateRequest(BaseModel):
    student_profile: dict | None = None


@router.post("/path/generate")
def generate_path(req: PathGenerateRequest | None = None):
    return path_service.generate_path(req.student_profile if req else None)
