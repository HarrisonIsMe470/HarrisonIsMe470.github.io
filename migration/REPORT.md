# Migration Summary

Old repository:
`git@github.com:HarrisonIsMe470/HarrisonIsMe470-old-blog.git`

New repository:
`git@github.com:HarrisonIsMe470/HarrisonIsMe470.github.io.git`

Source commit: `ea1ba1abb8733b2cd81798a77ece90e4b1876e8f`

| 项目 | 结果 |
| --- | --- |
| Articles found | 11 |
| Articles migrated | 11 |
| Articles skipped | 0 |
| 新站全部内容条目 | 17（原有 6 + 迁入 11） |
| 新站公开文章 | 12 |
| 新站草稿 | 5（均为原有示例） |
| Images migrated | 45（25 张文章图片 + 20 个全站图片资源） |
| Other assets migrated | 10 首 MP3，共 55 个资源文件 |
| 资源总大小 | 81,539,182 bytes |
| Pages migrated | About 合并；音乐歌单恢复为 /music/ |
| 联系与人工数据 | 2 本已读书、5 个人生目标、3 个博客待办、更新历史、3 个联系方式、1 个友情链接 |
| 旧路径兼容 | 28 个静态跳转页 + /About/ 的 404 跳转兼容 |
| Files modified | 10 |
| Files created | 82 |
| Build result | PASS，47 个静态页面，0 build errors |

## 内容恢复方法

旧仓库 `main` 的全部 94 个受版本控制文件均已分类。它只保存 Hexo 8 的发布 HTML，没有 Markdown/MDX、框架配置或未发布草稿。迁移以 `.article > .content` 为边界提取正文，保留可恢复的标题、发布日期、标签、作者、摘要与原 slug。未复制完整生成页面、旧 CSS/JS、Vue、Waline 客户端或 APlayer 框架。

新增 `.md` 文件使用 `legacyHtml: true`，由现有 Astro Content Collection 管理，并直接渲染恢复的 HTML 正文；新文章继续采用原有 Markdown/MDX 流程。这样保留正文中的 HTML 布局、代码、公式反斜杠与既有锚点，不把已渲染内容再解释一次。

原站的 Markdown 示例、LaTeX 示例、介绍性教程也属于作者内容，全部保留。资源包含未被当前正文引用的原始图片、备用头像、背景及 loading GIF，避免遗漏；它们不会自动成为新站背景或加载动画。新站现有介绍、Projects 数据、6 篇原内容、样式设计和功能保留；头像改为旧站头像，原 monogram 文件也保留。

## Compatibility changes

- schema 增加 categories、author、excerpt、slug、legacyHtml、legacyPath、math 和来源记录字段，旧字段继续兼容。
- 已发布 HTML 转为带 frontmatter 的内容条目；默认分类为空、draft=false，均记录推断来源。
- KaTeX 作为唯一新增直接 npm 依赖恢复数学公式；仅有标记的正文按需渲染，跳过代码区，兼容中文公式标签。
- 原播放列表元数据完整保留，改用浏览器原生 audio 控件，preload=none，不自动播放。原列表中部分 name/artist 顺序本身颠倒，本次未擅自重命名。
- About 内容合并到现有页面，原锚点、目标完成状态、历史记录和待办原文保留。
- CSS 仅增加旧正文和音乐列表的样式；新站布局仍由现有 Page/BlogPost 控制。

## Broken links fixed

- 旧文章的日期路径生成对应跳转页；JavaScript 跳转保留 search/hash，另有 meta refresh 和普通链接回退。
- 图片/音频原始 URL 保持不变，迁入 public 对应路径，中文与带空格文件名均经检查。
- 原归档、标签和分页链接集中跳转到新 /blog/，不直接复制自动生成列表。
- /About 的大小写兼容及全部旧 About 标题锚点保留。
- 修正新 404 页面 canonical 指向不存在的 /404/，改为 /404.html，并标记 noindex。

## Old URL → New URL

| Old path | New path |
| --- | --- |
| `/2025/10/21/Deploying-Hexo-on-GitHub-using-Arch Linux/` | `/blog/Deploying-Hexo-on-GitHub-using-Arch%20Linux/` |
| `/2025/10/23/Markdown-Guide/` | `/blog/Markdown-Guide/` |
| `/2025/10/24/Top-100-popular-programming-languages-in-2025/` | `/blog/Top-100-popular-programming-languages-in-2025/` |
| `/2025/10/25/曼昆经济学原理读书笔记/` | `/blog/%E6%9B%BC%E6%98%86%E7%BB%8F%E6%B5%8E%E5%AD%A6%E5%8E%9F%E7%90%86%E8%AF%BB%E4%B9%A6%E7%AC%94%E8%AE%B0/` |
| `/2025/10/26/A-Common-Sense-Guide-to-Data-Structure-and-Algorithms/` | `/blog/A-Common-Sense-Guide-to-Data-Structure-and-Algorithms/` |
| `/2025/10/26/自我成长/` | `/blog/%E8%87%AA%E6%88%91%E6%88%90%E9%95%BF/` |
| `/2025/10/27/Arch-Linux-Instruction/` | `/blog/Arch-Linux-Instruction/` |
| `/2025/10/27/Latex-Document/` | `/blog/Latex-Document/` |
| `/2025/10/27/Mistakes-Summary/` | `/blog/Mistakes-Summary/` |
| `/2025/10/29/Katex-Guide/` | `/blog/Katex-Guide/` |
| `/2025/11/12/情绪词汇/` | `/blog/%E6%83%85%E7%BB%AA%E8%AF%8D%E6%B1%87/` |

所有额外跳转见 `src/data/legacy-redirects.json`。所有源文件处置、目标路径和校验哈希见 `migration/manifest.json`。

## Validation

- `npm install katex`：成功；锁文件随项目更新，npm audit 0 vulnerabilities。
- `npm run build`：PASS，47 页，0 build errors。
- 11 篇恢复正文逐篇比较：文本一致；61 个代码块逐字一致，表格和引用内容一致。
- 23 处正文图片引用及所有原标题 ID 均保留。
- 55 个资源的源文件、新源文件、dist 文件 SHA-256 三方一致。
- 58 个实际公式通过 KaTeX renderToString（throwOnError=true），四种分隔符配置正确。
- 构建 HTML 中本地 href/src/锚点扫描：0 个断链；28 个静态跳转目标存在。
- About 原文和勾选状态核对通过；未丢失原有内容条目。
- Astro config、GitHub Actions workflow、public/CNAME 与迁移前一致，dist/CNAME 仍为 chino520.xyz。
- 本地生产预览的 100 个页面/旧跳转/资源 URL 返回 HTTP 200（按浏览器使用的 URL 路径编码检查）。
- 未修改 remote、Git 历史或仓库设置，未执行 commit/push/deploy。

## Remaining Issues

1. 原始 Markdown/MDX、未发布草稿、原 frontmatter 中未出现在 HTML 的字段无法从这个仓库恢复；没有伪造精确更新时间、封面或草稿。所有当前已发布文章都已迁入。
2. `/About/` 大小写别名通过 GitHub Pages 404 fallback 实现，初始 HTTP 状态为 404，需要 JavaScript 自动跳转；无 JavaScript 时提供可点击的 About 链接。其余 28 个旧路径有实体静态跳转页。静态 GitHub Pages 不提供本项目自定义 HTTP 301。
3. Waline 评论在外部服务而非 Git 仓库中，需要另行导出才能迁移。本次保留现有 Giscus 方案，没有读取或覆盖远端评论库。
4. 外部参考链接、视频链接及教程示例占位 URL 按原文保留，未承诺其远端可用性。没有本地缺失资源。
5. 此次修改在本地工作区，尚未发布。需要提交并 push main 后使用现有 GitHub Actions 部署。

## Files modified

- `README.md`
- `package-lock.json`
- `package.json`
- `src/components/BaseHead.astro`
- `src/content.config.ts`
- `src/data/profile.ts`
- `src/layouts/BlogPost.astro`
- `src/pages/about.astro`
- `src/pages/blog/[...slug].astro`
- `src/styles/global.css`

## Files created

- `migration/REPORT.md`
- `migration/formula-fixtures.json`
- `migration/manifest.json`
- `public/2025/10/23/Markdown-Guide/Markdown.jpg`
- `public/2025/10/24/Top-100-popular-programming-languages-in-2025/Top 20 popular programming languages in 2025.jpg`
- `public/2025/10/24/Top-100-popular-programming-languages-in-2025/Top 21 to 50 popular programming languages in 2025.jpg`
- `public/2025/10/24/Top-100-popular-programming-languages-in-2025/Top 51 to 100 popular programming languages in 2025.jpg`
- `public/2025/10/25/曼昆经济学原理读书笔记/价格上限后果.png`
- `public/2025/10/25/曼昆经济学原理读书笔记/价格上限案例.jpg`
- `public/2025/10/25/曼昆经济学原理读书笔记/价格下限后果.png`
- `public/2025/10/25/曼昆经济学原理读书笔记/价格下限案例.png`
- `public/2025/10/25/曼昆经济学原理读书笔记/供给价格弹性.jpg`
- `public/2025/10/25/曼昆经济学原理读书笔记/供给曲线.png`
- `public/2025/10/25/曼昆经济学原理读书笔记/供给曲线Origin.png`
- `public/2025/10/25/曼昆经济学原理读书笔记/供需曲线.png`
- `public/2025/10/25/曼昆经济学原理读书笔记/弹性与税收归宿.jpg`
- `public/2025/10/25/曼昆经济学原理读书笔记/循环流量图.png`
- `public/2025/10/25/曼昆经济学原理读书笔记/消费者生产者剩余.png`
- `public/2025/10/25/曼昆经济学原理读书笔记/生产可能性边界.jpeg`
- `public/2025/10/25/曼昆经济学原理读书笔记/石油市场.jpg`
- `public/2025/10/25/曼昆经济学原理读书笔记/课税.jpg`
- `public/2025/10/25/曼昆经济学原理读书笔记/谷贱伤农.jpg`
- `public/2025/10/25/曼昆经济学原理读书笔记/需求价格弹性.jpg`
- `public/2025/10/25/曼昆经济学原理读书笔记/需求曲线.png`
- `public/2025/10/25/曼昆经济学原理读书笔记/需求曲线Origin.png`
- `public/2025/10/26/自我成长/Overcome Perfectionism.jpg`
- `public/2025/10/26/自我成长/情绪探索.jpg`
- `public/2025/10/26/自我成长/本子在隔壁说.jpg`
- `public/images/Another Kid & Pratzapp - Kyoto (freetouse.com).webp`
- `public/images/Avanti - Time (freetouse.com).webp`
- `public/images/Aventure - A Beautiful Garden (freetouse.com).webp`
- `public/images/Filo Starquez - Park Vibes (freetouse.com).webp`
- `public/images/Hazelwood - Coming Of Age (freetouse.com).webp`
- `public/images/Hoffy Beats - Florida Keys (freetouse.com).webp`
- `public/images/Lukrembo - Jay (freetouse.com).webp`
- `public/images/Milky Wayvers - Love in Japan (freetouse.com).webp`
- `public/images/avatar.jpg`
- `public/images/avatar1.jpg`
- `public/images/avatar2.jpg`
- `public/images/background1.jpg`
- `public/images/background2.jpg`
- `public/images/background3.jpg`
- `public/images/background4.jpg`
- `public/images/background5.jpg`
- `public/images/background6.jpg`
- `public/images/loading.gif`
- `public/images/massobeats - daydream (freetouse.com).webp`
- `public/images/massobeats - gingersweet (freetouse.com).webp`
- `public/music/Another Kid & Pratzapp - Kyoto (freetouse.com).mp3`
- `public/music/Avanti - Time (freetouse.com).mp3`
- `public/music/Aventure - A Beautiful Garden (freetouse.com).mp3`
- `public/music/Filo Starquez - Park Vibes (freetouse.com).mp3`
- `public/music/Hazelwood - Coming Of Age (freetouse.com).mp3`
- `public/music/Hoffy Beats - Florida Keys (freetouse.com).mp3`
- `public/music/Lukrembo - Jay (freetouse.com).mp3`
- `public/music/Milky Wayvers - Love in Japan (freetouse.com).mp3`
- `public/music/massobeats - daydream (freetouse.com).mp3`
- `public/music/massobeats - gingersweet (freetouse.com).mp3`
- `scripts/import-legacy-blog.py`
- `scripts/verify-math.mjs`
- `scripts/verify-migration.py`
- `src/components/LegacyAbout.astro`
- `src/components/Math.astro`
- `src/content/blog/legacy/A-Common-Sense-Guide-to-Data-Structure-and-Algorithms.md`
- `src/content/blog/legacy/Arch-Linux-Instruction.md`
- `src/content/blog/legacy/Deploying-Hexo-on-GitHub-using-Arch Linux.md`
- `src/content/blog/legacy/Katex-Guide.md`
- `src/content/blog/legacy/Latex-Document.md`
- `src/content/blog/legacy/Markdown-Guide.md`
- `src/content/blog/legacy/Mistakes-Summary.md`
- `src/content/blog/legacy/Top-100-popular-programming-languages-in-2025.md`
- `src/content/blog/legacy/情绪词汇.md`
- `src/content/blog/legacy/曼昆经济学原理读书笔记.md`
- `src/content/blog/legacy/自我成长.md`
- `src/content/pages/legacy-about.html`
- `src/data/legacy-profile.json`
- `src/data/legacy-redirects.json`
- `src/data/legacy-site.json`
- `src/data/music.json`
- `src/pages/404.astro`
- `src/pages/[...legacy].astro`
- `src/pages/music.astro`
