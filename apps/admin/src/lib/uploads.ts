// apps/admin/src/lib/uploads.ts
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminFetch } from "./api";
import { STATS_KEY } from "./stats";

export type UploadsGcReport = { scanned: number; deleted: string[]; freedBytes: number };

/** Deletes uploaded files no record references anymore (replaced/removed
 *  images, reports, documents, photos). Refetches disk stats afterward. */
export function useCleanupUploads() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => adminFetch<UploadsGcReport>("/uploads/gc", { method: "POST" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: STATS_KEY }),
  });
}
