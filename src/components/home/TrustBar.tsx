"use client";
import { useTranslation } from "react-i18next";

const COMPANY_KEYS = [
  "home_trust_company_1",
  "home_trust_company_2",
  "home_trust_company_3",
  "home_trust_company_4",
  "home_trust_company_5",
  "home_trust_company_6",
] as const;

export function TrustBar({ variant = "light" }: { variant?: "light" | "dark" }) {
  const { t } = useTranslation();

  const bgClass =
    variant === "dark" ? "bg-brand-navy/20" : "bg-neutral-100";
  const textClass =
    variant === "dark" ? "text-white/60" : "text-neutral-500";
  const eyebrowClass =
    variant === "dark" ? "text-white/40" : "text-neutral-400";

  return (
    <section className={`w-full overflow-hidden py-8 ${bgClass}`}>
      <p className={`mb-4 text-center text-xs font-semibold uppercase tracking-widest ${eyebrowClass}`}>
        {t("home_trust_label")}
      </p>
      <div className="relative flex overflow-x-hidden">
        {/* First pass */}
        <div
          className={`flex shrink-0 animate-[marquee_20s_linear_infinite] items-center gap-12 pr-12 ${textClass}`}
        >
          {COMPANY_KEYS.map((key) => (
            <span key={key} className="whitespace-nowrap text-lg font-semibold">
              {t(key)}
            </span>
          ))}
        </div>
        {/* Duplicate for seamless loop */}
        <div
          className={`flex shrink-0 animate-[marquee_20s_linear_infinite] items-center gap-12 pr-12 ${textClass}`}
          aria-hidden="true"
        >
          {COMPANY_KEYS.map((key) => (
            <span key={`dup-${key}`} className="whitespace-nowrap text-lg font-semibold">
              {t(key)}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
