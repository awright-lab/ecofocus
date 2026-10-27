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
  if (!response?.ok()) return { status: "unknown", diagnostic: "http" };
  const landed = new URL(page.url());
  if (
    landed.origin !== origin ||
    landed.pathname !== "/MyAccount" ||
    landed.searchParams.get("company_id") !== companyId ||
    landed.searchParams.get("tab") !== "company"
  )
    return { status: "unknown", diagnostic: "location" };
  try {
    // Resolve hrefs before matching: Displayr may emit User?... without a slash.
    await page.waitForFunction(
      ({ origin, companyId }) =>
        [...document.querySelectorAll("a[href]")].some((a) => {
          try {
            const url = new URL(a.href);
            return (
              url.origin === origin &&
              url.pathname === "/User" &&
              url.searchParams.get("company_id") === companyId
            );
          } catch {
            return false;
          }
        }),
      { origin, companyId },
      { timeout: 12000 },
    );
  } catch {
    return { status: "unknown", diagnostic: "controls" };
  }
  return page.evaluate(
    ({ companyId, email, origin }) => {
      const unknown = { status: "unknown", diagnostic: "row" },
        current = new URL(location.href);
      if (
        current.origin !== origin ||
        current.pathname !== "/MyAccount" ||
        current.searchParams.get("company_id") !== companyId ||
        current.searchParams.get("tab") !== "company"
      )
        return { status: "unknown", diagnostic: "location" };
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
      const filtered = Boolean(
        document.querySelector(
          '.dataTables_paginate,.dt-paging,[aria-label*="pagination" i],input[type="search"],.pagination',
        ),
      );
      if (
        add.length !== 1 ||
        users.length !== 1 ||
        invitations.length !== 1 ||
        filtered
      )
        return {
          status: "unknown",
          diagnostic: `shape_${Math.min(add.length, 99)}_${Math.min(users.length, 99)}_${Math.min(invitations.length, 99)}_${Number(filtered)}`,
        };
      return { status: "absent" };
    },
    { companyId, email, origin },
  );
}
