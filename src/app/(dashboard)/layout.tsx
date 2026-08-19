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

      {/* DEBUG: Blue background */}
      <div style={{ backgroundColor: 'blue', marginLeft: '288px' }}>
        {/* DEBUG: Green background */}
        <div style={{ backgroundColor: 'green', padding: '24px' }}>
          {children}
        </div>
      </div>

      <GlobalSearchIndicator />
      <ToastNotification />
    </div>
  )
}
