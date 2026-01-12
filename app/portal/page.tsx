import Link from "next/link";

export default function PortalHomePage() {
  const links = [
    { href: "/portal/dashboard", title: "Dashboard", desc: "Saved views, recent crosstabs, segments." },
    { href: "/portal/questions", title: "Question Explorer", desc: "Search question text and variable names." },
    { href: "/portal/crosstabs", title: "Crosstabs", desc: "Pick row/column variables and get counts & percents." },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">Private</p>
          <h2 className="text-2xl font-semibold text-gray-900">EcoFocus Portal</h2>
          <p className="text-sm text-gray-600">
            Secure access to survey questions and quick crosstab reads.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {links.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-xl border border-gray-200 bg-gray-50 p-4 transition hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-emerald-50/60"
          >
            <h3 className="text-sm font-semibold text-gray-900">{item.title}</h3>
            <p className="mt-1 text-sm text-gray-600">{item.desc}</p>
            <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-emerald-700">
              Open <span aria-hidden>→</span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
