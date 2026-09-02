"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { TextRoll } from "@/components/ui/skiper-ui/skiper58";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/secretariat", label: "Secretariat" },
  { href: "/committees", label: "Committees" },
  { href: "/resolutions", label: "Resolutions" },
  { href: "/guide", label: "Guide to MUN" },
];

export function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-navy">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <Image
            src="/emblem-white.png"
            alt="DAEMUN emblem"
            width={36}
            height={27}
            priority
          />
          <span className="flex flex-col leading-none">
            <span className="text-[15px] font-semibold tracking-[0.14em] text-white">
              DAEMUN III
            </span>
            <span className="mt-1 hidden text-[9px] uppercase tracking-[0.2em] text-white/50 sm:block">
              Daewon Model United Nations
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "py-2 text-[14px] transition-colors",
                pathname === l.href
                  ? "text-white"
                  : "text-white/60 hover:text-white",
              )}
            >
              <TextRoll>{l.label.replaceAll(" ", " ")}</TextRoll>
            </Link>
          ))}
          <Link
            href="/#contact"
            className="rounded-sm bg-white px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.08em] text-navy transition-opacity hover:opacity-85"
          >
            Contact
          </Link>
        </nav>

        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="flex h-11 w-11 flex-col items-end justify-center gap-1.5 md:hidden"
        >
          <span
            className={cn(
              "h-px w-6 bg-white transition-transform",
              open && "translate-y-[3.5px] rotate-45",
            )}
          />
          <span
            className={cn(
              "h-px bg-white transition-all",
              open ? "w-6 -translate-y-[3px] -rotate-45" : "w-4",
            )}
          />
        </button>
      </div>

      {open && (
        <nav className="border-t border-white/10 bg-navy px-5 pb-5 pt-2 md:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={cn(
                "block py-3 text-[15px]",
                pathname === l.href ? "text-white" : "text-white/60",
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
