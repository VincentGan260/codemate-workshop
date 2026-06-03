import { motion, AnimatePresence } from 'framer-motion'
import { Target, BookOpen, ArrowRight, TrendingUp, Clock, Tag, Eye, Plus, Check } from 'lucide-react'
import type { PathNode, PathNodeResource } from '../../types'
import { getTypeTag } from '../../utils/pathResources'

const PRIORITY_COLORS: Record<string, string> = {
  '必学': 'text-red-500 bg-red-50',
  '推荐': 'text-primary-500 bg-primary-50',
  '拓展': 'text-gray-400 bg-gray-50',
}

interface PathNodeDetailProps {
  node: PathNode | null
  addedResourceIds: Set<string>
  onStatusChange: (nodeId: string, status: 'pending' | 'in_progress' | 'completed') => void
  onViewResource: (resource: PathNodeResource) => void
  onAddToPackage: (resource: PathNodeResource) => void
}

export default function PathNodeDetail({ node, addedResourceIds, onStatusChange, onViewResource, onAddToPackage }: PathNodeDetailProps) {
  return (
    <AnimatePresence mode="wait">
      {node ? (
        <motion.div
          key={node.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden"
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-primary-100 text-primary-600 text-xs font-bold flex items-center justify-center">
                {node.id.split('-')[1]}
              </span>
              <div>
                <h3 className="text-sm font-semibold text-gray-800">{node.name}</h3>
                <span className="text-[10px] text-primary-500">{node.course}</span>
              </div>
            </div>
            <span
              className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                node.status === 'completed' ? 'bg-green-50 text-green-600' : node.status === 'in_progress' ? 'bg-primary-50 text-primary-600' : 'bg-gray-50 text-gray-400'
              }`}
            >
              {node.status === 'completed' ? '已完成' : node.status === 'in_progress' ? '学习中' : '未开始'}
            </span>
          </div>

          <div className="p-4 space-y-4">
            {/* Learning objectives */}
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <Target className="w-3.5 h-3.5 text-primary-500" />
                <span className="text-xs font-medium text-gray-700">学习目标</span>
              </div>
              <ul className="space-y-1">
                {node.learningObjectives.map((obj, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-xs text-gray-500">
                    <span className="text-primary-400 mt-0.5">·</span>
                    {obj}
                  </li>
                ))}
              </ul>
            </div>

            {/* Task description */}
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <BookOpen className="w-3.5 h-3.5 text-primary-500" />
                <span className="text-xs font-medium text-gray-700">任务说明</span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">{node.taskDescription}</p>
            </div>

            {/* Matched resources from package */}
            {node.matchedResources.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <Tag className="w-3.5 h-3.5 text-primary-500" />
                  <span className="text-xs font-medium text-gray-700">我的资源包匹配</span>
                  <span className="text-[10px] text-primary-500 font-medium bg-primary-50 px-1.5 py-0.5 rounded-full">
                    {node.matchedResources.length} 项
                  </span>
                </div>
                <div className="space-y-1.5">
                  {node.matchedResources.map((r) => {
                    const tag = getTypeTag(r.type)
                    return (
                      <div key={r.resourceId} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary-50/30 border border-primary-100">
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-medium text-gray-700 truncate">{r.title}</p>
                          <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                            <span className={`px-1 py-0.5 rounded text-[9px] font-medium ${tag.color}`}>{tag.label}</span>
                            <span className="flex items-center gap-0.5 text-[9px] text-gray-400">
                              <Clock className="w-2.5 h-2.5" />
                              {r.estimatedTime}
                            </span>
                            <span className="text-[9px] text-primary-500 font-medium bg-primary-50 px-1 py-0.5 rounded">
                              我的资源包
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); onViewResource(r) }}
                          className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] text-primary-500 border border-primary-200 hover:bg-primary-50 transition-colors shrink-0"
                        >
                          <Eye className="w-3 h-3" />
                          打开资源
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* System recommended resources */}
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <Tag className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-xs font-medium text-gray-700">系统推荐资源</span>
                <span className="text-[10px] text-gray-400">({node.defaultResources.length} 项)</span>
              </div>
              <div className="space-y-1.5">
                {node.defaultResources.map((r) => {
                  const tag = getTypeTag(r.type)
                  const isAdded = addedResourceIds.has(r.resourceId)
                  return (
                    <div key={r.resourceId} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 border border-gray-100">
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-medium text-gray-700 truncate">{r.title}</p>
                        <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                          <span className={`px-1 py-0.5 rounded text-[9px] font-medium ${tag.color}`}>{tag.label}</span>
                          <span className="flex items-center gap-0.5 text-[9px] text-gray-400">
                            <Clock className="w-2.5 h-2.5" />
                            {r.estimatedTime}
                          </span>
                          <span className="text-[9px] text-gray-400 bg-gray-100 px-1 py-0.5 rounded">
                            系统推荐
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); onViewResource(r) }}
                        className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] text-primary-500 border border-primary-200 hover:bg-primary-50 transition-colors shrink-0"
                      >
                        <Eye className="w-3 h-3" />
                        打开资源
                      </button>
                      {isAdded ? (
                        <span className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] text-green-500 bg-green-50 shrink-0">
                          <Check className="w-3 h-3" />
                          已加入
                        </span>
                      ) : (
                        <button
                          onClick={(e) => { e.stopPropagation(); onAddToPackage(r) }}
                          className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] text-primary-500 border border-primary-100 hover:bg-primary-50 transition-colors shrink-0"
                        >
                          <Plus className="w-3 h-3" />
                          加入资源包
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Growth dimensions */}
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <TrendingUp className="w-3.5 h-3.5 text-primary-500" />
                <span className="text-xs font-medium text-gray-700">完成后预计提升</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {node.growthDimensions.map((gd) => (
                  <span key={gd.label} className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-primary-50 border border-primary-100">
                    <span className="text-[10px] text-primary-700 font-medium">{gd.label}</span>
                    <span className="text-[10px] text-primary-500 font-bold">+{gd.value}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 pt-1 border-t border-gray-50">
              {node.status === 'pending' && (
                <button
                  onClick={() => onStatusChange(node.id, 'in_progress')}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-500 text-white text-xs font-medium hover:bg-primary-600 transition-colors"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                  标记为学习中
                </button>
              )}
              {node.status === 'in_progress' && (
                <button
                  onClick={() => onStatusChange(node.id, 'completed')}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-green-500 text-white text-xs font-medium hover:bg-green-600 transition-colors"
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  标记为已完成
                </button>
              )}
              {node.status === 'completed' && (
                <button
                  onClick={() => onStatusChange(node.id, 'pending')}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 text-gray-500 text-xs font-medium hover:bg-gray-50 transition-colors"
                >
                  重置为未开始
                </button>
              )}
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="empty"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-2xl shadow-card border border-gray-100 p-6 text-center"
        >
          <BookOpen className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-xs text-gray-400">选择一个路径节点查看详情</p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
