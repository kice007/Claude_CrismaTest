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
      className="w-full flex"
      style={{
        height: 680,
        background: "linear-gradient(180deg, #040D1E 0%, #071A38 100%)",
      }}
    >
      {/* Left */}
      <div
        className="flex flex-col justify-center gap-6 shrink-0"
        style={{ width: 563, padding: "80px 0 80px 80px" }}
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="self-start flex items-center gap-2 rounded-full text-[12px] font-medium"
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
        <div className="flex flex-col w-full">
          {headlineLines.map(({ text, blue, delay }) => (
            <motion.span
              key={text}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut", delay }}
              className="text-[52px] font-extrabold leading-[1.1] tracking-[-1.5px]"
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
          className="text-[16px] leading-[1.6]"
          style={{ color: "#8FA8C8" }}
        >
          AI-powered. Adaptive. Fraud-proof. Verified. The smartest way to evaluate candidates — and
          prove your skills to the world. One test. One score. Unlimited opportunities.
        </motion.p>

        {/* CTAs */}
        <div className="flex items-center gap-3">
          <motion.a
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.5 }}
            href="/sign-up"
            className="flex items-center gap-2 rounded-lg text-[15px] font-semibold text-white bg-[#2563EB] hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(37,99,235,0.35)] active:scale-[0.97] transition-all duration-200"
            style={{ padding: "14px 24px" }}
          >
            Start a test <ArrowUpRight size={16} />
          </motion.a>
          <motion.a
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.58 }}
            href="#features"
            className="rounded-lg text-[15px] font-semibold hover:opacity-80 active:scale-[0.97] transition-all duration-150"
            style={{ color: "#8FA8C8", border: "1px solid #1E3A5F", padding: "14px 24px" }}
          >
            For companies
          </motion.a>
        </div>
      </div>

      {/* Right — image + skeleton */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.65 }}
        className="flex-1 flex items-center justify-center"
        style={{ padding: "48px 80px 48px 48px" }}
      >
        <div className="w-full rounded-xl overflow-hidden relative" style={{ height: 460 }}>
          {!loaded && (
            <div className="absolute inset-0 animate-pulse bg-slate-800 rounded-xl" />
          )}
          <Image
            src="/images/dashboard.png"
            alt="CrismaTest dashboard"
            fill
            className="object-cover"
            onLoad={() => setLoaded(true)}
          />
        </div>
      </motion.div>
    </section>
  );
}
