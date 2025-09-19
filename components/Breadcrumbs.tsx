"use client";

import Link from "next/link";

type Crumb = { label: string; href?: string };

export type BreadcrumbsProps = {
  items: Crumb[];
  maxWidth?: string;
  /** "bar" = full-width light bar (default), "inline" = contained, no bg/border */
  variant?: "bar" | "inline";
};

export default function Breadcrumbs({
  items,
  maxWidth = "max-w-7xl",
  variant = "bar",
}: BreadcrumbsProps) {
  const outer =
    variant === "bar"
      ? "w-full py-4 bg-white border-b border-gray-100"
      : ""; // inline: no outer bar

  return (
    <nav
      aria-label="Breadcrumb"
      className={outer}
      itemScope
      itemType="https://schema.org/BreadcrumbList"
    >
      <ol
        className={`mx-auto ${maxWidth} px-4 sm:px-6 flex flex-wrap items-center gap-2 text-sm ${
          variant === "bar" ? "text-gray-600" : "text-gray-500"
        } ${variant === "inline" ? "py-3" : ""}`}
      >
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li
              key={`${item.label}-${idx}`}
              className="flex items-center gap-2"
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              {item.href && !isLast ? (
                <Link href={item.href} className="hover:text-gray-900" itemProp="item">
                  <span itemProp="name">{item.label}</span>
                </Link>
              ) : (
                <span
                  itemProp="name"
                  aria-current="page"
                  className="text-gray-900"
                >
                  {item.label}
                </span>
              )}
              <meta itemProp="position" content={String(idx + 1)} />
              {!isLast && <span className="text-gray-300">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

