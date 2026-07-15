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
              /06 — About the institute
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
                Java Hub Academy is a small, focused institute for engineers
                who want to master the backend stack. Every course is taught
                live by senior engineers, <strong>strictly capped at 10 students per batch</strong>, and every
                submission comes back with written feedback within 24 hours.
              </p>
              <p>
                We do not sell recorded videos. We do not promise magic. What we
                promise — and measure — is that you will finish being able to
                design, build, deploy and defend real backend systems.
              </p>
            </div>

            <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-8 max-w-md">
              {[
                ["9", "Courses on offer"],
                ["10", "Students / batch"],
                ["24 hr", "Feedback SLA"],
                ["1:5", "Mentor ratio"],
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
                  src={`${IMAGES.whiteboard}&w=600&q=75`}
                  srcSet={`${IMAGES.whiteboard}&w=400&q=75 400w, ${IMAGES.whiteboard}&w=600&q=80 600w, ${IMAGES.whiteboard}&w=800&q=85 800w`}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  alt="Whiteboard architecture session at Java Hub Academy Aligarh"
                  className="w-full h-full object-cover"
                  style={{ filter: "grayscale(100%) contrast(1.05)" }}
                  loading="lazy"
                  decoding="async"
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
                  src={`${IMAGES.code}&w=400&q=75`}
                  srcSet={`${IMAGES.code}&w=300&q=75 300w, ${IMAGES.code}&w=400&q=80 400w`}
                  sizes="(max-width: 768px) 50vw, 25vw"
                  alt="Code review session - Java training in Aligarh"
                  className="w-full h-full object-cover"
                  style={{ filter: "grayscale(100%) contrast(1.05)" }}
                  loading="lazy"
                  decoding="async"
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
                  src={`${IMAGES.learners}&w=400&q=75`}
                  srcSet={`${IMAGES.learners}&w=300&q=75 300w, ${IMAGES.learners}&w=400&q=80 400w`}
                  sizes="(max-width: 768px) 50vw, 30vw"
                  alt="Students learning backend development at Java Hub Academy"
                  className="w-full h-full object-cover"
                  style={{ filter: "grayscale(100%) contrast(1.05)" }}
                  loading="lazy"
                  decoding="async"
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
                  src={`${IMAGES.office}&w=500&q=75`}
                  srcSet={`${IMAGES.office}&w=400&q=75 400w, ${IMAGES.office}&w=500&q=80 500w`}
                  sizes="(max-width: 768px) 50vw, 35vw"
                  alt="Java Hub Academy studio in Aligarh, UP"
                  className="w-full h-full object-cover"
                  style={{ filter: "grayscale(100%) contrast(1.05)" }}
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute bottom-4 left-4 font-mono-tech text-[10px] tracking-[0.24em] uppercase text-white bg-black/50 px-2 py-1">
                  Fig. 03 · Studio, Aligarh
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
