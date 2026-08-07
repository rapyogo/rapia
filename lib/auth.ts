import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { sql } from "@/lib/db";
import { SITE_URL } from "@/lib/site";

/**
 * Authentification de l'espace client — **lien magique par e-mail**.
 *
 * ## Pourquoi pas de mot de passe
 *
 * Le choix a été arrêté avec l'utilisateur le 2026-08-07. Trois raisons, dans
 * l'ordre où elles pèsent :
 *
 * 1. **Rien à voler.** Aucun mot de passe stocké, donc aucun mot de passe à
 *    faire fuiter — et aucun visiteur qui réutilise ici celui de sa banque.
 * 2. **L'infrastructure existe déjà.** Brevo envoie les e-mails du formulaire
 *    de contact depuis le 2026-08-06, domaine authentifié SPF et DKIM. Le lien
 *    magique ne coûte donc qu'un envoi de plus.
 * 3. **Un geste au lieu de deux.** S'inscrire et se connecter sont la même
 *    action : le public visé n'a pas de gestionnaire de mots de passe.
 *
 * Neon Auth a été écarté pour la même raison qu'un service tiers en général :
 * il aurait tenu une table de comptes parallèle à `users`, qu'il aurait fallu
 * synchroniser, et fait partir les e-mails hors de Brevo.
 *
 * ## Ce qui est stocké
 *
 * **Jamais le jeton, toujours son empreinte.** `auth_tokens.token_hash` et
 * `sessions.token_hash` contiennent un SHA-256. Quelqu'un qui obtiendrait une
 * copie de la base n'y trouverait pas de quoi se connecter à la place d'un
 * membre — il lui faudrait inverser le hash.
 *
 * ## Le compte se crée à la première demande
 *
 * `requestMagicLink()` crée l'utilisateur s'il n'existe pas. C'est ce qui rend
 * inscription et connexion indiscernables — y compris pour un attaquant : la
 * route répond exactement la même chose dans les deux cas, et n'apprend donc à
 * personne quelles adresses ont un compte ici.
 *
 * ## Ce module est réservé au serveur
 *
 * Il lit des cookies, parle à la base et manipule des secrets : rien ici ne
 * doit jamais partir dans un bundle navigateur. Le paquet `server-only`, qui
 * ferait échouer le build en cas d'import fautif, n'est pas installé — la
 * bibliothèque de composants du projet tient à zéro dépendance externe. La
 * garde est donc humaine : **n'importer `lib/auth` que depuis un composant
 * serveur ou une route API**, jamais depuis un fichier portant `"use client"`.
 */

/** Durée de validité d'un lien magique. */
const TOKEN_TTL_MINUTES = 15;

/**
 * Durée d'une session, décidée avec l'utilisateur : **30 jours glissants**.
 *
 * Un espace de formation se consulte par à-coups — on revient sur un cours
 * trois semaines plus tard. Une session courte obligerait à repasser par la
 * boîte mail à chaque visite, ce qui consomme le quota Brevo (300 e-mails par
 * jour) pour rien. « Glissante » : chaque visite repousse l'échéance, si bien
 * qu'un membre actif ne se reconnecte jamais et qu'un compte abandonné se
 * ferme tout seul.
 */
const SESSION_TTL_DAYS = 30;

/** Au-delà de cette fraction écoulée, la session est prolongée à la volée. */
const SESSION_RENEW_AFTER = 0.5;

const COOKIE_NAME = "rapia_session";

export type SessionUser = {
  id: string;
  email: string;
  fullName: string | null;
  handle: string | null;
  avatarUrl: string | null;
  locale: string;
  role: "client" | "staff" | "admin";
  emailVerifiedAt: Date | null;
};

/** Empreinte d'un jeton. SHA-256 suffit : le secret fait déjà 256 bits. */
function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/**
 * Jeton opaque de 32 octets.
 *
 * `base64url` plutôt que `hex` : même entropie, un tiers de caractères en
 * moins, et aucun caractère à échapper dans une URL — le jeton voyage dans un
 * lien cliqué depuis une boîte mail, où le moindre `+` mal encodé casse la
 * connexion sans rien expliquer à personne.
 */
function generateToken(): string {
  return randomBytes(32).toString("base64url");
}

/**
 * Demande un lien de connexion.
 *
 * Crée le compte si l'adresse est inconnue. Retourne l'URL à envoyer — cette
 * fonction **n'envoie rien** : c'est la route qui appelle `sendMagicLink()`,
 * pour que la logique d'authentification ne dépende pas du transporteur.
 */
export async function requestMagicLink(
  email: string,
  locale: string,
  redirectTo?: string,
): Promise<{ url: string; userId: string; isNew: boolean }> {
  const normalized = email.trim().toLowerCase();

  // `citext` rend la comparaison insensible à la casse côté base : inutile de
  // s'en remettre au `toLowerCase()` ci-dessus pour l'unicité.
  const existing = await sql`
    SELECT id FROM users WHERE email = ${normalized} LIMIT 1
  `;

  let userId: string;
  let isNew = false;

  if (existing.length > 0) {
    userId = existing[0].id as string;
  } else {
    const created = await sql`
      INSERT INTO users (email, locale)
      VALUES (${normalized}, ${locale})
      RETURNING id
    `;
    userId = created[0].id as string;
    isNew = true;
  }

  // Les liens précédents encore valides sont invalidés : demander un nouveau
  // lien doit annuler l'ancien, sinon un e-mail oublié dans une boîte partagée
  // reste une porte ouverte pendant un quart d'heure.
  await sql`
    UPDATE auth_tokens
       SET consumed_at = now()
     WHERE user_id = ${userId}
       AND purpose = 'login'
       AND consumed_at IS NULL
  `;

  const token = generateToken();
  const expiresAt = new Date(Date.now() + TOKEN_TTL_MINUTES * 60_000);

  await sql`
    INSERT INTO auth_tokens (user_id, token_hash, purpose, expires_at)
    VALUES (${userId}, ${hashToken(token)}, 'login', ${expiresAt.toISOString()})
  `;

  const url = new URL(`${SITE_URL}/${locale}/connexion/verifier`);
  url.searchParams.set("token", token);
  // La destination voyage à part du jeton et n'est jamais un domaine externe
  // (voir `safeRedirect`) : un lien de connexion ne doit pas pouvoir servir à
  // renvoyer quelqu'un ailleurs après l'avoir authentifié.
  if (redirectTo) url.searchParams.set("suite", redirectTo);

  return { url: url.toString(), userId, isNew };
}

/**
 * Consomme un lien magique et ouvre une session.
 *
 * Retourne `null` si le jeton est inconnu, expiré ou déjà utilisé — les trois
 * cas se ressemblent trop pour mériter des messages distincts, et les
 * distinguer renseignerait un attaquant sur ce qu'il a trouvé.
 */
export async function consumeMagicLink(
  token: string,
  userAgent?: string,
): Promise<{ sessionToken: string; user: SessionUser } | null> {
  if (!token) return null;

  const rows = await sql`
    UPDATE auth_tokens
       SET consumed_at = now()
     WHERE token_hash = ${hashToken(token)}
       AND purpose = 'login'
       AND consumed_at IS NULL
       AND expires_at > now()
    RETURNING user_id
  `;

  // La consommation et la vérification sont la **même** instruction : entre un
  // SELECT et un UPDATE séparés, deux clics simultanés sur le même lien
  // ouvriraient deux sessions. Ici, le second `UPDATE` ne trouve plus rien.
  if (rows.length === 0) return null;

  const userId = rows[0].user_id as string;

  // Cliquer sur le lien prouve la possession de la boîte mail : c'est
  // exactement ce que « vérifier son adresse » veut dire. Un second e-mail de
  // confirmation ne prouverait rien de plus et coûterait un envoi.
  await sql`
    UPDATE users
       SET email_verified_at = COALESCE(email_verified_at, now()),
           last_seen_at = now()
     WHERE id = ${userId}
  `;

  const sessionToken = generateToken();
  const expiresAt = new Date(Date.now() + SESSION_TTL_DAYS * 86_400_000);

  await sql`
    INSERT INTO sessions (user_id, token_hash, user_agent, expires_at)
    VALUES (${userId}, ${hashToken(sessionToken)},
            ${userAgent ?? null}, ${expiresAt.toISOString()})
  `;

  const user = await findSessionUser(sessionToken);
  if (!user) return null;

  return { sessionToken, user };
}

/** Charge l'utilisateur derrière un jeton de session, ou `null`. */
async function findSessionUser(sessionToken: string): Promise<SessionUser | null> {
  const rows = await sql`
    SELECT u.id, u.email, u.full_name, u.handle, u.avatar_url,
           u.locale, u.role, u.email_verified_at, u.suspended_at,
           s.expires_at, s.created_at
      FROM sessions s
      JOIN users u ON u.id = s.user_id
     WHERE s.token_hash = ${hashToken(sessionToken)}
       AND s.expires_at > now()
     LIMIT 1
  `;

  if (rows.length === 0) return null;

  const row = rows[0];

  // Un compte suspendu garde ses données et perd l'accès. Le vérifier ici
  // plutôt qu'à chaque page évite qu'une route oubliée reste ouverte.
  if (row.suspended_at) return null;

  return {
    id: row.id as string,
    email: row.email as string,
    fullName: (row.full_name as string) ?? null,
    handle: (row.handle as string) ?? null,
    avatarUrl: (row.avatar_url as string) ?? null,
    locale: row.locale as string,
    role: row.role as SessionUser["role"],
    emailVerifiedAt: row.email_verified_at
      ? new Date(row.email_verified_at as string)
      : null,
  };
}

/** Pose le cookie de session. */
export async function setSessionCookie(sessionToken: string): Promise<void> {
  const store = await cookies();
  store.set(COOKIE_NAME, sessionToken, {
    httpOnly: true,
    // En développement, le site est servi en clair : un cookie `secure` ne
    // serait jamais renvoyé et la connexion échouerait sans rien signaler.
    secure: process.env.NODE_ENV === "production",
    // `lax` et non `strict` : le lien est cliqué depuis une boîte mail, donc
    // depuis un autre site. `strict` retiendrait le cookie sur cette première
    // navigation, et le membre arriverait déconnecté sur sa propre page.
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_DAYS * 86_400,
  });
}

/**
 * La session en cours, ou `null`.
 *
 * Prolonge la session au passage quand elle a dépassé la moitié de sa vie —
 * c'est ce qui la rend glissante. La prolongation n'est pas awaited côté
 * cookie : la lecture ne doit pas ralentir le rendu d'une page.
 */
export async function getSessionUser(): Promise<SessionUser | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const user = await findSessionUser(token);
  if (!user) return null;

  await sql`
    UPDATE sessions
       SET expires_at = now() + ${`${SESSION_TTL_DAYS} days`}::interval
     WHERE token_hash = ${hashToken(token)}
       AND expires_at < now() + ${`${SESSION_TTL_DAYS * SESSION_RENEW_AFTER} days`}::interval
  `;

  return user;
}

/** Ferme la session courante — en base **et** dans le navigateur. */
export async function destroySession(): Promise<void> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;

  if (token) {
    // Supprimer la ligne, pas seulement le cookie : un jeton effacé côté
    // navigateur mais toujours valide en base reste utilisable par quiconque
    // l'a intercepté.
    await sql`DELETE FROM sessions WHERE token_hash = ${hashToken(token)}`;
  }

  store.delete(COOKIE_NAME);
}

/**
 * Nettoie une destination de redirection.
 *
 * N'accepte qu'un chemin interne commençant par `/` et **pas** par `//` — un
 * `//evil.example` est une URL absolue pour un navigateur, et transformerait
 * le lien de connexion en tremplin vers un site tiers. Tout le reste retombe
 * sur l'espace membre.
 */
export function safeRedirect(value: string | null | undefined, locale: string): string {
  if (!value) return `/${locale}/espace`;
  if (!value.startsWith("/") || value.startsWith("//")) return `/${locale}/espace`;
  return value;
}

/**
 * Comparaison à temps constant de deux chaînes courtes.
 *
 * Réservée aux secrets comparés en mémoire (un jeton de callback opérateur,
 * par exemple). Les jetons de session, eux, sont comparés par la base via leur
 * empreinte et n'en ont pas besoin.
 */
export function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}
