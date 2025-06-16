import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import type { Plugin } from "vite";
import { siteConfig } from "../src/utils/metadata";
import { pages, staticPages } from "../src/utils/pages";

function getArticlePages() {
  return pages
    .filter((page) => page.slug.startsWith("articles/"))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

function getAllPagesForSitemap() {
  // staticPages already includes .html in path, pages need .html
  return [
    ...pages.map((page) => ({
      loc: `${siteConfig.url}/${page.slug}.html`,
      lastmod: page.date || new Date().toISOString(),
    })),
    ...staticPages.map((page) => ({
      loc: `${siteConfig.url}${page.path}`,
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
  return `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n<channel>\n<title>${siteConfig.title} Articles</title>\n<link>${siteConfig.url}/articles/</link>\n<description>Latest articles from ${siteConfig.title}</description>\n${articles.map((a) => `<item>\n<title>${a.title}</title>\n<link>${siteConfig.url}/${a.slug}.html</link>\n<guid>${siteConfig.url}/${a.slug}.html</guid>\n<pubDate>${new Date(a.date).toUTCString()}</pubDate>\n<description><![CDATA[${a.description || ""}]]></description>\n</item>`).join("\n")}\n</channel>\n</rss>`;
}

function renderAtomXml() {
  const articles = getArticlePages();
  return `<?xml version="1.0" encoding="utf-8"?>\n<feed xmlns="http://www.w3.org/2005/Atom">\n<title>${siteConfig.title} Articles</title>\n<link href="${siteConfig.url}/articles/"/>\n<updated>${new Date().toISOString()}</updated>\n<id>${siteConfig.url}/</id>\n${articles.map((a) => `<entry>\n<title>${a.title}</title>\n<link href="${siteConfig.url}/${a.slug}.html"/>\n<id>${siteConfig.url}/${a.slug}.html</id>\n<updated>${new Date(a.date).toISOString()}</updated>\n<summary><![CDATA[${a.description || ""}]]></summary>\n</entry>`).join("\n")}\n</feed>`;
}

function renderJsonFeed() {
  const articles = getArticlePages();
  return JSON.stringify(
    {
      version: "https://jsonfeed.org/version/1",
      title: `${siteConfig.title} Articles`,
      home_page_url: `${siteConfig.url}/articles/`,
      feed_url: `${siteConfig.url}/feed.json`,
      items: articles.map((a) => ({
        id: `${siteConfig.url}/${a.slug}.html`,
        url: `${siteConfig.url}/${a.slug}.html`,
        title: a.title,
        content_text: a.description || "",
        date_published: a.date,
      })),
    },
    null,
    2,
  );
}

function renderRobotsTxt() {
  return `User-agent: *
Allow: /

Sitemap: ${siteConfig.url}/sitemap.xml`;
}

function renderLlmsTxt() {
  const articles = getArticlePages();
  const recentArticles = articles.slice(0, 8); // Get the 8 most recent articles

  return `# ${siteConfig.title}

> ${siteConfig.description}

## Key Pages

- [Home](${siteConfig.url}/): Home page with latest updates
- [Articles](${siteConfig.url}/articles/index.html): Complete collection of research articles and posts
- [My Story](${siteConfig.url}/my-story.html): A brief story about my journey and why I'm doing this
- [Manifesto](${siteConfig.url}/manifesto.html): Will you be AI's friend or become a paperclip? A manifesto for the project
- [Support](${siteConfig.url}/support.html): Information about supporting this research and project

## Recent Articles

${recentArticles.map((article) => `- [${article.title}](${siteConfig.url}/${article.slug}.html): ${article.description || `Research article published ${article.date}`}`).join("\n")}
`;
}

// Vite plugin: generates sitemap.xml, rss.xml, atom.xml, feed.json in dist/ after build
export function feedGenerator(): Plugin {
  return {
    name: "vite-plugin-feed-generator",
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
      // Write robots.txt
      await writeFile(
        resolve(process.cwd(), "dist", "robots.txt"),
        renderRobotsTxt(),
      );
      // Write llms.txt
      await writeFile(
        resolve(process.cwd(), "dist", "llms.txt"),
        renderLlmsTxt(),
      );
      console.log(
        "✅ Generated sitemap.xml, rss.xml, atom.xml, feed.json, robots.txt, llms.txt in dist/",
      );
    },
  };
}
