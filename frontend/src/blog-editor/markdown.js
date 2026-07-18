/**
 * Markdown import/export for the block schema.
 * These are lossy but human-friendly. JSON is the lossless format.
 */

import { makeBlock, uid } from "./schema";

/* ---------- helpers ---------- */

/** Convert our restricted inline HTML → plain markdown-ish inline. */
export function htmlToMdInline(html = "") {
  if (!html) return "";
  return html
    .replace(/<br\s*\/?>/gi, "  \n")
    .replace(/<strong>(.*?)<\/strong>/gi, "**$1**")
    .replace(/<b>(.*?)<\/b>/gi, "**$1**")
    .replace(/<em>(.*?)<\/em>/gi, "*$1*")
    .replace(/<i>(.*?)<\/i>/gi, "*$1*")
    .replace(/<u>(.*?)<\/u>/gi, "<u>$1</u>") // md has no underline; keep as HTML
    .replace(/<s>(.*?)<\/s>/gi, "~~$1~~")
    .replace(/<del>(.*?)<\/del>/gi, "~~$1~~")
    .replace(/<code>(.*?)<\/code>/gi, "`$1`")
    .replace(/<a[^>]*href="([^"]+)"[^>]*>(.*?)<\/a>/gi, "[$2]($1)")
    .replace(/<span[^>]*data-eq="1"[^>]*>(.*?)<\/span>/gi, "$$$1$$")
    // strip any leftover unknown tags
    .replace(/<[^>]+>/g, "");
}

/** Markdown-ish inline → our inline HTML. */
export function mdInlineToHtml(text = "") {
  if (!text) return "";
  let html = text
    // links first so bold/italic doesn't eat the URL brackets
    .replace(/\[([^\]]+)]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>')
    // code
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    // bold
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/__([^_]+)__/g, "<strong>$1</strong>")
    // strike
    .replace(/~~([^~]+)~~/g, "<s>$1</s>")
    // italic
    .replace(/(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>")
    .replace(/(^|[^_])_([^_]+)_/g, "$1<em>$2</em>")
    // inline equation $...$
    .replace(/\$([^$\n]+)\$/g, '<span data-eq="1">$1</span>');
  return html;
}

/* ---------- EXPORT ---------- */

/** Convert a single block to markdown. */
function blockToMd(b) {
  switch (b.type) {
    case "heading": {
      const n = Math.min(6, Math.max(1, b.props?.level || 2));
      return "#".repeat(n) + " " + htmlToMdInline(b.content || "");
    }
    case "paragraph":
      return htmlToMdInline(b.content || "");
    case "quote":
      return (htmlToMdInline(b.content || "") || "").split("\n").map((l) => "> " + l).join("\n");
    case "callout":
      return `> ${b.props?.icon || "💡"} ${htmlToMdInline(b.content || "")}`;
    case "divider":
      return "---";
    case "code":
      return "```" + (b.props?.lang || "") + "\n" + (b.content || "") + "\n```";
    case "equation":
      return b.props?.inline ? `$${b.content || ""}$` : `$$\n${b.content || ""}\n$$`;
    case "bulletList":
      return (b.content || []).map((it) => `- ${htmlToMdInline(it.text || "")}`).join("\n");
    case "numberList":
      return (b.content || []).map((it, i) => `${i + 1}. ${htmlToMdInline(it.text || "")}`).join("\n");
    case "todoList":
      return (b.content || [])
        .map((it) => `- [${it.checked ? "x" : " "}] ${htmlToMdInline(it.text || "")}`)
        .join("\n");
    case "table": {
      const rows = b.content?.rows || [];
      if (!rows.length) return "";
      const header = rows[0] || [];
      const rest = rows.slice(1);
      const line = (r) => "| " + r.map((c) => (c || "").replace(/\|/g, "\\|")).join(" | ") + " |";
      const sep = "| " + header.map(() => "---").join(" | ") + " |";
      return [line(header), sep, ...rest.map(line)].join("\n");
    }
    case "image":
      return `![${b.content?.alt || ""}](${b.content?.src || ""})${
        b.content?.caption ? `\n*${b.content.caption}*` : ""
      }`;
    case "attachment":
      return `[📎 ${b.content?.name || "attachment"}](${b.content?.data || ""})`;
    case "pdf":
      return `[📄 ${b.content?.name || "document.pdf"}](${b.content?.data || ""})`;
    case "embed": {
      const url = b.content?.url || "";
      const prov = b.props?.provider === "gdrive" ? "Google Drive" : "YouTube";
      return `[${prov}](${url})`;
    }
    case "date":
      return `📅 ${b.content?.display || ""} (${b.content?.iso || ""})`;
    default:
      return "";
  }
}

/** Full post → markdown string with frontmatter */
export function postToMarkdown(post) {
  const front = [
    "---",
    `slug: ${post.slug || ""}`,
    `title: ${JSON.stringify(post.title || "")}`,
    `excerpt: ${JSON.stringify(post.excerpt || "")}`,
    `tag: ${post.tag || ""}`,
    `date: ${post.date || ""}`,
    `read: ${JSON.stringify(post.read || "")}`,
    "---",
    "",
  ].join("\n");
  const body = (post.blocks || []).map(blockToMd).join("\n\n");
  return front + body + "\n";
}

/* ---------- IMPORT ---------- */

/** Parse markdown string → post object with blocks. Best-effort. */
export function markdownToPost(md) {
  const post = {
    slug: "",
    title: "",
    excerpt: "",
    tag: "Backend",
    date: new Date().toISOString().slice(0, 10),
    read: "5 min read",
    blocks: [],
  };
  let body = md;
  const fm = md.match(/^---\n([\s\S]*?)\n---\n?/);
  if (fm) {
    body = md.slice(fm[0].length);
    fm[1].split(/\n/).forEach((line) => {
      const m = line.match(/^(\w+):\s*(.*)$/);
      if (!m) return;
      let v = m[2];
      try { if (v.startsWith('"')) v = JSON.parse(v); } catch (_) { /* leave raw */ }
      post[m[1]] = v;
    });
  }
  post.blocks = parseMdBody(body);
  if (!post.blocks.length) post.blocks = [makeBlock("paragraph")];
  return post;
}

function parseMdBody(md) {
  const lines = md.split(/\r?\n/);
  const blocks = [];
  let i = 0;

  const push = (b) => blocks.push({ ...b, id: uid() });

  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }

    // Fenced code
    if (/^```/.test(line)) {
      const lang = line.replace(/^```/, "").trim();
      const buf = [];
      i++;
      while (i < lines.length && !/^```/.test(lines[i])) { buf.push(lines[i]); i++; }
      i++; // consume closing fence
      push({ ...makeBlock("code"), props: { lang }, content: buf.join("\n") });
      continue;
    }

    // Block equation $$ ... $$
    if (/^\$\$\s*$/.test(line)) {
      const buf = [];
      i++;
      while (i < lines.length && !/^\$\$\s*$/.test(lines[i])) { buf.push(lines[i]); i++; }
      i++;
      push({ ...makeBlock("equation"), props: { inline: false }, content: buf.join("\n") });
      continue;
    }

    // Divider
    if (/^-{3,}\s*$/.test(line)) { push(makeBlock("divider")); i++; continue; }

    // Heading
    const h = line.match(/^(#{1,6})\s+(.*)$/);
    if (h) {
      push({ ...makeBlock("heading"), props: { level: h[1].length, align: "left" }, content: mdInlineToHtml(h[2]) });
      i++;
      continue;
    }

    // Table
    if (/^\|.*\|\s*$/.test(line) && /^\|[\s\-|:]+\|\s*$/.test(lines[i + 1] || "")) {
      const rows = [];
      while (i < lines.length && /^\|.*\|\s*$/.test(lines[i])) {
        if (!/^\|[\s\-|:]+\|\s*$/.test(lines[i])) {
          const cells = lines[i].replace(/^\|/, "").replace(/\|\s*$/, "").split("|").map((c) => c.trim());
          rows.push(cells);
        }
        i++;
      }
      push({ ...makeBlock("table"), content: { rows } });
      continue;
    }

    // Todo list
    if (/^- \[[ xX]\]\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^- \[[ xX]\]\s+/.test(lines[i])) {
        const m2 = lines[i].match(/^- \[([ xX])\]\s+(.*)$/);
        items.push({ checked: /x/i.test(m2[1]), text: mdInlineToHtml(m2[2]) });
        i++;
      }
      push({ ...makeBlock("todoList"), content: items });
      continue;
    }

    // Bulleted list
    if (/^[-*]\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i])) {
        items.push({ text: mdInlineToHtml(lines[i].replace(/^[-*]\s+/, "")) });
        i++;
      }
      push({ ...makeBlock("bulletList"), content: items });
      continue;
    }

    // Numbered list
    if (/^\d+\.\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
        items.push({ text: mdInlineToHtml(lines[i].replace(/^\d+\.\s+/, "")) });
        i++;
      }
      push({ ...makeBlock("numberList"), content: items });
      continue;
    }

    // Quote / callout
    if (/^>\s?/.test(line)) {
      const buf = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        buf.push(lines[i].replace(/^>\s?/, ""));
        i++;
      }
      const joined = buf.join("\n");
      // Callout if starts with an emoji
      const emojiMatch = joined.match(/^([\p{Emoji}])\s+(.*)$/su);
      if (emojiMatch) {
        push({ ...makeBlock("callout"), props: { icon: emojiMatch[1], tone: "amber" }, content: mdInlineToHtml(emojiMatch[2]) });
      } else {
        push({ ...makeBlock("quote"), content: mdInlineToHtml(joined) });
      }
      continue;
    }

    // Image
    const imgM = line.match(/^!\[([^\]]*)]\(([^)]+)\)$/);
    if (imgM) {
      push({ ...makeBlock("image"), content: { alt: imgM[1], src: imgM[2], caption: "" } });
      i++;
      continue;
    }

    // Fallback paragraph — collect until blank
    const buf = [line];
    i++;
    while (i < lines.length && lines[i].trim() && !/^(#{1,6}\s|>|- |\* |\d+\.\s|!\[|```|\|)/.test(lines[i])) {
      buf.push(lines[i]);
      i++;
    }
    push({ ...makeBlock("paragraph"), content: mdInlineToHtml(buf.join(" ")) });
  }

  return blocks;
}
