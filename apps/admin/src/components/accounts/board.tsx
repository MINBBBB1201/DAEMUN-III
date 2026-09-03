// apps/admin/src/components/accounts/board.tsx
"use client";

import { useState } from "react";
import {
  GRADE_OPTIONS,
  MUN_EXPERIENCE_OPTIONS,
} from "@daemun/shared";
import { useSession } from "@/lib/auth-client";
import {
  useBanUser,
  useCreateAdmin,
  useSetRole,
  useUnbanUser,
  type AdminUser,
} from "@/lib/accounts";
import { cn } from "@/lib/cn";

const GRADE_LABEL = Object.fromEntries(
  GRADE_OPTIONS.map((o) => [o.value, o.label]),
);
const MUN_LABEL = Object.fromEntries(
  MUN_EXPERIENCE_OPTIONS.map((o) => [o.value, o.label]),
);

function fmtDate(d: string | Date) {
  return new Date(d).toLocaleDateString("ko-KR");
}

export function AccountsBoard({ users }: { users: AdminUser[] }) {
  const admins = users.filter((u) => u.role === "admin");
  const delegates = users.filter((u) => u.role !== "admin");

  return (
    <div className="space-y-8">
      <section>
        <div className="mb-2 flex items-baseline gap-2">
          <h2 className="text-sm font-semibold">관리자</h2>
          <span className="text-xs text-neutral-400">
            패널 접근 가능 ({admins.length})
          </span>
        </div>
        <div className="space-y-2">
          {admins.map((u) => (
            <UserRow key={u.id} user={u} />
          ))}
          <AddAdmin />
        </div>
      </section>

      <section>
        <div className="mb-2 flex items-baseline gap-2">
          <h2 className="text-sm font-semibold">참가자</h2>
          <span className="text-xs text-neutral-400">
            셀프 가입 delegate ({delegates.length})
          </span>
        </div>
        {delegates.length === 0 ? (
          <p className="text-sm text-neutral-400">아직 없음</p>
        ) : (
          <div className="space-y-2">
            {delegates.map((u) => (
              <UserRow key={u.id} user={u} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function UserRow({ user }: { user: AdminUser }) {
  const { data: session } = useSession();
  const isSelf = session?.user?.id === user.id;

  const setRole = useSetRole();
  const ban = useBanUser();
  const unban = useUnbanUser();

  const busy = setRole.isPending || ban.isPending || unban.isPending;
  const err =
    (setRole.error as Error | null)?.message ??
    (ban.error as Error | null)?.message ??
    (unban.error as Error | null)?.message ??
    null;

  const isAdmin = user.role === "admin";

  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-3">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate text-sm font-medium">
              {user.name || "(이름 없음)"}
            </span>
            {!user.emailVerified && (
              <Badge tone="amber">이메일 미인증</Badge>
            )}
            {user.banned && <Badge tone="red">차단됨</Badge>}
            {isSelf && <Badge tone="neutral">나</Badge>}
          </div>
          <div className="truncate text-xs text-neutral-500">{user.email}</div>
        </div>

        <span className="text-xs text-neutral-400">
          가입 {fmtDate(user.createdAt)}
        </span>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled={busy || isSelf}
            title={isSelf ? "자기 역할은 바꿀 수 없습니다" : undefined}
            onClick={() => {
              const next = isAdmin ? "delegate" : "admin";
              if (
                window.confirm(
                  `${user.email} 역할을 "${next}"로 바꿀까요?` +
                    (next === "admin" ? " (패널 전체 접근 권한이 생깁니다)" : ""),
                )
              )
                setRole.mutate({ userId: user.id, role: next });
            }}
            className="rounded border border-neutral-300 px-2 py-1 text-xs hover:bg-neutral-50 disabled:opacity-40"
          >
            {isAdmin ? "→ 참가자로" : "→ 관리자로"}
          </button>

          {user.banned ? (
            <button
              type="button"
              disabled={busy}
              onClick={() => unban.mutate({ userId: user.id })}
              className="rounded border border-neutral-300 px-2 py-1 text-xs hover:bg-neutral-50 disabled:opacity-40"
            >
              차단 해제
            </button>
          ) : (
            <button
              type="button"
              disabled={busy || isSelf}
              title={isSelf ? "자기 계정은 차단할 수 없습니다" : undefined}
              onClick={() => {
                if (window.confirm(`${user.email}을(를) 차단할까요? (로그인 차단)`))
                  ban.mutate({ userId: user.id });
              }}
              className="rounded border border-neutral-300 px-2 py-1 text-xs text-red-600 hover:bg-red-50 disabled:opacity-40"
            >
              차단
            </button>
          )}
        </div>
      </div>

      {(user.grade || user.committee || user.munExperience) && (
        <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-neutral-500">
          {user.grade && <span>학년: {GRADE_LABEL[user.grade] ?? user.grade}</span>}
          {user.committee && <span>위원회: {user.committee}</span>}
          {user.munExperience && (
            <span>경험: {MUN_LABEL[user.munExperience] ?? user.munExperience}</span>
          )}
        </div>
      )}
      {err && <p className="mt-1 text-xs text-red-600">{err}</p>}
    </div>
  );
}

function AddAdmin() {
  const create = useCreateAdmin();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-md border border-dashed border-neutral-300 px-3 py-1.5 text-xs text-neutral-500 hover:border-neutral-400 hover:text-neutral-800"
      >
        + 관리자 추가
      </button>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        create.mutate(
          { email: email.trim(), name: name.trim(), password },
          {
            onSuccess: () => {
              setOpen(false);
              setEmail("");
              setName("");
              setPassword("");
            },
          },
        );
      }}
      className="space-y-2 rounded-lg border border-neutral-200 bg-neutral-50/60 p-3"
    >
      <p className="text-xs font-medium text-neutral-600">새 관리자 계정</p>
      <div className="grid gap-2 sm:grid-cols-3">
        <input
          type="email"
          required
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded border border-neutral-300 px-2 py-1 text-sm"
        />
        <input
          type="text"
          required
          placeholder="이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded border border-neutral-300 px-2 py-1 text-sm"
        />
        <input
          type="password"
          required
          minLength={8}
          placeholder="비밀번호 (8자 이상)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          className="rounded border border-neutral-300 px-2 py-1 text-sm"
        />
      </div>
      <p className="text-[11px] text-neutral-400">
        이메일 인증 없이 바로 로그인 가능한 계정으로 만들어집니다.
      </p>
      {create.error && (
        <p className="text-xs text-red-600">
          {(create.error as Error).message}
        </p>
      )}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={create.isPending}
          className="rounded-md bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50"
        >
          {create.isPending ? "생성 중…" : "생성"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-md border border-neutral-300 px-3 py-1.5 text-xs"
        >
          취소
        </button>
      </div>
    </form>
  );
}

function Badge({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: "amber" | "red" | "neutral";
}) {
  return (
    <span
      className={cn(
        "rounded-full px-1.5 py-0.5 text-[10px] font-medium",
        tone === "amber" && "bg-amber-100 text-amber-700",
        tone === "red" && "bg-red-100 text-red-700",
        tone === "neutral" && "bg-neutral-200 text-neutral-600",
      )}
    >
      {children}
    </span>
  );
}
