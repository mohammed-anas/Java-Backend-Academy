export const BRAND = {
  name: "Java Backend Academy",
  short: "JBA",
  tagline: "The workshop for serious backend engineers.",
  phone: "+91 70606 49647",
  phoneHref: "tel:+917060649647",
  whatsappNumber: "917060649647", // used to build wa.me links
  whatsapp: "+91 70606 49647",
  whatsappHref:
    "https://wa.me/917060649647?text=Hi%20Java%20Backend%20Academy%2C%20I'd%20like%20to%20know%20about%20the%20next%20cohort.",
  address:
    "Near Masjid Aman, Kela Nagar, Aligarh, Uttar Pradesh 202001",
  hours: "Mon–Sat · 19:00 – 20:00 IST",
  mapEmbed:
    "https://www.google.com/maps?q=Java+Backend+Academy,+Masjid+Aaman,+Kela+Nagar,+Aligarh,+Uttar+Pradesh+202001&output=embed",
  mapLink:
    "https://www.google.com/maps/dir/?api=1&destination=Masjid+Aaman,+Kela+Nagar,+Aligarh,+Uttar+Pradesh+202001",
  socials: [
    { label: "LinkedIn", href: "https://www.linkedin.com/" },
    { label: "YouTube", href: "https://www.youtube.com/" },
    { label: "GitHub", href: "https://github.com/" },
    { label: "X / Twitter", href: "https://x.com/" },
  ],
};

export const COURSES = [
  // ═══════════════════════════════════════════════════════════════════════════
  // FOUNDATION TRACK — Start here. These two can be done in parallel.
  // ═══════════════════════════════════════════════════════════════════════════
  {
    n: "01",
    title: "Core Java",
    kicker: "Foundation · Start Here",
    duration: "10 weeks",
    mode: "Live · Weekend",
    track: "foundation",
    order: "Start here — prerequisite for all other courses",
    body: "OOP from first principles to virtual threads. Collections, generics, streams, memory model, GC tuning and JVM profiling — the way senior engineers actually write Java.",
  },
  {
    n: "02",
    title: "Data Structures & Algorithms",
    kicker: "Patterns · Complexity",
    duration: "12 weeks",
    mode: "Live + Assignments",
    track: "foundation",
    order: "Take alongside Core Java or after",
    body: "Twelve pattern families. 200+ graded problems with editorial reviews until the intuition becomes muscle memory.",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // BACKEND DEVELOPMENT TRACK — Take these in order after Foundation.
  // ═══════════════════════════════════════════════════════════════════════════
  {
    n: "03",
    title: "Databases",
    kicker: "SQL · NoSQL · Internals",
    duration: "6 weeks",
    mode: "Live · Weekend",
    track: "backend",
    order: "After Core Java",
    body: "Schema design, indexing, query plans, transactions, replication. Deep dives into Postgres, MySQL, MongoDB and Redis — picked by problem, not by hype.",
  },
  {
    n: "04",
    title: "REST API Design",
    kicker: "Spring Boot · API Development",
    duration: "4 weeks",
    mode: "Project-Based Learning",
    track: "backend",
    order: "After Core Java + Databases",
    body: "Design scalable, secure, and maintainable REST APIs using Spring Boot. Work with CRUD operations, JWT authentication, Swagger/OpenAPI, pagination, validation, exception handling, and database integration.",
  },
  {
    n: "05",
    title: "System Design",
    kicker: "Scale · Trade-offs",
    duration: "8 weeks",
    mode: "Live · Weekend",
    track: "backend",
    order: "After Databases + REST APIs",
    body: "Design real systems — feeds, ledgers, chat, ride-hailing. Every choice defended with numbers: latency, throughput, cost and consistency.",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // DEVOPS TRACK — Can be taken after Foundation, in any order.
  // ═══════════════════════════════════════════════════════════════════════════
  {
    n: "06",
    title: "AWS Cloud",
    kicker: "Deploy · Operate · Optimise",
    duration: "6 weeks",
    mode: "Live · Weekend",
    track: "devops",
    order: "After Core Java — can parallel with Backend track",
    body: "VPC, IAM, EC2, ECS, Lambda, RDS, S3, CloudFront. Terraform from day one. Ship, monitor and cost-optimise like an SRE.",
  },
  {
    n: "07",
    title: "CI / CD",
    kicker: "Ship every day",
    duration: "3 weeks",
    mode: "Workshop",
    track: "devops",
    order: "After Core Java — can take anytime",
    body: "GitHub Actions, Docker, container registries, blue-green and canary deploys. Build reliable pipelines you'd trust with a Friday release.",
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // CAREER TRACK — Take these last, after completing technical courses.
  // ═══════════════════════════════════════════════════════════════════════════
  {
    n: "08",
    title: "Interview Preparation",
    kicker: "Structured drills",
    duration: "8 weeks",
    mode: "Cohort · Small group",
    track: "career",
    order: "After completing technical courses",
    body: "Behavioural clinic, company-tagged question banks, weekly diagnostics and mocks. Personalised study plans with a mentor accountable to your progress.",
  },
  {
    n: "09",
    title: "Job Search & Resume",
    kicker: "Offers · Not applications",
    duration: "2 weeks",
    mode: "1:1 + Workshop",
    track: "career",
    order: "Final step — take when job-ready",
    body: "Resume rewrites, referral playbooks, LinkedIn tuning, salary negotiation. The parts of the job search most institutes never teach.",
  },
];

export const IMAGES = {
  hero: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA2MjJ8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMHRlY2h8ZW58MHx8fHwxNzg0MDM0OTY1fDA&ixlib=rb-4.1.0&q=85",
  code: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzZ8MHwxfHNlYXJjaHwxfHxsZWFybmVycyUyMGNvZGluZ3xlbnwwfHx8fDE3ODQwMzQ5NjZ8MA&ixlib=rb-4.1.0&q=85",
  learners:
    "https://images.unsplash.com/photo-1629904853893-c2c8981a1dc5?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzZ8MHwxfHNlYXJjaHw0fHxsZWFybmVycyUyMGNvZGluZ3xlbnwwfHx8fDE3ODQwMzQ5NjZ8MA&ixlib=rb-4.1.0&q=85",
  whiteboard:
    "https://images.unsplash.com/photo-1532622785990-d2c36a76f5a6?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzOTB8MHwxfHNlYXJjaHwxfHx3aGl0ZWJvYXJkJTIwc2Vzc2lvbnxlbnwwfHx8fDE3ODQwMzQ5NjV8MA&ixlib=rb-4.1.0&q=85",
  office:
    "https://images.unsplash.com/photo-1631193816258-28b44b21e78b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NDh8MHwxfHNlYXJjaHwyfHxtb2Rlcm4lMjBvZmZpY2UlMjB3b3Jrc3BhY2V8ZW58MHx8fHwxNzg0MDM0OTc2fDA&ixlib=rb-4.1.0&q=85",
};

/**
 * Build a WhatsApp deep-link with a prefilled formatted enquiry.
 * Used by the contact form — the site is 100% static (no backend).
 */
export function buildWhatsAppEnquiry({ name, email, phone, course, message }) {
  const lines = [
    `Hi ${BRAND.name},`,
    ``,
    `I'd like to enquire about a course.`,
    ``,
    `• Name: ${name || "-"}`,
    email ? `• Email: ${email}` : null,
    phone ? `• Phone: ${phone}` : null,
    course ? `• Course: ${course}` : null,
    ``,
    `Message:`,
    message || "-",
  ]
    .filter(Boolean)
    .join("\n");
  return `https://wa.me/${BRAND.whatsappNumber}?text=${encodeURIComponent(lines)}`;
}
