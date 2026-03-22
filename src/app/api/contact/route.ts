import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(1).max(100),
  company: z.string().min(1).max(100),
  email: z.string().email(),
  teamSize: z.enum(["1-10", "11-50", "51-200", "200+"]),
  message: z.string().max(2000).optional(),
  gdprConsent: z.literal(true),
});

// Simple module-level rate limiter (single-instance demo)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 3;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || entry.resetAt < now) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return false;
  }

  entry.count += 1;
  return true;
}

// Cleanup stale entries every 5 minutes
if (typeof globalThis !== "undefined" && !(globalThis as Record<string, unknown>).__contactRateLimitCleanup) {
  (globalThis as Record<string, unknown>).__contactRateLimitCleanup = setInterval(() => {
    const now = Date.now();
    for (const [key, val] of rateLimitMap.entries()) {
      if (val.resetAt < now) rateLimitMap.delete(key);
    }
  }, 5 * 60 * 1000);
}

export async function POST(request: NextRequest) {
  // Get client IP for rate limiting
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "rate_limit" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation_error", issues: parsed.error.issues },
      { status: 422 }
    );
  }

  // In production this would send an email / write to DB
  // For the demo prototype: log and acknowledge
  console.log("[contact] submission received:", {
    name: parsed.data.name,
    company: parsed.data.company,
    email: parsed.data.email,
    teamSize: parsed.data.teamSize,
  });

  return NextResponse.json({ success: true }, { status: 200 });
}
