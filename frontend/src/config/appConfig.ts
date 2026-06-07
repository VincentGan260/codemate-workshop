/**
 * Application configuration — reads from Vite env variables.
 *
 * VITE_DEMO_MODE:
 *   "true"  → Demo Mode: Li classmate example data and demo entry points are visible
 *   other   → Real Mode: no default demo data, student starts from scratch
 */

const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true'

export function isDemoMode(): boolean {
  return DEMO_MODE
}

/** Demo student — used only in Demo Mode */
export const demoCurrentUser = {
  name: '李同学',
  role: '计科 · 大二',
  avatarText: '李',
}

/** Get current user display info. Returns demo data in Demo Mode, placeholder otherwise. */
export function getCurrentUserDisplay(): {
  name: string
  role: string
  avatarText: string
} {
  if (isDemoMode()) return demoCurrentUser
  return { name: '未登录', role: '请先构建画像', avatarText: '?' }
}

/** Get the student name for display in resource/agent copy. */
export function getStudentDisplayName(): string {
  return isDemoMode() ? '李同学' : '当前学习者'
}
