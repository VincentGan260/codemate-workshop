DIAGNOSIS_QUESTIONS = [
    {
        "id": "dq-1",
        "question": "以下递归函数的输出是什么？\n\n```python\ndef f(n):\n    if n <= 1:\n        return 1\n    return n * f(n - 1)\nprint(f(4))\n```",
        "options": ["A. 4", "B. 12", "C. 24", "D. 120"],
        "correct": "C",
        "knowledge_point": "递归",
        "explanation": "f(4) = 4×f(3) = 4×3×f(2) = 4×3×2×f(1) = 4×3×2×1 = 24"
    },
    {
        "id": "dq-2",
        "question": "对于长度为 n 的数组 arr，访问 arr[n] 会导致什么？",
        "options": ["A. 返回最后一个元素", "B. 返回 undefined", "C. 数组越界错误", "D. 什么也不发生"],
        "correct": "C",
        "knowledge_point": "数组边界",
        "explanation": "数组索引从 0 开始，最后一个元素的索引是 n-1，arr[n] 访问了第 n+1 个元素，导致越界。"
    },
    {
        "id": "dq-3",
        "question": "二叉树的前序遍历顺序是什么？",
        "options": ["A. 左-根-右", "B. 根-左-右", "C. 左-右-根", "D. 根-右-左"],
        "correct": "B",
        "knowledge_point": "二叉树遍历",
        "explanation": "前序遍历(Pre-order)：先访问根节点，再遍历左子树，最后遍历右子树。顺序为 根-左-右。"
    }
]


def get_questions(count: int = 3):
    return DIAGNOSIS_QUESTIONS[:count]
