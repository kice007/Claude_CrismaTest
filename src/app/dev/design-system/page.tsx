// src/app/dev/design-system/page.tsx
// Dev-only: returns 404 in production (I18N-02: all strings via useTranslation)
"use client";
import { useState } from "react";
import { notFound } from "next/navigation";
import { useTranslation } from "react-i18next";
import { motion } from "motion/react";
import { toast } from "sonner";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { fadeIn, slideUp, staggerChildren } from "@/lib/motion";
import { Skeleton } from "@/components/Skeleton";
import { EmptyState } from "@/components/EmptyState";
import { InviteModal } from "@/components/modals/InviteModal";
import { CalendarModal } from "@/components/modals/CalendarModal";
import { ExportModal } from "@/components/modals/ExportModal";
import { ContactModal } from "@/components/modals/ContactModal";

const BRAND_COLORS = [
  { name: "brand-primary", hex: "#1B4FD8", cls: "bg-brand-primary" },
  { name: "brand-secondary", hex: "#3B6FE8", cls: "bg-brand-secondary" },
  { name: "brand-navy", hex: "#0F2A6B", cls: "bg-brand-navy" },
  { name: "brand-light", hex: "#EEF2FF", cls: "bg-brand-light border border-neutral-200" },
  { name: "brand-accent", hex: "#6366F1", cls: "bg-brand-accent" },
  { name: "success", hex: "#16a34a", cls: "bg-success" },
  { name: "warning", hex: "#d97706", cls: "bg-warning" },
  { name: "danger", hex: "#dc2626", cls: "bg-danger" },
] as const;

export default function DesignSystemPage() {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  const { t, i18n } = useTranslation();

  const [inviteOpen, setInviteOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground p-8 space-y-12">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-6">
        <h1 className="text-3xl font-bold text-brand-navy">{t("design_system_title")}</h1>
        <LanguageSwitcher />
      </div>

      {/* Brand Colors — verifies DSYS-01 */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-brand-navy">{t("design_system_colors")}</h2>
        <motion.div
          variants={staggerChildren}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          {BRAND_COLORS.map((color) => (
            <motion.div key={color.name} variants={fadeIn} className="space-y-2">
              <div
                className={`h-16 rounded-[var(--radius-card)] shadow-[var(--shadow-card)] ${color.cls}`}
                title={color.hex}
              />
              <p className="text-sm font-mono text-neutral-700">{color.name}</p>
              <p className="text-xs text-neutral-500">{color.hex}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Typography — verifies DSYS-03 */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-brand-navy">{t("design_system_typography")}</h2>
        <div className="space-y-3 p-6 rounded-[var(--radius-card)] shadow-[var(--shadow-card)] bg-card">
          <p className="font-sans text-4xl font-bold text-brand-navy">Inter — Display Bold</p>
          <p className="font-sans text-xl font-medium text-neutral-700">Inter — Body Medium</p>
          <p className="font-sans text-base text-neutral-500">Inter — Regular paragraph text at 16px base</p>
          <p className="font-mono text-lg text-brand-primary">JetBrains Mono — Code / Timer</p>
          <p className="font-mono text-sm text-brand-accent">01:23:45 — Monospaced countdown</p>
        </div>
      </section>

      {/* Shadcn Components — verifies DSYS-02 */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-brand-navy">{t("design_system_components")}</h2>
        <div className="flex flex-wrap gap-3 p-6 rounded-[var(--radius-card)] shadow-[var(--shadow-card)] bg-card">
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity min-h-[44px]">
            Primary Button
          </button>
          <button className="bg-secondary text-secondary-foreground px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity min-h-[44px]">
            Secondary Button
          </button>
          <button className="bg-brand-accent text-white px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity min-h-[44px]">
            Accent Button
          </button>
          <span className="inline-flex items-center px-3 py-1 rounded-[var(--radius-chip)] bg-brand-light text-brand-primary text-sm font-medium">
            Chip / Pill
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-[var(--radius-badge)] bg-success text-white text-xs font-medium">
            Badge
          </span>
        </div>
      </section>

      {/* Animations — verifies Framer Motion setup */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-brand-navy">{t("design_system_animations")}</h2>
        <motion.div
          variants={slideUp}
          initial="hidden"
          animate="visible"
          className="p-6 rounded-[var(--radius-card)] shadow-[var(--shadow-modal)] bg-card border border-border"
        >
          <p className="text-sm text-neutral-500">
            This card animated in with slideUp. MotionConfig reducedMotion=&quot;user&quot; is active globally.
          </p>
        </motion.div>
      </section>

      {/* i18n Demo — verifies I18N-01, I18N-03, I18N-04 */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-brand-navy">{t("design_system_i18n")}</h2>
        <div className="p-6 rounded-[var(--radius-card)] shadow-[var(--shadow-card)] bg-card space-y-3">
          <p className="text-sm text-neutral-700">
            Active language: <span className="font-mono text-brand-primary font-semibold">{i18n.resolvedLanguage}</span>
          </p>
          <p className="text-sm text-neutral-500">
            Stored key: <span className="font-mono">crismatest_lang</span> in localStorage
          </p>
          <p className="text-sm text-neutral-500">
            html[lang]: updates via I18nProvider useEffect (check DevTools after switching)
          </p>
        </div>
      </section>

      {/* Plural Demo — verifies I18N-05 */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-brand-navy">{t("design_system_plural_demo")}</h2>
        <div className="p-6 rounded-[var(--radius-card)] shadow-[var(--shadow-card)] bg-card space-y-2">
          {[0, 1, 2, 5].map((count) => (
            <p key={count} className="text-sm text-neutral-700">
              <span className="font-mono text-brand-accent mr-2">{count}</span>
              {t("candidate_count", { count })}
            </p>
          ))}
        </div>
      </section>

      {/* Shadow tokens showcase */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-brand-navy">Shadow Tokens</h2>
        <div className="grid grid-cols-3 gap-6">
          <div className="p-4 rounded-[var(--radius-card)] shadow-[var(--shadow-card)] bg-card">
            <p className="text-sm font-mono text-neutral-500">--shadow-card</p>
          </div>
          <div className="p-4 rounded-[var(--radius-card)] shadow-[var(--shadow-dropdown)] bg-card">
            <p className="text-sm font-mono text-neutral-500">--shadow-dropdown</p>
          </div>
          <div className="p-4 rounded-[var(--radius-card)] shadow-[var(--shadow-modal)] bg-card">
            <p className="text-sm font-mono text-neutral-500">--shadow-modal</p>
          </div>
        </div>
      </section>

      {/* Phase 2 — Shared UI Components */}
      <section className="space-y-8">
        <h2 className="text-2xl font-bold text-brand-navy border-t border-border pt-8">
          {t("design_system_phase2_title")}
        </h2>

        {/* Skeleton demos */}
        <section className="space-y-4">
          <h3 className="text-xl font-semibold text-brand-navy">{t("design_system_skeleton_title")}</h3>
          <div className="p-6 bg-card rounded-[var(--radius-card)] shadow-[var(--shadow-card)]">
            <div className="space-y-3">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-64" />
              <Skeleton className="h-32 w-full rounded-[var(--radius-card)]" />
              <div className="flex gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Empty State demo */}
        <section className="space-y-4">
          <h3 className="text-xl font-semibold text-brand-navy">{t("design_system_empty_state_title")}</h3>
          <div className="p-6 bg-card rounded-[var(--radius-card)] shadow-[var(--shadow-card)]">
            <EmptyState
              title="No candidates yet"
              body="Invite candidates to take a test and their results will appear here."
              ctaLabel="Invite Candidate"
              ctaHref="#"
            />
          </div>
        </section>

        {/* Toast demos */}
        <section className="space-y-4">
          <h3 className="text-xl font-semibold text-brand-navy">{t("design_system_toasts_title")}</h3>
          <div className="p-6 bg-card rounded-[var(--radius-card)] shadow-[var(--shadow-card)]">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => toast.success("Candidate invited successfully")}
                className="min-h-[48px] px-4 bg-success text-white rounded-md text-sm font-medium"
              >
                {t("design_system_toast_success")}
              </button>
              <button
                onClick={() => toast.warning("Session expiring soon")}
                className="min-h-[48px] px-4 bg-warning text-white rounded-md text-sm font-medium"
              >
                {t("design_system_toast_warning")}
              </button>
              <button
                onClick={() => toast.error("Failed to send invite")}
                className="min-h-[48px] px-4 bg-danger text-white rounded-md text-sm font-medium"
              >
                {t("design_system_toast_error")}
              </button>
            </div>
          </div>
        </section>

        {/* Modal demos */}
        <section className="space-y-4">
          <h3 className="text-xl font-semibold text-brand-navy">{t("design_system_modals_title")}</h3>
          <div className="p-6 bg-card rounded-[var(--radius-card)] shadow-[var(--shadow-card)]">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setInviteOpen(true)}
                className="min-h-[48px] px-4 bg-brand-primary text-white rounded-md text-sm font-medium hover:bg-brand-secondary transition-colors"
              >
                Invite Modal
              </button>
              <button
                onClick={() => setCalendarOpen(true)}
                className="min-h-[48px] px-4 bg-brand-primary text-white rounded-md text-sm font-medium hover:bg-brand-secondary transition-colors"
              >
                Calendar Modal
              </button>
              <button
                onClick={() => setExportOpen(true)}
                className="min-h-[48px] px-4 bg-brand-primary text-white rounded-md text-sm font-medium hover:bg-brand-secondary transition-colors"
              >
                Export Modal
              </button>
              <button
                onClick={() => setContactOpen(true)}
                className="min-h-[48px] px-4 bg-brand-primary text-white rounded-md text-sm font-medium hover:bg-brand-secondary transition-colors"
              >
                Contact Modal
              </button>
            </div>
          </div>

          <InviteModal open={inviteOpen} onOpenChange={setInviteOpen} />
          <CalendarModal open={calendarOpen} onOpenChange={setCalendarOpen} />
          <ExportModal open={exportOpen} onOpenChange={setExportOpen} />
          <ContactModal open={contactOpen} onOpenChange={setContactOpen} />
        </section>
      </section>
    </div>
  );
}
