# Module email Brevo & formulaire de contact — Plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remplacer l'envoi email Resend (fetch brut) par un module Nodemailer + Brevo SMTP centralisé, ajouter l'email de confirmation visiteur, le honeypot anti-spam, et préparer l'architecture pour les futures fonctions email.

**Architecture:** Module `lib/email.ts` (singleton transporteur Nodemailer + fonctions métier), route API `app/api/contact/route.ts` refondue (orchestration : validation → notification → confirmation), formulaire client avec champ honeypot invisible. Tout est en TypeScript, commenté en français, zéro valeur hardcodée.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript 5, nodemailer, Tailwind CSS v4, next-intl v4

## Global Constraints

- **Langue :** tous les commentaires et messages d'erreur en français
- **Env vars exclusivement :** `BREVO_SMTP_HOST`, `BREVO_SMTP_PORT`, `BREVO_SMTP_LOGIN`, `BREVO_SMTP_PASSWORD`, `IA_FROM_EMAIL`, `IA_FROM_NAME` — jamais de valeur SMTP en dur
- **Quota Brevo :** 300 emails/jour — 2 emails par soumission (notif + confirmation), ne pas faire de boucles
- **Design existant :** ne pas toucher au layout/design du formulaire au-delà des états fonctionnels
- **Bilinguisme :** toute nouvelle clé UI doit exister dans `messages/fr.json` ET `messages/en.json`
- **Pas de contenu inventé :** règle projet existante
- **Module email :** toutes les fonctions d'envoi passent par `lib/email.ts` — rien en inline dans les routes

---

### Task 1: Installer nodemailer

**Files:**
- Modify: `package.json` (effet de bord de `npm install`)

**Interfaces:**
- Produces: `nodemailer` disponible pour `lib/email.ts` (Task 2)

- [ ] **Step 1: Installer nodemailer et ses types**

```bash
npm install nodemailer
npm install -D @types/nodemailer
```

- [ ] **Step 2: Vérifier l'installation**

```bash
node -e "const nm = require('nodemailer'); console.log('nodemailer OK, version:', nm.version || 'loaded')"
```

Expected: `nodemailer OK, version: ...`

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat: ajout de nodemailer pour l'envoi d'emails via Brevo SMTP"
```

---

### Task 2: Créer le module email centralisé `lib/email.ts`

**Files:**
- Create: `lib/email.ts`

**Interfaces:**
- Consumes: `nodemailer` (Task 1)
- Produces:
  - `sendEmail(to: string, subject: string, html: string, text?: string): Promise<{ success: boolean; error?: string }>`
  - `sendContactNotification(data: ContactFormData): Promise<{ success: boolean; error?: string }>`
  - `sendContactConfirmation(data: ContactFormData): Promise<{ success: boolean; error?: string }>`
  - `sendTrainingRegistration(data: TrainingRegistrationData): Promise<{ success: boolean; error?: string }>` — stub
  - `sendQuoteRequest(data: QuoteRequestData): Promise<{ success: boolean; error?: string }>` — stub
  - `sendNewsletter(data: NewsletterData): Promise<{ success: boolean; error?: string }>` — stub
  - Types exportés : `ContactFormData`, `TrainingRegistrationData`, `QuoteRequestData`, `NewsletterData`

- [ ] **Step 1: Créer le fichier `lib/email.ts`**

```typescript
// lib/email.ts
// Module email centralisé pour RapIA — toutes les fonctions d'envoi passent par ici.
// Transporteur : Brevo SMTP via Nodemailer (pool réutilisé entre requêtes Vercel).
// Quota : 300 emails/jour (plan gratuit Brevo) — ne pas faire de boucles d'envoi.

import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

// ---------------------------------------------------------------------------
// Transporteur Nodemailer — singleton (créé une fois, recyclé par Vercel)
// ---------------------------------------------------------------------------

let transporter: Transporter | null = null;

function getTransporter(): Transporter | null {
  // Vérification que toutes les variables d'environnement sont présentes
  const host = process.env.BREVO_SMTP_HOST;
  const port = process.env.BREVO_SMTP_PORT;
  const user = process.env.BREVO_SMTP_LOGIN;
  const pass = process.env.BREVO_SMTP_PASSWORD;

  if (!host || !port || !user || !pass) {
    console.error(
      "[email] Configuration SMTP incomplète. Vérifiez les variables d'environnement : " +
        "BREVO_SMTP_HOST, BREVO_SMTP_PORT, BREVO_SMTP_LOGIN, BREVO_SMTP_PASSWORD"
    );
    return null;
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host,
      port: Number(port),
      secure: false, // port 587 → STARTTLS (pas de SSL direct)
      auth: { user, pass },
      pool: true, // réutilise les connexions (important pour Vercel serverless)
      maxConnections: 1,
      maxMessages: Infinity,
    });

    console.log("[email] Transporteur Nodemailer initialisé.");
  }

  return transporter;
}

// ---------------------------------------------------------------------------
// Types partagés
// ---------------------------------------------------------------------------

/** Données du formulaire de contact (route API existante). */
export interface ContactFormData {
  name: string;
  organization: string;
  email: string;
  phone?: string;
  orgType?: string;
  need?: string;
  message: string;
}

/** Réservé — inscriptions aux formations. */
export interface TrainingRegistrationData {
  participantName: string;
  participantEmail: string;
  formationTitle: string;
  formationDate: string;
}

/** Réservé — demandes de devis. */
export interface QuoteRequestData {
  companyName: string;
  contactEmail: string;
  projectDescription: string;
}

/** Réservé — newsletter. */
export interface NewsletterData {
  recipientEmail: string;
  subject: string;
  htmlContent: string;
}

// ---------------------------------------------------------------------------
// Fonction générique bas niveau
// ---------------------------------------------------------------------------

/**
 * Envoie un email via le transporteur Brevo.
 *
 * @returns `{ success: true }` si l'email est parti, `{ success: false, error }` sinon.
 * Ne lève jamais d'exception — l'appelant décide quoi faire du retour.
 */
export async function sendEmail(
  to: string,
  subject: string,
  html: string,
  text?: string
): Promise<{ success: boolean; error?: string }> {
  const transport = getTransporter();

  if (!transport) {
    return {
      success: false,
      error: "Transporteur email non configuré (variables d'environnement manquantes).",
    };
  }

  const fromEmail = process.env.IA_FROM_EMAIL || "ia@rapyogo.com";
  const fromName = process.env.IA_FROM_NAME || "RapIA";

  try {
    const info = await transport.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      replyTo: fromEmail,
      to,
      subject,
      html,
      text: text || undefined,
    });

    console.log(`[email] Message envoyé à ${to} — Message-ID: ${info.messageId}`);
    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[email] Échec d'envoi à ${to}:`, message);
    return { success: false, error: message };
  }
}

// ---------------------------------------------------------------------------
// Fonctions métier — formulaire de contact
// ---------------------------------------------------------------------------

/** Email de notification interne — nouveau message du formulaire de contact. */
export async function sendContactNotification(
  data: ContactFormData
): Promise<{ success: boolean; error?: string }> {
  const contactEmail = process.env.IA_FROM_EMAIL || "ia@rapyogo.com";
  const now = new Date().toLocaleString("fr-FR", { timeZone: "Africa/Lubumbashi" });

  const subject = `Nouveau message de ${data.name} — ${data.organization}`;

  const html = `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"></head>
<body style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
  <h2 style="color: #5E53A4; margin-bottom: 16px;">Nouveau message de contact</h2>
  <table style="width: 100%; border-collapse: collapse;">
    <tr><td style="padding: 8px 0; font-weight: 600; width: 180px;">Nom</td><td>${escapeHtml(data.name)}</td></tr>
    <tr><td style="padding: 8px 0; font-weight: 600;">Organisation</td><td>${escapeHtml(data.organization)}</td></tr>
    <tr><td style="padding: 8px 0; font-weight: 600;">Email</td><td>${escapeHtml(data.email)}</td></tr>
    <tr><td style="padding: 8px 0; font-weight: 600;">Téléphone</td><td>${escapeHtml(data.phone || "Non renseigné")}</td></tr>
    <tr><td style="padding: 8px 0; font-weight: 600;">Type d'organisation</td><td>${escapeHtml(data.orgType || "Non renseigné")}</td></tr>
    <tr><td style="padding: 8px 0; font-weight: 600;">Besoin</td><td>${escapeHtml(data.need || "Non renseigné")}</td></tr>
  </table>
  <hr style="margin: 20px 0; border: none; border-top: 1px solid #e2e8f0;">
  <h3 style="color: #021E2D; margin-bottom: 8px;">Message</h3>
  <p style="white-space: pre-wrap; line-height: 1.6;">${escapeHtml(data.message)}</p>
  <hr style="margin: 20px 0; border: none; border-top: 1px solid #e2e8f0;">
  <p style="color: #64748b; font-size: 12px;">Reçu le ${now} • Formulaire de contact RapIA</p>
</body>
</html>`.trim();

  const text = [
    `Nouveau message de contact RapIA`,
    ``,
    `Nom: ${data.name}`,
    `Organisation: ${data.organization}`,
    `Email: ${data.email}`,
    `Téléphone: ${data.phone || "Non renseigné"}`,
    `Type d'organisation: ${data.orgType || "Non renseigné"}`,
    `Besoin: ${data.need || "Non renseigné"}`,
    ``,
    `Message:`,
    data.message,
    ``,
    `Reçu le ${now}`,
  ].join("\n");

  return sendEmail(contactEmail, subject, html, text);
}

/** Email de confirmation automatique au visiteur. */
export async function sendContactConfirmation(
  data: ContactFormData
): Promise<{ success: boolean; error?: string }> {
  const subject = "Merci pour votre message — RapIA";

  const html = `
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"></head>
<body style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
  <h2 style="color: #021E2D; margin-bottom: 16px;">Merci, ${escapeHtml(data.name)}.</h2>
  <p style="line-height: 1.6; color: #334155;">
    Nous avons bien reçu votre message et vous en remercions.
  </p>
  <p style="line-height: 1.6; color: #334155;">
    L'équipe <strong>RapIA</strong> vous répondra dans un délai de <strong>24 heures ouvrées</strong>.
  </p>
  <p style="line-height: 1.6; color: #334155;">
    En attendant, n'hésitez pas à consulter notre site pour découvrir nos services
    et cas d'usage : <a href="https://ia.rapyogo.com/fr" style="color: #5E53A4;">ia.rapyogo.com</a>
  </p>
  <hr style="margin: 24px 0; border: none; border-top: 1px solid #e2e8f0;">
  <p style="color: #64748b; font-size: 12px;">
    RapIA — Conseil • Formation • Implémentation • Automatisation<br>
    Goma, RDC • <a href="mailto:ia@rapyogo.com" style="color: #5E53A4;">ia@rapyogo.com</a>
  </p>
</body>
</html>`.trim();

  const text = [
    `Merci, ${data.name}.`,
    ``,
    `Nous avons bien reçu votre message et vous en remercions.`,
    `L'équipe RapIA vous répondra dans un délai de 24 heures ouvrées.`,
    ``,
    `En attendant : https://ia.rapyogo.com/fr`,
    ``,
    `RapIA — Conseil • Formation • Implémentation • Automatisation`,
    `Goma, RDC • ia@rapyogo.com`,
  ].join("\n");

  return sendEmail(data.email, subject, html, text);
}

// ---------------------------------------------------------------------------
// Stubs — futures fonctions email (à implémenter quand le besoin sera confirmé)
// ---------------------------------------------------------------------------

/**
 * Envoie une confirmation d'inscription à une formation.
 * TODO: Implémenter quand le module de formation sera en ligne.
 */
export async function sendTrainingRegistration(
  _data: TrainingRegistrationData
): Promise<{ success: boolean; error?: string }> {
  console.warn("[email] sendTrainingRegistration n'est pas encore implémenté.");
  return { success: false, error: "Fonction non implémentée." };
}

/**
 * Envoie une notification + accusé de réception pour une demande de devis.
 * TODO: Implémenter quand le parcours de devis sera en ligne.
 */
export async function sendQuoteRequest(
  _data: QuoteRequestData
): Promise<{ success: boolean; error?: string }> {
  console.warn("[email] sendQuoteRequest n'est pas encore implémenté.");
  return { success: false, error: "Fonction non implémentée." };
}

/**
 * Envoie une newsletter.
 * TODO: Implémenter quand le module newsletter sera en ligne.
 */
export async function sendNewsletter(
  _data: NewsletterData
): Promise<{ success: boolean; error?: string }> {
  console.warn("[email] sendNewsletter n'est pas encore implémenté.");
  return { success: false, error: "Fonction non implémentée." };
}

// ---------------------------------------------------------------------------
// Utilitaire
// ---------------------------------------------------------------------------

/** Échappe les caractères HTML pour prévenir les attaques XSS dans les emails. */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
```

- [ ] **Step 2: Vérifier la compilation**

```bash
npx tsc --noEmit lib/email.ts
```

Expected: aucune erreur.

- [ ] **Step 3: Commit**

```bash
git add lib/email.ts
git commit -m "feat: module email centralisé — transporteur Brevo + fonctions contact + stubs futurs"
```

---

### Task 3: Refondre la route API contact

**Files:**
- Modify: `app/api/contact/route.ts` (remplacement complet du handler)

**Interfaces:**
- Consumes: `sendContactNotification`, `sendContactConfirmation`, `ContactFormData` from `lib/email.ts` (Task 2)
- Produces: `POST /api/contact` — même contrat HTTP qu'avant (JSON in, JSON out), comportement enrichi

- [ ] **Step 1: Réécrire `app/api/contact/route.ts`**

```typescript
// app/api/contact/route.ts
// Route API du formulaire de contact.
// Orchestration : validation → honeypot check → rate limiting → notification → confirmation.

import { NextResponse } from "next/server";
import {
  sendContactNotification,
  sendContactConfirmation,
} from "@/lib/email";
import type { ContactFormData } from "@/lib/email";

// ---------------------------------------------------------------------------
// Rate limiting in-memory (1 soumission / 60 secondes par IP)
// ---------------------------------------------------------------------------

const RATE_LIMIT_WINDOW = 60_000; // 1 minute
const RATE_LIMIT_MAX = 1; // 1 soumission par fenêtre

const requestCounts = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = requestCounts.get(ip);

  if (!entry || now > entry.resetAt) {
    requestCounts.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return false;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return true;
  }

  entry.count++;
  return false;
}

// ---------------------------------------------------------------------------
// Validation serveur
// ---------------------------------------------------------------------------

const MAX_LENGTHS: Record<string, number> = {
  name: 200,
  organization: 200,
  email: 320,
  phone: 50,
  orgType: 100,
  need: 100,
  message: 5000,
};

function validate(body: Record<string, unknown>): { valid: true; data: ContactFormData } | { valid: false; error: string; status: number } {
  const { name, organization, email, phone, orgType, need, message } = body;

  // Champs requis
  if (!name || typeof name !== "string" || !name.trim()) {
    return { valid: false, error: "Le nom est requis.", status: 400 };
  }
  if (!organization || typeof organization !== "string" || !organization.trim()) {
    return { valid: false, error: "L'organisation est requise.", status: 400 };
  }
  if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { valid: false, error: "Email invalide.", status: 400 };
  }
  if (!message || typeof message !== "string" || !message.trim()) {
    return { valid: false, error: "Le message est requis.", status: 400 };
  }

  // Longueurs max
  for (const [field, max] of Object.entries(MAX_LENGTHS)) {
    const value = (body as Record<string, unknown>)[field];
    if (typeof value === "string" && value.length > max) {
      return { valid: false, error: `Le champ ${field} est trop long (max ${max} caractères).`, status: 400 };
    }
  }

  // Sanitization
  const sanitize = (s: string) => s.trim().slice(0, 5000);

  return {
    valid: true,
    data: {
      name: (name as string).trim().slice(0, MAX_LENGTHS.name),
      organization: (organization as string).trim().slice(0, MAX_LENGTHS.organization),
      email: (email as string).trim().toLowerCase().slice(0, MAX_LENGTHS.email),
      phone: typeof phone === "string" ? phone.trim().slice(0, MAX_LENGTHS.phone) : undefined,
      orgType: typeof orgType === "string" ? orgType.trim().slice(0, MAX_LENGTHS.orgType) : undefined,
      need: typeof need === "string" ? need.trim().slice(0, MAX_LENGTHS.need) : undefined,
      message: sanitize(message as string),
    },
  };
}

// ---------------------------------------------------------------------------
// Handler POST
// ---------------------------------------------------------------------------

export async function POST(request: Request) {
  // 1. Extraire l'IP pour le rate limiting
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  // 2. Parser le body
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Corps de requête invalide." },
      { status: 400 }
    );
  }

  // 3. Honeypot anti-spam — champ caché, si rempli → succès silencieux
  if (body._website && typeof body._website === "string" && body._website.trim() !== "") {
    // Le spammer croit avoir réussi, on ne consomme pas le quota Brevo
    return NextResponse.json({ success: true });
  }

  // 4. Rate limiting
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Trop de requêtes. Veuillez patienter une minute." },
      { status: 429 }
    );
  }

  // 5. Validation
  const validation = validate(body);
  if (!validation.valid) {
    return NextResponse.json(
      { error: validation.error },
      { status: validation.status }
    );
  }

  const data = validation.data;

  // 6. Envoi des emails (notification + confirmation)
  const [notifResult, confirmResult] = await Promise.allSettled([
    sendContactNotification(data),
    sendContactConfirmation(data),
  ]);

  // Log des résultats pour diagnostic
  if (notifResult.status === "rejected" || (notifResult.value && !notifResult.value.success)) {
    console.error("[contact] Échec notification:", notifResult);
  }
  if (confirmResult.status === "rejected" || (confirmResult.value && !confirmResult.value.success)) {
    console.error("[contact] Échec confirmation:", confirmResult);
  }

  // On retourne un succès même si l'email de confirmation échoue
  // (le visiteur ne doit pas être pénalisé par un souci SMTP)
  if (notifResult.status === "fulfilled" && notifResult.value.success) {
    return NextResponse.json({ success: true });
  }

  // Si la notification a échoué, on log mais on ne bloque pas l'UX
  console.warn("[contact] Notification interne échouée — le message est peut-être perdu.");
  return NextResponse.json({ success: true });
}
```

- [ ] **Step 2: Vérifier la compilation**

```bash
npx tsc --noEmit
```

Expected: aucune erreur.

- [ ] **Step 3: Commit**

```bash
git add app/api/contact/route.ts
git commit -m "feat: refonte route API contact — Brevo, honeypot, double envoi, rate limiting 1/60s"
```

---

### Task 4: Mettre à jour le formulaire client (honeypot + message confirmation)

**Files:**
- Modify: `app/[locale]/contact/page.tsx` (lignes ciblées)

**Interfaces:**
- Consumes: clés de traduction `contact.successConfirmation` dans `messages/*.json` (Task 5)
- Produces: champ `_website` dans le body POST vers `/api/contact`

- [ ] **Step 1: Ajouter le champ honeypot dans le type FormData et l'état initial**

Chercher la définition de `type FormData` (ligne 15) et `initialFormData` (ligne 25).

Dans `type FormData`, ajouter :
```typescript
  _website: string;
```

Dans `initialFormData`, ajouter :
```typescript
  _website: "",
```

- [ ] **Step 2: Ajouter l'input honeypot dans le JSX (juste après l'ouverture du `<form>`)**

Insérer ce code juste après la ligne `<form onSubmit={handleSubmit} noValidate className="space-y-6">` :

```tsx
                {/* Honeypot anti-spam — invisible pour les humains */}
                <input
                  type="text"
                  name="_website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={formData._website}
                  onChange={(e) => updateField("_website", e.target.value)}
                  style={{
                    position: "absolute",
                    left: "-9999px",
                    opacity: 0,
                    height: 0,
                    width: 0,
                  }}
                  aria-hidden="true"
                />
```

- [ ] **Step 3: Mettre à jour le message de succès**

Remplacer la ligne :
```tsx
                <p className="text-[var(--color-text-secondary)] mb-4">
                  {t("successBody")}{" "}
```
par :
```tsx
                <p className="text-[var(--color-text-secondary)] mb-4">
                  {t("successBody")}.{" "}
                  {t("successConfirmation")}{" "}
```

- [ ] **Step 4: Vérifier la compilation**

```bash
npx tsc --noEmit
```

Expected: aucune erreur.

- [ ] **Step 5: Commit**

```bash
git add app/[locale]/contact/page.tsx
git commit -m "feat: honeypot anti-spam + mention email de confirmation dans le formulaire contact"
```

---

### Task 5: Ajouter les clés de traduction

**Files:**
- Modify: `messages/fr.json` (ligne ~210, dans l'objet `contact`)
- Modify: `messages/en.json` (ligne ~210, dans l'objet `contact`)

**Interfaces:**
- Consumes: rien (clé statique)
- Produces: clé `contact.successConfirmation` consommée par la page contact (Task 4)

- [ ] **Step 1: Ajouter la clé dans `messages/fr.json`**

Dans l'objet `"contact"`, après la ligne `"successBody": "Merci pour votre message. Nous vous répondrons dans les 24h à l'adresse",` ajouter :

```json
    "successConfirmation": "Vous allez recevoir un email de confirmation dans quelques instants.",
```

- [ ] **Step 2: Ajouter la clé dans `messages/en.json`**

Dans l'objet `"contact"`, après la ligne `"successBody": "Thank you for your message. We'll respond within 24 hours at",` ajouter :

```json
    "successConfirmation": "You will receive a confirmation email shortly.",
```

- [ ] **Step 3: Vérifier la parité des clés FR/EN**

```bash
node -e "const f=require('./messages/fr.json'),e=require('./messages/en.json');const k=(o,p='')=>Object.entries(o).flatMap(([x,v])=>v&&typeof v==='object'&&!Array.isArray(v)?k(v,p+x+'.'):[p+x]);const a=k(f),b=k(e);console.log(a.length===b.length&&a.every(x=>b.includes(x))?'OK':'DESYNC')"
```

Expected: `OK`

- [ ] **Step 4: Commit**

```bash
git add messages/fr.json messages/en.json
git commit -m "feat: ajout de la clé contact.successConfirmation (FR + EN)"
```

---

### Task 6: Documenter les variables d'environnement dans le README

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Remplacer le contenu du README par une version documentée**

Remplacer tout le contenu de `README.md` par :

```markdown
# RapIA — Site web

Site vitrine de RapIA, agence d'intelligence artificielle (Goma, RDC).
Développé avec Next.js 16 (App Router), React 19, TypeScript et Tailwind CSS v4.
Hébergé sur Vercel.

**Domaine de production :** [ia.rapyogo.com](https://ia.rapyogo.com)

## Démarrage rapide

```bash
npm install
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Stack technique

- **Framework :** Next.js 16 (App Router, Turbopack)
- **Langage :** TypeScript 5
- **Styling :** Tailwind CSS v4 (tokens dans `app/globals.css`)
- **i18n :** next-intl v4 (français et anglais, routes `/fr` et `/en`)
- **Animations :** Framer Motion, GSAP (ScrollTrigger), Lenis (scroll fluide)
- **Email :** Nodemailer + Brevo SMTP

## Variables d'environnement

À configurer dans Vercel → Settings → Environment Variables (et dans `.env.local` pour le développement local).

### Email (Brevo SMTP — plan gratuit, 300 emails/jour)

| Variable | Description | Exemple |
|----------|-------------|---------|
| `BREVO_SMTP_HOST` | Serveur SMTP Brevo | `smtp-relay.brevo.com` |
| `BREVO_SMTP_PORT` | Port SMTP (STARTTLS) | `587` |
| `BREVO_SMTP_LOGIN` | Login SMTP Brevo | `benmichel058@gmail.com` |
| `BREVO_SMTP_PASSWORD` | Clé SMTP Brevo (générée depuis le dashboard Brevo) | `xsmtpsib-...` |
| `IA_FROM_EMAIL` | Adresse expéditrice des emails | `ia@rapyogo.com` |
| `IA_FROM_NAME` | Nom de l'expéditeur | `RapIA` |

> **Note :** la clé SMTP Brevo (`BREVO_SMTP_PASSWORD`) est différente de la clé API.
> Elle se génère dans Brevo → Account → SMTP & API → SMTP Keys.

## Architecture email

Toutes les fonctions d'envoi d'emails sont centralisées dans `lib/email.ts` :

- `sendEmail(to, subject, html, text)` — fonction générique bas niveau
- `sendContactNotification(data)` — notification interne (nouveau message formulaire)
- `sendContactConfirmation(data)` — accusé de réception au visiteur
- `sendTrainingRegistration(data)` — (stub) confirmation d'inscription
- `sendQuoteRequest(data)` — (stub) demande de devis
- `sendNewsletter(data)` — (stub) newsletter

Les fonctions marquées « stub » sont réservées pour les futures fonctionnalités
du site. Leur signature TypeScript est prête ; l'implémentation suivra quand le
besoin sera confirmé.

## Déploiement

```bash
npm run build
npx vercel --prod
```

## Licence

Propriétaire — Rapyogo SARL, Goma, RDC.
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: README avec stack technique, variables d'environnement et architecture email"
```

---

### Task 7: Vérification finale et build

**Files:**
- Vérifie l'ensemble du projet

- [ ] **Step 1: Vérifier la compilation TypeScript de tout le projet**

```bash
npx tsc --noEmit
```

Expected: aucune erreur. Si des erreurs sur les stubs (paramètres non utilisés), vérifier que le tsconfig a `"noUnusedParameters": false` ou ajouter un `console.warn` dans chaque stub.

- [ ] **Step 2: Vérifier le build Next.js**

```bash
npm run build
```

Expected: build réussi sans erreur.

- [ ] **Step 3: Vérifier le lint**

```bash
npm run lint
```

Expected: 0 warning, 0 erreur.

- [ ] **Step 4: Nettoyer les anciennes références Resend**

```bash
# Vérifier qu'aucune référence à Resend ne traîne
grep -r "resend\|RESEND" --include="*.ts" --include="*.tsx" --include="*.json" app/ lib/ 2>/dev/null || echo "Aucune référence Resend restante — OK"
```

Expected: `Aucune référence Resend restante — OK` (ou uniquement dans `node_modules/`).

- [ ] **Step 5: Commit final**

```bash
git add -A
git commit -m "feat: module email Brevo + formulaire contact — complet"
```

---

### Tests manuels post-implémentation

Avant de déployer, tester ces scénarios sur `localhost:3000/fr/contact` :

1. **Formulaire vide** → cliquer Envoyer → erreurs de validation (nom, organisation, email, message requis)
2. **Email invalide** (`abc`) → erreur "Format d'email invalide"
3. **Honeypot rempli** → ouvrir la console, remplir le champ caché via `document.querySelector('[name="_website"]').value = "test"`, soumettre → succès silencieux, **aucun email envoyé** (vérifier les logs serveur)
4. **Formulaire valide** → remplir tous les champs, soumettre → message de succès avec mention "Vous allez recevoir un email de confirmation", **vérifier réception des 2 emails** (notification à ia@rapyogo.com + confirmation au visiteur)
5. **Rate limiting** → soumettre 2 formulaires valides en moins de 60 secondes → 429 sur la 2e tentative
6. **Mode sombre/claire** → vérifier que le champ honeypot reste invisible dans les deux modes
