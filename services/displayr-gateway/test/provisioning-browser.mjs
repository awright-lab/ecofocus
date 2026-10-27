import { test } from "node:test";
import assert from "node:assert/strict";
import { chromium } from "playwright";
import { createProvisioningBrowser } from "../provisioning-browser.mjs";
const email =
  "displayr-provisioning+" + "a".repeat(32) + "@ecofocusworldwide.com";
const member = (address, id = "9") =>
  `<tr><td><a href="/User?company_id=984256&user_id=${id}">Viewer</a></td><td>${address}</td></tr>`;
const directory = (rows = "", invitation = "", extra = "") =>
  `<table>${member("existing@example.org")}${rows}</table><table><tr><th>Email</th><th>Invited By</th><th>Last Sent</th></tr>${invitation}</table><a href="/User?company_id=984256">New User</a>${extra}`;
const form = () =>
  `<form method="post" action="/User/AjaxNewUser"><input type="hidden" id="txtCompanyID" name="company_id" value="984256"><input type="hidden" id="txtDuplicatesOK" name="duplicates_ok" value="false"><input type="hidden" id="cboUserType" name="cboUserType" value="fixture-viewer"><input id="txtName" name="txtName" type="text"><input id="txtEmail" name="txtEmail" type="email"><textarea id="txtNotes" name="txtNotes"></textarea><select id="cboGroupMembershipSelect" name="cboGroupMembership" multiple><option value="2981029" selected>Dummy 2 Corp</option><option value="2886364" selected>Administrators</option></select><input type="submit" id="btnSave" value="Save"></form>`;
async function fixture(html, formHtml = form()) {
  let writes = 0;
  const fake = {
    launch: async (options) => {
      const browser = await chromium.launch(options),
        newContext = browser.newContext.bind(browser);
      browser.newContext = async (options) => {
        const context = await newContext(options),
          route = context.route.bind(context);
        context.route = async (pattern, guard) =>
          route(pattern, async (r) =>
            guard({
              request: () => r.request(),
              abort: () => r.abort(),
              continue: async () => {
                const req = r.request(),
                  url = new URL(req.url());
                if (req.method() === "POST") {
                  writes++;
                  const data = new URLSearchParams(req.postData());
                  assert.equal(data.get("txtEmail"), email);
                  assert.deepEqual(data.getAll("cboGroupMembership"), []);
                  assert.equal(data.get("company_id"), "984256");
                  assert.equal(data.get("duplicates_ok"), "false");
                  return r.fulfill({ status: 200, body: "Saved" });
                }
                if (url.pathname === "/MyAccount") {
                  assert.equal(url.searchParams.get("tab"), "company");
                  return r.fulfill({ contentType: "text/html", body: html });
                }
                return r.fulfill({ contentType: "text/html", body: formHtml });
              },
            }),
          );
        return context;
      };
      return browser;
    },
  };
  return {
    adapter: createProvisioningBrowser({
      chromium: fake,
      authenticateAdmin: async () => [],
      companyId: "984256",
      executablePath: process.env.TEST_CHROME_PATH,
    }),
    writes: () => writes,
  };
}
test("directory distinguishes existing users, invitations, duplicates and incomplete lists", async () => {
  for (const [html, expected] of [
    [directory(member(email)), "active"],
    [
      directory(
        "",
        `<tr><td>${email}</td><td><a href="/Resend">Resend</a></td></tr>`,
      ),
      "invited",
    ],
    [directory(member(email) + member(email, "10")), "ambiguous"],
    [directory(), "absent"],
    [directory().replaceAll('href="/User?', 'href="User?'), "absent"],
    [
      directory(member(email)).replaceAll('href="/User?', 'href="User?'),
      "active",
    ],
    [directory("", "", '<input type="search">'), "unknown"],
    ["<table>" + member("existing@example.org") + "</table>", "unknown"],
  ]) {
    const f = await fixture(html),
      result = await f.adapter.inspect(email);
    assert.equal(result.status, expected);
    if (expected === "unknown") {
      assert.match(result.diagnostic, /^shape_[0-9]+_[0-9]+_[0-9]+_[01]$/);
      assert(!JSON.stringify(result).includes(email));
    }
    assert.equal(f.writes(), 0);
  }
});
test("creation rechecks absence and submits exactly once with zero groups", async () => {
  const f = await fixture(directory());
  await f.adapter.invite({ email, fullName: "Fixture viewer" });
  assert.equal(f.writes(), 1);
});
test("existing viewer or changed creation form prevents writes", async () => {
  for (const [html, body] of [
    [directory(member(email)), form()],
    [directory(), form().replace("AjaxNewUser", "AjaxEditUser")],
    [directory(), form().replace('value="false"', 'value="true"')],
  ]) {
    const f = await fixture(html, body);
    await assert.rejects(
      f.adapter.invite({ email, fullName: "Fixture viewer" }),
    );
    assert.equal(f.writes(), 0);
  }
});
