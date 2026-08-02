import { CONTENT_SECTION } from "@/lib/constants";

/**
 * Section masquée tant qu'aucun article réel n'est publié.
 * La constante CONTENT_SECTION.placeholder contrôle l'affichage.
 * Ne jamais afficher d'articles fantômes en production.
 */
export function Content() {
  if (CONTENT_SECTION.placeholder) return null;

  return null;
}
