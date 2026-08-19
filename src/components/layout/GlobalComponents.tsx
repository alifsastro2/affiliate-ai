'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Loader2, X } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

// Global search indicator - persists across all pages
export function GlobalSearchIndicator() {
  const [searchState, setSearchState] = useState<{status: string; query: string; startTime?: number} | null>(null)
  const router = useRouter()

  useEffect(() => {
    const checkSearch = () => {
      const stored = sessionStorage.getItem('elang_search')
      if (stored) {
        setSearchState(JSON.parse(stored))
      } else {
        setSearchState(null)
      }
    }

    checkSearch()
    const interval = setInterval(checkSearch, 500)
    const handleStorage = () => checkSearch()
    window.addEventListener('storage', handleStorage)

    return () => {
      clearInterval(interval)
      window.removeEventListener('storage', handleStorage)
    }
  }, [])

  if (!searchState || searchState.status === 'done') return null

  const isPaused = searchState.status === 'paused'

  return (
    <button
      onClick={() => router.push('/elang')}
      className={`fixed top-4 right-20 z-50 flex items-center gap-2 px-4 py-2 rounded-full shadow-lg transition-all ${
        isPaused
          ? 'bg-amber-500 hover:bg-amber-600'
          : 'bg-sky-500 hover:bg-sky-600 animate-pulse'
      } text-white`}
    >
      <Loader2 className={`w-4 h-4 ${!isPaused ? 'animate-spin' : ''}`} />
      <span className="text-sm font-medium">
        {isPaused ? '⏸️ Elang paused: ' : '🦅 Elang hunting: '}{searchState.query}
      </span>
      {isPaused && <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">Klik untuk lanjut</span>}
    </button>
  )
}

// Toast notification - persists across all pages
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

// Helper function to show toast from anywhere
export function showToast(message: string, type: 'success' | 'error' | 'info' = 'info') {
  window.dispatchEvent(new CustomEvent('showToast', {
    detail: { message, type }
  }))
}
