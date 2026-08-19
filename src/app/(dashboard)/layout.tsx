'use client'

import { Sidebar } from '@/components/layout/Sidebar'
import { GlobalSearchIndicator, ToastNotification } from '@/components/layout/GlobalComponents'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div style={{ backgroundColor: 'red', minHeight: '100vh' }}>
      <Sidebar />

      {/* Blue - adjust marginLeft until it touches sidebar */}
      <div style={{ backgroundColor: 'blue', marginLeft: '270px', width: 'calc(100% - 270px)', minHeight: '100vh' }}>
        <div style={{ padding: '24px' }}>
          {children}
        </div>
      </div>

      <GlobalSearchIndicator />
      <ToastNotification />
    </div>
  )
}
