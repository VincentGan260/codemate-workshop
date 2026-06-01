import { useEffect, useState } from 'react'
import { UserRound, MessageCircle, Brain, Star, Target, Lightbulb, AlertCircle } from 'lucide-react'
import { generateProfile, profileChat } from '../services/api'
import type { StudentProfile } from '../types'

export default function Profile() {
  const [profile, setProfile] = useState<StudentProfile | null>(null)
  const [chatMsg, setChatMsg] = useState('')

  useEffect(() => {
    generateProfile().then(setProfile).catch(() => {})
    profileChat('').then((res) => setChatMsg(res.message)).catch(() => {})
  }, [])

  if (!profile) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-400">加载中...</p>
      </div>
    )
  }

  const { student, profile: dims } = profile

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <UserRound className="w-6 h-6 text-primary-600" />
          <h1 className="text-2xl font-bold text-gray-900">学习画像</h1>
        </div>
        <p className="text-sm text-gray-500">通过 CodeBuddy 多轮对话 + 轻量诊断题，动态生成与更新六维学习画像。</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left: CodeBuddy Chat Area */}
        <div className="col-span-1 space-y-4">
          <div className="bg-white rounded-2xl p-5 shadow-card border border-gray-100 text-center">
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-semibold text-gray-800">CodeBuddy</h3>
            <p className="text-xs text-gray-400 mt-1">Q 版数字人学习伙伴</p>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-card border border-gray-100">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <MessageCircle className="w-4 h-4 text-primary-600" />
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{chatMsg || '正在连接 CodeBuddy...'}</p>
            </div>
          </div>

          <div className="bg-primary-50 rounded-2xl p-4 border border-primary-100">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-primary-500" />
              <span className="text-xs font-medium text-primary-700">待收集信息</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {['当前课程', '已学课程', '知识基础', '学习困难', '编程语言', '学习偏好', '学习目标', '资源偏好'].map((f) => (
                <span key={f} className="px-2 py-0.5 bg-white rounded-full text-[11px] text-gray-500 border border-gray-200">
                  {f}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Profile Display */}
        <div className="col-span-2 space-y-4">
          {/* Student Info Card */}
          <div className="bg-white rounded-2xl p-5 shadow-card border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                {student.name[0]}
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">{student.name}</h3>
                <p className="text-xs text-gray-400">{student.grade} · {student.major}</p>
              </div>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">{student.background}</p>
          </div>

          {/* Six Dimensions */}
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(dims).map(([key, dim]) => (
              <ProfileCard key={key} dim={dim} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function ProfileCard({ dim }: { dim: StudentProfile['profile'][string] }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-card border border-gray-100 hover:shadow-card-hover transition-shadow">
      <h4 className="text-sm font-semibold text-gray-800 mb-3">{dim.label}</h4>
      {dim.stars !== undefined && (
        <div className="flex items-center gap-1 mb-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              className={`w-4 h-4 ${s <= dim.stars! ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`}
            />
          ))}
          {dim.score !== undefined && (
            <span className="ml-2 text-sm font-medium text-gray-700">{dim.score}/{dim.max_score}</span>
          )}
        </div>
      )}
      {dim.note && <p className="text-xs text-primary-500 mb-2">{dim.note}</p>}
      {dim.tags && (
        <div className="flex flex-wrap gap-1.5">
          {dim.tags.map((tag) => (
            <span key={tag} className="px-2 py-0.5 bg-gray-50 rounded-full text-[11px] text-gray-600 border border-gray-100">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
