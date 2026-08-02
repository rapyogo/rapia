import { SOCIAL_PROOF } from "@/lib/constants";

/**
 * Section masquée tant qu'aucun témoignage ou statistique réel n'est disponible.
 * La constante SOCIAL_PROOF.placeholder contrôle l'affichage.
 * Ne jamais afficher de faux témoignages en production.
 */
export function SocialProof() {
  if (SOCIAL_PROOF.placeholder) return null;

  return null;
}
