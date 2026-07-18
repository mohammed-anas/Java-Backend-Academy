import { useEffect, useMemo } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Home as HomeIcon } from "lucide-react";
import Nav from "@/site/Nav";
import Footer from "@/site/Footer";
import BackToTop from "@/site/BackToTop";
import { BLOG_POSTS, BRAND, buildWhatsAppMessage } from "@/site/content";
import BlocksRenderer from "@/blog-editor/BlocksRenderer";

export default function BlogPost() {
  const { slug } = useParams();
  const idx = BLOG_POSTS.findIndex((p) => p.slug === slug);
  const post = idx >= 0 ? BLOG_POSTS[idx] : null;
  const prev = idx > 0 ? BLOG_POSTS[idx - 1] : null;
  const next = idx >= 0 && idx < BLOG_POSTS.length - 1 ? BLOG_POSTS[idx + 1] : null;

  useEffect(() => {
    if (post) {
      document.title = `${post.title} · Java Hub Academy Blog`;
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [post]);

  const askUrl = useMemo(
    () => buildWhatsAppMessage(post ? `Hi ${BRAND.name}, I read \"${post.title}\" on your blog and would like to learn more.` : ""),
    [post]
  );

  if (!post) return <Navigate to="/blog" replace />;

  return (
    <main data-testid="blog-post-page" className="relative min-h-screen">
      <Nav />
      <article className="pt-28 sm:pt-32 lg:pt-40 pb-16 sm:pb-20 lg:pb-24">
        <div className="mx-auto max-w-[820px] px-5 sm:px-8 lg:px-12">
          <nav aria-label="Breadcrumb" data-testid={`breadcrumb-blog-${slug}`} className="crumb-trail flex flex-wrap items-center gap-2">
            <Link to="/" className="inline-flex items-center gap-1.5 hover:text-[color:var(--accent)] transition-colors">
              <HomeIcon size={12} /> Home
            </Link>
            <span aria-hidden>/</span>
            <Link to="/blog" className="hover:text-[color:var(--accent)] transition-colors">Blog</Link>
            <span aria-hidden>/</span>
            <span className="crumb-trail__current truncate max-w-[16ch] sm:max-w-none">{post.tag}</span>
          </nav>

          <div className="mt-6 font-mono-tech text-[10.5px] tracking-[0.24em] uppercase text-[color:var(--ink-2)] flex items-center gap-3">
            <span className="px-2 py-1 border border-[color:var(--line-strong)] rounded-full">{post.tag}</span>
            <span>{post.read}</span>
            <span aria-hidden>·</span>
            <time dateTime={post.date}>{new Date(post.date).toDateString().slice(4)}</time>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
            className="mt-4 font-serif-editorial text-3xl sm:text-4xl lg:text-5xl leading-[1.06] tracking-tight"
          >
            {post.title}
          </motion.h1>

          <div className="mt-8 space-y-5 text-[color:var(--ink)]/90 leading-[1.75] text-[17px]">
            {Array.isArray(post.blocks) && post.blocks.length > 0 ? (
              <BlocksRenderer blocks={post.blocks} />
            ) : (
              (post.body || []).map((para, i) => <p key={i}>{para}</p>)
            )}
          </div>

          <div className="mt-10 p-6 sm:p-7 themed-card gloss">
            <p className="font-mono-tech text-[10.5px] tracking-[0.24em] uppercase text-[color:var(--ink-2)]">
              Ready to go deeper?
            </p>
            <p className="mt-2 font-serif-editorial text-2xl leading-tight">
              Join a live cohort at Java Hub Academy — capped at 10 students.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link to="/#contact" data-testid="blog-cta-enquire" className="btn-crisp gloss text-sm">Enquire →</Link>
              <a data-testid="blog-cta-whatsapp" href={askUrl} target="_blank" rel="noreferrer" className="btn-ghost text-sm">WhatsApp us</a>
            </div>
          </div>

          <nav aria-label="Post navigation" className="section-nav-strip mt-14">
            {prev ? (
              <Link to={`/blog/${prev.slug}`} data-testid={`blog-prev-${slug}`}>
                <span className="inline-flex items-center gap-2"><ChevronLeft size={14} /> Previous</span>
                <span className="text-[color:var(--ink)] font-body font-medium normal-case tracking-normal text-sm truncate max-w-[24ch]">{prev.title}</span>
              </Link>
            ) : <Link to="/blog" data-testid={`blog-back-${slug}`}><span>← All posts</span><span className="text-[color:var(--ink)] font-body font-medium normal-case tracking-normal text-sm">Blog</span></Link>}
            {next ? (
              <Link to={`/blog/${next.slug}`} data-testid={`blog-next-${slug}`} style={{ textAlign: "right" }}>
                <span className="text-[color:var(--ink)] font-body font-medium normal-case tracking-normal text-sm truncate max-w-[24ch] block">{next.title}</span>
                <span className="inline-flex items-center gap-2">Next <ChevronRight size={14} /></span>
              </Link>
            ) : <Link to="/cheatsheet" data-testid={`blog-cheat-${slug}`} style={{ textAlign: "right" }}><span className="text-[color:var(--ink)] font-body font-medium normal-case tracking-normal text-sm">Cheatsheets</span><span className="inline-flex items-center gap-2">Next →</span></Link>}
          </nav>
        </div>
      </article>
      <Footer />
      <BackToTop />
    </main>
  );
}
