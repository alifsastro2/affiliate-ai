'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { formatCurrency, formatNumber } from '@/lib/utils'
import {
  TrendingUp,
  ShoppingCart,
  Eye,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Search,
  Palette,
  BarChart3,
  CheckCircle2,
  Clock,
  Activity,
  Rocket,
  FileText,
  Users,
  TrendingUp as TrendUp,
  DollarSign,
  Sparkles,
} from 'lucide-react'
import Link from 'next/link'

// Mock data for demo - nanti bisa diambil dari Supabase
const stats = {
  totalCommission: 1250000,
  totalOrders: 47,
  totalViews: 12500,
  aiCost: 85000,
  commissionTrend: 23,
  ordersTrend: 12,
  viewsTrend: 45,
  costTrend: -10,
}

const agents = [
  {
    name: 'Elang',
    role: 'Research Agent',
    icon: Search,
    color: 'sky',
    colorClass: 'from-sky-400 to-sky-600',
    bgClass: 'bg-sky-100',
    iconClass: 'text-sky-600',
    description: 'Cari produk trending',
    status: 'ready',
    href: '/elang',
  },
  {
    name: 'Merak',
    role: 'Content Agent',
    icon: Palette,
    color: 'purple',
    colorClass: 'from-purple-400 to-purple-600',
    bgClass: 'bg-purple-100',
    iconClass: 'text-purple-600',
    description: 'Generate bahan video',
    status: 'ready',
    href: '/merak',
  },
  {
    name: 'Semut',
    role: 'Analytics Agent',
    icon: BarChart3,
    color: 'amber',
    colorClass: 'from-amber-400 to-amber-600',
    bgClass: 'bg-amber-100',
    iconClass: 'text-amber-600',
    description: 'Analisis performa',
    status: 'idle',
    href: '/semut',
  },
  {
    name: 'Unta',
    role: 'Budget Agent',
    icon: Wallet,
    color: 'green',
    colorClass: 'from-green-400 to-green-600',
    bgClass: 'bg-green-100',
    iconClass: 'text-green-600',
    description: 'Pantau biaya AI',
    status: 'ready',
    href: '/unta',
  },
]

const recentActivities = [
  {
    agent: 'Elang',
    icon: Search,
    bgClass: 'bg-sky-100',
    iconClass: 'text-sky-600',
    title: 'Menemukan 12 produk trending di niche "Rumah Tangga"',
    time: '5 menit lalu',
    type: 'research',
  },
  {
    agent: 'Merak',
    icon: Palette,
    bgClass: 'bg-purple-100',
    iconClass: 'text-purple-600',
    title: 'Generate 5 script untuk "Rak Bumbu Magnet"',
    time: '15 menit lalu',
    type: 'content',
  },
  {
    agent: 'System',
    icon: CheckCircle2,
    bgClass: 'bg-green-100',
    iconClass: 'text-green-600',
    title: 'Approve script #12 untuk posting',
    time: '1 jam lalu',
    type: 'approval',
  },
  {
    agent: 'System',
    icon: Rocket,
    bgClass: 'bg-orange-100',
    iconClass: 'text-orange-600',
    title: 'Posting TikTok "Before/After Dapur" berhasil',
    time: '2 jam lalu',
    type: 'posting',
  },
  {
    agent: 'Semut',
    icon: Activity,
    bgClass: 'bg-amber-100',
    iconClass: 'text-amber-600',
    title: 'Analisis: Before/After content paling perform',
    time: '3 jam lalu',
    type: 'insight',
  },
  {
    agent: 'Unta',
    icon: DollarSign,
    bgClass: 'bg-green-100',
    iconClass: 'text-green-600',
    title: 'Komisi masuk Rp 85.000 dari video yesterday',
    time: '5 jam lalu',
    type: 'commission',
  },
]

export default function Dashboard() {
  return (
    <div className="border-4 border-yellow-500 outline-4 outline-yellow-300 outline-offset-2 outline" style={{ margin: 0, padding: 0 }}>
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          Halo, Alif Zidane!
        </h1>
        <p className="text-gray-500 mt-2 flex items-center gap-2">
          Selamat datang di Command Center affiliate-mu.
          <span className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-2 py-0.5 rounded-full text-sm font-medium">
            AI Bikin Cuan, Santai Saja!
          </span>
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Commission */}
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="p-2 bg-green-100 rounded-lg">
                <Wallet className="w-5 h-5 text-green-600" />
              </div>
              <Badge variant="success" className="flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" />
                {stats.commissionTrend}%
              </Badge>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-500">Total Komisi</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(stats.totalCommission)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Orders */}
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="p-2 bg-orange-100 rounded-lg">
                <ShoppingCart className="w-5 h-5 text-orange-600" />
              </div>
              <Badge variant="success" className="flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" />
                {stats.ordersTrend}%
              </Badge>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-500">Total Order</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(stats.totalOrders)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Views */}
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="p-2 bg-sky-100 rounded-lg">
                <Eye className="w-5 h-5 text-sky-600" />
              </div>
              <Badge variant="success" className="flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" />
                {stats.viewsTrend}%
              </Badge>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-500">Total Views</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(stats.totalViews)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* AI Cost */}
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Zap className="w-5 h-5 text-purple-600" />
              </div>
              <Badge variant="success" className="flex items-center gap-1">
                <ArrowDownRight className="w-3 h-3" />
                {Math.abs(stats.costTrend)}%
              </Badge>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-500">Biaya AI</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(stats.aiCost)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Agents Card - Takes 2 columns */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-orange-500" />
                  AI Agents Status
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Tim AI agents yang siap membantu bisnismu
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {agents.map((agent) => {
                const Icon = agent.icon
                return (
                  <Link
                    key={agent.name}
                    href={agent.href}
                    className="group p-4 border border-gray-200 rounded-xl hover:border-orange-300 hover:bg-orange-50/50 transition-all"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 bg-gradient-to-br ${agent.colorClass} rounded-xl flex items-center justify-center`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                          {agent.name}
                        </h3>
                        <p className="text-xs text-gray-500">{agent.role}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {agent.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge
                        variant={agent.status === 'ready' ? 'success' : 'warning'}
                        size="sm"
                      >
                        {agent.status === 'ready' ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Ready
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3 mr-1" />
                            Idle
                          </>
                        )}
                      </Badge>
                      <ArrowUpRight className="w-4 h-4 text-gray-400 group-hover:text-orange-500 transition-colors" />
                    </div>
                  </Link>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions Card */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Zap className="w-5 h-5 text-orange-500" />
              Quick Actions
            </h2>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/elang">
              <Button className="w-full justify-start" variant="outline">
                <Search className="w-4 h-4 mr-2" />
                Cari Produk Trending
              </Button>
            </Link>
            <Link href="/produk">
              <Button className="w-full justify-start" variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                Kelola Produk Saya
              </Button>
            </Link>
            <Link href="/merak">
              <Button className="w-full justify-start" variant="outline">
                <Palette className="w-4 h-4 mr-2" />
                Buat Konten Video
              </Button>
            </Link>
            <Link href="/semut">
              <Button className="w-full justify-start" variant="outline">
                <BarChart3 className="w-4 h-4 mr-2" />
                Analisa Performa
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="mt-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-orange-500" />
                Aktivitas Terakhir
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Update terbaru dari aktivitas bisnismu
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => {
              const Icon = activity.icon
              return (
                <div
                  key={index}
                  className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                >
                  <div className={`w-10 h-10 ${activity.bgClass} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-5 h-5 ${activity.iconClass}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.title}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
