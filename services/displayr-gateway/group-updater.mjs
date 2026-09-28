const origin = "https://app.displayr.com";
const privileged = new Set(["2886362", "2886363", "2886364"]);
// Uses the account's actual edit form, not an invented administration API.
// A changed form or ambiguous identity stops the job before submission.
export async function readViewerGroupForm(page, { companyId, email }) {
  return page.evaluate(
    ({ companyId, email, origin }) => {
      const emailField = document.querySelector("#txtEmail");
      const company = document.querySelector("#txtCompanyID");
      const groups = document.querySelector("#cboGroupMembershipSelect");
      const form = emailField?.form;
      if (
        !form ||
        emailField.value.trim().toLowerCase() !== email.toLowerCase() ||
        company?.value !== companyId ||
        company.form !== form ||
        groups?.form !== form ||
        !groups.multiple ||
        groups.disabled ||
        form.method.toUpperCase() !== "POST" ||
        form.querySelector('input[type="password"]')
      )
        return null;
      const action = new URL(form.action);
      if (
        action.origin !== origin ||
        !/^\/User\/[A-Za-z]+$/.test(action.pathname) ||
        /new|create|delete|reset|invite/i.test(action.pathname) ||
        action.search ||
        action.hash
      )
        return null;
      if ([...form.querySelectorAll("[formaction],[formmethod]")].length)
        return null;
      return {
        action: action.href,
        selected: [...groups.selectedOptions].map((o) => o.value),
        options: [...groups.options]
          .filter((o) => !o.disabled)
          .map((o) => ({ id: o.value, label: o.textContent.trim() })),
      };
    },
    { companyId, email, origin },
  );
}
export function createGroupUpdater({
  chromium,
  authenticateAdmin,
  companyId,
  executablePath,
}) {
  if (!/^[1-9][0-9]{0,15}$/.test(companyId))
    throw new Error("Displayr company ID required");
  return async ({ email, groupIds }) => {
    if (
      !Array.isArray(groupIds) ||
      groupIds.some(
        (id) => !/^[1-9][0-9]{0,15}$/.test(id) || privileged.has(id),
      )
    )
      throw new Error("Invalid viewing groups");
    let browser;
    let stage = "administrator_login";
    try {
      const cookies = await authenticateAdmin();
      stage = "browser_setup";
      browser = await chromium.launch({
        headless: true,
        ...(executablePath ? { executablePath } : {}),
      });
      const context = await browser.newContext({ serviceWorkers: "block" });
      await context.addCookies(
        cookies.map((cookie) => ({
          ...cookie,
          expires: cookie.expires ? cookie.expires / 1000 : -1,
        })),
      );
      let permittedPost = null,
        submitted = false;
      await context.route("**/*", (route) => {
        const request = route.request();
        const url = new URL(request.url());
        if (
          request.method() === "POST" &&
          request.url() === permittedPost &&
          !submitted
        ) {
          submitted = true;
          return route.continue();
        }
        if (
          !["GET", "HEAD"].includes(request.method()) ||
          url.protocol !== "https:" ||
          /delete|remove|resetpassword|logout/i.test(url.pathname) ||
          (request.isNavigationRequest() && url.origin !== origin)
        )
          return route.abort();
        return route.continue();
      });
      const page = await context.newPage();
      page.setDefaultTimeout(12_000);
      stage = "account_page";
      await page.goto(`${origin}/MyAccount?company_id=${companyId}`, {
        waitUntil: "domcontentloaded",
      });
      stage = "viewer_lookup";
      const editUrl = await page.evaluate(
        ({ email, origin }) => {
          const rows = [...document.querySelectorAll("tr")].filter((row) =>
            [...row.querySelectorAll("td")].some(
              (cell) =>
                cell.textContent.trim().toLowerCase() === email.toLowerCase(),
            ),
          );
          if (rows.length !== 1) return null;
          const urls = [...rows[0].querySelectorAll("a[href]")]
            .map((a) => new URL(a.href))
            .filter(
              (url) =>
                url.origin === origin &&
                /^\/User\/?$/.test(url.pathname) &&
                url.search &&
                !url.hash,
            );
          return urls.length === 1 ? urls[0].href : null;
        },
        { email, origin },
      );
      if (!editUrl) throw new Error("Unique existing viewer required");
      stage = "edit_page";
      await page.goto(editUrl, { waitUntil: "domcontentloaded" });
      stage = "edit_form";
      const before = await readViewerGroupForm(page, { companyId, email });
      if (
        !before ||
        before.selected.some((id) => privileged.has(id)) ||
        groupIds.some(
          (id) =>
            before.options.filter(
              (o) =>
                o.id === id &&
                !/^(Administrators|Create\/Edit Documents|View Documents)$/i.test(
                  o.label,
                ),
            ).length !== 1,
        )
      )
        throw new Error("Unexpected viewer form");
      if (
        JSON.stringify([...before.selected].sort()) !==
        JSON.stringify([...groupIds].sort())
      ) {
        stage = "group_submission";
        // Native selection avoids invoking change handlers before the write guard.
        await page
          .locator("#cboGroupMembershipSelect")
          .evaluate((select, ids) => {
            for (const option of select.options)
              option.selected = ids.includes(option.value);
          }, groupIds);
        permittedPost = before.action;
        const responsePromise = page.waitForResponse(
          (response) =>
            response.url() === permittedPost &&
            response.request().method() === "POST",
        );
        await page.getByRole("button", { name: "Save", exact: true }).click();
        const response = await responsePromise;
        permittedPost = null;
        if (!submitted || response.status() >= 400)
          throw new Error("Group update failed");
      }
      stage = "group_readback";
      await page.goto(editUrl, { waitUntil: "domcontentloaded" });
      const after = await readViewerGroupForm(page, { companyId, email });
      if (!after) throw new Error("Readback unavailable");
      return after.selected;
    } catch {
      const failure = new Error("Displayr group synchronization failed");
      failure.permissionStage = stage;
      console.warn("[displayr-permissions] group update failed", { stage });
      throw failure;
    } finally {
      if (browser) await browser.close().catch(() => {});
    }
  };
}
