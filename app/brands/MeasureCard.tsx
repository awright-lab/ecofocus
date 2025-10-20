import clsx from "clsx";

type Tone = "teal" | "slate" | "amber";
type IconKind = "dots" | "checklist" | "gauge";

export function MeasureCard({
  tone,
  title,
  desc,
  icon,
}: {
  tone: Tone;
  title: string;
  desc: string;
  icon: IconKind;
}) {
  const toneClasses =
    tone === "teal"
      ? "bg-teal-600 text-white ring-1 ring-teal-500/20"
      : tone === "amber"
      ? "bg-amber-400 text-slate-900 ring-1 ring-amber-300/40"
      : "bg-slate-900 text-white ring-1 ring-slate-800/40";

  return (
    <div
      className={clsx(
        "relative overflow-hidden rounded-2xl p-6 shadow-[0_14px_48px_-18px_rgba(2,12,27,.22)] transition will-change-transform",
        "hover:-translate-y-0.5 hover:shadow-[0_22px_72px_-22px_rgba(2,12,27,.28)]",
        toneClasses
      )}
    >
      {/* sheen */}
      <span
        aria-hidden
        className="pointer-events-none absolute -left-1/3 top-0 h-full w-1/2 skew-x-[-20deg] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,.18),transparent)] opacity-0 transition-opacity duration-500 hover:opacity-100 motion-reduce:hidden"
      />
      <div className="relative flex items-start gap-3">
        <span className="mt-0.5">{renderIcon(icon)}</span>
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="mt-2 text-sm/6 opacity-90">{desc}</p>
        </div>
      </div>
    </div>
  );
}

function renderIcon(kind: IconKind) {
  if (kind === "dots") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 opacity-90" fill="currentColor">
        <path d="M6 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm8 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm8 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM6 14a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm8 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm8 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM6 22a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm8 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm8 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z" />
      </svg>
    );
  }
  if (kind === "checklist") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 opacity-90" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 6h10M4 12h10M4 18h10" />
        <path d="m17 6 2 2 4-4M17 12l2 2 4-4M17 18l2 2 4-4" />
      </svg>
    );
  }
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 opacity-90" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 21a9 9 0 1 1 9-9" />
      <path d="M12 12l7-4" />
    </svg>
  );
}

