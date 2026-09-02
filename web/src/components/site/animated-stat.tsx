"use client";

import { motion, useSpring } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

/**
 * AnimatedStat — count-up figure adapted from skiper37 (AnimatedNumber_002
 * spring pattern + AnimatedNumber_003 number formatting), restyled to the
 * DAEMUN tokens. Numeric values spring from 0 to the target when scrolled
 * into view (once); non-numeric strings such as "III" render static in the
 * same style.
 */

type ParsedValue =
  | { kind: "static"; text: string }
  | {
      kind: "numeric";
      target: number;
      prefix: string;
      suffix: string;
      decimals: number;
    };

function parseValue(value: string | number): ParsedValue {
  if (typeof value === "number") {
    if (!Number.isFinite(value)) return { kind: "static", text: String(value) };
    const text = String(value);
    const decimals = text.includes(".") ? text.split(".")[1].length : 0;
    return { kind: "numeric", target: value, prefix: "", suffix: "", decimals };
  }

  const text = value.trim();
  // Allows a non-digit prefix/suffix around one number, e.g. "300+" or "$1,200".
  const match = /^([^0-9]*?)(\d[\d,]*(?:\.\d+)?)([^0-9]*)$/.exec(text);
  if (!match) return { kind: "static", text };

  const target = Number(match[2].replace(/,/g, ""));
  if (!Number.isFinite(target)) return { kind: "static", text };

  const decimals = match[2].includes(".") ? match[2].split(".")[1].length : 0;
  return { kind: "numeric", target, prefix: match[1], suffix: match[3], decimals };
}

const FIGURE_CLASS =
  "text-4xl leading-none tracking-normal text-brand sm:text-5xl";

export function AnimatedStat({
  value,
  label,
}: {
  value: string | number;
  label: string;
}) {
  const parsed = useMemo(() => parseValue(value), [value]);
  const target = parsed.kind === "numeric" ? parsed.target : 0;
  const decimals = parsed.kind === "numeric" ? parsed.decimals : 0;

  const [display, setDisplay] = useState(0);
  const hasAnimated = useRef(false);
  const spring = useSpring(0, { bounce: 0, duration: 1200 });

  useEffect(() => {
    const factor = 10 ** decimals;
    return spring.on("change", (latest) => {
      setDisplay(Math.round(latest * factor) / factor);
    });
  }, [spring, decimals]);

  const formatter = useMemo(
    () =>
      new Intl.NumberFormat("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }),
    [decimals],
  );

  const startCount = () => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;
    spring.set(target);
  };

  return (
    <div className="min-w-0">
      {parsed.kind === "numeric" ? (
        <motion.p
          onViewportEnter={startCount}
          viewport={{ once: true, amount: 0.5 }}
          className={FIGURE_CLASS}
        >
          {parsed.prefix}
          {formatter.format(display)}
          {parsed.suffix}
        </motion.p>
      ) : (
        <p className={FIGURE_CLASS}>{parsed.text}</p>
      )}
      <p className="mt-2 text-[13px] text-muted">{label}</p>
    </div>
  );
}
