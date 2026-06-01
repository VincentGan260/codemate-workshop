import { useEffect, useState } from 'react'
import { GitBranch, Clock, Target, Circle, CheckCircle2, PlayCircle } from 'lucide-react'
import { generatePath } from '../services/api'
import type { LearningPathResponse, PathNode } from '../types'

const statusIcons: Record<PathNode['status'], typeof Circle> = {
  pending: Circle,
  in_progress: PlayCircle,
  completed: CheckCircle2,
}
const statusColors: Record<PathNode['status'], string> = {
  pending: 'text-gray-300',
  in_progress: 'text-primary-500',
  completed: 'text-green-500',
}

export default function LearningPath() {
  const [path, setPath] = useState<LearningPathResponse | null>(null)

  useEffect(() => {
    generatePath().then(setPath).catch(() => {})
  }, [])

  if (!path) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-400">加载中...</p>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <GitBranch className="w-6 h-6 text-primary-600" />
          <h1 className="text-2xl font-bold text-gray-900">学习路径</h1>
        </div>
        <p className="text-sm text-gray-500">个性化学习路径规划 + 资源推送 + 成长目标展示。</p>
      </div>

      {/* Path Name */}
      <div className="bg-gradient-to-r from-primary-500 to-purple-600 rounded-2xl p-5 text-white shadow-md">
        <h2 className="text-lg font-semibold mb-1">{path.name}</h2>
        <p className="text-sm text-white/80">
          共 {path.nodes.length} 个节点 · 预计总时长 {
            path.nodes.reduce((sum, n) => sum + parseInt(n.duration) || 0, 0)
          } 小时
        </p>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200" />

        <div className="space-y-4">
          {path.nodes.map((node, index) => {
            const StatusIcon = statusIcons[node.status]
            const color = statusColors[node.status]

            return (
              <div key={node.id} className="relative flex items-start gap-4 ml-0 pl-8">
                {/* Node dot */}
                <div className={`absolute left-[9px] top-1.5 w-3 h-3 rounded-full border-2 border-white ${node.status === 'pending' ? 'bg-gray-300' : node.status === 'in_progress' ? 'bg-primary-500' : 'bg-green-500'}`} />

                {/* Node card */}
                <div className="flex-1 bg-white rounded-2xl p-4 shadow-card border border-gray-100 hover:shadow-card-hover transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">{index + 1}</span>
                        <h3 className="font-semibold text-gray-800 text-sm">{node.name}</h3>
                      </div>
                      <span className="text-xs text-primary-600">{node.course}</span>
                    </div>
                    <StatusIcon className={`w-5 h-5 ${color}`} />
                  </div>

                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Target className="w-3.5 h-3.5 text-gray-400" />
                      <span>{node.goal}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      <span>预计 {node.duration}</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
