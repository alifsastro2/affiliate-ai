'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { Sidebar } from '@/components/layout/Sidebar'
import { Loader2 } from 'lucide-react'

const publicRoutes = ['/login', '/']

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setIsAuthenticated(!!session)
      setIsLoading(false)

      // Redirect to login if not authenticated and on protected route
      if (!session && !publicRoutes.includes(pathname)) {
        router.push('/login')
      }

      // Redirect to dashboard if authenticated and on public route
      if (session && publicRoutes.includes(pathname)) {
        router.push('/dashboard')
      }
    }

    checkAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session)

      if (!session && !publicRoutes.includes(pathname)) {
        router.push('/login')
      }
      if (session && publicRoutes.includes(pathname)) {
        router.push('/dashboard')
      }
    })

    return () => subscription.unsubscribe()
  }, [pathname, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 animate-pulse">
            ⚡
          </div>
          <Loader2 className="w-6 h-6 animate-spin mx-auto text-orange-500" />
          <p className="text-gray-500 mt-4">Memuat...</p>
        </div>
      </div>
    )
  }

  // Public routes - no sidebar
  if (publicRoutes.includes(pathname)) {
    return <>{children}</>
  }

  // Protected routes - show with sidebar
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64">
        {children}
      </main>
    </div>
  )
}
