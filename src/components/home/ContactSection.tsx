"use client";
import { useTranslation } from "react-i18next";
import { ContactForm } from "@/components/home/ContactForm";

export function ContactSection({ variant = "light" }: { variant?: "light" | "dark" }) {
  const { t } = useTranslation();

  const sectionClass =
    variant === "dark"
      ? "bg-brand-navy/80 text-white"
      : "bg-neutral-50 text-brand-navy";
  const subtitleClass =
    variant === "dark" ? "text-white/70" : "text-neutral-600";

  return (
    <section className={`w-full px-4 py-20 ${sectionClass}`}>
      <div className="mx-auto max-w-2xl">
        {/* Eyebrow */}
        <p className="mb-3 text-center text-sm font-semibold uppercase tracking-widest text-brand-primary">
          {t("home_trust_label")}
        </p>

        {/* Title */}
        <h2 className="mb-3 text-center text-3xl font-bold leading-tight sm:text-4xl">
          {t("contact_form_title")}
        </h2>

        {/* Subtitle */}
        <p className={`mb-10 text-center text-lg ${subtitleClass}`}>
          {t("contact_form_subtitle")}
        </p>

        {/* Form */}
        <div className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm sm:p-8">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
