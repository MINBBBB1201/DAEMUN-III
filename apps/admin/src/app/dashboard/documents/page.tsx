// apps/admin/src/app/dashboard/documents/page.tsx
"use client";

import { DocumentsBoard } from "@/components/documents/board";
import { Screen } from "@/components/ui/screen";
import { useSite } from "@/lib/crud-hooks";

export default function DocumentsPage() {
  const { data, isPending, error, isFetching, refetch } = useSite();

  return (
    <Screen
      title="Documents"
      subtitle="Public documents such as background guides and forms. Uploading a file fills in the format and size automatically."
      onRefresh={() => refetch()}
      refreshing={isFetching}
      pending={isPending}
      error={error}
    >
      {data && <DocumentsBoard site={data} />}
    </Screen>
  );
}
