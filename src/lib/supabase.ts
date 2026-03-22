import { createBrowserClient, createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Browser Supabase client — safe to call from Client Components.
 * Uses the public anon key, protected by RLS policies.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

/**
 * Server Supabase client — for use in Server Components and Route Handlers.
 * Reads and writes cookies via next/headers.
 * Uses the public anon key (not service role) — RLS is enforced.
 */
export async function createServerSupabaseClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch {
            // setAll called from a Server Component — cookies are read-only.
            // Ignore the error; session refresh is handled by middleware.
          }
        },
      },
    }
  )
}
