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

/**
 * Scroll to an element by id. If the element does not exist on the current
 * route (e.g. user is on /blog and clicks "Courses" in the footer), we redirect
 * to the home route with a `?s=<id>` param — the router picks that up and
 * scrolls after render.
 */
export function scrollToId(id) {
  const el = typeof document !== "undefined" ? document.getElementById(id) : null;
  if (!el) {
    // Cross-page navigation: switch to home route with the section as a query.
    if (typeof window !== "undefined") {
      window.location.hash = id === "top" ? "#/" : `#/?s=${encodeURIComponent(id)}`;
    }
    return;
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
