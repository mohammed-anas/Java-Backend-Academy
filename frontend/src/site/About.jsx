import { motion } from "framer-motion";
import { IMAGES } from "@/site/content";

export default function About() {
  return (
    <section
      id="about"
      data-testid="about-section"
      className="py-24 sm:py-28 lg:py-40 bg-[color:var(--bg)]"
    >
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="font-mono-tech text-[11px] tracking-[0.24em] uppercase text-[color:var(--ink-2)] mb-6">
              /04 — About the institute
            </div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.8 }}
              className="font-serif-editorial text-4xl sm:text-5xl lg:text-6xl leading-[1.02] tracking-tight"
            >
              A workshop,
              <br />
              not a
              <em className="not-italic italic text-[color:var(--accent)]"> lecture hall.</em>
            </motion.h2>

            <div className="mt-10 space-y-6 text-[color:var(--ink)]/85 leading-relaxed max-w-[54ch]">
              <p>
                We opened in 2016 with a single conviction: engineers grow by
                writing, breaking and defending real systems — not by watching
                someone else do it. Every cohort is small (28 seats), every
                project is graded by a senior mentor, and every mock interview
                comes back with written feedback.
              </p>
              <p>
                Half our faculty still ship production code at their day jobs.
                The other half were interviewers at the companies you&rsquo;re
                targeting. Either way, they&rsquo;ve been where you&rsquo;re trying to go.
              </p>
            </div>

            <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-8 max-w-md">
              {[
                ["09 yrs", "Since founding"],
                ["28", "Seats / cohort"],
                ["24 hr", "Feedback SLA"],
                ["1:6", "Mentor ratio"],
              ].map(([n, l]) => (
                <div key={l} className="border-t border-[color:var(--line)] pt-4">
                  <div className="font-serif-editorial text-3xl leading-none">{n}</div>
                  <div className="mt-2 font-mono-tech text-[10px] tracking-[0.24em] uppercase text-[color:var(--ink-2)]">
                    {l}
                  </div>
                </div>
              ))}
            </dl>
          </div>

          <div className="lg:col-span-7">
            <div className="grid grid-cols-6 grid-rows-6 gap-4 lg:gap-6 min-h-[520px] lg:min-h-[620px]">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, ease: [0.2, 0.7, 0.2, 1] }}
                className="col-span-4 row-span-4 relative overflow-hidden bg-black"
              >
                <img
                  src={IMAGES.whiteboard}
                  alt="Whiteboard architecture session"
                  className="w-full h-full object-cover"
                  style={{ filter: "grayscale(100%) contrast(1.05)" }}
                />
                <div className="absolute top-4 left-4 font-mono-tech text-[10px] tracking-[0.24em] uppercase text-white bg-black/50 px-2 py-1">
                  Fig. 01 · Design clinic
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, delay: 0.15, ease: [0.2, 0.7, 0.2, 1] }}
                className="col-span-2 row-span-3 col-start-5 relative overflow-hidden bg-black"
              >
                <img
                  src={IMAGES.code}
                  alt="Code review"
                  className="w-full h-full object-cover"
                  style={{ filter: "grayscale(100%) contrast(1.05)" }}
                />
                <div className="absolute top-4 left-4 font-mono-tech text-[10px] tracking-[0.24em] uppercase text-white bg-black/50 px-2 py-1">
                  Fig. 02
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.2, 0.7, 0.2, 1] }}
                className="col-span-3 row-span-2 col-start-1 row-start-5 relative overflow-hidden bg-black"
              >
                <img
                  src={IMAGES.learners}
                  alt="Cohort at work"
                  className="w-full h-full object-cover"
                  style={{ filter: "grayscale(100%) contrast(1.05)" }}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, delay: 0.45, ease: [0.2, 0.7, 0.2, 1] }}
                className="col-span-3 row-span-3 col-start-4 row-start-4 relative overflow-hidden bg-black"
              >
                <img
                  src={IMAGES.office}
                  alt="The studio"
                  className="w-full h-full object-cover"
                  style={{ filter: "grayscale(100%) contrast(1.05)" }}
                />
                <div className="absolute bottom-4 left-4 font-mono-tech text-[10px] tracking-[0.24em] uppercase text-white bg-black/50 px-2 py-1">
                  Fig. 03 · Studio, Bengaluru
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
