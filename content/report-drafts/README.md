# Workforce report preparation

`environmental-sustainability-and-the-workforce.json` contains the Payload report fields for Jerry's supplied item-page copy. It is an unpublished draft, not a live CMS record. The confirmed price is **$1,495 USD**. The license is **internal use across one organization**. Publication is **November 2026**, and the PDF is **72 pages**. The proposed slug is `environmental-sustainability-and-the-workforce`.

Before publishing:

- The approved cover is already uploaded to Payload Media as ID **394**, filename `environmental-sustainability-and-the-workforce-cover.png`. The draft selects this Media record.
- Approved PDF (upload to private Report Files).

The published item URL will be `/reports/environmental-sustainability-and-the-workforce`. The month and page count were confirmed by the user. File and cover relationships and Stripe IDs are assigned through Payload. The fielding dates and sample sizes are preserved from the supplied copy.

In Payload → Store → Reports, create a draft using these fields. Attach the cover and private file; the draft already specifies 72 pages. The `body` field supports `##` section headings, `-` bullets, numbered lists, and local links such as `[Contact us](/contact)`. Existing plain text remains supported; HTML is displayed as text.

Saving a draft does not create a Stripe product. Publishing synchronizes a product and price in the mode configured by the CMS's Stripe secret key. Confirm that the CMS and website use the intended matching mode before publishing this report.

Local review screenshots are in the workspace's `artifacts/workforce-report` directory. They use a temporary local CMS fixture and do not imply that the report is published or available to buy.

## Published preview

The review page is `/reports/preview/environmental-sustainability-and-the-workforce`. It reads this local draft, has noindex/nofollow metadata, and explicitly disables checkout. It is not a Payload publication and does not appear in the report catalog. The cover is served by Payload Media at `https://ecofocus-cms.onrender.com/api/media/file/environmental-sustainability-and-the-workforce-cover.png`. The paid report still requires its private PDF and Payload publication before sales.
