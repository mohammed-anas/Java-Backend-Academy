import { Star } from "lucide-react";

/**
 * Static star display. Renders `value` filled stars out of `max` (default 5).
 */
export function StarsDisplay({ value = 5, max = 5, size = 14, className = "" }) {
  const rounded = Math.max(0, Math.min(max, Math.round(Number(value) || 0)));
  return (
    <div
      className={`inline-flex items-center gap-[3px] ${className}`}
      role="img"
      aria-label={`${rounded} out of ${max} stars`}
    >
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={
            i < rounded
              ? "fill-[color:var(--accent)] text-[color:var(--accent)]"
              : "text-[color:var(--line)]"
          }
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}

/**
 * Interactive rating input. `value` / `onChange` are the controlled 1–5 selection.
 */
export function StarsInput({ value = 0, onChange, max = 5, size = 22 }) {
  return (
    <div className="inline-flex items-center gap-1" role="radiogroup" aria-label="Star rating">
      {Array.from({ length: max }).map((_, i) => {
        const n = i + 1;
        const active = n <= value;
        return (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={active}
            data-testid={`rating-star-${n}`}
            onClick={() => onChange?.(n)}
            className="p-1 -m-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] transition-transform hover:scale-110"
          >
            <Star
              size={size}
              strokeWidth={1.6}
              className={
                active
                  ? "fill-[color:var(--accent)] text-[color:var(--accent)]"
                  : "text-[color:var(--ink-2)]"
              }
            />
          </button>
        );
      })}
    </div>
  );
}
