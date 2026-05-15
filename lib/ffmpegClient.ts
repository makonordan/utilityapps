// Lazy-loaded singleton wrapper around @ffmpeg/ffmpeg (single-threaded build).
// The single-threaded core does NOT require SharedArrayBuffer / COOP-COEP
// headers, so the page keeps ads, analytics, and third-party embeds working.
//
// The first call to `getFFmpeg()` fetches ~31 MB of WASM from unpkg, so every
// video-tool component should surface a clear loading state on first run.
// Subsequent calls reuse the loaded instance.

import type { FFmpeg } from "@ffmpeg/ffmpeg";

// Pinned to keep the WASM URL stable. Bump together with @ffmpeg/core in
// package.json so the loaded core matches the API surface in @ffmpeg/ffmpeg.
const FFMPEG_CORE_VERSION = "0.12.10";
const FFMPEG_CORE_BASE = `https://unpkg.com/@ffmpeg/core@${FFMPEG_CORE_VERSION}/dist/umd`;

let ffmpegInstance: FFmpeg | null = null;
let loadPromise: Promise<FFmpeg> | null = null;

export interface LoadOptions {
  /** Receives progress while the WASM core is downloading (0..1). */
  onDownloadProgress?: (ratio: number) => void;
  /** Receives FFmpeg's log lines (mostly useful for debugging codec errors). */
  onLog?: (message: string) => void;
}

/**
 * Returns a ready-to-use FFmpeg instance. Loads + caches on first call.
 */
export async function getFFmpeg(options: LoadOptions = {}): Promise<FFmpeg> {
  if (ffmpegInstance) return ffmpegInstance;
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    const { FFmpeg } = await import("@ffmpeg/ffmpeg");
    const { toBlobURL } = await import("@ffmpeg/util");

    const ff = new FFmpeg();

    if (options.onLog) {
      ff.on("log", ({ message }) => options.onLog!(message));
    }

    // toBlobURL fetches the asset and returns a blob: URL, which keeps the
    // core script same-origin and avoids cross-origin worker issues.
    const [coreURL, wasmURL] = await Promise.all([
      toBlobURL(`${FFMPEG_CORE_BASE}/ffmpeg-core.js`, "text/javascript"),
      toBlobURL(`${FFMPEG_CORE_BASE}/ffmpeg-core.wasm`, "application/wasm"),
    ]);

    await ff.load({ coreURL, wasmURL });

    ffmpegInstance = ff;
    options.onDownloadProgress?.(1);
    return ff;
  })();

  try {
    return await loadPromise;
  } catch (err) {
    // Reset so a retry can attempt the download again.
    loadPromise = null;
    throw err;
  }
}

export interface RunOptions {
  /** Filename to write the input file to inside FFmpeg's virtual FS. */
  inputName: string;
  /** Filename FFmpeg should write the output to. */
  outputName: string;
  /** FFmpeg CLI args. Use `inputName` and `outputName` as filename refs. */
  args: string[];
  /** Receives transcode progress 0..1 (FFmpeg's own estimate). */
  onProgress?: (ratio: number) => void;
  /** Output MIME type for the returned Blob. */
  outputMime: string;
}

export interface RunResult {
  blob: Blob;
  /** Wall-clock duration of the transcode (ms). */
  durationMs: number;
}

/**
 * Runs FFmpeg with the given args, returning the output file as a Blob.
 * Always cleans up the virtual FS so back-to-back runs don't leak memory.
 */
export async function runFFmpeg(file: File, opts: RunOptions): Promise<RunResult> {
  const { fetchFile } = await import("@ffmpeg/util");
  const ff = await getFFmpeg();
  const started = performance.now();

  const handler = ({ progress }: { progress: number }) => {
    // FFmpeg occasionally reports >1 near the end — clamp for UI sanity.
    opts.onProgress?.(Math.max(0, Math.min(1, progress)));
  };
  if (opts.onProgress) ff.on("progress", handler);

  try {
    await ff.writeFile(opts.inputName, await fetchFile(file));
    const exitCode = await ff.exec(opts.args);
    if (exitCode !== 0) {
      throw new Error(`FFmpeg exited with code ${exitCode}`);
    }
    const data = await ff.readFile(opts.outputName);
    const bytes = data instanceof Uint8Array ? data : new TextEncoder().encode(String(data));
    const blob = new Blob([bytes as BlobPart], { type: opts.outputMime });
    return { blob, durationMs: performance.now() - started };
  } finally {
    if (opts.onProgress) ff.off("progress", handler);
    // Best-effort cleanup; ignore "file not found" errors.
    try { await ff.deleteFile(opts.inputName); } catch { /* ignore */ }
    try { await ff.deleteFile(opts.outputName); } catch { /* ignore */ }
  }
}

/** Convenience: read multiple files out of the FFmpeg FS after `exec` ran. */
export async function readOutputFiles(names: string[]): Promise<Uint8Array[]> {
  const ff = await getFFmpeg();
  const out: Uint8Array[] = [];
  for (const name of names) {
    const data = await ff.readFile(name);
    out.push(data instanceof Uint8Array ? data : new TextEncoder().encode(String(data)));
    try { await ff.deleteFile(name); } catch { /* ignore */ }
  }
  return out;
}
