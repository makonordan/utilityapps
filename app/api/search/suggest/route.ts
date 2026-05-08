import { NextRequest } from "next/server";
import OpenAI from "openai";

import { EMPTY_SUGGESTION, type SearchSuggestion } from "@/lib/search";
import { TOOLS, TOOLS_BY_ID, type Tool } from "@/lib/tools";

export const runtime = "nodejs";

const MODEL = "gpt-4o-mini";
const MAX_QUERY_LENGTH = 200;

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

const TOOL_DIRECTORY = TOOLS.map((t) => ({
  id: t.id,
  name: t.name,
  category: t.category,
  description: t.description,
  keywords: t.keywords.slice(0, 6),
}));

const SYSTEM_PROMPT = `You are a search assistant for UtilityApps, a platform with 200+ free utility tools. \
Given a user's search query, identify their intent and return the most relevant tools from the catalog below. \
Respond with JSON only, matching this TypeScript shape:

{
  "intent": string,                 // one short sentence describing what the user wants
  "primaryToolId": string | null,   // the single best tool id, or null if unclear
  "toolIds": string[],              // up to 5 relevant tool ids in priority order
  "articleSlugs": string[],         // up to 3 blog slugs you would suggest (free-form, may be empty)
  "productIds": string[]            // up to 2 product ids you would suggest (free-form, may be empty)
}

Only use tool ids from this catalog. If nothing matches, return empty arrays.

CATALOG:
${JSON.stringify(TOOL_DIRECTORY)}`;

interface ModelResponse {
  intent?: string;
  primaryToolId?: string | null;
  toolIds?: string[];
  articleSlugs?: string[];
  productIds?: string[];
}

function pickTool(id: string | null | undefined): Tool | null {
  if (!id) return null;
  return TOOLS_BY_ID[id] ?? null;
}

function uniqueTools(ids: string[] | undefined, exclude: string | null): Tool[] {
  if (!ids) return [];
  const seen = new Set<string>();
  if (exclude) seen.add(exclude);
  const out: Tool[] = [];
  for (const id of ids) {
    if (seen.has(id)) continue;
    const tool = TOOLS_BY_ID[id];
    if (!tool) continue;
    seen.add(id);
    out.push(tool);
    if (out.length >= 5) break;
  }
  return out;
}

export async function POST(request: NextRequest) {
  let query: string;
  try {
    const body = (await request.json()) as { query?: unknown };
    if (typeof body.query !== "string") {
      return Response.json({ error: "query must be a string" }, { status: 400 });
    }
    query = body.query.trim().slice(0, MAX_QUERY_LENGTH);
    if (!query) {
      return Response.json({ error: "query is required" }, { status: 400 });
    }
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!openai) {
    // Fall back gracefully — caller will keep showing local fuzzy results.
    return Response.json(EMPTY_SUGGESTION satisfies SearchSuggestion, {
      headers: { "x-search-fallback": "no-api-key" },
    });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: MODEL,
      temperature: 0.2,
      max_tokens: 400,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: query },
      ],
    });

    const raw = completion.choices[0]?.message?.content ?? "{}";
    let parsed: ModelResponse;
    try {
      parsed = JSON.parse(raw) as ModelResponse;
    } catch {
      parsed = {};
    }

    const primaryTool = pickTool(parsed.primaryToolId ?? null);
    const suggestedTools = uniqueTools(parsed.toolIds, primaryTool?.id ?? null);

    const suggestion: SearchSuggestion = {
      intent: typeof parsed.intent === "string" ? parsed.intent : "",
      primaryTool,
      suggestedTools,
      // Articles and products are placeholders until those collections are wired up.
      // We forward what the model returned so the UI can hide empty sections cleanly.
      suggestedArticles: [],
      suggestedProducts: [],
    };

    return Response.json(suggestion);
  } catch (err) {
    console.error("[search/suggest]", err);
    return Response.json(EMPTY_SUGGESTION satisfies SearchSuggestion, {
      status: 200,
      headers: { "x-search-fallback": "ai-error" },
    });
  }
}
