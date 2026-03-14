import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { MotionConfig } from "motion/react";
import { I18nProvider } from "@/components/I18nProvider";
import "./globals.css";

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
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased">
        {/* MotionConfig propagates reducedMotion="user" to all child motion components */}
        <MotionConfig reducedMotion="user">
          <I18nProvider>{children}</I18nProvider>
        </MotionConfig>
      </body>
    </html>
  );
}
