import { makeBlock, uid } from "./schema";
import { BLOG_POSTS } from "@/site/content";

const DRAFTS_KEY = "jha-blog-drafts-v2";
const LEGACY_DRAFT_KEY = "jha-blog-draft-v1";
const PUBLISHED_OVERRIDES_KEY = "jha-blog-published-overrides-v1";
const LIKES_COUNT_KEY = "jha-blog-likes-v1";
const LIKES_ME_KEY = "jha-blog-liked-v1";

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

/* ------------ Published post overrides (edit-in-place) ------------- */
/**
 * When the user edits a "published" post from BLOG_POSTS, we save the updated
 * copy in localStorage keyed by slug. The site reads BLOG_POSTS overlaid with
 * these overrides, so edits show up immediately without touching content.js.
 */

export function loadPublishedOverrides() {
  try {
    const raw = localStorage.getItem(PUBLISHED_OVERRIDES_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (_) { return {}; }
}

export function savePublishedOverrides(map) {
  try { localStorage.setItem(PUBLISHED_OVERRIDES_KEY, JSON.stringify(map || {})); } catch (_) { /* ignore */ }
}

export function upsertPublishedOverride(slug, post) {
  if (!slug) return loadPublishedOverrides();
  const map = loadPublishedOverrides();
  map[slug] = { ...post, slug, updatedAt: Date.now() };
  savePublishedOverrides(map);
  return map;
}

export function deletePublishedOverride(slug) {
  const map = loadPublishedOverrides();
  if (slug in map) {
    delete map[slug];
    savePublishedOverrides(map);
  }
  return map;
}

export function hasPublishedOverride(slug) {
  const map = loadPublishedOverrides();
  return !!(slug && map[slug]);
}

/**
 * Get the merged list of published posts (BLOG_POSTS overlaid with overrides).
 * Falls back to bundled order. Called from Blog list, BlogPost view, and library.
 */
export function getPublishedPosts() {
  const overrides = loadPublishedOverrides();
  return BLOG_POSTS.map((p) => {
    const o = overrides[p.slug];
    if (!o) return p;
    // Merge but keep original slug + fields; blocks/body get replaced
    return { ...p, ...o, slug: p.slug };
  });
}

export function getPublishedPost(slug) {
  return getPublishedPosts().find((p) => p.slug === slug) || null;
}

/**
 * Given a slug and a post from the editor, is this a real edit vs the bundled original?
 */
export function isPublishedSlug(slug) {
  if (!slug) return false;
  return BLOG_POSTS.some((p) => p.slug === slug);
}

/* ------------ Likes (per-browser, localStorage only) ------------- */
/**
 *  jha-blog-likes-v1  = { [slug]: number }   -- total local like count
 *  jha-blog-liked-v1  = { [slug]: true }     -- whether this browser has liked
 *
 * Per-browser toggle. When user hits Like, count +=1 and liked=true.
 * When user un-likes, count -=1 and liked flag removed.
 */

function readMap(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return {};
    const p = JSON.parse(raw);
    return p && typeof p === "object" ? p : {};
  } catch (_) { return {}; }
}

function writeMap(key, m) {
  try { localStorage.setItem(key, JSON.stringify(m || {})); } catch (_) { /* ignore */ }
}

export function getLikeCount(slug) {
  const m = readMap(LIKES_COUNT_KEY);
  return Number(m[slug] || 0);
}

export function isLikedByMe(slug) {
  const m = readMap(LIKES_ME_KEY);
  return !!m[slug];
}

/** Toggle like state for this browser. Returns { count, liked } after the change. */
export function toggleLike(slug) {
  if (!slug) return { count: 0, liked: false };
  const counts = readMap(LIKES_COUNT_KEY);
  const likedMap = readMap(LIKES_ME_KEY);
  const currentlyLiked = !!likedMap[slug];
  let count = Number(counts[slug] || 0);
  if (currentlyLiked) {
    count = Math.max(0, count - 1);
    delete likedMap[slug];
  } else {
    count = count + 1;
    likedMap[slug] = true;
  }
  counts[slug] = count;
  writeMap(LIKES_COUNT_KEY, counts);
  writeMap(LIKES_ME_KEY, likedMap);
  return { count, liked: !currentlyLiked };
}
