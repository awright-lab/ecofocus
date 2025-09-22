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
    <div className="rounded-2xl section-slab-emerald p-5 sm:p-6 text-white border border-emerald-700/40">
      <h3 className="text-sm font-semibold tracking-wide">Refine</h3>
      <div className="h-px w-full my-3 bg-white/20" />

      {/* Access */}
      <div>
        <div className="text-xs font-medium mb-2">Access</div>
        <div className="inline-grid grid-cols-3 gap-1 rounded-lg p-1 border border-white/25 bg-white/10">
          {(["All", "Free", "Premium"] as Access[]).map((v) => {
            const active = access === v;
            return (
              <button
                key={v}
                onClick={() => setParam("access", v === "All" ? undefined : v.toLowerCase())}
                className={[
                  "px-3 py-1.5 rounded-md text-sm transition font-medium",
                  active ? "bg-white text-emerald-900 shadow" : "text-white hover:bg-white/10",
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
          {["2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018"].map((y) => {
            const active = year === y;
            return (
              <button
                key={y}
                onClick={() => setParam("year", y)}
                className={[
                  "text-sm rounded-md px-2 py-1 text-left transition",
                  active ? "bg-white/15" : "hover:bg-white/10",
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
            ["Syndicated", "syndicated"],
            ["Data Integration", "data-integration"],
            ["Custom", "custom"],
            ["Brief", "brief"],
            ["White Paper", "white-paper"],
          ].map(([label, slug]) => (
            <Chip key={slug} label={label} active={type === slug} onClick={() => setParam("type", slug)} />
          ))}
        </div>
      </div>

      {/* Reset */}
      <div className="mt-6">
        <button
          onClick={() => {
            setParam("access", undefined);
            setParam("year", undefined);
            setParam("topic", undefined);
            setParam("type", undefined);
            setParam("q", undefined);
            setParam("sort", "Newest");
          }}
          className="w-full rounded-lg border border-white/25 px-3 py-2 hover:bg-white/10"
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
          ? "bg-amber-300 border-amber-300 text-emerald-900 font-semibold"
          : "bg-white/10 border-white/20 text-white hover:bg-white/15",
      ].join(" ")}
      aria-pressed={!!active}
    >
      {label}
    </button>
  );
}




