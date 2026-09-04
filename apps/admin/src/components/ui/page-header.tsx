// apps/admin/src/components/ui/page-header.tsx
"use client";

import { Button } from "./button";
import { cn } from "@/lib/cn";

/**
 * Standard screen header: Cormorant SC title + serif subtitle on the left,
 * a "Refresh" (or arbitrary) action on the right. Every /dashboard/* page
 * uses this so the panel reads as one system.
 */
export function PageHeader({
  title,
  subtitle,
  onRefresh,
  refreshing,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  onRefresh?: () => void;
  refreshing?: boolean;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-start justify-between gap-3", className)}>
      <div className="min-w-0">
        <h1 className="font-custom text-[26px] leading-tight tracking-[0.02em] text-ink">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 max-w-2xl text-[13px] leading-relaxed text-muted">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {children}
        {onRefresh && (
          <Button onClick={onRefresh} disabled={refreshing}>
            {refreshing ? "Refreshing…" : "Refresh"}
          </Button>
        )}
      </div>
    </div>
  );
}
