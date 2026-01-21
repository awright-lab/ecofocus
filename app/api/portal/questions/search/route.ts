import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase, getServiceSupabase } from "@/lib/supabase/server";

function isMissingColumnError(error: any, column: string) {
  const message = String(error?.message || "");
  return message.includes(`column "${column}"`) && message.includes("does not exist");
}

async function pickQuestionLookupTable(admin: ReturnType<typeof getServiceSupabase>) {
  const { error } = await admin.from("responses_2025_question_lookup").select("db_column").limit(1);
  if (!error) return "responses_2025_question_lookup";
  throw new Error("Missing table/view: responses_2025_question_lookup");
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

  try {
    const admin = getServiceSupabase();
    const searchFilter = `question_text.ilike.%${q}%,db_column.ilike.%${q}%`;
    const table = await pickQuestionLookupTable(admin);

    const { data, error } = await admin
      .from(table)
      .select("db_column, question_text, topic")
      .or(searchFilter)
      .limit(50);

    if (error && isMissingColumnError(error, "topic")) {
      const retry = await admin
        .from(table)
        .select("db_column, question_text")
        .or(searchFilter)
        .limit(50);
      if (retry.error) {
        return NextResponse.json({ error: retry.error.message || "Query failed" }, { status: 500 });
      }
      return NextResponse.json({ data: retry.data || [] });
    }

    if (error) {
      return NextResponse.json({ error: error.message || "Query failed" }, { status: 500 });
    }

    return NextResponse.json({ data: data || [] });
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
