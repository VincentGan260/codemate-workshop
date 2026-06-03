import { useState, useCallback } from 'react'
import { FileText } from 'lucide-react'
import { generateResources } from '../services/api'
import type { ResourceCard, PathResourceItem } from '../types'
import ResourceWorkbench from '../components/resources/ResourceWorkbench'
import type { WorkbenchParams } from '../components/resources/ResourceWorkbench'
import ResourceCardComponent from '../components/resources/ResourceCard'
import ResourceDetailPanel from '../components/resources/ResourceDetailPanel'
import AgentGenerationStatus from '../components/resources/AgentGenerationStatus'
import PathResourcePackage from '../components/resources/PathResourcePackage'
import AnimatedSection from '../components/common/AnimatedSection'
import {
  loadPathResources, addPathResource, removePathResource,
  updatePathResource, clearPathResources,
} from '../utils/pathResources'

type Phase = 'config' | 'generating' | 'done'

export default function ResourceGen() {
  const [phase, setPhase] = useState<Phase>('config')
  const [resources, setResources] = useState<ResourceCard[]>([])
  const [detailResource, setDetailResource] = useState<ResourceCard | null>(null)
  const [pendingParams, setPendingParams] = useState<WorkbenchParams | null>(null)
  const [pathItems, setPathItems] = useState<PathResourceItem[]>(() => loadPathResources())
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2000)
  }

  const handleGenerate = (params: WorkbenchParams) => {
    setPendingParams(params)
    setPhase('generating')
    setResources([])
  }

  const handleGenerationComplete = async () => {
    const p = pendingParams
    const res = await generateResources({
      course_id: p?.courseId ?? 'data-structures',
      learning_topic: p?.learningTopic ?? '二叉树遍历',
      difficulty: p?.difficulty ?? '基础',
      language: p?.language ?? 'Python',
      resource_types: p?.selectedTypes ?? [],
    })
    // Sync added_to_path with current localStorage state
    const pathIds = new Set(pathItems.map((i) => i.resourceId))
    const synced = res.resource_cards.map((r) => ({
      ...r,
      added_to_path: pathIds.has(r.id),
    }))
    setResources(synced)
    setPhase('done')
  }

  const handleAddToPath = useCallback((id: string) => {
    const resource = resources.find((r) => r.id === id)
    if (!resource) return

    const alreadyInPath = pathItems.some((i) => i.resourceId === id)

    if (alreadyInPath) {
      // Remove from path
      const updated = removePathResource(id)
      setPathItems(updated)
      setResources((prev) =>
        prev.map((r) => (r.id === id ? { ...r, added_to_path: false } : r)),
      )
      if (detailResource?.id === id) {
        setDetailResource((prev) => prev ? { ...prev, added_to_path: false } : null)
      }
      showToast('已从资源包移除')
    } else {
      // Add to path
      const item: PathResourceItem = {
        resourceId: resource.id,
        title: resource.title,
        type: resource.type,
        estimatedTime: resource.estimated_time || '0 分钟',
        topic: resource.knowledge_point,
        course: resource.course,
        language: resource.language,
        note: '',
        purpose: '',
        priority: '',
      }
      const updated = addPathResource(item)
      setPathItems(updated)
      setResources((prev) =>
        prev.map((r) => (r.id === id ? { ...r, added_to_path: true } : r)),
      )
      if (detailResource?.id === id) {
        setDetailResource((prev) => prev ? { ...prev, added_to_path: true } : null)
      }
      showToast('已加入学习路径资源包')
    }
  }, [resources, pathItems, detailResource])

  const handleRemoveFromPath = useCallback((resourceId: string) => {
    const updated = removePathResource(resourceId)
    setPathItems(updated)
    setResources((prev) =>
      prev.map((r) => (r.id === resourceId ? { ...r, added_to_path: false } : r)),
    )
    if (detailResource?.id === resourceId) {
      setDetailResource((prev) => prev ? { ...prev, added_to_path: false } : null)
    }
  }, [detailResource])

  const handleUpdatePathItem = useCallback((resourceId: string, updates: { note?: string; purpose?: string; priority?: string }) => {
    const cleanUpdates: { note?: string; purpose?: PathResourceItem['purpose']; priority?: PathResourceItem['priority'] } = {}
    if (updates.note !== undefined) cleanUpdates.note = updates.note
    if (updates.purpose !== undefined) cleanUpdates.purpose = updates.purpose as PathResourceItem['purpose']
    if (updates.priority !== undefined) cleanUpdates.priority = updates.priority as PathResourceItem['priority']
    const updated = updatePathResource(resourceId, cleanUpdates)
    setPathItems(updated)
  }, [])

  const handleClearPath = useCallback(() => {
    clearPathResources()
    setPathItems([])
    setResources((prev) =>
      prev.map((r) => ({ ...r, added_to_path: false })),
    )
    if (detailResource) {
      setDetailResource((prev) => prev ? { ...prev, added_to_path: false } : null)
    }
  }, [detailResource])

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6 pb-12">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-[100] px-4 py-2 rounded-xl bg-gray-900 text-white text-xs shadow-lg animate-fade-in">
          {toast}
        </div>
      )}

      {/* Header */}
      <AnimatedSection>
        <div className="flex items-center gap-2">
          <FileText className="w-6 h-6 text-primary-600" />
          <h1 className="text-2xl font-bold text-gray-900">个性化学习资源生成</h1>
        </div>
      </AnimatedSection>

      {/* Main layout */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left: Workbench + Results */}
        <div className="col-span-8 space-y-5">
          <AnimatedSection delay={0.05}>
            <ResourceWorkbench onGenerate={handleGenerate} generating={phase === 'generating'} />
          </AnimatedSection>

          {phase === 'generating' && (
            <AnimatedSection delay={0.05}>
              <AgentGenerationStatus active={true} onComplete={handleGenerationComplete} />
            </AnimatedSection>
          )}

          {phase === 'done' && resources.length > 0 && (
            <AnimatedSection delay={0.05}>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary-600" />
                  <h2 className="text-sm font-semibold text-gray-800">生成结果</h2>
                  <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
                    {resources.length} 项资源
                  </span>
                </div>
                <div className="space-y-2">
                  {resources.map((r, i) => (
                    <ResourceCardComponent
                      key={r.id}
                      resource={r}
                      index={i}
                      onAddToPath={handleAddToPath}
                      onViewDetail={setDetailResource}
                    />
                  ))}
                </div>
              </div>
            </AnimatedSection>
          )}
        </div>

        {/* Right: Path Resource Package + Agent Status */}
        <div className="col-span-4 space-y-3">
          <AnimatedSection delay={0.1} direction="right">
            <PathResourcePackage
              items={pathItems}
              onRemove={handleRemoveFromPath}
              onUpdate={handleUpdatePathItem}
              onClear={handleClearPath}
              onToast={showToast}
            />
          </AnimatedSection>

          <AnimatedSection delay={0.15} direction="right">
            <div className="bg-white rounded-2xl p-4 shadow-card border border-gray-100">
              <span className="text-[10px] text-gray-400 block mb-2">智能体状态</span>
              <div className="space-y-1.5">
                {[
                  { label: '诊断分析', color: 'bg-blue-400' },
                  { label: '资源生成', color: 'bg-primary-400' },
                  { label: '代码实践', color: 'bg-emerald-400' },
                  { label: '评估校验', color: 'bg-amber-400' },
                ].map((a) => (
                  <div key={a.label} className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${a.color}`} />
                    <span className="text-[10px] text-gray-500 flex-1">{a.label}</span>
                    <span className="text-[9px] text-green-600 font-medium">就绪</span>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>

      {/* Detail Panel */}
      <ResourceDetailPanel
        resource={detailResource}
        onClose={() => setDetailResource(null)}
        onAddToPath={handleAddToPath}
      />
    </div>
  )
}
