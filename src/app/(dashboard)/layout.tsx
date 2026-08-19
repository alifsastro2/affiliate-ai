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

      {/* Main Content - adjusted to start right after sidebar */}
      <main className="pl-64 min-h-screen">
        <div className="pt-0">
          {children}
        </div>
      </main>

      {/* Global Components - Persist across all pages */}
      <GlobalSearchIndicator />
      <ToastNotification />
    </div>
  )
}
