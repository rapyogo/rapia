import { neon } from "@neondatabase/serverless";

/**
 * Accès à la base Neon (Postgres serverless).
 *
 * Le pilote `@neondatabase/serverless` parle à Neon en HTTP plutôt qu'en TCP.
 * C'est ce qui le rend utilisable depuis une fonction Vercel : une lambda ne
 * garde pas de connexion ouverte entre deux requêtes, et un pool Postgres
 * classique y épuise le quota de connexions en quelques minutes de trafic.
 *
 * ## Comment écrire une requête
 *
 * `sql` est un *tagged template* : les valeurs interpolées deviennent des
 * paramètres liés, jamais du texte concaténé.
 *
 * ```ts
 * const rows = await sql`SELECT * FROM users WHERE email = ${email}`;
 * ```
 *
 * **Ne jamais construire une requête par concaténation de chaînes.** La forme
 * ci-dessus est sûre par construction ; `sql(\`... ${email} ...\`)` — avec des
 * parenthèses — ne l'est pas, et se lit presque pareil.
 *
 * ## La variable d'environnement
 *
 * `DATABASE_URL` est posée sur Production, Preview et Development chez Vercel,
 * et dans `.env.local` en local. Elle contient un mot de passe : elle n'a rien
 * à faire dans le dépôt, et `.gitignore` couvre déjà `.env*`.
 */

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  // Message explicite plutôt qu'un `undefined` qui remonterait en erreur
  // obscure au premier appel, souvent en production et jamais en local.
  throw new Error(
    "DATABASE_URL est absente. En local : la poser dans .env.local. " +
      "Sur Vercel : `vercel env add DATABASE_URL <environnement>`.",
  );
}

export const sql = neon(connectionString);
