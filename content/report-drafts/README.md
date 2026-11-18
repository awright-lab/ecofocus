# Workforce report preparation

`environmental-sustainability-and-the-workforce.json` contains the Payload report fields for Jerry's supplied item-page copy. The approved alternate copy is now saved as Payload report ID 2 (draft); this file retains the original comparison copy. The confirmed price is **$1,495 USD**. The license is **internal use across one organization**. Publication is **November 2026**, and the PDF is **65 pages**. The proposed slug is `environmental-sustainability-and-the-workforce`.

Before publishing:

- The approved cover is already uploaded to Payload Media as ID **395**, filename `environmental-sustainability-and-the-workforce-cover-v6-1.webp`. The draft selects this Media record.
- The approved PDF is uploaded to private Report Files as ID **2**, filename `EcoFocus-Environmental-Sustainability-and-the-Workforce-2026.pdf` (65 pages).

The published item URL will be `/reports/environmental-sustainability-and-the-workforce`. The month and page count were confirmed by the user. File and cover relationships and Stripe IDs are assigned through Payload. The fielding dates and sample sizes are preserved from the supplied copy.

In Payload → Store → Reports, open report ID 2 to review the approved alternate copy, cover, and private PDF before publishing. The draft specifies 65 pages. The `body` field supports `##` section headings, `-` bullets, numbered lists, and local links such as `[Contact us](/contact)`. Existing plain text remains supported; HTML is displayed as text.

Saving a draft does not create a Stripe product. Publishing synchronizes a product and price in the mode configured by the CMS's Stripe secret key. Confirm that the CMS and website use the intended matching mode before publishing this report.

Local review screenshots are in the workspace's `artifacts/workforce-report` directory. They use a temporary local CMS fixture and do not imply that the report is published or available to buy.

## Published preview

The review page is `/reports/preview/environmental-sustainability-and-the-workforce`. It reads this local draft, has noindex/nofollow metadata, and explicitly disables checkout. It is not a Payload publication and does not appear in the report catalog. The cover is served by Payload Media at `https://ecofocus-cms.onrender.com/api/media/file/environmental-sustainability-and-the-workforce-cover-v6-1.webp`. The paid report still requires its private PDF and Payload publication before sales.

The current cover comes from `EcoFocus_Workforce_Report_Draft_v6.1.png`. A web-optimized copy is stored in Media; the full-resolution original remains unchanged in the local public images folder. Previous cover Media ID 394 is retained.

## Live checkout preparation

The canonical `/reports/environmental-sustainability-and-the-workforce` page uses the approved alternate presentation when its Payload record is published. List price remains $1,495. Hosted Checkout allows promotion codes. Configure matching live Stripe keys on CMS/website and the live webhook signing secret before publishing and creating the limited $1 test discount. The paid PDF is staged locally under `private/reports/`.
