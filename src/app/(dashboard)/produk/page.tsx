'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { supabase } from '@/lib/supabase/client'
import { showToast } from '@/components/layout/GlobalComponents'
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  Copy,
  ExternalLink,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Link,
  DollarSign,
  Tag,
  X,
  Image as ImageIcon,
} from 'lucide-react'

interface Product {
  id: string
  name: string
  niche: string
  estimated_price: string
  estimated_commission: string
  affiliate_link: string
  product_image: string
  notes: string
  status: 'draft' | 'ready' | 'posted'
  created_at: string
}

const statusOptions = [
  { value: 'draft', label: 'Draft', color: 'bg-gray-100 text-gray-700' },
  { value: 'ready', label: 'Siap Posting', color: 'bg-amber-100 text-amber-700' },
  { value: 'posted', label: 'Sudah Posting', color: 'bg-green-100 text-green-700' },
]

const nicheOptions = [
  { value: 'rumah-tangga', label: 'Rumah Tangga' },
  { value: 'fashion', label: 'Fashion' },
  { value: 'gadget', label: 'Gadget' },
  { value: 'kecantikan', label: 'Kecantikan' },
  { value: 'ibu-bayi', label: 'Ibu & Bayi' },
  { value: 'makanan', label: 'Makanan' },
  { value: 'lainnya', label: 'Lainnya' },
]

export default function ProdukPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    niche: 'fashion',
    estimated_price: '',
    estimated_commission: '',
    affiliate_link: '',
    product_image: '',
    notes: '',
    status: 'draft' as const,
  })

  useEffect(() => {
    checkUser()
  }, [])

  useEffect(() => {
    if (user) {
      fetchProducts()
    }
  }, [user])

  const checkUser = async () => {
    const { data } = await supabase.auth.getUser()
    setUser(data.user)
  }

  const fetchProducts = async () => {
    if (!user) return

    setIsLoading(true)
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (!error && data) {
      setProducts(data)
    }
    setIsLoading(false)
  }

  const openAddModal = () => {
    setEditingProduct(null)
    setFormData({
      name: '',
      niche: 'fashion',
      estimated_price: '',
      estimated_commission: '',
      affiliate_link: '',
      product_image: '',
      notes: '',
      status: 'draft',
    })
    setShowModal(true)
  }

  const openEditModal = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name || '',
      niche: product.niche || 'fashion',
      estimated_price: product.estimated_price || '',
      estimated_commission: product.estimated_commission || '',
      affiliate_link: product.affiliate_link || '',
      product_image: product.product_image || '',
      notes: product.notes || '',
      status: product.status || 'draft',
    })
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!user || !formData.name.trim()) return

    setIsSaving(true)
    try {
      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update({
            name: formData.name,
            niche: formData.niche,
            estimated_price: formData.estimated_price,
            estimated_commission: formData.estimated_commission,
            affiliate_link: formData.affiliate_link,
            product_image: formData.product_image,
            notes: formData.notes,
            status: formData.status,
          })
          .eq('id', editingProduct.id)

        if (error) throw error
        showToast('Produk berhasil diupdate!', 'success')
      } else {
        const { error } = await supabase.from('products').insert({
          user_id: user.id,
          name: formData.name,
          niche: formData.niche,
          estimated_price: formData.estimated_price,
          estimated_commission: formData.estimated_commission,
          affiliate_link: formData.affiliate_link,
          product_image: formData.product_image,
          notes: formData.notes,
          status: formData.status,
        })

        if (error) throw error
        showToast('Produk berhasil ditambahkan!', 'success')
      }

      setShowModal(false)
      fetchProducts()
    } catch (err) {
      console.error('Error saving product:', err)
      showToast('Gagal menyimpan produk', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (!error) {
      setProducts(products.filter(p => p.id !== id))
      showToast('Produk berhasil dihapus!', 'success')
    }
    setDeleteConfirm(null)
  }

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const getStatusBadge = (status: string) => {
    const option = statusOptions.find(s => s.value === status)
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${option?.color}`}>
        {option?.label}
      </span>
    )
  }

  const stats = {
    total: products.length,
    draft: products.filter(p => p.status === 'draft').length,
    ready: products.filter(p => p.status === 'ready').length,
    posted: products.filter(p => p.status === 'posted').length,
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl flex items-center justify-center shadow-lg">
              <Package className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Produk Saya</h1>
              <p className="text-gray-500">Kelola produk dan link affiliate</p>
            </div>
          </div>
          <Button
            onClick={openAddModal}
            className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
          >
            <Plus className="w-5 h-5 mr-2" />
            Tambah Produk
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <Package className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-xs text-gray-500">Total Produk</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                <Edit2 className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.draft}</p>
                <p className="text-xs text-gray-500">Draft</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.ready}</p>
                <p className="text-xs text-gray-500">Siap Posting</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <ExternalLink className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.posted}</p>
                <p className="text-xs text-gray-500">Sudah Posting</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Products List */}
      {isLoading ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Loader2 className="w-8 h-8 mx-auto animate-spin text-purple-500 mb-4" />
            <p className="text-gray-500">Memuat produk...</p>
          </CardContent>
        </Card>
      ) : products.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-purple-100 rounded-2xl flex items-center justify-center">
              <Package className="w-10 h-10 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Belum Ada Produk
            </h3>
            <p className="text-gray-500 max-w-md mx-auto mb-4">
              Tambahkan produk pertama kamu dengan link affiliate untuk mulai earn!
            </p>
            <Button onClick={openAddModal}>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Produk Pertama
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {products.map((product) => (
            <Card key={product.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Product Image */}
                  <div className="w-full md:w-24 h-24 bg-gray-100 rounded-xl flex-shrink-0 overflow-hidden">
                    {product.product_image ? (
                      <img
                        src={product.product_image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-gray-300" />
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-500 capitalize">{product.niche.replace('-', ' ')}</p>
                      </div>
                      {getStatusBadge(product.status)}
                    </div>

                    <div className="flex flex-wrap gap-4 mb-3">
                      {product.estimated_price && (
                        <div className="flex items-center gap-1 text-sm">
                          <DollarSign className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">Rp {product.estimated_price}</span>
                        </div>
                      )}
                      {product.estimated_commission && (
                        <div className="flex items-center gap-1 text-sm">
                          <Tag className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">Komisi {product.estimated_commission}</span>
                        </div>
                      )}
                    </div>

                    {/* Affiliate Link */}
                    {product.affiliate_link && (
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex-1 bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-600 truncate">
                          {product.affiliate_link}
                        </div>
                        <button
                          onClick={() => copyToClipboard(product.affiliate_link!, product.id)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Copy link"
                        >
                          {copiedId === product.id ? (
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                          ) : (
                            <Copy className="w-5 h-5 text-gray-500" />
                          )}
                        </button>
                        <a
                          href={product.affiliate_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Buka link"
                        >
                          <ExternalLink className="w-5 h-5 text-gray-500" />
                        </a>
                      </div>
                    )}

                    {/* Notes */}
                    {product.notes && (
                      <p className="text-sm text-gray-500 bg-gray-50 rounded-lg p-2">
                        {product.notes}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex md:flex-col gap-2 md:items-end">
                    <button
                      onClick={() => openEditModal(product)}
                      className="p-2 hover:bg-purple-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-5 h-5 text-purple-500" />
                    </button>
                    {deleteConfirm === product.id ? (
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 bg-red-100 hover:bg-red-200 rounded-lg transition-colors"
                          title="Konfirmasi hapus"
                        >
                          <CheckCircle2 className="w-5 h-5 text-red-500" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Batal"
                        >
                          <X className="w-5 h-5 text-gray-500" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(product.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        title="Hapus"
                      >
                        <Trash2 className="w-5 h-5 text-red-400" />
                      </button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <h2 className="text-xl font-bold text-gray-900">
                {editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Product Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Produk *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Kacamata Vintage Round Metal"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none"
                />
              </div>

              {/* Niche */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kategori / Niche
                </label>
                <select
                  value={formData.niche}
                  onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none"
                >
                  {nicheOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price & Commission */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estimasi Harga (Rp)
                  </label>
                  <input
                    type="text"
                    value={formData.estimated_price}
                    onChange={(e) => setFormData({ ...formData, estimated_price: e.target.value })}
                    placeholder="150000"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estimasi Komisi
                  </label>
                  <input
                    type="text"
                    value={formData.estimated_commission}
                    onChange={(e) => setFormData({ ...formData, estimated_commission: e.target.value })}
                    placeholder="7.5%"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none"
                  />
                </div>
              </div>

              {/* Affiliate Link */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Link Affiliate *
                </label>
                <div className="relative">
                  <Link className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="url"
                    value={formData.affiliate_link}
                    onChange={(e) => setFormData({ ...formData, affiliate_link: e.target.value })}
                    placeholder="https://shopee.co.id/..."
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none"
                  />
                </div>
              </div>

              {/* Product Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL Gambar Produk
                </label>
                <input
                  type="url"
                  value={formData.product_image}
                  onChange={(e) => setFormData({ ...formData, product_image: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Catatan
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Catatan tambahan tentang produk ini..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none resize-none"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowModal(false)}
                  className="flex-1"
                >
                  Batal
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isSaving || !formData.name.trim() || !formData.affiliate_link.trim()}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      {editingProduct ? 'Simpan Perubahan' : 'Simpan Produk'}
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
