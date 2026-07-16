import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { COMPARISON } from "@/site/content";

export default function Compare() {
  return (
    <section
      id="why-us"
      data-testid="compare-section"
      className="py-24 sm:py-28 lg:py-40 bg-[color:var(--bg)]"
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
              A live workshop, not
              <em className="not-italic italic text-[color:var(--accent)]"> another playlist.</em>
            </motion.h2>
            <p className="mt-6 text-[color:var(--ink)]/80 max-w-[54ch]">
              We&apos;re transparent about what a paid cohort actually buys you
              beyond a free recording. Here&apos;s a side-by-side.
            </p>
          </div>
        </div>

        <div className="border border-[color:var(--line)] bg-white overflow-x-auto">
          <table className="w-full text-left" data-testid="compare-table">
            <thead>
              <tr className="border-b border-[color:var(--line)]">
                <th className="p-4 sm:p-5 font-mono-tech text-[10px] tracking-[0.24em] uppercase text-[color:var(--ink-2)] w-[38%]">
                  &nbsp;
                </th>
                <th className="p-4 sm:p-5 font-mono-tech text-[11px] tracking-[0.24em] uppercase text-[color:var(--ink)] bg-[color:var(--surface)] border-l border-[color:var(--line)]">
                  {COMPARISON.us}
                </th>
                <th className="p-4 sm:p-5 font-mono-tech text-[11px] tracking-[0.24em] uppercase text-[color:var(--ink-2)] border-l border-[color:var(--line)]">
                  {COMPARISON.them}
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.rows.map((r, i) => (
                <tr
                  key={r.row}
                  data-testid={`compare-row-${i}`}
                  className="border-b border-[color:var(--line)] last:border-b-0"
                >
                  <td className="p-4 sm:p-5 align-top font-serif-editorial text-lg sm:text-xl tracking-tight text-[color:var(--ink)]">
                    {r.row}
                  </td>
                  <td className="p-4 sm:p-5 align-top bg-[color:var(--surface)] border-l border-[color:var(--line)]">
                    <div className="flex items-start gap-2 text-[14px] text-[color:var(--ink)]">
                      <Check size={16} className="mt-0.5 text-[color:var(--accent)] shrink-0" />
                      <span>{r.us}</span>
                    </div>
                  </td>
                  <td className="p-4 sm:p-5 align-top border-l border-[color:var(--line)]">
                    <div className="flex items-start gap-2 text-[14px] text-[color:var(--ink-2)]">
                      <X size={16} className="mt-0.5 text-[color:var(--ink-2)] shrink-0" />
                      <span>{r.them}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-6 font-mono-tech text-[11px] tracking-[0.24em] uppercase text-[color:var(--ink-2)] max-w-[68ch]">
          We say &ldquo;interview-ready&rdquo; and mean it. We do not sell placement
          guarantees &mdash; we teach hard so you can clear them on merit.
        </p>
      </div>
    </section>
  );
}
