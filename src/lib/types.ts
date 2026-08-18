export interface Profile {
  id: string
  full_name: string | null
  avatar_url: string | null
  budget_monthly: number
  budget_used: number
  created_at: string
  updated_at: string
}

export interface Niche {
  id: string
  user_id: string
  name: string
  slug: string
  icon: string
  created_at: string
}

export interface Product {
  id: string
  user_id: string
  niche_id: string | null
  name: string
  affiliate_link: string | null
  shopee_link: string | null
  estimated_price: number | null
  estimated_commission: number | null
  commission_percentage: number
  category: string | null
  foto_url: string | null
  elang_trend_score: number | null
  elang_why_trending: string | null
  elang_estimated_views: string | null
  elang_difficulty: string | null
  elang_platforms: string[] | null
  elang_market_analysis: string | null
  elang_target_audience: string[] | null
  elang_selling_points: string[] | null
  status: 'pending' | 'analyzed' | 'approved' | 'archived'
  created_at: string
  updated_at: string
}

export interface ContentIdea {
  id: string
  user_id: string
  product_id: string
  idea: string
  content_angle: string | null
  platform: string | null
  estimated_views: string | null
  difficulty: string | null
  priority_score: number
  status: 'idea' | 'scripted' | 'posted'
  created_at: string
}

export interface Script {
  id: string
  user_id: string
  product_id: string
  content_idea_id: string | null
  hook: string | null
  pain: string | null
  product_intro: string | null
  transformation: string | null
  cta: string | null
  outro: string | null
  full_script: string | null
  duration_seconds: number
  platform: string | null
  tone: string | null
  caption: string | null
  hashtags: string[] | null
  thumbnail_concept: string | null
  visual_guide: string | null
  status: 'draft' | 'approved' | 'rejected' | 'posted'
  approved_at: string | null
  created_at: string
  updated_at: string
}

export interface Post {
  id: string
  user_id: string
  script_id: string | null
  product_id: string | null
  platform: string
  post_url: string | null
  posted_at: string | null
  notes: string | null
  created_at: string
}

export interface Performance {
  id: string
  user_id: string
  post_id: string
  views: number
  likes: number
  shares: number
  comments: number
  link_clicks: number
  orders: number
  commission: number
  recorded_date: string
  recorded_at: string
}

export interface Insight {
  id: string
  user_id: string
  insight_type: string | null
  title: string
  content: string
  evidence: Record<string, any> | null
  recommendation: string | null
  confidence: number | null
  created_at: string
}

export interface AIUsage {
  id: string
  user_id: string
  agent: 'elang' | 'merak' | 'semut' | 'unta'
  action: string
  model: string | null
  input_tokens: number
  output_tokens: number
  estimated_cost: number
  created_at: string
}

export interface Activity {
  id: string
  user_id: string
  type: string
  agent: string | null
  title: string
  description: string | null
  metadata: Record<string, any> | null
  created_at: string
}

// AI Response Types
export interface TrendingProduct {
  name: string
  trendScore: number
  whyTrending: string
  estimatedViews: string
  estimatedPrice: string
  estimatedCommission: string
  difficulty: 'Mudah' | 'Sedang' | 'Sulit'
  platforms: string[]
  targetAudience: string[]
  sellingPoints: string[]
  niche: string
}

export interface ElangResearchResult {
  products: TrendingProduct[]
  totalFound: number
  researchTime: string
  sources: string[]
}
