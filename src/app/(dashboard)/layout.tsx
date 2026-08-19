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
    console.log('=== LAYOUT MOUNTED ===')
    console.log('Window width:', window.innerWidth)
    console.log('Body margin:', window.getComputedStyle(document.body).marginLeft)
    console.log('Body padding:', window.getComputedStyle(document.body).paddingLeft)
    console.log('HTML margin:', window.getComputedStyle(document.documentElement).marginLeft)
    console.log('=====================')
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
      {/* Sidebar - fixed positioned */}
      <Sidebar />

      {/* DEBUG WRAPPER - Blue border */}
      <div
        className="pl-[288px] border-4 border-blue-500"
      >
        {/* DEBUG INNER - Green border */}
        <div
          className="border-4 border-green-500"
        >
          {children}
        </div>
      </div>

      {/* Global Components */}
      <GlobalSearchIndicator />
      <ToastNotification />
    </div>
  )
}
