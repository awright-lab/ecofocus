const PRIMARY_REPORT_ORIGIN = "https://ecofocusresearch.com";

/** Hosting aliases must not become Stripe or email return destinations. */
export function getReportSiteOrigin(requestUrl?: string) {
  const configured = process.env.REPORTS_SITE_URL;
  if (configured) {
    const url = new URL(configured);
    if (url.protocol !== "https:" && !(process.env.NODE_ENV !== "production" && url.hostname === "localhost")) throw new Error("REPORTS_SITE_URL must be an HTTPS URL.");
    return url.origin;
  }
  if (process.env.NODE_ENV === "production") return PRIMARY_REPORT_ORIGIN;
  return requestUrl ? new URL(requestUrl).origin : PRIMARY_REPORT_ORIGIN;
}
