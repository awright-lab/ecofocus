import QuestionSearch from "./question-search";

export default function QuestionsPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">Explore</p>
          <h2 className="text-2xl font-semibold text-gray-900">Question Explorer</h2>
          <p className="text-sm text-gray-600">
            Search by prompt text or variable to find the fields you need.
          </p>
        </div>
      </div>

      <QuestionSearch />
    </div>
  );
}
