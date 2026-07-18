import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Pencil, Trash2, Copy as CopyIcon, Download, X, Plus, BookOpen, ClipboardList, FileText,
} from "lucide-react";
import { BLOG_POSTS } from "@/site/content";
import { ensureBlocks, serialiseBlogPosts } from "./library";

/**
 * PostsLibrary — collapsible manager panel shown at the top of the editor.
 *
 *  • Bundled posts  (imported from content.js BLOG_POSTS)
 *      → Edit: loads a deep-copy into the editor (with legacy body[] migrated to blocks[])
 *      → Delete: opens a modal with a paste-ready BLOG_POSTS snippet (this post removed)
 *  • Local drafts  (localStorage array)
 *      → Load: opens that draft in the editor
 *      → Delete: really deletes from localStorage (with confirm)
 */
export default function PostsLibrary({
  drafts,
  currentDraftId,
  onNewDraft,
  onLoadDraft,
  onDeleteDraft,
  onLoadBundled,
}) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("published"); // "published" | "drafts"
  const [confirmDel, setConfirmDel] = useState(null); // { kind:"published"|"draft", post|draft }
  const [deleteSnippet, setDeleteSnippet] = useState(null); // string when a published-delete modal is open

  const publishedCount = BLOG_POSTS.length;
  const draftCount = drafts.length;

  return (
    <div className="mt-6 rounded-2xl border border-[color:var(--line-strong)] overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-black/[0.02] dark:hover:bg-white/[0.03]"
        data-testid="library-toggle"
        aria-expanded={open}
      >
        <span className="inline-flex items-center gap-2 text-sm font-medium">
          <BookOpen size={14} className="text-[color:var(--accent)]" />
          Posts library
          <span className="text-[10.5px] font-mono-tech tracking-[0.24em] uppercase text-[color:var(--ink-2)]">
            {publishedCount} published · {draftCount} drafts
          </span>
        </span>
        <span className="text-[color:var(--ink-2)] text-xs">{open ? "Hide" : "Show"}</span>
      </button>

      {open && (
        <div className="border-t border-[color:var(--line)] p-3 sm:p-4">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
            <div className="inline-flex items-center rounded-full border border-[color:var(--line-strong)] p-1" role="tablist">
              <TabBtn active={tab === "published"} onClick={() => setTab("published")} testId="lib-tab-published">
                <FileText size={12}/> Published ({publishedCount})
              </TabBtn>
              <TabBtn active={tab === "drafts"} onClick={() => setTab("drafts")} testId="lib-tab-drafts">
                <ClipboardList size={12}/> Drafts ({draftCount})
              </TabBtn>
            </div>
            <button
              type="button"
              onClick={onNewDraft}
              data-testid="lib-new-draft"
              className="btn-ghost text-xs inline-flex items-center gap-1"
            >
              <Plus size={12}/> New post
            </button>
          </div>

          {tab === "published" ? (
            <PublishedList
              onEdit={(p) => onLoadBundled(ensureBlocks(deepCopy(p)))}
              onDelete={(p) => setConfirmDel({ kind: "published", post: p })}
            />
          ) : (
            <DraftsList
              drafts={drafts}
              currentId={currentDraftId}
              onLoad={onLoadDraft}
              onDelete={(d) => setConfirmDel({ kind: "draft", draft: d })}
            />
          )}
        </div>
      )}

      {/* Delete confirm modals */}
      {confirmDel?.kind === "draft" && (
        <ConfirmModal
          title={`Delete this draft?`}
          description={
            <>You are about to delete the local draft <b>{confirmDel.draft.title || "Untitled"}</b>. This is stored in your browser only, so this action is permanent.</>
          }
          onCancel={() => setConfirmDel(null)}
          onConfirm={() => {
            onDeleteDraft(confirmDel.draft.id);
            setConfirmDel(null);
            toast.success("Draft deleted");
          }}
          confirmTestId="confirm-del-draft"
        />
      )}

      {confirmDel?.kind === "published" && !deleteSnippet && (
        <ConfirmModal
          title={`Delete published post?`}
          description={
            <>Bundled posts live in <code className="px-1 py-0.5 rounded border border-[color:var(--line-strong)] font-mono-tech text-[12px]">content.js</code>. To actually remove <b>{confirmDel.post.title}</b>, you must paste the new array back into that file. I&apos;ll generate it now.</>
          }
          confirmLabel="Generate paste snippet"
          onCancel={() => setConfirmDel(null)}
          onConfirm={() => {
            const remaining = BLOG_POSTS.filter((p) => p.slug !== confirmDel.post.slug);
            setDeleteSnippet(serialiseBlogPosts(remaining));
          }}
          confirmTestId="confirm-del-published"
        />
      )}

      {deleteSnippet && (
        <SnippetModal
          title="Replace BLOG_POSTS in content.js"
          hint={`Copy the snippet below and REPLACE the entire "export const BLOG_POSTS = [...]" block in frontend/src/site/content.js.`}
          content={deleteSnippet}
          onClose={() => { setDeleteSnippet(null); setConfirmDel(null); }}
        />
      )}
    </div>
  );
}

/* ---------- helpers ---------- */

function deepCopy(x) { return JSON.parse(JSON.stringify(x)); }

function TabBtn({ active, onClick, children, testId }) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-testid={testId}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-mono-tech tracking-[0.24em] uppercase transition-colors ${
        active ? "bg-[color:var(--ink)] text-[color:var(--bg)]" : "text-[color:var(--ink-2)] hover:text-[color:var(--ink)]"
      }`}
    >
      {children}
    </button>
  );
}

function PublishedList({ onEdit, onDelete }) {
  if (!BLOG_POSTS.length) {
    return <EmptyLine>No published posts yet. Write one, then click <b>Copy for content.js</b> and paste it there.</EmptyLine>;
  }
  return (
    <ul className="divide-y divide-[color:var(--line)]">
      {BLOG_POSTS.map((p) => (
        <li key={p.slug} className="py-2.5 flex items-center gap-3" data-testid={`lib-published-${p.slug}`}>
          <div className="flex-1 min-w-0">
            <div className="truncate text-sm font-medium">{p.title || p.slug}</div>
            <div className="text-[11px] text-[color:var(--ink-2)] truncate">
              {p.slug} · {p.date || "—"} · {p.tag || "—"}
            </div>
          </div>
          <button
            type="button"
            onClick={() => onEdit(p)}
            className="text-xs inline-flex items-center gap-1 px-2 py-1 rounded-md border border-[color:var(--line-strong)] hover:text-[color:var(--accent)]"
            data-testid={`lib-edit-${p.slug}`}
            title="Load into editor"
          >
            <Pencil size={12}/> Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(p)}
            className="text-xs inline-flex items-center gap-1 px-2 py-1 rounded-md border border-[color:var(--line-strong)] hover:text-rose-500"
            data-testid={`lib-delete-${p.slug}`}
            title="Remove from BLOG_POSTS"
          >
            <Trash2 size={12}/> Delete
          </button>
        </li>
      ))}
    </ul>
  );
}

function DraftsList({ drafts, currentId, onLoad, onDelete }) {
  if (!drafts.length) {
    return <EmptyLine>No local drafts saved. Every keystroke autosaves the current one — start typing to create it.</EmptyLine>;
  }
  return (
    <ul className="divide-y divide-[color:var(--line)]">
      {drafts.map((d) => (
        <li key={d.id} className={`py-2.5 flex items-center gap-3 ${d.id === currentId ? "bg-[color:var(--accent)]/6 -mx-2 px-2 rounded-md" : ""}`} data-testid={`lib-draft-${d.id}`}>
          <div className="flex-1 min-w-0">
            <div className="truncate text-sm font-medium">
              {d.title || "Untitled draft"} {d.id === currentId && <span className="text-[10px] font-mono-tech tracking-[0.16em] uppercase text-[color:var(--accent)] ml-2">editing</span>}
            </div>
            <div className="text-[11px] text-[color:var(--ink-2)] truncate">
              {d.slug || "no-slug"} · updated {relativeTime(d.updatedAt)}
            </div>
          </div>
          <button
            type="button"
            onClick={() => onLoad(d)}
            disabled={d.id === currentId}
            className="text-xs inline-flex items-center gap-1 px-2 py-1 rounded-md border border-[color:var(--line-strong)] hover:text-[color:var(--accent)] disabled:opacity-40 disabled:cursor-not-allowed"
            data-testid={`lib-load-${d.id}`}
            title="Open this draft in the editor"
          >
            <Pencil size={12}/> {d.id === currentId ? "Editing" : "Load"}
          </button>
          <button
            type="button"
            onClick={() => onDelete(d)}
            className="text-xs inline-flex items-center gap-1 px-2 py-1 rounded-md border border-[color:var(--line-strong)] hover:text-rose-500"
            data-testid={`lib-del-draft-${d.id}`}
            title="Delete draft"
          >
            <Trash2 size={12}/>
          </button>
        </li>
      ))}
    </ul>
  );
}

function EmptyLine({ children }) {
  return <div className="text-[13px] text-[color:var(--ink-2)] py-4 text-center">{children}</div>;
}

function relativeTime(ts) {
  if (!ts) return "—";
  const diff = Date.now() - ts;
  const s = Math.round(diff / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  return `${d}d ago`;
}

/* ---------- Modals ---------- */

function ConfirmModal({ title, description, onCancel, onConfirm, confirmLabel = "Delete", confirmTestId }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onCancel(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);
  return (
    <div className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm grid place-items-center p-4" onClick={onCancel}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-2xl border border-[color:var(--line-strong)] bg-[color:var(--bg)] shadow-2xl p-5">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 grid place-items-center rounded-full bg-rose-500/10 text-rose-500 shrink-0"><Trash2 size={16}/></div>
          <div className="flex-1 min-w-0">
            <h3 className="font-serif-editorial text-xl leading-tight">{title}</h3>
            <p className="mt-1 text-sm text-[color:var(--ink)]/80 leading-relaxed">{description}</p>
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onCancel} className="btn-ghost text-xs">Cancel</button>
          <button
            type="button"
            onClick={onConfirm}
            data-testid={confirmTestId}
            className="text-xs px-3 py-1.5 rounded-md bg-rose-500 hover:bg-rose-600 text-white inline-flex items-center gap-1"
          >
            <Trash2 size={12}/> {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function SnippetModal({ title, hint, content, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const stats = useMemo(() => {
    const size = new Blob([content]).size;
    const kb = (size / 1024).toFixed(1);
    return { kb };
  }, [content]);

  const copy = async () => {
    try { await navigator.clipboard.writeText(content); toast.success("Snippet copied"); }
    catch (_) { toast.error("Clipboard blocked"); }
  };
  const download = () => {
    const blob = new Blob([content], { type: "text/javascript" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "BLOG_POSTS.snippet.js";
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
    toast.success("Snippet downloaded");
  };

  return (
    <div className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm grid place-items-center p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-3xl rounded-2xl border border-[color:var(--line-strong)] bg-[color:var(--bg)] shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-[color:var(--line)]">
          <div>
            <div className="text-sm font-medium">{title}</div>
            <div className="text-[11px] text-[color:var(--ink-2)]">{stats.kb} KB</div>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/10" aria-label="Close">
            <X size={14}/>
          </button>
        </div>
        <div className="px-4 py-3 text-[13px] text-[color:var(--ink-2)]">{hint}</div>
        <pre className="mx-4 mb-4 max-h-[50vh] overflow-auto rounded-lg border border-[color:var(--line)] bg-black/5 dark:bg-white/5 p-3 text-[12px] font-mono-tech whitespace-pre-wrap">
          {content}
        </pre>
        <div className="border-t border-[color:var(--line)] px-4 py-3 flex justify-end gap-2">
          <button type="button" onClick={download} className="btn-ghost text-xs inline-flex items-center gap-1" data-testid="snippet-download"><Download size={12}/> Download</button>
          <button type="button" onClick={copy} className="btn-crisp gloss text-xs inline-flex items-center gap-1" data-testid="snippet-copy"><CopyIcon size={12}/> Copy</button>
        </div>
      </div>
    </div>
  );
}
