"use client";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FOR_WHOM } from "@/lib/constants";
import { motion } from "framer-motion";
import { Building2, Heart, Landmark, User, ArrowRight } from "lucide-react";

const audienceIcons: Record<string, React.ComponentType<{ size?: number }>> = {
  Entreprises: Building2,
  ONG: Heart,
  Institutions: Landmark,
  Professionnels: User,
};

export function ForWhom() {
  return (
    <section className="section-padding" id="for-whom" aria-label="Pour qui">
      <div className="container-site">
        <SectionHeading
          title={FOR_WHOM.heading}
          subtitle={FOR_WHOM.subtitle}
          align="center"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FOR_WHOM.audiences.map((audience, i) => {
            const Icon = audienceIcons[audience.title] || User;
            return (
              <motion.div
                key={audience.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <Card
                  hover
                  padding="lg"
                  className="h-full flex flex-col text-center"
                >
                  <div className="w-14 h-14 mx-auto rounded-full bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] flex items-center justify-center mb-4">
                    <Icon size={24} />
                  </div>
                  <h3
                    className="text-[var(--color-on-background)] mb-2"
                    style={{
                      fontSize: "var(--font-headline-sm-size)",
                      fontWeight: "var(--font-headline-sm-weight)",
                    }}
                  >
                    {audience.title}
                  </h3>
                  <p className="text-sm text-[var(--color-on-surface-variant)] mb-6 flex-1">
                    {audience.description}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    href={audience.href}
                    icon={<ArrowRight size={14} />}
                    className="mx-auto"
                  >
                    {audience.cta}
                  </Button>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
