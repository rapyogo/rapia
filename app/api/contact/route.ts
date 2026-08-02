import { NextResponse } from "next/server";

/**
 * Rate limiting simple (in-memory).
 * En production, utiliser Vercel KV ou Upstash Redis.
 */
const RATE_LIMIT_WINDOW = 60_000; // 1 minute
const RATE_LIMIT_MAX = 3; // max 3 soumissions par minute

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

export async function POST(request: Request) {
  // Rate limiting
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Trop de requêtes. Veuillez patienter une minute." },
      { status: 429 }
    );
  }

  // Parse body
  let body: Record<string, string>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Corps de requête invalide." },
      { status: 400 }
    );
  }

  // Validation serveur
  const { name, organization, email, phone, orgType, need, message } = body;

  if (!name || typeof name !== "string" || !name.trim()) {
    return NextResponse.json(
      { error: "Le nom est requis." },
      { status: 400 }
    );
  }
  if (!organization || typeof organization !== "string" || !organization.trim()) {
    return NextResponse.json(
      { error: "L'organisation est requise." },
      { status: 400 }
    );
  }
  if (
    !email ||
    typeof email !== "string" ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    return NextResponse.json(
      { error: "Email invalide." },
      { status: 400 }
    );
  }
  if (!message || typeof message !== "string" || !message.trim()) {
    return NextResponse.json(
      { error: "Le message est requis." },
      { status: 400 }
    );
  }

  // Sanitization basique
  const sanitize = (s: string) => s.trim().slice(0, 5000);
  const sanitizedMessage = sanitize(message);

  // Envoi email via Resend (si configuré)
  const resendApiKey = process.env.RESEND_API_KEY;
  const contactEmail = process.env.CONTACT_EMAIL || "contact@rapyogo.com";

  if (resendApiKey) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: "RAPIA Contact <contact@rapia.cd>",
          to: [contactEmail],
          subject: `Nouveau message de ${sanitize(name)} — ${sanitize(organization)}`,
          text: `
Nom: ${sanitize(name)}
Organisation: ${sanitize(organization)}
Email: ${email}
Téléphone: ${phone || "Non renseigné"}
Type d'organisation: ${orgType || "Non renseigné"}
Besoin: ${need || "Non renseigné"}

Message:
${sanitizedMessage}
          `.trim(),
        }),
      });

      if (!res.ok) {
        console.error("Resend API error:", await res.text());
        return NextResponse.json(
          { error: "Erreur lors de l'envoi de l'email." },
          { status: 500 }
        );
      }
    } catch (err) {
      console.error("Resend send error:", err);
      return NextResponse.json(
        { error: "Erreur lors de l'envoi de l'email." },
        { status: 500 }
      );
    }
  } else {
    // Fallback : log en console (dev uniquement)
    console.log("--- Nouveau message de contact RAPIA ---");
    console.log("Nom:", sanitize(name));
    console.log("Organisation:", sanitize(organization));
    console.log("Email:", email);
    console.log("Téléphone:", phone);
    console.log("Type:", orgType);
    console.log("Besoin:", need);
    console.log("Message:", sanitizedMessage);
    console.log("--- Fin message ---");
  }

  return NextResponse.json({ success: true });
}
