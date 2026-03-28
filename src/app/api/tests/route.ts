import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createServerSupabaseClient } from '@/lib/supabase'

// ---------------------------------------------------------------------------
// GET /api/tests
// Returns all test template summaries, ordered by newest first.
// Optional query params:
//   ?status=  — filter by status (e.g. 'active', 'archived')
//   ?search=  — ilike match on name or role
// ---------------------------------------------------------------------------
export async function GET(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    let query = supabase
      .from('test_templates')
      .select('id, role, slug, name, modules, duration, status, created_at, response_count')
      .order('created_at', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,role.ilike.%${search}%`)
    }

    const { data, error } = await query

    if (error) {
      console.error('[tests] GET list error:', error.message)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }

    return NextResponse.json(data ?? [])
  } catch (err) {
    console.error('[tests] GET list unexpected error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ---------------------------------------------------------------------------
// POST /api/tests
// Creates a new test template.
// Body: { role, name, modules, customQuestions? }
// ---------------------------------------------------------------------------
const CreateTestSchema = z.object({
  role: z.string().min(1),
  name: z.string().min(1),
  modules: z.array(z.string()).min(1),
  customQuestions: z
    .array(
      z.object({
        text: z.string().min(1),
        type: z.string().min(1),
      })
    )
    .max(3)
    .optional(),
})

export async function POST(req: NextRequest) {
  // 1. Parse body
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  // 2. Zod validation
  const parsed = CreateTestSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid fields' }, { status: 400 })
  }

  try {
    const { role, name, modules, customQuestions } = parsed.data

    // 3. Generate shareable link
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
    const shareableLink = `${appUrl}/test/${crypto.randomUUID()}/intro`

    // 4. Supabase insert
    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase
      .from('test_templates')
      .insert({
        role,
        name,
        modules,
        custom_questions: customQuestions ?? [],
        status: 'active',
        shareable_link: shareableLink,
        response_count: 0,
      })
      .select()
      .single()

    if (error) {
      console.error('[tests] POST insert error:', error.message)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (err) {
    console.error('[tests] POST unexpected error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
