"use client";
import Image from "next/image";
import { motion } from "motion/react";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { fadeIn, fadeUp, staggerContainer } from "@/lib/animations";

const row1 = [
  {
    key: "logic",
    title: "Logic score",
    desc: "Reasoning ability, pattern recognition, and analytical problem-solving",
    img: "/images/scores/logic.png",
  },
  {
    key: "comm",
    title: "Communication score",
    desc: "Written and verbal clarity, analysis, tone, and persuasiveness",
    img: "/images/scores/communication.png",
  },
  {
    key: "job",
    title: "Job skill score",
    desc: "Role-specific technical and practical AI-readiness",
    img: "/images/scores/jobskill.png",
  },
];

export function CrismaScoreSection() {
  return (
    <section
      id="crismascore"
      className="w-full bg-white flex flex-col items-center gap-10"
      style={{ padding: 80 }}
    >
      <SectionReveal variants={fadeIn}>
        <div className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 bg-[#EFF6FF] border border-[#BFDBFE]">
          <div className="w-1.5 h-1.5 rounded-sm bg-[#2563EB]" />
          <span className="text-[12px] font-semibold text-[#2563EB] tracking-[0.5px]">
            The CrismaScore
          </span>
        </div>
      </SectionReveal>

      <SectionReveal variants={fadeUp} delay={0.1}>
        <h2 className="text-[42px] font-extrabold text-[#0F172A] text-center leading-[1.15] tracking-[-1px] max-w-[800px]">
          A single, universal score that companies trust.
        </h2>
      </SectionReveal>

      <SectionReveal variants={fadeUp} delay={0.15}>
        <p className="text-[16px] text-[#64748B] text-center leading-[1.6] max-w-[640px]">
          CrismaScore is not just a number. It&apos;s a verified, portable, AI-generated profile of a
          candidate&apos;s real capabilities — built from five dimensions of evaluation.
        </p>
      </SectionReveal>

      {/* Score cards */}
      <div className="w-full flex flex-col gap-4" style={{ maxWidth: 1264 }}>
        {/* Row 1: 3 cards — stagger */}
        <motion.div
          className="flex gap-4 w-full"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {row1.map((score) => (
            <motion.div
              key={score.key}
              variants={fadeUp}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex flex-col flex-1 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] overflow-hidden"
            >
              <div className="relative w-full" style={{ height: 220 }}>
                <Image src={score.img} alt={score.title} fill className="object-contain p-4" />
              </div>
              <div className="flex flex-col gap-2 px-5 py-4">
                <span className="text-[15px] font-bold text-[#1E293B]">{score.title}</span>
                <span className="text-[12px] text-[#64748B]">{score.desc}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Row 2: 2 cards — stagger */}
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
            className="flex flex-col rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] overflow-hidden"
            style={{ flex: 2 }}
          >
            <div className="relative w-full" style={{ height: 260 }}>
              <Image
                src="/images/scores/trust.png"
                alt="Trust score"
                fill
                className="object-contain p-4"
              />
            </div>
            <div className="flex flex-col gap-2 px-5 py-4">
              <span className="text-[15px] font-bold text-[#1E293B]">Trust score</span>
              <span className="text-[12px] text-[#64748B]">
                Anti-fraud stability — consistency, behavioral patterns, and AI-verified authenticity
              </span>
            </div>
          </motion.div>
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex flex-col flex-1 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] overflow-hidden"
          >
            <div className="relative w-full" style={{ height: 260 }}>
              <Image
                src="/images/scores/video.png"
                alt="Video score"
                fill
                className="object-contain p-4"
              />
            </div>
            <div className="flex flex-col gap-2 px-5 py-4">
              <span className="text-[15px] font-bold text-[#1E293B]">Video score (optional)</span>
              <span className="text-[12px] text-[#64748B]">
                Communication clarity, presence, and clarity from video responses
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <SectionReveal variants={fadeUp} delay={0.1}>
        <p className="text-[14px] italic text-[#94A3B8] text-center">
          One test. One score. Trusted by recruiters worldwide.
        </p>
      </SectionReveal>
    </section>
  );
}
