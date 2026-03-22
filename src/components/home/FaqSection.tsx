"use client";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown } from "lucide-react";

const FAQ_ITEMS = [
  { q: "home_faq_q1", a: "home_faq_a1" },
  { q: "home_faq_q2", a: "home_faq_a2" },
  { q: "home_faq_q3", a: "home_faq_a3" },
  { q: "home_faq_q4", a: "home_faq_a4" },
  { q: "home_faq_q5", a: "home_faq_a5" },
  { q: "home_faq_q6", a: "home_faq_a6" },
  { q: "home_faq_q7", a: "home_faq_a7" },
] as const;

export function FaqSection({ variant = "light" }: { variant?: "light" | "dark" }) {
  const { t } = useTranslation();
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  function toggle(i: number) {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(i)) {
        next.delete(i);
      } else {
        next.add(i);
      }
      return next;
    });
  }

  const sectionClass =
    variant === "dark" ? "bg-brand-navy text-white" : "bg-white text-brand-navy";
  const eyebrowClass =
    variant === "dark" ? "text-brand-accent" : "text-brand-primary";
  const itemClass =
    variant === "dark"
      ? "border-white/10"
      : "border-neutral-100";
  const answerClass =
    variant === "dark" ? "text-white/70" : "text-neutral-600";
  const questionClass =
    variant === "dark" ? "text-white" : "text-brand-navy";

  return (
    <section className={`w-full px-4 py-20 ${sectionClass}`}>
      <div className="mx-auto max-w-2xl">
        {/* Eyebrow */}
        <p className={`mb-3 text-center text-sm font-semibold uppercase tracking-widest ${eyebrowClass}`}>
          {t("home_faq_eyebrow")}
        </p>

        {/* Headline */}
        <h2 className="mb-12 text-center text-3xl font-bold leading-tight sm:text-4xl">
          {t("home_faq_headline")}
        </h2>

        {/* Accordion */}
        <div className="divide-y" style={{ borderColor: "inherit" }}>
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = openItems.has(i);
            return (
              <div key={item.q} className={`border-b ${itemClass}`}>
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  className={`flex w-full items-center justify-between gap-4 py-5 text-left text-base font-semibold ${questionClass} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary`}
                  aria-expanded={isOpen}
                >
                  <span>{t(item.q)}</span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                    aria-hidden="true"
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-200 ease-in-out ${isOpen ? "max-h-96" : "max-h-0"}`}
                >
                  <p className={`pb-5 text-sm leading-relaxed ${answerClass}`}>
                    {t(item.a)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
