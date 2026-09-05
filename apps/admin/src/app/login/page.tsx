// apps/admin/src/app/login/page.tsx
"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { signIn } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);
    try {
      // better-auth's client doesn't throw on failure — it returns
      // { error } instead, so 401/400 etc. must be checked here directly.
      const { error: signInError } = await signIn.email({ email, password });
      if (signInError) {
        setError(signInError.message ?? "Sign-in failed.");
        return;
      }
      // If adminFetch redirected here with ?next= on a 401, return to it
      const next = new URLSearchParams(window.location.search).get("next");
      router.push(next && next.startsWith("/dashboard") ? next : "/dashboard");
    } catch {
      // Network error or other unexpected exception
      setError("Could not connect to the server. Check that the API is running.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-wash px-4">
      <div className="w-full max-w-[400px]">
        <div className="mb-8 flex items-center gap-2.5">
          <Image
            src="/emblem-navy.png"
            alt="DAEMUN emblem"
            width={32}
            height={24}
            priority
          />
          <span className="font-custom text-[22px] tracking-[0.08em] text-ink">
            DAEMUN III
          </span>
        </div>

        <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-[0_1px_3px_rgba(10,20,40,0.05)]">
          <div className="h-1 bg-gold" aria-hidden />
          <form onSubmit={handleSubmit} className="space-y-4 p-7">
            <div>
              <h1 className="font-custom text-[30px] leading-none tracking-[0.02em] text-ink">
                Sign in
              </h1>
              <p className="mt-1.5 text-[13px] text-muted">
                Conference admin panel
              </p>
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-xl bg-[#fdf1f1] px-4 py-3 text-[13px] text-[#b23b3b]"
              >
                {error}
              </p>
            )}

            <div className="space-y-1.5">
              <label htmlFor="email" className="text-[13px] font-medium text-body">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 w-full rounded-xl bg-[#f1f1f0] px-4 text-[14px] text-ink outline-none transition-shadow placeholder:text-muted/60 focus:ring-2 focus:ring-brand/40"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="text-[13px] font-medium text-body">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 w-full rounded-xl bg-[#f1f1f0] px-4 text-[14px] text-ink outline-none transition-shadow placeholder:text-muted/60 focus:ring-2 focus:ring-brand/40"
              />
            </div>

            <button
              type="submit"
              disabled={pending}
              className="flex h-11 w-full items-center justify-center rounded-xl bg-navy text-[14px] font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {pending ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
