"use client";
import { useTranslation } from "react-i18next";
import { motion } from "motion/react";
import { staggerChildren, fadeIn } from "@/lib/motion";
import Link from "next/link";

const TEMPLATES = [
  { key: "home_tests_template_1", duration: 12 },
  { key: "home_tests_template_2", duration: 15 },
  { key: "home_tests_template_3", duration: 10 },
  { key: "home_tests_template_4", duration: 11 },
  { key: "home_tests_template_5", duration: 14 },
  { key: "home_tests_template_6", duration: 13 },
  { key: "home_tests_template_7", duration: 12 },
  { key: "home_tests_template_8", duration: 10 },
] as const;

export function TestLibrarySection({ variant = "light" }: { variant?: "light" | "dark" }) {
  const { t } = useTranslation();

  const sectionClass =
    variant === "dark" ? "bg-brand-navy text-white" : "bg-neutral-50 text-brand-navy";
  const eyebrowClass =
    variant === "dark" ? "text-brand-accent" : "text-brand-primary";
  const subtitleClass =
    variant === "dark" ? "text-white/70" : "text-neutral-600";
  const cardClass =
    variant === "dark"
      ? "bg-white/5 border-white/10 hover:bg-white/10"
      : "bg-white border-neutral-100 hover:border-brand-primary/30 hover:shadow-md";
  const durationClass =
    variant === "dark" ? "text-white/50" : "text-neutral-400";

  return (
    <section className={`w-full px-4 py-20 ${sectionClass}`}>
      <div className="mx-auto max-w-6xl">
        <motion.div
          variants={staggerChildren}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {/* Eyebrow */}
          <motion.p
            variants={fadeIn}
            className={`mb-3 text-center text-sm font-semibold uppercase tracking-widest ${eyebrowClass}`}
          >
            {t("home_tests_eyebrow")}
          </motion.p>

          {/* Headline */}
          <motion.h2
            variants={fadeIn}
            className="mb-4 text-center text-3xl font-bold leading-tight sm:text-4xl"
          >
            {t("home_tests_headline")}
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            variants={fadeIn}
            className={`mb-12 text-center text-lg ${subtitleClass}`}
          >
            {t("home_tests_subtitle")}
          </motion.p>

          {/* Template grid */}
          <motion.div
            variants={staggerChildren}
            className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            {TEMPLATES.map((tmpl) => (
              <motion.div
                key={tmpl.key}
                variants={fadeIn}
                className={`rounded-xl border p-5 transition-all ${cardClass}`}
              >
                <h3 className="mb-2 text-sm font-semibold">{t(tmpl.key)}</h3>
                <p className={`text-xs ${durationClass}`}>
                  {tmpl.duration} {t("home_tests_duration_label")}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div variants={fadeIn} className="text-center">
            <Link
              href="/for-candidates"
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-brand-primary bg-transparent px-8 py-3 text-base font-semibold text-brand-primary transition-colors hover:bg-brand-primary hover:text-white"
            >
              {t("home_tests_cta")}
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
