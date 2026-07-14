import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Home from "@/pages/Home";
import useLenis from "@/site/useLenis";

function AppShell() {
  useLenis();
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </BrowserRouter>
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
