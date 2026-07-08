import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Clock, Mail } from "lucide-react";

import { getOrderByReference } from "@/lib/orders";
import { getProductById } from "@/lib/products";

export const metadata: Metadata = {
  title: "Order confirmed",
  robots: { index: false, follow: false },
};

interface PageProps {
  searchParams: Promise<{ ref?: string }>;
}

function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain) return email;
  const head = local.slice(0, 2);
  return `${head}${"•".repeat(Math.max(1, local.length - 2))}@${domain}`;
}

export default async function CheckoutSuccessPage({ searchParams }: PageProps) {
  const { ref } = await searchParams;
  const order = ref ? await getOrderByReference(ref) : null;
  const product = order ? getProductById(order.product_id) : null;
  const delivered = order?.status === "fulfilled";

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6">
      <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-400">
        <CheckCircle2 className="h-9 w-9" />
      </span>

      <h1 className="mt-6 text-3xl font-bold tracking-tight text-surface-900 sm:text-4xl dark:text-white">
        Payment received
      </h1>

      {product && (
        <p className="mt-3 text-base text-surface-600 dark:text-surface-300">
          Thank you for buying <strong className="text-surface-900 dark:text-white">{product.name}</strong>.
        </p>
      )}

      <div className="mt-8 w-full rounded-2xl border border-surface-200 bg-white p-6 text-left dark:border-surface-800 dark:bg-surface-900">
        {delivered ? (
          <div className="flex items-start gap-3">
            <Mail className="mt-0.5 h-5 w-5 shrink-0 text-primary-600 dark:text-primary-400" />
            <div>
              <p className="text-sm font-semibold text-surface-900 dark:text-white">
                Your download is on its way
              </p>
              <p className="mt-1 text-sm text-surface-600 dark:text-surface-300">
                We&apos;ve emailed your download link
                {order ? <> to <strong>{maskEmail(order.email)}</strong></> : null}. It can take a
                couple of minutes to arrive — remember to check your spam folder.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-3">
            <Clock className="mt-0.5 h-5 w-5 shrink-0 text-primary-600 dark:text-primary-400" />
            <div>
              <p className="text-sm font-semibold text-surface-900 dark:text-white">
                We&apos;re confirming your payment
              </p>
              <p className="mt-1 text-sm text-surface-600 dark:text-surface-300">
                Your download link will be emailed
                {order ? <> to <strong>{maskEmail(order.email)}</strong></> : null} as soon as the
                payment is confirmed — usually within a minute or two. Check your spam folder if it
                doesn&apos;t appear.
              </p>
            </div>
          </div>
        )}

        {ref && (
          <p className="mt-4 border-t border-surface-200 pt-4 text-xs text-surface-500 dark:border-surface-800 dark:text-surface-400">
            Order reference: <span className="font-mono">{ref}</span>
          </p>
        )}
      </div>

      <p className="mt-6 text-sm text-surface-500 dark:text-surface-400">
        Didn&apos;t get your email? Contact{" "}
        <a
          href="mailto:hello@utilityapps.site"
          className="font-medium text-primary-600 hover:underline dark:text-primary-400"
        >
          hello@utilityapps.site
        </a>{" "}
        with your order reference.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/products"
          className="rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700"
        >
          Browse more products
        </Link>
        <Link
          href="/"
          className="rounded-xl border border-surface-200 px-5 py-2.5 text-sm font-semibold text-surface-700 transition hover:bg-surface-50 dark:border-surface-800 dark:text-surface-200 dark:hover:bg-surface-900"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
