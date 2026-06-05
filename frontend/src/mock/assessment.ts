import type { DiagnosisQuestion, AssessmentResult, TutorChatResponse, ConversationContext } from '../types'
import type { PathResourceItem } from '../types'
import { loadPathResources } from '../utils/pathResources'

// ========== Challenge Question Type ==========

export interface ChallengeQuestion extends DiagnosisQuestion {
  level: number
  levelName: string
  source: '来自本轮提问' | '来自当前路径' | '来自我的资源包' | '来自画像易错点' | '系统综合推荐'
}

// ========== Challenge Result Type ==========

export interface ChallengeResult {
  totalLevels: number
  completedLevels: number
  correctCount: number
  score: number
  growth: { knowledge_base: number; practice_ability: number }
  badges: string[]
  wrongPoints: Array<{ knowledge_point: string; reason: string }>
  levelResults: Record<string, boolean>
}

// ========== Question Pool (tagged by knowledge domain) ==========

interface PoolQuestion {
  id: string
  levelName: string
  question: string
  options: string[]
  correct: string
  knowledge_point: string
  explanation: string
  tags: string[]
}

const QUESTION_POOL: PoolQuestion[] = [
  // --- recursion ---
  {
    id: 'q-rec-1', levelName: '递归出口判断', tags: ['recursion'],
    question: '递归函数中，基准情形（Base Case）的作用是什么？',
    options: ['A. 加速递归', 'B. 终止递归，防止无限调用', 'C. 创建新节点', 'D. 调整遍历顺序'], correct: 'B',
    knowledge_point: '递归出口', explanation: '基准情形是递归的停止条件，防止函数无限调用自身导致栈溢出。',
  },
  {
    id: 'q-rec-2', levelName: '调用栈理解', tags: ['recursion'],
    question: '每次递归调用时，函数信息存储在哪里？',
    options: ['A. 堆内存', 'B. 调用栈', 'C. 寄存器', 'D. 硬盘'], correct: 'B',
    knowledge_point: '调用栈', explanation: '每次递归调用在调用栈上压入一个栈帧，到达基准情形后逐层弹出返回。',
  },
  {
    id: 'q-rec-3', levelName: '递归深度判断', tags: ['recursion'],
    question: '递归深度过大时，最常见的问题是什么？',
    options: ['A. 程序运行更快', 'B. 栈溢出', 'C. 自动优化', 'D. 内存释放'], correct: 'B',
    knowledge_point: '递归深度', explanation: '递归过深时调用栈空间耗尽，触发栈溢出错误。Python 默认递归深度约 1000 层。',
  },
  {
    id: 'q-rec-4', levelName: '递归出口理解', tags: ['recursion', 'binary-tree'],
    question: '在二叉树递归遍历中，遇到空节点时通常应该怎么处理？',
    options: ['A. 继续访问左子树', 'B. 返回，不再继续递归', 'C. 创建新节点', 'D. 重复访问根节点'], correct: 'B',
    knowledge_point: '递归出口', explanation: '空节点是递归的基准情形。遇到时直接返回，终止当前分支，防止栈溢出。',
  },
  {
    id: 'q-rec-5', levelName: '递归实践', tags: ['recursion', 'function-call'],
    question: '以下阶乘函数 f(5) 的返回值是？\ndef f(n):\n    if n <= 1: return 1\n    return n * f(n - 1)',
    options: ['A. 15', 'B. 24', 'C. 120', 'D. 720'], correct: 'C',
    knowledge_point: '递归实践', explanation: 'f(5)=5×f(4)=5×4×3×2×1=120。每次递归 n 减 1，直到 n=1 触发出口。',
  },

  // --- binary-tree ---
  {
    id: 'q-bt-1', levelName: '前序遍历判断', tags: ['binary-tree'],
    question: '某二叉树根节点为 A，左子节点为 B，右子节点为 C。它的前序遍历结果是？',
    options: ['A. A B C', 'B. B A C', 'C. B C A', 'D. C B A'], correct: 'A',
    knowledge_point: '前序遍历', explanation: '前序遍历（根→左→右）：先访问根节点 A，再遍历左 B，最后右 C，结果为 A B C。',
  },
  {
    id: 'q-bt-2', levelName: '中序遍历判断', tags: ['binary-tree'],
    question: '对于根节点 A、左子节点 B、右子节点 C 的二叉树，中序遍历结果是？',
    options: ['A. A B C', 'B. B A C', 'C. B C A', 'D. C A B'], correct: 'B',
    knowledge_point: '中序遍历', explanation: '中序遍历（左→根→右）：先遍历左 B，再访问根 A，最后右 C，结果为 B A C。',
  },
  {
    id: 'q-bt-3', levelName: '后序遍历判断', tags: ['binary-tree'],
    question: '后序遍历的口诀是什么？',
    options: ['A. 根左右', 'B. 左根右', 'C. 左右根', 'D. 右左根'], correct: 'C',
    knowledge_point: '后序遍历', explanation: '后序遍历（左→右→根）：先递归左右子树，最后处理根节点。口诀"左右根"。',
  },
  {
    id: 'q-bt-4', levelName: '层序遍历理解', tags: ['binary-tree'],
    question: '层序遍历（广度优先遍历）使用什么数据结构辅助实现？',
    options: ['A. 栈', 'B. 队列', 'C. 优先队列', 'D. 数组'], correct: 'B',
    knowledge_point: '层序遍历', explanation: '层序遍历（BFS）使用队列实现，从上到下、从左到右逐层访问每个节点。',
  },
  {
    id: 'q-bt-5', levelName: '遍历选择判断', tags: ['binary-tree', 'recursion'],
    question: '二叉树遍历中，哪种遍历方式最适合"先处理子问题再汇总"的场景？',
    options: ['A. 前序遍历', 'B. 中序遍历', 'C. 后序遍历', 'D. 层序遍历'], correct: 'C',
    knowledge_point: '遍历应用', explanation: '后序遍历先处理左右子树再汇总到根节点，适合需要子问题结果汇总的场景，如计算树的高度。',
  },

  // --- array ---
  {
    id: 'q-arr-1', levelName: '数组下标判断', tags: ['array'],
    question: '在 Python 中，如果列表长度为 n，最后一个元素的下标是？',
    options: ['A. n', 'B. n - 1', 'C. n + 1', 'D. 1'], correct: 'B',
    knowledge_point: '数组下标', explanation: 'Python 列表索引从 0 开始，长度为 n 时有效下标为 0~n-1。',
  },
  {
    id: 'q-arr-2', levelName: '越界判断', tags: ['array'],
    question: '访问 arr[len(arr)] 会导致什么？',
    options: ['A. 返回最后一个元素', 'B. 返回 None', 'C. 抛出 IndexError', 'D. 返回 0'], correct: 'C',
    knowledge_point: '数组越界', explanation: 'len(arr) 超出了有效下标范围 0~len(arr)-1，访问 arr[len(arr)] 会导致越界错误。',
  },
  {
    id: 'q-arr-3', levelName: '循环条件设置', tags: ['array'],
    question: '遍历长度为 n 的数组，正确的循环写法是？',
    options: ['A. for i in range(n+1)', 'B. for i in range(n)', 'C. for i in range(1, n)', 'D. for i in range(-1, n-1)'], correct: 'B',
    knowledge_point: '循环条件', explanation: 'range(n) 生成 0 到 n-1 的整数序列，正好覆盖长度为 n 的数组所有下标。',
  },
  {
    id: 'q-arr-4', levelName: '边界条件判断', tags: ['array'],
    question: '在 while 循环中遍历数组，循环条件通常怎么写？',
    options: ['A. while i <= n', 'B. while i < n', 'C. while i > n', 'D. while i == n'], correct: 'B',
    knowledge_point: '边界条件', explanation: '用 while i < n 保证 i 从 0 到 n-1，不会越界。条件 i <= n 会导致访问 arr[n] 越界。',
  },
  {
    id: 'q-arr-5', levelName: '多维数组判断', tags: ['array'],
    question: '二维数组 arr[2][3] 表示什么？',
    options: ['A. 2个元素，每个是长度为3的数组', 'B. 3行2列的矩阵', 'C. 2行3列的矩阵', 'D. 6个独立元素'], correct: 'C',
    knowledge_point: '数组结构', explanation: 'arr[2][3] 表示 2 行 3 列的矩阵，外层有 2 个子数组，每个子数组有 3 个元素。',
  },

  // --- function-call ---
  {
    id: 'q-fc-1', levelName: '参数传递', tags: ['function-call'],
    question: 'Python 中，以下代码输出什么？\ndef f(x):\n    x = x + 1\n    return x\na = 5\nf(a)\nprint(a)',
    options: ['A. 5', 'B. 6', 'C. None', 'D. 报错'], correct: 'A',
    knowledge_point: '参数传递', explanation: 'Python 中整数是不可变对象，函数内 x 的修改不影响外部变量 a，print(a) 输出 5。',
  },
  {
    id: 'q-fc-2', levelName: '返回值判断', tags: ['function-call'],
    question: '以下代码输出什么？\ndef add(a, b):\n    return a + b\nresult = add(3, 4)\nprint(result)',
    options: ['A. None', 'B. 7', 'C. add(3,4)', 'D. 报错'], correct: 'B',
    knowledge_point: '返回值', explanation: 'add(3, 4) 返回 7，result 被赋值为 7，打印 7。',
  },
  {
    id: 'q-fc-3', levelName: '调用顺序', tags: ['function-call'],
    question: '以下代码的执行顺序是？\ndef a():\n    print("A")\ndef b():\n    a()\n    print("B")\nb()',
    options: ['A. A B', 'B. B A', 'C. A', 'D. B'], correct: 'A',
    knowledge_point: '调用顺序', explanation: 'b() 先调用 a() 打印 A，然后 b() 继续执行打印 B。输出 A B。',
  },
  {
    id: 'q-fc-4', levelName: '作用域判断', tags: ['function-call'],
    question: '函数内部定义的变量属于什么作用域？',
    options: ['A. 全局作用域', 'B. 局部作用域', 'C. 模块作用域', 'D. 内置作用域'], correct: 'B',
    knowledge_point: '作用域', explanation: '函数内部定义的变量是局部变量，只在函数内部有效，外部无法直接访问。',
  },
  {
    id: 'q-fc-5', levelName: '嵌套调用理解', tags: ['function-call'],
    question: '以下代码中，函数 f(3) 会被调用几次？\ndef f(n):\n    if n <= 1: return 1\n    return f(n-1) + f(n-1)',
    options: ['A. 3次', 'B. 4次', 'C. 7次', 'D. 8次'], correct: 'C',
    knowledge_point: '函数调用', explanation: 'f(3)→f(2)+f(2)，每个f(2)→f(1)+f(1)，共调用1次f(3)+2次f(2)+4次f(1)=7次。',
  },

  // --- debug ---
  {
    id: 'q-dbg-1', levelName: '错误定位', tags: ['debug'],
    question: '代码报错信息中通常包含什么？',
    options: ['A. 只有文件名', 'B. 错误类型、行号和堆栈信息', 'C. 只有行号', 'D. 只有错误描述'], correct: 'B',
    knowledge_point: '错误定位', explanation: 'Python 报错信息包含错误类型（如 IndexError）、出错行号和调用堆栈，帮助定位问题。',
  },
  {
    id: 'q-dbg-2', levelName: '递归错误判断', tags: ['debug', 'recursion'],
    question: 'RecursionError 通常表示什么？',
    options: ['A. 递归执行成功', 'B. 递归深度超过限制', 'C. 数组越界', 'D. 语法错误'], correct: 'B',
    knowledge_point: '递归错误', explanation: 'RecursionError 表示递归调用层数超过了 Python 的限制（默认约 1000 层），通常是缺少出口导致。',
  },
  {
    id: 'q-dbg-3', levelName: '调试策略', tags: ['debug'],
    question: '调试代码时，最有效的第一步通常是什么？',
    options: ['A. 重写整个代码', 'B. 仔细阅读报错信息和出错行', 'C. 重启电脑', 'D. 随机删除代码'], correct: 'B',
    knowledge_point: '调试策略', explanation: '先仔细阅读报错信息，定位出错行和错误类型，通常可以快速找到问题所在。',
  },
  {
    id: 'q-dbg-4', levelName: '边界测试', tags: ['debug', 'array'],
    question: '测试函数时，应该重点测试哪些输入？',
    options: ['A. 只有正常输入', 'B. 正常值、边界值和异常值', 'C. 只测边界值', 'D. 不需要测试'], correct: 'B',
    knowledge_point: '边界测试', explanation: '良好的测试应覆盖正常输入、边界条件（如空数组、n=0）和异常输入，确保函数健壮。',
  },
  {
    id: 'q-dbg-5', levelName: '调试技巧', tags: ['debug'],
    question: 'print 调试法指的是什么？',
    options: ['A. 打印所有代码', 'B. 在关键位置插入 print 输出中间值', 'C. 使用打印机输出', 'D. 删除所有 print'], correct: 'B',
    knowledge_point: '调试技巧', explanation: 'print 调试是最简单实用的方法，在关键变量处插入 print 语句，观察中间值是否符合预期。',
  },
]

const SOURCES: ChallengeQuestion['source'][] = [
  '来自本轮提问', '来自当前路径', '来自我的资源包', '来自画像易错点', '系统综合推荐',
]

// ========== Context Inference (Mock) ==========

export function inferConversationContextMock(userQuestion: string): ConversationContext {
  const resources = loadPathResources()
  const weakPoints = ['递归出口', '遍历顺序']

  const lower = userQuestion.toLowerCase()
  const topics: string[] = []

  if (lower.includes('递归') || lower.includes('调用栈')) topics.push('recursion')
  if (lower.includes('二叉树') || lower.includes('遍历') || lower.includes('前序') || lower.includes('中序') || lower.includes('后序')) topics.push('binary-tree')
  if (lower.includes('数组') || lower.includes('越界') || lower.includes('下标') || lower.includes('边界')) topics.push('array')
  if (lower.includes('函数') || lower.includes('调用') || lower.includes('参数') || lower.includes('返回值') || lower.includes('作用域')) topics.push('function-call')
  if (lower.includes('调试') || lower.includes('debug') || lower.includes('报错') || lower.includes('错误')) topics.push('debug')

  if (topics.length === 0) {
    topics.push('binary-tree', 'recursion')
  }

  const questionSummary = userQuestion
    ? (userQuestion.length > 20 ? userQuestion.slice(0, 20) + '…' : userQuestion)
    : '等待输入'

  return {
    currentQuestion: questionSummary,
    pathNode: '二叉树遍历代码实现',
    resourceCount: resources.length,
    weakPoints,
    inferredTopics: [...new Set(topics)],
  }
}

// ========== Challenge Generation from Context (Mock) ==========

export function generateChallengeByContextMock(context: ConversationContext): ChallengeQuestion[] {
  const { inferredTopics } = context

  // Score each pool question by how many tags match the inferred topics
  const scored = QUESTION_POOL.map((q) => ({
    ...q,
    score: q.tags.filter((t) => inferredTopics.includes(t)).length,
  }))

  // Sort by relevance (most matching tags first), then pick top 5
  scored.sort((a, b) => b.score - a.score)

  const selected: ChallengeQuestion[] = []
  const usedIds = new Set<string>()

  for (let i = 0; i < scored.length && selected.length < 5; i++) {
    const q = scored[i]
    if (usedIds.has(q.id)) continue
    usedIds.add(q.id)
    selected.push({
      id: q.id,
      level: selected.length + 1,
      levelName: q.levelName,
      source: SOURCES[selected.length],
      question: q.question,
      options: q.options,
      correct: q.correct,
      knowledge_point: q.knowledge_point,
      explanation: q.explanation,
    })
  }

  return selected
}

// ========== Contextual Example Questions (Mock) ==========

export function getContextualExampleQuestions(context: ConversationContext): string[] {
  const { inferredTopics, resourceCount } = context

  const questions: string[] = []

  if (inferredTopics.includes('binary-tree') || inferredTopics.includes('recursion')) {
    questions.push('二叉树遍历代码应该怎么写？')
    questions.push('前序、中序、后序遍历有什么区别？')
  }

  if (resourceCount > 0) {
    questions.push('我加入的资源应该先学哪一个？')
  }

  if (inferredTopics.includes('recursion') || context.weakPoints.some((w) => w.includes('递归'))) {
    questions.push('为什么递归函数一定要有出口？')
  }

  if (inferredTopics.includes('array') || context.weakPoints.some((w) => w.includes('数组') || w.includes('边界'))) {
    questions.push('如何避免数组越界？')
  }

  if (inferredTopics.includes('function-call')) {
    questions.push('函数调用时参数是怎么传递的？')
  }

  if (questions.length < 4) {
    const fallbacks = [
      '递归和迭代有什么区别？',
      '能不能结合我的资源包讲一下调用栈？',
      '我应该按什么顺序学习这些知识点？',
      '二叉树的层序遍历有什么用？',
    ]
    for (const fb of fallbacks) {
      if (questions.length >= 5) break
      if (!questions.includes(fb)) questions.push(fb)
    }
  }

  return questions.slice(0, 5)
}

// ========== Resource Recommendation from Context (Mock) ==========

export function recommendResourcesByContextMock(context: ConversationContext): Array<{
  title: string
  type: string
  estimatedTime: string
  topic: string
}> {
  const resources = loadPathResources()
  const { inferredTopics, weakPoints } = context

  // First, check localStorage resources for matches
  const matchedFromPackage: Array<{ title: string; type: string; estimatedTime: string; topic: string }> = []

  for (const res of resources) {
    const text = (res.title + res.topic + res.type).toLowerCase()
    const matches = inferredTopics.some((t) => {
      const kwMap: Record<string, string[]> = {
        'recursion': ['递归', '调用栈', '出口'],
        'binary-tree': ['二叉树', '遍历', '树'],
        'array': ['数组', '下标', '越界', '边界'],
        'function-call': ['函数', '调用', '参数', '返回'],
        'debug': ['调试', 'debug', '错误', '报错'],
      }
      return (kwMap[t] || []).some((kw) => text.includes(kw))
    })
    if (matches) {
      matchedFromPackage.push({
        title: res.title,
        type: res.type,
        estimatedTime: res.estimatedTime,
        topic: res.topic,
      })
    }
  }

  if (matchedFromPackage.length > 0) {
    return matchedFromPackage.slice(0, 3)
  }

  // Fallback: default mock recommendations based on context
  const defaults: Array<{ title: string; type: string; estimatedTime: string; topic: string }> = []

  if (inferredTopics.includes('binary-tree') || inferredTopics.includes('recursion')) {
    defaults.push(
      { title: '二叉树遍历个性化讲解文档', type: '个性化讲解文档', estimatedTime: '20 分钟', topic: '二叉树遍历' },
      { title: '递归图解讲义', type: '个性化讲解文档', estimatedTime: '20 分钟', topic: '递归调用栈' },
      { title: 'Python 代码示例与注释', type: '代码示例与注释', estimatedTime: '25 分钟', topic: '二叉树遍历' },
    )
  } else {
    defaults.push(
      { title: `${weakPoints[0] || '基础知识'}个性化讲解文档`, type: '个性化讲解文档', estimatedTime: '20 分钟', topic: weakPoints[0] || '综合' },
      { title: 'Python 代码示例与注释', type: '代码示例与注释', estimatedTime: '25 分钟', topic: '综合辅导' },
    )
  }

  return defaults
}

// ========== Challenge Result Generator ==========

export function generateChallengeResult(answers: Record<string, string>, questions: ChallengeQuestion[]): ChallengeResult {
  let correct = 0
  const wrongPoints: Array<{ knowledge_point: string; reason: string }> = []
  const levelResults: Record<string, boolean> = {}

  for (const q of questions) {
    const isCorrect = answers[q.id] === q.correct
    levelResults[q.id] = isCorrect
    if (isCorrect) correct++
    else wrongPoints.push({ knowledge_point: q.knowledge_point, reason: q.explanation })
  }

  const total = questions.length
  const score = Math.round((correct / total) * 100)
  const allCorrect = correct === total

  return {
    totalLevels: total, completedLevels: Object.keys(answers).length, correctCount: correct, score,
    growth: { knowledge_base: allCorrect ? 5 : correct * 2, practice_ability: allCorrect ? 4 : Math.max(1, correct) },
    badges: allCorrect ? ['知识闯关达人'] : correct >= 3 ? ['继续前进'] : [],
    wrongPoints, levelResults,
  }
}

// ========== Tutor Chat Responses ==========

function getComprehensiveResponse(): TutorChatResponse {
  return {
    greeting: '好的，我来帮你梳理一下当前的整体学习情况！',
    approach: '根据你的学习画像，我会从你最需要加强的"递归出口"和"遍历顺序"入手，帮你制定综合提升计划。',
    steps: [
      '第一步：优先巩固递归概念和调用栈理解——这是二叉树遍历的基础，也是后续数据结构课程的核心。',
      '第二步：掌握数组操作和循环条件设置——这是编程基本功，几乎所有算法题都会用到。',
      '第三步：深入理解函数调用机制——参数传递、返回值、作用域、调用顺序，为学习更复杂的算法打基础。',
      '第四步：最后练习代码调试，学会定位和理解错误——这项能力会让你独立解决大部分编程问题。',
    ],
    code_example: null,
    recommended_resources: [
      { title: '递归图解讲义', url: '#' },
      { title: '二叉树遍历个性化讲解文档', url: '#' },
      { title: '分层练习题', url: '#' },
    ],
    suggested_exercise: '按照以上顺序逐一学习，每完成一个知识点就完成对应的闯关挑战，最后完成综合代码调试练习。',
  }
}

const TUTOR_RESPONSES: Record<string, TutorChatResponse> = {
  '递归为什么能遍历二叉树': {
    greeting: '别急，这个问题很常见！你偏好图示和代码案例，所以我先用"调用栈"来帮你直观理解。',
    approach: '根据你的学习画像（图示优先 + 代码示例驱动），我会结合图示和代码来解释递归遍历的本质。',
    steps: [
      '第一步：把二叉树想象成"嵌套的套娃"——每个节点本身是一个小二叉树，有左子树和右子树。',
      '第二步：递归函数只做一件事：访问当前节点，然后把"遍历左子树"和"遍历右子树"这两个同样的任务交给下一层。',
      '第三步：每次递归调用都会在调用栈上压入一个新栈帧。以一棵 3 节点树为例，前序遍历的调用顺序是：访问 A → 递归左 B → 递归右 C。',
      '第四步：当遇到叶子节点（左右子树为空），递归出口被触发，调用栈开始逐层弹出，回溯到上一层。',
    ],
    code_example: 'def preorder(root):\n    if root is None:      # 递归出口\n        return\n    print(root.val)        # 访问当前节点\n    preorder(root.left)    # 递归左子树\n    preorder(root.right)   # 递归右子树',
    recommended_resources: [
      { title: '二叉树遍历个性化讲解文档', url: '#' },
      { title: 'Python 代码示例与注释', url: '#' },
    ],
    suggested_exercise: '接下来可以试试闯关评估第 1 关：前序遍历判断。',
  },
  '前序中序后序的区别': {
    greeting: '这三个顺序很多同学一开始都会混淆，不用担心！我们来用一个简单的方法记住它们。',
    approach: '根据你图示优先的学习风格，我用"根节点的访问时机"作为核心记忆点。',
    steps: [
      '第一步：记住关键——"前/中/后"指的是根节点在第几位被访问。',
      '第二步：前序遍历（根→左→右）：先处理根，再递归左右。记忆口诀："根左右"。',
      '第三步：中序遍历（左→根→右）：先递归左子树，再处理根，最后递归右子树。记忆口诀："左根右"。',
      '第四步：后序遍历（左→右→根）：先递归左右子树，最后处理根。记忆口诀："左右根"。',
    ],
    code_example: '# 以 A-B-C 三节点树为例：\n# 前序：A → B → C  (根左右)\n# 中序：B → A → C  (左根右)\n# 后序：B → C → A  (左右根)',
    recommended_resources: [
      { title: '二叉树遍历思维导图', url: '#' },
      { title: '分层练习题', url: '#' },
    ],
    suggested_exercise: '接下来可以试试闯关评估第 3 关：中序遍历判断。',
  },
  '为什么递归函数一定要有出口': {
    greeting: '问得好！这个问题触及了递归最核心的概念。',
    approach: '用你的编程经验来类比：递归就像循环，而"出口"就是循环的终止条件。没有终止条件就是死循环。',
    steps: [
      '第一步：递归出口就是"基准情形"——最简单、不需要再递归的情况。',
      '第二步：没有出口会发生什么？每次递归调用都会压入一个栈帧。没有出口，调用栈无限增长，最终导致栈溢出。',
      '第三步：在二叉树遍历中，出口是"遇到空节点"。走到叶子节点的子节点时它是 None，直接 return。',
      '第四步：理解记忆——"出口就是告诉递归：你已经走到头了，停止往下走，开始往回返。"',
    ],
    code_example: 'def factorial(n):\n    if n <= 1:         # ← 这就是出口！\n        return 1\n    return n * factorial(n - 1)',
    recommended_resources: [
      { title: '递归图解讲义', url: '#' },
      { title: '二叉树遍历代码示例', url: '#' },
    ],
    suggested_exercise: '接下来可以试试闯关评估的递归出口理解题。',
  },
  '二叉树遍历代码应该怎么写': {
    greeting: '写遍历代码其实有固定的"模板"，掌握了模板就很好写了！',
    approach: '你喜欢代码案例学习，所以我会直接给出完整的 Python 模板，每行都有中文注释。',
    steps: [
      '第一步：定义二叉树节点类 TreeNode，包含 val、left、right 三个属性。',
      '第二步：写递归遍历函数，记住三步公式：判断出口 → 访问当前 → 递归子树。',
      '第三步：前/中/后序的区别仅在于"访问当前节点"这一行代码的位置。',
      '第四步：写出测试用例，手动验证输出是否正确。',
    ],
    code_example: 'class TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n\nroot = TreeNode("A", TreeNode("B"), TreeNode("C"))\n\ndef preorder(root):\n    if root is None: return\n    print(root.val, end=" ")   # 根\n    preorder(root.left)         # 左\n    preorder(root.right)        # 右\n# 输出: A B C',
    recommended_resources: [
      { title: 'Python 代码示例与注释', url: '#' },
      { title: '分层练习题 - 代码补全', url: '#' },
    ],
    suggested_exercise: '在编辑器中运行代码，修改 print 的位置分别实现中序和后序遍历，对比输出。',
  },
}

function matchQuestion(input: string): string {
  const lower = input.toLowerCase()
  if (lower.includes('综合') || lower.includes('补哪') || lower.includes('安排') || lower.includes('复习顺序') || lower.includes('应该先') || lower.includes('怎么继续')) return '__comprehensive__'
  if (lower.includes('递归') && (lower.includes('遍历') || lower.includes('二叉树'))) return '递归为什么能遍历二叉树'
  if (lower.includes('前序') || lower.includes('中序') || lower.includes('后序') || lower.includes('区别')) return '前序中序后序的区别'
  if (lower.includes('出口') || lower.includes('为什么递归')) return '为什么递归函数一定要有出口'
  if (lower.includes('代码') || lower.includes('怎么写')) return '二叉树遍历代码应该怎么写'
  if (lower.includes('遍历')) return '前序中序后序的区别'
  if (lower.includes('递归')) return '递归为什么能遍历二叉树'
  if (lower.includes('数组') || lower.includes('下标') || lower.includes('越界') || lower.includes('边界')) return '__comprehensive__'
  if (lower.includes('函数') || lower.includes('调用') || lower.includes('参数') || lower.includes('返回')) return '__comprehensive__'
  if (lower.includes('调试') || lower.includes('debug') || lower.includes('报错') || lower.includes('错误')) return '__comprehensive__'
  return '__comprehensive__'
}

export function getTutorResponse(input: string): TutorChatResponse {
  const key = matchQuestion(input)
  if (key === '__comprehensive__') return getComprehensiveResponse()
  return TUTOR_RESPONSES[key] || getComprehensiveResponse()
}

// ========== LLM-ready stubs (TODO) ==========

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function inferConversationContextWithLLM(_userQuestion: string, _pathNode: string, _resources: PathResourceItem[], _profile: Record<string, unknown>): Promise<ConversationContext> {
  // TODO: Call LLM to analyze user question and return structured context
  throw new Error('Not implemented — use inferConversationContextMock for now')
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function generateChallengeWithLLM(_context: ConversationContext): Promise<ChallengeQuestion[]> {
  // TODO: Call LLM to generate personalized challenge questions
  throw new Error('Not implemented — use generateChallengeByContextMock for now')
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function recommendResourcesWithLLM(_context: ConversationContext): Promise<Array<{ title: string; type: string; estimatedTime: string; topic: string }>> {
  // TODO: Call LLM to recommend resources based on context
  throw new Error('Not implemented — use recommendResourcesByContextMock for now')
}

// ========== Default Recommended Resources ==========

export const DEFAULT_RECOMMENDED_RESOURCES = [
  { title: '二叉树遍历个性化讲解文档', type: '个性化讲解文档', estimatedTime: '20 分钟', topic: '二叉树遍历' },
  { title: 'Python 代码示例与注释', type: '代码示例与注释', estimatedTime: '25 分钟', topic: '二叉树遍历' },
  { title: '分层练习题', type: '分层练习题', estimatedTime: '45 分钟', topic: '二叉树遍历' },
]

// ========== Backward-compatible exports for api.ts ==========

export const mockQuestions: DiagnosisQuestion[] = (() => {
  const ctx = inferConversationContextMock('')
  return generateChallengeByContextMock(ctx)
})()

export const mockAssessmentResult: AssessmentResult = {
  score: 85,
  total: 100,
  growth: { knowledge_base: 8, practice_ability: 6 },
  badges: ['递归新手', '遍历达人'],
  remedial_resources: [
    { knowledge_point: '递归出口', reason: '递归终止条件判断有误' },
    { knowledge_point: '遍历顺序', reason: '中序与前序概念混淆' },
  ],
}

export const mockTutorResponse: TutorChatResponse = {
  greeting: '你好！这是一个很好的问题。',
  approach: '让我们从基础概念开始，逐步深入理解。',
  steps: ['理解基本定义', '观察代码执行过程', '总结规律'],
  code_example: 'def example():\n    print("Hello World")\n    return True',
  recommended_resources: [
    { title: '二叉树遍历图解', url: '/resources/binary-tree' },
    { title: 'Python 递归练习', url: '/resources/recursion-practice' },
  ],
  suggested_exercise: '尝试用递归方式实现二叉树的前序遍历。',
}
