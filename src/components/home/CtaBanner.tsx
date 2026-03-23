"use client";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { fadeUp, staggerContainer } from "@/lib/animations";

export function CtaBanner({ dark = false }: { dark?: boolean }) {
  const { t } = useTranslation();

  const bg = dark ? "#071428" : "#1D4ED8";
  const subColor = dark ? "#8FA8C8" : "#BFDBFE";

  return (
    <section
      className="w-full flex flex-col items-center justify-center gap-8 px-5 py-12 md:py-0 md:px-[120px]"
      style={{ background: bg, minHeight: 280 }}
    >
      <div className="flex flex-col items-center gap-5 w-full">
        <SectionReveal variants={fadeUp}>
          <h2 className="text-[24px] md:text-[44px] font-extrabold text-white text-center leading-[1.15] tracking-[-0.5px] md:tracking-[-1px] max-w-[640px]">
            {t("cta_headline")}
          </h2>
        </SectionReveal>

        <SectionReveal variants={fadeUp} delay={0.1}>
          <p className="text-[14px] text-center" style={{ color: subColor }}>
            {t("cta_sub")}
          </p>
        </SectionReveal>

        <motion.div
          className="flex items-center gap-3"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.a
            variants={fadeUp}
            transition={{ duration: 0.4, ease: "easeOut" }}
            href="/sign-up"
            className="rounded-lg text-[15px] font-bold text-white bg-[#2563EB] hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(37,99,235,0.35)] active:scale-[0.97] transition-all duration-200"
            style={{ padding: "14px 28px" }}
          >
            {t("cta_primary")}
          </motion.a>
          <motion.a
            variants={fadeUp}
            transition={{ duration: 0.4, ease: "easeOut" }}
            href="#features"
            className="rounded-lg text-[15px] font-semibold text-white hover:opacity-80 active:scale-[0.97] transition-all duration-150"
            style={{ padding: "14px 28px", border: "1px solid white" }}
          >
            {t("cta_secondary")}
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
