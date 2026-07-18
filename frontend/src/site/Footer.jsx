import { Link } from "react-router-dom";
import { BRAND } from "@/site/content";
import { scrollToId } from "@/site/useLenis";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer
      data-testid="site-footer"
      className="bg-[#050505] text-[#FAFAFA] pt-20 lg:pt-28 pb-10"
    >
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 lg:pb-20 border-b border-white/15">
          <div className="lg:col-span-6">
            <h3 className="font-serif-editorial text-5xl sm:text-6xl lg:text-8xl leading-[0.95] tracking-tight max-w-[16ch]">
              Ship real
              <em className="not-italic italic text-[color:var(--accent)]"> backends.</em>
              <br />
              Sign real
              <em className="not-italic italic text-[color:var(--accent)]"> offers.</em>
            </h3>
            <button
              data-testid="footer-cta-enrol"
              onClick={() => scrollToId("contact")}
              className="btn-crisp mt-10"
              style={{
                background: "#FAFAFA",
                color: "#050505",
                borderColor: "#FAFAFA",
              }}
            >
              Start your enquiry →
            </button>
          </div>

          <div className="lg:col-span-2">
            <div className="font-mono-tech text-[10px] tracking-[0.28em] uppercase text-white/60 mb-4">
              Academy
            </div>
            <ul className="space-y-3 text-sm">
              {["courses", "projects", "batches", "reviews", "free-resources", "about", "location", "contact"].map((id) => (
                <li key={id}>
                  <button
                    data-testid={`footer-link-${id}`}
                    onClick={() => scrollToId(id)}
                    className="hover:text-[color:var(--accent)] transition-colors capitalize"
                  >
                    {id.replace(/-/g, " ")}
                  </button>
                </li>
              ))}
              <li>
                <Link
                  data-testid="footer-link-blog"
                  to="/blog"
                  className="hover:text-[color:var(--accent)] transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  data-testid="footer-link-cheatsheet"
                  to="/cheatsheet"
                  className="hover:text-[color:var(--accent)] transition-colors"
                >
                  Cheatsheets
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <div className="font-mono-tech text-[10px] tracking-[0.28em] uppercase text-white/60 mb-4">
              Contact
            </div>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  data-testid="footer-call"
                  href={BRAND.phoneHref}
                  className="hover:text-[color:var(--accent)]"
                >
                  {BRAND.phone}
                </a>
              </li>
              <li>
                <a
                  data-testid="footer-whatsapp"
                  href={BRAND.whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[color:var(--accent)]"
                >
                  WhatsApp
                </a>
              </li>
              <li className="text-white/70 leading-relaxed max-w-[30ch]">
                {BRAND.address}
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <div className="font-mono-tech text-[10px] tracking-[0.28em] uppercase text-white/60 mb-4">
              Follow
            </div>
            <ul className="space-y-3 text-sm">
              {BRAND.socials.map((s) => (
                <li key={s.label}>
                  <a
                    data-testid={`footer-social-${s.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-[color:var(--accent)]"
                  >
                    {s.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-mono-tech text-[11px] tracking-[0.24em] uppercase text-white/50">
          <div>
            © {year} {BRAND.name}
          </div>
        </div>
      </div>
    </footer>
  );
}
