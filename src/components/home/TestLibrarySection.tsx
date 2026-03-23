"use client";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { fadeIn, fadeUp, staggerContainer } from "@/lib/animations";

const categories = [
  {
    dotColor: "#1D4ED8",
    labelKey: "tests_cat_1_label",
    chips: [
      { key: "tests_chip_customer_support",   textColor: "#1D4ED8", bg: "#EFF6FF" },
      { key: "tests_chip_virtual_assistant",  textColor: "#1D4ED8", bg: "#EFF6FF" },
      { key: "tests_chip_software_developer", textColor: "#1D4ED8", bg: "#EFF6FF" },
      { key: "tests_chip_it_support",         textColor: "#1D4ED8", bg: "#EFF6FF" },
      { key: "tests_chip_project_management", textColor: "#1D4ED8", bg: "#EFF6FF" },
    ],
  },
  {
    dotColor: "#7C3AED",
    labelKey: "tests_cat_2_label",
    chips: [
      { key: "tests_chip_marketing",        textColor: "#7C3AED", bg: "#F5F3FF" },
      { key: "tests_chip_sales",            textColor: "#7C3AED", bg: "#F5F3FF" },
      { key: "tests_chip_data_analysis",    textColor: "#7C3AED", bg: "#F5F3FF" },
      { key: "tests_chip_business_analyst", textColor: "#7C3AED", bg: "#F5F3FF" },
    ],
  },
  {
    dotColor: "#059669",
    labelKey: "tests_cat_3_label",
    chips: [
      { key: "tests_chip_operations",    textColor: "#059669", bg: "#ECFDF5" },
      { key: "tests_chip_finance",       textColor: "#059669", bg: "#ECFDF5" },
      { key: "tests_chip_hr_management", textColor: "#059669", bg: "#ECFDF5" },
      { key: "tests_chip_more_coming",   textColor: "#94A3B8", bg: "#F8FAFC", border: "#E2E8F0", italic: true },
    ],
  },
] as const;

// Pre-compute global chip index for rain animation delays
const categoriesWithDelay = (() => {
  let idx = 0;
  return categories.map((cat) => ({
    ...cat,
    chips: cat.chips.map((chip) => ({ ...chip, rainDelay: idx++ * 0.055 })),
  }));
})();

export function TestLibrarySection() {
  const { t } = useTranslation();

  return (
    <section
      id="tests"
      className="w-full bg-[#F8FAFC] flex flex-col items-center gap-8 md:gap-10 px-5 py-12 md:p-20"
    >
      <SectionReveal variants={fadeIn}>
        <div className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 bg-[#EFF6FF] border border-[#BFDBFE]">
          <div className="w-1.5 h-1.5 rounded-sm bg-[#2563EB]" />
          <span className="text-[12px] font-semibold text-[#2563EB] tracking-[0.5px]">
            {t("tests_badge")}
          </span>
        </div>
      </SectionReveal>

      <SectionReveal variants={fadeUp} delay={0.1}>
        <h2 className="text-[24px] md:text-[42px] font-extrabold text-[#0F172A] text-center leading-[1.15] tracking-[-0.5px] md:tracking-[-1px] max-w-[800px]">
          {t("tests_headline")}
        </h2>
      </SectionReveal>

      <SectionReveal variants={fadeUp} delay={0.15}>
        <p className="text-[13px] md:text-[16px] text-[#64748B] text-center leading-[1.6] max-w-[620px]">
          {t("tests_sub")}
        </p>
      </SectionReveal>

      {/* Category cards — stagger */}
      <motion.div
        className="flex flex-col md:flex-row gap-3 md:gap-4 w-full"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {categoriesWithDelay.map((cat) => (
          <motion.div
            key={cat.labelKey}
            variants={fadeUp}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex-1 flex flex-col gap-4 rounded-xl bg-white border border-[#E2E8F0] p-6"
          >
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded dot-pulse"
                style={{ background: cat.dotColor }}
              />
              <span className="text-[11px] font-semibold text-[#64748B] tracking-[0.5px]">
                {t(cat.labelKey)}
              </span>
            </div>
            <div className="h-px bg-[#E2E8F0] w-full" />
            <div className="flex flex-wrap gap-2">
              {cat.chips.map((chip) => (
                <motion.div
                  key={chip.key}
                  initial={{ opacity: 0, y: -18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.18, ease: "easeOut", delay: chip.rainDelay }}
                  className="px-3 py-1.5 rounded-full"
                  style={{
                    background: chip.bg,
                    border: "border" in chip ? `1px solid ${chip.border}` : undefined,
                  }}
                >
                  <span
                    className={`text-[13px] font-medium${"italic" in chip && chip.italic ? " italic" : ""}`}
                    style={{ color: chip.textColor }}
                  >
                    {t(chip.key)}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>

      <SectionReveal variants={fadeUp} delay={0.1}>
        <button className="px-7 py-3 rounded-lg border-[1.5px] border-[#CBD5E1] text-[15px] font-semibold text-[#334155] hover:scale-[1.03] hover:opacity-80 active:scale-[0.97] transition-all duration-300">
          {t("tests_cta")}
        </button>
      </SectionReveal>
    </section>
  );
}
