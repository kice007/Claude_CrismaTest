"use client";
import { motion } from "motion/react";
import { CircleCheck } from "lucide-react";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { fadeIn, fadeUp, staggerContainer } from "@/lib/animations";

const col1 = [
  "Filter candidates instantly — rank applicants by CrismaScore the moment results come in",
  "Reduce interview time by 70% — only meet pre-qualified candidates who passed your assessment",
  "Eliminate fraud & ChatGPT misuse — AI proctoring detects cheating attempts in real time",
  "Compare candidates objectively — side-by-side score breakdowns remove bias and enable data-driven decisions",
];

const col2 = [
  "Use adaptive job-specific tests — tests automatically adjust based on role requirements",
  "Add optional video questions — assess communication and presence with integrated video modules",
  "Access a global talent pool — browse verified candidates who have completed CrismaTest",
];

export function FeaturesSection({ dark = false }: { dark?: boolean }) {
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
      className="w-full flex flex-col gap-12"
      style={{ background: bg, padding: 80 }}
    >
      <SectionReveal variants={fadeIn}>
        <div
          className="self-start flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12px] font-semibold tracking-[0.5px]"
          style={{ background: badgeBg, border: `1px solid ${badgeBorder}`, color: badgeText }}
        >
          <div className="w-1.5 h-1.5 rounded-sm" style={{ background: badgeText }} />
          For companies
        </div>
      </SectionReveal>

      <SectionReveal variants={fadeUp} delay={0.1}>
        <h2
          className="text-[42px] font-extrabold leading-[1.15] tracking-[-1px]"
          style={{ color: headlineColor }}
        >
          Screen 10x faster. With 90% more accuracy.
        </h2>
      </SectionReveal>

      <SectionReveal variants={fadeUp} delay={0.15}>
        <p className="text-[16px] leading-[1.6]" style={{ color: subColor }}>
          Stop spending hours reviewing resumes that don&apos;t tell the full story. CrismaTest gives
          you objective, fraud-proof scores in under 15 minutes — so you can focus on the candidates
          who actually qualify.
        </p>
      </SectionReveal>

      {/* Feature lists — stagger each column independently */}
      <div className="flex gap-12 w-full">
        <motion.div
          className="flex flex-col flex-1 gap-3.5"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {col1.map((text) => (
            <motion.div
              key={text}
              variants={fadeUp}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex items-start gap-3"
            >
              <CircleCheck
                size={18}
                style={{ color: checkColor, flexShrink: 0, marginTop: 2 }}
              />
              <span className="text-[14px] leading-[1.5]" style={{ color: textColor }}>
                {text}
              </span>
            </motion.div>
          ))}
        </motion.div>
        <motion.div
          className="flex flex-col flex-1 gap-3.5"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {col2.map((text) => (
            <motion.div
              key={text}
              variants={fadeUp}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex items-start gap-3"
            >
              <CircleCheck
                size={18}
                style={{ color: checkColor, flexShrink: 0, marginTop: 2 }}
              />
              <span className="text-[14px] leading-[1.5]" style={{ color: textColor }}>
                {text}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* CTAs */}
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
          className="flex items-center gap-2 rounded-lg text-[15px] font-semibold text-white bg-[#2563EB] hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(37,99,235,0.35)] active:scale-[0.97] transition-all duration-200"
          style={{ padding: "14px 24px" }}
        >
          {dark ? "Try CrismaTest for Teams" : "Try CrismaTest for teams"}
        </motion.a>
        <motion.a
          variants={fadeUp}
          transition={{ duration: 0.4, ease: "easeOut" }}
          href="#contact"
          className="rounded-lg text-[15px] font-semibold hover:opacity-80 active:scale-[0.97] transition-all duration-150"
          style={{ padding: "14px 24px", ...ctaSecondaryStyle }}
        >
          {dark ? "Request a Demo" : "Request a demo"}
        </motion.a>
      </motion.div>
    </section>
  );
}
