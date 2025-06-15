import { HeartHandshake } from "lucide-react";
import type React from "preact/compat";
import { Link } from "./components/Link";

const links = [
  { href: "/", label: "Home" },
  { href: "/my-story.html", label: "My Story" },
  { href: "/articles/index.html", label: "Articles" },
];

const Header = () => {
  return (
    <header className="border-b border-slate-700/50 backdrop-blur-sm bg-slate-900/50">
      <div className="max-w-4xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-sm text-white">
            Humanity 2030
          </Link>
          <div className="flex items-center gap-4">
            {links.map((link) => (
              <Link
                href={link.href}
                key={link.href}
                className="text-sm text-slate-400"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="text-sm text-slate-400">
            <Link
              href="/support.html"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-full transition-colors duration-200 shadow-sm hover:shadow-md"
            >
              <HeartHandshake className="w-4 h-4" />
              <span>Support My Work</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

const Footer = () => {
  return (
    <footer className="border-t border-slate-700/50 backdrop-blur-sm bg-slate-900/50">
      <div className="max-w-4xl mx-auto px-6 py-4">
        <div className="text-sm text-slate-400">2025</div>
      </div>
    </footer>
  );
};

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="max-w-4xl  w-full mx-auto px-6 pb-16 flex-grow">
          <main className="flex-grow p-4">{children}</main>
        </div>
        <Footer />
      </div>
    </div>
  );
};
