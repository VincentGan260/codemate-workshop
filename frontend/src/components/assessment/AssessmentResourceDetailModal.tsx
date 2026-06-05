import { motion, AnimatePresence } from 'framer-motion'
import { X, Clock, BookOpen, ArrowRight, FileText } from 'lucide-react'
import type { PathResourceItem } from '../../types'
import { getTypeTag } from '../../utils/pathResources'

export interface AssessmentResource {
  title: string
  type: string
  estimatedTime: string
  topic: string
  course?: string
  note?: string
  purpose?: string
  priority?: string
}

interface AssessmentResourceDetailModalProps {
  resource: AssessmentResource | PathResourceItem | null
  onClose: () => void
}

function getMockCoreContent(type: string, title: string): string {
  const map: Record<string, string> = {
    '个性化讲解文档': `围绕"${title}"的核心概念，采用图示优先 + 分步骤解释的方式，帮助你建立直观理解。`,
    '知识点思维导图': `以"${title}"为中心节点，梳理相关概念、分支关系和应用场景，形成结构化的知识网络。`,
    '代码示例与注释': `提供完整的 Python 代码示例，每行附带详细中文注释，可直接运行验证。`,
    '分层练习题': `从基础判断到代码补全，再到综合应用的三层递进练习。每道题配有提示。`,
    '拓展阅读资料': `围绕进阶方向，深入探讨调用栈、迭代转换、实际应用等话题。`,
    '项目式学习案例': `通过实际项目综合运用所学知识，分阶段完成。`,
  }
  return map[type] || `关于"${title}"的学习资源。`
}

export default function AssessmentResourceDetailModal({ resource, onClose }: AssessmentResourceDetailModalProps) {
  return (
    <AnimatePresence>
      {resource && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/30"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            className="relative bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-md max-h-[80vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            {(() => {
              const tag = getTypeTag(resource.type)
              const topic = 'topic' in resource ? resource.topic : ''
              const course = 'course' in resource && resource.course ? resource.course : '数据结构与算法'
              const note = 'note' in resource && resource.note ? resource.note : ''
              const purpose = 'purpose' in resource && resource.purpose ? resource.purpose : ''
              const priority = 'priority' in resource && resource.priority ? resource.priority : ''

              return (
                <>
                  <div className="sticky top-0 bg-white z-10 px-5 py-4 border-b border-gray-50 flex items-start justify-between gap-3 rounded-t-2xl">
                    <div className="min-w-0">
                      <h2 className="text-sm font-semibold text-gray-800 leading-snug">{resource.title}</h2>
                      <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${tag.color}`}>{tag.label}</span>
                        <span className="flex items-center gap-0.5 text-[9px] text-gray-400">
                          <Clock className="w-2.5 h-2.5" />
                          {resource.estimatedTime}
                        </span>
                        {priority && (
                          <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded ${
                            priority === '必学' ? 'text-red-500 bg-red-50' : priority === '推荐' ? 'text-primary-500 bg-primary-50' : 'text-gray-400 bg-gray-50'
                          }`}>{priority}</span>
                        )}
                      </div>
                    </div>
                    <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors shrink-0">
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                  <div className="px-5 py-4 space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-gray-50 rounded-xl px-3 py-2">
                        <span className="text-[9px] text-gray-400 block mb-0.5">所属课程</span>
                        <span className="text-[11px] text-gray-700 font-medium">{course}</span>
                      </div>
                      <div className="bg-gray-50 rounded-xl px-3 py-2">
                        <span className="text-[9px] text-gray-400 block mb-0.5">学习主题</span>
                        <span className="text-[11px] text-gray-700 font-medium truncate">{topic || resource.title}</span>
                      </div>
                      {purpose && (
                        <div className="bg-gray-50 rounded-xl px-3 py-2">
                          <span className="text-[9px] text-gray-400 block mb-0.5">资源用途</span>
                          <span className="text-[11px] text-gray-700 font-medium">{purpose}</span>
                        </div>
                      )}
                      {note && (
                        <div className="bg-gray-50 rounded-xl px-3 py-2">
                          <span className="text-[9px] text-gray-400 block mb-0.5">学习备注</span>
                          <span className="text-[11px] text-gray-700 font-medium truncate">{note}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <FileText className="w-3.5 h-3.5 text-primary-500" />
                        <span className="text-[11px] font-medium text-gray-700">核心内容</span>
                      </div>
                      <p className="text-[11px] text-gray-500 leading-relaxed">{getMockCoreContent(resource.type, resource.title)}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-primary-500" />
                        <span className="text-[11px] font-medium text-gray-700">推荐使用方式</span>
                      </div>
                      <p className="text-[11px] text-gray-500 leading-relaxed">先阅读全文建立概念，再对照代码示例加深理解，最后完成分层练习巩固。</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <ArrowRight className="w-3.5 h-3.5 text-primary-500" />
                        <span className="text-[11px] font-medium text-gray-700">下一步建议</span>
                      </div>
                      <p className="text-[11px] text-gray-500 leading-relaxed">完成本资源后，继续下一阶段学习路径中的内容。</p>
                    </div>
                  </div>
                  <div className="px-5 py-3 border-t border-gray-50 flex items-center justify-end">
                    <button onClick={onClose} className="px-4 py-2 rounded-xl bg-gray-100 text-gray-600 text-[11px] font-medium hover:bg-gray-200 transition-colors">
                      关闭
                    </button>
                  </div>
                </>
              )
            })()}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
