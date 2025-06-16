import { ArticleMeta } from "@/components/ArticleMeta";
import { getMdxPageMeta, siteConfig, usePageMeta } from "@/utils/metadata";
import { getPageBySlug } from "@/utils/pages";
import { useRoute } from "preact-iso";
import { useMemo } from "preact/hooks";

interface MDXLayoutProps {
  children: React.ReactNode;
}

export const MDXLayout = ({ children }: MDXLayoutProps) => {
  const route = useRoute();

  const { mdxMeta, pageData } = useMemo(() => {
    const slug = route.path.replace(/^\//, "").replace(/\.html$/, "");
    const meta = getMdxPageMeta(slug);
    const page = getPageBySlug(slug);
    return { mdxMeta: meta, pageData: page };
  }, [route.path]);

  usePageMeta(mdxMeta);

  const isArticle = pageData?.slug.startsWith("articles/");
  const fullUrl = `${siteConfig.url}${route.path}`;

  return (
    <article vocab="http://schema.org/" typeof="Article">
      {isArticle && pageData && (
        <header className="pb-6 border-b border-gray-200 dark:border-gray-700">
          <ArticleMeta
            publishDate={pageData.date}
            wordCount={pageData.wordCount}
            title={pageData.title}
            url={fullUrl}
          />
        </header>
      )}

      {children}
    </article>
  );
};
