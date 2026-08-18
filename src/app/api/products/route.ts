import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function POST(request: Request) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const { user_id, products } = await request.json()

    if (!user_id || !products || !Array.isArray(products)) {
      return NextResponse.json(
        { error: 'user_id and products array are required' },
        { status: 400 }
      )
    }

    const results = []

    for (const product of products) {
      // Insert product
      const { data: insertedProduct, error: insertError } = await supabase
        .from('products')
        .insert({
          user_id,
          name: product.name,
          niche_id: null, // Will be set when user selects niche
          elang_trend_score: product.trendScore,
          elang_why_trending: product.whyTrending,
          elang_estimated_views: product.estimatedViews,
          elang_difficulty: product.difficulty,
          elang_platforms: product.platforms,
          elang_target_audience: product.targetAudience,
          elang_selling_points: product.sellingPoints,
          estimated_price: parseInt(product.estimatedPrice) || null,
          estimated_commission: parseFloat(product.estimatedCommission?.replace('%', '')) || null,
          status: 'pending',
        })
        .select()
        .single()

      if (insertError) {
        console.error('Insert error:', insertError)
        continue
      }

      // Log activity
      await supabase
        .from('activities')
        .insert({
          user_id,
          type: 'research',
          agent: 'elang',
          title: `Elang menemukan produk trending: ${product.name}`,
          description: `Trend Score: ${product.trendScore}/100 | Est. Komisi: ${product.estimatedCommission}`,
          metadata: { product_id: insertedProduct.id, product_data: product },
        })

      results.push(insertedProduct)
    }

    return NextResponse.json({
      success: true,
      products: results,
      count: results.length,
    })
  } catch (error: any) {
    console.error('Save products error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to save products' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const { searchParams } = new URL(request.url)
    const user_id = searchParams.get('user_id')

    if (!user_id) {
      return NextResponse.json(
        { error: 'user_id is required' },
        { status: 400 }
      )
    }

    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .eq('user_id', user_id)
      .eq('status', 'pending')
      .order('elang_trend_score', { ascending: false })

    if (error) throw error

    return NextResponse.json({
      success: true,
      products,
    })
  } catch (error: any) {
    console.error('Get products error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get products' },
      { status: 500 }
    )
  }
}
