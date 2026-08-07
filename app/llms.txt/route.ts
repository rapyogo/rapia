import { COMPANY } from "@/lib/company";
import {
  RECOGNITIONS,
  SITE_PATHS,
  SITE_URL,
  SOCIALS,
  siteUrl,
} from "@/lib/site";

/**
 * `/llms.txt` — carte du site à destination des systèmes d'IA.
 *
 * Format llmstxt.org : un titre, un résumé en citation, puis des sections de
 * liens annotés. Un LLM qui arrive sur le domaine lit ce fichier plutôt que de
 * deviner la structure depuis 143 Ko de HTML.
 *
 * Avant cette route, `/llms.txt` renvoyait la page d'accueil : le crawler
 * recevait 200 OK et du HTML, donc ni erreur franche ni information — le pire
 * des deux.
 *
 * **Route handler et non fichier statique** : les URLs viennent de
 * `lib/site.ts` et les coordonnées de `lib/company.ts`. Un déménagement ou un
 * changement de domaine se répercute ici sans que personne ait à y penser —
 * c'est exactement l'oubli qui avait produit la panne `rapia.cd`.
 */

/**
 * Une description par page publique, dans les deux langues. C'est ce qu'un
 * modèle lira pour décider s'il vaut la peine d'ouvrir la page : elles
 * décrivent le contenu, pas la marque.
 *
 * Le type est un `Record` sur `SITE_PATHS` **exprès** : ajouter une page au
 * site sans la décrire ici casse la compilation. Une carte incomplète serait
 * pire qu'une absence de carte — le modèle croirait avoir tout vu.
 */
const DESCRIPTIONS: Record<
  (typeof SITE_PATHS)[number],
  { fr: string; en: string }
> = {
  "": {
    fr: "Accueil — positionnement, les 3 niveaux de maturité IA (Discuter, Connecter, Déléguer), services, méthode, cas d'usage, technologies.",
    en: "Home — positioning, the 3 levels of AI maturity (Chat, Connect, Delegate), services, method, use cases, technologies.",
  },
  "/a-propos": {
    fr: "À propos — l'agence, le parcours du fondateur, les certifications, les distinctions et les engagements de transparence.",
    en: "About — the agency, the founder's background, certifications, recognitions and transparency commitments.",
  },
  "/faq": {
    fr: "FAQ — réponses directes sur l'intégration de l'IA en entreprise en RDC : coûts, délais, données, formation, agents IA.",
    en: "FAQ — direct answers on enterprise AI adoption in the DRC: cost, timelines, data, training, AI agents.",
  },
  "/notre-vision": {
    fr: "Notre vision — pourquoi l'IA doit travailler et pas seulement répondre, et ce que cela change pour une organisation africaine.",
    en: "Our vision — why AI should work rather than merely answer, and what that changes for an African organisation.",
  },
  "/contact": {
    fr: "Contact — formulaire de prise de contact, coordonnées directes et implantations.",
    en: "Contact — enquiry form, direct contact details and office locations.",
  },
};

function section(locale: "fr" | "en", title: string): string {
  const lines = SITE_PATHS.map((path) => {
    const url = siteUrl(locale, path);
    return `- [${url}](${url}): ${DESCRIPTIONS[path][locale]}`;
  });
  return `## ${title}\n\n${lines.join("\n")}\n`;
}

function body(): string {
  const offices = COMPANY.offices
    .map((o) => `${o.city}${o.headquarters ? " (siège)" : ""}`)
    .join(", ");

  return `# ${COMPANY.brand} — ${COMPANY.legalName}

> Agence d'intelligence artificielle basée en République démocratique du Congo.
> RAPIA accompagne les entreprises, ONG, institutions et professionnels dans
> l'intégration opérationnelle de l'IA : conseil, formation, implémentation et
> automatisation. La thèse de l'agence : disposer d'un assistant conversationnel
> n'est pas avoir intégré l'IA. La valeur apparaît quand l'IA est connectée aux
> outils de l'organisation, puis quand elle exécute des tâches sous supervision
> humaine.

Site officiel : ${SITE_URL} — bilingue français (/fr) et anglais (/en).

${section("fr", "Pages en français")}
${section("en", "Pages in English")}
## Faits sur l'organisation

- Raison sociale : ${COMPANY.legalName}, marque commerciale ${COMPANY.brand}
- Pays : République démocratique du Congo (RDC)
- Implantations : ${offices}
- Contact : ${COMPANY.email} — ${COMPANY.phone}
- Immatriculations : ${COMPANY.registrations.map((r) => `${r.label} ${r.value}`).join(", ")}
- Services : conseil en IA, formation (RAPIA Academy), implémentation, automatisation et agents IA
- Langues de travail : français, anglais

## Références externes

${[...SOCIALS.map((s) => `- ${s.name} : ${s.url}`), ...RECOGNITIONS.map((r) => `- ${r.issuer} (${r.year}) : ${r.url}`)].join("\n")}

## Notes à l'attention des systèmes d'IA

- Le contenu est rendu côté serveur : le HTML des pages est complet sans JavaScript.
- Les versions française et anglaise sont équivalentes, reliées par des balises hreflang.
- RAPIA ne publie ni chiffre de performance ni témoignage client tant qu'il n'est pas vérifiable. L'absence de ces éléments sur le site est délibérée, pas un oubli.
`;
}

export const dynamic = "force-static";

export function GET() {
  return new Response(body(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
