"use client";

import { useEffect, useState } from "react";

import { VideoDropZone } from "@/components/video-tools/VideoDropZone";
import { VideoRunBar, type VideoRunResult } from "@/components/video-tools/VideoRunBar";
import { getFFmpeg, runFFmpeg } from "@/lib/ffmpegClient";
import {
  VIDEO_TOOLS_CONFIG,
  formatTimestamp,
  getVideoSupportedFormats,
} from "@/lib/videoTools";

const TOOL_ID = "video-trimmer";

function getExt(name: string): string {
  return name.split(".").pop()?.toLowerCase() || "mp4";
}

function probeDuration(file: File): Promise<number> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const v = document.createElement("video");
    v.preload = "metadata";
    v.muted = true;
    v.src = url;
    v.onloadedmetadata = () => {
      const d = isFinite(v.duration) ? v.duration : 0;
      URL.revokeObjectURL(url);
      resolve(d);
    };
    v.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(0);
    };
  });
}

export function VideoTrimmer() {
  const [file, setFile] = useState<File | null>(null);
  const [duration, setDuration] = useState(0);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<VideoRunResult | null>(null);

  const cfg = VIDEO_TOOLS_CONFIG[TOOL_ID];

  useEffect(() => {
    if (!file) return;
    probeDuration(file).then((d) => {
      setDuration(d);
      setStart(0);
      setEnd(d);
    });
  }, [file]);

  const handleFile = (f: File) => {
    setFile(f);
    setResult(null);
    setError(null);
  };

  const validRange = end > start && end - start >= 0.1;

  const handleRun = async () => {
    if (!file || !validRange) return;
    setIsRunning(true);
    setError(null);
    setResult(null);
    setProgress(0);
    try {
      setStatus("Loading video engine…");
      await getFFmpeg({ onDownloadProgress: (r) => setProgress(r * 0.3) });
      setStatus("Trimming (stream-copy, no re-encode)…");
      const ext = getExt(file.name);
      const inputName = `input.${ext}`;
      const outputName = `output.${ext}`;
      const baseName = file.name.replace(/\.[^.]+$/, "") || "video";
      const { blob, durationMs } = await runFFmpeg(file, {
        inputName,
        outputName,
        outputMime: file.type || "video/mp4",
        args: [
          "-ss", start.toFixed(2),
          "-to", end.toFixed(2),
          "-i", inputName,
          "-c", "copy",
          "-avoid_negative_ts", "make_zero",
          outputName,
        ],
        onProgress: (p) => setProgress(0.3 + p * 0.7),
      });
      setResult({
        blob,
        filename: `${baseName}-trimmed.${ext}`,
        mimeType: file.type || "video/mp4",
        originalSize: file.size,
        durationMs,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Trim failed.");
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

      {file && duration > 0 && (
        <div className="rounded-2xl border border-surface-200 bg-white p-4 dark:border-surface-800 dark:bg-surface-900">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
            Trim range — {formatTimestamp(start)} to {formatTimestamp(end)} (
            {(end - start).toFixed(1)} s)
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-surface-700 dark:text-surface-300">
                Start (seconds)
              </span>
              <input
                type="number"
                min={0}
                max={Math.max(0, end - 0.1)}
                step={0.1}
                value={start.toFixed(2)}
                onChange={(e) => setStart(Math.max(0, Math.min(end - 0.1, Number(e.target.value))))}
                className="rounded-lg border border-surface-300 bg-white px-3 py-2 text-sm text-surface-900 focus:border-primary-400 focus:outline-none dark:border-surface-700 dark:bg-surface-900 dark:text-white"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-surface-700 dark:text-surface-300">
                End (seconds)
              </span>
              <input
                type="number"
                min={Math.max(0, start + 0.1)}
                max={duration}
                step={0.1}
                value={end.toFixed(2)}
                onChange={(e) =>
                  setEnd(Math.max(start + 0.1, Math.min(duration, Number(e.target.value))))
                }
                className="rounded-lg border border-surface-300 bg-white px-3 py-2 text-sm text-surface-900 focus:border-primary-400 focus:outline-none dark:border-surface-700 dark:bg-surface-900 dark:text-white"
              />
            </label>
          </div>
          <div className="mt-3 space-y-2">
            <input
              type="range"
              min={0}
              max={Math.max(0, end - 0.1)}
              step={0.1}
              value={start}
              onChange={(e) => setStart(Number(e.target.value))}
              className="w-full accent-primary-600"
              aria-label="Start time"
            />
            <input
              type="range"
              min={Math.max(0, start + 0.1)}
              max={duration}
              step={0.1}
              value={end}
              onChange={(e) => setEnd(Number(e.target.value))}
              className="w-full accent-primary-600"
              aria-label="End time"
            />
          </div>
        </div>
      )}

      <VideoRunBar
        canRun={!!file && validRange && !isRunning}
        isRunning={isRunning}
        progress={progress}
        status={status}
        error={error}
        result={result}
        onRun={handleRun}
        runLabel="Trim video"
        disabledHint={file ? "Set a valid start/end range." : "Upload a video to start."}
      />
    </div>
  );
}
