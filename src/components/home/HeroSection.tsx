"use client";
import { useTranslation } from "react-i18next";
import { motion } from "motion/react";
import { fadeIn } from "@/lib/motion";
import Link from "next/link";

const MOCK_CANDIDATES = [
  { initials: "AL", name: "Alice Lambert", role: "Software Engineer", score: 87, bg: "bg-blue-500" },
  { initials: "MR", name: "Marc Rousseau", role: "Product Manager", score: 72, bg: "bg-violet-500" },
  { initials: "SB", name: "Sara Bénali", role: "Data Analyst", score: 91, bg: "bg-emerald-500" },
  { initials: "TD", name: "Thomas Dubois", role: "UX Designer", score: 58, bg: "bg-orange-500" },
  { initials: "CL", name: "Clara Lefebvre", role: "Sales Rep", score: 79, bg: "bg-pink-500" },
];

function scoreColor(score: number): string {
  if (score >= 75) return "bg-emerald-100 text-emerald-700";
  if (score >= 60) return "bg-amber-100 text-amber-700";
  return "bg-red-100 text-red-700";
}

export function HeroSection({ variant = "light" }: { variant?: "light" | "dark" }) {
  const { t } = useTranslation();
  void variant; // Hero is always navy per design spec

  return (
    <section className="relative flex min-h-[80vh] w-full flex-col items-center justify-center overflow-hidden bg-brand-navy px-4 py-20 text-center">
      {/* Background gradient orb */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, #1B4FD8 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <motion.div
        className="relative z-10 mx-auto max-w-3xl"
        variants={fadeIn}
        initial="hidden"
        animate="visible"
      >
        {/* Trust badge */}
        <span className="mb-6 inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white/80 backdrop-blur-sm">
          {t("home_hero_badge")}
        </span>

        {/* Headline */}
        <h1 className="mb-4 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
          {t("home_hero_headline")}
        </h1>

        {/* Subline */}
        <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-white/80 sm:text-xl">
          {t("home_hero_subline")}
        </p>

        {/* CTAs */}
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/for-candidates"
            className="flex min-h-12 w-full items-center justify-center rounded-xl bg-brand-primary px-8 py-3 text-base font-semibold text-white transition-colors hover:bg-brand-secondary sm:w-auto"
          >
            {t("home_hero_cta_primary")}
          </Link>
          <Link
            href="#how-it-works"
            className="flex min-h-12 w-full items-center justify-center rounded-xl border border-white/30 bg-white/10 px-8 py-3 text-base font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20 sm:w-auto"
          >
            {t("home_hero_cta_secondary")}
          </Link>
        </div>
      </motion.div>

      {/* Floating dashboard card mockup */}
      <motion.div
        className="relative z-10 mt-12 w-full max-w-2xl px-4"
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        style={{ transitionDelay: "200ms" }}
      >
        <div
          className="overflow-hidden rounded-2xl border border-white/10 bg-white/10 shadow-2xl backdrop-blur-sm"
          style={{
            maskImage:
              "linear-gradient(to bottom, black 60%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, black 60%, transparent 100%)",
          }}
        >
          {/* Card header */}
          <div className="border-b border-white/10 px-4 py-3">
            <p className="text-sm font-semibold text-white/90">Candidate Dashboard</p>
          </div>
          {/* Candidate rows */}
          <div className="divide-y divide-white/5">
            {MOCK_CANDIDATES.map((c) => (
              <div
                key={c.initials}
                className="flex items-center gap-3 px-4 py-3"
              >
                {/* Avatar */}
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${c.bg}`}
                >
                  {c.initials}
                </div>
                {/* Name + role */}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white">
                    {c.name}
                  </p>
                  <p className="truncate text-xs text-white/60">{c.role}</p>
                </div>
                {/* Score chip */}
                <span
                  className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${scoreColor(c.score)}`}
                >
                  {c.score}
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
