# Graph Report - .  (2026-08-07)

## Corpus Check
- 37 files · ~372,733 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 792 nodes · 1284 edges · 43 communities (38 shown, 5 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 17 edges (avg confidence: 0.83)
- Token cost: 74,000 input · 3,059 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Pages de contenu et signalisation SEO|Pages de contenu et signalisation SEO]]
- [[_COMMUNITY_Formulaire de contact cote client|Formulaire de contact cote client]]
- [[_COMMUNITY_Memoire du projet — decisions et pieges|Memoire du projet — decisions et pieges]]
- [[_COMMUNITY_Routage i18n et bascule de langue|Routage i18n et bascule de langue]]
- [[_COMMUNITY_Copie anglaise du recit en actes|Copie anglaise du recit en actes]]
- [[_COMMUNITY_Dependances et outillage du projet|Dependances et outillage du projet]]
- [[_COMMUNITY_Copie anglaise du formulaire|Copie anglaise du formulaire]]
- [[_COMMUNITY_Copie francaise du formulaire|Copie francaise du formulaire]]
- [[_COMMUNITY_Landing page et design system|Landing page et design system]]
- [[_COMMUNITY_Copie anglaise — Academy et articles|Copie anglaise — Academy et articles]]
- [[_COMMUNITY_Copie anglaise — FAQ et Services|Copie anglaise — FAQ et Services]]
- [[_COMMUNITY_Copie francaise — Academy et articles|Copie francaise — Academy et articles]]
- [[_COMMUNITY_Copie francaise — FAQ et Services|Copie francaise — FAQ et Services]]
- [[_COMMUNITY_Coordonnees et envoi des emails|Coordonnees et envoi des emails]]
- [[_COMMUNITY_Copie anglaise — page A propos|Copie anglaise — page A propos]]
- [[_COMMUNITY_Copie francaise — page A propos|Copie francaise — page A propos]]
- [[_COMMUNITY_Configuration TypeScript|Configuration TypeScript]]
- [[_COMMUNITY_Copie francaise — page Vision|Copie francaise — page Vision]]
- [[_COMMUNITY_Copie francaise du recit en actes|Copie francaise du recit en actes]]
- [[_COMMUNITY_Copie anglaise du pied de page|Copie anglaise du pied de page]]
- [[_COMMUNITY_Copie francaise du pied de page|Copie francaise du pied de page]]
- [[_COMMUNITY_Copie francaise — hero et CTA final|Copie francaise — hero et CTA final]]
- [[_COMMUNITY_Page Vision et moteur de scroll|Page Vision et moteur de scroll]]
- [[_COMMUNITY_Copie anglaise — hero et CTA final|Copie anglaise — hero et CTA final]]
- [[_COMMUNITY_Copie anglaise de la navigation|Copie anglaise de la navigation]]
- [[_COMMUNITY_Copie francaise de la navigation|Copie francaise de la navigation]]
- [[_COMMUNITY_Copie anglaise — 3 niveaux de maturite|Copie anglaise — 3 niveaux de maturite]]
- [[_COMMUNITY_Copie francaise — 3 niveaux de maturite|Copie francaise — 3 niveaux de maturite]]
- [[_COMMUNITY_Section Services de la landing|Section Services de la landing]]
- [[_COMMUNITY_Migrations de base de donnees|Migrations de base de donnees]]
- [[_COMMUNITY_Section Pour qui|Section Pour qui]]
- [[_COMMUNITY_API de contact et anti-abus|API de contact et anti-abus]]
- [[_COMMUNITY_Section Methode|Section Methode]]
- [[_COMMUNITY_Section Cas d usage|Section Cas d usage]]
- [[_COMMUNITY_Image de partage generee|Image de partage generee]]
- [[_COMMUNITY_robots.txt et crawlers IA|robots.txt et crawlers IA]]
- [[_COMMUNITY_Reglages Claude Code|Reglages Claude Code]]
- [[_COMMUNITY_Client base de donnees Neon|Client base de donnees Neon]]
- [[_COMMUNITY_Configuration Next.js|Configuration Next.js]]
- [[_COMMUNITY_Configuration PostCSS|Configuration PostCSS]]

## God Nodes (most connected - your core abstractions)
1. `about` - 30 edges
2. `about` - 30 edges
3. `contact` - 25 edges
4. `contact` - 25 edges
5. `siteUrl()` - 25 edges
6. `vision` - 23 edges
7. `vision` - 23 edges
8. `cn()` - 21 edges
9. `footer` - 18 edges
10. `footer` - 18 edges

## Surprising Connections (you probably didn't know these)
- `Design Health Score — 24/32 (méthode dual-agent)` --semantically_similar_to--> `SECURITY_rules.md — Règles de sécurité obligatoires`  [INFERRED] [semantically similar]
  .impeccable/critique/2026-08-02T16-16-29Z__app-page-tsx.md → SECURITY_rules.md
- `Plancher de contraste WCAG AA sur fond sombre` --rationale_for--> `Footer()`  [EXTRACTED]
  docs/HANDOFF.md → components/layout/Footer.tsx
- `Source unique des coordonnées légales` --rationale_for--> `Footer()`  [EXTRACTED]
  docs/HANDOFF.md → components/layout/Footer.tsx
- `Aucune preuve sociale inventée` --rationale_for--> `ARTICLES`  [EXTRACTED]
  docs/HANDOFF.md → components/sections/Content.tsx
- `Aucune preuve sociale inventée` --rationale_for--> `VALUES`  [EXTRACTED]
  docs/HANDOFF.md → components/sections/SocialProof.tsx

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Sources uniques de vérité du projet** — docs_handoff_lib_site, docs_handoff_lib_company, docs_handoff_globals_css_tokens, docs_handoff_bilinguisme_fr_en [INFERRED 0.85]
- **Chaîne de narration au scroll (canvas, GSAP, Lenis)** — docs_handoff_recit_5_actes, docs_handoff_scroll_sequence, docs_handoff_parallaxe_multi_couches, docs_handoff_lenis_smooth_scroll, docs_handoff_etat_initial_chapitres_css, docs_handoff_problemlevels [EXTRACTED 1.00]
- **Chaîne d'envoi email Brevo (formulaire → SMTP → délivrabilité)** — docs_handoff_module_email, docs_handoff_email_layout, docs_handoff_securite_formulaire, docs_handoff_quota_brevo, docs_handoff_authentification_domaine, docs_handoff_lib_company [EXTRACTED 1.00]

## Communities (43 total, 5 thin omitted)

### Community 0 - "Pages de contenu et signalisation SEO"
Cohesion: 0.06
Nodes (69): AboutPage(), Credential, generateMetadata(), GroupService, Recognition, ContactLayout(), generateMetadata(), FaqItem (+61 more)

### Community 1 - "Formulaire de contact cote client"
Cohesion: 0.06
Nodes (38): ErrorKind, FIELD_ORDER, FormData, FormState, initialFormData, MAX, Bibliothèque UI sans dépendance externe, Un état vide nomme ce qui manque (+30 more)

### Community 2 - "Memoire du projet — decisions et pieges"
Cohesion: 0.05
Nodes (50): Unifier l'adresse de contact (contact@ vs ia@), Audit GEO / visibilité IA (score 43/100), Authentification par lien magique (pas de mot de passe), Authentification DNS du domaine (SPF, DKIM, DMARC), Barre de défilement masquée (compromis assumé), Base Neon — schéma de l'espace client (13 tables), Bibliothèque de composants UI (components/ui), Bilinguisme FR/EN (next-intl, messages/*.json) (+42 more)

### Community 3 - "Routage i18n et bascule de langue"
Cohesion: 0.06
Nodes (28): { Link, redirect, usePathname, useRouter, getPathname }, routing, LanguageSwitcher(), LanguageSwitcherProps, cn(), config, Chapter(), CTAButton() (+20 more)

### Community 4 - "Copie anglaise du recit en actes"
Cohesion: 0.08
Nodes (37): ariaLabel, line1a, line1b, line1Highlight, line2a, line2b, line3a, line3b (+29 more)

### Community 5 - "Dependances et outillage du projet"
Cohesion: 0.06
Nodes (31): dependencies, clsx, framer-motion, gsap, @gsap/react, lenis, lucide-react, @neondatabase/serverless (+23 more)

### Community 6 - "Copie anglaise du formulaire"
Cohesion: 0.08
Nodes (32): Adresse de contact à unifier (décision ouverte), contact, backHome, directEmail, errorBody, errorRateLimit, errors, errorValidation (+24 more)

### Community 7 - "Copie francaise du formulaire"
Cohesion: 0.09
Nodes (31): contact, backHome, directEmail, errorBody, errorRateLimit, errors, errorValidation, formLabels (+23 more)

### Community 8 - "Landing page et design system"
Cohesion: 0.10
Nodes (28): app/api/contact/route.ts — orchestration validation → honeypot → rate limit → envoi, app/page.tsx (landing page, cible de la critique), Critique impeccable — app/page.tsx (Design Health 24/32), P0 — Page contact sans titre h1, Design Health Score — 24/32 (méthode dual-agent), P0 — Placeholders de preuve sociale affichés en production, DESIGN.md — Design System Corporate Clair, Design system « Corporate Clair » (+20 more)

### Community 9 - "Copie anglaise — Academy et articles"
Cohesion: 0.12
Nodes (27): academy, formations, content, categories, placeholder, readingTime, readMore, eyebrow (+19 more)

### Community 10 - "Copie anglaise — FAQ et Services"
Cohesion: 0.11
Nodes (28): faq, back, ctaBody, ctaButton, ctaTitle, metaDescription, metaTitle, servicesPage (+20 more)

### Community 11 - "Copie francaise — Academy et articles"
Cohesion: 0.12
Nodes (27): academy, formations, content, categories, placeholder, readingTime, readMore, eyebrow (+19 more)

### Community 12 - "Copie francaise — FAQ et Services"
Cohesion: 0.11
Nodes (28): faq, back, ctaBody, ctaButton, ctaTitle, metaDescription, metaTitle, servicesPage (+20 more)

### Community 13 - "Coordonnees et envoi des emails"
Cohesion: 0.16
Nodes (14): Source unique des coordonnées légales, legalLine(), BRAND, ContactFormData, emailLayout(), escapeHtml(), FOOTER_TEXT, getTransporter() (+6 more)

### Community 14 - "Copie anglaise — page A propos"
Cohesion: 0.10
Nodes (20): about, agencyBody, agencyTitle, credentials, credentialsTitle, degreeFieldLabel, degreeLevel, founderBody (+12 more)

### Community 15 - "Copie francaise — page A propos"
Cohesion: 0.10
Nodes (20): about, agencyBody, agencyTitle, credentials, credentialsTitle, degreeFieldLabel, degreeLevel, founderBody (+12 more)

### Community 16 - "Configuration TypeScript"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 17 - "Copie francaise — page Vision"
Cohesion: 0.11
Nodes (19): vision, levelPrefix, s1Body, s1Eyebrow, s1TitleA, s1TitleB, s1TitleC, s2Eyebrow (+11 more)

### Community 18 - "Copie francaise du recit en actes"
Cohesion: 0.22
Nodes (18): ariaLabel, line1a, line1b, line1Highlight, line2a, line2b, line3a, line3b (+10 more)

### Community 19 - "Copie anglaise du pied de page"
Cohesion: 0.12
Nodes (17): footer, aboutLink, aboutTitle, contactTitle, copyright, emailLabel, faqLink, followTitle (+9 more)

### Community 20 - "Copie francaise du pied de page"
Cohesion: 0.12
Nodes (17): footer, aboutLink, aboutTitle, contactTitle, copyright, emailLabel, faqLink, followTitle (+9 more)

### Community 21 - "Copie francaise — hero et CTA final"
Cohesion: 0.22
Nodes (11): finalCta, text, hero, chapter2Line1, chapter2Line2, chapter2Line3, chapter3Intro, credibility (+3 more)

### Community 22 - "Page Vision et moteur de scroll"
Cohesion: 0.25
Nodes (8): Argument, Step, childCount(), cx(), FlowArt(), FlowArtProps, FlowSection(), FlowSectionProps

### Community 23 - "Copie anglaise — hero et CTA final"
Cohesion: 0.28
Nodes (9): finalCta, text, hero, chapter2Line1, chapter3Intro, credibility, primaryCta, secondaryCta (+1 more)

### Community 24 - "Copie anglaise de la navigation"
Cohesion: 0.22
Nodes (9): nav, home, label, languageEn, languageFr, secondaryMenu, skipToContent, switchTo (+1 more)

### Community 25 - "Copie francaise de la navigation"
Cohesion: 0.22
Nodes (9): nav, home, label, languageEn, languageFr, secondaryMenu, skipToContent, switchTo (+1 more)

### Community 26 - "Copie anglaise — 3 niveaux de maturite"
Cohesion: 0.25
Nodes (8): problem, highlight, level1, level1Desc, level2, level2Desc, level3, level3Desc

### Community 27 - "Copie francaise — 3 niveaux de maturite"
Cohesion: 0.25
Nodes (8): problem, highlight, level1, level1Desc, level2, level2Desc, level3, level3Desc

### Community 28 - "Section Services de la landing"
Cohesion: 0.25
Nodes (7): bgColors, borderColors, hrefMap, iconMap, photoMap, ServiceItem, Services()

### Community 29 - "Migrations de base de donnees"
Cohesion: 0.29
Nodes (5): applied, dir, files, root, sql

### Community 30 - "Section Pour qui"
Cohesion: 0.29
Nodes (6): Audience, audienceAccents, audienceHrefs, audienceIcons, audiencePhotos, ForWhom()

### Community 31 - "API de contact et anti-abus"
Cohesion: 0.47
Nodes (5): isRateLimited(), MAX_LENGTHS, POST(), requestCounts, validate()

### Community 32 - "Section Methode"
Cohesion: 0.33
Nodes (5): Process(), ProcessStep, stepColors, stepIcons, stepPhotos

### Community 33 - "Section Cas d usage"
Cohesion: 0.40
Nodes (4): photos, sectorAccents, UseCase, UseCases()

### Community 34 - "Image de partage generee"
Cohesion: 0.67
Nodes (3): iconDataUri(), Image(), size

## Ambiguous Edges - Review These
- `Design system « Corporate Clair »` → `« Kinshasa Modern » — nom de design system cité dans PRODUCT.md`  [AMBIGUOUS]
  PRODUCT.md · relation: references

## Knowledge Gaps
- **407 isolated node(s):** `allow`, `inter`, `viewport`, `metadata`, `Step` (+402 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `Design system « Corporate Clair »` and `« Kinshasa Modern » — nom de design system cité dans PRODUCT.md`?**
  _Edge tagged AMBIGUOUS (relation: references) - confidence is low._
- **Why does `Adresse de contact à unifier (décision ouverte)` connect `Copie anglaise du formulaire` to `Pages de contenu et signalisation SEO`, `Copie francaise du formulaire`?**
  _High betweenness centrality (0.188) - this node is a cross-community bridge._
- **Why does `contact` connect `Copie francaise du formulaire` to `Copie francaise de la navigation`, `Copie francaise — Academy et articles`, `Copie francaise — FAQ et Services`?**
  _High betweenness centrality (0.175) - this node is a cross-community bridge._
- **Why does `about` connect `Copie anglaise — page A propos` to `Copie anglaise de la navigation`, `Copie anglaise — Academy et articles`, `Copie anglaise — FAQ et Services`?**
  _High betweenness centrality (0.172) - this node is a cross-community bridge._
- **What connects `allow`, `inter`, `viewport` to the rest of the system?**
  _421 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Pages de contenu et signalisation SEO` be split into smaller, more focused modules?**
  _Cohesion score 0.06007480130902291 - nodes in this community are weakly interconnected._
- **Should `Formulaire de contact cote client` be split into smaller, more focused modules?**
  _Cohesion score 0.05568627450980392 - nodes in this community are weakly interconnected._