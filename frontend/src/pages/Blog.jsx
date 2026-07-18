import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight, BookOpen, Home as HomeIcon,
  LayoutGrid, Table as TableIcon, Calendar as CalendarIcon,
  ChevronLeft, ChevronRight,
} from "lucide-react";
import Nav from "@/site/Nav";
import Footer from "@/site/Footer";
import BackToTop from "@/site/BackToTop";
import { BLOG_POSTS } from "@/site/content";

function Crumb() {
  return (
    <nav aria-label="Breadcrumb" data-testid="breadcrumb-blog" className="crumb-trail flex flex-wrap items-center gap-2">
      <Link to="/" className="inline-flex items-center gap-1.5 hover:text-[color:var(--accent)] transition-colors">
        <HomeIcon size={12} /> Home
      </Link>
      <span aria-hidden>/</span>
      <span className="crumb-trail__current">Blog</span>
    </nav>
  );
}

const VIEWS = [
  { key: "grid", label: "Grid", Icon: LayoutGrid },
  { key: "table", label: "Table", Icon: TableIcon },
  { key: "calendar", label: "Calendar", Icon: CalendarIcon },
];

export default function Blog() {
  const [view, setView] = useState(() => {
    try { return localStorage.getItem("jha-blog-view") || "grid"; } catch (_) { return "grid"; }
  });
  useEffect(() => {
    try { localStorage.setItem("jha-blog-view", view); } catch (_) {}
  }, [view]);

  useEffect(() => {
    document.title = "Blog · Java Hub Academy — plain-English guides for Java backend engineers";
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <main data-testid="blog-page" className="relative min-h-screen">
      <Nav />
      <section className="pt-28 sm:pt-32 lg:pt-40 pb-16 sm:pb-20 lg:pb-24">
        <div className="mx-auto max-w-[1200px] px-5 sm:px-8 lg:px-12">
          <Crumb />
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
            className="mt-6 font-serif-editorial text-4xl sm:text-5xl lg:text-6xl leading-[1.02] tracking-tight max-w-[22ch]"
          >
            The <em className="not-italic italic gradient-text">blog</em>. Plain-English guides for Java backend engineers.
          </motion.h1>
          <p className="mt-5 text-[color:var(--ink)]/80 max-w-[62ch] text-base sm:text-lg leading-relaxed">
            Short, opinionated notes on Java, Spring Boot, databases, cloud, and how to land your first offer. Written by mentors who still ship production code.
          </p>

          {/* View switcher */}
          <div className="mt-8 flex items-center justify-between flex-wrap gap-3">
            <div className="inline-flex items-center rounded-full border border-[color:var(--line-strong)] p-1" role="tablist" aria-label="Blog view">
              {VIEWS.map(({ key, label, Icon }) => (
                <button
                  key={key}
                  role="tab"
                  aria-selected={view === key}
                  data-testid={`blog-view-${key}`}
                  onClick={() => setView(key)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-mono-tech tracking-[0.24em] uppercase transition-colors ${
                    view === key
                      ? "bg-[color:var(--ink)] text-[color:var(--bg)]"
                      : "text-[color:var(--ink-2)] hover:text-[color:var(--ink)]"
                  }`}
                >
                  <Icon size={12} /> {label}
                </button>
              ))}
            </div>
            <div className="text-[11px] font-mono-tech tracking-[0.24em] uppercase text-[color:var(--ink-2)]">
              {BLOG_POSTS.length} {BLOG_POSTS.length === 1 ? "post" : "posts"}
            </div>
          </div>

          {BLOG_POSTS.length === 0 ? (
            <EmptyState />
          ) : view === "grid" ? (
            <GridView />
          ) : view === "table" ? (
            <TableView />
          ) : (
            <CalendarView />
          )}

          <div className="section-nav-strip mt-16 max-w-[720px] mx-auto">
            <Link to="/" data-testid="blog-nav-home">
              <span className="inline-flex items-center gap-2">← Back</span>
              <span className="text-[color:var(--ink)] font-body font-medium normal-case tracking-normal text-sm">Home</span>
            </Link>
            <Link to="/cheatsheet" data-testid="blog-nav-cheatsheet" style={{ textAlign: "right" }}>
              <span className="text-[color:var(--ink)] font-body font-medium normal-case tracking-normal text-sm">Cheatsheets</span>
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

function EmptyState() {
  return (
    <div className="mt-14 themed-card p-10 text-center">
      <div className="mx-auto w-12 h-12 grid place-items-center rounded-full border border-[color:var(--line-strong)] mb-3">
        <BookOpen size={18} className="text-[color:var(--accent)]" />
      </div>
      <p className="font-serif-editorial text-2xl leading-tight">No posts published yet.</p>
      <p className="mt-2 text-[color:var(--ink-2)] text-sm">
        Write one in the editor and paste the exported JSON into <code className="px-1 py-0.5 rounded border border-[color:var(--line-strong)] font-mono-tech text-[12px]">content.js → BLOG_POSTS</code>.
      </p>
      <Link to="/admin/editor" data-testid="empty-open-editor" className="btn-crisp gloss text-sm mt-5 inline-flex items-center gap-2">
        Open editor <ArrowRight size={14}/>
      </Link>
    </div>
  );
}

function GridView() {
  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
      {BLOG_POSTS.map((p, i) => (
        <motion.article
          key={p.slug}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, delay: i * 0.06 }}
          className="themed-card p-6 sm:p-7 flex flex-col"
          data-testid={`blog-card-${p.slug}`}
        >
          <div className="flex items-center gap-2 font-mono-tech text-[10.5px] tracking-[0.24em] uppercase text-[color:var(--ink-2)]">
            <BookOpen size={12} className="text-[color:var(--accent)]" />
            {p.tag}
            <span aria-hidden>·</span>
            {p.read}
          </div>
          <h2 className="mt-3 font-serif-editorial text-2xl sm:text-3xl tracking-tight leading-tight">
            {p.title}
          </h2>
          <p className="mt-3 text-[color:var(--ink)]/80 text-[15px] leading-relaxed">{p.excerpt}</p>
          <Link
            to={`/blog/${p.slug}`}
            data-testid={`blog-read-${p.slug}`}
            className="mt-5 inline-flex items-center gap-2 font-mono-tech text-[11px] tracking-[0.24em] uppercase text-[color:var(--accent)] hover:gap-3 transition-all"
          >
            Read the post <ArrowRight size={14} />
          </Link>
        </motion.article>
      ))}
    </div>
  );
}

function TableView() {
  return (
    <div className="mt-8 overflow-x-auto themed-card p-2 sm:p-3">
      <table className="min-w-full text-sm" data-testid="blog-table">
        <thead>
          <tr className="text-left font-mono-tech text-[10.5px] tracking-[0.24em] uppercase text-[color:var(--ink-2)]">
            <th className="px-3 py-3">Date</th>
            <th className="px-3 py-3">Tag</th>
            <th className="px-3 py-3">Title</th>
            <th className="px-3 py-3">Read</th>
            <th className="px-3 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {BLOG_POSTS.map((p) => (
            <tr
              key={p.slug}
              className="border-t border-[color:var(--line)] hover:bg-black/[0.02] dark:hover:bg-white/[0.03] transition-colors"
              data-testid={`blog-row-${p.slug}`}
            >
              <td className="px-3 py-3 whitespace-nowrap text-[color:var(--ink-2)]">
                <time dateTime={p.date}>{new Date(p.date).toDateString().slice(4)}</time>
              </td>
              <td className="px-3 py-3">
                <span className="px-2 py-0.5 border border-[color:var(--line-strong)] rounded-full font-mono-tech text-[10.5px] tracking-[0.16em] uppercase">{p.tag}</span>
              </td>
              <td className="px-3 py-3">
                <Link to={`/blog/${p.slug}`} className="font-medium hover:text-[color:var(--accent)]">{p.title}</Link>
                {p.excerpt && <div className="text-[color:var(--ink-2)] text-xs mt-1 line-clamp-1">{p.excerpt}</div>}
              </td>
              <td className="px-3 py-3 text-[color:var(--ink-2)] whitespace-nowrap">{p.read}</td>
              <td className="px-3 py-3 text-right">
                <Link to={`/blog/${p.slug}`} className="text-[color:var(--accent)] inline-flex items-center gap-1 text-xs" data-testid={`blog-row-open-${p.slug}`}>
                  Open <ArrowRight size={12}/>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CalendarView() {
  const [cursor, setCursor] = useState(() => {
    // Anchor on newest post's month, else today
    const iso = BLOG_POSTS[0]?.date;
    const d = iso ? new Date(iso) : new Date();
    return { y: d.getFullYear(), m: d.getMonth() };
  });

  const grid = useMemo(() => {
    const first = new Date(cursor.y, cursor.m, 1);
    const startDow = first.getDay(); // 0=Sun
    const daysInMonth = new Date(cursor.y, cursor.m + 1, 0).getDate();
    const days = [];
    for (let i = 0; i < startDow; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(new Date(cursor.y, cursor.m, d));
    while (days.length % 7 !== 0) days.push(null);
    return days;
  }, [cursor]);

  const postsByDate = useMemo(() => {
    const map = {};
    BLOG_POSTS.forEach((p) => {
      if (!p.date) return;
      map[p.date] = map[p.date] || [];
      map[p.date].push(p);
    });
    return map;
  }, []);

  const monthLabel = new Date(cursor.y, cursor.m, 1).toLocaleString(undefined, { month: "long", year: "numeric" });
  const prev = () => setCursor(({ y, m }) => (m === 0 ? { y: y - 1, m: 11 } : { y, m: m - 1 }));
  const next = () => setCursor(({ y, m }) => (m === 11 ? { y: y + 1, m: 0 } : { y, m: m + 1 }));

  return (
    <div className="mt-8 themed-card p-4 sm:p-5" data-testid="blog-calendar">
      <div className="flex items-center justify-between mb-3">
        <button type="button" onClick={prev} className="p-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/10" aria-label="Previous month" data-testid="cal-prev">
          <ChevronLeft size={16}/>
        </button>
        <div className="font-serif-editorial text-xl sm:text-2xl">{monthLabel}</div>
        <button type="button" onClick={next} className="p-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/10" aria-label="Next month" data-testid="cal-next">
          <ChevronRight size={16}/>
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-[10.5px] font-mono-tech tracking-[0.16em] uppercase text-[color:var(--ink-2)] text-center pb-1">
        {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => <div key={d}>{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {grid.map((d, i) => {
          const iso = d ? `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}` : null;
          const items = iso ? postsByDate[iso] || [] : [];
          return (
            <div
              key={i}
              className={`min-h-[74px] rounded-md border p-1.5 text-left ${
                d ? "border-[color:var(--line)]" : "border-transparent"
              } ${items.length ? "bg-[color:var(--accent)]/8" : ""}`}
              data-testid={d ? `cal-day-${iso}` : undefined}
            >
              {d && (
                <>
                  <div className="text-[11px] text-[color:var(--ink-2)]">{d.getDate()}</div>
                  {items.map((p) => (
                    <Link
                      key={p.slug}
                      to={`/blog/${p.slug}`}
                      className="mt-1 block truncate text-[11px] px-1.5 py-0.5 rounded bg-[color:var(--ink)] text-[color:var(--bg)] hover:opacity-90"
                      data-testid={`cal-post-${p.slug}`}
                      title={p.title}
                    >
                      {p.title}
                    </Link>
                  ))}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
