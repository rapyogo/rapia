# RAPIA — Handoff de session

> À lire en premier au début de chaque session (voir CLAUDE.md).
> Dernière mise à jour : 2026-08-05

## État actuel

Site web de **RAPIA** (agence IA en RDC) — MVP fonctionnel, déployé en production, design premium appliqué, une page immersive additionnelle en place.

**Depuis le 2026-08-05, la landing page s'ouvre sur un récit vidéo en 5 actes** piloté au scroll (canvas + GSAP). Voir la section « Séquences vidéo au scroll » plus bas — c'est le morceau le plus structurant du site aujourd'hui.

**Production :** [`https://ia.rapyogo.com`](https://ia.rapyogo.com) (alias Vercel vérifié) · aussi accessible sur `https://rapia.vercel.app`
**Repo GitHub :** [`https://github.com/rapyogo/rapia`](https://github.com/rapyogo/rapia) — branche `master` synchronisée
**Branche de session locale :** `session-2026-08-02` (créée en début de session, contient les mêmes commits que `master`)

## Stack technique

- **Next.js 16** (App Router, Turbopack) + **React 19** + **TypeScript 5**
- **Tailwind CSS v4** (via `@theme inline`, pas de `tailwind.config.js` — tokens dans `app/globals.css`)
- **Framer Motion** — animations scroll-reveal, `MotionConfig reducedMotion="user"` dans `app/layout.tsx`
- **GSAP + @gsap/react** — scroll storytelling sur `/notre-vision` (ScrollTrigger pin/rotate)
- **Lucide React** — icônes
- **Resend** — envoi email formulaire contact (clé API configurée dans Vercel + `.env.local`)
- Hébergement **Vercel** (projet `rapyogos-projects/rapia`)

## Historique des commits (linéaire, tout sur `master`)

1. `7df15fa` — MVP initial : landing page single-page + page contact (12 sections)
2. `d5039e4` — Corrections issues de `/impeccable critique` : placeholders masqués, a11y (skip link, h1, focus trap drawer mobile), contrastes WCAG AA, lien cassé réparé
3. `e83caed` — **Redesign premium** : thème dark (fond Deep Profond `#021E2D`), typographie extra-bold (jusqu'à 72px), alternance sections light/dark, gradient orbs, logo mark SVG custom (`public/rapia-mark.svg`)
4. `0007296` — Page immersive `/notre-vision` : composant `story-scroll.tsx` (GSAP ScrollTrigger, pin + rotation par section), contenu réutilisé depuis `lib/constants.ts` (pas de contenu inventé)
5. `7dad8cf` — Création de ce fichier de handoff
6. `d6aaa4c` — **Hero immersive** : `HeroSequence.tsx` remplace `Hero.tsx` dans `app/page.tsx`. Séquence de 50 frames scrubbée au scroll + 3 chapitres de texte
7. `d29a4f4` — **Récit en 4 actes** : `StoryFlow.tsx` inséré entre la hero et `ProblemLevels`. 4 séquences supplémentaires + chargement différé ajouté à `scroll-sequence.tsx`

## Séquences vidéo au scroll

Le cœur visuel de la landing. Une vidéo est exportée en frames JPEG (via ezgif),
converties en WebP, puis rejouées sur un `<canvas>` piloté par la position de scroll.

### Les 5 actes en place

| Ordre | Slug | Ce que montre la vidéo | Message |
|-------|------|------------------------|---------|
| 1 | `hero-sequence` | Drone sur la tour → l'entrepreneur → la paperasse | Promesse de marque (`HERO.title`) |
| 2 | `acte-2-surcharge` | Tableurs **rouges** → tête dans les mains → épuisement nocturne | « Vous manquez d'heures » |
| 3 | `acte-3-rencontre` | Le robot arrive, main sur l'épaule | « Elle vient prendre votre charge » |
| 4 | `acte-4-delegation` | Il cède le siège, la machine travaille, écrans **verts** | « Le rouge devient vert » |
| 5 | `acte-5-liberte` | Le sourire, le café, la cohabitation | « C'est ça, une IA qui travaille pour vous » + CTA |

**Le fil visuel rouge → vert est délibéré** : le copywriting s'appuie dessus.
Ne pas réordonner les actes sans réécrire les textes.

### Composants

- **`components/ui/scroll-sequence.tsx`** — le moteur, générique et réutilisable.
  Points d'implémentation à connaître avant d'y toucher :
  - Le conteneur est en `position: sticky`, **pas** en `pin` GSAP. Le navigateur
    garde la main sur le layout ; GSAP ne pilote que l'index de frame. C'est ce
    qui évite les conflits avec le ScrollTrigger de `story-scroll.tsx`.
  - **Chargement différé via `IntersectionObserver`** (`rootMargin: 150%`).
    Indispensable : sans lui, les 5 séquences (6,6 Mo) partaient toutes au montage.
    La prop `eager` court-circuite l'observer — seule la hero l'utilise.
  - `devicePixelRatio` plafonné à 2, rendu en mode « cover », respect de
    `prefers-reduced-motion` (frame figée).
- **`components/sections/HeroSequence.tsx`** — l'acte 1, avec les CTA.
- **`components/sections/StoryFlow.tsx`** — les actes 2 à 5 via un composant
  interne `StoryAct` piloté par une liste de `chapters` (`at` / `until` sur la
  progression 0 → 1).

### Ajouter une nouvelle séquence

```bash
node scripts/convert-frames.cjs <dossier-frames> <slug> [pas]
# ex : node scripts/convert-frames.cjs ~/Downloads/ezgif-xyz-jpg acte-6-support
```

Le script échantillonne (1 frame sur 6 par défaut), redimensionne à 1280 px,
convertit en WebP q68, et affiche le `frameCount` à reporter dans le composant.
Puis ajouter un `<StoryAct slug="..." chapters={[...]} />` dans `StoryFlow.tsx`.

**Piège de timeline GSAP** : ne pas utiliser `tl.totalDuration(1)` pour caler la
durée — cela réétale toutes les positions absolues des chapitres. Utiliser
`tl.to({}, { duration: 0.01 }, 0.99)` à la place (déjà en place dans les deux
composants).

### Budget de poids

| Moment | Frames chargées | Poids |
|--------|-----------------|-------|
| Arrivée sur la page | 50 (hero seule) | ~1,5 Mo |
| Scroll jusqu'à l'acte 2 | 150 (acte 2 + acte 3 en avance) | ~3 Mo |
| Total sur disque | 250 frames | 6,6 Mo |

Mesuré au 2026-08-05 en comptant les réponses réseau `.webp`. **Si une séquence
est ajoutée, revérifier que le chargement initial reste autour de 1,5 Mo.**

### Longueur de page

La landing fait désormais **~21 000 px** de haut, dont environ 14 écrans de
narration avant les services. C'est assumé pour le genre, mais si l'utilisateur
trouve ça trop long : baisser `scrollLength` (2.8 → 2) dans `StoryAct`, une seule
valeur à changer pour les 4 actes.

## Design system

- **Nom :** "Kinshasa Modern" — documenté dans [`DESIGN.md`](../DESIGN.md)
- **Police :** Space Grotesk exclusivement (ne jamais la remplacer, même si un composant tiers en suggère une autre)
- **Palette :** Deep Profond `#021E2D` (autorité), Indigo `#5E53A4` (interactions/CTA), Amber `#B87500` (conversion), Emerald `#10B881` (succès)
- **Tokens CSS :** `app/globals.css` (`:root` + `@theme inline`) — source de vérité pour les couleurs, spacing (échelle 8px), radius, ombres
- **Composants UI :** `components/ui/` (Button, Card, Badge, Input, SectionHeading, CTABanner, story-scroll, scroll-sequence)

## Contexte produit

Voir [`PRODUCT.md`](../PRODUCT.md) (créé via `/impeccable init`) pour : personas (4 publics à égalité — entreprises, ONG, institutions, professionnels), positionnement, principes produit, contraintes.

**Règle critique à ne jamais enfreindre :** aucune preuve sociale n'est disponible (témoignages, stats, logos clients). Les sections `SocialProof` et `Content` sont **volontairement masquées** (`return null` conditionné par `placeholder: true` dans `lib/constants.ts`) tant que du vrai contenu n'existe pas. Ne jamais réactiver avec du contenu inventé.

## Pages existantes

| Route | Contenu |
|-------|---------|
| `/` | Landing page (**HeroSequence, StoryFlow** — récit vidéo au scroll —, ProblemLevels, Services, Process, UseCases, Academy, WhyRapia, Technologies, ForWhom, FinalCTA — SocialProof et Content masqués) |
| `/contact` | Formulaire contact → `/api/contact` (Resend + rate limiting in-memory) |
| `/notre-vision` | Page immersive scroll storytelling (GSAP), 5 sections liées au footer |
| `/sitemap.xml`, `/robots.txt` | Générés dynamiquement |

## Historique de critique design

Une revue `/impeccable critique` a été menée sur `app/page.tsx` (score 24/32, dual-agent). Snapshot dans `.impeccable/critique/2026-08-02T16-16-29Z__app-page-tsx.md`. Tous les P0/P1/P2 identifiés ont été corrigés dans le commit `d5039e4`. **Le redesign premium (`e83caed`) qui a suivi n'a pas encore été re-crítiqué** — pourrait valoir un nouveau `/impeccable critique app/page.tsx` pour vérifier que rien n'a régressé (notamment les contrastes sur fond dark).

## Déploiement Vercel

- Projet : `rapyogos-projects/rapia`
- Domaines actifs : `rapia.vercel.app` (défaut), `ia.rapyogo.com` (custom, DNS vérifié via Cloudflare — CNAME `ia` → `aa705d047855070d.vercel-dns-017.com.`)
- Variables d'env production : `RESEND_API_KEY`, `CONTACT_EMAIL=contact@rapyogo.com`
- CLI utilisé directement (`npx vercel --yes --prod`) — pas de CI/CD auto sur push GitHub configuré à ce jour (à vérifier/mettre en place si souhaité)

## Point d'attention technique

- Le repo local a un `pnpm-lock.yaml` à la racine `C:\Users\RAPYOGO\` (en dehors du projet) qui fait que Next.js/Turbopack émet un warning "workspace root inferred" à chaque build. Non bloquant, mais pourrait être silencé avec `turbopack.root` dans `next.config.ts` si ça agace.
- **Toujours vérifier la branche avant de commit/push** : cette session a committé plusieurs fois sur `session-2026-08-02` en pensant être sur `master`, ce qui a désynchronisé GitHub jusqu'à ce qu'un `git merge --ff-only` corrige ça en fin de session. Vérifier `git branch --show-current` avant de pousser.
- **`components/sections/Hero.tsx` existe toujours mais n'est plus importé** depuis `app/page.tsx` (remplacé par `HeroSequence.tsx` le 2026-08-05). Conservé pour retour arrière facile ; à supprimer si `HeroSequence` est validée durablement.
- **Le daemon du skill `/browse` (gstack) reste bloqué sur cette machine** (« Another instance is starting the server, waiting... », ne répond plus même après `stop`). Contournement qui a fonctionné : lancer Playwright avec le Chrome système plutôt que le Chromium headless de Playwright (binaire absent) :
  ```js
  const { chromium } = require("playwright");
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  ```
  Écrire le script `.cjs` sous `~/.claude/skills/gstack/` (pour que `require("playwright")` résolve), le supprimer après usage. Détail dans la mémoire persistante (`qa-visuel-playwright-chrome`).

## Prochaines pistes possibles (non commencées)

- **Vérifier le rendu en production** (ia.rapyogo.com) des deux derniers commits — tout le QA du 2026-08-05 a tourné en local uniquement, jamais confirmé sur le déploiement Vercel réel.
- Statuer sur la longueur de page (~21 000 px) avec l'utilisateur — voir « Longueur de page » ci-dessus.
- Décider du sort de `Hero.tsx` (supprimer ou garder en filet de sécurité).
- D'autres séquences vidéo à venir de l'utilisateur pour d'autres sections — le pipeline (`scripts/convert-frames.cjs` + `StoryAct`) est prêt à les recevoir.
- Re-lancer `/impeccable critique` sur le design premium pour valider les contrastes du thème dark
- Contenu réel pour RAPIA Academy, articles, témoignages (dès qu'ils existent → réactiver `SocialProof`/`Content`)
- CI/CD GitHub → Vercel automatique (actuellement déploiement manuel via CLI)
- Domaine `rapia.cd` mentionné dans `SITE.url` (constants.ts) mais le site tourne sur `ia.rapyogo.com` — clarifier avec l'utilisateur si `rapia.cd` doit être acheté/pointé
