// apps/admin/src/lib/conference.ts
"use client";

import { useMutation } from "@tanstack/react-query";
import type { Conference } from "@daemun/shared";
import { adminFetch } from "./api";
import { useInvalidateSite } from "./crud-hooks";

/**
 * 회의 정보는 싱글톤(`id: "main"`) — crudRoutes가 아니라 손으로 만든
 * `GET/PATCH /api/admin/conference`. 읽기는 useSite()의 `conference`,
 * 쓰기는 필드 단위 PATCH.
 */
export function useUpdateConference() {
  const invalidate = useInvalidateSite();
  return useMutation({
    mutationFn: (patch: Partial<Conference>) =>
      adminFetch<Conference>("/conference", { method: "PATCH", json: patch }),
    onSuccess: invalidate,
  });
}
