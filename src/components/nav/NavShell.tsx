"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, LogOut, User, Settings, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { NavDesktop } from "./NavDesktop";
import { NavMobile } from "./NavMobile";
import { useAuth } from "@/lib/auth-context";

const landingNavLinks = [
  { key: "nav_landing_purpose", href: "#problem" },
  { key: "nav_landing_how_it_works", href: "#solution" },
  { key: "nav_landing_features", href: "#features" },
  { key: "nav_landing_crismascore", href: "#crismascore" },
  { key: "nav_landing_faq", href: "#faq" },
  { key: "nav_landing_contact", href: "#contact" },
];

export function NavShell() {
  const { i18n, t } = useTranslation();
  const lang = (i18n.resolvedLanguage?.toUpperCase() ?? "EN") as "EN" | "FR";
  const toggleLang = () => i18n.changeLanguage(lang === "EN" ? "fr" : "en");
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const avatarRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const isDarkPage = pathname === "/dark";
  const isLandingPage = pathname === "/" || pathname === "/dark";
  const { isLoggedIn, logout } = useAuth();

  useEffect(() => {
    // Plain function inside useEffect — do NOT wrap in useCallback (React Compiler active)
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close avatar dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) {
        setAvatarOpen(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  // NavShell renders nothing on dashboard routes and all auth routes.
  // Placed AFTER all hooks to comply with Rules of Hooks.
  const isAuthPage =
    pathname.startsWith("/sign-up") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/onboarding");
  if (pathname.startsWith("/dashboard") || isAuthPage) return null;

  if (isLandingPage) {
    const bgClass = isDarkPage
      ? scrolled
        ? "bg-[#040D1E]/95 backdrop-blur-md"
        : "bg-[#040D1E]"
      : scrolled
        ? "bg-white/80 backdrop-blur-md shadow-sm"
        : "bg-white border-b border-[#E2E8F0]";

    const linkBase = isDarkPage ? "text-[#8FA8C8]" : "text-[#64748B]";

    return (
      <>
        <header
          role="banner"
          className={cn(
            "fixed top-0 left-0 right-0 z-50 h-16 flex items-center transition-all duration-300",
            bgClass
          )}
        >
          <div className="flex items-center justify-between w-full px-5 md:px-20 max-w-[1440px] mx-auto">
            <Link
              href="/"
              scroll={false}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-2 shrink-0"
            >
              <Image src="/images/logo.png" alt="CrismaTest logo" width={42} height={36} />
              <span
                className="font-bold text-[18px] tracking-[-0.3px]"
                style={{ color: isDarkPage ? "#FFFFFF" : "#0F172A" }}
              >
                CrismaTest
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-9" aria-label="Main navigation">
              {landingNavLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`text-[14px] font-medium transition-colors duration-300 hover:text-[#2563EB] ${linkBase}`}
                >
                  {t(link.key)}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-3 lg:gap-4">
              {/* Language toggle */}
              <button
                onClick={toggleLang}
                className="hidden md:flex items-center rounded-full p-[3px] transition-colors duration-300"
                style={{
                  border: `1px solid ${isDarkPage ? "#1E3A5F" : "#E2E8F0"}`,
                  background: isDarkPage ? "#0C1E38" : "#F1F5F9",
                }}
                aria-label="Switch language"
              >
                {(["EN", "FR"] as const).map((l) => (
                  <span
                    key={l}
                    className="px-2.5 py-[5px] rounded-full text-[12px] font-semibold transition-all duration-300"
                    style={{
                      background: lang === l ? "#2563EB" : "transparent",
                      color: lang === l ? "#FFFFFF" : isDarkPage ? "#8FA8C8" : "#64748B",
                    }}
                  >
                    {l}
                  </span>
                ))}
              </button>

              {/* Desktop: auth-conditional right section */}
              {isLoggedIn ? (
                <div className="relative hidden lg:block" ref={avatarRef}>
                  <button
                    onClick={() => setAvatarOpen((o) => !o)}
                    className="flex items-center gap-2 rounded-full px-3 py-1.5 hover:bg-slate-100 transition-colors"
                    aria-label="User menu"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#2563EB] flex items-center justify-center text-white text-sm font-medium">
                      JD
                    </div>
                    <span className="text-sm font-medium text-slate-700">John Doe</span>
                    <ChevronDown size={14} className="text-slate-500" />
                  </button>
                  <AnimatePresence>
                    {avatarOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-50"
                      >
                        <button className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50">
                          <User size={14} />
                          {t("nav_avatar_profile")}
                        </button>
                        <button className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50">
                          <Settings size={14} />
                          {t("nav_avatar_settings")}
                        </button>
                        <hr className="my-1 border-slate-100" />
                        <button
                          onClick={() => { logout(); setAvatarOpen(false); }}
                          className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                        >
                          <LogOut size={14} />
                          {t("nav_avatar_logout")}
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <>
                  <a
                    href="#"
                    className={`hidden lg:block text-[14px] transition-colors duration-300 hover:text-[#2563EB] ${linkBase}`}
                  >
                    {t("nav_log_in")}
                  </a>
                  <Link
                    href="/sign-up"
                    className="hidden lg:block px-5 py-2.5 rounded-md text-[14px] font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] hover:scale-[1.03] active:scale-[0.97] transition-all duration-300"
                  >
                    {t("nav_sign_up_cta")}
                  </Link>
                </>
              )}

              {/* Mobile hamburger */}
              <button
                className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg transition-colors"
                style={{
                  border: `1px solid ${isDarkPage ? "#1E3A5F" : "#E2E8F0"}`,
                  color: isDarkPage ? "#8FA8C8" : "#334155",
                }}
                onClick={() => setMobileMenuOpen((o) => !o)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </header>

        {/* Mobile slide-down menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="lg:hidden fixed top-16 left-0 right-0 z-40 flex flex-col py-4"
              style={{
                background: isDarkPage ? "#040D1E" : "#FFFFFF",
                borderBottom: `1px solid ${isDarkPage ? "#0F2648" : "#E2E8F0"}`,
              }}
            >
              {landingNavLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-5 py-3.5 text-[15px] font-medium transition-colors hover:text-[#2563EB] ${linkBase}`}
                >
                  {t(link.key)}
                </a>
              ))}
              <div className="flex items-center justify-between px-5 pt-4 pb-1">
                <div className="flex items-center gap-3">
                  {isLoggedIn ? (
                    <button
                      type="button"
                      onClick={() => { logout(); setMobileMenuOpen(false); }}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <LogOut size={14} />
                      {t("nav_avatar_logout")}
                    </button>
                  ) : (
                    <>
                      <a
                        href="#"
                        className={`text-[14px] font-medium transition-colors hover:text-[#2563EB] ${linkBase}`}
                      >
                        {t("nav_log_in")}
                      </a>
                      <Link
                        href="/sign-up"
                        onClick={() => setMobileMenuOpen(false)}
                        className="px-5 py-2.5 rounded-md text-[14px] font-semibold text-white bg-[#2563EB]"
                      >
                        {t("nav_sign_up_cta")}
                      </Link>
                    </>
                  )}
                </div>
                {/* Language toggle — mobile */}
                <button
                  onClick={toggleLang}
                  className="flex items-center rounded-full p-[3px] transition-colors duration-300"
                  style={{
                    border: `1px solid ${isDarkPage ? "#1E3A5F" : "#E2E8F0"}`,
                    background: isDarkPage ? "#0C1E38" : "#F1F5F9",
                  }}
                  aria-label="Switch language"
                >
                  {(["EN", "FR"] as const).map((l) => (
                    <span
                      key={l}
                      className="px-2.5 py-[5px] rounded-full text-[12px] font-semibold transition-all duration-300"
                      style={{
                        background: lang === l ? "#2563EB" : "transparent",
                        color: lang === l ? "#FFFFFF" : isDarkPage ? "#8FA8C8" : "#64748B",
                      }}
                    >
                      {l}
                    </span>
                  ))}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  // ─── App nav (non-landing pages) ──────────────────────────────────────────────
  return (
    <header
      role="banner"
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/80 backdrop-blur-md shadow-[var(--shadow-card)]"
          : "bg-white/95 backdrop-blur-sm"
      )}
    >
      <NavDesktop />
      <NavMobile />
    </header>
  );
}
