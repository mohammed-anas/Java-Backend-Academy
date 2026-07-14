const WORDS = [
  "JAVA",
  "DSA",
  "SYSTEM DESIGN",
  "SPRING BOOT",
  "POSTGRES",
  "MONGO",
  "REDIS",
  "AWS",
  "KAFKA",
  "OBSERVABILITY",
  "INTERVIEWS",
  "APPRENTICESHIP",
];

export default function Marquee() {
  const row = WORDS.concat(WORDS);
  return (
    <section
      data-testid="marquee-band"
      aria-hidden
      className="border-y border-[color:var(--line)] py-5 sm:py-6 bg-[color:var(--surface)]"
    >
      <div className="marquee-track font-mono-tech text-[13px] sm:text-sm tracking-[0.32em] uppercase text-[color:var(--ink)]/90">
        {row.map((w, i) => (
          <span key={i} className="whitespace-nowrap px-8 flex items-center">
            {w}
            <span className="ml-8 text-[color:var(--accent)]">//</span>
          </span>
        ))}
      </div>
    </section>
  );
}
