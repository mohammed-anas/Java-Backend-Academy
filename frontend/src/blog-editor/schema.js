/**
 * Block schema for the Java Hub blog editor.
 * Everything is plain JSON — export/import friendly, human-readable, no backend.
 *
 * Every block:
 *   { id: string, type: string, props?: object, content: any }
 *
 * Types used in the editor + renderer:
 *   paragraph, heading, code, quote, divider, callout,
 *   bulletList, numberList, todoList,
 *   table, image, attachment, pdf, embed, equation, date, link (inline only)
 */

let __id = 0;
export function uid() {
  __id += 1;
  return "b_" + Date.now().toString(36) + "_" + __id.toString(36);
}

/** Factory: create a fresh block of the given type */
export function makeBlock(type, overrides = {}) {
  const base = { id: uid(), type, props: {}, content: "" };
  switch (type) {
    case "paragraph":
      return { ...base, props: { align: "left" }, content: "" };
    case "heading":
      return { ...base, props: { level: 2, align: "left" }, content: "" };
    case "code":
      return { ...base, props: { lang: "java" }, content: "" };
    case "quote":
      return { ...base, props: { align: "left" }, content: "" };
    case "callout":
      return { ...base, props: { icon: "💡", tone: "amber" }, content: "" };
    case "divider":
      return { ...base, content: null };
    case "bulletList":
      return { ...base, content: [{ text: "" }] };
    case "numberList":
      return { ...base, content: [{ text: "" }] };
    case "todoList":
      return { ...base, content: [{ text: "", checked: false }] };
    case "table":
      return { ...base, content: { rows: [["", ""], ["", ""]] } };
    case "image":
      return { ...base, props: { align: "center" }, content: { src: "", alt: "", caption: "" } };
    case "attachment":
      return { ...base, content: { name: "", mime: "", data: "" } };
    case "pdf":
      return { ...base, content: { name: "", data: "" } };
    case "embed":
      return { ...base, props: { provider: "youtube" }, content: { url: "" } };
    case "equation":
      return { ...base, props: { inline: false }, content: "" };
    case "date":
      return { ...base, content: { display: "Today", iso: new Date().toISOString().slice(0, 10) } };
    default:
      return { ...base, ...overrides };
  }
}

/** The "insert new block" menu — grouped like Notion. */
export const BLOCK_CATALOGUE = [
  {
    group: "Text",
    items: [
      { type: "paragraph", label: "Text", icon: "¶", hint: "Just start writing." },
      { type: "heading", label: "Heading 1", icon: "H₁", propsOverride: { level: 1 } },
      { type: "heading", label: "Heading 2", icon: "H₂", propsOverride: { level: 2 } },
      { type: "heading", label: "Heading 3", icon: "H₃", propsOverride: { level: 3 } },
      { type: "heading", label: "Heading 4", icon: "H₄", propsOverride: { level: 4 } },
      { type: "heading", label: "Heading 5", icon: "H₅", propsOverride: { level: 5 } },
      { type: "heading", label: "Heading 6", icon: "H₆", propsOverride: { level: 6 } },
      { type: "quote", label: "Quote", icon: "❝" },
      { type: "callout", label: "Callout", icon: "💡" },
      { type: "divider", label: "Divider", icon: "—" },
    ],
  },
  {
    group: "Lists",
    items: [
      { type: "bulletList", label: "Bulleted list", icon: "•" },
      { type: "numberList", label: "Numbered list", icon: "1." },
      { type: "todoList", label: "To-do list", icon: "☐" },
    ],
  },
  {
    group: "Media & code",
    items: [
      { type: "code", label: "Code block", icon: "</>" },
      { type: "equation", label: "Equation (LaTeX)", icon: "∑" },
      { type: "image", label: "Image", icon: "🖼" },
      { type: "attachment", label: "Attachment", icon: "📎" },
      { type: "pdf", label: "PDF", icon: "📄" },
      { type: "embed", label: "YouTube", icon: "▶", propsOverride: { provider: "youtube" } },
      { type: "embed", label: "Google Drive", icon: "☁", propsOverride: { provider: "gdrive" } },
      { type: "table", label: "Table", icon: "▦" },
    ],
  },
  {
    group: "Advanced",
    items: [
      { type: "date", label: "Date · Today", icon: "📅", dateOverride: "today" },
      { type: "date", label: "Date · Tomorrow", icon: "📅", dateOverride: "tomorrow" },
      { type: "date", label: "Date · Yesterday", icon: "📅", dateOverride: "yesterday" },
      { type: "date", label: "Date · Now", icon: "🕒", dateOverride: "now" },
      { type: "date", label: "Date · Night", icon: "🌙", dateOverride: "night" },
    ],
  },
];

/** Compute a Date block content for the quick-pick variants */
export function makeDateBlockPreset(preset) {
  const now = new Date();
  const iso = (d) => d.toISOString();
  let display = "Now";
  let d = new Date(now);
  if (preset === "today") { display = "Today"; }
  else if (preset === "tomorrow") { d.setDate(d.getDate() + 1); display = "Tomorrow"; }
  else if (preset === "yesterday") { d.setDate(d.getDate() - 1); display = "Yesterday"; }
  else if (preset === "night") { d.setHours(21, 0, 0, 0); display = "Tonight"; }
  else if (preset === "now") { display = "Now"; }
  return { display, iso: iso(d), preset };
}

/** Small helper for reordering / duplicating in the editor */
export function moveBlock(blocks, index, delta) {
  const j = index + delta;
  if (j < 0 || j >= blocks.length) return blocks;
  const next = blocks.slice();
  const [item] = next.splice(index, 1);
  next.splice(j, 0, item);
  return next;
}

export function duplicateBlock(blocks, index) {
  const src = blocks[index];
  if (!src) return blocks;
  const copy = JSON.parse(JSON.stringify(src));
  copy.id = uid();
  const next = blocks.slice();
  next.splice(index + 1, 0, copy);
  return next;
}

export function deleteBlock(blocks, index) {
  const next = blocks.slice();
  next.splice(index, 1);
  return next;
}

export function updateBlock(blocks, index, patch) {
  const next = blocks.slice();
  next[index] = { ...next[index], ...patch };
  return next;
}

/** Full post envelope */
export function makeEmptyPost() {
  return {
    slug: "",
    title: "",
    excerpt: "",
    tag: "Backend",
    date: new Date().toISOString().slice(0, 10),
    read: "5 min read",
    cover: "",
    blocks: [
      makeBlock("heading", { props: { level: 1, align: "left" } }),
      makeBlock("paragraph"),
    ],
  };
}
