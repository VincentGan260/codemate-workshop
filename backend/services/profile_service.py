import json
from pathlib import Path

DATA_DIR = Path(__file__).parent.parent / "data"


def load_mock(name: str):
    with open(DATA_DIR / "mock_responses.json", encoding="utf-8") as f:
        data = json.load(f)
    return data.get(name, {})


def chat(message: str, history: list[dict] | None = None):
    """Mock profile chat — returns next question and extracted/missing fields."""
    return load_mock("profile_chat")


def generate_profile(profile_data: dict | None = None):
    """Mock profile generation — returns the default student profile."""
    with open(DATA_DIR / "default_profile.json", encoding="utf-8") as f:
        return json.load(f)
