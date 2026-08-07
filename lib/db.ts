import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

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
 * ci-dessus est sûre par construction. `sql(\`... ${email} ...\`)` — avec des
 * parenthèses — ne l'est pas, et se lit presque pareil : le pilote refuse
 * d'ailleurs cet appel et renvoie vers `sql.query(...)`, réservé au DDL sans
 * paramètre.
 *
 * ## Pourquoi le client est créé à la première requête, et pas au chargement
 *
 * Ce module appelait `neon(process.env.DATABASE_URL)` au niveau supérieur. La
 * conséquence n'est apparue qu'au premier déploiement : **`next build` a
 * échoué en entier**, sur `Failed to collect page data for /api/auth/logout`.
 * Rien à voir avec cette route — la phase de collecte évalue les modules, donc
 * elle exécutait la connexion, et une valeur d'environnement fautive suffisait
 * à faire tomber la construction du site complet.
 *
 * C'est le mauvais partage des responsabilités : **construire un site ne
 * demande pas de savoir joindre sa base.** Un mot de passe périmé, une variable
 * mal recopiée, une panne de Neon pendant un déploiement — chacun devrait
 * empêcher les pages qui lisent la base de répondre, et rien d'autre.
 * L'initialisation est donc différée jusqu'à la première requête réelle.
 *
 * Le Proxy sert à garder l'écriture d'appel intacte (`` sql`…` ``,
 * `sql.query(…)`) : passer par un `getSql()` explicite aurait obligé à
 * retoucher chaque appelant pour un détail d'infrastructure.
 *
 * ## La variable d'environnement
 *
 * `DATABASE_URL` est posée sur Production, Preview et Development chez Vercel,
 * et dans `.env.local` en local. Elle contient un mot de passe : elle n'a rien
 * à faire dans le dépôt, et `.gitignore` couvre déjà `.env*`.
 */

/**
 * Marque d'ordre des octets (U+FEFF), construite par son code plutôt
 * qu'écrite en clair : un BOM littéral dans ce fichier serait lui-même
 * invisible à la relecture — précisément le défaut qu'on cherche à corriger.
 */
const BOM = String.fromCharCode(0xfeff);

let client: NeonQueryFunction<false, false> | null = null;

function getClient(): NeonQueryFunction<false, false> {
  if (client) return client;

  const raw = process.env.DATABASE_URL;

  if (!raw) {
    // Message explicite plutôt qu'un `undefined` qui remonterait en erreur
    // obscure au premier appel, souvent en production et jamais en local.
    throw new Error(
      "DATABASE_URL est absente. En local : la poser dans .env.local. " +
        "Sur Vercel : `vercel env add DATABASE_URL <environnement>`.",
    );
  }

  // Un BOM en tête est invisible partout — dans un éditeur, dans
  // `Get-Content`, dans l'interface de Vercel — et rend pourtant la chaîne
  // invalide. Il s'invite dès qu'un `.env` est écrit par `Set-Content
  // -Encoding utf8` sous PowerShell 5.1, puis se propage par copier-coller.
  // Le retirer coûte une ligne ; le diagnostiquer coûte une soirée, et le
  // message d'erreur du pilote recopie la chaîne entière — mot de passe
  // compris — dans les journaux de build.
  const connectionString = (raw.startsWith(BOM) ? raw.slice(1) : raw).trim();

  client = neon(connectionString);
  return client;
}

/**
 * Le client SQL. S'initialise à la première requête (voir ci-dessus).
 *
 * `get` renvoie les méthodes liées au client réel (`sql.query`,
 * `sql.transaction`), `apply` sert à l'usage en tagged template.
 */
export const sql = new Proxy(
  // La cible est une fonction : un Proxy ne peut piéger `apply` que si sa
  // cible est appelable.
  function () {} as unknown as NeonQueryFunction<false, false>,
  {
    apply(_target, _thisArg, args: unknown[]) {
      return (getClient() as unknown as (...a: unknown[]) => unknown)(...args);
    },
    get(_target, property) {
      const instance = getClient() as unknown as Record<string | symbol, unknown>;
      const value = instance[property];
      return typeof value === "function" ? value.bind(instance) : value;
    },
  },
);
