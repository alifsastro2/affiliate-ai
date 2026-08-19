'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
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
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-orange-500" />
          <p className="text-gray-500 mt-4">Memuat...</p>
        </div>
      </div>
    )
  }

  // Just pass through children - layout handled by dashboard layout
  return <>{children}</>
}
