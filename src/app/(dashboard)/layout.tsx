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

      {/* Blue fills remaining width after sidebar */}
      <div style={{ backgroundColor: 'blue', marginLeft: '288px', width: 'calc(100% - 288px)', minHeight: '100vh' }}>
        {/* Green removed - children directly in blue */}
        <div style={{ padding: '24px' }}>
          {children}
        </div>
      </div>

      <GlobalSearchIndicator />
      <ToastNotification />
    </div>
  )
}
