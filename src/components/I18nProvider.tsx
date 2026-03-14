// src/components/I18nProvider.tsx
"use client";
import { I18nextProvider } from "react-i18next";
import i18n from "@/lib/i18n";
import { useEffect } from "react";

export function I18nProvider({ children }: { children: React.ReactNode }) {
  // Sync html[lang] attribute after hydration and on language change (I18N-06)
  useEffect(() => {
    const updateLang = (lng: string) => {
      document.documentElement.lang = lng;
    };
    i18n.on("languageChanged", updateLang);
    // Set initial lang from resolved language
    updateLang(i18n.language ?? "en");
    return () => {
      i18n.off("languageChanged", updateLang);
    };
  }, []);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
