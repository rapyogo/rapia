"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ChoiceChips } from "@/components/ui/ChoiceChips";
import { Card } from "@/components/ui/Card";
import { Mail, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react";
import { COMPANY } from "@/lib/company";

type FormState = "idle" | "loading" | "success" | "error";

/** Ce que le serveur a refusé — chaque cas appelle une consigne différente. */
type ErrorKind = "generic" | "rateLimit" | "validation";

type FormData = {
  name: string;
  organization: string;
  email: string;
  phone: string;
  orgType: string;
  need: string;
  message: string;
  _website: string;
};

const initialFormData: FormData = {
  name: "",
  organization: "",
  email: "",
  phone: "",
  orgType: "",
  need: "",
  message: "",
  _website: "",
};

/**
 * Miroir de `MAX_LENGTHS` dans app/api/contact/route.ts. Le serveur reste
 * l'autorité — ces bornes évitent seulement au visiteur de rédiger un message
 * qui sera refusé après coup.
 */
const MAX = {
  name: 200,
  organization: 200,
  email: 320,
  phone: 50,
  message: 5000,
} as const;

/** Ordre de lecture du formulaire : détermine quel champ reçoit le focus. */
const FIELD_ORDER = ["name", "organization", "email", "message"] as const;

export default function ContactPage() {
  const t = useTranslations("contact");
  const locale = useLocale();
  /**
   * L'adresse affichée est celle d'où partent réellement les emails
   * (`lib/company.ts`), pas une clé de traduction. La page en affichait une
   * autre — `contact@rapyogo.com` — pendant que le pied de page, juste en
   * dessous, publiait `ia@rapyogo.com` : deux adresses sur le même écran, dont
   * une seule relevait ses messages. Une adresse e-mail n'est pas de la copy :
   * elle ne se traduit pas et ne se duplique pas.
   */
  const email = COMPANY.email;
  const orgTypes = t.raw("orgTypes") as string[];
  const needs = t.raw("needs") as string[];

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorKind, setErrorKind] = useState<ErrorKind>("generic");
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const fieldRefs = useRef<
    Partial<Record<string, HTMLInputElement | HTMLTextAreaElement | null>>
  >({});
  const successRef = useRef<HTMLDivElement>(null);

  // Le formulaire disparaît au succès : sans ce déplacement, le focus retombe
  // sur <body> et un utilisateur au clavier perd sa position dans la page.
  useEffect(() => {
    if (formState === "success") successRef.current?.focus();
  }, [formState]);

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = t("errors.name");
    }
    if (!formData.organization.trim()) {
      newErrors.organization = t("errors.organization");
    }
    if (!formData.email.trim()) {
      newErrors.email = t("errors.email");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t("errors.emailFormat");
    }
    if (!formData.message.trim()) {
      newErrors.message = t("errors.message");
    }

    setErrors(newErrors);

    // Signaler l'erreur ne suffit pas : sur mobile, le premier champ fautif est
    // souvent hors écran. On y emmène le visiteur.
    const firstInvalid = FIELD_ORDER.find((field) => newErrors[field]);
    if (firstInvalid) {
      fieldRefs.current[firstInvalid]?.focus();
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setFormState("loading");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        // 429 et 400 appellent des gestes opposés : attendre, ou corriger.
        // Les confondre sous « une erreur est survenue » pousse le visiteur à
        // réessayer aussitôt, ce qui échoue à nouveau.
        setErrorKind(
          res.status === 429
            ? "rateLimit"
            : res.status === 400
              ? "validation"
              : "generic",
        );
        setFormState("error");
        return;
      }

      setFormState("success");
      setFormData(initialFormData);
    } catch {
      setErrorKind("generic");
      setFormState("error");
    }
  };

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
    // Une frappe après un échec signifie que le visiteur corrige : le bandeau
    // rouge n'a plus lieu d'être affiché pendant qu'il retravaille sa saisie.
    if (formState === "error") setFormState("idle");
  };

  const errorMessage =
    errorKind === "rateLimit"
      ? t("errorRateLimit")
      : errorKind === "validation"
        ? t("errorValidation")
        : t("errorBody");

  return (
    <>
      <Header />
      <main id="main-content" className="pb-24 md:pb-0">
        <div className="section">
          <div className="container-site max-w-3xl">
            {/* Back link */}
            <a
              href={`/${locale}`}
              className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors mb-8"
            >
              <ArrowLeft size={16} />
              {t("backHome")}
            </a>

            <h1
              className="text-[var(--color-text)] mb-2 leading-[1.12] tracking-[-0.02em]"
              style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: "700" }}
            >
              {t("heading")}
            </h1>
            <p className="text-[var(--color-text-secondary)] text-lg mb-8">
              {t("subtitle")}
            </p>

            {/* Success state */}
            {formState === "success" && (
              <Card
                ref={successRef}
                tabIndex={-1}
                role="status"
                padding="lg"
                className="border-[var(--color-emerald)]/50 bg-[var(--color-emerald)]/5"
              >
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle
                    size={24}
                    className="text-[var(--color-emerald-ink)]"
                    aria-hidden="true"
                  />
                  <h2 className="text-lg font-semibold text-[var(--color-text)]">
                    {t("successTitle")}
                  </h2>
                </div>
                <p className="text-[var(--color-text-secondary)] mb-4">
                  {t("successBody")}.{" "}
                  {t("successConfirmation")}{" "}
                  <a
                    href={`mailto:${email}`}
                    className="text-[var(--color-indigo)] hover:underline"
                  >
                    {email}
                  </a>
                  .
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFormState("idle")}
                >
                  {t("sendAnother")}
                </Button>
              </Card>
            )}

            {/* Error state */}
            {formState === "error" && (
              <div
                role="alert"
                className="mb-6 flex items-start gap-3 rounded-[var(--radius-md)] bg-[var(--color-error-bg)] p-4 text-[var(--color-error)]"
              >
                <AlertCircle size={20} className="mt-0.5 shrink-0" aria-hidden="true" />
                <p className="text-sm leading-6">
                  {errorMessage}{" "}
                  {errorKind !== "rateLimit" && (
                    <>
                      <a href={`mailto:${email}`} className="font-semibold underline">
                        {email}
                      </a>
                      .
                    </>
                  )}
                </p>
              </div>
            )}

            {/* Form */}
            {formState !== "success" && (
              <form onSubmit={handleSubmit} noValidate className="space-y-6">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    id="name"
                    label={t("formLabels.name")}
                    placeholder={t("placeholders.name")}
                    value={formData.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    error={errors.name}
                    maxLength={MAX.name}
                    autoComplete="name"
                    fieldRef={(el) => {
                      fieldRefs.current.name = el;
                    }}
                    required
                  />
                  <Input
                    id="organization"
                    label={t("formLabels.organization")}
                    placeholder={t("placeholders.organization")}
                    value={formData.organization}
                    onChange={(e) => updateField("organization", e.target.value)}
                    error={errors.organization}
                    maxLength={MAX.organization}
                    autoComplete="organization"
                    fieldRef={(el) => {
                      fieldRefs.current.organization = el;
                    }}
                    required
                  />
                  <Input
                    id="email"
                    label={t("formLabels.email")}
                    type="email"
                    placeholder={t("placeholders.email")}
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    error={errors.email}
                    maxLength={MAX.email}
                    autoComplete="email"
                    inputMode="email"
                    fieldRef={(el) => {
                      fieldRefs.current.email = el;
                    }}
                    required
                  />
                  <Input
                    id="phone"
                    label={t("formLabels.phone")}
                    type="tel"
                    placeholder={t("placeholders.phone")}
                    value={formData.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    maxLength={MAX.phone}
                    autoComplete="tel"
                    inputMode="tel"
                    optionalLabel={t("optional")}
                  />
                </div>

                <ChoiceChips
                  legend={t("formLabels.orgType")}
                  options={orgTypes}
                  value={formData.orgType}
                  onChange={(value) => updateField("orgType", value)}
                  optionalLabel={t("optional")}
                />

                <ChoiceChips
                  legend={t("question")}
                  options={needs}
                  value={formData.need}
                  onChange={(value) => updateField("need", value)}
                  optionalLabel={t("optional")}
                />

                <Input
                  id="message"
                  label={t("formLabels.message")}
                  textarea
                  placeholder={t("placeholders.message")}
                  value={formData.message}
                  onChange={(e) => updateField("message", e.target.value)}
                  error={errors.message}
                  maxLength={MAX.message}
                  fieldRef={(el) => {
                    fieldRefs.current.message = el;
                  }}
                  required
                  rows={5}
                />

                <Button
                  variant="primary"
                  size="lg"
                  type="submit"
                  loading={formState === "loading"}
                  icon={formState !== "loading" ? <Mail size={18} /> : undefined}
                >
                  {formState === "loading" ? t("sending") : t("submitCta")}
                </Button>

                <p className="text-xs text-[var(--color-text-secondary)]">
                  {t("directEmail")}{" "}
                  <a
                    href={`mailto:${email}`}
                    className="text-[var(--color-indigo)] hover:underline font-medium"
                  >
                    {email}
                  </a>
                </p>
              </form>
            )}
          </div>
        </div>
      </main>
      <Footer />
      <MobileNav />
    </>
  );
}
