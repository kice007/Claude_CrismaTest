"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslation } from "react-i18next";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { fadeIn, fadeUp } from "@/lib/animations";

const faqKeys = [
  { qKey: "faq_1_q", aKey: "faq_1_a" },
  { qKey: "faq_2_q", aKey: "faq_2_a" },
  { qKey: "faq_3_q", aKey: "faq_3_a" },
  { qKey: "faq_4_q", aKey: "faq_4_a" },
  { qKey: "faq_5_q", aKey: "faq_5_a" },
];

export function FaqSection() {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="w-full bg-white flex flex-col gap-8 md:gap-12 px-5 py-12 md:p-20">
      <SectionReveal variants={fadeIn}>
        <div className="w-fit flex items-center gap-1.5 rounded-full px-3.5 py-1.5 bg-[#EFF6FF] border border-[#BFDBFE]">
          <div className="w-1.5 h-1.5 rounded-sm bg-[#2563EB]" />
          <span className="text-[12px] font-semibold text-[#2563EB] tracking-[0.5px]">{t("faq_badge")}</span>
        </div>
      </SectionReveal>

      <SectionReveal variants={fadeUp} delay={0.1}>
        <h2 className="text-[22px] md:text-[40px] font-extrabold text-[#0F172A] leading-[1.15] tracking-[-0.5px] md:tracking-[-1px]">
          {t("faq_headline")}
        </h2>
      </SectionReveal>

      {/* Accordion */}
      <div className="flex flex-col w-full">
        {faqKeys.map((faq, i) => (
          <div
            key={faq.qKey}
            className="flex flex-col w-full"
            style={i < faqKeys.length - 1 ? { borderBottom: "1px solid #E2E8F0" } : {}}
          >
            <button
              className="flex items-center justify-between w-full py-6 text-left"
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
            >
              <span className="text-[14px] md:text-[16px] font-bold text-[#0F172A]">{t(faq.qKey)}</span>
              <motion.span
                animate={{ rotate: openIndex === i ? 45 : 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="text-[24px] text-[#2563EB] font-light leading-none ml-4 shrink-0"
              >
                +
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {openIndex === i && (
                <motion.div
                  key="answer"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <p className="text-[14px] text-[#64748B] leading-[1.6] pb-6">
                    {t(faq.aKey)}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}
