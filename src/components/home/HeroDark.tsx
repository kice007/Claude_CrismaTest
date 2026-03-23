"use client";
import { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";

const headlineLines = [
  { text: "The global standard", blue: false, delay: 0.1 },
  { text: "for talent", blue: false, delay: 0.2 },
  { text: "assessment.", blue: true, delay: 0.3 },
];

export function HeroDark() {
  const [loaded, setLoaded] = useState(false);

  return (
    <section
      className="w-full flex flex-col md:flex-row"
      style={{
        background: "linear-gradient(180deg, #040D1E 0%, #071A38 100%)",
        minHeight: 680,
      }}
    >
      {/* Content column — centered on mobile, left-aligned on desktop */}
      <div className="flex flex-col items-center md:items-start justify-center gap-5 md:gap-6 shrink-0 w-full md:w-[563px] px-5 pt-24 pb-8 md:pt-0 md:pb-0 md:pl-20 md:pr-0">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="flex items-center gap-2 rounded-full text-[12px] font-medium"
          style={{
            background: "#0C2040",
            border: "1px solid #1E3A5F",
            padding: "6px 12px",
            color: "#60A5FA",
          }}
        >
          AI Assessment platform
          <ArrowUpRight size={14} />
        </motion.div>

        {/* Headline */}
        <div className="flex flex-col items-center md:items-start w-full">
          {headlineLines.map(({ text, blue, delay }) => (
            <motion.span
              key={text}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut", delay }}
              className="text-[32px] md:text-[52px] font-extrabold leading-[1.1] tracking-[-1px] md:tracking-[-1.5px] text-center md:text-left"
              style={{ color: blue ? "#2563EB" : "#FFFFFF" }}
            >
              {text}
            </motion.span>
          ))}
        </div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.4 }}
          className="text-[14px] md:text-[16px] leading-[1.6] text-center md:text-left"
          style={{ color: "#8FA8C8" }}
        >
          AI-powered. Adaptive. Fraud-proof. Verified. One test. One score. Unlimited opportunities.
        </motion.p>

        {/* CTAs */}
        <div className="flex items-center gap-2.5 md:gap-3">
          <motion.a
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.5 }}
            href="/sign-up"
            className="flex items-center gap-2 rounded-full md:rounded-lg text-[14px] md:text-[15px] font-semibold text-white bg-[#2563EB] hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(37,99,235,0.35)] active:scale-[0.97] transition-all duration-200"
            style={{ padding: "13px 24px" }}
          >
            Start a test <ArrowUpRight size={16} />
          </motion.a>
          <motion.a
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.58 }}
            href="#features"
            className="rounded-full md:rounded-lg text-[14px] md:text-[15px] font-semibold hover:opacity-80 active:scale-[0.97] transition-all duration-150"
            style={{ color: "#8FA8C8", border: "1px solid #1E3A5F", padding: "13px 24px" }}
          >
            For companies
          </motion.a>
        </div>
      </div>

      {/* Image — below on mobile, right panel on desktop */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.65 }}
        className="flex-1 flex items-center justify-center px-5 pb-10 md:px-12 md:py-12"
      >
        <div className="w-full rounded-xl overflow-hidden relative" style={{ height: 220 }}>
          {!loaded && (
            <div className="absolute inset-0 animate-pulse bg-slate-800 rounded-xl" />
          )}
          <Image
            src="/images/dashboard.png"
            alt="CrismaTest dashboard"
            fill
            className="object-cover object-top"
            onLoad={() => setLoaded(true)}
            priority
          />
        </div>
      </motion.div>
    </section>
  );
}
