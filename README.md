# Harrison’s Journal

A static Astro blog for **https://chino520.xyz**, deployed from
`HarrisonIsMe470/HarrisonIsMe470.github.io` with GitHub Actions.

## Design and technology choices

This project extends the existing official Astro blog starter with a small custom
journal theme: navy type, teal accents, local Atkinson fonts, generous reading
space, and responsive layouts. There is no third-party theme to keep in sync.
Existing Markdown/MDX content, images, fonts, and the Astro architecture are retained.
The five original starter posts are now drafts; `welcome.md` is the initial public post.
Replace the introductory copy and monogram avatar with your own details.

The initial site reused the starter dependencies. Content migration adds KaTeX for the recovered mathematical formulas. Dependencies serve these purposes:

| Package/service | Purpose and reason |
| --- | --- |
| Astro | Static pages and typed Content Collections, with minimal browser JavaScript. |
| `@astrojs/mdx` | Existing official integration for components in posts. |
| `@astrojs/rss` | Existing RSS feed at `/rss.xml`. |
| `@astrojs/sitemap` | Existing official integration for sitemap generation. |
| `sharp` | Existing local image processing used by Astro. |
| `katex` | Renders the recovered LaTeX formulas without restoring the old theme runtime. |
| Giscus | Comments **and Like buttons/counts** using GitHub Discussion reactions. One service handles both, with GitHub account-based persistence. |
| GoatCounter | Hosted visitor collection and an embedded live chart; no local database, API token, chart dependency, or scheduled rebuild needed. |

Astro’s [GitHub Pages guide](https://docs.astro.build/en/guides/deploy/github/),
[Content Collections guide](https://docs.astro.build/en/guides/content-collections/),
[Giscus configuration](https://giscus.app), and
[GoatCounter embedding documentation](https://www.goatcounter.com/help/frame)
are the upstream references for this setup. These services support static hosting;
third-party accounts still need the configuration below.

## Local development

Use Node 24 (the workflow uses the same major; package.json requires >=22.12).

```bash
npm install
cp .env.example .env
npm run dev -- --background
```

Open the URL printed by Astro, normally http://localhost:4321.
`npm run dev` also supports foreground development, but this repository’s AGENTS.md
requires background mode when an agent starts a server.

```bash
npm run astro -- dev status
npm run astro -- dev logs
npm run astro -- dev stop
npm run build
npm run preview
```

`npm run build` creates `dist/`; preview serves the production build. Restart the
dev server after changing `.env`. Rebuild before previewing configuration changes.
GoatCounter tracking only loads in production builds and normally ignores localhost.

## Project map

- `src/content.config.ts`: frontmatter schema.
- `src/content/blog/`: Markdown and MDX posts.
- `src/lib/posts.ts`: shared published-post filter and date ordering for pages and RSS.
- `src/layouts/Page.astro`: common HTML, metadata, header, footer.
- `src/layouts/BlogPost.astro`: post layout, tags, dates, comments and likes.
- `src/components/PostList.astro`: reusable list of posts.
- `src/components/Comments.astro`: Giscus embed and unavailable state.
- `src/components/Analytics.astro`: production-only tracking.
- `src/components/Hearts.astro`: site-wide click effect.
- `src/lib/services.ts`: public service settings and GoatCounter code validation.
- `src/data/profile.ts`: introduction, avatar, books, and bucket list.
- `src/data/projects.ts`: typed project entries.
- `src/pages/`: home, blog, About, Projects, Visitors, and RSS routes.
- `src/styles/global.css`: shared theme and responsive styles.
- `public/`: files copied unchanged to the build, including CNAME, avatar, and robots.txt.
- `.github/workflows/deploy.yml`: production build and Pages artifact deployment.

Hearts use six short-lived elements per click, a click-rate limit, compositor
animations, and automatic cleanup. They respect reduced-motion settings and do
not intercept clicks. Clicks inside external comment/chart iframes cannot bubble
into the parent page, so those embedded areas do not trigger hearts.

## Add a blog post

1. Create `src/content/blog/example-post.md` (or `.mdx`). Its file ID becomes
   `/blog/example-post/`; subdirectories can be used for nested URLs.
2. Supply `title`, `description`, and `pubDate`. Optional fields are `updatedDate`,
   `heroImage`, `tags` (defaults to `[]`), and `draft` (defaults to `false`).
3. Write Markdown below the frontmatter. A full example:

```md
---
title: "Example Post"
description: "What I learned while building my personal blog."
pubDate: 2026-09-09
updatedDate: 2026-09-10
tags:
  - Astro
  - Blog
draft: false
# Optional; this existing image path is relative to this Markdown file:
heroImage: ../../assets/blog-placeholder-1.jpg
---

Here is my first paragraph. The layout already prints the post title as an H1.

## What I learned

Astro builds this Markdown into a standalone HTML page.

![An abstract illustration](../../assets/blog-placeholder-1.jpg)

Read more [about me](/about/).
```

4. Store optimized content images in `src/assets/` and reference them with a
   relative path. `heroImage` uses Astro’s image schema and therefore expects a
   source image path, not a public `/images/...` URL. For files served unchanged,
   place them in `public/images/` and use `![Useful alt text](/images/photo.jpg)`.
5. Run the background dev command and visit `/blog/example-post/`. Drafts are
   excluded from routes, lists, RSS, and sitemap in **both** dev and production;
   temporarily set `draft: false` to preview one and restore it before committing
   if it should remain private. Draft source is still visible in a public repository.
6. Run `npm run build`, then `npm run preview` to check the production output.
7. Commit and push the post and any images to `main`. After the deployment workflow
   succeeds, the post appears on the blog, homepage (among the newest four), RSS,
   and sitemap. Dates control order; future-dated posts are not automatically hidden.

MDX is already enabled. Use `.mdx` when you need imports and Astro components;
plain Markdown is preferable for normal prose. The retained starter drafts show
Markdown formatting and MDX examples.

Keep published slugs stable: Giscus maps discussions by pathname. Renaming a file
changes the URL and its discussion mapping; migrate the old discussion title and
provide a redirect page if you change a published slug.

## Comments and persistent likes: Giscus setup

1. Keep this GitHub repository public and enable **Settings → General → Features → Discussions**.
2. Install the [Giscus GitHub app](https://github.com/apps/giscus) with access to this repository.
3. Create/select a Discussion category using the **Announcements** format.
4. On https://giscus.app, enter `HarrisonIsMe470/HarrisonIsMe470.github.io`.
   Select that category, pathname mapping, strict matching, and reactions enabled.
5. Copy the generated `data-repo-id`, `data-category`, and `data-category-id` values
   into `.env` as `PUBLIC_GISCUS_REPO_ID`, `PUBLIC_GISCUS_CATEGORY`, and
   `PUBLIC_GISCUS_CATEGORY_ID`. These are public IDs, not credentials.
6. Add the same values as repository **Settings → Secrets and variables → Actions → Variables**.
7. Rebuild/redeploy. Open a post, sign in to GitHub within Giscus, and click the
   **👍 reaction button** to like it. Reload or visit from another browser/account
   to verify that the same count persists. Click again to remove your reaction.
   Leave a comment and verify the discussion in GitHub.

The native Giscus reaction control is the Like button; there is no separate
anonymous counter or localStorage total. Readers can see counts without signing
in, but must authorize Giscus with GitHub to like or comment. GitHub stores the
reactions and comments, and Giscus creates a missing discussion on first interaction.
Until the IDs are supplied, a disabled Like button and an unavailable notice are
shown. The normal GitHub Discussions link remains a fallback when an enabled
embed is blocked. Moderate comments in GitHub Discussions.

## Daily visitor statistics: GoatCounter setup

1. Create a hosted site at https://www.goatcounter.com for `chino520.xyz`.
2. Put its **site code only** in `PUBLIC_GOATCOUNTER_CODE` (for example,
   `my-journal` for `https://my-journal.goatcounter.com`). Add it to both `.env`
   and the repository’s Actions Variables. Do not enter a URL or an API key.
3. In GoatCounter settings, make **Dashboard viewable by → Everyone** so all
   readers can see the statistics. This intentionally publishes your aggregate
   analytics dashboard, including the breakdowns it displays.
4. Under **Sites that can embed GoatCounter**, allow `https://chino520.xyz`.
   For local preview also allow the exact local origin, such as `http://localhost:4321`.
5. Save and redeploy. Production pages load GoatCounter’s tracking script; `/stats/`
   embeds the live public dashboard with its daily visitor chart and date controls.
   The chart updates from GoatCounter without rebuilding this site.
6. Visit the deployed site with tracking allowed, then check `/stats/` after the
   service processes the visit. Use the public dashboard link if framing or scripts
   are blocked. Verify the chart in a signed-out browser, not just your owner session.

No analytics API token is needed or exposed. Do not put private dashboard access
tokens into iframe URLs. Without a site code the page displays an empty state,
not invented statistics. GoatCounter uses cookie-free session estimates; visitors
and pageviews are different metrics and daily unique counts should not be treated
as a count of distinct people over a month. Ad blockers can undercount visits.
See [session semantics](https://www.goatcounter.com/help/sessions) and
[privacy information](https://www.goatcounter.com/help/privacy).

## Maintain About and Projects

Edit `src/data/profile.ts` for the introduction and avatar path. The avatar now uses the image recovered from the old blog; the original **h.** monogram file is retained. Put your photo in `public/images/`
and update the path and image alt text in `src/pages/about.astro`.

Add books to `books`, for example:

```ts
{ title: 'A book you finished', author: 'Author name', finished: '2026-09',
  note: 'Your thoughts', url: 'https://example.com/book' }
```

Only `title` and `author` are required. The list includes two completed books explicitly named in the old About page. Add bucket-list items as
`{ text: 'Your ambition', completed: false }`; change `completed` to `true` to mark
one done. These are author-maintained data, not browser-persisted checkboxes.

Add objects to `projects` in `src/data/projects.ts`. Required fields are `name`,
`description`, and `technologies`. Optional fields are `image` (e.g.
`/images/project.jpg`), `imageAlt`, `github`, `demo`, `status` (`In progress`,
`Complete`, or `Archived`), and `date`. Missing images/links simply do not render.

## Add an integration or plugin

1. Check its current Astro version compatibility and whether it supports static
   output. GitHub Pages cannot run server adapters, API servers, or SSR endpoints.
2. Install the documented npm package:

   ```bash
   npm install <package>
   ```

3. Astro integrations normally register in `astro.config.mjs`. For example, the
   existing MDX integration is equivalent to:

   ```js
   import mdx from '@astrojs/mdx';
   import { defineConfig } from 'astro/config';

   export default defineConfig({
     site: 'https://chino520.xyz',
     output: 'static',
     base: '/',
     trailingSlash: 'always',
     integrations: [mdx()],
   });
   ```

   **Merge** additions into the existing configuration: retain sitemap, fonts, and
   other integrations. `npx astro add <integration>` can automate supported setups;
   review its diff. A generic npm library is not necessarily an Astro integration
   and may instead be imported directly in a component or registered in `vite.plugins`.
4. Follow the package documentation for additional components, CSS, client scripts,
   public identifiers, or service setup. Interactive framework components may need
   a framework integration and a `client:*` directive. Server credentials must
   never be put in `PUBLIC_*` variables or shipped to the browser.
5. Restart local development, exercise the affected page, run `npm run build`, and
   check it with `npm run preview`. Commit `package.json`, `package-lock.json`, and
   configuration/component changes together before deploying.

## GitHub Pages deployment and custom domain

The repository is a **user site**, so `base` is `/`, not the repository name.
`astro.config.mjs` sets `site: 'https://chino520.xyz'`, static output, and trailing
slashes. Canonical URLs, RSS, sitemap, and internal links match this arrangement.

The prior local project had no `.github/workflows/` and used `example.com` for
`site`. On 2026-09-09, a public HTTPS request to `chino520.xyz` returned **200**
from GitHub Pages, but its HTML was a Jekyll-generated repository landing page,
not the Astro app. This supports the diagnosis that the published source was
being rendered by the default Pages build rather than deploying Astro’s output.
An unauthenticated Pages API request returned 404, so the exact repository Pages
settings could not be verified via that request.

The new workflow follows Astro’s official action: checkout → install dependencies
using the committed npm lockfile → `npm run build` → upload `dist/` as the Pages
artifact → deploy the artifact. `dist/index.html` is the correct entry point.
Do not copy it to the repository root, commit `dist/`, or switch Pages to a source
branch that contains only Astro source files.

One-time repository setup:

1. Open https://github.com/HarrisonIsMe470/HarrisonIsMe470.github.io/settings/pages.
2. Under **Build and deployment → Source**, select **GitHub Actions**.
3. Set/retain **Custom domain → chino520.xyz**, save, and enable **Enforce HTTPS**
   when available. A certificate can take time to provision.
4. Add the service variables described above. The site builds without them, but
   comments/likes and visitor charts remain unavailable until configured.
5. Commit the source changes and workflow, then push `main`. Alternatively, run
   **Actions → Deploy Astro to GitHub Pages → Run workflow** after the workflow
   has been pushed. The `github-pages` environment may require approval if you
   have configured environment protection rules.
6. Wait for both build and deploy jobs to succeed. Verify the homepage and a direct
   post URL at `https://chino520.xyz/blog/welcome/`.

`public/CNAME` contains `chino520.xyz` and Astro copies it to `dist/CNAME`. This
preserves the domain in build artifacts. **For a custom Actions workflow, GitHub
Pages uses the domain in repository settings; CNAME alone does not configure it.**

Public DNS on 2026-09-09 already returned all four correct GitHub Pages A records:

```text
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

Preserve these records (or a supported ALIAS/ANAME to `HarrisonIsMe470.github.io`).
If using `www`, add `www CNAME HarrisonIsMe470.github.io`. Refer to
[GitHub’s custom domain instructions](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)
for optional IPv6 records and domain verification. Check with:

```bash
dig +short chino520.xyz A
curl -I https://chino520.xyz
```

The changes in this working tree are not yet a live deployment. Repository Pages
settings, third-party setup, and the first pushed workflow run still need to be
completed/verified. The existing live domain response does not verify the new build.

## Validation checklist after setup

- Build succeeds; `dist/index.html` and `dist/CNAME` exist.
- Home, About, Projects, Visitors, RSS, and a direct post URL load.
- Drafts do not appear in the output or feed.
- Keyboard navigation works; current navigation is marked; mobile layouts wrap.
- Hearts are brief and disappear; reduced motion disables them.
- Like a post using Giscus, reload, and verify the count in another session.
- Leave a comment and find it in the matching GitHub Discussion.
- Open `/stats/` signed out and confirm that the live daily chart is visible.
- Confirm the Actions deployment completed and the custom domain shows this blog.

## Content Migration

本次从 `git@github.com:HarrisonIsMe470/HarrisonIsMe470-old-blog.git` 的 `main`
迁入内容，来源提交为 `ea1ba1abb8733b2cd81798a77ece90e4b1876e8f`。
完整报告见 [migration/REPORT.md](migration/REPORT.md)，逐文件分类、SHA-256、文章元数据和
旧新 URL 对照见 [migration/manifest.json](migration/manifest.json)。旧仓库临时副本位于
`/private/tmp/HarrisonIsMe470-old-blog`；网站构建不依赖这个临时目录。

### 迁移范围与目录

旧仓库是 Hexo 的发布产物，**没有原始 Markdown/MDX**。因此提取 HTML 中的文章正文，
而不是复制旧主题页面或重新编写文章。11 篇文章全部迁入；保留新站原来的 6 篇内容条目，
合计 17 篇，其中公开 12 篇、原有示例草稿 5 篇。

| 旧路径/内容 | 新路径/处理 |
| --- | --- |
| `2025/MM/DD/<slug>/index.html` 中的正文 | `src/content/blog/legacy/<slug>.md` |
| 文章标题、日期、标签、作者、首页摘要 | 同一 `.md` 的 frontmatter |
| `2025/**` 中的 25 张文章图片 | `public/2025/**`，保留原 URL |
| `images/` 中的 20 个图片资源 | `public/images/`，包括头像、背景、音乐封面、原 loading GIF |
| `music/` 中的 10 首 MP3 | `public/music/`，保留原文件名和 URL |
| 原 APlayer 歌单元数据 | `src/data/music.json`，在 `/music/` 用原生音频控件展示 |
| About 简介、5 个目标及完成状态、2 本已读书 | `src/data/legacy-profile.json`，并入当前 `profile.ts` |
| About 更新历史和 3 个博客待办 | `src/content/pages/legacy-about.html`，显示在当前 `/about/` |
| 旧站名称、INTJ、Meow~、联系方式、友情链接 | `src/data/legacy-site.json`，显示在 About |
| 11 个旧文章 URL | 静态跳转到对应 `/blog/<slug>/` |
| 原归档、标签列表、分页 | 跳转到 `/blog/`，不复制旧框架生成页面 |
| 旧 JS、CSS、Vue、主题、播放器及 Waline 客户端 | 不复制；继续使用当前 Astro 设计和功能 |

没有发现独立 Projects、Resume、Contact 页面、MDX、PDF、视频文件或额外附件。
人生清单中的项目计划按原文保留为待办，没有虚构成已完成项目。
新站已有 Projects 数据、组件、评论/点赞、统计和点击爱心功能仍保留。

### 迁移文章格式

迁移文章使用现有 Astro Content Collection。示例：

```yaml
---
title: "Katex Guide"
description: "A simple guide that helps you write mathematical formula using Katex."
pubDate: "2025-10-29"
tags: ["Hexo", "Mathematics"]
categories: []
author: "Chino520"
draft: false
slug: "Katex-Guide"
legacyHtml: true
legacyPath: "/2025/10/29/Katex-Guide/"
math: true
excerpt: "<p>原站首页摘要 HTML</p>"
sourceRepository: "HarrisonIsMe470/HarrisonIsMe470-old-blog"
sourceCommit: "ea1ba1abb8733b2cd81798a77ece90e4b1876e8f"
---
```

`legacyHtml: true` 表示下方正文为提取出来的 HTML。文章页面直接输出 `post.body`，
避免 Markdown 再次解释代码、HTML、反斜杠、公式或已有锚点。只对仓库作者维护的内容
使用这个开关，不能用来接收访客提交的 HTML。迁移器会拒绝正文中的脚本和事件处理属性。
保留了原文、代码块、表格、引用、图片、标题 ID 和 `#more` 锚点；没有把正文交给旧主题脚本。

原站只展示了日历日期，没有每篇文章的精确更新时间、原始草稿标记或明确封面字段，
所以不伪造这些元数据。`draft: false` 来自其已发布状态；`categories: []` 表示源 HTML
未显示分类。保留可恢复的完整首页摘要为 `excerpt`，`description` 使用摘要文本；纯图片
摘要则以原文章标题作为描述。原始发布时间的时分秒和未发布草稿无法从这个发布仓库恢复。

新增 KaTeX npm 依赖用于原文的公式。`math: true` 启用按需加载的自动渲染，支持
`$...$`、`$$...$$`、`\(...\)`、`\[...\]`，跳过 `pre` 和 `code`，因此教程里的代码
示例仍保持原样。CSS/字体由本项目构建输出，不依赖旧站的 CDN、Vue 或 Hexo 脚本。
JavaScript 被禁用时公式的 TeX 原文仍可阅读。

### 维护新文章与资源

1. 普通新文章放在 `src/content/blog/`；迁入的旧文章集中在 `src/content/blog/legacy/`。
2. 使用普通 Markdown/MDX，不要给新文章添加 `legacyHtml: true`，除非确实维护 HTML 正文。
3. 必填 `title`、`description`、`pubDate`；可选 `updatedDate`、`tags`、`categories`、
   `author`、`draft`、`heroImage`、`slug`、`math`。完整普通文章示例见上方 “Add a blog post”。
4. 新图片建议放 `src/assets/`（Astro 优化）或 `public/images/blog/`（原样发布）。
   迁入图片继续放在原路径，避免破坏旧图片外链。
5. `slug` 明确控制 URL，保留大小写、中文和已有空格。链接到包含空格的 URL 时需编码
   为 `%20`。不要随意改动已发布 slug，否则文章旧链接和 Giscus 的 pathname 映射会变化。
6. 原始 `excerpt` 可保留 HTML，普通描述 `description` 应写纯文本。现有列表使用描述。

```bash
npm install
npm run dev -- --background
npm run astro -- dev status
npm run astro -- dev logs
npm run build
npm run preview
```

默认开发地址为 `http://localhost:4321`；具体以命令输出为准。
迁移完成后照旧提交源文件和 `package-lock.json`，push 到 `main`，由已有
**Deploy Astro to GitHub Pages** workflow 构建并部署 `dist/`。
Pages 的 Source 仍应为 **GitHub Actions**，Custom domain 仍为 `chino520.xyz`。
迁移没有更改 workflow、Astro 的 site/base、CNAME、remote 或 Git 历史。

### 旧 URL 与迁移验证

`src/data/legacy-redirects.json` 保存所有旧新路径映射；
`src/pages/[...legacy].astro` 生成带 canonical、meta refresh 和可点击链接的静态跳转页。
JavaScript 跳转保留查询参数及原锚点。GitHub Pages 静态部署无法提供自定义 HTTP 301。

`/About/` 与 `/about/` 仅大小写不同，macOS 默认文件系统不能安全地同时生成两个目录。
因此使用 `404.astro` 对 `/About`、`/About/`、`/About/index.html` 执行跳转；原 About
标题锚点保留在新页。该特例先收到 HTTP 404，需要 JavaScript 自动跳转，无脚本时可点击
404 页中的 About 链接。其他 28 个旧路径均有实际静态跳转文件。

验证工具（仅维护/审计需要 Python 和 `beautifulsoup4`，正常 Astro 构建不需要）：

```bash
# 如本机没有 BeautifulSoup，可在临时虚拟环境里安装：
python3 -m venv /tmp/blog-migration-tools
/tmp/blog-migration-tools/bin/pip install beautifulsoup4
npm run build
/tmp/blog-migration-tools/bin/python scripts/verify-migration.py /private/tmp/HarrisonIsMe470-old-blog
node scripts/verify-math.mjs
```

`verify-migration.py` 核对全部 94 个源文件的分类、11 篇正文、代码/表格/引用、图片引用、
55 个资源的哈希、旧新 URL、About 完成状态、构建后的本地链接及部署配置不变。
`import-legacy-blog.py` 是首次恢复脚本，已有目标文件会报冲突并停止，不应直接重复导入
覆盖后续编辑。正文变更后应人工审阅差异，不要为了让原始迁移校验通过而还原有效修改。

旧 Waline 的评论位于外部服务，不在旧 Git 仓库中；本次未迁移远端评论数据库。
来源服务地址记录在 manifest，若还需要迁移评论，需另行提供服务端导出。
文章里的外部参考链接和原有示例占位 URL 保持原样；本次验证保证本地路径有效，
不承诺第三方站点、视频或外部账户当前可用。
