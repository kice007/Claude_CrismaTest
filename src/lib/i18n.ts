// src/lib/i18n.ts
// IMPORTANT: This file must ONLY be imported inside 'use client' components.
// It uses browser APIs (localStorage). Importing it in a Server Component
// will throw "ReferenceError: localStorage is not defined" during build.
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import enTranslations from "../../locales/en.json";
import frTranslations from "../../locales/fr.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslations },
      fr: { translation: frTranslations },
    },
    fallbackLng: "en",
    supportedLngs: ["en", "fr"],
    detection: {
      order: ["localStorage"],
      caches: ["localStorage"],
      lookupLocalStorage: "crismatest_lang",
    },
    interpolation: {
      escapeValue: false, // React handles XSS
    },
    debug: process.env.NODE_ENV === "development",
  });

export default i18n;
