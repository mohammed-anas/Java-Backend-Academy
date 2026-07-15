import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Calendar,
  Clock,
  Users,
  ArrowRight,
  MapPin,
  UserRound,
  IndianRupee,
  ShieldCheck,
  AlertTriangle,
  Filter,
  Lock,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { COURSES, BATCHES_API_URL, BATCH_INTENTS } from "@/site/content";

/* ═════════════════════════════════════════════════════════════════════════
   SEED FALLBACK — only rendered when BATCHES_API_URL is empty (i.e. the
   owner hasn't deployed the Apps Script yet). Once the env var is set, the
   sheet is the single source of truth and this seed disappears from the UI.
   These rows use the SAME shape the Apps Script emits so the same render
   path works either way.
   ═════════════════════════════════════════════════════════════════════════ */
const SEED_BATCHES = [
  {
    id: "seed-01-a",
    course_n: "01",
    course_title: "Core Java",
    start_date: "2027-02-01",
    end_date: "2027-04-12",
    time: "7:00 PM - 9:00 PM",
    days: "Sat & Sun",
    mode: "Live · Online",
    instructor: "Md. Anas",
    seats_total: 10,
    seats_left: 4,
    price: "",
    notes: "",
    overlap: false,
  },
  {
    id: "seed-03-a",
    course_n: "03",
    course_title: "Databases",
    start_date: "2027-02-15",
    end_date: "2027-03-29",
    time: "7:00 PM - 9:00 PM",
    days: "Sat & Sun",
    mode: "Live · Online",
    instructor: "Md. Anas",
    seats_total: 10,
    seats_left: 3,
    price: "",
    notes: "",
    overlap: false,
  },
  {
    id: "seed-05-a",
    course_n: "05",
    course_title: "System Design",
    start_date: "2027-03-08",
    end_date: "2027-05-03",
    time: "7:00 PM - 9:00 PM",
    days: "Sat & Sun",
    mode: "Live · Online",
    instructor: "Md. Anas",
    seats_total: 10,
    seats_left: 2,
    price: "",
    notes: "",
    overlap: false,
  },
];

/* ---------- utility ---------------------------------------------------- */

const MONTH_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function fmtDate(iso) {
  if (!iso) return "";
  const m = /^(\d{4})-(\d{2})(?:-(\d{2}))?/.exec(String(iso));
  if (!m) return String(iso);
  const y = m[1], mo = Number(m[2]), d = Number(m[3] || 1);
  return `${MONTH_SHORT[mo - 1]} ${d}, ${y}`;
}

function fmtRange(a, b) {
  if (!a) return "";
  if (!b || a === b) return fmtDate(a);
  return `${fmtDate(a)} → ${fmtDate(b)}`;
}

function normaliseBatch(b) {
  if (!b || typeof b !== "object") return null;
  const course_n = String(b.course_n || "").trim();
  const id = String(b.id || "").trim();
  const start_date = String(b.start_date || "").trim();
  if (!id || !course_n || !start_date) return null;
  const seats_total = Math.max(0, Number(b.seats_total) || 0);
  const seats_left = Math.max(0, Math.min(seats_total || 999, Number(b.seats_left) || 0));
  return {
    id,
    course_n,
    course_title: String(b.course_title || "").trim(),
    start_date,
    end_date: String(b.end_date || "").trim() || start_date,
    time: String(b.time || "").trim(),
    days: String(b.days || "").trim(),
    mode: String(b.mode || "").trim(),
    instructor: String(b.instructor || "").trim(),
    seats_total,
    seats_left,
    price: String(b.price || "").trim(),
    notes: String(b.notes || "").trim(),
    overlap: Boolean(b.overlap),
  };
}

/* Basic client-side sanitisation before we ship a POST. The Apps Script
   re-sanitises everything — this is purely UX. */
function trim(v, n) {
  return String(v == null ? "" : v).replace(/\s+/g, " ").trim().slice(0, n);
}

/* ---------- pieces ----------------------------------------------------- */

function SlotsPill({ left, total }) {
  const soldOut = left <= 0;
  const critical = !soldOut && left <= 3;
  const low = !soldOut && !critical && left <= 6;
  const tone = soldOut
    ? "text-red-700 bg-red-50 border-red-200"
    : critical
    ? "text-red-700 bg-red-50 border-red-200"
    : low
    ? "text-amber-800 bg-amber-50 border-amber-200"
    : "text-emerald-800 bg-emerald-50 border-emerald-200";
  const dot = soldOut || critical ? "bg-red-500" : low ? "bg-amber-500" : "bg-emerald-500";
  const label = soldOut
    ? "Sold out"
    : `${left} / ${total || "—"} left`;
  return (
    <span
      className={`inline-flex items-center gap-2 px-2.5 py-1 border rounded-full font-mono-tech text-[10px] tracking-[0.18em] uppercase ${tone}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dot} ${soldOut ? "" : "animate-pulse"}`} />
      {label}
    </span>
  );
}

function CourseChip({ active, count, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group inline-flex items-center gap-2 px-3.5 py-1.5 border rounded-full font-mono-tech text-[11px] tracking-[0.2em] uppercase transition-all
        ${
          active
            ? "bg-[color:var(--ink)] text-white border-[color:var(--ink)]"
            : "bg-white text-[color:var(--ink)] border-[color:var(--line)] hover:border-[color:var(--ink)]"
        }`}
    >
      <span>{label}</span>
      <span
        className={`inline-flex items-center justify-center min-w-[22px] h-[18px] px-1 rounded-full text-[10px] font-normal
          ${active ? "bg-white/15 text-white" : "bg-[color:var(--surface)] text-[color:var(--ink-2)]"}`}
      >
        {String(count).padStart(2, "0")}
      </span>
    </button>
  );
}

function BatchCard({ batch, onEnrol, onOptOut }) {
  const soldOut = batch.seats_left <= 0;
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
      className="relative bg-white border border-[color:var(--line)] hover:border-[color:var(--ink)] transition-colors"
    >
      {batch.overlap && (
        <div className="absolute -top-2 left-4 z-10">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-amber-50 border border-amber-200 text-amber-800 font-mono-tech text-[9px] tracking-[0.2em] uppercase">
            <AlertTriangle size={10} /> Overlaps in-course
          </span>
        </div>
      )}

      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono-tech text-[10px] tracking-[0.24em] text-[color:var(--ink-2)]">
                {batch.course_n}
              </span>
              <span className="w-1 h-1 rounded-full bg-[color:var(--line)]" />
              <span className="font-mono-tech text-[10px] tracking-[0.2em] uppercase text-[color:var(--ink-2)]">
                {batch.mode || "Live"}
              </span>
            </div>
            <h3 className="font-serif-editorial text-xl sm:text-[22px] tracking-tight leading-tight">
              {batch.course_title}
            </h3>
          </div>
          <SlotsPill left={batch.seats_left} total={batch.seats_total} />
        </div>

        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 mb-5">
          <div className="flex items-center gap-2 text-[color:var(--ink)]">
            <Calendar size={13} className="text-[color:var(--accent)] shrink-0" />
            <dt className="sr-only">Dates</dt>
            <dd className="text-[13px]">{fmtRange(batch.start_date, batch.end_date)}</dd>
          </div>
          {batch.time && (
            <div className="flex items-center gap-2 text-[color:var(--ink-2)]">
              <Clock size={13} className="shrink-0" />
              <dt className="sr-only">Time</dt>
              <dd className="font-mono-tech text-[10px] tracking-[0.18em] uppercase">{batch.time}</dd>
            </div>
          )}
          {batch.days && (
            <div className="flex items-center gap-2 text-[color:var(--ink-2)]">
              <Users size={13} className="shrink-0" />
              <dt className="sr-only">Days</dt>
              <dd className="font-mono-tech text-[10px] tracking-[0.18em] uppercase">{batch.days}</dd>
            </div>
          )}
          {batch.instructor && (
            <div className="flex items-center gap-2 text-[color:var(--ink-2)]">
              <UserRound size={13} className="shrink-0" />
              <dt className="sr-only">Instructor</dt>
              <dd className="text-[12px]">{batch.instructor}</dd>
            </div>
          )}
          {batch.price && (
            <div className="flex items-center gap-2 text-[color:var(--ink-2)]">
              <IndianRupee size={13} className="shrink-0" />
              <dt className="sr-only">Fee</dt>
              <dd className="font-mono-tech text-[10px] tracking-[0.18em] uppercase">{batch.price}</dd>
            </div>
          )}
        </dl>

        {batch.notes && (
          <p className="text-[12px] leading-relaxed text-[color:var(--ink-2)] mb-5 border-l-2 border-[color:var(--line)] pl-3">
            {batch.notes}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={soldOut}
            onClick={onEnrol}
            className={`btn-crisp text-[11px] py-2 px-4 ${soldOut ? "opacity-40 cursor-not-allowed" : ""}`}
          >
            {soldOut ? "Sold out" : "Enrol"}
            {!soldOut && <ArrowRight size={14} />}
          </button>
          <button
            type="button"
            onClick={onOptOut}
            className="text-[11px] font-mono-tech tracking-[0.2em] uppercase text-[color:var(--ink-2)] hover:text-[color:var(--ink)] py-2 px-3"
          >
            Opt out / Query →
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white border border-[color:var(--line)] p-6">
      <div className="animate-pulse space-y-3">
        <div className="h-3 w-16 bg-[color:var(--surface)]" />
        <div className="h-6 w-2/3 bg-[color:var(--surface)]" />
        <div className="h-3 w-1/2 bg-[color:var(--surface)]" />
        <div className="h-3 w-1/3 bg-[color:var(--surface)]" />
        <div className="h-8 w-24 bg-[color:var(--surface)]" />
      </div>
    </div>
  );
}

/* ---------- Enrollment modal ------------------------------------------- */

function EnrollDialog({ open, onOpenChange, initial, batches, onSuccess }) {
  const [intent, setIntent]     = useState(initial?.intent || "ENROL");
  const [courseN, setCourseN]   = useState(initial?.course_n || "");
  const [batchId, setBatchId]   = useState(initial?.batch_id || "");
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [phone, setPhone]       = useState("");
  const [message, setMessage]   = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setIntent(initial?.intent || "ENROL");
    setCourseN(initial?.course_n || "");
    setBatchId(initial?.batch_id || "");
    setName(""); setEmail(""); setPhone(""); setMessage("");
    setSubmitting(false);
  }, [open, initial]);

  const activeIntent = useMemo(
    () => BATCH_INTENTS.find((i) => i.key === intent) || BATCH_INTENTS[0],
    [intent]
  );

  const availableBatches = useMemo(() => {
    if (!activeIntent.needsBatch) return [];
    if (!courseN) return batches;
    return batches.filter((b) => b.course_n === courseN);
  }, [batches, courseN, activeIntent]);

  const canSubmit =
    !submitting &&
    name.trim().length >= 2 &&
    (email.trim() || phone.trim()) &&
    (!activeIntent.needsBatch || batchId);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!canSubmit) return;
      setSubmitting(true);

      const payload = {
        intent: activeIntent.key,
        course_n: trim(courseN, 4),
        batch_id: activeIntent.needsBatch ? trim(batchId, 64) : "",
        name: trim(name, 120),
        email: trim(email, 160),
        phone: trim(phone, 32),
        message: trim(message, 1200),
      };

      if (!BATCHES_API_URL) {
        toast.info("Enrolments open shortly.", {
          description:
            "This site is being connected to the batches sheet. Message us on WhatsApp meanwhile.",
        });
        setSubmitting(false);
        onOpenChange(false);
        return;
      }

      try {
        const res = await fetch(BATCHES_API_URL, {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify(payload),
        });
        let json = {};
        try { json = await res.json(); } catch (_p) { json = {}; }

        if (json && json.ok) {
          const successMsg =
            activeIntent.key === "ENROL"
              ? "Seat reserved."
              : activeIntent.key === "OPT_OUT"
              ? "Your seat has been released."
              : "We've got your request.";
          const successDesc =
            activeIntent.key === "ENROL"
              ? typeof json.seats_left === "number"
                ? `We'll confirm on WhatsApp shortly. ${json.seats_left} seat${json.seats_left === 1 ? "" : "s"} left in this batch.`
                : "We'll confirm your seat on WhatsApp within a day."
              : activeIntent.key === "OPT_OUT"
              ? "Sorry to see you go — the seat is back in the pool."
              : "We'll be in touch shortly. Thanks for the note.";
          toast.success(successMsg, { description: successDesc });
          if (typeof onSuccess === "function") {
            // Refresh batch list so the seat counter updates on screen.
            try { onSuccess(); } catch (_r) { /* ignore refresh errors */ }
          }
          onOpenChange(false);
          return;
        }

        /* Map known server errors to human-friendly messages. */
        const errCode = String(json?.error || "");
        const seatsTotal =
          typeof json?.seats_total === "number" && json.seats_total > 0
            ? json.seats_total
            : null;
        const errMap = {
          batch_full: [
            "This batch is full.",
            seatsTotal
              ? `All ${seatsTotal} seats are taken. Choose another batch or ping us on WhatsApp for the next cohort.`
              : "All seats are taken. Choose another batch or ping us on WhatsApp for the next cohort.",
          ],
          already_enrolled:  ["You're already enrolled.", "Our records show this email / phone already holds a seat in this batch."],
          not_enrolled:      ["No enrolment on file.", "We couldn't find a prior enrolment for this email / phone in this batch."],
          enrollment_closed: ["Enrolment closed.", "This batch is no longer accepting new students."],
          unknown_batch:     ["Batch not found.", "Please refresh and pick a batch from the list."],
          rate_limited:      ["Slow down a moment.", "You just submitted a request. Please retry in ~1 minute."],
          invalid_name:      ["Name looks off.", "Please enter your full name (at least 2 characters)."],
          invalid_email:     ["Email looks off.", "Please enter a valid email address."],
          contact_required:  ["Add a contact.", "We need at least an email or a phone number to reach you."],
          busy_try_again:    ["Sheet was busy.", "Please try again in a moment."],
        };
        const [title, desc] = errMap[errCode] || [
          "Couldn't send your request.",
          "Please try again in a moment, or WhatsApp us directly.",
        ];
        toast.error(title, { description: desc });
      } catch (_err) {
        toast.error("Couldn't send your request.", {
          description: "Please try again in a moment, or WhatsApp us directly.",
        });
      } finally {
        setSubmitting(false);
      }
    },
    [activeIntent, batchId, canSubmit, courseN, email, message, name, onOpenChange, onSuccess, phone]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-white border border-[color:var(--line)] p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-3 border-b border-[color:var(--line)]">
          <DialogTitle className="font-serif-editorial text-2xl tracking-tight">
            Reserve your seat
          </DialogTitle>
          <DialogDescription className="text-[13px] text-[color:var(--ink-2)]">
            {activeIntent.hint}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          <div>
            <label className="block font-mono-tech text-[10px] tracking-[0.2em] uppercase text-[color:var(--ink-2)] mb-2">
              What would you like to do?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {BATCH_INTENTS.map((i) => (
                <button
                  key={i.key}
                  type="button"
                  onClick={() => setIntent(i.key)}
                  className={`text-left p-3 border transition-colors ${
                    intent === i.key
                      ? "border-[color:var(--ink)] bg-[color:var(--surface)]"
                      : "border-[color:var(--line)] hover:border-[color:var(--ink-2)]"
                  }`}
                >
                  <div className="font-mono-tech text-[10px] tracking-[0.18em] uppercase text-[color:var(--ink)]">
                    {i.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-mono-tech text-[10px] tracking-[0.2em] uppercase text-[color:var(--ink-2)] mb-1">
                Course
              </label>
              <select
                value={courseN}
                onChange={(e) => { setCourseN(e.target.value); setBatchId(""); }}
                className="w-full border border-[color:var(--line)] bg-white px-3 py-2 text-[13px] focus:outline-none focus:border-[color:var(--ink)]"
              >
                <option value="">— Any / Not sure —</option>
                {COURSES.map((c) => (
                  <option key={c.n} value={c.n}>
                    {c.n} — {c.title}
                  </option>
                ))}
              </select>
            </div>
            {activeIntent.needsBatch && (
              <div>
                <label className="block font-mono-tech text-[10px] tracking-[0.2em] uppercase text-[color:var(--ink-2)] mb-1">
                  Batch
                </label>
                <select
                  value={batchId}
                  onChange={(e) => setBatchId(e.target.value)}
                  className="w-full border border-[color:var(--line)] bg-white px-3 py-2 text-[13px] focus:outline-none focus:border-[color:var(--ink)]"
                  required={activeIntent.needsBatch}
                >
                  <option value="">— Select —</option>
                  {availableBatches.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.course_n} · {fmtDate(b.start_date)} · {b.days || b.time || "TBA"}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="block font-mono-tech text-[10px] tracking-[0.2em] uppercase text-[color:var(--ink-2)] mb-1">
                Your name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={120}
                required
                className="w-full border border-[color:var(--line)] bg-white px-3 py-2 text-[13px] focus:outline-none focus:border-[color:var(--ink)]"
              />
            </div>
            <div>
              <label className="block font-mono-tech text-[10px] tracking-[0.2em] uppercase text-[color:var(--ink-2)] mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength={160}
                placeholder="you@example.com"
                className="w-full border border-[color:var(--line)] bg-white px-3 py-2 text-[13px] focus:outline-none focus:border-[color:var(--ink)]"
              />
            </div>
            <div>
              <label className="block font-mono-tech text-[10px] tracking-[0.2em] uppercase text-[color:var(--ink-2)] mb-1">
                Phone / WhatsApp
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                maxLength={32}
                placeholder="+91 ..."
                className="w-full border border-[color:var(--line)] bg-white px-3 py-2 text-[13px] focus:outline-none focus:border-[color:var(--ink)]"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono-tech text-[10px] tracking-[0.2em] uppercase text-[color:var(--ink-2)] mb-1">
              Anything else? (optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              maxLength={1200}
              className="w-full border border-[color:var(--line)] bg-white px-3 py-2 text-[13px] focus:outline-none focus:border-[color:var(--ink)]"
            />
          </div>

          <p className="text-[11px] text-[color:var(--ink-2)] flex items-center gap-2">
            <ShieldCheck size={12} className="text-[color:var(--accent)]" />
            We store this request only for verifying your seat. Not shared with third parties.
          </p>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="text-[11px] font-mono-tech tracking-[0.2em] uppercase text-[color:var(--ink-2)] hover:text-[color:var(--ink)] py-2 px-3"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canSubmit}
              className={`btn-crisp text-[11px] py-2 px-4 ${!canSubmit ? "opacity-40 cursor-not-allowed" : ""}`}
            >
              {submitting ? "Sending…" : "Submit"}
              {!submitting && <ArrowRight size={14} />}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* ---------- section ---------------------------------------------------- */

export default function Batches() {
  const [batches, setBatches] = useState(null); // null = loading
  const [source, setSource]   = useState("live"); // "live" | "seed" | "error"
  const [filter, setFilter]   = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogInitial, setDialogInitial] = useState(null);

  const openDialog = useCallback((initial) => {
    setDialogInitial(initial || null);
    setDialogOpen(true);
  }, []);

  const fetchBatches = useCallback(async () => {
    if (!BATCHES_API_URL) {
      setBatches(SEED_BATCHES.map(normaliseBatch).filter(Boolean));
      setSource("seed");
      return;
    }
    try {
      const res = await fetch(BATCHES_API_URL, { method: "GET" });
      const json = await res.json();
      const raw = Array.isArray(json) ? json : Array.isArray(json?.batches) ? json.batches : [];
      const clean = raw.map(normaliseBatch).filter(Boolean);
      setBatches(clean);
      setSource("live");
    } catch (_err) {
      setBatches(SEED_BATCHES.map(normaliseBatch).filter(Boolean));
      setSource("error");
    }
  }, []);

  useEffect(() => { fetchBatches(); }, [fetchBatches]);

  const counts = useMemo(() => {
    const c = { all: 0 };
    (batches || []).forEach((b) => {
      c.all += 1;
      c[b.course_n] = (c[b.course_n] || 0) + 1;
    });
    return c;
  }, [batches]);

  const filtered = useMemo(() => {
    if (!batches) return [];
    if (filter === "all") return batches;
    return batches.filter((b) => b.course_n === filter);
  }, [batches, filter]);

  const activeCourses = useMemo(
    () => COURSES.filter((c) => (counts[c.n] || 0) > 0),
    [counts]
  );

  return (
    <section
      id="batches"
      data-testid="batches-section"
      className="py-24 sm:py-28 lg:py-40 bg-[color:var(--bg)] border-t border-[color:var(--line)]"
    >
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-12 lg:mb-16">
          <div className="lg:col-span-4">
            <div className="font-mono-tech text-[11px] tracking-[0.24em] uppercase text-[color:var(--ink-2)] mb-6">
              /03 — Upcoming batches
            </div>
            <p className="hidden lg:flex items-center gap-2 text-[11px] font-mono-tech tracking-[0.2em] uppercase text-[color:var(--ink-2)]">
              <Lock size={11} /> Owner-managed schedule
            </p>
          </div>
          <div className="lg:col-span-8">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.8, ease: [0.2, 0.7, 0.2, 1] }}
              className="font-serif-editorial text-4xl sm:text-5xl lg:text-6xl leading-[1.02] tracking-tight max-w-[18ch]"
            >
              Find your
              <em className="not-italic italic text-[color:var(--accent)]"> batch.</em>
              <span> Reserve your seat.</span>
            </motion.h2>
            <p className="mt-6 text-[color:var(--ink)]/80 max-w-[52ch]">
              Small cohorts, limited seats. Pick a course, see live slots, and enrol —
              or tell us you&apos;re still exploring. We&apos;ll take it from there.
            </p>
          </div>
        </div>

        {/* Filter chips */}
        {batches && batches.length > 0 && (
          <div className="mb-8 flex flex-wrap items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 mr-2 text-[color:var(--ink-2)]">
              <Filter size={13} />
              <span className="font-mono-tech text-[10px] tracking-[0.2em] uppercase">Filter</span>
            </div>
            <CourseChip
              active={filter === "all"}
              count={counts.all || 0}
              label="All"
              onClick={() => setFilter("all")}
            />
            {activeCourses.map((c) => (
              <CourseChip
                key={c.n}
                active={filter === c.n}
                count={counts[c.n] || 0}
                label={`${c.n} · ${c.title}`}
                onClick={() => setFilter(c.n)}
              />
            ))}
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {batches === null ? (
              <>
                <SkeletonCard /><SkeletonCard /><SkeletonCard />
              </>
            ) : filtered.length === 0 ? (
              <div className="col-span-full">
                <div className="border border-dashed border-[color:var(--line)] bg-white p-10 text-center">
                  <p className="font-serif-editorial text-2xl tracking-tight mb-2">
                    No upcoming batches for this course yet.
                  </p>
                  <p className="text-[color:var(--ink-2)] text-[13px] mb-5">
                    Get on the notification list — we&apos;ll message you the moment a slot opens.
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      openDialog({
                        intent: "INTERESTED",
                        course_n: filter === "all" ? "" : filter,
                      })
                    }
                    className="btn-crisp text-[11px] py-2 px-4"
                  >
                    Notify me
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ) : (
              filtered.map((b) => (
                <BatchCard
                  key={b.id}
                  batch={b}
                  onEnrol={() =>
                    openDialog({ intent: "ENROL", course_n: b.course_n, batch_id: b.id })
                  }
                  onOptOut={() =>
                    openDialog({ intent: "OPT_OUT", course_n: b.course_n, batch_id: b.id })
                  }
                />
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Footer note */}
        <div className="mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
          <p className="font-mono-tech text-[11px] tracking-[0.2em] uppercase text-[color:var(--ink-2)]">
            Can&apos;t find a suitable time?{" "}
            <button
              type="button"
              onClick={() => openDialog({ intent: "INTERESTED" })}
              className="text-[color:var(--accent)] hover:underline"
            >
              Tell us what you need →
            </button>
          </p>
          {source === "seed" && (
            <p className="text-[10px] font-mono-tech tracking-[0.2em] uppercase text-[color:var(--ink-2)]/70 flex items-center gap-1.5">
              <MapPin size={10} /> Preview schedule · owner sheet not yet linked
            </p>
          )}
          {source === "error" && (
            <p className="text-[10px] font-mono-tech tracking-[0.2em] uppercase text-amber-700 flex items-center gap-1.5">
              <AlertTriangle size={10} /> Showing cached schedule · live sheet unreachable
            </p>
          )}
        </div>
      </div>

      <EnrollDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initial={dialogInitial}
        batches={batches || []}
        onSuccess={fetchBatches}
      />
    </section>
  );
}
