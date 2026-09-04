// apps/admin/src/components/schedule/board.tsx
"use client";

import type { ScheduleDayWithItems, ScheduleItem, SiteData } from "@daemun/shared";
import { ApiError } from "@/lib/api";
import { cn } from "@/lib/cn";
import { dayHooks, itemHooks } from "@/lib/schedule";
import { InlineText } from "@/components/inline-edit";

function msg(err: unknown): string | null {
  if (!err) return null;
  return err instanceof ApiError ? err.message : "저장에 실패했습니다.";
}

export function ScheduleBoard({ site }: { site: SiteData }) {
  const create = dayHooks.useCreate();

  return (
    <div className="space-y-5">
      {site.schedule.length === 0 && (
        <p className="text-sm text-neutral-400">
          아직 등록된 날짜가 없습니다. 날짜를 추가하면 홈 화면에 일정 섹션이
          나타납니다.
        </p>
      )}

      {site.schedule.map((day, i) => (
        <DayCard key={day.id} day={day} siblings={site.schedule} index={i} />
      ))}

      <div>
        <button
          type="button"
          disabled={create.isPending}
          onClick={() =>
            create.mutate({ day: `Day ${site.schedule.length + 1}` })
          }
          className="rounded-md border border-dashed border-neutral-300 px-3 py-1.5 text-xs text-neutral-500 hover:border-neutral-400 hover:text-neutral-800 disabled:opacity-50"
        >
          + 날짜 추가
        </button>
        {create.error && (
          <p className="mt-1 text-xs text-red-600">{msg(create.error)}</p>
        )}
      </div>
    </div>
  );
}

function DayCard({
  day,
  siblings,
  index,
}: {
  day: ScheduleDayWithItems;
  siblings: ScheduleDayWithItems[];
  index: number;
}) {
  const update = dayHooks.useUpdate();
  const remove = dayHooks.useRemove();
  const reorder = dayHooks.useReorder();

  const busy = update.isPending || remove.isPending || reorder.isPending;
  const err = msg(remove.error) ?? msg(reorder.error);

  const move = (dir: -1 | 1) => {
    const next = [...siblings];
    const j = index + dir;
    [next[index], next[j]] = [next[j]!, next[index]!];
    reorder.mutate(next.map((d) => d.id));
  };

  const patch = (p: Parameters<typeof update.mutateAsync>[0]["patch"]) =>
    update.mutateAsync({ id: day.id, patch: p });

  return (
    <section className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
      <header className="flex items-start gap-3 border-b border-neutral-200 bg-neutral-50 p-4">
        <div className="min-w-0 flex-1 space-y-1.5">
          <Labeled label="요일 라벨">
            <InlineText
              ariaLabel="요일 라벨"
              value={day.day}
              placeholder="예: Day One"
              pending={update.isPending}
              className="font-semibold"
              onCommit={(v) => patch({ day: v })}
            />
          </Labeled>
          <Labeled label="날짜 (미정이면 비워두면 TBA)">
            <InlineText
              ariaLabel="날짜"
              value={day.date}
              placeholder="예: 2025년 10월 4일 (토)"
              pending={update.isPending}
              className="text-xs"
              onCommit={(v) => patch({ date: v || "TBA" })}
            />
          </Labeled>
        </div>

        <div className="flex shrink-0 items-center gap-0.5">
          <IconButton label="위로" disabled={index <= 0 || busy} onClick={() => move(-1)}>
            ↑
          </IconButton>
          <IconButton
            label="아래로"
            disabled={index >= siblings.length - 1 || busy}
            onClick={() => move(1)}
          >
            ↓
          </IconButton>
          <IconButton
            label="날짜 삭제"
            danger
            disabled={busy}
            onClick={() => {
              if (
                window.confirm(
                  `"${day.day}"을(를) 삭제하면 이 날짜의 일정 항목도 전부 삭제됩니다. 계속할까요?`,
                )
              )
                remove.mutate(day.id);
            }}
          >
            ✕
          </IconButton>
        </div>
      </header>

      {err && <p className="px-4 pt-2 text-xs text-red-600">{err}</p>}

      <Items day={day} />
    </section>
  );
}

function Items({ day }: { day: ScheduleDayWithItems }) {
  const create = itemHooks.useCreate();

  return (
    <div className="p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-medium text-neutral-500">일정 항목</span>
        <button
          type="button"
          disabled={create.isPending}
          onClick={() => create.mutate({ dayId: day.id, event: "새 일정" })}
          className="rounded-md border border-neutral-300 px-2.5 py-1 text-xs hover:bg-neutral-50 disabled:opacity-50"
        >
          + 항목 추가
        </button>
      </div>
      {create.error && (
        <p className="mb-2 text-xs text-red-600">{msg(create.error)}</p>
      )}
      {day.items.length === 0 ? (
        <p className="text-xs text-neutral-400">항목 없음</p>
      ) : (
        <ul className="space-y-2">
          {day.items.map((it, i) => (
            <ItemRow key={it.id} item={it} siblings={day.items} index={i} />
          ))}
        </ul>
      )}
    </div>
  );
}

function ItemRow({
  item,
  siblings,
  index,
}: {
  item: ScheduleItem;
  siblings: ScheduleItem[];
  index: number;
}) {
  const update = itemHooks.useUpdate();
  const remove = itemHooks.useRemove();
  const reorder = itemHooks.useReorder();

  const busy = update.isPending || remove.isPending || reorder.isPending;
  const err = msg(remove.error) ?? msg(reorder.error);

  const move = (dir: -1 | 1) => {
    const next = [...siblings];
    const j = index + dir;
    [next[index], next[j]] = [next[j]!, next[index]!];
    reorder.mutate(next.map((it) => it.id));
  };

  const patch = (p: Parameters<typeof update.mutateAsync>[0]["patch"]) =>
    update.mutateAsync({ id: item.id, patch: p });

  return (
    <li className="rounded-md border border-neutral-200 bg-neutral-50/60 p-2">
      <div className="flex items-start gap-2">
        <div className="w-28 shrink-0">
          <InlineText
            ariaLabel="시간"
            value={item.time}
            placeholder="예: 09:30 (없으면 TBA)"
            pending={update.isPending}
            className="text-xs"
            onCommit={(v) => patch({ time: v || "TBA" })}
          />
        </div>
        <div className="min-w-0 flex-1">
          <InlineText
            ariaLabel="일정 내용"
            value={item.event}
            placeholder="일정 내용 (필수)"
            pending={update.isPending}
            className="font-medium"
            onCommit={(v) => patch({ event: v })}
          />
        </div>
        <div className="flex shrink-0 items-center gap-0.5">
          <IconButton label="위로" disabled={index <= 0 || busy} onClick={() => move(-1)}>
            ↑
          </IconButton>
          <IconButton
            label="아래로"
            disabled={index >= siblings.length - 1 || busy}
            onClick={() => move(1)}
          >
            ↓
          </IconButton>
          <IconButton
            label="항목 삭제"
            danger
            disabled={busy}
            onClick={() => {
              if (window.confirm(`"${item.event}" 항목을 삭제할까요?`))
                remove.mutate(item.id);
            }}
          >
            ✕
          </IconButton>
        </div>
      </div>
      {err && <p className="mt-1 text-xs text-red-600">{err}</p>}
    </li>
  );
}

/* ------------------------------------------------------------------ */
/*  Shared bits                                                        */
/* ------------------------------------------------------------------ */

function Labeled({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="text-[11px] text-neutral-400">{label}</span>
      <div className="mt-0.5">{children}</div>
    </label>
  );
}

function IconButton({
  children,
  label,
  onClick,
  disabled,
  danger,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "rounded p-1 text-xs text-neutral-400 disabled:opacity-30",
        danger
          ? "hover:bg-red-50 hover:text-red-600"
          : "hover:bg-neutral-100 hover:text-neutral-800",
      )}
    >
      {children}
    </button>
  );
}
