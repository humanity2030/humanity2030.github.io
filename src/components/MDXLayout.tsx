import { getMdxPageMeta, usePageMeta } from "@/utils/metadata";
import { useRoute } from "preact-iso";
import { useMemo } from "preact/hooks";

interface MDXLayoutProps {
  children: React.ReactNode;
}

export const MDXLayout = ({ children }: MDXLayoutProps) => {
  const route = useRoute();

  const mdxMeta = useMemo(() => {
    const slug = route.path.replace(/^\//, "").replace(/\.html$/, "");
    return getMdxPageMeta(slug);
  }, [route.path]);

  usePageMeta(mdxMeta);

  return (
    <article vocab="http://schema.org/" typeof="Article">
      {children}
    </article>
  );
};
