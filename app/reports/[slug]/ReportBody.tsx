import Link from "next/link";
import { parseReportBody } from "@/lib/report-body";

function InlineText({ text }: { text: string }) {
  // Only same-site links are supported. Never render CMS HTML or arbitrary URLs.
  return text.split(/(\[[^\]\n]+\]\(\/(?!\/)[a-zA-Z0-9/_#?=&%-]*\))/g).map((part, index) => {
    const link = /^\[([^\]]+)\]\((\/[^)]*)\)$/.exec(part);
    return link ? <Link key={index} href={link[2]} className="font-semibold text-emerald-800 underline underline-offset-4 hover:text-emerald-900">{link[1]}</Link> : part;
  });
}

export default function ReportBody({ body }: { body: string }) {
  return <div className="mt-6 max-w-3xl space-y-5 text-base leading-8 text-slate-600 [overflow-wrap:anywhere]">
    {parseReportBody(body).map((block, index) => {
      if (block.type === "heading") return <h3 key={index} className="!mt-10 text-xl font-semibold leading-snug tracking-tight text-slate-900 first:!mt-0">{block.text}</h3>;
      if (block.type === "paragraph") return <p key={index} className="whitespace-pre-line"><InlineText text={block.text} /></p>;
      const items = block.items.map((item, itemIndex) => <li key={itemIndex} className="pl-1"><InlineText text={item} /></li>);
      return block.type === "ordered"
        ? <ol key={index} start={block.start} className="list-decimal space-y-3 pl-6 marker:font-semibold marker:text-emerald-700">{items}</ol>
        : <ul key={index} className="list-disc space-y-3 pl-6 marker:text-emerald-600">{items}</ul>;
    })}
  </div>;
}
