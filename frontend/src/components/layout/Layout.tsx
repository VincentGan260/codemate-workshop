import type { ReactNode } from 'react'
import Sidebar from './Sidebar'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="ml-[240px] flex-1 min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50/30">
        {children}
      </main>
    </div>
  )
}
