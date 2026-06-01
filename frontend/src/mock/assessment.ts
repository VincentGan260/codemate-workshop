import type { DiagnosisQuestion, AssessmentResult, TutorChatResponse } from '../types'

export const mockQuestions: DiagnosisQuestion[] = [
  {
    id: 'dq-1',
    question: '以下递归函数的输出是什么？\n\ndef f(n):\n    if n <= 1:\n        return 1\n    return n * f(n - 1)\nprint(f(4))',
    options: ['A. 4', 'B. 12', 'C. 24', 'D. 120'],
    correct: 'C',
    knowledge_point: '递归',
    explanation: 'f(4) = 4×f(3) = 4×3×f(2) = 4×3×2×f(1) = 4×3×2×1 = 24',
  },
  {
    id: 'dq-2',
    question: '对于长度为 n 的数组 arr，访问 arr[n] 会导致什么？',
    options: ['A. 返回最后一个元素', 'B. 返回 undefined', 'C. 数组越界错误', 'D. 什么也不发生'],
    correct: 'C',
    knowledge_point: '数组边界',
    explanation: '数组索引从 0 开始，最后一个元素的索引是 n-1，arr[n] 访问了第 n+1 个元素，导致越界。',
  },
  {
    id: 'dq-3',
    question: '二叉树的前序遍历顺序是什么？',
    options: ['A. 左-根-右', 'B. 根-左-右', 'C. 左-右-根', 'D. 根-右-左'],
    correct: 'B',
    knowledge_point: '二叉树遍历',
    explanation: '前序遍历(Pre-order)：先访问根节点，再遍历左子树，最后遍历右子树。',
  },
]

export const mockAssessmentResult: AssessmentResult = {
  score: 75,
  total: 100,
  growth: { knowledge_base: 5, practice_ability: 4 },
  badges: ['二叉树探索者'],
  remedial_resources: [
    { knowledge_point: '递归出口', reason: '2道题目均与递归边界条件有关' },
    { knowledge_point: '遍历顺序', reason: '后序遍历顺序需加强练习' },
  ],
}

export const mockTutorResponse: TutorChatResponse = {
  greeting: '李同学你好！😊',
  approach: '根据你图示优先的学习风格，我会用图解配合代码示例来讲解。',
  steps: [
    '我们先从概念出发，理解问题的本质。',
    '然后看一个直观的图示来建立空间想象。',
    '接着是代码实现，每行都有详细注释。',
    '最后用一个练习来检验你的理解。',
  ],
  code_example: null,
  recommended_resources: [
    { title: '递归调用栈图解', url: '#' },
    { title: '二叉树遍历动画演示', url: '#' },
  ],
  suggested_exercise: '请试着画出 f(3) 递归调用时的调用栈变化图。',
}
