// src/components/LanguageSwitcher.tsx
// Phase 2 drops this component into the nav.
"use client";
import { useTranslation } from "react-i18next";

const LANGUAGES = [
  { code: "en", labelKey: "language_switcher_en" },
  { code: "fr", labelKey: "language_switcher_fr" },
] as const;

export function LanguageSwitcher() {
  const { t, i18n } = useTranslation();

  return (
    <>
      {/* Desktop: EN|FR pill buttons (>=768px) */}
      <div className="hidden md:flex items-center gap-1" aria-label={t("language_switcher_label")}>
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            onClick={() => i18n.changeLanguage(lang.code)}
            aria-pressed={i18n.resolvedLanguage === lang.code}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors min-h-[44px] min-w-[44px] ${
              i18n.resolvedLanguage === lang.code
                ? "bg-brand-primary text-white"
                : "text-neutral-500 hover:text-brand-primary"
            }`}
          >
            {t(lang.labelKey)}
          </button>
        ))}
      </div>

      {/* Mobile: globe icon + inline language buttons (shown on mobile only) */}
      <div className="flex md:hidden items-center gap-1" aria-label={t("language_switcher_label")}>
        <span className="text-neutral-500 text-sm" aria-hidden="true">🌐</span>
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            onClick={() => i18n.changeLanguage(lang.code)}
            aria-pressed={i18n.resolvedLanguage === lang.code}
            className={`px-2 py-1 text-sm font-medium transition-colors min-h-[48px] min-w-[48px] ${
              i18n.resolvedLanguage === lang.code
                ? "text-brand-primary font-semibold"
                : "text-neutral-500"
            }`}
          >
            {t(lang.labelKey)}
          </button>
        ))}
      </div>
    </>
  );
}
