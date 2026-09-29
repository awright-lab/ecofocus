const origin = "https://app.displayr.com";
export function companyDirectoryUrl(companyId) {
  if (typeof companyId !== "string" || !/^[1-9][0-9]{0,15}$/.test(companyId))
    throw Error("Invalid company");
  return `${origin}/MyAccount?company_id=${companyId}&tab=company`;
}
export async function inspectCompanyDirectory(page, { companyId, email }) {
  if (typeof email !== "string" || !email.includes("@"))
    throw Error("Invalid viewer email");
  const response = await page.goto(companyDirectoryUrl(companyId), {
    waitUntil: "domcontentloaded",
  });
  if (!response?.ok()) return { status: "unknown" };
  try {
    await page
      .locator('a[href*="/User?"]')
      .first()
      .waitFor({ state: "attached", timeout: 12000 });
  } catch {
    return { status: "unknown" };
  }
  return page.evaluate(
    ({ companyId, email, origin }) => {
      const unknown = { status: "unknown" },
        current = new URL(location.href);
      if (
        current.origin !== origin ||
        current.pathname !== "/MyAccount" ||
        current.searchParams.get("company_id") !== companyId ||
        current.searchParams.get("tab") !== "company"
      )
        return unknown;
      const parse = (a) => {
        try {
          return new URL(a.href);
        } catch {
          return null;
        }
      };
      const user = (url) =>
        url &&
        url.origin === origin &&
        url.pathname === "/User" &&
        !url.hash &&
        !url.username &&
        !url.password &&
        url.searchParams.getAll("company_id").length === 1 &&
        url.searchParams.get("company_id") === companyId &&
        url.searchParams.getAll("user_id").length === 1 &&
        /^[1-9][0-9]{0,15}$/.test(url.searchParams.get("user_id")) &&
        [...url.searchParams.keys()].every((k) =>
          ["company_id", "user_id"].includes(k),
        );
      const rows = [...document.querySelectorAll("tr")].filter((row) =>
        [...row.querySelectorAll("td")].some(
          (cell) =>
            cell.textContent.trim().toLowerCase() === email.toLowerCase(),
        ),
      );
      if (rows.length > 1) return { status: "ambiguous" };
      if (rows.length === 1) {
        const links = [...rows[0].querySelectorAll("a[href]")],
          users = links.map(parse).filter(user),
          invitations = links.filter((a) =>
            /^resend$/i.test(a.textContent.trim()),
          );
        if (users.length === 1 && !invitations.length)
          return {
            status: "active",
            displayrUserId: users[0].searchParams.get("user_id"),
            editUrl: users[0].href,
          };
        if (!users.length && invitations.length === 1)
          return { status: "invited" };
        return unknown;
      }
      const links = [...document.querySelectorAll("a[href]")].map(parse),
        tables = [...document.querySelectorAll("table")];
      const add = links.filter(
        (url) =>
          url &&
          url.origin === origin &&
          url.pathname === "/User" &&
          url.searchParams.get("company_id") === companyId &&
          !url.searchParams.has("user_id"),
      );
      const users = tables.filter((t) =>
        [...t.querySelectorAll("a[href]")].some((a) => user(parse(a))),
      );
      const invitations = tables.filter(
        (t) =>
          /invited by/i.test(t.textContent) && /last sent/i.test(t.textContent),
      );
      if (
        add.length !== 1 ||
        users.length !== 1 ||
        invitations.length !== 1 ||
        document.querySelector(
          '.dataTables_paginate,.dt-paging,[aria-label*="pagination" i],input[type="search"],.pagination',
        )
      )
        return unknown;
      return { status: "absent" };
    },
    { companyId, email, origin },
  );
}
