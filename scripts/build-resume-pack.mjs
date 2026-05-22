/**
 * Generates the "ATS-Friendly Resume Template Pack" product file.
 *
 *   node scripts/build-resume-pack.mjs
 *
 * Output: product-files/resume-pack.docx  (upload to Supabase Storage)
 *
 * Templates are single-column with standard fonts and headings — no tables,
 * text boxes or graphics — so Applicant Tracking Systems parse them cleanly.
 */
import { AlignmentType, BorderStyle, Document, Packer, Paragraph, TextRun } from "docx";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = resolve(ROOT, "product-files", "resume-pack.docx");

const NAVY = "0F172A";
const BLUE = "0066FF";
const GREY = "475569";

// ---- paragraph helpers ----------------------------------------------------
const name = (text, breakBefore = false) =>
  new Paragraph({
    alignment: AlignmentType.CENTER,
    pageBreakBefore: breakBefore,
    spacing: { after: 40 },
    children: [new TextRun({ text, bold: true, size: 40, color: NAVY })],
  });

const contact = (text) =>
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 200 },
    children: [new TextRun({ text, size: 18, color: GREY })],
  });

const heading = (text) =>
  new Paragraph({
    spacing: { before: 240, after: 100 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: BLUE } },
    children: [new TextRun({ text: text.toUpperCase(), bold: true, size: 24, color: NAVY })],
  });

const body = (text, opts = {}) =>
  new Paragraph({
    spacing: { after: 80 },
    children: [new TextRun({ text, size: 21, color: opts.color ?? "1E293B", italics: opts.italics, bold: opts.bold })],
  });

const jobTitle = (text) =>
  new Paragraph({
    spacing: { before: 120, after: 10 },
    children: [new TextRun({ text, bold: true, size: 22, color: NAVY })],
  });

const subtle = (text) =>
  new Paragraph({
    spacing: { after: 40 },
    children: [new TextRun({ text, size: 19, color: GREY })],
  });

const bullet = (text) =>
  new Paragraph({
    bullet: { level: 0 },
    spacing: { after: 40 },
    children: [new TextRun({ text, size: 21, color: "1E293B" })],
  });

const title = (text, breakBefore = true) =>
  new Paragraph({
    pageBreakBefore: breakBefore,
    spacing: { after: 60 },
    children: [new TextRun({ text, bold: true, size: 30, color: BLUE })],
  });

const children = [];

// ---- Intro page -----------------------------------------------------------
children.push(
  new Paragraph({
    spacing: { after: 80 },
    children: [new TextRun({ text: "ATS-Friendly Resume Pack", bold: true, size: 44, color: BLUE })],
  }),
  body(
    "Three resume templates and a matching cover letter, built the way Applicant Tracking Systems (ATS) want them: single column, standard fonts, clear headings, and no graphics or tables that break automated parsing."
  ),
  heading("What's inside"),
  bullet("Template 1 — Classic Professional: for people with a few years of work history."),
  bullet("Template 2 — Entry-Level / Graduate: leads with education and projects."),
  bullet("Template 3 — Skills-First: for career changers and skills-led applications."),
  bullet("A matching cover letter template."),
  bullet("A one-page tailoring guide."),
  heading("How to use it"),
  bullet("Pick the template that fits you and delete the other pages."),
  bullet("Replace everything in [square brackets] with your own details."),
  bullet("Keep the formatting simple — that is what makes it ATS-safe."),
  bullet("Read the tailoring guide on the last page before you apply."),
  body("UtilityApps · utilityapps.site", { color: "94A3B8" })
);

// ---- Template 1: Classic Professional ------------------------------------
children.push(
  title("Template 1 — Classic Professional"),
  body("For applicants with a few years of experience. Delete this blue line before using.", { italics: true, color: GREY }),
  name("[YOUR NAME]"),
  contact("[City, Country]  •  [Phone]  •  [Email]  •  [LinkedIn URL]"),
  heading("Professional Summary"),
  body("[Two or three sentences: who you are, your years of experience, your strongest skill, and the role you want. Example: “Operations manager with 8 years’ experience leading teams of 10+ and cutting costs by 20%.”]"),
  heading("Work Experience"),
  jobTitle("[Job Title]"),
  subtle("[Company]  •  [Location]  •  [Start date] – [End date]"),
  bullet("[Achievement with a number — what you did and the result it produced.]"),
  bullet("[Achievement — start with an action verb: Led, Built, Reduced, Grew, Launched.]"),
  bullet("[Achievement.]"),
  jobTitle("[Job Title]"),
  subtle("[Company]  •  [Location]  •  [Start date] – [End date]"),
  bullet("[Achievement.]"),
  bullet("[Achievement.]"),
  heading("Education"),
  jobTitle("[Degree], [Field of study]"),
  subtle("[Institution]  •  [Location]  •  [Year]"),
  heading("Skills"),
  body("[Skill]  •  [Skill]  •  [Skill]  •  [Skill]  •  [Skill]  •  [Skill]")
);

// ---- Template 2: Entry-Level / Graduate ----------------------------------
children.push(
  title("Template 2 — Entry-Level / Graduate"),
  body("For students and recent graduates. Education and projects lead. Delete this line before using.", { italics: true, color: GREY }),
  name("[YOUR NAME]"),
  contact("[City]  •  [Phone]  •  [Email]  •  [LinkedIn / Portfolio]"),
  heading("Summary"),
  body("[One or two sentences: your degree, your strengths, and the kind of role you are looking for.]"),
  heading("Education"),
  jobTitle("[Degree], [Field of study]"),
  subtle("[University]  •  [Location]  •  [Graduation year]"),
  bullet("[Relevant coursework, honours, or GPA if it is strong.]"),
  heading("Projects & Experience"),
  jobTitle("[Project, internship, or part-time role]"),
  subtle("[Organisation, if any]  •  [Dates]"),
  bullet("[What you did, and what you achieved or learned — use a number where you can.]"),
  bullet("[Achievement.]"),
  jobTitle("[Project, internship, or part-time role]"),
  subtle("[Organisation, if any]  •  [Dates]"),
  bullet("[Achievement.]"),
  heading("Skills"),
  body("[Technical skills]  •  [Tools & software]  •  [Languages]"),
  heading("Activities & Achievements"),
  bullet("[Volunteering, clubs, awards, or anything that shows initiative.]")
);

// ---- Template 3: Skills-First --------------------------------------------
children.push(
  title("Template 3 — Skills-First (Career Change)"),
  body("For career changers — leads with transferable skills. Delete this line before using.", { italics: true, color: GREY }),
  name("[YOUR NAME]"),
  contact("[City]  •  [Phone]  •  [Email]  •  [LinkedIn URL]"),
  heading("Summary"),
  body("[Two sentences positioning your transferable strengths toward the new field. Name the role you want.]"),
  heading("Core Skills"),
  bullet("[Skill area]: [one line of evidence — where you used it and the result.]"),
  bullet("[Skill area]: [evidence.]"),
  bullet("[Skill area]: [evidence.]"),
  heading("Work Experience"),
  jobTitle("[Job Title]"),
  subtle("[Company]  •  [Location]  •  [Dates]"),
  bullet("[Achievement framed around a skill that transfers to the new role.]"),
  bullet("[Achievement.]"),
  jobTitle("[Job Title]"),
  subtle("[Company]  •  [Location]  •  [Dates]"),
  bullet("[Achievement.]"),
  heading("Education & Certifications"),
  jobTitle("[Degree or certification]"),
  subtle("[Institution]  •  [Year]")
);

// ---- Cover letter --------------------------------------------------------
children.push(
  title("Matching Cover Letter"),
  body("Keep it to one page. Delete this line before using.", { italics: true, color: GREY }),
  name("[YOUR NAME]"),
  contact("[City]  •  [Phone]  •  [Email]"),
  body("[Date]"),
  body(" "),
  body("[Hiring Manager name, if known]"),
  body("[Company name]"),
  body(" "),
  body("Dear [Hiring Manager name],"),
  body(" "),
  body("[Opening — name the role you are applying for and give one sentence on why you are a strong fit.]"),
  body("[Middle — one or two short paragraphs. Pick two achievements from your resume that match what the job needs, and back them up with specifics and numbers.]"),
  body("[Closing — say you would welcome the chance to talk, and thank them for their time.]"),
  body(" "),
  body("Sincerely,"),
  body("[Your Name]")
);

// ---- Tailoring guide -----------------------------------------------------
children.push(
  title("How to Tailor Your Resume"),
  heading("Before you send any application"),
  bullet("Read the job posting and mirror its wording. If it says “project coordination,” use that phrase — ATS and recruiters look for it."),
  bullet("Start every bullet with an action verb: Led, Built, Reduced, Grew, Launched, Managed, Designed."),
  bullet("Quantify wherever you can. “Cut response time by 30%” beats “improved response time.”"),
  bullet("Keep it to one page if you have under ten years of experience; two pages at most."),
  bullet("Put the most relevant experience first — reorder bullets for each job you apply to."),
  bullet("Remove anything that does not help: a photo, date of birth, “references available on request.”"),
  heading("Keeping it ATS-safe"),
  bullet("Use standard section headings: Summary, Work Experience, Education, Skills."),
  bullet("Do not put important text in headers, footers, tables or text boxes — many systems skip them."),
  bullet("Stick to standard fonts (Calibri, Arial) and simple bullet points."),
  bullet("Save and send as PDF unless the employer specifically asks for a Word file."),
  bullet("Name the file clearly, e.g. FirstName-LastName-Resume.pdf."),
  heading("Final check"),
  bullet("Read it out loud once — it catches awkward wording and typos."),
  bullet("Make sure every claim is something you can talk about confidently in an interview."),
  body(" "),
  body("UtilityApps · utilityapps.site · 200+ free online tools", { color: "94A3B8" })
);

const doc = new Document({
  creator: "UtilityApps",
  title: "ATS-Friendly Resume Pack",
  styles: {
    default: {
      document: { run: { font: "Calibri", size: 21, color: "1E293B" } },
    },
  },
  sections: [
    {
      properties: { page: { margin: { top: 1080, bottom: 1080, left: 1080, right: 1080 } } },
      children,
    },
  ],
});

mkdirSync(dirname(OUT), { recursive: true });
const buffer = await Packer.toBuffer(doc);
writeFileSync(OUT, buffer);
console.log("Wrote", OUT);
