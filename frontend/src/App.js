import "@/App.css";
import { lazy, Suspense, useEffect } from "react";
import { Toaster } from "sonner";
import Home from "@/pages/Home";
import useLenis from "@/site/useLenis";
import ScrollProgress from "@/site/ScrollProgress";
import { useTheme } from "@/site/useTheme";

const SectionRail = lazy(() => import("@/site/SectionRail"));
const BackToTop   = lazy(() => import("@/site/BackToTop"));

/**
 * Pure single-page app — no client routes, no backend calls.
 * The whole site scrolls on a single canvas with anchor navigation.
 * Deployable as a static build to GitHub Pages (see README).
 */
function AppShell() {
  useLenis();
  const { theme } = useTheme(); // ensures the class is applied on first render

  // On mount, honor #hash so a link like javahub.in/#courses jumps correctly.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash?.replace("#", "");
    if (hash) {
      requestAnimationFrame(() => {
        const el = document.getElementById(hash);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }, []);

  return (
    <div className="App relative" data-theme={theme}>
      {/* Ambient aurora that gently shifts behind everything */}
      <div aria-hidden="true" className="aurora" />
      <ScrollProgress />

      <Home />

      <Suspense fallback={null}>
        <SectionRail />
        <BackToTop />
      </Suspense>

      <Toaster
        position="bottom-left"
        theme={theme === "dark" ? "dark" : "light"}
        richColors
        toastOptions={{
          className:
            "font-mono-tech tracking-[0.16em] uppercase text-[11px] border border-[color:var(--ink)]",
        }}
      />
    </div>
  );
}

export default function App() {
  return <AppShell />;
}
