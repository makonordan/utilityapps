"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { AlertTriangle, FileVideo, UploadCloud, X } from "lucide-react";

import { formatVideoSize } from "@/lib/videoTools";
import { cn } from "@/lib/utils";

interface VideoDropZoneProps {
  onFileSelected: (file: File) => void;
  /** MIME types or `.ext` entries for the file picker `accept` attribute. */
  acceptedFormats: string[];
  maxSizeMB: number;
  /** Friendly extension list shown under the drop zone (e.g. ["MP4","WEBM"]). */
  formatLabels?: string[];
  className?: string;
}

interface PreviewItem {
  file: File;
  url: string;
  duration?: number;
  width?: number;
  height?: number;
  error?: string;
}

function validateVideo(file: File, maxSizeMB: number, accepted: string[]): string | null {
  const maxBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxBytes) {
    return `File is ${formatVideoSize(file.size)} — exceeds the ${maxSizeMB} MB limit.`;
  }
  // Accept by MIME type or extension; the picker already filters most cases
  // but drag-drop bypasses the accept attribute.
  const lowered = file.name.toLowerCase();
  const matchedMime = accepted.some((a) => a.startsWith("video/") && file.type === a);
  const matchedExt = accepted.some((a) => a.startsWith(".") && lowered.endsWith(a));
  // Some browsers don't set type for less common containers — fall back to a
  // friendly extension check on common video extensions.
  const fallbackVideoExt = /\.(mp4|mov|webm|mkv|avi|flv|ogv|3gp|m4v)$/i.test(lowered);
  if (!matchedMime && !matchedExt && !fallbackVideoExt) {
    return "Unsupported video format.";
  }
  return null;
}

export function VideoDropZone({
  onFileSelected,
  acceptedFormats,
  maxSizeMB,
  formatLabels,
  className,
}: VideoDropZoneProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<PreviewItem | null>(null);

  // Revoke object URL on unmount or when replaced.
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview.url);
    };
  }, [preview]);

  const acceptAttr = acceptedFormats.join(",");

  const handleFile = useCallback(
    (incoming: File) => {
      const error = validateVideo(incoming, maxSizeMB, acceptedFormats);
      const url = URL.createObjectURL(incoming);

      setPreview((prev) => {
        if (prev) URL.revokeObjectURL(prev.url);
        return { file: incoming, url, error: error ?? undefined };
      });

      if (error) return;

      // Probe duration + dimensions via a hidden video element.
      const probe = document.createElement("video");
      probe.preload = "metadata";
      probe.muted = true;
      probe.src = url;
      probe.onloadedmetadata = () => {
        setPreview((prev) =>
          prev && prev.url === url
            ? {
                ...prev,
                duration: isFinite(probe.duration) ? probe.duration : undefined,
                width: probe.videoWidth || undefined,
                height: probe.videoHeight || undefined,
              }
            : prev
        );
      };

      onFileSelected(incoming);
    },
    [acceptedFormats, maxSizeMB, onFileSelected]
  );

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLLabelElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      const f = e.dataTransfer.files[0];
      if (f) handleFile(f);
    },
    [handleFile]
  );

  const clear = () => {
    if (preview) URL.revokeObjectURL(preview.url);
    setPreview(null);
  };

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <label
        htmlFor={inputId}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!isDragging) setIsDragging(true);
        }}
        onDragEnter={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(e) => {
          if (e.currentTarget.contains(e.relatedTarget as Node)) return;
          setIsDragging(false);
        }}
        onDrop={onDrop}
        className={cn(
          "group relative flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-12 text-center transition-all",
          "bg-white text-surface-600 hover:border-primary-400 dark:bg-surface-900 dark:text-surface-300",
          isDragging
            ? "scale-[1.02] border-primary-500 bg-primary-50/60 text-primary-700 dark:border-primary-400 dark:bg-primary-500/10 dark:text-primary-200"
            : "border-surface-300 dark:border-surface-700"
        )}
      >
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          className="sr-only"
          accept={acceptAttr || "video/*"}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
            // Reset so picking the same file twice still fires onChange.
            e.target.value = "";
          }}
        />

        <span
          className={cn(
            "flex h-14 w-14 items-center justify-center rounded-full transition",
            isDragging
              ? "bg-primary-100 text-primary-700 dark:bg-primary-500/20 dark:text-primary-200"
              : "bg-surface-100 text-surface-500 group-hover:bg-primary-50 group-hover:text-primary-600 dark:bg-surface-800 dark:text-surface-400"
          )}
          aria-hidden="true"
        >
          <UploadCloud className="h-7 w-7" />
        </span>

        <div className="space-y-1">
          <p className="text-base font-semibold text-surface-900 dark:text-white">
            {isDragging ? "Drop to upload" : "Drop a video here or click to browse"}
          </p>
          <p className="text-xs text-surface-500 dark:text-surface-400">
            Single file · Max {maxSizeMB} MB
          </p>
        </div>

        {formatLabels && formatLabels.length > 0 && (
          <p className="text-[11px] font-medium uppercase tracking-wider text-surface-500 dark:text-surface-500">
            Accepted: {formatLabels.join(", ")}
          </p>
        )}
      </label>

      {preview && (
        <div
          className={cn(
            "overflow-hidden rounded-2xl border bg-white shadow-sm dark:bg-surface-900",
            preview.error
              ? "border-error-300 dark:border-error-500/60"
              : "border-surface-200 dark:border-surface-800"
          )}
        >
          <div className="grid gap-4 p-4 sm:grid-cols-[200px_1fr]">
            <div className="relative aspect-video overflow-hidden rounded-xl bg-black">
              {preview.error ? (
                <div className="flex h-full w-full items-center justify-center text-surface-400">
                  <FileVideo className="h-10 w-10" />
                </div>
              ) : (
                <video
                  src={preview.url}
                  className="h-full w-full object-contain"
                  controls
                  muted
                  preload="metadata"
                />
              )}
              <button
                type="button"
                onClick={clear}
                className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur transition hover:bg-black/80"
                aria-label="Remove video"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <p
                className="truncate text-sm font-semibold text-surface-900 dark:text-white"
                title={preview.file.name}
              >
                {preview.file.name}
              </p>
              <ul className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-surface-600 dark:text-surface-400">
                <li>{formatVideoSize(preview.file.size)}</li>
                {preview.duration !== undefined && (
                  <li>{preview.duration.toFixed(1)} s</li>
                )}
                {preview.width && preview.height && (
                  <li>
                    {preview.width} × {preview.height}
                  </li>
                )}
                {preview.file.type && <li>{preview.file.type}</li>}
              </ul>
              {preview.error && (
                <p className="inline-flex items-center gap-1 text-xs font-medium text-error-600 dark:text-error-400">
                  <AlertTriangle className="h-3 w-3" />
                  {preview.error}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
