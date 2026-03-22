import { type NextRequest } from 'next/server'

interface RateEntry {
  count: number
  expiresAt: number
}

const cache = new Map<string, RateEntry>()

// Cleanup expired entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of cache.entries()) {
    if (now > entry.expiresAt) {
      cache.delete(key)
    }
  }
}, 5 * 60 * 1000)

/**
 * In-memory rate limiter for Next.js Route Handlers.
 *
 * @param req            The incoming NextRequest
 * @param maxRequests    Maximum number of requests allowed within the window
 * @param windowSeconds  Duration of the rate-limit window in seconds
 * @returns              `{ allowed: boolean }` — false means the request should be rejected (429)
 */
export function applyRateLimiter(
  req: NextRequest,
  maxRequests: number,
  windowSeconds: number
): { allowed: boolean } {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'

  const now = Date.now()
  const existing = cache.get(ip)

  if (!existing || now > existing.expiresAt) {
    // No entry or window has expired — start fresh
    cache.set(ip, { count: 1, expiresAt: now + windowSeconds * 1000 })
    return { allowed: true }
  }

  if (existing.count < maxRequests) {
    existing.count++
    return { allowed: true }
  }

  return { allowed: false }
}
