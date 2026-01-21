import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase, getServiceSupabase } from "@/lib/supabase/server";

type CrosstabBody = {
  rowVar?: string;
  colVar?: string;
  filters?: Record<string, string | number | Array<string | number>>;
};

const FALLBACK_TABLES = [
  "responses_2025_core",
  "responses_2025_p01",
  "responses_2025_p02",
  "responses_2025_p03",
  "responses_2025_p04",
  "responses_2025_p05",
  "responses_2025_p06",
];

const MAX_ROWS = 5000;
const UUID_CHUNK = 500;
const QUESTION_LOOKUP_TABLES = ["responses_2025_question_lookup"];

function isMissingRelationError(error: any) {
  const message = String(error?.message || "");
  return message.includes("does not exist") && message.includes("relation");
}

function isMissingColumnError(error: any, column: string) {
  const message = String(error?.message || "");
  return message.includes(`column "${column}"`) && message.includes("does not exist");
}

function formatEnvError(message: string) {
  if (message.includes("SUPABASE_URL") || message.includes("SUPABASE_SERVICE_ROLE_KEY")) {
    return "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment.";
  }
  return message;
}

async function assertAuthed() {
  const supabase = await getServerSupabase();
  const { data, error } = await supabase.auth.getSession();
  if (error || !data?.session) {
    return null;
  }
  return data.session;
}

async function loadAllowlist(admin: ReturnType<typeof getServiceSupabase>) {
  const table = QUESTION_LOOKUP_TABLES[0];
  const { data, error } = await admin.from(table).select("db_column").limit(1000);
  if (error) {
    if (isMissingRelationError(error)) {
      throw new Error("Missing table/view: responses_2025_question_lookup");
    }
    throw new Error(error.message || "Failed to load allowlist");
  }
  return new Set((data || []).map((row) => row.db_column));
}

function validateFilters(
  filters: CrosstabBody["filters"],
  allowlist: Set<string>
): string | null {
  if (!filters) return null;
  for (const field of Object.keys(filters)) {
    if (!allowlist.has(field)) {
      return `Invalid column: ${field}`;
    }
  }
  return null;
}

function applyFiltersToQuery(query: any, filters: CrosstabBody["filters"]) {
  if (!filters) return query;
  let next = query;
  for (const [field, value] of Object.entries(filters)) {
    if (Array.isArray(value)) {
      next = next.in(field, value);
    } else {
      next = next.eq(field, value);
    }
  }
  return next;
}

async function queryFromView(
  admin: ReturnType<typeof getServiceSupabase>,
  rowVar: string,
  colVar: string,
  filters: CrosstabBody["filters"]
) {
  const query = applyFiltersToQuery(
    admin.from("responses_2025_all").select(`${rowVar}, ${colVar}`).limit(MAX_ROWS),
    filters
  );
  const { data, error } = await query;
  if (error) {
    if (isMissingRelationError(error)) {
      return { kind: "missing_view" as const };
    }
    if (isMissingColumnError(error, rowVar) || isMissingColumnError(error, colVar)) {
      throw new Error(`Invalid column: ${isMissingColumnError(error, rowVar) ? rowVar : colVar}`);
    }
    throw new Error(error.message || "Query failed");
  }
  return { kind: "ok" as const, data: data || [] };
}

async function fetchUuids(admin: ReturnType<typeof getServiceSupabase>) {
  const { data, error } = await admin.from("responses_2025_core").select("uuid").limit(MAX_ROWS);
  if (error) {
    if (isMissingRelationError(error)) {
      throw new Error(
        "Missing table/view: responses_2025_core. Create responses_2025_all or ensure core+p01..p06 exist."
      );
    }
    throw new Error(error.message || "Failed to load core UUIDs");
  }
  return (data || []).map((row) => (row as any).uuid).filter(Boolean);
}

async function findTableForColumn(
  admin: ReturnType<typeof getServiceSupabase>,
  column: string,
  missingTables: Set<string>
) {
  for (const table of FALLBACK_TABLES) {
    const { error } = await admin.from(table).select(`uuid, ${column}`).limit(1);
    if (!error) return table;
    if (isMissingRelationError(error)) {
      missingTables.add(table);
      continue;
    }
    if (isMissingColumnError(error, column)) {
      continue;
    }
    throw new Error(error.message || `Failed checking column ${column} in ${table}`);
  }
  return null;
}

function chunkArray<T>(items: T[], size: number) {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}

async function loadFallbackData(
  admin: ReturnType<typeof getServiceSupabase>,
  columns: string[],
  uuids: string[]
) {
  const missingTables = new Set<string>();
  const tableByColumn = new Map<string, string>();

  for (const column of columns) {
    const table = await findTableForColumn(admin, column, missingTables);
    if (!table) {
      const missing = missingTables.size ? ` Missing tables: ${Array.from(missingTables).join(", ")}.` : "";
      throw new Error(`Invalid column: ${column}. Not found in responses_2025_all or fallback tables.${missing}`);
    }
    tableByColumn.set(column, table);
  }

  const columnsByTable = new Map<string, string[]>();
  for (const [column, table] of tableByColumn.entries()) {
    const list = columnsByTable.get(table) || [];
    if (!list.includes(column)) list.push(column);
    columnsByTable.set(table, list);
  }

  const records: Record<string, Record<string, any>> = {};
  for (const uuid of uuids) {
    records[uuid] = { uuid };
  }

  for (const [table, tableColumns] of columnsByTable.entries()) {
    for (const chunk of chunkArray(uuids, UUID_CHUNK)) {
      const { data, error } = await admin
        .from(table)
        .select(`uuid, ${tableColumns.join(", ")}`)
        .in("uuid", chunk);
      if (error) {
        if (isMissingRelationError(error)) {
          throw new Error(`Missing table/view: ${table}`);
        }
        throw new Error(error.message || `Failed loading ${table}`);
      }
      for (const row of data || []) {
        const uuid = (row as any).uuid;
        if (!uuid) continue;
        if (!records[uuid]) records[uuid] = { uuid };
        for (const column of tableColumns) {
          records[uuid][column] = (row as any)[column];
        }
      }
    }
  }

  return records;
}

function applyFilterMatch(
  record: Record<string, any>,
  filters: CrosstabBody["filters"]
) {
  if (!filters) return true;
  for (const [field, value] of Object.entries(filters)) {
    const current = record[field];
    if (Array.isArray(value)) {
      if (!value.includes(current)) return false;
    } else if (current !== value) {
      return false;
    }
  }
  return true;
}

function calcColumnSig(
  count: number,
  colTotal: number,
  rowTotal: number,
  overall: number
) {
  if (!overall || !colTotal) return null;
  const pOverall = rowTotal / overall;
  const pCol = count / colTotal;
  const variance = pOverall * (1 - pOverall) / colTotal;
  if (variance <= 0) return null;
  const z = (pCol - pOverall) / Math.sqrt(variance);
  if (Math.abs(z) < 1.96) return null;
  return z > 0 ? "up" : "down";
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
      const missing = !allowlist.has(rowVar) ? rowVar : colVar;
      return NextResponse.json({ error: `Invalid column: ${missing}` }, { status: 400 });
    }

    const invalidFilter = validateFilters(body.filters, allowlist);
    if (invalidFilter) {
      return NextResponse.json({ error: invalidFilter }, { status: 400 });
    }

    const viewResult = await queryFromView(admin, rowVar, colVar, body.filters);
    let rows: Array<Record<string, any>> = [];

    if (viewResult.kind === "ok") {
      rows = viewResult.data as Array<Record<string, any>>;
    } else {
      const uuids = await fetchUuids(admin);
      if (!uuids.length) {
        return NextResponse.json({
          rowVar,
          colVar,
          cells: [],
          totals: { overall: 0, rowTotals: {}, colTotals: {} },
        });
      }

      const filterFields = body.filters ? Object.keys(body.filters) : [];
      const columns = Array.from(new Set([rowVar, colVar, ...filterFields]));
      const records = await loadFallbackData(admin, columns, uuids);

      rows = uuids
        .map((uuid) => records[uuid])
        .filter(Boolean)
        .filter((record) => applyFilterMatch(record, body.filters))
        .map((record) => ({
          [rowVar]: record[rowVar],
          [colVar]: record[colVar],
        }));
    }

    const tableMap = new Map<string, number>();
    const rowTotals: Record<string, number> = {};
    const colTotals: Record<string, number> = {};
    let overall = 0;

    for (const row of rows || []) {
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
        sig: calcColumnSig(count, colTotal, rowTotals[r] || 0, overall),
      };
    });

    return NextResponse.json({
      rowVar,
      colVar,
      cells,
      totals: { overall, rowTotals, colTotals },
    });
  } catch (err: any) {
    const message = formatEnvError(String(err?.message || "Unexpected error"));
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
