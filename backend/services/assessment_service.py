from services import profile_service


def submit_answers(answers: list[dict]):
    """Mock assessment submission — returns preset results."""
    return profile_service.load_mock("assessment")
