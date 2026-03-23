"use client";
import { motion } from "motion/react";
import { CircleCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { fadeIn, fadeUp, staggerContainer } from "@/lib/animations";

const col1Keys = ["features_col1_1", "features_col1_2", "features_col1_3", "features_col1_4"];
const col2Keys = ["features_col2_1", "features_col2_2", "features_col2_3"];

export function FeaturesSection({ dark = false }: { dark?: boolean }) {
  const { t } = useTranslation();

  const bg = dark ? "#040D1E" : "#FFFFFF";
  const badgeBg = dark ? "#0C2040" : "#EFF6FF";
  const badgeBorder = dark ? "#1E3A5F" : "#BFDBFE";
  const badgeText = dark ? "#60A5FA" : "#2563eb";
  const headlineColor = dark ? "#FFFFFF" : "#0F172A";
  const subColor = dark ? "#8FA8C8" : "#64748B";
  const checkColor = dark ? "#60A5FA" : "#2563EB";
  const textColor = dark ? "#E2E8F0" : "#475569";
  const ctaSecondaryStyle = dark
    ? { border: "1px solid #1E3A5F", color: "#8FA8C8" }
    : { border: "1px solid #E2E8F0", color: "#0F172A" };

  return (
    <section
      id="features"
      className="w-full flex flex-col gap-8 md:gap-12 px-5 py-12 md:p-20"
      style={{ background: bg }}
    >
      <SectionReveal variants={fadeIn}>
        <div
          className="w-fit flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12px] font-semibold tracking-[0.5px]"
          style={{ background: badgeBg, border: `1px solid ${badgeBorder}`, color: badgeText }}
        >
          <div className="w-1.5 h-1.5 rounded-sm" style={{ background: badgeText }} />
          {t("features_badge")}
        </div>
      </SectionReveal>

      <SectionReveal variants={fadeUp} delay={0.1}>
        <h2
          className="text-[24px] md:text-[42px] font-extrabold leading-[1.15] tracking-[-0.5px] md:tracking-[-1px]"
          style={{ color: headlineColor }}
        >
          {t("features_headline")}
        </h2>
      </SectionReveal>

      <SectionReveal variants={fadeUp} delay={0.15}>
        <p className="text-[13px] md:text-[16px] leading-[1.6]" style={{ color: subColor }}>
          {t("features_sub")}
        </p>
      </SectionReveal>

      {/* Feature lists — 2 col on desktop, single col on mobile */}
      <div className="flex flex-col md:flex-row gap-8 md:gap-12 w-full">
        <motion.div
          className="flex flex-col flex-1 gap-3 md:gap-3.5"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {col1Keys.map((key) => (
            <motion.div
              key={key}
              variants={fadeUp}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex items-start gap-2.5 md:gap-3"
            >
              <CircleCheck
                size={16}
                style={{ color: checkColor, flexShrink: 0, marginTop: 2 }}
              />
              <span className="text-[13px] md:text-[14px] leading-[1.5]" style={{ color: textColor }}>
                {t(key)}
              </span>
            </motion.div>
          ))}
        </motion.div>
        <motion.div
          className="flex flex-col flex-1 gap-3 md:gap-3.5"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {col2Keys.map((key) => (
            <motion.div
              key={key}
              variants={fadeUp}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex items-start gap-2.5 md:gap-3"
            >
              <CircleCheck
                size={16}
                style={{ color: checkColor, flexShrink: 0, marginTop: 2 }}
              />
              <span className="text-[13px] md:text-[14px] leading-[1.5]" style={{ color: textColor }}>
                {t(key)}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* CTAs — stacked full-width on mobile, row on desktop */}
      <motion.div
        className="flex flex-col md:flex-row items-stretch md:items-center gap-3"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.a
          variants={fadeUp}
          transition={{ duration: 0.4, ease: "easeOut" }}
          href="/sign-up"
          className="flex items-center justify-center gap-2 rounded-lg text-[14px] md:text-[15px] font-semibold text-white bg-[#2563EB] hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(37,99,235,0.35)] active:scale-[0.97] transition-all duration-200"
          style={{ padding: "14px 24px" }}
        >
          {t("features_cta_primary")}
        </motion.a>
        <motion.a
          variants={fadeUp}
          transition={{ duration: 0.4, ease: "easeOut" }}
          href="#contact"
          className="flex items-center justify-center rounded-lg text-[14px] md:text-[15px] font-semibold hover:opacity-80 active:scale-[0.97] transition-all duration-150"
          style={{ padding: "14px 24px", ...ctaSecondaryStyle }}
        >
          {t("features_cta_secondary")}
        </motion.a>
      </motion.div>
    </section>
  );
}
