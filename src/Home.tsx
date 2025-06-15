import { usePageMeta } from "@/utils/metadata";
import { getAllPages } from "@/utils/pages";
import type { Page } from "@/utils/pages";

interface ArticleItem {
  slug: string;
  title: string;
  date: string;
  description: string;
  wordCount: number;
}

const Hero = () => {
  return (
    <section className="relative py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-full text-red-300 text-sm mb-6">
            <div className="w-2 h-2 bg-red-400 rounded-full mr-2 animate-pulse" />
            Research from active conflict zone
          </div>

          <h1 className="text-6xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
              AI Alignment
            </span>
            <br />
            <span className="text-white">from the Edge</span>
          </h1>

          <p className="text-xl text-slate-300 max-w-4xl mx-auto leading-relaxed mb-8">
            Preparing humanity's value proposition for the post-AGI world.
            Independent research by an anonymous technical researcher working
            where existential threats are daily reality, not abstract concepts.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#research"
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105"
            >
              Explore Research
            </a>
            <a
              href="/manifesto.html"
              className="border border-slate-600 hover:border-slate-500 px-8 py-3 rounded-lg font-semibold transition-all hover:bg-slate-800/50"
            >
              Read Manifesto
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

const KeyInsight = () => {
  return (
    <section className="py-16 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6 text-white">
          The Central Question
        </h2>
        <blockquote className="text-2xl text-slate-300 italic leading-relaxed border-l-4 border-blue-400 pl-6 text-left">
          "What would we negotiate if ASI already controlled everything? We need
          to figure out our value proposition before we lose all leverage."
        </blockquote>
        <p className="text-slate-400 mt-6">
          Most AI safety research focuses on technical alignment. I'm working on
          the human side: what makes us worth keeping around?
        </p>
      </div>
    </section>
  );
};

const ResearchAreas = () => {
  const researchAreas = [
    {
      icon: "🧠",
      title: "AI Think Tank Development",
      description:
        "Experimental systems combining LLMs with graph memory to model human-AI cooperation scenarios.",
    },
    {
      icon: "🤝",
      title: "Value Proposition Research",
      description:
        "Identifying what humans can uniquely offer to ASI beyond resource consumption and interference.",
    },
    {
      icon: "⚡",
      title: "Rapid Prototyping",
      description:
        "Building and testing alignment frameworks before the window for human input closes.",
    },
    {
      icon: "🎯",
      title: "Ground Truth Perspective",
      description:
        "Insights from someone facing daily existential threats about AI existential risk.",
    },
  ];

  return (
    <section id="research" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6 text-white">
            Current Research
          </h2>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Practical frameworks for human-AI cooperation, built through direct
            experimentation and tested against the reality of asymmetric power
            dynamics.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {researchAreas.map((area) => (
            <div
              key={area.title}
              className="bg-slate-800/50 rounded-lg p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all group"
            >
              <div className="text-4xl mb-4">{area.icon}</div>
              <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-blue-400 transition-colors">
                {area.title}
              </h3>
              <p className="text-slate-400 leading-relaxed">
                {area.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const LatestResearch = () => {
  const allPages = getAllPages();
  const articles = allPages.filter((page: Page) =>
    page.slug.startsWith("articles/"),
  ) as ArticleItem[];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getReadTime = (wordCount: number) => {
    const readTime = Math.max(Math.ceil(wordCount / 200), 1);
    return `${readTime} min read`;
  };

  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-4xl font-bold text-white">Latest Research</h2>
          <a
            href="/articles/index.html"
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            View All Posts →
          </a>
        </div>

        {articles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400">No articles published yet.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {articles.slice(0, 3).map((article, index) => (
              <article
                key={article.slug}
                className={`bg-slate-800/50 rounded-lg overflow-hidden border border-slate-700/50 hover:border-slate-600/50 transition-all group ${index === 0 ? "md:col-span-2" : ""}`}
              >
                {index === 0 && (
                  <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 px-4 py-2 border-b border-slate-700/50">
                    <span className="text-yellow-400 text-sm font-semibold">
                      Featured
                    </span>
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-center gap-3 text-sm text-slate-400 mb-3">
                    <span>{formatDate(article.date)}</span>
                    <span>•</span>
                    <span>{getReadTime(article.wordCount)}</span>
                  </div>

                  <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-blue-400 transition-colors">
                    <a
                      href={`/${article.slug}.html`}
                      className="hover:underline"
                    >
                      {article.title}
                    </a>
                  </h3>

                  <p className="text-slate-300 leading-relaxed mb-4">
                    {article.description}
                  </p>

                  <a
                    href={`/${article.slug}.html`}
                    className="text-blue-400 hover:text-blue-300 transition-colors text-sm font-semibold"
                  >
                    Read Full Article →
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

const CallToAction = () => {
  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-6 text-white">
          The Clock Is Ticking
        </h2>
        <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
          Every day brings us closer to AGI. Every day we delay in preparing for
          that reality is a day we lose in developing the frameworks that might
          determine humanity's future.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <a
            href="/my-story.html"
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 px-8 py-4 rounded-lg font-semibold transition-all transform hover:scale-105"
          >
            Read My Story
          </a>
          <a
            href="/support.html"
            className="border border-slate-600 hover:border-slate-500 px-8 py-4 rounded-lg font-semibold transition-all hover:bg-slate-800/50"
          >
            Support This Research
          </a>
        </div>
      </div>
    </section>
  );
};

export const Home = () => {
  usePageMeta({
    title: "AI Alignment from the Edge",
    description:
      "Preparing humanity's value proposition for the post-AGI world. Independent research by an anonymous technical researcher working where existential threats are daily reality.",
  });

  return (
    <div className="min-h-screen text-white">
      <Hero />
      <KeyInsight />
      <ResearchAreas />
      <LatestResearch />
      <CallToAction />
    </div>
  );
};
