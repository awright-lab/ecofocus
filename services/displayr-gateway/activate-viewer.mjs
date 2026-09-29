import { inspectDisplayrInvitationLink } from "../../lib/portal/displayr-invitation-link.ts";
export function sameInvitationTarget(candidate, expected, companyId) {
  try {
    inspectDisplayrInvitationLink(candidate, companyId);
    inspectDisplayrInvitationLink(expected, companyId);
    const entries = (value) =>
      JSON.stringify(
        [...new URL(value).searchParams.entries()].sort(([a], [b]) =>
          a.localeCompare(b),
        ),
      );
    return entries(candidate) === entries(expected);
  } catch {
    return false;
  }
}

// One activation attempt. The coordinator persists credentials and verifies login independently.
export async function activateViewer({
  chromium,
  link,
  password,
  companyId,
  executablePath,
}) {
  inspectDisplayrInvitationLink(link, companyId);
  if (
    typeof password !== "string" ||
    password.length < 16 ||
    password.length > 256
  )
    throw new Error("Use a generated password between 16 and 256 characters");
  let browser;
  let armed = false;
  let submitted = false;
  let postStatus = null;
  let stage = "browser-start";
  let checks = null;
  let pageStatus = null;
  try {
    browser = await chromium.launch({
      headless: true,
      ...(executablePath ? { executablePath } : {}),
    });
    const context = await browser.newContext({
      javaScriptEnabled: false,
      serviceWorkers: "block",
    });
    const target = new URL(link).href;
    await context.route("**/*", (route) => {
      const request = route.request();
      const url = new URL(request.url());
      if (request.method() === "POST") {
        if (
          !armed ||
          submitted ||
          !sameInvitationTarget(url.href, target, companyId) ||
          !request.isNavigationRequest()
        )
          return route.abort();
        submitted = true;
        return route.continue();
      }
      if (
        !["GET", "HEAD"].includes(request.method()) ||
        url.origin !== "https://app.displayr.com"
      )
        return route.abort();
      if (
        request.isNavigationRequest() &&
        !sameInvitationTarget(url.href, target, companyId) &&
        !(
          submitted &&
          url.pathname === "/MyReports" &&
          (!url.searchParams.has("company_id") ||
            url.searchParams.get("company_id") === companyId)
        )
      )
        return route.abort();
      return route.continue({ headers: { ...request.headers(), referer: "" } });
    });
    const page = await context.newPage();
    page.setDefaultTimeout(20000);
    page.on("response", (response) => {
      if (
        response.request().method() === "POST" &&
        sameInvitationTarget(response.url(), target, companyId)
      )
        postStatus = response.status();
    });
    stage = "open-invitation";
    const response = await page.goto(target, { waitUntil: "domcontentloaded" });
    pageStatus = response?.status() ?? null;
    stage = "check-page";
    if (!response?.ok() || !sameInvitationTarget(page.url(), target, companyId))
      throw new Error("Unexpected page");
    stage = "check-form";
    checks = await page.evaluate((target) => {
      const password = document.querySelector("#password");
      const form = password?.form;
      const csrf = form?.querySelectorAll('input[name="csrf"][type="hidden"]');
      const submit = document.querySelector("#formSubmit");
      let actionMatches = false;
      try {
        const actual = new URL(form.action),
          expected = new URL(target);
        const entries = (url) =>
          JSON.stringify(
            [...url.searchParams.entries()].sort(([a], [b]) =>
              a.localeCompare(b),
            ),
          );
        actionMatches =
          actual.origin === expected.origin &&
          actual.pathname === expected.pathname &&
          !actual.username &&
          !actual.password &&
          !actual.hash &&
          entries(actual) === entries(expected);
      } catch {}
      return {
        passwordField:
          password?.type === "password" && password.name === "password",
        postForm: form?.method.toUpperCase() === "POST",
        actionMatches,
        csrfPresent: csrf?.length === 1 && Boolean(csrf[0].value),
        submitControl: submit?.form === form && submit?.type === "submit",
        noSubmitOverrides:
          Boolean(submit) &&
          !submit.hasAttribute("formaction") &&
          !submit.hasAttribute("formmethod"),
        onePasswordField:
          form?.querySelectorAll('input[type="password"]').length === 1,
        passwordEnabled:
          Boolean(password) && !password.disabled && !password.readOnly,
        uniquePasswordId: document.querySelectorAll("#password").length === 1,
        uniqueSubmitId: document.querySelectorAll("#formSubmit").length === 1,
        submitEnabled: Boolean(submit) && !submit.disabled,
      };
    }, target);
    if (!Object.values(checks).every((value) => value === true))
      throw new Error("Unexpected form");
    stage = "fill-password";
    // JavaScript-disabled pages can leave the valid form hidden behind a loading
    // layer. Populate the checked native field without waiting for visual layout.
    await page.locator("#password").evaluate((field, value) => {
      if (field.disabled || field.readOnly || field.type !== "password")
        throw new Error("Field unavailable");
      Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        "value",
      ).set.call(field, value);
    }, password);
    stage = "submit";
    armed = true;
    await page.locator("#formSubmit").evaluate((submit) => {
      // requestSubmit preserves browser validation and the original CSRF field.
      if (submit.disabled || !submit.form)
        throw new Error("Submit unavailable");
      HTMLFormElement.prototype.requestSubmit.call(submit.form, submit);
    });
    stage = "wait-for-library";
    await page.waitForURL(
      (url) =>
        url.origin === "https://app.displayr.com" &&
        url.pathname === "/MyReports",
      { timeout: 20000 },
    );
    return {
      submitted,
      postStatus,
      reportLibraryReached: true,
      credentialsSaved: false,
    };
  } catch {
    // Even a transport error after submission can mean the account was activated.
    return {
      submitted,
      postStatus,
      stage,
      pageStatus,
      checks,
      reportLibraryReached: false,
      outcome: submitted ? "needs-verification" : "not-submitted",
      credentialsSaved: false,
    };
  } finally {
    await browser?.close().catch(() => {});
  }
}
