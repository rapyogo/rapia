import { SITE } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="bg-[var(--color-surface-container)] border-t border-[var(--color-border-light)]">
      <div className="container-site py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Marque */}
          <div className="md:col-span-1">
            <a
              href="/"
              className="inline-block font-bold text-xl text-[var(--color-deep-profond)] mb-3"
            >
              RAPIA
            </a>
            <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
              {SITE.tagline}
            </p>
          </div>

          {/* Liens */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--color-on-surface)] mb-4 uppercase tracking-[0.05em]">
              Services
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/#services"
                  className="text-sm text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-colors"
                >
                  Conseil IA
                </a>
              </li>
              <li>
                <a
                  href="/#academy"
                  className="text-sm text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-colors"
                >
                  Formation IA
                </a>
              </li>
              <li>
                <a
                  href="/#services"
                  className="text-sm text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-colors"
                >
                  Implémentation IA
                </a>
              </li>
              <li>
                <a
                  href="/#services"
                  className="text-sm text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-colors"
                >
                  Automatisation
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[var(--color-on-surface)] mb-4 uppercase tracking-[0.05em]">
              En savoir plus
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/#why-rapia"
                  className="text-sm text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-colors"
                >
                  À propos
                </a>
              </li>
              <li>
                <a
                  href="/#academy"
                  className="text-sm text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-colors"
                >
                  RAPIA Academy
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="text-sm text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)] transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-[var(--color-on-surface)] mb-4 uppercase tracking-[0.05em]">
              Contact
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href={`mailto:${SITE.email}`}
                  className="text-sm text-[var(--color-on-surface-variant)] hover:text-[var(--color-secondary)] transition-colors"
                >
                  {SITE.email}
                </a>
              </li>
              <li className="text-sm text-[var(--color-on-surface-variant)]">
                {SITE.location}
              </li>
            </ul>
          </div>
        </div>

        {/* Bas */}
        <div className="mt-12 pt-6 border-t border-[var(--color-border-light)] flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-[var(--color-on-surface-variant)]">
            &copy; {new Date().getFullYear()} RAPIA. Tous droits réservés.
          </p>
          <p className="text-xs text-[var(--color-on-surface-variant)]">
            {SITE.tagline}
          </p>
        </div>
      </div>
    </footer>
  );
}
