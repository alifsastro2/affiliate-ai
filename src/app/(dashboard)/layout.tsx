'use client'

import { Sidebar } from '@/components/layout/Sidebar'
import { GlobalSearchIndicator, ToastNotification } from '@/components/layout/GlobalComponents'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div style={{ backgroundColor: 'red', minHeight: '100vh', margin: 0 }}>
      <Sidebar />

      {/* Blue - marginLeft equals sidebar width (288px) */}
      <div style={{ backgroundColor: 'blue', margin: 0, marginLeft: '288px', width: 'calc(100% - 288px)', minHeight: '100vh' }}>
        <div style={{ padding: '24px' }}>
          {children}
        </div>
      </div>

      <GlobalSearchIndicator />
      <ToastNotification />
    </div>
  )
}
