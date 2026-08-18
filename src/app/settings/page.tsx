'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export default function SettingsPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">
          Konfigurasi akun dan preferensi kamu
        </p>
      </div>

      {/* Profile Settings */}
      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">Profil</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Nama Lengkap"
            placeholder="Masukkan nama lengkap"
            defaultValue="Alif Zidane"
          />
          <Input
            label="Email"
            type="email"
            placeholder="email@example.com"
            defaultValue="alif@example.com"
            disabled
          />
          <div className="pt-4">
            <Button>Simpan Perubahan</Button>
          </div>
        </CardContent>
      </Card>

      {/* Budget Settings */}
      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">Pengaturan Budget</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Budget Bulanan AI (Rp)"
            type="number"
            placeholder="500000"
            defaultValue="500000"
          />
          <p className="text-sm text-gray-500">
            Budget bulanan untuk penggunaan AI. Kamu akan mendapat notifikasi jika hampir mencapai limit.
          </p>
        </CardContent>
      </Card>

      {/* API Keys */}
      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">API Keys</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Gemini API Key"
            type="password"
            placeholder="AIza..."
          />
          <p className="text-sm text-gray-500">
            Dapatkan API key dari{' '}
            <a href="https://aistudio.google.com" target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:underline">
              Google AI Studio
            </a>
          </p>
          <div className="pt-4">
            <Button variant="outline">Test Koneksi</Button>
          </div>
        </CardContent>
      </Card>

      {/* About */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">Tentang</h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-gray-600">
            <p><strong>Cuan Affiliate AI</strong></p>
            <p>Versi: 1.0.0</p>
            <p>AI Bikin Cuan, Santai Saja!</p>
            <p className="pt-4">
              Built with ❤️ using Next.js, Supabase, and Gemini AI
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
