CODE_EXAMPLES = {
    "recursion": {
        "title": "递归：阶乘计算",
        "language": "Python",
        "code": '''def factorial(n: int) -> int:
    """
    计算 n 的阶乘，使用递归实现。
    递归出口：n <= 1 时返回 1。
    """
    if n <= 1:          # 递归出口
        return 1
    return n * factorial(n - 1)   # 递归调用


# 测试
print(factorial(4))  # 输出: 24
print(factorial(5))  # 输出: 120''',
        "explanation": "递归函数的两个关键部分：(1) 递归出口（base case），防止无限递归；(2) 递归调用，将大问题分解为小问题。每次调用都会在调用栈上创建一个新的栈帧。"
    },
    "binary-tree-traversal": {
        "title": "二叉树遍历（前序、中序、后序）",
        "language": "Python",
        "code": '''class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def preorder(root: TreeNode | None) -> list[int]:
    """前序遍历：根 → 左 → 右"""
    if root is None:
        return []
    return [root.val] + preorder(root.left) + preorder(root.right)


def inorder(root: TreeNode | None) -> list[int]:
    """中序遍历：左 → 根 → 右"""
    if root is None:
        return []
    return inorder(root.left) + [root.val] + inorder(root.right)


def postorder(root: TreeNode | None) -> list[int]:
    """后序遍历：左 → 右 → 根"""
    if root is None:
        return []
    return postorder(root.left) + postorder(root.right) + [root.val]


# 构建示例树:
#     1
#    / \\
#   2   3
#  / \\
# 4   5
root = TreeNode(1,
    TreeNode(2, TreeNode(4), TreeNode(5)),
    TreeNode(3)
)
print("前序:", preorder(root))   # [1, 2, 4, 5, 3]
print("中序:", inorder(root))    # [4, 2, 5, 1, 3]
print("后序:", postorder(root))  # [4, 5, 2, 3, 1]''',
        "explanation": "三种遍历方式的核心区别在于访问根节点的时机：前序最先访问根，中序在中间访问根，后序最后访问根。递归实现简洁优雅，体现了树结构的自相似性。"
    }
}


def get_code_example(topic: str):
    return CODE_EXAMPLES.get(topic)
