import CrosstabClient from "./crosstab-client";
import { getServiceSupabase } from "@/lib/supabase/server";

async function getQuestionOptions() {
  try {
    const supabase = getServiceSupabase();
    const { data, error } = await supabase
      .from("responses_2025_question_lookup")
      .select("db_column, question_text, topic")
      .order("db_column", { ascending: true })
      .limit(300);
    if (error) {
      const message = String(error.message || "");
      if (message.includes('column "topic"') && message.includes("does not exist")) {
        const fallback = await supabase
          .from("responses_2025_question_lookup")
          .select("db_column, question_text")
          .order("db_column", { ascending: true })
          .limit(300);
        return (fallback.data || []).filter(
          (row) => row && typeof row.db_column === "string" && row.db_column.trim()
        );
      }
      return [];
    }
    return (data || []).filter(
      (row) => row && typeof row.db_column === "string" && row.db_column.trim()
    );
  } catch {
    return [];
  }
}

export default async function CrosstabsPage() {
  const questions = await getQuestionOptions();

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">Analyze</p>
          <h2 className="text-2xl font-semibold text-gray-900">Crosstabs</h2>
          <p className="text-sm text-gray-600">
            Pick row and column variables. We’ll return counts and percentages.
          </p>
        </div>
      </div>

      <CrosstabClient questions={questions} />
    </div>
  );
}
