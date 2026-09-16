import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';

// Remove the exterior black matte from the original avatar, without redrawing it.
const source = new URL('../public/images/avatar.jpg', import.meta.url);
const { data, info } = await sharp(source.pathname).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width, height } = info;
const background = new Uint8Array(width * height);
const queue = [];
function visit(x, y) {
  if (x < 0 || y < 0 || x >= width || y >= height) return;
  const index = y * width + x;
  if (background[index]) return;
  const pixel = index * 4;
  if (Math.max(data[pixel], data[pixel + 1], data[pixel + 2]) > 32) return;
  background[index] = 1;
  queue.push(index);
}
for (let x = 0; x < width; x++) { visit(x, 0); visit(x, height - 1); }
for (let y = 0; y < height; y++) { visit(0, y); visit(width - 1, y); }
for (let i = 0; i < queue.length; i++) {
  const index = queue[i], x = index % width, y = Math.floor(index / width);
  data[index * 4 + 3] = 0;
  visit(x - 1, y); visit(x + 1, y); visit(x, y - 1); visit(x, y + 1);
}
const cutout = await sharp(data, { raw: { width, height, channels: 4 } }).png().toBuffer();
const save = (path, bytes) => writeFile(new URL(`../${path}`, import.meta.url), bytes);
await save('public/images/avatar-transparent.png', cutout);
const icon = await sharp(cutout).resize(64, 64).png().toBuffer();
await save('src/assets/site-icon.png', icon);
await save('public/favicon-avatar.png', icon);
await save('public/apple-touch-icon.png', await sharp(cutout).resize(180, 180).png().toBuffer());

const sizes = [16, 32, 48];
const frames = await Promise.all(sizes.map(size => sharp(cutout).resize(size, size).png().toBuffer()));
const header = Buffer.alloc(6 + 16 * frames.length);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(frames.length, 4);
let offset = header.length;
frames.forEach((frame, i) => {
  const entry = 6 + i * 16;
  header[entry] = sizes[i]; header[entry + 1] = sizes[i];
  header.writeUInt16LE(1, entry + 4); header.writeUInt16LE(32, entry + 6);
  header.writeUInt32LE(frame.length, entry + 8); header.writeUInt32LE(offset, entry + 12);
  offset += frame.length;
});
await save('public/favicon.ico', Buffer.concat([header, ...frames]));
await save('public/favicon.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}"><image width="${width}" height="${height}" href="data:image/png;base64,${cutout.toString('base64')}"/></svg>\n`);
console.log(`Generated transparent avatar icons; removed ${queue.length} exterior pixels.`);
