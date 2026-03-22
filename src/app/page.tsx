import type { Metadata } from "next";
import { HeroSection } from "@/components/home/HeroSection";
import { TrustBar } from "@/components/home/TrustBar";
import { WhatIsSection } from "@/components/home/WhatIsSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { ForCompaniesSection } from "@/components/home/ForCompaniesSection";
import { AntifraudSection } from "@/components/home/AntifraudSection";
import { TestLibrarySection } from "@/components/home/TestLibrarySection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { FaqSection } from "@/components/home/FaqSection";
import { ContactSection } from "@/components/home/ContactSection";
import { FooterSection } from "@/components/home/FooterSection";

export const metadata: Metadata = {
  title: "CrismaTest — Hire the Best. Objectively.",
  description:
    "CrismaTest delivers AI-powered candidate assessments with fraud detection built in. Know who you're hiring — before you extend an offer.",
};

export default function Home() {
  return (
    <main className="min-w-0 overflow-x-hidden">
      <HeroSection />
      <TrustBar />
      <WhatIsSection />
      <HowItWorksSection />
      <ForCompaniesSection />
      <AntifraudSection />
      <TestLibrarySection />
      <TestimonialsSection />
      <FaqSection />
      <ContactSection />
      <FooterSection />
    </main>
  );
}
