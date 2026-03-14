import Link from "next/link";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title: string;
  body: string;
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
}

export function EmptyState({ title, body, ctaLabel, ctaHref, className }: EmptyStateProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center text-center px-6 py-12",
      "bg-card rounded-[var(--radius-card)] shadow-[var(--shadow-card)]",
      "max-w-md w-full",
      className
    )}>
      {/* Abstract SVG illustration — blue-palette geometric shapes */}
      <div className="mb-6 w-32 h-32" aria-hidden="true">
        <svg viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Background circle */}
          <circle cx="64" cy="64" r="56" fill="#EEF2FF" />
          {/* Large rectangle — brand-light darker */}
          <rect x="24" y="48" width="80" height="48" rx="8" fill="#DBEAFE" opacity="0.8" />
          {/* Accent rectangle */}
          <rect x="36" y="60" width="56" height="6" rx="3" fill="#1B4FD8" opacity="0.3" />
          {/* Second accent line */}
          <rect x="36" y="72" width="40" height="6" rx="3" fill="#1B4FD8" opacity="0.2" />
          {/* Small circle decoration */}
          <circle cx="88" cy="40" r="12" fill="#6366F1" opacity="0.15" />
          <circle cx="88" cy="40" r="6" fill="#6366F1" opacity="0.25" />
          {/* Top-left small accent */}
          <rect x="20" y="32" width="24" height="10" rx="5" fill="#3B6FE8" opacity="0.2" />
        </svg>
      </div>

      <h2 className="text-xl font-semibold text-brand-navy mb-2">{title}</h2>
      <p className="text-neutral-500 text-sm mb-6 leading-relaxed">{body}</p>

      {ctaLabel && ctaHref && (
        <Link
          href={ctaHref}
          className="inline-flex items-center justify-center min-h-[48px] px-6 rounded-[var(--radius-card)] bg-brand-primary text-white font-medium text-sm hover:bg-brand-secondary transition-colors"
        >
          {ctaLabel}
        </Link>
      )}
    </div>
  );
}
