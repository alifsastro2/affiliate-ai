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

      {/* Content - position absolute, left matches sidebar width */}
      <div style={{ position: 'absolute', left: '288px', top: 0, right: 0, bottom: 0, backgroundColor: 'blue', padding: '24px', overflow: 'auto' }}>
        {children}
      </div>

      <GlobalSearchIndicator />
      <ToastNotification />
    </div>
  )
}
