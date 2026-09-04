// apps/admin/src/components/resolutions/controls.tsx
"use client";

import type { ResolutionStatus } from "@daemun/shared";
import { cn } from "@/lib/cn";

export const STATUS_META: Record<
  ResolutionStatus,
  { label: string; active: string; idle: string }
> = {
  awaiting: {
    label: "Waiting for review",
    active: "bg-line text-ink",
    idle: "text-muted hover:bg-wash",
  },
  review: {
    label: "Under review",
    active: "bg-gold text-white",
    idle: "text-muted hover:bg-wash",
  },
  approved: {
    label: "Approved",
    active: "bg-brand text-white",
    idle: "text-muted hover:bg-wash",
  },
  published: {
    label: "Published",
    active: "bg-navy text-white",
    idle: "text-muted hover:bg-wash",
  },
};

const ORDER: ResolutionStatus[] = ["awaiting", "review", "approved", "published"];

export function StatusControl({
  value,
  onChange,
  disabled,
}: {
  value: ResolutionStatus;
  onChange: (next: ResolutionStatus) => void;
  disabled?: boolean;
}) {
  return (
    <div
      role="group"
      aria-label="Status"
      className="inline-flex overflow-hidden rounded-lg border border-line text-xs"
    >
      {ORDER.map((status, i) => {
        const meta = STATUS_META[status];
        const active = value === status;
        return (
          <button
            key={status}
            type="button"
            disabled={disabled}
            aria-pressed={active}
            onClick={() => !active && onChange(status)}
            className={cn(
              "px-2.5 py-1 font-medium transition-colors disabled:opacity-50",
              i > 0 && "border-l border-line",
              active ? meta.active : meta.idle,
            )}
          >
            {meta.label}
          </button>
        );
      })}
    </div>
  );
}
