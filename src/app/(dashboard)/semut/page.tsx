'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/Card'

export default function SemutPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center text-4xl shadow-lg">
            🐜
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Semut</h1>
            <p className="text-gray-500">Analytics Agent</p>
          </div>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-amber-800 text-sm italic">
            "Semut bekerja sedikit-sedikit sampai terbentuk tumpukan besar. Aku analisasi setiap
            data untuk temukan pola yang bermakna."
          </p>
        </div>
      </div>

      {/* Coming Soon */}
      <Card>
        <CardContent className="py-16 text-center">
          <div className="text-6xl mb-4">🐜</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Semut Sedang Mengumpulkan Data...
          </h2>
          <p className="text-gray-500 max-w-md mx-auto">
            Fitur analisis performa dari Semut masih dalam pengembangan.
            Mulai riset produk dengan Elang dan buat konten dengan Merak dulu!
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
