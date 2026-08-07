/**
 * Applique les migrations SQL de `db/migrations/`, dans l'ordre des noms.
 *
 *     node --env-file=.env.local scripts/migrate.mjs
 *
 * Chaque fichier appliqué est inscrit dans `schema_migrations` et n'est plus
 * rejoué. Les migrations sont écrites idempotentes de toute façon (`IF NOT
 * EXISTS`), mais la table sert de journal : elle dit ce que la base a vu, ce
 * qu'un `\dt` ne dit pas.
 *
 * Le pilote HTTP de Neon refuse plusieurs instructions dans un même appel
 * (« cannot insert multiple commands into a prepared statement ») : chaque
 * requête part en `PREPARE`. Le fichier est donc **découpé** avant envoi.
 *
 * Le découpage ne peut pas se faire sur un simple `split(";")` : le fichier
 * contient des corps de fonction et des blocs `DO` délimités par `$$`, qui
 * contiennent eux-mêmes des points-virgules. `splitStatements` suit donc l'état
 * du lexer — chaîne simple, dollar-quote, commentaire — avant de couper.
 *
 * Corollaire à connaître : sans transaction englobante, une instruction qui
 * échoue au milieu laisse les précédentes appliquées. D'où l'exigence
 * d'idempotence sur chaque migration.
 */
import { readdir, readFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { neon } from "@neondatabase/serverless";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(root, "db", "migrations");

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error(
    "DATABASE_URL absente. Lancer avec : node --env-file=.env.local scripts/migrate.mjs",
  );
  process.exit(1);
}

const sql = neon(connectionString);

/**
 * Découpe un fichier SQL en instructions.
 *
 * Coupe sur `;` uniquement hors chaîne, hors commentaire et hors dollar-quote.
 * Les dollar-quotes peuvent être étiquetées (`$func$ … $func$`) : l'ouverture
 * mémorise l'étiquette, et seule la même étiquette referme le bloc.
 */
function splitStatements(source) {
  const statements = [];
  let current = "";
  let i = 0;

  while (i < source.length) {
    const rest = source.slice(i);

    // Commentaire de ligne
    if (rest.startsWith("--")) {
      const end = source.indexOf("\n", i);
      const stop = end === -1 ? source.length : end + 1;
      current += source.slice(i, stop);
      i = stop;
      continue;
    }

    // Commentaire de bloc
    if (rest.startsWith("/*")) {
      const end = source.indexOf("*/", i + 2);
      const stop = end === -1 ? source.length : end + 2;
      current += source.slice(i, stop);
      i = stop;
      continue;
    }

    // Chaîne simple — '' échappe une apostrophe à l'intérieur
    if (source[i] === "'") {
      let j = i + 1;
      while (j < source.length) {
        if (source[j] === "'" && source[j + 1] === "'") j += 2;
        else if (source[j] === "'") break;
        else j += 1;
      }
      current += source.slice(i, j + 1);
      i = j + 1;
      continue;
    }

    // Dollar-quote, étiquetée ou non
    const open = rest.match(/^\$([A-Za-z_][A-Za-z0-9_]*)?\$/);
    if (open) {
      const tag = open[0];
      const end = source.indexOf(tag, i + tag.length);
      const stop = end === -1 ? source.length : end + tag.length;
      current += source.slice(i, stop);
      i = stop;
      continue;
    }

    if (source[i] === ";") {
      if (current.trim()) statements.push(current.trim());
      current = "";
      i += 1;
      continue;
    }

    current += source[i];
    i += 1;
  }

  if (current.trim()) statements.push(current.trim());

  // Le dernier fragment d'un fichier est souvent un bloc de commentaires sans
  // instruction. On le reconnaît en retirant les commentaires : s'il ne reste
  // rien, il n'y a rien à exécuter.
  return statements.filter((statement) => {
    const code = statement
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/--[^\n]*/g, "")
      .trim();
    return code.length > 0;
  });
}

await sql`
  CREATE TABLE IF NOT EXISTS schema_migrations (
    name       text PRIMARY KEY,
    applied_at timestamptz NOT NULL DEFAULT now()
  )
`;

const applied = new Set(
  (await sql`SELECT name FROM schema_migrations`).map((r) => r.name),
);

const files = (await readdir(dir)).filter((f) => f.endsWith(".sql")).sort();

let count = 0;
for (const file of files) {
  if (applied.has(file)) {
    console.log(`  = ${file} (déjà appliquée)`);
    continue;
  }
  const body = await readFile(join(dir, file), "utf8");
  const statements = splitStatements(body);
  process.stdout.write(`  → ${file} (${statements.length} instructions) ... `);
  for (const statement of statements) {
    await sql.query(statement);
  }
  await sql`INSERT INTO schema_migrations (name) VALUES (${file})`;
  console.log("ok");
  count += 1;
}

console.log(
  count === 0
    ? "Base à jour, rien à appliquer."
    : `${count} migration(s) appliquée(s).`,
);
