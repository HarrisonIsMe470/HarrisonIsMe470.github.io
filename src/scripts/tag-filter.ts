function filterPosts() {
  const root = document.querySelector<HTMLElement>('[data-tag-filter]');
  if (!root) return;
  const selected = new URLSearchParams(location.search).get('tag') || '';
  let visible = 0;
  root.querySelectorAll<HTMLElement>('[data-post-tags]').forEach(post => {
    const tags: string[] = JSON.parse(post.dataset.postTags || '[]');
    post.hidden = Boolean(selected) && !tags.includes(selected);
    if (!post.hidden) visible++;
  });
  root.querySelectorAll<HTMLAnchorElement>('[data-filter-tag]').forEach(link => {
    if (link.dataset.filterTag === selected) link.setAttribute('aria-current', 'true');
    else link.removeAttribute('aria-current');
  });
  root.querySelector<HTMLElement>('[data-filter-summary]')!.textContent = `${visible} ${visible === 1 ? 'post' : 'posts'}${selected ? ` tagged “${selected}”` : ''}`;
  root.querySelector<HTMLElement>('[data-filter-empty]')!.hidden = visible > 0;
}
// Query-string links work with Astro navigation, reloads, bookmarks, and Back/Forward.
document.addEventListener('astro:page-load', filterPosts);
filterPosts();
