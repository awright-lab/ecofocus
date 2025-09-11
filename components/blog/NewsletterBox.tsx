import dynamic from 'next/dynamic'

const HubSpotForm = dynamic(() => import('@/components/intergrations/HubSpotForm'), { ssr: false })

export default function NewsletterBox() {
  return (
    <div className="rounded-2xl bg-white p-6 ring-1 ring-black/5 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900">Get EcoFocus insights</h3>
      <p className="mt-1 text-sm text-gray-600">Subscribe to our newsletter for the latest research.</p>
      <div className="mt-4">
        <HubSpotForm />
      </div>
    </div>
  )
}

