import { motion, AnimatePresence } from 'framer-motion'
import { Package, ExternalLink, Clock, Tag, Eye, X } from 'lucide-react'
import type { PathResourceItem } from '../../types'
import { getTypeTag, parseEstimatedMinutes } from '../../utils/pathResources'
import { useNavigate } from 'react-router-dom'

interface PathResourcePanelProps {
  items: PathResourceItem[]
  onViewResource: (resource: PathResourceItem) => void
  onRemove: (resourceId: string) => void
}

const PRIORITY_COLORS: Record<string, string> = {
  '必学': 'text-red-500 bg-red-50',
  '推荐': 'text-primary-500 bg-primary-50',
  '拓展': 'text-gray-400 bg-gray-50',
}

export default function PathResourcePanel({ items, onViewResource, onRemove }: PathResourcePanelProps) {
  const navigate = useNavigate()
  const totalMinutes = items.reduce((sum, i) => sum + parseEstimatedMinutes(i.estimatedTime), 0)
  const typeSet = new Set(items.map((i) => i.type))
  const typeCount = typeSet.size
  const hours = Math.floor(totalMinutes / 60)
  const mins = totalMinutes % 60

  return (
    <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-50">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-primary-500" />
            <span className="text-sm font-semibold text-gray-800">我的学习资源包</span>
          </div>
          <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
            {items.length} 项
          </span>
        </div>
        {items.length > 0 && (
          <div className="flex items-center gap-2 text-[10px] text-gray-400">
            <Clock className="w-2.5 h-2.5" />
            <span>预计 {hours > 0 ? `${hours} 小时 ` : ''}{mins} 分钟</span>
            <span>·</span>
            <span>覆盖 {typeCount} 类资源</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3">
        {items.length === 0 ? (
          <div className="text-center py-6">
            <Package className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-xs font-medium text-gray-500 mb-1">还没有加入资源</p>
            <p className="text-[10px] text-gray-400 mb-3 leading-relaxed">
              你可以先到资源生成页选择学习资源，<br />或使用当前路径中的系统推荐资源。
            </p>
            <button
              onClick={() => navigate('/resources')}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary-500 text-white text-[10px] font-medium hover:bg-primary-600 transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              前往资源生成页
            </button>
          </div>
        ) : (
          <div className="space-y-1">
            <AnimatePresence>
              {items.map((item, i) => {
                const tag = getTypeTag(item.type)
                return (
                  <motion.div
                    key={item.resourceId}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.25 }}
                    className="px-3 py-2 rounded-xl bg-gray-50 border border-gray-100"
                  >
                    <div className="flex items-center gap-1.5">
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-medium text-gray-700 truncate">{item.title}</p>
                        <div className="flex items-center gap-1 flex-wrap mt-1">
                          <span className={`px-1 py-0.5 rounded text-[9px] font-medium ${tag.color}`}>
                            {tag.label}
                          </span>
                          <span className="flex items-center gap-0.5 text-[9px] text-gray-400">
                            <Clock className="w-2.5 h-2.5" />
                            {item.estimatedTime}
                          </span>
                          {item.priority && (
                            <span className={`text-[9px] font-medium px-1 py-0.5 rounded ${PRIORITY_COLORS[item.priority] || ''}`}>
                              {item.priority}
                            </span>
                          )}
                        </div>
                        {item.purpose && (
                          <div className="flex items-center gap-1 mt-1">
                            <Tag className="w-2.5 h-2.5 text-gray-400" />
                            <span className="text-[9px] text-gray-400">{item.purpose}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => onViewResource(item)}
                          className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] text-primary-500 border border-primary-200 hover:bg-primary-50 transition-colors"
                        >
                          <Eye className="w-3 h-3" />
                          打开学习
                        </button>
                        <button
                          onClick={() => onRemove(item.resourceId)}
                          className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-red-50 transition-colors"
                        >
                          <X className="w-3 h-3 text-gray-400 hover:text-red-500" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}
