import { motion } from "framer-motion";
import { MENTORS } from "@/site/content";

export default function Mentors() {
  return (
    <section
      id="mentors"
      data-testid="mentors-section"
      className="py-24 sm:py-28 lg:py-40 bg-[color:var(--surface)] border-y border-[color:var(--line)]"
    >
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-14 lg:mb-20">
          <div className="lg:col-span-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.8 }}
              className="font-serif-editorial text-4xl sm:text-5xl lg:text-6xl leading-[1.02] tracking-tight max-w-[18ch]"
            >
              Taught by the people
              <em className="not-italic italic text-[color:var(--accent)]"> who set the bar.</em>
            </motion.h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10">
          {MENTORS.map((m, i) => (
            <motion.figure
              key={m.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.2, 0.7, 0.2, 1] }}
              className="group"
              data-testid={`mentor-card-${i}`}
            >
              <div className="spotlight-frame">
                <img src={m.img} alt={m.name} />
                <div className="absolute bottom-3 left-3 font-mono-tech text-[10px] tracking-[0.24em] uppercase text-white/90 bg-black/60 px-2 py-1">
                  0{i + 1} / 0{MENTORS.length}
                </div>
              </div>
              <figcaption className="mt-5 flex items-baseline justify-between gap-4 border-t border-[color:var(--line)] pt-4">
                <div>
                  <div className="font-serif-editorial text-2xl leading-none">
                    {m.name}
                  </div>
                  <div className="mt-2 font-mono-tech text-[11px] tracking-[0.24em] uppercase text-[color:var(--ink-2)]">
                    {m.role}
                  </div>
                </div>
                <div className="font-mono-tech text-[11px] tracking-[0.24em] uppercase text-[color:var(--ink)]">
                  →
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
