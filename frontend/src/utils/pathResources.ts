import type { PathResourceItem } from '../types'

const STORAGE_KEY = 'codemate_path_resources'

export function loadPathResources(): PathResourceItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as PathResourceItem[]
  } catch {
    return []
  }
}

export function savePathResources(items: PathResourceItem[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export function addPathResource(item: PathResourceItem): PathResourceItem[] {
  const items = loadPathResources()
  if (items.some((i) => i.resourceId === item.resourceId)) return items
  const updated = [...items, item]
  savePathResources(updated)
  return updated
}

export function removePathResource(resourceId: string): PathResourceItem[] {
  const items = loadPathResources().filter((i) => i.resourceId !== resourceId)
  savePathResources(items)
  return items
}

export function updatePathResource(resourceId: string, updates: Partial<Pick<PathResourceItem, 'note' | 'purpose' | 'priority'>>): PathResourceItem[] {
  const items = loadPathResources().map((i) =>
    i.resourceId === resourceId ? { ...i, ...updates } : i,
  )
  savePathResources(items)
  return items
}

export function clearPathResources(): void {
  localStorage.removeItem(STORAGE_KEY)
}

export function isResourceInPath(resourceId: string): boolean {
  return loadPathResources().some((i) => i.resourceId === resourceId)
}

export function getTypeTag(type: string): { label: string; color: string } {
  const map: Record<string, { label: string; color: string }> = {
    '个性化讲解文档': { label: '讲解', color: 'bg-blue-50 text-blue-600' },
    '知识点思维导图': { label: '导图', color: 'bg-purple-50 text-purple-600' },
    '代码示例与注释': { label: '代码', color: 'bg-emerald-50 text-emerald-600' },
    '分层练习题': { label: '练习', color: 'bg-amber-50 text-amber-600' },
    '拓展阅读资料': { label: '阅读', color: 'bg-indigo-50 text-indigo-600' },
    '项目式学习案例': { label: '项目', color: 'bg-rose-50 text-rose-600' },
  }
  return map[type] ?? { label: type.slice(0, 2), color: 'bg-gray-50 text-gray-500' }
}

export function parseEstimatedMinutes(time: string): number {
  const match = time.match(/(\d+)/)
  return match ? parseInt(match[1], 10) : 0
}
