import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone, Home as HomeIcon, BookOpen, Zap } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BRAND } from "@/site/content";
import { scrollToId } from "@/site/useLenis";
import { useActiveSection, SECTIONS } from "@/site/useActiveSection";
import ThemeToggle from "@/site/ThemeToggle";

const LINKS = [
  { id: "courses", label: "Courses" },
  { id: "batches", label: "Batches" },
  { id: "why-us", label: "Why us" },
  { id: "reviews", label: "Reviews" },
  { id: "contact", label: "Enquire" },
];

const ROUTES = [
  { to: "/blog", label: "Blog", icon: BookOpen },
  { to: "/cheatsheet", label: "Cheatsheets", icon: Zap },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const active = useActiveSection();
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu whenever the route changes.
  useEffect(() => { setOpen(false); }, [location.pathname]);

  // Lock body scroll when the mobile menu is open — prevents the hero text
  // behind the panel from peeking through / scrolling. We use the
  // "position:fixed + preserve scrollY" pattern which is the only bulletproof
  // way to stop scrolling on iOS Safari (overflow:hidden alone is not enough
  // when a smooth-scroll library like Lenis is running).
  //
  // Special-case: when the menu is closed as part of a NAVIGATION click
  // (e.g. tap on "Contact") we must NOT restore the pre-open scroll
  // position — otherwise the browser first jumps back to Y then smoothly
  // scrolls to the target, which on mobile can be interrupted or look
  // broken. Nav sets `document.body.dataset.mnavSkipRestore = "1"` right
  // before setOpen(false), and this effect respects it.
  useEffect(() => {
    if (typeof document === "undefined") return;
    const lenis = window.__lenis;
    if (open) {
      const y = window.scrollY || window.pageYOffset || 0;
      document.body.dataset.mnavScrollY = String(y);
      document.body.style.position = "fixed";
      document.body.style.top = `-${y}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      if (lenis && typeof lenis.stop === "function") lenis.stop();
    } else {
      const savedRaw = document.body.dataset.mnavScrollY;
      const saved = savedRaw ? parseInt(savedRaw, 10) : 0;
      const skipRestore = document.body.dataset.mnavSkipRestore === "1";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      delete document.body.dataset.mnavScrollY;
      if (savedRaw && !skipRestore) {
        // Restore scroll position without smooth animation.
        window.scrollTo(0, saved);
      }
      const l = window.__lenis;
      if (l && typeof l.start === "function") l.start();
    }
    return () => {
      // Safety: if the component unmounts while open, restore everything.
      const savedRaw = document.body.dataset.mnavScrollY;
      const skipRestore = document.body.dataset.mnavSkipRestore === "1";
      if (savedRaw) {
        const saved = parseInt(savedRaw, 10);
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.left = "";
        document.body.style.right = "";
        document.body.style.width = "";
        document.body.style.overflow = "";
        document.documentElement.style.overflow = "";
        delete document.body.dataset.mnavScrollY;
        if (!skipRestore) window.scrollTo(0, saved);
      }
      const l = window.__lenis;
      if (l && typeof l.start === "function") l.start();
    };
  }, [open]);

  // Menu-item tap → unlock the scroll lock without restoring position, then
  // scroll to the target section. On mobile the lock-cleanup + Lenis restart
  // needs at least one paint before Lenis can accept a new scrollTo, so we
  // wait for two rAF frames.
  const closeAndScrollTo = (id) => {
    document.body.dataset.mnavSkipRestore = "1";
    setOpen(false);
    // Wait for React re-render + the useEffect cleanup (which clears body
    // styles and restarts Lenis) to run, then scroll on the next paint.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        delete document.body.dataset.mnavSkipRestore;
        // CRITICAL: After removing position:fixed from body, Lenis needs to
        // recalculate its internal scroll state. Call resize() to force this.
        const lenis = window.__lenis;
        if (lenis && typeof lenis.resize === 'function') {
          lenis.resize();
        }
        scrollToId(id);
      });
    });
  };

  const handleGo = (id) => {
    if (!isHome) {
      // Not on home — close the menu, navigate to /, then scroll after mount.
      document.body.dataset.mnavSkipRestore = "1";
      setOpen(false);
      navigate("/");
      // Give React Router time to mount the Home route.
      setTimeout(() => {
        delete document.body.dataset.mnavSkipRestore;
        // After cross-page navigation, Lenis needs to recalculate.
        const lenis = window.__lenis;
        if (lenis && typeof lenis.resize === 'function') {
          lenis.resize();
        }
        scrollToId(id);
      }, 220);
      return;
    }
    // Already on home — just close the menu and scroll.
    if (open) {
      closeAndScrollTo(id);
    } else {
      scrollToId(id);
    }
  };

  const goHome = () => {
    if (!isHome) {
      document.body.dataset.mnavSkipRestore = "1";
      setOpen(false);
      navigate("/");
      setTimeout(() => { delete document.body.dataset.mnavSkipRestore; }, 300);
      return;
    }
    if (open) closeAndScrollTo("top");
    else scrollToId("top");
  };

  const currentCrumb = isHome
    ? (SECTIONS.find((s) => s.id === active)?.crumb || "Home")
    : (location.pathname.startsWith("/blog") ? "Blog" : location.pathname.startsWith("/cheatsheet") ? "Cheatsheets" : "");

  return (
    <>
      <motion.header
        data-testid="site-header"
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.2, 0.7, 0.2, 1] }}
        className={`fixed top-0 inset-x-0 z-[60] transition-colors duration-300 ${
          scrolled || open
            ? "bg-[color:var(--bg)] backdrop-blur-md border-b border-[color:var(--line)] shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-12 py-3.5 lg:py-4 flex items-center justify-between gap-3">
          <button
            data-testid="brand-mark"
            onClick={goHome}
            className="font-mono-tech text-[11px] sm:text-[12px] tracking-[0.22em] uppercase text-[color:var(--ink)] text-left leading-snug shrink-0"
          >
            <span className="mr-2 inline-block w-2 h-2 bg-[color:var(--accent)] align-middle rounded-sm" />
            <span className="align-middle">{BRAND.name}</span>
          </button>

          {/* Middle crumb — clickable Home + current section */}
          <div className="hidden xl:flex items-center gap-2 crumb-trail" data-testid="crumb-trail">
            <button
              type="button"
              data-testid="crumb-home"
              onClick={goHome}
              className="inline-flex items-center gap-1.5 hover:text-[color:var(--accent)] focus:text-[color:var(--accent)] transition-colors"
            >
              <HomeIcon size={12} /> Home
            </button>
            {currentCrumb && currentCrumb !== "Home" && (
              <>
                <span aria-hidden>/</span>
                <span className="crumb-trail__current">{currentCrumb}</span>
              </>
            )}
          </div>

          <nav className="hidden lg:flex items-center gap-4 xl:gap-5">
            {LINKS.map((l) => {
              const isActive = isHome && active === l.id;
              return (
                <button
                  key={l.id}
                  data-testid={`nav-${l.id}`}
                  data-active={isActive}
                  onClick={() => handleGo(l.id)}
                  className={`relative font-mono-tech text-[10.5px] xl:text-[11px] tracking-[0.2em] uppercase whitespace-nowrap transition-colors ${
                    isActive
                      ? "text-[color:var(--accent)]"
                      : "text-[color:var(--ink)] hover:text-[color:var(--accent)]"
                  }`}
                >
                  {l.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute -bottom-1.5 left-0 right-0 h-[2px] bg-[color:var(--accent)] rounded-full"
                    />
                  )}
                </button>
              );
            })}
            {ROUTES.map((r) => {
              const isActive = location.pathname.startsWith(r.to);
              const Icon = r.icon;
              return (
                <Link
                  key={r.to}
                  to={r.to}
                  data-testid={`nav-route-${r.label.toLowerCase()}`}
                  className={`relative font-mono-tech text-[10.5px] xl:text-[11px] tracking-[0.2em] uppercase whitespace-nowrap transition-colors inline-flex items-center gap-1.5 ${
                    isActive
                      ? "text-[color:var(--accent)]"
                      : "text-[color:var(--ink)] hover:text-[color:var(--accent)]"
                  }`}
                >
                  <Icon size={11} /> {r.label}
                </Link>
              );
            })}
            <ThemeToggle />
            <a data-testid="nav-call" href={BRAND.phoneHref} className="btn-crisp gloss whitespace-nowrap">
              <Phone size={14} /> Talk to us
            </a>
          </nav>

          <div className="lg:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              data-testid="mobile-menu-toggle"
              aria-label="Toggle menu"
              className="inline-flex items-center justify-center w-10 h-10 rounded-md border border-[color:var(--line-strong)] bg-[color:var(--glass)] backdrop-blur"
              onClick={() => setOpen((o) => !o)}
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
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
            className="fixed inset-x-0 top-[60px] bottom-0 z-[55] bg-[color:var(--bg)] border-t border-[color:var(--line)] lg:hidden overflow-y-auto shadow-2xl"
            data-testid="mobile-nav-panel"
            style={{ backgroundColor: "var(--bg)" }}
          >
            <div className="px-5 sm:px-8 py-6 flex flex-col gap-3">
              <button
                type="button"
                data-testid="mnav-home"
                onClick={goHome}
                className="flex items-center justify-between text-left py-2 border-b border-[color:var(--line)] text-[color:var(--ink)]"
              >
                <span className="font-serif-editorial text-2xl leading-none inline-flex items-center gap-2">
                  <HomeIcon size={18} /> Home
                </span>
                <span className="font-mono-tech text-[10px] tracking-[0.24em] text-[color:var(--ink-2)]">/00</span>
              </button>
              {SECTIONS.filter((s) => s.id !== "top").map((l, i) => {
                const isActive = isHome && active === l.id;
                return (
                  <button
                    key={l.id}
                    data-testid={`mnav-${l.id}`}
                    data-active={isActive}
                    onClick={() => handleGo(l.id)}
                    className={`flex items-center justify-between text-left py-2 border-b border-[color:var(--line)] transition-colors ${
                      isActive ? "text-[color:var(--accent)]" : "text-[color:var(--ink)]"
                    }`}
                  >
                    <span className="font-serif-editorial text-2xl leading-none">{l.label}</span>
                    <span className="font-mono-tech text-[10px] tracking-[0.24em] text-[color:var(--ink-2)]">
                      /{String(i + 1).padStart(2, "0")}
                    </span>
                  </button>
                );
              })}
              {ROUTES.map((r, i) => {
                const Icon = r.icon;
                return (
                  <Link
                    key={r.to}
                    to={r.to}
                    data-testid={`mnav-route-${r.label.toLowerCase()}`}
                    className="flex items-center justify-between text-left py-2 border-b border-[color:var(--line)] text-[color:var(--ink)]"
                    onClick={() => setOpen(false)}
                  >
                    <span className="font-serif-editorial text-2xl leading-none inline-flex items-center gap-2">
                      <Icon size={18} /> {r.label}
                    </span>
                    <span className="font-mono-tech text-[10px] tracking-[0.24em] text-[color:var(--ink-2)]">
                      /{String(SECTIONS.length + i).padStart(2, "0")}
                    </span>
                  </Link>
                );
              })}
              <a
                data-testid="mnav-call"
                href={BRAND.phoneHref}
                className="btn-crisp gloss w-full justify-center mt-3"
              >
                <Phone size={14} /> Talk to us
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
