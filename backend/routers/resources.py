from fastapi import APIRouter
from pydantic import BaseModel
from services import resource_service

router = APIRouter()


class ResourceGenerateRequest(BaseModel):
    course_id: str
    knowledge_point: str
    difficulty: str = "入门"
    language: str = "Python"
    resource_types: list[str] | None = None


@router.post("/resources/generate")
def generate_resources(req: ResourceGenerateRequest):
    return resource_service.generate_resources(
        req.course_id, req.knowledge_point, req.difficulty, req.language, req.resource_types
    )
