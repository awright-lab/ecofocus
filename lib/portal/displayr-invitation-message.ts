import { inspectDisplayrInvitationLink } from "./displayr-invitation-link";
export type GmailPart = {
  mimeType?: string;
  filename?: string;
  body?: { data?: string };
  parts?: GmailPart[];
  headers?: { name: string; value: string }[];
};
export function extractVerifiedInvitation(
  message: { internalDate?: string; payload?: GmailPart },
  expected: { email: string; companyId: string; since: Date },
  now = Date.now(),
) {
  const reject = (): never => {
    throw Error("Invitation verification failed");
  };
  const headers = message.payload?.headers || [];
  const values = (name: string) =>
    headers.filter((h) => h.name.toLowerCase() === name).map((h) => h.value);
  const single = (name: string) => {
    const v = values(name);
    return v.length === 1 ? v[0] : "";
  };
  const addresses = (text: string): string[] =>
    text.toLowerCase().match(/[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9.-]+/g) ||
    [];
  const received = Number(message.internalDate);
  if (
    !/^displayr-provisioning\+[a-f0-9]{32}@ecofocusworldwide\.com$/.test(
      expected.email,
    ) ||
    !Number.isFinite(expected.since.getTime()) ||
    !Number.isFinite(received) ||
    received < expected.since.getTime() ||
    received > now ||
    JSON.stringify(addresses(single("from"))) !==
      JSON.stringify(["support@displayr.com"]) ||
    !addresses(single("to")).includes(expected.email) ||
    !/invit/i.test(single("subject"))
  )
    reject();
  const auth = values("authentication-results")[0] || "";
  if (
    !/^mx\.google\.com\s*;/i.test(auth) ||
    !/\bdkim=pass\b[^;]*\bheader\.(?:i|d)=(?:@)?(?:[a-z0-9-]+\.)*displayr\.com(?=[\s;]|$)/i.test(
      auth,
    ) ||
    !/\bdmarc=pass\b[^;]*\bheader\.from=displayr\.com(?=[\s;]|$)/i.test(auth)
  )
    reject();
  const text: string[] = [];
  let bytes = 0,
    parts = 0;
  const visit = (part: GmailPart, depth: number) => {
    if (depth > 10 || ++parts > 100) reject();
    if (part.filename) return;
    if (
      part.body?.data &&
      ["text/plain", "text/html"].includes(part.mimeType || "")
    ) {
      if (part.body.data.length > 1_000_000) reject();
      const body = Buffer.from(part.body.data, "base64url");
      bytes += body.length;
      if (bytes > 1_000_000) reject();
      text.push(body.toString("utf8").replace(/&amp;/g, "&"));
    }
    for (const child of part.parts || []) visit(child, depth + 1);
  };
  if (message.payload) visit(message.payload, 0);
  const links = new Set<string>();
  for (const body of text)
    for (const match of body.matchAll(
      /https:\/\/app\.displayr\.com\/SignUp\/ConfirmEmail\?[^\s<>"']+/g,
    )) {
      try {
        inspectDisplayrInvitationLink(match[0], expected.companyId);
        links.add(new URL(match[0]).href);
      } catch {
        reject();
      }
    }
  if (links.size !== 1) reject();
  return [...links][0];
}
