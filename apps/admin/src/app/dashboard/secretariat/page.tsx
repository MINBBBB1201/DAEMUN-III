// apps/admin/src/app/dashboard/secretariat/page.tsx
"use client";

import { SecretariatBoard } from "@/components/secretariat/board";
import { Screen } from "@/components/ui/screen";
import { useSite } from "@/lib/crud-hooks";

export default function SecretariatPage() {
  const { data, isPending, error, isFetching, refetch } = useSite();

  return (
    <Screen
      title="Secretariat"
      subtitle="Departments and people, photos, greetings, committee chairs, and order. Saving reflects immediately on the public site."
      onRefresh={() => refetch()}
      refreshing={isFetching}
      pending={isPending}
      error={error}
      narrow
    >
      {data && <SecretariatBoard site={data} />}
    </Screen>
  );
}
