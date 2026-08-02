import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex-1 flex items-center justify-center section-padding min-h-[70vh]">
        <div className="text-center max-w-md">
          <p className="text-6xl font-bold text-[var(--color-secondary)]/20 mb-4">404</p>
          <h1 className="text-2xl font-semibold text-[var(--color-on-background)] mb-3">
            Page introuvable
          </h1>
          <p className="text-[var(--color-on-surface-variant)] mb-8">
            La page que vous recherchez n'existe pas ou a été déplacée.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="primary" href="/" icon={<Home size={16} />}>
              Retour à l'accueil
            </Button>
            <Button variant="ghost" href="/contact">
              Nous contacter
            </Button>
          </div>
        </div>
      </main>
      <Footer />
      <MobileNav />
    </>
  );
}
