import { HeroDark } from "@/components/home/HeroDark";
import { TrustBar } from "@/components/home/TrustBar";
import { ProblemSection } from "@/components/home/ProblemSection";
import { SolutionSection } from "@/components/home/SolutionSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { CrismaScoreSection } from "@/components/home/CrismaScoreSection";
import { AntiFraudSection } from "@/components/home/AntiFraudSection";
import { TestLibrarySection } from "@/components/home/TestLibrarySection";
import { FaqSection } from "@/components/home/FaqSection";
import { ContactSection } from "@/components/home/ContactSection";
import { CtaBanner } from "@/components/home/CtaBanner";
import { Footer } from "@/components/home/Footer";

export default function DarkHome() {
  return (
    <>
      <HeroDark />
      <TrustBar dark />
      <ProblemSection />
      <SolutionSection dark />
      <FeaturesSection dark />
      <CrismaScoreSection />
      <AntiFraudSection dark />
      <TestLibrarySection />
      <FaqSection />
      <ContactSection />
      <CtaBanner dark />
      <Footer dark />
    </>
  );
}
