import { SITE } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="bg-[var(--color-deep)] text-white border-t border-white/[0.06]">
      <div className="container-site py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Marque */}
          <div className="md:col-span-1">
            <a href="/" className="inline-flex items-center gap-2 font-bold text-xl text-white mb-4">
              <img src="/rapia-mark.svg" alt="" className="w-7 h-7" aria-hidden="true" />
              RAPIA
            </a>
            <p className="text-sm text-white/40 leading-relaxed">{SITE.tagline}</p>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-white/30 uppercase tracking-[0.1em] mb-5">Services</h3>
            <ul className="space-y-2.5">
              <li><a href="/#services" className="text-sm text-white/50 hover:text-white transition-colors">Conseil IA</a></li>
              <li><a href="/#academy" className="text-sm text-white/50 hover:text-white transition-colors">Formation IA</a></li>
              <li><a href="/#services" className="text-sm text-white/50 hover:text-white transition-colors">Implémentation IA</a></li>
              <li><a href="/#services" className="text-sm text-white/50 hover:text-white transition-colors">Automatisation</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-white/30 uppercase tracking-[0.1em] mb-5">En savoir plus</h3>
            <ul className="space-y-2.5">
              <li><a href="/#why-rapia" className="text-sm text-white/50 hover:text-white transition-colors">À propos</a></li>
              <li><a href="/#academy" className="text-sm text-white/50 hover:text-white transition-colors">RAPIA Academy</a></li>
              <li><a href="/contact" className="text-sm text-white/50 hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-white/30 uppercase tracking-[0.1em] mb-5">Contact</h3>
            <ul className="space-y-2.5">
              <li><a href={`mailto:${SITE.email}`} className="text-sm text-white/50 hover:text-[var(--color-amber)] transition-colors">{SITE.email}</a></li>
              <li className="text-sm text-white/40">{SITE.location}</li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/30">&copy; {new Date().getFullYear()} RAPIA. Tous droits réservés.</p>
          <p className="text-xs text-white/30">{SITE.tagline}</p>
        </div>
      </div>
    </footer>
  );
}
