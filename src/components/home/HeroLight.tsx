"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, LayoutDashboard, Users, ClipboardList, Star } from "lucide-react";
import { useTranslation } from "react-i18next";

const TABS = [
  { id: "dashboard", icon: LayoutDashboard, labelKey: "hero_tab_dashboard", img: "/images/Qjahc.png" },
  { id: "candidates", icon: Users, labelKey: "hero_tab_candidates", img: "/images/SHJuc.png" },
  { id: "tests", icon: ClipboardList, labelKey: "hero_tab_tests", img: "/images/Ecezq.png" },
  { id: "talent_pool", icon: Star, labelKey: "hero_tab_talent_pool", img: "/images/5mqVn.png" },
] as const;

export function HeroLight() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);

  // Auto-cycle every 3 s; clicking a tab resets the interval
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % TABS.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [activeTab]);

  return (
    <section className="w-full bg-white flex flex-col items-center gap-5 md:gap-8 px-5 md:px-[120px] pt-[36px] pb-10 md:pt-20 md:pb-15">
      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#EFF6FF] border border-[#BFDBFE]"
      >
        <div className="w-2 h-2 rounded bg-[#2563EB]" />
        <span className="text-[12px] font-medium text-[#1D4ED8]">{t("hero_badge")}</span>
      </motion.div>

      {/* Headline */}
      <div className="flex flex-col items-center w-full">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
          className="text-[32px] md:text-[56px] font-extrabold text-[#0F172A] text-center leading-[1.1] tracking-[-1px] md:tracking-[-1.5px] max-w-[780px]"
        >
          {t("hero_headline_1")}
        </motion.h1>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.2 }}
          className="text-[32px] md:text-[56px] font-extrabold text-[#2563EB] text-center leading-[1.1] tracking-[-1px] md:tracking-[-1.5px] max-w-[780px]"
        >
          {t("hero_headline_2")}
        </motion.h1>
      </div>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut", delay: 0.3 }}
        className="text-[14px] md:text-[18px] text-[#64748B] text-center leading-[1.6] max-w-[600px]"
      >
        {t("hero_subtitle")}
      </motion.p>

      {/* CTAs */}
      <div className="flex items-center gap-2.5 md:gap-3">
        <motion.a
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.4 }}
          href="/sign-up"
          className="flex items-center gap-2 px-6 py-3 md:px-7 md:py-3.5 rounded-full bg-[#2563EB] text-white text-[14px] md:text-[15px] font-semibold hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(37,99,235,0.35)] active:scale-[0.97] transition-all duration-300 border-[1.5px] border-[#2563EB] cursor-pointer"
        >
          {t("hero_cta_primary")} <ArrowRight size={16} />
        </motion.a>
        <motion.a
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.48 }}
          href="#features"
          className="px-6 py-3 md:px-7 md:py-3.5 rounded-full bg-white text-[#334155] text-[14px] md:text-[15px] font-semibold hover:scale-[1.03] hover:opacity-80 active:scale-[0.97] transition-all duration-300 border-[1.5px] border-[#E2E8F0] cursor-pointer"
        >
          {t("hero_cta_secondary")}
        </motion.a>
      </div>

      {/* Tabs row — desktop only */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut", delay: 0.55 }}
        className="hidden md:flex items-center justify-center border-b border-[#E2E8F0] w-full"
      >
        {TABS.map((tab, i) => {
          const isActive = i === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(i)}
              className="flex items-center gap-1.5 px-6 py-4 text-[14px] -mb-px transition-all duration-300 cursor-pointer"
              style={{
                color: isActive ? "#2563EB" : "#64748B",
                fontWeight: isActive ? 600 : 400,
                borderBottom: isActive ? "2px solid #2563EB" : "2px solid transparent",
              }}
            >
              <tab.icon
                size={isActive ? 18 : 14}
                style={{ color: isActive ? "#2563EB" : "#94A3B8", transition: "color 0.3s" }}
              />
              {t(tab.labelKey)}
            </button>
          );
        })}
      </motion.div>

      {/* Mock dashboard — desktop: cross-fade tabs; mobile: animated */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.65 }}
        className="w-full overflow-hidden rounded-[10px] border border-[#E2E8F0]"
      >
        {/* Mobile animated image — same cross-fade as desktop */}
        <div className="md:hidden relative w-full aspect-[1440/900]">
          <AnimatePresence mode="sync" initial={false}>
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <Image
                src={TABS[activeTab].img}
                alt={t(TABS[activeTab].labelKey)}
                fill
                className="object-contain object-top"
                priority
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Desktop animated tabs */}
        <div className="hidden md:block relative w-full aspect-[1440/900]">
          <AnimatePresence mode="sync" initial={false}>
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <Image
                src={TABS[activeTab].img}
                alt={t(TABS[activeTab].labelKey)}
                fill
                className="object-contain object-top"
                priority
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
}
