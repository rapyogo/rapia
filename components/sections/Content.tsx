"use client";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CONTENT_SECTION } from "@/lib/constants";
import { motion } from "framer-motion";
import { ArrowRight, FileText, Calendar } from "lucide-react";

const articlePlaceholders = [
  {
    title: "Comprendre l'intelligence artificielle en 2026",
    category: "Intelligence artificielle",
    date: "À venir",
  },
  {
    title: "Comment automatiser vos processus sans coder",
    category: "Automatisation",
    date: "À venir",
  },
  {
    title: "Les agents IA : la prochaine révolution",
    category: "Agents IA",
    date: "À venir",
  },
  {
    title: "IA et productivité : ce que les données montrent",
    category: "Productivité",
    date: "À venir",
  },
  {
    title: "L'essor de l'IA en Afrique : état des lieux",
    category: "IA en Afrique",
    date: "À venir",
  },
  {
    title: "Former son équipe à l'IA : par où commencer",
    category: "Formation",
    date: "À venir",
  },
];

const categoryColors: Record<string, "indigo" | "amber" | "emerald" | "deep"> = {
  "Intelligence artificielle": "indigo",
  "Automatisation": "amber",
  "Agents IA": "deep",
  "Productivité": "emerald",
  "IA en Afrique": "amber",
  "Formation": "indigo",
};

export function Content() {
  return (
    <section className="section-padding" id="content" aria-label="Articles et ressources">
      <div className="container-site">
        <SectionHeading
          title={CONTENT_SECTION.heading}
          subtitle={CONTENT_SECTION.subtitle}
          align="center"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articlePlaceholders.map((article, i) => (
            <motion.div
              key={article.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <Card hover padding="md" className="h-full flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <Badge color={categoryColors[article.category] || "indigo"}>
                    {article.category}
                  </Badge>
                </div>
                <div className="flex items-start gap-3 flex-1">
                  <FileText
                    size={20}
                    className="text-[var(--color-secondary)]/40 mt-0.5 flex-shrink-0"
                  />
                  <h3 className="text-[var(--color-on-surface)] font-medium leading-snug">
                    {article.title}
                  </h3>
                </div>
                <div className="mt-4 pt-4 border-t border-[var(--color-border-light)] flex items-center gap-1.5 text-xs text-[var(--color-on-surface-variant)]">
                  <Calendar size={12} />
                  <span>{article.date}</span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Categories */}
        <motion.div
          className="flex flex-wrap justify-center gap-2 mt-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          {CONTENT_SECTION.categories.map((cat) => (
            <Badge key={cat} color={categoryColors[cat] || "neutral"}>
              {cat}
            </Badge>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
