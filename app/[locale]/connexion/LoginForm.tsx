"use client";

import { useRef, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Mail, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

type State = "idle" | "loading" | "sent" | "error";

/**
 * Formulaire de demande de lien de connexion.
 *
 * **Le message de succès ne dit pas si le compte existe.** « Si cette adresse
 * peut ouvrir un espace, un lien vient d'y être envoyé » : la formulation est
 * volontairement conditionnelle, comme la réponse de l'API. Écrire « lien
 * envoyé » ferait du formulaire un moyen de vérifier qui est client de RapIA —
 * une information qui ne nous appartient pas, s'agissant d'ONG et
 * d'institutions.
 */
export function LoginForm({
  locale,
  initialError,
  redirectTo,
}: {
  locale: string;
  initialError?: string;
  redirectTo?: string;
}) {
  const t = useTranslations("auth");
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [state, setState] = useState<State>(initialError ? "error" : "idle");
  const [message, setMessage] = useState(initialError ?? "");
  const statusRef = useRef<HTMLDivElement>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (state === "loading") return;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setState("error");
      setMessage(t("errorInvalid"));
      return;
    }

    setState("loading");

    try {
      const response = await fetch("/api/auth/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          locale,
          redirectTo,
          _website: honeypot,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setState("error");
        setMessage(
          response.status === 400
            ? t("errorInvalid")
            : (data?.error ?? t("errorGeneric")),
        );
        return;
      }

      setState("sent");
      // Le focus part sur la confirmation : sans lui, il retombe sur `<body>`
      // et un lecteur d'écran n'annonce rien du tout.
      requestAnimationFrame(() => statusRef.current?.focus());
    } catch {
      setState("error");
      setMessage(t("errorGeneric"));
    }
  }

  if (state === "sent") {
    return (
      <div
        ref={statusRef}
        tabIndex={-1}
        className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-8 outline-none"
      >
        <CheckCircle
          size={28}
          aria-hidden="true"
          className="text-[var(--color-emerald-ink)]"
        />
        <h2 className="mt-5 text-xl font-bold text-[var(--color-text)]">
          {t("sentTitle")}
        </h2>
        <p className="mt-3 leading-relaxed text-[var(--color-text-secondary)]">
          {t("sentBody")}
        </p>
        <p className="mt-4 text-sm leading-relaxed text-[var(--color-text-secondary)]">
          {t("sentHint")}
        </p>
        <button
          type="button"
          onClick={() => {
            setState("idle");
            setEmail("");
          }}
          className="mt-6 text-sm font-medium text-[var(--color-indigo)] hover:underline"
        >
          {t("retry")}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="max-w-md">
      {state === "error" && (
        <div
          role="alert"
          className="mb-6 flex gap-3 rounded-[var(--radius-md)] border border-[#DC2626]/25 bg-[#DC2626]/5 p-4"
        >
          <AlertCircle
            size={18}
            aria-hidden="true"
            className="mt-0.5 shrink-0 text-[#B91C1C]"
          />
          <p className="text-sm leading-relaxed text-[#7F1D1D]">{message}</p>
        </div>
      )}

      <Input
        id="email"
        label={t("emailLabel")}
        type="email"
        placeholder={t("emailPlaceholder")}
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          // Une frappe efface le bandeau rouge : la personne est en train de
          // corriger, lui laisser l'erreur sous les yeux n'aide pas.
          if (state === "error") setState("idle");
        }}
        maxLength={320}
        autoComplete="email"
        inputMode="email"
        required
      />

      {/* Honeypot — invisible, jamais rempli par un humain. Même dispositif
          que le formulaire de contact. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="_website">Ne pas remplir</label>
        <input
          id="_website"
          name="_website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      <div className="mt-7">
        {/* `loading` remplace l'icône par le spinner et désactive le bouton :
            le composant s'en charge, inutile de le doubler ici. */}
        <Button
          type="submit"
          size="lg"
          loading={state === "loading"}
          icon={<Mail size={17} aria-hidden="true" />}
        >
          {state === "loading" ? t("sending") : t("submit")}
        </Button>
      </div>

      <p className="mt-6 text-sm leading-relaxed text-[var(--color-text-secondary)]">
        {t("privacy")}
      </p>
    </form>
  );
}
