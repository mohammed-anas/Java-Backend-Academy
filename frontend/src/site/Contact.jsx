import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { MoveRight } from "lucide-react";
import { COURSES, BRAND } from "@/site/content";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  course: "",
  message: "",
};

export default function Contact() {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  const onChange = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Please fill your name, email and a short message.");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API}/leads`, {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        course: form.course || null,
        message: form.message.trim(),
      });
      toast.success("Received. A mentor will reach out within 24 hours.");
      setForm(emptyForm);
    } catch (err) {
      const detail = err?.response?.data?.detail;
      toast.error(
        typeof detail === "string"
          ? detail
          : "Could not send. Please try again or WhatsApp us.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="contact"
      data-testid="contact-section"
      className="py-24 sm:py-28 lg:py-40 bg-[color:var(--surface)] border-t border-[color:var(--line)]"
    >
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="font-mono-tech text-[11px] tracking-[0.24em] uppercase text-[color:var(--ink-2)] mb-6">
              /07 — Enrol
            </div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.8 }}
              className="font-serif-editorial text-4xl sm:text-5xl lg:text-6xl leading-[1.02] tracking-tight"
            >
              Book a
              <em className="not-italic italic text-[color:var(--accent)]"> discovery call.</em>
            </motion.h2>

            <p className="mt-8 text-[color:var(--ink)]/85 leading-relaxed max-w-[46ch]">
              Tell us where you are, where you want to be, and which chapter
              feels furthest away. A senior mentor will call you back within
              twenty-four hours — no sales pitch, just a plan.
            </p>

            <dl className="mt-12 space-y-6 font-mono-tech text-[12px] tracking-[0.2em] uppercase">
              <div className="flex justify-between border-t border-[color:var(--line)] pt-4">
                <dt className="text-[color:var(--ink-2)]">Call</dt>
                <dd>
                  <a
                    data-testid="contact-phone-link"
                    href={BRAND.phoneHref}
                    className="link-under text-[color:var(--ink)]"
                  >
                    {BRAND.phone}
                  </a>
                </dd>
              </div>
              <div className="flex justify-between border-t border-[color:var(--line)] pt-4">
                <dt className="text-[color:var(--ink-2)]">WhatsApp</dt>
                <dd>
                  <a
                    data-testid="contact-whatsapp-link"
                    href={BRAND.whatsappHref}
                    target="_blank"
                    rel="noreferrer"
                    className="link-under text-[color:var(--ink)]"
                  >
                    {BRAND.whatsapp}
                  </a>
                </dd>
              </div>
              <div className="flex justify-between border-t border-[color:var(--line)] pt-4">
                <dt className="text-[color:var(--ink-2)]">Studio</dt>
                <dd className="text-right max-w-[26ch] normal-case tracking-normal text-[color:var(--ink)]">
                  {BRAND.address}
                </dd>
              </div>
              <div className="flex justify-between border-t border-b border-[color:var(--line)] py-4">
                <dt className="text-[color:var(--ink-2)]">Hours</dt>
                <dd className="text-[color:var(--ink)]">{BRAND.hours}</dd>
              </div>
            </dl>
          </div>

          <div className="lg:col-span-7">
            <form
              data-testid="contact-form"
              onSubmit={submit}
              className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10"
              noValidate
            >
              <FormField label="Full name" htmlFor="name" span="md:col-span-1">
                <input
                  id="name"
                  data-testid="input-name"
                  className="editorial-input"
                  type="text"
                  autoComplete="name"
                  value={form.name}
                  onChange={onChange("name")}
                  placeholder="e.g. Ananya Rao"
                  required
                />
              </FormField>

              <FormField label="Email" htmlFor="email" span="md:col-span-1">
                <input
                  id="email"
                  data-testid="input-email"
                  className="editorial-input"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={onChange("email")}
                  placeholder="you@work.com"
                  required
                />
              </FormField>

              <FormField label="Phone (optional)" htmlFor="phone" span="md:col-span-1">
                <input
                  id="phone"
                  data-testid="input-phone"
                  className="editorial-input"
                  type="tel"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={onChange("phone")}
                  placeholder="+91 XXXXX XXXXX"
                />
              </FormField>

              <FormField label="Chapter of interest" htmlFor="course" span="md:col-span-1">
                <select
                  id="course"
                  data-testid="input-course"
                  className="editorial-input appearance-none pr-6"
                  value={form.course}
                  onChange={onChange("course")}
                >
                  <option value="">Select a chapter</option>
                  {COURSES.map((c) => (
                    <option key={c.n} value={`${c.n} — ${c.title}`}>
                      {c.n} — {c.title}
                    </option>
                  ))}
                  <option value="Not sure yet">Not sure — advise me</option>
                </select>
              </FormField>

              <FormField label="Tell us where you are" htmlFor="message" span="md:col-span-2">
                <textarea
                  id="message"
                  data-testid="input-message"
                  className="editorial-input resize-none"
                  rows={4}
                  value={form.message}
                  onChange={onChange("message")}
                  placeholder="What have you tried, and what feels stuck?"
                  required
                />
              </FormField>

              <div className="md:col-span-2 flex flex-wrap items-center gap-6 pt-2">
                <button
                  type="submit"
                  data-testid="contact-submit-button"
                  disabled={loading}
                  className="btn-crisp disabled:opacity-50"
                >
                  {loading ? "Sending…" : "Send enquiry"}
                  <MoveRight size={16} />
                </button>
                <p className="font-mono-tech text-[10px] tracking-[0.24em] uppercase text-[color:var(--ink-2)] max-w-[36ch]">
                  A mentor will reply within 24 hrs · IST business days.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

function FormField({ label, htmlFor, span, children }) {
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
