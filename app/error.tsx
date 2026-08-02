"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { Button } from "@/components/ui/Button";
import { AlertCircle, RotateCcw, Home } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <>
      <Header />
      <main className="flex-1 flex items-center justify-center section-padding min-h-[70vh]">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-error-container)] text-[var(--color-on-error-container)] mb-6">
            <AlertCircle size={28} />
          </div>
          <h1 className="text-2xl font-semibold text-[var(--color-on-background)] mb-3">
            Une erreur est survenue
          </h1>
          <p className="text-[var(--color-on-surface-variant)] mb-8">
            Quelque chose s'est mal passé. Veuillez réessayer ou revenir à
            l'accueil.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="primary"
              onClick={reset}
              icon={<RotateCcw size={16} />}
            >
              Réessayer
            </Button>
            <Button variant="ghost" href="/" icon={<Home size={16} />}>
              Retour à l'accueil
            </Button>
          </div>
        </div>
      </main>
      <Footer />
      <MobileNav />
    </>
  );
}
