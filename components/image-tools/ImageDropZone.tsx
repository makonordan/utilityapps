"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { AlertTriangle, UploadCloud, X } from "lucide-react";

import {
  formatFileSize,
  getImageDimensions,
  validateImageFile,
} from "@/lib/imageProcessing";
import { cn } from "@/lib/utils";

interface ImageDropZoneProps {
  onFilesSelected: (files: File[]) => void;
  /** MIME types or `.ext` entries — matches IMAGE_TOOLS_CONFIG. */
  acceptedFormats: string[];
  maxSizeMB: number;
  multiple?: boolean;
  maxFiles?: number;
  /** Friendly name list to show under the drop zone (e.g. ["JPG","PNG"]). */
  formatLabels?: string[];
  className?: string;
}

interface PreviewItem {
  id: string;
  file: File;
  url: string;
  dimensions?: { width: number; height: number };
  error?: string;
}

let __pid = 0;
const nextId = () => `pi-${++__pid}-${Date.now()}`;

export function ImageDropZone({
  onFilesSelected,
  acceptedFormats,
  maxSizeMB,
  multiple = false,
  maxFiles = 20,
  formatLabels,
  className,
}: ImageDropZoneProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previews, setPreviews] = useState<PreviewItem[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  // Revoke object URLs when previews change or component unmounts.
  useEffect(() => {
    return () => {
      for (const p of previews) URL.revokeObjectURL(p.url);
    };
  }, [previews]);

  // Auto-dismiss toast.
  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 3500);
    return () => window.clearTimeout(t);
  }, [toast]);

  const acceptAttr = acceptedFormats
    .filter((f) => f !== "url")
    .join(",");

  const handleFiles = useCallback(
    (incoming: FileList | File[]) => {
      const list = Array.from(incoming);
      if (list.length === 0) return;

      // Cap by maxFiles (counting whatever we already have when in multi mode).
      const existingCount = multiple ? previews.length : 0;
      const allowedCount = Math.max(0, maxFiles - existingCount);
      let workSet = list;
      if (multiple && list.length > allowedCount) {
        workSet = list.slice(0, allowedCount);
        setToast(
          `Maximum ${maxFiles} files allowed — ${list.length - allowedCount} ignored.`
        );
      }
      if (!multiple) workSet = workSet.slice(0, 1);

      const newItems: PreviewItem[] = workSet.map((file) => {
        const validation = validateImageFile(file, maxSizeMB, acceptedFormats);
        return {
          id: nextId(),
          file,
          url: URL.createObjectURL(file),
          error: validation.valid ? undefined : validation.error,
        };
      });

      // In single mode, replacing the previous file frees its object URL.
      setPreviews((prev) => {
        if (!multiple) {
          for (const p of prev) URL.revokeObjectURL(p.url);
          return newItems;
        }
        return [...prev, ...newItems];
      });

      // Async: fill in dimensions for valid items.
      for (const item of newItems) {
        if (item.error) continue;
        getImageDimensions(item.file)
          .then((dims) => {
            setPreviews((prev) =>
              prev.map((p) => (p.id === item.id ? { ...p, dimensions: dims } : p))
            );
          })
          .catch(() => {
            /* ignore — preview thumbnail will still render */
          });
      }

      const validFiles = newItems.filter((i) => !i.error).map((i) => i.file);
      if (validFiles.length > 0) onFilesSelected(validFiles);
    },
    [acceptedFormats, maxFiles, maxSizeMB, multiple, onFilesSelected, previews.length]
  );

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLLabelElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      if (e.dataTransfer.files.length > 0) handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const removeAt = (id: string) => {
    setPreviews((prev) => {
      const target = prev.find((p) => p.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter((p) => p.id !== id);
    });
  };

  const validCount = previews.filter((p) => !p.error).length;

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
          // Only end the drag visual when leaving the drop zone itself,
          // not when crossing onto a child element.
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
          accept={acceptAttr || undefined}
          multiple={multiple}
          onChange={(e) => {
            if (e.target.files) handleFiles(e.target.files);
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
            {isDragging
              ? "Drop to upload"
              : multiple
                ? "Drop images here or click to browse"
                : "Drop an image here or click to browse"}
          </p>
          <p className="text-xs text-surface-500 dark:text-surface-400">
            {multiple ? `Up to ${maxFiles} files` : "Single file"} · Max{" "}
            {maxSizeMB} MB per file
          </p>
        </div>

        {formatLabels && formatLabels.length > 0 && (
          <p className="text-[11px] font-medium uppercase tracking-wider text-surface-500 dark:text-surface-500">
            Accepted: {formatLabels.join(", ")}
          </p>
        )}
      </label>

      {previews.length > 0 && (
        <div className="space-y-3">
          {multiple && (
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold text-primary-700 dark:bg-primary-500/20 dark:text-primary-200">
                {validCount} {validCount === 1 ? "file" : "files"} selected
              </span>
              <button
                type="button"
                onClick={() => {
                  for (const p of previews) URL.revokeObjectURL(p.url);
                  setPreviews([]);
                }}
                className="text-xs font-medium text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200"
              >
                Clear all
              </button>
            </div>
          )}

          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {previews.map((p) => (
              <li
                key={p.id}
                className={cn(
                  "group relative overflow-hidden rounded-xl border bg-white shadow-sm dark:bg-surface-900",
                  p.error
                    ? "border-error-300 dark:border-error-500/60"
                    : "border-surface-200 dark:border-surface-800"
                )}
              >
                <div className="relative aspect-square w-full overflow-hidden bg-surface-100 dark:bg-surface-800">
                  {/* Native <img> is fine here — files are user-uploaded blobs. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.url}
                    alt={p.file.name}
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeAt(p.id)}
                    className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 backdrop-blur transition hover:bg-black/80 group-hover:opacity-100 focus:opacity-100"
                    aria-label={`Remove ${p.file.name}`}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                  {p.error && (
                    <span className="absolute left-1.5 top-1.5 inline-flex items-center gap-1 rounded-full bg-error-600 px-2 py-0.5 text-[10px] font-semibold text-white shadow">
                      <AlertTriangle className="h-3 w-3" />
                      {p.error.includes("Unsupported") ? "Unsupported" : "Too large"}
                    </span>
                  )}
                </div>
                <div className="px-3 py-2">
                  <p
                    className="truncate text-xs font-medium text-surface-900 dark:text-white"
                    title={p.file.name}
                  >
                    {p.file.name}
                  </p>
                  <p className="text-[11px] text-surface-500 dark:text-surface-400">
                    {formatFileSize(p.file.size)}
                    {p.dimensions
                      ? ` · ${p.dimensions.width}×${p.dimensions.height}`
                      : ""}
                  </p>
                  {p.error && (
                    <p className="mt-1 text-[11px] font-medium text-error-600 dark:text-error-400">
                      {p.error}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {toast && (
        <div
          role="alert"
          className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl border border-error-300 bg-error-50 px-4 py-2 text-sm font-medium text-error-700 shadow-lg dark:border-error-500/60 dark:bg-error-500/10 dark:text-error-200"
        >
          {toast}
        </div>
      )}
    </div>
  );
}
