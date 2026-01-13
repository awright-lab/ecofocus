import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase, getServiceSupabase } from "@/lib/supabase/server";

function isMissingRelationError(error: any) {
  const message = String(error?.message || "");
  return message.includes("does not exist") && message.includes("relation");
}

function isMissingColumnError(error: any, column: string) {
  const message = String(error?.message || "");
  return message.includes(`column "${column}"`) && message.includes("does not exist");
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

    const { data, error } = await admin
      .from("question_lookup")
      .select("db_column, question_text, topic")
      .or(searchFilter)
      .limit(50);

    if (error && isMissingColumnError(error, "topic")) {
      const retry = await admin
        .from("question_lookup")
        .select("db_column, question_text")
        .or(searchFilter)
        .limit(50);
      if (retry.error) {
        if (isMissingRelationError(retry.error)) {
          return NextResponse.json({ error: "Missing table/view: question_lookup" }, { status: 500 });
        }
        return NextResponse.json({ error: retry.error.message || "Query failed" }, { status: 500 });
      }
      return NextResponse.json({ data: retry.data || [] });
    }

    if (error) {
      if (isMissingRelationError(error)) {
        return NextResponse.json({ error: "Missing table/view: question_lookup" }, { status: 500 });
      }
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
