type Block = {
  blockType: string
  [key: string]: any
}

export default function PostBody({ blocks, html }: { blocks?: Block[]; html?: string }) {
  if (html) {
    return (
      <div
        className="prose prose-emerald max-w-none prose-headings:scroll-mt-24 prose-img:rounded-xl"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    )
  }

  if (!blocks || blocks.length === 0) {
    return (
      <div className="prose prose-emerald max-w-none">
        <p>Article body coming soon.</p>
      </div>
    )
  }

  return (
    <div className="prose prose-emerald max-w-none">
      {blocks.map((b, i) => {
        const isRich = (v: any) => v && typeof v === 'object' && 'root' in v

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
                case 'list': {
                  const tag = node.listType === 'number' ? 'ol' : 'ul'
                  return `<${tag}>${inner}</${tag}>`
                }
                case 'listitem':
                  return `<li>${inner}</li>`
                case 'heading': {
                  const tag = node.tag || 'h2'
                  return `<${tag}>${inner}</${tag}>`
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

        const escapeHtml2 = (str: string) =>
          String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;')

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
          case 'ImageBlock': {
            const url = b?.image?.url || b?.url
            const alt = b?.image?.alt || b?.alt || ''
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
