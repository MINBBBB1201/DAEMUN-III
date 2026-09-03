// apps/admin/src/components/conference/form.tsx
"use client";

import type { Conference } from "@daemun/shared";
import { ApiError } from "@/lib/api";
import { useUpdateConference } from "@/lib/conference";
import { InlineText, InlineTextarea } from "@/components/inline-edit";

type Field = keyof Conference;

const GROUPS: {
  title: string;
  hint?: string;
  fields: { key: Field; label: string; help?: string; multiline?: boolean }[];
}[] = [
  {
    title: "기본",
    fields: [
      { key: "name", label: "대회 이름", help: "예: DAEMUN III" },
      { key: "org", label: "주최", help: "예: Daewon Model United Nations" },
      { key: "session", label: "회차", help: "예: Third Session" },
      { key: "dates", label: "일자", help: "미정이면 TBA" },
      { key: "venue", label: "장소", help: "미정이면 TBA" },
      { key: "firstHeld", label: "1회 개최", help: "예: November 2024" },
    ],
  },
  {
    title: "연락처 · 푸터",
    fields: [
      { key: "email", label: "이메일", help: "미정이면 TBA" },
      { key: "instagram", label: "인스타 핸들", help: "@ 없이. 미정이면 TBA" },
      { key: "instagramUrl", label: "인스타 URL", help: "미설정이면 #" },
      { key: "address", label: "주소", help: "미정이면 TBA" },
    ],
  },
  {
    title: "소개 (About)",
    hint: "About/메인에 노출. 빈 줄로 문단 구분.",
    fields: [
      { key: "aboutLead", label: "소개 리드", multiline: true },
      { key: "aboutBody", label: "소개 본문", multiline: true },
    ],
  },
  {
    title: "주제 (Theme)",
    hint: "메인 주제 배너에 노출. 빈 줄로 문단 구분.",
    fields: [
      { key: "theme", label: "주제 문구", help: "예: From Vulnerability to Voice" },
      { key: "themeLead", label: "주제 리드", multiline: true },
      { key: "themeBody", label: "주제 본문", multiline: true },
    ],
  },
];

export function ConferenceForm({ conference }: { conference: Conference }) {
  const update = useUpdateConference();

  return (
    <div className="max-w-2xl space-y-8">
      {GROUPS.map((group) => (
        <section key={group.title}>
          <div className="mb-2 flex items-baseline gap-2">
            <h2 className="text-sm font-semibold">{group.title}</h2>
            {group.hint && (
              <span className="text-xs text-neutral-400">{group.hint}</span>
            )}
          </div>
          <div className="space-y-3 rounded-lg border border-neutral-200 bg-white p-4">
            {group.fields.map(({ key, label, help, multiline }) => (
              <label key={key} className="block">
                <span className="text-xs font-medium text-neutral-600">
                  {label}
                  {help && (
                    <span className="ml-1.5 font-normal text-neutral-400">
                      {help}
                    </span>
                  )}
                </span>
                <div className="mt-1">
                  {multiline ? (
                    <InlineTextarea
                      ariaLabel={label}
                      value={conference[key] ?? ""}
                      pending={update.isPending}
                      rows={key === "aboutBody" || key === "themeBody" ? 5 : 3}
                      onCommit={(v) => update.mutateAsync({ [key]: v })}
                    />
                  ) : (
                    <InlineText
                      ariaLabel={label}
                      value={conference[key] ?? ""}
                      placeholder={help}
                      pending={update.isPending}
                      className="border-neutral-300"
                      onCommit={(v) => update.mutateAsync({ [key]: v })}
                    />
                  )}
                </div>
              </label>
            ))}
          </div>
        </section>
      ))}

      {update.error && (
        <p className="text-sm text-red-600">
          저장 실패:{" "}
          {update.error instanceof ApiError
            ? update.error.message
            : "다시 시도하세요."}
        </p>
      )}
    </div>
  );
}
