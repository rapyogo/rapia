"use client";

import { useState, type FormEvent } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CONTACT } from "@/lib/constants";
import { Mail, CheckCircle, AlertCircle, ArrowLeft, Loader2 } from "lucide-react";

type FormState = "idle" | "loading" | "success" | "error";

type FormData = {
  name: string;
  organization: string;
  email: string;
  phone: string;
  orgType: string;
  need: string;
  message: string;
};

const initialFormData: FormData = {
  name: "",
  organization: "",
  email: "",
  phone: "",
  orgType: "",
  need: "",
  message: "",
};

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [formState, setFormState] = useState<FormState>("idle");
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Le nom est requis.";
    }
    if (!formData.organization.trim()) {
      newErrors.organization = "L'organisation est requise.";
    }
    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format d'email invalide.";
    }
    if (!formData.message.trim()) {
      newErrors.message = "Le message est requis.";
    }

    setErrors(newErrors);
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

      if (!res.ok) throw new Error("Erreur serveur");

      setFormState("success");
      setFormData(initialFormData);
    } catch {
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
  };

  return (
    <>
      <Header />
      <main id="main-content" className="pb-24 md:pb-0">
        <div className="section-padding">
          <div className="container-site max-w-3xl">
            {/* Back link */}
            <a
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-colors mb-8"
            >
              <ArrowLeft size={16} />
              Retour à l'accueil
            </a>

            <h1 className="text-[var(--color-on-background)] mb-2" style={{
              fontSize: "clamp(24px, 4vw, var(--font-headline-md-size))",
              fontWeight: "var(--font-headline-md-weight)",
              lineHeight: "var(--font-headline-md-line-height)",
            }}>
              {CONTACT.heading}
            </h1>
            {CONTACT.subtitle && (
              <p className="text-[var(--color-on-surface-variant)] mb-8" style={{
                fontSize: "var(--font-body-lg-size)",
                lineHeight: "var(--font-body-lg-line-height)",
              }}>
                {CONTACT.subtitle}
              </p>
            )}

            {/* Success state */}
            {formState === "success" && (
              <Card padding="lg" className="border-[var(--color-emerald)]/50 bg-[var(--color-emerald)]/5">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle size={24} className="text-[var(--color-emerald)]" />
                  <h2 className="text-lg font-semibold text-[var(--color-on-background)]">
                    Message envoyé avec succès
                  </h2>
                </div>
                <p className="text-[var(--color-on-surface-variant)] mb-4">
                  Merci pour votre message. Nous vous répondrons dans les 24h
                  à l'adresse{" "}
                  <a
                    href={`mailto:${CONTACT.email}`}
                    className="text-[var(--color-secondary)] hover:underline"
                  >
                    {CONTACT.email}
                  </a>
                  .
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFormState("idle")}
                >
                  Envoyer un autre message
                </Button>
              </Card>
            )}

            {/* Error state */}
            {formState === "error" && (
              <div className="mb-6 p-4 rounded-[4px] bg-[var(--color-error-container)] text-[var(--color-on-error-container)] flex items-center gap-3">
                <AlertCircle size={20} />
                <p className="text-sm">
                  Une erreur est survenue lors de l'envoi. Veuillez réessayer
                  ou nous contacter directement à{" "}
                  <a
                    href={`mailto:${CONTACT.email}`}
                    className="font-semibold underline"
                  >
                    {CONTACT.email}
                  </a>
                  .
                </p>
              </div>
            )}

            {/* Form */}
            {formState !== "success" && (
              <form onSubmit={handleSubmit} noValidate className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    id="name"
                    label={CONTACT.formLabels.name}
                    placeholder="Votre nom complet"
                    value={formData.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    error={errors.name}
                    required
                  />
                  <Input
                    id="organization"
                    label={CONTACT.formLabels.organization}
                    placeholder="Nom de votre organisation"
                    value={formData.organization}
                    onChange={(e) => updateField("organization", e.target.value)}
                    error={errors.organization}
                    required
                  />
                  <Input
                    id="email"
                    label={CONTACT.formLabels.email}
                    type="email"
                    placeholder="vous@organisation.cd"
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    error={errors.email}
                    required
                  />
                  <Input
                    id="phone"
                    label={CONTACT.formLabels.phone}
                    type="tel"
                    placeholder="+243 ..."
                    value={formData.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                  />
                </div>

                {/* Organization type */}
                <fieldset>
                  <legend className="text-sm font-medium text-[var(--color-on-surface)] mb-3">
                    {CONTACT.formLabels.orgType}
                  </legend>
                  <div className="flex flex-wrap gap-2">
                    {CONTACT.orgTypes.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => updateField("orgType", type)}
                        className={`px-4 py-2 text-sm rounded-[4px] border transition-all duration-200 ${
                          formData.orgType === type
                            ? "border-[var(--color-secondary)] bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] font-medium"
                            : "border-[var(--color-border-light)] text-[var(--color-on-surface-variant)] hover:border-[var(--color-secondary)]/50"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </fieldset>

                {/* Need */}
                <fieldset>
                  <legend className="text-sm font-medium text-[var(--color-on-surface)] mb-3">
                    {CONTACT.mainQuestion}
                  </legend>
                  <div className="flex flex-wrap gap-2">
                    {CONTACT.needs.map((need) => (
                      <button
                        key={need}
                        type="button"
                        onClick={() => updateField("need", need)}
                        className={`px-4 py-2 text-sm rounded-[4px] border transition-all duration-200 ${
                          formData.need === need
                            ? "border-[var(--color-secondary)] bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] font-medium"
                            : "border-[var(--color-border-light)] text-[var(--color-on-surface-variant)] hover:border-[var(--color-secondary)]/50"
                        }`}
                      >
                        {need}
                      </button>
                    ))}
                  </div>
                </fieldset>

                <Input
                  id="message"
                  label={CONTACT.formLabels.message}
                  textarea
                  placeholder="Décrivez votre besoin, votre projet ou vos questions..."
                  value={formData.message}
                  onChange={(e) => updateField("message", e.target.value)}
                  error={errors.message}
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
                  {formState === "loading" ? "Envoi en cours..." : CONTACT.submitCta}
                </Button>

                <p className="text-xs text-[var(--color-on-surface-variant)]">
                  Ou écrivez-nous directement à{" "}
                  <a
                    href={`mailto:${CONTACT.email}`}
                    className="text-[var(--color-secondary)] hover:underline font-medium"
                  >
                    {CONTACT.email}
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
