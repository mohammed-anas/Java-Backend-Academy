import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

/** Keep Q&As in sync with FAQPage JSON-LD in public/index.html. */
const FAQS = [
  {
    q: "Where can I learn Java with real backend projects?",
    a: "Java Hub Academy runs live cohorts in Core Java, Spring Boot, System Design, AWS and DSA — capped at 10 students per batch with senior mentors. Join from the studio or online from anywhere.",
  },
  {
    q: "What makes Java Hub Academy different?",
    a: "Unlike mass coaching centres, every batch is capped at 10 students, mentors are working senior engineers, and every assignment gets written feedback within 24 hours. We measure job-ready skills, not lecture hours.",
  },
  {
    q: "Where is your studio, and can I join online?",
    a: "Our studio is at Near Masjid Aman, Kela Nagar, Aligarh, Uttar Pradesh 202001 (Mon–Sat, 7–8 PM IST). Live online seats are open to learners across India and worldwide — same mentors, projects and feedback.",
  },
  {
    q: "What is the fee for the Java course?",
    a: "Fees vary by course and batch. Contact us at +91 70606 49647 or WhatsApp for current fees and payment options. Flexible plans are available for students.",
  },
  {
    q: "What courses do you offer?",
    a: "Nine courses: Core Java (10 weeks), Data Structures & Algorithms (12 weeks), Databases (6 weeks), REST API Design with Spring Boot (4 weeks), System Design (8 weeks), AWS Cloud (6 weeks), CI/CD (3 weeks), Interview Preparation (8 weeks), and Job Search & Resume (2 weeks).",
  },
  {
    q: "Can complete beginners join?",
    a: "Yes. Core Java starts from first principles — no prior programming experience required. Many successful students began with zero coding background.",
  },
  {
    q: "Do you help with jobs after training?",
    a: "We make you job-ready — not job-dependent. Training includes career guidance, resume reviews and mock interviews. Students crack interviews at top companies on their own merit because they are genuinely prepared.",
  },
  {
    q: "Why only 10 students per batch?",
    a: "Small batches mean individual attention, personal assignment reviews, and real progress tracking. Mass education does not work for skill-based learning.",
  },
];

function FAQItem({ faq, isOpen, onToggle }) {
  return (
    <div className="border-b border-[color:var(--line)]">
      <button
        onClick={onToggle}
        className="w-full py-5 flex items-start justify-between text-left hover:text-[color:var(--accent)] transition-colors"
        aria-expanded={isOpen}
      >
        <h3 className="font-medium text-base sm:text-lg pr-4 text-[color:var(--ink)]">
          {faq.q}
        </h3>
        <span className="mt-1 shrink-0 text-[color:var(--accent)]">
          {isOpen ? <Minus size={18} /> : <Plus size={18} />}
        </span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-[color:var(--ink)]/80 leading-relaxed max-w-[72ch]">
              {faq.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section
      id="faq"
      data-testid="faq-section"
      className="py-24 sm:py-28 lg:py-40 bg-[color:var(--surface)] border-t border-[color:var(--line)]"
    >
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          <div className="lg:col-span-5">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.8 }}
              className="font-serif-editorial text-4xl sm:text-5xl lg:text-6xl leading-[1.02] tracking-tight"
            >
              Questions about
              <em className="not-italic italic text-[color:var(--accent)]"> Java training</em>
              <span>?</span>
            </motion.h2>
            <p className="mt-6 text-[color:var(--ink)]/80 max-w-[46ch]">
              Everything you need to know about learning Java and backend
              development with us — studio or online.
            </p>
          </div>

          <div className="lg:col-span-7">
            <div className="border-t border-[color:var(--line)]">
              {FAQS.map((faq, idx) => (
                <FAQItem
                  key={idx}
                  faq={faq}
                  isOpen={openIndex === idx}
                  onToggle={() => setOpenIndex(openIndex === idx ? -1 : idx)}
                />
              ))}
            </div>

            <div className="mt-8 p-6 bg-[color:var(--bg)] border border-[color:var(--line)]">
              <p className="font-mono-tech text-[11px] tracking-[0.24em] uppercase text-[color:var(--ink-2)] mb-2">
                Still have questions?
              </p>
              <p className="text-[color:var(--ink)]">
                Call us at{" "}
                <a href="tel:+917060649647" className="text-[color:var(--accent)] hover:underline font-medium">
                  +91 70606 49647
                </a>{" "}
                or{" "}
                <a
                  href="https://wa.me/917060649647?text=Hi%20Java%20Hub%20Academy%2C%20I%20have%20a%20question%20about%20your%20courses."
                  target="_blank"
                  rel="noreferrer"
                  className="text-[color:var(--accent)] hover:underline font-medium"
                >
                  WhatsApp us
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
