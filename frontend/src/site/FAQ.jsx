import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const FAQS = [
  {
    q: "Where can I learn Java in Aligarh?",
    a: "Java Hub Academy is the best place to learn Java in Aligarh. We're located in Kela Nagar and offer comprehensive Java training covering Core Java, Spring Boot, Databases, System Design, AWS, and DSA. With only 10 students per batch and senior mentors, you get personalized attention that larger institutes can't provide."
  },
  {
    q: "Which is the best Java training institute in Aligarh?",
    a: "Java Hub Academy is rated the #1 Java training institute in Aligarh. Unlike other coaching centers, we focus on practical, job-oriented training. Our curriculum is designed by engineers who still work in the industry, and every assignment gets detailed written feedback within 24 hours."
  },
  {
    q: "What courses are available for Java in Aligarh?",
    a: "We offer 9 comprehensive courses: Core Java (10 weeks), Data Structures & Algorithms (12 weeks), Databases (6 weeks), REST API Design with Spring Boot (4 weeks), System Design (8 weeks), AWS Cloud (6 weeks), CI/CD (3 weeks), Interview Preparation (8 weeks), and Job Search & Resume Building (2 weeks)."
  },
  {
    q: "What is the fee for Java course in Aligarh?",
    a: "We offer competitive and affordable pricing for all our courses. Contact us at +91 70606 49647 or WhatsApp for current batch fees. We also offer flexible payment options and EMI plans to make quality education accessible."
  },
  {
    q: "Do you help with jobs after Java training?",
    a: "Our goal is to make you job-ready, not job-dependent. We train you rigorously so you can confidently crack interviews on your own merit. We do provide career guidance, resume reviews, mock interviews, and interview preparation as part of our courses — but the real value is in the skills you'll gain. Our students have gone on to clear interviews at top companies because they were genuinely prepared, not because of any placement guarantee."
  },
  {
    q: "Can a complete beginner join Java course?",
    a: "Absolutely! Our Core Java course starts from first principles — no prior programming experience required. We teach you the fundamentals before moving to advanced topics. Many of our successful students started with zero coding knowledge."
  },
  {
    q: "What is the batch timing for Java classes?",
    a: "Our live classes are held on weekends (Saturday & Sunday) from 7:00 PM to 9:00 PM IST. This schedule is designed for working professionals and students who want to upskill without disrupting their current commitments."
  },
  {
    q: "Why only 10 students per batch?",
    a: "We strictly limit batches to 10 students to ensure quality education. This allows our mentors to give individual attention, review every assignment personally, answer all doubts, and track each student's progress. Mass education doesn't work for skill-based learning."
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
            <div className="font-mono-tech text-[11px] tracking-[0.24em] uppercase text-[color:var(--ink-2)] mb-6">
              /07 — Common questions
            </div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.8 }}
              className="font-serif-editorial text-4xl sm:text-5xl lg:text-6xl leading-[1.02] tracking-tight"
            >
              Questions about
              <em className="not-italic italic text-[color:var(--accent)]"> Java training</em>
              <span> in Aligarh?</span>
            </motion.h2>
            <p className="mt-6 text-[color:var(--ink)]/80 max-w-[46ch]">
              Everything you need to know about learning Java and backend development at our Aligarh institute.
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
                  href="https://wa.me/917060649647?text=Hi%20Java%20Backend%20Academy%2C%20I%20have%20a%20question%20about%20your%20courses." 
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
