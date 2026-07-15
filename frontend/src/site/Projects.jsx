import { motion } from "framer-motion";
import { ArrowUpRight, Wrench } from "lucide-react";
import { PROJECTS, IMAGES } from "@/site/content";
import { scrollToId } from "@/site/useLenis";

const BG_IMGS = [IMAGES.code, IMAGES.hero, IMAGES.whiteboard, IMAGES.learners, IMAGES.office, IMAGES.code];

export default function Projects() {
  return (
    <section
      id="projects"
      data-testid="projects-section"
      className="py-24 sm:py-28 lg:py-40 bg-[color:var(--surface)] border-y border-[color:var(--line)]"
    >
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-14 lg:mb-20">
          <div className="lg:col-span-4">
            <div className="font-mono-tech text-[11px] tracking-[0.24em] uppercase text-[color:var(--ink-2)]">
              /04 — What you&apos;ll build
            </div>
            <p className="hidden lg:flex items-center gap-2 mt-6 text-[11px] font-mono-tech tracking-[0.2em] uppercase text-[color:var(--ink-2)]">
              <Wrench size={11} /> Six real projects &middot; not toy demos
            </p>
          </div>
          <div className="lg:col-span-8">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.8, ease: [0.2, 0.7, 0.2, 1] }}
              className="font-serif-editorial text-4xl sm:text-5xl lg:text-6xl leading-[1.02] tracking-tight max-w-[22ch]"
            >
              You&apos;ll leave with a portfolio
              <em className="not-italic italic text-[color:var(--accent)]"> an interviewer respects.</em>
            </motion.h2>
            <p className="mt-6 text-[color:var(--ink)]/80 max-w-[54ch]">
              Every course is anchored to a real system you build end-to-end &mdash;
              designed, coded, tested, deployed. Interviewers won&apos;t ask about your
              certificate; they&apos;ll ask about these.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {PROJECTS.map((p, i) => (
            <motion.article
              key={p.n}
              data-testid={`project-card-${p.n}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.55, delay: i * 0.05, ease: [0.2, 0.7, 0.2, 1] }}
              className="group relative overflow-hidden bg-[color:var(--bg)] border border-[color:var(--line)] hover:border-[color:var(--ink)] transition-colors"
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-black">
                <img
                  src={`${BG_IMGS[i % BG_IMGS.length]}&w=520&q=75`}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  style={{ filter: "grayscale(100%) contrast(1.05) brightness(0.72)" }}
                />
                <div className="absolute top-3 left-3 font-mono-tech text-[10px] tracking-[0.24em] uppercase text-white/95 bg-black/60 px-2 py-1">
                  {p.n}
                </div>
              </div>
              <div className="p-5 lg:p-6">
                <div className="font-serif-editorial text-2xl leading-tight tracking-tight">
                  {p.title}
                </div>
                <div className="mt-2 font-mono-tech text-[10px] tracking-[0.22em] uppercase text-[color:var(--accent)]">
                  {p.stack}
                </div>
                <p className="mt-4 text-[14px] leading-relaxed text-[color:var(--ink)]/80">
                  {p.line}
                </p>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-4">
          <button
            data-testid="projects-cta"
            onClick={() => scrollToId("batches")}
            className="btn-crisp"
          >
            See upcoming batches
            <ArrowUpRight size={16} />
          </button>
          <p className="font-mono-tech text-[11px] tracking-[0.24em] uppercase text-[color:var(--ink-2)] max-w-[46ch]">
            Projects graded personally &middot; every commit gets a written review.
          </p>
        </div>
      </div>
    </section>
  );
}
