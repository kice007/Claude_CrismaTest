"use client";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";

const navLinks = [
  { key: "footer_nav_purpose",      href: "#problem" },
  { key: "footer_nav_how_it_works", href: "#solution" },
  { key: "footer_nav_crismascore",  href: "#crismascore" },
  { key: "footer_nav_features",     href: "#features" },
  { key: "footer_nav_faq",          href: "#faq" },
  { key: "footer_nav_contact",      href: "#contact" },
];

const legalLinks = [
  { key: "footer_legal_privacy", href: "#" },
  { key: "footer_legal_terms",   href: "#" },
  { key: "footer_legal_cookies", href: "#" },
];

const socialLinks = [
  { key: "footer_social_linkedin",  href: "#" },
  { key: "footer_social_twitter",   href: "#" },
  { key: "footer_social_instagram", href: "#" },
];

export function Footer({ dark = false }: { dark?: boolean }) {
  const { t } = useTranslation();

  const bg = dark ? "#040D1E" : "#0F172A";
  const borderColor = dark ? "#0F2648" : "#1E293B";
  const textMuted = dark ? "#2A4060" : "#475569";

  return (
    <footer
      className="w-full px-5 py-10 md:px-20 md:py-[60px]"
      style={{ background: bg, borderTop: `1px solid ${borderColor}` }}
    >
      {/* Top row */}
      <div className="flex flex-col md:flex-row md:justify-between gap-8 md:gap-0 w-full mb-8 md:mb-12">
        <div className="flex flex-col gap-3" style={{ maxWidth: 280 }}>
          <Link href="/" className="flex items-center gap-2">
            <Image src="/images/logo.png" alt="CrismaTest" width={42} height={36} />
            <span className="text-white text-[16px] font-bold">CrismaTest</span>
          </Link>
          <span className="text-[13px] leading-[1.6]" style={{ color: "#475569" }}>
            {t("footer_tagline")}
          </span>
        </div>

        <div className="flex gap-10 md:gap-20">
          <div className="flex flex-col gap-3">
            <span className="text-[12px] font-bold tracking-[0.5px]" style={{ color: "#8FA8C8" }}>
              {t("footer_nav_label")}
            </span>
            {navLinks.map((link) => (
              <a
                key={link.key}
                href={link.href}
                className="text-[13px] hover:opacity-80 transition-opacity"
                style={{ color: "#4A6080" }}
              >
                {t(link.key)}
              </a>
            ))}
          </div>
          <div className="flex flex-col gap-3">
            <span className="text-[12px] font-bold tracking-[0.5px]" style={{ color: "#8FA8C8" }}>
              {t("footer_legal_label")}
            </span>
            {legalLinks.map((link) => (
              <a
                key={link.key}
                href={link.href}
                className="text-[13px] hover:opacity-80 transition-opacity"
                style={{ color: "#4A6080" }}
              >
                {t(link.key)}
              </a>
            ))}
          </div>
          <div className="flex flex-col gap-3">
            <span className="text-[12px] font-bold tracking-[0.5px]" style={{ color: "#8FA8C8" }}>
              {t("footer_social_label")}
            </span>
            {socialLinks.map((link) => (
              <a
                key={link.key}
                href={link.href}
                className="text-[13px] hover:opacity-80 transition-opacity"
                style={{ color: "#4A6080" }}
              >
                {t(link.key)}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 pt-6 w-full"
        style={{ borderTop: `1px solid ${borderColor}` }}
      >
        <span className="text-[12px]" style={{ color: textMuted }}>
          {t("footer_copyright")}
        </span>
        <span className="text-[12px]" style={{ color: textMuted }}>
          {t("footer_bottom_links")}
        </span>
      </div>
    </footer>
  );
}
