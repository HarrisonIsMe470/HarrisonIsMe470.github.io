# Journal API deployment

The Astro site remains static on GitHub Pages. Deploy this directory on a Node 24 LTS host with a persistent disk and HTTPS reverse proxy. It has no npm dependencies. Never copy its database into public/ or dist/.

1. Set `DATABASE_PATH` to a persistent, private absolute path, `SITE_ORIGIN=https://chino520.xyz`, `NODE_ENV=production`, and optionally `PORT=8787`.
2. Run `node backend/server.mjs` under your host's process supervisor. It listens on loopback; proxy `https://api.chino520.xyz` to it. Use a same-site subdomain so SameSite=Lax session cookies work. Configure TLS, a 9 MB request limit, and request rate limits at the proxy. Back up the SQLite database with a SQLite-aware backup tool.
3. Set the GitHub repository Actions variable `PUBLIC_API_URL` to `https://api.chino520.xyz` (the deployment workflow passes it into the build) and rebuild. This URL is public; never put credentials in PUBLIC variables.
4. Time Machine requires no account: anyone who finds the page or API can read, create, and edit stories. The discovery sequence only hides its navigation link. Blog interactions now use the separate Waline server linked from `/account/`. The legacy membership table and helper are retained for existing databases but no longer control story access.

For local development, run `node backend/server.mjs`, set `PUBLIC_API_URL=http://localhost:8787` in `.env`, and run `npm run dev -- --background`. Stop Astro with `npm run astro -- dev stop`.

## Security and behavior

Passwords use salted scrypt. Opaque sessions are hashed in SQLite and carried in HttpOnly cookies (Secure in production). Sessions have a fixed 15-minute lifetime, no silent renewal, and are revoked on logout. Story reads, creation, and editing are public and do not depend on a session. Comments may be edited/deleted only by their creator; deletion retains a tombstone so replies survive. Each account has one toggleable like/dislike per post.

Photos are stored with stories in the database and returned publicly through the stories API; separate photo URLs are not generated. Up to four JPEG/PNG/WebP photos per story, 1.5 MB each. Timeline dates are stored in UTC and displayed in the viewer's local timezone. New uploads replace existing photos when editing; the removal checkbox clears them.

Discovery: open 04 About, click the turtle decoration once, then the jellyfish decoration once, then type 20260824 on the keyboard; no input or prompt appears. The eighth digit automatically checks the code. Enter/Space activation on each button offers a keyboard alternative. Each step has a 15-second timeout; wrong order/code, Escape, hiding the tab, and navigation reset the sequence. The decorations sit at the bottom of About. Timeouts and failures are silent. Touch-only devices need a hardware keyboard for the invisible code entry. Success reveals 07 during the current page session, including Astro navigation. Every full refresh clears discovery; refreshing Time Machine returns to About. Discovery is kept only in memory, never browser storage. This is a public-source gimmick, never authentication. The static Time Machine route contains only the UI shell.

Registration/login have per-IP attempt limits; put stronger abuse controls at the proxy for a public service. Password reset and email verification are not implemented. Existing Giscus discussions remain on GitHub; they are not migrated to the new account system.

Validation: `node --test tests/community.test.mjs` and `npm run build`. Tests use an isolated in-memory database and exercise real HTTP requests, unauthorized access, ownership, cross-post reply rejection, reaction switching, anonymous story reads/creation/editing, account expiry, logout and the discovery state machine.
