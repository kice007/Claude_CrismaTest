"use client";
import Link from "next/link";
import { Menu } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { LogoMark } from "./LogoMark";

export function NavMobile() {
  const { t } = useTranslation();

  return (
    <div className="flex md:hidden items-center justify-between w-full px-4 h-16">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 min-h-[48px]" aria-label="CrismaTest home">
        <LogoMark />
        <span className="font-bold text-brand-navy text-lg leading-none">CrismaTest</span>
      </Link>

      {/* Hamburger trigger */}
      <Sheet>
        <SheetTrigger
          render={
            <button
              className="min-h-[48px] min-w-[48px] flex items-center justify-center text-neutral-700 hover:text-brand-primary transition-colors"
              aria-label={t("nav_open_menu")}
            >
              <Menu size={24} aria-hidden="true" />
            </button>
          }
        />
        <SheetContent side="top" className="pt-16 pb-6 px-6">
          <SheetHeader className="sr-only">
            <SheetTitle>{t("nav_mobile_title")}</SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
            <Link
              href="/for-candidates"
              className="min-h-[48px] flex items-center text-base font-medium text-neutral-700 hover:text-brand-primary transition-colors px-2 rounded-md hover:bg-brand-light"
            >
              {t("nav_for_candidates")}
            </Link>
            <Link
              href="/for-companies"
              className="min-h-[48px] flex items-center text-base font-medium text-neutral-700 hover:text-brand-primary transition-colors px-2 rounded-md hover:bg-brand-light"
            >
              {t("nav_for_companies")}
            </Link>
            <Link
              href="/pricing"
              className="min-h-[48px] flex items-center text-base font-medium text-neutral-700 hover:text-brand-primary transition-colors px-2 rounded-md hover:bg-brand-light"
            >
              {t("nav_pricing")}
            </Link>
            <div className="pt-2 border-t border-border mt-2">
              <LanguageSwitcher />
            </div>
            <div className="flex flex-col gap-2 pt-2">
              <Link
                href="/login"
                className="min-h-[48px] flex items-center justify-center text-sm font-medium text-brand-primary border border-brand-primary rounded-md bg-transparent hover:bg-brand-light transition-colors"
              >
                {t("nav_login")}
              </Link>
              <Link
                href="/sign-up"
                className="min-h-[48px] flex items-center justify-center text-sm font-medium text-white bg-brand-primary rounded-md hover:bg-brand-secondary transition-colors"
              >
                {t("nav_sign_up")}
              </Link>
            </div>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}
