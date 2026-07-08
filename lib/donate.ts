/**
 * Donation configuration for the /donate page.
 *
 * Three options are exposed on the page:
 *   1. KoraPay  — international, pay in any currency
 *   2. PayPal   — international, by recipient email
 *   3. Direct bank transfer — Nigeria (Paga)
 *
 * To change anything, just edit the values below. Set a link to "" to hide
 * an option entirely. Values left as [bracketed placeholders] are treated as
 * "not set" — the page shows a polite "being set up" message instead of fake
 * details.
 */

export const SUPPORT_EMAIL = "hello@utilityapps.site";

/** Multi-currency donation gateways. Empty string hides the button. */
export const DONATE_LINKS = {
  // ⚠️ TEST URL — the "test-checkout" subdomain is KoraPay's sandbox and will
  // NOT charge real money. Replace with your production checkout URL before
  // promoting the page publicly.
  korapay: "https://test-checkout.korapay.com/pay/EysLllh2Q1EBgDN",
};

/** PayPal recipient — donors send to this email from their own PayPal. */
export const PAYPAL = {
  accountName: "Daniel Makonor",
  email: "danielstechandaireviews@gmail.com",
};

/** Nigerian bank / fintech transfer details. */
export const BANK_DETAILS = {
  accountName: "Daniel Makonor",
  bankName: "Paga",
  accountNumber: "2887274150",
};

/** Public thank-you wall. Add names (with permission) as donations arrive. */
export const SUPPORTERS: string[] = [];

/** True when a value is blank or still a [bracketed] placeholder. */
export function isPlaceholder(value: string): boolean {
  const v = value.trim();
  return v.length === 0 || (v.startsWith("[") && v.endsWith("]"));
}

/** True when at least one bank field is real. */
export function hasBankDetails(): boolean {
  return (
    !isPlaceholder(BANK_DETAILS.accountName) &&
    !isPlaceholder(BANK_DETAILS.accountNumber) &&
    !isPlaceholder(BANK_DETAILS.bankName)
  );
}

/** True when the PayPal email is configured. */
export function hasPayPal(): boolean {
  return !isPlaceholder(PAYPAL.email);
}
