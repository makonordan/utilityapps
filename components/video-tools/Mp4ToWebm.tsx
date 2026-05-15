"use client";

import { useState } from "react";

import { VideoDropZone } from "@/components/video-tools/VideoDropZone";
import { VideoRunBar, type VideoRunResult } from "@/components/video-tools/VideoRunBar";
import { getFFmpeg, runFFmpeg } from "@/lib/ffmpegClient";
import { VIDEO_TOOLS_CONFIG, getVideoSupportedFormats } from "@/lib/videoTools";
import { cn } from "@/lib/utils";

type Quality = "low" | "medium" | "high";

const QUALITY_OPTIONS: { id: Quality; label: string; crf: number; desc: string }[] = [
  { id: "low", label: "Low", crf: 36, desc: "Smallest file, fastest encode" },
  { id: "medium", label: "Medium", crf: 30, desc: "Recommended for web video" },
  { id: "high", label: "High", crf: 24, desc: "Best quality, larger file" },
];

const TOOL_ID = "mp4-to-webm";

function getExt(name: string): string {
  return name.split(".").pop()?.toLowerCase() || "mp4";
}

export function Mp4ToWebm() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState<Quality>("medium");
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
      setStatus("Encoding (VP8)…");
      const crf = QUALITY_OPTIONS.find((q) => q.id === quality)!.crf;
      const inputName = `input.${getExt(file.name)}`;
      const baseName = file.name.replace(/\.[^.]+$/, "") || "video";
      // VP8 used (not VP9) because @ffmpeg/core single-thread build ships with
      // libvpx but not libvpx-vp9 in some versions. VP8 is universally present.
      const { blob, durationMs } = await runFFmpeg(file, {
        inputName,
        outputName: "output.webm",
        outputMime: "video/webm",
        args: [
          "-i", inputName,
          "-c:v", "libvpx",
          // libvpx defaults are extremely slow; "-deadline realtime -cpu-used
          // 5" is the documented fast path and runs roughly 5–10× quicker
          // with only modest quality cost — appropriate for a browser tool.
          "-deadline", "realtime",
          "-cpu-used", "5",
          "-crf", String(crf),
          "-b:v", "1M",
          "-c:a", "libvorbis",
          "-b:a", "128k",
          "output.webm",
        ],
        onProgress: (p) => setProgress(0.2 + p * 0.8),
      });
      setResult({
        blob,
        filename: `${baseName}.webm`,
        mimeType: "video/webm",
        originalSize: file.size,
        durationMs,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "WebM conversion failed.");
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
            Quality
          </p>
          <div className="grid gap-2 sm:grid-cols-3">
            {QUALITY_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setQuality(opt.id)}
                className={cn(
                  "flex flex-col items-start rounded-xl border p-3 text-left transition",
                  quality === opt.id
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
        runLabel="Convert to WebM"
        disabledHint={file ? undefined : "Upload a video to start."}
      />
    </div>
  );
}
