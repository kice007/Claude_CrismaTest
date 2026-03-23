"use client";
import { type ElementType } from "react";
import { motion } from "motion/react";
import {
  BrainCircuit,
  Zap,
  MessageSquare,
  UserCheck,
  ShieldCheck,
  Video,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { fadeLeft, fadeRight, staggerContainer } from "@/lib/animations";

const featureKeys: { icon: ElementType; titleKey: string; descKey: string }[] = [
  { icon: BrainCircuit, titleKey: "problem_feat_1_title", descKey: "problem_feat_1_desc" },
  { icon: Zap,          titleKey: "problem_feat_2_title", descKey: "problem_feat_2_desc" },
  { icon: MessageSquare,titleKey: "problem_feat_3_title", descKey: "problem_feat_3_desc" },
  { icon: UserCheck,    titleKey: "problem_feat_4_title", descKey: "problem_feat_4_desc" },
  { icon: ShieldCheck,  titleKey: "problem_feat_5_title", descKey: "problem_feat_5_desc" },
  { icon: Video,        titleKey: "problem_feat_6_title", descKey: "problem_feat_6_desc" },
];

export function ProblemSection() {
  const { t } = useTranslation();

  return (
    <section id="problem" className="w-full bg-white px-5 py-12 md:p-20">
      <div className="flex flex-col md:flex-row gap-10 md:gap-16 max-w-[1440px] mx-auto">
        {/* Left */}
        <div className="flex flex-col gap-5 md:justify-center md:shrink-0 md:w-[500px]">
          <SectionReveal variants={fadeLeft}>
            <div className="w-fit flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#EFF6FF] border border-[#BFDBFE]">
              <div className="w-1.5 h-1.5 rounded-sm bg-[#2563EB]" />
              <span className="text-[12px] font-semibold text-[#2563EB] tracking-[0.5px]">
                {t("problem_badge")}
              </span>
            </div>
          </SectionReveal>
          <SectionReveal variants={fadeLeft} delay={0.1}>
            <h2 className="text-[26px] md:text-[36px] font-extrabold text-[#0F172A] leading-[1.15] tracking-[-0.5px] md:tracking-[-1px] md:max-w-[460px]">
              {t("problem_headline")}
            </h2>
          </SectionReveal>
          <SectionReveal variants={fadeLeft} delay={0.15}>
            <p className="text-[14px] md:text-[16px] text-[#64748B] leading-[1.6] md:max-w-[440px]">
              {t("problem_body")}
            </p>
          </SectionReveal>
          <SectionReveal variants={fadeLeft} delay={0.2}>
            <p className="text-[16px] md:text-[18px] font-bold text-[#0F172A]">{t("problem_duration")}</p>
          </SectionReveal>
        </div>

        {/* Right: 2-column on desktop, single column on mobile */}
        <div className="flex flex-1 gap-3 md:gap-4">
          <motion.div
            className="flex flex-col flex-1 gap-2.5"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {featureKeys.slice(0, 3).map((f) => (
              <motion.div
                key={f.titleKey}
                variants={fadeRight}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="flex flex-col gap-2 rounded-[10px] bg-[#F8FAFC] border border-[#E2E8F0] p-4"
              >
                <f.icon size={20} className="text-[#2563EB]" />
                <span className="text-[13px] md:text-[14px] font-bold text-[#0F172A]">{t(f.titleKey)}</span>
                <span className="text-[12px] text-[#64748B] leading-[1.5]">{t(f.descKey)}</span>
              </motion.div>
            ))}
          </motion.div>
          <motion.div
            className="flex flex-col flex-1 gap-2.5"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {featureKeys.slice(3).map((f) => (
              <motion.div
                key={f.titleKey}
                variants={fadeRight}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="flex flex-col gap-2 rounded-[10px] bg-[#F8FAFC] border border-[#E2E8F0] p-4"
              >
                <f.icon size={20} className="text-[#2563EB]" />
                <span className="text-[13px] md:text-[14px] font-bold text-[#0F172A]">{t(f.titleKey)}</span>
                <span className="text-[12px] text-[#64748B] leading-[1.5]">{t(f.descKey)}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
