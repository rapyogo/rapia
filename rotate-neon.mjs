/**
 * Rotation du mot de passe Neon.
 * Usage : node --env-file=.env.local rotate-neon.mjs
 *
 * Le mot de passe genere n'est jamais affiche. Seul le succes est imprime.
 * Le fichier .env.local est relu et reecrit sans BOM a la fin.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { randomBytes } from "node:crypto";

const ENV_PATH = "C:/Users/RAPYOGO/rapia/.env.local";

// ---- 1. Lire la chaine, ou qu'elle soit et quel que soit son BOM ----

let raw = process.env.DATABASE_URL;
if (!raw) {
  // Fallback : l'option --env-file n'a pas ete passee.
  const file = readFileSync(ENV_PATH, "utf8");
  const m = file.match(/^DATABASE_URL\s*=\s*"?([^"\r\n]+)"?/m);
  if (!m) throw new Error("DATABASE_URL introuvable");
  raw = m[1];
}

// U+FEFF peut preceder la valeur si .env.local a ete ecrit par PowerShell 5.1
// ou par `neon init`. `charCodeAt(0)` ne ment pas, contrairement a un
// caractere BOM ecrit en litteral dans ce fichier — qui serait invisible.
if (raw.charCodeAt(0) === 0xfeff) raw = raw.slice(1);
raw = raw.trim();

// ---- 2. Tourner le mot de passe ----

const url = new URL(raw);
const role = decodeURIComponent(url.username);
const newPass = randomBytes(24).toString("base64url");

const { neon } = await import("@neondatabase/serverless");
const sql = neon(raw);

const [{ now }] = await sql`SELECT now() AS now`;
console.log(`Connecte (${now}) — role : ${role}`);

await sql.query(`ALTER ROLE "${role}" WITH PASSWORD '${newPass}'`);
console.log("ALTER ROLE execute.");

// ---- 3. Verifier la nouvelle chaine ----

url.password = newPass;
const newConn = url.toString();

const sql2 = neon(newConn);
const [{ ok }] = await sql2`SELECT 1 AS ok`;
if (ok !== 1) throw new Error("La nouvelle chaine ne repond pas");
console.log("Nouvelle chaine verifiee.");

// ---- 4. Mettre .env.local a jour, SANS BOM ----

let file = readFileSync(ENV_PATH, "utf8");
// Nettoyer un BOM existant...
if (file.charCodeAt(0) === 0xfeff) file = file.slice(1);
// ...et remplacer la ligne DATABASE_URL.
file = file.replace(/^DATABASE_URL\s*=\s*.*$/m, `DATABASE_URL="${newConn}"`);

writeFileSync(ENV_PATH, file, "utf8");
console.log(".env.local mis a jour.");
