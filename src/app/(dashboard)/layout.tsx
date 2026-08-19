'use client'

import { Sidebar } from '@/components/layout/Sidebar'
import { GlobalSearchIndicator, ToastNotification } from '@/components/layout/GlobalComponents'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content - starts right after sidebar (w-72 = 288px = pl-72) */}
      <main className="pl-72 min-h-screen">
        {children}
      </main>

      {/* Global Components - Persist across all pages */}
      <GlobalSearchIndicator />
      <ToastNotification />
    </div>
  )
}
