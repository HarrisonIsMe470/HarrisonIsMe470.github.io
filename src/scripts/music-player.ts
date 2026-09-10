import { createShuffle } from '../lib/shuffle.mjs';
const root = document.querySelector<HTMLElement>('#music-player');
if (root && !root.dataset.initialized) {
  root.dataset.initialized = 'true';
  const tracks: {url: string; name: string; artist: string; cover: string}[] = JSON.parse(root.querySelector('[data-playlist]')!.textContent!);
  const audio = root.querySelector<HTMLAudioElement>('[data-audio]')!;
  const play = root.querySelector<HTMLButtonElement>('[data-play]')!;
  const seek = root.querySelector<HTMLInputElement>('[data-seek]')!;
  const volume = root.querySelector<HTMLInputElement>('[data-volume]')!;
  const status = root.querySelector<HTMLElement>('[data-status]')!;
  const shuffle = createShuffle(tracks.length);
  let current = -1;
  let request = 0;
  const failed = new Set<number>();
  audio.volume = Number(volume.value);
  function markTrack() {
    document.querySelectorAll<HTMLButtonElement>('[data-play-track]').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.playTrack === tracks[current]?.url));
    });
  }
  async function start() {
    const token = ++request;
    try { await audio.play(); }
    catch (error) {
      if (token !== request || (error as DOMException).name === 'AbortError') return;
      if ((error as DOMException).name === 'NotAllowedError') status.textContent = 'Press play to start';
      else status.textContent = 'Unable to play this track. Try Next.';
    }
  }
  function load(index: number, autoplay = true) {
    if (index < 0) return;
    current = index;
    const track = tracks[index];
    audio.src = track.url;
    root!.querySelector<HTMLElement>('[data-title]')!.textContent = track.name;
    root!.querySelector<HTMLImageElement>('[data-cover]')!.src = track.cover;
    status.textContent = track.artist;
    seek.value = '0'; seek.disabled = true;
    root!.querySelector('[data-time]')!.textContent = '0:00 / 0:00';
    markTrack();
    if (autoplay) void start();
  }
  function next() {
    if (failed.size >= tracks.length) { status.textContent = 'Music is unavailable. Try again later.'; return; }
    let index = shuffle.next();
    while (failed.has(index)) index = shuffle.next();
    load(index);
  }
  play.addEventListener('click', () => {
    if (audio.paused) { failed.clear(); if (current < 0) next(); else void start(); }
    else { ++request; audio.pause(); }
  });
  root.querySelector('[data-next]')!.addEventListener('click', () => { failed.clear(); next(); });
  audio.addEventListener('play', () => { play.textContent = 'Pause'; play.setAttribute('aria-label', 'Pause music'); status.textContent = tracks[current].artist; });
  audio.addEventListener('pause', () => { play.textContent = 'Play'; play.setAttribute('aria-label', 'Play music'); });
  audio.addEventListener('ended', next);
  audio.addEventListener('error', () => { failed.add(current); next(); });
  const time = (seconds: number) => Number.isFinite(seconds) ? `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}` : '0:00';
  function progress() {
    const valid = Number.isFinite(audio.duration) && audio.duration > 0;
    seek.disabled = !valid;
    seek.value = valid ? String(audio.currentTime / audio.duration * 100) : '0';
    root!.querySelector('[data-time]')!.textContent = `${time(audio.currentTime)} / ${time(audio.duration)}`;
  }
  audio.addEventListener('timeupdate', progress);
  audio.addEventListener('loadedmetadata', progress);
  seek.addEventListener('input', () => { if (Number.isFinite(audio.duration)) audio.currentTime = Number(seek.value) / 100 * audio.duration; });
  volume.addEventListener('input', () => { audio.volume = Number(volume.value); });
  document.addEventListener('click', event => {
    const button = (event.target as Element).closest<HTMLButtonElement>('[data-play-track]');
    if (!button) return;
    const index = tracks.findIndex(track => track.url === button.dataset.playTrack);
    if (index >= 0) { failed.clear(); shuffle.select(index); load(index); }
  });
  document.addEventListener('astro:page-load', markTrack);
  if (tracks.length) load(shuffle.next(), false);
  status.textContent = tracks.length ? 'Press play to start' : 'No music available yet';
}
