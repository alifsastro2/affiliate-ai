'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { LogOut, User, Loader2 } from 'lucide-react'
import type { User as SupabaseUser } from '@supabase/supabase-js'

interface UserButtonProps {
  onAuthRequired?: () => void
}

export function UserButton({ onAuthRequired }: UserButtonProps) {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showMenu, setShowMenu] = useState(false)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setIsLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setShowMenu(false)
    onAuthRequired?.()
  }

  if (isLoading) {
    return (
      <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
    )
  }

  if (!user) {
    return (
      <Button onClick={onAuthRequired} size="sm" variant="outline">
        Masuk
      </Button>
    )
  }

  const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'
  const userInitial = userName.charAt(0).toUpperCase()

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-medium">
          {userInitial}
        </div>
        <span className="text-sm font-medium text-gray-700 hidden md:block">
          {userName}
        </span>
      </button>

      {/* Dropdown Menu */}
      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          />
          <Card className="absolute right-0 top-full mt-2 w-64 z-50 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-medium text-lg">
                  {userInitial}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{userName}</p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <User className="w-4 h-4" />
                <span>ID: {user.id.slice(0, 8)}...</span>
              </div>
              <Button
                onClick={handleSignOut}
                variant="outline"
                className="w-full mt-2 text-red-600 border-red-200 hover:bg-red-50"
                size="sm"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Keluar
              </Button>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
