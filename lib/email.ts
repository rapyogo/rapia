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
    <tr><td style="padding: 8px 0; font-weight: 600;">Reçu de</td><td>${escapeHtml(data.source || "Formulaire de contact")}</td></tr>
    <tr><td style="padding: 8px 0; font-weight: 600;">Reçu le</td><td>${now}</td></tr>
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
    `Reçu de: ${data.source || "Formulaire de contact"}`,
    `Reçu le: ${now}`,
    ``,
    `Message:`,
    data.message,
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
