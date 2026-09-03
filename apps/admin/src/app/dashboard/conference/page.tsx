// apps/admin/src/app/dashboard/conference/page.tsx
"use client";

import { ConferenceForm } from "@/components/conference/form";
import { useSite } from "@/lib/crud-hooks";

export default function ConferencePage() {
  const { data, isPending, error, isFetching, refetch } = useSite();

  return (
    <div className="p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold">회의 정보</h1>
          <p className="mt-0.5 text-xs text-neutral-500">
            날짜·장소·연락처·소개·주제. 각 칸을 벗어나면(blur) 저장되고 공개
            사이트에 바로 반영됩니다.
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
        {data && <ConferenceForm conference={data.conference} />}
      </div>
    </div>
  );
}
