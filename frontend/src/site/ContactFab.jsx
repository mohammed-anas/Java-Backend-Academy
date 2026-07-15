import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, MessageCircle, X, ChevronRight } from "lucide-react";
import { BRAND, FAB_QUICK_ACTIONS, buildWhatsAppMessage } from "@/site/content";

export default function ContactFab() {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const on = () => setVisible(window.scrollY > 240);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="fixed bottom-6 right-6 z-50 pointer-events-none">
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4 }}
            className="pointer-events-auto flex flex-col items-end gap-3"
          >
            <AnimatePresence>
              {open && (
                <motion.div
                  key="fab-panel"
                  initial={{ opacity: 0, y: 12, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 12, scale: 0.96 }}
                  transition={{ duration: 0.25 }}
                  className="w-[280px] sm:w-[320px] bg-[color:var(--bg)] border border-[color:var(--ink)] shadow-2xl"
                  data-testid="fab-panel"
                >
                  <div className="px-4 py-3 border-b border-[color:var(--line)] flex items-center justify-between">
                    <span className="font-mono-tech text-[10px] tracking-[0.24em] uppercase text-[color:var(--ink-2)]">
                      Talk to us on
                    </span>
                    <span className="font-mono-tech text-[10px] tracking-[0.24em] uppercase text-[#25D366]">
                      WhatsApp
                    </span>
                  </div>

                  <ul className="divide-y divide-[color:var(--line)]">
                    {FAB_QUICK_ACTIONS.map((a) => (
                      <li key={a.key}>
                        <a
                          data-testid={`fab-action-${a.key}`}
                          href={buildWhatsAppMessage(a.msg)}
                          target="_blank"
                          rel="noreferrer"
                          className="group flex items-center justify-between gap-3 px-4 py-3 text-[13px] text-[color:var(--ink)] hover:bg-[color:var(--surface)] hover:text-[color:var(--accent)] transition-colors"
                        >
                          <span className="flex items-center gap-3 min-w-0">
                            <MessageCircle
                              size={14}
                              className="text-[#25D366] shrink-0"
                            />
                            <span className="truncate">{a.label}</span>
                          </span>
                          <ChevronRight
                            size={14}
                            className="text-[color:var(--ink-2)] group-hover:text-[color:var(--accent)] shrink-0"
                          />
                        </a>
                      </li>
                    ))}
                  </ul>

                  <div className="grid grid-cols-2 border-t border-[color:var(--line)]">
                    <a
                      data-testid="fab-whatsapp"
                      href={BRAND.whatsappHref}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center gap-2 py-3 bg-[#25D366] text-white font-mono-tech text-[10px] tracking-[0.24em] uppercase hover:bg-[#1eb655] transition-colors"
                    >
                      <MessageCircle size={14} />
                      Open chat
                    </a>
                    <a
                      data-testid="fab-call"
                      href={BRAND.phoneHref}
                      className="flex items-center justify-center gap-2 py-3 bg-[color:var(--ink)] text-white font-mono-tech text-[10px] tracking-[0.24em] uppercase hover:bg-[color:var(--accent)] transition-colors"
                    >
                      <Phone size={14} />
                      Call now
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              data-testid="fab-toggle"
              aria-label={open ? "Close contact" : "Open contact"}
              onClick={() => setOpen((o) => !o)}
              className="relative w-14 h-14 bg-[color:var(--accent)] text-white shadow-xl inline-flex items-center justify-center hover:scale-105 transition-transform"
            >
              <AnimatePresence mode="wait">
                {open ? (
                  <motion.span
                    key="x"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X size={22} />
                  </motion.span>
                ) : (
                  <motion.span
                    key="m"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <MessageCircle size={22} />
                  </motion.span>
                )}
              </AnimatePresence>
              <span className="absolute inset-0 border border-white/30 pointer-events-none" />
              {!open && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#25D366] border-2 border-[color:var(--bg)] rounded-full animate-pulse" />
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
