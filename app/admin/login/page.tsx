import type { Metadata } from "next";
import { LockKeyhole } from "lucide-react";

import { SITE_CONFIG } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

interface SearchParams {
  searchParams: Promise<{ error?: string; from?: string }>;
}

const ERROR_MESSAGES: Record<string, string> = {
  invalid: "Wrong password. Try again.",
  "not-configured":
    "ADMIN_PASSWORD is not set on the server. Set it in .env.local and restart.",
};

export default async function AdminLoginPage({ searchParams }: SearchParams) {
  const sp = await searchParams;
  const errorMessage = sp.error ? ERROR_MESSAGES[sp.error] ?? "Login failed." : null;

  // If the user was redirected from a deeper /admin/* path, preserve it as a
  // query string on the form action so we send them back there after login.
  const from = sp.from && sp.from.startsWith("/admin") ? sp.from : null;
  const action = from
    ? `/api/admin/auth?from=${encodeURIComponent(from)}`
    : "/api/admin/auth";

  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12 sm:px-6">
      <div className="w-full max-w-sm rounded-3xl border border-surface-200 bg-white p-7 shadow-card dark:border-surface-800 dark:bg-surface-900">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
          <LockKeyhole className="h-3.5 w-3.5" />
          {SITE_CONFIG.name} admin
        </div>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-surface-900 dark:text-white">
          Sign in
        </h1>
        <p className="mt-1.5 text-sm text-surface-600 dark:text-surface-400">
          Enter the admin password set in <code className="rounded bg-surface-100 px-1 py-0.5 text-[0.85em] dark:bg-surface-800">ADMIN_PASSWORD</code>.
        </p>

        <form method="POST" action={action} className="mt-6 space-y-3" autoComplete="off">
          <label htmlFor="admin-password" className="block text-xs font-semibold uppercase tracking-wider text-surface-600 dark:text-surface-300">
            Password
          </label>
          <input
            id="admin-password"
            name="password"
            type="password"
            required
            autoFocus
            autoComplete="current-password"
            className="w-full rounded-xl border border-surface-300 bg-white px-3 py-2.5 text-sm text-surface-900 placeholder:text-surface-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 dark:border-surface-700 dark:bg-surface-900 dark:text-white"
          />

          {errorMessage && (
            <p
              role="alert"
              className="text-xs text-warning-600 dark:text-warning-400"
            >
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:from-primary-600 hover:to-accent-600"
          >
            Sign in
          </button>
        </form>
      </div>
    </main>
  );
}
