/** Prepare the observed Displayr form. This function never submits it. */
export async function prepareDisplayrInvitation(page, { companyId, fullName, email, notes = '', groups }) {
  const invalid = () => { throw new Error('Invitation preparation validation failed'); };
  if (!/^[1-9][0-9]{0,15}$/.test(companyId) || typeof fullName !== 'string' || !fullName.trim() || fullName.length > 200 ||
      typeof notes !== 'string' || notes.length > 2000 ||
      !/^displayr-provisioning\+[a-f0-9]{32}@ecofocusworldwide\.com$/.test(email) ||
      !Array.isArray(groups) || !groups.length || new Set(groups.map(g => g.id)).size !== groups.length) invalid();
  const forbidden = new Set(['2886364', '2886363', '2886362']);
  for (const group of groups) {
    if (!/^[1-9][0-9]*$/.test(group.id) || !group.label || group.viewOnlyVerified !== true ||
        group.dashboardAccessVerified !== true || forbidden.has(group.id) ||
        /^(Administrators|Create\/Edit Documents|View Documents)$/i.test(group.label)) invalid();
  }
  // Validate everything before changing the DOM; preserve hidden defaults and tokens.
  const prepared = await page.evaluate(({ companyId, fullName, email, notes, groups }) => {
    const url = new URL(location.href);
    if (url.origin !== 'https://app.displayr.com' || url.pathname !== '/User' ||
        url.searchParams.getAll('company_id').length !== 1 || url.searchParams.get('company_id') !== companyId) return false;
    const form = document.querySelector('#txtEmail')?.form;
    if (!form || form.method.toUpperCase() !== 'POST') return false;
    const action = new URL(form.action);
    if (action.origin !== url.origin || action.pathname !== '/User/AjaxNewUser' || action.search || action.hash) return false;
    const fields = [
      ['txtCompanyID', 'company_id', 'hidden'], ['txtDuplicatesOK', 'duplicates_ok', 'hidden'],
      ['cboUserType', 'cboUserType', 'hidden'], ['txtName', 'txtName', 'text'],
      ['txtEmail', 'txtEmail', 'email'], ['txtNotes', 'txtNotes', 'textarea'],
      ['cboGroupMembershipSelect', 'cboGroupMembership', 'select-multiple'],
    ].map(([id, name, type]) => {
      const field = document.getElementById(id);
      return field?.form === form && field.name === name && field.type === type ? field : null;
    });
    if (fields.some(field => !field) || fields[0].value !== companyId) return false;
    const select = fields[6];
    if (groups.some(group => [...select.options].filter(option => option.value === group.id && option.textContent.trim() === group.label && !option.disabled).length !== 1)) return false;
    fields[3].value = fullName.trim(); fields[4].value = email; fields[5].value = notes;
    for (const option of select.options) option.selected = groups.some(group => group.id === option.value);
    // No change events: site handlers could submit or make unexpected writes.
    return true;
  }, { companyId, fullName, email, notes, groups });
  if (!prepared) invalid();
  return { companyId, fullName: fullName.trim(), email, groups: groups.map(({ id, label }) => ({ id, label })), submitted: false };
}
