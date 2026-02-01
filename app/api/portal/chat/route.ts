import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase, getServiceSupabase } from "@/lib/supabase/server";

type ToolCall =
  | { tool: "searchQuestions"; args: { q: string } }
  | { tool: "runCrosstab"; args: { rowVar: string; colVar: string; filters?: Record<string, any> } }
  | { tool: "help"; args?: Record<string, never> };

const NOINDEX_HEADERS = {
  "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet",
};

const HELP_MESSAGE = [
  "I can help with:",
  "- Question discovery: \"find questions about packaging chemicals\"",
  "- Crosstabs: \"run q20br13 by age_group\"",
  "",
  "Tip: Use database column codes (e.g., q20br13, age_group).",
  "You can browse the full list in /portal/questions.",
].join("\n");

function asJsonResponse(body: Record<string, any>, status = 200) {
  return NextResponse.json(body, { status, headers: NOINDEX_HEADERS });
}

async function assertAuthed() {
  const supabase = await getServerSupabase();
  const { data, error } = await supabase.auth.getSession();
  if (error || !data?.session) {
    return null;
  }
  return data.session;
}

function looksLikeJson(message: string) {
  const trimmed = message.trim();
  return trimmed.startsWith("{") && trimmed.endsWith("}");
}

function parseToolJson(message: string): ToolCall | null {
  if (!looksLikeJson(message)) return null;
  try {
    const parsed = JSON.parse(message);
    if (!parsed || typeof parsed !== "object") return null;
    if (parsed.tool === "searchQuestions" && parsed.args?.q) {
      return { tool: "searchQuestions", args: { q: String(parsed.args.q) } };
    }
    if (parsed.tool === "runCrosstab" && parsed.args?.rowVar && parsed.args?.colVar) {
      return {
        tool: "runCrosstab",
        args: {
          rowVar: String(parsed.args.rowVar),
          colVar: String(parsed.args.colVar),
          filters: parsed.args.filters,
        },
      };
    }
  } catch {
    return null;
  }
  return null;
}

function extractQuery(message: string) {
  const aboutMatch = message.match(/\babout\s+(.+)/i);
  if (aboutMatch?.[1]) return aboutMatch[1].trim();
  const forMatch = message.match(/\bfor\s+(.+)/i);
  if (forMatch?.[1]) return forMatch[1].trim();
  return message.trim();
}

function inferTool(message: string): ToolCall {
  const lower = message.toLowerCase();
  if (/\bvalid columns\b|\blist columns\b|\bshow columns\b|\bcolumn list\b/.test(lower)) {
    return { tool: "help" };
  }
  if (/\bhelp\b|\bwhat can you do\b|\bhow do i\b/.test(lower)) {
    return { tool: "help" };
  }

  const byMatch = message.match(/\b([a-z][a-z0-9_]+)\s+by\s+([a-z][a-z0-9_]+)\b/i);
  if (byMatch) {
    return {
      tool: "runCrosstab",
      args: { rowVar: byMatch[1], colVar: byMatch[2] },
    };
  }

  const vsMatch = message.match(/\b([a-z][a-z0-9_]+)\s+vs\.?\s+([a-z][a-z0-9_]+)\b/i);
  if (vsMatch) {
    return {
      tool: "runCrosstab",
      args: { rowVar: vsMatch[1], colVar: vsMatch[2] },
    };
  }

  if (/\bfind\b|\bsearch\b|\bquestion\b|\bquestions\b/.test(lower)) {
    return { tool: "searchQuestions", args: { q: extractQuery(message) } };
  }

  const trimmed = message.trim();
  if (/^[a-z][a-z0-9_]+$/i.test(trimmed)) {
    return { tool: "searchQuestions", args: { q: trimmed } };
  }

  return { tool: "help" };
}

function validateToolCall(call: ToolCall): string | null {
  if (call.tool === "searchQuestions") {
    const q = call.args.q?.trim();
    if (!q || q.length < 2) return "Search query is required.";
    return null;
  }
  if (call.tool === "runCrosstab") {
    const rowVar = call.args.rowVar?.trim();
    const colVar = call.args.colVar?.trim();
    if (!rowVar || !colVar) return "rowVar and colVar are required.";
    const valid = /^[a-z][a-z0-9_]+$/i;
    if (!valid.test(rowVar) || !valid.test(colVar)) {
      return "rowVar and colVar must be valid column codes.";
    }
  }
  return null;
}

type SearchGroups = {
  questions: Array<Record<string, any>>;
  related: Array<Record<string, any>>;
  technical: Array<Record<string, any>>;
};

async function fetchSearch(
  req: NextRequest,
  query: string
): Promise<{ groups: SearchGroups; suggestions?: string[] }> {
  const url = new URL(`/api/portal/questions/search?q=${encodeURIComponent(query)}`, req.nextUrl.origin);
  const res = await fetch(url, {
    headers: { cookie: req.headers.get("cookie") || "" },
    cache: "no-store",
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error || "Question search failed.");
  }
  return {
    groups: data?.groups || { questions: [], related: [], technical: [] },
    suggestions: data?.suggestions || [],
  };
}

async function fetchCrosstab(
  req: NextRequest,
  args: { rowVar: string; colVar: string; filters?: Record<string, any> }
) {
  const url = new URL("/api/portal/crosstabs", req.nextUrl.origin);
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      cookie: req.headers.get("cookie") || "",
    },
    body: JSON.stringify(args),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error || "Crosstab query failed.");
  }
  return data;
}

async function logChat({
  userId,
  message,
  toolUsed,
  variablesUsed,
  success,
}: {
  userId: string;
  message: string;
  toolUsed: string;
  variablesUsed: Record<string, any> | null;
  success: boolean;
}) {
  try {
    const admin = getServiceSupabase();
    await admin.from("portal_chat_logs").insert({
      user_id: userId,
      message,
      tool_used: toolUsed,
      variables_used: variablesUsed,
      success,
    });
  } catch {
    // Ignore logging failures.
  }
}

export async function POST(req: NextRequest) {
  const session = await assertAuthed();
  if (!session) {
    return asJsonResponse({ error: "Unauthorized" }, 401);
  }

  let body: { message?: string; history?: Array<{ role: string; content: string }> };
  try {
    body = (await req.json()) as { message?: string; history?: Array<{ role: string; content: string }> };
  } catch {
    return asJsonResponse({ error: "Invalid body" }, 400);
  }

  const message = String(body?.message || "").trim();
  if (!message) {
    return asJsonResponse({ error: "Message is required." }, 400);
  }

  const directTool = parseToolJson(message);
  const toolCall = directTool || inferTool(message);
  const validationError = validateToolCall(toolCall);
  if (validationError) {
    await logChat({
      userId: session.user.id,
      message,
      toolUsed: toolCall.tool,
      variablesUsed: toolCall.tool === "runCrosstab" ? toolCall.args : toolCall.tool === "searchQuestions" ? toolCall.args : null,
      success: false,
    });
    return asJsonResponse({ error: validationError }, 400);
  }

  let responseText = HELP_MESSAGE;
  let success = true;
  let variablesUsed: Record<string, any> | null = null;
  let chart: null | {
    rowVar: string;
    colVar: string;
    rowQuestion?: string;
    colQuestion?: string;
    rows: string[];
    cols: string[];
    cells: Array<{ row: string; col: string; count: number; colPct?: number }>;
    base: number;
  } = null;
  let groups: SearchGroups | null = null;

  try {
    if (toolCall.tool === "searchQuestions") {
      const q = toolCall.args.q.trim();
      variablesUsed = { q };
      const results = await fetchSearch(req, q);
      groups = results.groups;
      const questions = results.groups.questions || [];
      const related = results.groups.related || [];
      const suggestions = results.suggestions || [];
      if (!questions.length && !related.length) {
        responseText = `No questions found for "${q}". Try a different keyword.`;
        if (suggestions.length) {
          responseText += `\nSuggestions: ${suggestions.slice(0, 6).join(", ")}`;
        }
      } else {
        const items = questions.slice(0, 8);
        responseText = [
          `Top matches for "${q}":`,
          ...items.map((item) => {
            const label = item.display_text || item.question_text || item.source_header || item.question_code || item.db_column;
            return `- ${item.question_code || item.db_column}: ${label}`;
          }),
        ].join("\n");
      }
    } else if (toolCall.tool === "runCrosstab") {
      const { rowVar, colVar, filters } = toolCall.args;
      variablesUsed = { rowVar, colVar, filters: filters || null };

      const data = await fetchCrosstab(req, toolCall.args);
      const rows = Array.from(
        new Set((data.cells || []).map((cell: any) => String(cell.row)))
      ) as string[];
      const cols = Array.from(
        new Set((data.cells || []).map((cell: any) => String(cell.col)))
      ) as string[];
      const rowMeta = await fetchSearch(req, rowVar);
      const colMeta = await fetchSearch(req, colVar);
      const rowCandidates = [...rowMeta.groups.questions, ...rowMeta.groups.related];
      const colCandidates = [...colMeta.groups.questions, ...colMeta.groups.related];
      const rowMatch = rowCandidates.find((item) => item.db_column === rowVar);
      const colMatch = colCandidates.find((item) => item.db_column === colVar);
      const rowQuestion = rowMatch?.display_text || rowMatch?.question_text || rowMatch?.source_header;
      const colQuestion = colMatch?.display_text || colMatch?.question_text || colMatch?.source_header;

      responseText = [
        `Crosstab results`,
        `Row: ${rowVar}${rowQuestion ? ` — ${rowQuestion}` : ""}`,
        `Column: ${colVar}${colQuestion ? ` — ${colQuestion}` : ""}`,
        `Base n: ${data.totals?.overall ?? 0}`,
      ].join("\n");
      chart = {
        rowVar,
        colVar,
        rowQuestion,
        colQuestion,
        rows,
        cols,
        cells: (data.cells || []).map((cell: any) => ({
          row: String(cell.row),
          col: String(cell.col),
          count: Number(cell.count || 0),
          colPct: typeof cell.colPct === "number" ? cell.colPct : undefined,
        })),
        base: Number(data.totals?.overall ?? 0),
      };
    } else {
      responseText = HELP_MESSAGE;
    }
  } catch (err: any) {
    success = false;
    const messageText = String(err?.message || "Something went wrong.");
    if (toolCall.tool === "runCrosstab" && messageText.toLowerCase().includes("invalid column")) {
      const invalid = messageText.split(":").pop()?.trim();
      if (invalid) {
        const matches = await fetchSearch(req, invalid);
        groups = matches.groups;
        const list = [...matches.groups.questions, ...matches.groups.related];
        if (list.length) {
          responseText = [
            `Invalid column: ${invalid}`,
            "Did you mean:",
            ...list.slice(0, 6).map((item) => {
              const label = item.display_text || item.question_text || item.source_header || item.question_code || item.db_column;
              return `- ${item.db_column || item.question_code}: ${label}`;
            }),
          ].join("\n");
        } else {
          responseText = `${messageText}\nTry searching in /portal/questions.`;
        }
      } else {
        responseText = `${messageText}\nTry searching in /portal/questions.`;
      }
    } else {
      responseText = messageText;
    }
  }

  await logChat({
    userId: session.user.id,
    message,
    toolUsed: toolCall.tool,
    variablesUsed,
    success,
  });

  return asJsonResponse({
    message: responseText,
    toolUsed: toolCall.tool,
    variablesUsed,
    success,
    chart,
    groups,
  });
}
