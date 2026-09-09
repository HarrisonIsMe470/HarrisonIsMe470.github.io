// These identifiers are public configuration, never credentials.
const code = import.meta.env.PUBLIC_GOATCOUNTER_CODE?.trim() || '';
if (code && !/^[a-z0-9][a-z0-9-]*$/.test(code)) {
  throw new Error('PUBLIC_GOATCOUNTER_CODE must be your GoatCounter site code, not a URL.');
}
export const analyticsURL = code ? `https://${code}.goatcounter.com` : '';
export const giscus = {
  repo: 'HarrisonIsMe470/HarrisonIsMe470.github.io',
  repoId: import.meta.env.PUBLIC_GISCUS_REPO_ID?.trim() || '',
  category: import.meta.env.PUBLIC_GISCUS_CATEGORY?.trim() || 'Announcements',
  categoryId: import.meta.env.PUBLIC_GISCUS_CATEGORY_ID?.trim() || '',
};
export const commentsEnabled = Boolean(giscus.repoId && giscus.categoryId);
