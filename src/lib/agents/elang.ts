import { TrendingProduct } from '@/lib/types'

const ELANG_SYSTEM_PROMPT = `Kamu adalah ELANG, AI Research Agent yang punya penglihatan super tajam!

FILOSOFI: Elang bisa melihat mangsa dari ribuan meter ketinggian. Seperti Elang, kamu bisa "melihat" produk trending dari seluruh penjuru internet sebelum orang lain menyadarinya.

TUGAS UTAMA:
- Cari produk yang sedang TRENDING di Indonesia
- Cari produk yang VIRAL di TikTok, Instagram, YouTube
- Cari produk BEST SELLER di Shopee
- Analisis kenapa produk tersebut trending
- Berikan data yang AKURAT dan BERGUNA

FORMAT RESPON:
Selalu berikan hasil dalam format JSON yang rapi dan terstruktur.

NICHE YANG BISA DICARI:
- Rumah Tangga (dapur, kamar, cleaning)
- Fashion (pakaian, aksesoris, tas)
- Gadget (HP, accessories, smart device)
- Kecantikan (skincare, makeup, haircare)
- Ibu & Bayi (perlengkapan bayi, mainan edukatif)
- Makanan (snack, minuman, herbal)

KUALITAS HASIL:
- Focus ke produk dengan POTENSIAL KOMISI TINGGI (5-15%)
- Prioritaskan produk dengan HARGA 20rb - 200rb (mudah beli impulsif)
- Cari produk yang MUDAH untuk dibuatin konten (visual, before-after)
- Produk harus SANGAT TRENDING saat ini (bukan yang sudah lewat trennya)

WASPADA:
- Jangan kasih produk yang SUDAH OVERTREND (terlalu banyak competitor)
- Jangan kasih produk yang sulit dibuatin konten visual
- Prioritaskan produk Indonesia atau yang familiar di pasar Indonesia`

export async function researchProducts(
  niche: string,
  maxProducts: number = 10
): Promise<TrendingProduct[]> {
  const prompt = `Tolong riset produk TRENDING untuk niche "${niche}" di Indonesia.

Cari ${maxProducts} produk yang sedang:
1. VIRAL di TikTok Indonesia
2. VIRAL di Instagram Reels Indonesia
3. BEST SELLER di Shopee Indonesia
4. TRENDING di Google Searches Indonesia

Untuk setiap produk, berikan:
- Nama produk yang spesifik
- Kenapa produk ini sedang trending
- Estimated harga dalam Rupiah
- Estimated commission percentage
- Platform dimana produk ini viral
- Target audience yang cocok
- Selling points yang bisa dipakai untuk konten
- Difficulty untuk dibuatin konten (Mudah/Sedang/Sulit)

Kembalikan dalam format JSON dengan struktur:
{
  "products": [
    {
      "name": "Nama Produk Spesifik",
      "trendScore": 85,
      "whyTrending": "Penjelasan kenapa trending, termasuk platform dan jumlah views/mentions",
      "estimatedViews": "Estimasi views konten tentang produk ini (contoh: 100K-500K)",
      "estimatedPrice": "150000",
      "estimatedCommission": "7.5%",
      "difficulty": "Mudah",
      "platforms": ["TikTok", "Instagram"],
      "targetAudience": ["Ibu rumah tangga", "Anak kosan"],
      "sellingPoints": ["Bikin dapur rapi", "Harga murah", "Praktis"]
    }
  ],
  "sources": ["TikTok Trending", "Shopee Best Seller", "Instagram Reels", "Google Trends"]
}

PENTING:
- Berikan produk yang BENAR-BENAR TRENDING SAAT INI (Agustus 2026)
- Produk harus relevan dengan pasar Indonesia
- Prioritaskan produk dengan harga 20rb - 300rb
- Produk harus punya POTENSIAL VISUAL yang bagus untuk konten`

  try {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY
    const model = 'gemini-3.6-flash'

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: `${ELANG_SYSTEM_PROMPT}\n\n${prompt}` }]
        }],
        generationConfig: {
          temperature: 0.8,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
        }
      })
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Gemini API error:', data)
      throw new Error(data.error?.message || 'Failed to call Gemini API')
    }

    if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
      throw new Error('Invalid response from Gemini')
    }

    const text = data.candidates[0].content.parts[0].text

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No JSON found in response')
    }

    const result = JSON.parse(jsonMatch[0])
    return result.products || []
  } catch (error) {
    console.error('Elang research error:', error)
    throw error
  }
}
