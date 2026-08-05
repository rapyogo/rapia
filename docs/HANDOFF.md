# RAPIA — Handoff de session

> À lire en premier au début de chaque session (voir CLAUDE.md).
> Dernière mise à jour : 2026-08-06 (fin de session — module email Brevo)

## État actuel

Site web de **RAPIA** (agence IA en RDC) — bilingue FR/EN, design Corporate Clair,
déployé en production sur [`https://ia.rapyogo.com`](https://ia.rapyogo.com).

**Le formulaire de contact est opérationnel** : il envoie réellement des emails
via Brevo SMTP, testé de bout en bout en production (voir « Emails »).

**Ce qui tourne en production** (commit `0d1f6f0`) :
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
| `/[locale]/contact` | Formulaire contact → `/api/contact` (Brevo SMTP, honeypot, rate limiting) |
| `/[locale]/notre-vision` | Page immersive GSAP, 5 sections |
| `/sitemap.xml`, `/robots.txt` | Générés dynamiquement, bilingues |

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

Les coordonnées de l'entreprise vivent dans la constante `COMPANY` (3 implantations,
téléphone, RCCM / ID Nat / NIF) et le pied de page texte `FOOTER_TEXT` en **dérive** :
une adresse se change à un seul endroit.

### Sécurité du formulaire

| Protection | Détail |
|------------|--------|
| Honeypot | Champ `_website` caché. Si rempli → `200 success` silencieux, **avant** tout envoi : le bot croit avoir réussi, le quota Brevo est préservé |
| Rate limiting | 1 soumission / 60 s par IP, **appliqué après la validation** — sinon une faute de frappe bloquait le visiteur une minute pour rien |
| Validation | Champs requis + longueurs max, échappement HTML de toute donnée injectée dans les emails |
| Erreurs | Les détails SMTP restent dans les logs serveur ; le client ne reçoit qu'un message générique |

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
- **Unifier l'adresse de contact.** Le site affiche `contact@rapyogo.com`
  (`messages/fr.json` et `en.json`, clé `contact.email`) alors que les emails
  partent de `ia@rapyogo.com`. Décider laquelle fait foi.
- Implémenter les stubs quand le besoin arrive : inscriptions formations,
  demandes de devis, newsletter.

### Reste

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
