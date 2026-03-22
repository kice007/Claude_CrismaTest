"use client";
import { useTranslation } from "react-i18next";
import { motion } from "motion/react";
import { staggerChildren, fadeIn } from "@/lib/motion";
import { CheckCircle } from "lucide-react";

const FEATURES = [
  "home_antifraid_feat_1",
  "home_antifraid_feat_2",
  "home_antifraid_feat_3",
  "home_antifraid_feat_4",
] as const;

export function AntifraudSection({ variant = "light" }: { variant?: "light" | "dark" }) {
  const { t } = useTranslation();
  void variant; // Always dark navy per design spec

  return (
    <section className="w-full bg-brand-navy px-4 py-20 text-white">
      <div className="mx-auto max-w-4xl">
        <motion.div
          variants={staggerChildren}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Eyebrow */}
          <motion.p
            variants={fadeIn}
            className="mb-3 text-center text-sm font-semibold uppercase tracking-widest text-brand-accent"
          >
            {t("home_antifraid_eyebrow")}
          </motion.p>

          {/* Headline */}
          <motion.h2
            variants={fadeIn}
            className="mb-6 text-center text-3xl font-bold leading-tight sm:text-4xl"
          >
            {t("home_antifraid_headline")}
          </motion.h2>

          {/* Body */}
          <motion.p
            variants={fadeIn}
            className="mb-12 text-center text-lg leading-relaxed text-white/70"
          >
            {t("home_antifraid_body")}
          </motion.p>

          {/* Features 2x2 grid */}
          <motion.div
            variants={staggerChildren}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2"
          >
            {FEATURES.map((key) => (
              <motion.div
                key={key}
                variants={fadeIn}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-6 py-4"
              >
                <CheckCircle className="h-5 w-5 shrink-0 text-brand-accent" />
                <span className="text-base font-medium">{t(key)}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
