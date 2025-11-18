// tools/gen-images.mjs
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const q = {
  avif: { quality: 35, effort: 4 },     // можно поджать/усилить
  webp: { quality: 78 }
};

const ensureDir = p => fs.mkdirSync(p, { recursive: true });

async function makeSet(src, outDir, baseName, widths){
  ensureDir(outDir);
  const input = path.resolve(src);
  for (const w of widths){
    const avifOut = path.join(outDir, `${baseName}-${w}.avif`);
    const webpOut = path.join(outDir, `${baseName}-${w}.webp`);
    await sharp(input).resize({ width: w }).toFormat("avif", q.avif).toFile(avifOut);
    await sharp(input).resize({ width: w }).toFormat("webp", q.webp).toFile(webpOut);
    console.log(`✓ ${baseName} ${w}px -> avif/webp`);
  }
}

// === ТВОЙ СПИСОК ФАЙЛОВ ===

// HERO (1600/1280/960/640)
const hero = [
  "hero-mobile-mechanic",
  "hero-diagnostics",
  "hero-engine",
  "hero-oil",
  "hero-suspension",
  "hero-transmission"
];

// DETAILS (1600/1280/960/640)
const details = [
  "details-mobile-mechanic",
  "details-diagnostics",
  "details-engine",
  "details-transmission",
  "details-suspension",
  "details-oil"
];

// GRID (компактные: 600/400)
const grid = [
  "grid-mobile-mechanic",
  "grid-diag",
  "grid-engine",
  "grid-trans",
  "grid-susp",
  "grid-oil"
];

// USE-CASES (mm.jpeg): 1280/960/640
const mmWidths = [1280, 960, 640];

// === ЗАПУСК ===
(async function run(){
  // HERO
  for (const name of hero){
    await makeSet(`img/hero/${name}.jpeg`, "img/hero", name, [1600,1280,960,640]);
  }

  // DETAILS
  for (const name of details){
    await makeSet(`img/details/${name}.jpeg`, "img/details", name, [1600,1280,960,640]);
  }

  // GRID
  for (const name of grid){
    await makeSet(`img/grid/${name}.jpeg`, "img/grid", name, [600,400]);
  }

  // USE-CASES one-off
  await makeSet("img/mm.jpeg", "img", "mm", mmWidths);

  // MISC (process image for "How it works"): 1280/960/640
  await makeSet("img/misc/process-visit.jpeg", "img/misc", "process-visit", [1280, 960, 640]);

  console.log("\nAll done.");
})().catch(err => {
  console.error(err);
  process.exit(1);
});