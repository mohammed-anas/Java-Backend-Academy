import { BRAND } from "@/site/content";
import { MapPin } from "lucide-react";

export default function Location() {
  return (
    <section
      id="location"
      data-testid="location-section"
      className="bg-[color:var(--bg)] border-t border-[color:var(--line)]"
    >
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12 py-16 sm:py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          <div className="lg:col-span-4">
            <div className="font-mono-tech text-[11px] tracking-[0.24em] uppercase text-[color:var(--ink-2)]">
              /08 — Find us
            </div>
          </div>
          <div className="lg:col-span-8">
            <h2 className="font-serif-editorial text-4xl sm:text-5xl lg:text-6xl leading-[1.02] tracking-tight max-w-[18ch]">
              Come sit in on a
              <em className="not-italic italic text-[color:var(--accent)]"> live design clinic.</em>
            </h2>
          </div>
        </div>
      </div>

      <div className="relative w-full">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12 pb-24 lg:pb-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-4">
              <div className="border-t border-[color:var(--line)] pt-6 space-y-6">
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="mt-1 text-[color:var(--accent)]" />
                  <div className="font-mono-tech text-[12px] tracking-[0.2em] uppercase leading-relaxed">
                    <div className="text-[color:var(--ink-2)]">Studio</div>
                    <div className="text-[color:var(--ink)] normal-case tracking-normal font-sans text-base leading-snug mt-1 max-w-[30ch]">
                      {BRAND.address}
                    </div>
                  </div>
                </div>

                <div className="border-t border-[color:var(--line)] pt-6 font-mono-tech text-[12px] tracking-[0.2em] uppercase">
                  <div className="text-[color:var(--ink-2)]">Hours</div>
                  <div className="text-[color:var(--ink)] mt-1">{BRAND.hours}</div>
                </div>

                <a
                  data-testid="open-in-maps"
                  href="https://www.google.com/maps/search/?api=1&query=Church+Street+Bengaluru"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-ghost mt-4"
                >
                  Open in Google Maps
                </a>
              </div>
            </div>

            <div className="lg:col-span-8">
              <div className="relative w-full aspect-[16/10] lg:aspect-[16/9] overflow-hidden border border-[color:var(--line)]">
                <iframe
                  title="CODECRAFT — Location"
                  src={BRAND.mapEmbed}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full"
                  style={{ border: 0, filter: "grayscale(85%) contrast(1.05)" }}
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
