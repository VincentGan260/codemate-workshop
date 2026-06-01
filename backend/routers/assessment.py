from fastapi import APIRouter
from pydantic import BaseModel
from services import assessment_service, diagnosis_service

router = APIRouter()


class SubmitAnswersRequest(BaseModel):
    answers: list[dict]


@router.get("/assessment/questions")
def get_questions(count: int = 3):
    """Return diagnosis questions for the assessment page."""
    return {"questions": diagnosis_service.get_questions(count)}


@router.post("/assessment/submit")
def submit_answers(req: SubmitAnswersRequest):
    return assessment_service.submit_answers(req.answers)
