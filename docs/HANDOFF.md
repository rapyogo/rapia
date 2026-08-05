# RAPIA — Handoff de session

> À lire en premier au début de chaque session (voir CLAUDE.md).
> Dernière mise à jour : 2026-08-05 (soir)

## État actuel

Site web de **RAPIA** (agence IA en RDC) — MVP fonctionnel, déployé en production, design premium appliqué, **bilingue FR/EN**, parallaxe multi-couches sur les 5 actes du récit.

**Depuis le 2026-08-05 (soir) :** parallaxe CSS multi-couches sur les 5 actes (section « Parallaxe ») **et bilinguisme FR/EN complet** (section « Bilinguisme »).

**La landing page s'ouvre sur un récit vidéo en 5 actes** piloté au scroll (canvas + GSAP) avec 4 couches de profondeur par acte (fond → canvas → formes → texte).

**Production :** [`https://ia.rapyogo.com`](https://ia.rapyogo.com) (alias Vercel vérifié) · aussi accessible sur `https://rapia.vercel.app`
**Repo GitHub :** [`https://github.com/rapyogo/rapia`](https://github.com/rapyogo/rapia) — branche `master` synchronisée
**Branche de session locale :** `feat/i18n-bilingue`

## Migration en cours vers le cahier des charges

Un cahier des charges détaillé a été fourni le 2026-08-05. L'audit d'écart a
mesuré **~15-20 % d'alignement** avec le site d'alors. Migration progressive en
5 phases, plan complet dans `~/.claude/plans/veuillez-fait-un-site-clever-lollipop.md`.

| Phase | Contenu | État |
|-------|---------|------|
| 1 | i18n FR/EN | ✅ Fait |
| 2 | Design System « Corporate Clair » (Inter, thème clair, zéro gradient/glow) | ✅ Fait |
| 3 | Photographie Higgsfield (30+ assets) en remplacement des séquences canvas | ⬜ Bloqué sur génération des assets |
| 4 | « La Transformation » — vidéo showpiece pinned, cartes pilotées par `timeupdate` | ⬜ Bloqué sur génération vidéo |
| 5 | Lenis, ordre des sections, SEO, déploiement | 🟡 Lenis et ordre faits ; déploiement à décider |

**Écarts restants avec le cahier des charges :** aucune photographie (les 5
séquences canvas tiennent la place), pas encore de vidéo showpiece unique, et
les sections Preuves / Contenu restent masquées faute de contenu réel.

**Le MCP Higgsfield est connecté mais demande une autorisation** que seul
l'utilisateur peut accorder via ses réglages de connecteurs claude.ai. Tant
qu'elle n'est pas donnée, les phases 3 et 4 ne peuvent pas démarrer.

## Stack technique

- **Next.js 16** (App Router, Turbopack) + **React 19** + **TypeScript 5**
- **next-intl v4** — bilinguisme FR/EN, routes `/fr` et `/en` (voir « Bilinguisme »)
- **Lenis** — scroll fluide global, synchronisé avec ScrollTrigger (voir « Scroll fluide »)
- **Tailwind CSS v4** (via `@theme inline`, pas de `tailwind.config.js` — tokens dans `app/globals.css`)
- **Framer Motion** — animations scroll-reveal, `MotionConfig reducedMotion="user"` dans `app/[locale]/layout.tsx`
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

## Parallaxe multi-couches

Ajouté le 2026-08-05 (soir). Chaque acte a 4 couches qui défilent à des vitesses
différentes, pilotées par **un seul ScrollTrigger** (celui de `ScrollSequence`).

### Emplilement (z-index)

| Couche | Composant | z-index | Vitesse | Rôle |
|--------|-----------|---------|---------|------|
| Fond | `ParallaxFond` | z-0 | 0.15 | Orbes CSS radial-gradient (3 variantes : indigo/emerald/amber) |
| Canvas | `ScrollSequence` | z-10 | 0.30 | Vidéo existante, inchangée |
| Formes | `ParallaxFormes` | z-20 | 0.60 | Grille tech + cercles CSS |
| Voiles | Inline dans chaque acte | z-30 | — | Gradients de lisibilité |
| Texte | Chapters | z-40 | ancré | Titres, sous-titres, CTA |

### Mobile

- Canvas réduit à 0.20 (media query CSS)
- Fond et formes atténués (opacité réduite)
- Cercles géométriques masqués (trop chargés)

### Fichiers du système

| Fichier | Rôle |
|---------|------|
| `components/ui/parallax-layer.tsx` | Moteur générique : lit `--parallax-progress`, applique `translate3d` |
| `components/ui/parallax-fond.tsx` | Fond cosmique avec orbes (prop `variant`) |
| `components/ui/parallax-formes.tsx` | Grille + cercles (prop `side` pour alterner) |
| `components/ui/scroll-sequence.tsx` | Injecte `--parallax-progress` dans `onUpdate` + canvas élargi (+60px) |
| `app/globals.css` | Styles `.parallax-canvas`, mobile, reduced-motion |

### Précautions

- **Ne pas changer l'ordre z-index sans vérifier visuellement les 5 actes.**
  L'échelle z-0→z-40 est délibérée : fond derrière canvas, formes devant canvas
  mais sous les voiles, texte au-dessus de tout.
- `prefers-reduced-motion` désactive tous les transforms (JS + CSS `!important`).
- Le canvas est élargi de 60px (`height: calc(100% + 60px); top: -30px`) pour
  absorber le décalage du translateY — ne pas réduire sans ajuster la vitesse.

## Logos

Les logos ont été mis à jour le 2026-08-05. Fichiers dans `public/` :

| Fichier | Usage |
|---------|-------|
| `icone-rapia_dark-mode.webp` | Header, Footer, favicon, Apple touch icon |
| `icone-rapia_ligth-mode.webp` | Sections claires (si besoin) |
| `logo-horisontale-rapia-dark_mode.webp` | OG image, partage réseaux sociaux |
| `logo-horisontale-rapia-ligth_mode.webp` | Usage futur sections claires |

L'ancien `rapia-mark.svg` est conservé dans `public/` mais plus utilisé. Les PNG
originaux sont aussi conservés dans `public/` (fallback).

## Design system

- **Nom :** "Kinshasa Modern" — documenté dans [`DESIGN.md`](../DESIGN.md)
- **Police :** Space Grotesk exclusivement (ne jamais la remplacer, même si un composant tiers en suggère une autre)
- **Palette :** Deep Profond `#021E2D` (autorité), Indigo `#5E53A4` (interactions/CTA), Amber `#B87500` (conversion), Emerald `#10B881` (succès)
- **Tokens CSS :** `app/globals.css` (`:root` + `@theme inline`) — source de vérité pour les couleurs, spacing (échelle 8px), radius, ombres
- **Composants UI :** `components/ui/` (Button, Card, Badge, Input, SectionHeading, CTABanner, story-scroll, scroll-sequence)

## Contexte produit

Voir [`PRODUCT.md`](../PRODUCT.md) (créé via `/impeccable init`) pour : personas (4 publics à égalité — entreprises, ONG, institutions, professionnels), positionnement, principes produit, contraintes.

**Règle critique à ne jamais enfreindre :** aucune preuve sociale n'est disponible (témoignages, stats, logos clients). Les sections `SocialProof` et `Content` **retournent `null`** tant que du vrai contenu n'existe pas (leur copy attend dans `messages/*.json` sous la clé `placeholder: true`). Ne jamais réactiver avec du contenu inventé.

## Photographie (assets Higgsfield)

28 visuels générés le 2026-08-05, dans `public/images/photos/`. **1,52 Mo au
total** — les 28 photos pèsent moins que les 250 frames des séquences canvas.

### La règle qui tient tout

**Un seul master, tout le reste en image-to-image depuis lui.** C'est ce qui
donne au site une lumière, un grain et une palette identiques d'une section à
l'autre — et le même consultant d'une photo à l'autre.

| Fichier | Rôle |
|---------|------|
| `master.webp` | **L'image maîtresse.** Consultant devant un whiteboard, bureau de Kinshasa. Toute nouvelle photo doit en dériver. |
| `service-*.webp` (4) | Cartes services (3:2) |
| `cas-*.webp` (6) | Cas d'usage, carré |
| `methode-{1..4}-*.webp` | Les 4 moments de la méthode, en fondu enchaîné |
| `academy.webp`, `contexte-africain.webp`, `banniere-ressources.webp` | Supports |
| `equipe.webp` | **Provisoire** — voir l'avertissement ci-dessous |
| `public-*.webp` (4) | Les 4 publics (4:5) |
| `detail-*.webp` (3) | Respirations visuelles |
| `graphique-systemes.webp` | Nœuds et courbes — le vocabulaire visuel de l'IA sur ce site |
| `dashboard-mockup.webp` | Interface générique |

### Contraintes à ne pas relâcher

- **Aucun robot, cerveau numérique, circuit imprimé ni interface holographique.**
  L'IA se représente par des systèmes et des connexions — `graphique-systemes.webp`
  est le gabarit à suivre. Cet interdit couvre aussi les icônes.
- **Aucun texte lisible ni logo** dans les visuels : les écrans et whiteboards
  ne portent que des formes abstraites. Les prompts l'exigent explicitement ;
  le vérifier sur toute nouvelle génération.
- **`equipe.webp` est un placeholder** : les visages n'y sont pas
  individuellement identifiables. À remplacer par une vraie photo d'équipe dès
  qu'elle existe, et **à ne jamais présenter comme des personnes nommées**.

### Régénérer ou compléter

```bash
node scripts/optimize-photos.cjs   # PNG bruts -> WebP dimensionnés par usage
```

Le script porte la largeur cible de chaque image ; ajouter une entrée pour tout
nouveau visuel. Les PNG sources ne sont pas versionnés (172 Mo).

**Budget crédits Higgsfield :** 2 crédits par image. La vidéo showpiece de la
phase 4 demande Seedance 2.0 à **22,5 crédits les 5 secondes**, soit 112,5
crédits pour les 5 actes — c'est ce qui bloque la phase 4, pas la technique.

## Scroll fluide (Lenis)

`components/ui/smooth-scroll.tsx`, monté une fois dans le layout de locale.

**Trois pièges à connaître avant d'y toucher :**

- **Lenis est avancé depuis le ticker GSAP**, pas depuis son propre `requestAnimationFrame`.
  Deux boucles concurrentes décalent la position de scroll d'une frame par rapport
  aux séquences canvas — visible comme un tremblement pendant le scrub.
- **`gsap.ticker.lagSmoothing(0)`** est obligatoire : sans lui, GSAP rattrape les
  frames perdues et fait sauter les séquences après un freeze.
- **`scroll-behavior: smooth` a été retiré de `globals.css`** et ne doit pas
  revenir : il se dispute les ancres avec Lenis. La navigation par ancre est gérée
  dans le composant, avec un décalage de 80px pour le header sticky.

`prefers-reduced-motion` : Lenis n'est pas monté du tout, le scroll natif reprend.

## Ordre des sections

Fixé par le cahier des charges, à ne pas réarranger sans raison :

```
Hero → Le Problème → La Transformation → Services → Méthode → Cas d'usage →
Academy → Pourquoi RAPIA → Technologies → Pour qui → Preuves → Contenu → CTA final
```

`StoryFlow` (les 4 actes vidéo) tient la place de « La Transformation » jusqu'à
la phase 4. **Le constat vient donc avant le récit** — l'inverse de ce qui était
en place avant le 2026-08-05 : on nomme le problème, puis on montre la sortie.

## Bilinguisme FR/EN

Ajouté le 2026-08-05 (soir). Le site est entièrement bilingue via **`next-intl` v4**.

### Architecture

| Fichier | Rôle |
|---------|------|
| `i18n/routing.ts` | Locales (`fr`, `en`), défaut `fr`, `localePrefix: "always"` |
| `i18n/request.ts` | Charge `messages/{locale}.json` par requête |
| `i18n/navigation.ts` | `Link`, `useRouter`, `usePathname` conscients de la locale |
| `proxy.ts` | Détection de locale + redirection (ex-`middleware.ts`, renommé pour Next.js 16) |
| `messages/fr.json`, `messages/en.json` | **Toute la copy du site** — 164 clés, parité stricte |
| `components/layout/LanguageSwitcher.tsx` | Bascule FR ⇄ EN en préservant la route |

### Règles à respecter

- **`messages/*.json` est l'unique source de vérité de la copy.** L'ancien
  `lib/constants.ts` a été supprimé — ne pas le recréer, ce serait une seconde
  source de vérité qui divergerait.
- **Toute clé ajoutée en FR doit l'être en EN** (et inversement). Vérification :
  ```bash
  node -e "const f=require('./messages/fr.json'),e=require('./messages/en.json');const k=(o,p='')=>Object.entries(o).flatMap(([x,v])=>v&&typeof v==='object'&&!Array.isArray(v)?k(v,p+x+'.'):[p+x]);const a=k(f),b=k(e);console.log(a.length===b.length&&a.every(x=>b.includes(x))?'OK':'DESYNC')"
  ```
- **Les liens internes doivent porter la locale** : `` href={`/${locale}/contact`} ``
  et non `href="/contact"`. Sinon le visiteur anglophone est renvoyé en français.
- Les tableaux (`services.items`, `useCases.cases`…) se lisent avec `t.raw(...)`
  et un type explicite. Les icônes sont mappées **par index**, jamais par libellé
  traduit — un mapping par titre casserait en anglais.
- `localePrefix: "always"` : `/fr` et `/en` ont tous deux un préfixe. Les
  canonicals doivent donc toujours le porter (`https://rapia.cd/fr`).

## Pages existantes

Toutes les routes sont préfixées par la locale (`/fr/…`, `/en/…`). `/` redirige (307).

| Route | Contenu |
|-------|---------|
| `/[locale]` | Landing page (**HeroSequence, StoryFlow** — récit vidéo au scroll —, ProblemLevels, Services, Process, UseCases, Academy, WhyRapia, Technologies, ForWhom, FinalCTA — SocialProof et Content masqués) |
| `/[locale]/contact` | Formulaire contact → `/api/contact` (Resend + rate limiting in-memory) |
| `/[locale]/notre-vision` | Page immersive scroll storytelling (GSAP), 5 sections liées au footer |
| `/sitemap.xml`, `/robots.txt` | Générés dynamiquement — sitemap bilingue avec alternates réciproques |

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
- Domaine `rapia.cd` utilisé comme `metadataBase` (canonicals, sitemap, hreflang) mais le site tourne sur `ia.rapyogo.com` — clarifier si `rapia.cd` doit être acheté/pointé, sinon corriger `baseUrl` dans `app/[locale]/layout.tsx` et `app/sitemap.ts`
