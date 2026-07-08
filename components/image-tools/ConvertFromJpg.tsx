"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Archive,
  CheckCircle2,
  Download,
  Film,
  FileImage,
  GripVertical,
  Loader2,
  RotateCcw,
  Sparkles,
  XCircle,
  Zap,
} from "lucide-react";

import { ImageDropZone } from "@/components/image-tools/ImageDropZone";
import { ProcessingProgress } from "@/components/image-tools/ProcessingProgress";
import {
  IMAGE_TOOLS_CONFIG,
  SUPPORTED_FORMATS,
} from "@/lib/imageTools";
import {
  canvasToBlob,
  downloadFile,
  downloadZip,
  formatFileSize,
  loadAnyImageToCanvas,
  loadImageFromFile,
} from "@/lib/imageProcessing";
import { cn } from "@/lib/utils";

const TOOL_ID = "convert-from-jpg";
const CONFIG = IMAGE_TOOLS_CONFIG[TOOL_ID];
const FORMAT_LABELS = SUPPORTED_FORMATS[TOOL_ID];

// ──────────────────────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────────────────────

type Mode = "png" | "webp" | "gif";
type FileStatus = "pending" | "processing" | "done" | "error";

interface ConvertItem {
  id: string;
  file: File;
  outBlob: Blob | null;
  outUrl: string | null;
  outSize: number | null;
  status: FileStatus;
  error?: string;
  previewUrl: string;
}

interface FrameItem {
  id: string;
  file: File;
  previewUrl: string;
}

type LoopMode = "forever" | "once" | "times";

let __pid = 0;
const nextId = () => `cf-${++__pid}-${Date.now()}`;

// ──────────────────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────────────────

function renamed(file: File, ext: "png" | "webp" | "gif"): string {
  const dot = file.name.lastIndexOf(".");
  const stem = dot > 0 ? file.name.slice(0, dot) : file.name;
  return `${stem}.${ext}`;
}

// ──────────────────────────────────────────────────────────────────────────
// Component
// ──────────────────────────────────────────────────────────────────────────

export function ConvertFromJpg() {
  const [mode, setMode] = useState<Mode>("png");

  // PNG / WEBP shared bulk state
  const [items, setItems] = useState<ConvertItem[]>([]);
  const [webpQuality, setWebpQuality] = useState(90);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressIndex, setProgressIndex] = useState(0);
  const [progressFile, setProgressFile] = useState("");

  // GIF builder state
  const [frames, setFrames] = useState<FrameItem[]>([]);
  const [fps, setFps] = useState(10);
  const [loopMode, setLoopMode] = useState<LoopMode>("forever");
  const [loopCount, setLoopCount] = useState(3);
  const [scalePercent, setScalePercent] = useState(100);
  const [gifBlob, setGifBlob] = useState<Blob | null>(null);
  const [gifUrl, setGifUrl] = useState<string | null>(null);

  // Cleanup all blob URLs on unmount.
  useEffect(() => {
    return () => {
      for (const i of items) {
        URL.revokeObjectURL(i.previewUrl);
        if (i.outUrl) URL.revokeObjectURL(i.outUrl);
      }
      for (const f of frames) URL.revokeObjectURL(f.previewUrl);
      if (gifUrl) URL.revokeObjectURL(gifUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ───── File intake ─────
  const onFilesSelected = useCallback(
    (selected: File[]) => {
      if (mode === "gif") {
        const next: FrameItem[] = selected.map((f) => ({
          id: nextId(),
          file: f,
          previewUrl: URL.createObjectURL(f),
        }));
        setFrames((prev) => [...prev, ...next]);
      } else {
        const next: ConvertItem[] = selected.map((f) => ({
          id: nextId(),
          file: f,
          outBlob: null,
          outUrl: null,
          outSize: null,
          status: "pending",
          previewUrl: URL.createObjectURL(f),
        }));
        setItems((prev) => [...prev, ...next]);
      }
    },
    [mode]
  );

  const setModeAndClear = (m: Mode) => {
    if (m === mode) return;
    // Free URLs and drop everything when switching modes.
    for (const i of items) {
      URL.revokeObjectURL(i.previewUrl);
      if (i.outUrl) URL.revokeObjectURL(i.outUrl);
    }
    for (const f of frames) URL.revokeObjectURL(f.previewUrl);
    if (gifUrl) URL.revokeObjectURL(gifUrl);
    setItems([]);
    setFrames([]);
    setGifBlob(null);
    setGifUrl(null);
    setMode(m);
  };

  const reset = () => setModeAndClear(mode);

  // ───── PNG / WEBP bulk conversion ─────
  const convertBulk = useCallback(async () => {
    const pending = items.filter((i) => i.status !== "done");
    if (pending.length === 0 || isProcessing) return;
    setIsProcessing(true);
    setProgress(0);
    setProgressIndex(0);

    try {
      for (let idx = 0; idx < pending.length; idx++) {
        const item = pending[idx];
        setProgressIndex(idx);
        setProgressFile(item.file.name);
        setProgress(20);

        setItems((prev) =>
          prev.map((p) => (p.id === item.id ? { ...p, status: "processing" } : p))
        );

        try {
          const canvas = await loadAnyImageToCanvas(item.file);
          setProgress(70);
          const outMime = mode === "png" ? "image/png" : "image/webp";
          const blob = await canvasToBlob(canvas, outMime, webpQuality / 100);
          const url = URL.createObjectURL(blob);
          setProgress(100);

          setItems((prev) =>
            prev.map((p) =>
              p.id === item.id
                ? {
                    ...p,
                    status: "done",
                    outBlob: blob,
                    outUrl: url,
                    outSize: blob.size,
                  }
                : p
            )
          );
        } catch (err) {
          const message = err instanceof Error ? err.message : "Conversion failed";
          setItems((prev) =>
            prev.map((p) =>
              p.id === item.id ? { ...p, status: "error", error: message } : p
            )
          );
        }
      }
    } finally {
      setIsProcessing(false);
      setProgress(0);
      setProgressIndex(0);
      setProgressFile("");
    }
  }, [isProcessing, items, mode, webpQuality]);

  const downloadAllBulk = useCallback(async () => {
    const done = items.filter((i) => i.status === "done" && i.outBlob);
    if (done.length === 0) return;
    const ext = mode === "png" ? "png" : "webp";
    if (done.length === 1) {
      downloadFile(done[0].outBlob!, renamed(done[0].file, ext));
      return;
    }
    await downloadZip(
      done.map((i) => ({ blob: i.outBlob!, name: renamed(i.file, ext) })),
      `converted-${ext}s.zip`
    );
  }, [items, mode]);

  const removeItem = (id: string) => {
    setItems((prev) => {
      const t = prev.find((p) => p.id === id);
      if (t) {
        URL.revokeObjectURL(t.previewUrl);
        if (t.outUrl) URL.revokeObjectURL(t.outUrl);
      }
      return prev.filter((p) => p.id !== id);
    });
  };

  // ───── Animated GIF building ─────
  const moveFrame = (id: string, direction: -1 | 1) => {
    setFrames((prev) => {
      const i = prev.findIndex((f) => f.id === id);
      if (i === -1) return prev;
      const j = i + direction;
      if (j < 0 || j >= prev.length) return prev;
      const copy = prev.slice();
      [copy[i], copy[j]] = [copy[j], copy[i]];
      return copy;
    });
  };

  const removeFrame = (id: string) => {
    setFrames((prev) => {
      const t = prev.find((f) => f.id === id);
      if (t) URL.revokeObjectURL(t.previewUrl);
      return prev.filter((f) => f.id !== id);
    });
  };

  // HTML5 drag-and-drop reorder. Stable ref so the drag source survives
  // re-renders that happen between dragstart and drop.
  const dragSourceRef = useRef<string | null>(null);
  const dragHandlers = {
    onDragStart: (id: string) => () => {
      dragSourceRef.current = id;
    },
    onDragOver: (e: React.DragEvent) => e.preventDefault(),
    onDrop: (toId: string) => () => {
      const from = dragSourceRef.current;
      dragSourceRef.current = null;
      if (!from || from === toId) return;
      setFrames((prev) => {
        const fromIdx = prev.findIndex((f) => f.id === from);
        const toIdx = prev.findIndex((f) => f.id === toId);
        if (fromIdx === -1 || toIdx === -1) return prev;
        const copy = prev.slice();
        const [moved] = copy.splice(fromIdx, 1);
        copy.splice(toIdx, 0, moved);
        return copy;
      });
    },
  };

  const buildGif = useCallback(async () => {
    if (frames.length === 0 || isProcessing) return;
    setIsProcessing(true);
    setProgress(0);
    setProgressIndex(0);
    if (gifUrl) URL.revokeObjectURL(gifUrl);
    setGifBlob(null);
    setGifUrl(null);

    try {
      // Decode all frames first so we know the target dimensions.
      const decoded: HTMLCanvasElement[] = [];
      let baseW = 0;
      let baseH = 0;

      for (let i = 0; i < frames.length; i++) {
        setProgressIndex(i);
        setProgressFile(frames[i].file.name);
        setProgress((i / frames.length) * 40);
        const { img, cleanup } = await loadImageFromFile(frames[i].file);
        try {
          if (baseW === 0 || baseH === 0) {
            baseW = img.naturalWidth;
            baseH = img.naturalHeight;
          }
          const w = Math.max(1, Math.round((baseW * scalePercent) / 100));
          const h = Math.max(1, Math.round((baseH * scalePercent) / 100));
          const canvas = document.createElement("canvas");
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d");
          if (!ctx) throw new Error("2D context unavailable");
          ctx.imageSmoothingQuality = "high";
          ctx.drawImage(img, 0, 0, w, h);
          decoded.push(canvas);
        } finally {
          cleanup();
        }
      }

      const finalW = decoded[0].width;
      const finalH = decoded[0].height;

      // Dynamic-import gif.js so the encoder only loads when actually used.
      const GIFCtor = (await import("gif.js")).default;
      const repeat = loopMode === "forever" ? 0 : loopMode === "once" ? -1 : Math.max(1, loopCount);

      await new Promise<void>((resolve, reject) => {
        const gif = new GIFCtor({
          workers: 2,
          quality: 10, // 1 best, 30 worst — 10 is a good middle ground
          workerScript: "/gif.worker.js",
          width: finalW,
          height: finalH,
          repeat,
        });

        for (const canvas of decoded) {
          gif.addFrame(canvas, { delay: Math.round(1000 / fps), copy: true });
        }

        gif.on("progress", (p) => {
          // gif.js progress 0..1
          setProgress(40 + p * 60);
        });
        gif.on("finished", (blob) => {
          const url = URL.createObjectURL(blob);
          setGifBlob(blob);
          setGifUrl(url);
          setProgress(100);
          resolve();
        });
        gif.on("abort", () => reject(new Error("Aborted")));
        gif.render();
      });
    } catch (err) {
      console.error("[ConvertFromJpg/gif]", err);
    } finally {
      setIsProcessing(false);
      setProgress(0);
      setProgressIndex(0);
      setProgressFile("");
    }
  }, [fps, frames, gifUrl, isProcessing, loopCount, loopMode, scalePercent]);

  // ──────────────────────────────────────────────────────────────────────
  const hasContent = mode === "gif" ? frames.length > 0 : items.length > 0;
  const completedBulkCount = items.filter((i) => i.status === "done").length;

  return (
    <div className="space-y-6">
      {/* Mode picker */}
      <div className="grid gap-3 sm:grid-cols-3">
        <ModeCard
          active={mode === "png"}
          onClick={() => setModeAndClear("png")}
          icon={<FileImage className="h-4 w-4" />}
          title="Convert to PNG"
          desc="Lossless. Keeps transparency. Larger files."
        />
        <ModeCard
          active={mode === "webp"}
          onClick={() => setModeAndClear("webp")}
          icon={<Zap className="h-4 w-4" />}
          title="Convert to WEBP"
          desc="Modern, smaller files. Great for the web."
        />
        <ModeCard
          active={mode === "gif"}
          onClick={() => setModeAndClear("gif")}
          icon={<Film className="h-4 w-4" />}
          title="Create animated GIF"
          desc="Stitch multiple JPGs into one looping GIF."
        />
      </div>

      <ImageDropZone
        onFilesSelected={onFilesSelected}
        acceptedFormats={[...CONFIG.acceptedFormats]}
        maxSizeMB={CONFIG.maxFileSizeMB}
        multiple
        maxFiles={mode === "gif" ? 60 : 20}
        formatLabels={FORMAT_LABELS}
      />

      {/* Body */}
      {mode === "gif" ? (
        <GifBuilderView
          frames={frames}
          fps={fps}
          setFps={setFps}
          loopMode={loopMode}
          setLoopMode={setLoopMode}
          loopCount={loopCount}
          setLoopCount={setLoopCount}
          scalePercent={scalePercent}
          setScalePercent={setScalePercent}
          isProcessing={isProcessing}
          onBuild={buildGif}
          onReset={reset}
          onMove={moveFrame}
          onRemove={removeFrame}
          dragHandlers={dragHandlers}
          gifBlob={gifBlob}
          gifUrl={gifUrl}
          progress={progress}
          progressIndex={progressIndex}
          progressFile={progressFile}
        />
      ) : (
        hasContent && (
          <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
            <div className="space-y-4">
              <BulkTable items={items} mode={mode} onRemove={removeItem} />

              {isProcessing && (
                <ProcessingProgress
                  progress={progress}
                  currentFile={progressFile}
                  totalFiles={items.filter((i) => i.status !== "done").length || items.length}
                  processedFiles={progressIndex}
                  stage={mode === "png" ? "Encoding PNG" : "Encoding WebP"}
                />
              )}

              {completedBulkCount > 0 && (
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-success-200 bg-success-50/60 p-4 dark:border-success-500/40 dark:bg-success-500/10">
                  <span className="text-sm font-semibold text-success-700 dark:text-success-300">
                    {completedBulkCount} of {items.length} converted
                  </span>
                  <button
                    type="button"
                    onClick={downloadAllBulk}
                    className="inline-flex items-center gap-2 rounded-lg bg-success-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-success-700"
                  >
                    {completedBulkCount > 1 ? (
                      <>
                        <Archive className="h-4 w-4" /> Download all as ZIP
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4" /> Download
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            <BulkSettings
              mode={mode}
              webpQuality={webpQuality}
              setWebpQuality={setWebpQuality}
              isProcessing={isProcessing}
              hasPending={items.some((i) => i.status !== "done")}
              onConvert={convertBulk}
              onReset={reset}
            />
          </div>
        )
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Subviews
// ──────────────────────────────────────────────────────────────────────────

function ModeCard({
  active,
  onClick,
  icon,
  title,
  desc,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col items-start gap-1 rounded-2xl border p-4 text-left transition",
        active
          ? "border-primary-500 bg-primary-50 text-surface-900 shadow-sm dark:border-primary-500 dark:bg-primary-500/15 dark:text-white"
          : "border-surface-200 bg-white text-surface-700 hover:border-primary-300 hover:bg-primary-50/40 dark:border-surface-800 dark:bg-surface-900 dark:text-surface-200 dark:hover:border-primary-500 dark:hover:bg-primary-500/5"
      )}
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-100 text-primary-700 dark:bg-primary-500/20 dark:text-primary-200">
        {icon}
      </span>
      <span className="text-sm font-semibold">{title}</span>
      <span className="text-[11px] text-surface-500 dark:text-surface-400">{desc}</span>
    </button>
  );
}

function BulkTable({
  items,
  mode,
  onRemove,
}: {
  items: ConvertItem[];
  mode: "png" | "webp" | "gif";
  onRemove: (id: string) => void;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-surface-200 dark:border-surface-800">
      <table className="w-full text-left text-sm">
        <thead className="bg-surface-50 text-[11px] uppercase tracking-wider text-surface-500 dark:bg-surface-800/60 dark:text-surface-400">
          <tr>
            <th className="px-4 py-3 font-semibold">File</th>
            <th className="px-2 py-3 font-semibold">Original</th>
            <th className="px-2 py-3 font-semibold">{mode === "png" ? "PNG" : "WEBP"}</th>
            <th className="px-2 py-3 font-semibold">Status</th>
            <th className="px-4 py-3 text-right font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-200 bg-white dark:divide-surface-800 dark:bg-surface-900">
          {items.map((i) => (
            <tr key={i.id}>
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={i.previewUrl}
                    alt=""
                    className="h-10 w-10 shrink-0 rounded-md border border-surface-200 object-cover dark:border-surface-700"
                  />
                  <p
                    className="truncate text-sm font-medium text-surface-900 dark:text-white"
                    title={i.file.name}
                  >
                    {i.file.name}
                  </p>
                </div>
              </td>
              <td className="px-2 py-3 text-xs tabular-nums text-surface-600 dark:text-surface-300">
                {formatFileSize(i.file.size)}
              </td>
              <td className="px-2 py-3 text-xs tabular-nums text-surface-600 dark:text-surface-300">
                {i.outSize != null ? formatFileSize(i.outSize) : "—"}
              </td>
              <td className="px-2 py-3">
                <StatusPill status={i.status} error={i.error} />
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-2">
                  {i.status === "done" && i.outBlob && (
                    <button
                      type="button"
                      onClick={() =>
                        downloadFile(i.outBlob!, renamed(i.file, mode === "png" ? "png" : "webp"))
                      }
                      className="inline-flex items-center gap-1 rounded-md border border-surface-200 px-2 py-1 text-xs font-medium text-surface-700 transition hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700 dark:border-surface-700 dark:text-surface-200 dark:hover:border-primary-500 dark:hover:bg-primary-500/10"
                    >
                      <Download className="h-3 w-3" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onRemove(i.id)}
                    className="text-xs font-medium text-surface-500 hover:text-error-600 dark:text-surface-400 dark:hover:text-error-400"
                  >
                    Remove
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function BulkSettings({
  mode,
  webpQuality,
  setWebpQuality,
  isProcessing,
  hasPending,
  onConvert,
  onReset,
}: {
  mode: "png" | "webp" | "gif";
  webpQuality: number;
  setWebpQuality: (n: number) => void;
  isProcessing: boolean;
  hasPending: boolean;
  onConvert: () => void;
  onReset: () => void;
}) {
  return (
    <aside className="h-fit space-y-5 rounded-2xl border border-surface-200 bg-white p-5 dark:border-surface-800 dark:bg-surface-900">
      <header>
        <h2 className="text-sm font-semibold text-surface-900 dark:text-white">
          {mode === "png" ? "PNG output" : "WEBP output"}
        </h2>
        <p className="mt-1 text-xs text-surface-500 dark:text-surface-400">
          {mode === "png"
            ? "PNG is lossless — no quality slider needed."
            : "Quality 90 looks identical to source but produces much smaller files than JPG."}
        </p>
      </header>

      {mode === "webp" && (
        <div className="space-y-2">
          <div className="flex items-baseline justify-between">
            <label className="text-xs font-semibold text-surface-700 dark:text-surface-200">
              WEBP quality
            </label>
            <span className="text-xs font-bold tabular-nums text-primary-700 dark:text-primary-300">
              {webpQuality}
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={100}
            value={webpQuality}
            onChange={(e) => setWebpQuality(Number(e.target.value))}
            className="w-full accent-primary-600"
            disabled={isProcessing}
          />
        </div>
      )}

      <div className="space-y-2 pt-1">
        <button
          type="button"
          onClick={onConvert}
          disabled={isProcessing || !hasPending}
          className="inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-primary-600 px-8 py-4 text-lg font-bold text-white shadow-lg ring-4 ring-primary-300/60 transition hover:bg-primary-700 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 disabled:ring-0 disabled:hover:scale-100"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Converting…
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" /> Convert all
            </>
          )}
        </button>
        <button
          type="button"
          onClick={onReset}
          disabled={isProcessing}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-surface-200 px-4 py-2 text-xs font-medium text-surface-600 transition hover:border-surface-300 hover:text-surface-900 disabled:cursor-not-allowed disabled:opacity-50 dark:border-surface-700 dark:text-surface-300 dark:hover:text-white"
        >
          <RotateCcw className="h-3 w-3" />
          Reset
        </button>
      </div>
    </aside>
  );
}

const FPS_PRESETS = [5, 10, 15, 24];
const SCALE_PRESETS = [100, 75, 50];

function GifBuilderView({
  frames,
  fps,
  setFps,
  loopMode,
  setLoopMode,
  loopCount,
  setLoopCount,
  scalePercent,
  setScalePercent,
  isProcessing,
  onBuild,
  onReset,
  onMove,
  onRemove,
  dragHandlers,
  gifBlob,
  gifUrl,
  progress,
  progressIndex,
  progressFile,
}: {
  frames: FrameItem[];
  fps: number;
  setFps: (n: number) => void;
  loopMode: LoopMode;
  setLoopMode: (m: LoopMode) => void;
  loopCount: number;
  setLoopCount: (n: number) => void;
  scalePercent: number;
  setScalePercent: (n: number) => void;
  isProcessing: boolean;
  onBuild: () => void;
  onReset: () => void;
  onMove: (id: string, dir: -1 | 1) => void;
  onRemove: (id: string) => void;
  dragHandlers: {
    onDragStart: (id: string) => () => void;
    onDragOver: (e: React.DragEvent) => void;
    onDrop: (toId: string) => () => void;
  };
  gifBlob: Blob | null;
  gifUrl: string | null;
  progress: number;
  progressIndex: number;
  progressFile: string;
}) {
  if (frames.length === 0) return null;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-4">
        <p className="text-xs text-surface-600 dark:text-surface-300">
          Drag to reorder. Frames play in this order — the first frame in the list is the first frame of the GIF.
        </p>

        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {frames.map((f, idx) => (
            <li
              key={f.id}
              draggable
              onDragStart={dragHandlers.onDragStart(f.id)}
              onDragOver={dragHandlers.onDragOver}
              onDrop={dragHandlers.onDrop(f.id)}
              className="group relative overflow-hidden rounded-xl border border-surface-200 bg-white shadow-sm dark:border-surface-800 dark:bg-surface-900"
            >
              <div className="relative aspect-square w-full overflow-hidden bg-surface-100 dark:bg-surface-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={f.previewUrl}
                  alt={f.file.name}
                  draggable={false}
                  className="h-full w-full object-cover"
                />
                <span className="pointer-events-none absolute left-1.5 top-1.5 rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-bold text-white">
                  #{idx + 1}
                </span>
                <span className="absolute right-1.5 top-1.5 inline-flex h-6 w-6 cursor-grab items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition group-hover:opacity-100">
                  <GripVertical className="h-3 w-3" />
                </span>
              </div>
              <div className="flex items-center justify-between gap-1 border-t border-surface-200 px-2 py-1 dark:border-surface-800">
                <button
                  type="button"
                  onClick={() => onMove(f.id, -1)}
                  disabled={idx === 0 || isProcessing}
                  className="rounded px-1.5 py-0.5 text-[11px] text-surface-600 hover:bg-surface-100 disabled:opacity-30 dark:text-surface-300 dark:hover:bg-surface-800"
                  title="Move earlier"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => onRemove(f.id)}
                  disabled={isProcessing}
                  className="text-[11px] font-medium text-surface-500 hover:text-error-600 dark:text-surface-400 dark:hover:text-error-400"
                >
                  Remove
                </button>
                <button
                  type="button"
                  onClick={() => onMove(f.id, 1)}
                  disabled={idx === frames.length - 1 || isProcessing}
                  className="rounded px-1.5 py-0.5 text-[11px] text-surface-600 hover:bg-surface-100 disabled:opacity-30 dark:text-surface-300 dark:hover:bg-surface-800"
                  title="Move later"
                >
                  →
                </button>
              </div>
            </li>
          ))}
        </ul>

        {isProcessing && (
          <ProcessingProgress
            progress={progress}
            currentFile={progressFile || "Building GIF…"}
            totalFiles={frames.length}
            processedFiles={progressIndex}
            stage="Encoding GIF"
          />
        )}

        {gifBlob && gifUrl && (
          <div className="space-y-3 rounded-2xl border border-success-200 bg-success-50/60 p-5 dark:border-success-500/40 dark:bg-success-500/10">
            <p className="text-xs font-semibold uppercase tracking-wider text-success-700 dark:text-success-300">
              Animation ready
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={gifUrl}
              alt="Generated GIF"
              className="block max-h-96 w-full rounded-lg border border-white object-contain dark:border-surface-800"
            />
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-surface-700 dark:text-surface-200">
                <strong className="block text-base text-surface-900 dark:text-white">
                  {formatFileSize(gifBlob.size)}
                </strong>
                {frames.length} frames · {fps} fps
              </span>
              <button
                type="button"
                onClick={() => downloadFile(gifBlob, "animation.gif")}
                className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700"
              >
                <Download className="h-4 w-4" />
                Download GIF
              </button>
            </div>
            {gifBlob.size > 5 * 1024 * 1024 && (
              <p className="text-[11px] text-warning-700 dark:text-warning-300">
                Tip: GIF is an old, inefficient format. Drop the scale to 75% or 50% — or reduce the frame count — for a much smaller file.
              </p>
            )}
          </div>
        )}
      </div>

      <aside className="h-fit space-y-5 rounded-2xl border border-surface-200 bg-white p-5 dark:border-surface-800 dark:bg-surface-900">
        <header>
          <h2 className="text-sm font-semibold text-surface-900 dark:text-white">
            GIF settings
          </h2>
          <p className="mt-1 text-xs text-surface-500 dark:text-surface-400">
            Applied to every frame in the list.
          </p>
        </header>

        {/* FPS */}
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-surface-700 dark:text-surface-200">
            Frame rate
          </p>
          <div className="flex flex-wrap gap-1.5">
            {FPS_PRESETS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setFps(p)}
                disabled={isProcessing}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-[11px] font-semibold transition",
                  fps === p
                    ? "border-primary-500 bg-primary-50 text-primary-700 dark:border-primary-500 dark:bg-primary-500/15 dark:text-primary-200"
                    : "border-surface-200 bg-white text-surface-600 hover:border-primary-300 dark:border-surface-700 dark:bg-surface-900 dark:text-surface-300"
                )}
              >
                {p} fps
              </button>
            ))}
          </div>
        </div>

        {/* Loop */}
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-surface-700 dark:text-surface-200">
            Loop
          </p>
          <div className="flex flex-wrap gap-1.5">
            <LoopChip active={loopMode === "forever"} onClick={() => setLoopMode("forever")}>
              Loop forever
            </LoopChip>
            <LoopChip active={loopMode === "once"} onClick={() => setLoopMode("once")}>
              Play once
            </LoopChip>
            <LoopChip active={loopMode === "times"} onClick={() => setLoopMode("times")}>
              Loop N times
            </LoopChip>
          </div>
          {loopMode === "times" && (
            <input
              type="number"
              min={1}
              max={50}
              value={loopCount}
              onChange={(e) => setLoopCount(Math.max(1, Number(e.target.value) || 1))}
              disabled={isProcessing}
              className="mt-1 w-full rounded-lg border border-surface-200 bg-white px-3 py-1.5 text-xs tabular-nums text-surface-900 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 dark:border-surface-700 dark:bg-surface-800 dark:text-white"
            />
          )}
        </div>

        {/* Scale */}
        <div className="space-y-1.5">
          <p className="text-xs font-semibold text-surface-700 dark:text-surface-200">
            Scale
          </p>
          <div className="flex flex-wrap gap-1.5">
            {SCALE_PRESETS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setScalePercent(p)}
                disabled={isProcessing}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-[11px] font-semibold transition",
                  scalePercent === p
                    ? "border-primary-500 bg-primary-50 text-primary-700 dark:border-primary-500 dark:bg-primary-500/15 dark:text-primary-200"
                    : "border-surface-200 bg-white text-surface-600 hover:border-primary-300 dark:border-surface-700 dark:bg-surface-900 dark:text-surface-300"
                )}
              >
                {p}%
              </button>
            ))}
          </div>
          <p className="text-[11px] text-surface-500 dark:text-surface-400">
            Smaller scale = much smaller file. GIFs balloon fast.
          </p>
        </div>

        <div className="space-y-2 pt-1">
          <button
            type="button"
            onClick={onBuild}
            disabled={isProcessing || frames.length === 0}
            className="inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-primary-600 px-8 py-4 text-lg font-bold text-white shadow-lg ring-4 ring-primary-300/60 transition hover:bg-primary-700 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 disabled:ring-0 disabled:hover:scale-100"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Encoding…
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" /> Create GIF
              </>
            )}
          </button>
          <button
            type="button"
            onClick={onReset}
            disabled={isProcessing}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-surface-200 px-4 py-2 text-xs font-medium text-surface-600 transition hover:border-surface-300 hover:text-surface-900 disabled:cursor-not-allowed disabled:opacity-50 dark:border-surface-700 dark:text-surface-300 dark:hover:text-white"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>
        </div>
      </aside>
    </div>
  );
}

function LoopChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-2.5 py-1 text-[11px] font-semibold transition",
        active
          ? "border-primary-500 bg-primary-50 text-primary-700 dark:border-primary-500 dark:bg-primary-500/15 dark:text-primary-200"
          : "border-surface-200 bg-white text-surface-600 hover:border-primary-300 dark:border-surface-700 dark:bg-surface-900 dark:text-surface-300"
      )}
    >
      {children}
    </button>
  );
}

function StatusPill({ status, error }: { status: FileStatus; error?: string }) {
  const map = {
    pending: { icon: <span className="h-1.5 w-1.5 rounded-full bg-surface-400" />, label: "Pending", className: "bg-surface-100 text-surface-700 dark:bg-surface-800 dark:text-surface-300" },
    processing: { icon: <Loader2 className="h-3 w-3 animate-spin" />, label: "Processing", className: "bg-primary-100 text-primary-700 dark:bg-primary-500/15 dark:text-primary-200" },
    done: { icon: <CheckCircle2 className="h-3 w-3" />, label: "Done", className: "bg-success-100 text-success-700 dark:bg-success-500/15 dark:text-success-300" },
    error: { icon: <XCircle className="h-3 w-3" />, label: "Error", className: "bg-error-100 text-error-700 dark:bg-error-500/15 dark:text-error-300" },
  } as const;
  const s = map[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold",
        s.className
      )}
      title={status === "error" ? error : undefined}
    >
      {s.icon}
      {s.label}
    </span>
  );
}
