"use client";
import { motion } from "motion/react";
import { Users, EyeOff, AppWindow, Keyboard, ClipboardList, UserPlus } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { fadeIn, fadeUp, staggerContainer } from "@/lib/animations";

const detectionKeys: { icon: LucideIcon; labelKey: string }[] = [
  { icon: Users,         labelKey: "antifraud_det_1" },
  { icon: EyeOff,        labelKey: "antifraud_det_2" },
  { icon: AppWindow,     labelKey: "antifraud_det_3" },
  { icon: Keyboard,      labelKey: "antifraud_det_4" },
  { icon: ClipboardList, labelKey: "antifraud_det_5" },
  { icon: UserPlus,      labelKey: "antifraud_det_6" },
];

function DetectionCard({
  icon: Icon,
  label,
  dark,
}: {
  icon: LucideIcon;
  label: string;
  dark: boolean;
}) {
  return (
    <motion.div
      variants={fadeUp}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex items-start gap-2.5 rounded-lg"
      style={{
        background: dark ? "#0C1E38" : "rgba(255,255,255,0.7)",
        border: `1px solid ${dark ? "#1E3A5F" : "#BFDBFE"}`,
        padding: "14px 16px",
      }}
    >
      <Icon
        size={16}
        className="shrink-0"
        style={{ color: dark ? "#60A5FA" : "#2563EB" }}
      />
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
  const { t } = useTranslation();

  const bg = dark ? "#040D1E" : "#EFF6FF";
  const badgeBg = dark ? "#0C2040" : "#DBEAFE";
  const badgeBorder = dark ? "#1E3A5F" : "#BFDBFE";
  const badgeText = dark ? "#60A5FA" : "#2563EB";
  const headlineColor = dark ? "#FFFFFF" : "#0F172A";
  const subColor = dark ? "#8FA8C8" : "#64748B";
  const footerColor = dark ? "#4A6080" : "#64748B";

  return (
    <section
      className="w-full flex flex-col items-center gap-8 md:gap-12 px-5 py-12 md:p-20"
      style={{ background: bg }}
    >
      <SectionReveal variants={fadeIn}>
        <div
          className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12px] font-semibold tracking-[0.5px]"
          style={{ background: badgeBg, border: `1px solid ${badgeBorder}`, color: badgeText }}
        >
          <div className="w-1.5 h-1.5 rounded-sm" style={{ background: badgeText }} />
          {t("antifraud_badge")}
        </div>
      </SectionReveal>

      <SectionReveal variants={fadeUp} delay={0.1}>
        <h2
          className="text-[24px] md:text-[42px] font-extrabold text-center leading-[1.15] tracking-[-0.5px] md:tracking-[-1px] max-w-[800px]"
          style={{ color: headlineColor }}
        >
          {t("antifraud_headline")}
        </h2>
      </SectionReveal>

      <SectionReveal variants={fadeUp} delay={0.15}>
        <p
          className="text-[13px] md:text-[16px] text-center leading-[1.6] max-w-[640px]"
          style={{ color: subColor }}
        >
          {t("antifraud_sub")}
        </p>
      </SectionReveal>

      {/* Mobile: 2-column grid (3 rows × 2) */}
      <motion.div
        className="md:hidden grid grid-cols-2 gap-2 w-full"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {detectionKeys.map((d) => (
          <DetectionCard key={d.labelKey} icon={d.icon} label={t(d.labelKey)} dark={!!dark} />
        ))}
      </motion.div>

      {/* Desktop: 2 rows of 3 */}
      <div className="hidden md:flex flex-col gap-3 w-full">
        <motion.div
          className="flex justify-center gap-3 w-full"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {detectionKeys.slice(0, 3).map((d) => (
            <DetectionCard key={d.labelKey} icon={d.icon} label={t(d.labelKey)} dark={!!dark} />
          ))}
        </motion.div>
        <motion.div
          className="flex justify-center gap-3 w-full"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {detectionKeys.slice(3).map((d) => (
            <DetectionCard key={d.labelKey} icon={d.icon} label={t(d.labelKey)} dark={!!dark} />
          ))}
        </motion.div>
      </div>

      <SectionReveal variants={fadeUp} delay={0.1}>
        <p
          className="text-[13px] md:text-[14px] italic text-center max-w-[640px]"
          style={{ color: footerColor }}
        >
          {t("antifraud_footer")}
        </p>
      </SectionReveal>
    </section>
  );
}
