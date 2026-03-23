"use client";
import Image from "next/image";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { fadeIn, fadeUp, staggerContainer } from "@/lib/animations";

const row1Keys = [
  { key: "logic", img: "/images/scores/logic.png", titleKey: "crismascore_logic_title", descKey: "crismascore_logic_desc" },
  { key: "comm",  img: "/images/scores/communication.png", titleKey: "crismascore_comm_title", descKey: "crismascore_comm_desc" },
  { key: "job",   img: "/images/scores/jobskill.png", titleKey: "crismascore_job_title", descKey: "crismascore_job_desc" },
];

export function CrismaScoreSection() {
  const { t } = useTranslation();

  return (
    <section
      id="crismascore"
      className="w-full bg-white flex flex-col items-center gap-8 md:gap-10 py-12 md:py-20"
    >
      <div className="flex flex-col items-center gap-8 md:gap-10 px-5 md:px-20 w-full">
        <SectionReveal variants={fadeIn}>
          <div className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 bg-[#EFF6FF] border border-[#BFDBFE]">
            <div className="w-1.5 h-1.5 rounded-sm bg-[#2563EB]" />
            <span className="text-[12px] font-semibold text-[#2563EB] tracking-[0.5px]">
              {t("crismascore_badge")}
            </span>
          </div>
        </SectionReveal>

        <SectionReveal variants={fadeUp} delay={0.1}>
          <h2 className="text-[24px] md:text-[42px] font-extrabold text-[#0F172A] text-center leading-[1.15] tracking-[-0.5px] md:tracking-[-1px] max-w-[800px]">
            {t("crismascore_headline")}
          </h2>
        </SectionReveal>

        <SectionReveal variants={fadeUp} delay={0.15}>
          <p className="text-[13px] md:text-[16px] text-[#64748B] text-center leading-[1.6] max-w-[640px]">
            {t("crismascore_sub")}
          </p>
        </SectionReveal>
      </div>

      {/* Mobile: horizontal scroll cards */}
      <div className="md:hidden w-full overflow-x-auto pb-4 px-5" style={{ scrollbarWidth: "none" }}>
        <div className="flex gap-3" style={{ width: "max-content" }}>
          {[...row1Keys,
            { key: "trust", img: "/images/scores/trust.png", titleKey: "crismascore_trust_title", descKey: "crismascore_trust_desc" },
            { key: "video", img: "/images/scores/video.png", titleKey: "crismascore_video_title", descKey: "crismascore_video_desc" },
          ].map((score) => (
            <div
              key={score.key}
              className="flex flex-col rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-4 gap-2 cursor-pointer"
              style={{ width: 260 }}
            >
              <div className="relative w-full" style={{ height: 200 }}>
                <Image src={score.img} alt={t(score.titleKey)} fill className="object-contain" />
              </div>
              <div className="flex flex-col gap-1.5 mt-auto">
                <span className="text-[14px] font-bold text-[#1E293B]">{t(score.titleKey)}</span>
                <span className="text-[12px] text-[#64748B] leading-[1.5]">{t(score.descKey)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop: original grid layout */}
      <div className="hidden md:flex flex-col gap-4 w-full px-20" style={{ maxWidth: 1264 + 160 }}>
        {/* Row 1: 3 cards */}
        <motion.div
          className="flex gap-4 w-full"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {row1Keys.map((score) => (
            <motion.div
              key={score.key}
              variants={fadeUp}
              transition={{ duration: 0.4, ease: "easeOut" }}
              whileHover={{ x: [0, -4, 4, -3, 3, -1, 0], transition: { duration: 0.4, ease: "easeInOut" } }}
              className="flex flex-col flex-1 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-6 gap-[10px] cursor-pointer"
            >
              <div className="relative w-full aspect-[354/460]">
                <Image src={score.img} alt={t(score.titleKey)} fill className="object-contain" />
              </div>
              <div className="flex flex-col gap-2 mt-auto">
                <span className="text-[15px] font-bold text-[#1E293B]">{t(score.titleKey)}</span>
                <span className="text-[12px] text-[#64748B]">{t(score.descKey)}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Row 2: 2 cards */}
        <motion.div
          className="flex gap-4 w-full"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.4, ease: "easeOut" }}
            whileHover={{ x: [0, -4, 4, -3, 3, -1, 0], transition: { duration: 0.4, ease: "easeInOut" } }}
            className="flex flex-row items-center rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-6 gap-[10px] cursor-pointer"
            style={{ flex: 2 }}
          >
            <div style={{ flex: "0 0 86%" }}>
              <Image
                src="/images/scores/trust.png"
                alt={t("crismascore_trust_title")}
                width={618}
                height={435}
                className="w-full h-auto object-contain"
              />
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-[15px] font-bold text-[#1E293B]">{t("crismascore_trust_title")}</span>
              <span className="text-[12px] text-[#64748B] leading-[1.6]">{t("crismascore_trust_desc")}</span>
            </div>
          </motion.div>
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.4, ease: "easeOut" }}
            whileHover={{ x: [0, -4, 4, -3, 3, -1, 0], transition: { duration: 0.4, ease: "easeInOut" } }}
            className="flex flex-col flex-1 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-6 gap-[10px] cursor-pointer"
          >
            <div className="relative w-full aspect-[367/440]">
              <Image
                src="/images/scores/video.png"
                alt={t("crismascore_video_title")}
                fill
                className="object-contain"
              />
            </div>
            <div className="flex flex-col gap-2 mt-auto">
              <span className="text-[15px] font-bold text-[#1E293B]">{t("crismascore_video_title")}</span>
              <span className="text-[12px] text-[#64748B]">{t("crismascore_video_desc")}</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <SectionReveal variants={fadeUp} delay={0.1}>
        <p className="text-[14px] italic text-[#94A3B8] text-center px-5">
          {t("crismascore_footer")}
        </p>
      </SectionReveal>
    </section>
  );
}
