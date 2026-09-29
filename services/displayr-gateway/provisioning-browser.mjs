import { inspectCompanyDirectory } from "./account-directory.mjs";
import { prepareDisplayrInvitation } from "./invitation-form.mjs";
const origin = "https://app.displayr.com";
export function createProvisioningBrowser({
  chromium,
  authenticateAdmin,
  companyId,
  executablePath,
}) {
  async function withAdmin(action) {
    const cookies = await authenticateAdmin();
    let browser;
    try {
      browser = await chromium.launch({
        headless: true,
        ...(executablePath ? { executablePath } : {}),
      });
      const context = await browser.newContext({ serviceWorkers: "block" });
      await context.addCookies(
        cookies.map((c) => ({
          ...c,
          expires: c.expires ? c.expires / 1000 : -1,
        })),
      );
      let armed = false,
        submitted = false;
      await context.route("**/*", (route) => {
        const req = route.request(),
          url = new URL(req.url());
        if (
          armed &&
          !submitted &&
          req.method() === "POST" &&
          url.href === origin + "/User/AjaxNewUser"
        ) {
          submitted = true;
          return route.continue();
        }
        if (
          !["GET", "HEAD"].includes(req.method()) ||
          url.protocol !== "https:" ||
          /delete|remove|resetpassword|logout/i.test(url.pathname) ||
          (req.isNavigationRequest() && url.origin !== origin)
        )
          return route.abort();
        return route.continue();
      });
      const page = await context.newPage();
      page.setDefaultTimeout(12000);
      return await action(page, () => {
        armed = true;
      });
    } catch {
      throw Error("Displayr provisioning browser unavailable");
    } finally {
      await browser?.close().catch(() => {});
    }
  }
  return {
    inspect: (email) =>
      withAdmin((page) => inspectCompanyDirectory(page, { companyId, email })),
    invite: ({ email, fullName }) =>
      withAdmin(async (page, arm) => {
        // Recheck just before creation; never reuse a stale absent result.
        const account = await inspectCompanyDirectory(page, {
          companyId,
          email,
        });
        if (account.status !== "absent")
          throw Error("Existing or unknown identity");
        await page.goto(`${origin}/User?company_id=${companyId}`, {
          waitUntil: "domcontentloaded",
        });
        await page.locator("#btnSave").waitFor({ state: "visible" });
        await prepareDisplayrInvitation(page, {
          companyId,
          email,
          fullName,
          groups: [],
          notes: "Managed EcoFocus portal viewer",
        });
        // Start with zero report groups. Permission sync grants only current assignments
        // after successful activation and independent credential verification.
        arm();
        const response = page.waitForResponse(
          (r) =>
            r.url() === origin + "/User/AjaxNewUser" &&
            r.request().method() === "POST",
        );
        const [result] = await Promise.all([
          response,
          page.locator("#btnSave").click(),
        ]);
        if (result.status() >= 400) throw Error("Invitation submission failed");
        // HTTP success is not proof of creation; the mailbox and next directory read
        // independently reconcile the outcome. Never log response text or form values.
        return { submitted: true };
      }),
  };
}
