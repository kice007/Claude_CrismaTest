"use client";
import { useTranslation } from "react-i18next";
import { motion } from "motion/react";
import { staggerChildren, slideUp } from "@/lib/motion";

const TESTIMONIALS = [
  {
    name: "home_testimonial_1_name",
    role: "home_testimonial_1_role",
    company: "home_testimonial_1_company",
    quote: "home_testimonial_1_quote",
    color: "bg-violet-500",
  },
  {
    name: "home_testimonial_2_name",
    role: "home_testimonial_2_role",
    company: "home_testimonial_2_company",
    quote: "home_testimonial_2_quote",
    color: "bg-blue-500",
  },
  {
    name: "home_testimonial_3_name",
    role: "home_testimonial_3_role",
    company: "home_testimonial_3_company",
    quote: "home_testimonial_3_quote",
    color: "bg-emerald-500",
  },
] as const;

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function TestimonialsSection({ variant = "light" }: { variant?: "light" | "dark" }) {
  const { t } = useTranslation();

  const sectionClass =
    variant === "dark" ? "bg-brand-navy text-white" : "bg-white text-brand-navy";
  const eyebrowClass =
    variant === "dark" ? "text-brand-accent" : "text-brand-primary";
  const cardClass =
    variant === "dark"
      ? "bg-white/5 border-white/10"
      : "bg-neutral-50 border-neutral-100";
  const quoteClass =
    variant === "dark" ? "text-white/80" : "text-neutral-700";
  const metaClass =
    variant === "dark" ? "text-white/50" : "text-neutral-500";

  return (
    <section className={`w-full px-4 py-20 ${sectionClass}`}>
      <div className="mx-auto max-w-6xl">
        {/* Eyebrow */}
        <p className={`mb-3 text-center text-sm font-semibold uppercase tracking-widest ${eyebrowClass}`}>
          {t("home_testimonials_eyebrow")}
        </p>

        {/* Headline */}
        <h2 className="mb-12 text-center text-3xl font-bold leading-tight sm:text-4xl">
          {t("home_testimonials_headline")}
        </h2>

        {/* Desktop: 3-column grid */}
        <motion.div
          variants={staggerChildren}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="hidden gap-6 sm:grid sm:grid-cols-3"
        >
          {TESTIMONIALS.map((t_) => {
            const name = t(t_.name);
            return (
              <motion.div
                key={t_.name}
                variants={slideUp}
                className={`flex flex-col rounded-xl border p-6 ${cardClass}`}
              >
                <p className={`mb-6 flex-1 text-sm leading-relaxed ${quoteClass}`}>
                  &ldquo;{t(t_.quote)}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${t_.color}`}
                  >
                    {getInitials(name)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{name}</p>
                    <p className={`text-xs ${metaClass}`}>
                      {t(t_.role)} · {t(t_.company)}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Mobile: horizontal scroll carousel */}
        <div
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 sm:hidden"
          style={{ scrollbarWidth: "none" }}
        >
          {TESTIMONIALS.map((t_) => {
            const name = t(t_.name);
            return (
              <div
                key={`mobile-${t_.name}`}
                className={`flex w-[85vw] shrink-0 snap-start flex-col rounded-xl border p-6 ${cardClass}`}
              >
                <p className={`mb-6 flex-1 text-sm leading-relaxed ${quoteClass}`}>
                  &ldquo;{t(t_.quote)}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${t_.color}`}
                  >
                    {getInitials(name)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{name}</p>
                    <p className={`text-xs ${metaClass}`}>
                      {t(t_.role)} · {t(t_.company)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
