export default function PortalDashboardPage() {
  const blocks = [
    { title: "Saved Views", body: "Coming soon: saved filters and cross-tabs you pinned." },
    { title: "Recent Crosstabs", body: "Your last runs will show here for quick reopen." },
    { title: "Segments", body: "Reusable filters/segments for consistent cuts." },
  ];

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">Workspace</p>
        <h2 className="text-2xl font-semibold text-gray-900">Dashboard</h2>
        <p className="text-sm text-gray-600">A quick snapshot of what you’ve been working on.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {blocks.map((block) => (
          <div key={block.title} className="rounded-xl border border-dashed border-gray-200 bg-gray-50/60 p-4">
            <h3 className="text-sm font-semibold text-gray-900">{block.title}</h3>
            <p className="mt-1 text-sm text-gray-600">{block.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
