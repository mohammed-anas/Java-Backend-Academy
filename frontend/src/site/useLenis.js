import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Global smooth-scroll driver.
 * Attaches once at the app root, drives Lenis's raf loop, and cleans up.
 */
export default function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
    });

    let rafId;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    // Expose for anchor scroll utility
    window.__lenis = lenis;

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      window.__lenis = undefined;
    };
  }, []);
}

export function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  // Update the URL hash immediately so the deep-link is copy-able and the
  // section rail / crumb reflects the intent instantly.
  if (typeof window !== "undefined" && window.history?.replaceState) {
    try {
      window.history.replaceState(null, "", id === "top" ? "#" : `#${id}`);
    } catch (_) { /* ignore */ }
  }
  const lenis = window.__lenis;
  if (lenis && typeof lenis.scrollTo === "function") {
    lenis.scrollTo(el, { offset: -80, duration: 1.4 });
  } else {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

export function scrollToContactWithCourse(course) {
  window.dispatchEvent(new CustomEvent("selectCourse", { detail: { course } }));
  scrollToId("contact");
}
