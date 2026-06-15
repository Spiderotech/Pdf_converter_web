const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

const outDir = path.join(__dirname, '..', 'src', 'assets', 'hero-icons');
fs.mkdirSync(outDir, { recursive: true });

const size = 256;

const icons = [
  ['fast', [37, 99, 235], 'zap'],
  ['secure', [16, 185, 129], 'shield'],
  ['delete', [124, 58, 237], 'trash'],
  ['users', [37, 99, 235], 'users'],
  ['conversion', [249, 115, 22], 'zap'],
  ['rating', [139, 92, 246], 'star'],
  ['merge-pdf', [220, 38, 38], 'merge'],
  ['split-pdf', [124, 58, 237], 'split'],
  ['compress-pdf', [6, 182, 212], 'compress'],
  ['pdf-word', [37, 99, 235], 'document'],
  ['word-pdf', [37, 99, 235], 'document-lines'],
  ['xlsx-csv', [16, 185, 129], 'grid'],
  ['sign-pdf', [249, 115, 22], 'sign'],
  ['lock-pdf', [124, 58, 237], 'lock'],
];

const blendPixel = (png, x, y, rgba) => {
  if (x < 0 || y < 0 || x >= size || y >= size) return;
  const idx = (Math.round(y) * size + Math.round(x)) << 2;
  const a = rgba[3] / 255;
  const ia = 1 - a;
  png.data[idx] = Math.round(rgba[0] * a + png.data[idx] * ia);
  png.data[idx + 1] = Math.round(rgba[1] * a + png.data[idx + 1] * ia);
  png.data[idx + 2] = Math.round(rgba[2] * a + png.data[idx + 2] * ia);
  png.data[idx + 3] = Math.min(255, Math.round(rgba[3] + png.data[idx + 3] * ia));
};

const insideRoundRect = (x, y, rx, ry, rw, rh, r) => {
  const cx = Math.max(rx + r, Math.min(x, rx + rw - r));
  const cy = Math.max(ry + r, Math.min(y, ry + rh - r));
  const dx = x - cx;
  const dy = y - cy;
  return dx * dx + dy * dy <= r * r;
};

const fillRoundRect = (png, x, y, w, h, r, top, bottom, alpha = 255) => {
  for (let py = Math.floor(y); py <= y + h; py++) {
    const t = Math.max(0, Math.min(1, (py - y) / h));
    const color = [
      Math.round(top[0] * (1 - t) + bottom[0] * t),
      Math.round(top[1] * (1 - t) + bottom[1] * t),
      Math.round(top[2] * (1 - t) + bottom[2] * t),
      alpha,
    ];
    for (let px = Math.floor(x); px <= x + w; px++) {
      if (insideRoundRect(px, py, x, y, w, h, r)) blendPixel(png, px, py, color);
    }
  }
};

const fillCircle = (png, cx, cy, r, color) => {
  for (let y = Math.floor(cy - r); y <= cy + r; y++) {
    for (let x = Math.floor(cx - r); x <= cx + r; x++) {
      if ((x - cx) ** 2 + (y - cy) ** 2 <= r ** 2) blendPixel(png, x, y, color);
    }
  }
};

const line = (png, x1, y1, x2, y2, width, color) => {
  const steps = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1)) * 2;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    fillCircle(png, x1 + (x2 - x1) * t, y1 + (y2 - y1) * t, width / 2, color);
  }
};

const poly = (png, points, color) => {
  const minY = Math.floor(Math.min(...points.map((p) => p[1])));
  const maxY = Math.ceil(Math.max(...points.map((p) => p[1])));
  for (let y = minY; y <= maxY; y++) {
    const nodes = [];
    for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
      const [xi, yi] = points[i];
      const [xj, yj] = points[j];
      if ((yi < y && yj >= y) || (yj < y && yi >= y)) {
        nodes.push(xi + ((y - yi) / (yj - yi)) * (xj - xi));
      }
    }
    nodes.sort((a, b) => a - b);
    for (let i = 0; i < nodes.length; i += 2) {
      for (let x = Math.floor(nodes[i]); x < nodes[i + 1]; x++) blendPixel(png, x, y, color);
    }
  }
};

const strokeRoundRect = (png, x, y, w, h, r, width, color) => {
  fillRoundRect(png, x, y, w, h, r, color, color, color[3]);
  fillRoundRect(png, x + width, y + width, w - width * 2, h - width * 2, Math.max(0, r - width), [0, 0, 0], [0, 0, 0], 0);
};

const drawDocument = (png, x, y, w, h, color, lines = true) => {
  fillRoundRect(png, x, y, w, h, 10, [255, 255, 255], [245, 250, 255], 245);
  poly(png, [[x + w - 35, y], [x + w, y + 35], [x + w - 35, y + 35]], [210, 229, 255, 255]);
  if (lines) {
    line(png, x + 22, y + 54, x + w - 22, y + 54, 8, color);
    line(png, x + 22, y + 78, x + w - 30, y + 78, 8, color);
    line(png, x + 22, y + 102, x + w - 44, y + 102, 8, color);
  }
};

const drawIcon = (png, type, color) => {
  const white = [255, 255, 255, 255];
  const pale = [255, 255, 255, 210];

  if (type === 'shield') {
    poly(png, [[128, 64], [174, 82], [168, 128], [128, 178], [88, 128], [82, 82]], pale);
    line(png, 106, 124, 122, 140, 12, color);
    line(png, 122, 140, 154, 105, 12, color);
  }
  if (type === 'trash') {
    fillRoundRect(png, 90, 98, 76, 78, 12, pale, white, 245);
    line(png, 82, 92, 174, 92, 12, white);
    line(png, 108, 78, 148, 78, 12, white);
    line(png, 114, 118, 114, 158, 8, color);
    line(png, 142, 118, 142, 158, 8, color);
  }
  if (type === 'users') {
    fillCircle(png, 112, 96, 22, white);
    fillCircle(png, 154, 104, 18, [255, 255, 255, 220]);
    line(png, 78, 168, 146, 168, 28, white);
    line(png, 138, 170, 182, 170, 22, [255, 255, 255, 220]);
  }
  if (type === 'zap') {
    poly(png, [[142, 54], [86, 134], [123, 134], [112, 200], [172, 112], [133, 112]], white);
  }
  if (type === 'star') {
    poly(png, [[128, 54], [146, 104], [199, 106], [157, 138], [172, 190], [128, 160], [84, 190], [99, 138], [57, 106], [110, 104]], white);
  }
  if (type === 'merge') {
    drawDocument(png, 70, 70, 70, 106, color, false);
    drawDocument(png, 116, 88, 70, 106, color, false);
    line(png, 88, 136, 168, 136, 12, color);
    poly(png, [[168, 136], [142, 116], [142, 156]], color);
  }
  if (type === 'split') {
    drawDocument(png, 78, 68, 100, 122, color, false);
    line(png, 128, 72, 128, 186, 10, color);
    line(png, 106, 128, 82, 106, 9, color);
    line(png, 106, 128, 82, 150, 9, color);
    line(png, 150, 128, 174, 106, 9, color);
    line(png, 150, 128, 174, 150, 9, color);
  }
  if (type === 'compress') {
    fillRoundRect(png, 70, 70, 48, 48, 10, pale, white, 245);
    fillRoundRect(png, 138, 70, 48, 48, 10, pale, white, 245);
    fillRoundRect(png, 70, 138, 48, 48, 10, pale, white, 245);
    fillRoundRect(png, 138, 138, 48, 48, 10, pale, white, 245);
    line(png, 128, 90, 128, 166, 9, color);
    line(png, 90, 128, 166, 128, 9, color);
  }
  if (type === 'document') drawDocument(png, 78, 58, 100, 138, color, true);
  if (type === 'document-lines') {
    drawDocument(png, 78, 58, 100, 138, color, true);
    poly(png, [[103, 96], [116, 154], [128, 120], [141, 154], [154, 96], [143, 96], [136, 130], [128, 102], [120, 130], [113, 96]], color);
  }
  if (type === 'grid') {
    for (const y of [76, 124]) {
      for (const x of [76, 124]) fillRoundRect(png, x, y, 44, 44, 9, pale, white, 245);
    }
    fillRoundRect(png, 124, 172, 44, 20, 9, pale, white, 245);
    line(png, 92, 92, 104, 104, 6, color);
  }
  if (type === 'sign') {
    line(png, 70, 172, 188, 172, 9, white);
    line(png, 82, 154, 112, 96, 9, white);
    line(png, 112, 96, 132, 150, 9, white);
    line(png, 132, 150, 154, 126, 9, white);
    line(png, 154, 126, 178, 144, 9, white);
    line(png, 154, 70, 184, 100, 10, pale);
  }
  if (type === 'lock') {
    fillRoundRect(png, 76, 108, 104, 76, 14, pale, white, 245);
    line(png, 96, 108, 96, 92, 12, white);
    line(png, 96, 92, 128, 72, 12, white);
    line(png, 128, 72, 160, 92, 12, white);
    line(png, 160, 92, 160, 108, 12, white);
    fillCircle(png, 128, 144, 9, color);
    line(png, 128, 144, 128, 164, 7, color);
  }
};

for (const [name, rgb, type] of icons) {
  const png = new PNG({ width: size, height: size });
  const top = rgb.map((v) => Math.min(255, v + 52));
  const bottom = rgb.map((v) => Math.max(0, v - 26));

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) << 2;
      png.data[idx] = 0;
      png.data[idx + 1] = 0;
      png.data[idx + 2] = 0;
      png.data[idx + 3] = 0;
    }
  }

  fillRoundRect(png, 34, 42, 188, 188, 44, [40, 80, 150], [20, 45, 95], 28);
  fillRoundRect(png, 28, 28, 188, 188, 44, top, bottom, 255);
  fillCircle(png, 72, 70, 34, [255, 255, 255, 42]);
  fillCircle(png, 184, 180, 44, [255, 255, 255, 24]);
  drawIcon(png, type, [...rgb, 255]);

  const filePath = path.join(outDir, `${name}.png`);
  fs.writeFileSync(filePath, PNG.sync.write(png));
  console.log(filePath);
}
