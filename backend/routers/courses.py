from fastapi import APIRouter, HTTPException
from services import course_service

router = APIRouter()


@router.get("/courses")
def list_courses():
    return course_service.get_all_courses()


@router.get("/courses/{course_id}")
def get_course(course_id: str):
    course = course_service.get_course_by_id(course_id)
    if course is None:
        raise HTTPException(status_code=404, detail=f"Course '{course_id}' not found")
    return course
