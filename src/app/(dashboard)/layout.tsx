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

      {/* Main Content */}
      <main className="pl-64 pt-0">
        {children}
      </main>

      {/* Global Components - Persist across all pages */}
      <GlobalSearchIndicator />
      <ToastNotification />
    </div>
  )
}
