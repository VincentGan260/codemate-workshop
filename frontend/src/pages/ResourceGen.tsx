import { useState } from 'react'
import { FileText, Settings2, Wrench, Sparkles, ChevronDown } from 'lucide-react'
import { generateResources } from '../services/api'
import type { ResourceCard } from '../types'

const COURSES = [
  { id: 'programming-basics', name: '程序设计基础' },
  { id: 'data-structures', name: '数据结构与算法' },
]
const KNOWLEDGE_POINTS: Record<string, string[]> = {
  'programming-basics': ['递归', '函数', '数组', '条件与循环', '基础调试'],
  'data-structures': ['二叉树遍历', '递归思想', '排序算法', '栈与队列', '时间复杂度'],
}
const RESOURCE_TYPES = ['讲解文档', '思维导图', '代码示例', '分层练习', '拓展阅读', '项目案例']

export default function ResourceGen() {
  const [courseId, setCourseId] = useState('programming-basics')
  const [knowledgePt, setKnowledgePt] = useState('递归')
  const [difficulty, setDifficulty] = useState('入门')
  const [language, setLanguage] = useState('Python')
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['讲解文档', '代码示例'])
  const [resources, setResources] = useState<ResourceCard[]>([])

  const handleGenerate = async () => {
    const res = await generateResources({
      course_id: courseId,
      knowledge_point: knowledgePt,
      difficulty,
      language,
      resource_types: selectedTypes,
    })
    setResources(res.resource_cards)
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <FileText className="w-6 h-6 text-primary-600" />
          <h1 className="text-2xl font-bold text-gray-900">资源生成</h1>
        </div>
        <p className="text-sm text-gray-500">选择课程、知识点和资源类型，CodeBuddy 智能体将为你生成个性化学习资源。</p>
      </div>

      {/* Workbench Controls */}
      <div className="bg-white rounded-2xl p-5 shadow-card border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <Settings2 className="w-5 h-5 text-primary-600" />
          <h2 className="font-semibold text-gray-800">资源生成工作台</h2>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Course */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">课程</label>
            <select
              value={courseId}
              onChange={(e) => { setCourseId(e.target.value); setKnowledgePt(KNOWLEDGE_POINTS[e.target.value][0]) }}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 bg-white"
            >
              {COURSES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          {/* Knowledge Point */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">知识点</label>
            <select
              value={knowledgePt}
              onChange={(e) => setKnowledgePt(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 bg-white"
            >
              {(KNOWLEDGE_POINTS[courseId] ?? []).map((kp) => <option key={kp} value={kp}>{kp}</option>)}
            </select>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">难度</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 bg-white"
            >
              {['入门', '进阶', '综合'].map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          {/* Language */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">编程语言</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-200 bg-white"
            >
              {['Python', 'C', 'C++', 'Java'].map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        </div>

        {/* Resource Types */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-2">资源类型</label>
          <div className="flex flex-wrap gap-2 mb-4">
            {RESOURCE_TYPES.map((t) => (
              <button
                key={t}
                onClick={() =>
                  setSelectedTypes((prev) =>
                    prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
                  )
                }
                className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                  selectedTypes.includes(t)
                    ? 'bg-primary-50 border-primary-300 text-primary-700'
                    : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleGenerate}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-500 to-purple-600 text-white rounded-xl font-medium text-sm hover:from-primary-600 hover:to-purple-700 transition-all shadow-sm"
        >
          <Sparkles className="w-4 h-4" />
          生成资源
        </button>
      </div>

      {/* Generated Resources */}
      {resources.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-primary-600" />
            <h2 className="font-semibold text-gray-800">生成的资源</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {resources.map((r) => (
              <div key={r.id} className="bg-white rounded-2xl p-4 shadow-card border border-gray-100 hover:shadow-card-hover transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <span className="px-2 py-0.5 bg-primary-50 text-primary-700 rounded-full text-[11px] font-medium">
                    {r.type}
                  </span>
                  <span className="text-[11px] text-gray-400">{r.difficulty}</span>
                </div>
                <h3 className="font-semibold text-gray-800 text-sm mb-1">{r.title}</h3>
                <p className="text-xs text-gray-400 mb-2">{r.course} · {r.knowledge_point} · {r.language}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{r.summary}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Agent Status Column (placeholder) */}
      <div className="bg-white rounded-2xl p-4 shadow-card border border-gray-100">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-primary-500" />
          <span className="text-sm font-medium text-gray-700">智能体状态</span>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {['Diagnosis Agent', 'Resource Agent', 'Code Practice Agent', 'Assessment Agent'].map((agent) => (
            <div key={agent} className="flex items-center gap-2 text-xs text-gray-500">
              <div className="w-2 h-2 rounded-full bg-green-400" />
              {agent} — 就绪
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
