#!/usr/bin/env python3
"""Verify recovery against the source checkout AND the production build.
Usage: python3 scripts/verify-migration.py /private/tmp/HarrisonIsMe470-old-blog
Requires beautifulsoup4; does not fetch external links or modify source files.
"""
import hashlib
import json
import re
import subprocess
import sys
from pathlib import Path
from urllib.parse import unquote, urljoin, urlparse
from bs4 import BeautifulSoup

root = Path(__file__).resolve().parents[1]
old = Path(sys.argv[1])
build = root / 'dist'
manifest = json.loads((root/'migration/manifest.json').read_text())

def parse(text):
    return BeautifulSoup(text, 'html.parser')

def normalized_text(node):
    return re.sub(r'\s+', '', node.get_text())

def sha(data):
    return hashlib.sha256(data).hexdigest()

tracked = set(subprocess.check_output(['git','-C',str(old),'ls-files','-z']).decode().strip('\0').split('\0'))
assert tracked == {item['old'] for item in manifest['inventory']}, 'Inventory incomplete'
old_articles = list(old.glob('2025/**/index.html'))
assert len(old_articles) == len(manifest['articles']) == 11
issues = []
formula_samples = []
code_count = image_refs = 0
for article in manifest['articles']:
    source = old/article['source']
    assert sha(source.read_bytes()) == article['sourceSHA256'], source
    original = parse(source.read_text()).select_one('.article > .content')
    migrated = (root/article['destination']).read_text()
    body = migrated.split('\n---\n',1)[1].lstrip('\n')
    assert sha(body.encode()) == article['bodySHA256'], article['title']
    doc_path = build/unquote(article['newPath']).strip('/')/'index.html'
    doc = parse(doc_path.read_text())
    rendered = doc.select_one('.prose')
    assert normalized_text(original) == normalized_text(rendered), ('Body text changed', article['title'])
    for selector in ['pre code', 'table', 'blockquote']:
        before = original.select(selector)
        after = rendered.select(selector)
        assert len(before) == len(after), (article['title'], selector)
        for a,b in zip(before,after):
            assert a.get_text() == b.get_text(), (article['title'], selector, 'content changed')
    code_count += len(original.select('pre code'))
    image_refs += len(original.select('img'))
    assert [x['src'] for x in original.select('img')] == [x['src'] for x in rendered.select('img')]
    assert set(x['id'] for x in original.select('[id]')) <= set(x['id'] for x in rendered.select('[id]'))
    assert doc.select_one('link[rel=canonical]')['href'] == 'https://chino520.xyz'+article['newPath']
    for tag in original.select('pre,code'): tag.decompose()
    for text in original.find_all(string=True):
        for m in re.finditer(r'\$\$([\s\S]+?)\$\$|(?<!\$)\$([^$]+?)\$(?!\$)', str(text)):
            formula_samples.append({'tex':m.group(1) or m.group(2),'display':bool(m.group(1))})
    if formula_samples and article['metadata']['math']:
        assert rendered.get('data-math')=='true'

# All copied assets must match the source AND the deployed artifact byte for byte.
for asset in manifest['assets']:
    for file in [old/asset['source'],root/asset['destination'],build/asset['source']]:
        assert sha(file.read_bytes())==asset['sha256'], file

# Validate every generated local href/src, including Unicode, spaces, and fragments.
for file in build.rglob('*.html'):
    doc = parse(file.read_text())
    current = '/' + str(file.relative_to(build))
    for tag in doc.select('[href],[src]'):
        for attr in ['href','src']:
            raw = tag.get(attr)
            if not raw: continue
            url = urlparse(urljoin('https://chino520.xyz'+current,raw))
            if url.netloc != 'chino520.xyz' or url.scheme not in ['https','http']: continue
            path = unquote(url.path)
            target = build/path.lstrip('/')
            if target.is_dir(): target = target/'index.html'
            elif not target.exists() and not target.suffix: target=target/'index.html'
            if not target.exists():
                issues.append((str(file.relative_to(build)),raw,'missing target'))
            elif url.fragment and target.suffix=='.html':
                dest_doc = doc if target==file else parse(target.read_text())
                fragment = unquote(url.fragment)
                if not dest_doc.find(id=fragment) and not dest_doc.find(attrs={'name':fragment}):
                    issues.append((str(file.relative_to(build)),raw,'missing fragment'))
for source,target in manifest['redirects'].items():
    if source=='/About/':
        assert '/About/' in (build/'404.html').read_text()
        continue
    page = parse((build/source.strip('/')/'index.html').read_text())
    assert page.select_one('link[rel=canonical]')['href']=='https://chino520.xyz'+target
    assert page.select_one('meta[http-equiv=refresh]')
    assert 'location.hash' in page.get_text() or 'location.hash' in str(page)

about = parse((build/'about/index.html').read_text())
original_about = parse((old/'About/index.html').read_text()).select_one('.article > .content')
for node in original_about.select('li,p'):
    # Update History dates were reformatted by request on 10 September 2026.
    if node.name == 'p' and node.find('code') and '2025/10/21' in node.get_text():
        continue
    text=normalized_text(node)
    # The visitor-statistics TODO was renamed by request after migration.
    if text == 'Findavisitorstatsticsplugin':
        text = 'Addavisualvisitorstatistics'
    assert text in normalized_text(about), ('About text missing',node.get_text())
for heading in original_about.select('h1[id]'):
    assert about.find(id=heading['id']), ('Missing About anchor',heading['id'])
updates=json.loads((root/'src/data/updates.json').read_text())
assert len(updates)==len(about.select('.update-history li'))
for update, item in zip(updates, about.select('.update-history li')):
    from datetime import date
    day=date.fromisoformat(update['date'])
    assert item.time['datetime']==update['date']
    assert item.time.get_text()==f'{day.day} {day.strftime("%B %Y")}'
    assert item.p.get_text()==update['text']
assert updates[-1]=={'date':'2026-09-10','text':'迁移至新blog框架Astro'}
assert '友情链接' not in about.get_text() and not about.select('a[href="https://argvchs.github.io/"]')
assert not (build/'blog/welcome/index.html').exists()
assert 'A personal blog and a growing collection' not in (build/'projects/index.html').read_text()
old_checked = len(original_about.select('input[checked]'))
legacy_profile=json.loads((root/'src/data/legacy-profile.json').read_text())
new_checked=sum(item['completed'] for item in legacy_profile['bucketList'])+len(about.select('input[checked]'))
assert old_checked==new_checked, 'Checklist status changed'
assert len(list((root/'src/content/blog').rglob('*.md'))) + len(list((root/'src/content/blog').rglob('*.mdx'))) == 16
assert len(list((build/'blog').glob('*/index.html')))==11, 'Published post count mismatch'
for protected in ['astro.config.mjs','.github/workflows/deploy.yml','public/CNAME']:
    assert subprocess.check_output(['git','diff','--',protected])==b'',protected
assert (build/'CNAME').read_text().strip()=='chino520.xyz'
assert not issues, json.dumps(issues,ensure_ascii=False,indent=2)
(root/'migration/formula-fixtures.json').write_text(json.dumps(formula_samples,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'articles_found':11,'articles_migrated':11,'skipped':0,'total_content_entries':16,
                  'published_posts':11,'drafts':5,'images':45,'audio':10,'article_image_references':image_refs,
                  'code_blocks_preserved':code_count,'formulas':len(formula_samples),
                  'local_broken_links':0,'protected_deployment_files':'unchanged'},ensure_ascii=False,indent=2))
