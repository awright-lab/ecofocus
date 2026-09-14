// Permission evidence: EcoFocus administrator confirmed 2024 view-only access
// on 2026-09-14. Discovered labels alone must not be added as verified mappings.
export const DISPLAYR_COMPANY_ID = '984256';
const verifiedGroups = Object.freeze({
  'interactive-dashboard-2024': Object.freeze({
    id: '2954016', label: '2024 Dashboard',
    viewOnlyVerified: true, dashboardAccessVerified: true,
  }),
});

/** Resolve server-authorized workspace dashboard assignments, not browser input. */
export function groupsForAssignedDashboards(dashboardIds) {
  if (!Array.isArray(dashboardIds) || !dashboardIds.length) {
    throw new Error('At least one assigned dashboard is required');
  }
  const groups = new Map();
  for (const dashboardId of dashboardIds) {
    if (typeof dashboardId !== 'string' || !Object.hasOwn(verifiedGroups, dashboardId)) {
      throw new Error('Assigned dashboard has no verified Displayr group');
    }
    const group = verifiedGroups[dashboardId];
    groups.set(group.id, { ...group });
  }
  return [...groups.values()];
}
