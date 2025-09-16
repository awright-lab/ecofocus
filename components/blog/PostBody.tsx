/* PostBody.tsx — fully typed, fixes 'format' narrowing and blockType union */

type IDLike = string | number;

/* ------------------------- Minimal Lexical typings ------------------------- */
type LexicalTextNode = { type: 'text'; text?: string; format?: number };
type LexicalGenericNode = {
  type: string;
  children?: LexicalNode[];
  url?: string;
  href?: string;
  newTab?: boolean;
  listType?: 'number' | 'bullet';
  tag?: string;
  level?: number;
  value?: unknown;
  image?: unknown;
  code?: string;
};
type LexicalNode = LexicalTextNode | LexicalGenericNode;
type LexicalDocRoot = { children?: LexicalNode[] };
type LexicalDoc = { root?: LexicalDocRoot } | LexicalNode | LexicalNode[];

/* ----------------------------- Block union type ---------------------------- */
type RelationshipRef =
  | { relationTo?: string; value?: IDLike | Record<string, unknown> }
  | IDLike
  | Record<string, unknown>
  | null
  | undefined;

type ParagraphBlock = {
  id?: IDLike;
  blockType: 'paragraph' | 'Paragraph';
  content?: LexicalDoc | string;
  richText?: LexicalDoc;
  text?: LexicalDoc | string;
};

type ImageLikeBlock = {
  id?: IDLike;
  blockType:
    | 'image'
    | 'Image'
    | 'ImageBlock'
    | 'imageBlock'
    | 'media'
    | 'Media'
    | 'mediaBlock'
    | 'figure'
    | 'Figure';
  image?: RelationshipRef;
  media?: RelationshipRef;
  upload?: RelationshipRef;
  url?: string;
  alt?: string;
  caption?: string;
  value?: { image?: RelationshipRef; media?: RelationshipRef };
};

type PullQuoteBlock = {
  id?: IDLike;
  blockType: 'PullQuote' | 'pullQuote';
  quote?: LexicalDoc | string;
  text?: string;
  attribution?: string;
};

type KeyTakeawaysBlock = {
  id?: IDLike;
  blockType: 'KeyTakeaways' | 'keyTakeaways';
  items?: Array<{ text?: string } | string> | null;
  points?: Array<{ text?: string } | string> | null;
};

type CTA = { label?: string; title?: string; href?: string; url?: string } | null | undefined;
type CTAGroupBlock = {
  id?: IDLike;
  blockType: 'CTAGroup' | 'ctaGroup';
  ctas?: CTA[];
};

/** Some content builders use a “raw rich text” block named 'content' or 'richText'. */
type RawRichTextBlock = {
  id?: IDLike;
  blockType: 'content' | 'richText';
  content?: LexicalDoc;
  richText?: LexicalDoc;
};

type Block =
  | ParagraphBlock
  | ImageLikeBlock
  | PullQuoteBlock
  | KeyTakeawaysBlock
  | CTAGroupBlock
  | RawRichTextBlock;

/* --------------------------------- Helpers -------------------------------- */
const isLexical = (v: unknown): v is LexicalDoc =>
  !!v && typeof v === 'object' && ('root' in (v as Record<string, unknown>) || Array.isArray(v));

const isTextNode = (n: unknown): n is LexicalTextNode =>
  !!n && typeof n === 'object' && (n as { type?: unknown }).type === 'text';

const escapeHtml = (str: string): string =>
  String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#039;');

const absolutize = (u: string | undefined, base: string): string | undefined => {
  if (!u) return u;
  if (/^https?:\/\//i.test(u)) return u;
  return base ? `${base}${u.startsWith('/') ? u : '/' + u}` : u;
};

type ImgInfo = { url: string; alt?: string } | null;

const imgFrom = (node: unknown, base: string): ImgInfo => {
  if (!node || typeof node !== 'object') return null;
  const n = node as Record<string, unknown>;
  const raw =
    (n.url as string | undefined) ||
    (n.src as string | undefined) ||
    ((n.image as Record<string, unknown> | undefined)?.url as string | undefined) ||
    ((n.value as Record<string, unknown> | undefined)?.url as string | undefined) ||
    (((n.sizes as Array<Record<string, unknown>> | undefined)?.[0])?.url as string | undefined) ||
    ((n.large as Record<string, unknown> | undefined)?.url as string | undefined) ||
    (n.filename as string | undefined) ||
    (n.secure_url as string | undefined);

  const src = absolutize(raw, base);
  if (!src) return null;

  const alt =
    (n.alt as string | undefined) ||
    ((n.image as Record<string, unknown> | undefined)?.alt as string | undefined) ||
    ((n.value as Record<string, unknown> | undefined)?.alt as string | undefined) ||
    (n.caption as string | undefined);

  return { url: src, alt };
};

/**
 * Apply Lexical `format` bitmask to an already-escaped text string.
 * 1=bold, 2=italic, 4=underline, 8=strike, 16=code, 32=sub, 64=sup, 128=mark
 */
const applyFormats = (textEscaped: string, format: number = 0): string => {
  let out = textEscaped;
  if (format & 16) out = `<code>${out}</code>`;
  if (format & 8) out = `<s>${out}</s>`;
  if (format & 4) out = `<u>${out}</u>`;
  if (format & 2) out = `<em>${out}</em>`;
  if (format & 1) out = `<strong>${out}</strong>`;
  if (format & 32) out = `<sub>${out}</sub>`;
  if (format & 64) out = `<sup>${out}</sup>`;
  if (format & 128) out = `<mark>${out}</mark>`;
  return out;
};

const renderLexicalNodeToHTML = (node: LexicalDoc | undefined, base: string): string => {
  if (!node) return '';

  const render = (n: unknown): string => {
    if (!n) return '';
    if (Array.isArray(n)) return n.map(render).join('');

    if (typeof n === 'object') {
      // TEXT NODE (has 'format')
      if (isTextNode(n)) {
        const text = escapeHtml(n.text ?? '');
        const fmt = typeof n.format === 'number' ? n.format : 0;
        return applyFormats(text, fmt);
      }

      // GENERIC NODE
      const obj = n as LexicalGenericNode;
      const children = obj.children?.map(render).join('') ?? '';

      switch (obj.type) {
        case 'paragraph':
          return `<p>${children}</p>`;
        case 'quote':
          return `<blockquote>${children}</blockquote>`;
        case 'linebreak':
          return '<br />';
        case 'link': {
          const href = obj.url || obj.href || '#';
          const attrs = `href="${escapeHtml(href ?? '#')}"${
            obj.newTab ? ' target="_blank" rel="noopener noreferrer"' : ''
          }`;
          return `<a ${attrs}>${children}</a>`;
        }
        case 'list': {
          const tag = obj.listType === 'number' ? 'ol' : 'ul';
          return `<${tag}>${children}</${tag}>`;
        }
        case 'listitem':
          return `<li>${children}</li>`;
        case 'heading': {
          const tag = obj.tag || (obj.level ? `h${Math.min(6, Math.max(1, obj.level))}` : 'h2');
          return `<${tag}>${children}</${tag}>`;
        }
        case 'code': {
          const code = obj.code ?? children;
          return `<pre><code>${escapeHtml(String(code))}</code></pre>`;
        }
        case 'upload':
        case 'image': {
          const img = imgFrom(obj.value || obj.image || obj, base);
          if (!img?.url) return '';
          const alt = img.alt ? ` alt="${escapeHtml(img.alt)}"` : '';
          return `<img src="${escapeHtml(img.url)}"${alt} />`;
        }
        default:
          return children; // unknown nodes: keep inner content
      }
    }

    return '';
  };

  const root = (node as { root?: LexicalDocRoot }).root ?? node;
  return render(root);
};

/* --------------------------------- Component ------------------------------- */
export default function PostBody({
  blocks,
  html,
}: {
  blocks?: Block[] | Block;
  html?: string;
}) {
  const CMS_BASE = process.env.NEXT_PUBLIC_CMS_URL?.replace(/\/$/, '') ?? '';

  // Legacy HTML path
  if (html) {
    return (
      <div
        className="prose prose-emerald max-w-none prose-headings:scroll-mt-24 prose-img:rounded-xl"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  // Single top-level Lexical doc path
  if (blocks && !Array.isArray(blocks) && typeof blocks === 'object' && 'root' in (blocks as Record<string, unknown>)) {
    const out = renderLexicalNodeToHTML(blocks as LexicalDoc, CMS_BASE);
    return (
      <div
        className="prose prose-emerald max-w-none prose-headings:scroll-mt-24 prose-img:rounded-xl"
        dangerouslySetInnerHTML={{ __html: out }}
      />
    );
  }

  if (!blocks || (Array.isArray(blocks) && blocks.length === 0)) {
    return (
      <div className="prose prose-emerald max-w-none">
        <p>Article body coming soon.</p>
      </div>
    );
  }

  const list = Array.isArray(blocks) ? blocks : [blocks];

  return (
    <div className="prose prose-emerald max-w-none">
      {list.map((b, i) => {
        switch (b.blockType) {
          /* ------------------------------ Paragraphs ------------------------------ */
          case 'paragraph':
          case 'Paragraph': {
            const v: LexicalDoc | string | undefined =
              (b as ParagraphBlock).text ?? (b as ParagraphBlock).richText ?? (b as ParagraphBlock).content;

            if (typeof v === 'string') {
              return <p key={b.id?.toString() ?? i.toString()}>{v}</p>;
            }
            if (isLexical(v)) {
              const out = renderLexicalNodeToHTML(v, CMS_BASE);
              return <div key={b.id?.toString() ?? i.toString()} dangerouslySetInnerHTML={{ __html: out }} />;
            }
            return <p key={b.id?.toString() ?? i.toString()} />;
          }

          /* --------------------------------- Images -------------------------------- */
          case 'image':
          case 'Image':
          case 'ImageBlock':
          case 'imageBlock':
          case 'media':
          case 'Media':
          case 'mediaBlock':
          case 'figure':
          case 'Figure': {
            const img =
              imgFrom(
                (b as ImageLikeBlock).image ??
                  (b as ImageLikeBlock).media ??
                  (b as ImageLikeBlock).upload ??
                  (b as ImageLikeBlock).value?.image ??
                  (b as ImageLikeBlock).value?.media ??
                  b,
                CMS_BASE
              ) ?? {
                url: absolutize((b as ImageLikeBlock).url, CMS_BASE) ?? '',
                alt: (b as ImageLikeBlock).alt,
              };

            if (!img?.url) return null;

            const caption = (b as ImageLikeBlock).caption ?? img.alt ?? '';
            return (
              <figure key={b.id?.toString() ?? i.toString()} className="my-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt={img.alt ?? ''} className="rounded-xl w-full" />
                {caption ? <figcaption className="mt-2 text-sm text-gray-500">{caption}</figcaption> : null}
              </figure>
            );
          }

          /* ------------------------------ Raw RichText ----------------------------- */
          case 'content':
          case 'richText': {
            const rb = b as RawRichTextBlock;
            const doc = (rb.richText ?? rb.content) as LexicalDoc | undefined;
            const out = renderLexicalNodeToHTML(doc, CMS_BASE);
            return <div key={b.id?.toString() ?? i.toString()} dangerouslySetInnerHTML={{ __html: out }} />;
          }

          /* -------------------------------- PullQuote ------------------------------ */
          case 'PullQuote':
          case 'pullQuote': {
            const pq = b as PullQuoteBlock;
            const quote =
              typeof pq.quote === 'string'
                ? pq.quote
                : isLexical(pq.quote)
                ? renderLexicalNodeToHTML(pq.quote, CMS_BASE).replace(/<\/?p>/g, '')
                : pq.text ?? '';

            return (
              <blockquote
                key={b.id?.toString() ?? i.toString()}
                className="my-6 border-l-4 border-emerald-600 pl-4 text-lg italic text-emerald-900/90"
              >
                {quote}
                {pq.attribution ? (
                  <cite className="not-italic text-gray-500 block mt-1">— {pq.attribution}</cite>
                ) : null}
              </blockquote>
            );
          }

          /* ------------------------------- KeyTakeaways ---------------------------- */
          case 'KeyTakeaways':
          case 'keyTakeaways': {
            const kt = b as KeyTakeawaysBlock;
            const items = (kt.items ?? kt.points ?? []).filter(Boolean) as Array<{ text?: string } | string>;
            if (items.length === 0) return null;
            return (
              <div key={b.id?.toString() ?? i.toString()} className="my-6 rounded-xl bg-emerald-50 p-4 ring-1 ring-emerald-200">
                <h3 className="m-0 text-emerald-900">Key takeaways</h3>
                <ul>
                  {items.map((it, idx) => {
                    const text = typeof it === 'string' ? it : it.text ?? '';
                    return <li key={idx}>{text}</li>;
                  })}
                </ul>
              </div>
            );
          }

          /* --------------------------------- CTAGroup ------------------------------ */
          case 'CTAGroup':
          case 'ctaGroup': {
            const ctas = (b as CTAGroupBlock).ctas ?? [];
            if (ctas.length === 0) return null;
            return (
              <div key={b.id?.toString() ?? i.toString()} className="my-8 grid gap-3 sm:grid-cols-2">
                {ctas.map((c, idx) =>
                  c?.href || c?.url ? (
                    <a
                      key={idx}
                      href={c.href ?? c.url ?? '#'}
                      className="block rounded-xl bg-emerald-600 px-4 py-3 text-white hover:bg-emerald-700"
                    >
                      {c.label ?? c.title ?? 'Learn more'}
                    </a>
                  ) : (
                    <span
                      key={idx}
                      className="inline-flex items-center rounded-xl bg-gray-200 px-4 py-3 text-sm font-semibold text-gray-700"
                    >
                      {c?.label ?? c?.title ?? 'Action'}
                    </span>
                  )
                )}
              </div>
            );
          }

          default:
            return null;
        }
      })}
    </div>
  );
}



