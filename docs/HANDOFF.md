# RAPIA — Handoff de session

> À lire en premier au début de chaque session (voir CLAUDE.md).
> Dernière mise à jour : 2026-08-07, fin de session — espace client en production,
> 35 tables, 292 clés i18n, 8 commits sur master

## État actuel

Site web de **RAPIA** (agence IA en RDC) — bilingue FR/EN, design Corporate Clair,
déployé en production sur [`https://ia.rapyogo.com`](https://ia.rapyogo.com).

**Le formulaire de contact est opérationnel** : il envoie réellement des emails
via Brevo SMTP, testé de bout en bout en production (voir « Emails »).

**L'espace client est en production** : connexion par lien magique, testée de
bout en bout sur `ia.rapyogo.com`. Le schéma Neon porte 35 tables — comptes,
organisations, communautés, forum, Academy (cours, leçons, quiz, progression),
paiements Mobile Money.

**Ce qui tourne en production** (commit `e0e77d8`) :
- **Bilinguisme complet** FR/EN via `next-intl` v4, **292 clés**, parité stricte
- **Dix pages** : accueil, Services, Formation, À propos, FAQ, Notre vision,
  Contact, Connexion, Vérification, Espace client
- **Trois nouvelles routes API** : `/api/auth/request`, `/api/auth/verify`,
  `/api/auth/logout`
- **Signalisation IA saine** : `llms.txt`, sitemap, canonicals et `@graph` JSON-LD
  sur `ia.rapyogo.com` (voir « Visibilité IA »)
- **Bibliothèque de composants UI** — Badge, Empty, ChoiceChips, Card composé,
  `PageShell`, `PageFigure`, `PageThumb`, `SocialIcon`, `SocialLinks`
- **Footer refondu** — trois rangées au lieu de huit blocs, pictogrammes sociaux
- **Photos sur Services et Formation** — `PageFigure` et `PageThumb`
- **Footer complet** — coordonnées légales, liens sortants, distinctions,
  contraste AA, source unique partagée avec les emails (`lib/company.ts`)
- **Design Corporate Clair** : Inter, fond clair `#F8F9FB`, zéro gradient/glow/blur,
  profondeur par bordures 1px et aplats
- **Récit vidéo en 5 actes** au scroll (canvas + GSAP) avec 4 couches de parallaxe
- **ProblemLevels** avec pin ScrollTrigger + rail de progression ambre
- **SocialProof** — grille masquée tant qu'aucun chiffre n'est confirmé
- **28 photos corporate** (1,52 Mo) dérivées d'un master unique
- **Lenis** smooth scroll synchronisé avec le ticker GSAP
- **Base Neon** provisionnée, schéma appliqué — **pas encore branchée**

**Production :** [`https://ia.rapyogo.com`](https://ia.rapyogo.com) (alias Vercel)
**Repo GitHub :** [`https://github.com/rapyogo/rapia`](https://github.com/rapyogo/rapia)
**Branche principale :** `master` — synchronisée avec GitHub

## Commits récents (tout sur `master`, ordre chronologique)

```
e0e77d8 docs: rotation Neon documentee, script rotate-neon.mjs dans le depot
0be95da chore: une seule branche Neon — vercel-dev supprimee
d5f2e00 docs: lien magique verifie en production sur ia.rapyogo.com
6688ff1 fix: la base ne doit pas etre requise pour construire le site
1ccde62 docs: variables Vercel synchronisees, et le BOM PowerShell
22bb126 docs: handoff a jour — espace client, schema 002, footer, disque sature
850ce8b feat: espace client — schema Academy/communaute et connexion lien magique
52408f6 feat: footer minimaliste, icones sociales, photos Services/Formation
0b60283 docs: handoff a jour — navigation, fondus, FOUC des chapitres
7d03a10 chore: lockfile apres ajout du pilote Neon
1b0bc9c feat: base Neon — schema de l espace client, migrations et client SQL
673a4fd feat: pages Services et Formation, burger repense, fondus, scrollbar masquee
9852a5e fix: chapitres superposes au chargement, et biographie reelle du fondateur
1775aba fix: corrections de l audit GEO — domaine mort, schema, llms.txt, E-E-A-T
703b276 docs: handoff de fin de session + graphe de connaissances a jour
3921359 feat: footer complet — coordonnees legales, contraste AA, i18n reparee
04f24dd feat: primitives UI premium, preuves honnetes et formulaire durci
8a6228d docs: authentification du domaine verifiee — SPF et DKIM actifs
ce4a035 chore: exclure du depot les fichiers graphify propres a la machine
97367ba chore: graphe de connaissances initial (graphify)
dda27f6 docs: handoff de fin de session — module email Brevo
0d1f6f0 feat: pied de page legal complet dans les emails
53753ac feat: identite visuelle RapIA dans les emails
ae5c938 docs: handoff a jour — Brevo SMTP remplace Resend
0551300 fix: valider avant le rate limiting sur le formulaire de contact
3de350c fix: corrections de review sur le module email
e5d0a08 feat: refonte complete email Brevo
d899d5e feat: module email centralise — transporteur Brevo + stubs futurs
b45f733 feat: ajout de nodemailer pour l'envoi d'emails via Brevo SMTP
218db68 docs: plan d'implementation du module email Brevo + formulaire contact
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
la place) et pas de CI/CD automatique. Les sections Preuves et Contenu n'affichent
plus de placeholders : Preuves assume l'absence de références comme un argument,
Contenu reste masquée tant qu'aucun article réel n'existe.

## Stack technique

- **Next.js 16** (App Router, Turbopack) + **React 19** + **TypeScript 5**
- **next-intl v4** — bilinguisme FR/EN, routes `/fr` et `/en`, `localePrefix: "always"`
- **Lenis** — scroll fluide global, synchronisé avec le ticker GSAP
- **Tailwind CSS v4** (via `@theme inline`, pas de `tailwind.config.js` — tokens dans `app/globals.css`)
- **Framer Motion** — animations scroll-reveal, `MotionConfig reducedMotion="user"`
- **GSAP + @gsap/react** — ScrollTrigger pin/scrub sur ProblemLevels, StoryFlow, Notre Vision
- **Lucide React** — icônes
- **Nodemailer + Brevo SMTP** — tous les envois d'emails, centralisés dans `lib/email.ts`
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
- **Encres d'accent** — `--color-amber-ink` `#7C4A03` et `--color-emerald-ink`
  `#05624A`. Amber et emerald pleins plafonnent à ~2,2:1 en **texte** sur fond
  clair : parfaits en aplat de fond, illisibles en lettres. Toute mention
  textuelle en amber ou emerald passe par ces encres.
- **Tokens CSS :** `app/globals.css` (`:root` + `@theme inline`) — source unique de vérité
- **Interdits** (cahier des charges, non négociables) :
  - Aucun gradient décoratif, aucun glow, aucun `backdrop-blur`
  - Aucun robot/cerveau/circuit imprimé/hologramme dans les visuels (sauf vidéo showpiece)
  - Aucun gradient bleu-violet SaaS
- **Profondeur :** aplats tonals + bordures 1px, pas d'ombres lourdes

## Bibliothèque de composants UI

Dans `components/ui/`. **Aucune dépendance externe** — ni Radix, ni shadcn, ni
Headless UI. Ce n'est pas un oubli : les organisations visées travaillent sur
connexion limitée (PRODUCT.md), et chaque kilo-octet de JavaScript se paie au
chargement. Les primitives sont écrites à la main, en HTML natif accessible.

| Composant | Rôle | Points d'attention |
|-----------|------|--------------------|
| `Button` | 3 variantes (primary, secondary, ghost) | Rend un `<a>` si `href` est passé |
| `Input` | Champ + label + aide + erreur + compteur | Sans état : `value` vient du parent. Le compteur n'apparaît qu'à 70 % de `maxLength` |
| `Card` | Surface bordée | `CardHeader` / `CardBody` / `CardFooter` pour composer ; `padding="none"` alors. Accepte `ref` |
| `Badge` | Chips et tags | Teintes 10 % ; amber et emerald utilisent les **encres**, jamais la couleur pleine |
| `Empty` | État vide, en composition | `Empty` / `EmptyHeader` / `EmptyMedia` / `EmptyTitle` / `EmptyDescription` / `EmptyContent`. `EmptyTitle` prend `as="h3"` quand il porte un vrai niveau de titre |
| `ChoiceChips` | Choix unique en chips | Boutons `aria-pressed`, **pas** un `radiogroup` : le champ est facultatif et doit pouvoir se désélectionner |
| `PageShell` | Charpente des pages de contenu | `PageHeader` / `PageBody` / `BlockTitle` / `PageCta`. Voir « Navigation et interface » — c'est là que vit le rythme vertical |

L'API de composition d'`Empty` reprend celle de shadcn/ui — la structure, pas le
style ni le code. Les composants « premium » trouvés en ligne (21st.dev et
consorts) reposent presque tous sur gradients, glass et ombres portées, que le
cahier des charges interdit : on en garde les idées de structure, jamais la
surface.

**Ne pas ajouter de composant sans usage réel.** Accordion, Tabs, Dialog et
Skeleton ont été délibérément écartés : aucune page ne les appelle aujourd'hui.

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

### ⚠️ L'état initial des chapitres est en CSS, pas en JS

Le défaut le plus visible du site, corrigé le 2026-08-07 : à l'ouverture, **les
trois chapitres de la hero s'affichaient tous en même temps**, texte par-dessus
texte. Ils sont positionnés en absolu les uns sur les autres, et le
`gsap.set(chapters.slice(1), { autoAlpha: 0 })` qui les masque ne s'exécute
qu'après l'hydratation — ~600 ms mesurés en local, plusieurs secondes sur une
connexion lente, c'est-à-dire chez les visiteurs que le produit vise.

L'état de départ est désormais posé dans `app/globals.css` :

```css
[data-chapter]:not([data-chapter="0"]) {
  opacity: 0;
  visibility: hidden;
  transform: translateY(40px);
}
```

Trois choses à ne pas défaire :

- **`visibility` accompagne `opacity`** parce que GSAP pilote `autoAlpha`, la
  combinaison des deux. Un état initial qui n'en couvrirait qu'une produirait
  un saut au premier frame.
- **Les `gsap.set()` de `HeroSequence.tsx` et `StoryFlow.tsx` restent**, mais
  ne sont plus la source de vérité. Si les valeurs changent d'un côté, les
  changer de l'autre.
- **Un `<noscript>` dans le layout de locale** remet les chapitres dans le flux
  si JavaScript ne charge pas — sinon leur texte serait perdu.

Chaque acte renumérote ses chapitres à partir de 0 : le sélecteur vaut pour la
hero comme pour les quatre actes.

### Longueur mobile — `scrollLengthMobile`

`StoryAct` est passé de **2,2 à 1,5** écran de course par acte : la landing
mesurait 38 écrans de haut sur un 390 px, elle en fait 35. Le contenu est
identique, seule la course change. Le voile de lisibilité monte à **80 %** sur
mobile (70 % au-dessus de 768 px) : l'image y est recadrée en « cover » sur une
colonne étroite, donc bien plus dense, et le titre passait derrière les lignes
de code du décor.

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

## SocialProof — Preuves assumées

Section Preuves & Crédibilité, entre ForWhom et Content.

La section affichait « Ils nous font confiance » au-dessus de quatre cadres
pointillés vides, alors que PRODUCT.md acte qu'**aucune référence client
n'existe**. Le titre promettait ce que la section n'avait pas. Elle dit
désormais où en est l'agence et ce qui déclenchera chaque publication —
l'absence de preuve devient un argument, conformément au principe
« crédibilité par la clarté ».

- **Grille de statistiques masquée tant qu'aucun chiffre n'est confirmé.**
  Quatre tuiles affichant un tiret ne prouvent rien et se lisent comme un
  gabarit oublié en production. Elle réapparaît au premier chiffre publié.
- **Pour publier un chiffre** : remplacer `null` par la valeur réelle dans
  `VALUES`, en haut du fichier. **CountUp** l'anime alors une seule fois à
  l'entrée dans le viewport (1200 ms, respecte `prefers-reduced-motion`).
- **Quatre volets de preuve** (témoignages, clients, partenaires,
  certifications) rendus avec `Empty` : chacun nomme ce qui manque **et la
  règle que RAPIA s'impose avant de le publier**. Textes dans
  `socialProof.proofs`, icônes mappées **par index** dans `PROOF_ICONS`.
- `emptyState` ne s'affiche que si des chiffres sont publiés **et** qu'il en
  reste à confirmer : il explique les tirets restants. Sans cette condition, il
  répétait l'introduction.
- **Callout de conversion en Deep Profond** en fin de section — seul emploi
  autorisé de cette couleur en fond.

**Aucun chiffre, logo ou témoignage ne s'invente.** C'est la règle produit la
plus stricte du projet.

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
| `messages/fr.json`, `messages/en.json` | **292 clés**, parité stricte |
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
| `/[locale]/services` | Les 4 services développés : problème, livrables, public, méthode |
| `/[locale]/formation` | RAPIA Academy : 3 formats, catalogue, modalités |
| `/[locale]/a-propos` | Agence, fondateur, certifications, distinctions, engagements |
| `/[locale]/faq` | 10 questions/réponses + JSON-LD `FAQPage` |
| `/[locale]/contact` | Formulaire contact → `/api/contact` (Brevo SMTP, honeypot, rate limiting) |
| `/[locale]/notre-vision` | Page immersive GSAP, 5 sections |
| `/[locale]/connexion` | Demande de lien magique. `noindex` |
| `/[locale]/connexion/verifier` | Confirmation du lien (bouton → POST). `noindex` |
| `/[locale]/espace` | Espace client, protégé par session. `noindex` |
| `/sitemap.xml`, `/robots.txt`, `/llms.txt` | Générés dynamiquement, bilingues |
| `/[locale]/opengraph-image` | Image de partage 1200×630 générée par `next/og` |

## Navigation et interface — refonte du 2026-08-07

### Les deux navigations mobiles ne disent pas la même chose

Le tiroir du burger reprenait **à l'identique** les quatre onglets déjà
affichés en permanence par la barre du bas. L'ouvrir ne montrait rien de
nouveau. Le partage est désormais celui que prescrit `CLAUDE.md` :

| Surface | Contenu | Fichier |
|---------|---------|---------|
| Barre d'onglets (bas, fixe) | Accueil, Services, Formation, Contact | `MobileNav.tsx` |
| Tiroir burger (haut) | À propos, FAQ, Notre vision, langue, CTA | `Header.tsx` (`secondaryLinks`) |
| Nav desktop | Les 5 pages principales | `Header.tsx` (`navLinks`) |

- **Ne pas remettre `navLinks` dans le tiroir mobile** : c'est exactement le
  défaut corrigé.
- Le tiroir est en `inset-x-0 bottom-0 top-16`, **pas** `inset-0` : avec
  `top-16`, un `inset-0` faisait déborder le tiroir de 4 px.
- `pb-20` réserve la hauteur de la barre d'onglets, qui reste au premier plan
  (z-50 contre z-40) pour que la navigation principale reste atteignable.
- Il y avait **deux landmarks** `aria-label="Navigation mobile"` — le tiroir
  porte maintenant `nav.secondaryMenu`.

### Les apparitions sont des fondus, rien d'autre

Les quinze animations de la landing combinaient un fondu, un glissement
vertical (`y: 24` à `y: 40`) et un décalage échelonné (`delay: i * 0.07`).
C'est ce qui produisait l'impression de **texte en cascade**. Il ne reste que
`opacity: 0 → 1`.

**Ne pas réintroduire `y:`, `x:` ni `delay: i *` dans un `whileInView`.** Le
contrôle est visuel : si un élément d'une grille arrive après ses voisins,
c'est une régression.

### Barre de défilement masquée

`app/globals.css`, fin de fichier. Le défilement reste entier — molette,
clavier, geste, Page Down ; seul l'indicateur disparaît, parce qu'il sautait à
chaque section épinglée par ScrollTrigger. Les conteneurs qui défilent en
interne prennent la classe `.scroll-hidden`, sinon une barre réapparaît au
milieu de la page.

C'est un **compromis assumé** : on perd un repère de position sur une page de
~35 écrans.

### Pages de contenu — `components/layout/PageShell.tsx`

`PageHeader`, `PageBody`, `BlockTitle`, `PageCta`, `PageShell`. Utilisés par
Services et Formation ; À propos et FAQ portent encore leur propre charpente,
identique — **à faire converger si l'une d'elles est retouchée.**

**Le rythme vertical vit là.** Empiler des `.section` donne 192 px de blanc
entre deux blocs (`--section-gap` = 96 px, en haut *et* en bas) : le rythme de
la landing, où chaque section occupe un écran. Sur une page qui se lit d'une
traite, ce vide casse la lecture. Le corps est donc **une** `.section` dont les
enfants directs sont espacés par `space-y-16 md:space-y-20`.

## Visibilité IA (GEO) — audit du 05/08/2026

Audit externe : `C:\Users\RAPYOGO\geo-audit-rapia\GEO-REPORT-RapIA-v3.pdf`,
score global **43/100**. Corrections appliquées le 2026-08-07.

### La panne de fond : `rapia.cd`

Le site se déclarait tout entier sur `rapia.cd` — **un domaine qui ne résout
pas** (NXDOMAIN, vérifié : `curl` renvoie 000). Canonical, `og:url`, `og:image`
et sitemap pointaient vers le vide. Le domaine était recopié dans quatre
fichiers, et `NEXT_PUBLIC_SITE_URL` n'était posée sur aucun environnement
Vercel : c'est donc bien le fallback mort qui était servi en production.

**`lib/site.ts` est désormais la source unique** de l'URL, des profils
externes, des distinctions et des faits sur le fondateur. Le sitemap, le
robots.txt, le llms.txt, les canonicals et le JSON-LD en dérivent tous — ils ne
peuvent plus diverger. Le domaine se change **à un seul endroit**.

### Ce qui a été ajouté

| Fichier | Rôle |
|---------|------|
| `lib/site.ts` | URL, chemins, profils, distinctions, fondateur |
| `lib/schema.ts` | Tout le JSON-LD, en `@graph` avec des `@id` stables |
| `components/seo/JsonLd.tsx` | Injection, avec échappement de `<` |
| `app/llms.txt/route.ts` | Carte du site pour les crawlers IA (llmstxt.org) |
| `app/[locale]/opengraph-image.tsx` | Image de partage 1200×630 |
| `app/[locale]/a-propos/`, `app/[locale]/faq/` | Les deux pages E-E-A-T |
| `app/[locale]/contact/layout.tsx` | Métadonnées : la page est un composant client |

### Pièges rencontrés — à ne pas réintroduire

- **`openGraph` d'une page enfant remplace celui du parent, il ne le complète
  pas.** Dès qu'une page déclare son propre bloc `openGraph`, l'image générée
  par la convention `opengraph-image.tsx` disparaît **silencieusement**. Toute
  page qui personnalise son OG doit rappeler `ogImage(locale)`.
- **Un seul nœud par URL dans le graphe.** Émettre `WebPage(type: FAQPage)`
  *et* un `FAQPage` séparé créait deux entités concurrentes pour la même page.
  `faqPage()` produit maintenant un nœud unique qui porte les deux rôles.
- **`logo-horisontale-rapia-dark_mode.png` est un carré 500×500** où la marque
  n'occupe qu'une bande centrale. Posé à hauteur voulue dans l'image OG, il
  rendait un logotype minuscule. C'est `icone-rapia_dark-mode.png` (96×132) qui
  est utilisée, le mot « RAPIA » étant composé à côté en texte.
- **Ne pas empiler les `.section` sur une page de lecture.** `--section-gap`
  vaut 96px en haut *et* en bas : deux sections empilées donnent 192px de vide,
  un rythme fait pour la landing. Les pages À propos et FAQ utilisent **une**
  `.section` avec `space-y-16 md:space-y-20` à l'intérieur.
- **`datePublished` est écrit en dur**, jamais dérivé de la date de build : un
  redéploiement sans changement de contenu ferait rajeunir la page à chaque
  fois.
- **TikTok n'est pas dans `SOCIALS`.** L'audit mentionne un compte « RapYOGO »,
  mais TikTok répond 200 sur n'importe quel `@handle`, existant ou non : le
  profil n'a pas pu être vérifié. Un `sameAs` qui pointe dans le vide affaiblit
  l'entité au lieu de la confirmer.

### À faire confirmer avant de communiquer dessus

Les faits publiés sur la page « À propos » viennent de l'audit, pas de
l'intéressé : **certifications Microsoft et Anthropic, Bac+5 psychologie ULPGL,
alumni Orange Corners, GoGettaz Top 60 2024**. Ils sont dans `FOUNDER`
(`lib/site.ts`) et dans `about.credentials` (`messages/*.json`). Une
certification annoncée et non détenue coûte plus cher que l'absence de page.

### Reste hors code

Ces points de l'audit ne se corrigent pas dans le dépôt :

- **Acheter `rapia.cd`** et le rediriger en 301 (nom de marque court), ou
  l'abandonner définitivement.
- **301 de `rapia.rapyogo.com` (Hostinger) et `car.rapyogo.com`** vers le
  domaine principal — l'autorité de marque est diluée sur quatre domaines.
- **Google Business Profile vérifié** à Goma, **LinkedIn company page**,
  **YouTube**. Dès qu'une URL existe, l'ajouter à `SOCIALS` : elle part
  automatiquement dans le `sameAs` et le pied de page.
- **Annuaires IA** (Futurepedia, There's An AI For That).
- **Articles de fond** : `components/sections/Content.tsx` rend une grille
  complète mais retourne `null` tant que `ARTICLES` est vide.

## Emails (Brevo SMTP + Nodemailer)

Mis en service le 2026-08-06. **Testé de bout en bout en production** : les deux
emails arrivent, l'identité visuelle est en place.

### Architecture — tout passe par `lib/email.ts`

Aucune route ne parle SMTP directement. Le module expose :

| Fonction | Rôle |
|----------|------|
| `sendEmail(to, subject, html, text)` | Socle bas niveau — signe les en-têtes, try/catch, retourne `{success, error}` sans jamais lever |
| `sendContactNotification(data)` | Notification interne vers `ia@rapyogo.com` |
| `sendContactConfirmation(data)` | Accusé de réception au visiteur |
| `sendTrainingRegistration` / `sendQuoteRequest` / `sendNewsletter` | **Stubs** typés — signatures prêtes, corps à écrire |

Le transporteur est un singleton (`pool: true`, `maxConnections: 1`) créé hors
handler : Vercel recycle la connexion TCP entre requêtes chaudes.

### Le gabarit visuel — `emailLayout()`

Bandeau logo sur fond `deep` → filet ambre → carte blanche → pied de page légal.
Les deux emails l'utilisent ; **toute nouvelle fonction email doit passer par lui.**

Quatre contraintes à ne pas relâcher (elles ont chacune une raison) :

- **Mise en page en `<table>` + styles en ligne.** Outlook ignore flexbox et grid,
  Gmail dépouille les balises `<style>`. Ne pas « moderniser » sans tester ailleurs.
- **Logo en PNG, jamais en WebP.** Outlook desktop rend via le moteur de Word,
  qui ne connaît pas le WebP — le logo apparaîtrait cassé.
- **Bandeau sombre + logo blanc** (`logo-horisontale-rapia-dark_mode.png`).
  Gmail et Outlook forcent de plus en plus le mode sombre : un logo bleu nuit sur
  fond blanc inversé disparaît. La bande sombre fixe rend identique partout.
- **Couleurs recopiées dans la constante `BRAND`.** Un email ne peut pas lire les
  variables CSS. **Si la palette change dans `app/globals.css`, la répercuter ici** —
  c'est le seul endroit du module qui porte des couleurs.

Les coordonnées de l'entreprise vivent désormais dans **`lib/company.ts`**, pas
dans `email.ts` : le footer du site publie exactement les mêmes données, et les
recopier aurait créé deux endroits à corriger le jour d'un déménagement. Le pied
de page texte `FOOTER_TEXT` et le pied de page HTML en **dérivent** tous les deux
— **une adresse, un numéro ou une immatriculation se change à un seul endroit.**

`lib/company.ts` ne porte que des **faits**. Tout ce qui se traduit (« siège »,
« Téléphone », les intitulés) vit dans `messages/*.json`. Les emails, eux, sont
en français uniquement : la mention « (siège) » y est reconstruite en dur par
`officeLabel()`.

### Sécurité du formulaire

| Protection | Détail |
|------------|--------|
| Honeypot | Champ `_website` caché. Si rempli → `200 success` silencieux, **avant** tout envoi : le bot croit avoir réussi, le quota Brevo est préservé |
| Rate limiting | 1 soumission / 60 s par IP, **appliqué après la validation** — sinon une faute de frappe bloquait le visiteur une minute pour rien |
| Validation | Champs requis + longueurs max, échappement HTML de toute donnée injectée dans les emails |
| Erreurs | Les détails SMTP restent dans les logs serveur ; le client ne reçoit qu'un message générique |

### Comportement du formulaire (côté page)

- **429 et 400 ne disent pas la même chose.** Ils appelaient le même message
  générique, ce qui poussait un visiteur rate-limité à réessayer aussitôt — et
  à échouer encore. Chaque cas a désormais sa consigne : attendre, ou corriger.
- **Le focus part sur le premier champ fautif** après un échec de validation
  (sur mobile, il est souvent hors écran), et sur le bloc de confirmation après
  un succès — sinon le focus retombe sur `<body>`.
- Les `maxLength` du client **reflètent** `MAX_LENGTHS` de la route API. Le
  serveur reste l'autorité ; ces bornes évitent seulement de rédiger un message
  qui sera refusé après coup. **Les changer des deux côtés.**
- Une frappe après un échec efface le bandeau rouge : le visiteur corrige.

**La route renvoie 500 si la notification interne échoue.** C'est délibéré : sans
ça, un `success` s'affichait alors que le message n'était parvenu à personne.
Corollaire utile : un `success: true` prouve que Brevo a accepté l'email.

### Quota — la vraie borne

Plan gratuit Brevo : **300 emails/jour**. Chaque soumission en consomme **2**
(notification + confirmation), soit **~150 formulaires/jour** au plafond.
Si ça sature : passer en notification seule, ou au plan payant Brevo
(5 000/jour, ~10 €/mois). Ne jamais mettre d'envoi en boucle.

### Authentification du domaine (DNS Cloudflare)

Vérifiée le 2026-08-06 par interrogation directe des DNS :

| Enregistrement | État | Valeur |
|----------------|------|--------|
| Propriété Brevo | ✅ | `brevo-code:5ce60e41...` sur `rapyogo.com` |
| **SPF** | ✅ | `v=spf1 include:_spf.mx.cloudflare.net include:spf.brevo.com ~all` |
| **DKIM** | ✅ | `brevo1` et `brevo2._domainkey` → CNAME vers `bN.rapyogo-com.dkim.brevo.com`, clés RSA 2048 bits valides |
| **DMARC** | ⚠️ | `v=DMARC1; p=none; rua=mailto:rua@dmarc.brevo.com` — `p=none` à durcir |

**Le sélecteur DKIM de Brevo est `brevo1` / `brevo2`**, pas `mail._domainkey`
comme sur d'anciennes documentations Sendinblue. Chercher au mauvais endroit
fait conclure à tort que le DKIM est absent.

Commande de contrôle :
```bash
nslookup -type=CNAME brevo1._domainkey.rapyogo.com 8.8.8.8
nslookup -type=TXT rapyogo.com 8.8.8.8 | grep spf
nslookup -type=TXT _dmarc.rapyogo.com 8.8.8.8
```

Sur Cloudflare, ces enregistrements doivent rester en **DNS only (nuage gris)** :
un proxy actif casse la résolution.

### Variables d'environnement

Les 6 sont posées sur **Production, Preview et Development** (via `vercel env add`) :
`BREVO_SMTP_HOST`, `BREVO_SMTP_PORT`, `BREVO_SMTP_LOGIN`, `BREVO_SMTP_PASSWORD`,
`IA_FROM_EMAIL`, `IA_FROM_NAME`. Détail dans le [README](../README.md).

### Tests passés en production (2026-08-06)

Champs manquants → 400 · email invalide → 400 · message manquant → 400 ·
nom de 250 car. → 400 · honeypot → `success` sans email · **soumission valide →
les 2 emails reçus** · 2ᵉ envoi immédiat → 429.

Rejouables par `curl` sur `https://ia.rapyogo.com/api/contact`.

## Footer & coordonnées — refondu le 2026-08-07

`components/layout/Footer.tsx`, alimenté par `lib/company.ts`.

Publie les 3 implantations, le téléphone, l'e-mail et les immatriculations
(RCCM / ID Nat / NIF) — **les mêmes données que les emails**, décision prise
sciemment : le site en disait moins que les messages qu'il envoie.

### Trois rangées, plus huit blocs

Le pied de page empilait marque, services, liens, contact, réseaux,
implantations, distinctions et mentions légales : **huit sections, chacune avec
son titre en capitales**, qui donnaient à la fin du site le poids d'une page
entière. Le contenu n'a pas bougé, sa hiérarchie si :

| Rangée | Contenu |
|--------|---------|
| 1 | Marque à gauche, trois colonnes de liens à droite (Services, En savoir plus, Contact) |
| 2 | Les trois implantations, et les **pictogrammes sociaux** |
| 3 | Mentions légales et copyright, distinctions en liens texte |

- **Les distinctions ne sont plus des cartouches bordés.** Elles avaient le
  poids visuel d'un bouton d'action : trois fausses cibles principales en bas
  de page. Elles restent vérifiables — chacune renvoie au site de l'organisme.
- **Les réseaux sont des icônes** (`components/ui/social-icons.tsx`), SVG
  écrits à la main : Lucide a retiré les logos de marques de son catalogue.
  Cible tactile de 44 px pour un dessin de 18, compensée par un `-ml-3` sinon
  la rangée paraît rentrée. **Une plateforme ne s'affiche que si son URL est
  renseignée** — une icône qui ne mène nulle part promet une présence qui
  n'existe pas.
- **Six clés de traduction ont été supprimées** des deux fichiers de messages
  (`officesTitle`, `emailLabel`, `phoneLabel`, `followTitle`,
  `recognitionLabel`, `servicesPageLink`) : plus aucun composant ne les lisait.

### Photos sur les pages de contenu

`PageFigure` et `PageThumb` (`components/layout/PageShell.tsx`). Services et
Formation étaient entièrement textuelles alors que 28 photos existent.

- Chaque service porte la sienne, **déduite de son `id`**
  (`service-${id}.webp`) : ajouter un service revient à déposer une photo au
  même nom, sans toucher au composant.
- Les quatre étapes de méthode prennent une vignette, mappées **par index**
  (`METHOD_PHOTOS`) — les titres sont traduits, ils ne peuvent pas servir de clé.
- **`alt` est vide partout.** Ces photos n'apportent rien que le texte voisin
  ne dise déjà. Leur inventer une description créerait une légende à traduire
  et à resynchroniser à chaque remplacement de visuel.

**Contraste — ne pas baisser les opacités.** Sur le fond Deep Profond
(`#001B2A`), le blanc à 30 % donne **2,6:1** et à 40 % **3,7:1**, sous le seuil
AA de 4,5:1 exigé par PRODUCT.md. Les opacités partent de **55 %** (6,0:1).
Mesure au rendu après correction : pire ratio **5,97:1**, zéro échec sur les
28 textes, FR et EN. Baisser une opacité pour « adoucir » le pied de page fait
disparaître le texte, pas le gris.

Autres points :

- **Rien en dur.** « Notre vision » et « Pourquoi RAPIA » étaient écrits en
  français dans le JSX : le footer anglais affichait du français.
- Les deux-points des immatriculations suivent la langue (`RCCM :` en français,
  `RCCM:` en anglais).
- `SERVICE_ANCHORS` mappe les ancres **par index** — les libellés sont traduits
  et ne peuvent pas servir de clé.
- Réserve basse `pb-28` : sans elle, la barre de navigation mobile (`h-16`,
  fixée) recouvre les mentions légales.

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
- **Variables d'env email** (Production + Preview + Development, posées le 2026-08-05) :
  `BREVO_SMTP_HOST`, `BREVO_SMTP_PORT`, `BREVO_SMTP_LOGIN`, `BREVO_SMTP_PASSWORD`,
  `IA_FROM_EMAIL`, `IA_FROM_NAME` — détail dans le [README](../README.md)
- `RESEND_API_KEY` et `CONTACT_EMAIL` traînent encore en Production mais **plus
  aucun code ne les lit** — à supprimer depuis le dashboard Vercel

### ⚠️ Déploiement local — piège .gstack

Le dossier `.gstack/` (daemon `/browse`) est verrouillé (`Permission denied`) et le
CLI Vercel le scanne même s'il est dans `.gitignore`, ce qui bloque le déploiement
avec `EPERM: operation not permitted, scandir`.

**Workaround éprouvé** (utilisé 4 fois le 2026-08-06) — cloner hors du repo et
déployer avec `--cwd`, sans `cd` :

```bash
TMP=/c/Users/RAPYOGO/AppData/Local/Temp/rapia-deploy
rm -rf "$TMP"
git clone -q --depth 1 "file:///c/Users/RAPYOGO/rapia" "$TMP"
mkdir -p "$TMP/.vercel" && cp .vercel/project.json "$TMP/.vercel/project.json"
npx vercel --cwd "$TMP" --prod --yes
rm -rf "$TMP"
```

Deux détails qui comptent :
- **`--cwd` plutôt que `cd`** — évite de déplacer le shell, et passe là où un `cd`
  enchaîné se fait refuser.
- **Le clone ne prend que ce qui est commité.** Vérifier que le travail est bien
  commité avant de déployer, sinon on met en ligne la version précédente.

Le `.vercelignore` est dans le repo mais ne suffit pas : le CLI scanne le
filesystem avant d'appliquer les règles d'ignore.

## Base de données (Neon) — 35 tables

Postgres serverless chez Neon. Projet `Rapia` (`soft-cherry-63336100`),
organisation `org-winter-water-42162281`, région `aws-us-east-2`.

| Élément | Où |
|---------|-----|
| Connexion | `DATABASE_URL` — `.env.local` et Vercel |
| Client | `lib/db.ts` — pilote HTTP `@neondatabase/serverless` |
| Schéma | `db/migrations/001_initial.sql`, `002_academy_community.sql` |
| Exécution | `npm run db:migrate` |
| Inventaire | `npm run db:check` — **ce que la base contient vraiment**, à opposer à ce que les fichiers SQL disent |

**Migration 001 (13 tables)** — comptes, audits de workflow, formations
animées, ressources, projets, blog, newsletter.

**Migration 002 (22 tables)** — appliquée le 2026-08-07 :

| Domaine | Tables |
|---------|--------|
| Organisations | `organizations`, `organization_members`, `organization_invites` |
| Communautés | `communities`, `community_members` |
| Forum | `forum_topics`, `forum_replies` |
| Blog social | `post_comments`, `likes` |
| Academy | `courses`, `course_modules`, `lessons`, `enrollments`, `lesson_progress` |
| Quiz | `quizzes`, `quiz_questions`, `quiz_options`, `quiz_attempts`, `quiz_answers` |
| Paiements | `orders`, `order_items`, `payments` |

### Trois décisions prises avec l'utilisateur le 2026-08-07

- **Authentification maison par lien magique**, contre Neon Auth. Celui-ci
  aurait tenu une table de comptes parallèle à `users`, à synchroniser, et fait
  partir les e-mails hors de Brevo. `users.id` reste la clé unique de tout le
  schéma. *(`neon init` a tout de même été lancé : il a installé le CLI, le MCP
  VS Code et des skills — outillage local, ignoré par git.)*
- **Mobile Money uniquement** — M-Pesa, Airtel, Orange, AfriMoney via
  FlexPay.cd. Pas de carte bancaire au schéma. `provider = 'manual'` n'est pas
  une offre publique : c'est l'écriture d'un admin qui régularise un versement
  hors ligne (facture ONG, espèces).
- **Communautés validées avant publication.** Une communauté existe en base dès
  sa demande et reste invisible jusqu'à `approved_at`. La modération est
  préventive, pas réactive.

### Ce qu'il faut savoir avant d'y toucher

- **Le pilote HTTP refuse plusieurs instructions par requête.** D'où le
  découpage dans `scripts/migrate.mjs` : il suit l'état du lexer (chaînes,
  commentaires, dollar-quotes `$$`) parce qu'un `split(";")` couperait au
  milieu des corps de fonction. Sans transaction englobante, **chaque migration
  doit être idempotente** — `IF NOT EXISTS` partout.
- **`sql` est un tagged template.** ``sql`... ${email} ...` `` lie les
  paramètres ; `sql(\`...\`)` **lève une erreur** — le pilote refuse l'appel de
  fonction et renvoie vers `sql.query(...)`, la seule forme admise pour du DDL
  sans paramètre. Rencontré en écrivant la rotation du mot de passe.
- **`citext` pour les e-mails**, vérifié : `Test@Rapia.CD` et `test@rapia.cd`
  sont le même compte. `users.handle` l'est aussi — l'identifiant public ne
  doit pas dépendre d'une majuscule.
- **`ON DELETE CASCADE` depuis `users`**, vérifié. Deux exceptions
  délibérées : `organizations.owner_id` et `communities.owner_id` sont en
  `SET NULL`, parce que supprimer le compte d'un directeur ne doit pas emporter
  son organisation et ses agents.
- **Les « j'aime » ne sont pas polymorphes.** `likes` porte une vraie clé
  étrangère par cible (`post_id`, `topic_id`, `reply_id`, `comment_id`) avec
  `num_nonnulls(...) = 1`, plutôt qu'un couple `(type, id)` sans contrainte.
  L'unicité passe par **quatre index partiels** : un `UNIQUE` ordinaire sur les
  quatre colonnes laisserait passer autant de doublons qu'on veut, deux NULL
  n'étant jamais égaux en SQL. Même piège pour `forum_topics.slug`, d'où le
  `COALESCE(community_id, '000…'::uuid)` dans son index.
- **`forum_topics.reply_count` et `last_reply_at` sont tenus par trigger.**
  Ne jamais les écrire depuis le code applicatif.
- **Les montants sont en centimes**, jamais en flottant, et **recopiés** sur
  `order_items` : une facture doit dire ce qui a été vendu ce jour-là, même si
  le prix a changé au catalogue depuis.

### Le mot de passe a été tourné le 2026-08-07

La chaîne de connexion avait circulé en clair dans une conversation. **C'est
réglé** : `ALTER ROLE neondb_owner WITH PASSWORD` exécuté en SQL — Neon
l'accepte depuis n'importe quel client, le dashboard n'est pas nécessaire — et
`.env.local` mis à jour, nouvelle connexion vérifiée par `npm run db:migrate`.

### ⚠️ La base ne doit jamais être requise au moment du build

Le premier déploiement après la mise en place de l'espace client **a échoué en
entier**, sur un message qui n'aidait pas :

```
Error: Database connection string provided to `neon()` is not a valid URL.
       Connection string: [REDACTED]
Error: Failed to collect page data for /api/auth/logout
```

Deux causes superposées :

1. **`lib/db.ts` appelait `neon()` au chargement du module.** La phase
   « Collecting page data » de `next build` évalue les modules : elle
   exécutait donc la connexion, et une valeur fautive faisait tomber la
   construction du site complet — y compris les pages qui ne touchent pas la
   base. Corrigé : le client s'initialise **à la première requête**, derrière
   un Proxy qui préserve l'écriture ``sql`…` ``. Vérifié en rejouant le build
   avec `DATABASE_URL="ceci-nest-pas-une-url"` : il passe.
2. **Les variables « Sensitive » de Vercel ne sont pas exposées au build.**
   `vercel env add` classe automatiquement ainsi une chaîne de connexion ; au
   build, le code reçoit un substitut, d'où le `[REDACTED]` que `neon()` a
   tenté de parser. Au *runtime* la vraie valeur est bien là.

**À retenir : construire le site ne demande pas de savoir joindre la base.**
Tout module ajouté qui ouvre une connexion, lit un secret ou appelle un service
externe doit le faire paresseusement. Sinon une panne de Neon pendant un
déploiement empêche de publier une correction de faute d'orthographe.

`lib/db.ts` retire aussi un éventuel **BOM** en tête de la variable — voir le
piège PowerShell dans « Points d'attention ».

**Vercel est synchronisé** : `DATABASE_URL` et `DATABASE_URL_UNPOOLED` ont été
reposées sur Production, Preview et Development le 2026-08-07. La variante
`_UNPOOLED` est le **même endpoint sans `-pooler` dans le nom d'hôte** —
convention de l'intégration Neon/Vercel, utilisée par les outils de migration
parce que PgBouncer ne supporte pas les instructions préparées de session.
Aucun code du projet ne la lit ; elle est tenue à jour pour qu'elle n'échoue
pas le jour où quelqu'un s'en sert.

### Rotation du mot de passe — `rotate-neon.mjs`

Le mot de passe a fuité deux fois pendant la session du 2026-08-07 : la
première par transmission en clair, la seconde parce qu'un BOM dans `.env.local`
a fait recracher la chaîne entière au pilote Neon (voir « Points d'attention »).

**Le script `rotate-neon.mjs` est dans le dépôt** pour cette raison précise.
Usage :

```bash
node --env-file=.env.local rotate-neon.mjs
```

Ce qu'il fait, dans l'ordre :
1. Lit `DATABASE_URL` depuis l'environnement (l'option `--env-file` la charge)
2. Retire un éventuel BOM en tête — `charCodeAt(0) === 0xfeff`, pas de caractère invisible
3. Génère un mot de passe aléatoire de 32 caractères (base64url, jamais affiché)
4. Exécute `ALTER ROLE` directement sur la base — la seule voie que Neon accepte
5. Vérifie que la nouvelle chaîne se connecte
6. Réécrit `.env.local` **sans BOM** (`writeFileSync` de Node n'en ajoute jamais)

**Le classifieur de sécurité bloque toute commande qui change un mot de passe
de base.** Le script est donc à lancer **à la main** — c'est pour ça qu'il est
là, documenté et commité, plutôt que dans un scratchpad.

### ⚠️ `neon init` réécrit `.env.local` avec un BOM

Observé le 2026-08-07 : `npx neon init` réinstalle les skills et **réécrit
`.env.local` avec un BOM**. Le relancer après le setup initial est inutile et
nocif — le CLI est déjà authentifié, le projet déjà lié. Si `.env.local`
recommence à produire des `ERR_INVALID_URL`, vérifier le BOM **avant** de
chercher une autre cause (voir « Points d'attention » pour le diagnostic).

### Après rotation : propager sur Vercel

Une fois `rotate-neon.mjs` exécuté, la nouvelle chaîne est dans `.env.local`.
La propager :

```bash
npx vercel env rm DATABASE_URL production --yes
npx vercel env add DATABASE_URL production   # coller la valeur
# idem pour preview, development
# et pour DATABASE_URL_UNPOOLED : même valeur, hôte sans -pooler
```

**Si la liaison Neon→Vercel est active**, vérifier d'abord si Vercel s'est
mis à jour tout seul — lire la variable Development (non « Sensitive », donc
lisible) et comparer. Le cas échéant, il n'y a rien à propager.

`npm run db:migrate` sert de vérification finale : s'il répond, tout est bon.

### Une seule branche Neon : `production`

`neon init` avait créé une seconde branche, `vercel-dev`, le 2026-08-07 à
14h36 — donc **avant** la migration 002 : elle portait déjà l'ancien schéma à
13 tables pendant que la vraie base en avait 35. Rien ne pointait vers elle,
les trois environnements Vercel visant `production`. **Supprimée**, décision
prise avec l'utilisateur : deux bases dont une oubliée finissent toujours par
coûter une soirée.

**Le jour où il faudra une base de préversion** — c'est-à-dire dès qu'il y aura
de vrais comptes clients, pour qu'un test n'écrive plus dans leurs données — la
recréer, y rejouer `npm run db:migrate`, **et** faire pointer `DATABASE_URL` de
Preview et Development vers elle. Les trois gestes, sinon les schémas divergent
en silence.

**Il n'y a pas de ressource Marketplace Neon côté Vercel** (`vercel integration
ls` ne renvoie rien) : la liaison a été faite depuis Neon. Conséquence à
connaître — si cette intégration reprend la main, elle **réécrira**
`DATABASE_URL` sur Vercel, par-dessus les valeurs posées à la main ici. Sans
gravité tant que les deux visent la même branche, mais c'est l'explication à
chercher en premier si la variable change toute seule.

### Ce qu'il faut savoir avant d'y toucher

- **Le pilote HTTP refuse plusieurs instructions par requête.** D'où le
  découpage dans `scripts/migrate.mjs` : il suit l'état du lexer (chaînes,
  commentaires, dollar-quotes `$$`) parce qu'un `split(";")` couperait au
  milieu des corps de fonction. Sans transaction englobante, **chaque migration
  doit être idempotente** — `IF NOT EXISTS` partout.
- **`sql` est un tagged template.** ``sql`... ${email} ...` `` lie les
  paramètres ; `sql(\`... ${email} ...\`)` les concatène. Les deux formes se
  ressemblent, une seule est sûre.
- **`citext` pour les e-mails**, vérifié : `Test@Rapia.CD` et `test@rapia.cd`
  sont le même compte. Sans ce type, l'unicité se contourne par une majuscule.
- **`ON DELETE CASCADE` depuis `users`**, vérifié : supprimer un compte efface
  ses audits, inscriptions et projets en une requête.
- **Aucun mot de passe n'est stocké.** `users.password_hash` est nullable et le
  restera si l'authentification passe par **lien magique** — la piste par
  défaut, puisque Brevo est déjà en service. `auth_tokens` stocke un *hash* du
  jeton, jamais le jeton.
- **`newsletter_subscribers` est séparée de `users`** : on s'abonne sans
  compte. `unsubscribed_at` conserve la ligne au lieu de la supprimer, ce qui
  permet de prouver qu'un désabonnement a été honoré.

### ⚠️ Le mot de passe — section remplacée

L'historique des fuites et la procédure de rotation sont documentés juste
au-dessus, dans « Rotation du mot de passe — `rotate-neon.mjs` ». Cette
section ne garde qu'un rappel : **le mot de passe initial a circulé, le second
aussi, le troisième est dans `.env.local` après rotation.** Tourner avant
toute mise en service réelle de l'espace client.

## Espace client — connexion par lien magique

Mise en service le 2026-08-07. **Testée de bout en bout en local** : demande de
lien, création du compte, consommation du jeton, ouverture de session, accès à
la page protégée, déconnexion, et refus du rejeu.

**Et vérifiée en production** sur `ia.rapyogo.com` : adresse invalide → 400,
demande réelle → 200, jeton inconnu → 303 vers `?erreur=expire`, `/fr/espace`
sans session → 307 vers `/fr/connexion?suite=%2Ffr%2Fespace`. Le 200 vaut
double preuve : la base répond **et** Brevo a accepté l'e-mail — la route
renvoie 500 si l'envoi échoue, précisément pour qu'un succès ne puisse pas
mentir.

| Fichier | Rôle |
|---------|------|
| `lib/auth.ts` | Tout : jetons, sessions, cookie, garde de redirection |
| `lib/email.ts` → `sendMagicLink()` | L'e-mail, via le gabarit `emailLayout()` |
| `app/api/auth/request/route.ts` | Demande de lien |
| `app/api/auth/verify/route.ts` | Consomme le jeton, ouvre la session |
| `app/api/auth/logout/route.ts` | Ferme la session |
| `app/[locale]/connexion/` | Formulaire + page de confirmation |
| `app/[locale]/espace/` | La page protégée |

### Sept choix qui ont chacun une raison

- **La vérification passe par un bouton, pas par le clic sur le lien.**
  Microsoft 365 Safe Links — donc les ONG et institutions visées — **visite les
  URL entrantes avant leur destinataire**. Un jeton à usage unique consommé par
  ce passage laisse la personne devant « lien déjà utilisé » sur un lien
  qu'elle n'a jamais ouvert. Un scanner suit un lien ; il ne soumet pas un
  formulaire. **Ne pas « simplifier » en consommant le jeton au `GET`.**
- **La route répond toujours la même chose**, que le compte existe ou non,
  qu'il soit limité ou non. Sinon le formulaire devient un oracle : on saisit
  une adresse, on lit la réponse, on sait qui est client de RapIA. Les seuls
  autres codes sont 400 (adresse invalide) et 500 (envoi échoué) — les cas où
  rien n'a été tenté.
- **La consommation du jeton est un `UPDATE ... RETURNING`, pas un `SELECT`
  puis un `UPDATE`.** Entre les deux, deux clics simultanés ouvriraient deux
  sessions.
- **Session de 30 jours glissants**, prolongée à mi-vie. Un espace de formation
  se consulte par à-coups ; une session courte renverrait sans cesse vers la
  boîte mail et consommerait le quota Brevo (300/jour).
- **La protection est dans le composant serveur, pas dans `proxy.ts`.** Le
  middleware tourne en Edge : ni `node:crypto` ni le pilote de base n'y sont
  disponibles, il ne pourrait que constater la présence d'un cookie sans
  vérifier qu'il correspond à une session vivante. **Toute page ajoutée sous
  `/espace` doit refaire l'appel à `getSessionUser()`** — ou passer par un
  `layout.tsx` commun quand elles seront plusieurs.
- **Jamais le jeton en base, toujours son empreinte SHA-256.** Vaut pour
  `auth_tokens`, `sessions` et `organization_invites`.
- **`lib/auth.ts` n'est pas gardé par `server-only`** — le paquet n'est pas
  installé, le projet tient à zéro dépendance externe. La garde est humaine :
  **ne l'importer que depuis un composant serveur ou une route API.**

### Ce qui manque pour l'essayer en local

`.env.local` **ne contient pas les identifiants Brevo** — seulement
`DATABASE_URL` (plus `RESEND_API_KEY` et `CONTACT_EMAIL`, morts). La demande de
lien répond donc 500 en local, ce qui est le comportement voulu : mieux vaut
une erreur qu'un « lien envoyé » devant une boîte vide. Pour tester
réellement :

```bash
npx vercel env pull .env.local --environment=production
```

## Points d'attention techniques

- **⚠️ Le disque C: a saturé pendant la session du 2026-08-07** — 0 octet libre
  sur 237 Go, en pleine écriture de fichier. Symptôme trompeur : PowerShell se
  met à répondre **faux** sans erreur (`Test-Path` renvoie vide sur des
  dossiers qui existent, `Get-Volume` ne trouve plus C:). Si des commandes
  deviennent incohérentes, vérifier l'espace **avant** de chercher un bug :
  ```powershell
  $d = New-Object System.IO.DriveInfo("C"); "{0:N2} Go" -f ($d.AvailableFreeSpace/1GB)
  ```
  9,5 Go ont été récupérés en supprimant `.next`, `npm-cache`, `pnpm-cache`,
  `next-swc` et le contenu de `%LOCALAPPDATA%\Temp` — tous régénérables. Passer
  par `cmd /c rmdir /s /q` quand PowerShell devient peu fiable.
- **⚠️ `Set-Content -Encoding utf8` ajoute un BOM** en PowerShell 5.1 (l'option
  `utf8NoBOM` n'existe qu'à partir de PowerShell 7). Sur `.env.local`, le BOM
  se colle devant la valeur de la première variable ; le pilote Neon rejette
  alors la chaîne — **et la recopie entière, mot de passe compris, dans son
  message d'erreur**. Une erreur d'encodage suffit donc à exposer un secret.
  Écrire par .NET :
  ```powershell
  $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
  [System.IO.File]::WriteAllLines($chemin, $lignes, $utf8NoBom)
  ```
  Contrôle : `[System.IO.File]::ReadAllBytes($chemin)[0..2]` — `239,187,191`
  signale un BOM. Le plus sûr reste `npx vercel env pull`, qui écrit
  correctement.
- **`.next` partagé entre `next build` et `next dev` casse le routage.** Après
  un build de production, `npm run dev` a servi **404 sur toutes les routes
  API nouvellement ajoutées** — tout en affichant `○ Compiling /api/auth/request`
  dans ses logs, ce qui envoie chercher le bug dans le code. `/api/contact`,
  déjà présent dans le build, répondait normalement. **Supprimer `.next` avant
  de passer du build au dev.**
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
- **Tailwind v4 rend les couleurs en `oklab()`**, pas en `rgb()`.
  `getComputedStyle(el).color` renvoie `oklab(0.999994 … / 0.65)`. Un script qui
  parse ces nombres comme du RGB produit des mesures de contraste fausses **et
  plausibles** — c'est arrivé pendant l'audit du footer (1,19:1 annoncé au lieu
  de 7,8:1). Pour mesurer un contraste, laisser le navigateur composer la
  couleur sur son fond dans un `<canvas>` 1×1 et lire le pixel obtenu.
- **`PRODUCT.md` a dérivé.** Il annonce encore Space Grotesk, le design system
  « Kinshasa Modern », Resend et « pas d'autres coordonnées (téléphone,
  adresse) ». Le code est sur Inter, Corporate Clair, Brevo, et publie les
  coordonnées complètes. Le fichier est lu au démarrage par le skill de design :
  tant qu'il n'est pas repris, il oriente mal chaque session.

## Prochaines pistes

### La rotation du mot de passe Neon — priorité absolue

Le mot de passe a fuié deux fois. **`rotate-neon.mjs` est dans le dépôt**,
documenté en détail dans la section « Base de données ». Une commande :

```bash
node --env-file=.env.local rotate-neon.mjs
```

Ensuite vérifier si Vercel s'est synchronisé automatiquement (liaison Neon), et
propager sinon. La procédure complète est dans « Rotation du mot de passe ».

### Le chantier de la session suivante — remplir l'espace client

La porte est ouverte (connexion, session, page protégée) et le schéma attend
en entier. **Toutes les tables sont en place sur `production`** — ce qui manque
est l'écran de chaque fonction. Ordre proposé :

1. **Profil utilisateur.** Le compte n'a qu'une adresse : `full_name`, `handle`,
   `avatar_url` sont vides. Premier écran à construire — on ne signe pas un
   message avec son adresse e-mail.
2. **Blog.** `posts` existe, `Content.tsx` rend déjà la grille et retourne
   `null` faute de source. Brancher `posts` sur `Content.tsx`, puis `post_comments`
   (modération par défaut) et `likes`.
3. **Organisations.** Création, invitation d'agents — même mécanique de jeton
   haché que la connexion. Email d'invitation à écrire dans `lib/email.ts`.
4. **Academy.** `courses` → `course_modules` → `lessons`, puis `enrollments` et
   `lesson_progress`. Les quiz après.
5. **Audit de workflow.** `workflow_audits` — le diagnostic rend un
   `maturity_level` de 1 à 3, et `courses.level` utilise la **même échelle**.
6. **Paiements FlexPay.** Un skill dédié existe (`flexpay-mobile-money`).
   `orders`/`payments` sont prêtes, `provider_reference` est `UNIQUE` : c'est la
   garde contre le double encaissement.
7. **Forum et communautés.** Le plus lourd en interface.
8. **Administration.** Aucun écran n'existe, et l'utilisateur a demandé que
   « l'admin gère la plateforme entière ». Tout se fait en SQL direct pour
   l'instant — c'est le premier vrai manque.

À décider avant de coder : ce qu'un compte non vérifié peut voir (pour l'instant
`email_verified_at` est posé au premier clic, donc la question ne se pose pas),
et si on construit un back-office ou si on continue en SQL direct.

### À confirmer par l'utilisateur

- ✅ **Certifications Microsoft et Anthropic — confirmées par l'intéressé le
  2026-08-07.** Elles peuvent rester publiées.
- **Liens sociaux** : `SOCIAL_PLATFORMS` réserve la place de LinkedIn, YouTube,
  TikTok, Facebook, Instagram et X, toutes à `url: null`. Le pied de page rend
  désormais des **pictogrammes** (`components/ui/social-icons.tsx`) : renseigner
  une URL suffit à faire apparaître l'icône **et** à alimenter le `sameAs`,
  sans toucher à un composant. Seul GitHub est vérifié à ce jour.
- **URL LinkedIn et photo du fondateur** : demandées le 2026-08-07, pas encore
  transmises. Le profil n'est pas trouvable par recherche publique — il faut
  l'URL exacte. La photo remplacerait l'absence de portrait sur `/a-propos`.
- **Domaine de Viteat** : aucun ne résout (`viteat.com`, `.cd`, `.app`,
  `.africa`, `viteat.rapyogo.com`). Le service est cité sans lien sur
  `/a-propos` ; `SIBLING_SERVICES` l'attend en `url: null`.
- **Rotation du mot de passe Neon** — voir l'avertissement en tête de « Base de
  données ».

### Email — à traiter en priorité

- **Passer DMARC de `p=none` à `p=quarantine`.** SPF et DKIM sont en place
  (voir « Authentification du domaine » ci-dessous), mais `p=none` ne demande
  aucune action en cas d'échec : le domaine reste usurpable. Passer à
  `quarantine`, observer les rapports `rua` quelques semaines, puis `reject`.
- **Tester le rendu sous Outlook desktop** — Gmail est permissif, Outlook non.
  Le gabarit est construit pour lui, mais ça n'a pas été vérifié de visu.
- **Supprimer `RESEND_API_KEY` et `CONTACT_EMAIL`** des variables Vercel
  Production : plus aucun code ne les lit (suppression refusée par le classifieur
  de sécurité pendant la session, à faire depuis le dashboard).
- ✅ **Adresse de contact unifiée le 2026-08-07.** `ia@rapyogo.com`
  (`COMPANY.email`) fait foi partout ; la clé `contact.email` a été supprimée
  des deux fichiers de messages. Une adresse e-mail n'est pas de la copy : elle
  ne se traduit pas et ne se duplique pas.
- Implémenter les stubs quand le besoin arrive : inscriptions formations,
  demandes de devis, newsletter.

### Reste

- **Reprendre `PRODUCT.md`** — voir « Points d'attention ». C'est le premier
  fichier lu par le skill de design ; il décrit un site qui n'existe plus.
- **Les eyebrows** (« PREUVES & CRÉDIBILITÉ ») sont proscrits par le référentiel
  Impeccable, qui les considère comme un tic à supprimer sans exception. Le site
  en a sur une douzaine de sections : les retirer une par une créerait une
  incohérence pire que le défaut. **Chantier transverse, à décider en bloc.**
- **Publier le premier article** : `components/sections/Content.tsx` rend une
  grille complète mais retourne `null` tant que le tableau `ARTICLES` est vide.
  La table `posts` existe désormais pour l'alimenter.
- **Faire converger À propos et FAQ sur `PageShell`** — elles portent encore
  leur propre charpente, identique à celle du composant.
- **Statuer sur la longueur de la landing** : ~35 écrans sur mobile après la
  réduction des actes. Les leviers restants sont le nombre de sections, pas la
  course de scroll.
- Audit Lighthouse sur `/fr` et `/en` (LCP, CLS, INP)
- CI/CD GitHub → Vercel automatique
- Contenu réel pour les stats SocialProof, témoignages, articles (dès que vérifié)
- Vidéo showpiece « La Transformation » si les crédits Higgsfield le permettent
- Remplacer `equipe.webp` par une vraie photo d'équipe
- Statuer sur la longueur de page (~21 000 px)
- Review EN par un locuteur natif — **la FAQ et la page À propos ajoutent
  ~1 800 mots d'anglais non relu**
