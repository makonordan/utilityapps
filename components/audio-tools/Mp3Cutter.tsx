"use client";

import { useEffect, useState } from "react";

import { AudioDropZone } from "@/components/audio-tools/AudioDropZone";
import { AudioRunBar, type AudioRunResult } from "@/components/audio-tools/AudioRunBar";
import { getFFmpeg, runFFmpeg } from "@/lib/ffmpegClient";

function getExt(name: string): string {
  return name.split(".").pop()?.toLowerCase() || "mp3";
}

function fmt(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

function probeDuration(file: File): Promise<number> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const a = document.createElement("audio");
    a.preload = "metadata";
    a.src = url;
    a.onloadedmetadata = () => {
      const d = isFinite(a.duration) ? a.duration : 0;
      URL.revokeObjectURL(url);
      resolve(d);
    };
    a.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(0);
    };
  });
}

export function Mp3Cutter() {
  const [file, setFile] = useState<File | null>(null);
  const [duration, setDuration] = useState(0);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AudioRunResult | null>(null);

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
      setStatus("Loading audio engine…");
      await getFFmpeg({ onDownloadProgress: (r) => setProgress(r * 0.3) });
      setStatus("Cutting (stream-copy, no re-encode)…");
      const ext = getExt(file.name);
      const inputName = `input.${ext}`;
      const outputName = `output.${ext}`;
      const baseName = file.name.replace(/\.[^.]+$/, "") || "audio";
      const { blob, durationMs } = await runFFmpeg(file, {
        inputName,
        outputName,
        outputMime: file.type || "audio/mpeg",
        args: ["-ss", start.toFixed(2), "-to", end.toFixed(2), "-i", inputName, "-c", "copy", outputName],
        onProgress: (p) => setProgress(0.3 + p * 0.7),
      });
      setResult({ blob, filename: `${baseName}-cut.${ext}`, mimeType: file.type || "audio/mpeg", durationMs });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Cut failed.");
    } finally {
      setIsRunning(false);
      setStatus("");
    }
  };

  return (
    <div className="space-y-6">
      <AudioDropZone onFileSelected={handleFile} />

      {file && duration > 0 && (
        <div className="rounded-2xl border border-surface-200 bg-white p-4 dark:border-surface-800 dark:bg-surface-900">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
            Cut range — {fmt(start)} to {fmt(end)} ({(end - start).toFixed(1)} s)
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-surface-700 dark:text-surface-300">Start (seconds)</span>
              <input
                type="number"
                min={0}
                max={Math.max(0, end - 0.1)}
                step={0.1}
                value={start.toFixed(2)}
                onChange={(e) => setStart(Math.max(0, Math.min(end - 0.1, Number(e.target.value))))}
                className="rounded-lg border border-surface-300 bg-white px-3 py-2 text-sm text-surface-900 dark:border-surface-700 dark:bg-surface-900 dark:text-white"
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium text-surface-700 dark:text-surface-300">End (seconds)</span>
              <input
                type="number"
                min={Math.max(0, start + 0.1)}
                max={duration}
                step={0.1}
                value={end.toFixed(2)}
                onChange={(e) => setEnd(Math.max(start + 0.1, Math.min(duration, Number(e.target.value))))}
                className="rounded-lg border border-surface-300 bg-white px-3 py-2 text-sm text-surface-900 dark:border-surface-700 dark:bg-surface-900 dark:text-white"
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

      <AudioRunBar
        canRun={!!file && validRange && !isRunning}
        isRunning={isRunning}
        progress={progress}
        status={status}
        error={error}
        result={result}
        onRun={handleRun}
        runLabel="Cut audio"
        disabledHint={file ? "Set a valid start/end range." : "Upload an audio file to start."}
      />
    </div>
  );
}
