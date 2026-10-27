import { test } from "node:test";
import assert from "node:assert/strict";
import { chromium } from "playwright";
import { activateViewer, sameInvitationTarget } from "../activate-viewer.mjs";
const url = new URL("https://app.displayr.com/SignUp/ConfirmEmail");
for (const key of ["iid", "lid", "sid"])
  url.searchParams.set(key, "11111111-2222-4333-8444-555555555555");
url.searchParams.set("signed_up_by_company_admin", "True");
url.searchParams.set("redir", "/MyReports?company_id=123");

test("submits the observed form once with CSRF and never returns credentials; rejects changed action", async () => {
  for (const variant of ["visible", "hidden", "altered", "readonly"]) {
    const altered = variant === "altered";
    const rejected = altered || variant === "readonly";
    let posts = 0,
      closed = false;
    const wrapped = {
      launch: async (options) => {
        const browser = await chromium.launch({
          ...options,
          args: ["--no-sandbox"],
        });
        return {
          close: async () => {
            closed = true;
            await browser.close();
          },
          newContext: async (options) => {
            const context = await browser.newContext(options);
            const route = context.route.bind(context);
            context.route = async (pattern, handler) => {
              await route(pattern, async (r) => {
                if (r.request().method() === "POST") {
                  posts++;
                  const body = new URLSearchParams(r.request().postData());
                  assert.equal(body.get("csrf"), "synthetic-csrf");
                  assert.equal(body.get("password"), "Synthetic-password-123!");
                  return r.fulfill({
                    contentType: "text/html",
                    body: '<meta http-equiv="refresh" content="0;url=/MyReports?company_id=123">',
                  });
                }
                if (new URL(r.request().url()).pathname === "/MyReports")
                  return r.fulfill({
                    contentType: "text/html",
                    body: "Report library",
                  });
                return r.fulfill({
                  contentType: "text/html",
                  body: `<form style="${variant === "hidden" ? "display:none" : ""}" method="post" ${altered ? 'action="/Wrong"' : ""}><input type="hidden" name="csrf" value="synthetic-csrf"><input type="password" name="password" id="password" ${variant === "readonly" ? "readonly" : ""}><input type="submit" id="formSubmit"></form>`,
                });
              });
              await route(pattern, (r) =>
                handler({
                  request: () => r.request(),
                  abort: () => r.abort(),
                  continue: () => r.fallback(),
                }),
              );
            };
            return context;
          },
        };
      },
    };
    const result = await activateViewer({
      chromium: wrapped,
      link: url.href,
      password: "Synthetic-password-123!",
      companyId: "123",
      executablePath: process.env.TEST_CHROME_PATH,
    });
    assert.equal(closed, true);
    assert.equal(posts, rejected ? 0 : 1);
    assert.equal(result.submitted, !rejected);
    assert.equal(result.reportLibraryReached, !rejected);
    if (altered) {
      assert.equal(result.stage, "check-form");
      assert.equal(result.checks.actionMatches, false);
      assert.equal(result.checks.csrfPresent, true);
    }
    assert.ok(!JSON.stringify(result).includes("Synthetic"));
    assert.ok(!JSON.stringify(result).includes("11111111"));
  }
});

test("invitation comparison accepts equivalent encoding but rejects changed identity or destination", () => {
  const reordered = new URL(url.href);
  reordered.searchParams.sort();
  assert.equal(sameInvitationTarget(reordered.href, url.href, "123"), true);
  const spaced = new URL(url.href);
  spaced.searchParams.set("firstname", "Synthetic Test");
  assert.equal(
    sameInvitationTarget(
      spaced.href.replace("Synthetic+Test", "Synthetic%20Test"),
      spaced.href,
      "123",
    ),
    true,
  );
  reordered.searchParams.set("sid", "aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee");
  assert.equal(sameInvitationTarget(reordered.href, url.href, "123"), false);
  assert.equal(
    sameInvitationTarget(
      url.href.replace("app.displayr.com", "attacker.example"),
      url.href,
      "123",
    ),
    false,
  );
});
