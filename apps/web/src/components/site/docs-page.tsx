"use client";
/**
 * DAEMUN docs layout — adapted from skiper-ui skiper60.
 * Sticky section sidebar with the spring-animated active marker,
 * scroll-linked via useInView; content column right.
 * (Adaptation: content is not dimmed, typography follows the site.)
 */
import { motion, useInView } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

export type DocsSection = {
  id: string;
  title: string;
  content: React.ReactNode;
};

const Section = ({
  section,
  index,
  setActive,
  children,
}: {
  section: DocsSection;
  index: number;
  setActive: (i: number) => void;
  children: React.ReactNode;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    amount: 0.3,
    margin: "-100px 0px -50% 0px",
  });

  useEffect(() => {
    if (isInView) setActive(index);
  }, [isInView, index, setActive]);

  return (
    <div ref={ref} id={section.id} className="scroll-mt-24 space-y-4 md:space-y-6">
      {children}
    </div>
  );
};

export function DocsPage({
  sections,
  className,
}: {
  sections: DocsSection[];
  className?: string;
}) {
  const [active, setActive] = useState(0);

  return (
    <div className={cn("mx-auto max-w-6xl px-5 sm:px-8", className)}>
      <div className="relative flex gap-12 py-[40px] md:py-[70px]">
        {/* Sidebar (skiper60 pattern) */}
        <ul className="sticky top-24 hidden h-fit w-full max-w-[240px] space-y-4 border-l border-black/15 md:block">
          {sections.map((s, index) => (
            <li className="relative cursor-pointer pl-4" key={s.id}>
              <a href={`#${s.id}`}>
                {active === index && (
                  <motion.span
                    layoutId="active-docs-section"
                    className="absolute -left-[1.5px] top-1/2 inline-block h-5 w-[2px] -translate-y-1/2 rounded-2xl bg-black"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <p
                  className={cn(
                    "font-roman text-[12px] uppercase tracking-widest opacity-45 transition-opacity duration-200",
                    active === index && "opacity-100",
                  )}
                >
                  {s.title}
                </p>
              </a>
            </li>
          ))}
        </ul>

        {/* Content */}
        <div className="flex min-w-0 flex-1 flex-col gap-[56px] md:gap-[88px]">
          {sections.map((s, index) => (
            <Section key={s.id} section={s} index={index} setActive={setActive}>
              <h3
                className="font-custom text-[26px] uppercase sm:text-[32px]"
                style={{ lineHeight: 1.08 }}
              >
                {s.title}
              </h3>
              <div className="space-y-6">{s.content}</div>
            </Section>
          ))}
        </div>
      </div>
    </div>
  );
}
