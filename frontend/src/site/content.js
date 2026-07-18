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
    slug: "java-course-in-aligarh",
    title: "Java course in Aligarh — syllabus, duration, fees and placement help (2026 guide)",
    excerpt:
      "Everything a student in Aligarh actually asks before joining a Java course: what you'll learn, how long it takes, what it costs, and how we help you land the first job.",
    tag: "Aligarh · Local",
    date: "2026-07-17",
    read: "9 min read",
    body: [
      "If you live in Aligarh and want a software job, Java is still the fastest route in 2026. Every big service company — Infosys, TCS, Wipro, Capgemini, Cognizant — hires more Java engineers than any other role. This guide answers the four questions students walk into our studio near Masjid Aman with, every single week.",
      "1) What is the Java course syllabus? Ours covers Core Java, Data Structures & Algorithms, Databases, Spring Boot REST APIs, System Design, AWS Cloud, CI/CD, Interview Preparation and Resume / Job Search. You do NOT need to take all nine — every student picks a track based on the job they want.",
      "2) How long is the Java course in Aligarh? A complete backend engineer track is 5 to 6 months when studied part-time on weekends. Just Core Java + Spring Boot is around 3 months. Campus-placement-only students often finish in 4 months.",
      "3) What are the fees? Fees vary by track and batch — call +91 70606 49647 or message us on WhatsApp and we'll share the current fees and any active scholarship discount for merit or need-based cases. We keep pricing transparent and offer EMI options for the longer combo packs.",
      "4) Do you provide placement help? We provide interview preparation, resume rewrites, mock interviews, and referral playbooks — but we do not sell fake placement guarantees. What we do is make you hire-worthy: batches are capped at 10 students so every project gets a written review within 24 hours. Students then clear interviews on merit.",
      "Where is the studio? Java Hub Academy, Near Masjid Aman, Kela Nagar, Aligarh, Uttar Pradesh 202001. Live classes run Mon–Sat, 7 to 8 PM IST. If you cannot come in person we run the exact same class online for students across India and worldwide — same mentors, same projects, same feedback.",
      "The best way to decide is a free demo class — one live session with the current cohort, no obligation. Tap the WhatsApp button in the corner to book one.",
    ],
  },
  {
    slug: "should-i-learn-java-for-a-software-job-in-2026",
    title: "Should you learn Java to get a software job in 2026?",
    excerpt:
      "Every year someone declares Java dead. Every year Indian recruiters open more Java positions than any other backend role. Here is what that means for a student today.",
    tag: "Career",
    date: "2026-07-15",
    read: "7 min read",
    body: [
      "Short answer: yes, especially if you live in India and want a first job within 12 months. Long answer: it depends on which team you want to be on. Let's break it down.",
      "Java is the default language of the Indian services industry. Infosys, TCS, Wipro, Cognizant, HCL and Capgemini together run on Java + Spring Boot. Product companies like Amazon, Flipkart and PayPal also have big Java teams. Your resume will pass more ATS filters with 'Java' at the top than with any other stack.",
      "The 'Java is dying' claim is a US-blog talking point about consumer startups. It has nothing to do with the Indian job market where enterprise backends are 90% of the openings. Look at Naukri right now — 'Java developer' returns 5–10× more openings than 'Node.js developer' or 'Python developer' at fresher level.",
      "Should you learn it if you already know Python? Yes — if your first job matters. Python is great for data / ML roles. But for a plain 'software engineer' role at a service or product company in India, Java gets you interviews faster. Learn Java for the first job, add Python later for the second.",
      "How long until you are hire-worthy? With the right sequence — Core Java → DSA → Spring Boot → 2 real projects → interview prep — most of our students reach interview-ready in 5–6 months of part-time study. That's the roadmap we teach at Java Hub Academy.",
      "The one honest downside: Java syntax is verbose compared to Python. You will type more brackets and semicolons in your first month. It gets natural after week three — every student says the same thing.",
    ],
  },
  {
    slug: "how-to-become-a-java-developer",
    title: "How to become a Java developer — the plain roadmap for freshers",
    excerpt:
      "Nine milestones from 'I've never coded' to 'I have three offers'. In the exact order I would take them if I had to start over.",
    tag: "Roadmap",
    date: "2026-07-12",
    read: "10 min read",
    body: [
      "There is only one Java developer roadmap that works for freshers, and it has nine milestones. Every senior engineer took roughly this path — most just don't remember how slow the first few weeks felt.",
      "Milestone 1 — Learn Core Java. Variables, if/else, loops, methods, classes, collections. Six to eight weeks of daily practice. Do not skip to Spring Boot; you'll drown.",
      "Milestone 2 — Learn DSA patterns. Twelve pattern families cover 200+ problems: two-pointer, sliding window, hash maps, recursion, BFS/DFS, DP. Solve 5 problems a day for 8 weeks and you'll be ready for any product-company round.",
      "Milestone 3 — Learn SQL and one database. Postgres or MySQL. Build a small schema for a real domain — a movie ticket booking DB, for example. Practice SELECT, JOIN, GROUP BY, indexes.",
      "Milestone 4 — Learn Spring Boot REST APIs. Build one simple app end-to-end: authentication, CRUD on a resource, pagination, validation, database integration. Deploy it somewhere free like Render or Railway.",
      "Milestone 5 — Build 2 portfolio projects. A URL shortener with Redis. A blog service with Postgres. Push them to GitHub with a proper README. This is the single strongest thing on your resume.",
      "Milestone 6 — Learn Git properly. Branches, pull requests, rebasing, resolving conflicts. Every job interview will test this now.",
      "Milestone 7 — Learn Docker + a bit of AWS. Just enough to say 'I can containerize my app and deploy it to ECS/EC2'. You do not need to be a DevOps expert.",
      "Milestone 8 — Practice 100 interview questions. Behavioural + Core Java + Spring Boot + DSA. Time yourself. Do mocks with a mentor if you can.",
      "Milestone 9 — Fix the resume and start applying. Referrals via LinkedIn convert 10× better than portal applications. Aim for 15 applications a week.",
      "How long? 5–6 months of part-time, focused study. The people who fail don't fail because Java is hard — they fail because they skip milestones 5 (real projects) and 8 (mock interviews) thinking they can wing it.",
    ],
  },
  {
    slug: "java-full-stack-developer-roadmap",
    title: "Java full-stack developer roadmap 2026 (frontend + Spring Boot)",
    excerpt:
      "Full-stack is the fastest-growing fresher category in India. Here is the exact learning sequence — nothing more, nothing less.",
    tag: "Roadmap",
    date: "2026-07-10",
    read: "9 min read",
    body: [
      "'Full-stack Java developer' has become the most-asked-for role for freshers because startups want one person who can ship end-to-end. Here is the smallest roadmap that gets you there — no extra stuff you'll forget.",
      "Phase 1 (weeks 1–8) — Core Java. Same as any Java engineer. OOP, collections, exceptions, streams, threads.",
      "Phase 2 (weeks 9–14) — Backend with Spring Boot. REST controllers, services, repositories, JWT authentication, Postgres/MySQL, Swagger docs. Build one full CRUD app.",
      "Phase 3 (weeks 15–20) — Frontend basics. HTML, CSS, and vanilla JavaScript first. Do not skip to a framework — the framework will bite you later if you don't know how the DOM works.",
      "Phase 4 (weeks 21–26) — React. Components, props, state, hooks, useEffect, react-router. Connect it to your Spring Boot API from Phase 2. This is your first end-to-end app.",
      "Phase 5 (weeks 27–30) — DevOps essentials. Docker, GitHub Actions for CI, deploy your app to a free host with a domain, add a database. Now you can send a live URL in your resume.",
      "Phase 6 (weeks 31–34) — Two portfolio full-stack projects. E-commerce mini-store OR job-board OR movie-tickets OR chat app. Pick one you'd actually use.",
      "That's it. About 8 months part-time. Skip anything not on this list until you have the first job — Angular, GraphQL, Kafka, Kubernetes all come after job #1.",
    ],
  },
  {
    slug: "java-vs-python-for-jobs-in-india",
    title: "Java vs Python for a first software job in India — which one first?",
    excerpt:
      "Both are great languages. But 'which should I learn first' has a clear answer depending on the job you actually want.",
    tag: "Career",
    date: "2026-07-08",
    read: "6 min read",
    body: [
      "The Java vs Python debate has one clear answer for Indian freshers: it depends on the job you want next month, not the trend on Twitter.",
      "Pick Java first if you want: a services-company job (Infosys/TCS/Wipro/Cognizant/HCL/Capgemini), a product-company backend job (Flipkart/Amazon/PayPal India), or a campus placement offer — Java has 5–10× more fresher openings on Naukri than Python.",
      "Pick Python first if you want: a data science / ML / analytics job, a QA automation role, a research position, or if you have a specific offer letter that requires it. Python is also easier syntax-wise for absolute beginners.",
      "Salary at fresher level: identical. ₹3.5–7 LPA for either language at services companies, ₹8–20 LPA at product companies. Language does not decide salary — your projects and interview performance do.",
      "Time to hire-worthy: Java takes ~5–6 months of focused study for a backend job. Python for a data-analyst job takes ~4 months. Python for a full data-scientist job takes 9+ months because you also need statistics and ML.",
      "The correct sequence for most students: Java first (for the first job in 6 months), Python second (for the switch to data / ML in year 2–3). Learning Java teaches you OOP + strong typing rigor that carries over to any other language later.",
      "The one exception: if you have already spent 4+ weeks on Python and are enjoying it, don't switch — you'll waste momentum. Finish Python for a data role and use that as your first job.",
    ],
  },
  {
    slug: "10-java-projects-for-students",
    title: "10 Java projects for students that actually get you hired",
    excerpt:
      "Every fresher resume looks the same: 'library management system'. Here are ten projects that stand out in a stack of 300 CVs.",
    tag: "Projects",
    date: "2026-07-05",
    read: "8 min read",
    body: [
      "The single fastest way to stand out as a Java fresher is to ship two projects a recruiter has not seen ten times before. Skip 'hospital management system' and 'library management' — pick from this list instead.",
      "1) URL shortener at scale. Base62 encoding, Redis cache, TTL cleanup, rate limiting per API key. Add a metrics dashboard.",
      "2) Banking ledger service. Row-level locking, idempotency keys, double-entry accounting rules, audit logs. Interview-classic.",
      "3) Real-time chat service. Spring WebSockets, MongoDB for message store, presence + typing indicators, offline inbox. Include load-test scripts.",
      "4) E-commerce REST API. Catalog, cart, checkout, order state machine, JWT auth, Swagger docs, pagination.",
      "5) Job queue + worker pool. Kafka or RabbitMQ, retry with backoff, dead-letter queue, at-least-once semantics.",
      "6) Movie ticket booking. Seat locking, expiry, showtimes, JWT auth, payment simulation. Classic system design in code.",
      "7) Rate-limited public API. Token bucket + leaky bucket implementations, per-API-key quotas, admin dashboard.",
      "8) File upload service. Chunked upload, resumable, S3 or MinIO, virus-scan hook. Rare on fresher resumes.",
      "9) Notification service. Email + SMS + push, retry policy, template engine, unsubscribe compliance.",
      "10) Analytics event pipeline. HTTP ingest → Kafka → aggregator → Postgres dashboard. Shows you can think about scale.",
      "Pick ONE of the top three, ship it, write a proper README with architecture diagram + curl commands, deploy it to a free host. That single project moves you from the 'reject' pile to the 'phone-screen' pile.",
    ],
  },
  {
    slug: "50-java-interview-questions-for-freshers",
    title: "50 Java interview questions every fresher must be able to answer",
    excerpt:
      "The exact Core Java questions asked by TCS, Infosys, Wipro and Capgemini in 2026 — with the two-line answer each interviewer is really listening for.",
    tag: "Interview",
    date: "2026-07-01",
    read: "12 min read",
    body: [
      "These 50 questions cover ~80% of what a service-company or entry-level product interviewer will ask. Practise saying each answer out loud. If you can't answer it in two sentences, you don't know it yet.",
      "Core language (Q1–15): 1) Difference between JDK / JRE / JVM. 2) What is bytecode. 3) Difference between int and Integer (autoboxing). 4) == vs equals(). 5) hashCode() and equals() contract. 6) Difference between String, StringBuilder, StringBuffer. 7) Why is String immutable. 8) Final, finally, finalize. 9) Method overloading vs overriding. 10) Access modifiers — public / protected / default / private. 11) Static vs instance members. 12) What is a package. 13) What is JAR / WAR. 14) What are checked and unchecked exceptions. 15) try-with-resources.",
      "OOP + design (Q16–25): 16) Four pillars — encapsulation, inheritance, polymorphism, abstraction. 17) Abstract class vs interface. 18) Multiple inheritance in Java (via interface only). 19) Composition vs inheritance. 20) SOLID principles. 21) What is a singleton and how to implement thread-safely. 22) Factory pattern with example. 23) Builder pattern. 24) DTO vs Entity. 25) What is 'programming to an interface'.",
      "Collections (Q26–35): 26) List vs Set vs Map. 27) ArrayList vs LinkedList — when to use which. 28) HashMap internal working. 29) Hash collision handling. 30) HashMap vs TreeMap vs LinkedHashMap. 31) HashSet vs TreeSet. 32) Fail-fast vs fail-safe iterator. 33) ConcurrentHashMap vs Collections.synchronizedMap. 34) Comparable vs Comparator. 35) Difference between Iterator and ListIterator.",
      "Concurrency (Q36–42): 36) What is a thread. 37) Runnable vs Callable. 38) synchronized keyword. 39) volatile keyword. 40) wait / notify / notifyAll. 41) ExecutorService. 42) Deadlock — how to detect and avoid.",
      "Java 8+ (Q43–47): 43) Lambda expression. 44) Functional interface. 45) Stream API — filter / map / collect. 46) Optional — when to use. 47) Method reference.",
      "Spring / practical (Q48–50): 48) IoC and DI in one line. 49) @Component vs @Service vs @Repository. 50) What is @Autowired and how does Spring pick a bean.",
      "Pro tip for the round: don't answer just the question. After each answer say one sentence about how you used the concept in a project. 'I used a HashMap to cache user session tokens with an expiry map alongside — reduced login DB calls by 90%'. That single line separates a fresher who memorised from a fresher who understood.",
    ],
  },
  {
    slug: "spring-boot-first-rest-api",
    title: "Your first Spring Boot REST API, one file at a time",
    excerpt:
      "A step-by-step tour of what actually happens when you build a REST endpoint in Spring Boot — with the smallest possible code sample.",
    tag: "Spring Boot",
    date: "2026-06-24",
    read: "8 min read",
    body: [
      "Spring Boot feels like magic when you first see it. In three lines of annotations, an entire HTTP server appears. Behind the magic there are exactly four moving parts — and once you can name them, the framework stops feeling scary.",
      "First moving part: the main class with @SpringBootApplication. This tells Spring to scan the current package and register everything it finds.",
      "Second: a controller class with @RestController. Every method inside becomes an HTTP endpoint. The @GetMapping / @PostMapping annotation says which URL and verb it answers to.",
      "Third: a service class with @Service. This is where the actual logic lives. Keep controllers thin; keep services testable.",
      "Fourth: a repository (usually a Spring Data JPA interface). This is your database access — Spring writes the SQL for the common queries automatically.",
      "That is the whole game. Every production Spring Boot app you will ever write is just more controllers, more services, and more repositories stacked on top of these four ideas.",
    ],
  },
  {
    slug: "resume-tips-for-freshers",
    title: "The one-page resume that gets Java backend freshers hired",
    excerpt:
      "Recruiters spend 20 seconds on your resume. Here is what needs to be in the top third of the page — and what can be safely deleted.",
    tag: "Career",
    date: "2026-06-16",
    read: "5 min read",
    body: [
      "You do not need a design template. You need a one-page PDF that gets read in twenty seconds and screened in. Almost every fresher resume I see is missing the same three things.",
      "Missing thing #1: the title. Write \"Backend Engineer — Java / Spring Boot\" right under your name. If you do not say what role you want, the recruiter will guess — and they will guess wrong.",
      "Missing thing #2: measurable projects. \"Built a URL shortener with Spring Boot, Postgres, and Redis. Handled 1,000 rps in local load tests.\" is a hundred times stronger than \"Worked on a URL shortener project.\"",
      "Missing thing #3: the tech stack, together, at the top. Recruiters ATS-scan for keywords. If Java, Spring Boot, MySQL, Docker are scattered across five projects, add a small \"Tech stack\" line under your title so the scanner catches them all in one place.",
      "Delete: photograph, date of birth, marital status, hobbies, and the objective. They eat space and add nothing. Your certificates go in a link at the bottom, not the middle of the page.",
    ],
  },
  {
    slug: "how-to-start-learning-java-in-2026",
    title: "Java roadmap for beginners — how to start learning Java in 2026",
    excerpt:
      "You do not need a computer-science degree to learn Java. Here is the smallest sequence of topics that will actually get you writing real programs — in order.",
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
