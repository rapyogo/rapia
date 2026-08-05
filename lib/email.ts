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
  /** Page d'origine de la demande — sert à savoir d'où vient le contact. */
  source?: string;
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
// Identité visuelle — miroir des tokens de `app/globals.css`
//
// Les emails ne peuvent pas lire les variables CSS du site : les valeurs sont
// donc recopiées ici. Si la palette change dans `globals.css`, la mettre à jour
// ici aussi — c'est le seul endroit du module qui porte des couleurs.
// ---------------------------------------------------------------------------

const BRAND = {
  deep: "#001B2A",
  indigo: "#3A2E7E",
  amber: "#F59E0B",
  emerald: "#10B881",
  bg: "#F8F9FB",
  surface: "#FFFFFF",
  border: "#E2E8F0",
  text: "#191C1E",
  textSecondary: "#42474C",
  textMuted: "#73787C",
  // Les polices web ne se chargent pas dans la plupart des clients mail :
  // Inter est demandée, la chaîne de repli fait le vrai travail.
  font: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
} as const;

/** URL publique du site — les images d'un email doivent être en absolu. */
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://ia.rapyogo.com";

/**
 * Coordonnées légales de l'entreprise.
 *
 * Elles ne sont pas décoratives : les filtres anti-spam accordent de la
 * confiance aux expéditeurs qui s'identifient physiquement, avec une adresse
 * et des identifiants vérifiables. Elles figurent donc dans chaque email.
 */
const COMPANY = {
  phone: "+243 856 474 500",
  /** Format sans espaces ni ponctuation, requis par les liens `tel:`. */
  phoneLink: "+243856474500",
  email: "ia@rapyogo.com",
  offices: [
    { city: "Goma (siège)", address: "Av. Rwamichacha n° 30, Keshero" },
    { city: "Kinshasa", address: "01, Av. OUA, Concession Procoki, Q. Basoko" },
    { city: "Lubumbashi", address: "170, Av. Maniema, Q. Makutano" },
  ],
  legal: "RCCM : CD/GOM/RCCM/23-B-00261 · ID Nat : 19-H5300-N42287N · NIF : A2215930Q",
} as const;

/** Pied de page des versions texte — pendant du pied de page HTML. */
const FOOTER_TEXT = [
  `RapIA — un service de Rapyogo SARL`,
  `Conseil • Formation • Implémentation • Automatisation`,
  ``,
  ...COMPANY.offices.map((o) => `${o.city} : ${o.address}`),
  ``,
  `Tél : ${COMPANY.phone} • E-mail : ${COMPANY.email} • Web : ia.rapyogo.com`,
  `Rapyogo SARL — ${COMPANY.legal.replace(/ · /g, " | ")}`,
].join("\n");

/**
 * Gabarit commun à tous les emails du site : bandeau logo, carte de contenu, pied de page.
 *
 * Contraintes email respectées ici (ne pas « moderniser » sans vérifier dans Outlook) :
 * - mise en page en `<table>` : ni flexbox ni grid ne sont fiables sous Outlook
 * - styles en ligne : les balises `<style>` sont dépouillées par Gmail
 * - logo en PNG : le WebP ne s'affiche pas dans Outlook desktop
 * - bandeau sombre : le logo blanc reste lisible même quand un client force le mode sombre
 */
function emailLayout({
  preheader,
  bodyHtml,
}: {
  /** Texte d'aperçu affiché dans la liste des messages, avant ouverture. */
  preheader: string;
  bodyHtml: string;
}): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<title>RapIA</title>
</head>
<body style="margin:0; padding:0; background-color:${BRAND.bg}; font-family:${BRAND.font};">

  <!-- Aperçu dans la boîte de réception, invisible à l'ouverture -->
  <div style="display:none; max-height:0; overflow:hidden; opacity:0;">${escapeHtml(preheader)}</div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${BRAND.bg}; padding:24px 12px;">
    <tr>
      <td align="center">

        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%; max-width:600px;">

          <!-- Bandeau logo -->
          <tr>
            <td align="center" style="background-color:${BRAND.deep}; border-radius:12px 12px 0 0; padding:28px 24px;">
              <img src="${SITE_URL}/logo-horisontale-rapia-dark_mode.png"
                   alt="RapIA" width="180"
                   style="display:block; width:180px; max-width:60%; height:auto; border:0;">
            </td>
          </tr>

          <!-- Filet ambre : rappel de la couleur de conversion du site -->
          <tr><td style="background-color:${BRAND.amber}; height:3px; line-height:3px; font-size:0;">&nbsp;</td></tr>

          <!-- Contenu -->
          <tr>
            <td style="background-color:${BRAND.surface}; padding:36px 32px; color:${BRAND.text};">
              ${bodyHtml}
            </td>
          </tr>

          <!-- Pied de page -->
          <tr>
            <td style="background-color:${BRAND.deep}; border-radius:0 0 12px 12px; padding:28px 32px;">

              <p style="margin:0 0 4px; font-family:${BRAND.font}; font-size:15px; font-weight:600; color:#FFFFFF;">
                RapIA
              </p>
              <p style="margin:0 0 4px; font-family:${BRAND.font}; font-size:13px; color:#94A3B8;">
                Un service de Rapyogo SARL
              </p>
              <p style="margin:0 0 20px; font-family:${BRAND.font}; font-size:12px; color:#64748B;">
                Conseil &bull; Formation &bull; Implémentation &bull; Automatisation
              </p>

              <!-- Implantations : ville à gauche, adresse à droite -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 20px;">
                ${COMPANY.offices
                  .map(
                    (o) => `
                <tr>
                  <td style="padding:0 12px 6px 0; font-family:${BRAND.font}; font-size:12px; font-weight:600; color:#CBD5E1; vertical-align:top; white-space:nowrap;">${escapeHtml(o.city)}</td>
                  <td style="padding:0 0 6px; font-family:${BRAND.font}; font-size:12px; line-height:1.5; color:#94A3B8; vertical-align:top;">${escapeHtml(o.address)}</td>
                </tr>`
                  )
                  .join("")}
              </table>

              <p style="margin:0 0 18px; font-family:${BRAND.font}; font-size:13px; line-height:1.8; color:#94A3B8;">
                Tél :
                <a href="tel:${COMPANY.phoneLink}" style="color:#FFFFFF; text-decoration:none;">${COMPANY.phone}</a><br>
                E-mail :
                <a href="mailto:${COMPANY.email}" style="color:#FFFFFF; text-decoration:none;">${COMPANY.email}</a><br>
                Web :
                <a href="${SITE_URL}/fr" style="color:#FFFFFF; text-decoration:none;">ia.rapyogo.com</a>
              </p>

              <p style="margin:0; padding-top:16px; border-top:1px solid #123044; font-family:${BRAND.font}; font-size:11px; line-height:1.6; color:#64748B;">
                Rapyogo SARL &mdash; ${COMPANY.legal}<br>
                Vous recevez ce message parce que vous avez utilisé un formulaire sur ia.rapyogo.com.
              </p>

            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>`;
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

  /** Une ligne du tableau récapitulatif. */
  const row = (label: string, value: string) => `
                <tr>
                  <td style="padding:10px 0; border-bottom:1px solid ${BRAND.border}; font-family:${BRAND.font}; font-size:13px; font-weight:600; color:${BRAND.textMuted}; vertical-align:top; width:150px;">${label}</td>
                  <td style="padding:10px 0; border-bottom:1px solid ${BRAND.border}; font-family:${BRAND.font}; font-size:15px; color:${BRAND.text}; vertical-align:top;">${value}</td>
                </tr>`;

  const html = emailLayout({
    preheader: `${data.name} — ${data.organization} : ${data.message.slice(0, 90)}`,
    bodyHtml: `
              <h1 style="margin:0 0 6px; font-family:${BRAND.font}; font-size:24px; line-height:1.25; font-weight:700; letter-spacing:-0.02em; color:${BRAND.text};">
                Nouveau message de contact
              </h1>
              <p style="margin:0 0 24px; font-family:${BRAND.font}; font-size:14px; color:${BRAND.textMuted};">
                Reçu le ${now}
              </p>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                ${row("Nom", escapeHtml(data.name))}
                ${row("Organisation", escapeHtml(data.organization))}
                ${row("Email", `<a href="mailto:${escapeHtml(data.email)}" style="color:${BRAND.indigo}; text-decoration:none;">${escapeHtml(data.email)}</a>`)}
                ${row("Téléphone", escapeHtml(data.phone || "—"))}
                ${row("Type d'organisation", escapeHtml(data.orgType || "—"))}
                ${row("Besoin", escapeHtml(data.need || "—"))}
                ${row("Reçu de", escapeHtml(data.source || "Formulaire de contact"))}
              </table>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:24px 0 28px;">
                <tr>
                  <td style="background-color:${BRAND.bg}; border-left:3px solid ${BRAND.amber}; border-radius:0 8px 8px 0; padding:18px 20px;">
                    <p style="margin:0 0 8px; font-family:${BRAND.font}; font-size:12px; font-weight:600; letter-spacing:0.06em; text-transform:uppercase; color:${BRAND.textMuted};">
                      Message
                    </p>
                    <p style="margin:0; font-family:${BRAND.font}; font-size:15px; line-height:1.65; color:${BRAND.text}; white-space:pre-wrap;">${escapeHtml(data.message)}</p>
                  </td>
                </tr>
              </table>

              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="background-color:${BRAND.indigo}; border-radius:8px;">
                    <a href="mailto:${escapeHtml(data.email)}?subject=${encodeURIComponent(`Re : votre demande — RapIA`)}"
                       style="display:inline-block; padding:14px 28px; font-family:${BRAND.font}; font-size:15px; font-weight:600; color:#FFFFFF; text-decoration:none;">
                      Répondre à ${escapeHtml(data.name.trim().split(/\s+/)[0])}
                    </a>
                  </td>
                </tr>
              </table>`,
  });

  const text = [
    `Nouveau message de contact RapIA`,
    ``,
    `Nom: ${data.name}`,
    `Organisation: ${data.organization}`,
    `Email: ${data.email}`,
    `Téléphone: ${data.phone || "Non renseigné"}`,
    `Type d'organisation: ${data.orgType || "Non renseigné"}`,
    `Besoin: ${data.need || "Non renseigné"}`,
    `Reçu de: ${data.source || "Formulaire de contact"}`,
    `Reçu le: ${now}`,
    ``,
    `Message:`,
    data.message,
    ``,
    `--`,
    FOOTER_TEXT,
  ].join("\n");

  return sendEmail(contactEmail, subject, html, text);
}

/** Email de confirmation automatique au visiteur. */
export async function sendContactConfirmation(
  data: ContactFormData
): Promise<{ success: boolean; error?: string }> {
  const subject = "Merci pour votre message — RapIA";

  // Prénom seul si le visiteur a saisi nom + prénom : plus chaleureux qu'un nom complet.
  const firstName = data.name.trim().split(/\s+/)[0];

  const html = emailLayout({
    preheader: "Votre message est bien arrivé. Réponse sous 24 heures ouvrées.",
    bodyHtml: `
              <h1 style="margin:0 0 20px; font-family:${BRAND.font}; font-size:26px; line-height:1.25; font-weight:700; letter-spacing:-0.02em; color:${BRAND.text};">
                Merci, ${escapeHtml(firstName)}.
              </h1>

              <p style="margin:0 0 16px; font-family:${BRAND.font}; font-size:16px; line-height:1.65; color:${BRAND.textSecondary};">
                Votre message nous est bien parvenu. Une personne de l'équipe le lit
                et vous répond sous <strong style="color:${BRAND.text};">24 heures ouvrées</strong>.
              </p>

              <!-- Rappel de la demande : le visiteur voit ce que nous avons reçu -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:24px 0;">
                <tr>
                  <td style="background-color:${BRAND.bg}; border-left:3px solid ${BRAND.indigo}; border-radius:0 8px 8px 0; padding:18px 20px;">
                    <p style="margin:0 0 8px; font-family:${BRAND.font}; font-size:12px; font-weight:600; letter-spacing:0.06em; text-transform:uppercase; color:${BRAND.textMuted};">
                      Votre message
                    </p>
                    <p style="margin:0; font-family:${BRAND.font}; font-size:15px; line-height:1.6; color:${BRAND.textSecondary}; white-space:pre-wrap;">${escapeHtml(data.message)}</p>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 28px; font-family:${BRAND.font}; font-size:16px; line-height:1.65; color:${BRAND.textSecondary};">
                En attendant notre réponse, vous pouvez découvrir comment nous aidons
                les organisations de la région à mettre l'IA au travail.
              </p>

              <!-- Bouton robuste : table + padding sur le lien, seule construction fiable sous Outlook -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="background-color:${BRAND.indigo}; border-radius:8px;">
                    <a href="${SITE_URL}/fr"
                       style="display:inline-block; padding:14px 28px; font-family:${BRAND.font}; font-size:15px; font-weight:600; color:#FFFFFF; text-decoration:none;">
                      Découvrir nos services
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:28px 0 0; padding-top:20px; border-top:1px solid ${BRAND.border}; font-family:${BRAND.font}; font-size:14px; line-height:1.6; color:${BRAND.textMuted};">
                Une précision à ajouter ? Répondez simplement à cet email.
              </p>`,
  });

  const text = [
    `Merci, ${firstName}.`,
    ``,
    `Votre message nous est bien parvenu. Une personne de l'équipe le lit et vous`,
    `répond sous 24 heures ouvrées.`,
    ``,
    `--- Votre message ---`,
    data.message,
    `---------------------`,
    ``,
    `En attendant : ${SITE_URL}/fr`,
    ``,
    `Une précision à ajouter ? Répondez simplement à cet email.`,
    ``,
    `--`,
    FOOTER_TEXT,
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
