import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase, getServiceSupabase } from "@/lib/supabase/server";

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
const QUESTION_LOOKUP_TABLE = "responses_2025_question_lookup";

function isMissingRelationError(error: any) {
  const message = String(error?.message || "");
  return message.includes("does not exist") && message.includes("relation");
}

function isMissingColumnError(error: any, column: string) {
  const message = String(error?.message || "");
  return message.includes(`column "${column}"`) && message.includes("does not exist");
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
  const { data, error } = await admin.from(QUESTION_LOOKUP_TABLE).select("db_column").limit(1000);
  if (error) {
    if (isMissingRelationError(error)) {
      throw new Error("Missing table/view: responses_2025_question_lookup");
    }
    throw new Error(error.message || "Failed to load allowlist");
  }
  return new Set((data || []).map((row) => String(row.db_column || "").toLowerCase()));
}

async function queryValuesFromView(
  admin: ReturnType<typeof getServiceSupabase>,
  column: string
) {
  const { data, error } = await admin.from("responses_2025_all").select(column).limit(MAX_ROWS);
  if (error) {
    if (isMissingRelationError(error)) return { kind: "missing_view" as const };
    if (isMissingColumnError(error, column)) {
      throw new Error(`Invalid column: ${column}`);
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
  column: string
) {
  for (const table of FALLBACK_TABLES) {
    const { error } = await admin.from(table).select(`uuid, ${column}`).limit(1);
    if (!error) return table;
    if (isMissingRelationError(error)) {
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

export async function GET(req: NextRequest) {
  const session = await assertAuthed();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const column = (req.nextUrl.searchParams.get("var") || "").trim();
  const columnNormalized = column.toLowerCase();
  if (!columnNormalized) {
    return NextResponse.json({ error: "var is required" }, { status: 400 });
  }

  try {
    const admin = getServiceSupabase();
    const allowlist = await loadAllowlist(admin);
    if (!allowlist.has(columnNormalized)) {
      return NextResponse.json({ error: `Invalid column: ${column}` }, { status: 400 });
    }

    const values = new Set<string>();
    const viewResult = await queryValuesFromView(admin, columnNormalized);
    if (viewResult.kind === "ok") {
      for (const row of viewResult.data as Array<Record<string, any>>) {
        const value = row[columnNormalized];
        if (value == null || value === "") continue;
        values.add(String(value));
      }
    } else {
      const table = await findTableForColumn(admin, columnNormalized);
      if (!table) {
        throw new Error(`Invalid column: ${column}. Not found in responses_2025_all or fallback tables.`);
      }

      const uuids = await fetchUuids(admin);
      for (const chunk of chunkArray(uuids, UUID_CHUNK)) {
        const { data, error } = await admin
          .from(table)
          .select(`uuid, ${columnNormalized}`)
          .in("uuid", chunk);
        if (error) {
          if (isMissingRelationError(error)) {
            throw new Error(`Missing table/view: ${table}`);
          }
          throw new Error(error.message || `Failed loading ${table}`);
        }
        for (const row of data || []) {
          const value = (row as any)[columnNormalized];
          if (value == null || value === "") continue;
          values.add(String(value));
        }
      }
    }

    return NextResponse.json({ values: Array.from(values).sort() });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to load values" }, { status: 500 });
  }
}
