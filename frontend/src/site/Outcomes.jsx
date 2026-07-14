import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { STATS } from "@/site/content";

function useCountUp(target, active) {
  const [val, setVal] = useState("0");
  useEffect(() => {
    if (!active) return;
    const match = String(target).match(/([₹]?)([\d,\.]+)(.*)/);
    if (!match) {
      setVal(target);
      return;
    }
    const prefix = match[1] || "";
    const numRaw = match[2].replace(/,/g, "");
    const suffix = match[3] || "";
    const isFloat = numRaw.includes(".");
    const end = parseFloat(numRaw);
    const duration = 1400;
    const start = performance.now();
    let raf;
    const tick = (t) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const cur = end * eased;
      const formatted = isFloat
        ? cur.toFixed(1)
        : Math.round(cur).toLocaleString("en-IN");
      setVal(`${prefix}${formatted}${suffix}`);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, active]);
  return val;
}

function StatCell({ n, label, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const value = useCountUp(n, inView);
  return (
    <motion.div
      ref={ref}
      data-testid={`stat-${index}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1], delay: index * 0.08 }}
      className="relative py-10 lg:py-16 border-t border-[color:var(--line)]"
    >
      <div className="font-serif-editorial text-[64px] sm:text-[88px] lg:text-[112px] leading-none tracking-tight">
        {value}
      </div>
      <div className="mt-4 font-mono-tech text-[11px] tracking-[0.24em] uppercase text-[color:var(--ink-2)] max-w-[24ch]">
        {label}
      </div>
    </motion.div>
  );
}

export default function Outcomes() {
  return (
    <section
      id="outcomes"
      data-testid="outcomes-section"
      className="py-24 sm:py-28 lg:py-40 bg-[color:var(--surface)] border-y border-[color:var(--line)]"
    >
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8 lg:mb-16">
          <div className="lg:col-span-4">
            <div className="font-mono-tech text-[11px] tracking-[0.24em] uppercase text-[color:var(--ink-2)]">
              /03 — Outcomes on the record
            </div>
          </div>
          <div className="lg:col-span-8">
            <h2 className="font-serif-editorial text-4xl sm:text-5xl lg:text-6xl leading-[1.02] tracking-tight max-w-[18ch]">
              We publish the numbers.
              <em className="not-italic italic text-[color:var(--accent)]"> Every cohort.</em>
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8">
          {STATS.map((s, i) => (
            <StatCell key={s.label} n={s.n} label={s.label} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
