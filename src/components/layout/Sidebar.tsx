'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  GitBranch,
  Search,
  Palette,
  BarChart3,
  Wallet,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
  Package,
  Loader2,
  X,
} from 'lucide-react'
import { UserButton } from '@/components/auth/UserButton'
import { AuthForm } from '@/components/auth/AuthForm'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Pipeline', href: '/pipeline', icon: GitBranch },
  { name: 'Elang', href: '/elang', icon: Search },
  { name: 'Produk', href: '/produk', icon: Package },
  { name: 'Merak', href: '/merak', icon: Palette },
  { name: 'Semut', href: '/semut', icon: BarChart3 },
  { name: 'Unta', href: '/unta', icon: Wallet },
]

const publicRoutes = ['/login', '/']

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setIsAuthenticated(!!session)
    }
    checkAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (isAuthenticated === false && !publicRoutes.includes(pathname)) {
      router.push('/login')
    }
  }, [isAuthenticated, pathname, router])

  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center animate-pulse">
          <Zap className="w-8 h-8 text-white" />
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    if (showAuth || !publicRoutes.includes(pathname)) {
      return <AuthForm />
    }
    return null
  }

  return (
    <>
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen bg-white border-r border-gray-200 transition-all duration-300",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100">
          {!isCollapsed && (
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-gray-900">Cuan</h1>
                <p className="text-xs text-gray-500">Affiliate AI</p>
              </div>
            </Link>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group relative",
                  isActive
                    ? "bg-orange-50 text-orange-600"
                    : "text-gray-600 hover:bg-gray-50"
                )}
              >
                <Icon className={cn(
                  "w-5 h-5 flex-shrink-0",
                  isActive ? "text-orange-500" : "text-gray-400 group-hover:text-gray-600"
                )} />

                {!isCollapsed && (
                  <span className="font-medium">{item.name}</span>
                )}

                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                    {item.name}
                  </div>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-100">
          <Link
            href="/settings"
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
            )}
          >
            <Settings className="w-5 h-5 text-gray-400" />
            {!isCollapsed && <span className="font-medium">Settings</span>}
          </Link>
        </div>
      </aside>

      {/* User Button Header */}
      <div className="fixed top-0 right-0 z-30 p-4">
        <UserButton onAuthRequired={() => setShowAuth(true)} />
      </div>
    </>
  )
}

// Global search indicator component - persists across all pages
export function GlobalSearchIndicator() {
  const [isSearching, setIsSearching] = useState(false)
  const [query, setQuery] = useState('')
  const router = useRouter()

  useEffect(() => {
    // Check for active search in sessionStorage
    const checkSearch = () => {
      const stored = sessionStorage.getItem('elang_search')
      if (stored) {
        const data = JSON.parse(stored)
        setIsSearching(data.status === 'running')
        setQuery(data.query || '')
      } else {
        setIsSearching(false)
        setQuery('')
      }
    }

    // Check on mount
    checkSearch()

    // Check periodically (every 500ms) for changes
    const interval = setInterval(checkSearch, 500)

    // Also listen for storage events (when another tab/window changes it)
    const handleStorage = () => checkSearch()
    window.addEventListener('storage', handleStorage)

    return () => {
      clearInterval(interval)
      window.removeEventListener('storage', handleStorage)
    }
  }, [])

  if (!isSearching) return null

  return (
    <button
      onClick={() => router.push('/elang')}
      className="fixed top-4 right-20 z-50 flex items-center gap-2 px-4 py-2 bg-sky-500 text-white rounded-full shadow-lg hover:bg-sky-600 transition-all animate-pulse"
    >
      <Loader2 className="w-4 h-4 animate-spin" />
      <span className="text-sm font-medium">Elang hunting: {query}</span>
    </button>
  )
}

// Toast notification component
export function ToastNotification() {
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)

  useEffect(() => {
    const handleToast = (event: CustomEvent) => {
      setToast(event.detail)
      setTimeout(() => setToast(null), 5000)
    }

    window.addEventListener('showToast', handleToast as EventListener)
    return () => window.removeEventListener('showToast', handleToast as EventListener)
  }, [])

  if (!toast) return null

  return (
    <div className={cn(
      "fixed bottom-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg animate-slide-up",
      toast.type === 'success' && "bg-green-500 text-white",
      toast.type === 'error' && "bg-red-500 text-white",
      toast.type === 'info' && "bg-blue-500 text-white",
    )}>
      {toast.type === 'success' && (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )}
      {toast.type === 'error' && (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      )}
      {toast.type === 'info' && <Loader2 className="w-5 h-5 animate-spin" />}
      <span className="font-medium">{toast.message}</span>
      <button onClick={() => setToast(null)} className="ml-2 hover:opacity-80">
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}
