// apps/admin/src/app/dashboard/accounts/page.tsx
"use client";

import { AccountsBoard } from "@/components/accounts/board";
import { Screen } from "@/components/ui/screen";
import { useUsers } from "@/lib/accounts";

export default function AccountsPage() {
  const { data, isPending, error, isFetching, refetch } = useUsers();

  return (
    <Screen
      title="Accounts"
      subtitle="Issue admin accounts, change roles, and ban users. Delegate accounts self-register on the public site."
      onRefresh={() => refetch()}
      refreshing={isFetching}
      pending={isPending}
      error={error}
    >
      {data && <AccountsBoard users={data} />}
    </Screen>
  );
}
