// components/integrations/HubSpotForm.tsx
"use client"

import { useEffect, useId, useState } from "react"

type HubSpotFormProps = {
  portalId?: string
  formId?: string
  region?: string // e.g., "na1", "eu1" (defaults to "na1")
  targetClassName?: string
  onLoad?: () => void
}

export default function HubSpotForm({
  portalId = process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID || "",
  formId = process.env.NEXT_PUBLIC_HUBSPOT_FORM_ID || "",
  region = process.env.NEXT_PUBLIC_HUBSPOT_REGION || "na1",
  targetClassName = "",
  onLoad,
}: HubSpotFormProps) {
  const [ready, setReady] = useState(false)
  const containerId = useId()
  const targetSelector = `#hs-form-${containerId}`

  useEffect(() => {
    if (!portalId || !formId) return

    // load script once
    const existing = document.querySelector<HTMLScriptElement>('script[src*="js.hsforms.net/forms/embed/v2.js"]')
    const createForm = () => {
      // @ts-ignore
      if (window.hbspt?.forms?.create) {
        // @ts-ignore
        window.hbspt.forms.create({
          region,
          portalId,
          formId,
          target: targetSelector,
          onFormReady: () => {
            setReady(true)
            onLoad?.()
          },
        })
      }
    }

    if (existing) {
      createForm()
      return
    }

    const s = document.createElement("script")
    s.src = "https://js.hsforms.net/forms/embed/v2.js"
    s.async = true
    s.onload = createForm
    document.body.appendChild(s)

    return () => {
      // optional: do nothing; HubSpot handles cleanup on navigation
    }
  }, [portalId, formId, region, targetSelector, onLoad])

  return (
    <div className={targetClassName}>
      <div id={`hs-form-${containerId}`} />
      {!portalId || !formId ? (
        <p className="mt-3 text-sm text-red-600">
          Missing HubSpot config. Set <code>NEXT_PUBLIC_HUBSPOT_PORTAL_ID</code> and{" "}
          <code>NEXT_PUBLIC_HUBSPOT_FORM_ID</code>.
        </p>
      ) : !ready ? (
        <p className="mt-3 text-sm text-gray-500">Loading form…</p>
      ) : null}
    </div>
  )
}
