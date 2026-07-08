"use client";

import { useState } from "react";

import { VideoDropZone } from "@/components/video-tools/VideoDropZone";
import { VideoRunBar, type VideoRunResult } from "@/components/video-tools/VideoRunBar";
import { getFFmpeg, runFFmpeg } from "@/lib/ffmpegClient";
import { VIDEO_TOOLS_CONFIG, getVideoSupportedFormats } from "@/lib/videoTools";
import { cn } from "@/lib/utils";

type Format = "mp3" | "aac";

const FORMAT_OPTIONS: { id: Format; label: string; mime: string; ext: string; desc: string }[] = [
  { id: "mp3", label: "MP3", mime: "audio/mpeg", ext: "mp3", desc: "Universal compatibility" },
  { id: "aac", label: "AAC", mime: "audio/aac", ext: "aac", desc: "Smaller at same quality" },
];

const TOOL_ID = "extract-audio-from-video";

function getExt(name: string): string {
  return name.split(".").pop()?.toLowerCase() || "mp4";
}

export function ExtractAudio() {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<Format>("mp3");
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<VideoRunResult | null>(null);

  const cfg = VIDEO_TOOLS_CONFIG[TOOL_ID];

  const handleFile = (f: File) => {
    setFile(f);
    setResult(null);
    setError(null);
  };

  const handleRun = async () => {
    if (!file) return;
    setIsRunning(true);
    setError(null);
    setResult(null);
    setProgress(0);
    try {
      setStatus("Loading video engine…");
      await getFFmpeg({ onDownloadProgress: (r) => setProgress(r * 0.2) });
      setStatus("Extracting audio…");
      const opt = FORMAT_OPTIONS.find((f) => f.id === format)!;
      const inputName = `input.${getExt(file.name)}`;
      const outputName = `output.${opt.ext}`;
      const baseName = file.name.replace(/\.[^.]+$/, "") || "audio";
      const codecArgs =
        format === "mp3"
          ? ["-c:a", "libmp3lame", "-q:a", "2"]
          : ["-c:a", "aac", "-b:a", "192k"];
      const { blob, durationMs } = await runFFmpeg(file, {
        inputName,
        outputName,
        outputMime: opt.mime,
        args: ["-i", inputName, "-vn", ...codecArgs, outputName],
        onProgress: (p) => setProgress(0.2 + p * 0.8),
      });
      setResult({
        blob,
        filename: `${baseName}.${opt.ext}`,
        mimeType: opt.mime,
        originalSize: file.size,
        durationMs,
        audio: true,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Audio extraction failed.");
    } finally {
      setIsRunning(false);
      setStatus("");
    }
  };

  return (
    <div className="space-y-6">
      <VideoDropZone
        onFileSelected={handleFile}
        acceptedFormats={cfg.acceptedFormats}
        maxSizeMB={cfg.maxFileSizeMB}
        formatLabels={getVideoSupportedFormats(TOOL_ID)}
      />

      {file && (
        <div className="rounded-2xl border border-surface-200 bg-white p-4 dark:border-surface-800 dark:bg-surface-900">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
            Output format
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {FORMAT_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setFormat(opt.id)}
                className={cn(
                  "flex flex-col items-start rounded-xl border p-3 text-left transition",
                  format === opt.id
                    ? "border-primary-500 bg-primary-50 dark:border-primary-400 dark:bg-primary-500/10"
                    : "border-surface-200 hover:border-primary-300 dark:border-surface-800 dark:hover:border-primary-700"
                )}
              >
                <span className="text-sm font-semibold text-surface-900 dark:text-white">
                  {opt.label}
                </span>
                <span className="mt-1 text-[11px] text-surface-500 dark:text-surface-400">
                  {opt.desc}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      <VideoRunBar
        canRun={!!file && !isRunning}
        isRunning={isRunning}
        progress={progress}
        status={status}
        error={error}
        result={result}
        onRun={handleRun}
        runLabel="Extract audio"
        disabledHint={file ? undefined : "Upload a video to start."}
      />
    </div>
  );
}
