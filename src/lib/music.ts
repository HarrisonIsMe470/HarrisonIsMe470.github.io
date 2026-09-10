import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import metadata from '../data/music.json';

const directory = resolve(process.cwd(), 'public/music');
function discover(directory: string, prefix = ''): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const path = `${prefix}${entry.name}`;
    return entry.isDirectory() ? discover(`${directory}/${entry.name}`, `${path}/`) : /\.(mp3|m4a|ogg|wav|aac|flac|opus)$/i.test(entry.name) ? [path] : [];
  });
}
export const playlist = discover(directory).sort().map(file => {
  const url = `/music/${file}`;
  const known = metadata.find(track => track.url === url);
  const stem = file.split('/').pop()!.replace(/\.[^.]+$/, '').replace(/ \(freetouse\.com\)$/i, '');
  const separator = stem.indexOf(' - ');
  return {
    url: encodeURI(url).replace(/#/g, '%23').replace(/\?/g, '%3F'),
    name: separator >= 0 ? stem.slice(separator + 3) : known?.name || stem,
    artist: separator >= 0 ? stem.slice(0, separator) : known?.artist || 'Local collection',
    cover: known?.cover || '/images/avatar.jpg',
  };
});
