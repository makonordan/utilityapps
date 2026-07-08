"use client";

import { useEffect, useState } from "react";

import { VideoDropZone } from "@/components/video-tools/VideoDropZone";
import { VideoRunBar, type VideoRunResult } from "@/components/video-tools/VideoRunBar";
import { getFFmpeg, runFFmpeg } from "@/lib/ffmpegClient";
import { VIDEO_TOOLS_CONFIG, getVideoSupportedFormats } from "@/lib/videoTools";
import { cn } from "@/lib/utils";

const TOOL_ID = "video-resizer";

interface Preset {
  id: string;
  label: string;
  width: number;
  height: number;
  desc: string;
}

const PRESETS: Preset[] = [
  { id: "reel", label: "Reel / Short", width: 1080, height: 1920, desc: "9:16 — IG Reel, TikTok, YT Short" },
  { id: "square", label: "Square", width: 1080, height: 1080, desc: "1:1 — Instagram feed" },
  { id: "youtube", label: "Landscape 1080p", width: 1920, height: 1080, desc: "16:9 — YouTube, Twitter/X" },
  { id: "720p", label: "Landscape 720p", width: 1280, height: 720, desc: "16:9 — lighter file size" },
];

function getExt(name: string): string {
  return name.split(".").pop()?.toLowerCase() || "mp4";
}

function probeSize(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const v = document.createElement("video");
    v.preload = "metadata";
    v.muted = true;
    v.src = url;
    v.onloadedmetadata = () => {
      const w = v.videoWidth || 0;
      const h = v.videoHeight || 0;
      URL.revokeObjectURL(url);
      resolve({ width: w, height: h });
    };
    v.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({ width: 0, height: 0 });
    };
  });
}

export function VideoResizer() {
  const [file, setFile] = useState<File | null>(null);
  const [source, setSource] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [presetId, setPresetId] = useState<string>("reel");
  const [width, setWidth] = useState(1080);
  const [height, setHeight] = useState(1920);
  const [lockAspect, setLockAspect] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<VideoRunResult | null>(null);

  const cfg = VIDEO_TOOLS_CONFIG[TOOL_ID];

  useEffect(() => {
    if (!file) return;
    probeSize(file).then(setSource);
  }, [file]);

  const handleFile = (f: File) => {
    setFile(f);
    setResult(null);
    setError(null);
  };

  const handlePreset = (id: string) => {
    setPresetId(id);
    const preset = PRESETS.find((p) => p.id === id);
    if (preset) {
      setWidth(preset.width);
      setHeight(preset.height);
    }
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
      setStatus("Resizing and encoding…");
      const inputName = `input.${getExt(file.name)}`;
      const baseName = file.name.replace(/\.[^.]+$/, "") || "video";
      // ffmpeg requires even dimensions for libx264.
      const evenW = width % 2 === 0 ? width : width + 1;
      const evenH = height % 2 === 0 ? height : height + 1;
      const scaleFilter = lockAspect
        ? `scale=w=${evenW}:h=${evenH}:force_original_aspect_ratio=decrease,pad=${evenW}:${evenH}:(ow-iw)/2:(oh-ih)/2:black`
        : `scale=${evenW}:${evenH}`;
      const { blob, durationMs } = await runFFmpeg(file, {
        inputName,
        outputName: "output.mp4",
        outputMime: "video/mp4",
        args: [
          "-i", inputName,
          "-vf", scaleFilter,
          "-c:v", "libx264",
          // superfast keeps the resize tool snappy; quality at CRF 26 is
          // still visually clean for social-media-sized output.
          "-preset", "superfast",
          "-tune", "fastdecode",
          "-crf", "26",
          "-c:a", "aac",
          "-b:a", "128k",
          "-movflags", "+faststart",
          "output.mp4",
        ],
        onProgress: (p) => setProgress(0.2 + p * 0.8),
      });
      setResult({
        blob,
        filename: `${baseName}-${evenW}x${evenH}.mp4`,
        mimeType: "video/mp4",
        originalSize: file.size,
        durationMs,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Resize failed.");
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
        <div className="space-y-4 rounded-2xl border border-surface-200 bg-white p-4 dark:border-surface-800 dark:bg-surface-900">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
              Presets
            </p>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handlePreset(p.id)}
                  className={cn(
                    "flex flex-col items-start rounded-xl border p-3 text-left transition",
                    presetId === p.id
                      ? "border-primary-500 bg-primary-50 dark:border-primary-400 dark:bg-primary-500/10"
                      : "border-surface-200 hover:border-primary-300 dark:border-surface-800 dark:hover:border-primary-700"
                  )}
                >
                  <span className="text-sm font-semibold text-surface-900 dark:text-white">
                    {p.label}
                  </span>
                  <span className="mt-1 text-[11px] text-surface-500 dark:text-surface-400">
                    {p.width}×{p.height} — {p.desc}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-surface-700 dark:text-surface-300">
                Width (px)
              </span>
              <input
                type="number"
                min={16}
                max={7680}
                step={2}
                value={width}
                onChange={(e) => {
                  setWidth(Math.max(16, Number(e.target.value)));
                  setPresetId("custom");
                }}
                className="rounded-lg border border-surface-300 bg-white px-3 py-2 text-sm text-surface-900 dark:border-surface-700 dark:bg-surface-900 dark:text-white"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-surface-700 dark:text-surface-300">
                Height (px)
              </span>
              <input
                type="number"
                min={16}
                max={4320}
                step={2}
                value={height}
                onChange={(e) => {
                  setHeight(Math.max(16, Number(e.target.value)));
                  setPresetId("custom");
                }}
                className="rounded-lg border border-surface-300 bg-white px-3 py-2 text-sm text-surface-900 dark:border-surface-700 dark:bg-surface-900 dark:text-white"
              />
            </label>
          </div>

          <label className="flex items-center gap-2 text-sm text-surface-700 dark:text-surface-300">
            <input
              type="checkbox"
              checked={lockAspect}
              onChange={(e) => setLockAspect(e.target.checked)}
              className="h-4 w-4 rounded border-surface-400 accent-primary-600"
            />
            Preserve aspect ratio (letterbox / pillarbox to fit)
          </label>

          {source.width > 0 && (
            <p className="text-[11px] text-surface-500 dark:text-surface-400">
              Source: {source.width}×{source.height}
            </p>
          )}
        </div>
      )}

      <VideoRunBar
        canRun={!!file && width > 0 && height > 0 && !isRunning}
        isRunning={isRunning}
        progress={progress}
        status={status}
        error={error}
        result={result}
        onRun={handleRun}
        runLabel="Resize video"
        disabledHint={file ? undefined : "Upload a video to start."}
      />
    </div>
  );
}
