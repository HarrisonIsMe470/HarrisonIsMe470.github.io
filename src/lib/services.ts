// These identifiers are public configuration, never credentials.
const code = import.meta.env.PUBLIC_GOATCOUNTER_CODE?.trim() || '';
if (code && !/^[a-z0-9][a-z0-9-]*$/.test(code)) {
  throw new Error('PUBLIC_GOATCOUNTER_CODE must be your GoatCounter site code, not a URL.');
}
export const analyticsURL = code ? `https://${code}.goatcounter.com` : '';
export const walineURL = (import.meta.env.PUBLIC_WALINE_SERVER_URL?.trim() || 'https://waline-for-astro.vercel.app').replace(/\/$/, '');
