import type { Metadata } from "next";
import { Cormorant_SC } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/lib/query-provider";

export const metadata: Metadata = {
  title: {
    default: "DAEMUN III Admin",
    template: "%s — DAEMUN III Admin",
  },
  description: "DAEMUN III conference admin panel",
};

/** Display face for headings (.font-custom) — same as the public site. */
const cormorantSC = Cormorant_SC({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-cormorant-sc",
  display: "swap",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorantSC.variable} h-full antialiased`}>
      <body className="min-h-full">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
