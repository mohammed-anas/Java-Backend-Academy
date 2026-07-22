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
  {
  "slug": "database-normalization-1nf-2nf-3nf-explained",
  "title": "Master Database Normalization: A Practical Guide to 1NF, 2NF, and 3NF",
  "excerpt": "Learn database normalization (1NF, 2NF, 3NF) with a real-world step-by-step example. Eliminate redundancy and improve performance with simple tables.",
  "tag": "Database",
  "date": "2026-07-18",
  "read": "10 min read",
  "cover": "",
  "blocks": [
    {
      "id": "b_mrwdzr2c_1",
      "type": "heading",
      "props": {
        "level": 4,
        "align": "left"
      },
      "content": "What is Database Normalization?"
    },
    {
      "id": "b_mrwdzwl9_2",
      "type": "paragraph",
      "props": {
        "align": "left"
      },
      "content": "Database normalization is an approach to organise data in relational database. Data is divided into smaller tables and linked to achieve two mail goals:"
    },
    {
      "id": "b_mrwe42nh_3",
      "type": "bulletList",
      "props": {},
      "content": [
        {
          "text": "<b>Eliminate Data Redundancy: </b>Stop storing same information at multiple places."
        },
        {
          "text": "<b data-path-to-node=\"13,1,0\" data-index-in-node=\"0\">Ensure Data Integrity:</b> Prevent logical anomalies (insert, update, and delete errors)."
        }
      ]
    },
    {
      "id": "b_mrwee7ih_5",
      "type": "heading",
      "props": {
        "level": 5,
        "align": "left"
      },
      "content": "Real World Example: An E-Commerce Order Platform"
    },
    {
      "id": "b_mrwef3ij_6",
      "type": "paragraph",
      "props": {
        "align": "left"
      },
      "content": "Suppose we building a system to track customer orders for an online store<div>Below is the table that is unnormalized Order table</div>"
    },
    {
      "id": "b_mrwehjol_8",
      "type": "table",
      "props": {},
      "content": {
        "rows": [
          [
            "OrderId",
            "CustomerName",
            "City",
            "ItemOrdered",
            "ItemPrice"
          ],
          [
            "<font face=\"Google Sans Text, sans-serif\"><b>101</b></font>",
            "Alice Smith",
            "New York",
            "Laptop, Mouse",
            "$1250"
          ],
          [
            "102",
            "Bob Jones",
            "Chicago",
            "Keyboard",
            "$100"
          ],
          [
            "103",
            "Alice Smith",
            "New York",
            "Monitor, Laptop",
            "$1500"
          ]
        ]
      }
    },
    {
      "id": "b_mrweqkbs_9",
      "type": "paragraph",
      "props": {
        "align": "left"
      },
      "content": "Take a pause and think for a while whats wrong with this data before reading out further....."
    },
    {
      "id": "b_mrwertwk_a",
      "type": "paragraph",
      "props": {
        "align": "left"
      },
      "content": "Why this table is bad?"
    },
    {
      "id": "b_mrwescsd_b",
      "type": "bulletList",
      "props": {},
      "content": [
        {
          "text": "ItemOrdered column have multiple values."
        },
        {
          "text": "Customer city repeating across multiple order for the same customer.&nbsp;"
        },
        {
          "text": "If Alice Smith changed his city later, we have to update every row."
        }
      ]
    },
    {
      "id": "b_mrwf3ohg_d",
      "type": "paragraph",
      "props": {
        "align": "left"
      },
      "content": "<h3 data-path-to-node=\"24\"><p data-path-to-node=\"22\">Let's fix this step by step.</p><p data-path-to-node=\"22\"><br></p></h3><h3 data-path-to-node=\"24\">Step 1: First Normal Form (1NF)</h3><h3 data-path-to-node=\"24\"><blockquote data-path-to-node=\"25\"><p data-path-to-node=\"25,0\"><b data-path-to-node=\"25,0\" data-index-in-node=\"0\">Rule of 1NF:</b> &gt; 1. Each table cell must contain a single (atomic) value.\n2. Each record must be unique (requires a Primary Key).</p></blockquote></h3><h4 data-path-to-node=\"26\">Step-by-Step Change</h4><h3 data-path-to-node=\"24\"><p data-path-to-node=\"27\">We need to split the comma-separated list in \"ItemOrdered\" so that every row contains only <b data-path-to-node=\"27\" data-index-in-node=\"93\">one item</b>. We also add an <code data-path-to-node=\"27\" data-index-in-node=\"118\">ItemPrice</code> column to track costs per item accurately.</p></h3>"
    },
    {
      "id": "b_mrwexjzy_c",
      "type": "table",
      "props": {},
      "content": {
        "rows": [
          [
            "OrderId",
            "Customer Name",
            "City",
            "ItemOrdered",
            "ItemPrice"
          ],
          [
            "<font face=\"Google Sans Text, sans-serif\">101</font>",
            "Alice Smith",
            "New York",
            "Laptop",
            "$1200"
          ],
          [
            "101",
            "Alice Smith",
            "New York",
            "Mouse",
            "$50"
          ],
          [
            "102",
            "Bob Jones",
            "Chicago",
            "Keyboard",
            "$100"
          ],
          [
            "103",
            "Alice Smith",
            "New York",
            "Monitor",
            "$300"
          ],
          [
            "103",
            "Alice Smith",
            "New York",
            "Laptop",
            "$1200"
          ]
        ]
      }
    },
    {
      "id": "b_mrwf99nf_e",
      "type": "paragraph",
      "props": {
        "align": "left"
      },
      "content": "After this change, every row have atomic value under each column, and the row is uniquely identified by composite primary key (OrderId + ItemOrdered)"
    },
    {
      "id": "b_mrwfkhr9_f",
      "type": "paragraph",
      "props": {
        "align": "left"
      },
      "content": "<h3 data-path-to-node=\"33\">Step 2: Second Normal Form (2NF)</h3><blockquote data-path-to-node=\"34\"><p data-path-to-node=\"34,0\"><b data-path-to-node=\"34,0\" data-index-in-node=\"0\">Rule of 2NF:</b> &gt; 1. Must already be in <b data-path-to-node=\"34,0\" data-index-in-node=\"37\">1NF</b>.\n2. Remove <b data-path-to-node=\"34,0\" data-index-in-node=\"52\">Partial Dependencies</b> (every non-key column must depend on the <i data-path-to-node=\"34,0\" data-index-in-node=\"114\">entire</i> primary key, not just a part of it).</p><p data-path-to-node=\"34,0\"><br></p><h4 data-path-to-node=\"35\">Step-by-Step Change</h4><p data-path-to-node=\"36\">Our composite primary key is <code data-path-to-node=\"36\" data-index-in-node=\"44\">(OrderID, ItemOrdered)</code>.\nNotice that <code data-path-to-node=\"36\" data-index-in-node=\"77\">CustomerName</code> and <code data-path-to-node=\"36\" data-index-in-node=\"94\">City</code> depend <i data-path-to-node=\"36\" data-index-in-node=\"114\">only</i> on <code data-path-to-node=\"36\" data-index-in-node=\"122\">OrderID</code>, not on <code data-path-to-node=\"36\" data-index-in-node=\"138\">ItemOrdered</code>. That is a partial dependency.</p><p data-path-to-node=\"37\">To fix this, we split the table into two separate tables:</p><ol start=\"1\" data-path-to-node=\"38\"><li><p data-path-to-node=\"38,0,0\"><b data-path-to-node=\"38,0,0\" data-index-in-node=\"0\"><code data-path-to-node=\"38,0,0\" data-index-in-node=\"0\">Orders</code> Table:</b> Stores details related to the order as a whole.</p></li><li><p data-path-to-node=\"38,1,0\"><b data-path-to-node=\"38,1,0\" data-index-in-node=\"0\"><code data-path-to-node=\"38,1,0\" data-index-in-node=\"0\">OrderItems</code> Table:</b> Stores details about individual items within an order.</p></li></ol><ol start=\"1\" data-path-to-node=\"38\"><li><p data-path-to-node=\"38,1,0\"><br></p></li></ol></blockquote>"
    },
    {
      "id": "b_mrwfm2ft_h",
      "type": "paragraph",
      "props": {
        "align": "left"
      },
      "content": "<b>Orders</b>"
    },
    {
      "id": "b_mrwfmec3_i",
      "type": "table",
      "props": {},
      "content": {
        "rows": [
          [
            "OrderId",
            "CustomerName",
            "City"
          ],
          [
            "101",
            "Alice Smith",
            "New York"
          ],
          [
            "102",
            "Bob Jones",
            "Chicago"
          ],
          [
            "103",
            "Alice Smith",
            "New York"
          ]
        ]
      }
    },
    {
      "id": "b_mrwfo7f2_j",
      "type": "paragraph",
      "props": {
        "align": "left"
      },
      "content": "<b>OrderItems</b>"
    },
    {
      "id": "b_mrwfomke_k",
      "type": "table",
      "props": {},
      "content": {
        "rows": [
          [
            "OrderId",
            "ItemOrdered",
            "ItemPrice"
          ],
          [
            "101",
            "Laptop",
            "$1200"
          ],
          [
            "101",
            "Mouse",
            "$50"
          ],
          [
            "102",
            "Keyboard",
            "$100"
          ],
          [
            "103",
            "Monitor",
            "$300"
          ],
          [
            "103",
            "Laptop",
            "$1200"
          ]
        ]
      }
    },
    {
      "id": "b_mrwfrp1p_l",
      "type": "paragraph",
      "props": {
        "align": "left"
      },
      "content": "<div class=\"horizontal-scroll-wrapper\" style=\"font-family: &quot;Google Sans Text&quot;, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important;\"><div class=\"table-block-component\" style=\"line-height: 1.15 !important; margin-top: 0px !important;\"><response-element class=\"\" ng-version=\"0.0.0-PLACEHOLDER\" style=\"line-height: 1.15 !important; margin-top: 0px !important;\"><table-block _nghost-ng-c1508722937=\"\" class=\"enable-luminous-table-block ng-star-inserted\" style=\"line-height: 1.15 !important; margin-top: 0px !important;\"><div _ngcontent-ng-c1508722937=\"\" class=\"table-block has-export-button new-table-style is-at-scroll-start is-at-scroll-end\" style=\"line-height: 1.15 !important; margin-top: 0px !important;\"><div _ngcontent-ng-c1508722937=\"\" not-end-of-paragraph=\"\" class=\"table-content\" jslog=\"275421;track:impression,attention\" data-hveid=\"0\" decode-data-ved=\"1\" data-ved=\"0CAAQ3ecQahcKEwjSnuy17eaVAxUAAAAAHQAAAAAQbQ\" style=\"line-height: 1.15 !important; margin-top: 0px !important;\"></div></div><!----></table-block><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----></response-element></div></div><p data-path-to-node=\"44\" style=\"font-family: &quot;Google Sans Text&quot;, sans-serif !important; line-height: 1.15 !important;\"><i data-path-to-node=\"44\" data-index-in-node=\"0\" style=\"line-height: 1.15 !important; margin-top: 0px !important;\">(Composite Primary Key: <code data-path-to-node=\"44\" data-index-in-node=\"24\" style=\"font-family: &quot;Google Sans Text&quot;, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important;\">OrderID</code> + <code data-path-to-node=\"44\" data-index-in-node=\"34\" style=\"font-family: &quot;Google Sans Text&quot;, sans-serif !important; line-height: 1.15 !important; margin-top: 0px !important;\">ItemOrdered</code>)</i></p><p data-path-to-node=\"45\" style=\"font-family: &quot;Google Sans Text&quot;, sans-serif !important; line-height: 1.15 !important;\"><b data-path-to-node=\"45\" data-index-in-node=\"2\" style=\"line-height: 1.15 !important; margin-top: 0px !important;\">2NF Achieved:</b> All non-key attributes fully depend on their table's primary key.</p>"
    },
    {
      "id": "b_mrwfwo09_m",
      "type": "paragraph",
      "props": {
        "align": "left"
      },
      "content": "<h3 data-path-to-node=\"47\">Step 3: Third Normal Form (3NF)</h3><blockquote data-path-to-node=\"48\"><p data-path-to-node=\"48,0\"><b data-path-to-node=\"48,0\" data-index-in-node=\"0\">Rule of 3NF:</b> &gt; 1. Must already be in <b data-path-to-node=\"48,0\" data-index-in-node=\"37\">2NF</b>.\n2. Remove <b data-path-to-node=\"48,0\" data-index-in-node=\"52\">Transitive Dependencies</b> (non-key columns must NOT depend on other non-key columns).</p></blockquote><h4 data-path-to-node=\"49\">Step-by-Step Change</h4><p data-path-to-node=\"50\">Look at the <code data-path-to-node=\"50\" data-index-in-node=\"12\">Orders</code> table from 2NF:</p><p data-path-to-node=\"50\"><code data-path-to-node=\"51,0,0\" data-index-in-node=\"0\">City</code> depends on <code data-path-to-node=\"51,0,0\" data-index-in-node=\"24\">CustomerName</code>.</p><ul data-path-to-node=\"51\"><li><p data-path-to-node=\"51,1,0\"><code data-path-to-node=\"51,1,0\" data-index-in-node=\"0\">CustomerName</code> depends on <code data-path-to-node=\"51,1,0\" data-index-in-node=\"24\">OrderID</code>.</p></li></ul><p data-path-to-node=\"52\">This means <code data-path-to-node=\"52\" data-index-in-node=\"11\">City</code> indirectly depends on <code data-path-to-node=\"52\" data-index-in-node=\"46\">OrderID</code> through <code data-path-to-node=\"52\" data-index-in-node=\"62\">CustomerName</code>. This is a <b data-path-to-node=\"52\" data-index-in-node=\"86\">transitive dependency</b>. If Alice orders 10 times, we repeat \"Alice Smith\" and \"New York\" 10 times.</p><p data-path-to-node=\"53\">To fix this, we extract customer details into a dedicated <code data-path-to-node=\"53\" data-index-in-node=\"58\">Customers</code> table.</p>"
    },
    {
      "id": "b_mrwfxtae_n",
      "type": "paragraph",
      "props": {
        "align": "left"
      },
      "content": "<b>Customers</b>"
    },
    {
      "id": "b_mrwfy8sz_o",
      "type": "table",
      "props": {},
      "content": {
        "rows": [
          [
            "CustomerId",
            "CustomerName",
            "City"
          ],
          [
            "C1",
            "Alice Smith",
            "New York"
          ],
          [
            "C2",
            "Bob Jones",
            "Chicago"
          ]
        ]
      }
    },
    {
      "id": "b_mrwg3bse_u",
      "type": "paragraph",
      "props": {
        "align": "left"
      },
      "content": "<b>Orders</b>"
    },
    {
      "id": "b_mrwfzt6o_q",
      "type": "table",
      "props": {},
      "content": {
        "rows": [
          [
            "OrderId",
            "CustomerId"
          ],
          [
            "101",
            "C1"
          ],
          [
            "102",
            "C2"
          ],
          [
            "103",
            "C1"
          ]
        ]
      }
    },
    {
      "id": "b_mrwg3k1z_v",
      "type": "paragraph",
      "props": {
        "align": "left"
      },
      "content": "<b>OrderItems</b>"
    },
    {
      "id": "b_mrwg1y8f_t",
      "type": "table",
      "props": {},
      "content": {
        "rows": [
          [
            "OrderId",
            "ItemOrdered",
            "ItemPrice"
          ],
          [
            "101",
            "Laptop",
            "$1200"
          ],
          [
            "101",
            "Mouse",
            "$50"
          ],
          [
            "102",
            "Keyboard",
            "$100"
          ],
          [
            "103",
            "Monitor",
            "$300"
          ],
          [
            "103",
            "Laptop",
            "$1200"
          ]
        ]
      }
    },
    {
      "id": "b_mrwg432b_w",
      "type": "paragraph",
      "props": {
        "align": "left"
      },
      "content": "<p data-path-to-node=\"62\"><i data-path-to-node=\"62\" data-index-in-node=\"0\">(Composite Key: <code data-path-to-node=\"62\" data-index-in-node=\"16\">OrderID</code> + <code data-path-to-node=\"62\" data-index-in-node=\"26\">ItemOrdered</code>)</i></p><p data-path-to-node=\"63\"><b data-path-to-node=\"63\" data-index-in-node=\"2\">3NF Achieved:</b> Data is fully decoupled. Every non-key column directly describes the primary key of its table.</p>"
    }
  ]
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
