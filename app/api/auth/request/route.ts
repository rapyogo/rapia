// app/api/auth/request/route.ts
// Demande d'un lien de connexion à l'espace client.
// Orchestration : validation → honeypot → limite par IP → limite par adresse →
// création du jeton → envoi Brevo.

import { NextResponse } from "next/server";
import { requestMagicLink } from "@/lib/auth";
import { sendMagicLink } from "@/lib/email";
import { sql } from "@/lib/db";

/**
 * ## La réponse est toujours la même
 *
 * Que l'adresse ait un compte ou non, qu'elle soit limitée ou non, la route
 * répond `200 { sent: true }`. C'est délibéré : une réponse qui varierait
 * transformerait ce formulaire en **oracle d'existence de comptes** — on
 * saisit une adresse, on lit la réponse, on sait si la personne est cliente de
 * RapIA. Pour une agence dont les clients sont des ONG et des institutions,
 * c'est une fuite qui a des conséquences hors du site.
 *
 * Les seuls cas qui renvoient autre chose sont ceux où **rien n'a été tenté** :
 * une adresse syntaxiquement invalide (400) et une panne d'envoi (500).
 */

// ---------------------------------------------------------------------------
// Limite par IP — anti-inondation
//
// MÊME LIMITE CONNUE QUE `/api/contact` : sur Vercel, chaque instance a sa
// propre mémoire, donc deux instances chaudes laissent passer deux demandes
// dans la même fenêtre. Suffisant ici, parce que la limite par adresse
// ci-dessous, elle, est en base et n'a pas ce défaut. Celle-ci ne sert qu'à
// empêcher qu'une seule machine crée mille comptes avec mille adresses.
// ---------------------------------------------------------------------------

const IP_WINDOW = 60_000;
const IP_MAX = 5;

const ipHits = new Map<string, { count: number; resetAt: number }>();

function isIpRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = ipHits.get(ip);

  if (!entry || now > entry.resetAt) {
    ipHits.set(ip, { count: 1, resetAt: now + IP_WINDOW });
    return false;
  }

  if (entry.count >= IP_MAX) return true;

  entry.count++;
  return false;
}

/** Un lien à la fois par adresse, au plus un par minute. */
const EMAIL_WINDOW_SECONDS = 60;

const EMAIL_MAX_LENGTH = 320;

export async function POST(request: Request) {
  let body: Record<string, unknown>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const { email, locale, redirectTo, _website } = body;

  // Honeypot : même dispositif que le formulaire de contact. Le bot croit
  // avoir réussi, le quota Brevo est préservé, et rien n'est écrit en base.
  if (typeof _website === "string" && _website.length > 0) {
    return NextResponse.json({ sent: true });
  }

  if (
    typeof email !== "string" ||
    email.length > EMAIL_MAX_LENGTH ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    return NextResponse.json(
      { error: "Adresse e-mail invalide." },
      { status: 400 },
    );
  }

  const normalized = email.trim().toLowerCase();
  const lang = locale === "en" ? "en" : "fr";
  const suite = typeof redirectTo === "string" ? redirectTo : undefined;

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "inconnue";

  if (isIpRateLimited(ip)) {
    // Volontairement indiscernable d'un succès — voir l'en-tête du fichier.
    return NextResponse.json({ sent: true });
  }

  // Limite par adresse, tenue en base : elle survit au recyclage des instances
  // et protège vraiment le quota Brevo (300 e-mails par jour). Un membre qui
  // clique deux fois sur « envoyer le lien » ne consomme qu'un envoi.
  const recent = await sql`
    SELECT 1
      FROM auth_tokens t
      JOIN users u ON u.id = t.user_id
     WHERE u.email = ${normalized}
       AND t.purpose = 'login'
       AND t.created_at > now() - ${`${EMAIL_WINDOW_SECONDS} seconds`}::interval
     LIMIT 1
  `;

  if (recent.length > 0) {
    return NextResponse.json({ sent: true });
  }

  try {
    const { url, isNew } = await requestMagicLink(normalized, lang, suite);
    const result = await sendMagicLink(normalized, url, { isNew });

    if (!result.success) {
      // Comme pour le formulaire de contact : une erreur d'envoi doit remonter
      // en 500. Afficher « lien envoyé » alors que rien n'est parti laisse la
      // personne attendre devant une boîte vide, sans recours.
      console.error("[auth] Envoi du lien impossible :", result.error);
      return NextResponse.json(
        { error: "L'envoi a échoué. Réessayez dans un instant." },
        { status: 500 },
      );
    }

    return NextResponse.json({ sent: true });
  } catch (err) {
    console.error("[auth] Demande de lien en échec :", err);
    return NextResponse.json(
      { error: "Une erreur est survenue." },
      { status: 500 },
    );
  }
}
