import type { StudentProfile, ProfileChatResponse } from '../types'

export const mockProfileChat: ProfileChatResponse = {
  message: '李同学你好！我是你的学习伙伴 CodeBuddy 🎓 让我们从了解你开始吧～你目前在学哪几门课程呢？',
  extracted_fields: {},
  missing_fields: [
    'current_courses', 'completed_courses', 'knowledge_basis',
    'learning_difficulty', 'programming_languages', 'learning_style',
    'learning_goals', 'resource_preference',
  ],
}

export const mockStudentProfile: StudentProfile = {
  student: {
    name: '李同学',
    grade: '大二',
    major: '计算机科学与技术',
    background:
      '正在学习程序设计基础和数据结构与算法，会一些 Python 和 C 语言基础，但对函数调用过程、递归、数组操作和二叉树遍历理解不够清晰。',
  },
  profile: {
    knowledge_base: {
      label: '知识基础',
      stars: 3,
      score: 62,
      max_score: 100,
      note: '待诊断题校准',
    },
    practice_ability: {
      label: '实践能力',
      stars: 3,
      score: 58,
      max_score: 100,
      note: '待代码练习校准',
    },
    cognitive_style: {
      label: '认知风格',
      tags: ['图示优先', '示例驱动', '分步骤解释'],
    },
    weak_points: {
      label: '易错点特征',
      tags: ['递归出口', '函数调用顺序', '数组边界', '遍历顺序'],
    },
    learning_goals: {
      label: '学习目标',
      tags: ['掌握递归', '掌握数组和二叉树遍历', '完成课程练习'],
    },
    resource_preferences: {
      label: '资源偏好',
      tags: ['代码案例', '思维导图', '分层练习题', '简洁讲义'],
    },
  },
}
