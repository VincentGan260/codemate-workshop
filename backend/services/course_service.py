import json
from pathlib import Path

DATA_DIR = Path(__file__).parent.parent / "data"


def get_all_courses():
    with open(DATA_DIR / "courses.json", encoding="utf-8") as f:
        return json.load(f)


def get_course_by_id(course_id: str):
    data = get_all_courses()
    for course in data["courses"]:
        if course["id"] == course_id:
            return course
    return None
