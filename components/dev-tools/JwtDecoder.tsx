"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Check, Copy, KeyRound } from "lucide-react";

import { cn } from "@/lib/utils";

const SAMPLE_JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

function base64UrlDecode(input: string): string {
  let s = input.replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4 !== 0) s += "=";
  try {
    return decodeURIComponent(
      atob(s)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
  } catch {
    return atob(s);
  }
}

function tryParseJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

async function verifyHs(alg: "HS256" | "HS384" | "HS512", token: string, secret: string): Promise<boolean> {
  const [h, p, sig] = token.split(".");
  if (!h || !p || !sig) return false;
  const map: Record<string, string> = { HS256: "SHA-256", HS384: "SHA-384", HS512: "SHA-512" };
  const hash = map[alg];
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash },
    false,
    ["sign"]
  );
  const computed = await crypto.subtle.sign("HMAC", key, enc.encode(`${h}.${p}`));
  // base64url encode
  const bytes = new Uint8Array(computed);
  let str = "";
  for (let i = 0; i < bytes.length; i++) str += String.fromCharCode(bytes[i]);
  const computedB64 = btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  return computedB64 === sig;
}

export function JwtDecoder() {
  const [token, setToken] = useState(SAMPLE_JWT);
  const [secret, setSecret] = useState("your-256-bit-secret");
  const [verifyResult, setVerifyResult] = useState<"unknown" | "valid" | "invalid" | "unsupported">("unknown");
  const [copied, setCopied] = useState<string | null>(null);

  const decoded = useMemo(() => {
    const parts = token.trim().split(".");
    if (parts.length < 2) return { error: "JWT must have at least 2 base64url segments separated by dots." };
    const [h, p, s] = parts;
    const headerText = base64UrlDecode(h);
    const payloadText = base64UrlDecode(p);
    return {
      header: tryParseJson(headerText),
      payload: tryParseJson(payloadText),
      headerText,
      payloadText,
      signature: s ?? "",
    };
  }, [token]);

  useEffect(() => {
    setVerifyResult("unknown");
  }, [token, secret]);

  const handleVerify = async () => {
    if ("error" in decoded) return;
    const header = decoded.header as { alg?: string } | null;
    const alg = header?.alg;
    if (!alg) return setVerifyResult("invalid");
    if (!["HS256", "HS384", "HS512"].includes(alg)) return setVerifyResult("unsupported");
    try {
      const ok = await verifyHs(alg as "HS256" | "HS384" | "HS512", token.trim(), secret);
      setVerifyResult(ok ? "valid" : "invalid");
    } catch {
      setVerifyResult("invalid");
    }
  };

  const handleCopy = async (which: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(which);
    window.setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-surface-200 bg-white p-5 dark:border-surface-800 dark:bg-surface-900">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
          JWT
        </p>
        <textarea
          value={token}
          onChange={(e) => setToken(e.target.value)}
          rows={4}
          className="w-full resize-y rounded-lg border border-surface-300 bg-surface-50 px-3 py-2 font-mono text-xs text-surface-900 dark:border-surface-700 dark:bg-surface-800 dark:text-white"
        />
      </div>

      {"error" in decoded ? (
        <div className="flex items-start gap-2 rounded-xl border border-error-300 bg-error-50 px-4 py-3 text-sm text-error-700 dark:border-error-500/60 dark:bg-error-500/10 dark:text-error-200">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{decoded.error}</p>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-3">
          <Panel
            title="Header"
            tone="primary"
            value={decoded.headerText}
            onCopy={() => handleCopy("header", decoded.headerText)}
            copied={copied === "header"}
          />
          <Panel
            title="Payload"
            tone="success"
            value={decoded.payloadText}
            onCopy={() => handleCopy("payload", decoded.payloadText)}
            copied={copied === "payload"}
          />
          <Panel
            title="Signature"
            tone="warning"
            value={decoded.signature || "(empty)"}
            mono
            onCopy={() => handleCopy("signature", decoded.signature)}
            copied={copied === "signature"}
          />
        </div>
      )}

      <div className="rounded-2xl border-2 border-primary-400 bg-gradient-to-br from-primary-50 to-white p-5 dark:border-primary-500/60 dark:from-primary-500/10 dark:to-surface-900">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary-700 dark:text-primary-300">
          Verify HS256 / HS384 / HS512 signature
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <label className="flex flex-1 flex-col gap-1">
            <span className="text-xs font-medium text-surface-700 dark:text-surface-300">Shared secret</span>
            <input
              type="text"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              className="rounded-lg border border-surface-300 bg-white px-3 py-2 font-mono text-sm text-surface-900 dark:border-surface-700 dark:bg-surface-900 dark:text-white"
            />
          </label>
          <button
            type="button"
            onClick={handleVerify}
            className="inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-primary-600 px-8 py-4 text-lg font-bold text-white shadow-lg ring-4 ring-primary-300/60 transition hover:bg-primary-700 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] sm:w-auto"
          >
            <KeyRound className="h-6 w-6" />
            Verify signature
          </button>
        </div>
        {verifyResult !== "unknown" && (
          <p
            className={cn(
              "mt-3 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold",
              verifyResult === "valid" && "bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-300",
              verifyResult === "invalid" && "bg-error-50 text-error-700 dark:bg-error-500/10 dark:text-error-200",
              verifyResult === "unsupported" && "bg-warning-50 text-warning-700 dark:bg-warning-500/10 dark:text-warning-300"
            )}
          >
            {verifyResult === "valid" && <><Check className="h-3.5 w-3.5" /> Signature is valid</>}
            {verifyResult === "invalid" && <><AlertTriangle className="h-3.5 w-3.5" /> Signature is invalid</>}
            {verifyResult === "unsupported" && (
              <><AlertTriangle className="h-3.5 w-3.5" /> Asymmetric algorithms aren't verified here — only HS256/HS384/HS512.</>
            )}
          </p>
        )}
      </div>
    </div>
  );
}

function Panel({
  title,
  tone,
  value,
  mono,
  onCopy,
  copied,
}: {
  title: string;
  tone: "primary" | "success" | "warning";
  value: string;
  mono?: boolean;
  onCopy: () => void;
  copied: boolean;
}) {
  const toneClass = {
    primary: "border-primary-300 bg-primary-50/40 dark:border-primary-500/40 dark:bg-primary-500/10",
    success: "border-success-300 bg-success-50/40 dark:border-success-500/40 dark:bg-success-500/10",
    warning: "border-warning-300 bg-warning-50/40 dark:border-warning-500/40 dark:bg-warning-500/10",
  }[tone];
  return (
    <div className={cn("rounded-2xl border-2 p-4", toneClass)}>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-surface-700 dark:text-surface-200">{title}</p>
        <button
          type="button"
          onClick={onCopy}
          className="inline-flex items-center gap-1 text-[11px] font-semibold text-surface-600 hover:text-primary-700 dark:text-surface-300 dark:hover:text-primary-300"
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre
        className={cn(
          "max-h-64 overflow-auto whitespace-pre-wrap break-words rounded-lg bg-white p-3 text-xs text-surface-900 dark:bg-surface-900 dark:text-white",
          mono && "font-mono"
        )}
      >
        {value}
      </pre>
    </div>
  );
}
