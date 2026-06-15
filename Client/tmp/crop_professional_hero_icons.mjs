import fs from 'node:fs';
import path from 'node:path';
import { PNG } from 'pngjs';

const inputPath = 'Client/tmp/imagegen/professional-hero-icons-key.png';
const outputDir = 'Client/src/assets/hero-icons/professional';
const names = [
  'fast.png',
  'secure.png',
  'delete.png',
  'tools.png',
  'users.png',
  'clock.png',
  'rating.png',
];

const source = PNG.sync.read(fs.readFileSync(inputPath));
const { width, height, data } = source;

const keyed = new PNG({ width, height });
for (let y = 0; y < height; y += 1) {
  for (let x = 0; x < width; x += 1) {
    const idx = (width * y + x) << 2;
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];
    const isGreenKey = g > 145 && r < 95 && b < 95 && g > r * 1.8 && g > b * 1.8;

    keyed.data[idx] = r;
    keyed.data[idx + 1] = Math.min(g, isGreenKey ? g : Math.max(g - 18, 0));
    keyed.data[idx + 2] = b;
    keyed.data[idx + 3] = isGreenKey ? 0 : 255;
  }
}

fs.mkdirSync(outputDir, { recursive: true });

const cellWidth = width / names.length;
const padding = 18;

names.forEach((name, index) => {
  const startX = Math.floor(index * cellWidth);
  const endX = Math.ceil((index + 1) * cellWidth);
  let minX = endX;
  let minY = height;
  let maxX = startX;
  let maxY = 0;

  for (let y = 0; y < height; y += 1) {
    for (let x = startX; x < endX; x += 1) {
      const alpha = keyed.data[((width * y + x) << 2) + 3];
      if (alpha > 0) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }

  minX = Math.max(startX, minX - padding);
  minY = Math.max(0, minY - padding);
  maxX = Math.min(endX - 1, maxX + padding);
  maxY = Math.min(height - 1, maxY + padding);

  const cropWidth = maxX - minX + 1;
  const cropHeight = maxY - minY + 1;
  const out = new PNG({ width: cropWidth, height: cropHeight });

  for (let y = 0; y < cropHeight; y += 1) {
    for (let x = 0; x < cropWidth; x += 1) {
      const srcIdx = (width * (minY + y) + (minX + x)) << 2;
      const outIdx = (cropWidth * y + x) << 2;
      out.data[outIdx] = keyed.data[srcIdx];
      out.data[outIdx + 1] = keyed.data[srcIdx + 1];
      out.data[outIdx + 2] = keyed.data[srcIdx + 2];
      out.data[outIdx + 3] = keyed.data[srcIdx + 3];
    }
  }

  fs.writeFileSync(path.join(outputDir, name), PNG.sync.write(out));
});
