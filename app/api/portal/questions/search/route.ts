import { NextRequest, NextResponse } from "next/server";
import { getServerSupabase, getServiceSupabase } from "@/lib/supabase/server";

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
    const { data, error } = await admin
      .from("question_lookup")
      .select("db_column, question_text")
      .ilike("question_text", `%${q}%`)
      .limit(50);

    if (error) {
      return NextResponse.json({ error: "Query failed" }, { status: 500 });
    }

    return NextResponse.json({ data: data || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Query failed" }, { status: 500 });
  }
}
