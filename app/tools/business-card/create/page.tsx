import Link from "next/link";

import { GoogleSignInButton } from "@/components/business-card/GoogleSignInButton";
import { UsernameSetup } from "@/components/business-card/UsernameSetup";
import { CreateCardShell } from "@/components/business-card/CreateCardShell";
import { getBcUser, getSessionUser } from "@/lib/businessCard/auth";
import { SITE_CONFIG } from "@/lib/utils";

/**
 * /tools/business-card/create — the onboarding + creation flow.
 *
 * Three states based on session + bc_users row:
 *   1. Not signed in → sign-in prompt
 *   2. Signed in but no bc_users row → username-setup step
 *   3. Signed in with row → the card form itself
 *
 * All three render as different components so state transitions
 * (sign-in → username → form) don't require a page reload; the
 * username-setup step navigates to a fresh render of this route
 * when it finishes.
 */

export const metadata = {
  title: "Create Your Business Card",
  robots: { index: false, follow: true },
};

export default async function CreateCardPage() {
  const session = await getSessionUser();
  if (!session) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
        <h1 className="text-2xl font-bold tracking-tight text-surface-900 dark:text-white">
          Sign in to create your business card
        </h1>
        <p className="mt-3 text-sm text-surface-600 dark:text-surface-300">
          One-tap sign-in with Google. Your email is used only for signing in and to send
          receipts if you subscribe.
        </p>
        <div className="mt-8">
          <GoogleSignInButton next="/tools/business-card/create" />
        </div>
        <p className="mt-6 text-xs text-surface-500">
          Prefer not to sign in?{" "}
          <Link href="/tools/business-card" className="underline hover:text-surface-900 dark:hover:text-white">
            Back to landing page
          </Link>
        </p>
      </div>
    );
  }

  const user = await getBcUser();
  if (!user) {
    return <UsernameSetup email={session.email ?? ""} name={session.name ?? ""} />;
  }

  // Prevent creating a second card if free-tier limit reached.
  // The API also enforces this; this is just the UX.
  // (Rendered in the client component so it can show optimistic
  // limit-reached feedback tied to the actual API response.)
  return <CreateCardShell username={user.username} plan={user.plan} />;
}
