'use client'

import { Sidebar } from '@/components/layout/Sidebar'
import { GlobalSearchIndicator, ToastNotification } from '@/components/layout/GlobalComponents'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      {/* Sidebar fixed */}
      <Sidebar />

      {/* Content - pushed down for header space */}
      <div style={{ position: 'absolute', left: '288px', top: '64px', right: 0, bottom: 0, padding: '24px', overflow: 'auto' }}>
        {children}
      </div>

      <GlobalSearchIndicator />
      <ToastNotification />
    </div>
  )
}
