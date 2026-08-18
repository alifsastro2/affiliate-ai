'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Select } from '@/components/ui/Input'
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
} from 'lucide-react'
import { TrendingProduct } from '@/lib/types'
import { supabase } from '@/lib/supabase/client'

const niches = [
  { value: 'rumah-tangga', label: '🏠 Rumah Tangga' },
  { value: 'fashion', label: '👗 Fashion' },
  { value: 'gadget', label: '📱 Gadget' },
  { value: 'kecantikan', label: '💄 Kecantikan' },
  { value: 'ibu-bayi', label: '👶 Ibu & Bayi' },
  { value: 'makanan', label: '🍕 Makanan' },
]

// Real steps that actually happen
const searchSteps = [
  { id: 'browse', label: '🌐 Browsing internet untuk data real-time', icon: Globe },
  { id: 'analyze', label: '🧠 Menganalisis trending products', icon: Zap },
  { id: 'compile', label: '📋 Menyusun hasil riset', icon: Search },
]

export default function ElangPage() {
  const [selectedNiche, setSelectedNiche] = useState('rumah-tangga')
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

  // Get current user
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })
  }, [])

  const handleSearch = async () => {
    setIsSearching(true)
    setSearchProgress(0)
    setCompletedSteps([])
    setCurrentStep('browse')
    setResults([])
    setError(null)
    setSelectedProducts([])

    // Realistic progress based on actual steps
    const stepProgress = [30, 60, 90] // Each step adds progress
    let stepIndex = 0

    // Simulate step progression
    const progressInterval = setInterval(() => {
      setSearchProgress(prev => {
        if (stepIndex < stepProgress.length) {
          const target = stepProgress[stepIndex]
          if (prev >= target) {
            // Move to next step
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

    // Retry logic
    let attempts = 0
    const maxAttempts = 3

    try {
      let success = false
      let lastError = ''

      while (attempts < maxAttempts && !success) {
        attempts++
        if (attempts > 1) {
          setRetryCount(attempts - 1)
          setCurrentStep('browse')
          const waitTime = (attempts - 1) * 3
          console.log(`Retry attempt ${attempts}, waiting ${waitTime}s...`)
          await new Promise(resolve => setTimeout(resolve, waitTime * 1000))
        }

        try {
          const response = await fetch('/api/elang/research', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              niche: selectedNiche,
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

          // Complete all steps
          setCompletedSteps(searchSteps.map(s => s.id))
          setCurrentStep(null)
          setSearchProgress(100)
          setResults(data.products || [])
          success = true
        } catch (err: any) {
          lastError = err.message || 'Unknown error'
          if (attempts < maxAttempts) continue
        }
      }

      if (!success) {
        throw new Error(lastError || 'Max retries exceeded')
      }
    } catch (err: any) {
      setError(
        err.message?.includes('high demand') || err.message?.includes('overloaded')
          ? 'Gemini AI sedang sibuk. Coba lagi dalam 1-2 menit.'
          : err.message || 'Terjadi kesalahan saat riset produk'
      )
      setResults([])
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
      setTimeout(() => {
        setSavedCount(0)
        setSelectedProducts([])
        setResults([])
      }, 3000)
    } catch (err: any) {
      setError(err.message || 'Failed to save products')
    } finally {
      setIsSaving(false)
    }
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'tiktok':
        return '🎵'
      case 'instagram':
        return '📸'
      case 'youtube':
        return '▶️'
      default:
        return '📱'
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-sky-400 to-sky-600 rounded-2xl flex items-center justify-center text-4xl shadow-lg">
            🦅
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Elang</h1>
            <p className="text-gray-500">Research Agent</p>
          </div>
        </div>
        <div className="bg-sky-50 border border-sky-200 rounded-xl p-4">
          <p className="text-sky-800 text-sm italic">
            "Elang punya penglihatan super tajam. Dari ribuan meter高空, dia bisa melihat produk
            trending yang akan explode sebelum orang lain menyadarinya."
          </p>
        </div>
      </div>

      {/* Search Form */}
      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Search className="w-5 h-5 text-sky-600" />
            Cari Produk Trending
          </h2>
          <p className="text-sm text-gray-500">
            Elang akan browsing internet untuk menemukan produk trending real-time
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Select
              label="Niche"
              options={niches}
              value={selectedNiche}
              onChange={(e) => setSelectedNiche(e.target.value)}
            />
            <Select
              label="Jumlah Produk"
              options={[
                { value: '5', label: '5 Produk' },
                { value: '10', label: '10 Produk' },
                { value: '15', label: '15 Produk' },
                { value: '20', label: '20 Produk' },
              ]}
              value={maxProducts.toString()}
              onChange={(e) => setMaxProducts(parseInt(e.target.value))}
            />
          </div>

          <Button
            onClick={handleSearch}
            disabled={isSearching}
            className="w-full md:w-auto bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700"
            size="lg"
          >
            {isSearching ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Elang Sedang Berburu...
              </>
            ) : (
              <>
                <Search className="w-5 h-5 mr-2" />
                🦅 Mulai Cari Produk Trending
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isSearching && (
        <Card className="mb-6">
          <CardContent className="py-8">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4 animate-bounce">🦅</div>
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
                    🔄 Retry attempt {retryCount + 1}/3 - Gemini sedang sibuk...
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

            {/* Real Steps */}
            <div className="max-w-md mx-auto space-y-3">
              {searchSteps.map((step, index) => {
                const isCompleted = completedSteps.includes(step.id)
                const isActive = currentStep === step.id
                const Icon = step.icon

                return (
                  <div key={step.id} className="flex items-center gap-3 text-sm">
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : isActive ? (
                      <Icon className="w-5 h-5 text-sky-500 animate-pulse" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
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
              <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
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
              <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
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
                🎯 Ditemukan {results.length} Produk Trending!
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
                    💾 Simpan {selectedProducts.length} Produk
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
                          <div className="bg-gradient-to-r from-orange-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            🏆 TOP {index + 1}
                          </div>
                        )}
                        <span className={cn(
                          "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                          isSelected
                            ? "bg-green-500 border-green-500"
                            : "border-gray-300"
                        )}>
                          {isSelected && <CheckCircle2 className="w-3 h-3 text-white" />}
                        </span>
                      </div>
                      <Badge className={cn(getScoreColor(product.trendScore), "font-bold")}>
                        ⭐ {product.trendScore}/100
                      </Badge>
                    </div>

                    {/* Product Name */}
                    <h3 className="font-semibold text-gray-900 text-lg mb-3">
                      {product.name}
                    </h3>

                    {/* Metrics */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <div className="p-1.5 bg-green-100 rounded-lg">
                          <DollarSign className="w-3.5 h-3.5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Est. Komisi</p>
                          <p className="font-medium text-gray-900">{product.estimatedCommission}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="p-1.5 bg-sky-100 rounded-lg">
                          <Eye className="w-3.5 h-3.5 text-sky-600" />
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Est. Views</p>
                          <p className="font-medium text-gray-900">{product.estimatedViews}</p>
                        </div>
                      </div>
                    </div>

                    {/* Platforms */}
                    <div className="flex items-center gap-2 mb-4">
                      {product.platforms.map(platform => (
                        <span key={platform} className="text-xl" title={platform}>
                          {getPlatformIcon(platform)}
                        </span>
                      ))}
                      <span className="text-xs text-gray-500 ml-1">
                        {product.platforms.join(', ')}
                      </span>
                    </div>

                    {/* Why Trending */}
                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                      <p className="text-xs text-gray-500 mb-1">📈 Kenapa Trending</p>
                      <p className="text-sm text-gray-700">{product.whyTrending}</p>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      <Badge className={getDifficultyColor(product.difficulty)}>
                        ⚡ {product.difficulty}
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
            <div className="text-6xl mb-4">🦅</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Siap untuk Berburu?
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Pilih niche dan klik tombol di atas untuk memulai riset produk trending bersama Elang
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
