import { createHead } from "@unhead/ssr";
import { hydrate, prerender as ssr } from "preact-iso";
import { App } from "./App";
import "./styles.css";

if (typeof window !== "undefined") {
  const head = createHead();
  const app = document.getElementById("app");
  if (app) {
    hydrate(<App head={head} />, app);
  }
}

export async function prerender(data?: Record<string, unknown>) {
  const head = createHead();
  const result = await ssr(<App head={head} {...data} />);

  try {
    const { getAllPageLinks } = await import("./utils/pages");
    const pageLinks = getAllPageLinks();

    const elements = new Set();
    let htmlAttrs = {};
    let title = "";

    for (const [, entry] of head.entries.entries()) {
      const { input } = entry;

      if (input.htmlAttrs) {
        htmlAttrs = { ...htmlAttrs, ...input.htmlAttrs };
      }

      if (input.title && typeof input.title === "string") {
        title = input.title;
      }

      if (input.meta) {
        const metaTags = Array.isArray(input.meta) ? input.meta : [input.meta];
        for (const tag of metaTags) {
          if (tag) {
            elements.add({ type: "meta", props: tag });
          }
        }
      }
      if (input.script) {
        const scriptTags = Array.isArray(input.script)
          ? input.script
          : [input.script];
        for (const tag of scriptTags) {
          if (tag) {
            if (typeof tag === "object" && tag !== null) {
              const { innerHTML, ...rest } = tag as {
                innerHTML?: string;
                [key: string]: unknown;
              };
              elements.add({
                type: "script",
                props: { ...rest, children: innerHTML },
              });
            } else if (typeof tag === "string") {
              elements.add({ type: "script", props: { src: tag } });
            }
          }
        }
      }
    }

    return {
      ...result,
      links: new Set([...(result.links || []), ...pageLinks]),
      head: {
        htmlAttrs,
        title,
        elements,
      },
    };
  } catch (error) {
    return result;
  }
}
