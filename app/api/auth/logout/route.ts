// app/api/auth/logout/route.ts
// Ferme la session — en base et dans le navigateur.

import { NextResponse } from "next/server";
import { destroySession } from "@/lib/auth";

/**
 * POST uniquement.
 *
 * Une déconnexion en `GET` se déclenche toute seule : il suffit qu'une image
 * de la page, un préchargeur de lien ou un scanner d'e-mail visite l'URL pour
 * éjecter la personne de son espace. Le POST exige une soumission.
 */
export async function POST(request: Request) {
  const form = await request.formData().catch(() => null);
  const locale = form?.get("locale") === "en" ? "en" : "fr";

  await destroySession();

  return NextResponse.redirect(
    new URL(`/${locale}`, new URL(request.url).origin),
    { status: 303 },
  );
}
