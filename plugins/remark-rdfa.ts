import type { Heading, Link, Root } from "mdast";
import { visit } from "unist-util-visit";

export function remarkRDFa() {
  return (tree: Root) => {
    let h1Found = false;
    visit(tree, "heading", (node: Heading) => {
      if (!h1Found && node.depth === 1) {
        node.data = node.data || {};
        const hProperties = (node.data.hProperties || {}) as Record<
          string,
          string
        >;
        hProperties.property = "schema:headline";
        node.data.hProperties = hProperties;
        h1Found = true;
      }
    });
    visit(tree, "link", (node: Link) => {
      if (
        node.url &&
        (node.url.startsWith("http://") || node.url.startsWith("https://"))
      ) {
        node.data = node.data || {};
        const hProperties = (node.data.hProperties || {}) as Record<
          string,
          string
        >;
        hProperties.rel = "nofollow";
        node.data.hProperties = hProperties;
      }
    });
  };
}
