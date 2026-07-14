import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, MessageCircle, X } from "lucide-react";
import { BRAND } from "@/site/content";

export default function ContactFab() {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const on = () => setVisible(window.scrollY > 240);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

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
                <>
                  <motion.a
                    key="wa"
                    data-testid="fab-whatsapp"
                    initial={{ opacity: 0, y: 12, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 12, scale: 0.9 }}
                    transition={{ duration: 0.25 }}
                    href={BRAND.whatsappHref}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 pl-4 pr-5 py-3 bg-[#25D366] text-white font-mono-tech text-[11px] tracking-[0.24em] uppercase shadow-lg hover:bg-[#1eb655] transition-colors"
                  >
                    <MessageCircle size={16} />
                    WhatsApp
                  </motion.a>
                  <motion.a
                    key="call"
                    data-testid="fab-call"
                    initial={{ opacity: 0, y: 12, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 12, scale: 0.9 }}
                    transition={{ duration: 0.25, delay: 0.05 }}
                    href={BRAND.phoneHref}
                    className="flex items-center gap-3 pl-4 pr-5 py-3 bg-[color:var(--ink)] text-white font-mono-tech text-[11px] tracking-[0.24em] uppercase shadow-lg hover:bg-[color:var(--accent)] transition-colors"
                  >
                    <Phone size={16} />
                    Call now
                  </motion.a>
                </>
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
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
