'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
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
} from 'lucide-react'
import { UserButton } from '@/components/auth/UserButton'
import { AuthForm } from '@/components/auth/AuthForm'
import { supabase } from '@/lib/supabase/client'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Pipeline', href: '/pipeline', icon: GitBranch, badge: 'Progress' },
  { name: 'Elang', href: '/elang', icon: Search, badge: 'Research' },
  { name: 'Produk', href: '/produk', icon: Package, badge: 'Saya' },
  { name: 'Merak', href: '/merak', icon: Palette, badge: 'Content' },
  { name: 'Semut', href: '/semut', icon: BarChart3, badge: 'Analytics' },
  { name: 'Unta', href: '/unta', icon: Wallet, badge: 'Budget' },
]

const publicRoutes = ['/login', '/']

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const pathname = usePathname()
  const router = useRouter()

  // Check auth status
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

  // Redirect to dashboard if not authenticated on protected routes
  useEffect(() => {
    if (isAuthenticated === false && !publicRoutes.includes(pathname)) {
      router.push('/login')
    }
  }, [isAuthenticated, pathname, router])

  // Show loading state
  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 animate-pulse">
            ⚡
          </div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    )
  }

  // Show auth form if not authenticated
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
                  <>
                    <span className="font-medium">{item.name}</span>
                    {item.badge && (
                      <span className={cn(
                        "ml-auto text-xs px-2 py-0.5 rounded-full",
                        item.name === 'Pipeline' && "bg-orange-100 text-orange-600",
                        item.name === 'Elang' && "bg-sky-100 text-sky-600",
                        item.name === 'Produk' && "bg-purple-100 text-purple-600",
                        item.name === 'Merak' && "bg-purple-100 text-purple-600",
                        item.name === 'Semut' && "bg-amber-100 text-amber-600",
                        item.name === 'Unta' && "bg-green-100 text-green-600",
                      )}>
                        {item.badge}
                      </span>
                    )}
                  </>
                )}

                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                    {item.name}
                    {item.badge && <span className="ml-2 text-gray-400">({item.badge})</span>}
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
