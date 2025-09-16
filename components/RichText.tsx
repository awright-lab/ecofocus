"use client";

import * as React from "react";
import { RichText, type JSXConvertersFunction } from "@payloadcms/richtext-lexical/react";
import ChartJSBlock from '@/components/blog/ChartJSBlock'

type Props = {
  /** Lexical JSON or JSON string */
  content: unknown;
  className?: string;
  /** Prefix relative upload URLs like /media/xyz.jpg */
  baseURL?: string;
  debug?: boolean;
};

function safeParseMaybeJSON(value: unknown) {
  if (typeof value === "string") {
    try { return JSON.parse(value); } catch { return value; }
  }
  return value;
}

function prefixUploadURLs(node: any, baseURL?: string) {
  if (!node || !baseURL) return node;
  const walk = (n: any): any => {
    if (Array.isArray(n)) return n.map(walk);
    if (n && typeof n === "object") {
      const clone: any = { ...n };
      if (clone?.type === "upload" && clone?.value) {
        if (typeof clone.value.url === "string" && clone.value.url.startsWith("/")) {
          clone.value.url = `${baseURL}${clone.value.url}`;
        }
        if (typeof clone.value.filename === "string" && clone.value.filename.startsWith("/")) {
          clone.value.filename = `${baseURL}${clone.value.filename}`;
        }
      }
      for (const k of Object.keys(clone)) clone[k] = walk(clone[k]);
      return clone;
    }
    return n;
  };
  return walk(node);
}

function isEmptyLexicalDoc(doc: any): boolean {
  const root = doc?.root;
  const children = Array.isArray(root?.children) ? root.children : [];
  return children.length === 0 || children.every((c: any) => c?.type === "paragraph" && (!c.children || c.children.length === 0));
}

export default function RichTextRenderer({ content, className, baseURL, debug = false }: Props) {
  const parsed = React.useMemo(() => safeParseMaybeJSON(content), [content]);
  const normalized = React.useMemo(() => prefixUploadURLs(parsed, baseURL), [parsed, baseURL]);

  if (!normalized || isEmptyLexicalDoc(normalized)) {
    return debug ? <div className={className}><p className="text-sm text-gray-500 italic">No rich text content.</p></div> : null;
  }

  const converters: JSXConvertersFunction = ({ defaultConverters }) => ({
    ...defaultConverters,
    // Render Payload "blocks" embedded in Lexical as Chart.js where applicable
    blocks: {
      chartJS: ({ node }) => {
        const f: any = (node as any)?.fields || {};
        const chartType = f.chartType || f.type || f?.config?.type || f?.chart?.type;
        const data = f.data || f.chartData || f.dataset || f?.config?.data || f?.chart?.data;
        const options = f.options || f.chartOptions || f?.config?.options || f?.chart?.options;
        const height = f.height || f.size?.height;
        const caption = f.caption || f.title || f.note;
        if (!data || !chartType) return null;
        return (
          <ChartJSBlock
            chartType={chartType}
            data={data}
            options={options}
            height={height}
            caption={caption}
          />
        );
      },
      // Some configs might use a different block slug
      chart: ({ node }) => {
        const f: any = (node as any)?.fields || {};
        const chartType = f.chartType || f.type || f?.config?.type || f?.chart?.type;
        const data = f.data || f.chartData || f.dataset || f?.config?.data || f?.chart?.data;
        const options = f.options || f.chartOptions || f?.config?.options || f?.chart?.options;
        const height = f.height || f.size?.height;
        const caption = f.caption || f.title || f.note;
        if (!data || !chartType) return null;
        return (
          <ChartJSBlock
            chartType={chartType}
            data={data}
            options={options}
            height={height}
            caption={caption}
          />
        );
      },
    },
    inlineBlocks: {
      chartJS: ({ node }) => {
        const f: any = (node as any)?.fields || {};
        const chartType = f.chartType || f.type || f?.config?.type || f?.chart?.type;
        const data = f.data || f.chartData || f.dataset || f?.config?.data || f?.chart?.data;
        const options = f.options || f.chartOptions || f?.config?.options || f?.chart?.options;
        const height = f.height || f.size?.height;
        const caption = f.caption || f.title || f.note;
        if (!data || !chartType) return null;
        return (
          <ChartJSBlock
            chartType={chartType}
            data={data}
            options={options}
            height={height}
            caption={caption}
          />
        );
      },
      chart: ({ node }) => {
        const f: any = (node as any)?.fields || {};
        const chartType = f.chartType || f.type || f?.config?.type || f?.chart?.type;
        const data = f.data || f.chartData || f.dataset || f?.config?.data || f?.chart?.data;
        const options = f.options || f.chartOptions || f?.config?.options || f?.chart?.options;
        const height = f.height || f.size?.height;
        const caption = f.caption || f.title || f.note;
        if (!data || !chartType) return null;
        return (
          <ChartJSBlock
            chartType={chartType}
            data={data}
            options={options}
            height={height}
            caption={caption}
          />
        );
      },
    },
    // Fallback for unknown nodes: handle block nodes dynamically
    unknown: ({ node }) => {
      try {
        const t = (node as any)?.type;
        if (t === 'block' || t === 'inlineBlock') {
          const f: any = (node as any)?.fields || {};
          const bt = String(f.blockType || '').toLowerCase();
          if (bt === 'chartjs' || bt === 'chart') {
            const chartType = f.chartType || f.type || f?.config?.type || f?.chart?.type;
            const data = f.data || f.chartData || f.dataset || f?.config?.data || f?.chart?.data;
            const options = f.options || f.chartOptions || f?.config?.options || f?.chart?.options;
            const height = f.height || f.size?.height;
            const caption = f.caption || f.title || f.note;
            if (!data || !chartType) return null;
            return (
              <ChartJSBlock
                chartType={chartType}
                data={data}
                options={options}
                height={height}
                caption={caption}
              />
            );
          }
        }
      } catch {}
      return null;
    },
  });

  return (
    <div className={className}>
      <RichText data={normalized as any} converters={converters} />
    </div>
  );
}
