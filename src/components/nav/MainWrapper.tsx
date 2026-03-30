"use client";
import { usePathname } from "next/navigation";

export function MainWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isTestFlow = pathname.startsWith("/test/");

  return (
    <main className={isTestFlow ? "min-w-0" : "pt-16 min-w-0"}>
      {children}
    </main>
  );
}
