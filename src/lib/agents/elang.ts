import { TrendingProduct } from '@/lib/types'

const ELANG_SYSTEM_PROMPT = `Kamu adalah ELANG, AI Research Agent dengan kemampuan browsing internet!

FILOSOFI: Elang bisa melihat mangsa dari ribuan meter ketinggian. Seperti Elang, kamu bisa "melihat" produk trending dari seluruh penjuru internet sebelum orang lain menyadarinya.

⚠️ PENTING - WAJIB BROWSING:
Kamu HARUS browsing internet untuk mengambil data REAL-TIME tentang:
- TikTok trending products Indonesia
- Shopee best seller Indonesia
- Instagram Reels viral products
- Google Trends Indonesia
- YouTube product reviews

Jangan cuma pakai pengetahuan trainingmu! LAKUKAN BROWSING untuk dapat data yang AKTUAL dan FRESH.

TUGAS UTAMA:
1. BROWSE Google Trends Indonesia untuk niche yang diminta
2. BROWSE TikTok Shop atau cari "TikTok viral products Indonesia"
3. BROWSE Shopee best sellers di kategori tersebut
4. BROWSE Instagram/TikTok untuk hashtag trending related products
5. ANALISIS dan RANGKUM data dari semua sumber

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
- Produk harus SANGAT TRENDING SAAT INI (bukan yang sudah lewat trennya)

WASPADA:
- Jangan kasih produk yang SUDAH OVERTREND (terlalu banyak competitor)
- Jangan kasih produk yang sulit dibuatin konten visual
- Prioritaskan produk Indonesia atau yang familiar di pasar Indonesia
- DATA HARUS REAL-TIME dari browsing, bukan dari memory training!`

// Retry logic with exponential backoff
async function fetchWithRetry(
  url: string,
  options: RequestInit,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<Response> {
  let lastError: Error | null = null

  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options)

      // If rate limited (429) or overloaded (503), retry
      if (response.status === 429 || response.status === 503) {
        throw new Error(`Rate limited: ${response.status}`)
      }

      return response
    } catch (error: any) {
      lastError = error
      console.log(`Attempt ${i + 1} failed: ${error.message}. Retrying...`)

      if (i < maxRetries - 1) {
        // Exponential backoff: 1s, 2s, 4s
        const delay = initialDelay * Math.pow(2, i)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }

  throw lastError || new Error('Max retries exceeded')
}

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
- Produk harus punya POTENSIAL VISUAL yang bagus untuk konten
- Jangan beri produk yang sama berulang kali
- Beri variasi produk yang berbeda-beda`

  let lastError: Error | null = null

  // Free tier has lower rate limits, so we retry more times with longer delays
  const maxAttempts = 5
  const baseDelay = 5000 // Start with 5 seconds

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY
      const model = 'gemini-3.6-flash'

      console.log(`Attempt ${attempt}/${maxAttempts}: Calling Gemini API...`)

      const response = await fetchWithRetry(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
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
        },
        3,
        2000 // 2s delay for fetch retry
      )

      const data = await response.json()

      if (!response.ok) {
        console.error('Gemini API error:', data)
        const errorMsg = data.error?.message || `HTTP ${response.status}`
        throw new Error(errorMsg)
      }

      if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
        throw new Error('Invalid response from Gemini - no content')
      }

      const text = data.candidates[0].content.parts[0].text

      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No JSON found in response')
      }

      const result = JSON.parse(jsonMatch[0])
      console.log(`Success! Found ${result.products?.length || 0} products`)
      return result.products || []
    } catch (error: any) {
      console.error(`Attempt ${attempt} failed:`, error.message)
      lastError = error

      // Wait before retry - longer delays for free tier
      if (attempt < maxAttempts) {
        const waitTime = baseDelay * attempt // 5s, 10s, 15s, 20s
        console.log(`Waiting ${waitTime/1000} seconds before retry...`)
        await new Promise(resolve => setTimeout(resolve, waitTime))
      }
    }
  }

  // All attempts failed
  const errorMessage = lastError?.message || 'Max retries exceeded'
  console.error('All attempts failed:', errorMessage)
  throw new Error(`Gemini AI sedang sangat sibuk (free tier). Coba lagi dalam 10-15 menit, atau coba jam-jam sepi seperti pagi hari.`)
}
