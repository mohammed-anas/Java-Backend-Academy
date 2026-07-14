import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDownRight, MoveRight } from "lucide-react";
import { BRAND, IMAGES } from "@/site/content";
import { scrollToId } from "@/site/useLenis";

const LINE_1 = ["Engineered", "for engineers"];
const LINE_2 = ["who refuse"];
const LINE_3 = ["to be", "average."];

const lineVariants = {
  hidden: { y: "110%" },
  show: (i) => ({
    y: "0%",
    transition: {
      delay: 0.35 + i * 0.09,
      duration: 0.9,
      ease: [0.2, 0.7, 0.2, 1],
    },
  }),
};

export default function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], [0, 220]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -80]);

  // set body class for grain on mount
  useEffect(() => {
    document.body.classList.add("grain");
    return () => document.body.classList.remove("grain");
  }, []);

  return (
    <section
      id="top"
      ref={ref}
      data-testid="hero-section"
      className="relative min-h-[100svh] pt-28 sm:pt-32 lg:pt-40 pb-16 lg:pb-24 overflow-hidden cursor-cross"
    >
      {/* Parallax floating image */}
      <motion.div
        aria-hidden
        style={{ y: imgY, scale: imgScale }}
        className="absolute right-[-4%] top-[14%] w-[62%] max-w-[720px] aspect-[4/5] hidden md:block z-0"
      >
        <div className="relative w-full h-full overflow-hidden">
          <img
            src={IMAGES.hero}
            alt=""
            className="w-full h-full object-cover"
            style={{ filter: "grayscale(100%) contrast(1.05)" }}
          />
          <div className="absolute inset-0 bg-[color:var(--bg)]/25 mix-blend-lighten" />
        </div>
      </motion.div>

      {/* Corner meta */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12 relative z-10"
      >
        <div className="flex items-start justify-between font-mono-tech text-[11px] tracking-[0.24em] uppercase text-[color:var(--ink-2)]">
          <div data-testid="hero-cohort-meta" className="max-w-[180px] leading-relaxed">
            <div className="text-[color:var(--ink)]">Cohort · 24</div>
            <div>Enrolments open</div>
            <div>New batch · 12 Jan</div>
          </div>
          <div className="hidden sm:block text-right leading-relaxed">
            <div className="text-[color:var(--ink)]">Bengaluru · IN</div>
            <div>12.9720° N</div>
            <div>77.5936° E</div>
          </div>
        </div>
      </motion.div>

      {/* Big kinetic type */}
      <motion.div
        style={{ y: textY }}
        className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12 relative z-10 mt-14 sm:mt-16 lg:mt-24"
      >
        <h1 className="font-serif-editorial tracking-tight leading-[0.9] text-[14vw] sm:text-[11vw] lg:text-[9vw] xl:text-[8.4vw]">
          {[LINE_1, LINE_2, LINE_3].map((line, li) => (
            <span key={li} className="block">
              {line.map((word, wi) => {
                const globalIndex = li * 3 + wi;
                return (
                  <span key={wi} className="mask-line inline-block mr-[0.18em]">
                    <motion.span
                      custom={globalIndex}
                      variants={lineVariants}
                      initial="hidden"
                      animate="show"
                      className="inline-block"
                    >
                      {word === "engineers" || word === "refuse" ? (
                        <em className="not-italic font-serif-editorial italic text-[color:var(--accent)]">
                          {word}
                        </em>
                      ) : (
                        word
                      )}
                    </motion.span>
                  </span>
                );
              })}
            </span>
          ))}
        </h1>
      </motion.div>

      {/* Sub / CTA row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.05, duration: 0.7 }}
        className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12 relative z-10 mt-10 sm:mt-14 lg:mt-20"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
          <div className="lg:col-span-6 xl:col-span-5">
            <p className="text-base sm:text-lg leading-relaxed text-[color:var(--ink)]/85 max-w-[52ch]">
              <span className="font-mono-tech text-[11px] tracking-[0.24em] uppercase text-[color:var(--ink-2)] block mb-3">
                / Since 2016 · Bengaluru
              </span>
              {BRAND.name} is a small, obsessive institute where senior engineers
              teach Java, DSA, System Design, Spring Boot, Databases and AWS
              through cohort-based apprenticeships — not lectures. We measure
              ourselves by the offers you sign, not the seats we fill.
            </p>
          </div>

          <div className="lg:col-span-6 xl:col-span-7 flex flex-wrap gap-4 lg:justify-end">
            <button
              data-testid="hero-cta-enrol"
              onClick={() => scrollToId("contact")}
              className="btn-crisp"
            >
              Book a discovery call
              <MoveRight size={16} />
            </button>
            <button
              data-testid="hero-cta-syllabus"
              onClick={() => scrollToId("courses")}
              className="btn-ghost"
            >
              Read the syllabus
              <ArrowDownRight size={16} />
            </button>
          </div>
        </div>

        {/* Bottom rule + scroll cue */}
        <div className="mt-16 lg:mt-24 flex items-end justify-between border-t border-[color:var(--line)] pt-6">
          <div className="font-mono-tech text-[11px] tracking-[0.24em] uppercase text-[color:var(--ink-2)]">
            /01 — Scroll to enter
          </div>
          <motion.div
            aria-hidden
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            className="font-mono-tech text-[11px] tracking-[0.24em] uppercase text-[color:var(--ink)]"
          >
            ↓
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
