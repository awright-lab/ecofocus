import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase, getServiceSupabase } from "@/lib/supabase/server";

type CrosstabBody = {
  rowVar?: string;
  colVar?: string;
  filters?: Record<string, string | number | Array<string | number>>;
};

async function assertAuthed() {
  const supabase = await getServerSupabase();
  const { data, error } = await supabase.auth.getSession();
  if (error || !data?.session) {
    return null;
  }
  return data.session;
}

async function loadAllowlist(admin: ReturnType<typeof getServiceSupabase>) {
  const { data, error } = await admin.from("question_lookup").select("db_column").limit(500);
  if (error || !data) throw new Error("Failed to load allowlist");
  return new Set(data.map((row) => row.db_column));
}

async function pickTable(admin: ReturnType<typeof getServiceSupabase>) {
  const candidates = ["responses_2025_all", "responses_2025_core"];
  for (const table of candidates) {
    const { error } = await admin.from(table).select("uuid").limit(1);
    if (!error) return table;
  }
  throw new Error("No responses table available");
}

export async function POST(req: NextRequest) {
  const session = await assertAuthed();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: CrosstabBody;
  try {
    body = (await req.json()) as CrosstabBody;
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const rowVar = body.rowVar?.trim();
  const colVar = body.colVar?.trim();
  if (!rowVar || !colVar) {
    return NextResponse.json({ error: "rowVar and colVar are required" }, { status: 400 });
  }

  try {
    const admin = getServiceSupabase();
    const allowlist = await loadAllowlist(admin);

    if (!allowlist.has(rowVar) || !allowlist.has(colVar)) {
      return NextResponse.json({ error: "Invalid variable selection" }, { status: 400 });
    }

    const table = await pickTable(admin);
    let query = admin.from(table).select(`${rowVar}, ${colVar}`).limit(5000);

    if (body.filters) {
      for (const [field, value] of Object.entries(body.filters)) {
        if (!allowlist.has(field)) continue;
        if (Array.isArray(value)) {
          query = query.in(field, value);
        } else {
          query = query.eq(field, value);
        }
      }
    }

    const { data, error } = await query;
    if (error) {
      return NextResponse.json({ error: "Query failed" }, { status: 500 });
    }

    const tableMap = new Map<string, number>();
    const rowTotals: Record<string, number> = {};
    const colTotals: Record<string, number> = {};
    let overall = 0;

    for (const row of data || []) {
      const r = (row as any)[rowVar];
      const c = (row as any)[colVar];
      if (r == null || c == null) continue;
      const key = `${r}|||${c}`;
      tableMap.set(key, (tableMap.get(key) || 0) + 1);
      rowTotals[r] = (rowTotals[r] || 0) + 1;
      colTotals[c] = (colTotals[c] || 0) + 1;
      overall += 1;
    }

    const cells = Array.from(tableMap.entries()).map(([key, count]) => {
      const [r, c] = key.split("|||");
      const rowTotal = rowTotals[r] || 1;
      const colTotal = colTotals[c] || 1;
      return {
        row: r,
        col: c,
        count,
        rowPct: count / rowTotal,
        colPct: count / colTotal,
        totalPct: overall ? count / overall : 0,
      };
    });

    return NextResponse.json({
      rowVar,
      colVar,
      cells,
      totals: { overall, rowTotals, colTotals },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Unexpected error" }, { status: 500 });
  }
}
