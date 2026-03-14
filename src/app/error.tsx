"use client";
import { EmptyState } from "@/components/EmptyState";

export default function Error() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-background">
      <EmptyState
        title="Something went wrong"
        body="An unexpected error occurred. Please try again or return home."
        ctaLabel="Back to home"
        ctaHref="/"
      />
    </main>
  );
}
