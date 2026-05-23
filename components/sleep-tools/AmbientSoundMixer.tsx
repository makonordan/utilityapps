"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CloudRain, Pause, Play, Volume2, Waves, Wind } from "lucide-react";

import { cn } from "@/lib/utils";

const BUFFER_SECONDS = 4;
const FADE_SECONDS = 30;
const TIMER_OPTIONS = [0, 15, 30, 60, 90] as const;
type TimerMinutes = (typeof TIMER_OPTIONS)[number];

type TrackId = "white" | "pink" | "brown" | "rain" | "ocean";

interface TrackConfig {
  id: TrackId;
  label: string;
  description: string;
  icon: typeof Wind;
  source: "white" | "brown";
  filter?: { type: BiquadFilterType; frequency: number; Q: number };
  modulate?: boolean;
}

const TRACKS: TrackConfig[] = [
  {
    id: "white",
    label: "White noise",
    description: "Even hiss across all frequencies — masks chatter and notifications.",
    icon: Wind,
    source: "white",
  },
  {
    id: "pink",
    label: "Pink noise",
    description: "Softer than white — a warmer, less hissy background hum.",
    icon: Wind,
    source: "white",
    filter: { type: "lowpass", frequency: 2000, Q: 0.7 },
  },
  {
    id: "brown",
    label: "Brown noise",
    description: "Deep low rumble — favoured for sleep and tinnitus relief.",
    icon: Wind,
    source: "brown",
  },
  {
    id: "rain",
    label: "Rain",
    description: "Bandpass-filtered noise that approximates steady rainfall.",
    icon: CloudRain,
    source: "white",
    filter: { type: "bandpass", frequency: 1500, Q: 0.7 },
  },
  {
    id: "ocean",
    label: "Ocean waves",
    description: "Slow swells from a brown source — rises and falls every 10 seconds.",
    icon: Waves,
    source: "brown",
    modulate: true,
  },
];

function generateWhiteNoise(ctx: AudioContext): AudioBuffer {
  const sampleRate = ctx.sampleRate;
  const length = sampleRate * BUFFER_SECONDS;
  const buffer = ctx.createBuffer(2, length, sampleRate);
  for (let ch = 0; ch < 2; ch += 1) {
    const data = buffer.getChannelData(ch);
    for (let i = 0; i < length; i += 1) data[i] = Math.random() * 2 - 1;
  }
  return buffer;
}

function generateBrownNoise(ctx: AudioContext): AudioBuffer {
  const sampleRate = ctx.sampleRate;
  const length = sampleRate * BUFFER_SECONDS;
  const buffer = ctx.createBuffer(2, length, sampleRate);
  for (let ch = 0; ch < 2; ch += 1) {
    const data = buffer.getChannelData(ch);
    let last = 0;
    for (let i = 0; i < length; i += 1) {
      const white = Math.random() * 2 - 1;
      const out = (last + 0.02 * white) / 1.02;
      data[i] = out * 3.5;
      last = out;
    }
  }
  return buffer;
}

interface TrackNodes {
  source: AudioBufferSourceNode;
  gain: GainNode;
  lfo?: OscillatorNode;
  lfoGain?: GainNode;
}

interface AudioState {
  ctx: AudioContext;
  master: GainNode;
  whiteBuffer: AudioBuffer;
  brownBuffer: AudioBuffer;
  tracks: Map<TrackId, TrackNodes>;
}

function buildTrackNodes(
  ctx: AudioContext,
  cfg: TrackConfig,
  buffers: { white: AudioBuffer; brown: AudioBuffer },
  master: GainNode,
  initialVolume: number
): TrackNodes {
  const source = ctx.createBufferSource();
  source.buffer = cfg.source === "white" ? buffers.white : buffers.brown;
  source.loop = true;

  const gain = ctx.createGain();
  gain.gain.value = initialVolume;

  let last: AudioNode = source;
  if (cfg.filter) {
    const filter = ctx.createBiquadFilter();
    filter.type = cfg.filter.type;
    filter.frequency.value = cfg.filter.frequency;
    filter.Q.value = cfg.filter.Q;
    last.connect(filter);
    last = filter;
  }

  let lfo: OscillatorNode | undefined;
  let lfoGain: GainNode | undefined;
  if (cfg.modulate) {
    // Slow LFO that swings the gain between ~0.3 and ~1.0
    const mod = ctx.createGain();
    mod.gain.value = 0.65;
    last.connect(mod);

    lfo = ctx.createOscillator();
    lfo.frequency.value = 0.1; // 10-second wave period
    lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.35;
    lfo.connect(lfoGain);
    lfoGain.connect(mod.gain);
    lfo.start();

    last = mod;
  }

  last.connect(gain);
  gain.connect(master);
  source.start();

  return { source, gain, lfo, lfoGain };
}

function formatMinutes(m: TimerMinutes): string {
  return m === 0 ? "Off" : `${m} min`;
}

function formatRemaining(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

const INITIAL_VOLUMES: Record<TrackId, number> = {
  white: 0,
  pink: 0,
  brown: 0.55,
  rain: 0,
  ocean: 0,
};

export function AmbientSoundMixer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [masterVolume, setMasterVolume] = useState(0.8);
  const [volumes, setVolumes] = useState<Record<TrackId, number>>(INITIAL_VOLUMES);
  const [timerMinutes, setTimerMinutes] = useState<TimerMinutes>(0);
  const [remainingSec, setRemainingSec] = useState<number | null>(null);

  const audioRef = useRef<AudioState | null>(null);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fadeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stopTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const teardown = useCallback(() => {
    const state = audioRef.current;
    if (state) {
      for (const nodes of state.tracks.values()) {
        try {
          nodes.source.stop();
          nodes.lfo?.stop();
        } catch {
          /* already stopped — ignore */
        }
        nodes.source.disconnect();
        nodes.gain.disconnect();
        nodes.lfo?.disconnect();
        nodes.lfoGain?.disconnect();
      }
      state.master.disconnect();
      state.tracks.clear();
      // Each play creates a fresh AudioContext (since BufferSource nodes are
      // one-shot). Close the old one so it doesn't leak.
      if (state.ctx.state !== "closed") void state.ctx.close();
    }
    if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
    if (fadeTimeoutRef.current) {
      clearTimeout(fadeTimeoutRef.current);
      fadeTimeoutRef.current = null;
    }
    if (stopTimeoutRef.current) {
      clearTimeout(stopTimeoutRef.current);
      stopTimeoutRef.current = null;
    }
    audioRef.current = null;
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

    const ctx = new AudioCtor();
    const master = ctx.createGain();
    master.gain.value = masterVolume;
    master.connect(ctx.destination);

    const whiteBuffer = generateWhiteNoise(ctx);
    const brownBuffer = generateBrownNoise(ctx);

    const tracks = new Map<TrackId, TrackNodes>();
    for (const cfg of TRACKS) {
      tracks.set(
        cfg.id,
        buildTrackNodes(ctx, cfg, { white: whiteBuffer, brown: brownBuffer }, master, volumes[cfg.id])
      );
    }

    audioRef.current = { ctx, master, whiteBuffer, brownBuffer, tracks };
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
        const state = audioRef.current;
        if (!state) return;
        const now = state.ctx.currentTime;
        state.master.gain.cancelScheduledValues(now);
        state.master.gain.setValueAtTime(state.master.gain.value, now);
        state.master.gain.linearRampToValueAtTime(0, now + FADE_SECONDS);
        stopTimeoutRef.current = setTimeout(teardown, FADE_SECONDS * 1000);
      }, Math.max(0, (totalSec - FADE_SECONDS) * 1000));
    }
  }, [masterVolume, volumes, timerMinutes, teardown]);

  // Update master gain when slider changes.
  useEffect(() => {
    const state = audioRef.current;
    if (!state || !isPlaying) return;
    state.master.gain.setTargetAtTime(masterVolume, state.ctx.currentTime, 0.05);
  }, [masterVolume, isPlaying]);

  // Update per-track gain when sliders change.
  useEffect(() => {
    const state = audioRef.current;
    if (!state || !isPlaying) return;
    for (const cfg of TRACKS) {
      const nodes = state.tracks.get(cfg.id);
      if (!nodes) continue;
      nodes.gain.gain.setTargetAtTime(volumes[cfg.id], state.ctx.currentTime, 0.05);
    }
  }, [volumes, isPlaying]);

  // Cleanup on unmount: teardown also closes the AudioContext.
  useEffect(() => {
    return () => {
      teardown();
    };
  }, [teardown]);

  const toggle = () => {
    if (isPlaying) teardown();
    else startPlayback();
  };

  const setTrackVolume = (id: TrackId, value: number) => {
    setVolumes((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-surface-200 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:border-surface-800 dark:from-indigo-500/10 dark:via-surface-900 dark:to-purple-500/10">
      {/* Master controls */}
      <div className="flex flex-col gap-5 border-b border-surface-200 p-6 sm:flex-row sm:items-center sm:gap-8 dark:border-surface-800">
        <button
          type="button"
          onClick={toggle}
          aria-label={isPlaying ? "Pause mixer" : "Play mixer"}
          className={cn(
            "inline-flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg transition hover:scale-105 active:scale-95",
            isPlaying && "shadow-xl shadow-indigo-500/40"
          )}
        >
          {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="ml-0.5 h-6 w-6" />}
        </button>

        <div className="flex-1 space-y-3">
          <div>
            <p className="text-sm font-semibold text-surface-900 dark:text-white">
              {isPlaying ? "Mixing" : "Master controls"}
            </p>
            <p className="text-xs text-surface-500 dark:text-surface-400">
              {isPlaying
                ? "All five tracks share one audio engine. Bring up the ones you like."
                : "Press play to start, then mix the tracks below."}
            </p>
          </div>
          <label className="flex items-center gap-3">
            <Volume2 className="h-4 w-4 text-indigo-500" />
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={masterVolume}
              onChange={(e) => setMasterVolume(Number(e.target.value))}
              className="h-2 flex-1 cursor-pointer appearance-none rounded-full bg-surface-200 accent-indigo-500 dark:bg-surface-700"
              aria-label="Master volume"
            />
            <span className="w-12 text-right text-xs tabular-nums text-surface-600 dark:text-surface-300">
              {Math.round(masterVolume * 100)}%
            </span>
          </label>
        </div>
      </div>

      {/* Tracks */}
      <ul className="divide-y divide-surface-200 dark:divide-surface-800">
        {TRACKS.map((t) => {
          const active = volumes[t.id] > 0;
          return (
            <li key={t.id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:gap-6">
              <div className="flex items-start gap-3 sm:w-56 sm:shrink-0">
                <span
                  aria-hidden="true"
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition",
                    active
                      ? "bg-indigo-500 text-white"
                      : "bg-surface-100 text-surface-500 dark:bg-surface-800 dark:text-surface-400"
                  )}
                >
                  <t.icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-surface-900 dark:text-white">{t.label}</p>
                  <p className="mt-0.5 text-[11px] text-surface-500 dark:text-surface-400">
                    {t.description}
                  </p>
                </div>
              </div>
              <div className="flex flex-1 items-center gap-3">
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={volumes[t.id]}
                  onChange={(e) => setTrackVolume(t.id, Number(e.target.value))}
                  className="h-2 flex-1 cursor-pointer appearance-none rounded-full bg-surface-200 accent-indigo-500 dark:bg-surface-700"
                  aria-label={`${t.label} volume`}
                />
                <span className="w-12 text-right text-xs tabular-nums text-surface-600 dark:text-surface-300">
                  {Math.round(volumes[t.id] * 100)}%
                </span>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Sleep timer */}
      <div className="border-t border-surface-200 p-5 dark:border-surface-800">
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
            Fading out in {formatRemaining(remainingSec)}
          </p>
        )}
      </div>

      <div className="border-t border-surface-200 bg-white/60 px-6 py-3 text-center text-[11px] text-surface-500 dark:border-surface-800 dark:bg-surface-900/60 dark:text-surface-400">
        Every track is synthesised live in your browser — no streams, no downloads, works offline.
      </div>
    </div>
  );
}
