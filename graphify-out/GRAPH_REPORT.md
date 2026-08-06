# Graph Report - .  (2026-08-06)

## Corpus Check
- 14 files · ~352,878 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 729 nodes · 836 edges · 60 communities (55 shown, 5 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 9 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Sections de la landing|Sections de la landing]]
- [[_COMMUNITY_En-tête et utilitaires|En-tête et utilitaires]]
- [[_COMMUNITY_Copy du formulaire de contact|Copy du formulaire de contact]]
- [[_COMMUNITY_Copy du formulaire de contact|Copy du formulaire de contact]]
- [[_COMMUNITY_Copy de la séquence héro|Copy de la séquence héro]]
- [[_COMMUNITY_Copy de la séquence héro|Copy de la séquence héro]]
- [[_COMMUNITY_Dépendances du projet|Dépendances du projet]]
- [[_COMMUNITY_Décisions design et route contact|Décisions design et route contact]]
- [[_COMMUNITY_Footer et coordonnées légales|Footer et coordonnées légales]]
- [[_COMMUNITY_Copy page Notre Vision|Copy page Notre Vision]]
- [[_COMMUNITY_Copy page Notre Vision|Copy page Notre Vision]]
- [[_COMMUNITY_Configuration TypeScript|Configuration TypeScript]]
- [[_COMMUNITY_États vides et preuves|États vides et preuves]]
- [[_COMMUNITY_Page contact et primitives UI|Page contact et primitives UI]]
- [[_COMMUNITY_Cartes, badges et ressources|Cartes, badges et ressources]]
- [[_COMMUNITY_Copy du footer|Copy du footer]]
- [[_COMMUNITY_Copy de navigation|Copy de navigation]]
- [[_COMMUNITY_Copy des preuves|Copy des preuves]]
- [[_COMMUNITY_Copy du footer|Copy du footer]]
- [[_COMMUNITY_Copy de navigation|Copy de navigation]]
- [[_COMMUNITY_Copy du héros|Copy du héros]]
- [[_COMMUNITY_Copy du héros|Copy du héros]]
- [[_COMMUNITY_Copy des preuves|Copy des preuves]]
- [[_COMMUNITY_Page Notre Vision|Page Notre Vision]]
- [[_COMMUNITY_Copy des niveaux de maturité|Copy des niveaux de maturité]]
- [[_COMMUNITY_Copy des niveaux de maturité|Copy des niveaux de maturité]]
- [[_COMMUNITY_Routage et internationalisation|Routage et internationalisation]]
- [[_COMMUNITY_Identité de marque|Identité de marque]]
- [[_COMMUNITY_Copy des cas d'usage|Copy des cas d'usage]]
- [[_COMMUNITY_Copy Academy et transformation|Copy Academy et transformation]]
- [[_COMMUNITY_Copy des cas d'usage|Copy des cas d'usage]]
- [[_COMMUNITY_Règles de preuve et d'accent|Règles de preuve et d'accent]]
- [[_COMMUNITY_Layout de locale et scroll fluide|Layout de locale et scroll fluide]]
- [[_COMMUNITY_Copy des ressources|Copy des ressources]]
- [[_COMMUNITY_Copy des ressources|Copy des ressources]]
- [[_COMMUNITY_Route API contact|Route API contact]]
- [[_COMMUNITY_Copy de l'appel final|Copy de l'appel final]]
- [[_COMMUNITY_Copy des technologies|Copy des technologies]]
- [[_COMMUNITY_Copy de l'appel final|Copy de l'appel final]]
- [[_COMMUNITY_Copy des technologies|Copy des technologies]]
- [[_COMMUNITY_Copy Academy|Copy Academy]]
- [[_COMMUNITY_Copy des publics visés|Copy des publics visés]]
- [[_COMMUNITY_Copy de la méthode|Copy de la méthode]]
- [[_COMMUNITY_Copy des services|Copy des services]]
- [[_COMMUNITY_Copy de la différenciation|Copy de la différenciation]]
- [[_COMMUNITY_Copy des publics visés|Copy des publics visés]]
- [[_COMMUNITY_Copy de la méthode|Copy de la méthode]]
- [[_COMMUNITY_Copy des services|Copy des services]]
- [[_COMMUNITY_Identité de marque|Identité de marque]]
- [[_COMMUNITY_Copy de la différenciation|Copy de la différenciation]]
- [[_COMMUNITY_Composant Input|Composant Input]]
- [[_COMMUNITY_Configuration Claude Code|Configuration Claude Code]]
- [[_COMMUNITY_Configuration Next.js|Configuration Next.js]]
- [[_COMMUNITY_Layout Notre Vision|Layout Notre Vision]]
- [[_COMMUNITY_Configuration ESLint|Configuration ESLint]]
- [[_COMMUNITY_Configuration PostCSS|Configuration PostCSS]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 23 edges
2. `contact` - 22 edges
3. `contact` - 22 edges
4. `vision` - 21 edges
5. `vision` - 21 edges
6. `compilerOptions` - 16 edges
7. `nav` - 12 edges
8. `socialProof` - 12 edges
9. `footer` - 12 edges
10. `nav` - 12 edges

## Surprising Connections (you probably didn't know these)
- `Design Health Score — 24/32 (méthode dual-agent)` --semantically_similar_to--> `SECURITY_rules.md — Règles de sécurité obligatoires`  [INFERRED] [semantically similar]
  .impeccable/critique/2026-08-02T16-16-29Z__app-page-tsx.md → SECURITY_rules.md
- `Aucune preuve sociale inventée` --rationale_for--> `ARTICLES`  [EXTRACTED]
  docs/HANDOFF.md → components/sections/Content.tsx
- `Aucune preuve sociale inventée` --rationale_for--> `VALUES`  [EXTRACTED]
  docs/HANDOFF.md → components/sections/SocialProof.tsx
- `Bibliothèque UI sans dépendance externe` --rationale_for--> `Badge()`  [EXTRACTED]
  docs/HANDOFF.md → components/ui/Badge.tsx
- `Bibliothèque UI sans dépendance externe` --rationale_for--> `Empty()`  [EXTRACTED]
  docs/HANDOFF.md → components/ui/Empty.tsx

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Protections préservant le quota Brevo (300 emails/jour)** — specs_honeypot, specs_ratelimiting, docs_handoff_validatebeforeratelimit, readme_brevo_quota [INFERRED 0.85]
- **Architecture email centralisée Nodemailer + Brevo SMTP** — lib_email, lib_email_sendemail, lib_email_sendcontactnotification, lib_email_sendcontactconfirmation, lib_email_transporter_singleton [EXTRACTED 1.00]
- **Dérive de nom du design system : « Kinshasa Modern » → « Corporate Clair »** — product_kinshasamodern, design_corporate_clair, critique_2026_08_02t16_16_29z__app_page_tsx [INFERRED 0.75]
- **Primitives UI Corporate Clair** — ui_badge_badge, ui_empty_empty, ui_choicechips_choicechips, ui_card_card, ui_input_input [EXTRACTED 1.00]
- **Coordonnées partagées entre le site et les emails** — lib_company_company, lib_company_legalline, layout_footer_footer, lib_email_footer_text [EXTRACTED 1.00]

## Communities (60 total, 5 thin omitted)

### Community 0 - "Sections de la landing"
Cohesion: 0.05
Nodes (35): icons, MobileNav(), Academy(), FinalCTA(), Audience, audienceAccents, audienceHrefs, audienceIcons (+27 more)

### Community 1 - "En-tête et utilitaires"
Cohesion: 0.08
Nodes (28): Header(), LanguageSwitcher(), LanguageSwitcherProps, cn(), Chapter(), CTAButton(), Chapter, StoryActProps (+20 more)

### Community 2 - "Copy du formulaire de contact"
Cohesion: 0.05
Nodes (41): Adresse de contact à unifier (décision ouverte), contact, backHome, directEmail, email, errorBody, errorRateLimit, errors (+33 more)

### Community 3 - "Copy du formulaire de contact"
Cohesion: 0.05
Nodes (38): contact, backHome, directEmail, errorBody, errorRateLimit, errors, errorValidation, formLabels (+30 more)

### Community 4 - "Copy de la séquence héro"
Cohesion: 0.06
Nodes (34): ariaLabel, line1a, line1b, line1Highlight, line2a, line2b, line3a, line3b (+26 more)

### Community 5 - "Copy de la séquence héro"
Cohesion: 0.06
Nodes (34): ariaLabel, line1a, line1b, line1Highlight, line2a, line2b, line3a, line3b (+26 more)

### Community 6 - "Dépendances du projet"
Cohesion: 0.06
Nodes (30): dependencies, clsx, framer-motion, gsap, @gsap/react, lenis, lucide-react, next (+22 more)

### Community 7 - "Décisions design et route contact"
Cohesion: 0.10
Nodes (28): app/api/contact/route.ts — orchestration validation → honeypot → rate limit → envoi, app/page.tsx (landing page, cible de la critique), Critique impeccable — app/page.tsx (Design Health 24/32), P0 — Page contact sans titre h1, Design Health Score — 24/32 (méthode dual-agent), P0 — Placeholders de preuve sociale affichés en production, DESIGN.md — Design System Corporate Clair, Design system « Corporate Clair » (+20 more)

### Community 8 - "Footer et coordonnées légales"
Cohesion: 0.12
Nodes (19): Plancher de contraste WCAG AA sur fond sombre, Tailwind v4 rend les couleurs en oklab, Source unique des coordonnées légales, Footer(), SERVICE_ANCHORS, COMPANY, legalLine(), BRAND (+11 more)

### Community 9 - "Copy page Notre Vision"
Cohesion: 0.10
Nodes (21): vision, ariaLabel, back, levelPrefix, s1Body, s1Eyebrow, s1TitleA, s1TitleB (+13 more)

### Community 10 - "Copy page Notre Vision"
Cohesion: 0.10
Nodes (21): vision, ariaLabel, back, levelPrefix, s1Body, s1Eyebrow, s1TitleA, s1TitleB (+13 more)

### Community 11 - "Configuration TypeScript"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 12 - "États vides et preuves"
Cohesion: 0.19
Nodes (11): Un état vide nomme ce qui manque, Content(), Proof, PROOF_ICONS, Stat, DivProps, Empty(), EmptyDescription() (+3 more)

### Community 13 - "Page contact et primitives UI"
Cohesion: 0.18
Nodes (11): ErrorKind, FIELD_ORDER, FormData, FormState, initialFormData, MAX, Bibliothèque UI sans dépendance externe, Card() (+3 more)

### Community 14 - "Cartes, badges et ressources"
Cohesion: 0.18
Nodes (9): Article, Badge(), BadgeProps, Tone, CardBody(), CardHeader(), CardProps, Padding (+1 more)

### Community 15 - "Copy du footer"
Cohesion: 0.17
Nodes (12): footer, aboutTitle, contactTitle, copyright, emailLabel, headquarters, officesTitle, phoneLabel (+4 more)

### Community 16 - "Copy de navigation"
Cohesion: 0.17
Nodes (12): nav, about, contact, cta, home, label, languageEn, languageFr (+4 more)

### Community 17 - "Copy des preuves"
Cohesion: 0.17
Nodes (12): socialProof, ctaBody, ctaLabel, ctaTitle, emptyState, eyebrow, heading, intro (+4 more)

### Community 18 - "Copy du footer"
Cohesion: 0.17
Nodes (12): footer, aboutTitle, contactTitle, copyright, emailLabel, headquarters, officesTitle, phoneLabel (+4 more)

### Community 19 - "Copy de navigation"
Cohesion: 0.17
Nodes (12): nav, about, contact, cta, home, label, languageEn, languageFr (+4 more)

### Community 20 - "Copy du héros"
Cohesion: 0.18
Nodes (11): hero, chapter2Line1, chapter2Line2, chapter2Line3, chapter3Intro, credibility, eyebrow, primaryCta (+3 more)

### Community 21 - "Copy du héros"
Cohesion: 0.18
Nodes (11): hero, chapter2Line1, chapter2Line2, chapter2Line3, chapter3Intro, credibility, eyebrow, primaryCta (+3 more)

### Community 22 - "Copy des preuves"
Cohesion: 0.18
Nodes (11): socialProof, ctaBody, ctaLabel, ctaTitle, emptyState, eyebrow, intro, pending (+3 more)

### Community 23 - "Page Notre Vision"
Cohesion: 0.25
Nodes (8): Argument, Step, childCount(), cx(), FlowArt(), FlowArtProps, FlowSection(), FlowSectionProps

### Community 24 - "Copy des niveaux de maturité"
Cohesion: 0.20
Nodes (10): problem, eyebrow, highlight, level1, level1Desc, level2, level2Desc, level3 (+2 more)

### Community 25 - "Copy des niveaux de maturité"
Cohesion: 0.20
Nodes (10): problem, eyebrow, highlight, level1, level1Desc, level2, level2Desc, level3 (+2 more)

### Community 26 - "Routage et internationalisation"
Cohesion: 0.33
Nodes (3): { Link, redirect, usePathname, useRouter, getPathname }, routing, config

### Community 27 - "Identité de marque"
Cohesion: 0.25
Nodes (7): site, description, name, positioning, tagline, transformation, scenes

### Community 28 - "Copy des cas d'usage"
Cohesion: 0.25
Nodes (8): useCases, beforeLabel, cases, eyebrow, heading, interventionLabel, resultLabel, subtitle

### Community 29 - "Copy Academy et transformation"
Cohesion: 0.25
Nodes (7): academy, cta, formations, heading, subtitle, transformation, scenes

### Community 30 - "Copy des cas d'usage"
Cohesion: 0.25
Nodes (8): useCases, beforeLabel, cases, eyebrow, heading, interventionLabel, resultLabel, subtitle

### Community 31 - "Règles de preuve et d'accent"
Cohesion: 0.29
Nodes (7): Encres d'accent réservées au texte, Aucune preuve sociale inventée, heading, ARTICLES, SocialProof(), VALUES, toneStyles

### Community 32 - "Layout de locale et scroll fluide"
Cohesion: 0.33
Nodes (3): inter, viewport, SmoothScroll()

### Community 33 - "Copy des ressources"
Cohesion: 0.29
Nodes (7): content, categories, heading, placeholder, readingTime, readMore, subtitle

### Community 34 - "Copy des ressources"
Cohesion: 0.29
Nodes (7): content, categories, heading, placeholder, readingTime, readMore, subtitle

### Community 35 - "Route API contact"
Cohesion: 0.47
Nodes (5): isRateLimited(), MAX_LENGTHS, POST(), requestCounts, validate()

### Community 36 - "Copy de l'appel final"
Cohesion: 0.33
Nodes (6): finalCta, eyebrow, primaryCta, secondaryCta, text, title

### Community 37 - "Copy des technologies"
Cohesion: 0.33
Nodes (6): technologies, categories, eyebrow, heading, subtitle, techLine

### Community 38 - "Copy de l'appel final"
Cohesion: 0.33
Nodes (6): finalCta, eyebrow, primaryCta, secondaryCta, text, title

### Community 39 - "Copy des technologies"
Cohesion: 0.33
Nodes (6): technologies, categories, eyebrow, heading, subtitle, techLine

### Community 40 - "Copy Academy"
Cohesion: 0.40
Nodes (5): academy, cta, formations, heading, subtitle

### Community 41 - "Copy des publics visés"
Cohesion: 0.40
Nodes (5): forWhom, audiences, eyebrow, heading, subtitle

### Community 42 - "Copy de la méthode"
Cohesion: 0.40
Nodes (5): process, eyebrow, heading, steps, subtitle

### Community 43 - "Copy des services"
Cohesion: 0.40
Nodes (5): services, eyebrow, heading, items, subtitle

### Community 44 - "Copy de la différenciation"
Cohesion: 0.40
Nodes (5): whyRapia, arguments, eyebrow, heading, subtitle

### Community 45 - "Copy des publics visés"
Cohesion: 0.40
Nodes (5): forWhom, audiences, eyebrow, heading, subtitle

### Community 46 - "Copy de la méthode"
Cohesion: 0.40
Nodes (5): process, eyebrow, heading, steps, subtitle

### Community 47 - "Copy des services"
Cohesion: 0.40
Nodes (5): services, eyebrow, heading, items, subtitle

### Community 48 - "Identité de marque"
Cohesion: 0.40
Nodes (5): site, description, name, positioning, tagline

### Community 49 - "Copy de la différenciation"
Cohesion: 0.40
Nodes (5): whyRapia, arguments, eyebrow, heading, subtitle

### Community 50 - "Composant Input"
Cohesion: 0.40
Nodes (4): InputAsInput, InputAsTextarea, InputBaseProps, InputProps

## Ambiguous Edges - Review These
- `Design system « Corporate Clair »` → `« Kinshasa Modern » — nom de design system cité dans PRODUCT.md`  [AMBIGUOUS]
  PRODUCT.md · relation: references

## Knowledge Gaps
- **494 isolated node(s):** `allow`, `inter`, `viewport`, `metadata`, `Step` (+489 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `Design system « Corporate Clair »` and `« Kinshasa Modern » — nom de design system cité dans PRODUCT.md`?**
  _Edge tagged AMBIGUOUS (relation: references) - confidence is low._
- **Why does `Adresse de contact à unifier (décision ouverte)` connect `Copy du formulaire de contact` to `Footer et coordonnées légales`?**
  _High betweenness centrality (0.375) - this node is a cross-community bridge._
- **Why does `contact` connect `Copy du formulaire de contact` to `Identité de marque`?**
  _High betweenness centrality (0.338) - this node is a cross-community bridge._
- **What connects `allow`, `inter`, `viewport` to the rest of the system?**
  _499 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Sections de la landing` be split into smaller, more focused modules?**
  _Cohesion score 0.05180388529139685 - nodes in this community are weakly interconnected._
- **Should `En-tête et utilitaires` be split into smaller, more focused modules?**
  _Cohesion score 0.08080808080808081 - nodes in this community are weakly interconnected._
- **Should `Copy du formulaire de contact` be split into smaller, more focused modules?**
  _Cohesion score 0.04878048780487805 - nodes in this community are weakly interconnected._