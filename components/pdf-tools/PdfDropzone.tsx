"use client";

import { useId, useState, type ChangeEvent, type DragEvent } from "react";
import { FileText, Upload } from "lucide-react";

import { cn } from "@/lib/utils";

interface Props {
  onFiles: (files: File[]) => void;
  multiple?: boolean;
  accept?: string;
  label?: string;
  sublabel?: string;
  className?: string;
}

export function PdfDropzone({
  onFiles,
  multiple = false,
  accept = "application/pdf",
  label = "Drop a PDF here or click to choose",
  sublabel = "Your file never leaves the browser",
  className,
}: Props) {
  const inputId = useId();
  const [dragging, setDragging] = useState(false);

  const handleFiles = (files: FileList | File[] | null) => {
    if (!files) return;
    const arr = Array.from(files).filter((f) => {
      if (!accept) return true;
      if (accept === "application/pdf") return f.type === "application/pdf";
      // For mixed accept, trust the input element / drop
      return true;
    });
    if (!arr.length) return;
    onFiles(multiple ? arr : [arr[0]]);
  };

  const onDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    // Allow re-selecting the same file by resetting the input value.
    e.target.value = "";
  };

  return (
    <label
      htmlFor={inputId}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-10 text-center transition",
        dragging
          ? "border-red-400 bg-red-50 dark:border-red-500/50 dark:bg-red-500/10"
          : "border-surface-300 bg-white hover:border-red-300 dark:border-surface-700 dark:bg-surface-900 dark:hover:border-red-500/40",
        className
      )}
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-600 dark:text-red-400">
        {dragging ? <FileText className="h-6 w-6" /> : <Upload className="h-6 w-6" />}
      </span>
      <span className="text-sm font-semibold text-surface-900 dark:text-white">{label}</span>
      <span className="text-xs text-surface-500 dark:text-surface-400">{sublabel}</span>
      <input
        id={inputId}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={onChange}
        className="sr-only"
      />
    </label>
  );
}
