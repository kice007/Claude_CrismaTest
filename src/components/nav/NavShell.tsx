"use client";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { NavDesktop } from "./NavDesktop";
import { NavMobile } from "./NavMobile";

export function NavShell() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Plain function inside useEffect — do NOT wrap in useCallback (React Compiler active)
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      role="banner"
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/80 backdrop-blur-md shadow-[var(--shadow-card)]"
          : "bg-white/95 backdrop-blur-sm"
      )}
    >
      <NavDesktop />
      <NavMobile />
    </header>
  );
}
