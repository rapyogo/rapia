// app/api/auth/verify/route.ts
// Consomme un lien magique et ouvre la session.

import { NextResponse } from "next/server";
import { consumeMagicLink, setSessionCookie, safeRedirect } from "@/lib/auth";

/**
 * ## Pourquoi un POST, et pas le clic sur le lien lui-même
 *
 * Le jeton pourrait être consommé directement par le `GET` de la page de
 * vérification — c'est plus court d'un écran. Ce serait une erreur pour le
 * public visé.
 *
 * Les ONG et institutions travaillent sous Microsoft 365, dont **Safe Links
 * visite chaque URL entrante** pour l'analyser, avant que le destinataire ne
 * clique. Un jeton à usage unique consommé par cette visite laisse la personne
 * devant « lien déjà utilisé » sur un lien qu'elle n'a jamais ouvert — panne
 * inexplicable de son point de vue, et impossible à reproduire du nôtre.
 * Gmail et les antivirus de messagerie font la même chose.
 *
 * Un scanner automatique suit les liens ; il ne soumet pas de formulaire. La
 * page de vérification affiche donc un bouton, et c'est **ce POST** qui
 * consomme le jeton.
 *
 * ## Réponse en redirection, pas en JSON
 *
 * Le formulaire est un `<form method="post">` natif : il fonctionne sans
 * JavaScript. C'est voulu — la connexion est le seul chemin d'entrée, elle ne
 * doit dépendre de rien.
 */
export async function POST(request: Request) {
  const form = await request.formData();
  const token = form.get("token");
  const locale = form.get("locale") === "en" ? "en" : "fr";
  const suite = form.get("suite");

  const origin = new URL(request.url).origin;

  if (typeof token !== "string" || token.length === 0) {
    return NextResponse.redirect(
      new URL(`/${locale}/connexion?erreur=jeton`, origin),
      { status: 303 },
    );
  }

  const session = await consumeMagicLink(
    token,
    request.headers.get("user-agent") ?? undefined,
  );

  if (!session) {
    // Jeton inconnu, expiré ou déjà utilisé : un seul message pour les trois.
    // Les distinguer apprendrait à un attaquant lequel des trois il a trouvé.
    return NextResponse.redirect(
      new URL(`/${locale}/connexion?erreur=expire`, origin),
      { status: 303 },
    );
  }

  await setSessionCookie(session.sessionToken);

  const destination = safeRedirect(
    typeof suite === "string" ? suite : null,
    session.user.locale === "en" ? "en" : "fr",
  );

  // 303 et non 302 : la réponse à un POST doit être suivie en GET, sinon
  // certains navigateurs rejouent le POST sur la destination.
  return NextResponse.redirect(new URL(destination, origin), { status: 303 });
}
