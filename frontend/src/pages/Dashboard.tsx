import { useEffect, useState } from 'react'
import { Sparkles, BookOpen, GitBranch, Users, Zap, ArrowRight } from 'lucide-react'
import { getCourses } from '../services/api'
import type { Course } from '../types'

const agents = [
  'Profile Agent', 'Course Map Agent', 'Diagnosis Agent', 'Resource Agent',
  'Code Practice Agent', 'Path Planning Agent', 'Assessment Agent',
]

const flowSteps = [
  { label: '多轮对话', icon: Users },
  { label: '画像生成', icon: Sparkles },
  { label: '课程诊断', icon: Zap },
  { label: '资源生成', icon: File },
  { label: '路径规划', icon: GitBranch },
  { label: '辅导评估', icon: Clipboard },
]

// Inline Clipboard icon component
function Clipboard() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
      <path d="M9 14h6"/><path d="M9 18h3"/>
    </svg>
  )
}

function File() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>
    </svg>
  )
}

export default function Dashboard() {
  const [courses, setCourses] = useState<Course[]>([])

  useEffect(() => {
    getCourses().then((res) => setCourses(res.courses)).catch(() => {})
  }, [])

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      {/* Hero */}
      <section className="text-center py-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-50 text-primary-700 text-sm font-medium mb-4">
          <Sparkles className="w-4 h-4" />
          CodeBuddy 在线陪伴学习
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">CodeMate 智学工坊</h1>
        <p className="text-gray-500 text-base max-w-2xl mx-auto">
          面向计算机科学与技术专业课程群的个性化学习资源智能体平台——通过 CodeBuddy 多轮对话构建画像、生成资源、规划路径并辅导评估。
        </p>
      </section>

      {/* Course Overview */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-primary-600" />
          <h2 className="text-lg font-semibold text-gray-800">课程群概览</h2>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {courses.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-shadow border border-gray-100"
            >
              <h3 className="font-semibold text-gray-800 mb-1">{c.name}</h3>
              <p className="text-xs text-gray-400 mb-2">{c.stage} · {c.knowledge_points.length} 个核心知识点</p>
              <p className="text-sm text-gray-500 line-clamp-2">{c.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* System Flow */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <GitBranch className="w-5 h-5 text-primary-600" />
          <h2 className="text-lg font-semibold text-gray-800">系统流程</h2>
        </div>
        <div className="flex items-center justify-between bg-white rounded-2xl p-6 shadow-card border border-gray-100">
          {flowSteps.map((step, i) => (
            <div key={step.label} className="flex items-center gap-2">
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-primary-600">
                    <step.icon />
                  </span>
                </div>
                <span className="text-xs text-gray-600 font-medium">{step.label}</span>
              </div>
              {i < flowSteps.length - 1 && (
                <ArrowRight className="w-4 h-4 text-gray-300 mx-1" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Agents */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-primary-600" />
          <h2 className="text-lg font-semibold text-gray-800">多智能体协作</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {agents.map((agent) => (
            <span
              key={agent}
              className="px-3 py-1.5 bg-white rounded-full text-sm text-gray-600 shadow-card border border-gray-100 hover:border-primary-300 hover:text-primary-700 transition-colors"
            >
              {agent}
            </span>
          ))}
        </div>
      </section>

      {/* Demo Scenario */}
      <section className="bg-gradient-to-r from-primary-50 to-purple-50 rounded-2xl p-6 border border-primary-100">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-5 h-5 text-primary-600" />
          <h2 className="text-lg font-semibold text-gray-800">默认演示场景</h2>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">
          李同学（计算机专业大二学生）从<strong>程序设计基础</strong>过渡到<strong>数据结构与算法</strong>的学习。
          系统通过 CodeBuddy 多轮对话了解她的 Python/C 基础、对递归和数组操作的困惑，
          以及她对图示讲解和代码案例的偏好，帮她生成个性化学习资源并规划成长路径。
        </p>
      </section>
    </div>
  )
}
