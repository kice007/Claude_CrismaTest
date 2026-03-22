"use client";
import { useTranslation } from "react-i18next";
import { motion } from "motion/react";
import { staggerChildren, fadeIn } from "@/lib/motion";
import {
  CheckCircle,
  Brain,
  Shield,
  Globe,
  Users,
  LayoutGrid,
} from "lucide-react";
import Link from "next/link";

const FEATURES = [
  { icon: CheckCircle, title: "home_companies_feat_1_title", desc: "home_companies_feat_1_desc" },
  { icon: Brain, title: "home_companies_feat_2_title", desc: "home_companies_feat_2_desc" },
  { icon: Shield, title: "home_companies_feat_3_title", desc: "home_companies_feat_3_desc" },
  { icon: Globe, title: "home_companies_feat_4_title", desc: "home_companies_feat_4_desc" },
  { icon: Users, title: "home_companies_feat_5_title", desc: "home_companies_feat_5_desc" },
  { icon: LayoutGrid, title: "home_companies_feat_6_title", desc: "home_companies_feat_6_desc" },
] as const;

export function ForCompaniesSection({ variant = "light" }: { variant?: "light" | "dark" }) {
  const { t } = useTranslation();

  const sectionClass =
    variant === "dark" ? "bg-brand-navy text-white" : "bg-white text-brand-navy";
  const eyebrowClass =
    variant === "dark" ? "text-brand-accent" : "text-brand-primary";
  const cardClass =
    variant === "dark"
      ? "bg-white/5 border-white/10 hover:bg-white/10"
      : "bg-neutral-50 border-neutral-100 hover:bg-brand-light";
  const iconClass =
    variant === "dark" ? "text-brand-accent" : "text-brand-primary";
  const descClass =
    variant === "dark" ? "text-white/70" : "text-neutral-600";

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
            {t("home_companies_eyebrow")}
          </motion.p>

          {/* Headline */}
          <motion.h2
            variants={fadeIn}
            className="mb-12 text-center text-3xl font-bold leading-tight sm:text-4xl"
          >
            {t("home_companies_headline")}
          </motion.h2>

          {/* Feature grid */}
          <motion.div
            variants={staggerChildren}
            className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {FEATURES.map((feat) => {
              const Icon = feat.icon;
              return (
                <motion.div
                  key={feat.title}
                  variants={fadeIn}
                  className={`rounded-xl border p-6 transition-colors ${cardClass}`}
                >
                  <Icon className={`mb-4 h-6 w-6 ${iconClass}`} />
                  <h3 className="mb-2 text-base font-semibold">{t(feat.title)}</h3>
                  <p className={`text-sm leading-relaxed ${descClass}`}>{t(feat.desc)}</p>
                </motion.div>
              );
            })}
          </motion.div>

          {/* CTA */}
          <motion.div variants={fadeIn} className="text-center">
            <Link
              href="/for-companies"
              className="inline-flex min-h-12 items-center justify-center rounded-xl bg-brand-primary px-8 py-3 text-base font-semibold text-white transition-colors hover:bg-brand-secondary"
            >
              {t("home_companies_cta")}
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
