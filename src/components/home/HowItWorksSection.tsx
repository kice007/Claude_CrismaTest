"use client";
import { useTranslation } from "react-i18next";
import { motion } from "motion/react";
import { staggerChildren, fadeIn } from "@/lib/motion";

const STEPS = [
  {
    number: "home_how_step_1_number",
    title: "home_how_step_1_title",
    desc: "home_how_step_1_desc",
  },
  {
    number: "home_how_step_2_number",
    title: "home_how_step_2_title",
    desc: "home_how_step_2_desc",
  },
  {
    number: "home_how_step_3_number",
    title: "home_how_step_3_title",
    desc: "home_how_step_3_desc",
  },
] as const;

export function HowItWorksSection({ variant = "light" }: { variant?: "light" | "dark" }) {
  const { t } = useTranslation();

  const sectionClass =
    variant === "dark" ? "bg-brand-navy text-white" : "bg-neutral-50 text-brand-navy";
  const eyebrowClass =
    variant === "dark" ? "text-brand-accent" : "text-brand-primary";
  const descClass =
    variant === "dark" ? "text-white/70" : "text-neutral-600";
  const dividerClass =
    variant === "dark" ? "border-white/10" : "border-neutral-200";

  return (
    <section id="how-it-works" className={`w-full px-4 py-20 ${sectionClass}`}>
      <div className="mx-auto max-w-5xl">
        <motion.div
          variants={staggerChildren}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Eyebrow */}
          <motion.p
            variants={fadeIn}
            className={`mb-3 text-center text-sm font-semibold uppercase tracking-widest ${eyebrowClass}`}
          >
            {t("home_how_eyebrow")}
          </motion.p>

          {/* Headline */}
          <motion.h2
            variants={fadeIn}
            className="mb-16 text-center text-3xl font-bold leading-tight sm:text-4xl"
          >
            {t("home_how_headline")}
          </motion.h2>

          {/* Steps */}
          <motion.div
            variants={staggerChildren}
            className="grid grid-cols-1 gap-8 sm:grid-cols-3"
          >
            {STEPS.map((step, i) => (
              <motion.div
                key={step.number}
                variants={fadeIn}
                className="relative flex flex-col"
              >
                {/* Divider between steps on desktop */}
                {i < STEPS.length - 1 && (
                  <div
                    className={`absolute right-0 top-6 hidden h-px w-8 border-t ${dividerClass} sm:block`}
                    style={{ right: "-1rem" }}
                    aria-hidden="true"
                  />
                )}
                {/* Step number */}
                <span className="mb-4 text-5xl font-black text-brand-primary opacity-80">
                  {t(step.number)}
                </span>
                {/* Title */}
                <h3 className="mb-3 text-xl font-bold">{t(step.title)}</h3>
                {/* Description */}
                <p className={`text-base leading-relaxed ${descClass}`}>
                  {t(step.desc)}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
