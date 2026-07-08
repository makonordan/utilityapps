"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import type {
  Canvas as FabricCanvas,
  FabricImage as FabricImageT,
  IText as FabricITextT,
  FabricObject,
} from "fabric";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Brush,
  Download,
  Eraser,
  FlipHorizontal,
  FlipVertical,
  Image as ImageIcon,
  Italic,
  Loader2,
  RotateCcw,
  Smile,
  Sparkles,
  Square,
  Trash2,
  Type,
  Underline,
  Undo2,
  Redo2,
  Wand2,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

import { ImageDropZone } from "@/components/image-tools/ImageDropZone";
import {
  IMAGE_TOOLS_CONFIG,
  SUPPORTED_FORMATS,
} from "@/lib/imageTools";
import {
  canvasToBlob,
  downloadFile,
  type ImageMimeType,
} from "@/lib/imageProcessing";
import { cn } from "@/lib/utils";

const TOOL_ID = "photo-editor";
const CONFIG = IMAGE_TOOLS_CONFIG[TOOL_ID];
const FORMAT_LABELS = SUPPORTED_FORMATS[TOOL_ID];

const EDITOR_MAX_W = 1100;
const EDITOR_MAX_H = 700;

// ──────────────────────────────────────────────────────────────────────────
// Types & static data
// ──────────────────────────────────────────────────────────────────────────

type Tab = "text" | "effects" | "stickers" | "frames" | "adjust" | "draw";
type OutputFormat = "png" | "jpeg" | "webp";
type BrushType = "pencil" | "circle" | "spray";

interface AdjustState {
  brightness: number;
  contrast: number;
  saturation: number;
  hueRotation: number;
  blur: number;
  noise: number;
  pixelate: number;
}

const ADJUST_DEFAULTS: AdjustState = {
  brightness: 0,
  contrast: 0,
  saturation: 0,
  hueRotation: 0,
  blur: 0,
  noise: 0,
  pixelate: 1,
};

const FONTS = [
  "Arial",
  "Helvetica",
  "Georgia",
  "Times New Roman",
  "Verdana",
  "Trebuchet MS",
  "Courier New",
  "Impact",
  "Comic Sans MS",
  "Tahoma",
];

const STICKER_GROUPS: { name: string; items: string[] }[] = [
  { name: "Emoji", items: ["😀", "😎", "❤️", "🔥", "🎉", "⭐", "🌈", "🌟"] },
  { name: "Arrows", items: ["↑", "→", "↓", "←", "↗", "↘", "↙", "↖"] },
  { name: "Shapes", items: ["★", "●", "■", "▲", "♦", "♥", "♣", "♠"] },
  { name: "Holiday", items: ["🎃", "🎄", "🎁", "🦃", "🐰", "🎂", "💐", "🍀"] },
];

const EFFECT_PRESETS = [
  { id: "grayscale", label: "Grayscale" },
  { id: "sepia", label: "Sepia" },
  { id: "vintage", label: "Vintage" },
  { id: "blackwhite", label: "B&W High Contrast" },
  { id: "kodachrome", label: "Kodachrome" },
  { id: "polaroid", label: "Polaroid" },
  { id: "technicolor", label: "Technicolor" },
  { id: "vivid", label: "Vivid" },
  { id: "cool", label: "Cool" },
  { id: "warm", label: "Warm" },
  { id: "fade", label: "Fade" },
  { id: "sharpen", label: "Sharpen" },
  { id: "blur", label: "Blur" },
  { id: "brightness-up", label: "Brightness +" },
  { id: "brightness-down", label: "Brightness −" },
  { id: "contrast-up", label: "Contrast +" },
  { id: "contrast-down", label: "Contrast −" },
] as const;

const FRAME_STYLES = [
  { id: "border", label: "Simple border" },
  { id: "rounded", label: "Rounded corners" },
  { id: "polaroid", label: "Polaroid" },
  { id: "filmstrip", label: "Film strip" },
  { id: "instagram", label: "Square crop" },
  { id: "vignette", label: "Vignette" },
  { id: "torn", label: "Torn paper" },
  { id: "grunge", label: "Grunge" },
] as const;

// ──────────────────────────────────────────────────────────────────────────
// Component
// ──────────────────────────────────────────────────────────────────────────

export function PhotoEditor() {
  const canvasElRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<FabricCanvas | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [hasImage, setHasImage] = useState(false);

  const [activeTab, setActiveTab] = useState<Tab>("text");
  const [selection, setSelection] = useState<FabricObject | null>(null);

  // History
  const historyRef = useRef<string[]>([]);
  const historyIdxRef = useRef(-1);
  const isRestoringRef = useRef(false);
  const [historyTick, setHistoryTick] = useState(0); // forces undo/redo button re-eval

  // Tab state
  const [adjust, setAdjust] = useState<AdjustState>(ADJUST_DEFAULTS);
  const [drawing, setDrawing] = useState(false);
  const [brushType, setBrushType] = useState<BrushType>("pencil");
  const [brushSize, setBrushSize] = useState(8);
  const [brushColor, setBrushColor] = useState("#0066FF");
  const [brushOpacity, setBrushOpacity] = useState(100);

  // Download
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("png");
  const [outputQuality, setOutputQuality] = useState(95);

  // ───── Initialise Fabric canvas (deferred to avoid SSR issues) ─────
  useEffect(() => {
    let disposed = false;
    let canvas: FabricCanvas | null = null;
    (async () => {
      const fabricMod = await import("fabric");
      if (disposed || !canvasElRef.current) return;
      canvas = new fabricMod.Canvas(canvasElRef.current, {
        width: EDITOR_MAX_W,
        height: EDITOR_MAX_H,
        backgroundColor: "#f3f4f6",
        preserveObjectStacking: true,
      });
      fabricRef.current = canvas;

      const onChange = () => {
        if (isRestoringRef.current) return;
        snapshotHistory();
      };
      canvas.on("object:added", onChange);
      canvas.on("object:modified", onChange);
      canvas.on("object:removed", onChange);
      canvas.on("path:created", onChange);
      canvas.on("selection:created", (e) =>
        setSelection((e.selected?.[0] as FabricObject) ?? null)
      );
      canvas.on("selection:updated", (e) =>
        setSelection((e.selected?.[0] as FabricObject) ?? null)
      );
      canvas.on("selection:cleared", () => setSelection(null));

      setIsReady(true);
    })();
    return () => {
      disposed = true;
      if (canvas) {
        try {
          canvas.dispose();
        } catch {
          /* ignore */
        }
      }
      fabricRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ───── History helpers ─────
  const snapshotHistory = useCallback(() => {
    const c = fabricRef.current;
    if (!c) return;
    const snap = JSON.stringify(c.toJSON());
    // Truncate any "future" beyond current index when a new edit happens.
    historyRef.current = historyRef.current.slice(0, historyIdxRef.current + 1);
    historyRef.current.push(snap);
    // Cap at 50 to keep memory bounded.
    if (historyRef.current.length > 50) {
      historyRef.current.shift();
    } else {
      historyIdxRef.current += 1;
    }
    setHistoryTick((t) => t + 1);
  }, []);

  const restoreSnapshot = useCallback(async (json: string) => {
    const c = fabricRef.current;
    if (!c) return;
    isRestoringRef.current = true;
    try {
      await c.loadFromJSON(JSON.parse(json));
      c.renderAll();
    } finally {
      isRestoringRef.current = false;
    }
  }, []);

  const undo = useCallback(() => {
    if (historyIdxRef.current <= 0) return;
    historyIdxRef.current -= 1;
    void restoreSnapshot(historyRef.current[historyIdxRef.current]);
    setHistoryTick((t) => t + 1);
  }, [restoreSnapshot]);

  const redo = useCallback(() => {
    if (historyIdxRef.current >= historyRef.current.length - 1) return;
    historyIdxRef.current += 1;
    void restoreSnapshot(historyRef.current[historyIdxRef.current]);
    setHistoryTick((t) => t + 1);
  }, [restoreSnapshot]);

  // Read historyTick so React re-evaluates canUndo/canRedo every time
  // setHistoryTick fires — the ref-based history doesn't trigger renders on its own.
  void historyTick;
  const canUndo = historyIdxRef.current > 0;
  const canRedo = historyIdxRef.current < historyRef.current.length - 1;

  // ───── File intake → load onto canvas ─────
  const onFilesSelected = useCallback(async (selected: File[]) => {
    const file = selected[0];
    const c = fabricRef.current;
    if (!file || !c) return;

    const fabricMod = await import("fabric");
    const url = URL.createObjectURL(file);
    try {
      const img = await fabricMod.FabricImage.fromURL(url);
      const naturalW = img.width ?? 0;
      const naturalH = img.height ?? 0;
      if (!naturalW || !naturalH) throw new Error("Image has no dimensions");

      const scale = Math.min(1, EDITOR_MAX_W / naturalW, EDITOR_MAX_H / naturalH);
      const dispW = Math.round(naturalW * scale);
      const dispH = Math.round(naturalH * scale);

      c.clear();
      c.setDimensions({ width: dispW, height: dispH });
      img.scale(scale);
      img.set({
        left: 0,
        top: 0,
        selectable: false,
        hasControls: false,
        evented: false,
      });
      c.add(img);
      c.renderAll();

      // Reset history so the loaded image is the baseline.
      historyRef.current = [JSON.stringify(c.toJSON())];
      historyIdxRef.current = 0;
      setHistoryTick((t) => t + 1);
      setHasImage(true);
      setAdjust(ADJUST_DEFAULTS);
    } finally {
      URL.revokeObjectURL(url);
    }
  }, []);

  // ───── Toolbar actions ─────
  const flipHorizontal = useCallback(() => {
    const c = fabricRef.current;
    if (!c) return;
    const target = (c.getActiveObject() as FabricObject | null) ?? c.getObjects()[0];
    if (!target) return;
    target.set("flipX", !target.get("flipX"));
    c.requestRenderAll();
    snapshotHistory();
  }, [snapshotHistory]);

  const flipVertical = useCallback(() => {
    const c = fabricRef.current;
    if (!c) return;
    const target = (c.getActiveObject() as FabricObject | null) ?? c.getObjects()[0];
    if (!target) return;
    target.set("flipY", !target.get("flipY"));
    c.requestRenderAll();
    snapshotHistory();
  }, [snapshotHistory]);

  const zoom = useCallback((factor: number) => {
    const c = fabricRef.current;
    if (!c) return;
    const newZoom = Math.min(4, Math.max(0.25, c.getZoom() * factor));
    c.setZoom(newZoom);
    c.requestRenderAll();
  }, []);

  const deleteSelected = useCallback(() => {
    const c = fabricRef.current;
    if (!c) return;
    const objs = c.getActiveObjects();
    if (objs.length === 0) return;
    objs.forEach((o) => c.remove(o));
    c.discardActiveObject();
    c.requestRenderAll();
    setSelection(null);
  }, []);

  // ───── Download ─────
  const downloadOutput = useCallback(async () => {
    const c = fabricRef.current;
    if (!c) return;
    // Snap zoom back to 1 for export so the output isn't cropped/scaled.
    const oldZoom = c.getZoom();
    c.setZoom(1);
    try {
      const el = c.lowerCanvasEl ?? (c.getElement() as HTMLCanvasElement);
      const mime: ImageMimeType =
        outputFormat === "png"
          ? "image/png"
          : outputFormat === "webp"
            ? "image/webp"
            : "image/jpeg";
      const blob = await canvasToBlob(el, mime, outputQuality / 100);
      downloadFile(blob, `edited.${outputFormat === "jpeg" ? "jpg" : outputFormat}`);
    } finally {
      c.setZoom(oldZoom);
      c.requestRenderAll();
    }
  }, [outputFormat, outputQuality]);

  // ───── Tab actions: Text ─────
  const addText = useCallback(async () => {
    const c = fabricRef.current;
    if (!c) return;
    const fabricMod = await import("fabric");
    const t = new fabricMod.IText("Double-click to edit", {
      left: c.getWidth() / 2 - 80,
      top: c.getHeight() / 2 - 16,
      fontFamily: "Arial",
      fontSize: 32,
      fill: "#111827",
    });
    c.add(t);
    c.setActiveObject(t);
    c.requestRenderAll();
  }, []);

  // ───── Tab actions: Stickers ─────
  const addSticker = useCallback(
    async (glyph: string) => {
      const c = fabricRef.current;
      if (!c) return;
      const fabricMod = await import("fabric");
      const t = new fabricMod.IText(glyph, {
        left: c.getWidth() / 2 - 40,
        top: c.getHeight() / 2 - 40,
        fontSize: 80,
        fontFamily: "Arial",
      });
      c.add(t);
      c.setActiveObject(t);
      c.requestRenderAll();
    },
    []
  );

  // ───── Tab actions: Effects ─────
  const applyEffect = useCallback(async (id: string) => {
    const c = fabricRef.current;
    if (!c) return;
    const fabricMod = await import("fabric");
    // Apply to the first FabricImage (the base photo). Otherwise the selection.
    const target =
      (c.getActiveObject() as FabricObject | null) ??
      (c.getObjects().find((o) => o.type === "image") as FabricObject | null);
    if (!target || target.type !== "image") return;
    const img = target as FabricImageT;
    const f = fabricMod.filters;

    const make = (): FabricObject[] | null => {
      switch (id) {
        case "grayscale":
          return [new f.Grayscale()] as unknown as FabricObject[];
        case "sepia":
          return [new f.Sepia()] as unknown as FabricObject[];
        case "vintage":
          return [new f.Vintage()] as unknown as FabricObject[];
        case "blackwhite":
          return [new f.BlackWhite(), new f.Contrast({ contrast: 0.3 })] as unknown as FabricObject[];
        case "kodachrome":
          return [new f.Kodachrome()] as unknown as FabricObject[];
        case "polaroid":
          return [new f.Polaroid()] as unknown as FabricObject[];
        case "technicolor":
          return [new f.Technicolor()] as unknown as FabricObject[];
        case "vivid":
          return [
            new f.Saturation({ saturation: 0.5 }),
            new f.Contrast({ contrast: 0.15 }),
          ] as unknown as FabricObject[];
        case "cool":
          return [new f.HueRotation({ rotation: -0.2 })] as unknown as FabricObject[];
        case "warm":
          return [new f.HueRotation({ rotation: 0.18 })] as unknown as FabricObject[];
        case "fade":
          return [
            new f.Saturation({ saturation: -0.3 }),
            new f.Brightness({ brightness: 0.05 }),
          ] as unknown as FabricObject[];
        case "blur":
          return [new f.Blur({ blur: 0.15 })] as unknown as FabricObject[];
        case "sharpen":
          return [
            new f.Convolute({
              matrix: [0, -1, 0, -1, 5, -1, 0, -1, 0],
            }),
          ] as unknown as FabricObject[];
        case "brightness-up":
          return [new f.Brightness({ brightness: 0.1 })] as unknown as FabricObject[];
        case "brightness-down":
          return [new f.Brightness({ brightness: -0.1 })] as unknown as FabricObject[];
        case "contrast-up":
          return [new f.Contrast({ contrast: 0.15 })] as unknown as FabricObject[];
        case "contrast-down":
          return [new f.Contrast({ contrast: -0.15 })] as unknown as FabricObject[];
        default:
          return null;
      }
    };

    const filters = make();
    if (!filters) return;
    img.filters = filters as unknown as typeof img.filters;
    img.applyFilters();
    c.requestRenderAll();
    snapshotHistory();
  }, [snapshotHistory]);

  // ───── Tab actions: Frames ─────
  const applyFrame = useCallback(
    async (id: string) => {
      const c = fabricRef.current;
      if (!c) return;
      const fabricMod = await import("fabric");
      const w = c.getWidth();
      const h = c.getHeight();
      // Strip any existing frame first (objects with our metadata flag).
      c.getObjects()
        .filter((o) => (o as FabricObject & { __frame?: boolean }).__frame)
        .forEach((o) => c.remove(o));

      const mark = (obj: FabricObject) => {
        (obj as FabricObject & { __frame?: boolean }).__frame = true;
        obj.set({ selectable: false, evented: false });
        return obj;
      };

      const add = (obj: FabricObject) => c.add(mark(obj));

      switch (id) {
        case "border":
          add(
            new fabricMod.Rect({
              left: 0,
              top: 0,
              width: w - 12,
              height: h - 12,
              fill: "transparent",
              stroke: "#111827",
              strokeWidth: 12,
            })
          );
          break;
        case "rounded":
          add(
            new fabricMod.Rect({
              left: 0,
              top: 0,
              width: w - 8,
              height: h - 8,
              fill: "transparent",
              stroke: "#ffffff",
              strokeWidth: 8,
              rx: 24,
              ry: 24,
            })
          );
          break;
        case "polaroid":
          add(
            new fabricMod.Rect({
              left: -30,
              top: -30,
              width: w + 30,
              height: h + 80,
              fill: "#ffffff",
              stroke: "#e5e7eb",
              strokeWidth: 2,
              shadow: new fabricMod.Shadow({
                color: "rgba(0,0,0,0.25)",
                blur: 18,
                offsetX: 0,
                offsetY: 6,
              }),
            })
          );
          // Re-stack: polaroid behind the photo.
          c.sendObjectToBack(c.getObjects().slice(-1)[0]);
          break;
        case "filmstrip": {
          // Two horizontal black bars with sprocket holes (rectangles).
          add(
            new fabricMod.Rect({
              left: 0,
              top: 0,
              width: w,
              height: 24,
              fill: "#0b0b0b",
            })
          );
          add(
            new fabricMod.Rect({
              left: 0,
              top: h - 24,
              width: w,
              height: 24,
              fill: "#0b0b0b",
            })
          );
          for (let x = 8; x < w - 16; x += 32) {
            add(
              new fabricMod.Rect({
                left: x,
                top: 6,
                width: 16,
                height: 12,
                fill: "#ffffff",
              })
            );
            add(
              new fabricMod.Rect({
                left: x,
                top: h - 18,
                width: 16,
                height: 12,
                fill: "#ffffff",
              })
            );
          }
          break;
        }
        case "instagram":
          add(
            new fabricMod.Rect({
              left: 0,
              top: 0,
              width: w - 18,
              height: h - 18,
              fill: "transparent",
              stroke: "#ffffff",
              strokeWidth: 18,
            })
          );
          break;
        case "vignette":
          add(
            new fabricMod.Rect({
              left: 0,
              top: 0,
              width: w,
              height: h,
              fill: new fabricMod.Gradient({
                type: "radial",
                coords: { x1: w / 2, y1: h / 2, r1: Math.min(w, h) * 0.3, x2: w / 2, y2: h / 2, r2: Math.max(w, h) * 0.7 },
                colorStops: [
                  { offset: 0, color: "rgba(0,0,0,0)" },
                  { offset: 1, color: "rgba(0,0,0,0.65)" },
                ],
              }),
            })
          );
          break;
        case "torn":
          // Approximation: jagged top + bottom strips.
          for (let x = 0; x < w; x += 22) {
            add(
              new fabricMod.Rect({
                left: x,
                top: 0,
                width: 18,
                height: 6 + Math.random() * 12,
                fill: "#ffffff",
              })
            );
            add(
              new fabricMod.Rect({
                left: x,
                top: h - (6 + Math.random() * 12),
                width: 18,
                height: 6 + Math.random() * 12,
                fill: "#ffffff",
              })
            );
          }
          break;
        case "grunge":
          for (let i = 0; i < 30; i++) {
            const cx = Math.random() * w;
            const cy = Math.random() * h;
            const radius = 4 + Math.random() * 18;
            add(
              new fabricMod.Circle({
                left: cx - radius,
                top: cy - radius,
                radius,
                fill: `rgba(0,0,0,${0.05 + Math.random() * 0.1})`,
              })
            );
          }
          break;
      }
      c.requestRenderAll();
      snapshotHistory();
    },
    [snapshotHistory]
  );

  // ───── Tab actions: Adjust ─────
  const applyAdjust = useCallback(async () => {
    const c = fabricRef.current;
    if (!c) return;
    const fabricMod = await import("fabric");
    const baseImage = c.getObjects().find((o) => o.type === "image") as
      | FabricImageT
      | undefined;
    if (!baseImage) return;
    const f = fabricMod.filters;
    const filters: FabricObject[] = [];

    if (adjust.brightness !== 0)
      filters.push(new f.Brightness({ brightness: adjust.brightness / 100 }) as unknown as FabricObject);
    if (adjust.contrast !== 0)
      filters.push(new f.Contrast({ contrast: adjust.contrast / 100 }) as unknown as FabricObject);
    if (adjust.saturation !== 0)
      filters.push(new f.Saturation({ saturation: adjust.saturation / 100 }) as unknown as FabricObject);
    if (adjust.hueRotation !== 0)
      filters.push(new f.HueRotation({ rotation: adjust.hueRotation / 360 }) as unknown as FabricObject);
    if (adjust.blur > 0)
      filters.push(new f.Blur({ blur: adjust.blur / 100 }) as unknown as FabricObject);
    if (adjust.noise > 0)
      filters.push(new f.Noise({ noise: adjust.noise }) as unknown as FabricObject);
    if (adjust.pixelate > 1)
      filters.push(new f.Pixelate({ blocksize: Math.max(1, Math.round(adjust.pixelate)) }) as unknown as FabricObject);

    baseImage.filters = filters as unknown as typeof baseImage.filters;
    baseImage.applyFilters();
    c.requestRenderAll();
    snapshotHistory();
  }, [adjust, snapshotHistory]);

  const resetAdjust = useCallback(() => {
    setAdjust(ADJUST_DEFAULTS);
    const c = fabricRef.current;
    if (!c) return;
    const baseImage = c.getObjects().find((o) => o.type === "image") as
      | FabricImageT
      | undefined;
    if (!baseImage) return;
    baseImage.filters = [];
    baseImage.applyFilters();
    c.requestRenderAll();
    snapshotHistory();
  }, [snapshotHistory]);

  // ───── Tab actions: Draw ─────
  const setDrawingActive = useCallback(
    async (active: boolean) => {
      const c = fabricRef.current;
      if (!c) return;
      c.isDrawingMode = active;
      if (active) {
        await syncBrush();
      }
      setDrawing(active);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const syncBrush = useCallback(async () => {
    const c = fabricRef.current;
    if (!c) return;
    const fabricMod = await import("fabric");
    let brush: import("fabric").BaseBrush;
    if (brushType === "circle") brush = new fabricMod.CircleBrush(c);
    else if (brushType === "spray") brush = new fabricMod.SprayBrush(c);
    else brush = new fabricMod.PencilBrush(c);
    brush.width = brushSize;
    // Apply opacity by mixing colour. fabric brushes use a colour string.
    const a = Math.max(0.05, brushOpacity / 100);
    brush.color = hexToRgba(brushColor, a);
    c.freeDrawingBrush = brush;
  }, [brushColor, brushOpacity, brushSize, brushType]);

  // Keep brush in sync while drawing tab is active.
  useEffect(() => {
    if (drawing) void syncBrush();
  }, [drawing, syncBrush]);

  // Switching tabs: leave drawing mode if we move away from Draw.
  useEffect(() => {
    if (activeTab !== "draw" && drawing) void setDrawingActive(false);
  }, [activeTab, drawing, setDrawingActive]);

  const clearDrawing = useCallback(() => {
    const c = fabricRef.current;
    if (!c) return;
    c.getObjects()
      .filter((o) => o.type === "path")
      .forEach((o) => c.remove(o));
    c.requestRenderAll();
    snapshotHistory();
  }, [snapshotHistory]);

  // ──────────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5">
      {!hasImage && (
        <ImageDropZone
          onFilesSelected={onFilesSelected}
          acceptedFormats={[...CONFIG.acceptedFormats]}
          maxSizeMB={CONFIG.maxFileSizeMB}
          multiple={false}
          formatLabels={FORMAT_LABELS}
        />
      )}

      {/* Editor */}
      <div
        className={cn(
          "rounded-2xl border border-surface-200 bg-white shadow-sm dark:border-surface-800 dark:bg-surface-900",
          !hasImage && "opacity-60"
        )}
      >
        <Toolbar
          canUndo={canUndo}
          canRedo={canRedo}
          hasImage={hasImage}
          onUndo={undo}
          onRedo={redo}
          onZoomIn={() => zoom(1.2)}
          onZoomOut={() => zoom(0.8)}
          onFlipH={flipHorizontal}
          onFlipV={flipVertical}
          onDelete={deleteSelected}
          outputFormat={outputFormat}
          setOutputFormat={setOutputFormat}
          outputQuality={outputQuality}
          setOutputQuality={setOutputQuality}
          onDownload={downloadOutput}
        />

        <div className="grid gap-0 lg:grid-cols-[64px_1fr_320px]">
          {/* Tabs (left) */}
          <nav className="flex shrink-0 flex-row gap-1 overflow-x-auto border-y border-surface-100 bg-surface-50 p-2 dark:border-surface-800 dark:bg-surface-900/40 lg:flex-col lg:overflow-visible lg:border-x-0 lg:border-y-0 lg:border-r">
            <TabBtn active={activeTab === "text"} onClick={() => setActiveTab("text")} icon={<Type className="h-4 w-4" />} label="Text" />
            <TabBtn active={activeTab === "effects"} onClick={() => setActiveTab("effects")} icon={<Sparkles className="h-4 w-4" />} label="Effects" />
            <TabBtn active={activeTab === "stickers"} onClick={() => setActiveTab("stickers")} icon={<Smile className="h-4 w-4" />} label="Stickers" />
            <TabBtn active={activeTab === "frames"} onClick={() => setActiveTab("frames")} icon={<Square className="h-4 w-4" />} label="Frames" />
            <TabBtn active={activeTab === "adjust"} onClick={() => setActiveTab("adjust")} icon={<Wand2 className="h-4 w-4" />} label="Adjust" />
            <TabBtn active={activeTab === "draw"} onClick={() => setActiveTab("draw")} icon={<Brush className="h-4 w-4" />} label="Draw" />
          </nav>

          {/* Canvas */}
          <div className="flex min-h-[400px] items-center justify-center overflow-auto bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.05)_1px,transparent_0)] [background-size:16px_16px] dark:bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05)_1px,transparent_0)]">
            <div className="m-4 inline-block rounded-lg bg-white p-2 shadow-sm dark:bg-surface-900">
              <canvas ref={canvasElRef} />
              {!isReady && (
                <div className="flex items-center justify-center gap-2 py-8 text-sm text-surface-500 dark:text-surface-400">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading editor…
                </div>
              )}
            </div>
          </div>

          {/* Right panel — context-sensitive */}
          <aside className="border-t border-surface-100 p-4 dark:border-surface-800 lg:border-l lg:border-t-0">
            {activeTab === "text" && (
              <TextPanel
                onAddText={addText}
                selection={selection}
                onMutate={() => fabricRef.current?.requestRenderAll()}
                onCommit={snapshotHistory}
              />
            )}
            {activeTab === "effects" && <EffectsPanel onApply={applyEffect} />}
            {activeTab === "stickers" && <StickersPanel onAdd={addSticker} />}
            {activeTab === "frames" && <FramesPanel onApply={applyFrame} />}
            {activeTab === "adjust" && (
              <AdjustPanel
                state={adjust}
                onChange={setAdjust}
                onApply={applyAdjust}
                onReset={resetAdjust}
              />
            )}
            {activeTab === "draw" && (
              <DrawPanel
                drawing={drawing}
                setDrawingActive={setDrawingActive}
                brushType={brushType}
                setBrushType={setBrushType}
                brushSize={brushSize}
                setBrushSize={setBrushSize}
                brushColor={brushColor}
                setBrushColor={setBrushColor}
                brushOpacity={brushOpacity}
                setBrushOpacity={setBrushOpacity}
                onClear={clearDrawing}
              />
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Toolbar
// ──────────────────────────────────────────────────────────────────────────

function Toolbar({
  canUndo,
  canRedo,
  hasImage,
  onUndo,
  onRedo,
  onZoomIn,
  onZoomOut,
  onFlipH,
  onFlipV,
  onDelete,
  outputFormat,
  setOutputFormat,
  outputQuality,
  setOutputQuality,
  onDownload,
}: {
  canUndo: boolean;
  canRedo: boolean;
  hasImage: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFlipH: () => void;
  onFlipV: () => void;
  onDelete: () => void;
  outputFormat: OutputFormat;
  setOutputFormat: (f: OutputFormat) => void;
  outputQuality: number;
  setOutputQuality: (n: number) => void;
  onDownload: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-surface-100 p-2 dark:border-surface-800">
      <ToolbarBtn onClick={onUndo} disabled={!canUndo || !hasImage} title="Undo">
        <Undo2 className="h-4 w-4" />
      </ToolbarBtn>
      <ToolbarBtn onClick={onRedo} disabled={!canRedo || !hasImage} title="Redo">
        <Redo2 className="h-4 w-4" />
      </ToolbarBtn>
      <Divider />
      <ToolbarBtn onClick={onZoomIn} disabled={!hasImage} title="Zoom in">
        <ZoomIn className="h-4 w-4" />
      </ToolbarBtn>
      <ToolbarBtn onClick={onZoomOut} disabled={!hasImage} title="Zoom out">
        <ZoomOut className="h-4 w-4" />
      </ToolbarBtn>
      <Divider />
      <ToolbarBtn onClick={onFlipH} disabled={!hasImage} title="Flip horizontally">
        <FlipHorizontal className="h-4 w-4" />
      </ToolbarBtn>
      <ToolbarBtn onClick={onFlipV} disabled={!hasImage} title="Flip vertically">
        <FlipVertical className="h-4 w-4" />
      </ToolbarBtn>
      <Divider />
      <ToolbarBtn onClick={onDelete} disabled={!hasImage} title="Delete selected">
        <Trash2 className="h-4 w-4" />
      </ToolbarBtn>

      <div className="ml-auto flex flex-wrap items-center gap-2">
        <select
          value={outputFormat}
          onChange={(e) => setOutputFormat(e.target.value as OutputFormat)}
          disabled={!hasImage}
          className="rounded-lg border border-surface-200 bg-white px-2 py-1 text-xs font-medium text-surface-900 dark:border-surface-700 dark:bg-surface-800 dark:text-white"
        >
          <option value="png">PNG</option>
          <option value="jpeg">JPG</option>
          <option value="webp">WEBP</option>
        </select>
        {outputFormat !== "png" && (
          <span className="hidden items-center gap-1 sm:inline-flex">
            <input
              type="range"
              min={1}
              max={100}
              value={outputQuality}
              onChange={(e) => setOutputQuality(Number(e.target.value))}
              className="w-20 accent-primary-600"
            />
            <span className="w-7 text-center text-[11px] font-bold tabular-nums text-primary-700 dark:text-primary-300">
              {outputQuality}
            </span>
          </span>
        )}
        <button
          type="button"
          onClick={onDownload}
          disabled={!hasImage}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Download className="h-3.5 w-3.5" />
          Download
        </button>
      </div>
    </div>
  );
}

function ToolbarBtn({
  onClick,
  disabled,
  title,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-transparent text-surface-600 transition hover:border-surface-200 hover:bg-surface-50 hover:text-surface-900 disabled:cursor-not-allowed disabled:opacity-40 dark:text-surface-300 dark:hover:border-surface-700 dark:hover:bg-surface-800 dark:hover:text-white"
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span className="mx-0.5 h-5 w-px bg-surface-200 dark:bg-surface-700" />;
}

// ──────────────────────────────────────────────────────────────────────────
// Tabs / panels
// ──────────────────────────────────────────────────────────────────────────

function TabBtn({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      className={cn(
        "flex shrink-0 flex-col items-center gap-0.5 rounded-md px-2 py-1.5 text-[10px] font-semibold transition",
        active
          ? "bg-primary-100 text-primary-700 dark:bg-primary-500/15 dark:text-primary-200"
          : "text-surface-600 hover:bg-surface-100 hover:text-surface-900 dark:text-surface-300 dark:hover:bg-surface-800 dark:hover:text-white"
      )}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

// ── Text panel ─────────────────────────────────────────────────────────────

function TextPanel({
  onAddText,
  selection,
  onMutate,
  onCommit,
}: {
  onAddText: () => void;
  selection: FabricObject | null;
  onMutate: () => void;
  onCommit: () => void;
}) {
  const isText = !!selection && (selection.type === "i-text" || selection.type === "textbox" || selection.type === "text");
  const t = isText ? (selection as FabricITextT) : null;
  const setProp = (key: string, value: unknown) => {
    if (!t) return;
    t.set(key, value);
    onMutate();
  };

  return (
    <div className="space-y-4">
      <PanelHeader title="Text" />
      <button
        type="button"
        onClick={onAddText}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700"
      >
        <Type className="h-4 w-4" /> Add text
      </button>

      {!t && (
        <p className="rounded-lg border border-dashed border-surface-200 px-3 py-4 text-center text-xs text-surface-500 dark:border-surface-700 dark:text-surface-400">
          Tap a text element on the canvas to edit its properties.
        </p>
      )}

      {t && (
        <div className="space-y-3">
          <Field label="Font">
            <select
              value={(t.fontFamily as string) ?? "Arial"}
              onChange={(e) => setProp("fontFamily", e.target.value)}
              onBlur={onCommit}
              className="w-full rounded-md border border-surface-200 bg-white px-2 py-1 text-xs text-surface-900 dark:border-surface-700 dark:bg-surface-800 dark:text-white"
            >
              {FONTS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </Field>

          <Field label={`Size · ${(t.fontSize as number) ?? 32}px`}>
            <input
              type="range"
              min={12}
              max={200}
              value={(t.fontSize as number) ?? 32}
              onChange={(e) => setProp("fontSize", Number(e.target.value))}
              onMouseUp={onCommit}
              onTouchEnd={onCommit}
              className="w-full accent-primary-600"
            />
          </Field>

          <div className="flex items-center gap-1">
            <ToggleBtn
              active={t.fontWeight === "bold"}
              onClick={() => {
                setProp("fontWeight", t.fontWeight === "bold" ? "normal" : "bold");
                onCommit();
              }}
              title="Bold"
            >
              <Bold className="h-3.5 w-3.5" />
            </ToggleBtn>
            <ToggleBtn
              active={t.fontStyle === "italic"}
              onClick={() => {
                setProp("fontStyle", t.fontStyle === "italic" ? "normal" : "italic");
                onCommit();
              }}
              title="Italic"
            >
              <Italic className="h-3.5 w-3.5" />
            </ToggleBtn>
            <ToggleBtn
              active={!!t.underline}
              onClick={() => {
                setProp("underline", !t.underline);
                onCommit();
              }}
              title="Underline"
            >
              <Underline className="h-3.5 w-3.5" />
            </ToggleBtn>
            <span className="mx-1 h-5 w-px bg-surface-200 dark:bg-surface-700" />
            <ToggleBtn
              active={t.textAlign === "left"}
              onClick={() => {
                setProp("textAlign", "left");
                onCommit();
              }}
              title="Align left"
            >
              <AlignLeft className="h-3.5 w-3.5" />
            </ToggleBtn>
            <ToggleBtn
              active={t.textAlign === "center"}
              onClick={() => {
                setProp("textAlign", "center");
                onCommit();
              }}
              title="Align center"
            >
              <AlignCenter className="h-3.5 w-3.5" />
            </ToggleBtn>
            <ToggleBtn
              active={t.textAlign === "right"}
              onClick={() => {
                setProp("textAlign", "right");
                onCommit();
              }}
              title="Align right"
            >
              <AlignRight className="h-3.5 w-3.5" />
            </ToggleBtn>
          </div>

          <Field label="Text colour">
            <ColorRow
              value={(t.fill as string) ?? "#111827"}
              onChange={(c) => setProp("fill", c)}
              onCommit={onCommit}
            />
          </Field>
          <Field label="Highlight">
            <ColorRow
              value={(t.backgroundColor as string) ?? "#ffffff"}
              onChange={(c) => setProp("backgroundColor", c)}
              onCommit={onCommit}
              allowEmpty
              onClear={() => {
                setProp("backgroundColor", "");
                onCommit();
              }}
            />
          </Field>
          <Field label="Stroke (outline)">
            <div className="grid grid-cols-[1fr_70px] gap-2">
              <ColorRow
                value={(t.stroke as string) ?? "#ffffff"}
                onChange={(c) => setProp("stroke", c)}
                onCommit={onCommit}
                allowEmpty
                onClear={() => {
                  setProp("stroke", "");
                  setProp("strokeWidth", 0);
                  onCommit();
                }}
              />
              <input
                type="number"
                min={0}
                max={20}
                step={0.5}
                value={(t.strokeWidth as number) ?? 0}
                onChange={(e) => setProp("strokeWidth", Number(e.target.value))}
                onBlur={onCommit}
                className="w-full rounded-md border border-surface-200 bg-white px-2 py-1 text-xs tabular-nums text-surface-900 dark:border-surface-700 dark:bg-surface-800 dark:text-white"
              />
            </div>
          </Field>
        </div>
      )}
    </div>
  );
}

// ── Effects panel ──────────────────────────────────────────────────────────

function EffectsPanel({ onApply }: { onApply: (id: string) => void }) {
  return (
    <div className="space-y-4">
      <PanelHeader title="Effects" />
      <p className="text-xs text-surface-500 dark:text-surface-400">
        Click an effect to apply it to the photo. Each filter replaces the previous one.
      </p>
      <div className="grid grid-cols-2 gap-2">
        {EFFECT_PRESETS.map((e) => (
          <button
            key={e.id}
            type="button"
            onClick={() => onApply(e.id)}
            className="rounded-lg border border-surface-200 bg-white px-2.5 py-2 text-left text-xs font-semibold text-surface-700 transition hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700 dark:border-surface-700 dark:bg-surface-900 dark:text-surface-200 dark:hover:border-primary-500 dark:hover:bg-primary-500/10"
          >
            {e.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Stickers panel ─────────────────────────────────────────────────────────

function StickersPanel({ onAdd }: { onAdd: (glyph: string) => void }) {
  return (
    <div className="space-y-4">
      <PanelHeader title="Stickers" />
      {STICKER_GROUPS.map((group) => (
        <div key={group.name} className="space-y-1.5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
            {group.name}
          </p>
          <div className="grid grid-cols-4 gap-1.5">
            {group.items.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => onAdd(g)}
                className="flex h-12 items-center justify-center rounded-lg border border-surface-200 bg-white text-2xl transition hover:border-primary-300 hover:bg-primary-50 dark:border-surface-700 dark:bg-surface-900 dark:hover:border-primary-500 dark:hover:bg-primary-500/10"
              >
                {g}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Frames panel ───────────────────────────────────────────────────────────

function FramesPanel({ onApply }: { onApply: (id: string) => void }) {
  return (
    <div className="space-y-4">
      <PanelHeader title="Frames" />
      <p className="text-xs text-surface-500 dark:text-surface-400">
        Each frame replaces the previous one. Apply a fresh frame to clear it.
      </p>
      <div className="grid grid-cols-2 gap-2">
        {FRAME_STYLES.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => onApply(f.id)}
            className="rounded-lg border border-surface-200 bg-white px-2.5 py-2 text-left text-xs font-semibold text-surface-700 transition hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700 dark:border-surface-700 dark:bg-surface-900 dark:text-surface-200 dark:hover:border-primary-500 dark:hover:bg-primary-500/10"
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Adjust panel ───────────────────────────────────────────────────────────

function AdjustPanel({
  state,
  onChange,
  onApply,
  onReset,
}: {
  state: AdjustState;
  onChange: (s: AdjustState) => void;
  onApply: () => void;
  onReset: () => void;
}) {
  const set = <K extends keyof AdjustState>(key: K, v: number) =>
    onChange({ ...state, [key]: v });

  return (
    <div className="space-y-4">
      <PanelHeader title="Adjust" />
      <Slider label="Brightness" value={state.brightness} min={-100} max={100} onChange={(v) => set("brightness", v)} />
      <Slider label="Contrast" value={state.contrast} min={-100} max={100} onChange={(v) => set("contrast", v)} />
      <Slider label="Saturation" value={state.saturation} min={-100} max={100} onChange={(v) => set("saturation", v)} />
      <Slider label="Hue" value={state.hueRotation} min={0} max={360} unit="°" onChange={(v) => set("hueRotation", v)} />
      <Slider label="Blur" value={state.blur} min={0} max={20} onChange={(v) => set("blur", v)} />
      <Slider label="Noise" value={state.noise} min={0} max={100} onChange={(v) => set("noise", v)} />
      <Slider label="Pixelate" value={state.pixelate} min={1} max={20} onChange={(v) => set("pixelate", v)} />
      <div className="flex gap-2 pt-1">
        <button
          type="button"
          onClick={onApply}
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-primary-700"
        >
          <Wand2 className="h-3.5 w-3.5" /> Apply
        </button>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-surface-200 px-3 py-2 text-xs font-medium text-surface-600 transition hover:border-surface-300 hover:text-surface-900 dark:border-surface-700 dark:text-surface-300 dark:hover:text-white"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Reset
        </button>
      </div>
    </div>
  );
}

// ── Draw panel ─────────────────────────────────────────────────────────────

function DrawPanel({
  drawing,
  setDrawingActive,
  brushType,
  setBrushType,
  brushSize,
  setBrushSize,
  brushColor,
  setBrushColor,
  brushOpacity,
  setBrushOpacity,
  onClear,
}: {
  drawing: boolean;
  setDrawingActive: (b: boolean) => void;
  brushType: BrushType;
  setBrushType: (b: BrushType) => void;
  brushSize: number;
  setBrushSize: (n: number) => void;
  brushColor: string;
  setBrushColor: (c: string) => void;
  brushOpacity: number;
  setBrushOpacity: (n: number) => void;
  onClear: () => void;
}) {
  return (
    <div className="space-y-4">
      <PanelHeader title="Draw" />
      <button
        type="button"
        onClick={() => setDrawingActive(!drawing)}
        className={cn(
          "inline-flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold shadow-sm transition",
          drawing
            ? "bg-success-600 text-white hover:bg-success-700"
            : "bg-primary-600 text-white hover:bg-primary-700"
        )}
      >
        <Brush className="h-4 w-4" />
        {drawing ? "Drawing on" : "Enable drawing"}
      </button>

      <Field label="Brush">
        <div className="flex gap-1">
          {(["pencil", "circle", "spray"] as BrushType[]).map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => setBrushType(b)}
              className={cn(
                "flex-1 rounded-md border px-2 py-1 text-xs font-semibold capitalize transition",
                brushType === b
                  ? "border-primary-500 bg-primary-50 text-primary-700 dark:border-primary-500 dark:bg-primary-500/15 dark:text-primary-200"
                  : "border-surface-200 bg-white text-surface-600 hover:border-primary-300 dark:border-surface-700 dark:bg-surface-900 dark:text-surface-300"
              )}
            >
              {b}
            </button>
          ))}
        </div>
      </Field>

      <Field label={`Size · ${brushSize}px`}>
        <input
          type="range"
          min={1}
          max={50}
          value={brushSize}
          onChange={(e) => setBrushSize(Number(e.target.value))}
          className="w-full accent-primary-600"
        />
      </Field>

      <Field label="Colour">
        <ColorRow value={brushColor} onChange={setBrushColor} onCommit={() => {}} />
      </Field>

      <Field label={`Opacity · ${brushOpacity}%`}>
        <input
          type="range"
          min={0}
          max={100}
          value={brushOpacity}
          onChange={(e) => setBrushOpacity(Number(e.target.value))}
          className="w-full accent-primary-600"
        />
      </Field>

      <button
        type="button"
        onClick={onClear}
        className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-surface-200 px-3 py-2 text-xs font-medium text-surface-600 transition hover:border-error-300 hover:bg-error-50 hover:text-error-700 dark:border-surface-700 dark:text-surface-300 dark:hover:border-error-500/60 dark:hover:bg-error-500/10 dark:hover:text-error-200"
      >
        <Eraser className="h-3.5 w-3.5" /> Clear drawing
      </button>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Small atoms
// ──────────────────────────────────────────────────────────────────────────

function PanelHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2 border-b border-surface-100 pb-2 dark:border-surface-800">
      <ImageIcon className="h-4 w-4 text-primary-600 dark:text-primary-400" />
      <h3 className="text-sm font-bold text-surface-900 dark:text-white">{title}</h3>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1">
      <span className="block text-[11px] font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
        {label}
      </span>
      {children}
    </label>
  );
}

function ToggleBtn({
  active,
  onClick,
  title,
  children,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={cn(
        "inline-flex h-7 w-7 items-center justify-center rounded-md border transition",
        active
          ? "border-primary-500 bg-primary-50 text-primary-700 dark:border-primary-500 dark:bg-primary-500/15 dark:text-primary-200"
          : "border-surface-200 bg-white text-surface-600 hover:border-primary-300 dark:border-surface-700 dark:bg-surface-900 dark:text-surface-300"
      )}
    >
      {children}
    </button>
  );
}

function ColorRow({
  value,
  onChange,
  onCommit,
  allowEmpty,
  onClear,
}: {
  value: string;
  onChange: (c: string) => void;
  onCommit: () => void;
  allowEmpty?: boolean;
  onClear?: () => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={value || "#ffffff"}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onCommit}
        className="h-8 w-10 cursor-pointer rounded-md border border-surface-200 bg-white p-0.5 dark:border-surface-700 dark:bg-surface-800"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onCommit}
        spellCheck={false}
        placeholder={allowEmpty ? "(none)" : "#000000"}
        className="w-full rounded-md border border-surface-200 bg-white px-2 py-1 text-xs uppercase tabular-nums text-surface-900 dark:border-surface-700 dark:bg-surface-800 dark:text-white"
      />
      {allowEmpty && onClear && (
        <button
          type="button"
          onClick={onClear}
          title="Clear"
          className="text-[11px] font-medium text-surface-500 hover:text-error-600 dark:text-surface-400 dark:hover:text-error-400"
        >
          ×
        </button>
      )}
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  unit?: string;
  onChange: (n: number) => void;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-baseline justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400">
          {label}
        </span>
        <span className="text-xs font-bold tabular-nums text-primary-700 dark:text-primary-300">
          {value}
          {unit ?? ""}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-primary-600"
      />
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────
// Misc helpers
// ──────────────────────────────────────────────────────────────────────────

function hexToRgba(hex: string, alpha: number): string {
  // Accept #RGB, #RRGGBB, or any rgba already.
  if (hex.startsWith("rgba(") || hex.startsWith("rgb(")) return hex;
  let h = hex.replace("#", "").trim();
  if (h.length === 3) {
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  }
  if (h.length !== 6) return `rgba(0,102,255,${alpha})`;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

