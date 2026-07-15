import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { MoveRight, PenSquare, ArrowLeft, ArrowRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { StarsDisplay, StarsInput } from "@/site/Stars";
import { COURSES, REVIEWS_API_URL } from "@/site/content";

const SEED_REVIEWS = [
];

function normaliseReview(r) {
  if (!r || typeof r !== "object") return null;
  const rating = Math.max(0, Math.min(5, Math.round(Number(r.rating) || 0)));
  const name = String(r.name || "").trim();
  const comment = String(r.comment || "").trim();
  if (!name || !comment) return null;
  return {
    name,
    rating: rating || 5,
    batch: String(r.batch || "").trim(),
    grade: String(r.grade || "").trim(),
    from: String(r.from || "").trim(),
    to: String(r.to || "").trim(),
    comment,
  };
}

function formatMonth(iso) {
  if (!iso) return "";
  const m = /^(\d{4})-(\d{2})/.exec(String(iso));
  if (!m) return iso;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, 1);
  return d.toLocaleString("en-US", { month: "short", year: "numeric" });
}

/* Normalise a batch string to a stable course key ("01 — Core Java" → "01").
   Falls back to "other" when the batch doesn't match a known course number. */
function courseKeyFromBatch(batch) {
  const m = /^\s*(\d{2})/.exec(String(batch || ""));
  if (!m) return "other";
  return m[1];
}

const ALL_KEY = "all";

export default function Reviews() {
  const [reviews, setReviews] = useState(SEED_REVIEWS);
  const [idx, setIdx] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeCourse, setActiveCourse] = useState(ALL_KEY);

  useEffect(() => {
    if (!REVIEWS_API_URL) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(REVIEWS_API_URL, { method: "GET" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const items = Array.isArray(data)
          ? data
          : Array.isArray(data?.reviews)
            ? data.reviews
            : [];
        const cleaned = items.map(normaliseReview).filter(Boolean);
        if (!cancelled && cleaned.length > 0) {
          setReviews(cleaned);
          setIdx(0);
        }
      } catch {
        /* silent — keep seed reviews */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  /* Build course-wise counts + filtered list based on the active course. */
  const countsByCourse = reviews.reduce((acc, r) => {
    const k = courseKeyFromBatch(r.batch);
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {});

  const filtered =
    activeCourse === ALL_KEY
      ? reviews
      : reviews.filter((r) => courseKeyFromBatch(r.batch) === activeCourse);

  /* Reset the carousel position whenever the filter changes or the list shrinks. */
  useEffect(() => {
    setIdx(0);
  }, [activeCourse, filtered.length]);

  const safeIdx = filtered.length ? idx % filtered.length : 0;

  const next = useCallback(
    () => setIdx((v) => (filtered.length ? (v + 1) % filtered.length : 0)),
    [filtered.length],
  );
  const prev = useCallback(
    () =>
      setIdx((v) =>
        filtered.length ? (v - 1 + filtered.length) % filtered.length : 0,
      ),
    [filtered.length],
  );

  const current = filtered[safeIdx];

  return (
    <section
      id="reviews"
      data-testid="reviews-section"
      className="py-24 sm:py-28 lg:py-40 bg-[color:var(--bg)]"
    >
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-14 lg:mb-16">
          <div className="lg:col-span-4">
            <div className="font-mono-tech text-[11px] tracking-[0.24em] uppercase text-[color:var(--ink-2)]">
              /08 — On the record
            </div>
          </div>
          <div className="lg:col-span-8 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.8 }}
              className="font-serif-editorial text-4xl sm:text-5xl lg:text-6xl leading-[1.02] tracking-tight max-w-[22ch]"
            >
              Words from
              <em className="not-italic italic text-[color:var(--accent)]"> our students.</em>
            </motion.h2>

            <button
              data-testid="open-review-form"
              onClick={() => setDialogOpen(true)}
              className="btn-crisp shrink-0 self-start"
            >
              <PenSquare size={14} />
              Share your story
            </button>
          </div>
        </div>

        <CourseFilter
          courses={COURSES}
          counts={countsByCourse}
          total={reviews.length}
          active={activeCourse}
          onChange={setActiveCourse}
        />

        <div
          className="border-t border-b border-[color:var(--line)] py-10 lg:py-16 relative min-h-[320px] sm:min-h-[280px]"
          data-testid="review-viewer"
        >
          <div className="absolute -top-6 left-0 font-serif-editorial text-[120px] leading-none text-[color:var(--accent)] select-none pointer-events-none">
            &ldquo;
          </div>

          <AnimatePresence mode="wait">
            {current ? (
              <motion.figure
                key={`${activeCourse}-${safeIdx}-${current.name}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 max-w-[68ch]"
              >
                <div className="mb-6">
                  <StarsDisplay value={current.rating} size={18} />
                </div>
                <blockquote className="font-serif-editorial text-2xl sm:text-3xl lg:text-4xl leading-snug tracking-tight text-[color:var(--ink)]">
                  {current.comment}
                </blockquote>
                <figcaption className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 font-mono-tech text-[11px] tracking-[0.2em] uppercase">
                  <div>
                    <div className="text-[color:var(--ink)]">— {current.name}</div>
                    {current.grade && (
                      <div className="text-[color:var(--ink-2)] mt-1">{current.grade}</div>
                    )}
                  </div>
                  <div>
                    {current.batch && (
                      <div className="text-[color:var(--ink)]">Batch · {current.batch}</div>
                    )}
                    {(current.from || current.to) && (
                      <div className="text-[color:var(--ink-2)] mt-1">
                        {formatMonth(current.from) || "—"} → {formatMonth(current.to) || "present"}
                      </div>
                    )}
                  </div>
                </figcaption>
              </motion.figure>
            ) : (
              <motion.div
                key={`empty-${activeCourse}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.4 }}
                data-testid="review-empty"
                className="relative z-10 max-w-[52ch]"
              >
                <div className="font-mono-tech text-[11px] tracking-[0.24em] uppercase text-[color:var(--ink-2)] mb-4">
                  No reviews yet
                </div>
                <p className="font-serif-editorial text-2xl sm:text-3xl leading-snug tracking-tight text-[color:var(--ink)]">
                  This course doesn&apos;t have any reviews yet.
                  <em className="not-italic italic text-[color:var(--accent)]">
                    {" "}Be the first to share your story.
                  </em>
                </p>
                <button
                  data-testid="review-empty-cta"
                  onClick={() => setDialogOpen(true)}
                  className="btn-crisp mt-8"
                >
                  <PenSquare size={14} />
                  Write a review
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-8 flex items-center justify-between">
          <div
            data-testid="review-counter"
            className="font-mono-tech text-[11px] tracking-[0.24em] uppercase text-[color:var(--ink-2)]"
          >
            {filtered.length
              ? `${String(safeIdx + 1).padStart(2, "0")} / ${String(filtered.length).padStart(2, "0")}`
              : "00 / 00"}
          </div>
          <div className="flex gap-3">
            <button
              data-testid="review-prev"
              onClick={prev}
              aria-label="Previous review"
              disabled={filtered.length < 2}
              className="w-11 h-11 border border-[color:var(--ink)] hover:bg-[color:var(--ink)] hover:text-[color:var(--bg)] transition-colors inline-flex items-center justify-center disabled:opacity-40 disabled:pointer-events-none"
            >
              <ArrowLeft size={16} />
            </button>
            <button
              data-testid="review-next"
              onClick={next}
              aria-label="Next review"
              disabled={filtered.length < 2}
              className="w-11 h-11 border border-[color:var(--ink)] hover:bg-[color:var(--accent)] hover:border-[color:var(--accent)] hover:text-white transition-colors inline-flex items-center justify-center disabled:opacity-40 disabled:pointer-events-none"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <ReviewDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Submission dialog                                                    */
/* ------------------------------------------------------------------ */

const emptyReview = {
  name: "",
  rating: 0,
  batch: "",
  from: "",
  to: "",
  grade: "",
  comment: "",
};

function ReviewDialog({ open, onOpenChange }) {
  const [form, setForm] = useState(emptyReview);
  const [submitting, setSubmitting] = useState(false);

  const set = (k) => (e) =>
    setForm((f) => ({
      ...f,
      [k]: e && e.target ? e.target.value : e,
    }));

  const submit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    if (!form.name.trim()) return toast.error("Please add your name.");
    if (!form.comment.trim() || form.comment.trim().length < 12)
      return toast.error("Please write a short review (at least 12 characters).");
    if (!form.rating) return toast.error("Please pick a star rating.");

    setSubmitting(true);

    if (!REVIEWS_API_URL) {
      setSubmitting(false);
      toast.error("Reviews endpoint isn't configured yet. Please try again later.");
      return;
    }

    try {
      const res = await fetch(REVIEWS_API_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          action: "submit",
          name: form.name.trim().slice(0, 120),
          rating: Number(form.rating) || 5,
          batch: form.batch.trim().slice(0, 120),
          from: form.from.trim().slice(0, 32),
          to: form.to.trim().slice(0, 32),
          grade: form.grade.trim().slice(0, 160),
          comment: form.comment.trim().slice(0, 1200),
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      toast.success(
        "Thanks — your review is in. It'll appear here once the team approves it.",
      );
      setForm(emptyReview);
      onOpenChange(false);
    } catch {
      toast.error("Could not submit right now. Please try again in a moment.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-[640px] bg-[color:var(--surface)] border border-[color:var(--ink)] rounded-none p-0 shadow-2xl"
        data-testid="review-dialog"
      >
        <div className="px-6 sm:px-10 pt-8 pb-4 border-b border-[color:var(--line)]">
          <DialogHeader>
            <div className="font-mono-tech text-[11px] tracking-[0.24em] uppercase text-[color:var(--ink-2)] mb-3">
              Share your story
            </div>
            <DialogTitle className="font-serif-editorial text-3xl sm:text-4xl leading-tight tracking-tight text-[color:var(--ink)]">
              Write a review.
              <em className="not-italic italic text-[color:var(--accent)]"> Help the next cohort.</em>
            </DialogTitle>
            <DialogDescription className="text-sm text-[color:var(--ink)]/80 leading-relaxed pt-2 max-w-[52ch]">
              Reviews are moderated — yours goes into a queue and appears on the site once we
              approve it.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form
          onSubmit={submit}
          data-testid="review-form"
          className="px-6 sm:px-10 py-8 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8"
          noValidate
        >
          <Field label="Your name" htmlFor="rv-name" span="sm:col-span-1">
            <input
              id="rv-name"
              data-testid="rv-input-name"
              className="editorial-input"
              value={form.name}
              onChange={set("name")}
              placeholder="e.g. Priya Iyer"
              maxLength={120}
              required
            />
          </Field>

          <Field label="Where you study / work" htmlFor="rv-grade" span="sm:col-span-1">
            <input
              id="rv-grade"
              data-testid="rv-input-grade"
              className="editorial-input"
              value={form.grade}
              onChange={set("grade")}
              placeholder="e.g. 3rd yr · VIT, or SDE · Flipkart"
              maxLength={160}
            />
          </Field>

          <Field label="Batch / course joined" htmlFor="rv-batch" span="sm:col-span-2">
            <select
              id="rv-batch"
              data-testid="rv-input-batch"
              className="editorial-input appearance-none pr-6"
              value={form.batch}
              onChange={set("batch")}
            >
              <option value="">Select the course you took</option>
              {COURSES.map((c) => (
                <option key={c.n} value={`${c.n} — ${c.title}`}>
                  {c.n} — {c.title}
                </option>
              ))}
              <option value="Multiple courses">Multiple courses</option>
            </select>
          </Field>

          <Field label="From (month)" htmlFor="rv-from" span="sm:col-span-1">
            <input
              id="rv-from"
              data-testid="rv-input-from"
              type="month"
              className="editorial-input"
              value={form.from}
              onChange={set("from")}
            />
          </Field>

          <Field label="To (month)" htmlFor="rv-to" span="sm:col-span-1">
            <input
              id="rv-to"
              data-testid="rv-input-to"
              type="month"
              className="editorial-input"
              value={form.to}
              onChange={set("to")}
            />
          </Field>

          <Field label="Your rating" htmlFor="rv-rating" span="sm:col-span-2">
            <div className="pt-1">
              <StarsInput
                value={form.rating}
                onChange={(v) => setForm((f) => ({ ...f, rating: v }))}
              />
            </div>
          </Field>

          <Field label="Your review" htmlFor="rv-comment" span="sm:col-span-2">
            <textarea
              id="rv-comment"
              data-testid="rv-input-comment"
              className="editorial-input resize-none"
              rows={4}
              value={form.comment}
              onChange={set("comment")}
              placeholder="What did you learn? What surprised you? Would you recommend it?"
              maxLength={1200}
              required
            />
          </Field>

          <div className="sm:col-span-2 flex flex-wrap items-center gap-6 pt-2">
            <button
              type="submit"
              data-testid="rv-submit"
              disabled={submitting}
              className="btn-crisp disabled:opacity-50"
            >
              {submitting ? "Submitting…" : "Submit for review"}
              <MoveRight size={16} />
            </button>
            <p className="font-mono-tech text-[10px] tracking-[0.24em] uppercase text-[color:var(--ink-2)] max-w-[42ch]">
              Moderated · appears once we approve. No email is collected.
            </p>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, htmlFor, span, children }) {
  return (
    <div className={span}>
      <label
        htmlFor={htmlFor}
        className="block font-mono-tech text-[10px] tracking-[0.28em] uppercase text-[color:var(--ink-2)] mb-2"
      >
        {label}
      </label>
      {children}
    </div>
  );
}


/* ------------------------------------------------------------------ */
/* Course filter — chips that let readers view reviews course-wise      */
/* ------------------------------------------------------------------ */

function CourseFilter({ courses, counts, total, active, onChange }) {
  return (
    <div
      data-testid="review-course-filter"
      className="mb-8 lg:mb-12 border-t border-[color:var(--line)] pt-6"
    >
      <div className="font-mono-tech text-[10px] tracking-[0.28em] uppercase text-[color:var(--ink-2)] mb-4">
        Filter by course
      </div>
      <div className="flex flex-wrap gap-2">
        <FilterChip
          testId="review-filter-all"
          label="All courses"
          count={total}
          active={active === ALL_KEY}
          onClick={() => onChange(ALL_KEY)}
        />
        {courses.map((c) => {
          const count = counts[c.n] || 0;
          const isActive = active === c.n;
          return (
            <FilterChip
              key={c.n}
              testId={`review-filter-${c.n}`}
              label={`${c.n} — ${c.title}`}
              count={count}
              active={isActive}
              muted={count === 0}
              onClick={() => onChange(c.n)}
            />
          );
        })}
      </div>
    </div>
  );
}

function FilterChip({ testId, label, count, active, muted, onClick }) {
  return (
    <button
      type="button"
      data-testid={testId}
      onClick={onClick}
      aria-pressed={active}
      className={[
        "group inline-flex items-center gap-2 border px-3 py-2 text-[11px] font-mono-tech tracking-[0.18em] uppercase transition-colors",
        active
          ? "bg-[color:var(--ink)] text-[color:var(--bg)] border-[color:var(--ink)]"
          : "bg-transparent text-[color:var(--ink)] border-[color:var(--line)] hover:border-[color:var(--ink)]",
        muted && !active ? "opacity-50" : "",
      ].join(" ")}
    >
      <span>{label}</span>
      <span
        className={[
          "inline-flex items-center justify-center min-w-[1.5rem] h-5 px-1 text-[10px] tracking-normal border",
          active
            ? "border-[color:var(--bg)]/40 text-[color:var(--bg)]"
            : "border-[color:var(--line)] text-[color:var(--ink-2)] group-hover:border-[color:var(--ink)]",
        ].join(" ")}
      >
        {String(count).padStart(2, "0")}
      </span>
    </button>
  );
}
