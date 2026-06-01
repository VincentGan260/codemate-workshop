from services import profile_service


def generate_path(student_profile: dict | None = None):
    """Mock path generation — returns the default learning path."""
    return profile_service.load_mock("path")
