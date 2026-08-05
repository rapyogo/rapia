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
