import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { REVIEWS } from "@/site/content";

export default function Reviews() {
  const [i, setI] = useState(0);
  const r = REVIEWS[i];
  const next = () => setI((v) => (v + 1) % REVIEWS.length);
  const prev = () => setI((v) => (v - 1 + REVIEWS.length) % REVIEWS.length);

  return (
    <section
      id="reviews"
      data-testid="reviews-section"
      className="py-24 sm:py-28 lg:py-40 bg-[color:var(--bg)]"
    >
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-14 lg:mb-16">
          <div className="lg:col-span-4">
            <div className="font-mono-tech text-[11px] tracking-[0.24em] uppercase text-[color:var(--ink-2)]">
              /06 — On the record
            </div>
          </div>
          <div className="lg:col-span-8">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.8 }}
              className="font-serif-editorial text-4xl sm:text-5xl lg:text-6xl leading-[1.02] tracking-tight max-w-[20ch]"
            >
              Reviews from engineers
              <em className="not-italic italic text-[color:var(--accent)]"> who signed offers.</em>
            </motion.h2>
          </div>
        </div>

        <div className="border-t border-b border-[color:var(--line)] py-10 lg:py-16 relative min-h-[280px] sm:min-h-[240px]">
          <div className="absolute -top-6 left-0 font-serif-editorial text-[120px] leading-none text-[color:var(--accent)] select-none">
            &ldquo;
          </div>

          <AnimatePresence mode="wait">
            <motion.blockquote
              key={i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5 }}
              className="relative z-10 max-w-[68ch]"
            >
              <p className="font-serif-editorial text-2xl sm:text-3xl lg:text-4xl leading-snug tracking-tight text-[color:var(--ink)]">
                {r.quote}
              </p>
              <footer className="mt-8 flex items-baseline gap-6">
                <div className="font-mono-tech text-[11px] tracking-[0.24em] uppercase text-[color:var(--ink)]">
                  — {r.name}
                </div>
                <div className="font-mono-tech text-[11px] tracking-[0.24em] uppercase text-[color:var(--ink-2)]">
                  {r.role}
                </div>
              </footer>
            </motion.blockquote>
          </AnimatePresence>
        </div>

        <div className="mt-8 flex items-center justify-between">
          <div className="font-mono-tech text-[11px] tracking-[0.24em] uppercase text-[color:var(--ink-2)]">
            {String(i + 1).padStart(2, "0")} / {String(REVIEWS.length).padStart(2, "0")}
          </div>
          <div className="flex gap-3">
            <button
              data-testid="review-prev"
              onClick={prev}
              aria-label="Previous review"
              className="w-11 h-11 border border-[color:var(--ink)] hover:bg-[color:var(--ink)] hover:text-[color:var(--bg)] transition-colors inline-flex items-center justify-center"
            >
              <ArrowLeft size={16} />
            </button>
            <button
              data-testid="review-next"
              onClick={next}
              aria-label="Next review"
              className="w-11 h-11 border border-[color:var(--ink)] hover:bg-[color:var(--accent)] hover:border-[color:var(--accent)] hover:text-white transition-colors inline-flex items-center justify-center"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
