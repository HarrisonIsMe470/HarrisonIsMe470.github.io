# Harrison’s Universe

A static Astro blog for **https://chino520.xyz**, deployed from
`HarrisonIsMe470/HarrisonIsMe470.github.io` with GitHub Actions.

## Design and technology choices

This project extends the official Astro blog starter with a charcoal-and-gold
sidebar design adapted from MarcusHoltz’s Astro Marketing Theme, local fonts,
light/dark modes, and responsive layouts. See [THEME.md](THEME.md) for attribution.
Markdown/MDX content and recovered legacy assets remain in the Astro project.
Accounts and comments use Waline; Time Machine stories use a separate Node/SQLite API.

The initial site reused the starter dependencies. Content migration adds KaTeX for the recovered mathematical formulas. Dependencies serve these purposes:

| Package/service | Purpose and reason |
| --- | --- |
| Astro | Static pages and typed Content Collections, with minimal browser JavaScript. |
| `@astrojs/mdx` | Existing official integration for components in posts. |
| `@astrojs/rss` | Existing RSS feed at `/rss.xml`. |
| `@astrojs/sitemap` | Existing official integration for sitemap generation. |
| `sharp` | Existing local image processing used by Astro. |
| `katex` | Renders the recovered LaTeX formulas without restoring the old theme runtime. |
| Waline | Threaded comments, accounts, and article reactions via the configured Vercel server. |
| GoatCounter | Hosted visitor collection and an embedded live chart; no local database, API token, chart dependency, or scheduled rebuild needed. |

Astro’s [GitHub Pages guide](https://docs.astro.build/en/guides/deploy/github/),
[Content Collections guide](https://docs.astro.build/en/guides/content-collections/),
[Waline configuration](https://waline.js.org/en/guide/get-started/), and
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
- `src/components/Comments.astro`: Waline comments, threaded replies, reactions, and login integration.
- `src/components/PostShare.astro`: native sharing/URL copying beside the post title.
- `src/components/Discovery.astro`: interactive marine decorations and invisible About unlock sequence.
- `src/lib/unlock.mjs`: ordered discovery steps, code validation, and timeout/reset rules.
- `src/lib/discovery-session.ts`: in-memory discovery state, cleared by a full refresh.
- `src/pages/account.astro`: styled Waline account entry and session states.
- `src/lib/waline-login.ts`: managed login/register/recovery windows and message validation.
- `src/lib/waline-session.ts`: shared Waline session storage and server token verification.
- `src/scripts/waline-account.ts`: account UI, authentication callbacks, and logout.
- `src/pages/time-machine.astro`: underwater timeline and story editor.
- `src/scripts/community.ts`: timeline loading/editing and discovery-link synchronization.
- `src/styles/community.css`: account, timeline, and marine interaction styles.
- `backend/server.mjs`: story API and retained legacy account/comment endpoints.
- `backend/membership.mjs`: legacy membership helper; no longer gates stories.
- `backend/README.md`: separate API deployment instructions.
- `tests/`: community API, discovery, Waline lifecycle, session, and login regression tests.
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

Keep published slugs stable: Waline maps discussions by pathname. Renaming a file
changes the URL and its discussion mapping; migrate the old comment path and
provide a redirect page if you change a published slug.

## 本次对话改动汇总

以下按最终保留的实现整理，包含中途调整、问题修复和仍需完成的部署配置。

### 最终架构与需求变更

| 范围 | 最终实现 |
| --- | --- |
| 网站 | Astro 静态生成，由 GitHub Actions 部署到 GitHub Pages。 |
| 账户、评论、回复 | 使用独立部署的 Waline 服务；网站提供账户入口和共享登录状态。 |
| 点赞／点踩 | 使用 Waline reactions；不再使用旧自建服务的账户绑定投票。 |
| 分享 | 放在博客标题旁，原生分享或复制文章链接。 |
| 07 Time Machine | About 隐藏交互揭示入口；故事由独立 Node/SQLite API 保存。 |
| 故事访问权限 | 按后续明确决定，浏览、新建和编辑全部公开，无需登录。 |

最初实现过自建注册、登录、评论和受会员权限保护的秘密空间；后来账户与评论切换到
Waline，秘密空间改为公开故事 API。**隐藏入口只是客户端彩蛋，不是访问控制**；
知道页面或 API 地址的人可以访问故事数据并修改故事。刷新隐藏入口也不会改变这个事实。

| 对话中的早期方案 | 后续调整后的状态 |
| --- | --- |
| 双击 🐚 → 🌊 → 🌙，显示密码输入框 | 已移除；改为底部装饰中的两个固定单击步骤和后台键盘输入。 |
| 显示发现提示、超时提示、密码输入框 | 全部移除；失败和重置保持静默。 |
| 解锁后跨刷新保留 07 | 已移除持久化；每次完整刷新重新隐藏。 |
| Time Machine 需要认证、会员授权和短会话 | 用户明确改为公开浏览和编辑；旧会员辅助代码保留但不再控制故事权限。 |
| 自建账户／评论及密码长度规则 | 前端切换到 Waline；旧后端取消密码格式和最小长度要求。 |
| 注册／找回密码保留网站窗口的改动曾回滚 | 后续重新加回，并重新设计 Return to website 按钮；这是最终保留版本。 |

### Waline 评论、账户与分享

已接入 `@waline/client`，默认服务地址为
[waline-for-astro.vercel.app](https://waline-for-astro.vercel.app/)，管理入口为
[Waline 后台](https://waline-for-astro.vercel.app/ui)。可用 `PUBLIC_WALINE_SERVER_URL`
覆盖默认地址，无需为了使用当前服务额外设置 GitHub 变量。

- 评论组件支持评论、线程回复以及 Waline 提供的本人评论编辑／删除操作。客户端设置
  `login: 'force'`；服务端还需设置 **`LOGIN=force` 并重新部署**，才在后端强制登录。
  本次未确认该线上环境变量已配置，也未用真实账户完成权限验收。
- 每篇文章以 canonical pathname 区分讨论。Astro 导航前销毁旧实例，新文章只挂载一次，
  并同步网站深浅主题；关闭 Waline pageview 统计，访客统计仍使用 GoatCounter。
- 添加 👍／👎 reactions。它们遵循 Waline 的反应计数机制，不承诺旧后端的
  “每个账户只能保留一个赞或踩”约束。旧自建／Giscus 账户与评论没有自动迁移。
- 删除 `Join the conversation`，评论区域保留简洁的 `Comments` 标识。
- Share 从评论区移至博客标题旁，使用金色纸飞机和轻量文字，带悬停反馈和复制成功状态。
  支持浏览器原生分享，缺少该能力时复制链接；处理取消和失败，移动端可换行。

`/account/` 重做为黑灰与金色的双栏布局，加入星轨装饰、登录／注册卡片，适配浅色主题和
移动端。登录后展示头像、名称、头像缺失时的首字母，以及浏览博客和登出入口。
实际凭据表单由 Waline 托管界面提供，网站不再维护另一套注册密码表单。

账户页与评论组件共用 `WALINE_USER` 状态：记住登录时用 localStorage，否则用
sessionStorage；登出清空两者并通知同页组件。收到 token 后通过 Waline
`GET /api/token` 校验，区分过期与服务不可用；URL 回调中的 token 会先从地址栏移除。
异步回调和 Astro 页面切换有清理逻辑，避免迟到响应恢复旧状态。

### 登录、登出、注册跳转修复

修复了“网站登出后再登录，自动进入上一个账户”，以及“登出后点击注册，却进入旧账户后台”
的问题。登录、注册、找回密码统一经过 `src/lib/waline-login.ts` 的窗口适配器：

1. 打开 Waline 的 `/ui/login`、`/ui/register` 或 `/ui/forgot`，附带
   `lng=en&token=waline-login-required`。这个故意无效的非秘密 token 利用 Waline
   管理界面 URL token 优先级，覆盖其记住的旧 `TOKEN`，从匿名状态开始。
2. 网站保留在原窗口，Waline 在单独窗口或标签页中打开。这样即使点击 Waline 内部的
   `Back to home` 或其他链接，原网站仍然存在；没有重写跨域后台内部链接。
3. 只接收来自配置的 Waline origin 且来自刚打开窗口的登录消息；收到消息后关闭弹窗并
   聚焦网站，网站另经服务端验证 token 后才接受登录状态。
4. 原网站提供 `Return to website`，可取消流程并恢复焦点。按钮改为细分隔线、圆形金色
   返回箭头和轻量文字，支持悬停与减少动态效果设置。
5. 处理弹窗被拦截、关闭、取消和超时；登录等待 2 分钟，注册／找回密码等待 15 分钟。

网站登出只清理网站会话，不会撤销 Waline 服务端 token，也不会登出其他已打开的后台。
这个兼容方案基于对话中检查的服务端 1.41.6 及当时的管理界面代码；升级 Waline 管理端后
应复测 URL token 优先级。它不是 Waline 官方的跨域登出接口。

### 04 About：海洋装饰与隐藏入口

在 About 正文和旧站 About 内容之后，自然散布 🐢、🐠、🪼、🐙 四个海洋生物装饰，
使用不同大小、位置及轻微浮动。每个装饰都可点击：海龟游动、鱼快速穿梭、水母收缩发光、
章鱼摆动，并生成会自动清理的气泡；减少动态效果设置会关闭动画和气泡。

最终解锁方式：打开 **04 About**，**单击海龟 🐢 → 单击水母 🪼 → 键盘输入 `20260824`**。
第八个数字输入后自动检查，不需要 Enter。页面没有密码输入框，也没有暗示、成功、失败或
超时文案。装饰使用原生按钮和生物名称的无障碍标签，可用 Enter／Space 激活；
纯触屏设备当前需要外接键盘才能完成隐藏数字输入。

每一步有 15 秒时限。错误顺序、点击其他装饰、错误的八位数字、Escape、隐藏标签页或
Astro 页面导航都会静默重置；数字输入支持 Backspace，并忽略输入框内的键盘操作。
正确输入后显示导航项 **07 Time Machine**，在本次 Astro 站内导航中保留。

解锁状态只放在内存中，不写入 localStorage 或 sessionStorage。**每次完整刷新都会隐藏
07**；刷新 Time Machine 或未解锁直接访问该路由时，客户端隐藏页面并返回 About。
`/account/` 和 `/time-machine/` 从 sitemap 排除，但页面源码和公开 API 不受此限制。

### 07 Time Machine：故事时间线与编辑

`/time-machine/` 使用深海蓝绿色背景和海洋装饰。桌面端故事卡片交替分布在垂直时间线两侧，
移动端改为单侧排列；可展开故事详情、筛选年份、切换最早／最新顺序。

| 故事字段 | 规则 |
| --- | --- |
| Title | 必填，最多 160 字符。 |
| Date and time | 必填，保存为 UTC，按浏览者本地时区显示。 |
| Photos | 可选，最多 4 张 JPEG／PNG／WebP，每张最多 1.5 MB。 |
| Description | 可选，最多 10,000 字符。 |

任何人都可新建或编辑故事，保存后重新加载并按故事日期定位。编辑时新上传图片会替换旧图，
勾选移除图片会清空，否则保留原图。照片以 data URL 存入数据库，并随故事公开返回。
页面处理加载、空列表、未配置 API 和保存失败状态；当前没有故事删除接口。

故事服务仍需独立部署，不能由 GitHub Pages 静态文件保存数据。配置及运行方式见
[backend/README.md](backend/README.md)：使用 Node 24、持久化 SQLite 数据库、HTTPS
反向代理，设置 `DATABASE_PATH`、`SITE_ORIGIN=https://chino520.xyz`、`NODE_ENV=production`
和可选 `PORT`。`api.chino520.xyz` 只是文档中的部署示例，不代表已部署。
将实际 API 地址写入网站的 `PUBLIC_API_URL` 后重新构建。Waline 服务不负责保存这些故事。

旧自建服务保留 `/auth/*`、`/comments`、`/comments/:id`、`/reactions` 接口及已有数据库：
密码采用加盐 scrypt；会话 token 哈希保存，使用 HttpOnly cookie，固定 15 分钟过期，
登出撤销。旧评论要求登录，只允许作者编辑／删除，删除保留回复占位，拒绝跨文章回复；
旧投票支持每账户单一赞／踩切换。这些机制不再用于当前前端的 Waline 账户或公开故事。
取消密码最小长度和格式要求后，旧后端仍要求非空，保留 4096 字节请求保护上限。
旧后端没有密码重置和邮箱验证功能，当前这些功能由 Waline 处理。

### Gmail 密码重置邮件：方案已确定，配置待完成

测试 Waline 找回密码时出现 `Failed to send reset password email, please try again later!`。
用户已确认尚未配置邮件服务，并选择使用 **haochen.qiu.cs@gmail.com** 发信。
本次确定了以下配置方案，**尚未代为配置 Vercel，也未验证真实重置邮件发送成功**。

先为 Google 账户开启两步验证，再创建
[应用专用密码](https://myaccount.google.com/apppasswords)。在 **Waline Vercel 项目 →
Settings → Environment Variables** 中为 Production 设置：

| 变量 | 值 |
| --- | --- |
| `SMTP_SERVICE` | `Gmail` |
| `SMTP_USER` | `haochen.qiu.cs@gmail.com` |
| `SMTP_PASS` | 由账户本人私下填写 Google 生成的应用专用密码，不是 Gmail 登录密码。 |
| `SENDER_EMAIL` | `haochen.qiu.cs@gmail.com` |
| `SENDER_NAME` | `Harrison’s Universe` |
| `SITE_NAME` | `Harrison’s Universe` |
| `SITE_URL` | `https://chino520.xyz` |
| `LOGIN` | `force`，用于服务端强制登录后评论。 |

保存后重新部署 **Waline**，再用已注册邮箱测试找回密码并检查垃圾邮件。
启用邮件服务也会影响新注册流程：Waline 会启用注册邮箱验证。
若仍失败，查看 Vercel 函数日志中的 SMTP 错误，排查时不要公开凭据。
邮件凭据只放 Waline 服务端环境变量，不放 Astro `.env`、`PUBLIC_*`、源码或 README。
使用 `SMTP_SERVICE` 预设时不需要再同时指定 SMTP host/port。
参考 [Waline 服务端环境变量](https://waline.js.org/en/reference/server/env.html) 和
[Google 应用专用密码说明](https://support.google.com/accounts/answer/185833?hl=zh-Hans)。

### 配置、验证与待验收事项

网站 `.env.example` 和 GitHub Actions 构建支持以下公开变量；修改后需重启开发服务器或重建：

| 网站变量 | 用途 |
| --- | --- |
| `PUBLIC_WALINE_SERVER_URL` | 默认指向当前 Vercel Waline 服务，可覆盖。 |
| `PUBLIC_API_URL` | 独立故事 API；本地示例为 `http://localhost:8787`，生产需实际部署地址。 |
| `PUBLIC_GOATCOUNTER_CODE` | 既有访客统计配置。 |

已移除构建中的旧 Giscus 配置。SQLite 文件通过 `.gitignore` 排除，不能放入 `public/`
或 `dist/`；故事数据需在 API 主机持久保存及备份。

对话中的实现验证记录包括 Astro 构建成功（48 个页面），以及下列测试文件通过。
这次 README 整理只核对文档，不代表重新完成了线上端到端测试。

```bash
node --test tests/community.test.mjs tests/waline.test.mjs tests/waline-session.test.mjs tests/waline-login.test.mjs
npm run build
```

- `community.test.mjs`：解锁顺序、错误／超时重置；旧账户授权、本人评论权限、线程、投票、
  过期和登出；匿名故事读取／创建／编辑及图片校验。API 测试使用隔离数据库和真实本地 HTTP。
- `waline.test.mjs`：模拟组件挂载、销毁和跨文章切换，核对登录与主题配置。
- `waline-session.test.mjs`：记住／仅会话登录、登出同步、异常存储、过期与服务故障区分。
- `waline-login.test.mjs`：旧 token 覆盖、消息来源校验、窗口关闭／拦截／取消／超时，
  注册与找回密码保留网站窗口。Waline 相关测试使用模拟环境，不是实账户端到端测试。

上线验收仍需检查：真实账户注册、邮箱验证、登出后重新登录／注册、找回密码；匿名评论被
服务端拒绝、非作者不能编辑／删除；跨文章评论和分享；About 无提示解锁、超时／错误重置、
刷新隐藏 07；故事在另一浏览器可读取并编辑；移动端与减少动态效果表现。
本次对话未替用户完成 Vercel 邮件配置、独立故事 API 上线或确认最新代码已部署。

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
4. Add the service variables described above. Waline has a default server URL;
   visitor charts require a GoatCounter code, and Time Machine needs a deployed
   story API URL. Configure private Waline/SMTP settings separately in Vercel.
5. Commit the source changes and workflow, then push `main`. Alternatively, run
   **Actions → Deploy Astro to GitHub Pages → Run workflow** after the workflow
   has been pushed. The `github-pages` environment may require approval if you
   have configured environment protection rules.
6. Wait for both build and deploy jobs to succeed. Verify the homepage and a direct
   published post URL from `https://chino520.xyz/blog/`.

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

The historical domain checks above do not verify the latest source deployment.
Check the Actions run and live behavior after pushing; the conversation's local
build/test results do not establish that every new feature is running in production.

## Validation checklist after setup

- Build succeeds; `dist/index.html` and `dist/CNAME` exist.
- Home, About, Projects, Visitors, RSS, and a direct post URL load.
- Drafts do not appear in the output or feed.
- Keyboard navigation works; current navigation is marked; mobile layouts wrap.
- Hearts are brief and disappear; reduced motion disables them.
- Like/dislike a post using Waline, reload, and verify the displayed counts.
- Leave a comment and find it in the Waline dashboard.
- Complete the account, discovery, story, and email acceptance checks listed above.
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
   为 `%20`。不要随意改动已发布 slug，否则文章旧链接和 Waline 的 pathname 映射会变化。
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

## Theme and music player

The journal now adapts the charcoal-and-gold sidebar design from MarcusHoltz’s Astro Marketing Theme, with a light-mode toggle and a music player that continues through internal navigation. See [THEME.md](THEME.md) for upstream attribution, customization, playlist discovery, and the September 2026 content changes.

Run `node scripts/verify-music.mjs` to check shuffle cycles and player controls. Update History lives in `src/data/updates.json` and renders dates as Day Month Year.
