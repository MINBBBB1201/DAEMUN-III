// apps/admin/src/lib/documents.ts
"use client";

import { useMutation } from "@tanstack/react-query";
import type { z } from "zod";
import type {
  SiteDocument,
  documentCreateSchema,
  documentUpdateSchema,
} from "@daemun/shared";
import { adminFetch, uploadFile } from "./api";
import { makeResourceHooks, useInvalidateSite } from "./crud-hooks";

/** API가 검증하는 zod 스키마에서 그대로 추론 — 스키마가 바뀌면 여기서 타입 에러. */
export type DocumentCreate = z.input<typeof documentCreateSchema>;
export type DocumentPatch = z.input<typeof documentUpdateSchema>;

export const documentHooks = makeResourceHooks<
  SiteDocument,
  DocumentCreate,
  DocumentPatch
>("/documents");

/**
 * 파일을 먼저 업로드하고 그 결과로 문서 레코드를 만든다.
 * 업로드가 kind("PDF"·"DOC"…)와 size("1.2 MB")를 돌려주므로 그대로 채운다.
 */
export function useCreateDocumentFromFile() {
  const invalidate = useInvalidateSite();
  return useMutation({
    mutationFn: async (file: File) => {
      const { url, originalName, kind, size } = await uploadFile(file);
      return adminFetch<SiteDocument>("/documents", {
        method: "POST",
        json: {
          title: originalName.replace(/\.[^.]+$/, ""),
          file: url,
          kind,
          size,
        },
      });
    },
    onSuccess: invalidate,
  });
}

/** 기존 문서의 파일만 교체 (제목·설명은 유지). */
export function useReplaceDocumentFile() {
  const invalidate = useInvalidateSite();
  return useMutation({
    mutationFn: async ({ id, file }: { id: string; file: File }) => {
      const { url, kind, size } = await uploadFile(file);
      return adminFetch<SiteDocument>(`/documents/${id}`, {
        method: "PATCH",
        json: { file: url, kind, size },
      });
    },
    onSuccess: invalidate,
  });
}
