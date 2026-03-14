import { EmptyState } from "@/components/EmptyState";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-background">
      <EmptyState
        title="Page not found"
        body="The page you're looking for doesn't exist or has been moved."
        ctaLabel="Back to home"
        ctaHref="/"
      />
    </main>
  );
}
