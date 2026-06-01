import { useEffect, useState } from 'react'
import { BookOpen, ChevronRight, GraduationCap, Link2, Tags } from 'lucide-react'
import { getCourses } from '../services/api'
import type { Course } from '../types'

export default function CourseCenter() {
  const [courses, setCourses] = useState<Course[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)

  useEffect(() => {
    getCourses().then((res) => {
      setCourses(res.courses)
      setSelectedId(res.courses[0]?.id ?? null)
    }).catch(() => {})
  }, [])

  const selected = courses.find((c) => c.id === selectedId)

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <BookOpen className="w-6 h-6 text-primary-600" />
          <h1 className="text-2xl font-bold text-gray-900">课程中心</h1>
        </div>
        <p className="text-sm text-gray-500">浏览计算机专业课程群，了解各课程的核心知识点、先修关系和可生成资源类型。</p>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-3 gap-4">
        {courses.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedId(c.id)}
            className={`text-left rounded-2xl p-5 border transition-all ${
              c.id === selectedId
                ? 'bg-primary-50 border-primary-300 shadow-card ring-1 ring-primary-200'
                : 'bg-white border-gray-100 shadow-card hover:shadow-card-hover'
            }`}
          >
            <h3 className="font-semibold text-gray-800 mb-1">{c.name}</h3>
            <span className="text-xs text-gray-400">{c.stage}</span>
            <div className="flex flex-wrap gap-1 mt-3">
              {c.knowledge_points.slice(0, 3).map((kp) => (
                <span key={kp} className="px-2 py-0.5 bg-gray-50 rounded-full text-[11px] text-gray-500 border border-gray-100">
                  {kp}
                </span>
              ))}
              {c.knowledge_points.length > 3 && (
                <span className="text-[11px] text-gray-400">+{c.knowledge_points.length - 3}</span>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Course Detail */}
      {selected && (
        <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <GraduationCap className="w-5 h-5 text-primary-600" />
            <h2 className="text-lg font-semibold text-gray-800">{selected.name}</h2>
            <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">{selected.stage}</span>
          </div>

          <p className="text-sm text-gray-500 mb-6">{selected.description}</p>

          <div className="grid grid-cols-2 gap-6">
            {/* Prerequisites */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <ChevronRight className="w-4 h-4 text-primary-500" />
                <span className="text-sm font-medium text-gray-700">先修课程</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selected.prerequisites.length > 0
                  ? selected.prerequisites.map((p) => {
                      const c = courses.find((x) => x.id === p)
                      return (
                        <span key={p} className="px-2 py-0.5 bg-primary-50 text-primary-700 rounded-full text-xs">
                          {c?.name ?? p}
                        </span>
                      )
                    })
                  : <span className="text-xs text-gray-400">无（入门课程）</span>}
              </div>
            </div>

            {/* Related Courses */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Link2 className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-medium text-gray-700">关联课程</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selected.related_courses.map((r) => {
                  const c = courses.find((x) => x.id === r)
                  return (
                    <button
                      key={r}
                      onClick={() => setSelectedId(r)}
                      className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded-full text-xs hover:bg-purple-100 transition-colors"
                    >
                      {c?.name ?? r}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Knowledge Points */}
          <div className="mt-5 pt-5 border-t border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <Tags className="w-4 h-4 text-primary-500" />
              <span className="text-sm font-medium text-gray-700">核心知识点</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {selected.knowledge_points.map((kp) => (
                <span key={kp} className="px-3 py-1.5 bg-gray-50 rounded-full text-sm text-gray-700 border border-gray-100">
                  {kp}
                </span>
              ))}
            </div>
          </div>

          {/* Resource Types */}
          <div className="mt-4">
            <span className="text-sm font-medium text-gray-700">可生成资源类型：</span>
            <span className="text-sm text-gray-500 ml-2">{selected.resource_types.join(' · ')}</span>
          </div>
        </div>
      )}
    </div>
  )
}
