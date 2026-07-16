import { motion } from "framer-motion";
import { Download, ArrowUpRight } from "lucide-react";
import { LEAD_MAGNETS, BRAND, buildWhatsAppMessage } from "@/site/content";

function magnetLink(ask) {
  return buildWhatsAppMessage(
    `Hi ${BRAND.name}, please send me ${ask} on this number. My name is ______.`
  );
}

export default function LeadMagnet() {
  return (
    <section
      id="free-resources"
      data-testid="lead-magnet-section"
      className="py-24 sm:py-28 lg:py-40 bg-[color:var(--surface)] border-y border-[color:var(--line)]"
    >
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-14 lg:mb-20">
          <div className="lg:col-span-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.8, ease: [0.2, 0.7, 0.2, 1] }}
              className="font-serif-editorial text-4xl sm:text-5xl lg:text-6xl leading-[1.02] tracking-tight max-w-[22ch]"
            >
              Start with the
              <em className="not-italic italic text-[color:var(--accent)]"> roadmap.</em>
              <span> No sign-up.</span>
            </motion.h2>
            <p className="mt-6 text-[color:var(--ink)]/80 max-w-[54ch]">
              Pick a resource. Tap. A mentor sends it to you on WhatsApp &mdash;
              no forms, no email chase, no auto-DRIP. Read it, then decide if
              you want to talk.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {LEAD_MAGNETS.map((m, i) => (
            <motion.a
              key={m.n}
              data-testid={`lead-magnet-${m.n}`}
              href={magnetLink(m.ask)}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.5, delay: i * 0.05, ease: [0.2, 0.7, 0.2, 1] }}
              className="group block bg-[color:var(--bg)] border border-[color:var(--line)] hover:border-[color:var(--ink)] p-5 lg:p-6 transition-colors"
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <span className="font-mono-tech text-[10px] tracking-[0.24em] uppercase text-[color:var(--ink-2)]">
                  {m.n}
                </span>
                <Download
                  size={16}
                  className="text-[color:var(--ink-2)] group-hover:text-[color:var(--accent)] transition-colors"
                />
              </div>
              <div className="font-serif-editorial text-xl sm:text-[22px] leading-tight tracking-tight">
                {m.title}
              </div>
              <p className="mt-3 text-[13px] leading-relaxed text-[color:var(--ink)]/75">
                {m.line}
              </p>
              <div className="mt-5 inline-flex items-center gap-2 font-mono-tech text-[10px] tracking-[0.24em] uppercase text-[color:var(--ink)] group-hover:text-[color:var(--accent)] transition-colors">
                Get on WhatsApp
                <ArrowUpRight size={14} />
              </div>
            </motion.a>
          ))}
        </div>

        <p className="mt-8 font-mono-tech text-[11px] tracking-[0.24em] uppercase text-[color:var(--ink-2)] max-w-[68ch]">
          Zero data collection on our servers. WhatsApp handles the message &mdash;
          your number stays with you.
        </p>
      </div>
    </section>
  );
}
