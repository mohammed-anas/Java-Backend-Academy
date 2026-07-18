export const BRAND = {
  name: "Java Hub Academy",
  short: "JHA",
  tagline: "The workshop for serious backend engineers.",
  phone: "+91 70606 49647",
  phoneHref: "tel:+917060649647",
  whatsappNumber: "917060649647", // used to build wa.me links
  whatsapp: "+91 70606 49647",
  whatsappHref:
    "https://wa.me/917060649647?text=Hi%20Java%20Backend%20Academy%2C%20I'd%20like%20to%20know%20about%20the%20next%20cohort.",
  // NAP must stay identical everywhere (schema, footer, Location, GMB).
  city: "Aligarh",
  region: "Uttar Pradesh",
  country: "India",
  postalCode: "202001",
  address:
    "Near Masjid Aman, Kela Nagar, Aligarh, Uttar Pradesh 202001",
  hours: "Mon–Sat · 19:00 – 20:00 IST",
  mapEmbed:
    "https://www.google.com/maps?q=Java+Hub+Academy,+Masjid+Aaman,+Kela+Nagar,+Aligarh,+Uttar+Pradesh+202001&output=embed",
  mapLink:
    "https://www.google.com/maps/dir/?api=1&destination=Masjid+Aaman,+Kela+Nagar,+Aligarh,+Uttar+Pradesh+202001",
  socials: [
    { label: "LinkedIn", href: "https://www.linkedin.com/" },
    { label: "YouTube", href: "https://www.youtube.com/" },
    { label: "GitHub", href: "https://github.com/" },
    { label: "X / Twitter", href: "https://x.com/" },
  ],
};

/**
 * Reviews endpoint — Google Apps Script Web App URL (see /docs/reviews-apps-script.gs).
 * Set REACT_APP_REVIEWS_API in frontend/.env (never commit real URLs to a public repo).
 */
export const REVIEWS_API_URL = process.env.REACT_APP_REVIEWS_API || "";

/**
 * Batches endpoint — Google Apps Script Web App URL (see /docs/batches-apps-script.gs).
 * Sheet ID stays in Apps Script Script Properties only.
 * Set REACT_APP_BATCHES_API in frontend/.env. Leave empty to show seed batches.
 */
export const BATCHES_API_URL = process.env.REACT_APP_BATCHES_API || "";

/**
 * Allow-listed enrollment intents. Keep in lock-step with ALLOWED_INTENTS in
 * batches-apps-script.gs — anything else is rejected server-side.
 */
export const BATCH_INTENTS = [
  {
    key: "ENROL",
    label: "Enrol in this batch",
    hint: "Reserve a seat. We'll confirm on WhatsApp within a day.",
    needsBatch: true,
  },
  {
    key: "OPT_OUT",
    label: "Opt out of a batch I enrolled in",
    hint: "Already enrolled and can't continue? Let us know so we free the slot.",
    needsBatch: true,
  },
];

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

/**
 * Learning tracks — clean roadmap grouping, prerequisites & difficulty.
 * These map onto the COURSES list above by `track` and drive the roadmap UI.
 */
export const TRACKS = [
  {
    key: "foundation",
    label: "Start here — Basics",
    kicker: "Must-have",
    tint: "brand-4", // emerald
    summary:
      "The two courses every backend engineer needs. Even if you have never written code before, you start here.",
    accepts: [],
  },
  {
    key: "backend",
    label: "Build backends",
    kicker: "Intermediate",
    tint: "brand", // orange
    summary:
      "Turn your Java skills into real, working web servers. Databases, REST APIs and system design — the stack companies actually hire for.",
    accepts: ["foundation"],
  },
  {
    key: "devops",
    label: "Ship & operate",
    kicker: "Intermediate",
    tint: "brand-3", // indigo
    summary:
      "Take what you built and put it on the internet. Cloud, containers, pipelines — the parts that keep a backend alive.",
    accepts: ["foundation"],
  },
  {
    key: "career",
    label: "Get the job",
    kicker: "Advanced · Final step",
    tint: "brand-5", // pink
    summary:
      "Interview prep, resume, referrals and salary talks. Take this last, when you already have the technical skills in place.",
    accepts: ["backend", "devops"],
  },
];

/**
 * Combo bundles — multi-course packs that cover a real-world scenario.
 * Priced separately (contact for details). Great for GMB post links.
 */
export const COMBO_BUNDLES = [
  {
    key: "job-ready",
    title: "Job-Ready Backend Engineer",
    tag: "Most popular",
    courses: ["01", "02", "03", "04", "08", "09"],
    duration: "5–6 months",
    outcome:
      "Zero to hire-worthy. Core Java, DSA, Databases, Spring Boot REST APIs, interview prep and resume rewrite — one flow, one mentor, one plan.",
  },
  {
    key: "cloud-native",
    title: "Cloud-Native Backend",
    tag: "For working devs",
    courses: ["03", "04", "05", "06", "07"],
    duration: "6 months",
    outcome:
      "Take an existing backend to production. Databases at scale, System Design, AWS and CI/CD — build, ship, monitor, cost-optimise.",
  },
  {
    key: "campus-fast-track",
    title: "Campus Placement Fast-Track",
    tag: "For students",
    courses: ["01", "02", "04", "08"],
    duration: "4 months",
    outcome:
      "Everything a campus recruiter tests, taught in the order they test it. Java + DSA + Spring Boot REST + mock interviews.",
  },
];

/**
 * Blog articles — evergreen, enquiry-driven posts.
 * Content strategy: answer the questions a student actually types into Google
 * BEFORE they enrol ("Should I learn Java", "Java course in Aligarh fees",
 * "How to become a Java developer"), NOT dry technical explainers.
 * Rendered at /blog and /blog/:slug. Also linkable from Google Business
 * Profile "Learn More" buttons.
 */
export const BLOG_POSTS = [
  {
    slug: "editor-showcase",
    title: "Everything the new block editor can do",
    excerpt:
      "A living demo of every block type — headings, callouts, code, tables, math, images, YouTube, PDFs, todo lists, and more.",
    tag: "Editor",
    date: "2026-07-18",
    read: "3 min read",
    blocks: [
      { id: "b1", type: "heading", props: { level: 1, align: "left" }, content: "Everything the new block editor can do" },
      { id: "b2", type: "paragraph", props: { align: "left" }, content: "This post is <b>rendered from JSON blocks</b> — the same structure the editor produces when you click <code>Export JSON</code>. Paste any exported post into <code>content.js</code> under <code>BLOG_POSTS</code> and it renders like this." },
      { id: "b3", type: "callout", props: { icon: "💡", tone: "amber" }, content: "Tip: open <b>/#/admin/editor</b>, write your post, then hit “Copy for content.js” — no backend needed." },
      { id: "b4", type: "heading", props: { level: 2, align: "left" }, content: "Text & formatting" },
      { id: "b5", type: "paragraph", props: { align: "left" }, content: "Bold, <i>italic</i>, <u>underline</u>, <s>strikethrough</s>, <code>inline code</code>, and even <span data-eq=\"1\">e^{i\\pi} + 1 = 0</span> — all in one line." },
      { id: "b6", type: "heading", props: { level: 3, align: "center" }, content: "Alignment works per block" },
      { id: "b7", type: "paragraph", props: { align: "right" }, content: "This paragraph is right-aligned." },
      { id: "b8", type: "divider", content: null },
      { id: "b9", type: "heading", props: { level: 2, align: "left" }, content: "Lists" },
      { id: "bA", type: "bulletList", content: [{ text: "Bulleted item one" }, { text: "Bulleted item two" }] },
      { id: "bB", type: "numberList", content: [{ text: "First step" }, { text: "Second step" }, { text: "Third step" }] },
      { id: "bC", type: "todoList", content: [{ text: "Publish first post", checked: true }, { text: "Add cover image", checked: false }] },
      { id: "bD", type: "heading", props: { level: 2, align: "left" }, content: "Code & maths" },
      { id: "bE", type: "code", props: { lang: "java" }, content: "public class Hello {\n  public static void main(String[] args) {\n    System.out.println(\"Hello Java Hub!\");\n  }\n}" },
      { id: "bF", type: "equation", props: { inline: false }, content: "\\int_{-\\infty}^{\\infty} e^{-x^{2}}\\,dx = \\sqrt{\\pi}" },
      { id: "bG", type: "heading", props: { level: 2, align: "left" }, content: "Tables" },
      { id: "bH", type: "table", content: { rows: [["Command", "What it does"], ["git status", "See what changed"], ["git commit -m", "Save a snapshot"]] } },
      { id: "bI", type: "heading", props: { level: 2, align: "left" }, content: "Embeds" },
      { id: "bJ", type: "embed", props: { provider: "youtube" }, content: { url: "https://www.youtube.com/watch?v=eIrMbAQSU34" } },
      { id: "bK", type: "quote", props: { align: "left" }, content: "The best time to plant a tree was twenty years ago. The second best time is now." },
      { id: "bL", type: "paragraph", props: { align: "left" }, content: "Timestamp:" },
      { id: "bM", type: "date", content: { display: "Today", iso: "2026-07-18", preset: "today" } },
    ],
  },
  {
    slug: "how-to-start-learning-java-in-2026",
    title: "Java roadmap for beginners — how to start learning Java in 2026",
    excerpt:
      "You do not need a CS degree to learn Java. Here is the smallest sequence of topics that will actually get you writing real programs — in order.",
    tag: "Beginners",
    date: "2026-06-08",
    read: "6 min read",
    body: [
      "If you have never written a line of code, do not start with Spring Boot. Start with just Java. The language is not the hard part — thinking like a programmer is. That takes about six weeks of small daily practice, not a weekend crash course.",
      "Week 1–2: variables, if-else, loops, and printing to the screen. That is enough to write tiny calculators, guessing games, and simple text tools. Do twenty of these before moving on.",
      "Week 3–4: methods and classes. Learn how to break a program into small pieces. Build a to-do list on the command line — nothing fancy, just add / remove / show tasks.",
      "Week 5–6: collections (List, Map, Set) and reading files. Now you can process actual data. Try writing a program that reads a CSV of your expenses and prints a monthly total.",
      "After that, and only after that, look at Spring Boot, databases, and web APIs. Every senior engineer you admire took this exact staircase — most of them just do not remember how slow the first step felt.",
    ],
  },
];

/**
 * Quick-glance cheatsheets — one screen each, useful for revision.
 */
export const CHEATSHEETS = [
  {
    key: "big-o",
    title: "Big-O at a glance",
    intro: "Cost of the operations you'll be asked about in every DSA round.",
    rows: [
      ["Array — read by index", "O(1)"],
      ["Array — insert / delete in middle", "O(n)"],
      ["ArrayList — add at end (amortised)", "O(1)"],
      ["LinkedList — insert / delete at ends", "O(1)"],
      ["HashMap — get / put (average)", "O(1)"],
      ["HashMap — get / put (worst case)", "O(n)"],
      ["TreeMap — get / put", "O(log n)"],
      ["Binary search on a sorted array", "O(log n)"],
      ["Sorting (Arrays.sort primitives)", "O(n log n)"],
      ["Nested loop over the same list", "O(n²)"],
    ],
  },
  {
    key: "sql",
    title: "Everyday SQL you must know",
    intro: "The nine queries that cover 90% of backend work.",
    rows: [
      ["Read one row by primary key", "SELECT * FROM users WHERE id = ?"],
      ["Filter + sort", "SELECT * FROM orders WHERE status = 'PAID' ORDER BY created_at DESC"],
      ["Paginate", "SELECT * FROM posts ORDER BY id DESC LIMIT 20 OFFSET 40"],
      ["Count grouped", "SELECT status, COUNT(*) FROM orders GROUP BY status"],
      ["Inner join", "SELECT o.id, u.name FROM orders o JOIN users u ON u.id = o.user_id"],
      ["Left join with nulls", "SELECT u.id, o.id FROM users u LEFT JOIN orders o ON o.user_id = u.id"],
      ["Update by id", "UPDATE users SET status='ACTIVE' WHERE id = ?"],
      ["Insert one row", "INSERT INTO users(name, email) VALUES (?, ?)"],
      ["Delete safely", "DELETE FROM sessions WHERE expires_at < NOW()"],
    ],
  },
  {
    key: "spring-annotations",
    title: "Spring Boot annotations, decoded",
    intro: "What each of the big annotations actually does — in one line.",
    rows: [
      ["@SpringBootApplication", "Boots the app + scans this package for beans"],
      ["@RestController", "Class is a controller; every method returns JSON"],
      ["@GetMapping / @PostMapping", "Maps an HTTP verb + URL to a method"],
      ["@RequestBody", "Parse the JSON body into a Java object"],
      ["@PathVariable", "Grab a value from the URL like /users/{id}"],
      ["@RequestParam", "Grab a value from the query string like ?page=2"],
      ["@Service", "Class is business logic; Spring can inject it"],
      ["@Repository", "Class talks to the DB; wraps SQL exceptions"],
      ["@Autowired / constructor param", "Ask Spring to hand me this dependency"],
      ["@Transactional", "Run this method inside a DB transaction"],
    ],
  },
  {
    key: "git",
    title: "Git you'll use every day",
    intro: "The dozen commands that solve 95% of your version-control problems.",
    rows: [
      ["Clone a repo", "git clone <url>"],
      ["Create a branch and switch", "git checkout -b feature/x"],
      ["See what changed", "git status  &&  git diff"],
      ["Stage + commit", "git add .  &&  git commit -m 'msg'"],
      ["Push a new branch", "git push -u origin feature/x"],
      ["Pull the latest main", "git checkout main  &&  git pull"],
      ["Merge main into your branch", "git merge main"],
      ["Undo the last commit (kept)", "git reset --soft HEAD~1"],
      ["Discard local changes to a file", "git checkout -- path/file"],
      ["Stash / unstash work", "git stash  &&  git stash pop"],
    ],
  },
];

/**
 * Outcome-first trust chips shown just under the hero headline.
 * All figures are conservative and defensible — no fabricated placement counts.
 */
export const TRUST_CHIPS = [
  "Job-ready in 4–6 months",
  "Only 10 students / batch",
  "Live classes · India & online",
  "Real projects on your resume",
];

/**
 * "Who this is for" — the audience strip. Helps a visitor identify
 * themselves in five seconds, without any invented statistics.
 */
export const AUDIENCE = [
  {
    tag: "01",
    who: "BCA · MCA students",
    line: "Turn your degree into a real backend portfolio before you graduate.",
  },
  {
    tag: "02",
    who: "B.Tech / B.E. students",
    line: "Master Java, DSA and system design well before campus placement season.",
  },
  {
    tag: "03",
    who: "Fresh graduates",
    line: "Bridge the gap between a college project and a hire-worthy engineer.",
  },
  {
    tag: "04",
    who: "Working professionals",
    line: "Break into backend, or level up from support / QA into a core dev role.",
  },
  {
    tag: "05",
    who: "Career switchers",
    line: "Non-CS background? We start from first principles — no prior code required.",
  },
];

/**
 * Real, defensible projects students build across the tracks.
 * These map to the /courses list above but are named the way an interviewer
 * would recognise them — no vague "hospital management" clichés.
 */
export const PROJECTS = [
  {
    n: "P1",
    title: "Banking ledger service",
    stack: "Core Java · Postgres · Concurrency",
    line: "Money-safe transfers with row-level locking, idempotency keys and audit logs. The classic interview whiteboard, built for real.",
  },
  {
    n: "P2",
    title: "URL shortener at scale",
    stack: "Spring Boot · Redis · Postgres",
    line: "Base62 encoder, cache-aside reads, TTL cleanup, rate limiting per API key. Ship the metrics dashboard too.",
  },
  {
    n: "P3",
    title: "Chat service",
    stack: "Spring · WebSockets · MongoDB",
    line: "Rooms, presence, typing indicators, offline delivery via a persistent inbox. Includes load-test scripts.",
  },
  {
    n: "P4",
    title: "E-commerce REST API",
    stack: "Spring Boot · JWT · Swagger",
    line: "Catalog, cart, checkout, orders with proper validation, exception handling and pagination. Deploys to AWS.",
  },
  {
    n: "P5",
    title: "Job queue + worker pool",
    stack: "Java · Kafka · Docker",
    line: "Retry with backoff, dead-letter queues, at-least-once semantics. The pattern every microservice reaches for.",
  },
  {
    n: "P6",
    title: "AWS deployment blueprint",
    stack: "Terraform · ECS · RDS · CloudFront",
    line: "One IaC script that stands up your backend, database, CDN and monitoring — cost-tuned for personal use.",
  },
];

/**
 * Comparison table — kept factual and grounded in what we actually do,
 * versus a generic recorded / YouTube-style course. No competitor names.
 */
export const COMPARISON = {
  us: "Java Hub Academy",
  them: "Recorded courses · YouTube playlists",
  rows: [
    { row: "Cohort size", us: "Capped at 10 per batch", them: "Thousands per class" },
    { row: "Live classes", us: "Yes — every session is live", them: "No — pre-recorded videos" },
    { row: "Mentor feedback on your code", us: "Written review within 24 hours", them: "None or peer-only" },
    { row: "Projects reviewed", us: "Every submission graded personally", them: "Self-checked at best" },
    { row: "Interview preparation", us: "Included · mocks + question banks", them: "Not included" },
    { row: "Doubt support", us: "Direct WhatsApp · same day", them: "Forum / never" },
    { row: "Curriculum by", us: "Engineers who still ship in production", them: "General educators" },
    { row: "Job outcome model", us: "Interview-ready · not placement-guaranteed", them: "Certificate only" },
  ],
};

/**
 * Lead-magnet resources — offered via WhatsApp, keeping the site 100% static.
 * Clicking a card opens WhatsApp with the exact resource name prefilled.
 */
export const LEAD_MAGNETS = [
  {
    n: "R1",
    title: "Java + Backend Roadmap 2026",
    line: "A single-page PDF of every topic, in order, with time budgets.",
    ask: "the Java + Backend Roadmap 2026 PDF",
  },
  {
    n: "R2",
    title: "DSA cheat-sheet · 12 patterns",
    line: "Twelve pattern families with template code and the giveaway signals.",
    ask: "the DSA cheat-sheet (12 patterns)",
  },
  {
    n: "R3",
    title: "50 Spring Boot interview questions",
    line: "The ones actually asked in service-based and product-based rounds.",
    ask: "the 50 Spring Boot interview questions PDF",
  },
  {
    n: "R4",
    title: "System Design starter kit",
    line: "One diagramming template + five worked examples we teach in class.",
    ask: "the System Design starter kit",
  },
];

/**
 * Contact-FAB quick actions — every option deep-links to WhatsApp with the
 * conversation already framed, so the mentor can answer in one message.
 */
export const FAB_QUICK_ACTIONS = [
  { key: "mentor",    label: "Talk to a mentor",         msg: "Hi Java Hub Academy, I'd like to talk to a mentor about my learning plan." },
  { key: "fees",      label: "Get fee details",          msg: "Hi Java Hub Academy, can you share the fee details for the next cohort?" },
  { key: "demo",      label: "Book a free demo class",   msg: "Hi Java Hub Academy, I'd like to attend a free demo class. Please share the timing." },
  { key: "interview", label: "Ask about interview prep", msg: "Hi Java Hub Academy, how do you prepare students for interviews? Would love to know the process." },
];

/**
 * Build a WhatsApp deep-link with an arbitrary prefilled message.
 * Used by ContactFab quick actions and lead-magnet cards.
 */
export function buildWhatsAppMessage(msg) {
  const text = typeof msg === "string" && msg.trim() ? msg.trim() : `Hi ${BRAND.name}, I'd like to know more about your courses.`;
  return `https://wa.me/${BRAND.whatsappNumber}?text=${encodeURIComponent(text)}`;
}

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
