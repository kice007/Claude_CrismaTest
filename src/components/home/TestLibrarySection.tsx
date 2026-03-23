"use client";
import { motion } from "motion/react";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { fadeIn, fadeUp, staggerContainer } from "@/lib/animations";

const categories = [
  {
    dotColor: "#1D4ED8",
    label: "TECHNOLOGY & SUPPORT",
    chips: [
      { text: "Customer support", textColor: "#1D4ED8", bg: "#EFF6FF" },
      { text: "Virtual assistant", textColor: "#1D4ED8", bg: "#EFF6FF" },
      { text: "Software developer", textColor: "#1D4ED8", bg: "#EFF6FF" },
    ],
  },
  {
    dotColor: "#7C3AED",
    label: "BUSINESS & GROWTH",
    chips: [
      { text: "Marketing", textColor: "#7C3AED", bg: "#F5F3FF" },
      { text: "Sales", textColor: "#7C3AED", bg: "#F5F3FF" },
      { text: "Data analysis", textColor: "#7C3AED", bg: "#F5F3FF" },
    ],
  },
  {
    dotColor: "#059669",
    label: "OPERATIONS & FINANCE",
    chips: [
      { text: "Operations", textColor: "#059669", bg: "#ECFDF5" },
      { text: "Finance", textColor: "#059669", bg: "#ECFDF5" },
      {
        text: "More coming soon…",
        textColor: "#94A3B8",
        bg: "#F8FAFC",
        border: "#E2E8F0",
        italic: true,
      },
    ],
  },
] as const;

export function TestLibrarySection() {
  return (
    <section
      id="tests"
      className="w-full bg-[#F8FAFC] flex flex-col items-center gap-10"
      style={{ padding: 80 }}
    >
      <SectionReveal variants={fadeIn}>
        <div className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 bg-[#EFF6FF] border border-[#BFDBFE]">
          <div className="w-1.5 h-1.5 rounded-sm bg-[#2563EB]" />
          <span className="text-[12px] font-semibold text-[#2563EB] tracking-[0.5px]">
            Pre-built assessments
          </span>
        </div>
      </SectionReveal>

      <SectionReveal variants={fadeUp} delay={0.1}>
        <h2 className="text-[42px] font-extrabold text-[#0F172A] text-center leading-[1.15] tracking-[-1px] max-w-[800px]">
          Role-ready tests for every position.
        </h2>
      </SectionReveal>

      <SectionReveal variants={fadeUp} delay={0.15}>
        <p className="text-[16px] text-[#64748B] text-center leading-[1.6] max-w-[620px]">
          Choose from our growing library of job-specific assessments — each designed to evaluate the
          exact skills that matter for that role.
        </p>
      </SectionReveal>

      {/* Category cards — stagger */}
      <motion.div
        className="flex gap-4 w-full"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {categories.map((cat) => (
          <motion.div
            key={cat.label}
            variants={fadeUp}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex-1 flex flex-col gap-4 rounded-xl bg-white border border-[#E2E8F0] p-6"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded" style={{ background: cat.dotColor }} />
              <span className="text-[11px] font-semibold text-[#64748B] tracking-[0.5px]">
                {cat.label}
              </span>
            </div>
            <div className="h-px bg-[#E2E8F0] w-full" />
            <div className="flex flex-col gap-2">
              {cat.chips.map((chip) => (
                <div
                  key={chip.text}
                  className="self-start px-3 py-1.5 rounded-full"
                  style={{
                    background: chip.bg,
                    border: "border" in chip ? `1px solid ${chip.border}` : undefined,
                  }}
                >
                  <span
                    className={`text-[13px] font-medium${"italic" in chip && chip.italic ? " italic" : ""}`}
                    style={{ color: chip.textColor }}
                  >
                    {chip.text}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>

      <SectionReveal variants={fadeUp} delay={0.1}>
        <button className="px-7 py-3 rounded-lg border-[1.5px] border-[#CBD5E1] text-[15px] font-semibold text-[#334155] hover:opacity-80 active:scale-[0.97] transition-all duration-150">
          Browse all tests
        </button>
      </SectionReveal>
    </section>
  );
}
