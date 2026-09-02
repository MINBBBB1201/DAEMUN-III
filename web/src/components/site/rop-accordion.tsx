"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

const SPRING = { type: "spring", stiffness: 300, damping: 20 } as const;

export function RopAccordion({
  steps,
}: {
  steps: { title: string; body: string }[];
}) {
  const [active, setActive] = useState<number | null>(0);

  return (
    <ul className="w-full select-none">
      {steps.map((step, index) => {
        const isActive = active === index;
        const isFirst = index === 0;
        const isLast = index === steps.length - 1;
        const roundTop =
          isFirst || isActive || (active !== null && index === active + 1);
        const roundBottom =
          isLast || isActive || (active !== null && index === active - 1);

        return (
          <motion.li
            key={index}
            initial={false}
            animate={{
              marginTop: isFirst
                ? 0
                : isActive || active === index - 1
                  ? 10
                  : -1,
              marginBottom: isLast ? 0 : isActive ? 10 : 0,
              borderTopLeftRadius: roundTop ? "8px" : "0px",
              borderTopRightRadius: roundTop ? "8px" : "0px",
              borderBottomLeftRadius: roundBottom ? "8px" : "0px",
              borderBottomRightRadius: roundBottom ? "8px" : "0px",
            }}
            transition={SPRING}
            className="relative overflow-hidden border border-line bg-white"
          >
            <button
              type="button"
              aria-expanded={isActive}
              onClick={() => setActive(isActive ? null : index)}
              className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-wash"
            >
              <span className="text-xs tabular-nums text-gold">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0 flex-1 truncate text-sm text-ink">
                {step.title}
              </span>
              <ChevronDown
                className={cn(
                  "size-4 shrink-0 text-muted transition-transform duration-300 ease-in-out",
                  isActive && "rotate-180",
                )}
              />
            </button>

            <AnimatePresence initial={false}>
              {isActive && (
                <motion.div
                  initial={{ height: 0, opacity: 0, filter: "blur(2px)" }}
                  animate={{ height: "auto", opacity: 1, filter: "blur(0px)" }}
                  exit={{ height: 0, opacity: 0, filter: "blur(2px)" }}
                  transition={SPRING}
                  className="overflow-hidden"
                >
                  <p className="px-4 pb-4 pl-11 text-sm leading-relaxed text-body">
                    {step.body}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.li>
        );
      })}
    </ul>
  );
}
