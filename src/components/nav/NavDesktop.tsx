"use client";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { LogoMark } from "./LogoMark";

export function NavDesktop() {
  const { t } = useTranslation();

  return (
    <div className="hidden md:flex items-center justify-between w-full px-6 h-16 max-w-7xl mx-auto">
      {/* Logo — left */}
      <Link
        href="/"
        className="flex items-center gap-2 shrink-0 min-h-[48px]"
        aria-label="CrismaTest home"
      >
        <LogoMark />
        <span className="font-bold text-brand-navy text-lg leading-none">CrismaTest</span>
      </Link>

      {/* Center nav links */}
      <nav className="flex items-center gap-6" aria-label="Main navigation">
        <Link
          href="/for-candidates"
          className="text-sm font-medium text-neutral-700 hover:text-brand-primary transition-colors min-h-[48px] flex items-center"
        >
          {t("nav_for_candidates")}
        </Link>
        <Link
          href="/for-companies"
          className="text-sm font-medium text-neutral-700 hover:text-brand-primary transition-colors min-h-[48px] flex items-center"
        >
          {t("nav_for_companies")}
        </Link>
        <Link
          href="/pricing"
          className="text-sm font-medium text-neutral-700 hover:text-brand-primary transition-colors min-h-[48px] flex items-center"
        >
          {t("nav_pricing")}
        </Link>
      </nav>

      {/* Right — LanguageSwitcher + Login + Sign Up */}
      <div className="flex items-center gap-3 shrink-0">
        <LanguageSwitcher />
        <Link
          href="/login"
          className="inline-flex items-center justify-center min-h-[48px] px-4 text-sm font-medium text-brand-primary border border-brand-primary rounded-md bg-transparent hover:bg-brand-light transition-colors"
        >
          {t("nav_login")}
        </Link>
        <Link
          href="/sign-up"
          className="inline-flex items-center justify-center min-h-[48px] px-4 text-sm font-medium text-white bg-brand-primary rounded-md hover:bg-brand-secondary transition-colors"
        >
          {t("nav_sign_up")}
        </Link>
      </div>
    </div>
  );
}
