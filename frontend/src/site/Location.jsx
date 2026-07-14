import { BRAND } from "@/site/content";
import { MapPin, Phone, MessageCircle, Clock } from "lucide-react";

export default function Location() {
  return (
    <section
      id="location"
      data-testid="location-section"
      className="bg-[color:var(--surface)] border-y border-[color:var(--line)]"
    >
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12 py-24 sm:py-28 lg:py-40">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-14 lg:mb-20">
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4">
            <ul className="border-t border-[color:var(--line)] divide-y divide-[color:var(--line)]">
              <InfoRow
                icon={<MapPin size={16} className="text-[color:var(--accent)]" />}
                label="Studio"
                testid="loc-address"
              >
                {BRAND.address}
              </InfoRow>
              <InfoRow
                icon={<Clock size={16} className="text-[color:var(--accent)]" />}
                label="Timings"
                testid="loc-hours"
              >
                {BRAND.hours}
              </InfoRow>
              <InfoRow
                icon={<Phone size={16} className="text-[color:var(--accent)]" />}
                label="Call"
                testid="loc-phone"
              >
                <a
                  data-testid="loc-phone-link"
                  href={BRAND.phoneHref}
                  className="link-under"
                >
                  {BRAND.phone}
                </a>
              </InfoRow>
              <InfoRow
                icon={<MessageCircle size={16} className="text-[color:var(--accent)]" />}
                label="WhatsApp"
                testid="loc-whatsapp"
              >
                <a
                  data-testid="loc-whatsapp-link"
                  href={BRAND.whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  className="link-under"
                >
                  {BRAND.whatsapp}
                </a>
              </InfoRow>
            </ul>

            <a
              data-testid="open-in-maps"
              href={BRAND.mapLink}
              target="_blank"
              rel="noreferrer"
              className="btn-ghost mt-8"
            >
              Open in Google Maps
            </a>
          </div>

          <div className="lg:col-span-8">
            <div className="relative w-full aspect-[16/10] lg:aspect-[16/9] overflow-hidden border border-[color:var(--line)]">
              <iframe
                title="Java Hub Academy — Location"
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
    </section>
  );
}

function InfoRow({ icon, label, children, testid }) {
  return (
    <li className="py-5 flex items-start gap-4" data-testid={testid}>
      <div className="pt-1 shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="font-mono-tech text-[10px] tracking-[0.28em] uppercase text-[color:var(--ink-2)] mb-1">
          {label}
        </div>
        <div className="text-[15px] text-[color:var(--ink)] leading-snug break-words">
          {children}
        </div>
      </div>
    </li>
  );
}
