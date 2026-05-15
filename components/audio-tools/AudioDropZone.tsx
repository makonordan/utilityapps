"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { AlertTriangle, Music, UploadCloud, X } from "lucide-react";

import { cn } from "@/lib/utils";

interface AudioDropZoneProps {
  onFileSelected: (file: File) => void;
  acceptedFormats?: string[];
  maxSizeMB?: number;
  formatLabels?: string[];
  className?: string;
}

const DEFAULT_FORMATS = [
  "audio/mpeg",
  "audio/wav",
  "audio/x-wav",
  "audio/ogg",
  "audio/flac",
  "audio/x-flac",
  "audio/aac",
  "audio/mp4",
  "audio/x-m4a",
  "audio/opus",
  "audio/webm",
];

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

interface PreviewItem {
  file: File;
  url: string;
  duration?: number;
  error?: string;
}

export function AudioDropZone({
  onFileSelected,
  acceptedFormats = DEFAULT_FORMATS,
  maxSizeMB = 500,
  formatLabels = ["MP3", "WAV", "OGG", "FLAC", "AAC", "M4A", "OPUS"],
  className,
}: AudioDropZoneProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<PreviewItem | null>(null);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview.url);
    };
  }, [preview]);

  const validateFile = useCallback(
    (file: File): string | null => {
      const maxBytes = maxSizeMB * 1024 * 1024;
      if (file.size > maxBytes) return `File is ${formatBytes(file.size)} — exceeds the ${maxSizeMB} MB limit.`;
      const lower = file.name.toLowerCase();
      const fallbackExt = /\.(mp3|wav|ogg|flac|aac|m4a|opus|webm)$/i.test(lower);
      const matchedMime = acceptedFormats.includes(file.type);
      if (!matchedMime && !fallbackExt) return "Unsupported audio format.";
      return null;
    },
    [acceptedFormats, maxSizeMB]
  );

  const handleFile = useCallback(
    (incoming: File) => {
      const error = validateFile(incoming);
      const url = URL.createObjectURL(incoming);
      setPreview((prev) => {
        if (prev) URL.revokeObjectURL(prev.url);
        return { file: incoming, url, error: error ?? undefined };
      });
      if (error) return;
      const probe = document.createElement("audio");
      probe.preload = "metadata";
      probe.src = url;
      probe.onloadedmetadata = () => {
        setPreview((prev) =>
          prev && prev.url === url ? { ...prev, duration: isFinite(probe.duration) ? probe.duration : undefined } : prev
        );
      };
      onFileSelected(incoming);
    },
    [onFileSelected, validateFile]
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
          accept={acceptedFormats.join(",")}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
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
            {isDragging ? "Drop to upload" : "Drop an audio file here or click to browse"}
          </p>
          <p className="text-xs text-surface-500 dark:text-surface-400">Single file · Max {maxSizeMB} MB</p>
        </div>
        {formatLabels.length > 0 && (
          <p className="text-[11px] font-medium uppercase tracking-wider text-surface-500 dark:text-surface-500">
            Accepted: {formatLabels.join(", ")}
          </p>
        )}
      </label>

      {preview && (
        <div
          className={cn(
            "overflow-hidden rounded-2xl border bg-white shadow-sm dark:bg-surface-900",
            preview.error ? "border-error-300 dark:border-error-500/60" : "border-surface-200 dark:border-surface-800"
          )}
        >
          <div className="flex items-center gap-4 p-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-surface-100 text-surface-500 dark:bg-surface-800 dark:text-surface-400">
              <Music className="h-7 w-7" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-surface-900 dark:text-white" title={preview.file.name}>
                {preview.file.name}
              </p>
              <ul className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-surface-600 dark:text-surface-400">
                <li>{formatBytes(preview.file.size)}</li>
                {preview.duration !== undefined && <li>{preview.duration.toFixed(1)} s</li>}
                {preview.file.type && <li>{preview.file.type}</li>}
              </ul>
              {preview.error && (
                <p className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-error-600 dark:text-error-400">
                  <AlertTriangle className="h-3 w-3" />
                  {preview.error}
                </p>
              )}
              {!preview.error && (
                /* eslint-disable-next-line jsx-a11y/media-has-caption */
                <audio src={preview.url} controls className="mt-2 w-full" />
              )}
            </div>
            <button
              type="button"
              onClick={clear}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-100 text-surface-500 transition hover:bg-error-100 hover:text-error-600 dark:bg-surface-800 dark:text-surface-400 dark:hover:bg-error-500/20"
              aria-label="Remove audio"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
