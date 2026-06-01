from services import profile_service


def generate_resources(course_id: str, knowledge_point: str, difficulty: str, language: str, resource_types: list[str] | None = None):
    """Mock resource generation — returns preset resource cards."""
    return profile_service.load_mock("resources")
