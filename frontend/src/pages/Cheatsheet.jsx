import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home as HomeIcon, Copy, Check } from "lucide-react";
import Nav from "@/site/Nav";
import Footer from "@/site/Footer";
import BackToTop from "@/site/BackToTop";
import { CHEATSHEETS } from "@/site/content";

function CopyBtn({ value, tid }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      type="button"
      data-testid={tid}
      onClick={async () => {
        try { await navigator.clipboard.writeText(value); setOk(true); setTimeout(() => setOk(false), 1400); } catch (_) { /* ignore */ }
      }}
      className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity text-[color:var(--ink-2)] hover:text-[color:var(--accent)] shrink-0"
      aria-label="Copy to clipboard"
    >
      {ok ? <Check size={13} /> : <Copy size={13} />}
    </button>
  );
}

export default function Cheatsheet() {
  const [active, setActive] = useState(CHEATSHEETS[0]?.key);

  useEffect(() => {
    document.title = "Cheatsheets · Java Hub Academy — Java, Spring, SQL, Git, DSA";
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const current = CHEATSHEETS.find((c) => c.key === active) || CHEATSHEETS[0];

  return (
    <main data-testid="cheatsheet-page" className="relative min-h-screen">
      <Nav />
      <section className="pt-28 sm:pt-32 lg:pt-40 pb-16 sm:pb-20 lg:pb-24">
        <div className="mx-auto max-w-[1200px] px-5 sm:px-8 lg:px-12">
          <nav aria-label="Breadcrumb" data-testid="breadcrumb-cheatsheet" className="crumb-trail flex flex-wrap items-center gap-2">
            <Link to="/" className="inline-flex items-center gap-1.5 hover:text-[color:var(--accent)] transition-colors">
              <HomeIcon size={12} /> Home
            </Link>
            <span aria-hidden>/</span>
            <span className="crumb-trail__current">Cheatsheets</span>
          </nav>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
            className="mt-6 font-serif-editorial text-4xl sm:text-5xl lg:text-6xl leading-[1.02] tracking-tight max-w-[22ch]"
          >
            Quick <em className="not-italic italic gradient-text">cheatsheets</em>. One screen. Ready in ten seconds.
          </motion.h1>
          <p className="mt-5 text-[color:var(--ink)]/80 max-w-[62ch] text-base sm:text-lg leading-relaxed">
            Bookmark this page. Pull it up during interviews, coding rounds and code reviews. Each sheet fits on one screen.
          </p>

          <div className="mt-10 flex flex-wrap gap-2">
            {CHEATSHEETS.map((c) => (
              <button
                key={c.key}
                data-testid={`cheat-tab-${c.key}`}
                onClick={() => setActive(c.key)}
                className={`px-4 py-2 rounded-full border font-mono-tech text-[11px] tracking-[0.2em] uppercase transition-all ${
                  active === c.key
                    ? "bg-[color:var(--ink)] text-[color:var(--bg)] border-[color:var(--ink)]"
                    : "bg-[color:var(--surface)] text-[color:var(--ink)] border-[color:var(--line-strong)] hover:border-[color:var(--accent)]"
                }`}
              >
                {c.title}
              </button>
            ))}
          </div>

          <motion.div
            key={current.key}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="mt-8 themed-card p-6 sm:p-8"
            data-testid={`cheat-panel-${current.key}`}
          >
            <h2 className="font-serif-editorial text-3xl sm:text-4xl leading-tight tracking-tight">
              {current.title}
            </h2>
            <p className="mt-2 text-[color:var(--ink)]/75">{current.intro}</p>
            <ul className="mt-6 divide-y divide-[color:var(--line)]">
              {current.rows.map(([label, value], i) => (
                <li key={i} className="group flex items-start gap-4 py-3">
                  <span className="font-mono-tech text-[10.5px] tracking-[0.2em] uppercase text-[color:var(--ink-2)] pt-0.5 w-8 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 sm:gap-6 w-full min-w-0">
                    <span className="sm:col-span-2 text-[15px] font-medium text-[color:var(--ink)]">{label}</span>
                    <code className="sm:col-span-3 font-mono-tech text-[13px] text-[color:var(--ink)]/85 break-words">{value}</code>
                  </div>
                  <CopyBtn value={`${label} — ${value}`} tid={`cheat-copy-${current.key}-${i}`} />
                </li>
              ))}
            </ul>
          </motion.div>

          <div className="section-nav-strip mt-14 max-w-[720px] mx-auto">
            <Link to="/blog" data-testid="cheat-nav-blog">
              <span className="inline-flex items-center gap-2">← Previous</span>
              <span className="text-[color:var(--ink)] font-body font-medium normal-case tracking-normal text-sm">Blog</span>
            </Link>
            <Link to="/#courses" data-testid="cheat-nav-courses" style={{ textAlign: "right" }}>
              <span className="text-[color:var(--ink)] font-body font-medium normal-case tracking-normal text-sm">Courses roadmap</span>
              <span className="inline-flex items-center gap-2">Next →</span>
            </Link>
          </div>
        </div>
      </section>
      <Footer />
      <BackToTop />
    </main>
  );
}
