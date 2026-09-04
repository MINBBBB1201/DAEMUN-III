// apps/admin/src/app/dashboard/documents/page.tsx
"use client";

import { DocumentsBoard } from "@/components/documents/board";
import { useSite } from "@/lib/crud-hooks";

export default function DocumentsPage() {
  const { data, isPending, error, isFetching, refetch } = useSite();

  return (
    <div className="p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold">문서</h1>
          <p className="mt-0.5 text-xs text-neutral-500">
            배경 가이드·양식 등 공개 문서. 파일을 올리면 형식·용량이 자동으로
            채워집니다.
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
        {data && <DocumentsBoard site={data} />}
      </div>
    </div>
  );
}
