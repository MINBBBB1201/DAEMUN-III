"use client";

import { motion, useScroll, useTransform } from "framer-motion";

/**
 * Thin page scroll progress bar, fixed directly beneath the sticky 64px
 * navy header. Motion pattern adapted from skiper89: window scroll
 * progress clamped to [0, 1] and bound directly to a motion style value,
 * so the bar tracks scroll with no lag or easing artifacts.
 */
export function PageScrollProgress() {
  const { scrollYProgress } = useScroll();

  const scaleX = useTransform(scrollYProgress, (value) =>
    Math.min(Math.max(value, 0), 1),
  );

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-16 z-40 h-0.5 origin-left bg-brand"
      style={{ scaleX }}
    />
  );
}
