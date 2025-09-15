"use client";

import * as React from "react";
import { RichText } from "@payloadcms/richtext-lexical/react";

type Props = {
  /** Payload Lexical JSON from a richText field (e.g., post.body) */
  content: unknown;
  className?: string;
};

export default function RichTextRenderer({ content, className }: Props) {
  return (
    <div className={className}>
      {/* @payloadcms/richtext-lexical expects the raw JSON via `data` */}
      <RichText data={content as any} />
    </div>
  );
}
