'use client';

import { useId, useState } from 'react';

type AccordionItem = {
  id: string;
  title: string;
  content: React.ReactNode;
};

type AccordionProps = {
  items: AccordionItem[];
  allowMultiple?: boolean;
  defaultOpenIds?: string[];
};

export default function Accordion({
  items,
  allowMultiple = false,
  defaultOpenIds = [],
}: AccordionProps) {
  const [openIds, setOpenIds] = useState<string[]>(defaultOpenIds);
  const accordionId = useId();

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      const isOpen = prev.includes(id);
      if (isOpen) return prev.filter((item) => item !== id);
      if (allowMultiple) return [...prev, id];
      return [id];
    });
  };

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);
        const panelId = `${accordionId}-${item.id}-panel`;
        const buttonId = `${accordionId}-${item.id}-button`;

        return (
          <div
            key={item.id}
            className="rounded-xl border border-emerald-100 bg-white shadow-sm"
          >
            <h3>
              <button
                id={buttonId}
                type="button"
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
              >
                <span className="text-base font-semibold text-gray-900">{item.title}</span>
                <span
                  className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-emerald-300 text-emerald-700"
                  aria-hidden="true"
                >
                  {isOpen ? '−' : '+'}
                </span>
              </button>
            </h3>

            {isOpen ? (
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                className="border-t border-emerald-100 px-5 py-4"
              >
                {item.content}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
