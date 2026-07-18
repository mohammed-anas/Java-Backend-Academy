import "@/App.css";
import { lazy, Suspense, useEffect } from "react";
import { HashRouter, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import Home from "@/pages/Home";
import useLenis from "@/site/useLenis";
import ScrollProgress from "@/site/ScrollProgress";
import { useTheme } from "@/site/useTheme";

const Blog       = lazy(() => import("@/pages/Blog"));
const BlogPost   = lazy(() => import("@/pages/BlogPost"));
const Cheatsheet = lazy(() => import("@/pages/Cheatsheet"));
const AdminEditor = lazy(() => import("@/pages/AdminEditor"));
const SectionRail = lazy(() => import("@/site/SectionRail"));

/**
 * If the URL hash contains a section anchor like #/#contact or #/?section=contact
 * the client will scroll to it after routes mount.
 * We also honor '/' + '#anchor' style deep-links coming from external sources.
 */
function ScrollOnRoute() {
  const location = useLocation();
  useEffect(() => {
    // Try to scroll to a #anchor if the current path is home.
    if (location.pathname === "/") {
      const raw = window.location.hash || "";
      // HashRouter uses '#/' prefix. React-router puts sub-fragments in location.hash
      // If direct anchor came as '#courses' it was consumed by HashRouter as route
      // — instead we support ?s=courses on the home path.
      const url = new URL(window.location.href);
      const searchInHash = raw.includes("?") ? raw.slice(raw.indexOf("?")) : "";
      const params = new URLSearchParams(searchInHash);
      const section = params.get("s") || url.searchParams.get("s");
      if (section) {
        requestAnimationFrame(() => {
          const el = document.getElementById(section);
          if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      }
    } else {
      // On any non-home page, always start at top.
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [location.pathname, location.hash, location.search]);
  return null;
}

function AppShell() {
  useLenis();
  const { theme } = useTheme(); // ensures the class is applied on first render

  return (
    <HashRouter>
      <div className="App relative" data-theme={theme}>
        {/* Ambient aurora that gently shifts behind everything */}
        <div aria-hidden="true" className="aurora" />
        <ScrollProgress />
        <ScrollOnRoute />

        <Suspense fallback={<div className="min-h-screen" />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/cheatsheet" element={<Cheatsheet />} />
            <Route path="/admin/editor" element={<AdminEditor />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </Suspense>

        <Suspense fallback={null}>
          <SectionRailIfHome />
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
    </HashRouter>
  );
}

function SectionRailIfHome() {
  const location = useLocation();
  if (location.pathname !== "/") return null;
  return <SectionRail />;
}

export default function App() {
  return <AppShell />;
}
