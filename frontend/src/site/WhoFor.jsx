import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { AUDIENCE, buildWhatsAppMessage } from "@/site/content";

export default function WhoFor() {
  return (
    <section
      id="who-for"
      data-testid="who-for-section"
      className="py-24 sm:py-28 lg:py-40 bg-[color:var(--bg)]"
    >
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-14 lg:mb-20">
          <div className="lg:col-span-4">
            <div className="font-mono-tech text-[11px] tracking-[0.24em] uppercase text-[color:var(--ink-2)]">
              /02 — Who this is for
            </div>
          </div>
          <div className="lg:col-span-8">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.8, ease: [0.2, 0.7, 0.2, 1] }}
              className="font-serif-editorial text-4xl sm:text-5xl lg:text-6xl leading-[1.02] tracking-tight max-w-[22ch]"
            >
              You&apos;ll find yourself
              <em className="not-italic italic text-[color:var(--accent)]"> in this room.</em>
            </motion.h2>
            <p className="mt-6 text-[color:var(--ink)]/80 max-w-[54ch]">
              We build small cohorts around people who want to become real backend
              engineers &mdash; not chase certificates. If any of the profiles below
              sound like you, this is your track.
            </p>
          </div>
        </div>

        <ul className="border-t border-[color:var(--line)]">
          {AUDIENCE.map((a, i) => (
            <motion.li
              key={a.tag}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.55, delay: i * 0.05, ease: [0.2, 0.7, 0.2, 1] }}
              data-testid={`who-for-row-${a.tag}`}
              className="border-b border-[color:var(--line)] py-6 lg:py-8 grid grid-cols-12 gap-4 items-baseline group hover:text-[color:var(--accent)] transition-colors"
            >
              <div className="col-span-2 sm:col-span-1 font-mono-tech text-[11px] tracking-[0.24em] text-[color:var(--ink-2)]">
                {a.tag}
              </div>
              <div className="col-span-10 sm:col-span-5 font-serif-editorial text-2xl sm:text-3xl lg:text-4xl leading-tight tracking-tight">
                {a.who}
              </div>
              <div className="col-span-12 sm:col-span-6 text-[15px] leading-relaxed text-[color:var(--ink)]/80 sm:pl-6">
                {a.line}
              </div>
            </motion.li>
          ))}
        </ul>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <a
            data-testid="who-for-cta"
            href={buildWhatsAppMessage(
              "Hi Java Hub Academy, I'm not sure which track fits me best. Can you help me pick?"
            )}
            target="_blank"
            rel="noreferrer"
            className="btn-crisp"
          >
            Not sure? Ask a mentor
            <ArrowUpRight size={16} />
          </a>
          <p className="font-mono-tech text-[11px] tracking-[0.24em] uppercase text-[color:var(--ink-2)] max-w-[42ch]">
            One WhatsApp reply, from a senior engineer &mdash; not a sales rep.
          </p>
        </div>
      </div>
    </section>
  );
}
