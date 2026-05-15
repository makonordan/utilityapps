"use client";

import { useState } from "react";
import { AlertTriangle, Loader2, Sparkles } from "lucide-react";

import { AudioDropZone } from "@/components/audio-tools/AudioDropZone";
import { cn } from "@/lib/utils";

interface BpmResult {
  bpm: number;
  confidence: "high" | "medium" | "low";
  peakCount: number;
}

/**
 * Energy-based BPM detection. Decode audio to mono PCM, compute short-window
 * RMS energy, detect peaks above a dynamic threshold, histogram the intervals
 * between peaks, and convert the dominant interval to beats per minute.
 */
function detectBpm(buffer: AudioBuffer): BpmResult {
  const sampleRate = buffer.sampleRate;
  // Mix down to mono.
  const length = buffer.length;
  const mono = new Float32Array(length);
  for (let ch = 0; ch < buffer.numberOfChannels; ch++) {
    const data = buffer.getChannelData(ch);
    for (let i = 0; i < length; i++) mono[i] += data[i] / buffer.numberOfChannels;
  }

  // Window energy: ~20 ms windows.
  const windowSize = Math.floor(sampleRate * 0.02);
  const windowCount = Math.floor(length / windowSize);
  const energy = new Float32Array(windowCount);
  for (let w = 0; w < windowCount; w++) {
    let sum = 0;
    const base = w * windowSize;
    for (let i = 0; i < windowSize; i++) {
      const s = mono[base + i];
      sum += s * s;
    }
    energy[w] = Math.sqrt(sum / windowSize);
  }

  // Dynamic threshold: mean + 1.4 * stddev.
  let mean = 0;
  for (let i = 0; i < windowCount; i++) mean += energy[i];
  mean /= windowCount || 1;
  let variance = 0;
  for (let i = 0; i < windowCount; i++) variance += (energy[i] - mean) ** 2;
  const std = Math.sqrt(variance / (windowCount || 1));
  const threshold = mean + 1.4 * std;

  // Peak windows = local maxima above threshold, with a refractory gap.
  const peaks: number[] = [];
  const minGapWindows = Math.floor(0.25 / 0.02); // 250 ms minimum between beats (max 240 BPM)
  for (let w = 1; w < windowCount - 1; w++) {
    if (
      energy[w] > threshold &&
      energy[w] >= energy[w - 1] &&
      energy[w] > energy[w + 1] &&
      (peaks.length === 0 || w - peaks[peaks.length - 1] >= minGapWindows)
    ) {
      peaks.push(w);
    }
  }

  if (peaks.length < 4) {
    return { bpm: 0, confidence: "low", peakCount: peaks.length };
  }

  // Histogram of inter-peak intervals, converted to BPM and folded to 60–180.
  const bpmHistogram = new Map<number, number>();
  for (let i = 1; i < peaks.length; i++) {
    const intervalWindows = peaks[i] - peaks[i - 1];
    const intervalSeconds = intervalWindows * 0.02;
    let bpm = 60 / intervalSeconds;
    while (bpm < 60) bpm *= 2;
    while (bpm > 180) bpm /= 2;
    const rounded = Math.round(bpm);
    bpmHistogram.set(rounded, (bpmHistogram.get(rounded) ?? 0) + 1);
  }

  // Smooth the histogram into ±1 BPM buckets and pick the dominant one.
  let bestBpm = 0;
  let bestScore = -1;
  for (const [bpm] of bpmHistogram) {
    let score = 0;
    for (let d = -1; d <= 1; d++) score += bpmHistogram.get(bpm + d) ?? 0;
    if (score > bestScore) {
      bestScore = score;
      bestBpm = bpm;
    }
  }

  const ratio = bestScore / (peaks.length - 1);
  const confidence: BpmResult["confidence"] = ratio > 0.6 ? "high" : ratio > 0.35 ? "medium" : "low";

  return { bpm: bestBpm, confidence, peakCount: peaks.length };
}

export function BpmDetector() {
  const [file, setFile] = useState<File | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<BpmResult | null>(null);
  const [error, setError] = useState<string | null>(null);

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
    try {
      const arrayBuffer = await file.arrayBuffer();
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
      const detected = detectBpm(audioBuffer);
      await ctx.close();
      if (detected.bpm === 0) {
        setError("No clear beat was found. This track may not have prominent percussion.");
      } else {
        setResult(detected);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not decode that audio file.");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      <AudioDropZone onFileSelected={handleFile} />

      <div className="rounded-2xl border-2 border-primary-400 bg-gradient-to-br from-primary-50 to-white p-5 dark:border-primary-500/60 dark:from-primary-500/10 dark:to-surface-900">
        <button
          type="button"
          onClick={handleRun}
          disabled={!file || isRunning}
          className={cn(
            "inline-flex w-full items-center justify-center gap-3 rounded-2xl px-8 py-4 text-lg font-bold shadow-lg transition",
            !file || isRunning
              ? "cursor-not-allowed bg-surface-300 text-surface-700 dark:bg-surface-700 dark:text-surface-300"
              : "bg-primary-600 text-white ring-4 ring-primary-300/60 hover:bg-primary-700 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99]"
          )}
        >
          {isRunning ? <Loader2 className="h-6 w-6 animate-spin" /> : <Sparkles className="h-6 w-6" />}
          {isRunning ? "Analysing…" : "Detect BPM"}
        </button>
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-warning-300 bg-warning-50 px-4 py-3 text-sm text-warning-800 dark:border-warning-500/60 dark:bg-warning-500/10 dark:text-warning-200">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {result && (
        <div className="rounded-2xl border border-success-300 bg-success-50/60 p-6 text-center dark:border-success-500/40 dark:bg-success-500/10">
          <p className="text-xs font-semibold uppercase tracking-wider text-success-700 dark:text-success-300">
            Detected tempo
          </p>
          <p className="mt-2 font-mono text-6xl font-bold text-surface-900 dark:text-white">
            {result.bpm}
            <span className="ml-2 text-2xl text-surface-500 dark:text-surface-400">BPM</span>
          </p>
          <p className="mt-2 text-sm text-surface-600 dark:text-surface-300">
            Confidence:{" "}
            <span
              className={cn(
                "font-semibold",
                result.confidence === "high" && "text-success-700 dark:text-success-300",
                result.confidence === "medium" && "text-warning-700 dark:text-warning-300",
                result.confidence === "low" && "text-error-600 dark:text-error-400"
              )}
            >
              {result.confidence}
            </span>{" "}
            · {result.peakCount} beats detected
          </p>
          {result.confidence !== "high" && (
            <p className="mt-2 text-xs text-surface-500 dark:text-surface-400">
              Tip: if you know the song&apos;s tempo and this reads half or double, the engine
              locked onto the wrong harmonic — adjust mentally.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
