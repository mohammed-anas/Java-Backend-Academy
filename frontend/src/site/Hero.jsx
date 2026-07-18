import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDownRight, MoveRight } from "lucide-react";
import { BRAND, IMAGES, TRUST_CHIPS } from "@/site/content";
import { scrollToId } from "@/site/useLenis";

const HERO_LINES = [
  [
    { t: "Learn " },
    { t: "Java", accent: true },
    { t: " and" },
  ],
  [
    { t: "related technologies." },
  ],
  [
    { t: "Land your first" },
  ],
  [
    { t: "developer", accent: true },
    { t: " " },
    { t: "job.", accent: true },
  ],
];

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
            src={`${IMAGES.hero}&w=720&q=80`}
            srcSet={`${IMAGES.hero}&w=480&q=75 480w, ${IMAGES.hero}&w=720&q=80 720w, ${IMAGES.hero}&w=1080&q=85 1080w`}
            sizes="(max-width: 768px) 0px, 62vw"
            alt="Java Hub Academy — backend engineering training"
            className="w-full h-full object-cover"
            style={{ filter: "grayscale(100%) contrast(1.05)" }}
            fetchpriority="high"
            decoding="async"
          />
          <div className="absolute inset-0 bg-[color:var(--bg)]/25 mix-blend-lighten" />
        </div>
      </motion.div>


      {/* Big kinetic type */}
      <motion.div
        style={{ y: textY }}
        className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12 relative z-10 mt-14 sm:mt-16 lg:mt-24"
      >
        <h1 className="font-serif-editorial tracking-tight leading-[0.98] text-[11vw] sm:text-[8.5vw] lg:text-[6.4vw] xl:text-[6vw]">
          {HERO_LINES.map((segments, li) => (
            <span key={li} className="mask-line block">
              <motion.span
                custom={li}
                variants={lineVariants}
                initial="hidden"
                animate="show"
                className="inline-block whitespace-nowrap"
              >
                {segments.map((seg, si) =>
                  seg.accent ? (
                    <em
                      key={si}
                      className="not-italic font-serif-editorial italic text-[color:var(--accent)]"
                    >
                      {seg.t}
                    </em>
                  ) : (
                    <span key={si}>{seg.t}</span>
                  )
                )}
              </motion.span>
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
                / {BRAND.name}
              </span>
              We teach you Java, databases, system design and more — the exact
              skills companies hire for. Learn live from senior engineers,
              build real projects, and walk into interviews ready to get hired.
              Studio and online cohorts for learners across India and worldwide.
            </p>

            <ul
              data-testid="hero-trust-chips"
              className="mt-6 flex flex-wrap gap-2"
            >
              {TRUST_CHIPS.map((chip, i) => (
                <li
                  key={chip}
                  data-testid={`hero-trust-chip-${i}`}
                  className="inline-flex items-center gap-2 border border-[color:var(--line)] bg-[color:var(--surface)] px-3 py-1.5 font-mono-tech text-[10px] tracking-[0.2em] uppercase text-[color:var(--ink)]"
                >
                  <span className="w-1.5 h-1.5 bg-[color:var(--accent)]" />
                  {chip}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-6 xl:col-span-7 flex flex-wrap gap-4 lg:justify-end">
            <button
              data-testid="hero-cta-enrol"
              onClick={() => scrollToId("contact")}
              className="btn-crisp text-base sm:text-lg px-8 py-4 shadow-[6px_6px_0_0_var(--ink)] hover:shadow-[8px_8px_0_0_var(--ink)] transition-all"
            >
              Book a free demo class
              <MoveRight size={18} />
            </button>
            <button
              data-testid="hero-cta-syllabus"
              onClick={() => scrollToId("courses")}
              className="btn-ghost"
            >
              See what you&apos;ll learn
              <ArrowDownRight size={16} />
            </button>
          </div>
        </div>

        <div className="mt-16 lg:mt-24 flex items-end justify-end border-t border-[color:var(--line)] pt-6">
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
