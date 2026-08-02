"use client";

import { CTABanner } from "@/components/ui/CTABanner";
import { FINAL_CTA } from "@/lib/constants";
import { motion } from "framer-motion";

export function FinalCTA() {
  return (
    <section className="section-padding" id="contact-cta" aria-label="Appel à l'action final">
      <div className="container-site">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <CTABanner
            title={FINAL_CTA.title}
            text={FINAL_CTA.text}
            primaryCta={FINAL_CTA.primaryCta}
            primaryHref="/contact"
            secondaryCta={FINAL_CTA.secondaryCta}
            secondaryHref="/contact"
            variant="deep"
          />
        </motion.div>
      </div>
    </section>
  );
}
