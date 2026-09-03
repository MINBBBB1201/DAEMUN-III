// 안내 챗봇 FAQ( /api/admin/faqs )용 react-query 훅.
// FAQ는 SiteData에 포함되지 않으므로 useSite()가 아니라 자체 캐시 키를 쓴다.
// 변경은 성공 시 FAQS_KEY만 무효화한다.
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { z } from "zod";
import type { Faq, faqCreateSchema, faqUpdateSchema } from "@daemun/shared";
import { adminFetch } from "./api";

/** API가 검증하는 zod 스키마에서 그대로 추론 — 스키마가 바뀌면 여기서 타입 에러가 난다. */
export type FaqCreate = z.input<typeof faqCreateSchema>;
export type FaqPatch = z.input<typeof faqUpdateSchema>;

export const FAQS_KEY = ["admin", "faqs"] as const;

/** sort_order asc, 그다음 생성순. crudRoutes 기본 정렬 그대로. */
export function useFaqs() {
  return useQuery({
    queryKey: FAQS_KEY,
    queryFn: () => adminFetch<Faq[]>("/faqs"),
  });
}

function useInvalidateFaqs() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: FAQS_KEY });
}

export function useCreateFaq() {
  const invalidate = useInvalidateFaqs();
  return useMutation({
    mutationFn: (input: FaqCreate) =>
      adminFetch<Faq>("/faqs", { method: "POST", json: input }),
    onSuccess: invalidate,
  });
}

export function useUpdateFaq() {
  const invalidate = useInvalidateFaqs();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: FaqPatch }) =>
      adminFetch<Faq>(`/faqs/${id}`, { method: "PATCH", json: patch }),
    onSuccess: invalidate,
  });
}

export function useRemoveFaq() {
  const invalidate = useInvalidateFaqs();
  return useMutation({
    mutationFn: (id: string) =>
      adminFetch<{ ok: true }>(`/faqs/${id}`, { method: "DELETE" }),
    onSuccess: invalidate,
  });
}

/** ids를 원하는 순서대로 보내면 sortOrder가 그 순서로 재작성된다. */
export function useReorderFaqs() {
  const invalidate = useInvalidateFaqs();
  return useMutation({
    mutationFn: (ids: string[]) =>
      adminFetch<{ ok: true }>("/faqs/reorder", { method: "PUT", json: { ids } }),
    onSuccess: invalidate,
  });
}
