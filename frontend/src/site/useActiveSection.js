import { useEffect, useState } from "react";

const SECTIONS = [
  { id: "top",           label: "Home",       crumb: "Home" },
  { id: "who-for",       label: "Who it's for", crumb: "Audience" },
  { id: "courses",       label: "Courses",    crumb: "Courses" },
  { id: "projects",      label: "Projects",   crumb: "Projects" },
  { id: "batches",       label: "Batches",    crumb: "Batches" },
  { id: "about",         label: "About",      crumb: "About" },
  { id: "why-us",        label: "Compare",    crumb: "Why us" },
  { id: "reviews",       label: "Reviews",    crumb: "Reviews" },
  { id: "free-resources",label: "Free PDFs",  crumb: "Free PDFs" },
  { id: "faq",           label: "FAQ",        crumb: "FAQ" },
  { id: "location",      label: "Location",   crumb: "Location" },
  { id: "contact",       label: "Contact",    crumb: "Contact" },
];

export function useActiveSection() {
  const [active, setActive] = useState("top");

  useEffect(() => {
    const observers = [];
    const seen = new Map();

    const onIntersect = (entries) => {
      entries.forEach((e) => {
        seen.set(e.target.id, e.intersectionRatio);
      });
      // Pick the section with highest visibility ratio.
      let bestId = null;
      let bestRatio = 0;
      seen.forEach((ratio, id) => {
        if (ratio > bestRatio) {
          bestRatio = ratio;
          bestId = id;
        }
      });
      if (bestId && bestRatio > 0.15) {
        setActive(bestId);
        if (typeof window !== "undefined" && window.history?.replaceState) {
          try {
            window.history.replaceState(null, "", bestId === "top" ? "#" : `#${bestId}`);
          } catch (_) {
            /* ignore */
          }
        }
      }
    };

    const io = new IntersectionObserver(onIntersect, {
      rootMargin: "-30% 0px -55% 0px",
      threshold: [0.05, 0.15, 0.3, 0.5, 0.75, 1],
    });

    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) {
        io.observe(el);
        observers.push(el);
      }
    });

    return () => io.disconnect();
  }, []);

  return active;
}

export { SECTIONS };
