"use client";
import { useTranslation } from "react-i18next";

const companies = [
  "NexaTech",
  "ZestyBite",
  "CozyNest",
  "Energetix",
  "DigiMinds",
  "VitalFit",
  "Eleganza",
];

// Duplicate for seamless marquee loop
const doubled = [...companies, ...companies];

export function TrustBar({ dark = false }: { dark?: boolean }) {
  const { t } = useTranslation();

  return (
    <section
      className="group w-full flex flex-col items-center justify-center gap-4 md:gap-5 overflow-hidden py-6 md:py-0 px-5 md:px-20"
      style={{
        minHeight: 96,
        background: dark ? "#040D1E" : "#FFFFFF",
        borderTop: `1px solid ${dark ? "#0F2648" : "#F1F5F9"}`,
        borderBottom: `1px solid ${dark ? "#0F2648" : "#F1F5F9"}`,
      }}
    >
      <span className="text-[13px] text-center" style={{ color: dark ? "#4A6080" : "#94A3B8" }}>
        {t("trust_bar_label")}
      </span>

      {/* Marquee track: translate -50% = one full logo set (seamless loop) */}
      <div className="flex w-full overflow-hidden">
        <div className="flex items-center gap-12 [animation:marquee_30s_linear_infinite] group-hover:[animation-play-state:paused]">
          {doubled.map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="text-[14px] font-semibold tracking-[0.5px] whitespace-nowrap"
              style={{ color: dark ? "#4A6080" : "#2A4060" }}
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
