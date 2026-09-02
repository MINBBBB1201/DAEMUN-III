"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import { cn } from "@/lib/utils";

type Person = {
  name: string;
  role: string;
  photo?: string | null;
};

/**
 * PortraitExpand — hover-expanding horizontal portrait strip.
 * Adapted from skiper-ui Skiper52 / HoverExpand_001 (React + Framer Motion).
 * Hover expands a panel on pointer devices; tap expands on touch.
 * People without a photo are skipped entirely.
 */
export function PortraitExpand({
  people,
  className,
}: {
  people: Person[];
  className?: string;
}) {
  const shown = people.filter(
    (person): person is Person & { photo: string } => Boolean(person.photo),
  );
  const [active, setActive] = useState<number>(0);

  if (shown.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className={cn("w-full", className)}
    >
      <div className="flex h-72 w-full items-stretch gap-1 sm:h-80 md:h-96 md:gap-1.5">
        {shown.map((person, index) => {
          const isActive = active === index;
          return (
            <motion.div
              key={`${person.name}-${index}`}
              role="button"
              tabIndex={0}
              aria-label={`${person.name}, ${person.role}`}
              aria-expanded={isActive}
              className="relative min-w-0 cursor-pointer overflow-hidden rounded-sm border border-line bg-navy-soft outline-none focus-visible:ring-1 focus-visible:ring-gold"
              style={{ flexBasis: 0 }}
              animate={{ flexGrow: isActive ? 5 : 1 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              onClick={() => setActive(index)}
              onHoverStart={() => setActive(index)}
              onFocus={() => setActive(index)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setActive(index);
                }
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={person.photo}
                alt={`${person.name} — ${person.role}`}
                draggable={false}
                className="absolute inset-0 size-full select-none object-cover"
              />
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/25 to-transparent"
                  />
                )}
              </AnimatePresence>
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.25, delay: 0.1 }}
                    className="absolute inset-x-0 bottom-0 flex min-w-40 flex-col gap-0.5 p-3 md:p-4"
                  >
                    <p className="text-sm leading-snug text-white md:text-base">
                      {person.name}
                    </p>
                    <p className="text-xs leading-snug text-gold-soft md:text-sm">
                      {person.role}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
