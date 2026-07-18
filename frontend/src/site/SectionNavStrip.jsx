import { ChevronLeft, ChevronRight } from "lucide-react";
import { SECTIONS } from "@/site/useActiveSection";
import { scrollToId } from "@/site/useLenis";

export default function SectionNavStrip({ currentId }) {
  const idx = SECTIONS.findIndex((s) => s.id === currentId);
  if (idx === -1) return null;
  const prev = idx > 0 ? SECTIONS[idx - 1] : null;
  const next = idx < SECTIONS.length - 1 ? SECTIONS[idx + 1] : null;
  return (
    <nav aria-label="Section navigation" className="section-nav-strip" data-testid={`section-nav-${currentId}`}>
      {prev ? (
        <a
          href={`#${prev.id}`}
          onClick={(e) => { e.preventDefault(); scrollToId(prev.id); }}
          data-testid={`nav-prev-${currentId}`}
        >
          <span className="inline-flex items-center gap-2"><ChevronLeft size={14} /> Previous</span>
          <span className="text-[color:var(--ink)] font-body font-medium normal-case tracking-normal text-sm">{prev.label}</span>
        </a>
      ) : <span />}
      {next ? (
        <a
          href={`#${next.id}`}
          onClick={(e) => { e.preventDefault(); scrollToId(next.id); }}
          data-testid={`nav-next-${currentId}`}
          style={{ textAlign: "right" }}
        >
          <span className="text-[color:var(--ink)] font-body font-medium normal-case tracking-normal text-sm">{next.label}</span>
          <span className="inline-flex items-center gap-2">Next <ChevronRight size={14} /></span>
        </a>
      ) : <span />}
    </nav>
  );
}
