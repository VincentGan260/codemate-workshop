import { motion } from 'framer-motion'
import { GitBranch, Clock, Package, Target, Play } from 'lucide-react'
import type { PathNode } from '../../types'
import { countResourcePackageItems, getCompletedCount, getTotalMatchedCount } from '../../utils/pathUtils'

interface PathOverviewProps {
  pathName: string
  nodes: PathNode[]
  onStartLearning: () => void
}

export default function PathOverview({ pathName, nodes, onStartLearning }: PathOverviewProps) {
  const totalNodes = nodes.length
  const totalDuration = nodes.reduce((sum, n) => sum + (parseInt(n.duration) || 0), 0)
  const resourceCount = countResourcePackageItems()
  const matchedCount = getTotalMatchedCount(nodes)
  const completedCount = getCompletedCount(nodes)
  const progressPercent = totalNodes > 0 ? Math.round((completedCount / totalNodes) * 100) : 0

  return (
    <motion.div
      className="bg-gradient-to-r from-primary-500 to-purple-600 rounded-2xl p-5 text-white shadow-md"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <GitBranch className="w-5 h-5 text-white/90" />
            <h2 className="text-lg font-semibold">{pathName}</h2>
          </div>
          <p className="text-sm text-white/70">
            {totalNodes} 个节点 · 预计总时长 {totalDuration} 小时
            {resourceCount > 0 && ` · 资源包 ${resourceCount} 项`}
            {matchedCount > 0 && ` · 已匹配 ${matchedCount} 项`}
          </p>
        </div>
        <button
          onClick={onStartLearning}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-primary-600 text-sm font-semibold hover:bg-white/95 transition-colors shadow-sm"
        >
          <Play className="w-4 h-4" />
          开始学习
        </button>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-white/80">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Target className="w-3 h-3" />
              进度 {progressPercent}%
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {totalDuration}h
            </span>
            <span className="flex items-center gap-1">
              <Package className="w-3 h-3" />
              {resourceCount} 资源
            </span>
          </div>
          <span>{completedCount}/{totalNodes} 完成</span>
        </div>
        <div className="h-2 rounded-full bg-white/20 overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-white"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </div>
    </motion.div>
  )
}
