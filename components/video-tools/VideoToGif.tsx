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

const TOOL_ID = "video-to-gif";
const FPS_OPTIONS = [10, 12, 15, 20, 24] as const;
const WIDTH_OPTIONS = [240, 320, 480, 640, 800] as const;
const MAX_GIF_SECONDS = 30;

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

export function VideoToGif() {
  const [file, setFile] = useState<File | null>(null);
  const [duration, setDuration] = useState(0);
  const [start, setStart] = useState(0);
  const [length, setLength] = useState(5);
  const [fps, setFps] = useState<(typeof FPS_OPTIONS)[number]>(10);
  const [width, setWidth] = useState<(typeof WIDTH_OPTIONS)[number]>(480);
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
      setLength(Math.min(MAX_GIF_SECONDS, Math.max(1, Math.min(5, d))));
    });
  }, [file]);

  const handleFile = (f: File) => {
    setFile(f);
    setResult(null);
    setError(null);
  };

  const effectiveLength = Math.min(length, Math.max(0, duration - start), MAX_GIF_SECONDS);
  const validRange = duration > 0 && effectiveLength >= 0.5;

  const handleRun = async () => {
    if (!file || !validRange) return;
    setIsRunning(true);
    setError(null);
    setResult(null);
    setProgress(0);
    try {
      setStatus("Loading video engine…");
      await getFFmpeg({ onDownloadProgress: (r) => setProgress(r * 0.3) });
      setStatus("Building GIF (palette pass)…");
      const inputName = `input.${getExt(file.name)}`;
      const baseName = file.name.replace(/\.[^.]+$/, "") || "video";
      // Two-pass palette workflow for clean colours.
      const vf = `fps=${fps},scale=${width}:-1:flags=lanczos,split[a][b];[a]palettegen=stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=5`;
      const { blob, durationMs } = await runFFmpeg(file, {
        inputName,
        outputName: "output.gif",
        outputMime: "image/gif",
        args: [
          "-ss", start.toFixed(2),
          "-t", effectiveLength.toFixed(2),
          "-i", inputName,
          "-vf", vf,
          "-loop", "0",
          "output.gif",
        ],
        onProgress: (p) => setProgress(0.3 + p * 0.7),
      });
      setResult({
        blob,
        filename: `${baseName}.gif`,
        mimeType: "image/gif",
        originalSize: file.size,
        durationMs,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "GIF conversion failed.");
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
        <div className="space-y-4 rounded-2xl border border-surface-200 bg-white p-4 dark:border-surface-800 dark:bg-surface-900">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
              Clip — {formatTimestamp(start)} for {effectiveLength.toFixed(1)} s
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="flex flex-col gap-1">
                <span className="text-xs font-medium text-surface-700 dark:text-surface-300">
                  Start (seconds)
                </span>
                <input
                  type="number"
                  min={0}
                  max={Math.max(0, duration - 0.5)}
                  step={0.1}
                  value={start.toFixed(2)}
                  onChange={(e) =>
                    setStart(Math.max(0, Math.min(duration - 0.5, Number(e.target.value))))
                  }
                  className="rounded-lg border border-surface-300 bg-white px-3 py-2 text-sm text-surface-900 dark:border-surface-700 dark:bg-surface-900 dark:text-white"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-xs font-medium text-surface-700 dark:text-surface-300">
                  Length (seconds, max {MAX_GIF_SECONDS})
                </span>
                <input
                  type="number"
                  min={0.5}
                  max={MAX_GIF_SECONDS}
                  step={0.1}
                  value={length.toFixed(2)}
                  onChange={(e) =>
                    setLength(Math.max(0.5, Math.min(MAX_GIF_SECONDS, Number(e.target.value))))
                  }
                  className="rounded-lg border border-surface-300 bg-white px-3 py-2 text-sm text-surface-900 dark:border-surface-700 dark:bg-surface-900 dark:text-white"
                />
              </label>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-surface-700 dark:text-surface-300">
                Frame rate (fps)
              </span>
              <select
                value={fps}
                onChange={(e) => setFps(Number(e.target.value) as (typeof FPS_OPTIONS)[number])}
                className="rounded-lg border border-surface-300 bg-white px-3 py-2 text-sm text-surface-900 dark:border-surface-700 dark:bg-surface-900 dark:text-white"
              >
                {FPS_OPTIONS.map((f) => (
                  <option key={f} value={f}>
                    {f} fps
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-surface-700 dark:text-surface-300">
                Width (px)
              </span>
              <select
                value={width}
                onChange={(e) =>
                  setWidth(Number(e.target.value) as (typeof WIDTH_OPTIONS)[number])
                }
                className="rounded-lg border border-surface-300 bg-white px-3 py-2 text-sm text-surface-900 dark:border-surface-700 dark:bg-surface-900 dark:text-white"
              >
                {WIDTH_OPTIONS.map((w) => (
                  <option key={w} value={w}>
                    {w}px
                  </option>
                ))}
              </select>
            </label>
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
        runLabel="Convert to GIF"
        disabledHint={file ? "Pick a clip range and settings." : "Upload a video to start."}
      />
    </div>
  );
}
