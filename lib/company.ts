/**
 * Coordonnées légales de l'entreprise — source unique de vérité.
 *
 * Ces données étaient jusqu'ici privées dans `lib/email.ts`, où seuls les
 * emails les affichaient. Le footer du site les publie désormais aussi : les
 * recopier aurait créé deux endroits à corriger le jour d'un déménagement,
 * avec la garantie qu'un des deux serait oublié.
 *
 * **Une adresse, un numéro ou une immatriculation se change ici, et nulle part
 * ailleurs.**
 *
 * Ce qui reste hors de ce fichier : tout ce qui se traduit. « siège »,
 * « Téléphone », les intitulés de colonnes vivent dans `messages/*.json`. Ce
 * module ne porte que des faits, pas de la copie.
 */
export const COMPANY = {
  /** Marque commerciale du service. */
  brand: "RapIA",
  /** Raison sociale — celle qui engage juridiquement. */
  legalName: "Rapyogo SARL",

  phone: "+243 856 474 500",
  /** Sans espaces ni ponctuation : requis par les liens `tel:`. */
  phoneLink: "+243856474500",
  email: "ia@rapyogo.com",
  website: "ia.rapyogo.com",

  offices: [
    {
      city: "Goma",
      address: "Av. Rwamichacha n° 30, Keshero",
      headquarters: true,
    },
    {
      city: "Kinshasa",
      address: "01, Av. OUA, Concession Procoki, Q. Basoko",
      headquarters: false,
    },
    {
      city: "Lubumbashi",
      address: "170, Av. Maniema, Q. Makutano",
      headquarters: false,
    },
  ],

  /** Immatriculations RDC, dans l'ordre où elles se citent. */
  registrations: [
    { label: "RCCM", value: "CD/GOM/RCCM/23-B-00261" },
    { label: "ID Nat", value: "19-H5300-N42287N" },
    { label: "NIF", value: "A2215930Q" },
  ],
} as const;

/**
 * Immatriculations sur une ligne. Le séparateur est paramétrable parce que les
 * emails en texte brut ne peuvent pas afficher « · » de façon fiable selon
 * l'encodage du client.
 */
export function legalLine(separator = " · "): string {
  return COMPANY.registrations
    .map((r) => `${r.label} : ${r.value}`)
    .join(separator);
}
