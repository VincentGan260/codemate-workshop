from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class TutorChatRequest(BaseModel):
    message: str
    student_profile: dict | None = None
    history: list[dict] | None = None


@router.post("/tutor/chat")
def tutor_chat(req: TutorChatRequest):
    """Mock tutor chat — returns a structured tutoring response."""
    return {
        "greeting": "李同学你好！😊",
        "approach": "根据你图示优先的学习风格，我会用图解配合代码示例来讲解。",
        "steps": [
            "我们先从概念出发，理解问题的本质。",
            "然后看一个直观的图示。",
            "接着是代码实现，每行都有注释。",
            "最后用一个练习来检验理解。"
        ],
        "code_example": None,
        "recommended_resources": [
            {"title": "递归调用栈图解", "url": "#"},
            {"title": "二叉树遍历动画演示", "url": "#"}
        ],
        "suggested_exercise": "请试着画出 f(3) 递归调用时的调用栈变化。"
    }
