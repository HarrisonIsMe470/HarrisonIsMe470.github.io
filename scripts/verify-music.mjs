import assert from 'node:assert/strict';
import { createShuffle } from '../src/lib/shuffle.mjs';

// Seeded random source makes failures reproducible while covering many cycles.
let seed = 42;
const random = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 2 ** 32);
for (const count of [0, 1, 2, 10, 31]) {
  const shuffle = createShuffle(count, random);
  if (!count) { assert.equal(shuffle.next(), -1); continue; }
  let previous = -1;
  for (let cycle = 0; cycle < 100; cycle++) {
    const played = [];
    for (let i = 0; i < count; i++) {
      const next = shuffle.next();
      if (count > 1) assert.notEqual(next, previous, 'Immediate repeat');
      played.push(next); previous = next;
    }
    assert.equal(new Set(played).size, count, 'Cycle skipped or repeated a track');
  }
}
const selected = createShuffle(10, random);
selected.next(); selected.select(8);
assert.notEqual(selected.next(), 8, 'Manual selection immediately repeated');

// Exercise the actual browser controller against a minimal event-driven audio/DOM adapter.
class Element extends EventTarget {
  constructor() { super(); this.dataset = {}; this.attributes = {}; this.textContent = ''; this.value = '0'; }
  setAttribute(key, value) { this.attributes[key] = value; }
  closest(selector) { return selector === '[data-play-track]' && this.dataset.playTrack ? this : null; }
}
class Audio extends Element {
  paused = true; duration = 120; currentTime = 0; volume = 1; blocked = false;
  async play() {
    if (this.blocked) throw new DOMException('User gesture required', 'NotAllowedError');
    this.paused = false; this.dispatchEvent(new Event('play'));
  }
  pause() { this.paused = true; this.dispatchEvent(new Event('pause')); }
}
const fields = Object.fromEntries(['playlist', 'play', 'seek', 'volume', 'status', 'title', 'cover', 'time', 'next'].map(key => [`[data-${key}]`, new Element()]));
fields['[data-audio]'] = new Audio();
fields['[data-volume]'].value = '0.5';
const tracks = [0, 1, 2].map(i => ({ url: `/music/${i}.mp3`, name: `Track ${i}`, artist: `Artist ${i}`, cover: '/cover.jpg' }));
fields['[data-playlist]'].textContent = JSON.stringify(tracks);
const root = new Element(); root.querySelector = selector => fields[selector];
const trackButton = new Element(); trackButton.dataset.playTrack = tracks[2].url;
const document = new Element();
document.querySelector = selector => selector === '#music-player' ? root : null;
document.querySelectorAll = () => [trackButton];
globalThis.document = document;
await import('../src/scripts/music-player.ts');
const audio = fields['[data-audio]'];
const click = element => element.dispatchEvent(new Event('click'));
assert.equal(audio.paused, true, 'Playback must wait for a gesture');
assert.equal(audio.volume, 0.5);
audio.blocked = true; click(fields['[data-play]']); await Promise.resolve(); await Promise.resolve();
assert.equal(fields['[data-status]'].textContent, 'Press play to start');
audio.blocked = false; click(fields['[data-play]']);
assert.equal(audio.paused, false); assert.equal(fields['[data-play]'].textContent, 'Pause');
const first = audio.src;
audio.dispatchEvent(new Event('ended')); assert.notEqual(audio.src, first);
click(fields['[data-play]']); assert.equal(audio.paused, true);
const event = new Event('click'); Object.defineProperty(event, 'target', { value: trackButton }); document.dispatchEvent(event);
assert.equal(audio.src, tracks[2].url); assert.equal(audio.paused, false);
assert.equal(trackButton.attributes['aria-pressed'], 'true');
fields['[data-seek]'].value = '50'; fields['[data-seek]'].dispatchEvent(new Event('input')); assert.equal(audio.currentTime, 60);
fields['[data-volume]'].value = '0.2'; fields['[data-volume]'].dispatchEvent(new Event('input')); assert.equal(audio.volume, 0.2);
const source = audio.src; document.dispatchEvent(new Event('astro:page-load')); assert.equal(audio.src, source); assert.equal(audio.paused, false);
for (let i = 0; i < tracks.length; i++) audio.dispatchEvent(new Event('error'));
assert.equal(fields['[data-status]'].textContent, 'Music is unavailable. Try again later.');
console.log('Music checks passed: shuffle cycles, manual selection, play/pause, autoplay rejection, seek, volume, navigation event, and bounded error recovery.');
