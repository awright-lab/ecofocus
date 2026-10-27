import { test } from "node:test";
import assert from "node:assert/strict";
import { extractVerifiedInvitation } from "../lib/portal/displayr-invitation-message.ts";
const email =
  "displayr-provisioning+" + "a".repeat(32) + "@ecofocusworldwide.com";
const link =
  "https://app.displayr.com/SignUp/ConfirmEmail?iid=11111111-1111-4111-8111-111111111111&lid=22222222-2222-4222-8222-222222222222&sid=33333333-3333-4333-8333-333333333333&signed_up_by_company_admin=True&redir=%2FMyReports%3Fcompany_id%3D984256";
const expected = { email, companyId: "984256", since: new Date("2026-09-28") };
function fixture() {
  return {
    internalDate: String(Date.parse("2026-09-29")),
    payload: {
      mimeType: "text/html",
      headers: [
        { name: "From", value: "Displayr <support@displayr.com>" },
        { name: "To", value: email },
        { name: "Subject", value: "You have been invited" },
        {
          name: "Authentication-Results",
          value:
            "mx.google.com; dkim=pass header.i=@displayr.com; dmarc=pass header.from=displayr.com;",
        },
      ],
      body: {
        data: Buffer.from(
          '<a href="' + link.replaceAll("&", "&amp;") + '">Get started</a>',
        ).toString("base64url"),
      },
    },
  };
}
test("authenticated invitation must match recipient and company", () =>
  assert.equal(
    extractVerifiedInvitation(fixture(), expected, Date.parse("2026-09-30")),
    link,
  ));
test("wrong identity, stale mail, untrusted authentication and ambiguous links are rejected", () => {
  for (const mutate of [
    (m) => (m.payload.headers[1].value = "other@example.org"),
    (m) => (m.internalDate = "0"),
    (m) => (m.payload.headers[0].value = "attacker@example.org"),
    (m) =>
      (m.payload.headers[3].value = "mx.google.com; dkim=fail; dmarc=fail"),
    (m) =>
      m.payload.headers.unshift({
        name: "Authentication-Results",
        value:
          "attacker.example; dkim=pass header.i=@displayr.com; dmarc=pass header.from=displayr.com;",
      }),
    (m) =>
      (m.payload.body.data = Buffer.from(
        link + " " + link.replace("sid=33333333", "sid=44444444"),
      ).toString("base64url")),
  ]) {
    const m = fixture();
    mutate(m);
    assert.throws(() =>
      extractVerifiedInvitation(m, expected, Date.parse("2026-09-30")),
    );
  }
  assert.throws(() =>
    extractVerifiedInvitation(
      fixture(),
      { ...expected, companyId: "123" },
      Date.parse("2026-09-30"),
    ),
  );
});
