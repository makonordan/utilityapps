"use client";

import { useRef, useState } from "react";
import { Loader2, Trash2, Upload } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Image upload for card avatars and company logos. Compresses in-browser
 * before POSTing to /api/business-card/upload so we don't push 8 MB
 * phone-camera JPEGs to Supabase Storage. Target output: ~512 px on the
 * longest side, JPEG q=0.85, which typically lands at 60–150 KB.
 *
 * Falls back gracefully if the image is already tiny (SVG-like PNGs,
 * exported avatars) — we only re-encode if it'd meaningfully shrink.
 */

interface Props {
  /** Current stored URL (from card row); null → show the drop zone. */
  value: string | null;
  /** Called with the new public URL after a successful upload. */
  onUploaded: (url: string) => void;
  /** Called when user removes the image. */
  onCleared: () => void;
  /** avatar (default) → circular preview; logo → square preview. */
  kind?: "avatar" | "logo";
  label?: string;
}

const MAX_SIDE = 512;
const JPEG_QUALITY = 0.85;

export function AvatarUpload({
  value,
  onUploaded,
  onCleared,
  kind = "avatar",
  label,
}: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const pick = () => inputRef.current?.click();

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file
    if (!f) return;
    if (!/^image\/(jpeg|png|webp)$/.test(f.type)) {
      setError("Only JPG, PNG, or WEBP images.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const blob = await compressImage(f);
      const form = new FormData();
      form.append("file", blob, filenameFor(f, blob));
      form.append("kind", kind);
      const res = await fetch("/api/business-card/upload", { method: "POST", body: form });
      const json = (await res.json()) as { ok?: boolean; error?: string; url?: string };
      if (!res.ok || !json.ok || !json.url) {
        setError(json.error ?? "Upload failed");
        return;
      }
      onUploaded(json.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  const shape = kind === "avatar" ? "rounded-full" : "rounded-2xl";

  return (
    <div className="space-y-2">
      {label && (
        <span className="block text-xs font-medium uppercase tracking-wider text-surface-600 dark:text-surface-300">
          {label}
        </span>
      )}
      <div className="flex items-center gap-3">
        {value ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt=""
              className={cn(
                "h-20 w-20 shrink-0 border border-surface-200 object-cover shadow dark:border-surface-800",
                shape
              )}
            />
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={pick}
                disabled={busy}
                className="inline-flex items-center gap-1.5 rounded-lg border border-surface-200 px-3 py-1.5 text-xs font-semibold text-surface-700 transition hover:border-surface-300 disabled:opacity-60 dark:border-surface-800 dark:text-surface-200"
              >
                {busy ? <Loader2 className="h-3 w-3 animate-spin" /> : <Upload className="h-3 w-3" />}
                Replace
              </button>
              <button
                type="button"
                onClick={onCleared}
                className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-50 dark:border-red-500/40 dark:text-red-300 dark:hover:bg-red-500/10"
              >
                <Trash2 className="h-3 w-3" /> Remove
              </button>
            </div>
          </>
        ) : (
          <button
            type="button"
            onClick={pick}
            disabled={busy}
            className={cn(
              "flex h-20 w-20 shrink-0 items-center justify-center border-2 border-dashed border-surface-300 text-surface-500 transition hover:border-primary-400 hover:text-primary-600 disabled:opacity-60 dark:border-surface-700 dark:text-surface-400",
              shape
            )}
            aria-label={`Upload ${kind}`}
          >
            {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" />}
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={onFile}
          className="hidden"
        />
      </div>
      <p className="text-[11px] text-surface-500 dark:text-surface-400">
        JPG, PNG, or WEBP · max 2 MB · compressed to ~500 px before upload
      </p>
      {error && (
        <p className="text-[11px] text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}

/**
 * Redraw the image on a canvas so it fits in MAX_SIDE and re-encode as
 * JPEG at JPEG_QUALITY. Returns the original file if the compression
 * wouldn't help (image already small, or Canvas failed).
 */
async function compressImage(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) return file;
  const { width, height } = bitmap;
  const largest = Math.max(width, height);
  const shouldScale = largest > MAX_SIDE;
  const scale = shouldScale ? MAX_SIDE / largest : 1;
  const w = Math.round(width * scale);
  const h = Math.round(height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.drawImage(bitmap, 0, 0, w, h);

  const encoded: Blob | null = await new Promise((resolve) =>
    canvas.toBlob((b) => resolve(b), "image/jpeg", JPEG_QUALITY)
  );
  if (!encoded) return file;
  // Skip re-encode if it made the file bigger (rare — happens on
  // aggressively-compressed source photos).
  return encoded.size < file.size ? encoded : file;
}

function filenameFor(original: File, blob: Blob): string {
  const base = original.name.replace(/\.[^.]+$/, "") || "avatar";
  const ext = blob.type === "image/jpeg" ? "jpg" : blob.type.split("/")[1] ?? "jpg";
  return `${base}.${ext}`;
}
