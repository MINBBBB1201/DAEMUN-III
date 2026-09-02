import type { Metadata } from "next";
import "./globals.css";
import { AppleNav } from "@/components/site/apple-nav";
import { SiteFooter } from "@/components/site/footer";
import { conference } from "@/lib/conference";

export const metadata: Metadata = {
  title: {
    default: `${conference.name} — ${conference.theme}`,
    template: `%s — ${conference.name}`,
  },
  description: `${conference.org}. ${conference.theme}. A student-led Model United Nations conference.`,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <AppleNav />
        <main className="flex-1 pt-12">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
