import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BRAND } from "@/site/content";

export default function Preloader() {
  const [done, setDone] = useState(false);
  const [pct, setPct] = useState(0);

  useEffect(() => {
    // fast progress; kept purely for on-load moment
    let raf;
    const start = performance.now();
    const dur = 900;
    const tick = (t) => {
      const p = Math.min(1, (t - start) / dur);
      setPct(Math.round(p * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setTimeout(() => setDone(true), 240);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="preloader"
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.9, ease: [0.7, 0, 0.2, 1] }}
          className="fixed inset-0 z-[80] bg-[#050505] text-white flex flex-col justify-between p-6 sm:p-10 lg:p-14"
          data-testid="preloader"
        >
          <div className="flex justify-between items-start font-mono-tech text-[11px] tracking-[0.28em] uppercase">
            <div>
              <span className="inline-block w-2 h-2 bg-[color:var(--accent)] mr-2 align-middle" />
              {BRAND.name}
            </div>
            <div>Cohort · 10</div>
          </div>

          <div>
            <div className="font-serif-editorial text-[14vw] sm:text-[10vw] lg:text-[8vw] leading-none">
              <span className="mask-line inline-block">
                <motion.span
                  initial={{ y: "110%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 0.8, ease: [0.2, 0.7, 0.2, 1] }}
                  className="inline-block"
                >
                  loading the
                </motion.span>
              </span>
              <br />
              <span className="mask-line inline-block">
                <motion.span
                  initial={{ y: "110%" }}
                  animate={{ y: "0%" }}
                  transition={{ delay: 0.1, duration: 0.8, ease: [0.2, 0.7, 0.2, 1] }}
                  className="inline-block italic text-[color:var(--accent)]"
                >
                  syllabus…
                </motion.span>
              </span>
            </div>
          </div>

          <div className="flex justify-between items-end font-mono-tech text-[11px] tracking-[0.28em] uppercase">
            <div>{String(pct).padStart(3, "0")} /100</div>
            <div className="text-white/60">Aligarh · IN</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
