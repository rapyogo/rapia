# Module email & formulaire de contact — Spec design

> Date : 2026-08-05
> Contexte : Remplacement de l'envoi Resend (fetch brut vers api.resend.com) par Brevo SMTP via Nodemailer, ajout email de confirmation visiteur, sécurisation anti-spam, architecture pour futures fonctions email.

## 1. Architecture du module email

### Nouveau fichier : `lib/email.ts`

Module unique et centralisé pour tous les envois d'emails du site.

```
lib/email.ts
├── getTransporter()                → crée/recycle le transporteur Nodemailer (Brevo SMTP)
├── sendEmail(to, subject, html, text) → socle générique bas niveau
├── sendContactNotification(data)   → notification interne (ia@rapyogo.com)
├── sendContactConfirmation(data)   → accusé de réception au visiteur
├── sendTrainingRegistration(...)   // stub — futures inscriptions formations
├── sendQuoteRequest(...)           // stub — futures demandes de devis
└── sendNewsletter(...)             // stub — future newsletter
```

### Transporteur Nodemailer

- Créé UNE fois hors handler (module-level singleton). Vercel Serverless recycle l'instance entre requêtes.
- Configuration : `pool: true`, `maxConnections: 1`, `maxMessages: Infinity`
- Toutes les valeurs lues depuis `process.env` (aucune valeur hardcodée) :
  - `BREVO_SMTP_HOST` (smtp-relay.brevo.com)
  - `BREVO_SMTP_PORT` (587)
  - `BREVO_SMTP_LOGIN` (benmichel058@gmail.com)
  - `BREVO_SMTP_PASSWORD` (clé SMTP Brevo)
  - `IA_FROM_EMAIL` (ia@rapyogo.com)
  - `IA_FROM_NAME` (RapIA)

### Fonction `sendEmail(to, subject, html, text)`

- Signe les en-têtes : `From: "RapIA" <ia@rapyogo.com>`, `Reply-To: ia@rapyogo.com`
- Contenu : HTML + fallback texte (multipart)
- Gestion d'erreur : try/catch, `console.error` avec contexte, retour `{ success: boolean, error?: string }`
- Ne crash jamais — l'appelant décide quoi faire du retour

### Fonctions métier

- **`sendContactNotification(data)`** : email à `ia@rapyogo.com` avec nom, email, téléphone, orgType, need, message, date
- **`sendContactConfirmation(data)`** : email au `data.email` — sujet « Merci pour votre message — RapIA », corps court et pro : "Nous avons bien reçu votre message et vous répondrons sous 24h ouvrés. L'équipe RapIA"
- **Stubs futurs** : signatures TypeScript uniquement, corps `// TODO: implémenter quand le besoin sera confirmé`

### Dépendance ajoutée

- `nodemailer` (runtime) + `@types/nodemailer` (dev)
- Aucune dépendance supprimée (Resend était utilisé en fetch brut, pas en SDK)

---

## 2. Route API (`app/api/contact/route.ts`)

### Changements

| Avant | Après |
|-------|-------|
| `fetch()` vers api.resend.com | `sendContactNotification()` + `sendContactConfirmation()` depuis `lib/email.ts` |
| Pas de honeypot | Vérification du champ `_website` — si rempli → réponse 200 silencieuse |
| Validation serveur existante | Conservée + `maxLength` sur chaque champ |
| Rate limiting 3/min | 1/60s par IP |
| Envoi unique (notification) | Double envoi (notification + confirmation visiteur) |

### Honeypot anti-spam

- Champ `_website` attendu dans le body
- Si présent et non-vide → `return NextResponse.json({ success: true })` immédiat, sans toucher au transporteur SMTP
- Le bot croit avoir réussi, pas de consommation du quota Brevo

### Rate limiting

- In-memory, 1 soumission par IP par fenêtre de 60 secondes
- Reste in-memory (suffisant pour le volume actuel, Vercel KV si besoin plus tard)

---

## 3. Formulaire client (`app/[locale]/contact/page.tsx`)

### Changements légers (zéro impact design existant)

- **Champ honeypot** : `<input>` caché via CSS (`position:absolute;left:-9999px`), `tabIndex={-1}`, `autoComplete="off"`, ajouté à `formData` et envoyé au serveur
- **Message de succès** : ajout d'une ligne « Vous allez recevoir un email de confirmation. » dans la card de succès existante
- **Pas de changement** au spinner (prop `loading` du `Button` déjà en place), aux états success/error, au layout

---

## 4. Variables d'environnement

Toutes listées dans le README. À configurer dans Vercel → Settings → Environment Variables.

| Variable | Valeur |
|----------|--------|
| `BREVO_SMTP_HOST` | smtp-relay.brevo.com |
| `BREVO_SMTP_PORT` | 587 |
| `BREVO_SMTP_LOGIN` | benmichel058@gmail.com |
| `BREVO_SMTP_PASSWORD` | (clé SMTP Brevo — déjà fournie par l'utilisateur) |
| `IA_FROM_EMAIL` | ia@rapyogo.com |
| `IA_FROM_NAME` | RapIA |

---

## 5. Non-fonctionnel

- **Quota Brevo** : 300 emails/jour — on envoie 2 emails par soumission (1 notif + 1 confirmation), donc max ~150 soumissions/jour. Le rate limiting (1/60s) plafonne à 1 440/jour théorique, bien au-dessus du quota Brevo — OK.
- **Compatibilité Vercel Serverless** : Nodemailer avec `pool: true` fonctionne sur Vercel (connexion TCP réutilisée entre requêtes chaudes). Pas de gestion d'état externe nécessaire.
- **Langue des emails** : Le site est bilingue mais les emails sont en français uniquement (le service opère en RDC, la réponse humaine suit).

---

## 6. Tests manuels à effectuer

1. Soumettre le formulaire vide → erreurs de validation
2. Soumettre avec email invalide → erreur
3. Soumettre formulaire valide → succès, email reçu par ia@rapyogo.com, confirmation reçue par le visiteur
4. Remplir le honeypot → succès silencieux (pas d'email envoyé)
5. Soumettre 2 fois en <60s → 429 rate limit
6. Variables d'env manquantes → l'API route log l'erreur et retourne un statut propre (pas de crash)
