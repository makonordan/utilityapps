"use client";

import { useEffect, useState } from "react";

import { VideoDropZone } from "@/components/video-tools/VideoDropZone";
import { VideoRunBar, type VideoRunResult } from "@/components/video-tools/VideoRunBar";
import { getFFmpeg } from "@/lib/ffmpegClient";
import {
  VIDEO_TOOLS_CONFIG,
  formatTimestamp,
  getVideoSupportedFormats,
} from "@/lib/videoTools";
import { cn } from "@/lib/utils";

type Mode = "interval" | "all" | "single";
type ImageFormat = "png" | "jpg";

const TOOL_ID = "video-frame-extractor";

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

export function FrameExtractor() {
  const [file, setFile] = useState<File | null>(null);
  const [duration, setDuration] = useState(0);
  const [mode, setMode] = useState<Mode>("interval");
  const [intervalSeconds, setIntervalSeconds] = useState(1);
  const [singleTimestamp, setSingleTimestamp] = useState(0);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(0);
  const [format, setFormat] = useState<ImageFormat>("png");
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
      setSingleTimestamp(Math.min(1, d / 2));
    });
  }, [file]);

  const handleFile = (f: File) => {
    setFile(f);
    setResult(null);
    setError(null);
  };

  const canRun = !!file && duration > 0 && (mode !== "interval" || intervalSeconds > 0);

  async function bundleFramesAsZip(framePaths: string[], extension: string): Promise<Blob> {
    const ff = await getFFmpeg();
    const { default: JSZip } = await import("jszip");
    const zip = new JSZip();
    for (const path of framePaths) {
      const data = await ff.readFile(path);
      const bytes = data instanceof Uint8Array ? data : new TextEncoder().encode(String(data));
      zip.file(path, bytes as Uint8Array);
      try { await ff.deleteFile(path); } catch { /* ignore */ }
    }
    return zip.generateAsync({ type: "blob", compression: "DEFLATE" });
  }

  const handleRun = async () => {
    if (!file || !canRun) return;
    setIsRunning(true);
    setError(null);
    setResult(null);
    setProgress(0);
    try {
      setStatus("Loading video engine…");
      const ff = await getFFmpeg({ onDownloadProgress: (r) => setProgress(r * 0.3) });
      setStatus("Decoding frames…");

      const { fetchFile } = await import("@ffmpeg/util");
      const inputName = `input.${getExt(file.name)}`;
      const ext = format;
      const mime = format === "png" ? "image/png" : "image/jpeg";
      const baseName = file.name.replace(/\.[^.]+$/, "") || "video";

      await ff.writeFile(inputName, await fetchFile(file));

      let exitCode: number;
      let producedFiles: string[];

      const progressHandler = ({ progress: p }: { progress: number }) => {
        setProgress(0.3 + Math.max(0, Math.min(1, p)) * 0.6);
      };
      ff.on("progress", progressHandler);
      try {
        if (mode === "single") {
          exitCode = await ff.exec([
            "-ss", singleTimestamp.toFixed(2),
            "-i", inputName,
            "-frames:v", "1",
            "-q:v", "2",
            `frame.${ext}`,
          ]);
          producedFiles = [`frame.${ext}`];
        } else if (mode === "interval") {
          const fps = 1 / Math.max(0.1, intervalSeconds);
          exitCode = await ff.exec([
            "-ss", start.toFixed(2),
            "-to", end.toFixed(2),
            "-i", inputName,
            "-vf", `fps=${fps.toFixed(4)}`,
            "-q:v", "2",
            `frame_%04d.${ext}`,
          ]);
          // We don't know the count up-front — list virtual FS instead.
          const listing = (await ff.listDir("/")) as Array<{ name: string }>;
          producedFiles = listing
            .map((entry) => entry.name)
            .filter((name) => name.startsWith("frame_") && name.endsWith(`.${ext}`))
            .sort();
        } else {
          // mode === "all"
          exitCode = await ff.exec([
            "-ss", start.toFixed(2),
            "-to", end.toFixed(2),
            "-i", inputName,
            "-q:v", "2",
            `frame_%05d.${ext}`,
          ]);
          const listing = (await ff.listDir("/")) as Array<{ name: string }>;
          producedFiles = listing
            .map((entry) => entry.name)
            .filter((name) => name.startsWith("frame_") && name.endsWith(`.${ext}`))
            .sort();
        }
      } finally {
        ff.off("progress", progressHandler);
        try { await ff.deleteFile(inputName); } catch { /* ignore */ }
      }

      if (exitCode !== 0) throw new Error(`FFmpeg exited with code ${exitCode}`);
      if (producedFiles.length === 0) throw new Error("No frames produced — check the time range.");

      const started = performance.now();

      if (producedFiles.length === 1) {
        setStatus("Reading frame…");
        const data = await ff.readFile(producedFiles[0]);
        const bytes = data instanceof Uint8Array ? data : new TextEncoder().encode(String(data));
        try { await ff.deleteFile(producedFiles[0]); } catch { /* ignore */ }
        const blob = new Blob([bytes as BlobPart], { type: mime });
        setProgress(1);
        setResult({
          blob,
          filename: `${baseName}-frame.${ext}`,
          mimeType: mime,
          durationMs: performance.now() - started,
        });
      } else {
        setStatus(`Bundling ${producedFiles.length} frames into ZIP…`);
        setProgress(0.95);
        const zipBlob = await bundleFramesAsZip(producedFiles, ext);
        setProgress(1);
        setResult({
          blob: zipBlob,
          filename: `${baseName}-frames.zip`,
          mimeType: "application/zip",
          durationMs: performance.now() - started,
        });
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Frame extraction failed.");
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
              Extraction mode
            </p>
            <div className="grid gap-2 sm:grid-cols-3">
              {[
                { id: "interval" as const, label: "Every N seconds" },
                { id: "all" as const, label: "All frames" },
                { id: "single" as const, label: "Single frame" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setMode(opt.id)}
                  className={cn(
                    "rounded-xl border px-3 py-2 text-sm font-semibold transition",
                    mode === opt.id
                      ? "border-primary-500 bg-primary-50 text-primary-700 dark:border-primary-400 dark:bg-primary-500/10 dark:text-primary-200"
                      : "border-surface-200 text-surface-700 hover:border-primary-300 dark:border-surface-800 dark:text-surface-200 dark:hover:border-primary-700"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {mode === "single" ? (
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-surface-700 dark:text-surface-300">
                Timestamp (seconds) — {formatTimestamp(singleTimestamp)}
              </span>
              <input
                type="number"
                min={0}
                max={duration}
                step={0.1}
                value={singleTimestamp.toFixed(2)}
                onChange={(e) =>
                  setSingleTimestamp(Math.max(0, Math.min(duration, Number(e.target.value))))
                }
                className="rounded-lg border border-surface-300 bg-white px-3 py-2 text-sm text-surface-900 dark:border-surface-700 dark:bg-surface-900 dark:text-white"
              />
            </label>
          ) : (
            <div className="grid gap-3 sm:grid-cols-3">
              <label className="flex flex-col gap-1">
                <span className="text-xs font-medium text-surface-700 dark:text-surface-300">
                  Start (s)
                </span>
                <input
                  type="number"
                  min={0}
                  max={Math.max(0, end - 0.1)}
                  step={0.1}
                  value={start.toFixed(2)}
                  onChange={(e) =>
                    setStart(Math.max(0, Math.min(end - 0.1, Number(e.target.value))))
                  }
                  className="rounded-lg border border-surface-300 bg-white px-3 py-2 text-sm text-surface-900 dark:border-surface-700 dark:bg-surface-900 dark:text-white"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-xs font-medium text-surface-700 dark:text-surface-300">
                  End (s)
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
                  className="rounded-lg border border-surface-300 bg-white px-3 py-2 text-sm text-surface-900 dark:border-surface-700 dark:bg-surface-900 dark:text-white"
                />
              </label>
              {mode === "interval" && (
                <label className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-surface-700 dark:text-surface-300">
                    Interval (s)
                  </span>
                  <input
                    type="number"
                    min={0.1}
                    step={0.1}
                    value={intervalSeconds}
                    onChange={(e) =>
                      setIntervalSeconds(Math.max(0.1, Number(e.target.value)))
                    }
                    className="rounded-lg border border-surface-300 bg-white px-3 py-2 text-sm text-surface-900 dark:border-surface-700 dark:bg-surface-900 dark:text-white"
                  />
                </label>
              )}
            </div>
          )}

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
              Image format
            </p>
            <div className="inline-flex rounded-lg border border-surface-200 bg-white p-1 dark:border-surface-800 dark:bg-surface-900">
              {(["png", "jpg"] as ImageFormat[]).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setFormat(opt)}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-xs font-semibold transition",
                    format === opt
                      ? "bg-primary-600 text-white"
                      : "text-surface-700 hover:text-primary-700 dark:text-surface-200 dark:hover:text-primary-300"
                  )}
                >
                  {opt.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <VideoRunBar
        canRun={canRun && !isRunning}
        isRunning={isRunning}
        progress={progress}
        status={status}
        error={error}
        result={result}
        onRun={handleRun}
        runLabel="Extract frames"
        disabledHint={file ? "Configure the extraction settings." : "Upload a video to start."}
      />
    </div>
  );
}
