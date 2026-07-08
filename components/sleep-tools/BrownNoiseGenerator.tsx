"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Pause, Play, Volume2 } from "lucide-react";

import { cn } from "@/lib/utils";

const BUFFER_SECONDS = 4;
const FADE_SECONDS = 30;
const TIMER_OPTIONS = [0, 15, 30, 60, 90] as const;
type TimerMinutes = (typeof TIMER_OPTIONS)[number];

function generateBrownNoiseBuffer(ctx: AudioContext): AudioBuffer {
  const sampleRate = ctx.sampleRate;
  const length = sampleRate * BUFFER_SECONDS;
  const buffer = ctx.createBuffer(2, length, sampleRate);
  for (let channel = 0; channel < 2; channel += 1) {
    const data = buffer.getChannelData(channel);
    let lastOut = 0;
    for (let i = 0; i < length; i += 1) {
      const white = Math.random() * 2 - 1;
      const out = (lastOut + 0.02 * white) / 1.02;
      data[i] = out * 3.5;
      lastOut = out;
    }
  }
  return buffer;
}

function formatMinutes(m: TimerMinutes): string {
  return m === 0 ? "Off" : `${m} min`;
}

function formatRemaining(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function BrownNoiseGenerator() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [timerMinutes, setTimerMinutes] = useState<TimerMinutes>(0);
  const [remainingSec, setRemainingSec] = useState<number | null>(null);

  const ctxRef = useRef<AudioContext | null>(null);
  const bufferRef = useRef<AudioBuffer | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fadeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stopPlayback = useCallback(() => {
    if (sourceRef.current) {
      try {
        sourceRef.current.stop();
      } catch {
        /* node already stopped — ignore */
      }
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
    if (fadeTimeoutRef.current) {
      clearTimeout(fadeTimeoutRef.current);
      fadeTimeoutRef.current = null;
    }
    setIsPlaying(false);
    setRemainingSec(null);
  }, []);

  const startPlayback = useCallback(() => {
    const AudioCtor =
      typeof window !== "undefined"
        ? window.AudioContext ??
          (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
        : undefined;
    if (!AudioCtor) return;

    if (!ctxRef.current) ctxRef.current = new AudioCtor();
    const ctx = ctxRef.current;
    if (ctx.state === "suspended") void ctx.resume();
    if (!bufferRef.current) bufferRef.current = generateBrownNoiseBuffer(ctx);
    if (!gainRef.current) {
      gainRef.current = ctx.createGain();
      gainRef.current.connect(ctx.destination);
    }

    gainRef.current.gain.cancelScheduledValues(ctx.currentTime);
    gainRef.current.gain.setValueAtTime(volume, ctx.currentTime);

    const source = ctx.createBufferSource();
    source.buffer = bufferRef.current;
    source.loop = true;
    source.connect(gainRef.current);
    source.start();
    sourceRef.current = source;

    setIsPlaying(true);

    if (timerMinutes > 0) {
      const totalSec = timerMinutes * 60;
      setRemainingSec(totalSec);
      tickRef.current = setInterval(() => {
        setRemainingSec((prev) => {
          if (prev === null) return null;
          if (prev <= 1) return 0;
          return prev - 1;
        });
      }, 1000);
      fadeTimeoutRef.current = setTimeout(() => {
        if (!gainRef.current || !ctxRef.current) return;
        const now = ctxRef.current.currentTime;
        gainRef.current.gain.cancelScheduledValues(now);
        gainRef.current.gain.setValueAtTime(gainRef.current.gain.value, now);
        gainRef.current.gain.linearRampToValueAtTime(0, now + FADE_SECONDS);
        setTimeout(stopPlayback, FADE_SECONDS * 1000);
      }, Math.max(0, (totalSec - FADE_SECONDS) * 1000));
    }
  }, [volume, timerMinutes, stopPlayback]);

  // Volume changes: update gain smoothly.
  useEffect(() => {
    const gain = gainRef.current;
    const ctx = ctxRef.current;
    if (!gain || !ctx || !isPlaying) return;
    gain.gain.setTargetAtTime(volume, ctx.currentTime, 0.05);
  }, [volume, isPlaying]);

  // Restart timer when minutes change mid-playback.
  // Restart is handled by stop+start through the toggle button.

  // Cleanup on unmount.
  useEffect(() => {
    return () => {
      stopPlayback();
      const ctx = ctxRef.current;
      if (ctx && ctx.state !== "closed") void ctx.close();
    };
  }, [stopPlayback]);

  const togglePlay = () => {
    if (isPlaying) stopPlayback();
    else startPlayback();
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-surface-200 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:border-surface-800 dark:from-indigo-500/10 dark:via-surface-900 dark:to-purple-500/10">
      <div className="flex flex-col items-center gap-6 p-8 sm:p-12">
        {/* Play/Pause button */}
        <button
          type="button"
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause brown noise" : "Play brown noise"}
          className={cn(
            "group relative inline-flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-xl transition hover:scale-105 active:scale-95",
            isPlaying && "shadow-2xl shadow-indigo-500/40"
          )}
        >
          {isPlaying ? (
            <Pause className="h-10 w-10" />
          ) : (
            <Play className="ml-1 h-10 w-10" />
          )}
          {isPlaying && (
            <span
              aria-hidden="true"
              className="absolute inset-0 -z-10 animate-ping rounded-full bg-indigo-500/30"
            />
          )}
        </button>

        <p className="text-center text-sm text-surface-600 dark:text-surface-300">
          {isPlaying ? "Playing — generated live in your browser" : "Press play to start"}
        </p>

        {/* Volume */}
        <div className="w-full max-w-md">
          <label className="flex items-center gap-3">
            <Volume2 className="h-4 w-4 text-indigo-500" />
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="h-2 flex-1 cursor-pointer appearance-none rounded-full bg-surface-200 accent-indigo-500 dark:bg-surface-700"
              aria-label="Volume"
            />
            <span className="w-10 text-right text-xs tabular-nums text-surface-600 dark:text-surface-300">
              {Math.round(volume * 100)}%
            </span>
          </label>
        </div>

        {/* Sleep timer */}
        <div className="w-full max-w-md">
          <p className="text-center text-sm font-semibold text-surface-700 dark:text-surface-200">
            Sleep timer
          </p>
          <div className="mt-3 flex flex-wrap justify-center gap-2">
            {TIMER_OPTIONS.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setTimerMinutes(m)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-semibold transition",
                  timerMinutes === m
                    ? "border-indigo-500 bg-indigo-500 text-white"
                    : "border-surface-200 bg-white text-surface-600 hover:border-indigo-300 hover:text-indigo-700 dark:border-surface-700 dark:bg-surface-900 dark:text-surface-300"
                )}
              >
                {formatMinutes(m)}
              </button>
            ))}
          </div>
          {isPlaying && timerMinutes > 0 && remainingSec !== null && (
            <p className="mt-3 text-center text-xs text-surface-500 dark:text-surface-400">
              Stopping in {formatRemaining(remainingSec)} · gentle fade-out over the last 30 seconds
            </p>
          )}
        </div>
      </div>

      <div className="border-t border-surface-200 bg-white/60 px-6 py-3 text-center text-[11px] text-surface-500 dark:border-surface-800 dark:bg-surface-900/60 dark:text-surface-400">
        Audio is generated sample-by-sample using the Web Audio API. Nothing is downloaded or
        streamed — works offline.
      </div>
    </div>
  );
}
