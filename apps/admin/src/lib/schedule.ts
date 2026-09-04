// apps/admin/src/lib/schedule.ts
"use client";

import type { z } from "zod";
import type {
  ScheduleDay,
  ScheduleItem,
  scheduleDayCreateSchema,
  scheduleDayUpdateSchema,
  scheduleItemCreateSchema,
  scheduleItemUpdateSchema,
} from "@daemun/shared";
import { makeResourceHooks } from "./crud-hooks";

/** API가 검증하는 zod 스키마에서 그대로 추론 — 스키마가 바뀌면 여기서 타입 에러. */
export type ScheduleDayCreate = z.input<typeof scheduleDayCreateSchema>;
export type ScheduleDayPatch = z.input<typeof scheduleDayUpdateSchema>;
export type ScheduleItemCreate = z.input<typeof scheduleItemCreateSchema>;
export type ScheduleItemPatch = z.input<typeof scheduleItemUpdateSchema>;

export const dayHooks = makeResourceHooks<
  ScheduleDay,
  ScheduleDayCreate,
  ScheduleDayPatch
>("/schedule/days");

export const itemHooks = makeResourceHooks<
  ScheduleItem,
  ScheduleItemCreate,
  ScheduleItemPatch
>("/schedule/items");
