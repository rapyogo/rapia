# RAPIA — Handoff de session

> À lire en premier au début de chaque session (voir CLAUDE.md).
> Dernière mise à jour : 2026-08-05 (fin de session)

## État actuel

Site web de **RAPIA** (agence IA en RDC) — bilingue FR/EN, design Corporate Clair,
déployé en production sur [`https://ia.rapyogo.com`](https://ia.rapyogo.com).

**Ce qui tourne en production** (commit `9eaeb8c`) :
- **Bilinguisme complet** FR/EN via `next-intl` v4, 171 clés, parité stricte
- **Design Corporate Clair** : Inter, fond clair `#F8F9FB`, zéro gradient/glow/blur,
  profondeur par bordures 1px et aplats
- **Récit vidéo en 5 actes** au scroll (canvas + GSAP) avec 4 couches de parallaxe
- **ProblemLevels** avec pin ScrollTrigger + rail de progression ambre
- **SocialProof** avec compteurs CountUp et placeholders [À CONFIRMER]
- **28 photos corporate** (1,52 Mo) dérivées d'un master unique
- **Lenis** smooth scroll synchronisé avec le ticker GSAP
- **Page Notre Vision** immersive (GSAP ScrollTrigger pin/rotate)

**Production :** [`https://ia.rapyogo.com`](https://ia.rapyogo.com) (alias Vercel)
**Repo GitHub :** [`https://github.com/rapyogo/rapia`](https://github.com/rapyogo/rapia)
**Branche principale :** `master` — synchronisée avec GitHub

## Commits récents (tout sur `master`, ordre chronologique)

```
9eaeb8c chore: ajout .vercelignore pour eviter le scan de .gstack au deploy
1ce4583 docs: spec design du module email Brevo + formulaire de contact
5affd29 feat: ProblemLevels avec pin ScrollTrigger + SocialProof avec CountUp
5f50ca1 feat: photographie corporate — 28 visuels derives d'un master unique
c68731e feat: scroll fluide Lenis et ordre des sections du cahier des charges
d00e296 feat: design system Corporate Clair — Inter, theme clair, zero effet decoratif
a126808 feat: site bilingue FR/EN, parallaxe multi-couches et nouveaux logos
813ccf3 docs: handoff mis a jour — sequences video, conversion, QA
d29a4f4 feat: recit en 4 actes au scroll — surcharge, rencontre, delegation, liberte
d6aaa4c feat: hero immersive — sequence video au scroll (canvas + GSAP)
7dad8cf docs: handoff de session pour continuite
0007296 feat: page immersive Notre Vision — scroll storytelling GSAP
e83caed feat: redesign premium — dark theme, bold typography, visual rhythm
d5039e4 fix: critique P0-P3 — placeholders, a11y, contrastes, visuels
7df15fa feat: site web RAPIA — MVP single page
```

## Migration vers le cahier des charges

Plan complet dans `~/.claude/plans/veuillez-fait-un-site-clever-lollipop.md`.

| Phase | Contenu | État |
|-------|---------|------|
| 1 | i18n FR/EN | ✅ Fait |
| 2 | Design System « Corporate Clair » | ✅ Fait |
| 3 | Photographie Higgsfield (28 images) | ✅ Fait |
| 4 | « La Transformation » — vidéo showpiece pinned | ⛔ Bloqué crédits (112,5 → 6,5 dispo) |
| 5 | Lenis, ordre sections, SEO, déploiement | ✅ Fait |

**Écarts restants :** pas de vidéo showpiece unique (les 5 séquences canvas tiennent
la place), pas de CI/CD automatique, et les sections Preuves / Contenu affichent des
placeholders en attendant du contenu réel vérifié.

## Stack technique

- **Next.js 16** (App Router, Turbopack) + **React 19** + **TypeScript 5**
- **next-intl v4** — bilinguisme FR/EN, routes `/fr` et `/en`, `localePrefix: "always"`
- **Lenis** — scroll fluide global, synchronisé avec le ticker GSAP
- **Tailwind CSS v4** (via `@theme inline`, pas de `tailwind.config.js` — tokens dans `app/globals.css`)
- **Framer Motion** — animations scroll-reveal, `MotionConfig reducedMotion="user"`
- **GSAP + @gsap/react** — ScrollTrigger pin/scrub sur ProblemLevels, StoryFlow, Notre Vision
- **Lucide React** — icônes
- **Resend** — envoi email formulaire contact (clé API dans Vercel + `.env.local`)
- Hébergement **Vercel** (projet `rapia`, lié à GitHub `rapyogo/rapia`)

## Design system

- **Nom :** "Corporate Clair" — documenté dans [`DESIGN.md`](../DESIGN.md)
- **Police :** Inter exclusivement (ne jamais la remplacer)
- **Palette :**
  - Deep `#001B2A` — callouts de conversion uniquement, jamais en fond de page
  - Indigo `#3A2E7E` — interactions, CTA, liens
  - Amber `#F59E0B` — conversion, sparingly
  - Emerald `#10B881` — succès, croissance
  - Fond `#F8F9FB`, Surfaces `#FFFFFF`, Bordures `#E2E8F0`
- **Tokens CSS :** `app/globals.css` (`:root` + `@theme inline`) — source unique de vérité
- **Interdits** (cahier des charges, non négociables) :
  - Aucun gradient décoratif, aucun glow, aucun `backdrop-blur`
  - Aucun robot/cerveau/circuit imprimé/hologramme dans les visuels (sauf vidéo showpiece)
  - Aucun gradient bleu-violet SaaS
- **Profondeur :** aplats tonals + bordures 1px, pas d'ombres lourdes

## Ordre des sections (landing page)

```
HeroSequence → ProblemLevels → StoryFlow (4 actes) → Services → Process →
UseCases → Academy → WhyRapia → Technologies → ForWhom → SocialProof →
Content → FinalCTA
```

`StoryFlow` tient la place de « La Transformation » tant que la vidéo showpiece
n'est pas produite.

## Séquences vidéo au scroll (5 actes)

Le cœur narratif de la landing. Une vidéo exportée en frames JPEG, converties en
WebP, rejouées sur `<canvas>` piloté par la position de scroll.

### Les 5 actes

| Ordre | Slug | Message |
|-------|------|---------|
| 1 | `hero-sequence` | Promesse de marque |
| 2 | `acte-2-surcharge` | « Vous manquez d'heures » (rouge) |
| 3 | `acte-3-rencontre` | « Elle vient prendre votre charge » |
| 4 | `acte-4-delegation` | « Le rouge devient vert » |
| 5 | `acte-5-liberte` | « C'est ça, une IA qui travaille pour vous » + CTA |

**Le fil rouge → vert est délibéré** : le copywriting s'appuie dessus.
Ne pas réordonner les actes sans réécrire les textes.

### Composants

- **`components/ui/scroll-sequence.tsx`** — moteur générique.
  - Conteneur en `position: sticky`, **pas** en `pin` GSAP. Le navigateur garde la
    main sur le layout ; GSAP ne pilote que l'index de frame.
  - **Chargement différé via `IntersectionObserver`** (`rootMargin: 150%`). La prop
    `eager` court-circuite l'observer — seule la hero l'utilise.
  - `devicePixelRatio` plafonné à 2, rendu « cover », respect `prefers-reduced-motion`.
- **`components/sections/HeroSequence.tsx`** — acte 1, avec les CTA.
- **`components/sections/StoryFlow.tsx`** — actes 2 à 5 via `StoryAct`.

### Piège de timeline GSAP

Ne pas utiliser `tl.totalDuration(1)` pour caler la durée — cela réétale toutes les
positions absolues. Utiliser `tl.to({}, { duration: 0.01 }, 0.99)` à la place.

### Budget de poids

| Moment | Frames | Poids |
|--------|--------|-------|
| Arrivée sur la page | 50 (hero) | ~1,5 Mo |
| Scroll acte 2 | 150 | ~3 Mo |
| Total disque | 250 | 6,6 Mo |

### Longueur de page

~21 000 px (~14 écrans de narration avant les services). Pour réduire : baisser
`scrollLength` (2.8 → 2) dans `StoryAct`, une seule valeur pour les 4 actes.

## Parallaxe multi-couches

Chaque acte a 4 couches pilotées par **un seul ScrollTrigger** (celui de `ScrollSequence`).

### Empilement z-index

| Couche | Composant | z-index | Vitesse |
|--------|-----------|---------|---------|
| Fond | `ParallaxFond` | z-0 | 0.15 |
| Canvas | `ScrollSequence` | z-10 | 0.30 (mobile 0.20) |
| Formes | `ParallaxFormes` | z-20 | 0.60 |
| Voiles | Inline | z-30 | — |
| Texte | Chapters | z-40 | ancré |

**Ne pas changer l'ordre z-index sans vérifier visuellement les 5 actes.**

### Fichiers

| Fichier | Rôle |
|---------|------|
| `components/ui/parallax-layer.tsx` | Moteur : lit `--parallax-progress`, applique `translate3d` |
| `components/ui/parallax-fond.tsx` | Aplats tonals (prop `variant`) |
| `components/ui/parallax-formes.tsx` | Grille SVG + cercles (prop `side`) |
| `components/ui/scroll-sequence.tsx` | Injecte `--parallax-progress` dans `onUpdate` |
| `app/globals.css` | Styles `.parallax-canvas`, mobile, reduced-motion |

Canvas élargi de 60px (`height: calc(100% + 60px); top: -30px`) pour absorber le
translateY sans gap visuel.

## ProblemLevels — Pin + Rail

Section entre HeroSequence et StoryFlow. GSAP ScrollTrigger pin avec rail de
progression ambre.

- Le rail (barre verticale ambre) se remplit via `scaleY(progress)` pendant le scroll
- Les 3 niveaux (Discuter → Connecter → Déléguer) s'illuminent en séquence
- `invalidateOnRefresh: true` pour gérer les resize
- Durée du pin : `window.innerHeight * 2.2`
- **Ne pas remplacer par du CSS sticky** — le rail a besoin du `onUpdate` GSAP

## SocialProof — Compteurs & Placeholders

Section Preuves & Crédibilité, entre ForWhom et Content.

- **CountUp** : composant avec `IntersectionObserver` (se déclenche une fois, 1200ms)
- **Stats nulles** : les valeurs dans `VALUES` (en haut du fichier) sont à `null` par
  défaut → affichent un tiret `—` et le marqueur `[À CONFIRMER]` en ambre
- **Cadres vides** : témoignages, clients, partenaires, certifications en dashed border
- `emptyState` : message « Les chiffres seront publiés dès qu'ils seront vérifiés »
- Pour publier un chiffre : remplacer `null` par la valeur réelle dans l'objet `VALUES`

## Scroll fluide (Lenis)

`components/ui/smooth-scroll.tsx`, monté une fois dans le layout de locale.

**Trois pièges :**
- **Lenis avancé depuis le ticker GSAP**, pas depuis son propre rAF. Deux boucles
  concurrentes = tremblement pendant le scrub.
- **`gsap.ticker.lagSmoothing(0)`** obligatoire : sans lui, GSAP rattrape les frames
  perdues et fait sauter les séquences après un freeze.
- **`scroll-behavior: smooth` retiré de `globals.css`** — il se dispute les ancres
  avec Lenis. Navigation par ancre gérée dans le composant (-80px header).

`prefers-reduced-motion` : Lenis non monté, scroll natif.

## Bilinguisme FR/EN

### Architecture

| Fichier | Rôle |
|---------|------|
| `i18n/routing.ts` | Locales `["fr", "en"]`, défaut `fr`, `localePrefix: "always"` |
| `i18n/request.ts` | Charge `messages/{locale}.json` |
| `i18n/navigation.ts` | `Link`, `useRouter`, `usePathname` conscients de la locale |
| `proxy.ts` | Détection locale + redirection (ex-`middleware.ts`) |
| `messages/fr.json`, `messages/en.json` | **171 clés**, parité stricte |
| `components/layout/LanguageSwitcher.tsx` | Bascule FR ⇄ EN |

### Règles

- **`messages/*.json` est l'unique source de vérité de la copy.** L'ancien
  `lib/constants.ts` a été supprimé — ne pas le recréer.
- **Toute clé ajoutée en FR doit l'être en EN.** Vérification :
  ```bash
  node -e "const f=require('./messages/fr.json'),e=require('./messages/en.json');const k=(o,p='')=>Object.entries(o).flatMap(([x,v])=>v&&typeof v==='object'&&!Array.isArray(v)?k(v,p+x+'.'):[p+x]);const a=k(f),b=k(e);console.log(a.length===b.length&&a.every(x=>b.includes(x))?'OK':'DESYNC')"
  ```
- **Liens internes avec locale** : `` href={`/${locale}/contact`} ``, pas `href="/contact"`
- Tableaux lus avec `t.raw(...)` + type explicite. Icônes mappées **par index**,
  jamais par libellé traduit.
- `localePrefix: "always"` → canonicals toujours préfixés (`/fr`, `/en`)

## Pages existantes

| Route | Contenu |
|-------|---------|
| `/[locale]` | Landing page complète (13 sections dans l'ordre ci-dessus) |
| `/[locale]/contact` | Formulaire contact → `/api/contact` (Resend + rate limiting) |
| `/[locale]/notre-vision` | Page immersive GSAP, 5 sections |
| `/sitemap.xml`, `/robots.txt` | Générés dynamiquement, bilingues |

## Photographie (28 assets Higgsfield)

Dans `public/images/photos/`. **1,52 Mo total.**

**Un seul master** (`master.webp` : consultant devant whiteboard, Kinshasa), toutes
les autres photos en image-to-image depuis lui → lumière, grain et palette identiques.

| Catégorie | Fichiers |
|-----------|----------|
| Services | `service-*.webp` (4, 3:2) |
| Cas d'usage | `cas-*.webp` (6, carré) |
| Méthode | `methode-{1..4}-*.webp` (cross-fade au scroll) |
| Publics | `public-*.webp` (4, 4:5) |
| Supports | `academy.webp`, `contexte-africain.webp`, `banniere-ressources.webp` |
| Détails | `detail-*.webp` (3), `graphique-systemes.webp`, `dashboard-mockup.webp` |
| Placeholder | `equipe.webp` — **provisoire** (visages non identifiables) |

### Contraintes visuelles

- **Aucun robot, cerveau, circuit, hologramme** — l'IA = systèmes et connexions
- **Aucun texte lisible ni logo** dans les visuels
- `equipe.webp` à remplacer par une vraie photo dès qu'elle existe

Régénération : `node scripts/optimize-photos.cjs`

## Déploiement Vercel

- **Projet :** `rapia` (org `rapyogos-projects`)
- **GitHub :** connecté à `rapyogo/rapia` — les pushes sur `master` peuvent
  déclencher un build automatique
- **Domaines :** `ia.rapyogo.com` (custom, CNAME Cloudflare), `rapia.vercel.app`
- **Variables d'env :** `RESEND_API_KEY`, `CONTACT_EMAIL=contact@rapyogo.com`

### ⚠️ Déploiement local — piège .gstack

Le dossier `.gstack/` (daemon `/browse`) est verrouillé (`Permission denied`) et le
CLI Vercel le scanne même s'il est dans `.gitignore`, ce qui bloque le déploiement
avec `EPERM: operation not permitted, scandir`.

**Workaround éprouvé :** cloner dans `%TEMP%` et déployer depuis là :
```powershell
git clone C:\Users\RAPYOGO\rapia $env:TEMP\rapia-deploy
Copy-Item -Recurse C:\Users\RAPYOGO\rapia\.vercel $env:TEMP\rapia-deploy\.vercel
cd $env:TEMP\rapia-deploy
npx vercel --prod --yes
Remove-Item -Recurse -Force $env:TEMP\rapia-deploy
```

Le `.vercelignore` est dans le repo mais ne suffit pas — le CLI scanne le
filesystem avant d'appliquer les règles d'ignore pour .gstack.

## Points d'attention techniques

- **pnpm-lock.yaml** à la racine `C:\Users\RAPYOGO\` → Turbopack émet un warning
  "workspace root inferred" à chaque build. Non bloquant, silençable avec
  `turbopack.root` dans `next.config.ts`.
- **Toujours vérifier `git branch --show-current` avant de commit** — plusieurs
  sessions ont désynchronisé GitHub en committant hors master.
- **`Hero.tsx`** existe encore dans `components/sections/` mais n'est plus importé
  depuis `app/[locale]/page.tsx` (remplacé par `HeroSequence.tsx`). Conserver ou
  supprimer selon décision.
- **`prefers-reduced-motion`** est respecté à tous les niveaux : Lenis non monté,
  transforms CSS désactivés, animations Framer Motion stoppées, CountUp statique.
- **Le daemon `/browse` (gstack)** reste bloqué. QA Playwright : utiliser le Chrome
  système et écrire le script dans `~/.claude/skills/gstack/` (seul endroit où
  `require("playwright")` résout).

## Prochaines pistes

- Re-lancer `/impeccable critique` sur le design Corporate Clair
- Audit Lighthouse sur `/fr` et `/en` (LCP, CLS, INP)
- CI/CD GitHub → Vercel automatique
- Contenu réel pour les stats SocialProof, témoignages, articles (dès que vérifié)
- Vidéo showpiece « La Transformation » si les crédits Higgsfield le permettent
- Remplacer `equipe.webp` par une vraie photo d'équipe
- Revoir `metadataBase` : le site utilise `rapia.cd` dans les canonicals mais
  tourne sur `ia.rapyogo.com`
- Statuer sur la longueur de page (~21 000 px)
- Review EN par un locuteur natif
