import "@/App.css";
import { Toaster } from "sonner";
import Home from "@/pages/Home";
import useLenis from "@/site/useLenis";

/**
 * Pure single-page app — no client routes, no backend calls.
 * The whole site scrolls on a single canvas with anchor navigation.
 * Deployable as a static build to GitHub Pages (see README).
 */
function AppShell() {
  useLenis();
  return (
    <div className="App">
      <Home />
      <Toaster
        position="bottom-left"
        theme="light"
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
