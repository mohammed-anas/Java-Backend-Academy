import { makeBlock, uid } from "./schema";

const DRAFTS_KEY = "jha-blog-drafts-v2";
const LEGACY_DRAFT_KEY = "jha-blog-draft-v1";

/* ------------ Legacy body[] → blocks[] migration ------------- */

export function ensureBlocks(post) {
  if (!post) return post;
  if (Array.isArray(post.blocks) && post.blocks.length) return post;
  if (Array.isArray(post.body) && post.body.length) {
    const blocks = [
      { ...makeBlock("heading"), props: { level: 1, align: "left" }, content: post.title || "" },
      ...post.body.map((para) => ({ ...makeBlock("paragraph"), content: escapeHtml(String(para || "")) })),
    ];
    // give stable ids
    return { ...post, blocks: blocks.map((b) => ({ ...b, id: uid() })) };
  }
  // Neither blocks nor body — start with empty
  return {
    ...post,
    blocks: [
      { ...makeBlock("heading"), props: { level: 1, align: "left" }, content: post.title || "", id: uid() },
      { ...makeBlock("paragraph"), id: uid() },
    ],
  };
}

function escapeHtml(s) {
  return s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
}

/* ------------ Drafts (localStorage) ------------- */
/** Each draft: { id, title, slug, updatedAt, post } */

export function loadDrafts() {
  try {
    const raw = localStorage.getItem(DRAFTS_KEY);
    if (raw) return JSON.parse(raw) || [];
  } catch (_) { /* ignore */ }
  // one-time migration of the old single-draft key
  try {
    const legacy = localStorage.getItem(LEGACY_DRAFT_KEY);
    if (legacy) {
      const post = JSON.parse(legacy);
      const d = { id: "d_" + Date.now().toString(36), title: post.title || "Untitled draft", slug: post.slug || "", updatedAt: Date.now(), post };
      localStorage.setItem(DRAFTS_KEY, JSON.stringify([d]));
      localStorage.removeItem(LEGACY_DRAFT_KEY);
      return [d];
    }
  } catch (_) { /* ignore */ }
  return [];
}

export function saveDrafts(list) {
  try { localStorage.setItem(DRAFTS_KEY, JSON.stringify(list || [])); } catch (_) { /* ignore */ }
}

export function upsertDraft(list, draft) {
  const idx = list.findIndex((d) => d.id === draft.id);
  const next = list.slice();
  if (idx >= 0) next[idx] = draft; else next.unshift(draft);
  return next;
}

export function deleteDraft(list, id) {
  return list.filter((d) => d.id !== id);
}

export function newDraftId() {
  return "d_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 6);
}

/* ------------ Serialize BLOG_POSTS array for paste-back ------------- */

/** Turn an array of posts into a `export const BLOG_POSTS = [ ... ];` JS snippet */
export function serialiseBlogPosts(posts) {
  const body = JSON.stringify(posts, null, 2);
  return `export const BLOG_POSTS = ${body};\n`;
}
