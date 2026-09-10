# Personal journal theme

Adapted on 10 September 2026 from [MarcusHoltz/astro-marketing-theme](https://github.com/MarcusHoltz/astro-marketing-theme), commit `a2ce8f0ea066971983ef2733fd0f562e79227280`.

The charcoal and gold palette, light palette, fixed sidebar, numbered navigation, display typography, and banded section headings inform this adaptation. The reference files are `src/styles/global.css`, `src/components/Sidebar.astro`, `src/components/Hero.astro`, and `src/layouts/Layout.astro`. The implementation stays in this repository’s Astro components and plain CSS, preserving its content collections and GitHub Pages setup. Marketing sections, service pages, external forms, and the upstream embedded logo font are omitted. Upstream did not include a license file at the recorded commit; this note does not grant rights to upstream material.

Inter Variable and Oswald Variable are served locally through their Fontsource packages, which include their font licenses. Colors, spacing, and responsive layouts live in `src/styles/global.css`; the sidebar and theme preference live in `src/components/Header.astro`.

## Music

Add audio files to `public/music/` (subdirectories work), then restart the development server or rebuild the site. Supported extensions: mp3, m4a, ogg, wav, aac, flac, opus; actual playback support depends on the browser. The playlist is discovered during the build. Existing cover art is read from `src/data/music.json`; new files use the profile image as a fallback. Filenames in `Artist - Title` format provide display metadata.

The shared player starts with a random selection. Press Play once to allow audio, then tracks play in shuffled cycles without immediate repeats. Next skips to another track, and the Music page can select any track. Astro’s ClientRouter and `transition:persist` retain the audio element across internal page navigation. Reloading the page or following a legacy redirect starts a fresh player session. Playback starts only after a user gesture.

## Content changes

Update History is now editable in `src/data/updates.json`: store ISO dates and plain text; the component displays Day Month Year. The six entries include `10 September 2026 — 迁移至新blog框架Astro`.

The welcome post, Harrison’s Journal project, and entire friend-links section were removed by request. The 11 migrated articles, asset copies, and legacy redirects remain intact. `migration/REPORT.md` describes the original migration before these edits; `scripts/verify-migration.py` reflects the current 16 content entries (11 published, 5 drafts) and reformatted history.
