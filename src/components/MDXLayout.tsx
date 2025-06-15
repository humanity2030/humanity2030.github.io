import { usePageMeta, getMdxPageMeta } from "@/utils/metadata";
import { useMemo } from "preact/hooks";
import { useRoute } from "preact-iso";

interface MDXLayoutProps {
  children: React.ReactNode;
}

export const MDXLayout = ({ children }: MDXLayoutProps) => {
  const route = useRoute();
  
  const mdxMeta = useMemo(() => {
    const slug = route.path.replace(/^\//, '').replace(/\.html$/, '');
    return getMdxPageMeta(slug);
  }, [route.path]);
  
  usePageMeta(mdxMeta);

  return <article vocab="http://schema.org/" typeof="Article">{children}</article>;
}; 