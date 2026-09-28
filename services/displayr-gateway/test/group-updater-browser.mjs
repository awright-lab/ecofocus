import { test } from "node:test";
import assert from "node:assert/strict";
import { chromium } from "playwright";
import { createGroupUpdater } from "../group-updater.mjs";
const executablePath = process.env.TEST_CHROME_PATH;
const origin = "https://app.displayr.com";
async function fixture(options = {}) {
  let selected = options.selected || ["7"];
  let writes = 0;
  let closed = false;
  const fakeChromium = {
    launch: async (launchOptions) => {
      const browser = await chromium.launch(launchOptions);
      const createContext = browser.newContext.bind(browser);
      browser.newContext = async (opts) => {
        const context = await createContext(opts);
        const installRoute = context.route.bind(context);
        // Fulfill allowed requests locally after applying the adapter's guard.
        context.route = async (pattern, guard) =>
          installRoute(pattern, async (route) => {
            const next = {
              request: () => route.request(),
              abort: () => route.abort(),
              continue: async () => {
                const request = route.request();
                const url = new URL(request.url());
                if (url.pathname === "/MyAccount")
                  return route.fulfill({
                    contentType: "text/html",
                    body: '<table><tr><td><a href="/User?company_id=984256&user_id=9">Viewer</a></td><td>viewer@example.org</td></tr></table>',
                  });
                if (request.method() === "POST") {
                  writes++;
                  const body = new URLSearchParams(request.postData());
                  assert.equal(body.get("csrf"), "fixture-csrf");
                  assert.equal(body.get("txtEmail"), "viewer@example.org");
                  if (!options.ignoreWrite)
                    selected = body.getAll("cboGroupMembership");
                  return route.fulfill({
                    status: 303,
                    headers: { location: "/User?company_id=984256&user_id=9" },
                  });
                }
                return route.fulfill({
                  contentType: "text/html",
                  body: `<form method="POST" action="${options.action || "/User/AjaxEditUser"}"><input id="txtEmail" name="txtEmail" value="${options.wrongEmail ? "other@example.org" : "viewer@example.org"}"><input id="txtCompanyID" name="company_id" type="hidden" value="984256"><input name="csrf" type="hidden" value="fixture-csrf"><select id="cboGroupMembershipSelect" name="cboGroupMembership" multiple>${["7", "8", "2886364"].map((id) => `<option value="${id}" ${selected.includes(id) ? "selected" : ""}>${id === "2886364" ? "Administrators" : id}</option>`).join("")}</select><button>Save</button></form>`,
                });
              },
            };
            await guard(next);
          });
        return context;
      };
      const close = browser.close.bind(browser);
      browser.close = async () => {
        closed = true;
        await close();
      };
      return browser;
    },
  };
  const update = createGroupUpdater({
    chromium: fakeChromium,
    authenticateAdmin: async () => [],
    companyId: "984256",
    executablePath,
  });
  return {
    update,
    get writes() {
      return writes;
    },
    get closed() {
      return closed;
    },
  };
}
test("existing viewer groups are replaced, then independently read back; zero groups revokes access", async () => {
  for (const target of [["7", "8"], []]) {
    const f = await fixture();
    assert.deepEqual(
      (
        await f.update({ email: "viewer@example.org", groupIds: target })
      ).sort(),
      target,
    );
    assert.equal(f.writes, 1);
    assert.equal(f.closed, true);
  }
});
test("identity substitution, create actions and privileged viewers stop before any write", async () => {
  for (const options of [
    { wrongEmail: true },
    { action: "/User/AjaxNewUser" },
    { selected: ["2886364"] },
  ]) {
    const f = await fixture(options);
    await assert.rejects(
      f.update({ email: "viewer@example.org", groupIds: ["8"] }),
    );
    assert.equal(f.writes, 0);
    assert(f.closed);
  }
});
test("readback exposes failed upstream persistence rather than reporting submitted values", async () => {
  const f = await fixture({ ignoreWrite: true });
  assert.deepEqual(
    await f.update({ email: "viewer@example.org", groupIds: ["8"] }),
    ["7"],
  );
  assert.equal(f.writes, 1);
});
