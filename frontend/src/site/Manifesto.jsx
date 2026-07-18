import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Clock, Lock, CheckCircle2, Layers, Package } from "lucide-react";
import { COURSES, TRACKS, COMBO_BUNDLES, IMAGES } from "@/site/content";
import { scrollToContactWithCourse } from "@/site/useLenis";

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

/** Turn "brand-4" (from TRACKS[tint]) into a CSS variable */
function tintVar(tint) {
  return `var(--${tint})`;
}

function TrackBadge({ track }) {
  return (
    <span
      className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full font-mono-tech text-[10px] tracking-[0.22em] uppercase border"
      style={{
        color: tintVar(track.tint),
        borderColor: tintVar(track.tint),
        background: `color-mix(in oklab, ${tintVar(track.tint)} 10%, transparent)`,
      }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: tintVar(track.tint) }} />
      {track.kicker}
    </span>
  );
}

function CourseChapter({ c, idx, track }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.55, ease: [0.2, 0.7, 0.2, 1], delay: idx * 0.03 }}
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
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {track && <TrackBadge track={track} />}
            <span className="font-mono-tech text-[10px] tracking-[0.22em] uppercase text-[color:var(--ink-2)]">
              {c.kicker}
            </span>
          </div>
          <div className="font-serif-editorial text-[26px] sm:text-4xl lg:text-[44px] leading-[1.05] tracking-tight">
            {c.title}
          </div>
          <div className="mt-3 grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-8">
            <div className="md:col-span-3 flex flex-col gap-2">
              <span className="inline-flex items-center gap-2 font-mono-tech text-[11px] tracking-[0.2em] uppercase text-[color:var(--ink)]">
                <Clock size={12} className="text-[color:var(--accent)]" />
                {c.duration} · {c.mode}
              </span>
              {c.order && (
                <span className="inline-flex items-center gap-1.5 font-mono-tech text-[10px] tracking-[0.18em] text-[color:var(--accent)]">
                  <Lock size={11} /> {c.order}
                </span>
              )}
            </div>
            <p className="md:col-span-9 text-[14.5px] sm:text-[15px] leading-relaxed text-[color:var(--ink)]/85 max-w-[72ch]">
              {c.body}
            </p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 font-mono-tech text-[11px] tracking-[0.24em] uppercase text-[color:var(--ink)]">
          Enquire <ArrowUpRight size={16} />
        </div>

        <div className="floater">
          <img src={FLOATER_IMGS[idx % FLOATER_IMGS.length]} alt="" />
        </div>
      </div>
    </motion.div>
  );
}

function TrackHeader({ track, count, num }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.6 }}
      className="mt-16 mb-6 lg:mt-24 lg:mb-8"
      data-testid={`track-header-${track.key}`}
    >
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <span
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full font-mono-tech text-[11px] tracking-[0.22em] uppercase"
          style={{
            background: tintVar(track.tint),
            color: "#fff",
          }}
        >
          <Layers size={12} /> Step {num} · {track.kicker}
        </span>
        {track.accepts.length > 0 && (
          <span className="inline-flex items-center gap-1.5 font-mono-tech text-[10px] tracking-[0.2em] uppercase text-[color:var(--ink-2)]">
            <CheckCircle2 size={12} className="text-[color:var(--brand-4)]" /> requires {track.accepts.join(" · ")}
          </span>
        )}
        <span className="font-mono-tech text-[10px] tracking-[0.2em] uppercase text-[color:var(--ink-3)]">
          {count} {count === 1 ? "course" : "courses"}
        </span>
      </div>
      <h3 className="font-serif-editorial text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-[1.05]">
        {track.label}
      </h3>
      <p className="mt-3 text-[color:var(--ink)]/75 max-w-[62ch] leading-relaxed text-[15.5px]">
        {track.summary}
      </p>
    </motion.div>
  );
}

function ComboCard({ b, coursesByN }) {
  const list = b.courses.map((n) => coursesByN[n]).filter(Boolean);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.55 }}
      className="themed-card gloss p-6 sm:p-7 flex flex-col"
      data-testid={`combo-${b.key}`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 font-mono-tech text-[10px] tracking-[0.22em] uppercase text-[color:var(--accent)]">
          <Package size={12} /> Combo
        </span>
        <span className="inline-flex items-center px-2.5 py-1 rounded-full border border-[color:var(--line-strong)] font-mono-tech text-[10px] tracking-[0.22em] uppercase text-[color:var(--ink-2)]">
          {b.tag}
        </span>
      </div>
      <h4 className="mt-3 font-serif-editorial text-2xl sm:text-[26px] leading-tight tracking-tight">
        {b.title}
      </h4>
      <p className="mt-2 text-[15px] leading-relaxed text-[color:var(--ink)]/85">{b.outcome}</p>
      <ul className="mt-4 space-y-1.5 text-[13.5px]">
        {list.map((c) => (
          <li key={c.n} className="flex items-center gap-2 text-[color:var(--ink)]/85">
            <CheckCircle2 size={13} className="text-[color:var(--brand-4)] shrink-0" />
            <span className="font-mono-tech text-[10px] tracking-[0.18em] text-[color:var(--ink-2)] w-8 shrink-0">{c.n}</span>
            <span className="truncate">{c.title}</span>
          </li>
        ))}
      </ul>
      <div className="mt-5 flex items-center justify-between gap-3 pt-4 border-t border-[color:var(--line)]">
        <span className="font-mono-tech text-[11px] tracking-[0.2em] uppercase text-[color:var(--ink-2)]">
          {b.duration}
        </span>
        <button
          type="button"
          data-testid={`combo-cta-${b.key}`}
          onClick={() => scrollToContactWithCourse(`Combo — ${b.title}`)}
          className="inline-flex items-center gap-2 font-mono-tech text-[11px] tracking-[0.24em] uppercase text-[color:var(--accent)] hover:gap-3 transition-all"
        >
          Enquire <ArrowUpRight size={14} />
        </button>
      </div>
    </motion.div>
  );
}

export default function Manifesto() {
  const [activeTrack, setActiveTrack] = useState("all");

  const coursesByN = useMemo(() => {
    const map = {};
    COURSES.forEach((c) => { map[c.n] = c; });
    return map;
  }, []);

  const grouped = useMemo(() => {
    const m = new Map();
    TRACKS.forEach((t) => m.set(t.key, []));
    COURSES.forEach((c) => {
      if (m.has(c.track)) m.get(c.track).push(c);
    });
    return m;
  }, []);

  return (
    <section
      id="courses"
      data-testid="courses-section"
      className="relative py-24 sm:py-28 lg:py-40 bg-[color:var(--bg)]"
    >
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-10 lg:mb-14">
          <div className="lg:col-span-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.8, ease: [0.2, 0.7, 0.2, 1] }}
              className="font-serif-editorial text-4xl sm:text-5xl lg:text-6xl leading-[1.02] tracking-tight max-w-[22ch]"
            >
              Your step-by-step
              <em className="not-italic italic gradient-text"> roadmap</em>.
              From your first line of code to your first job offer.
            </motion.h2>
            <p className="mt-5 text-[color:var(--ink)]/80 max-w-[64ch] text-base sm:text-lg leading-relaxed">
              Four clear stages, each unlocking the next. Start with the basics even
              if you&apos;ve never coded before, then pick the track that fits your goal.
              Every course card shows the time it takes, when to take it, and what
              you should already know.
            </p>
          </div>
        </div>

        {/* Track filter chips */}
        <div className="flex flex-wrap gap-2 mb-8" data-testid="track-filter">
          {[{ key: "all", label: "All courses", tint: "ink" }, ...TRACKS].map((t) => {
            const isAll = t.key === "all";
            const isActive = activeTrack === t.key;
            const c = grouped.get(t.key)?.length || 0;
            return (
              <button
                key={t.key}
                type="button"
                data-testid={`track-chip-${t.key}`}
                onClick={() => setActiveTrack(t.key)}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border font-mono-tech text-[11px] tracking-[0.2em] uppercase transition-all ${
                  isActive
                    ? "bg-[color:var(--ink)] text-[color:var(--bg)] border-[color:var(--ink)]"
                    : "bg-[color:var(--surface)] text-[color:var(--ink)] border-[color:var(--line-strong)] hover:border-[color:var(--accent)]"
                }`}
              >
                {!isAll && (
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ background: tintVar(t.tint) }}
                  />
                )}
                {isAll ? "All courses" : t.label}
                <span className={`ml-1 inline-flex items-center justify-center min-w-[22px] h-[18px] px-1 rounded-full text-[10px] font-normal ${
                  isActive ? "bg-white/15 text-inherit" : "bg-[color:var(--bg-2)] text-[color:var(--ink-2)]"
                }`}>
                  {String(isAll ? COURSES.length : c).padStart(2, "0")}
                </span>
              </button>
            );
          })}
        </div>

        {/* Roadmap: iterate track by track */}
        <div className="relative">
          {TRACKS.map((track, ti) => {
            const items = grouped.get(track.key) || [];
            if (activeTrack !== "all" && activeTrack !== track.key) return null;
            if (items.length === 0) return null;
            return (
              <div key={track.key} data-testid={`track-block-${track.key}`}>
                <TrackHeader track={track} count={items.length} num={ti + 1} />
                <div>
                  {items.map((c, i) => (
                    <CourseChapter key={c.n} c={c} idx={i} track={track} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Combo bundles */}
        <div className="mt-20 lg:mt-28" id="combos" data-testid="combo-bundles">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full font-mono-tech text-[11px] tracking-[0.22em] uppercase bg-[color:var(--ink)] text-[color:var(--bg)]">
                <Package size={12} /> Real-project combos
              </span>
              <h3 className="mt-4 font-serif-editorial text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-[1.05] max-w-[24ch]">
                Save time. Pick a
                <em className="not-italic italic gradient-text"> combo</em> that fits your goal.
              </h3>
              <p className="mt-3 text-[color:var(--ink)]/75 max-w-[62ch] leading-relaxed text-[15.5px]">
                Not sure which courses to pick? These pre-set combos are the exact
                sequences students take to reach a specific outcome. One conversation
                on WhatsApp and we personalise the pace and fees.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
            {COMBO_BUNDLES.map((b) => (
              <ComboCard key={b.key} b={b} coursesByN={coursesByN} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
