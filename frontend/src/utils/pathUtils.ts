import type { PathResourceItem, PathNode, PathNodeResource } from '../types'
import { loadPathResources } from './pathResources'

const STORAGE_KEY_NODE_STATUS = 'codemate_path_node_status'

// ========== Node status persistence ==========

export function loadPathNodeStatuses(): Record<string, 'pending' | 'in_progress' | 'completed'> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_NODE_STATUS)
    if (!raw) return {}
    return JSON.parse(raw)
  } catch {
    return {}
  }
}

export function savePathNodeStatuses(statuses: Record<string, 'pending' | 'in_progress' | 'completed'>): void {
  localStorage.setItem(STORAGE_KEY_NODE_STATUS, JSON.stringify(statuses))
}

export function updatePathNodeStatus(nodeId: string, status: 'pending' | 'in_progress' | 'completed'): Record<string, 'pending' | 'in_progress' | 'completed'> {
  const statuses = loadPathNodeStatuses()
  statuses[nodeId] = status
  savePathNodeStatuses(statuses)
  return statuses
}

// ========== Keyword-based resource matching ==========

function toNodeResource(item: PathResourceItem): PathNodeResource {
  return {
    resourceId: item.resourceId,
    title: item.title,
    type: item.type,
    estimatedTime: item.estimatedTime,
    source: 'resource_package',
  }
}

function matchesNode(item: PathResourceItem, node: PathNode): boolean {
  const searchText = [item.title, item.topic, item.type, item.purpose].join(' ').toLowerCase()
  return node.keywords.some((kw) => searchText.includes(kw.toLowerCase()))
}

export function mapResourcesToPathNodes(nodes: PathNode[]): PathNode[] {
  const pathItems = loadPathResources()

  return nodes.map((node) => {
    const matched: PathNodeResource[] = []

    for (const item of pathItems) {
      if (matchesNode(item, node)) {
        const alreadyAdded = matched.some((r) => r.resourceId === item.resourceId)
        if (!alreadyAdded) {
          matched.push(toNodeResource(item))
        }
      }
    }

    return {
      ...node,
      matchedResources: matched,
    }
  })
}

export function getMatchedCountForNode(node: PathNode): number {
  return node.matchedResources.length
}

export function getTotalMatchedCount(nodes: PathNode[]): number {
  return nodes.reduce((sum, n) => sum + n.matchedResources.length, 0)
}

// ========== Calculations ==========

export function calculateTotalMinutes(nodes: PathNode[]): number {
  return nodes.reduce((sum, n) => {
    const match = n.duration.match(/(\d+)/)
    return sum + (match ? parseInt(match[1], 10) : 0) * 60
  }, 0)
}

export function calculateTotalDuration(nodes: PathNode[]): string {
  const totalMin = calculateTotalMinutes(nodes)
  const hours = Math.floor(totalMin / 60)
  const mins = totalMin % 60
  if (hours === 0) return `${mins} 分钟`
  if (mins === 0) return `${hours} 小时`
  return `${hours} 小时 ${mins} 分钟`
}

export function countResourcePackageItems(): number {
  return loadPathResources().length
}

export function getCompletedCount(nodes: PathNode[]): number {
  return nodes.filter((n) => n.status === 'completed').length
}

export function getInProgressCount(nodes: PathNode[]): number {
  return nodes.filter((n) => n.status === 'in_progress').length
}
