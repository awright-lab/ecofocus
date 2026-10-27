const ORIGIN = "https://app.displayr.com";
const PATH = "/SignUp/ConfirmEmail";
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const PARAMETERS = new Set([
  "iid",
  "lid",
  "sid",
  "ajs_aid",
  "firstname",
  "signed_up_by_company_admin",
  "redir",
]);

/** Structural validation only: does not authenticate mail, bind a recipient, or visit the URL. */
export function inspectDisplayrInvitationLink(
  raw: string,
  expectedCompanyId: string,
) {
  const reject = (): never => {
    throw new Error("Invalid Displayr invitation link");
  };
  if (
    typeof raw !== "string" ||
    raw.length > 8192 ||
    /[\s\\]/.test(raw) ||
    !/^[1-9][0-9]{0,15}$/.test(expectedCompanyId)
  )
    return reject();
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return reject();
  }
  if (
    url.origin !== ORIGIN ||
    url.pathname !== PATH ||
    url.username ||
    url.password ||
    url.hash
  )
    return reject();
  for (const key of url.searchParams.keys()) {
    if (!PARAMETERS.has(key) || url.searchParams.getAll(key).length !== 1)
      return reject();
  }
  for (const key of ["iid", "lid", "sid"]) {
    if (!UUID.test(url.searchParams.get(key) || "")) return reject();
  }
  if (
    url.searchParams.has("ajs_aid") &&
    !UUID.test(url.searchParams.get("ajs_aid") || "")
  )
    return reject();
  if (url.searchParams.get("signed_up_by_company_admin") !== "True")
    return reject();
  const redirect = url.searchParams.get("redir");
  // Accept only the observed relative destination, never an arbitrary post-activation redirect.
  if (redirect !== `/MyReports?company_id=${expectedCompanyId}`)
    return reject();
  return {
    origin: ORIGIN,
    path: PATH,
    companyId: expectedCompanyId,
    parameterNames: [...url.searchParams.keys()].sort(),
    recipientVerified: false as const,
    activated: false as const,
  };
}
