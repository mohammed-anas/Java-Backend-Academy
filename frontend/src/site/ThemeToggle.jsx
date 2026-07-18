import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/site/useTheme";

export default function ThemeToggle({ className = "" }) {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";
  return (
    <button
      type="button"
      data-testid="theme-toggle"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={toggle}
      className={`relative inline-flex items-center justify-center w-10 h-10 rounded-full border border-[color:var(--glass-border)] bg-[color:var(--glass)] backdrop-blur hover:border-[color:var(--accent)] transition-colors ${className}`}
    >
      <span className="sr-only">{isDark ? "Light mode" : "Dark mode"}</span>
      <Sun size={16} className={`absolute transition-all duration-300 ${isDark ? "opacity-0 -rotate-90 scale-50" : "opacity-100 rotate-0 scale-100"} text-[color:var(--ink)]`} />
      <Moon size={16} className={`absolute transition-all duration-300 ${isDark ? "opacity-100 rotate-0 scale-100" : "opacity-0 rotate-90 scale-50"} text-[color:var(--ink)]`} />
    </button>
  );
}
