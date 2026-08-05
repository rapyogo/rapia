/**
 * Convertit les PNG Higgsfield en WebP dimensionnes pour leur usage reel.
 * Chaque image est redimensionnee a la largeur ou elle sera effectivement
 * affichee (x2 pour les ecrans haute densite), pas a sa taille source.
 */
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const RAW = "C:/Users/RAPYOGO/AppData/Local/Temp/claude/c--Users-RAPYOGO-rapia/e7d72449-aeee-4173-9546-17c902989c38/scratchpad/raw";
const OUT = "C:/Users/RAPYOGO/rapia/public/images/photos";

// largeur cible, qualite
const plan = {
  "master": [1920, 82],

  "service-conseil": [1200, 82],
  "service-formation": [1200, 82],
  "service-implementation": [1200, 82],
  "service-automatisation": [1200, 82],

  "cas-rh": [800, 82],
  "cas-commercial": [800, 82],
  "cas-service-client": [800, 82],
  "cas-ong": [800, 82],
  "cas-finance": [800, 82],
  "cas-direction": [800, 82],

  "methode-1-comprendre": [1600, 82],
  "methode-2-identifier": [1600, 82],
  "methode-3-construire": [1600, 82],
  "methode-4-former": [1600, 82],

  "academy": [1600, 82],
  "contexte-africain": [1600, 82],
  "equipe": [1600, 82],
  "banniere-ressources": [1920, 80],

  "public-entreprises": [800, 82],
  "public-ong": [800, 82],
  "public-institutions": [800, 82],
  "public-professionnels": [800, 82],

  "detail-clavier": [1200, 82],
  "detail-whiteboard": [1200, 82],
  "detail-plante": [1200, 82],

  // Aplats et traits nets : une qualite plus haute evite le fourmillement.
  "graphique-systemes": [900, 92],
  "dashboard-mockup": [1200, 92],
};

fs.mkdirSync(OUT, { recursive: true });

(async () => {
  let totalIn = 0;
  let totalOut = 0;
  const rows = [];

  for (const [slug, [width, quality]] of Object.entries(plan)) {
    const src = path.join(RAW, `${slug}.png`);
    if (!fs.existsSync(src)) {
      rows.push(`${slug.padEnd(24)} MANQUANT`);
      continue;
    }
    const dest = path.join(OUT, `${slug}.webp`);
    await sharp(src)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality, effort: 6, smartSubsample: true })
      .toFile(dest);

    const inKb = fs.statSync(src).size / 1024;
    const outKb = fs.statSync(dest).size / 1024;
    totalIn += inKb;
    totalOut += outKb;
    rows.push(
      `${slug.padEnd(24)} ${String(width).padStart(4)}px  ${outKb.toFixed(0).padStart(4)} Ko  (-${Math.round((1 - outKb / inKb) * 100)}%)`
    );
  }

  console.log(rows.join("\n"));
  console.log("");
  console.log(`Total : ${(totalIn / 1024).toFixed(1)} Mo -> ${(totalOut / 1024).toFixed(2)} Mo`);
})();
