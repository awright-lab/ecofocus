import Image from 'next/image'

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
        switch (b.blockType) {
          case 'paragraph':
          case 'Paragraph':
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
                {b.quote || b.text}
              </blockquote>
            )
          case 'KeyTakeaways':
          case 'keyTakeaways': {
            const items: string[] = b.items || b.points || []
            return (
              <div key={i} className="my-6 rounded-xl bg-emerald-50 p-4 ring-1 ring-emerald-200">
                <h3 className="m-0 text-emerald-900">Key takeaways</h3>
                <ul>
                  {items.map((t, idx) => (
                    <li key={idx}>{t}</li>
                  ))}
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

