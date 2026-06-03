import { useEffect, useState } from 'react'
import { BookOpen } from 'lucide-react'
import { getCourses } from '../services/api'
import { getDefaultTransition } from '../mock/courses'
import type { Course } from '../types'
import CourseCard from '../components/courses/CourseCard'
import CourseDetailPanel from '../components/courses/CourseDetailPanel'
import AnimatedSection from '../components/common/AnimatedSection'

export default function CourseCenter() {
  const [courses, setCourses] = useState<Course[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  useEffect(() => {
    getCourses().then((res) => {
      setCourses(res.courses)
      // Default select 程序设计基础
      const defaultId = res.courses.find((c) => c.id === 'programming-basics')?.id ?? res.courses[0]?.id ?? null
      setSelectedId(defaultId)
    }).catch(() => {})
  }, [])

  const selected = courses.find((c) => c.id === selectedId) ?? null

  // Default transition for Li student — replaceable with LLM-driven recommendation
  const transition = getDefaultTransition()

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 pb-12">
      {/* ===== Top: Title only ===== */}
      <AnimatedSection>
        <div className="flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-primary-600" />
          <h1 className="text-2xl font-bold text-gray-900">计算机专业课程中心</h1>
        </div>
      </AnimatedSection>

      {/* ===== Key Prerequisite Hint (dynamic) ===== */}
      <AnimatedSection delay={0.05}>
        <div className="bg-gradient-to-r from-primary-50 to-purple-50 rounded-2xl border border-primary-100/50 px-5 py-4 flex items-center gap-4">
          <div className="flex items-center gap-3 shrink-0">
            <span className="px-3 py-1.5 rounded-xl bg-white text-sm font-semibold text-gray-800 shadow-sm border border-primary-100">
              {transition.from}
            </span>
            <span className="text-primary-500 font-bold text-lg">→</span>
            <span className="px-3 py-1.5 rounded-xl bg-white text-sm font-semibold text-gray-800 shadow-sm border border-primary-200 ring-1 ring-primary-200">
              {transition.to}
            </span>
          </div>
          <div className="border-l border-primary-200 pl-4">
            <p className="text-xs font-semibold text-primary-700 mb-0.5">重点学习衔接</p>
            <p className="text-xs text-gray-600 leading-relaxed">{transition.reason}</p>
            {transition.basedOn.length > 0 && (
              <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                <span className="text-[10px] text-gray-400">基于：</span>
                {transition.basedOn.map((tag) => (
                  <span key={tag} className="px-1.5 py-0.5 rounded-full bg-white/80 text-primary-600 text-[10px] font-medium border border-primary-100">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </AnimatedSection>

      {/* ===== Bottom: Cards + Detail ===== */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left: Course cards grid */}
        <div className="col-span-7">
          <AnimatedSection delay={0.1}>
            <div className="grid grid-cols-2 gap-3 overflow-visible">
              {courses.map((c, i) => (
                <CourseCard
                  key={c.id}
                  course={c}
                  isSelected={c.id === selectedId}
                  isHovered={c.id === hoveredId}
                  anyHovered={hoveredId !== null}
                  onClick={() => setSelectedId(c.id)}
                  onHover={(id) => setHoveredId(id)}
                  index={i}
                />
              ))}
            </div>
          </AnimatedSection>
        </div>

        {/* Right: Course detail */}
        <div className="col-span-5">
          <AnimatedSection delay={0.15} direction="right">
            <CourseDetailPanel
              course={selected}
              allCourses={courses}
              onSelectCourse={setSelectedId}
            />
          </AnimatedSection>
        </div>
      </div>
    </div>
  )
}
