import { Cormorant_SC } from "next/font/google";
import { cn } from "@/lib/utils";

const cormorantSC = Cormorant_SC({ weight: "600", subsets: ["latin"] });

/** Shared page-section header, in the homepage's editorial language. */
export function SectionHead({
  kicker,
  title,
  aside,
  className,
}: {
  kicker: string;
  title: React.ReactNode;
  aside?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 border-b border-black/15 pb-6 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div>
        <div className="font-roman text-[11px] uppercase tracking-widest text-black/50">
          {kicker}
        </div>
        <h2 className="font-custom mt-4 text-[30px] uppercase sm:text-[38px]" style={{ lineHeight: 1.05 }}>
          {title}
        </h2>
      </div>
      {aside ? (
        <div className="font-roman text-[12px] uppercase tracking-widest text-black/45">
          {aside}
        </div>
      ) : null}
    </div>
  );
}

/**
 * Subpage hero, matching the homepage title band:
 * roman kicker, Cormorant SC title between full-width rules, centered lead.
 */
export function PageHero({
  kicker,
  title,
  lead,
}: {
  kicker: string;
  title: string;
  lead?: string;
}) {
  return (
    <div className="flex w-full flex-col items-center bg-white pt-14 text-black sm:pt-16">
      <p className="font-roman mb-8 px-5 text-center text-xs uppercase tracking-widest text-black/60 sm:text-sm">
        {kicker}
      </p>
      <h1
        className={`${cormorantSC.className} w-full border-b border-t py-3 text-center text-4xl uppercase sm:text-6xl lg:text-8xl`}
        style={{ lineHeight: 1.25 }}
      >
        {title}
      </h1>
      {lead ? (
        <p className="mx-auto mt-8 max-w-2xl px-5 text-center text-[15px] leading-relaxed text-black/60 sm:text-[16px]">
          {lead}
        </p>
      ) : null}
      <div className="mb-2 mt-8 flex size-8 items-center justify-center rounded-full bg-black p-2 text-white">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 100 100" width="100%">
          <path
            fill="currentColor"
            d="M69.022 85.363c16.693-13.32 20.658-33.261 20.16-43.736H77.95c0 17.454-11.106 29.106-20.543 35.517-4.676 3.177-10.818 2.998-15.414-.293-17.124-12.264-19.958-27.753-18.988-35.224H10.305c0 20.438 9.697 34.444 20.244 43.16 11.033 9.118 27.285 9.503 38.473.576Z"
          ></path>
          <path
            fill="currentColor"
            fillRule="evenodd"
            d="M56.016 5v79.243H43.56V5h12.455Z"
            clipRule="evenodd"
          ></path>
        </svg>
      </div>
    </div>
  );
}

/** "TBA" values render as a quiet placeholder instead of literal text. */
export function TBA({ value, children }: { value: string; children?: React.ReactNode }) {
  if (value !== "TBA") return <>{children ?? value}</>;
  return (
    <span className="text-faint" title="To be announced">
      To be announced
    </span>
  );
}
