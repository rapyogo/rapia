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
