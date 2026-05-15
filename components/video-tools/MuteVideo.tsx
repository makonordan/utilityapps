"use client";

import { useState } from "react";

import { VideoDropZone } from "@/components/video-tools/VideoDropZone";
import { VideoRunBar, type VideoRunResult } from "@/components/video-tools/VideoRunBar";
import { getFFmpeg, runFFmpeg } from "@/lib/ffmpegClient";
import { VIDEO_TOOLS_CONFIG, getVideoSupportedFormats } from "@/lib/videoTools";

const TOOL_ID = "mute-video";

function getExt(name: string): string {
  return name.split(".").pop()?.toLowerCase() || "mp4";
}

export function MuteVideo() {
  const [file, setFile] = useState<File | null>(null);
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
      await getFFmpeg({ onDownloadProgress: (r) => setProgress(r * 0.3) });
      setStatus("Removing audio (stream-copy)…");
      const ext = getExt(file.name);
      const inputName = `input.${ext}`;
      const outputName = `output.${ext}`;
      const baseName = file.name.replace(/\.[^.]+$/, "") || "video";
      const { blob, durationMs } = await runFFmpeg(file, {
        inputName,
        outputName,
        outputMime: file.type || "video/mp4",
        args: ["-i", inputName, "-c", "copy", "-an", outputName],
        onProgress: (p) => setProgress(0.3 + p * 0.7),
      });
      setResult({
        blob,
        filename: `${baseName}-muted.${ext}`,
        mimeType: file.type || "video/mp4",
        originalSize: file.size,
        durationMs,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Mute failed.");
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

      <VideoRunBar
        canRun={!!file && !isRunning}
        isRunning={isRunning}
        progress={progress}
        status={status}
        error={error}
        result={result}
        onRun={handleRun}
        runLabel="Mute video"
        disabledHint={file ? undefined : "Upload a video to start."}
      />
    </div>
  );
}
