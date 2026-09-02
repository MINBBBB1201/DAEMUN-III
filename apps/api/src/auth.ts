import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin } from "better-auth/plugins";
import { account, session, user, verification } from "@daemun/db";
import { db } from "./db";
import { env } from "./env";

/**
 * Auth is mounted at `${API}/api/auth/*`.
 *
 * The admin frontend is expected to proxy `/api/*` to this server so cookies
 * stay first-party. `baseURL` is therefore the *admin* origin, and that origin
 * is also the only trusted one for CSRF checks.
 *
 * Public sign-up is disabled: accounts are created by an existing admin via
 * `POST /api/auth/admin/create-user` or on first boot (see bootstrap.ts).
 */
export const auth = betterAuth({
  baseURL: env.adminUrl,
  basePath: "/api/auth",
  secret: env.authSecret,
  trustedOrigins: [env.adminUrl],
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: { user, session, account, verification },
  }),
  emailAndPassword: {
    enabled: true,
    disableSignUp: true,
    minPasswordLength: 8,
  },
  session: {
    cookieCache: { enabled: true, maxAge: 60 },
  },
  plugins: [admin({ defaultRole: "admin" })],
});

export type Session = typeof auth.$Infer.Session;
