# RAPIA — Handoff de session

> À lire en premier au début de chaque session (voir CLAUDE.md).
> Dernière mise à jour : 2026-08-02

## État actuel

Site web de **RAPIA** (agence IA en RDC) — MVP fonctionnel, déployé en production, design premium appliqué, une page immersive additionnelle en place.

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

## Design system

- **Nom :** "Kinshasa Modern" — documenté dans [`DESIGN.md`](../DESIGN.md)
- **Police :** Space Grotesk exclusivement (ne jamais la remplacer, même si un composant tiers en suggère une autre)
- **Palette :** Deep Profond `#021E2D` (autorité), Indigo `#5E53A4` (interactions/CTA), Amber `#B87500` (conversion), Emerald `#10B881` (succès)
- **Tokens CSS :** `app/globals.css` (`:root` + `@theme inline`) — source de vérité pour les couleurs, spacing (échelle 8px), radius, ombres
- **Composants UI :** `components/ui/` (Button, Card, Badge, Input, SectionHeading, CTABanner, story-scroll)

## Contexte produit

Voir [`PRODUCT.md`](../PRODUCT.md) (créé via `/impeccable init`) pour : personas (4 publics à égalité — entreprises, ONG, institutions, professionnels), positionnement, principes produit, contraintes.

**Règle critique à ne jamais enfreindre :** aucune preuve sociale n'est disponible (témoignages, stats, logos clients). Les sections `SocialProof` et `Content` sont **volontairement masquées** (`return null` conditionné par `placeholder: true` dans `lib/constants.ts`) tant que du vrai contenu n'existe pas. Ne jamais réactiver avec du contenu inventé.

## Pages existantes

| Route | Contenu |
|-------|---------|
| `/` | Landing page (Hero, ProblemLevels, Services, Process, UseCases, Academy, WhyRapia, Technologies, ForWhom, FinalCTA — SocialProof et Content masqués) |
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

## Prochaines pistes possibles (non commencées)

- Re-lancer `/impeccable critique` sur le design premium pour valider les contrastes du thème dark
- Vraies photos/illustrations pour le Hero (actuellement logo mark SVG uniquement)
- Contenu réel pour RAPIA Academy, articles, témoignages (dès qu'ils existent → réactiver `SocialProof`/`Content`)
- CI/CD GitHub → Vercel automatique (actuellement déploiement manuel via CLI)
- Domaine `rapia.cd` mentionné dans `SITE.url` (constants.ts) mais le site tourne sur `ia.rapyogo.com` — clarifier avec l'utilisateur si `rapia.cd` doit être acheté/pointé
