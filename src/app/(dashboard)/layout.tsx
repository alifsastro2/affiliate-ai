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

      {/* Main Content - exact pixel to match sidebar (288px = w-72) */}
      <main className="pl-[288px]">
        <div className="p-6">
          {children}
        </div>
      </main>

      {/* Global Components */}
      <GlobalSearchIndicator />
      <ToastNotification />
    </div>
  )
}
