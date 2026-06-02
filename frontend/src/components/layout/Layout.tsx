import type { ReactNode } from 'react'
import Sidebar from './Sidebar'
import RightPanel from './RightPanel'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="ml-[--sidebar-width] mr-[--right-panel-width] flex-1 min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50/30 overflow-y-auto">
        {children}
      </main>
      <RightPanel />
    </div>
  )
}
