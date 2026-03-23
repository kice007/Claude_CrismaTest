"use client";
import Image from "next/image";
import { motion } from "motion/react";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { fadeIn, fadeUp, staggerContainer } from "@/lib/animations";

const detections = [
  { img: "/images/antifraud/faces.png", label: "Multiple faces detected" },
  { img: "/images/antifraud/eye_off.png", label: "Looking away from screen" },
  { img: "/images/antifraud/windows.png", label: "Multiple tabs or windows" },
  { img: "/images/antifraud/keyboard.png", label: "Unusual typing or input patterns" },
  { img: "/images/antifraud/clipboard.png", label: "Copy/paste anomalies" },
  { img: "/images/antifraud/assist.png", label: "Signs of external assistance" },
];

function DetectionCard({
  img,
  label,
  dark,
}: {
  img: string;
  label: string;
  dark: boolean;
}) {
  return (
    <motion.div
      variants={fadeUp}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex-1 flex items-center gap-2.5 rounded-lg"
      style={{
        background: dark ? "#0C1E38" : "rgba(255,255,255,0.7)",
        border: `1px solid ${dark ? "#1E3A5F" : "#BFDBFE"}`,
        padding: "14px 16px",
      }}
    >
      <Image src={img} alt={label} width={16} height={16} className="shrink-0" />
      <span
        className="text-[13px] font-medium"
        style={{ color: dark ? "#E2E8F0" : "#374151" }}
      >
        {label}
      </span>
    </motion.div>
  );
}

export function AntiFraudSection({ dark = false }: { dark?: boolean }) {
  const bg = dark ? "#040D1E" : "#EFF6FF";
  const badgeBg = dark ? "#0C2040" : "#DBEAFE";
  const badgeBorder = dark ? "#1E3A5F" : "#BFDBFE";
  const badgeText = dark ? "#60A5FA" : "#2563EB";
  const headlineColor = dark ? "#FFFFFF" : "#0F172A";
  const subColor = dark ? "#8FA8C8" : "#64748B";
  const footerColor = dark ? "#4A6080" : "#64748B";

  return (
    <section
      className="w-full flex flex-col items-center gap-12"
      style={{ background: bg, padding: 80 }}
    >
      <SectionReveal variants={fadeIn}>
        <div
          className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12px] font-semibold tracking-[0.5px]"
          style={{ background: badgeBg, border: `1px solid ${badgeBorder}`, color: badgeText }}
        >
          <div className="w-1.5 h-1.5 rounded-sm" style={{ background: badgeText }} />
          Anti-Fraud technology
        </div>
      </SectionReveal>

      <SectionReveal variants={fadeUp} delay={0.1}>
        <h2
          className="text-[42px] font-extrabold text-center leading-[1.15] tracking-[-1px] max-w-[800px]"
          style={{ color: headlineColor }}
        >
          No more cheating. No more uncertainty.
        </h2>
      </SectionReveal>

      <SectionReveal variants={fadeUp} delay={0.15}>
        <p
          className="text-[16px] text-center leading-[1.6] max-w-[640px]"
          style={{ color: subColor }}
        >
          CrismaTest uses real-time AI proctoring to ensure every score reflects genuine, unassisted
          performance. Every session is monitored, analyzed, and verified — transparently.
        </p>
      </SectionReveal>

      {/* Detection grid: 2 staggered rows of 3 */}
      <div className="flex flex-col gap-3 w-full">
        <motion.div
          className="flex gap-3 w-full"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {detections.slice(0, 3).map((d) => (
            <DetectionCard key={d.label} {...d} dark={!!dark} />
          ))}
        </motion.div>
        <motion.div
          className="flex gap-3 w-full"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {detections.slice(3).map((d) => (
            <DetectionCard key={d.label} {...d} dark={!!dark} />
          ))}
        </motion.div>
      </div>

      <SectionReveal variants={fadeUp} delay={0.1}>
        <p
          className="text-[14px] italic text-center max-w-[640px]"
          style={{ color: footerColor }}
        >
          All detected behaviors are flagged transparently in the candidate&apos;s report. No hidden
          penalties — just honest data for better decisions.
        </p>
      </SectionReveal>
    </section>
  );
}
