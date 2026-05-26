/**
 * Generates the "AI Prompt Pack — 60 Pro Prompts" product file.
 *
 *   node scripts/build-prompt-pack.mjs
 *
 * Output: product-files/ai-prompt-pack.pdf  (upload to Supabase Storage)
 */
import { jsPDF } from "jspdf";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = resolve(ROOT, "product-files", "ai-prompt-pack.pdf");

const SECTIONS = [
  {
    name: "Writing & Content",
    items: [
      ["Rewrite for clarity", "Rewrite the text below so it is clearer and easier to read. Keep my meaning and tone, cut jargon and filler, and prefer short sentences. Text: [paste]", "Add 'for a [audience]' to tune the reading level."],
      ["Shorten without losing meaning", "Cut the following text by about half. Keep every key point and the original tone. Return only the shortened version. Text: [paste]", "Swap 'half' for a target word count when you need an exact length."],
      ["Headline options", "Give me 10 headline options for a piece about [topic]. Mix curiosity, benefit-driven and how-to styles. Keep each under 12 words.", "Ask it to mark the 3 strongest and say why."],
      ["Outline a piece", "Create a detailed outline for a [blog post / article / essay] about [topic] for [audience]. Include an intro angle, 5-6 section headings and one key point under each.", "Once you like the outline, ask it to draft one section at a time."],
      ["Fix the tone", "Rewrite this message to sound [warm and professional / confident / friendly but firm]. Keep it the same length. Message: [paste]", "Give it two tone options and compare them side by side."],
      ["Proofread only", "Proofread the text below for grammar, spelling and punctuation only. Do not change my wording or style. List each change as a bullet, then give the corrected text. Text: [paste]", "The bullet list lets you learn from recurring mistakes."],
      ["Expand rough notes", "Expand the rough notes below into [n] well-structured paragraphs. Keep my points and add only supporting detail and smooth transitions. Notes: [paste]", "Keep notes short — the more you give, the more it stays on message."],
      ["Bullets into prose", "Turn these bullet points into a flowing, readable paragraph for [context]. Bullets: [paste]", "Name the context (email, report, post) so the style fits."],
      ["Write a first draft", "Write a first draft of a [type of piece] about [topic]. Audience: [audience]. Goal: [goal]. Length: about [n] words. Tone: [tone].", "Treat the result as a draft to edit, never as final copy."],
      ["Counter-argument check", "Read my argument below and list the 3 strongest objections a thoughtful reader would raise, plus a one-line response to each. Argument: [paste]", "Great before publishing anything persuasive."],
    ],
  },
  {
    name: "Marketing & Sales",
    items: [
      ["Product description", "Write a product description for [product]. Audience: [audience]. Lead with the main benefit, keep it to about 60 words and end with a soft call to action.", "Give it 2-3 real features so the copy stays honest."],
      ["Cold email", "Write a short cold email to [type of person] offering [product/service]. One clear benefit, no fluff, a low-friction call to action. Under 120 words.", "Ask for 3 versions with different opening lines."],
      ["Social caption variations", "Write 5 social media captions for a post about [topic]. Vary the hook style. Keep each under 200 characters and end with a question or CTA.", "Tell it the platform — captions differ across them."],
      ["Email subject lines", "Give me 10 email subject lines for an email about [topic]. Keep them under 50 characters. Avoid spammy words and all-caps.", "Add 'and 5 preview-text lines to match'."],
      ["Landing page hero", "Write a landing page hero section for [product]: a headline, a one-sentence subheadline and a button label. Make the value obvious in 5 seconds.", "Ask for 3 directions: bold, plain, playful."],
      ["Handle objections", "List the top 5 reasons a customer might NOT buy [product], and give a short, honest response to each.", "Use the answers to write FAQ or sales copy."],
      ["Value proposition", "Help me write a one-sentence value proposition for [business]. It should say who it's for, what it does and why it's better. Give me 5 options.", "Pick one, then ask it to stress-test the claim."],
      ["Ad copy variations", "Write 3 short ad variations for [product] aimed at [audience]. Each: a hook line and one benefit. Keep them punchy.", "Specify the channel so length and tone fit."],
      ["Repurpose content", "Turn the article below into 1 email, 3 social posts and 5 short hooks. Keep the core message. Article: [paste]", "One good article can fuel a week of posts this way."],
      ["Reply to a customer", "Draft a polite, helpful reply to this customer message. Solve their problem, keep it warm and concise. Message: [paste]", "Always read and adjust before sending."],
    ],
  },
  {
    name: "Work & Productivity",
    items: [
      ["Summarize a document", "Summarize the document below in [5 bullet points / one paragraph]. Capture the decisions, action items and key numbers. Document: [paste]", "Ask 'what is missing or unclear?' as a follow-up."],
      ["Meeting agenda", "Create a focused agenda for a [length] meeting about [topic]. Include time blocks, the goal of each item and who should lead it.", "Share it before the meeting to keep everyone on track."],
      ["Action items from notes", "Read these meeting notes and extract a clear list of action items. For each: the task, the owner if mentioned and the deadline if mentioned. Notes: [paste]", "Paste raw notes — it handles messy input well."],
      ["Professional email", "Write a professional email to [recipient] about [purpose]. Tone: [tone]. Keep it concise and end with a clear next step.", "Add 'in 3 short paragraphs' for a tidy structure."],
      ["Break down a project", "Break the goal below into a step-by-step plan with milestones and a rough order. Flag anything that could block progress. Goal: [paste]", "Then ask it to estimate effort for each step."],
      ["Prioritize a list", "Here is my to-do list. Sort it by impact versus effort and tell me what to do first, what to schedule and what to drop. List: [paste]", "Be honest about deadlines so the sort is realistic."],
      ["Decision helper", "I'm deciding between [option A] and [option B] for [situation]. List the trade-offs of each, then give a recommendation with your reasoning.", "Add your priorities so the recommendation fits you."],
      ["Draft an SOP", "Write a clear step-by-step standard operating procedure for [task], so someone new could follow it without help.", "Have a new team member test it and note gaps."],
      ["Difficult message", "Help me write a message to [person] about [difficult topic]. Be honest and respectful, keep it brief and keep the relationship intact.", "Read it aloud before sending — tone matters most here."],
      ["Weekly review", "Ask me 6 questions, one at a time, that will help me review my week and plan the next one.", "Save your answers to compare week to week."],
    ],
  },
  {
    name: "Coding & Tech",
    items: [
      ["Explain this code", "Explain what the code below does, step by step, in plain language. Then note anything that looks risky. Code: [paste]", "Great for reading unfamiliar or inherited code."],
      ["Debug help", "This code isn't working as expected. Expected: [x]. Actual: [y]. Find the likely cause and suggest a fix. Code: [paste]", "The clearer your expected-versus-actual, the better the answer."],
      ["Code review", "Review the code below for bugs, edge cases, readability and performance. List issues by priority. Code: [paste]", "Ask it to show the fix for the top issue only."],
      ["Write a function", "Write a [language] function that [does X]. Inputs: [...]. Output: [...]. Include brief comments and handle invalid input.", "Always test the result — treat it as a draft."],
      ["Build a regex", "Write a regular expression that matches [describe the pattern]. Explain each part, and give 3 strings it matches and 3 it doesn't.", "Test it on real data before you trust it."],
      ["Refactor cleanly", "Refactor the code below to be cleaner and easier to read without changing its behaviour. Explain what you changed. Code: [paste]", "Run your tests after — behaviour should be identical."],
      ["Add comments", "Add clear, concise comments to the code below. Don't change the logic. Comment: [paste]", "Ask for a one-line summary at the top of the file too."],
      ["Write a SQL query", "Write a SQL query to [describe the goal]. Tables and columns: [describe]. Explain the query in one line.", "Describe your schema accurately for a correct query."],
      ["Decode an error", "I'm getting this error: [paste error]. Explain in plain language what it means and the most likely fixes.", "Include the few lines of code around where it happens."],
      ["Explain a tech concept", "Explain [concept] to me like I'm new to it. Use one everyday analogy and one short example.", "Follow up with 'now explain it at an expert level'."],
    ],
  },
  {
    name: "Study & Learning",
    items: [
      ["Explain a topic", "Explain [topic] clearly for a [grade or level] student. Use simple language and one concrete example.", "Ask for a harder version once the basics click."],
      ["Quiz me", "Quiz me on [topic]. Ask one question at a time, wait for my answer, tell me if I'm right and why, then continue. 10 questions.", "Active recall like this beats re-reading notes."],
      ["Make a study sheet", "Summarize the notes below into a tight study sheet: key terms, definitions and the 5 most important points. Notes: [paste]", "Review the sheet, not the full notes, before a test."],
      ["Make flashcards", "Turn the material below into flashcards. Format each as 'Q: ... / A: ...'. One idea per card. Material: [paste]", "Paste straight into a flashcard app to study."],
      ["Simplify a hard passage", "Rewrite the passage below in plain, simple language so it's easy to understand. Keep all the facts. Passage: [paste]", "Then read the original again — it makes more sense."],
      ["Practice problems", "Create 5 practice problems on [topic] at [difficulty] level. Give the answers separately at the end.", "Try them before you look at the answers."],
      ["Build a study plan", "Build me a study plan for [subject or exam]. I have [time available] and these topics: [list]. Spread it out and end with review days.", "Spacing the work out beats cramming every time."],
      ["Explain with an analogy", "Explain [concept] using an analogy from everyday life, then point out where the analogy breaks down.", "The 'breaks down' part stops the analogy misleading you."],
      ["Essay feedback", "Give feedback on the essay below: what works, what's weak and 3 specific improvements. Don't rewrite it. Essay: [paste]", "Keep the writing yours — use the notes to revise."],
      ["Check my understanding", "I'll explain [topic] in my own words. Tell me what I got right, what's missing and what's wrong. Here's my explanation: [paste]", "Teaching it back is one of the best ways to learn."],
    ],
  },
  {
    name: "Everyday Life",
    items: [
      ["Meal plan", "Create a [number]-day meal plan for [diet or preferences]. Include a grocery list grouped by aisle. Keep it simple and affordable.", "Add 'using mostly ingredients I already have: [list]'."],
      ["Plan an event", "Help me plan [event] for [number] people on a [budget]. Give a checklist with timings, from [weeks before] to the day itself.", "Ask it to flag the things most often forgotten."],
      ["Trip itinerary", "Plan a [length] trip to [place] for [travellers]. Interests: [list]. Give a day-by-day outline with a mix of must-sees and downtime.", "Tell it your pace — relaxed or packed."],
      ["Compare my options", "I need to choose [decision, e.g. a phone plan]. Here are the choices: [paste]. Compare them simply and tell me which fits [my situation].", "Spell out what matters most to you."],
      ["Write a tricky message", "Help me write a message to [person] about [situation]. Tone: kind but clear. Keep it short.", "Read it once more before you hit send."],
      ["Gift ideas", "Suggest 10 gift ideas for [person] who likes [interests]. Budget: [amount]. Mix practical and thoughtful.", "Add the occasion and their age for sharper ideas."],
      ["Budget a purchase", "I want to buy [item] costing [amount]. Help me work out how to save for it in [timeframe], and whether it's worth it.", "Pair this with the UtilityApps budget spreadsheet."],
      ["Declutter plan", "Give me a simple, room-by-room plan to declutter my home over [timeframe], with small daily tasks.", "Small daily tasks beat one exhausting weekend."],
      ["Weigh a habit", "Explain the general pros and cons of [habit or choice]. Keep it balanced.", "For anything health-related, confirm with a professional."],
      ["Talk it through", "I'm feeling stuck about [situation]. Ask me 5 thoughtful questions, one at a time, to help me think it through.", "Answer honestly — the value is in your own answers."],
    ],
  },
];

// ---------------------------------------------------------------- render --
const doc = new jsPDF({ unit: "mm", format: "a4" });
const PW = 210;
const PH = 297;
const M = 18;
let y = M;

function ensure(space) {
  if (y + space > PH - M) {
    doc.addPage();
    y = M;
  }
}

function write(text, { size = 10, style = "normal", color = [51, 65, 85], indent = 0, gap = 1.5 } = {}) {
  doc.setFont("helvetica", style);
  doc.setFontSize(size);
  doc.setTextColor(color[0], color[1], color[2]);
  const lines = doc.splitTextToSize(text, PW - M * 2 - indent);
  const lh = size * 0.3528 * 1.3;
  for (const line of lines) {
    ensure(lh);
    doc.text(line, M + indent, y);
    y += lh;
  }
  y += gap;
}

// --- Cover ---
doc.setFillColor(0, 102, 255);
doc.rect(0, 0, PW, 70, "F");
doc.setFont("helvetica", "bold");
doc.setFontSize(30);
doc.setTextColor(255, 255, 255);
doc.text("AI Prompt Pack", M, 38);
doc.setFont("helvetica", "normal");
doc.setFontSize(14);
doc.text("60 pro prompts for ChatGPT, Claude & Gemini", M, 50);
y = 88;
write("What this is", { size: 14, style: "bold", color: [15, 23, 42], gap: 2 });
write(
  "Sixty prompts you can copy straight into ChatGPT, Claude or Gemini. They are organised into six everyday sections, and every prompt has a short note on how to adapt it. No filler — just prompts that do real work.",
  { gap: 4 }
);
write("How to use it", { size: 14, style: "bold", color: [15, 23, 42], gap: 2 });
write("1. Find a prompt for the job you have.", { gap: 0.5 });
write("2. Copy it, and replace anything in [square brackets] with your own details.", { gap: 0.5 });
write("3. Paste it into your AI tool. Read the 'Adapt it' tip to push it further.", { gap: 0.5 });
write("4. Always review what the AI gives you before you use it — treat it as a draft.", { gap: 4 });
write(
  "UtilityApps  ·  utilityapps.site  ·  Hundreds of free online tools",
  { size: 9, color: [148, 163, 184] }
);

// --- Sections ---
let n = 0;
for (const section of SECTIONS) {
  doc.addPage();
  y = M;
  // section bar
  doc.setFillColor(0, 102, 255);
  doc.rect(M, y, PW - M * 2, 11, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text(section.name, M + 4, y + 7.6);
  y += 18;

  for (const [title, prompt, tip] of section.items) {
    n += 1;
    ensure(34);
    write(`${n}. ${title}`, { size: 11.5, style: "bold", color: [15, 23, 42], gap: 1.2 });
    write(prompt, { size: 10, color: [51, 65, 85], indent: 2, gap: 1.2 });
    write(`Adapt it: ${tip}`, { size: 9, style: "italic", color: [100, 116, 139], indent: 2, gap: 4 });
  }
}

// --- Footer page numbers ---
const pages = doc.getNumberOfPages();
for (let i = 2; i <= pages; i += 1) {
  doc.setPage(i);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text(`UtilityApps  ·  AI Prompt Pack`, M, PH - 10);
  doc.text(`${i - 1}`, PW - M, PH - 10, { align: "right" });
}

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, Buffer.from(doc.output("arraybuffer")));
console.log("Wrote", OUT);
