/**
 * Per-tool metadata for the Legal Tools category. Same shape as pdfFaqs.ts
 * so SEO schema rendering in LegalToolShell mirrors the PDF shell exactly.
 *
 * Each tool's FAQ list always ends with STANDARD_DISCLAIMER so the
 * "this is a template, not legal advice" message is impossible to miss.
 */

import { type FAQItem } from "@/components/tools/ToolFAQ";
import { SITE_CONFIG } from "@/lib/utils";

export type LegalToolId =
  | "privacy-policy-generator"
  | "terms-of-service-generator"
  | "cookie-policy-generator"
  | "nda-generator"
  | "freelance-contract-generator"
  | "dmca-takedown-notice"
  | "gdpr-request-letter"
  | "cease-and-desist-letter";

export interface HowToStep {
  name: string;
  text: string;
}

const STANDARD_DISCLAIMER: FAQItem = {
  q: "Is this legal advice?",
  a: "No. UtilityApps is not a law firm and these tools generate generic templates from form input — they do not constitute legal advice and do not create an attorney-client relationship. Laws and required clauses vary widely by jurisdiction and situation. Before signing, sending, or filing the document, have it reviewed by an attorney licensed in the relevant jurisdiction.",
};

const STANDARD_PRIVACY: FAQItem = {
  q: "Is my data sent to a server?",
  a: "No. The form, the document generation, and the PDF/Word file all run entirely in your browser. Nothing you type leaves your device. You can disconnect from the internet after the page loads and the tool still works.",
};

export const LEGAL_FAQS: Record<LegalToolId, FAQItem[]> = {
  "privacy-policy-generator": [
    {
      q: "Does this comply with GDPR / CCPA?",
      a: "The template includes the disclosures GDPR (EU/UK) and CCPA (California) commonly require — purposes of processing, the lawful basis, data subject rights, cookies, third-party processors, contact for data requests. It is a starting point, not a guarantee of compliance: every business handles data differently, and your policy must accurately describe what your business actually does. Have a privacy lawyer review the result.",
    },
    {
      q: "What information do I need to provide?",
      a: "Company name and contact email at minimum. For more accurate output, also provide your jurisdiction (so the right rights language is selected), whether you collect personal data through forms, whether you use cookies and analytics, whether you serve EU/UK users, and any third-party services that handle your customers' data.",
    },
    {
      q: "Will this work for my Shopify / WordPress / SaaS site?",
      a: "Yes — the output is a generic privacy policy that you can paste into a /privacy page on any platform. Most platforms (Shopify, WordPress, Squarespace, Webflow, custom React/Next.js apps) just need plain text or HTML for legal pages.",
    },
    {
      q: "How often should I update my privacy policy?",
      a: "Whenever what you actually do with data changes — a new analytics tool, a new payment processor, expanding to a new region with different rules. Also worth a yearly review even without changes, since privacy laws themselves get updated periodically.",
    },
    STANDARD_PRIVACY,
    STANDARD_DISCLAIMER,
  ],

  "terms-of-service-generator": [
    {
      q: "What does a Terms of Service actually do?",
      a: "It's a contract between you and your users that sets out what they may do with your service, who owns content, your warranty disclaimers and liability limits, the rules for termination, and which jurisdiction's law applies if there's a dispute. Without one, every disagreement falls back to default law which usually favours the user.",
    },
    {
      q: "What information do I need?",
      a: "Company name, website / app URL, the type of service (subscription, free, marketplace, etc.), governing-law jurisdiction (e.g. Delaware, England), and a support contact email. Optional: arbitration clause, age restriction, free trial terms.",
    },
    {
      q: "Should the Terms of Service and Privacy Policy be one document?",
      a: "No, separate documents. Privacy Policy = what data you collect and what you do with it (legally required disclosure). Terms of Service = the contract for using your service. They serve different legal purposes and should be linked separately in your footer.",
    },
    {
      q: "Can I limit my liability entirely with a Terms of Service?",
      a: "No — courts in most jurisdictions won't enforce a total liability waiver, especially against consumers, and some limitations (gross negligence, willful misconduct, certain consumer-protection rights) can't be waived at all. A well-drafted limitation clause narrows exposure; it doesn't eliminate it.",
    },
    STANDARD_PRIVACY,
    STANDARD_DISCLAIMER,
  ],

  "cookie-policy-generator": [
    {
      q: "When do I need a cookie policy?",
      a: "Any website that uses cookies for analytics, advertising, or anything beyond strictly-necessary cookies needs a cookie policy — especially if you have EU/UK visitors (ePrivacy Directive + GDPR) or California visitors (CCPA). Even US-only sites typically need one for ad networks.",
    },
    {
      q: "What's the difference between a cookie policy and a cookie banner?",
      a: "The cookie policy is the full document explaining which cookies you use and why — usually on its own /cookies page. The cookie banner is the UI element that asks for consent before non-essential cookies are set. You need both; this tool generates the policy.",
    },
    {
      q: "Do I need consent for analytics cookies?",
      a: "In the EU/UK, yes — analytics cookies that identify users are non-essential and require opt-in consent. In the US, opt-out is generally sufficient (CCPA). The policy explains the categories; consent is collected by your banner.",
    },
    {
      q: "What information do I need to generate the policy?",
      a: "Your site URL, company name, and contact email at minimum. For accurate output, also note which cookie categories you actually use — strictly necessary, analytics, advertising, and social — since the generated policy only lists categories you confirm.",
    },
    STANDARD_PRIVACY,
    STANDARD_DISCLAIMER,
  ],

  "nda-generator": [
    {
      q: "Mutual or one-way NDA — which should I pick?",
      a: "One-way (unilateral) — only one side is sharing confidential information. Common when a company is sharing trade secrets with a contractor or interview candidate. Mutual — both sides will share confidential information. Common between business partners, co-founders, or merger talks. When in doubt, mutual is safer for both parties.",
    },
    {
      q: "How long should the confidentiality period be?",
      a: "Two to five years for general business information is typical. Indefinite for true trade secrets (formulas, algorithms, customer lists). Be specific in the form — courts dislike NDAs with no end date for ordinary commercial info, and may refuse to enforce them.",
    },
    {
      q: "What information do I need?",
      a: "Names and addresses of both parties (or just one disclosing party for unilateral), the purpose of sharing (e.g. 'evaluating a potential investment'), the term (years), the governing-law jurisdiction, and any specific categories of information you want explicitly covered.",
    },
    {
      q: "Is a signed NDA enforceable if it's generated from a template?",
      a: "Generally yes — enforceability depends on the terms being clear and reasonable (specific purpose, defined confidential information, a sensible term), not on who drafted it. A template is a valid starting point as long as both parties actually sign and the terms fit your real situation.",
    },
    STANDARD_PRIVACY,
    STANDARD_DISCLAIMER,
  ],

  "freelance-contract-generator": [
    {
      q: "What clauses does the contract include?",
      a: "Scope of work, payment terms (amount, schedule, late fees), deadlines, IP ownership (work-for-hire vs licence), confidentiality, kill fee, independent contractor status (so the client doesn't owe employment taxes), warranty and liability limits, governing law, and termination conditions.",
    },
    {
      q: "Who owns the IP once I'm paid?",
      a: "Depends on what the form sets. Two common patterns: (a) Full assignment — client owns everything once paid in full; you can't reuse it. (b) Limited licence — client gets the right to use the deliverable for the stated purpose, you keep ownership and can include it in your portfolio or licence to others. Discuss with the client before sending.",
    },
    {
      q: "Do I really need a written contract for small jobs?",
      a: "Yes — especially small jobs. Disputes are common when both sides assumed something different. A short written contract that captures scope, price, and deadline takes minutes to send and protects both sides far more than informal email threads do.",
    },
    {
      q: "What's a 'kill fee' and should I include one?",
      a: "A kill fee is a payment owed if the client cancels the project partway through — it compensates you for time already spent and work turned down elsewhere. Worth including on any project with meaningful upfront time investment; less critical for very short, low-commitment jobs.",
    },
    STANDARD_PRIVACY,
    STANDARD_DISCLAIMER,
  ],

  "dmca-takedown-notice": [
    {
      q: "What is a DMCA takedown notice?",
      a: "A formal request, defined by the US Digital Millennium Copyright Act §512(c)(3), asking an online service (like a host, ISP, or platform) to remove copyrighted material that was posted without permission. Sending one in good faith generally requires the host to remove the content quickly to keep their own safe-harbor protection.",
    },
    {
      q: "What information must a valid notice include?",
      a: "The statute requires six elements: (1) your signature, (2) identification of the work being infringed, (3) the exact location of the infringing material (URL), (4) your contact info, (5) a good-faith statement that the use is not authorised, and (6) a statement under penalty of perjury that the info is accurate and you're authorised to act. This tool generates all six.",
    },
    {
      q: "What happens after I send it?",
      a: "The service provider typically removes the content within a few days. The uploader may file a counter-notice; if they do, the service can restore the content unless you file a lawsuit within 10–14 business days. Sending a bad-faith notice (false claim of ownership) can expose you to liability under §512(f).",
    },
    {
      q: "Who do I send the notice to?",
      a: "The platform or host's designated DMCA agent — most major platforms publish a dedicated copyright/DMCA contact or web form. For smaller sites, check the footer for a copyright policy or send it to the hosting provider identified via a WHOIS lookup if the site itself has no listed contact.",
    },
    STANDARD_PRIVACY,
    STANDARD_DISCLAIMER,
  ],

  "gdpr-request-letter": [
    {
      q: "What is a GDPR Data Subject Request?",
      a: "Under the EU/UK General Data Protection Regulation, you (the data subject) have the right to ask any organisation that holds your personal data to (a) confirm what they hold, (b) provide a copy, (c) delete it, (d) correct it, (e) port it to another service, or (f) restrict its processing. The request must be answered within one calendar month.",
    },
    {
      q: "Which request type should I pick?",
      a: "Article 15 (Access) — to see what they have. Article 17 (Erasure / 'right to be forgotten') — to delete. Article 16 (Rectification) — to correct inaccurate data. Article 20 (Portability) — to receive a machine-readable copy. Article 18 (Restriction) — to pause processing while you contest it. Article 21 (Object) — to stop direct marketing.",
    },
    {
      q: "Where do I send it?",
      a: "The organisation's privacy contact email is the simplest — most companies publish a privacy@company.com or list a DPO (Data Protection Officer) in their privacy policy. The letter can be sent by email or post; email is fine. Keep a dated copy of what you sent.",
    },
    {
      q: "What if the company doesn't respond within a month?",
      a: "You can escalate to your national data protection authority (e.g. the ICO in the UK, or your country's equivalent) and file a complaint — most regulators have a straightforward online complaint process for exactly this situation.",
    },
    STANDARD_PRIVACY,
    STANDARD_DISCLAIMER,
  ],

  "cease-and-desist-letter": [
    {
      q: "What is a cease and desist letter for?",
      a: "It's a formal written demand asking another party to stop a specific behaviour — copying your trademark, harassing you, breaching a contract, defaming you, scraping your site, etc. It's not legally binding (only a court order is), but it puts the recipient on notice and creates a paper trail you can use if you later sue.",
    },
    {
      q: "Will sending a cease and desist actually work?",
      a: "Often, yes — especially when the recipient didn't realise their behaviour was wrong or risky. It works less well against bad actors who know what they're doing. If the conduct is serious (ongoing IP infringement, threats), a letter from a lawyer carries more weight than a template from you.",
    },
    {
      q: "What should I include?",
      a: "Your identity and standing (why you have the right to demand this stops), a specific description of the conduct, the date(s) it occurred, the legal basis (trademark, copyright, defamation, harassment, etc.), the specific actions required to comply, a deadline to comply, and the consequences if they don't (legal action, complaint to a regulator, etc.).",
    },
    {
      q: "Does sending a cease and desist letter start a lawsuit?",
      a: "No — it's a pre-litigation demand, not a court filing. It costs nothing to send and creates no legal proceeding by itself. If the recipient ignores it, your options are to escalate (a lawyer's letter), pursue mediation, or file an actual lawsuit — the letter itself doesn't commit you to any of those.",
    },
    STANDARD_PRIVACY,
    STANDARD_DISCLAIMER,
  ],
};

export const LEGAL_HOWTOS: Record<LegalToolId, HowToStep[]> = {
  "privacy-policy-generator": [
    { name: "Enter your business basics", text: "Company name, contact email, jurisdiction, and what your site does." },
    { name: "Check the right boxes", text: "Pick what data you collect and which third-party services touch it (analytics, payments, ads)." },
    { name: "Download PDF or Word", text: "The policy generates live in the preview — download in either format and paste into your /privacy page." },
  ],
  "terms-of-service-generator": [
    { name: "Describe your service", text: "Company, URL, what you offer, and which jurisdiction's law should govern." },
    { name: "Pick optional clauses", text: "Free trial, age restriction, arbitration — toggle in or out depending on your situation." },
    { name: "Download and publish", text: "PDF or Word; paste into your /terms page or link in your footer." },
  ],
  "cookie-policy-generator": [
    { name: "Enter your site basics", text: "Site URL, company name, and contact email." },
    { name: "Tick the cookies you use", text: "Strictly necessary, analytics, advertising, social — pick the categories that apply." },
    { name: "Download", text: "PDF or Word; pair with a consent banner on your site." },
  ],
  "nda-generator": [
    { name: "Pick mutual or one-way", text: "Mutual if both sides share secrets; one-way if only one party is disclosing." },
    { name: "Fill the parties and term", text: "Names, addresses, the purpose of sharing, and how many years confidentiality lasts." },
    { name: "Download and sign", text: "PDF or Word; both parties sign and keep a copy each." },
  ],
  "freelance-contract-generator": [
    { name: "Set scope and pricing", text: "What you're delivering, by when, for how much, and how the client pays you." },
    { name: "Pick IP terms", text: "Full assignment to the client once paid, or licence with you retaining ownership." },
    { name: "Download and send", text: "PDF or Word; both sides sign before work starts." },
  ],
  "dmca-takedown-notice": [
    { name: "Identify the infringing material", text: "URL where it's hosted, and a description of your original work." },
    { name: "Add your contact info", text: "Required by §512(c)(3) — name, address, email, phone." },
    { name: "Download and send", text: "Email the PDF to the service's DMCA agent (their privacy or legal address)." },
  ],
  "gdpr-request-letter": [
    { name: "Pick request type", text: "Access, erasure, rectification, portability, restriction, or objection." },
    { name: "Add the recipient and your details", text: "Company name, your name and verification info, and any specific data you want." },
    { name: "Download and send", text: "Email to the company's privacy contact (privacy@... or DPO); they must respond within 30 days." },
  ],
  "cease-and-desist-letter": [
    { name: "Describe the conduct", text: "What the recipient is doing, when, where, and why it's wrongful." },
    { name: "State the legal basis", text: "Trademark, copyright, defamation, harassment, contract breach — pick the right framing." },
    { name: "Set a deadline", text: "How many days they have to comply, and what happens if they don't. Download and send." },
  ],
};

export const LEGAL_FEATURE_LISTS: Record<LegalToolId, string> = {
  "privacy-policy-generator": "GDPR/CCPA-aware privacy policy template, cookie and analytics sections, third-party processor list, PDF and Word output, in-browser generation",
  "terms-of-service-generator": "Terms of service template with liability, IP, governing-law, arbitration and termination clauses, PDF and Word output, in-browser",
  "cookie-policy-generator": "Cookie policy with strictly-necessary / analytics / advertising / social categories, GDPR and CCPA disclosures, PDF and Word output",
  "nda-generator": "Mutual or one-way NDA template, configurable confidentiality term, governing-law clause, signature blocks, PDF and Word output",
  "freelance-contract-generator": "Freelance / independent contractor agreement with scope, payment, IP, confidentiality, kill fee, governing law, PDF and Word output",
  "dmca-takedown-notice": "DMCA §512(c)(3)-compliant takedown notice with all six required elements, recipient block, PDF and Word output",
  "gdpr-request-letter": "GDPR Article 15/16/17/18/20/21 request letters, identity verification, recipient address, PDF and Word output",
  "cease-and-desist-letter": "Cease and desist letter template with conduct description, legal basis, deadline and consequences, PDF and Word output",
};

export const LEGAL_TOOL_PUBLISHED = "2026-05-23";

export function getLegalFaqs(toolId: string): FAQItem[] {
  return LEGAL_FAQS[toolId as LegalToolId] ?? [];
}

export function getLegalHowTo(toolId: string): HowToStep[] {
  return LEGAL_HOWTOS[toolId as LegalToolId] ?? [];
}

export function getLegalFeatureList(toolId: string): string {
  return LEGAL_FEATURE_LISTS[toolId as LegalToolId] ?? "";
}

export function legalToolOgUrl(title: string, description: string): string {
  const params = new URLSearchParams({ title, description, type: "legal-tool" });
  return `${SITE_CONFIG.url}/api/og?${params.toString()}`;
}
