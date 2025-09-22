"use client";

import { YEARS, TOPIC_MAP, TYPE_MAP } from "./filter.constants";
import type { Access } from "./useReportSearchParams";

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
    <div className="rounded-2xl bg-emerald-50/60 ring-1 ring-emerald-100 p-4 space-y-6">
      <h3 className="text-sm font-semibold tracking-wide text-emerald-900">Refine</h3>
      <hr className="border-marigold-300" />

      {/* Access segmented */}
      <div>
        <div className="text-xs font-medium text-emerald-800 mb-2">Access</div>
        <div className="inline-grid grid-cols-3 gap-1 bg-white rounded-lg p-1 ring-1 ring-emerald-200">
          {(["All", "Free", "Premium"] as Access[]).map((v) => (
            <button
              key={v}
              onClick={() => setParam("access", v === "All" ? undefined : v.toLowerCase())}
              className={[
                "px-3 py-1.5 rounded-md text-sm transition",
                access === v ? "bg-emerald-600 text-white" : "text-emerald-800 hover:bg-emerald-50",
              ].join(" ")}
              aria-pressed={access === v}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Year */}
      <div>
        <div className="text-xs font-medium text-emerald-800 mb-2">Year</div>
        <div className="space-y-2">
          <button
            onClick={() => setParam("year", undefined)}
            className={`text-sm ${year === "All" ? "text-emerald-900 font-semibold" : "text-emerald-800"} hover:underline`}
          >
            All Years
          </button>
          <div className="grid grid-cols-2 gap-1">
            {YEARS.map((y) => (
              <button
                key={y}
                onClick={() => setParam("year", y)}
                className={[
                  "text-sm rounded-md px-2 py-1 text-left",
                  year === String(y) ? "bg-emerald-100 text-emerald-900" : "hover:bg-emerald-50 text-emerald-800",
                ].join(" ")}
                aria-pressed={year === String(y)}
              >
                {y}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Topic */}
      <div>
        <div className="text-xs font-medium text-emerald-800 mb-2">Topic</div>
        <div className="flex flex-wrap gap-1">
          <Chip label="All" active={topic === "All"} onClick={() => setParam("topic", undefined)} />
          {Object.entries(TOPIC_MAP).map(([label, slug]) => (
            <Chip key={slug} label={label} active={topic === slug} onClick={() => setParam("topic", slug)} />
          ))}
        </div>
      </div>

      {/* Type */}
      <div>
        <div className="text-xs font-medium text-emerald-800 mb-2">Type</div>
        <div className="flex flex-wrap gap-1">
          <Chip label="All" active={type === "All"} onClick={() => setParam("type", undefined)} />
          {Object.entries(TYPE_MAP).map(([label, slug]) => (
            <Chip key={slug} label={label} active={type === slug} onClick={() => setParam("type", slug)} />
          ))}
        </div>
      </div>

      {/* Reset */}
      <div>
        <button
          onClick={() => {
            setParam("access", undefined);
            setParam("year", undefined);
            setParam("topic", undefined);
            setParam("type", undefined);
            setParam("q", undefined);
            setParam("sort", "Newest");
          }}
          className="w-full rounded-lg border border-emerald-200 px-3 py-2 text-emerald-900 hover:bg-emerald-50"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
}

function Chip({ label, active, onClick }: { label: string; active?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={[
        "text-xs px-2 py-1 rounded-full ring-1 transition",
        active ? "bg-marigold-100 ring-marigold-300 text-marigold-900" : "bg-emerald-50 ring-emerald-100 text-emerald-800 hover:bg-emerald-100",
      ].join(" ")}
      aria-pressed={!!active}
    >
      {label}
    </button>
  );
}
