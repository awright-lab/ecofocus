// app/reports/LeftFilterRail.tsx
"use client";

type Access = "All" | "Free" | "Premium";

export function LeftFilterRail({
  access,
  year,
  topic,
  type,
  setParam,
}: {
  access: Access;
  year: string;
  topic: string;
  type: string;
  setParam: (k: string, v?: string | number | null) => void;
}) {
  return (
    <div className="rounded-2xl bg-white p-5 sm:p-6 text-slate-700 border border-slate-200">
      <h3 className="text-sm font-semibold tracking-wide">Refine</h3>
      <div className="h-px w-full my-3 bg-slate-200" />

      {/* Access */}
      <div>
        <div className="text-xs font-medium mb-2">Access</div>
        <div className="inline-grid grid-cols-3 gap-1 rounded-lg p-1 border border-slate-200 bg-slate-50">
          {(["All", "Free", "Premium"] as Access[]).map((v) => {
            const active = access === v;
            return (
              <button
                key={v}
                onClick={() => setParam("access", v === "All" ? undefined : v.toLowerCase())}
                className={[
                  "px-3 py-1.5 rounded-md text-sm transition font-medium",
                  active ? "bg-emerald-700 text-white shadow" : "text-slate-700 hover:bg-slate-50",
                ].join(" ")}
                aria-pressed={active}
              >
                {v}
              </button>
            );
          })}
        </div>
      </div>

      {/* Year */}
      <div className="mt-6">
        <div className="text-xs font-medium mb-2">Year</div>
        <button
          onClick={() => setParam("year", undefined)}
          className={`text-sm ${year === "All" ? "font-semibold" : ""} hover:underline`}
        >
          All Years
        </button>
        <div className="mt-2 grid grid-cols-2 gap-1">
          {Array.from({ length: 9 }, (_, index) => String(new Date().getFullYear() - index)).map((y) => {
            const active = year === y;
            return (
              <button
                key={y}
                onClick={() => setParam("year", y)}
                className={[
                  "text-sm rounded-md px-2 py-1 text-left transition",
                  active ? "bg-emerald-50" : "hover:bg-slate-50",
                ].join(" ")}
                aria-pressed={active}
              >
                {y}
              </button>
            );
          })}
        </div>
      </div>

      {/* Topic */}
      <div className="mt-6">
        <div className="text-xs font-medium mb-2">Topic</div>
        <div className="flex flex-wrap gap-1">
          <Chip label="All" active={topic === "All"} onClick={() => setParam("topic", undefined)} />
          {[
            ["Consumer Insights", "consumer-insights"],
            ["Packaging & Claims", "packaging-claims"],
            ["Sustainability", "sustainability"],
            ["Retail", "retail"],
            ["Beverage", "beverage"],
            ["Food", "food"],
          ].map(([label, slug]) => (
            <Chip key={slug} label={label} active={topic === slug} onClick={() => setParam("topic", slug)} />
          ))}
        </div>
      </div>

      {/* Type */}
      <div className="mt-6">
        <div className="text-xs font-medium mb-2">Type</div>
        <div className="flex flex-wrap gap-1">
          <Chip label="All" active={type === "All"} onClick={() => setParam("type", undefined)} />
          {[
            ["Report", "report"],
            ["Brief", "brief"],
            ["Dataset", "dataset"],
          ].map(([label, slug]) => (
            <Chip key={slug} label={label} active={type === slug} onClick={() => setParam("type", slug)} />
          ))}
        </div>
      </div>

      {/* Reset */}
      <div className="mt-6">
        <button
          onClick={() => setParam("reset")}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 hover:bg-slate-50"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
}

function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "text-xs px-2 py-1 rounded-full border transition",
        active
          ? "bg-emerald-700 border-emerald-700 text-white font-semibold"
          : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-emerald-50",
      ].join(" ")}
      aria-pressed={!!active}
    >
      {label}
    </button>
  );
}




