import CrosstabClient from "./crosstab-client";
import { getServiceSupabase } from "@/lib/supabase/server";

async function getQuestionOptions() {
  try {
    const supabase = getServiceSupabase();
    const { data } = await supabase
      .from("question_lookup")
      .select("db_column, question_text")
      .order("db_column", { ascending: true })
      .limit(300);
    return data || [];
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
