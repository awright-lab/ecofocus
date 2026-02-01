import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase, getServiceSupabase } from "@/lib/supabase/server";

const LOOKUP_TABLE = "responses_2025_question_lookup";
const ALIAS_TABLE = "responses_2025_question_aliases";
const STOPWORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "by",
  "for",
  "from",
  "how",
  "in",
  "is",
  "it",
  "of",
  "on",
  "or",
  "that",
  "the",
  "this",
  "to",
  "was",
  "were",
  "what",
  "when",
  "where",
  "which",
  "who",
  "why",
  "with",
  "you",
]);

const TOPIC_SYNONYMS: Record<string, string[]> = {
  climate: ["global warming", "emissions", "carbon", "climate change"],
  carbon: ["emissions", "co2", "greenhouse"],
  recycling: ["circularity", "waste", "reuse"],
  packaging: ["plastic", "materials", "waste"],
};

function tokenizeQuery(raw: string) {
  return raw
    .toLowerCase()
    .split(/[^a-z0-9_]+/i)
    .map((token) => token.trim())
    .filter((token) => token.length > 1 && !STOPWORDS.has(token));
}

function buildTokenOr(tokens: string[], columns: string[]) {
  const clauses: string[] = [];
  for (const token of tokens) {
    for (const column of columns) {
      clauses.push(`${column}.ilike.%${token}%`);
    }
  }
  return clauses.join(",");
}

function scoreRow(
  row: Record<string, any>,
  tokens: string[],
  aliasHits: number,
  aliasBoost: number
) {
  const text = String(row.question_text || "").toLowerCase();
  const header = String(row.source_header || "").toLowerCase();
  const topic = String(row.topic || "").toLowerCase();
  const code = String(row.question_code || "").toLowerCase();
  const db = String(row.db_column || "").toLowerCase();

  let score = 0;
  let tokenMatches = 0;
  for (const token of tokens) {
    let matched = false;
    if (text.includes(token)) {
      score += 5;
      matched = true;
    }
    if (header.includes(token)) {
      score += 3;
      matched = true;
    }
    if (topic.includes(token)) {
      score += 2;
      matched = true;
    }
    if (code.includes(token)) {
      score += 1;
      matched = true;
    }
    if (db.includes(token)) {
      score += 1;
      matched = true;
    }
    if (matched) tokenMatches += 1;
  }
  score += tokenMatches * 2;
  score += aliasHits * 2;
  score += aliasBoost;
  return score;
}

function displayText(row: Record<string, any>) {
  return (
    row.question_text ||
    row.source_header ||
    row.question_code ||
    row.db_column ||
    ""
  );
}

function looksLikeQuestion(text: string) {
  const trimmed = text.trim();
  if (!trimmed) return false;
  return trimmed.endsWith("?") || /\bwhat\b|\bwhy\b|\bhow\b|\bwhich\b|\bto what extent\b/i.test(trimmed);
}

function isTechnicalRow(row: Record<string, any>) {
  const db = String(row.db_column || "").toLowerCase();
  const code = String(row.question_code || "").toLowerCase();
  const header = String(row.source_header || "").toLowerCase();
  if (db.startsWith("pagetime") || code.startsWith("pagetime")) return true;
  if (header.includes("assign randomly") || header.includes("assign")) return true;
  if (db.includes("assign") || code.includes("assign")) return true;
  if (db.endsWith("_hidden") || db.includes("_hidden")) return true;
  return false;
}

function classifyRow(row: Record<string, any>) {
  if (isTechnicalRow(row)) return "technical";
  if (row.question_text) {
    return looksLikeQuestion(String(row.question_text)) || String(row.question_code || "").startsWith("Q")
      ? "questions"
      : "related";
  }
  if (row.source_header) return "related";
  return "technical";
}

export async function GET(req: NextRequest) {
  const supabase = await getServerSupabase();
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  if (sessionError || !sessionData?.session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const q = (req.nextUrl.searchParams.get("q") || "").trim();
  if (!q) {
    return NextResponse.json({ data: [] });
  }

  const tokens = tokenizeQuery(q);
  if (!tokens.length) {
    return NextResponse.json({ groups: { questions: [], related: [], technical: [] } });
  }

  try {
    const admin = getServiceSupabase();
    const tokenOr = buildTokenOr(tokens, [
      "question_text",
      "source_header",
      "topic",
      "question_code",
      "db_column",
    ]);

    const { data, error } = await admin
      .from(LOOKUP_TABLE)
      .select("db_column, question_code, question_text, source_header, topic, data_type_guess")
      .or(tokenOr)
      .limit(200);

    if (error) {
      return NextResponse.json({ error: error.message || "Query failed" }, { status: 500 });
    }

    const aliasOr = buildTokenOr(tokens, ["keyword", "db_column", "question_code"]);
    let aliasData: Array<{ keyword: string; db_column?: string; question_code?: string }> = [];
    if (aliasOr) {
      const aliasRows = await admin
        .from(ALIAS_TABLE)
        .select("keyword, db_column, question_code")
        .or(aliasOr)
        .limit(200);
      if (!aliasRows.error) {
        aliasData = aliasRows.data || [];
      }
    }

    const aliasByKey = new Map<string, number>();
    for (const row of aliasData) {
      const key = String(row.db_column || row.question_code || "");
      if (!key) continue;
      aliasByKey.set(key, (aliasByKey.get(key) || 0) + 1);
    }

    const queryLower = q.toLowerCase();
    const wantsClimate = queryLower.includes("climate change") || queryLower.includes("global warming");

    const combined = (data || []).map((row) => {
      const aliasKey = String(row.db_column || row.question_code || "");
      const aliasHits = aliasByKey.get(aliasKey) || 0;
      const text = String(row.question_text || "");
      const header = String(row.source_header || "");
      const aliasBoost =
        wantsClimate &&
        (text.includes("[pipe: QCLIMATE_HIDDEN]") ||
          header.includes("[pipe: QCLIMATE_HIDDEN]") ||
          String(row.db_column || "").toLowerCase() === "qclimate_hidden")
          ? 6
          : 0;
      return {
        ...row,
        display_text: displayText(row),
        _score: scoreRow(row, tokens, aliasHits, aliasBoost),
      };
    });

    const filtered = combined
      .filter((row) => row._score > 0)
      .sort((a, b) => b._score - a._score)
      .slice(0, 60);

    if (filtered.length) {
      const groups = { questions: [] as any[], related: [] as any[], technical: [] as any[] };
      for (const row of filtered) {
        const bucket = classifyRow(row);
        groups[bucket].push(row);
      }
      return NextResponse.json({ groups });
    }

    const similarity = await admin.rpc("search_question_similarity", {
      q,
      limit_count: 10,
    });

    const suggestions = Array.from(
      new Set(
        tokens.flatMap((token) => [token, ...(TOPIC_SYNONYMS[token] || [])])
      )
    );

    if (similarity.error) {
      return NextResponse.json({ groups: { questions: [], related: [], technical: [] }, suggestions });
    }

    const fallbackRows = (similarity.data || []).map((row: any) => ({
      ...row,
      display_text: displayText(row),
    }));
    const groups = { questions: [] as any[], related: [] as any[], technical: [] as any[] };
    for (const row of fallbackRows) {
      const bucket = classifyRow(row);
      groups[bucket].push(row);
    }

    return NextResponse.json({ groups, suggestions });
  } catch (err: any) {
    const message = String(err?.message || "");
    if (message.includes("SUPABASE_URL") || message.includes("SUPABASE_SERVICE_ROLE_KEY")) {
      return NextResponse.json(
        { error: "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment." },
        { status: 500 }
      );
    }
    return NextResponse.json({ error: err.message || "Query failed" }, { status: 500 });
  }
}
