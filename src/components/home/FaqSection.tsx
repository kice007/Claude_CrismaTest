"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { fadeIn, fadeUp } from "@/lib/animations";

const faqs = [
  {
    q: "How accurate is the test?",
    a: "CrismaTest combines six evaluation dimensions — logic, communication, job skills, behavioral indicators, anti-fraud consistency, and optional video — to produce a holistic score with significantly higher predictive validity than traditional CV screening.",
  },
  {
    q: "How long does it take?",
    a: "Most candidates complete the full test in 10 to 15 minutes. The adaptive format means the test adjusts to your responses — no two sessions are identical.",
  },
  {
    q: "How is cheating prevented?",
    a: "CrismaTest uses real-time AI proctoring that monitors webcam activity, tab switching, typing patterns, copy/paste behavior, audio environment, and secondary screen usage. Any anomalies are flagged in the candidate's TrustScore breakdown.",
  },
  {
    q: "Can companies customize the test?",
    a: "Yes. Companies on Starter, Pro, and Enterprise plans can use the Test Builder to select specific modules, adjust question focus, and add up to 3 custom questions — all without any technical configuration.",
  },
  {
    q: "Can I reuse my CrismaScore?",
    a: "Absolutely. Your CrismaScore is valid for 12 months. You can share it via a unique profile link, embed it on LinkedIn, or send it directly to any employer — anywhere in the world. Free plan candidates receive 2 free retests.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="w-full bg-white flex flex-col gap-12" style={{ padding: 80 }}>
      {/* Outer shell — scroll reveal */}
      <SectionReveal variants={fadeIn}>
        <div className="self-start flex items-center gap-1.5 rounded-full px-3.5 py-1.5 bg-[#EFF6FF] border border-[#BFDBFE]">
          <div className="w-1.5 h-1.5 rounded-sm bg-[#2563EB]" />
          <span className="text-[12px] font-semibold text-[#2563EB] tracking-[0.5px]">FAQ</span>
        </div>
      </SectionReveal>

      <SectionReveal variants={fadeUp} delay={0.1}>
        <h2 className="text-[40px] font-extrabold text-[#0F172A] leading-[1.15] tracking-[-1px]">
          Frequently asked questions
        </h2>
      </SectionReveal>

      {/* Accordion */}
      <div className="flex flex-col w-full">
        {faqs.map((faq, i) => (
          <div
            key={faq.q}
            className="flex flex-col w-full"
            style={i < faqs.length - 1 ? { borderBottom: "1px solid #E2E8F0" } : {}}
          >
            <button
              className="flex items-center justify-between w-full py-6 text-left"
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
            >
              <span className="text-[16px] font-bold text-[#0F172A]">{faq.q}</span>
              <motion.span
                animate={{ rotate: openIndex === i ? 45 : 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="text-[24px] text-[#2563EB] font-light leading-none ml-4 shrink-0"
              >
                +
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {openIndex === i && (
                <motion.div
                  key="answer"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <p className="text-[14px] text-[#64748B] leading-[1.6] pb-6">
                    {faq.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}
