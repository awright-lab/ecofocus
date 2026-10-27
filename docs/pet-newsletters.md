# Pet newsletter QR destination

Permanent production URL: https://ecofocusresearch.com/pet-insights

Use this URL as the business-card QR destination in VistaPrint after deploying and verifying the page on the production domain. Keep the path stable so printed cards continue to work as content changes.

The page reads published CMS posts assigned to the `pet-industry` topic, newest first. To add a newsletter, assign the Pet Industry topic and publish the post in Payload. The website uses its existing `NEXT_PUBLIC_CMS_URL` configuration. Missing configuration or CMS failures show an availability message, never unrelated posts.

The page sets `noindex, nofollow` robots metadata and is intentionally absent from navigation and the sitemap. Do not disallow this path in robots.txt: crawlers need to read the noindex directive. These directives apply to the landing page; linked articles retain their existing search settings. The page is public to anyone with its URL.

Before printing: verify the production page loads on a phone, displays the intended newsletters, opens each article, and includes the robots directive in its HTML. Scan a proof of the final QR code to verify the complete destination.
