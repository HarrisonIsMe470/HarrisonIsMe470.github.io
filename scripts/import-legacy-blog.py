#!/usr/bin/env python3
"""Recover user content from the old Hexo deployment. Requires beautifulsoup4.
Run only on a fresh destination: existing generated files are never overwritten.
"""
import argparse
import hashlib
import json
import re
import shutil
import subprocess
from pathlib import Path
from urllib.parse import quote, unquote
from bs4 import BeautifulSoup

parser = argparse.ArgumentParser()
parser.add_argument('source', type=Path)
args = parser.parse_args()
old = args.source.resolve()
root = Path(__file__).resolve().parents[1]

def write(path, text):
    target = root / path
    if target.exists():
        raise SystemExit(f'Refusing to overwrite {target}; review/merge manually.')
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(text)

def digest(data):
    return hashlib.sha256(data).hexdigest()

def json_text(value):
    return json.dumps(value, ensure_ascii=False, indent=2) + '\n'

def soup(path):
    return BeautifulSoup((old / path).read_text(), 'html.parser')

files = subprocess.check_output(['git', '-C', str(old), 'ls-files', '-z']).decode().strip('\0').split('\0')
commit = subprocess.check_output(['git', '-C', str(old), 'rev-parse', 'HEAD']).decode().strip()
plan = []
for name in files:
    path = Path(name)
    if name.startswith('2025/') and path.name == 'index.html':
        target, kind = 'src/content/blog/legacy/' + path.parent.name + '.md', 'article'
    elif name == 'About/index.html':
        target, kind = 'src/data/legacy-profile.json + src/content/pages/legacy-about.html + src/pages/about.astro', 'page'
    elif path.suffix.lower() in ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.mp3']:
        target, kind = 'public/' + name, 'asset'
    elif name in ['index.html', 'page/2/index.html']:
        target, kind = 'src/data/legacy-site.json + src/data/music.json (extract hand-maintained data and excerpts)', 'generated-index-with-user-data'
    else:
        target, kind = None, 'framework' if path.suffix in ['.js', '.css'] else 'generated-index'
    plan.append(dict(old=name, new=target, kind=kind))
# Check the entire plan before writing any destination files.
for item in plan:
    if item['kind'] in ['article', 'asset'] and (root / item['new']).exists():
        raise SystemExit(f'Conflict: {item["new"]}')
excerpts = {}
for index in ['index.html', 'page/2/index.html']:
    for post in soup(index).select('#home-posts > .post'):
        link = post.select_one('a[href]')
        desc = post.select_one('.description .content')
        if link and desc:
            excerpts[unquote(link['href'])] = desc.decode_contents().strip()

articles = []
for item in plan:
    if item['kind'] != 'article':
        continue
    name = item['old']
    page = soup(name)
    article = page.select_one('.article')
    content = article.select_one(':scope > .content')
    assert content is not None, name
    assert not content.select('script, style, iframe, object, embed'), name
    assert not any(k.lower().startswith('on') for tag in content.find_all() for k in tag.attrs), name
    # HTML-only source: preserve the recovered HTML, including code, anchors and TeX.
    # It is rendered directly by the legacyHtml branch, not reparsed as Markdown.
    body = content.decode_contents().strip() + '\n'
    title = article.select_one('h1').get_text(strip=True)
    pub_date = article.select_one('.info .date').get_text(strip=True).replace('/', '-')
    tags = [tag.get_text(strip=True) for tag in article.select('.info .tags .tag a')]
    categories = [tag.get_text(strip=True) for tag in article.select('.info .category a')]
    slug = Path(name).parent.name
    old_path = '/' + str(Path(name).parent) + '/'
    excerpt = excerpts.get(old_path, '')
    description = BeautifulSoup(excerpt, 'html.parser').get_text(' ', strip=True) or title
    author = page.select_one('meta[name="author"]')['content']
    meta = dict(title=title, description=description, pubDate=pub_date, tags=tags,
                categories=categories, author=author, draft=False, slug=slug,
                legacyHtml=True, legacyPath=old_path, excerpt=excerpt,
                math=bool(re.search(r'\$|\\\(|\\\[', content.get_text())),
                sourceRepository='HarrisonIsMe470/HarrisonIsMe470-old-blog', sourceCommit=commit)
    # JSON values are valid YAML and safely quote punctuation and multiline excerpts.
    frontmatter = '\n'.join(f'{key}: {json.dumps(value, ensure_ascii=False)}' for key,value in meta.items())
    write(item['new'], '---\n' + frontmatter + '\n---\n\n' + body)
    articles.append(dict(source=name, destination=item['new'], title=title, slug=slug,
                         oldPath=old_path, newPath='/blog/' + quote(slug, safe='-') + '/',
                         sourceSHA256=digest((old/name).read_bytes()), bodySHA256=digest(body.encode()),
                         metadata=meta))

assets = []
for item in plan:
    if item['kind'] != 'asset':
        continue
    source = old / item['old']
    dest = root / item['new']
    dest.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(source, dest)
    assets.append(dict(source=item['old'], destination=item['new'], bytes=source.stat().st_size,
                       sha256=digest(source.read_bytes()), kind='audio' if source.suffix=='.mp3' else 'image'))

about = soup('About/index.html').select_one('.article > .content')
headings = about.find_all('h1', recursive=False)
legacy_profile = {'introduction': headings[0].get_text(strip=True), 'introAnchor': headings[0]['id'], 'bucketAnchor': headings[-1]['id'], 'bucketTitle': headings[-1].get_text(strip=True), 'bucketList': []}
for li in headings[-1].find_next_sibling('ul').find_all('li', recursive=False):
    legacy_profile['bucketList'].append(dict(text=li.get_text(' ',strip=True), completed=li.input.has_attr('checked')))
# The About source explicitly identifies these two completed books. Do not infer dates.
legacy_profile['books'] = [
    {'title': 'A Common-Sense Guide to Data Structures and Algorithms', 'author': ''},
    {'title': 'Principles of Economics', 'author': 'N. Gregory Mankiw'},
]
write('src/data/legacy-profile.json', json_text(legacy_profile))
# Keep the original update history and blog TODO text/check states verbatim.
parts = []
for heading in headings[1:3]:
    parts.append(str(heading))
    for sibling in heading.next_siblings:
        if getattr(sibling, 'name', None) == 'h1': break
        parts.append(str(sibling))
write('src/content/pages/legacy-about.html', ''.join(parts))

home = soup('index.html')
legacy_site = {
    'title': home.select_one('#home-info h1').get_text(strip=True),
    'subtitle': home.select_one('#home-info h3').get_text(strip=True),
    'description': home.select_one('#home-info h5').get_text(strip=True),
    'name': home.select_one('#home-card .name').get_text(strip=True),
    'bio': home.select_one('#home-card .description').get_text(strip=True),
    'avatar': home.select_one('#home-card img')['src'],
    'contacts': [{'label': label, 'url': a['href']} for label,a in zip(
        ['GitHub (旧账号)', 'Email', 'Bilibili'], home.select('#home-card .icon-links a'))],
    'friends': [{'name': a.get_text(strip=True), 'url': a['href']} for a in home.select('#home-card .friend-links a')],
}
write('src/data/legacy-site.json', json_text(legacy_site))
script = next(s.get_text() for s in home.find_all('script') if 'const myPlaylist' in s.get_text())
playlist = []
for match in re.finditer(r"name:\s*'([^']*)',\s*artist:\s*'([^']*)',\s*url:\s*'([^']*)',[^\n]*\n\s*cover:\s*'([^']*)'", script):
    playlist.append(dict(zip(['name','artist','url','cover'], match.groups())))
assert len(playlist)==10, len(playlist)
write('src/data/music.json', json_text(playlist))

redirects = {a['oldPath']: a['newPath'] for a in articles}
for item in plan:
    if item['kind'] in ['generated-index','generated-index-with-user-data']:
        path = '/' + str(Path(item['old']).parent).strip('.')
        if path != '/': redirects[path.rstrip('/')+'/'] = '/blog/'
# A case-only /About/ alias cannot coexist with /about/ on default macOS filesystems.
# This alias is handled by the custom 404 page, all others have real static pages.
redirects['/About/'] = '/about/'
write('src/data/legacy-redirects.json', json_text(redirects))
report = dict(sourceRepository='git@github.com:HarrisonIsMe470/HarrisonIsMe470-old-blog.git',
              sourceCommit=commit, articles=articles, assets=assets, inventory=plan,
              redirects=redirects, legacyWalineURL='https://waline-qyunf8hb4-chino520reals-projects.vercel.app/',
              limitations=['Only generated HTML exists; unpublished drafts and original Markdown are absent.',
                           'No per-post updated dates or explicit cover metadata survive in the source.',
                           'Waline comments live outside this repository and are not exported here.'])
write('migration/manifest.json', json_text(report))
print(f'Migrated {len(articles)} articles and {len(assets)} assets; source commit {commit}')
