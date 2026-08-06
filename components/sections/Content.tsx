import { useTranslations, useLocale } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

/**
 * RESSOURCES.
 *
 * **Aucun article fantôme.** La section entière disparaît tant que `ARTICLES`
 * est vide — un blog vide qui s'annonce fait plus de tort que pas de blog du
 * tout. Le rendu ci-dessous existe déjà pour que publier le premier article ne
 * demande qu'une entrée dans le tableau, sans redécider de la mise en page au
 * moment où le contenu arrive.
 *
 * Pour publier : ajouter les articles réels et rien d'autre. `category` doit
 * reprendre un libellé de `content.categories` (messages/*.json).
 */
interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  /** ISO 8601 — sert à la fois au tri et à l'attribut `dateTime`. */
  date: string;
  readingMinutes: number;
}

const ARTICLES: Article[] = [];

export function Content() {
  if (ARTICLES.length === 0) return null;

  return <ContentGrid articles={ARTICLES} />;
}

function ContentGrid({ articles }: { articles: Article[] }) {
  const t = useTranslations("content");
  const locale = useLocale();

  const sorted = [...articles].sort((a, b) => b.date.localeCompare(a.date));
  const dateFormat = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <section className="section" aria-label="Ressources">
      <div className="container-site">
        <div className="max-w-3xl">
          <h2
            className="text-[var(--color-text)] leading-[1.12] tracking-[-0.02em]"
            style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: "700" }}
          >
            {t("heading")}
          </h2>
          <p className="mt-5 text-lg leading-8 text-[var(--color-text-secondary)]">
            {t("subtitle")}
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* `relative` sur la carte ancre le pseudo-élément qui étend la zone
              cliquable du titre à la carte entière. */}
          {sorted.map((article) => (
            <Card
              key={article.slug}
              padding="none"
              hover
              className="relative flex flex-col"
            >
              <CardHeader>
                <Badge tone="indigo">{article.category}</Badge>
                <time
                  dateTime={article.date}
                  className="text-xs text-[var(--color-text-muted)]"
                >
                  {dateFormat.format(new Date(article.date))}
                </time>
              </CardHeader>
              <CardBody className="flex flex-1 flex-col">
                <h3 className="text-lg font-semibold leading-snug text-[var(--color-text)]">
                  <a
                    href={`/${locale}/ressources/${article.slug}`}
                    className="after:absolute after:inset-0 hover:text-[var(--color-indigo)] transition-colors"
                  >
                    {article.title}
                  </a>
                </h3>
                <p className="mt-2 flex-1 text-sm leading-6 text-[var(--color-text-secondary)]">
                  {article.excerpt}
                </p>
                <p className="mt-4 flex items-center gap-1.5 text-sm font-medium text-[var(--color-indigo)]">
                  {t("readMore")}
                  <ArrowUpRight size={15} aria-hidden="true" />
                  <span className="ml-auto text-xs font-normal text-[var(--color-text-muted)]">
                    {t("readingTime", { minutes: article.readingMinutes })}
                  </span>
                </p>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
