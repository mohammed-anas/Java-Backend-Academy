import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDownRight, MoveRight, Sparkles } from "lucide-react";
import { BRAND, IMAGES, TRUST_CHIPS } from "@/site/content";
import { scrollToId } from "@/site/useLenis";

const HERO_LINES = [
  [{ t: "Learn " }, { t: "Java", accent: true }, { t: " and" }],
  [{ t: "related technologies." }],
  [{ t: "Land your first" }],
  [{ t: "developer", accent: true }, { t: " " }, { t: "job.", accent: true }],
];

const lineVariants = {
  hidden: { y: "110%" },
  show: (i) => ({
    y: "0%",
    transition: {
      delay: 0.3 + i * 0.09,
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
  const imgY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -70]);

  useEffect(() => {
    document.body.classList.add("grain");
    return () => document.body.classList.remove("grain");
  }, []);

  return (
    <section
      id="top"
      ref={ref}
      data-testid="hero-section"
      className="relative min-h-[100svh] pt-24 sm:pt-32 lg:pt-36 pb-14 lg:pb-20 overflow-hidden cursor-cross"
    >
      {/* Decorative glossy orb (top-right) */}
      <motion.div
        aria-hidden
        animate={{ scale: [1, 1.08, 1], rotate: [0, 8, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-24 -right-24 md:top-10 md:right-10 w-[360px] h-[360px] md:w-[520px] md:h-[520px] rounded-full pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(closest-side, rgba(255,91,37,0.35), rgba(236,72,153,0.15) 45%, transparent 70%)",
          filter: "blur(20px)",
        }}
      />

      {/* Parallax editorial image (desktop only) */}
      <motion.div
        aria-hidden
        style={{ y: imgY, scale: imgScale }}
        className="absolute right-[-4%] top-[14%] w-[60%] max-w-[720px] aspect-[4/5] hidden md:block z-[1]"
      >
        <div className="relative w-full h-full overflow-hidden rounded-2xl">
          <img
            src={`${IMAGES.hero}&w=720&q=80`}
            srcSet={`${IMAGES.hero}&w=480&q=75 480w, ${IMAGES.hero}&w=720&q=80 720w, ${IMAGES.hero}&w=1080&q=85 1080w`}
            sizes="(max-width: 768px) 0px, 60vw"
            alt="Java Hub Academy — backend engineering training"
            className="w-full h-full object-cover"
            style={{ filter: "grayscale(50%) contrast(1.05)" }}
            fetchPriority="high"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-[color:var(--bg)]/40 via-transparent to-[color:var(--bg)]/10 mix-blend-normal" />
          <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl pointer-events-none" />
        </div>
      </motion.div>

      {/* Kicker */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.6 }}
        className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12 relative z-10 mt-8 sm:mt-10 lg:mt-14"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-card border-[color:var(--glass-border)]">
          <span className="pulse-dot" />
          <span className="font-mono-tech text-[10.5px] sm:text-[11px] tracking-[0.24em] uppercase text-[color:var(--ink-2)]">
            Next batch open · Aligarh · Online across India
          </span>
        </div>
      </motion.div>

      {/* Big kinetic type */}
      <motion.div
        style={{ y: textY }}
        className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12 relative z-10 mt-5 sm:mt-8 lg:mt-10"
      >
        <h1 className="font-serif-editorial tracking-tight leading-[1.02] sm:leading-[0.98] text-[10.5vw] xs:text-[11vw] sm:text-[8.5vw] lg:text-[6.4vw] xl:text-[5.8vw]">
          {HERO_LINES.map((segments, li) => (
            <span key={li} className="mask-line block">
              <motion.span
                custom={li}
                variants={lineVariants}
                initial="hidden"
                animate="show"
                className="inline-block whitespace-normal sm:whitespace-nowrap"
              >
                {segments.map((seg, si) =>
                  seg.accent ? (
                    <em
                      key={si}
                      className="not-italic font-serif-editorial italic gradient-text"
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
        transition={{ delay: 1.0, duration: 0.7 }}
        className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12 relative z-10 mt-8 sm:mt-12 lg:mt-16"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
          <div className="lg:col-span-6 xl:col-span-5">
            <p className="text-[15.5px] sm:text-base lg:text-lg leading-relaxed text-[color:var(--ink)]/85 max-w-[52ch]">
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
              className="mt-5 sm:mt-6 flex flex-wrap gap-2"
            >
              {TRUST_CHIPS.map((chip, i) => (
                <li
                  key={chip}
                  data-testid={`hero-trust-chip-${i}`}
                  className="inline-flex items-center gap-2 border border-[color:var(--line-strong)] bg-[color:var(--surface)] px-3 py-1.5 rounded-full font-mono-tech text-[10.5px] tracking-[0.18em] uppercase text-[color:var(--ink)]"
                >
                  <span className="w-1.5 h-1.5 bg-[color:var(--accent)] rounded-full" />
                  {chip}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-6 xl:col-span-7 flex flex-wrap gap-3 sm:gap-4 lg:justify-end">
            <button
              data-testid="hero-cta-enrol"
              onClick={() => scrollToId("contact")}
              className="btn-crisp gloss text-sm sm:text-base px-6 sm:px-8 py-3.5 sm:py-4"
            >
              <Sparkles size={16} /> Book a free demo class
              <MoveRight size={16} />
            </button>
            <button
              data-testid="hero-cta-syllabus"
              onClick={() => scrollToId("courses")}
              className="btn-ghost gloss text-sm sm:text-base"
            >
              See what you&apos;ll learn
              <ArrowDownRight size={14} />
            </button>
          </div>
        </div>

        <div className="mt-12 lg:mt-20 flex items-end justify-between border-t border-[color:var(--line)] pt-5">
          <div className="font-mono-tech text-[10.5px] tracking-[0.24em] uppercase text-[color:var(--ink-2)]">
            Scroll · Explore the syllabus
          </div>
          <motion.div
            aria-hidden
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            className="font-mono-tech text-[12px] tracking-[0.24em] uppercase text-[color:var(--ink)]"
          >
            ↓
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
