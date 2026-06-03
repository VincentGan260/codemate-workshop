import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import type { Course } from '../../types'

interface CourseCardProps {
  course: Course
  isSelected: boolean
  isHovered: boolean
  anyHovered: boolean
  onClick: () => void
  onHover: (id: string | null) => void
  index: number
}

export default function CourseCard({
  course,
  isSelected,
  isHovered,
  anyHovered,
  onClick,
  onHover,
  index,
}: CourseCardProps) {
  const isHighlight = course.positioning === '重点演示'

  // Determine visual state
  const isDimmed = anyHovered && !isHovered

  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={() => onHover(course.id)}
      onMouseLeave={() => onHover(null)}
      className={`relative text-left rounded-2xl p-4 border bg-white
        ${isSelected
          ? 'border-primary-300 shadow-card ring-1 ring-primary-200 bg-primary-50'
          : 'border-gray-100 shadow-card'
        }
      `}
      initial={{ opacity: 0, y: 12 }}
      animate={{
        opacity: isDimmed ? 0.6 : 1,
        y: 0,
        scale: isHovered ? 1.08 : isDimmed ? 0.96 : 1,
        filter: isDimmed ? 'blur(2px)' : 'blur(0px)',
      }}
      transition={{
        duration: 0.25,
        ease: 'easeOut',
      }}
      style={{
        zIndex: isHovered ? 20 : isSelected ? 1 : 0,
        boxShadow: isHovered
          ? '0 12px 40px rgba(124, 58, 237, 0.18), 0 0 0 1px rgba(124, 58, 237, 0.3)'
          : undefined,
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <h3 className="text-sm font-semibold text-gray-800 truncate">{course.name}</h3>
          {isHighlight && <Star className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0" />}
        </div>
        <div className="flex items-center gap-1.5 shrink-0 ml-2">
          {isHighlight ? (
            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-primary-100 text-primary-600 font-medium">
              重点演示
            </span>
          ) : (
            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-500 font-medium">
              课程群支撑
            </span>
          )}
          <span className="text-[10px] text-gray-400">{course.stage}</span>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-2.5">
        {course.description}
      </p>

      {/* Knowledge pills */}
      <div className="flex flex-wrap gap-1 mb-2.5">
        {course.knowledge_points.slice(0, 4).map((kp) => (
          <span
            key={kp}
            className="px-1.5 py-0.5 bg-gray-50 rounded-full text-[10px] text-gray-500 border border-gray-100"
          >
            {kp}
          </span>
        ))}
        {course.knowledge_points.length > 4 && (
          <span className="text-[10px] text-gray-400">+{course.knowledge_points.length - 4}</span>
        )}
      </div>

      {/* Prerequisite hint */}
      <p className="text-[10px] text-gray-400">
        {course.prerequisites.length > 0
          ? `先修：${course.prerequisites.length} 门`
          : '入门课程 · 无先修要求'}
      </p>
    </motion.button>
  )
}
