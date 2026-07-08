import { type FAQItem } from "@/components/tools/ToolFAQ";
import { SITE_CONFIG } from "@/lib/utils";

export type AudioToolId = "mp3-cutter" | "audio-converter" | "voice-recorder" | "bpm-detector";

export interface HowToStep {
  name: string;
  text: string;
}

export const AUDIO_FAQS: Record<AudioToolId, FAQItem[]> = {
  "mp3-cutter": [
    { q: "Is the MP3 cutter free?", a: "Yes — completely free, no signup, no quota, no watermark." },
    { q: "Does my audio get uploaded?", a: "No. The cut runs in your browser using ffmpeg.wasm. The file never leaves your device." },
    { q: "What audio formats are supported?", a: "MP3, WAV, OGG, FLAC, AAC, M4A, OPUS — and the cut preserves the input format." },
    { q: "Will trimming reduce quality?", a: "No. We use ffmpeg's stream-copy mode which copies the audio bytes between your start and end points without re-encoding. The output is bit-identical to the source." },
    { q: "What's the maximum file size?", a: "Up to 500 MB per file. Audio files of typical length (3–10 minutes) are well under this limit." },
    { q: "Can I trim multiple sections?", a: "The current version supports a single start/end range. For multi-segment edits, trim each section separately." },
  ],
  "audio-converter": [
    { q: "Is the audio converter free?", a: "Yes — free, no signup, no watermark." },
    { q: "Which formats can I convert between?", a: "MP3, WAV, OGG (Vorbis), FLAC, AAC, M4A, and OPUS. Both as input and output." },
    { q: "Does my audio get uploaded?", a: "No. The conversion runs in your browser using ffmpeg.wasm." },
    { q: "What's the largest file I can convert?", a: "Up to 500 MB. Conversion time roughly tracks file length on a single-threaded ffmpeg core." },
    { q: "Will I lose quality?", a: "Lossless formats (FLAC, WAV) are converted without loss. Lossy formats (MP3, OGG, AAC) inherently re-encode — at the default quality (192 kbps for MP3/AAC, 5 for OGG/Vorbis) the difference is imperceptible." },
    { q: "Can I batch convert?", a: "Not yet — each conversion takes one file at a time. Batch mode is on the roadmap." },
  ],
  "voice-recorder": [
    { q: "Is the voice recorder free?", a: "Yes — free, no signup, no quota." },
    { q: "Will my voice get uploaded?", a: "No. Recording happens in your browser using the MediaRecorder API. Nothing is sent to a server." },
    { q: "What format is the recording?", a: "WebM with the Opus codec by default — high quality and small file size. You can also export as MP3 (re-encoded via ffmpeg.wasm)." },
    { q: "Will it ask for microphone access?", a: "Yes. The browser prompts for microphone permission the first time you click Record. You can revoke access at any time in your browser's site settings." },
    { q: "How long can I record?", a: "Up to about 1 hour comfortably. Beyond that, browser memory becomes a constraint — break long sessions into smaller recordings." },
    { q: "Can I see the audio level while recording?", a: "Yes. A live waveform visualises microphone input so you can confirm audio is being captured." },
  ],
  "bpm-detector": [
    { q: "Is the BPM detector free?", a: "Yes — free, no signup, no quota." },
    { q: "Does the audio get uploaded?", a: "No. Beat detection runs in your browser using the Web Audio API." },
    { q: "How accurate is the detection?", a: "Within ±2 BPM for most songs with a clear beat (electronic, rock, pop, hip-hop). Music without prominent percussion (ambient, classical, free jazz) may not yield a clean BPM — there isn't one to detect." },
    { q: "What audio formats are supported?", a: "Any format the browser can decode: MP3, WAV, OGG, FLAC, M4A, AAC, OPUS." },
    { q: "How does it work?", a: "The audio is decoded to PCM, the energy is sampled in short windows, peaks above a threshold are detected, and the most common interval between peaks is converted to beats per minute." },
    { q: "Why does it sometimes return half or double the actual BPM?", a: "Energy-based detection can lock onto half-tempo or double-tempo. If a song you know is 120 BPM reads as 60 or 240, the engine likely picked the wrong harmonic — divide or double mentally." },
  ],
};

export const AUDIO_HOWTOS: Record<AudioToolId, HowToStep[]> = {
  "mp3-cutter": [
    { name: "Upload", text: "Drop an audio file (MP3, WAV, OGG, FLAC, AAC, M4A, or OPUS) into the upload area." },
    { name: "Set start and end", text: "Drag the handles or type timestamps in the mm:ss inputs." },
    { name: "Cut", text: "Click Cut audio. The trim uses stream-copy so there's no re-encode and no quality loss." },
    { name: "Download", text: "Click Download to save the trimmed audio." },
  ],
  "audio-converter": [
    { name: "Upload", text: "Drop an audio file into the upload area." },
    { name: "Pick format", text: "Choose the target format: MP3, WAV, OGG, FLAC, AAC, M4A, or OPUS." },
    { name: "Convert", text: "Click Convert. ffmpeg.wasm transcodes the audio in your browser." },
    { name: "Download", text: "Preview the result inline and click Download to save it." },
  ],
  "voice-recorder": [
    { name: "Allow microphone access", text: "Click Start recording — the browser will prompt for microphone permission the first time." },
    { name: "Record", text: "Speak into your microphone. A live waveform shows the audio level. Click Stop when done." },
    { name: "Preview", text: "Play back the recording inline. Re-record if you'd like to try again." },
    { name: "Download", text: "Save as WebM/Opus (default, smaller file) or convert to MP3 before download." },
  ],
  "bpm-detector": [
    { name: "Upload", text: "Drop a song or audio clip with a clear beat." },
    { name: "Analyse", text: "Click Detect BPM. The engine decodes the audio and runs energy peak detection." },
    { name: "Read the result", text: "The detected BPM appears with a confidence note. Songs with no clear beat may not produce a reliable estimate." },
  ],
};

export const AUDIO_FEATURE_LISTS: Record<AudioToolId, string> = {
  "mp3-cutter": "Stream-copy trimming (lossless), MP3/WAV/OGG/FLAC/AAC/M4A/OPUS support, in-browser ffmpeg.wasm, no upload",
  "audio-converter": "MP3/WAV/OGG/FLAC/AAC/M4A/OPUS, configurable bitrate, in-browser ffmpeg.wasm, no upload",
  "voice-recorder": "MediaRecorder API, live waveform, WebM/Opus default, optional MP3 export, no upload",
  "bpm-detector": "Web Audio API energy peak detection, ±2 BPM accuracy on percussive tracks, MP3/WAV/OGG/FLAC support, no upload",
};

export const AUDIO_TOOL_PUBLISHED = "2026-05-15";

export function getAudioFaqs(toolId: string): FAQItem[] {
  return AUDIO_FAQS[toolId as AudioToolId] ?? [];
}
export function getAudioHowTo(toolId: string): HowToStep[] {
  return AUDIO_HOWTOS[toolId as AudioToolId] ?? [];
}
export function getAudioFeatureList(toolId: string): string {
  return AUDIO_FEATURE_LISTS[toolId as AudioToolId] ?? "";
}
export function audioToolOgUrl(title: string, description: string): string {
  const params = new URLSearchParams({ title, description, type: "audio-tool" });
  return `${SITE_CONFIG.url}/api/og?${params.toString()}`;
}
