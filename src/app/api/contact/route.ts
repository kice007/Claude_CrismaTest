import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { createServerSupabaseClient } from "@/lib/supabase";
import { applyRateLimiter } from "@/lib/rate-limiter";

const ContactSchema = z.object({
  name: z.string().min(1).max(100),
  company: z.string().min(1).max(100),
  email: z.string().email(),
  teamSize: z.enum(["1-10", "11-50", "51-200", "200+"]),
  message: z.string().max(2000).optional(),
  gdprConsent: z.literal(true),
});

export async function POST(req: NextRequest) {
  // 1. Rate limit check — before parsing body (prevents DoS via large body)
  const rateLimitResult = applyRateLimiter(req, 3, 3600);
  if (!rateLimitResult.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  // 2. Parse body
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // 3. Zod validation — gdprConsent: z.literal(true) enforces server-side GDPR
  const parsed = ContactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid fields" }, { status: 400 });
  }

  // 4. Supabase insert
  const supabase = await createServerSupabaseClient();
  const { name, company, email, teamSize, message } = parsed.data;
  const { error: dbError } = await supabase
    .from("contact_submissions")
    .insert({ name, company, email, team_size: teamSize, message: message ?? null });
  if (dbError) {
    console.error("[contact] db insert error:", dbError.message);
    return NextResponse.json({ error: "Submission failed" }, { status: 500 });
  }

  // 5. Resend email notification — log but do not fail if email errors
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    await resend.emails.send({
      from: `CrismaTest <noreply@${process.env.NEXT_PUBLIC_APP_URL?.replace(/^https?:\/\//, "") ?? "crismatest.com"}>`,
      to: process.env.ADMIN_EMAIL!,
      subject: `New demo request from ${company}`,
      text: [
        `Name: ${name}`,
        `Company: ${company}`,
        `Email: ${email}`,
        `Team size: ${teamSize}`,
        `Message: ${message ?? "(none)"}`,
        `Submitted: ${new Date().toISOString()}`,
      ].join("\n"),
    });
  } catch (emailError) {
    // Log but do not fail the request — DB insert already succeeded
    console.error("[contact] resend error:", emailError);
  }

  // 6. Return success
  return NextResponse.json({ success: true }, { status: 200 });
}
