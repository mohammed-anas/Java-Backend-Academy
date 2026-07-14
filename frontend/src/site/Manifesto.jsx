import { motion } from "framer-motion";
import { COURSES, IMAGES } from "@/site/content";
import { scrollToContactWithCourse } from "@/site/useLenis";
import { ArrowUpRight, Clock } from "lucide-react";

const FLOATER_IMGS = [
  IMAGES.code,
  IMAGES.learners,
  IMAGES.whiteboard,
  IMAGES.office,
  IMAGES.hero,
  IMAGES.code,
  IMAGES.learners,
  IMAGES.whiteboard,
];

export default function Manifesto() {
  return (
    <section
      id="courses"
      data-testid="courses-section"
      className="relative py-24 sm:py-28 lg:py-40 bg-[color:var(--bg)]"
    >
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-16 lg:mb-24">
          <div className="lg:col-span-4">
            <div className="font-mono-tech text-[11px] tracking-[0.24em] uppercase text-[color:var(--ink-2)] mb-6">
              /02 — The syllabus
            </div>
          </div>
          <div className="lg:col-span-8">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.8, ease: [0.2, 0.7, 0.2, 1] }}
              className="font-serif-editorial text-4xl sm:text-5xl lg:text-6xl leading-[1.02] tracking-tight max-w-[16ch]"
            >
              Nine courses. One curriculum.
              <em className="not-italic italic text-[color:var(--accent)]"> Written by engineers</em>
              <span> who still ship.</span>
            </motion.h2>
          </div>
        </div>

        <div className="relative">
          {COURSES.map((c, idx) => (
            <motion.div
              key={c.n}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{
                duration: 0.6,
                ease: [0.2, 0.7, 0.2, 1],
                delay: idx * 0.04,
              }}
              className="relative"
            >
              <div
                className="chapter-row group"
                data-testid={`course-row-${c.n}`}
                onClick={() => scrollToContactWithCourse(`${c.n} — ${c.title}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") scrollToContactWithCourse(`${c.n} — ${c.title}`);
                }}
              >
                <div className="font-mono-tech text-[13px] sm:text-sm tracking-[0.24em] text-[color:var(--ink-2)]">
                  {c.n}
                </div>
                <div className="min-w-0 chapter-title">
                  <div className="font-serif-editorial text-3xl sm:text-5xl lg:text-6xl leading-[1.02] tracking-tight">
                    {c.title}
                  </div>
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8">
                    <div className="md:col-span-3 flex flex-col gap-2">
                      <span className="font-mono-tech text-[11px] tracking-[0.24em] uppercase text-[color:var(--ink-2)]">
                        {c.kicker}
                      </span>
                      <span className="inline-flex items-center gap-2 font-mono-tech text-[11px] tracking-[0.2em] uppercase text-[color:var(--ink)]">
                        <Clock size={12} className="text-[color:var(--accent)]" />
                        {c.duration} · {c.mode}
                      </span>
                      {c.order && (
                        <span className="font-mono-tech text-[10px] tracking-[0.18em] text-[color:var(--accent)] mt-1">
                          → {c.order}
                        </span>
                      )}
                    </div>
                    <p className="md:col-span-9 text-sm sm:text-base leading-relaxed text-[color:var(--ink)]/80 max-w-[72ch]">
                      {c.body}
                    </p>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-2 font-mono-tech text-[11px] tracking-[0.24em] uppercase text-[color:var(--ink)]">
                  Enquire
                  <ArrowUpRight size={16} />
                </div>

                {/* Floating hover image (desktop) */}
                <div className="floater">
                  <img src={FLOATER_IMGS[idx % FLOATER_IMGS.length]} alt="" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
