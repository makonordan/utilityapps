/**
 * Generates app/favicon.ico from app/icon.svg (the UtilityApps mark).
 *
 *   node scripts/build-favicon.mjs
 *
 * Produces a multi-resolution .ico (16/32/48 px) with PNG-encoded frames.
 */
import sharp from "sharp";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SVG = resolve(ROOT, "app", "icon.svg");
const OUT = resolve(ROOT, "app", "favicon.ico");
const SIZES = [16, 32, 48];

const svg = readFileSync(SVG);

const pngs = [];
for (const size of SIZES) {
  pngs.push(
    await sharp(svg, { density: 384 }).resize(size, size).png().toBuffer()
  );
}

// ICONDIR header (6 bytes)
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: 1 = icon
header.writeUInt16LE(SIZES.length, 4); // image count

// ICONDIRENTRY (16 bytes each)
const entries = [];
let offset = 6 + SIZES.length * 16;
SIZES.forEach((size, i) => {
  const e = Buffer.alloc(16);
  e.writeUInt8(size >= 256 ? 0 : size, 0); // width
  e.writeUInt8(size >= 256 ? 0 : size, 1); // height
  e.writeUInt8(0, 2); // palette colours
  e.writeUInt8(0, 3); // reserved
  e.writeUInt16LE(1, 4); // colour planes
  e.writeUInt16LE(32, 6); // bits per pixel
  e.writeUInt32LE(pngs[i].length, 8); // image data size
  e.writeUInt32LE(offset, 12); // image data offset
  offset += pngs[i].length;
  entries.push(e);
});

writeFileSync(OUT, Buffer.concat([header, ...entries, ...pngs]));
console.log("Wrote", OUT, `(${SIZES.join(", ")} px)`);
