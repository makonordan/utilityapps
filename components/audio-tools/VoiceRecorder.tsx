"use client";

import { useEffect, useRef, useState } from "react";
import { AlertTriangle, Download, Loader2, Mic, Square } from "lucide-react";

import { getFFmpeg, runFFmpeg } from "@/lib/ffmpegClient";
import { cn } from "@/lib/utils";

type Phase = "idle" | "recording" | "recorded";

function fmt(seconds: number): string {
  const s = Math.floor(seconds);
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

export function VoiceRecorder() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [elapsed, setElapsed] = useState(0);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mp3Url, setMp3Url] = useState<string | null>(null);
  const [convertingMp3, setConvertingMp3] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const timerRef = useRef<number>(0);

  // Cleanup on unmount.
  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.clearInterval(timerRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      audioCtxRef.current?.close().catch(() => {});
      if (recordedUrl) URL.revokeObjectURL(recordedUrl);
      if (mp3Url) URL.revokeObjectURL(mp3Url);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const drawWaveform = () => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas || !analyser) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const bufferLength = analyser.fftSize;
    const data = new Uint8Array(bufferLength);

    const render = () => {
      analyser.getByteTimeDomainData(data);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#14B8A6";
      ctx.beginPath();
      const slice = canvas.width / bufferLength;
      let x = 0;
      for (let i = 0; i < bufferLength; i++) {
        const v = data[i] / 128;
        const y = (v * canvas.height) / 2;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
        x += slice;
      }
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
      rafRef.current = requestAnimationFrame(render);
    };
    render();
  };

  const startRecording = async () => {
    setError(null);
    setMp3Url(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioCtxRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 1024;
      source.connect(analyser);
      analyserRef.current = analyser;

      const mime = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : "audio/webm";
      const recorder = new MediaRecorder(stream, { mimeType: mime });
      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setRecordedBlob(blob);
        setRecordedUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return URL.createObjectURL(blob);
        });
        setPhase("recorded");
      };
      mediaRecorderRef.current = recorder;
      recorder.start();

      startTimeRef.current = Date.now();
      setElapsed(0);
      timerRef.current = window.setInterval(() => {
        setElapsed((Date.now() - startTimeRef.current) / 1000);
      }, 250);

      setPhase("recording");
      drawWaveform();
    } catch (e) {
      if (e instanceof DOMException && (e.name === "NotAllowedError" || e.name === "SecurityError")) {
        setError("Microphone access was denied. Allow it in your browser's site settings to record.");
      } else {
        setError(e instanceof Error ? e.message : "Could not start recording.");
      }
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    cancelAnimationFrame(rafRef.current);
    window.clearInterval(timerRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    audioCtxRef.current?.close().catch(() => {});
  };

  const reset = () => {
    if (recordedUrl) URL.revokeObjectURL(recordedUrl);
    if (mp3Url) URL.revokeObjectURL(mp3Url);
    setRecordedUrl(null);
    setRecordedBlob(null);
    setMp3Url(null);
    setElapsed(0);
    setPhase("idle");
  };

  const convertToMp3 = async () => {
    if (!recordedBlob) return;
    setConvertingMp3(true);
    setError(null);
    try {
      await getFFmpeg();
      const file = new File([recordedBlob], "recording.webm", { type: "audio/webm" });
      const { blob } = await runFFmpeg(file, {
        inputName: "recording.webm",
        outputName: "recording.mp3",
        outputMime: "audio/mpeg",
        args: ["-i", "recording.webm", "-vn", "-c:a", "libmp3lame", "-b:a", "192k", "recording.mp3"],
      });
      setMp3Url((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return URL.createObjectURL(blob);
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "MP3 conversion failed.");
    } finally {
      setConvertingMp3(false);
    }
  };

  return (
    <div className="space-y-6">
      <div
        className={cn(
          "rounded-2xl border-2 p-6 text-center transition-colors",
          phase === "recording"
            ? "border-error-400 bg-error-50/40 dark:border-error-500/60 dark:bg-error-500/10"
            : "border-surface-200 bg-white dark:border-surface-800 dark:bg-surface-900"
        )}
      >
        <canvas
          ref={canvasRef}
          width={640}
          height={120}
          className="mx-auto h-24 w-full max-w-xl rounded-lg bg-surface-50 dark:bg-surface-800"
        />
        <p className="mt-3 font-mono text-3xl font-bold tabular-nums text-surface-900 dark:text-white">
          {fmt(elapsed)}
        </p>

        <div className="mt-4 flex flex-wrap justify-center gap-3">
          {phase !== "recording" ? (
            <button
              type="button"
              onClick={startRecording}
              className="inline-flex items-center justify-center gap-3 rounded-2xl bg-primary-600 px-8 py-4 text-lg font-bold text-white shadow-lg ring-4 ring-primary-300/60 transition hover:bg-primary-700 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99]"
            >
              <Mic className="h-6 w-6" />
              {phase === "recorded" ? "Record again" : "Start recording"}
            </button>
          ) : (
            <button
              type="button"
              onClick={stopRecording}
              className="inline-flex items-center justify-center gap-3 rounded-2xl bg-error-600 px-8 py-4 text-lg font-bold text-white shadow-lg transition hover:bg-error-700 hover:scale-[1.01] active:scale-[0.99]"
            >
              <Square className="h-5 w-5" fill="currentColor" />
              Stop recording
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-error-300 bg-error-50 px-4 py-3 text-sm text-error-700 dark:border-error-500/60 dark:bg-error-500/10 dark:text-error-200">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {phase === "recorded" && recordedUrl && (
        <div className="rounded-2xl border border-success-300 bg-success-50/60 p-4 dark:border-success-500/40 dark:bg-success-500/10">
          <p className="text-xs font-semibold uppercase tracking-wider text-success-700 dark:text-success-300">
            Your recording
          </p>
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <audio src={recordedUrl} controls className="mt-2 w-full" />
          <div className="mt-3 flex flex-wrap gap-2">
            <a
              href={recordedUrl}
              download="recording.webm"
              className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700"
            >
              <Download className="h-4 w-4" />
              Download WebM
            </a>
            {mp3Url ? (
              <a
                href={mp3Url}
                download="recording.mp3"
                className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700"
              >
                <Download className="h-4 w-4" />
                Download MP3
              </a>
            ) : (
              <button
                type="button"
                onClick={convertToMp3}
                disabled={convertingMp3}
                className="inline-flex items-center gap-2 rounded-xl border border-surface-300 px-4 py-2 text-sm font-semibold text-surface-700 transition hover:border-primary-300 hover:text-primary-700 disabled:opacity-50 dark:border-surface-700 dark:text-surface-200 dark:hover:border-primary-500 dark:hover:text-primary-300"
              >
                {convertingMp3 ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {convertingMp3 ? "Converting…" : "Convert to MP3"}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
