'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { cn, getDifficultyColor, getScoreColor } from '@/lib/utils'
import {
  Search,
  DollarSign,
  Eye,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Globe,
  Zap,
  FileText,
  TrendingUp,
  Save,
  Sparkles,
  X,
  Bell,
} from 'lucide-react'
import { TrendingProduct } from '@/lib/types'
import { supabase } from '@/lib/supabase/client'
import { showToast } from '@/components/layout/GlobalComponents'

// Search steps
const searchSteps = [
  { id: 'browse', label: 'Browsing internet untuk data real-time', icon: Globe },
  { id: 'analyze', label: 'Menganalisis trending products', icon: Zap },
  { id: 'compile', label: 'Menyusun hasil riset', icon: FileText },
]

// Popular search suggestions
const suggestions = [
  'kacamata vintage',
  'tas wanita import',
  'skincare Korea',
  'gadget murah',
  'sepatu running',
  'perlengkapan bayi',
  'dress wanita',
  'smartwatch fitness',
  'sprei motif',
  'tumbler minuman',
]

export default function ElangPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [maxProducts, setMaxProducts] = useState(10)
  const [isSearching, setIsSearching] = useState(false)
  const [searchProgress, setSearchProgress] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<string[]>([])
  const [currentStep, setCurrentStep] = useState<string | null>(null)
  const [results, setResults] = useState<TrendingProduct[]>([])
  const [selectedProducts, setSelectedProducts] = useState<TrendingProduct[]>([])
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const [isSaving, setIsSaving] = useState(false)
  const [savedCount, setSavedCount] = useState(0)
  const [user, setUser] = useState<any>(null)
  const [showSuggestions, setShowSuggestions] = useState(false)

  // Get current user
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })
  }, [])

  // Check for background search on mount
  useEffect(() => {
    const stored = sessionStorage.getItem('elang_search')
    if (stored) {
      const data = JSON.parse(stored)
      if (data.status === 'done') {
        if (data.results && data.results.length > 0) {
          setResults(data.results)
          showToast(`Elang selesai! Ditemukan ${data.results.length} produk trending untuk "${data.query}"`, 'success')
        } else if (data.error) {
          setError(data.error)
          showToast(data.error, 'error')
        }
        sessionStorage.removeItem('elang_search')
      }
    }
  }, [])

  // Filter suggestions
  const filteredSuggestions = suggestions.filter(s =>
    s.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSearch = async () => {
    setIsSearching(true)
    setSearchProgress(0)
    setCompletedSteps([])
    setCurrentStep('browse')
    setResults([])
    setError(null)
    setSelectedProducts([])
    setShowSuggestions(false)

    const query = searchQuery.trim() || 'semua produk trending di Indonesia'

    // Store search state
    sessionStorage.setItem('elang_search', JSON.stringify({
      query,
      status: 'running',
      startTime: Date.now()
    }))

    const stepProgress = [30, 60, 90]
    let stepIndex = 0

    const progressInterval = setInterval(() => {
      setSearchProgress(prev => {
        if (stepIndex < stepProgress.length) {
          const target = stepProgress[stepIndex]
          if (prev >= target) {
            if (stepIndex < searchSteps.length - 1) {
              stepIndex++
              setCompletedSteps(prev => [...prev, searchSteps[stepIndex - 1].id])
              setCurrentStep(searchSteps[stepIndex].id)
            }
          }
        }
        return Math.min(prev + Math.random() * 3, stepIndex < searchSteps.length ? stepProgress[stepIndex] - 5 : 95)
      })
    }, 200)

    let attempts = 0
    const maxAttempts = 5

    try {
      let success = false
      let lastError = ''

      while (attempts < maxAttempts && !success) {
        attempts++
        if (attempts > 1) {
          setRetryCount(attempts - 1)
          setCurrentStep('browse')
          const waitTime = attempts * 5 // 5s, 10s, 15s, 20s
          showToast(`Mencoba lagi... (${attempts}/${maxAttempts}) Tunggu ${waitTime}s`, 'info')
          await new Promise(resolve => setTimeout(resolve, waitTime * 1000))
        }

        try {
          const response = await fetch('/api/elang/research', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              niche: query,
              maxProducts,
            }),
          })

          const data = await response.json()

          if (!response.ok) {
            const errorMsg = data.error || ''
            if (errorMsg.includes('high demand') || errorMsg.includes('overloaded') ||
                errorMsg.includes('429') || errorMsg.includes('503')) {
              lastError = errorMsg
              if (attempts < maxAttempts) continue
            }
            throw new Error(data.error || 'Failed to research products')
          }

          setCompletedSteps(searchSteps.map(s => s.id))
          setCurrentStep(null)
          setSearchProgress(100)
          setResults(data.products || [])
          success = true

          // Store results
          sessionStorage.setItem('elang_search', JSON.stringify({
            query,
            status: 'done',
            results: data.products || [],
            completedAt: Date.now()
          }))

        } catch (err: any) {
          lastError = err.message || 'Unknown error'
          if (attempts < maxAttempts) continue
        }
      }

      if (!success) {
        throw new Error(lastError || 'Max retries exceeded')
      }
    } catch (err: any) {
      const errorMsg = err.message?.includes('high demand') || err.message?.includes('overloaded')
        ? 'Gemini AI sedang sibuk. Coba lagi dalam 1-2 menit.'
        : err.message || 'Terjadi kesalahan saat riset produk'

      setError(errorMsg)
      setResults([])

      sessionStorage.setItem('elang_search', JSON.stringify({
        query,
        status: 'done',
        error: errorMsg,
        completedAt: Date.now()
      }))
    } finally {
      clearInterval(progressInterval)
      setIsSearching(false)
      setRetryCount(0)
    }
  }

  const toggleProductSelection = (product: TrendingProduct) => {
    setSelectedProducts(prev => {
      const isSelected = prev.some(p => p.name === product.name)
      if (isSelected) {
        return prev.filter(p => p.name !== product.name)
      } else {
        return [...prev, product]
      }
    })
  }

  const handleSaveSelectedProducts = async () => {
    if (!user || selectedProducts.length === 0) return

    setIsSaving(true)
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          products: selectedProducts,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save products')
      }

      setSavedCount(data.count)
      showToast(`${data.count} produk berhasil disimpan!`, 'success')
      setTimeout(() => {
        setSavedCount(0)
        setSelectedProducts([])
        setResults([])
      }, 3000)
    } catch (err: any) {
      showToast(err.message || 'Gagal menyimpan produk', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isSearching) {
      handleSearch()
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-sky-400 to-sky-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Search className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Elang</h1>
            <p className="text-gray-500">Research Agent</p>
          </div>
        </div>
        <div className="bg-sky-50 border border-sky-200 rounded-xl p-4">
          <p className="text-sky-800 text-sm">
            Elang memiliki penglihatan tajam untuk menemukan produk trending.
            Cukup ketik kata kunci produk yang kamu cari, biarkan Elang yang menemukan yang paling laris!
          </p>
        </div>
      </div>

      {/* Search Form */}
      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-sky-600" />
            Riset Produk Trending
          </h2>
          <p className="text-sm text-gray-500">
            Ketik kata kunci produk yang ingin kamu riset. Elang akan browsing internet untuk menemukan produk trending
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search Input */}
            <div className="relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setShowSuggestions(true)
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ketik kata kunci atau kosongkan untuk cari semua produk trending..."
                  className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-sky-500 focus:ring-4 focus:ring-sky-100 transition-all outline-none"
                  disabled={isSearching}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    disabled={isSearching}
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Suggestions */}
              {showSuggestions && searchQuery && filteredSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                  {filteredSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSearchQuery(suggestion)
                        setShowSuggestions(false)
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-sky-50 flex items-center gap-3 transition-colors"
                    >
                      <Sparkles className="w-4 h-4 text-sky-500" />
                      <span className="text-gray-700">{suggestion}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Popular searches */}
              {showSuggestions && !searchQuery && (
                <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                  <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Pencarian Populer
                    </span>
                  </div>
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSearchQuery(suggestion)
                        setShowSuggestions(false)
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-sky-50 flex items-center gap-3 transition-colors"
                    >
                      <TrendingUp className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">{suggestion}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Options */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Jumlah produk:</label>
                <select
                  value={maxProducts}
                  onChange={(e) => setMaxProducts(parseInt(e.target.value))}
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:border-sky-500 outline-none"
                  disabled={isSearching}
                >
                  <option value={5}>5 Produk</option>
                  <option value={10}>10 Produk</option>
                  <option value={15}>15 Produk</option>
                  <option value={20}>20 Produk</option>
                </select>
              </div>
            </div>

            {/* Search Button */}
            <Button
              onClick={handleSearch}
              disabled={isSearching}
              className="w-full bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 disabled:opacity-50"
              size="lg"
            >
              {isSearching ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Elang Sedang Berburu... (Bisa Navigasi ke Menu Lain)
                </>
              ) : (
                <>
                  <Search className="w-5 h-5 mr-2" />
                  {searchQuery.trim() ? 'Mulai Riset Produk' : 'Cari Semua Produk Trending'}
                </>
              )}
            </Button>

            {isSearching && (
              <p className="text-xs text-center text-gray-500 flex items-center justify-center gap-2">
                <Bell className="w-4 h-4" />
                Elang tetap berjalan di background. Kamu bisa navigasi ke menu lain!
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isSearching && (
        <Card className="mb-6">
          <CardContent className="py-8">
            <div className="text-center mb-6">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-sky-400 to-sky-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Search className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Elang Sedang Berburu...
              </h3>
              <p className="text-gray-500 text-sm">
                Browsing internet untuk data real-time dari berbagai platform
              </p>
            </div>

            {/* Retry Indicator */}
            {retryCount > 0 && (
              <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-center gap-2 text-amber-700">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm font-medium">
                    Retry attempt {retryCount + 1}/3 - Gemini sedang sibuk...
                  </span>
                </div>
              </div>
            )}

            {/* Progress Bar */}
            <div className="max-w-md mx-auto mb-6">
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-sky-400 to-sky-600 transition-all duration-500"
                  style={{ width: `${searchProgress}%` }}
                />
              </div>
              <p className="text-center text-sm text-gray-500 mt-2">
                {Math.round(searchProgress)}%
              </p>
            </div>

            {/* Steps */}
            <div className="max-w-md mx-auto space-y-3">
              {searchSteps.map((step) => {
                const isCompleted = completedSteps.includes(step.id)
                const isActive = currentStep === step.id
                const Icon = step.icon

                return (
                  <div key={step.id} className="flex items-center gap-3 text-sm">
                    {isCompleted ? (
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      </div>
                    ) : isActive ? (
                      <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-sky-500" style={{ animation: 'pulse 1s infinite' }} />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-gray-300" />
                      </div>
                    )}
                    <span className={cn(
                      isCompleted && "text-green-600",
                      isActive && "text-sky-600 font-medium",
                      !isCompleted && !isActive && "text-gray-400"
                    )}>
                      {step.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="py-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h3 className="font-semibold text-red-800 mb-1">Terjadi Kesalahan</h3>
                <p className="text-red-600 text-sm">{error}</p>
                <Button
                  onClick={handleSearch}
                  variant="outline"
                  className="mt-4 border-red-300 text-red-600 hover:bg-red-100"
                  size="sm"
                >
                  Coba Lagi
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Success Save */}
      {savedCount > 0 && (
        <Card className="mb-6 border-green-200 bg-green-50">
          <CardContent className="py-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <h3 className="font-semibold text-green-800">Berhasil Disimpan!</h3>
                <p className="text-green-600 text-sm">
                  {savedCount} produk berhasil disimpan ke database
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {results.length > 0 && (
        <>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Ditemukan {results.length} Produk Trending!
              </h2>
              <p className="text-gray-500 text-sm">
                Pilih produk yang ingin kamu simpan ke database
              </p>
            </div>
            {selectedProducts.length > 0 && (
              <Button
                onClick={handleSaveSelectedProducts}
                disabled={isSaving || !user}
                className="bg-gradient-to-r from-green-500 to-green-600"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Simpan {selectedProducts.length} Produk
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.map((product, index) => {
              const isSelected = selectedProducts.some(p => p.name === product.name)
              const isTop = index < 3

              return (
                <Card
                  key={product.name}
                  className={cn(
                    "transition-all cursor-pointer hover:shadow-md",
                    isSelected && "ring-2 ring-green-500 bg-green-50/50",
                    isTop && "border-orange-200"
                  )}
                  onClick={() => toggleProductSelection(product)}
                >
                  <CardContent className="p-5">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {isTop && (
                          <div className="bg-gradient-to-r from-orange-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                            TOP {index + 1}
                          </div>
                        )}
                        <div className={cn(
                          "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                          isSelected
                            ? "bg-green-500 border-green-500"
                            : "border-gray-300"
                        )}>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
                        </div>
                      </div>
                      <Badge className={cn(getScoreColor(product.trendScore), "font-bold")}>
                        {product.trendScore}/100
                      </Badge>
                    </div>

                    {/* Product Name */}
                    <h3 className="font-semibold text-gray-900 text-lg mb-3">
                      {product.name}
                    </h3>

                    {/* Metrics */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <DollarSign className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Est. Komisi</p>
                          <p className="font-medium text-gray-900">{product.estimatedCommission}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="p-2 bg-sky-100 rounded-lg">
                          <Eye className="w-4 h-4 text-sky-600" />
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Est. Views</p>
                          <p className="font-medium text-gray-900">{product.estimatedViews}</p>
                        </div>
                      </div>
                    </div>

                    {/* Why Trending */}
                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                      <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" /> Kenapa Trending
                      </p>
                      <p className="text-sm text-gray-700">{product.whyTrending}</p>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      <Badge className={getDifficultyColor(product.difficulty)}>
                        {product.difficulty}
                      </Badge>
                      {product.sellingPoints.slice(0, 3).map((point, i) => (
                        <Badge key={i} variant="default">
                          {point}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </>
      )}

      {/* Empty State */}
      {!isSearching && results.length === 0 && !error && savedCount === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-sky-100 to-sky-200 rounded-2xl flex items-center justify-center">
              <Search className="w-10 h-10 text-sky-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Siap untuk Berburu?
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Ketik kata kunci produk yang ingin kamu riset. Elang akan menemukan produk trending untukmu!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
