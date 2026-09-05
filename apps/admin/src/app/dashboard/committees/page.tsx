// apps/admin/src/app/dashboard/committees/page.tsx
"use client";

import { CommitteesBoard } from "@/components/committees/board";
import { Screen } from "@/components/ui/screen";
import { useSite } from "@/lib/crud-hooks";

export default function CommitteesPage() {
  const { data, isPending, error, isFetching, refetch } = useSite();

  return (
    <Screen
      title="Committees & Topics"
      subtitle="Committee and topic information plus chair report PDFs. Saving reflects immediately on the public site."
      onRefresh={() => refetch()}
      refreshing={isFetching}
      pending={isPending}
      error={error}
    >
      {data && <CommitteesBoard site={data} />}
    </Screen>
  );
}
