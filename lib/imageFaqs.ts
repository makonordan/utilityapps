/**
 * Shared per-tool metadata for the Image Tools section.
 *
 * Centralising FAQ entries, HowTo steps, feature lists and publish dates
 * here means each page renders the same content the JSON-LD schemas claim
 * — no risk of the visible FAQ drifting from the FAQPage schema, or the
 * HowTo schema referencing a flow that doesn't exist on the page.
 */

import { type FAQItem } from "@/components/tools/ToolFAQ";
import { type ImageToolId } from "@/lib/imageTools";
import { SITE_CONFIG } from "@/lib/utils";

export interface HowToStep {
  name: string;
  text: string;
}

// ──────────────────────────────────────────────────────────────────────────
// FAQs — each tool has 8 entries. The first six follow a standard
// schedule (free? upload? formats? size limit? mobile? speed?) and the
// last two are tool-specific.
// ──────────────────────────────────────────────────────────────────────────

export const IMAGE_FAQS: Record<ImageToolId, FAQItem[]> = {
  "compress-image": [
    {
      q: "Is the image compressor really free?",
      a: "Yes — every feature is free with no signup, no daily quota, and no watermarks. The tool runs entirely in your browser, so there's no server cost to pass on to you.",
    },
    {
      q: "Do you store or keep my images?",
      a: "No. JPG, PNG, GIF and WebP compression all happens directly in your browser using a Web Worker. Your files never leave your device — perfect for sensitive photos, screenshots and design assets.",
    },
    {
      q: "What file formats are supported?",
      a: "JPG, JPEG, PNG, GIF, SVG and WebP — both as inputs and as output formats (so you can convert during compression). Maximum input size is 50 MB per file.",
    },
    {
      q: "Is there a file size limit?",
      a: "50 MB per file, up to 20 files at a time in bulk mode. Most camera photos and screenshots are well under this limit.",
    },
    {
      q: "Does it work on mobile?",
      a: "Yes — the compressor works on every modern mobile browser (Chrome, Safari, Firefox). Touch targets are large enough for fingers and the Web Worker keeps the UI responsive during compression.",
    },
    {
      q: "How long does compression take?",
      a: "A few hundred milliseconds for a typical 3–5 MP photo. Bulk batches of 20 photos finish in under a minute on most devices.",
    },
    {
      q: "How much can I compress without losing quality?",
      a: "At settings between 70 and 85, most photos reduce by 50–80% while looking visually identical. PNGs with simple graphics often compress 80–95% by being re-encoded as WebP or JPEG.",
    },
    {
      q: "What's the difference between lossy and lossless compression?",
      a: "Lossless compression (SVG and PNG at high quality) preserves every pixel exactly. Lossy compression (JPG, WebP and aggressive PNG) discards perceptually unimportant detail to achieve much smaller files.",
    },
  ],

  "resize-image": [
    {
      q: "Is the image resizer really free?",
      a: "Yes — completely free, no signup, no quota, no watermarks. Every feature is available the moment the page loads.",
    },
    {
      q: "Do you store or keep my images?",
      a: "No. Resizing runs entirely in your browser using the Canvas API. Files never leave your device, so the tool is safe for confidential photos, screenshots and design assets.",
    },
    {
      q: "What file formats are supported?",
      a: "JPG, JPEG, PNG, GIF, WebP and SVG. You can also convert to PNG, JPG or WebP during the resize if you want a different output format.",
    },
    {
      q: "Is there a file size limit?",
      a: "50 MB per file, up to 20 files in bulk mode. Larger files just need to be compressed first using the Image Compressor.",
    },
    {
      q: "Does it work on mobile?",
      a: "Yes. The controls are sized for touch, and the resizer works in every modern mobile browser.",
    },
    {
      q: "How long does resizing take?",
      a: "Effectively instant for a single image. Bulk batches typically finish in a few seconds — each file is resized via the Canvas API on your CPU.",
    },
    {
      q: "Can I resize by percentage instead of pixels?",
      a: "Yes. Switch to Percent mode and enter any value from 1 to 400. The tool scales both width and height proportionally — a 50% scale on a 2000×1500 image becomes 1000×750.",
    },
    {
      q: "What is the best size for Instagram, YouTube and other platforms?",
      a: "1080×1080 for Instagram square posts, 1080×1920 for stories, 1280×720 for YouTube thumbnails, 1500×500 for Twitter/X headers, 1584×396 for LinkedIn banners. One-click presets for all of these are in the Social media presets section.",
    },
  ],

  "crop-image": [
    {
      q: "Is the image cropper really free?",
      a: "Yes — every feature including aspect-ratio lock, rule-of-thirds grid and pixel-exact cropping is free. No signup, no watermarks.",
    },
    {
      q: "Do you store or keep my images?",
      a: "No. The cropper runs entirely in your browser via the Canvas API. Your photo never leaves your device.",
    },
    {
      q: "What file formats are supported?",
      a: "JPG, JPEG, PNG, GIF and WebP — and the output preserves transparency for PNG and WebP sources.",
    },
    {
      q: "Is there a file size limit?",
      a: "25 MB per file. Most camera photos and screenshots fit comfortably under this; compress larger images first if needed.",
    },
    {
      q: "Does it work on mobile?",
      a: "Yes — the drag handles and crop rectangle respond to touch identically to mouse, so you can fine-tune the crop on a phone or tablet.",
    },
    {
      q: "How long does cropping take?",
      a: "Instant. The Canvas API extracts the selected region with no perceptible delay even on large images.",
    },
    {
      q: "What aspect ratios can I lock?",
      a: "Free (any shape), 1:1, 16:9, 4:3, 3:2, 9:16 and 3:4. Locking a ratio constrains both visual dragging and pixel-mode edits.",
    },
    {
      q: "What is the rule-of-thirds grid for?",
      a: "It divides the crop into nine equal blocks. Placing your subject along the grid lines (or at their intersections) produces more balanced, photogenic compositions.",
    },
  ],

  "convert-to-jpg": [
    {
      q: "Is the JPG converter really free?",
      a: "Yes. All formats — including HEIC and TIFF decoded via WebAssembly — are converted for free with no signup.",
    },
    {
      q: "Do you store or keep my images?",
      a: "No. Every conversion (including HEIC and TIFF decoding) happens in your browser. Files never touch our servers.",
    },
    {
      q: "What file formats are supported?",
      a: "PNG, WEBP, GIF, SVG, HEIC/HEIF, BMP and TIFF — all converted to JPG. HEIC photos from iPhones and TIFF scans are handled by lazy-loaded WebAssembly decoders.",
    },
    {
      q: "Is there a file size limit?",
      a: "50 MB per file, up to 20 files in bulk. The size limit is enforced before any decoding to keep the page responsive.",
    },
    {
      q: "Does it work on mobile?",
      a: "Yes — including HEIC conversion, which is especially useful on iOS where photos default to HEIC and many destinations expect JPG.",
    },
    {
      q: "How long does conversion take?",
      a: "Native formats (PNG, WEBP, GIF, BMP) convert in milliseconds. HEIC and TIFF take 1–3 seconds the first time as the decoder loads, then are similarly fast.",
    },
    {
      q: "What happens to transparency when converting to JPG?",
      a: "JPG doesn't support transparency, so transparent pixels are filled with your chosen background colour (white by default, plus black, light gray, or any custom hex).",
    },
    {
      q: "Can I convert animated GIFs to JPG?",
      a: "Yes — but JPG is single-frame, so only the first frame of an animated GIF is captured. A reminder banner appears when GIFs are queued.",
    },
  ],

  "convert-from-jpg": [
    {
      q: "Is the JPG conversion tool really free?",
      a: "Yes — converting JPGs to PNG, WEBP or animated GIF is fully free, with no signup or quota.",
    },
    {
      q: "Do you store or keep my images?",
      a: "No. Bulk conversion uses the Canvas API and GIF encoding runs via Web Workers — all in your browser. Your files never leave your device.",
    },
    {
      q: "What file formats are supported?",
      a: "JPG and JPEG as input; PNG, WEBP and animated GIF as output. The GIF mode stitches multiple JPGs together into a single looping animation.",
    },
    {
      q: "Is there a file size limit?",
      a: "50 MB per file. Animated GIFs accept up to 60 frames at a time — beyond that the encoder slows down and the file becomes unwieldy.",
    },
    {
      q: "Does it work on mobile?",
      a: "Yes — bulk conversion is straightforward on mobile, and the GIF builder's drag-to-reorder works via touch as well as mouse.",
    },
    {
      q: "How long does conversion take?",
      a: "Bulk PNG/WEBP conversion finishes a 20-file batch in a few seconds. Animated GIF encoding is heavier — 30 frames at 720p typically take 5–15 seconds.",
    },
    {
      q: "Why convert JPG to WEBP for the web?",
      a: "WEBP produces files 25–35% smaller than JPG at the same visual quality. Switching from JPG to WEBP shrinks page weight and improves Core Web Vitals; every modern browser supports it.",
    },
    {
      q: "How do I create an animated GIF from photos?",
      a: 'Switch to "Create animated GIF", drop your JPGs in playback order (drag tiles to reorder), pick the frame rate, loop and scale, then click Create GIF. The animation is encoded entirely in your browser via gif.js + Web Workers.',
    },
  ],

  "photo-editor": [
    {
      q: "Is the photo editor really free?",
      a: "Yes — every tab (text, effects, stickers, frames, adjustments, drawing) is free with no signup and no watermark on the exported image.",
    },
    {
      q: "Do you store or keep my images?",
      a: "No. The editor is built on Fabric.js running entirely client-side. Your photo, every edit, every download — none of it leaves your device.",
    },
    {
      q: "What file formats are supported?",
      a: "JPG, JPEG, PNG and WebP as inputs; PNG, JPG or WebP as outputs (with a quality slider for the lossy formats).",
    },
    {
      q: "Is there a file size limit?",
      a: "25 MB per photo. Larger images are still editable but rendering performance drops above ~10 MP.",
    },
    {
      q: "Does it work on mobile?",
      a: "Yes — the toolbar wraps, tabs collapse to a horizontal scroller, and the canvas accepts touch input on the selection handles and drawing brush.",
    },
    {
      q: "How long does editing take?",
      a: "Every change is reflected instantly. Applying a filter or saving the final image typically takes under a second.",
    },
    {
      q: "What filters and effects are available?",
      a: "17 one-click presets including Grayscale, Sepia, Vintage, Kodachrome, Polaroid, Technicolor, Vivid, Cool, Warm, Fade, Sharpen, Blur and brightness/contrast nudges. Plus the Adjust tab has sliders for brightness, contrast, saturation, hue, blur, noise and pixelation.",
    },
    {
      q: "Can I draw on a photo with a brush?",
      a: "Yes. Open the Draw tab, click Enable drawing, and draw with mouse, finger or stylus. Three brush types (pencil, circle, spray), full size and opacity control, and a colour picker. The Clear drawing button removes only the brush strokes — your other edits stay.",
    },
  ],

  "upscale-image": [
    {
      q: "Is the AI image upscaler really free?",
      a: "Yes — completely free, no signup, no daily quota. The model runs in your browser via TensorFlow.js, so we don't pay for compute and don't need to charge for it.",
    },
    {
      q: "Do you store or keep my images?",
      a: "No. The AI model and your image both stay on your device. Files never leave your browser, which makes the tool safe for personal photos and confidential work.",
    },
    {
      q: "What file formats are supported?",
      a: "JPG, JPEG and PNG. The output is always a PNG so the AI-recovered detail is preserved without re-encoding loss.",
    },
    {
      q: "Is there a file size limit?",
      a: "10 MB per file. For best results stick to images at or under 1 megapixel (1000×1000 px or so) — bigger inputs work but take longer and can run out of memory at 4×.",
    },
    {
      q: "Does it work on mobile?",
      a: "It works, but the model is heavy. A modern phone can handle 2× upscaling on small images in 20–40 seconds; 4× on larger images may hit memory limits.",
    },
    {
      q: "How long does upscaling take?",
      a: "Typically 20–90 seconds depending on image size and device. The first run after a page refresh is slower while the model downloads.",
    },
    {
      q: "What's the difference between 2× and 4× upscale?",
      a: "2× doubles each dimension (4× the pixel count). 4× quadruples each dimension (16× the pixel count) by running the AI twice in succession — about twice as long and significantly more memory.",
    },
    {
      q: "What if the upscaler runs out of memory?",
      a: "The tool detects out-of-memory errors and suggests dropping to 2× or trying a smaller image. Closing other tabs and restarting the browser also helps reclaim GPU/CPU memory.",
    },
  ],

  "remove-background": [
    {
      q: "Is the background remover really free?",
      a: "Yes — 50 background removals per month are free using our shared API allowance. After 50, sign up directly at remove.bg for unlimited use, or wait for the monthly reset.",
    },
    {
      q: "Do you store or keep my images?",
      a: "No — but unlike most tools on this site, this one is server-powered. Your image is sent over HTTPS to the remove.bg API for processing and discarded after the result is returned. No file is retained.",
    },
    {
      q: "What file formats are supported?",
      a: "JPG, JPEG, PNG and WEBP as inputs. The output is always a PNG with transparency. You can then composite onto any colour or a blurred copy of the original — that happens locally.",
    },
    {
      q: "Is there a file size limit?",
      a: "25 MB per file, set to comfortably accommodate typical camera output. Larger images take a few seconds longer to upload and process.",
    },
    {
      q: "Does it work on mobile?",
      a: "Yes — drop a photo, tap the button, get a transparent PNG back. The background-replacement compositing runs locally so it stays fast on mobile.",
    },
    {
      q: "How long does removal take?",
      a: "Typically 3–8 seconds depending on image size and current server load. A processing panel with a progress shimmer is shown while the AI is working.",
    },
    {
      q: "What works best — what kinds of images?",
      a: "Portraits, product shots, animals, vehicles and any isolated subject with a clear edge work very well. Cluttered group photos with overlapping subjects, very low-resolution thumbnails and motion-blurred images are the hardest cases.",
    },
    {
      q: "Can I replace the background with a colour or image?",
      a: "Yes. After the cutout is ready, pick Transparent, White, Black, Blur original (blurs your own photo behind the subject) or a custom hex colour. Compositing happens locally — no extra API call.",
    },
  ],

  "watermark-image": [
    {
      q: "Is the watermark tool really free?",
      a: "Yes — text and image watermarks, bulk processing, ZIP downloads, all free with no signup.",
    },
    {
      q: "Do you store or keep my images?",
      a: "No. Watermarking runs entirely in your browser via the Canvas API. Your photos and your logo file never leave your device.",
    },
    {
      q: "What file formats are supported?",
      a: "JPG, JPEG, PNG, GIF, WebP and SVG as the source images. Logo watermarks can be PNG, JPG, WEBP or SVG — PNGs with transparency look best.",
    },
    {
      q: "Is there a file size limit?",
      a: "25 MB per source image, 5 MB per logo file, up to 20 source images per batch.",
    },
    {
      q: "Does it work on mobile?",
      a: "Yes — including the live preview, which updates as you change settings.",
    },
    {
      q: "How long does watermarking take?",
      a: "Instant for a single photo. A bulk batch of 20 typically finishes in under 10 seconds.",
    },
    {
      q: "Can I tile the watermark across the whole image?",
      a: "Yes — pick the Tile option below the position grid. The watermark repeats across the image at the rotation you set (default 30°), so an accidental crop still leaves multiple copies visible.",
    },
    {
      q: "Why is the live preview only on the first image?",
      a: "Previewing every image in a bulk batch would be slow. The first-image preview shows you exactly how the watermark sits at the chosen position and size — every other file in the queue gets the same treatment.",
    },
  ],

  "meme-generator": [
    {
      q: "Is the meme generator really free?",
      a: "Yes — 100% free, no signup, no watermark on the output. Pick a template or upload your own image, type your captions, download.",
    },
    {
      q: "Do you store or keep my images?",
      a: "No. The generator runs entirely in your browser using the Canvas API. Your photo and your meme never leave your device.",
    },
    {
      q: "What file formats are supported?",
      a: "JPG, JPEG, PNG, GIF and WebP as the background image. Output is PNG so the text stays crisp.",
    },
    {
      q: "Is there a file size limit?",
      a: "15 MB per background image. Meme templates use a built-in gradient so they don't count against this.",
    },
    {
      q: "Does it work on mobile?",
      a: "Yes — including dragging custom overlays in Advanced mode, which uses touch-friendly handles.",
    },
    {
      q: "How long does meme generation take?",
      a: "Every change is instant — the canvas re-renders the moment you type. Downloading the final PNG also takes well under a second.",
    },
    {
      q: "What fonts are available?",
      a: "Impact (the classic meme default), Arial Black and Comic Sans MS. All three render with the proper white-fill / black-stroke / ALL-CAPS treatment by default.",
    },
    {
      q: "Can I add more than just top and bottom text?",
      a: 'Yes — enable Advanced mode and click "Add text" to drop extra text blocks anywhere on the canvas. Each block has its own size, and the blue handles drag to reposition.',
    },
  ],

  "rotate-image": [
    {
      q: "Is the image rotator really free?",
      a: "Yes — 90°/180°/270° presets, custom angles, flips, bulk processing, ZIP downloads. All free, no signup.",
    },
    {
      q: "Do you store or keep my images?",
      a: "No. Rotation runs entirely in your browser via the Canvas API. Your photos never leave your device.",
    },
    {
      q: "What file formats are supported?",
      a: "JPG, JPEG, PNG, GIF and WebP. Output preserves the original format by default, or you can convert to PNG/JPG/WEBP during the rotation.",
    },
    {
      q: "Is there a file size limit?",
      a: "25 MB per file, up to 20 files at a time in bulk mode.",
    },
    {
      q: "Does it work on mobile?",
      a: "Yes — including the live CSS-transform preview, which lets you see the rotation in real time before processing.",
    },
    {
      q: "How long does rotation take?",
      a: "Instant for a single image. A bulk batch of 20 finishes in a few seconds.",
    },
    {
      q: "Can I rotate by an angle that isn't a multiple of 90°?",
      a: "Yes — tick Custom angle and use the slider (or number input) for any value from −360° to +360°. Non-90° rotations create triangular gaps which the tool fills with your chosen background colour.",
    },
    {
      q: "Can I rotate only landscape photos and leave portraits alone?",
      a: 'Yes — use the orientation filter ("Rotate only: Landscape / Portrait / Square / All"). Files outside the selected orientation are marked Skipped instead of being processed. Handy for fixing a folder of mixed photos.',
    },
  ],

  "html-to-image": [
    {
      q: "Is the HTML to image tool really free?",
      a: "Yes — both URL mode (via our shared Screenshotone allowance) and HTML mode (browser-side) are free with no signup.",
    },
    {
      q: "Do you store or keep my images?",
      a: "It depends on the mode. HTML mode renders locally — your code never leaves the browser. URL mode forwards the URL to the Screenshotone API which doesn't retain the resulting image.",
    },
    {
      q: "What file formats are supported?",
      a: "Output: PNG (lossless), JPG (smaller), WEBP (best of both for the web) and SVG (a raster image wrapped in an SVG container).",
    },
    {
      q: "Is there a file size limit?",
      a: "Viewport widths between 360 and 2560 px, fixed heights up to 4096 px. URL mode has a shared monthly quota (100 captures via the Screenshotone free tier).",
    },
    {
      q: "Does it work on mobile?",
      a: "Yes for both modes — although HTML mode benefits from a larger screen for editing the source.",
    },
    {
      q: "How long does conversion take?",
      a: "URL mode typically returns in 5–10 seconds. HTML mode renders locally in 1–3 seconds depending on the complexity of your markup.",
    },
    {
      q: "Why does my URL fail to capture?",
      a: "Some sites block screenshots through CORS, X-Frame-Options or bot detection. Authenticated pages, intranet sites, localhost addresses and heavy single-page apps may also fail. Try a different URL or paste the rendered HTML directly into HTML mode.",
    },
    {
      q: "What does the pixel scale option do?",
      a: '1× is standard resolution, 2× is retina (double the pixels for crisp display on high-DPI screens), 3× is for ultra-high-DPI captures and print. Output file size grows roughly with the square of the scale.',
    },
  ],

  "blur-face": [
    {
      q: "Is the face blur tool really free?",
      a: "Yes — completely free, no signup, no quota. The AI face detector runs in your browser via TensorFlow.js.",
    },
    {
      q: "Do you store or keep my images?",
      a: "No. Both the face-detection model and the blurring run in your browser. Your photo is loaded into memory locally and never uploaded — by design.",
    },
    {
      q: "What file formats are supported?",
      a: "JPG, JPEG, PNG and WEBP as inputs. Output preserves the input format by default.",
    },
    {
      q: "Is there a file size limit?",
      a: "15 MB per file. For very high-resolution photos the detector may take a few seconds longer to scan all faces.",
    },
    {
      q: "Does it work on mobile?",
      a: "Yes — including manual region drawing, which uses pointer events that work identically with mouse, finger and stylus.",
    },
    {
      q: "How long does blurring take?",
      a: "AI detection takes 1–3 seconds. Applying the blur to detected regions is instant. The model itself loads (~1 MB) the first time you visit and is cached afterwards.",
    },
    {
      q: "Can I use this tool for GDPR compliance?",
      a: "Yes — automatic face blurring of bystanders is one of the standard mitigations for sharing photos containing identifiable individuals. Because the tool runs locally and we don't process or store your file, there's no third party in the data path.",
    },
    {
      q: "Can it blur license plates or signs?",
      a: 'Yes — switch the detection mode to "Manual" or "Both", then click-and-drag a rectangle over the plate or sign. Use the Rectangle blur shape for this — ovals look odd on rectangular objects.',
    },
  ],
};

// ──────────────────────────────────────────────────────────────────────────
// HowTo steps — short and uniform across tools. These render in the
// per-tool HowTo schema. The visible page already explains the same flow.
// ──────────────────────────────────────────────────────────────────────────

export const IMAGE_HOWTOS: Record<ImageToolId, HowToStep[]> = {
  "compress-image": [
    { name: "Upload", text: "Drop your image (or up to 50 images for bulk) into the upload area." },
    { name: "Adjust quality", text: "Pick a quality level and optional output format. Higher = bigger files, lower = smaller files." },
    { name: "Compress", text: "Click Compress image. The Web Worker processes each file in turn — the page stays responsive." },
    { name: "Download", text: "Click Download to save the compressed file, or Download all as ZIP for batches." },
  ],
  "resize-image": [
    { name: "Upload", text: "Drop one image (single mode) or up to 20 images (bulk mode) into the upload area." },
    { name: "Pick a size", text: "Choose a preset, type exact pixel dimensions, or set a percentage scale. Aspect ratio stays locked by default." },
    { name: "Resize", text: "Click Resize image. The Canvas API redraws the photo at the new size." },
    { name: "Download", text: "Download the resized file (named with the new dimensions) or grab a ZIP of the whole batch." },
  ],
  "crop-image": [
    { name: "Upload", text: "Drop a single image into the upload area." },
    { name: "Frame the crop", text: "Drag the crop rectangle's corners or edges to frame your subject. Lock an aspect ratio if you need a specific shape." },
    { name: "Crop", text: "Click Crop image to extract the selected region at full source resolution." },
    { name: "Download", text: "Download the cropped image as PNG, JPG or WEBP." },
  ],
  "convert-to-jpg": [
    { name: "Upload", text: "Drop one or more PNG, WEBP, GIF, SVG, HEIC, BMP or TIFF files." },
    { name: "Pick background", text: "Choose a background colour (used only for transparent inputs) and a JPG quality." },
    { name: "Convert", text: "Click Convert all to JPG. HEIC and TIFF are decoded via lazy-loaded WebAssembly." },
    { name: "Download", text: "Download each JPG individually or grab the whole batch as a ZIP." },
  ],
  "convert-from-jpg": [
    { name: "Pick a mode", text: "Choose Convert to PNG, Convert to WEBP, or Create animated GIF." },
    { name: "Upload JPGs", text: "Drop one or more JPGs. For animated GIFs, drag the tiles to set playback order." },
    { name: "Convert", text: "Click Convert all (PNG/WEBP) or Create GIF. GIF encoding runs through Web Workers." },
    { name: "Download", text: "Download each file individually or as a ZIP. Animated GIFs download as a single .gif file." },
  ],
  "photo-editor": [
    { name: "Upload", text: "Drop a photo into the upload area." },
    { name: "Edit", text: "Use the Text, Effects, Stickers, Frames, Adjust and Draw tabs. Every change updates the canvas live." },
    { name: "Undo if needed", text: "Use the Undo / Redo buttons in the top toolbar. History stores the last 50 changes." },
    { name: "Download", text: "Pick PNG, JPG or WEBP, set the quality, and click Download." },
  ],
  "upscale-image": [
    { name: "Wait for the model", text: "The first time you visit, the AI model (~1 MB) downloads and is cached. Subsequent visits are instant." },
    { name: "Upload", text: "Drop a JPG or PNG (up to 10 MB) into the upload area." },
    { name: "Pick scale", text: "Choose 2× (faster) or 4× (slower but bigger output). The new dimensions are previewed before you start." },
    { name: "Upscale", text: "Click Upscale image. Processing takes 20–90 seconds depending on size and device." },
    { name: "Download", text: "Download the upscaled PNG once processing finishes." },
  ],
  "remove-background": [
    { name: "Upload", text: "Drop a JPG, PNG or WEBP into the upload area." },
    { name: "Remove background", text: "Click Remove background. The image is sent over HTTPS to the AI service and a transparent PNG is returned." },
    { name: "Replace background (optional)", text: "Pick Transparent, White, Black, Blur original, or a custom colour. Compositing happens locally — no extra API call." },
    { name: "Download", text: "Click Download PNG for the transparent cutout, or Download with background for the composited version." },
  ],
  "watermark-image": [
    { name: "Upload", text: "Drop one image or a batch of up to 20." },
    { name: "Configure watermark", text: "Pick Text (font, size, colour) or Image (upload your logo). Set the position, opacity, rotation and scale." },
    { name: "Preview", text: "The first image previews live as you change settings — what you see is what every file in the batch will get." },
    { name: "Apply", text: "Click Apply watermark to process every file at full source resolution." },
    { name: "Download", text: "Download each file or grab the whole batch as a ZIP." },
  ],
  "meme-generator": [
    { name: "Pick a template", text: "Choose one of the 20 classic templates, or upload your own image." },
    { name: "Type captions", text: "Fill in the Top text and Bottom text fields. Style options (font, colour, outline) are in the side panel." },
    { name: "Add overlays (optional)", text: 'Enable Advanced mode and click "Add text" to drop extra captions and drag them around.' },
    { name: "Download", text: "Click Download meme to save a PNG. Use the Share button to send the actual image on supported devices." },
  ],
  "rotate-image": [
    { name: "Upload", text: "Drop one or more images (up to 20) into the upload area." },
    { name: "Pick rotation", text: "Use the 90°/180° quick buttons, set a custom angle, and/or toggle horizontal/vertical flip." },
    { name: "Filter (optional)", text: "In bulk mode, restrict to landscape, portrait or square so mixed-photo folders are easy to fix." },
    { name: "Rotate", text: "Click Rotate all. The Canvas API redraws each photo at the new orientation." },
    { name: "Download", text: "Download each file or grab a ZIP of the whole batch." },
  ],
  "html-to-image": [
    { name: "Pick a mode", text: "Choose URL to image (screenshot a webpage) or HTML code to image (render pasted HTML+CSS locally)." },
    { name: "Enter input", text: "Paste a URL or write your HTML in the textarea." },
    { name: "Configure", text: "Set the viewport width, pixel scale (1× / 2× retina / 3×), and output format." },
    { name: "Convert", text: "Click Convert URL or Render and convert. URL mode goes through our screenshot proxy; HTML mode runs locally." },
    { name: "Download", text: "Download the captured image once the preview appears." },
  ],
  "blur-face": [
    { name: "Wait for the model", text: "The first time you visit, the face-detection model (~1 MB) downloads and is cached." },
    { name: "Upload", text: "Drop a JPG, PNG or WEBP into the upload area." },
    { name: "Detect", text: "In Auto / Both modes, click Detect faces. Detected regions appear as red dashed rectangles." },
    { name: "Refine", text: "Remove false positives with the X handle. Draw extra blur regions in Manual / Both modes by click-and-drag." },
    { name: "Download", text: "Click Apply blur & download to save the anonymised image." },
  ],
};

// ──────────────────────────────────────────────────────────────────────────
// Feature lists — strings exposed via SoftwareApplication.featureList.
// ──────────────────────────────────────────────────────────────────────────

export const IMAGE_FEATURE_LISTS: Record<ImageToolId, string> = {
  "compress-image":
    "Bulk image compression, JPG/PNG/GIF/SVG/WEBP support, quality slider, output format conversion, EXIF strip, before/after slider, ZIP download",
  "resize-image":
    "Pixel and percentage resize, social-media presets (Instagram, YouTube, LinkedIn, Twitter/X), aspect-ratio lock, bulk processing, ZIP download",
  "crop-image":
    "Visual crop editor, aspect-ratio lock, pixel-precise inputs, rule-of-thirds grid, mobile-friendly drag handles, PNG/JPG/WEBP output",
  "convert-to-jpg":
    "PNG/WEBP/GIF/SVG/HEIC/BMP/TIFF to JPG, transparent background colour, quality slider, bulk processing, ZIP download",
  "convert-from-jpg":
    "JPG to PNG, JPG to WEBP, animated GIF from JPG sequence, bulk processing, frame reorder, scale and frame-rate control",
  "photo-editor":
    "Text overlays, 17 filter presets, stickers, frames, brightness/contrast/saturation sliders, free drawing, undo/redo history, PNG/JPG/WEBP export",
  "upscale-image":
    "AI 2× and 4× upscaling, browser-side TensorFlow.js, before/after slider, no upload, PNG output",
  "remove-background":
    "AI background removal, transparent PNG output, background replacement (white, black, blur, custom colour), monthly usage counter",
  "watermark-image":
    "Text or image watermark, 9 positions plus tile mode, opacity and rotation control, bulk processing, live preview, ZIP download",
  "meme-generator":
    "20 classic meme templates, custom image upload, Impact font with stroke-fill rendering, advanced text overlays, share via Web Share API",
  "rotate-image":
    "90°/180°/270° presets, custom angle, horizontal and vertical flip, orientation filter for bulk folders, gap-fill colour, ZIP download",
  "html-to-image":
    "URL to screenshot, HTML code to image, viewport or full-page capture, retina (1×/2×/3×) scale, PNG/JPG/WEBP/SVG output",
  "blur-face":
    "AI face detection, manual blur regions, rectangle or oval shape, adjustable pixelation intensity, GDPR-friendly local processing",
};

// ──────────────────────────────────────────────────────────────────────────
// Publish dates — used in SoftwareApplication.datePublished. Same date
// across the section since they were all built in the same release.
// ──────────────────────────────────────────────────────────────────────────

export const IMAGE_TOOL_PUBLISHED = "2026-05-11";

// ──────────────────────────────────────────────────────────────────────────
// Convenience accessors
// ──────────────────────────────────────────────────────────────────────────

export function getImageFaqs(toolId: string): FAQItem[] {
  return IMAGE_FAQS[toolId as ImageToolId] ?? [];
}

export function getImageHowTo(toolId: string): HowToStep[] {
  return IMAGE_HOWTOS[toolId as ImageToolId] ?? [];
}

export function getImageFeatureList(toolId: string): string {
  return IMAGE_FEATURE_LISTS[toolId as ImageToolId] ?? "";
}

/**
 * Build an absolute URL for the dynamic Open Graph image route, branded
 * with the image-tool accent. Each page passes its own title/description so
 * the OG card stays unique per tool.
 */
export function imageToolOgUrl(title: string, description: string): string {
  const params = new URLSearchParams({
    title,
    description,
    type: "image-tool",
  });
  return `${SITE_CONFIG.url}/api/og?${params.toString()}`;
}
