"use client";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { fadeIn, fadeUp, staggerContainer } from "@/lib/animations";

const steps = [
  {
    num: "1",
    title: "Take the test",
    desc: "Adaptive, dynamic, and secure. Complete your AI-powered assessment in just 10–15 minutes from any device.",
  },
  {
    num: "2",
    title: "Get your CrismaScore",
    desc: "Receive a universal score from 0–100 measuring your skills and potential — broken down into LogicScore, CommsScore, JobSkillScore, and TrustScore.",
  },
  {
    num: "3",
    title: "Share it everywhere",
    desc: "Use your CrismaScore when applying to jobs anywhere in the world — on CrismaWork, LinkedIn, Indeed, and with any employer worldwide.",
  },
];

export function SolutionSection({ dark = false }: { dark?: boolean }) {
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
    <section id="solution" className="w-full" style={{ background: bg, padding: 80 }}>
      <div className="flex gap-12 max-w-[1440px] mx-auto">
        {/* Left */}
        <div className="flex flex-col justify-center gap-6 shrink-0" style={{ width: 480 }}>
          <SectionReveal variants={fadeIn}>
            <div
              className="self-start flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12px] font-semibold tracking-[0.5px]"
              style={{ background: badgeBg, border: `1px solid ${badgeBorder}`, color: badgeText }}
            >
              <div className="w-1.5 h-1.5 rounded-sm" style={{ background: badgeText }} />
              For candidates
            </div>
          </SectionReveal>
          <SectionReveal variants={fadeUp} delay={0.1}>
            <h2
              className="text-[40px] font-extrabold leading-[1.15] tracking-[-1px]"
              style={{ color: headlineColor, maxWidth: 440 }}
            >
              3 steps. 10 minutes. One global score.
            </h2>
          </SectionReveal>
          <SectionReveal variants={fadeUp} delay={0.15}>
            <p className="text-[16px] leading-[1.6]" style={{ color: subColor, maxWidth: 400 }}>
              From test to verified score in minutes. Your CrismaScore is portable, universal, and
              trusted by employers worldwide.
            </p>
          </SectionReveal>
          <SectionReveal variants={fadeUp} delay={0.2}>
            <a
              href="/sign-up"
              className="self-start flex items-center gap-2 rounded-lg text-[15px] font-semibold text-white bg-[#2563EB] hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(37,99,235,0.35)] active:scale-[0.97] transition-all duration-200"
              style={{ padding: "14px 28px" }}
            >
              Get your CrismaScore <ArrowRight size={16} />
            </a>
          </SectionReveal>
        </div>

        {/* Right: staggered step cards */}
        <motion.div
          className="flex flex-col flex-1 gap-4"
          style={{ paddingLeft: 48 }}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {steps.map((step) => (
            <motion.div
              key={step.num}
              variants={fadeUp}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex flex-col gap-3.5 rounded-xl p-6"
              style={{ background: cardBg, border: `1px solid ${cardBorder}` }}
            >
              <span
                className="text-[88px] font-black leading-none opacity-45"
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
              <span className="text-[17px] font-bold" style={{ color: titleColor }}>
                {step.title}
              </span>
              <span className="text-[14px] leading-[1.6]" style={{ color: descColor }}>
                {step.desc}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
