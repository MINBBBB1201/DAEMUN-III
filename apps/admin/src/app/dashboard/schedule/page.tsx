// apps/admin/src/app/dashboard/schedule/page.tsx
"use client";

import { ScheduleBoard } from "@/components/schedule/board";
import { Screen } from "@/components/ui/screen";
import { useSite } from "@/lib/crud-hooks";

export default function SchedulePage() {
  const { data, isPending, error, isFetching, refetch } = useSite();

  return (
    <Screen
      title="Schedule"
      subtitle="The day-by-day schedule. Saving reflects immediately in the homepage schedule section, which is hidden when there are no dates."
      onRefresh={() => refetch()}
      refreshing={isFetching}
      pending={isPending}
      error={error}
    >
      {data && <ScheduleBoard site={data} />}
    </Screen>
  );
}
