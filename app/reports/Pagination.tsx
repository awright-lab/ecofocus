'use client';

export default function Pagination({
  currentPage,
  totalPages,
  onPrev,
  onNext,
  onGoTo,
}: {
  currentPage: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
  onGoTo?: (page: number) => void; // optional numbered nav
}) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav
      className="mt-[-12px] mb-10 flex items-center justify-center gap-2"
      role="navigation"
      aria-label="Small reports pagination"
    >
      <button
        onClick={onPrev}
        disabled={currentPage === 1}
        className="rounded-full border px-3 py-1.5 text-sm disabled:opacity-40"
        aria-label="Previous page"
      >
        Prev
      </button>

      {/* Optional numbered pages */}
      {onGoTo && totalPages <= 9 && (
        <ul className="flex items-center gap-1">
          {pages.map((p) => (
            <li key={p}>
              <button
                onClick={() => onGoTo(p)}
                className={`h-8 w-8 rounded-full text-sm font-medium ${
                  p === currentPage
                    ? 'bg-emerald-600 text-white'
                    : 'border hover:bg-gray-50'
                }`}
                aria-current={p === currentPage ? 'page' : undefined}
              >
                {p}
              </button>
            </li>
          ))}
        </ul>
      )}

      <button
        onClick={onNext}
        disabled={currentPage === totalPages}
        className="rounded-full border px-3 py-1.5 text-sm disabled:opacity-40"
        aria-label="Next page"
      >
        Next
      </button>
    </nav>
  );
}
