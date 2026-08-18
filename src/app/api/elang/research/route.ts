import { NextResponse } from 'next/server'
import { researchProducts } from '@/lib/agents/elang'

export async function POST(request: Request) {
  try {
    const { niche, maxProducts } = await request.json()

    if (!niche) {
      return NextResponse.json(
        { error: 'Niche is required' },
        { status: 400 }
      )
    }

    const products = await researchProducts(niche, maxProducts || 10)

    return NextResponse.json({
      success: true,
      products,
      totalFound: products.length,
      researchTime: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error('Elang API error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to research products' },
      { status: 500 }
    )
  }
}
