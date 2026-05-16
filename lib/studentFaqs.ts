import { type FAQItem } from "@/components/tools/ToolFAQ";
import { SITE_CONFIG } from "@/lib/utils";

export type StudentToolId =
  | "citation-generator"
  | "paraphrasing-tool"
  | "study-timer"
  | "flashcard-maker";

export interface HowToStep {
  name: string;
  text: string;
}

export const STUDENT_FAQS: Record<StudentToolId, FAQItem[]> = {
  "citation-generator": [
    { q: "Is the citation generator free?", a: "Yes — free, no signup, no quota." },
    { q: "Which citation styles are supported?", a: "APA 7th edition, MLA 9th edition, and Chicago (notes-bibliography, bibliography entry). Each updates live as you fill the form." },
    { q: "What source types can I cite?", a: "Websites, books, and journal articles — the three most common sources in student work. Each type shows only the fields it needs." },
    { q: "Are my citations uploaded anywhere?", a: "No. Citations are formatted entirely in your browser from the details you type." },
    { q: "Should I double-check the output?", a: "Yes — always. The generator handles the common case well, but edge cases (multiple authors, corporate authors, editions, missing dates) sometimes need a manual tweak. Treat it as a fast first draft, then verify against your style guide." },
  ],
  "paraphrasing-tool": [
    { q: "Is the paraphrasing tool free?", a: "Yes — free, no signup." },
    { q: "What does it actually do?", a: "It rewords your own text by substituting synonyms and offering sentence-variety suggestions. It's a writing aid for rephrasing sentences you wrote — useful when a sentence feels clunky or repetitive." },
    { q: "Will this help me beat a plagiarism checker?", a: "No — and you shouldn't try. Rewording someone else's work to pass it off as your own is plagiarism regardless of the tool used. Use this to improve your own writing, and always cite sources you draw from." },
    { q: "Is it as good as an AI paraphraser?", a: "No. This tool runs entirely in your browser with a built-in thesaurus, so it's fast and private but basic. A true AI rewriter produces smoother results — review and edit the output here before using it." },
    { q: "Is my text uploaded?", a: "No. Everything runs locally in your browser." },
  ],
  "study-timer": [
    { q: "Is the study timer free?", a: "Yes — free, no signup." },
    { q: "How is this different from a Pomodoro timer?", a: "The Pomodoro timer enforces fixed 25/5 intervals. This study timer is a flexible stopwatch — start and stop it per subject, and it logs how long you actually studied each subject today. Better when your sessions don't fit a rigid cycle." },
    { q: "Will my study log persist?", a: "Yes — sessions are saved to your browser's local storage, so today's log survives a refresh. Use the clear button to start a new day." },
    { q: "Does the timer stay accurate in a background tab?", a: "Yes. It's driven by absolute timestamps, not interval ticks, so it stays accurate even when the browser throttles the tab." },
    { q: "Can I track multiple subjects?", a: "Yes. Switch the subject label any time — the log keeps a running total per subject." },
  ],
  "flashcard-maker": [
    { q: "Is the flashcard maker free?", a: "Yes — free, no signup, no quota." },
    { q: "Where are my flashcards stored?", a: "In your browser's local storage on this device. They survive refreshes and revisits, but clearing browser data wipes them — export your deck to keep a backup." },
    { q: "Can I move a deck to another device?", a: "Yes — export the deck as a JSON file and import it on the other device. The export is a plain file you fully control." },
    { q: "How does study mode work?", a: "Study mode shows one card at a time. Click to flip between question and answer, then mark it Known or Still learning. Cards you're still learning come around again." },
    { q: "How many cards can a deck hold?", a: "Hundreds comfortably. Local storage has a few-megabyte limit per site, which is thousands of typical flashcards." },
  ],
};

export const STUDENT_HOWTOS: Record<StudentToolId, HowToStep[]> = {
  "citation-generator": [
    { name: "Pick a source type", text: "Website, book, or journal article." },
    { name: "Fill the details", text: "Enter author, title, year, and the fields specific to that source type." },
    { name: "Copy the style you need", text: "APA, MLA, and Chicago citations all render live — copy the one your assignment requires." },
  ],
  "paraphrasing-tool": [
    { name: "Paste your text", text: "Drop in a sentence or paragraph you wrote that you'd like to reword." },
    { name: "Paraphrase", text: "Click Paraphrase — the tool swaps in synonyms and varies the wording." },
    { name: "Review and edit", text: "Read the result carefully and fix anything that reads awkwardly before you use it." },
  ],
  "study-timer": [
    { name: "Set a subject", text: "Type what you're studying (e.g. 'Biology — Chapter 4')." },
    { name: "Start the timer", text: "Click Start. The timer runs until you stop it — no fixed interval." },
    { name: "Stop to log it", text: "Click Stop and the session is added to today's log with its duration." },
    { name: "Review your day", text: "The log shows total study time per subject so you can see where your time went." },
  ],
  "flashcard-maker": [
    { name: "Create a deck", text: "Name a new deck and add cards with a question on the front and an answer on the back." },
    { name: "Study", text: "Enter study mode, flip each card, and mark it Known or Still learning." },
    { name: "Back up", text: "Export the deck as a JSON file to keep it or move it to another device." },
  ],
};

export const STUDENT_FEATURE_LISTS: Record<StudentToolId, string> = {
  "citation-generator": "APA 7, MLA 9, Chicago citations, website/book/journal sources, live preview, copy per style",
  "paraphrasing-tool": "Synonym substitution, sentence-variety suggestions, browser-side, private, instant",
  "study-timer": "Flexible session stopwatch, per-subject study log, persistent local storage, background-accurate",
  "flashcard-maker": "Deck builder, flip-card study mode, known/learning tracking, JSON export/import, local storage",
};

export const STUDENT_TOOL_PUBLISHED = "2026-05-16";

export function getStudentFaqs(toolId: string): FAQItem[] {
  return STUDENT_FAQS[toolId as StudentToolId] ?? [];
}
export function getStudentHowTo(toolId: string): HowToStep[] {
  return STUDENT_HOWTOS[toolId as StudentToolId] ?? [];
}
export function getStudentFeatureList(toolId: string): string {
  return STUDENT_FEATURE_LISTS[toolId as StudentToolId] ?? "";
}
export function studentToolOgUrl(title: string, description: string): string {
  const params = new URLSearchParams({ title, description, type: "student-tool" });
  return `${SITE_CONFIG.url}/api/og?${params.toString()}`;
}
