import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createServerSupabaseClient } from '@/lib/supabase'

// ---------------------------------------------------------------------------
// GET /api/tests/[id]
// Returns full test template with nested questions array and shareable_link.
// ---------------------------------------------------------------------------
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createServerSupabaseClient()

    const { data: test, error } = await supabase
      .from('test_templates')
      .select('*, questions(*)')
      .eq('id', id)
      .single()

    if (error || !test) {
      if (error?.code === 'PGRST116') {
        return NextResponse.json({ error: 'Not found' }, { status: 404 })
      }
      console.error('[tests/[id]] GET error:', error?.message)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }

    return NextResponse.json(test)
  } catch (err) {
    console.error('[tests/[id]] GET unexpected error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ---------------------------------------------------------------------------
// PUT /api/tests/[id]  — DATA-05b
// Updates test name, modules, and/or custom questions.
// Body: { name?, modules?, customQuestions? } — at least one field required.
// ---------------------------------------------------------------------------
const UpdateTestSchema = z
  .object({
    name: z.string().min(1).optional(),
    modules: z.array(z.string()).min(1).optional(),
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
  .refine(
    (data) =>
      data.name !== undefined ||
      data.modules !== undefined ||
      data.customQuestions !== undefined,
    { message: 'At least one field must be provided' }
  )

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // 1. Parse body
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  // 2. Zod validation
  const parsed = UpdateTestSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid fields' }, { status: 400 })
  }

  try {
    const { id } = await params
    const { name, modules, customQuestions } = parsed.data

    // Build update payload — only include provided fields
    const updatePayload: Record<string, unknown> = {}
    if (name !== undefined) updatePayload.name = name
    if (modules !== undefined) updatePayload.modules = modules
    if (customQuestions !== undefined) updatePayload.custom_questions = customQuestions

    const supabase = await createServerSupabaseClient()
    const { data, error } = await supabase
      .from('test_templates')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Not found' }, { status: 404 })
      }
      console.error('[tests/[id]] PUT error:', error.message)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (err) {
    console.error('[tests/[id]] PUT unexpected error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// ---------------------------------------------------------------------------
// DELETE /api/tests/[id]  — DATA-05c
// Soft delete: sets status to 'archived' — does NOT hard-delete rows.
// Returns 204 No Content on success.
// ---------------------------------------------------------------------------
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createServerSupabaseClient()

    // 1. Verify row exists
    const { data: existing, error: fetchError } = await supabase
      .from('test_templates')
      .select('id')
      .eq('id', id)
      .single()

    if (fetchError || !existing) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    // 2. Soft delete: update status to 'archived'
    const { error: updateError } = await supabase
      .from('test_templates')
      .update({ status: 'archived' })
      .eq('id', id)

    if (updateError) {
      console.error('[tests/[id]] DELETE update error:', updateError.message)
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }

    // 3. Return 204 No Content
    return new NextResponse(null, { status: 204 })
  } catch (err) {
    console.error('[tests/[id]] DELETE unexpected error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
