// apps/admin/src/app/dashboard/accounts/page.tsx
"use client";

import { AccountsBoard } from "@/components/accounts/board";
import { useUsers } from "@/lib/accounts";

export default function AccountsPage() {
  const { data, isPending, error, isFetching, refetch } = useUsers();

  return (
    <div className="p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold">계정</h1>
          <p className="mt-0.5 text-xs text-neutral-500">
            관리자 발급, 역할 변경, 차단. 참가자 계정은 공개 사이트에서 셀프
            가입합니다.
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
        {data && <AccountsBoard users={data} />}
      </div>
    </div>
  );
}
