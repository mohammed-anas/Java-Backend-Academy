import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { BRAND } from "@/site/content";
import { scrollToId } from "@/site/useLenis";

const LINKS = [
  { id: "courses", label: "Courses" },
  { id: "about", label: "About" },
  { id: "location", label: "Location" },
  { id: "contact", label: "Enquire" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleGo = (id) => {
    setOpen(false);
    setTimeout(() => scrollToId(id), 50);
  };

  return (
    <>
      <motion.header
        data-testid="site-header"
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.2, 0.7, 0.2, 1] }}
        className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${
          scrolled
            ? "bg-[color:var(--bg)]/85 backdrop-blur-md border-b border-[color:var(--line)]"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12 py-4 lg:py-5 flex items-center justify-between gap-4">
          <button
            data-testid="brand-mark"
            onClick={() => handleGo("top")}
            className="font-mono-tech text-[12px] sm:text-[13px] tracking-[0.24em] uppercase text-[color:var(--ink)] text-left leading-snug"
          >
            <span className="mr-2 inline-block w-2 h-2 bg-[color:var(--accent)] align-middle" />
            {BRAND.name}
            <span className="text-[color:var(--ink-2)] hidden sm:inline"> // {BRAND.short}</span>
          </button>

          <nav className="hidden lg:flex items-center gap-8">
            {LINKS.map((l) => (
              <button
                key={l.id}
                data-testid={`nav-${l.id}`}
                onClick={() => handleGo(l.id)}
                className="font-mono-tech text-[12px] tracking-[0.24em] uppercase text-[color:var(--ink)] hover:text-[color:var(--accent)] transition-colors"
              >
                {l.label}
              </button>
            ))}
            <a data-testid="nav-call" href={BRAND.phoneHref} className="btn-crisp">
              Talk to us
            </a>
          </nav>

          <button
            data-testid="mobile-menu-toggle"
            aria-label="Toggle menu"
            className="lg:hidden inline-flex items-center justify-center w-10 h-10 border border-[color:var(--ink)]"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-nav"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-x-0 top-[64px] z-40 bg-[color:var(--bg)] border-b border-[color:var(--line)] lg:hidden"
            data-testid="mobile-nav-panel"
          >
            <div className="px-6 py-8 flex flex-col gap-6">
              {LINKS.map((l, i) => (
                <button
                  key={l.id}
                  data-testid={`mnav-${l.id}`}
                  onClick={() => handleGo(l.id)}
                  className="text-left font-serif-editorial text-3xl leading-none"
                >
                  {l.label}
                  <span className="ml-3 font-mono-tech text-[10px] align-middle text-[color:var(--ink-2)]">
                    /0{i + 1}
                  </span>
                </button>
              ))}
              <a data-testid="mnav-call" href={BRAND.phoneHref} className="btn-crisp w-max">
                Talk to us
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
