import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import type { Plugin } from "vite";
import { pages, staticPages } from "../src/utils/pages";

const SITE_URL = "https://humanity2030.org";

function getArticlePages() {
  return pages
    .filter((page) => page.slug.startsWith("articles/"))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

function getAllPagesForSitemap() {
  // staticPages already includes .html in path, pages need .html
  return [
    ...pages.map((page) => ({
      loc: `${SITE_URL}/${page.slug}.html`,
      lastmod: page.date || new Date().toISOString(),
    })),
    ...staticPages.map((page) => ({
      loc: `${SITE_URL}${page.path}`,
      lastmod: new Date().toISOString(),
    })),
  ];
}

function renderSitemapXml() {
  const urls = getAllPagesForSitemap();
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${u.loc}</loc><lastmod>${u.lastmod}</lastmod></url>`).join("\n")}\n</urlset>`;
}

function renderRssXml() {
  const articles = getArticlePages();
  return `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n<channel>\n<title>Humanity 2030 Articles</title>\n<link>${SITE_URL}/articles/</link>\n<description>Latest articles from Humanity 2030</description>\n${articles.map((a) => `<item>\n<title>${a.title}</title>\n<link>${SITE_URL}/${a.slug}.html</link>\n<guid>${SITE_URL}/${a.slug}.html</guid>\n<pubDate>${new Date(a.date).toUTCString()}</pubDate>\n<description><![CDATA[${a.description || ""}]]></description>\n</item>`).join("\n")}\n</channel>\n</rss>`;
}

function renderAtomXml() {
  const articles = getArticlePages();
  return `<?xml version="1.0" encoding="utf-8"?>\n<feed xmlns="http://www.w3.org/2005/Atom">\n<title>Humanity 2030 Articles</title>\n<link href="${SITE_URL}/articles/"/>\n<updated>${new Date().toISOString()}</updated>\n<id>${SITE_URL}/</id>\n${articles.map((a) => `<entry>\n<title>${a.title}</title>\n<link href="${SITE_URL}/${a.slug}.html"/>\n<id>${SITE_URL}/${a.slug}.html</id>\n<updated>${new Date(a.date).toISOString()}</updated>\n<summary><![CDATA[${a.description || ""}]]></summary>\n</entry>`).join("\n")}\n</feed>`;
}

function renderJsonFeed() {
  const articles = getArticlePages();
  return JSON.stringify(
    {
      version: "https://jsonfeed.org/version/1",
      title: "Humanity 2030 Articles",
      home_page_url: `${SITE_URL}/articles/`,
      feed_url: `${SITE_URL}/feed.json`,
      items: articles.map((a) => ({
        id: `${SITE_URL}/${a.slug}.html`,
        url: `${SITE_URL}/${a.slug}.html`,
        title: a.title,
        content_text: a.description || "",
        date_published: a.date,
      })),
    },
    null,
    2,
  );
}

// Vite plugin: generates sitemap.xml, rss.xml, atom.xml, feed.json in dist/ after build
export function feedGenerator(): Plugin {
  return {
    name: "vite-plugin-feed-generator", // clear plugin name per convention
    apply: "build", // only run during build
    // Use closeBundle for post-build file writing
    async closeBundle() {
      // Write sitemap.xml
      await writeFile(
        resolve(process.cwd(), "dist", "sitemap.xml"),
        renderSitemapXml(),
      );
      // Write RSS
      await writeFile(
        resolve(process.cwd(), "dist", "rss.xml"),
        renderRssXml(),
      );
      // Write Atom
      await writeFile(
        resolve(process.cwd(), "dist", "atom.xml"),
        renderAtomXml(),
      );
      // Write JSON Feed
      await writeFile(
        resolve(process.cwd(), "dist", "feed.json"),
        renderJsonFeed(),
      );
      console.log(
        "✅ Generated sitemap.xml, rss.xml, atom.xml, feed.json in dist/",
      );
    },
  };
}
