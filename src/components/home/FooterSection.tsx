"use client";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { Linkedin, Twitter } from "lucide-react";

export function FooterSection({ variant = "light" }: { variant?: "light" | "dark" }) {
  const { t } = useTranslation();

  const bgClass = variant === "dark" ? "bg-[#06132F]" : "bg-[#111827]";

  return (
    <footer className={`w-full ${bgClass} text-white`}>
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
          {/* Logo + tagline */}
          <div>
            <p className="mb-2 text-xl font-bold tracking-tight text-white">
              CrismaTest
            </p>
            <p className="text-sm leading-relaxed text-white/60">
              {t("home_footer_tagline")}
            </p>
          </div>

          {/* Product links */}
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/40">
              {t("home_footer_product_title")}
            </p>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/for-candidates"
                  className="text-sm text-white/70 transition-colors hover:text-white"
                >
                  {t("home_footer_link_candidates")}
                </Link>
              </li>
              <li>
                <Link
                  href="/for-companies"
                  className="text-sm text-white/70 transition-colors hover:text-white"
                >
                  {t("home_footer_link_companies")}
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-sm text-white/70 transition-colors hover:text-white"
                >
                  {t("home_footer_link_pricing")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Company links */}
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/40">
              {t("home_footer_company_title")}
            </p>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-white/70 transition-colors hover:text-white"
                >
                  {t("home_footer_link_about")}
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-white/70 transition-colors hover:text-white"
                >
                  {t("home_footer_link_privacy")}
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-white/70 transition-colors hover:text-white"
                >
                  {t("home_footer_link_terms")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
          <p className="text-xs text-white/40">{t("home_footer_copyright")}</p>

          {/* Social icons */}
          <div className="flex gap-4">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("home_footer_social_linkedin")}
              className="flex h-8 w-8 items-center justify-center rounded-full text-white/50 transition-colors hover:text-white"
            >
              <Linkedin className="h-4 w-4" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("home_footer_social_twitter")}
              className="flex h-8 w-8 items-center justify-center rounded-full text-white/50 transition-colors hover:text-white"
            >
              <Twitter className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
