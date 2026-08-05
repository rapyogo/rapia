"use client";

import { useState, type FormEvent } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Mail, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react";

type FormState = "idle" | "loading" | "success" | "error";

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

export default function ContactPage() {
  const t = useTranslations("contact");
  const locale = useLocale();
  const email = t("email");
  const orgTypes = t.raw("orgTypes") as string[];
  const needs = t.raw("needs") as string[];

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [formState, setFormState] = useState<FormState>("idle");
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

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
              <Card padding="lg" className="border-[var(--color-emerald)]/50 bg-[var(--color-emerald)]/5">
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle size={24} className="text-[var(--color-emerald)]" />
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
              <div className="mb-6 p-4 rounded-[var(--radius-md)] bg-[var(--color-error-bg)] text-[var(--color-error)] flex items-center gap-3">
                <AlertCircle size={20} />
                <p className="text-sm">
                  {t("errorBody")}{" "}
                  <a
                    href={`mailto:${email}`}
                    className="font-semibold underline"
                  >
                    {email}
                  </a>
                  .
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
                    required
                  />
                  <Input
                    id="organization"
                    label={t("formLabels.organization")}
                    placeholder={t("placeholders.organization")}
                    value={formData.organization}
                    onChange={(e) => updateField("organization", e.target.value)}
                    error={errors.organization}
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
                    required
                  />
                  <Input
                    id="phone"
                    label={t("formLabels.phone")}
                    type="tel"
                    placeholder={t("placeholders.phone")}
                    value={formData.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                  />
                </div>

                {/* Organization type */}
                <fieldset>
                  <legend className="text-sm font-medium text-[var(--color-text)] mb-3">
                    {t("formLabels.orgType")}
                  </legend>
                  <div className="flex flex-wrap gap-2">
                    {orgTypes.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => updateField("orgType", type)}
                        className={`px-4 py-2 text-sm rounded-[var(--radius-md)] border transition-all duration-200 ${
                          formData.orgType === type
                            ? "border-[var(--color-indigo)] bg-[var(--color-indigo)]/10 text-[var(--color-indigo)] font-medium"
                            : "border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-indigo)]/50"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </fieldset>

                {/* Need */}
                <fieldset>
                  <legend className="text-sm font-medium text-[var(--color-text)] mb-3">
                    {t("question")}
                  </legend>
                  <div className="flex flex-wrap gap-2">
                    {needs.map((need) => (
                      <button
                        key={need}
                        type="button"
                        onClick={() => updateField("need", need)}
                        className={`px-4 py-2 text-sm rounded-[var(--radius-md)] border transition-all duration-200 ${
                          formData.need === need
                            ? "border-[var(--color-indigo)] bg-[var(--color-indigo)]/10 text-[var(--color-indigo)] font-medium"
                            : "border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-indigo)]/50"
                        }`}
                      >
                        {need}
                      </button>
                    ))}
                  </div>
                </fieldset>

                <Input
                  id="message"
                  label={t("formLabels.message")}
                  textarea
                  placeholder={t("placeholders.message")}
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
