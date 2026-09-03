// apps/admin/src/app/dashboard/faqs/page.tsx
"use client";

import { FaqBoard } from "@/components/faqs/board";
import { useFaqs } from "@/lib/faqs";

export default function FaqsPage() {
  const { data, isPending, error, isFetching, refetch } = useFaqs();

  return (
    <div className="p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold">FAQ</h1>
          <p className="mt-0.5 text-xs text-neutral-500">
            안내 챗봇이 답변 근거로 쓰는 질문·답변. 공개로 표시된 항목만 챗봇이
            사용합니다. 공개 사이트에는 노출되지 않습니다.
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

      <div className="mt-6 max-w-3xl">
        {isPending && <p className="text-sm text-neutral-500">불러오는 중...</p>}
        {error && (
          <p className="text-sm text-red-600">
            불러오지 못했습니다: {error.message}
          </p>
        )}
        {data && <FaqBoard faqs={data} />}
      </div>
    </div>
  );
}
