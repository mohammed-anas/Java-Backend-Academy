import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Home as HomeIcon } from "lucide-react";
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

export default function Blog() {
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

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <p className="mt-3 text-[color:var(--ink)]/80 text-[15px] leading-relaxed">
                  {p.excerpt}
                </p>
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
