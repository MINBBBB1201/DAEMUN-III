"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import React, { useRef } from "react";

import { cn } from "@/lib/utils";

/**
 * Scroll-linked word reveal adapted from skiper-ui Skiper31
 * (ScrollAnimation_002, per-character scroll transforms by @gurvinder-singh02).
 * The demo hardcodes its text and Lenis scaffolding, so the pattern is
 * copied here and parameterized: each word's opacity (plus a subtle lift)
 * is driven by a staggered slice of the shared scrollYProgress.
 */

type WordProps = {
  word: string;
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
};

const Word = ({ word, index, total, scrollYProgress }: WordProps) => {
  const start = index / total;
  const end = (index + 1) / total;

  const opacity = useTransform(scrollYProgress, [start, end], [0.14, 1]);
  const y = useTransform(scrollYProgress, [start, end], [10, 0]);

  return (
    <motion.span className="inline-block will-change-transform" style={{ opacity, y }}>
      {word}
    </motion.span>
  );
};

export function TextScrollReveal({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const targetRef = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start 0.85", "end 0.5"],
  });

  const words = text.split(/\s+/).filter(Boolean);

  return (
    <div
      ref={targetRef}
      className={cn(
        "w-full overflow-hidden bg-navy px-6 py-20 text-2xl leading-snug text-white sm:px-10 md:py-28 md:text-3xl lg:text-4xl",
        className,
      )}
    >
      <p className="mx-auto max-w-4xl">
        {words.map((word, index) => (
          <React.Fragment key={`${word}-${index}`}>
            <Word
              word={word}
              index={index}
              total={words.length}
              scrollYProgress={scrollYProgress}
            />{" "}
          </React.Fragment>
        ))}
      </p>
    </div>
  );
}
