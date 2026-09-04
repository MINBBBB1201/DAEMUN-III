// apps/admin/src/app/dashboard/schedule/page.tsx
"use client";

import { ScheduleBoard } from "@/components/schedule/board";
import { useSite } from "@/lib/crud-hooks";

export default function SchedulePage() {
  const { data, isPending, error, isFetching, refetch } = useSite();

  return (
    <div className="p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold">일정</h1>
          <p className="mt-0.5 text-xs text-neutral-500">
            날짜별 일정표. 저장하면 홈 화면 일정 섹션에 바로 반영됩니다. 날짜가
            하나도 없으면 섹션이 숨겨집니다.
          </p>
        </div>
        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm hover:bg-neutral-50 disabled:opacity-50"
        >
          {isFetching ? "새로고침 중…" : "새로고침"}
        </button>
      </div>

      <div className="mt-6">
        {isPending && <p className="text-sm text-neutral-500">불러오는 중...</p>}
        {error && (
          <p className="text-sm text-red-600">
            불러오지 못했습니다: {error.message}
          </p>
        )}
        {data && <ScheduleBoard site={data} />}
      </div>
    </div>
  );
}
