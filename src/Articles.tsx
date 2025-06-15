import { usePageMeta } from "@/utils/metadata";
import { type Page, getAllPages } from "@/utils/pages";
import { ArrowRight } from "lucide-react";

interface ArticleItem {
  slug: string;
  title: string;
  date: string;
  description: string;
}

export const Articles = () => {
  usePageMeta({
    title: "Articles",
    description:
      "Insights and analysis on AI alignment, safety, and the future of humanity",
  });

  const allPages = getAllPages();
  const articles = allPages.filter((page: Page) =>
    page.slug.startsWith("articles/"),
  ) as ArticleItem[];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      <div className="mb-8">
        <h1>Articles</h1>
        <p>
          Insights and analysis on AI alignment, safety, and the future of
          humanity.
        </p>
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No articles published yet.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {articles.map((article) => (
            <article
              key={article.slug}
              className="border-b pb-8 last:border-b-0 last:pb-0"
            >
              <time
                dateTime={article.date}
                className="text-sm text-muted-foreground"
              >
                {formatDate(article.date)}
              </time>

              <h2 className="text-2xl font-semibold mt-2 mb-3">
                <a href={`/${article.slug}.html`}>{article.title}</a>
              </h2>

              {article.description && (
                <p className="mb-4">{article.description}</p>
              )}

              <a
                href={`/${article.slug}.html`}
                className="inline-flex items-center text-primary"
              >
                Read article
                <ArrowRight className="ml-2 w-4 h-4" />
              </a>
            </article>
          ))}
        </div>
      )}
    </>
  );
};
