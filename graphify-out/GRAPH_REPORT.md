# Graph Report - .  (2026-08-06)

## Corpus Check
- 59 files · ~348,315 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 673 nodes · 781 edges · 62 communities (56 shown, 6 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 8 edges (avg confidence: 0.84)
- Token cost: 113,667 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Page contact et layout global|Page contact et layout global]]
- [[_COMMUNITY_API contact et securite email|API contact et securite email]]
- [[_COMMUNITY_Copy contact (EN)|Copy contact (EN)]]
- [[_COMMUNITY_Copy contact (FR)|Copy contact (FR)]]
- [[_COMMUNITY_Recit 5 actes (EN)|Recit 5 actes (EN)]]
- [[_COMMUNITY_Recit 5 actes (FR)|Recit 5 actes (FR)]]
- [[_COMMUNITY_Dependances du projet|Dependances du projet]]
- [[_COMMUNITY_Page Notre Vision (EN)|Page Notre Vision (EN)]]
- [[_COMMUNITY_Page Notre Vision (FR)|Page Notre Vision (FR)]]
- [[_COMMUNITY_Configuration TypeScript|Configuration TypeScript]]
- [[_COMMUNITY_Design system et critique produit|Design system et critique produit]]
- [[_COMMUNITY_Navigation (EN)|Navigation (EN)]]
- [[_COMMUNITY_Navigation (FR)|Navigation (FR)]]
- [[_COMMUNITY_Sections de la landing page|Sections de la landing page]]
- [[_COMMUNITY_Hero (EN)|Hero (EN)]]
- [[_COMMUNITY_Preuves sociales (EN)|Preuves sociales (EN)]]
- [[_COMMUNITY_Hero (FR)|Hero (FR)]]
- [[_COMMUNITY_Preuves sociales (FR)|Preuves sociales (FR)]]
- [[_COMMUNITY_Scroll storytelling GSAP|Scroll storytelling GSAP]]
- [[_COMMUNITY_Les 3 niveaux d'IA (EN)|Les 3 niveaux d'IA (EN)]]
- [[_COMMUNITY_Les 3 niveaux d'IA (FR)|Les 3 niveaux d'IA (FR)]]
- [[_COMMUNITY_Routage i18n et SEO|Routage i18n et SEO]]
- [[_COMMUNITY_Methode de travail (EN)|Methode de travail (EN)]]
- [[_COMMUNITY_Cas d'usage (EN)|Cas d'usage (EN)]]
- [[_COMMUNITY_Cas d'usage (FR)|Cas d'usage (FR)]]
- [[_COMMUNITY_Composant Services|Composant Services]]
- [[_COMMUNITY_Layout de locale et scroll fluide|Layout de locale et scroll fluide]]
- [[_COMMUNITY_Composant Pour qui|Composant Pour qui]]
- [[_COMMUNITY_CTA final (EN)|CTA final (EN)]]
- [[_COMMUNITY_Identite du site (EN)|Identite du site (EN)]]
- [[_COMMUNITY_Technologies (EN)|Technologies (EN)]]
- [[_COMMUNITY_CTA final (FR)|CTA final (FR)]]
- [[_COMMUNITY_Identite du site (FR)|Identite du site (FR)]]
- [[_COMMUNITY_Technologies (FR)|Technologies (FR)]]
- [[_COMMUNITY_Composant Methode|Composant Methode]]
- [[_COMMUNITY_Academy (EN)|Academy (EN)]]
- [[_COMMUNITY_Contenu editorial (EN)|Contenu editorial (EN)]]
- [[_COMMUNITY_Pied de page (EN)|Pied de page (EN)]]
- [[_COMMUNITY_Pour qui (EN)|Pour qui (EN)]]
- [[_COMMUNITY_Services (EN)|Services (EN)]]
- [[_COMMUNITY_Pourquoi RapIA (EN)|Pourquoi RapIA (EN)]]
- [[_COMMUNITY_Academy (FR)|Academy (FR)]]
- [[_COMMUNITY_Contenu editorial (FR)|Contenu editorial (FR)]]
- [[_COMMUNITY_Pied de page (FR)|Pied de page (FR)]]
- [[_COMMUNITY_Pour qui (FR)|Pour qui (FR)]]
- [[_COMMUNITY_Methode de travail (FR)|Methode de travail (FR)]]
- [[_COMMUNITY_Services (FR)|Services (FR)]]
- [[_COMMUNITY_Pourquoi RapIA (FR)|Pourquoi RapIA (FR)]]
- [[_COMMUNITY_Composant Preuves sociales|Composant Preuves sociales]]
- [[_COMMUNITY_Composant Cas d'usage|Composant Cas d'usage]]
- [[_COMMUNITY_Composant Technologies|Composant Technologies]]
- [[_COMMUNITY_Composant Pourquoi RapIA|Composant Pourquoi RapIA]]
- [[_COMMUNITY_Reglages Claude Code|Reglages Claude Code]]
- [[_COMMUNITY_Transformation (FR)|Transformation (FR)]]
- [[_COMMUNITY_Configuration Next.js|Configuration Next.js]]
- [[_COMMUNITY_Layout Notre Vision|Layout Notre Vision]]
- [[_COMMUNITY_Configuration ESLint|Configuration ESLint]]
- [[_COMMUNITY_Configuration PostCSS|Configuration PostCSS]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 22 edges
2. `vision` - 21 edges
3. `vision` - 21 edges
4. `contact` - 19 edges
5. `contact` - 19 edges
6. `compilerOptions` - 16 edges
7. `docs/HANDOFF.md — Handoff de session` - 16 edges
8. `nav` - 12 edges
9. `nav` - 12 edges
10. `hero` - 11 edges

## Surprising Connections (you probably didn't know these)
- `Design Health Score — 24/32 (méthode dual-agent)` --semantically_similar_to--> `SECURITY_rules.md — Règles de sécurité obligatoires`  [INFERRED] [semantically similar]
  .impeccable/critique/2026-08-02T16-16-29Z__app-page-tsx.md → SECURITY_rules.md
- `Plan d'implémentation — module email Brevo & formulaire contact` --references--> `sendEmail()`  [EXTRACTED]
  docs/superpowers/plans/2026-08-05-email-contact-form.md → lib/email.ts
- `README.md — Documentation technique RapIA` --references--> `sendEmail()`  [EXTRACTED]
  README.md → lib/email.ts
- `Plan d'implémentation — module email Brevo & formulaire contact` --references--> `sendContactNotification()`  [EXTRACTED]
  docs/superpowers/plans/2026-08-05-email-contact-form.md → lib/email.ts
- `README.md — Documentation technique RapIA` --references--> `sendContactNotification()`  [EXTRACTED]
  README.md → lib/email.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Protections préservant le quota Brevo (300 emails/jour)** — specs_honeypot, specs_ratelimiting, docs_handoff_validatebeforeratelimit, readme_brevo_quota [INFERRED 0.85]
- **Architecture email centralisée Nodemailer + Brevo SMTP** — lib_email, lib_email_sendemail, lib_email_sendcontactnotification, lib_email_sendcontactconfirmation, lib_email_transporter_singleton [EXTRACTED 1.00]
- **Dérive de nom du design system : « Kinshasa Modern » → « Corporate Clair »** — product_kinshasamodern, design_corporate_clair, critique_2026_08_02t16_16_29z__app_page_tsx [INFERRED 0.75]

## Communities (62 total, 6 thin omitted)

### Community 0 - "Page contact et layout global"
Cohesion: 0.05
Nodes (43): FormData, FormState, initialFormData, Footer(), Header(), LanguageSwitcher(), LanguageSwitcherProps, icons (+35 more)

### Community 1 - "API contact et securite email"
Cohesion: 0.08
Nodes (42): app/api/contact/route.ts — orchestration validation → honeypot → rate limit → envoi, isRateLimited(), MAX_LENGTHS, POST(), requestCounts, validate(), Design Health Score — 24/32 (méthode dual-agent), docs/HANDOFF.md — Handoff de session (+34 more)

### Community 2 - "Copy contact (EN)"
Cohesion: 0.06
Nodes (36): contact, backHome, directEmail, email, errorBody, errors, formLabels, heading (+28 more)

### Community 3 - "Copy contact (FR)"
Cohesion: 0.06
Nodes (36): contact, backHome, directEmail, email, errorBody, errors, formLabels, heading (+28 more)

### Community 4 - "Recit 5 actes (EN)"
Cohesion: 0.06
Nodes (34): ariaLabel, line1a, line1b, line1Highlight, line2a, line2b, line3a, line3b (+26 more)

### Community 5 - "Recit 5 actes (FR)"
Cohesion: 0.06
Nodes (34): ariaLabel, line1a, line1b, line1Highlight, line2a, line2b, line3a, line3b (+26 more)

### Community 6 - "Dependances du projet"
Cohesion: 0.06
Nodes (30): dependencies, clsx, framer-motion, gsap, @gsap/react, lenis, lucide-react, next (+22 more)

### Community 7 - "Page Notre Vision (EN)"
Cohesion: 0.10
Nodes (21): vision, ariaLabel, back, levelPrefix, s1Body, s1Eyebrow, s1TitleA, s1TitleB (+13 more)

### Community 8 - "Page Notre Vision (FR)"
Cohesion: 0.10
Nodes (21): vision, ariaLabel, back, levelPrefix, s1Body, s1Eyebrow, s1TitleA, s1TitleB (+13 more)

### Community 9 - "Configuration TypeScript"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 10 - "Design system et critique produit"
Cohesion: 0.21
Nodes (12): app/page.tsx (landing page, cible de la critique), Critique impeccable — app/page.tsx (Design Health 24/32), P0 — Page contact sans titre h1, P0 — Placeholders de preuve sociale affichés en production, DESIGN.md — Design System Corporate Clair, Design system « Corporate Clair », Profondeur par aplats tonals + bordures 1px (jamais d'ombre/glow), Interdits visuels du cahier des charges (gradients, glow, robots/cerveaux/circuits) (+4 more)

### Community 11 - "Navigation (EN)"
Cohesion: 0.17
Nodes (12): nav, about, contact, cta, home, label, languageEn, languageFr (+4 more)

### Community 12 - "Navigation (FR)"
Cohesion: 0.17
Nodes (12): nav, about, contact, cta, home, label, languageEn, languageFr (+4 more)

### Community 13 - "Sections de la landing page"
Cohesion: 0.25
Nodes (5): Academy(), Content(), FinalCTA(), icons, ProblemLevels()

### Community 14 - "Hero (EN)"
Cohesion: 0.18
Nodes (11): hero, chapter2Line1, chapter2Line2, chapter2Line3, chapter3Intro, credibility, eyebrow, primaryCta (+3 more)

### Community 15 - "Preuves sociales (EN)"
Cohesion: 0.18
Nodes (11): socialProof, certificationsLabel, clientsLabel, emptyState, eyebrow, heading, partnersLabel, stats (+3 more)

### Community 16 - "Hero (FR)"
Cohesion: 0.18
Nodes (11): hero, chapter2Line1, chapter2Line2, chapter2Line3, chapter3Intro, credibility, eyebrow, primaryCta (+3 more)

### Community 17 - "Preuves sociales (FR)"
Cohesion: 0.18
Nodes (11): socialProof, certificationsLabel, clientsLabel, emptyState, eyebrow, heading, partnersLabel, stats (+3 more)

### Community 18 - "Scroll storytelling GSAP"
Cohesion: 0.25
Nodes (8): Argument, Step, childCount(), cx(), FlowArt(), FlowArtProps, FlowSection(), FlowSectionProps

### Community 19 - "Les 3 niveaux d'IA (EN)"
Cohesion: 0.20
Nodes (10): problem, eyebrow, highlight, level1, level1Desc, level2, level2Desc, level3 (+2 more)

### Community 20 - "Les 3 niveaux d'IA (FR)"
Cohesion: 0.20
Nodes (10): problem, eyebrow, highlight, level1, level1Desc, level2, level2Desc, level3 (+2 more)

### Community 21 - "Routage i18n et SEO"
Cohesion: 0.33
Nodes (3): { Link, redirect, usePathname, useRouter, getPathname }, routing, config

### Community 22 - "Methode de travail (EN)"
Cohesion: 0.25
Nodes (7): process, eyebrow, heading, steps, subtitle, transformation, scenes

### Community 23 - "Cas d'usage (EN)"
Cohesion: 0.25
Nodes (8): useCases, beforeLabel, cases, eyebrow, heading, interventionLabel, resultLabel, subtitle

### Community 24 - "Cas d'usage (FR)"
Cohesion: 0.25
Nodes (8): useCases, beforeLabel, cases, eyebrow, heading, interventionLabel, resultLabel, subtitle

### Community 25 - "Composant Services"
Cohesion: 0.25
Nodes (7): bgColors, borderColors, hrefMap, iconMap, photoMap, ServiceItem, Services()

### Community 26 - "Layout de locale et scroll fluide"
Cohesion: 0.33
Nodes (3): inter, viewport, SmoothScroll()

### Community 27 - "Composant Pour qui"
Cohesion: 0.29
Nodes (6): Audience, audienceAccents, audienceHrefs, audienceIcons, audiencePhotos, ForWhom()

### Community 28 - "CTA final (EN)"
Cohesion: 0.33
Nodes (6): finalCta, eyebrow, primaryCta, secondaryCta, text, title

### Community 29 - "Identite du site (EN)"
Cohesion: 0.33
Nodes (6): site, description, location, name, positioning, tagline

### Community 30 - "Technologies (EN)"
Cohesion: 0.33
Nodes (6): technologies, categories, eyebrow, heading, subtitle, techLine

### Community 31 - "CTA final (FR)"
Cohesion: 0.33
Nodes (6): finalCta, eyebrow, primaryCta, secondaryCta, text, title

### Community 32 - "Identite du site (FR)"
Cohesion: 0.33
Nodes (6): site, description, location, name, positioning, tagline

### Community 33 - "Technologies (FR)"
Cohesion: 0.33
Nodes (6): technologies, categories, eyebrow, heading, subtitle, techLine

### Community 34 - "Composant Methode"
Cohesion: 0.33
Nodes (5): Process(), ProcessStep, stepColors, stepIcons, stepPhotos

### Community 35 - "Academy (EN)"
Cohesion: 0.40
Nodes (5): academy, cta, formations, heading, subtitle

### Community 36 - "Contenu editorial (EN)"
Cohesion: 0.40
Nodes (5): content, categories, heading, placeholder, subtitle

### Community 37 - "Pied de page (EN)"
Cohesion: 0.40
Nodes (5): footer, aboutTitle, contactTitle, copyright, servicesTitle

### Community 38 - "Pour qui (EN)"
Cohesion: 0.40
Nodes (5): forWhom, audiences, eyebrow, heading, subtitle

### Community 39 - "Services (EN)"
Cohesion: 0.40
Nodes (5): services, eyebrow, heading, items, subtitle

### Community 40 - "Pourquoi RapIA (EN)"
Cohesion: 0.40
Nodes (5): whyRapia, arguments, eyebrow, heading, subtitle

### Community 41 - "Academy (FR)"
Cohesion: 0.40
Nodes (5): academy, cta, formations, heading, subtitle

### Community 42 - "Contenu editorial (FR)"
Cohesion: 0.40
Nodes (5): content, categories, heading, placeholder, subtitle

### Community 43 - "Pied de page (FR)"
Cohesion: 0.40
Nodes (5): footer, aboutTitle, contactTitle, copyright, servicesTitle

### Community 44 - "Pour qui (FR)"
Cohesion: 0.40
Nodes (5): forWhom, audiences, eyebrow, heading, subtitle

### Community 45 - "Methode de travail (FR)"
Cohesion: 0.40
Nodes (5): process, eyebrow, heading, steps, subtitle

### Community 46 - "Services (FR)"
Cohesion: 0.40
Nodes (5): services, eyebrow, heading, items, subtitle

### Community 47 - "Pourquoi RapIA (FR)"
Cohesion: 0.40
Nodes (5): whyRapia, arguments, eyebrow, heading, subtitle

### Community 48 - "Composant Preuves sociales"
Cohesion: 0.40
Nodes (3): SocialProof(), Stat, VALUES

### Community 49 - "Composant Cas d'usage"
Cohesion: 0.40
Nodes (4): photos, sectorAccents, UseCase, UseCases()

### Community 50 - "Composant Technologies"
Cohesion: 0.50
Nodes (3): catIcons, TechCategory, Technologies()

### Community 51 - "Composant Pourquoi RapIA"
Cohesion: 0.50
Nodes (3): argIcons, WhyArgument, WhyRapia()

## Ambiguous Edges - Review These
- `Design system « Corporate Clair »` → `« Kinshasa Modern » — nom de design system cité dans PRODUCT.md`  [AMBIGUOUS]
  PRODUCT.md · relation: references

## Knowledge Gaps
- **466 isolated node(s):** `allow`, `FormState`, `FormData`, `initialFormData`, `inter` (+461 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `Design system « Corporate Clair »` and `« Kinshasa Modern » — nom de design system cité dans PRODUCT.md`?**
  _Edge tagged AMBIGUOUS (relation: references) - confidence is low._
- **Why does `contact` connect `Copy contact (EN)` to `Methode de travail (EN)`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **Why does `contact` connect `Copy contact (FR)` to `Transformation (FR)`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **Why does `storyFlow` connect `Recit 5 actes (EN)` to `Methode de travail (EN)`?**
  _High betweenness centrality (0.026) - this node is a cross-community bridge._
- **What connects `allow`, `FormState`, `FormData` to the rest of the system?**
  _471 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Page contact et layout global` be split into smaller, more focused modules?**
  _Cohesion score 0.05407925407925408 - nodes in this community are weakly interconnected._
- **Should `API contact et securite email` be split into smaller, more focused modules?**
  _Cohesion score 0.07678075855689177 - nodes in this community are weakly interconnected._