'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import {
  Search,
  Palette,
  FileText,
  CheckCircle2,
  Send,
  BarChart3,
  MoreVertical,
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronRight,
  Plus,
  Trash2,
  Loader2,
  Eye,
} from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import type { Product } from '@/lib/types'

// Map database product to pipeline format
const mapProductToPipeline = (product: Product) => {
  // Determine current stage based on status
  let currentStage: 'research' | 'content' | 'script' | 'approval' | 'posted' | 'analytics' = 'research'
  let stages: Record<'research' | 'content' | 'script' | 'approval' | 'posted' | 'analytics', 'done' | 'current' | 'pending'> = {
    research: 'done',
    content: 'pending',
    script: 'pending',
    approval: 'pending',
    posted: 'pending',
    analytics: 'pending',
  }

  // For pending products - still in research stage
  if (product.status === 'pending') {
    stages = {
      research: 'current',
      content: 'pending',
      script: 'pending',
      approval: 'pending',
      posted: 'pending',
      analytics: 'pending',
    }
    currentStage = 'research'
  } else if (product.status === 'analyzed') {
    stages = {
      research: 'done',
      content: 'current',
      script: 'pending',
      approval: 'pending',
      posted: 'pending',
      analytics: 'pending',
    }
    currentStage = 'content'
  } else if (product.status === 'approved') {
    stages = {
      research: 'done',
      content: 'done',
      script: 'done',
      approval: 'done',
      posted: 'current',
      analytics: 'pending',
    }
    currentStage = 'posted'
  } else if (product.status === 'archived') {
    stages = {
      research: 'done',
      content: 'done',
      script: 'done',
      approval: 'done',
      posted: 'done',
      analytics: 'done',
    }
    currentStage = 'analytics'
  }

  return {
    id: product.id,
    name: product.name,
    image: getProductEmoji(product.category),
    niche: product.category || 'Lainnya',
    stages,
    currentAction: getCurrentAction(currentStage),
    nextAction: getNextAction(currentStage),
    nextActionBy: getNextActionBy(currentStage),
    estimatedCommission: `${product.estimated_commission || 6}%`,
    createdAt: formatTimeAgo(product.created_at),
    updatedAt: formatTimeAgo(product.updated_at),
  }
}

const getProductEmoji = (category: string | null) => {
  switch (category?.toLowerCase()) {
    case 'rumah tangga': return '🏠'
    case 'fashion': return '👗'
    case 'gadget': return '📱'
    case 'kecantikan': return '💄'
    case 'ibu & bayi': return '👶'
    case 'makanan': return '🍕'
    default: return '📦'
  }
}

const getCurrentAction = (stage: string) => {
  switch (stage) {
    case 'research': return 'Menunggu riset produk'
    case 'content': return 'Sedang generate ide konten'
    case 'script': return 'Sedang generate script'
    case 'approval': return 'Menunggu approval script'
    case 'posted': return 'Menunggu input data posting'
    case 'analytics': return 'Sedang analisis performa'
    default: return 'Status tidak diketahui'
  }
}

const getNextAction = (stage: string) => {
  switch (stage) {
    case 'research': return 'Riset produk selesai'
    case 'content': return 'Pilih ide konten favorit'
    case 'script': return 'Review script dari Merak'
    case 'approval': return 'Approve script untuk posting'
    case 'posted': return 'Input link posting'
    case 'analytics': return 'Selesai analisis'
    default: return '-'
  }
}

const getNextActionBy = (stage: string) => {
  switch (stage) {
    case 'research': return '🦅 Elang'
    case 'content': return '🦚 Merak'
    case 'script': return '🦚 Merak'
    case 'approval': return '👤 Kamu'
    case 'posted': return '👤 Kamu'
    case 'analytics': return '🐜 Semut'
    default: return '👤 Kamu'
  }
}

const formatTimeAgo = (date: string) => {
  const now = new Date()
  const past = new Date(date)
  const diffMs = now.getTime() - past.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffHours / 24)

  if (diffDays > 0) return `${diffDays} hari lalu`
  if (diffHours > 0) return `${diffHours} jam lalu`
  return 'Baru saja'
}

const stages = [
  { key: 'research', label: 'Research', agent: '🦅 Elang', icon: Search },
  { key: 'content', label: 'Ide Konten', agent: '🦚 Merak', icon: Palette },
  { key: 'script', label: 'Script', agent: '🦚 Merak', icon: FileText },
  { key: 'approval', label: 'Approval', agent: '👤 Kamu', icon: CheckCircle2 },
  { key: 'posted', label: 'Posting', agent: '👤 Kamu', icon: Send },
  { key: 'analytics', label: 'Analytics', agent: '🐜 Semut', icon: BarChart3 },
]

export default function PipelinePage() {
  const [filter, setFilter] = useState<'all' | 'action-needed' | 'in-progress' | 'completed'>('all')
  const [products, setProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
    }
    checkAuth()
  }, [])

  useEffect(() => {
    const fetchProducts = async () => {
      if (!user) return

      setIsLoading(true)
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20)

      if (!error && data) {
        setProducts(data.map(mapProductToPipeline))
      }
      setIsLoading(false)
    }

    if (user) {
      fetchProducts()
    }
  }, [user])

  const filteredProducts = products.filter(product => {
    if (filter === 'all') return true
    if (filter === 'action-needed') {
      return product.stages.approval === 'current' || product.stages.posted === 'current'
    }
    if (filter === 'in-progress') {
      return Object.values(product.stages).some(s => s === 'current')
    }
    if (filter === 'completed') {
      return product.stages.analytics === 'done'
    }
    return true
  })

  const getActionBadge = (product: any) => {
    if (product.stages.analytics === 'done') {
      return <Badge variant="success">✅ Selesai</Badge>
    }
    if (product.stages.approval === 'current' || product.stages.posted === 'current') {
      return <Badge variant="warning">⚡ Action Needed</Badge>
    }
    if (Object.values(product.stages).some(s => s === 'current')) {
      return <Badge variant="info">🔄 Dalam Proses</Badge>
    }
    return <Badge variant="default">⏳ Menunggu</Badge>
  }

  if (isLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          📊 Pipeline Produk
        </h1>
        <p className="text-gray-500">
          Pantau progress semua produk dari riset sampai analytics
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-sky-50 to-sky-100 border-sky-200">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-sky-700">{products.length}</p>
            <p className="text-sm text-sky-600">Total Produk</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-orange-700">
              {products.filter(p => p.stages.approval === 'current' || p.stages.posted === 'current').length}
            </p>
            <p className="text-sm text-orange-600">⚡ Action Needed</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-purple-700">
              {products.filter(p => Object.values(p.stages).some(s => s === 'current')).length}
            </p>
            <p className="text-sm text-purple-600">🔄 Dalam Proses</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-green-700">
              {products.filter(p => p.stages.analytics === 'done').length}
            </p>
            <p className="text-sm text-green-600">✅ Completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { key: 'all', label: 'Semua' },
          { key: 'action-needed', label: '⚡ Butuh Action' },
          { key: 'in-progress', label: '🔄 Dalam Proses' },
          { key: 'completed', label: '✅ Selesai' },
        ].map(tab => (
          <Button
            key={tab.key}
            variant={filter === tab.key ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setFilter(tab.key as typeof filter)}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Product List */}
      <div className="space-y-4">
        {filteredProducts.map(product => (
          <Card key={product.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl">
                    {product.image}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{product.name}</h3>
                    <p className="text-sm text-gray-500">
                      {product.niche} • {product.createdAt}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getActionBadge(product)}
                </div>
              </div>

              {/* Pipeline Stages */}
              <div className="mb-4">
                <div className="flex items-center gap-1">
                  {stages.map((stage, index) => {
                    const status = product.stages[stage.key as keyof typeof product.stages]
                    const Icon = stage.icon
                    const isLast = index === stages.length - 1

                    return (
                      <div key={stage.key} className="flex items-center">
                        <div className={cn(
                          "flex flex-col items-center px-3 py-2 rounded-lg transition-all",
                          status === 'done' && "bg-green-100 text-green-700",
                          status === 'current' && "bg-orange-100 text-orange-700",
                          status === 'pending' && "bg-gray-100 text-gray-400"
                        )}>
                          <Icon className="w-4 h-4 mb-1" />
                          <span className="text-xs font-medium">{stage.label}</span>
                          <span className="text-[10px] opacity-70">{stage.agent}</span>
                        </div>
                        {!isLast && (
                          <ChevronRight className={cn(
                            "w-4 h-4 mx-1",
                            status === 'done' ? "text-green-500" : "text-gray-300"
                          )} />
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Action Info */}
              <div className={cn(
                "p-4 rounded-lg border",
                product.stages.approval === 'current' || product.stages.posted === 'current'
                  ? "bg-orange-50 border-orange-200"
                  : product.stages.analytics === 'done'
                    ? "bg-green-50 border-green-200"
                    : "bg-gray-50 border-gray-200"
              )}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900 mb-1">
                      {product.currentAction}
                    </p>
                    <p className="text-xs text-gray-500">
                      Next: {product.nextAction} • oleh {product.nextActionBy}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-green-600">
                      Est. Komisi: {product.estimatedCommission}
                    </p>
                    <p className="text-xs text-gray-500">
                      Updated: {product.updatedAt}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {product.stages.approval === 'current' && (
                <div className="mt-4 flex gap-2">
                  <Button variant="success" size="sm">
                    ✅ Approve Script
                  </Button>
                  <Button variant="outline" size="sm">
                    ✏️ Edit Script
                  </Button>
                </div>
              )}
              {product.stages.posted === 'current' && (
                <div className="mt-4 flex gap-2">
                  <Button variant="primary" size="sm">
                    📱 Input Link Posting
                  </Button>
                  <Button variant="outline" size="sm">
                    📊 Input Performa
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {products.length === 0 ? 'Belum Ada Produk' : 'Tidak ada produk sesuai filter'}
            </h3>
            <p className="text-gray-500">
              {products.length === 0
                ? 'Mulai riset produk dengan Elang untuk melihat pipeline di sini'
                : 'Coba ubah filter untuk melihat produk lain'}
            </p>
            {products.length === 0 && (
              <Button className="mt-4" onClick={() => window.location.href = '/elang'}>
                🦅 Mulai Riset Produk
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
