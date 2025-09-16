/* PostBody.tsx — fixes link resolution + alignment */

/* ------------------------- Minimal Lexical typings ------------------------- */
type IDLike = string | number;

type LexicalTextNode = { type: 'text'; text?: string; format?: number };
type LexicalGenericNode = {
  type: string;
  children?: LexicalNode[];
  // common fields
  url?: string;
  href?: string;
  newTab?: boolean;
  listType?: 'number' | 'bullet';
  tag?: string;
  level?: number;
  value?: unknown;
  image?: unknown;
  code?: string;
  // alignment for elements (paragraph, heading, quote, list)
  format?: 'left' | 'start' | 'right' | 'end' | 'center' | 'justify' | string | number | undefined;
  // LinkFeature often stores data here:
  fields?: {
    linkType?: 'custom' | 'internal';
    url?: string;
    newTab?: boolean;
    doc?: {
      relationTo?: 'posts' | 'topics' | 'authors' | 'media' | string;
      value?: any; // id or populated doc
    };
  };
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

/** Map internal doc links to site routes. Adjust to your routing as needed. */
const resolveInternalDocHref = (
  relationTo?: string,
  value?: any, // could be id or populated doc
  baseCMS = ''
): string | undefined => {
  // if populated
  const obj = value && typeof value === 'object' ? value : undefined;
  const slug = obj?.slug ?? obj?.value?.slug ?? undefined;

  switch (relationTo) {
    case 'posts':
      return slug ? `/blog/${slug}` : undefined;
    case 'topics':
      return slug ? `/topics/${slug}` : undefined;
    case 'authors':
      return slug ? `/authors/${slug}` : undefined;
    case 'media': {
      // media typically needs absolute URL for files
      const mediaUrl =
        obj?.url || obj?.filename || obj?.thumbnailURL || obj?.sizes?.[0]?.url || undefined;
      return mediaUrl ? absolutize(String(mediaUrl), baseCMS) : undefined;
    }
    default:
      return undefined;
  }
};

/** Extract href/newTab from a link node supporting LinkFeature’s `fields` shape. */
const resolveLink = (node: LexicalGenericNode, baseCMS: string): { href: string; newTab: boolean } => {
  // 1) Support LinkFeature fields
  const lf = node.fields;
  if (lf) {
    if (lf.linkType === 'custom' && lf.url) {
      return { href: lf.url, newTab: !!lf.newTab };
    }
    if (lf.linkType === 'internal' && lf.doc) {
      const href = resolveInternalDocHref(lf.doc.relationTo, lf.doc.value, baseCMS);
      if (href) return { href, newTab: !!lf.newTab };
    }
  }
  // 2) Fallback to node.url / node.href
  const href = node.url || node.href || '#';
  return { href, newTab: !!node.newTab };
};

/** Tailwind `prose` alignment class based on element format */
const alignmentClass = (format?: LexicalGenericNode['format']): string => {
  // allow string formats from lexical: 'center' | 'right' | 'justify' | 'left'
  switch (format) {
    case 'center':
      return ' class="text-center"';
    case 'right':
    case 'end':
      return ' class="text-right"';
    case 'justify':
      return ' class="text-justify"';
    // 'left'/'start' are default in prose
    default:
      return '';
  }
};

/**
 * Apply Lexical `format` bitmask to an already-escaped text string.
 * 1=bold, 2=italic, 4=underline, 8=strike, 16=code, 32=sub, 64=sup, 128=mark
 */
const applyTextFormats = (textEscaped: string, format: number = 0): string => {
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

const renderLexicalNodeToHTML = (node: LexicalDoc | undefined, baseCMS: string): string => {
  if (!node) return '';

  const render = (n: unknown): string => {
    if (!n) return '';
    if (Array.isArray(n)) return n.map(render).join('');

    if (typeof n === 'object') {
      // TEXT NODE
      if (isTextNode(n)) {
        const text = escapeHtml(n.text ?? '');
        const fmt = typeof n.format === 'number' ? n.format : 0;
        return applyTextFormats(text, fmt);
        // ELEMENT NODE
      } else {
        const obj = n as LexicalGenericNode;
        const inner = obj.children?.map(render).join('') ?? '';
        const align = alignmentClass(obj.format);

        switch (obj.type) {
          case 'paragraph':
            return `<p${align}>${inner}</p>`;
          case 'quote':
            return `<blockquote${align}>${inner}</blockquote>`;
          case 'linebreak':
            return '<br />';
          case 'link': {
            const { href, newTab } = resolveLink(obj, baseCMS);
            const safeHref = escapeHtml(href || '#');
            const attrs = `href="${safeHref}"${newTab ? ' target="_blank" rel="noopener noreferrer"' : ''}`;
            return `<a ${attrs}>${inner}</a>`;
          }
          case 'list': {
            const tag = obj.listType === 'number' ? 'ol' : 'ul';
            return `<${tag}${align}>${inner}</${tag}>`;
          }
          case 'listitem':
            return `<li>${inner}</li>`;
          case 'heading': {
            const tag = obj.tag || (obj.level ? `h${Math.min(6, Math.max(1, obj.level))}` : 'h2');
            return `<${tag}${align}>${inner}</${tag}>`;
          }
          case 'code': {
            const code = obj.code ?? inner;
            return `<pre><code>${escapeHtml(String(code))}</code></pre>`;
          }
          case 'upload':
          case 'image': {
            const img = imgFrom(obj.value || obj.image || obj, baseCMS);
            if (!img?.url) return '';
            const alt = img.alt ? ` alt="${escapeHtml(img.alt)}"` : '';
            return `<img src="${escapeHtml(img.url)}"${alt} />`;
          }
          default:
            return inner;
        }
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

  const hasTopLevelLexical =
    !!blocks && !Array.isArray(blocks) && typeof blocks === 'object' && 'root' in (blocks as Record<string, unknown>);
  const hasBlocksArray = Array.isArray(blocks) && blocks.length > 0;
  const hasHtml = typeof html === 'string' && html.trim() !== '';

  /* 1) Prefer blocks (Lexical or array) */
  if (hasTopLevelLexical) {
    const out = renderLexicalNodeToHTML(blocks as LexicalDoc, CMS_BASE);
    return (
      <div
        className="prose prose-emerald max-w-none prose-headings:scroll-mt-24 prose-img:rounded-xl"
        dangerouslySetInnerHTML={{ __html: out }}
      />
    );
  }

  if (hasBlocksArray) {
    const list = blocks as Block[];
    return (
      <div className="prose prose-emerald max-w-none">
        {list.map((b, i) => {
          switch (b.blockType) {
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

            case 'content':
            case 'richText': {
              const rb = b as RawRichTextBlock;
              const doc = (rb.richText ?? rb.content) as LexicalDoc | undefined;
              const out = renderLexicalNodeToHTML(doc, CMS_BASE);
              return <div key={b.id?.toString() ?? i.toString()} dangerouslySetInnerHTML={{ __html: out }} />;
            }

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

            case 'KeyTakeaways':
            case 'keyTakeaways': {
              const kt = b as KeyTakeawaysBlock;
              const items = (kt.items ?? kt.points ?? []).filter(Boolean) as Array<{ text?: string } | string>;
              if (items.length === 0) return null;
              return (
                <div
                  key={b.id?.toString() ?? i.toString()}
                  className="my-6 rounded-xl bg-emerald-50 p-4 ring-1 ring-emerald-200"
                >
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

  /* 2) Legacy HTML fallback only if no blocks present */
  if (hasHtml) {
    return (
      <div
        className="prose prose-emerald max-w-none prose-headings:scroll-mt-24 prose-img:rounded-xl"
        dangerouslySetInnerHTML={{ __html: html! }}
      />
    );
  }

  /* 3) Empty */
  return (
    <div className="prose prose-emerald max-w-none">
      <p>Article body coming soon.</p>
    </div>
  );
}





