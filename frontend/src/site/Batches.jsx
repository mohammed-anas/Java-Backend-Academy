import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, Users, ChevronDown, ArrowRight } from "lucide-react";
import { COURSES } from "@/site/content";
import { scrollToContactWithCourse } from "@/site/useLenis";

const BATCH_SCHEDULE = {
  "01": [
    { startDate: "Feb 1, 2027", time: "7:00 PM - 9:00 PM", days: "Sat & Sun", slotsLeft: 4 },
    { startDate: "Mar 15, 2027", time: "7:00 PM - 9:00 PM", days: "Sat & Sun", slotsLeft: 10 },
  ],
  "02": [
    { startDate: "Feb 8, 2027", time: "7:00 PM - 9:00 PM", days: "Sat & Sun", slotsLeft: 6 },
    { startDate: "Apr 5, 2027", time: "7:00 PM - 9:00 PM", days: "Sat & Sun", slotsLeft: 10 },
  ],
  "03": [
    { startDate: "Feb 15, 2027", time: "7:00 PM - 9:00 PM", days: "Sat & Sun", slotsLeft: 3 },
    { startDate: "Apr 12, 2027", time: "7:00 PM - 9:00 PM", days: "Sat & Sun", slotsLeft: 10 },
  ],
  "04": [
    { startDate: "Mar 1, 2027", time: "7:00 PM - 9:00 PM", days: "Sat & Sun", slotsLeft: 7 },
  ],
  "05": [
    { startDate: "Mar 8, 2027", time: "7:00 PM - 9:00 PM", days: "Sat & Sun", slotsLeft: 2 },
    { startDate: "May 10, 2027", time: "7:00 PM - 9:00 PM", days: "Sat & Sun", slotsLeft: 10 },
  ],
  "06": [
    { startDate: "Mar 22, 2027", time: "7:00 PM - 9:00 PM", days: "Sat & Sun", slotsLeft: 5 },
  ],
  "07": [
    { startDate: "Apr 1, 2027", time: "7:00 PM - 9:00 PM", days: "Sat & Sun", slotsLeft: 8 },
  ],
  "08": [
    { startDate: "Apr 19, 2027", time: "7:00 PM - 9:00 PM", days: "Sat & Sun", slotsLeft: 4 },
  ],
  "09": [
    { startDate: "May 3, 2027", time: "7:00 PM - 9:00 PM", days: "Sat & Sun", slotsLeft: 9 },
  ],
};

function SlotIndicator({ slotsLeft }) {
  const getColor = () => {
    if (slotsLeft <= 3) return "bg-red-500";
    if (slotsLeft <= 6) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="flex items-center gap-2">
      <span className={`w-2 h-2 rounded-full ${getColor()} animate-pulse`} />
      <span className={`font-mono-tech text-[11px] tracking-[0.2em] uppercase ${slotsLeft <= 3 ? "text-red-600" : "text-[color:var(--ink)]"}`}>
        {slotsLeft === 1 ? "1 slot left" : `${slotsLeft} slots left`}
      </span>
    </div>
  );
}

function CourseCard({ course, isExpanded, onToggle }) {
  const batches = BATCH_SCHEDULE[course.n] || [];
  const nextBatch = batches[0];

  return (
    <motion.div
      layout
      className="border border-[color:var(--line)] bg-white"
    >
      <button
        onClick={onToggle}
        className="w-full p-5 sm:p-6 flex items-center justify-between text-left hover:bg-[color:var(--surface)] transition-colors"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <span className="font-mono-tech text-[11px] tracking-[0.24em] text-[color:var(--ink-2)]">
              {course.n}
            </span>
            <h3 className="font-serif-editorial text-xl sm:text-2xl tracking-tight">
              {course.title}
            </h3>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-[color:var(--ink-2)]">
            <span className="font-mono-tech text-[10px] tracking-[0.2em] uppercase">
              {course.duration}
            </span>
            {nextBatch && (
              <>
                <span className="text-[color:var(--line)]">|</span>
                <span className="font-mono-tech text-[10px] tracking-[0.2em] uppercase text-[color:var(--accent)]">
                  Next: {nextBatch.startDate}
                </span>
              </>
            )}
          </div>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="ml-4 text-[color:var(--ink-2)]"
        >
          <ChevronDown size={20} />
        </motion.div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.2, 0.7, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="px-5 sm:px-6 pb-6 border-t border-[color:var(--line)]">
              <div className="pt-5 space-y-4">
                {batches.length > 0 ? (
                  batches.map((batch, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-[color:var(--surface)] border border-[color:var(--line)] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[color:var(--ink)]">
                          <Calendar size={14} className="text-[color:var(--accent)]" />
                          <span className="font-medium">{batch.startDate}</span>
                        </div>
                        <div className="flex flex-wrap gap-4 text-[color:var(--ink-2)]">
                          <div className="flex items-center gap-2">
                            <Clock size={12} />
                            <span className="font-mono-tech text-[10px] tracking-[0.18em] uppercase">
                              {batch.time}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users size={12} />
                            <span className="font-mono-tech text-[10px] tracking-[0.18em] uppercase">
                              {batch.days}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <SlotIndicator slotsLeft={batch.slotsLeft} />
                        <button
                          onClick={() => scrollToContactWithCourse(`${course.n} — ${course.title}`)}
                          className="btn-crisp text-[11px] py-2 px-4"
                        >
                          Enrol
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 bg-[color:var(--surface)] text-center text-[color:var(--ink-2)]">
                    <p className="font-mono-tech text-[11px] tracking-[0.2em] uppercase">
                      Schedule coming soon
                    </p>
                    <button
                      onClick={() => scrollToContactWithCourse(`${course.n} — ${course.title}`)}
                      className="mt-3 text-[color:var(--accent)] font-mono-tech text-[11px] tracking-[0.2em] uppercase hover:underline"
                    >
                      Get notified →
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Batches() {
  const [expandedCourse, setExpandedCourse] = useState("01");

  const toggleCourse = (n) => {
    setExpandedCourse(expandedCourse === n ? null : n);
  };

  return (
    <section
      id="batches"
      data-testid="batches-section"
      className="py-24 sm:py-28 lg:py-40 bg-[color:var(--bg)] border-t border-[color:var(--line)]"
    >
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-12 lg:mb-16">
          <div className="lg:col-span-4">
            <div className="font-mono-tech text-[11px] tracking-[0.24em] uppercase text-[color:var(--ink-2)] mb-6">
              /03 — Upcoming batches
            </div>
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
              Each batch is limited to 10 students. Pick a course, check available slots, and enrol before it fills up.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {COURSES.map((course) => (
            <CourseCard
              key={course.n}
              course={course}
              isExpanded={expandedCourse === course.n}
              onToggle={() => toggleCourse(course.n)}
            />
          ))}
        </div>

        <div className="mt-10 text-center">
          <p className="font-mono-tech text-[11px] tracking-[0.24em] uppercase text-[color:var(--ink-2)]">
            Can't find a suitable time? <button onClick={() => scrollToContactWithCourse("")} className="text-[color:var(--accent)] hover:underline">Contact us</button> for custom scheduling.
          </p>
        </div>
      </div>
    </section>
  );
}
