"use client";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { SOCIAL_PROOF } from "@/lib/constants";
import { motion } from "framer-motion";
import { Quote, Users, TrendingUp } from "lucide-react";

export function SocialProof() {
  return (
    <section
      className="section-padding bg-[var(--color-surface-container-low)]"
      id="social-proof"
      aria-label="Témoignages et preuves"
    >
      <div className="container-site">
        <SectionHeading
          title={SOCIAL_PROOF.heading}
          subtitle={SOCIAL_PROOF.subtitle}
          align="center"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Placeholder — Témoignage 1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4, delay: 0 }}
          >
            <Card padding="lg" className="h-full">
              <Quote size={24} className="text-[var(--color-secondary)]/30 mb-4" />
              <blockquote className="text-sm text-[var(--color-on-surface-variant)] italic mb-4 leading-relaxed">
                &ldquo;Votre témoignage ici. Partagez comment RAPIA a transformé
                votre organisation grâce à l'intelligence artificielle.&rdquo;
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--color-surface-container)] flex items-center justify-center text-xs text-[var(--color-on-surface-variant)]">
                  <Users size={16} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--color-on-surface)]">
                    Nom du client
                  </p>
                  <p className="text-xs text-[var(--color-on-surface-variant)]">
                    Organisation
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Placeholder — Témoignage 2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <Card padding="lg" className="h-full">
              <Quote size={24} className="text-[var(--color-secondary)]/30 mb-4" />
              <blockquote className="text-sm text-[var(--color-on-surface-variant)] italic mb-4 leading-relaxed">
                &ldquo;Votre témoignage ici. Racontez comment la formation RAPIA
                a amélioré les compétences de votre équipe.&rdquo;
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--color-surface-container)] flex items-center justify-center text-xs text-[var(--color-on-surface-variant)]">
                  <Users size={16} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--color-on-surface)]">
                    Nom du client
                  </p>
                  <p className="text-xs text-[var(--color-on-surface-variant)]">
                    Organisation
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Placeholder — Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Card padding="lg" className="h-full">
              <TrendingUp size={24} className="text-[var(--color-secondary)]/30 mb-4" />
              <div className="space-y-6">
                <div>
                  <p className="text-3xl font-bold text-[var(--color-secondary)]">
                    —
                  </p>
                  <p className="text-xs text-[var(--color-on-surface-variant)] mt-1">
                    Projets réalisés
                  </p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-[var(--color-secondary)]">
                    —
                  </p>
                  <p className="text-xs text-[var(--color-on-surface-variant)] mt-1">
                    Professionnels formés
                  </p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-[var(--color-secondary)]">
                    —
                  </p>
                  <p className="text-xs text-[var(--color-on-surface-variant)] mt-1">
                    Organisations accompagnées
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
