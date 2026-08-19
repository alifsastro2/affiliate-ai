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
  ArrowRight,
} from 'lucide-react'
import { UserButton } from '@/components/auth/UserButton'
import { AuthForm } from '@/components/auth/AuthForm'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, badge: null, color: 'orange' },
  { name: 'Pipeline', href: '/pipeline', icon: GitBranch, badge: 'Progress', color: 'orange' },
  { name: 'Elang', href: '/elang', icon: Search, badge: 'Research', color: 'sky' },
  { name: 'Produk', href: '/produk', icon: Package, badge: 'Saya', color: 'purple' },
  { name: 'Merak', href: '/merak', icon: Palette, badge: 'Content', color: 'purple' },
  { name: 'Semut', href: '/semut', icon: BarChart3, badge: 'Analytics', color: 'amber' },
  { name: 'Unta', href: '/unta', icon: Wallet, badge: 'Budget', color: 'green' },
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
          "fixed left-0 top-0 z-50 h-screen bg-white border-r border-gray-200 transition-all duration-200 ease-out",
          isCollapsed ? "w-20" : "w-72"
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-3 border-b border-gray-100">
          {!isCollapsed ? (
            <Link href="/dashboard" className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="font-bold text-gray-900 text-lg">Cuan</h1>
                <p className="text-xs text-gray-500">Affiliate AI</p>
              </div>
            </Link>
          ) : (
            <Link href="/dashboard" className="w-10 h-10 mx-auto bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
              <Zap className="w-5 h-5 text-white" />
            </Link>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              "p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors flex-shrink-0 z-50",
              isCollapsed && "mx-auto"
            )}
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
                  "flex items-center gap-3 px-3 py-3 rounded-xl transition-all group relative",
                  isActive
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-50"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                  isActive ? "bg-white/20" : "bg-gray-100 group-hover:bg-gray-200"
                )}>
                  <Icon className={cn(
                    "w-5 h-5",
                    isActive ? "text-white" : "text-gray-500 group-hover:text-gray-700"
                  )} />
                </div>

                {!isCollapsed && (
                  <div className="flex-1 flex items-center justify-between">
                    <span className={cn(
                      "font-semibold",
                      isActive ? "text-white" : "text-gray-700"
                    )}>
                      {item.name}
                    </span>
                    {item.badge && (
                      <span className={cn(
                        "text-xs px-2 py-1 rounded-full font-medium",
                        isActive
                          ? "bg-white/20 text-white"
                          : item.color === 'sky' ? "bg-sky-100 text-sky-600" :
                            item.color === 'purple' ? "bg-purple-100 text-purple-600" :
                            item.color === 'amber' ? "bg-amber-100 text-amber-600" :
                            item.color === 'green' ? "bg-green-100 text-green-600" :
                            "bg-orange-100 text-orange-600"
                      )}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}

                {isCollapsed && (
                  <div className="absolute left-full ml-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 flex items-center gap-2">
                    <span>{item.name}</span>
                    {item.badge && (
                      <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
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
              "flex items-center gap-3 px-3 py-3 rounded-xl transition-colors group",
              pathname === '/settings' ? "bg-orange-50 text-orange-600" : "text-gray-600 hover:bg-gray-50"
            )}
          >
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center",
              pathname === '/settings' ? "bg-orange-100" : "bg-gray-100 group-hover:bg-gray-200"
            )}>
              <Settings className={cn(
                "w-5 h-5",
                pathname === '/settings' ? "text-orange-600" : "text-gray-500"
              )} />
            </div>
            {!isCollapsed && (
              <span className={cn(
                "font-semibold",
                pathname === '/settings' ? "text-orange-600" : "text-gray-700"
              )}>
                Settings
              </span>
            )}
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
