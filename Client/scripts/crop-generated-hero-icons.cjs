const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

const input = process.argv[2];

if (!input) {
  console.error('Usage: node scripts/crop-generated-hero-icons.cjs <generated-icon-sheet.png>');
  process.exit(1);
}

const outDir = path.join(__dirname, '..', 'src', 'assets', 'hero-icons');
fs.mkdirSync(outDir, { recursive: true });

const names = [
  'fast',
  'secure',
  'delete',
  'users',
  'conversion',
  'rating',
  'merge-pdf',
  'split-pdf',
  'compress-pdf',
  'pdf-word',
  'word-pdf',
  'xlsx-csv',
  'sign-pdf',
  'lock-pdf',
];

const source = PNG.sync.read(fs.readFileSync(input));
const cellW = Math.floor(source.width / 4);
const cellH = Math.floor(source.height / 4);
const outputSize = 256;

const isGreen = (r, g, b) => g > 205 && r < 80 && b < 80 && g > r * 2.4 && g > b * 2.4;

const getPixel = (png, x, y) => {
  const idx = (y * png.width + x) << 2;
  return [png.data[idx], png.data[idx + 1], png.data[idx + 2], png.data[idx + 3]];
};

const setPixel = (png, x, y, rgba) => {
  const idx = (y * png.width + x) << 2;
  png.data[idx] = rgba[0];
  png.data[idx + 1] = rgba[1];
  png.data[idx + 2] = rgba[2];
  png.data[idx + 3] = rgba[3];
};

const insideRoundRect = (x, y, rx, ry, rw, rh, r) => {
  const cx = Math.max(rx + r, Math.min(x, rx + rw - r));
  const cy = Math.max(ry + r, Math.min(y, ry + rh - r));
  return (x - cx) ** 2 + (y - cy) ** 2 <= r ** 2;
};

const copyRoundedIconCell = (cellIndex) => {
  const col = cellIndex % 4;
  const row = Math.floor(cellIndex / 4);
  const sourcePad = Math.floor(cellW * 0.06);
  const sourceSize = Math.floor(cellW * 0.88);
  const sx = col * cellW + sourcePad;
  const sy = row * cellH + sourcePad;
  const out = new PNG({ width: outputSize, height: outputSize });
  const drawSize = Math.floor(outputSize * 0.84);
  const off = Math.floor((outputSize - drawSize) / 2);
  const radius = Math.floor(drawSize * 0.18);

  for (let y = 0; y < outputSize; y++) {
    for (let x = 0; x < outputSize; x++) setPixel(out, x, y, [0, 0, 0, 0]);
  }

  for (let y = 0; y < drawSize; y++) {
    for (let x = 0; x < drawSize; x++) {
      if (!insideRoundRect(off + x, off + y, off, off, drawSize, drawSize, radius)) continue;
      const sourceX = sx + Math.min(sourceSize - 1, Math.floor((x / drawSize) * sourceSize));
      const sourceY = sy + Math.min(sourceSize - 1, Math.floor((y / drawSize) * sourceSize));
      const pixel = getPixel(source, sourceX, sourceY);
      setPixel(out, off + x, off + y, pixel);
    }
  }

  return out;
};

const copyCell = (cellIndex) => {
  const col = cellIndex % 4;
  const row = Math.floor(cellIndex / 4);
  const padX = 0;
  const padY = 0;
  const sx = col * cellW + padX;
  const sy = row * cellH + padY;
  const sw = cellW - padX * 2;
  const sh = cellH - padY * 2;
  const cell = new PNG({ width: sw, height: sh });
  const background = new Uint8Array(sw * sh);
  const queue = [];

  const enqueueBackground = (x, y) => {
    if (x < 0 || y < 0 || x >= sw || y >= sh) return;
    const markIndex = y * sw + x;
    if (background[markIndex]) return;
    const [r, g, b] = getPixel(source, sx + x, sy + y);
    if (!isGreen(r, g, b)) return;
    background[markIndex] = 1;
    queue.push([x, y]);
  };

  for (let x = 0; x < sw; x++) {
    enqueueBackground(x, 0);
    enqueueBackground(x, sh - 1);
  }
  for (let y = 0; y < sh; y++) {
    enqueueBackground(0, y);
    enqueueBackground(sw - 1, y);
  }

  for (let i = 0; i < queue.length; i++) {
    const [x, y] = queue[i];
    enqueueBackground(x + 1, y);
    enqueueBackground(x - 1, y);
    enqueueBackground(x, y + 1);
    enqueueBackground(x, y - 1);
  }

  let minX = sw;
  let minY = sh;
  let maxX = 0;
  let maxY = 0;

  for (let y = 0; y < sh; y++) {
    for (let x = 0; x < sw; x++) {
      const [r, g, b, a] = getPixel(source, sx + x, sy + y);
      const alpha = background[y * sw + x] ? 0 : a;
      setPixel(cell, x, y, alpha === 0 ? [0, 0, 0, 0] : [r, g, b, alpha]);
      if (alpha > 24) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }

  const trimPad = Math.floor(Math.max(sw, sh) * 0.04);
  minX = Math.max(0, minX - trimPad);
  minY = Math.max(0, minY - trimPad);
  maxX = Math.min(sw - 1, maxX + trimPad);
  maxY = Math.min(sh - 1, maxY + trimPad);

  const cropW = Math.max(1, maxX - minX + 1);
  const cropH = Math.max(1, maxY - minY + 1);
  const out = new PNG({ width: outputSize, height: outputSize });
  const scale = Math.min(outputSize * 0.76 / cropW, outputSize * 0.76 / cropH);
  const drawW = Math.floor(cropW * scale);
  const drawH = Math.floor(cropH * scale);
  const offX = Math.floor((outputSize - drawW) / 2);
  const offY = Math.floor((outputSize - drawH) / 2);

  for (let y = 0; y < outputSize; y++) {
    for (let x = 0; x < outputSize; x++) setPixel(out, x, y, [0, 0, 0, 0]);
  }

  for (let y = 0; y < drawH; y++) {
    for (let x = 0; x < drawW; x++) {
      const sourceX = minX + Math.min(cropW - 1, Math.floor(x / scale));
      const sourceY = minY + Math.min(cropH - 1, Math.floor(y / scale));
      const pixel = getPixel(cell, sourceX, sourceY);
      setPixel(out, offX + x, offY + y, pixel);
    }
  }

  return out;
};

names.forEach((name, index) => {
  const icon = copyCell(index);
  const filePath = path.join(outDir, `${name}.png`);
  fs.writeFileSync(filePath, PNG.sync.write(icon));
  console.log(filePath);
});
