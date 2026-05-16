/**
 * Donation configuration for the /donate page.
 *
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │  UPDATE EVERYTHING IN THIS FILE with your real, verified details.    │
 * │                                                                     │
 * │  • Set any link to "" (empty string) to hide that option entirely.   │
 * │  • Bank / crypto values left wrapped in [brackets] are treated as    │
 * │    "not set yet" — the page shows a polite "being set up" message    │
 * │    instead of broken placeholder details.                            │
 * │  • Add supporter names to SUPPORTERS as donations come in.           │
 * └─────────────────────────────────────────────────────────────────────┘
 */

export const SUPPORT_EMAIL = "hello@utilityapps.site";

/** One-time / recurring donation links. Empty string hides the button. */
export const DONATE_LINKS = {
  buyMeACoffee: "https://buymeacoffee.com/utilityapps",
  koFi: "https://ko-fi.com/utilityapps",
  paypal: "https://paypal.me/utilityapps",
  paystack: "https://paystack.com/pay/utilityapps",
  flutterwave: "https://flutterwave.com/pay/utilityapps",
};

/** Nigerian bank transfer details. Bracketed = not set yet. */
export const BANK_DETAILS = {
  accountName: "[Your Full Legal Name]",
  bankName: "[Bank Name]",
  accountNumber: "[Account Number]",
};

/** Crypto wallets. Bracketed addresses = not set yet. */
export const CRYPTO_WALLETS: { label: string; address: string }[] = [
  { label: "Bitcoin (BTC)", address: "[BTC wallet address]" },
  { label: "USDT (TRC-20)", address: "[USDT wallet address]" },
];

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

/** Crypto wallets that have a real address set. */
export function configuredWallets() {
  return CRYPTO_WALLETS.filter((w) => !isPlaceholder(w.address));
}
