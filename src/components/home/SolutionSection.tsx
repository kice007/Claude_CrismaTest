"use client";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { fadeLeft, fadeRight, staggerContainer } from "@/lib/animations";

const stepKeys = [
  { num: "1", titleKey: "solution_step_1_title", descKey: "solution_step_1_desc" },
  { num: "2", titleKey: "solution_step_2_title", descKey: "solution_step_2_desc" },
  { num: "3", titleKey: "solution_step_3_title", descKey: "solution_step_3_desc" },
];

export function SolutionSection({ dark = false }: { dark?: boolean }) {
  const { t } = useTranslation();

  const bg = dark ? "#040D1E" : "#F8FAFC";
  const cardBg = dark ? "#0C1E38" : "#FFFFFF";
  const cardBorder = dark ? "#1E3A5F" : "#e2e8f0";
  const titleColor = dark ? "#FFFFFF" : "#0F172A";
  const descColor = dark ? "#8FA8C8" : "#64748B";
  const headlineColor = dark ? "#FFFFFF" : "#0F172A";
  const subColor = dark ? "#8FA8C8" : "#64748B";
  const badgeBg = dark ? "#0C2040" : "#EFF6FF";
  const badgeBorder = dark ? "#1E3A5F" : "#BFDBFE";
  const badgeText = dark ? "#60A5FA" : "#2563EB";

  return (
    <section id="solution" className="w-full px-5 py-12 md:p-20" style={{ background: bg }}>
      <div className="flex flex-col md:flex-row gap-10 md:gap-12 max-w-[1440px] mx-auto">
        {/* Left */}
        <div className="flex flex-col gap-5 md:gap-6 md:justify-center md:shrink-0 md:w-[480px]">
          <SectionReveal variants={fadeLeft}>
            <div
              className="w-fit flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12px] font-semibold tracking-[0.5px]"
              style={{ background: badgeBg, border: `1px solid ${badgeBorder}`, color: badgeText }}
            >
              <div className="w-1.5 h-1.5 rounded-sm" style={{ background: badgeText }} />
              {t("solution_badge")}
            </div>
          </SectionReveal>
          <SectionReveal variants={fadeLeft} delay={0.1}>
            <h2
              className="text-[26px] md:text-[40px] font-extrabold leading-[1.15] tracking-[-0.5px] md:tracking-[-1px] md:max-w-[440px]"
              style={{ color: headlineColor }}
            >
              {t("solution_headline")}
            </h2>
          </SectionReveal>
          <SectionReveal variants={fadeLeft} delay={0.15}>
            <p className="text-[13px] md:text-[16px] leading-[1.6] md:max-w-[400px]" style={{ color: subColor }}>
              {t("solution_sub")}
            </p>
          </SectionReveal>
          <SectionReveal variants={fadeLeft} delay={0.2}>
            <a
              href="/sign-up"
              className="w-fit flex items-center gap-2 rounded-lg text-[14px] md:text-[15px] font-semibold text-white bg-[#2563EB] hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(37,99,235,0.35)] active:scale-[0.97] transition-all duration-300"
              style={{ padding: "13px 24px" }}
            >
              {t("solution_cta")} <ArrowRight size={16} />
            </a>
          </SectionReveal>
        </div>

        {/* Right: staggered step cards */}
        <motion.div
          className="flex flex-col flex-1 gap-3 md:gap-4 md:pl-12"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {stepKeys.map((step) => (
            <motion.div
              key={step.num}
              variants={fadeRight}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex flex-col gap-2.5 md:gap-3.5 rounded-xl p-4 md:p-6"
              style={{ background: cardBg, border: `1px solid ${cardBorder}` }}
            >
              <span
                className="text-[64px] md:text-[88px] font-black leading-none opacity-45"
                style={
                  dark
                    ? {
                      background: "linear-gradient(180deg, #D0DFE8 0%, #3D5570 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }
                    : { color: "#1d4ed8" }
                }
              >
                {step.num}
              </span>
              <span className="text-[14px] md:text-[17px] font-bold" style={{ color: titleColor }}>
                {t(step.titleKey)}
              </span>
              <span className="text-[12px] md:text-[14px] leading-[1.6]" style={{ color: descColor }}>
                {t(step.descKey)}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
