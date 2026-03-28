import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { searchParams } = new URL(req.url)

    const role = searchParams.get('role')
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const scoreMin = searchParams.get('score_min')
    const scoreMax = searchParams.get('score_max')

    // email intentionally excluded — DATA-06 privacy requirement enforced at query level
    let query = supabase
      .from('mock_candidates')
      .select(
        'id, full_name, role, avatar_initials, avatar_color, crima_score, trust_score, fraud_flag_severity, fraud_flag_count, status, test_date'
      )
      .order('test_date', { ascending: false })

    if (role) {
      query = query.eq('role', role)
    }
    if (status) {
      query = query.eq('status', status)
    }
    if (search) {
      query = query.ilike('full_name', `%${search}%`)
    }
    if (scoreMin) {
      query = query.gte('crima_score', Number(scoreMin))
    }
    if (scoreMax) {
      query = query.lte('crima_score', Number(scoreMax))
    }

    const { data, error } = await query

    if (error) {
      console.error('[candidates] supabase error:', error.message)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
