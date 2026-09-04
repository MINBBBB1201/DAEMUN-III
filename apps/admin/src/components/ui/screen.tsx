// apps/admin/src/components/ui/screen.tsx
"use client";

import { PageHeader } from "./page-header";
import { cn } from "@/lib/cn";

/**
 * The frame every /dashboard/* page shares: padded container, PageHeader,
 * and the loading / error / ready states. Pass the react-query bits straight
 * through.
 */
export function Screen({
  title,
  subtitle,
  onRefresh,
  refreshing,
  pending,
  error,
  narrow,
  headerExtra,
  children,
}: {
  title: string;
  subtitle?: string;
  onRefresh?: () => void;
  refreshing?: boolean;
  pending?: boolean;
  error?: { message: string } | null;
  /** constrain the body to a readable column (secretariat, faqs) */
  narrow?: boolean;
  headerExtra?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className="p-6 lg:p-8">
      <PageHeader
        title={title}
        subtitle={subtitle}
        onRefresh={onRefresh}
        refreshing={refreshing}
      >
        {headerExtra}
      </PageHeader>

      <div className={cn("mt-6", narrow && "max-w-3xl")}>
        {pending && <p className="text-sm text-muted">Loading…</p>}
        {error && (
          <p className="text-sm text-[#b23b3b]">Failed to load: {error.message}</p>
        )}
        {children}
      </div>
    </div>
  );
}
