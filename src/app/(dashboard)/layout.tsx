'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/layout/Sidebar'
import { GlobalSearchIndicator, ToastNotification } from '@/components/layout/GlobalComponents'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar - fixed at left, width 288px */}
      <Sidebar />

      {/* Main Content - starts at where sidebar ends */}
      <main
        id="main-content"
        className="border-l-4 border-red-500"
        style={{
          position: 'relative',
          marginLeft: '250px',
          paddingLeft: '0px',
        }}
      >
        <div style={{ padding: '24px' }}>
          {children}
        </div>
      </main>

      {/* Global Components */}
      <GlobalSearchIndicator />
      <ToastNotification />
    </div>
  )
}
