# GPI PDF download capture

The online reader stays public. All PDF links and the former direct PDF URL lead to the name/email form. The PDF now lives in private/case-studies and is included via Next file tracing.

The website validates first name, last name, and email and writes a request to Payload before releasing the PDF. Nothing is sent to HubSpot and no marketing subscription is created. Submitted emails are not verified. Previously downloaded copies and public reader images remain shareable.

## Release configuration

Deploy the companion ecofocus-cms change and run migration 20261103_120000_case_study_downloads before deploying the website gate. Set the same strong random CASE_STUDY_DOWNLOADS_API_KEY on both servers. This credential permits only record creation, never reading. Do not expose it as a NEXT_PUBLIC variable. The website also needs PAYLOAD_BASE_URL or NEXT_PUBLIC_CMS_URL pointing to the CMS origin. No HubSpot configuration is needed for this flow.

Purge any cached copy of the old public PDF URL on deployment. Verify a controlled submission reaches Payload and returns the PDF, then delete the test record. Local tests mock persistence and do not migrate or call the production database.

## Viewing records

Payload admins open Research → Case Study Downloads. The list shows names, email, case study, and created date, with search, filters, and record totals. Editors and anonymous visitors cannot access these records. Records are append-only; admins may delete them. No separate website admin page is added.

Each accepted request creates a record, including repeat requests from one email. These measure download requests, not confirmed file saves or unique people. The log starts after deployment; no reliable historical download total has been confirmed.

The Payload list includes **Export all downloads (.csv)** for CMS admins. It exports first name, last name, email, case study, and request timestamp for all records across all pages, regardless of current list filters. The endpoint rejects non-admins (including the ingestion credential), uses private/no-store responses, and escapes CSV cells and spreadsheet formula prefixes.
