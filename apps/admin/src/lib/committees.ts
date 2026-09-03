// apps/admin/src/lib/committees.ts
"use client";

import { useMutation } from "@tanstack/react-query";
import type { z } from "zod";
import type {
  Committee,
  Topic,
  committeeCreateSchema,
  committeeUpdateSchema,
  topicCreateSchema,
  topicUpdateSchema,
} from "@daemun/shared";
import { adminFetch, uploadFile } from "./api";
import { makeResourceHooks, useInvalidateSite } from "./crud-hooks";

/** API가 검증하는 zod 스키마에서 그대로 추론 — 스키마가 바뀌면 여기서 타입 에러. */
export type CommitteeCreate = z.input<typeof committeeCreateSchema>;
export type CommitteePatch = z.input<typeof committeeUpdateSchema>;
export type TopicCreate = z.input<typeof topicCreateSchema>;
export type TopicPatch = z.input<typeof topicUpdateSchema>;

export const committeeHooks = makeResourceHooks<
  Committee,
  CommitteeCreate,
  CommitteePatch
>("/committees");
export const topicHooks = makeResourceHooks<Topic, TopicCreate, TopicPatch>(
  "/topics",
);

/** 파일 업로드 후 대상 리소스의 파일 필드를 PATCH. */
function useUploadInto<T>(
  resource: `/${string}`,
  field: "image" | "report",
) {
  const invalidate = useInvalidateSite();
  return useMutation({
    mutationFn: async ({ id, file }: { id: string; file: File }) => {
      const { url } = await uploadFile(file);
      return adminFetch<T>(`${resource}/${id}`, {
        method: "PATCH",
        json: { [field]: url },
      });
    },
    onSuccess: invalidate,
  });
}

export const useUploadCommitteeImage = () =>
  useUploadInto<Committee>("/committees", "image");
export const useUploadTopicReport = () =>
  useUploadInto<Topic>("/topics", "report");
