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
import { SectionReveal } from "@/components/ui/SectionReveal";
import { fadeIn, fadeUp, staggerContainer } from "@/lib/animations";

const features: { icon: ElementType; title: string; desc: string }[] = [
  {
    icon: BrainCircuit,
    title: "Job-specific skills",
    desc: "Tailored questions matched to the exact role being tested",
  },
  {
    icon: Zap,
    title: "Logic & problem-solving",
    desc: "Evaluate critical thinking and analytical capabilities under pressure",
  },
  {
    icon: MessageSquare,
    title: "Communication",
    desc: "Assess written and verbal clarity, structure, and tone",
  },
  {
    icon: UserCheck,
    title: "Behavioral indicators",
    desc: "Understand work style, motivation, and cultural alignment",
  },
  {
    icon: ShieldCheck,
    title: "Anti-fraud consistency",
    desc: "Advanced AI detection ensures responses are genuine and unassisted",
  },
  {
    icon: Video,
    title: "Video responses (optional)",
    desc: "Optional video questions for deeper candidate insight",
  },
];

function FeatureCard({ icon: Icon, title, desc }: { icon: ElementType; title: string; desc: string }) {
  return (
    <motion.div
      variants={fadeUp}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-col gap-2 rounded-[10px] bg-[#F8FAFC] border border-[#E2E8F0] p-4"
    >
      <Icon size={20} className="text-[#2563EB]" />
      <span className="text-[14px] font-bold text-[#0F172A]">{title}</span>
      <span className="text-[12px] text-[#64748B] leading-[1.5]">{desc}</span>
    </motion.div>
  );
}

export function ProblemSection() {
  return (
    <section id="problem" className="w-full bg-white" style={{ padding: 80 }}>
      <div className="flex gap-16 max-w-[1440px] mx-auto">
        {/* Left */}
        <div className="flex flex-col justify-center gap-5 shrink-0" style={{ width: 500 }}>
          <SectionReveal variants={fadeIn}>
            <div className="self-start flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#EFF6FF] border border-[#BFDBFE]">
              <div className="w-1.5 h-1.5 rounded-sm bg-[#2563EB]" />
              <span className="text-[12px] font-semibold text-[#2563EB] tracking-[0.5px]">
                What is CrismaTest?
              </span>
            </div>
          </SectionReveal>
          <SectionReveal variants={fadeUp} delay={0.1}>
            <h2
              className="text-[36px] font-extrabold text-[#0F172A] leading-[1.15] tracking-[-1px]"
              style={{ maxWidth: 460 }}
            >
              The world&apos;s first AI-powered adaptive test designed for real-world hiring.
            </h2>
          </SectionReveal>
          <SectionReveal variants={fadeUp} delay={0.15}>
            <p className="text-[16px] text-[#64748B] leading-[1.6]" style={{ maxWidth: 440 }}>
              CrismaTest isn&apos;t a quiz. It&apos;s a complete evaluation system that measures what
              actually matters — the skills, reasoning, and reliability that make someone great at
              their job.
            </p>
          </SectionReveal>
          <SectionReveal variants={fadeUp} delay={0.2}>
            <p className="text-[18px] font-bold text-[#0F172A]">All in just 10–15 minutes.</p>
          </SectionReveal>
        </div>

        {/* Right: 2-column staggered feature cards */}
        <div className="flex flex-1 gap-4">
          <motion.div
            className="flex flex-col flex-1 gap-2.5"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.slice(0, 3).map((f) => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </motion.div>
          <motion.div
            className="flex flex-col flex-1 gap-2.5"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.slice(3).map((f) => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
