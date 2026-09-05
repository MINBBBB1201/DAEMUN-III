"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { cn } from "@/lib/cn";
import { formatBytes, formatUptime, useStats } from "@/lib/stats";

export default function DashboardPage() {
  const { data, isPending, error, dataUpdatedAt } = useStats();

  return (
    <div className="p-6 lg:p-8">
      <PageHeader title="Overview">
        {data && (
          <p className="text-xs text-faint">
            Auto-refreshes every 10 s · updated{" "}
            {new Date(dataUpdatedAt).toLocaleTimeString("en-GB")}
          </p>
        )}
      </PageHeader>

      {isPending && <p className="mt-6 text-sm text-muted">Loading…</p>}
      {error && (
        <p className="mt-6 text-sm text-[#b23b3b]">
          Could not load stats: {error.message}
        </p>
      )}

      {data && (
        <div className="mt-6 space-y-8">
          {/* Live */}
          <section>
            <SectionTitle>Live</SectionTitle>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Stat
                label="Online now"
                value={data.online}
                hint="visitors active on the public site in the last 2 minutes"
                accent
              />
              <Stat
                label="Total participants"
                value={data.accounts.participants}
                hint={`delegate accounts · ${data.accounts.admins} admin${data.accounts.admins === 1 ? "" : "s"}`}
              />
            </div>
          </section>

          {/* Resolutions */}
          <section>
            <SectionTitle>
              Resolutions
              <Link
                href="/dashboard/resolutions"
                className="ml-2 text-xs font-normal text-brand underline-offset-2 hover:underline"
              >
                open board
              </Link>
            </SectionTitle>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Stat label="Waiting for review" value={data.resolutions.awaiting} tone="faint" />
              <Stat label="Under review" value={data.resolutions.review} tone="gold" />
              <Stat label="Approved" value={data.resolutions.approved} tone="brand" />
              <Stat label="Published" value={data.resolutions.published} tone="navy" />
            </div>
            <p className="mt-2 text-xs text-faint">
              {data.resolutions.total} resolution{data.resolutions.total === 1 ? "" : "s"} in total.
              Approved resolutions stay hidden from delegates until they are published.
            </p>
          </section>

          {/* Server */}
          <section>
            <SectionTitle>Server</SectionTitle>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Gauge
                label="CPU"
                pct={data.system.cpu.usagePct}
                detail={`load ${data.system.cpu.load1.toFixed(2)} · ${data.system.cpu.cores} core${data.system.cpu.cores === 1 ? "" : "s"}`}
              />
              <Usage label="RAM" used={data.system.memory.usedBytes} total={data.system.memory.totalBytes} />
              <Usage label="Swap" used={data.system.swap.usedBytes} total={data.system.swap.totalBytes} />
              <Usage label="Disk" used={data.system.disk.usedBytes} total={data.system.disk.totalBytes} />
            </div>
            <p className="mt-2 text-xs text-faint">
              Host uptime {formatUptime(data.system.uptimeSec)}.
            </p>
          </section>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-custom mb-2.5 flex items-baseline text-[17px] tracking-[0.02em] text-ink">
      {children}
    </h2>
  );
}

const TONES = {
  faint: "text-faint",
  gold: "text-gold",
  brand: "text-brand",
  navy: "text-navy",
} as const;

function Stat({
  label,
  value,
  hint,
  tone = "navy",
  accent,
}: {
  label: string;
  value: number;
  hint?: string;
  tone?: keyof typeof TONES;
  accent?: boolean;
}) {
  return (
    <Card className={cn("p-4", accent && "border-gold")}>
      <p className="text-xs text-muted">{label}</p>
      <p className={cn("font-custom mt-1 text-[34px] leading-none tabular-nums", TONES[tone])}>
        {value}
      </p>
      {hint && <p className="mt-1.5 text-[11px] text-faint">{hint}</p>}
    </Card>
  );
}

function barColor(pct: number) {
  if (pct >= 90) return "bg-[#b23b3b]";
  if (pct >= 75) return "bg-gold";
  return "bg-navy";
}

function Bar({ pct }: { pct: number }) {
  const clamped = Math.max(0, Math.min(100, pct));
  return (
    <div className="mt-2 h-1.5 w-full overflow-hidden rounded bg-line">
      <div className={cn("h-full rounded", barColor(clamped))} style={{ width: `${clamped}%` }} />
    </div>
  );
}

function Gauge({ label, pct, detail }: { label: string; pct: number; detail: string }) {
  return (
    <Card className="p-4">
      <div className="flex items-baseline justify-between">
        <p className="text-xs text-muted">{label}</p>
        <p className="text-sm font-medium tabular-nums text-ink">{pct.toFixed(0)}%</p>
      </div>
      <Bar pct={pct} />
      <p className="mt-1 text-[11px] text-faint">{detail}</p>
    </Card>
  );
}

function Usage({ label, used, total }: { label: string; used: number; total: number }) {
  const pct = total > 0 ? (used / total) * 100 : 0;
  return (
    <Card className="p-4">
      <div className="flex items-baseline justify-between">
        <p className="text-xs text-muted">{label}</p>
        <p className="text-sm font-medium tabular-nums text-ink">
          {total > 0 ? `${pct.toFixed(0)}%` : "—"}
        </p>
      </div>
      <Bar pct={pct} />
      <p className="mt-1 text-[11px] text-faint">
        {total > 0 ? `${formatBytes(used)} of ${formatBytes(total)}` : "not available"}
      </p>
    </Card>
  );
}
