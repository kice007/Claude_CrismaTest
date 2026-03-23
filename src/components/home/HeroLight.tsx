"use client";
import { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { ArrowRight, LayoutDashboard, Users, ClipboardList, Star } from "lucide-react";

const tabs = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: Users, label: "Candidates", active: false },
  { icon: ClipboardList, label: "Tests", active: false },
  { icon: Star, label: "Talent Pool", active: false },
];

export function HeroLight() {
  const [loaded, setLoaded] = useState(false);

  return (
    <section className="w-full bg-white flex flex-col items-center gap-8 px-[120px] pt-20 pb-15">
      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#EFF6FF] border border-[#BFDBFE]"
      >
        <div className="w-2 h-2 rounded bg-[#2563EB]" />
        <span className="text-[12px] font-medium text-[#1D4ED8]">AI Assessment platform</span>
      </motion.div>

      {/* Headline */}
      <div className="flex flex-col items-center w-full">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
          className="text-[56px] font-extrabold text-[#0F172A] text-center leading-[1.1] tracking-[-1.5px] max-w-[780px]"
        >
          The global standard
        </motion.h1>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.2 }}
          className="text-[56px] font-extrabold text-[#2563EB] text-center leading-[1.1] tracking-[-1.5px] max-w-[780px]"
        >
          for talent assessment
        </motion.h1>
      </div>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut", delay: 0.3 }}
        className="text-[18px] text-[#64748B] text-center leading-[1.6] max-w-[600px]"
      >
        AI-powered. Adaptive. Fraud-proof. Verified. The smartest way to evaluate candidates — and
        prove your skills to the world. One test. One score. Unlimited opportunities.
      </motion.p>

      {/* CTAs */}
      <div className="flex items-center gap-3">
        <motion.a
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.4 }}
          href="/sign-up"
          className="flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#2563EB] text-white text-[15px] font-semibold hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(37,99,235,0.35)] active:scale-[0.97] transition-all duration-200 border-[1.5px] border-[#2563EB]"
        >
          Start a test <ArrowRight size={16} />
        </motion.a>
        <motion.a
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.48 }}
          href="#features"
          className="px-7 py-3.5 rounded-full bg-white text-[#334155] text-[15px] font-semibold hover:opacity-80 active:scale-[0.97] transition-all duration-150 border-[1.5px] border-[#E2E8F0]"
        >
          For companies
        </motion.a>
      </div>

      {/* Tabs row */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut", delay: 0.55 }}
        className="flex items-center justify-center border-b border-[#E2E8F0] w-full"
      >
        {tabs.map((tab) => (
          <div
            key={tab.label}
            className={`flex items-center gap-1.5 px-6 py-4 text-[14px] cursor-pointer transition-colors ${
              tab.active
                ? "text-[#2563EB] font-semibold border-b-2 border-[#2563EB]"
                : "text-[#64748B]"
            }`}
          >
            <tab.icon size={tab.active ? 18 : 14} />
            {tab.label}
          </div>
        ))}
      </motion.div>

      {/* Dashboard image + skeleton */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.65 }}
        className="w-full rounded-xl overflow-hidden border border-[#E2E8F0] relative"
        style={{ height: 743 }}
      >
        {!loaded && (
          <div className="absolute inset-0 animate-pulse bg-slate-100 rounded-xl" />
        )}
        <Image
          src="/images/dashboard.png"
          alt="CrismaTest dashboard"
          fill
          className="object-cover"
          onLoad={() => setLoaded(true)}
        />
      </motion.div>
    </section>
  );
}
