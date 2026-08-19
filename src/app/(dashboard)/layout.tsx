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
    console.log('=== LAYOUT DEBUG ===')
    console.log('Sidebar width:', window.innerWidth >= 1024 ? 'w-[288px]' : 'mobile')
    console.log('Window innerWidth:', window.innerWidth)
    console.log('===================')
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
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content - Debug: red border to see boundary */}
      <main
        id="main-content"
        className="border-l-4 border-red-500"
        style={{ paddingLeft: '288px' }}
      >
        {children}
      </main>

      {/* Global Components */}
      <GlobalSearchIndicator />
      <ToastNotification />
    </div>
  )
}
