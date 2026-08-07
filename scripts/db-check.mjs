/**
 * Inventaire du schéma appliqué — `npm run db:check`.
 *
 * Sert à répondre à une question simple après une migration : *qu'est-ce qui
 * existe vraiment en base ?* Lire le fichier SQL dit ce qu'on a voulu écrire ;
 * seule la base dit ce qui est passé. L'écart entre les deux est exactement ce
 * qu'une migration idempotente rejouée en silence peut cacher.
 */
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

const tables = await sql`
  SELECT c.relname AS table_name,
         (SELECT count(*) FROM pg_attribute a
           WHERE a.attrelid = c.oid AND a.attnum > 0 AND NOT a.attisdropped)
           AS columns
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
   WHERE n.nspname = 'public' AND c.relkind = 'r'
   ORDER BY c.relname
`;

console.log(`${tables.length} tables :\n`);
for (const t of tables) {
  console.log(`  ${t.table_name.padEnd(26)} ${t.columns} colonnes`);
}

const applied = await sql`
  SELECT name FROM schema_migrations ORDER BY name
`;
console.log(`\nMigrations : ${applied.map((m) => m.name).join(", ")}`);
