// apps/admin/src/app/dashboard/faqs/page.tsx
"use client";

import { FaqBoard } from "@/components/faqs/board";
import { Screen } from "@/components/ui/screen";
import { useFaqs } from "@/lib/faqs";

export default function FaqsPage() {
  const { data, isPending, error, isFetching, refetch } = useFaqs();

  return (
    <Screen
      title="FAQ"
      subtitle="Questions and answers the guide chatbot uses as source material. Only items marked public are used by the chatbot. They are not shown on the public site."
      onRefresh={() => refetch()}
      refreshing={isFetching}
      pending={isPending}
      error={error}
      narrow
    >
      {data && <FaqBoard faqs={data} />}
    </Screen>
  );
}
