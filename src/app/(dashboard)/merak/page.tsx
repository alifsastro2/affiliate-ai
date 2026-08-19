'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/Card'

export default function MerakPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center text-4xl shadow-lg">
            🦚
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Merak</h1>
            <p className="text-gray-500">Content Agent</p>
          </div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
          <p className="text-purple-800 text-sm italic">
            "Merak buka bulunya, semua mata tertuju. Seperti Merak, konten yang dihasilkan
            harus bikin orang berhenti scroll dan memperhatikan."
          </p>
        </div>
      </div>

      {/* Coming Soon */}
      <Card>
        <CardContent className="py-16 text-center">
          <div className="text-6xl mb-4">🦚</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Merak Sedang Bersiap...
          </h2>
          <p className="text-gray-500 max-w-md mx-auto">
            Fitur generate konten video dari Merak masih dalam pengembangan.
            Lanjut ke Elang dulu untuk riset produk!
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
