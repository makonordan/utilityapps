"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

import { getSupabaseBrowser } from "@/lib/businessCard/supabaseBrowser";
import { cn } from "@/lib/utils";

/**
 * "Sign in with Google" using Supabase Auth. On click:
 *   1. Get browser Supabase client
 *   2. Redirect to Google → back to /auth/callback
 *   3. Callback exchanges code for session, redirects to next
 */
export function GoogleSignInButton({
  next = "/tools/business-card/create",
  className,
  children = "Continue with Google",
}: {
  next?: string;
  className?: string;
  children?: React.ReactNode;
}) {
  const [busy, setBusy] = useState(false);

  const signIn = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const sb = getSupabaseBrowser();
      const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;
      await sb.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo },
      });
      // On success the OAuth flow leaves the page — no further UI here.
    } catch (err) {
      console.warn("[bc/signin] oauth failed:", err);
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={signIn}
      disabled={busy}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl border border-surface-300 bg-white px-4 py-2.5 text-sm font-semibold text-surface-800 shadow-sm transition hover:bg-surface-50 disabled:opacity-60 dark:border-surface-700 dark:bg-surface-900 dark:text-white dark:hover:bg-surface-800",
        className
      )}
    >
      {busy ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <svg viewBox="0 0 24 24" width={18} height={18} aria-hidden="true">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.75h3.57c2.08-1.92 3.28-4.74 3.28-8.07z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.75c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}
