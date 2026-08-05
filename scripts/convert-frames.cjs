/**
 * Prépare une séquence d'images pour <ScrollSequence>.
 *
 * Les exports ezgif sortent ~300 frames JPEG par vidéo, ce qui est bien plus
 * que nécessaire : 50 frames suffisent pour un scrub fluide. Ce script
 * échantillonne, redimensionne et convertit en WebP.
 *
 *   node scripts/convert-frames.cjs <dossier-source> <nom-sequence> [pas]
 *
 * Exemple :
 *   node scripts/convert-frames.cjs ~/Downloads/ezgif-abc123-jpg acte-6-support
 *
 * Sort dans public/images/<nom-sequence>/frame-001.webp ...
 * Le composant s'en sert via slug + frameCount (voir StoryFlow.tsx).
 */
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const [, , srcArg, name, stepArg] = process.argv;

if (!srcArg || !name) {
  console.error("Usage: node scripts/convert-frames.cjs <source> <nom> [pas]");
  process.exit(1);
}

const src = srcArg.replace(/^~/, process.env.USERPROFILE || process.env.HOME);
const outDir = path.join(__dirname, "..", "public", "images", name);

// 1 frame sur 6 : 300 source -> 50 conservées.
const STEP = Number(stepArg) || 6;
const WIDTH = 1280;
const QUALITY = 68;

if (!fs.existsSync(src)) {
  console.error(`Source introuvable : ${src}`);
  process.exit(1);
}

(async () => {
  fs.mkdirSync(outDir, { recursive: true });

  const files = fs
    .readdirSync(src)
    .filter((f) => /\.(jpe?g|png)$/i.test(f))
    .sort();

  if (files.length === 0) {
    console.error("Aucune image dans la source.");
    process.exit(1);
  }

  let n = 0;
  let total = 0;

  for (let i = 0; i < files.length; i += STEP) {
    n++;
    const target = path.join(outDir, `frame-${String(n).padStart(3, "0")}.webp`);
    await sharp(path.join(src, files[i]))
      .resize(WIDTH, null, { withoutEnlargement: true })
      .webp({ quality: QUALITY, effort: 6, smartSubsample: true })
      .toFile(target);
    total += fs.statSync(target).size;
  }

  console.log(`${name} : ${files.length} source -> ${n} frames`);
  console.log(
    `  ${(total / 1024 / 1024).toFixed(2)} Mo au total, ${(total / n / 1024).toFixed(1)} Ko/frame`
  );
  console.log(`  frameCount={${n}} slug="${name}"`);
})();
