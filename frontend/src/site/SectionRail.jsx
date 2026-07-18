import { useActiveSection, SECTIONS } from "@/site/useActiveSection";
import { scrollToId } from "@/site/useLenis";

export default function SectionRail() {
  const active = useActiveSection();
  return (
    <aside
      aria-label="Section navigator"
      data-testid="section-rail"
      className="section-rail"
    >
      {SECTIONS.map((s) => (
        <button
          key={s.id}
          type="button"
          data-testid={`rail-${s.id}`}
          data-active={active === s.id}
          onClick={() => scrollToId(s.id)}
          aria-label={`Go to ${s.label}`}
          className="section-rail__dot"
        >
          <span className="section-rail__label">{s.label}</span>
        </button>
      ))}
    </aside>
  );
}
