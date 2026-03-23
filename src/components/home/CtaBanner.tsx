"use client";
import { motion } from "motion/react";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { fadeUp, staggerContainer } from "@/lib/animations";

export function CtaBanner({ dark = false }: { dark?: boolean }) {
  const bg = dark ? "#071428" : "#1D4ED8";
  const subColor = dark ? "#8FA8C8" : "#BFDBFE";

  return (
    <section
      className="w-full flex flex-col items-center justify-center gap-8"
      style={{ background: bg, height: 360, padding: "0 120px" }}
    >
      <div className="flex flex-col items-center gap-5 w-full">
        <SectionReveal variants={fadeUp}>
          <h2 className="text-[44px] font-extrabold text-white text-center leading-[1.15] tracking-[-1px] max-w-[640px]">
            Take the test. Get your score. Open more doors.
          </h2>
        </SectionReveal>

        <SectionReveal variants={fadeUp} delay={0.1}>
          <p className="text-[14px] text-center" style={{ color: subColor }}>
            Join thousands of candidates who have already validated their skills with CrismaTest. Free
            to start.
          </p>
        </SectionReveal>

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
            className="rounded-lg text-[15px] font-bold text-white bg-[#2563EB] hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(37,99,235,0.35)] active:scale-[0.97] transition-all duration-200"
            style={{ padding: "14px 28px" }}
          >
            Get your CrismaScore
          </motion.a>
          <motion.a
            variants={fadeUp}
            transition={{ duration: 0.4, ease: "easeOut" }}
            href="#features"
            className="rounded-lg text-[15px] font-semibold hover:opacity-80 active:scale-[0.97] transition-all duration-150"
            style={{ padding: "14px 28px", border: "1px solid #1E3A5F", color: "#8FA8C8" }}
          >
            For companies
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
