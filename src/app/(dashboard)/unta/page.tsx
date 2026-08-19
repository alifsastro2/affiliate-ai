'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/Card'

export default function UntaPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center text-4xl shadow-lg">
            🐪
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Unta</h1>
            <p className="text-gray-500">Budget Agent</p>
          </div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <p className="text-green-800 text-sm italic">
            "Unta bertahan di gurun dengan bekal air yang sedikit. Aku pastikan setiap rupiah
            mengeluarkan hasil maksimal."
          </p>
        </div>
      </div>

      {/* Coming Soon */}
      <Card>
        <CardContent className="py-16 text-center">
          <div className="text-6xl mb-4">🐪</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Unta Sedang Mengawasi Budget...
          </h2>
          <p className="text-gray-500 max-w-md mx-auto">
            Fitur monitoring budget dari Unta masih dalam pengembangan.
            Fitur ini akan track semua biaya AI dan pastikan ROI-mu tetap positif!
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
