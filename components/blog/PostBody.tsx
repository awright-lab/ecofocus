type Block = {
  blockType: string
  [key: string]: any
}

export default function PostBody({ blocks, html }: { blocks?: any; html?: string }) {
  const CMS_BASE = process.env.NEXT_PUBLIC_CMS_URL?.replace(/\/$/, '') || ''
  if (html) {
    return (
      <div
        className="prose prose-emerald max-w-none prose-headings:scroll-mt-24 prose-img:rounded-xl"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    )
  }

  // Helpers for top-level rich text
  const escapeHtmlTop = (str: string) =>
    String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\"/g, '&quot;')
      .replace(/'/g, '&#039;')

  const absolutize = (u?: string) => {
    if (!u) return u
    if (/^https?:\/\//i.test(u)) return u
    return CMS_BASE ? `${CMS_BASE}${u.startsWith('/') ? u : '/' + u}` : u
  }

  const imgFromTop = (node: any): { url: string; alt?: string } | null => {
    if (!node) return null
    const raw = node.url || node.src || node?.image?.url || node?.value?.url || node?.sizes?.[0]?.url || node?.large?.url || node?.filename || node?.secure_url
    const src = absolutize(raw)
    if (!src) return null
    const alt = node.alt || node?.image?.alt || node?.value?.alt || node?.caption
    return { url: src, alt }
  }

  const htmlFromRichTop = (v: any): string => {
    try {
      const render = (node: any): string => {
        if (!node) return ''
        if (Array.isArray(node)) return node.map(render).join('')
        const type = node.type
        if (type === 'text') return escapeHtmlTop(node.text || '')
        const inner = (node.children || []).map(render).join('')
        switch (type) {
          case 'paragraph':
            return `<p>${inner}</p>`
          case 'quote':
            return `<blockquote>${inner}</blockquote>`
          case 'linebreak':
            return '<br />'
          case 'link': {
            const href = node.url || node.href || '#'
            const attrs = `href="${escapeHtmlTop(href)}"${node.newTab ? ' target=\"_blank\" rel=\"noopener noreferrer\"' : ''}`
            return `<a ${attrs}>${inner}</a>`
          }
          case 'list': {
            const tag = node.listType === 'number' ? 'ol' : 'ul'
            return `<${tag}>${inner}</${tag}>`
          }
          case 'listitem':
            return `<li>${inner}</li>`
          case 'heading': {
            const tag = node.tag || (node.level ? `h${Math.min(6, Math.max(1, node.level))}` : 'h2')
            return `<${tag}>${inner}</${tag}>`
          }
          case 'upload':
          case 'image': {
            const img = imgFromTop(node.value || node.image || node)
            if (!img?.url) return ''
            const alt = img.alt ? ` alt=\"${escapeHtmlTop(img.alt)}\"` : ''
            return `<img src=\"${escapeHtmlTop(img.url)}\"${alt} />`
          }
          default:
            return inner
        }
      }
      return render(v.root || v)
    } catch {
      return ''
    }
  }

  // If body is a single rich-text object
  if (blocks && !Array.isArray(blocks) && typeof blocks === 'object' && 'root' in blocks) {
    const out = htmlFromRichTop(blocks)
    return (
      <div
        className="prose prose-emerald max-w-none prose-headings:scroll-mt-24 prose-img:rounded-xl"
        dangerouslySetInnerHTML={{ __html: out }}
      />
    )
  }

  if (!blocks || (Array.isArray(blocks) && blocks.length === 0)) {
    return (
      <div className="prose prose-emerald max-w-none">
        <p>Article body coming soon.</p>
      </div>
    )
  }

  return (
    <div className="prose prose-emerald max-w-none">
      {(blocks as any[]).map((b: any, i: number) => {
        const isRich = (v: any) => v && typeof v === 'object' && ('root' in v || Array.isArray(v))

        const absolutize = (u?: string) => {
          if (!u) return u
          if (/^https?:\/\//i.test(u)) return u
          return CMS_BASE ? `${CMS_BASE}${u.startsWith('/') ? u : '/' + u}` : u
        }

        const imgFrom = (node: any): { url: string; alt?: string } | null => {
          if (!node) return null
          const raw = node.url || node.src || node?.image?.url || node?.value?.url || node?.sizes?.[0]?.url || node?.large?.url || node?.filename || node?.secure_url
          const src = absolutize(raw)
          if (!src) return null
          const alt = node.alt || node?.image?.alt || node?.value?.alt || node?.caption
          return { url: src, alt }
        }

        const textFromRich = (v: any): string => {
          try {
            const walk = (node: any): string => {
              if (!node) return ''
              if (Array.isArray(node)) return node.map(walk).join('')
              const t = node.type || ''
              if (t === 'text') return node.text || ''
              if (node.children) return node.children.map(walk).join('')
              return ''
            }
            return walk(v.root || v)
          } catch {
            return ''
          }
        }

        const escapeHtml = (str: string) =>
          String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/\"/g, '&quot;')
            .replace(/'/g, '&#039;')

        const htmlFromRich = (v: any): string => {
          try {
            const render = (node: any): string => {
              if (!node) return ''
              if (Array.isArray(node)) return node.map(render).join('')
              const type = node.type
              if (type === 'text') return escapeHtml(node.text || '')
              const inner = (node.children || []).map(render).join('')
              switch (type) {
                case 'paragraph':
                  return `<p>${inner}</p>`
                case 'quote':
                  return `<blockquote>${inner}</blockquote>`
                case 'linebreak':
                  return '<br />'
                case 'link': {
                  const href = node.url || node.href || '#'
                  const attrs = `href="${escapeHtml(href)}"${node.newTab ? ' target="_blank" rel="noopener noreferrer"' : ''}`
                  return `<a ${attrs}>${inner}</a>`
                }
                case 'list': {
                  const tag = node.listType === 'number' ? 'ol' : 'ul'
                  return `<${tag}>${inner}</${tag}>`
                }
                case 'listitem':
                  return `<li>${inner}</li>`
                case 'heading': {
                  const tag = node.tag || (node.level ? `h${Math.min(6, Math.max(1, node.level))}` : 'h2')
                  return `<${tag}>${inner}</${tag}>`
                }
                case 'upload':
                case 'image': {
                  const img = imgFrom(node.value || node.image || node)
                  if (!img?.url) return ''
                  const alt = img.alt ? ` alt="${escapeHtml(img.alt)}"` : ''
                  return `<img src="${escapeHtml(img.url)}"${alt} />`
                }
                default:
                  return inner
              }
            }
            return render(v.root || v)
          } catch {
            return ''
          }
        }

        

        switch (b.blockType) {
          case 'paragraph':
          case 'Paragraph':
            if (isRich(b.text)) {
              const out = htmlFromRich(b.text)
              return <div key={i} dangerouslySetInnerHTML={{ __html: out }} />
            }
            if (isRich(b.richText)) {
              const out = htmlFromRich(b.richText)
              return <div key={i} dangerouslySetInnerHTML={{ __html: out }} />
            }
            if (isRich(b.content)) {
              const out = htmlFromRich(b.content)
              return <div key={i} dangerouslySetInnerHTML={{ __html: out }} />
            }
            return <p key={i}>{b.text || b.content || ''}</p>
          case 'image':
          case 'Image':
          case 'ImageBlock':
          case 'imageBlock':
          case 'media':
          case 'Media':
          case 'mediaBlock':
          case 'figure':
          case 'Figure': {
            const from = imgFrom(b.image || b.media || b.upload || (b.value && (b.value.image || b.value.media)) || b)
            const url = from?.url || absolutize(b?.url)
            const alt = b?.image?.alt || b?.media?.alt || b?.alt || ''
            if (!url) return null
            return (
              <figure key={i} className="my-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt={alt} className="rounded-xl w-full" />
                {(alt || b?.caption) && (
                  <figcaption className="mt-2 text-sm text-gray-500">{b.caption || alt}</figcaption>
                )}
              </figure>
            )
          }
          case 'content':
          case 'richText': {
            const out = htmlFromRich(b.richText || b.content)
            return <div key={i} dangerouslySetInnerHTML={{ __html: out }} />
          }
          case 'PullQuote':
          case 'pullQuote':
            return (
              <blockquote key={i} className="my-6 border-l-4 border-emerald-600 pl-4 text-lg italic text-emerald-900/90">
                {isRich(b.quote) ? textFromRich(b.quote) : (b.quote || b.text)}
              </blockquote>
            )
          case 'KeyTakeaways':
          case 'keyTakeaways': {
            const items: any[] = b.items || b.points || []
            return (
              <div key={i} className="my-6 rounded-xl bg-emerald-50 p-4 ring-1 ring-emerald-200">
                <h3 className="m-0 text-emerald-900">Key takeaways</h3>
                <ul>
                  {items.map((t, idx) => {
                    const content = isRich(t) ? textFromRich(t) : (typeof t === 'string' ? t : t?.text || '')
                    return <li key={idx}>{content}</li>
                  })}
                </ul>
              </div>
            )
          }
          case 'CTAGroup':
          case 'ctaGroup': {
            const ctas: any[] = b.ctas || []
            return (
              <div key={i} className="my-8 grid gap-3 sm:grid-cols-2">
                {ctas.map((c, idx) => (
                  <a
                    key={idx}
                    href={c.href || c.url || '#'}
                    className="block rounded-xl bg-emerald-600 px-4 py-3 text-white hover:bg-emerald-700"
                  >
                    {c.label || c.title || 'Learn more'}
                  </a>
                ))}
              </div>
            )
          }
          default:
            return null
        }
      })}
    </div>
  )
}
