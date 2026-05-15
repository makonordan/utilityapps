"use client";

import { useState } from "react";

import { AudioDropZone } from "@/components/audio-tools/AudioDropZone";
import { AudioRunBar, type AudioRunResult } from "@/components/audio-tools/AudioRunBar";
import { getFFmpeg, runFFmpeg } from "@/lib/ffmpegClient";
import { cn } from "@/lib/utils";

interface FormatDef {
  id: string;
  label: string;
  ext: string;
  mime: string;
  args: (input: string, output: string) => string[];
  lossless?: boolean;
}

const FORMATS: FormatDef[] = [
  {
    id: "mp3",
    label: "MP3",
    ext: "mp3",
    mime: "audio/mpeg",
    args: (i, o) => ["-i", i, "-vn", "-c:a", "libmp3lame", "-b:a", "192k", o],
  },
  {
    id: "wav",
    label: "WAV",
    ext: "wav",
    mime: "audio/wav",
    lossless: true,
    args: (i, o) => ["-i", i, "-vn", o],
  },
  {
    id: "ogg",
    label: "OGG",
    ext: "ogg",
    mime: "audio/ogg",
    args: (i, o) => ["-i", i, "-vn", "-c:a", "libvorbis", "-q:a", "5", o],
  },
  {
    id: "flac",
    label: "FLAC",
    ext: "flac",
    mime: "audio/flac",
    lossless: true,
    args: (i, o) => ["-i", i, "-vn", "-c:a", "flac", o],
  },
  {
    id: "aac",
    label: "AAC / M4A",
    ext: "m4a",
    mime: "audio/mp4",
    args: (i, o) => ["-i", i, "-vn", "-c:a", "aac", "-b:a", "192k", o],
  },
  {
    id: "opus",
    label: "OPUS",
    ext: "opus",
    mime: "audio/opus",
    args: (i, o) => ["-i", i, "-vn", "-c:a", "libopus", "-b:a", "128k", o],
  },
];

function getExt(name: string): string {
  return name.split(".").pop()?.toLowerCase() || "mp3";
}

export function AudioConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [formatId, setFormatId] = useState("mp3");
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AudioRunResult | null>(null);

  const handleFile = (f: File) => {
    setFile(f);
    setResult(null);
    setError(null);
  };

  const handleRun = async () => {
    if (!file) return;
    const fmt = FORMATS.find((f) => f.id === formatId)!;
    setIsRunning(true);
    setError(null);
    setResult(null);
    setProgress(0);
    try {
      setStatus("Loading audio engine…");
      await getFFmpeg({ onDownloadProgress: (r) => setProgress(r * 0.25) });
      setStatus(`Converting to ${fmt.label}…`);
      const inputName = `input.${getExt(file.name)}`;
      const outputName = `output.${fmt.ext}`;
      const baseName = file.name.replace(/\.[^.]+$/, "") || "audio";
      const { blob, durationMs } = await runFFmpeg(file, {
        inputName,
        outputName,
        outputMime: fmt.mime,
        args: fmt.args(inputName, outputName),
        onProgress: (p) => setProgress(0.25 + p * 0.75),
      });
      setResult({ blob, filename: `${baseName}.${fmt.ext}`, mimeType: fmt.mime, durationMs });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Conversion failed.");
    } finally {
      setIsRunning(false);
      setStatus("");
    }
  };

  return (
    <div className="space-y-6">
      <AudioDropZone onFileSelected={handleFile} />

      {file && (
        <div className="rounded-2xl border border-surface-200 bg-white p-4 dark:border-surface-800 dark:bg-surface-900">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
            Convert to
          </p>
          <div className="grid gap-2 sm:grid-cols-3">
            {FORMATS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFormatId(f.id)}
                className={cn(
                  "flex flex-col items-start rounded-xl border p-3 text-left transition",
                  formatId === f.id
                    ? "border-primary-500 bg-primary-50 dark:border-primary-400 dark:bg-primary-500/10"
                    : "border-surface-200 hover:border-primary-300 dark:border-surface-800 dark:hover:border-primary-700"
                )}
              >
                <span className="text-sm font-semibold text-surface-900 dark:text-white">{f.label}</span>
                <span className="mt-0.5 text-[11px] text-surface-500 dark:text-surface-400">
                  {f.lossless ? "Lossless" : "Lossy · compact file"}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      <AudioRunBar
        canRun={!!file && !isRunning}
        isRunning={isRunning}
        progress={progress}
        status={status}
        error={error}
        result={result}
        onRun={handleRun}
        runLabel={`Convert to ${FORMATS.find((f) => f.id === formatId)?.label ?? ""}`}
        disabledHint={file ? undefined : "Upload an audio file to start."}
      />
    </div>
  );
}
