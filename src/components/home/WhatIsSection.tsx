"use client";
import { useTranslation } from "react-i18next";
import { motion } from "motion/react";
import { staggerChildren, fadeIn } from "@/lib/motion";

const STATS = [
  { value: "home_what_is_stat_1_value", label: "home_what_is_stat_1_label" },
  { value: "home_what_is_stat_2_value", label: "home_what_is_stat_2_label" },
  { value: "home_what_is_stat_3_value", label: "home_what_is_stat_3_label" },
] as const;

export function WhatIsSection({ variant = "light" }: { variant?: "light" | "dark" }) {
  const { t } = useTranslation();

  const sectionClass =
    variant === "dark"
      ? "bg-brand-navy/90 text-white"
      : "bg-white text-brand-navy";
  const eyebrowClass =
    variant === "dark" ? "text-brand-accent" : "text-brand-primary";
  const bodyClass =
    variant === "dark" ? "text-white/70" : "text-neutral-600";
  const cardClass =
    variant === "dark"
      ? "bg-white/10 border-white/10"
      : "bg-brand-light border-brand-light";
  const statValueClass =
    variant === "dark" ? "text-white" : "text-brand-navy";
  const statLabelClass =
    variant === "dark" ? "text-white/60" : "text-neutral-500";

  return (
    <section className={`w-full px-4 py-20 ${sectionClass}`}>
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
            className={`mb-3 text-sm font-semibold uppercase tracking-widest ${eyebrowClass}`}
          >
            {t("home_what_is_eyebrow")}
          </motion.p>

          {/* Headline */}
          <motion.h2
            variants={fadeIn}
            className="mb-6 text-3xl font-bold leading-tight sm:text-4xl"
          >
            {t("home_what_is_headline")}
          </motion.h2>

          {/* Body */}
          <motion.p
            variants={fadeIn}
            className={`mb-12 max-w-2xl text-lg leading-relaxed ${bodyClass}`}
          >
            {t("home_what_is_body")}
          </motion.p>

          {/* Stats */}
          <motion.div
            variants={staggerChildren}
            className="grid grid-cols-1 gap-6 sm:grid-cols-3"
          >
            {STATS.map((stat) => (
              <motion.div
                key={stat.value}
                variants={fadeIn}
                className={`rounded-xl border p-6 text-center ${cardClass}`}
              >
                <p className={`mb-1 text-4xl font-bold ${statValueClass}`}>
                  {t(stat.value)}
                </p>
                <p className={`text-sm font-medium ${statLabelClass}`}>
                  {t(stat.label)}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
