import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Geist } from "next/font/google";
import { MotionConfig } from "motion/react";
import { I18nProvider } from "@/components/I18nProvider";
import { AuthProvider } from "@/lib/auth-context";
import { NavShell } from "@/components/nav/NavShell";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

// Replace Geist fonts with Inter + JetBrains Mono (per DSYS-03 and CONTEXT.md decision)
// JetBrains_Mono is a variable font — no weight array needed
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CrismaTest",
  description: "AI-powered talent assessment platform",
  // og:locale is set to static en_US default — client-side language state is not
  // available during server rendering without URL-based routing.
  // See 01-RESEARCH.md Open Questions #2 for full explanation.
  openGraph: {
    locale: "en_US",
    alternateLocale: ["fr_FR"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // lang="en" is the server-rendered default; I18nProvider useEffect updates it
    // client-side to match the stored localStorage language (I18N-06)
    <html
      lang="en"
      className={cn(inter.variable, jetbrainsMono.variable, "font-sans", geist.variable)}
    >
      <body className="antialiased overflow-x-hidden">
        {/* MotionConfig propagates reducedMotion="user" to all child motion components */}
        <MotionConfig reducedMotion="user">
          <I18nProvider>
            {/* AuthProvider inside I18nProvider — NavShell uses both useTranslation and useAuth */}
            <AuthProvider>
              {/* NavShell inside AuthProvider — reads auth state for avatar/dropdown */}
              <NavShell />
              {/* pt-16 (64px) matches h-16 nav height; min-w-0 prevents flex overflow */}
              <main className="pt-16 min-w-0">
                {children}
              </main>
            </AuthProvider>
          </I18nProvider>
          {/* Toaster outside I18nProvider — avoids focus trap conflicts with Dialog */}
          <Toaster
            position="bottom-right"
            visibleToasts={3}
            richColors
            closeButton
            duration={4000}
          />
        </MotionConfig>
      </body>
    </html>
  );
}
