const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

const input = process.argv[2];

if (!input) {
  console.error('Usage: node scripts/crop-generated-tool-icons.cjs <generated-tool-icon-sheet.png>');
  process.exit(1);
}

const outDir = path.join(__dirname, '..', 'src', 'assets', 'hero-icons');
fs.mkdirSync(outDir, { recursive: true });

const names = ['edit-pdf', 'ppt-pdf', 'excel-pdf', 'pdf-ppt', 'unlock-pdf', 'excel-pdf-alt'];
const source = PNG.sync.read(fs.readFileSync(input));
const columns = 3;
const rows = 2;
const cellW = Math.floor(source.width / columns);
const cellH = Math.floor(source.height / rows);
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

const copyCell = (cellIndex) => {
  const col = cellIndex % columns;
  const row = Math.floor(cellIndex / columns);
  const sx = col * cellW;
  const sy = row * cellH;
  const sw = cellW;
  const sh = cellH;
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
  const scale = Math.min((outputSize * 0.78) / cropW, (outputSize * 0.78) / cropH);
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
      setPixel(out, offX + x, offY + y, getPixel(cell, sourceX, sourceY));
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
