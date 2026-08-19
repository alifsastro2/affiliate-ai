'use client'

import { Sidebar } from '@/components/layout/Sidebar'
import { GlobalSearchIndicator, ToastNotification } from '@/components/layout/GlobalComponents'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div style={{ backgroundColor: 'red', minHeight: '100vh', margin: '0 !important', padding: '0 !important' }}>
      <Sidebar />

      {/* Blue with important styles */}
      <div style={{ backgroundColor: 'blue', margin: '0 !important', padding: '0 !important', marginLeft: '288px !important', width: 'calc(100% - 288px) !important', minHeight: '100vh !important' }}>
        <div style={{ padding: '24px !important' }}>
          {children}
        </div>
      </div>

      <GlobalSearchIndicator />
      <ToastNotification />
    </div>
  )
}
