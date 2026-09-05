// apps/admin/src/app/dashboard/conference/page.tsx
"use client";

import { ConferenceForm } from "@/components/conference/form";
import { Screen } from "@/components/ui/screen";
import { useSite } from "@/lib/crud-hooks";

export default function ConferencePage() {
  const { data, isPending, error, isFetching, refetch } = useSite();

  return (
    <Screen
      title="Conference"
      subtitle="Dates, venue, contact, overview, and topics. Each field saves on blur and reflects immediately on the public site."
      onRefresh={() => refetch()}
      refreshing={isFetching}
      pending={isPending}
      error={error}
    >
      {data && <ConferenceForm conference={data.conference} />}
    </Screen>
  );
}
