import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  Plus, ArrowUp, ArrowDown, Copy as CopyIcon, Trash2, GripVertical,
  Save, Upload, Download, FileJson, FileType2, Eye, Pencil, Home as HomeIcon,
} from "lucide-react";
import Nav from "@/site/Nav";
import Footer from "@/site/Footer";
import BlockView from "@/blog-editor/BlockView";
import BlockPicker from "@/blog-editor/BlockPicker";
import InlineToolbar from "@/blog-editor/InlineToolbar";
import {
  makeBlock, makeEmptyPost, moveBlock, duplicateBlock, deleteBlock, updateBlock,
} from "@/blog-editor/schema";
import { postToMarkdown, markdownToPost } from "@/blog-editor/markdown";

const LS_KEY = "jha-blog-draft-v1";

function downloadFile(name, content, mime = "application/octet-stream") {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default function AdminEditor() {
  const [post, setPost] = useState(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) return JSON.parse(raw);
    } catch (_) {}
    return makeEmptyPost();
  });
  const [pickerFor, setPickerFor] = useState(null); // insert index or null
  const [preview, setPreview] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    document.title = "Blog Editor · Java Hub Academy";
  }, []);

  // Autosave to localStorage
  useEffect(() => {
    try { localStorage.setItem(LS_KEY, JSON.stringify(post)); } catch (_) {}
  }, [post]);

  const setBlocks = (blocks) => setPost((p) => ({ ...p, blocks }));
  const setBlock = (idx, patch) => setBlocks(updateBlock(post.blocks, idx, patch));
  const doMove = (idx, dir) => setBlocks(moveBlock(post.blocks, idx, dir));
  const doCopy = (idx) => setBlocks(duplicateBlock(post.blocks, idx));
  const doDel = (idx) => setBlocks(deleteBlock(post.blocks, idx));
  const doInsertAt = (idx, newBlock) => {
    const next = post.blocks.slice();
    next.splice(idx, 0, newBlock);
    setBlocks(next);
  };
  const applyAlign = (idx, dir) => {
    const b = post.blocks[idx];
    if (!b) return;
    setBlock(idx, { props: { ...b.props, align: dir } });
  };

  const onExportJson = () => {
    const name = (post.slug || "blog-post") + ".json";
    downloadFile(name, JSON.stringify(post, null, 2), "application/json");
    toast.success("JSON exported");
  };
  const onExportMd = () => {
    const name = (post.slug || "blog-post") + ".md";
    downloadFile(name, postToMarkdown(post), "text/markdown");
    toast.success("Markdown exported");
  };
  const onCopyJson = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(post, null, 2));
      toast.success("Post JSON copied — paste into content.js BLOG_POSTS");
    } catch (_) { toast.error("Clipboard blocked"); }
  };

  const onImport = (file) => {
    if (!file) return;
    const rd = new FileReader();
    rd.onload = () => {
      const text = String(rd.result || "");
      if (/^\s*\{/.test(text)) {
        try {
          const p = JSON.parse(text);
          if (!p.blocks) throw new Error("Missing blocks[]");
          setPost(p);
          toast.success("JSON imported");
        } catch (e) { toast.error("Bad JSON: " + e.message); }
      } else {
        try {
          const p = markdownToPost(text);
          setPost({ ...post, ...p });
          toast.success("Markdown imported");
        } catch (e) { toast.error("Bad Markdown: " + e.message); }
      }
    };
    rd.readAsText(file);
  };

  const stats = useMemo(() => {
    const words = post.blocks.reduce((n, b) => {
      const raw = typeof b.content === "string" ? b.content : JSON.stringify(b.content);
      return n + (raw ? raw.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length : 0);
    }, 0);
    return { words, blocks: post.blocks.length };
  }, [post.blocks]);

  return (
    <main data-testid="admin-editor" className="relative min-h-screen">
      <Nav />
      <div className="pt-24 sm:pt-28 pb-16">
        <div className="mx-auto max-w-[1120px] px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb + top actions */}
          <nav aria-label="Breadcrumb" className="crumb-trail flex flex-wrap items-center gap-2">
            <Link to="/" className="inline-flex items-center gap-1.5 hover:text-[color:var(--accent)]"><HomeIcon size={12}/> Home</Link>
            <span aria-hidden>/</span>
            <Link to="/blog" className="hover:text-[color:var(--accent)]">Blog</Link>
            <span aria-hidden>/</span>
            <span className="crumb-trail__current">Editor</span>
          </nav>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="font-serif-editorial text-3xl sm:text-4xl leading-tight">Blog editor</h1>
              <p className="text-sm text-[color:var(--ink-2)]">Write here → export JSON / Markdown → paste JSON into <code className="px-1 py-0.5 rounded border border-[color:var(--line-strong)] font-mono-tech text-[12px]">content.js</code> to publish.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setPreview((v) => !v)}
                className="btn-ghost text-xs inline-flex items-center gap-1.5"
                data-testid="btn-toggle-preview"
              >
                {preview ? <><Pencil size={12}/> Edit</> : <><Eye size={12}/> Preview</>}
              </button>
              <label className="btn-ghost text-xs inline-flex items-center gap-1.5 cursor-pointer" data-testid="btn-import">
                <Upload size={12}/> Import
                <input type="file" accept=".json,.md,.txt,application/json,text/markdown" className="hidden" onChange={(e) => onImport(e.target.files?.[0])} />
              </label>
              <button type="button" onClick={onExportMd} className="btn-ghost text-xs inline-flex items-center gap-1.5" data-testid="btn-export-md"><FileType2 size={12}/> Markdown</button>
              <button type="button" onClick={onExportJson} className="btn-ghost text-xs inline-flex items-center gap-1.5" data-testid="btn-export-json"><FileJson size={12}/> JSON</button>
              <button type="button" onClick={onCopyJson} className="btn-crisp gloss text-xs inline-flex items-center gap-1.5" data-testid="btn-copy-json"><CopyIcon size={12}/> Copy for content.js</button>
            </div>
          </div>

          {/* Meta panel */}
          <div className="mt-6 rounded-2xl border border-[color:var(--line-strong)] p-4 sm:p-5 grid grid-cols-1 md:grid-cols-2 gap-3">
            <MetaField label="Title" value={post.title} onChange={(v) => setPost({ ...post, title: v })} placeholder="How to become a Java developer" />
            <MetaField label="Slug" value={post.slug} onChange={(v) => setPost({ ...post, slug: v.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-") })} placeholder="how-to-become-a-java-developer" mono />
            <MetaField label="Excerpt" value={post.excerpt} onChange={(v) => setPost({ ...post, excerpt: v })} placeholder="One-line summary that appears on the blog index." />
            <div className="grid grid-cols-3 gap-3">
              <MetaField label="Tag" value={post.tag} onChange={(v) => setPost({ ...post, tag: v })} placeholder="Backend" />
              <MetaField label="Date" value={post.date} onChange={(v) => setPost({ ...post, date: v })} placeholder="YYYY-MM-DD" type="date" />
              <MetaField label="Read" value={post.read} onChange={(v) => setPost({ ...post, read: v })} placeholder="6 min read" />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-[color:var(--ink-2)] font-mono-tech tracking-[0.24em] uppercase">
            <span data-testid="stat-blocks">{stats.blocks} blocks</span>
            <span aria-hidden>·</span>
            <span>{stats.words} words</span>
            <span aria-hidden>·</span>
            <span className="inline-flex items-center gap-1"><Save size={11}/> autosaved locally</span>
          </div>

          {/* Editor / Preview canvas */}
          {preview ? (
            <div className="mt-8 space-y-5">
              {post.blocks.map((b) => (
                <div key={b.id}><BlockView block={b} editable={false} /></div>
              ))}
            </div>
          ) : (
            <>
              <div ref={containerRef} data-blog-editor className="mt-8 space-y-3">
                {post.blocks.length === 0 && (
                  <button
                    type="button"
                    onClick={() => setPickerFor(0)}
                    className="w-full py-16 rounded-xl border border-dashed border-[color:var(--line-strong)] text-sm text-[color:var(--ink-2)] hover:bg-black/[0.02] dark:hover:bg-white/[0.03]"
                  >
                    + Add your first block
                  </button>
                )}
                {post.blocks.map((b, idx) => (
                  <BlockRow
                    key={b.id}
                    idx={idx}
                    total={post.blocks.length}
                    block={b}
                    onChange={(patch) => setBlock(idx, patch)}
                    onMoveUp={() => doMove(idx, -1)}
                    onMoveDown={() => doMove(idx, +1)}
                    onCopy={() => doCopy(idx)}
                    onDelete={() => doDel(idx)}
                    onInsertAfter={() => setPickerFor(idx + 1)}
                  />
                ))}
                {post.blocks.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setPickerFor(post.blocks.length)}
                    className="w-full py-4 rounded-xl border border-dashed border-[color:var(--line-strong)] text-sm text-[color:var(--ink-2)] hover:bg-black/[0.02] dark:hover:bg-white/[0.03] inline-flex items-center justify-center gap-2"
                    data-testid="btn-add-block-end"
                  >
                    <Plus size={14}/> Add block
                  </button>
                )}
              </div>

              <InlineToolbar containerRef={containerRef} onAlign={applyAlign} />
            </>
          )}
        </div>
      </div>

      <BlockPicker
        open={pickerFor !== null}
        onClose={() => setPickerFor(null)}
        onInsert={(b) => doInsertAt(pickerFor, b)}
      />
      <Footer />
    </main>
  );
}

function MetaField({ label, value, onChange, placeholder, mono, type = "text" }) {
  return (
    <label className="block">
      <span className="block text-[10.5px] font-mono-tech tracking-[0.24em] uppercase text-[color:var(--ink-2)] mb-1">{label}</span>
      <input
        type={type}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full bg-transparent border border-[color:var(--line-strong)] rounded-md px-3 py-2 text-sm outline-none focus:border-[color:var(--accent)] ${mono ? "font-mono-tech" : ""}`}
      />
    </label>
  );
}

function BlockRow({ idx, total, block, onChange, onMoveUp, onMoveDown, onCopy, onDelete, onInsertAfter }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      className="group relative rounded-lg -mx-2 px-2 py-1 hover:bg-black/[0.02] dark:hover:bg-white/[0.03]"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      data-block-index={idx}
    >
      {/* Left rail: handle + add */}
      <div className="absolute -left-1 top-1 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button type="button" onClick={onInsertAfter} className="w-6 h-6 grid place-items-center rounded-md hover:bg-black/10 dark:hover:bg-white/10 text-[color:var(--ink-2)]" title="Add block below" aria-label="Add block below">
          <Plus size={14}/>
        </button>
        <div className="w-6 h-6 grid place-items-center rounded-md text-[color:var(--ink-2)]" title="Drag (soon)"><GripVertical size={14}/></div>
      </div>

      {/* Right rail: controls */}
      <div className={`absolute right-1 top-1 flex items-center gap-0.5 rounded-md border border-[color:var(--line-strong)] bg-[color:var(--bg)] px-1 py-0.5 transition-opacity ${hover ? "opacity-100" : "opacity-0"}`}>
        <button type="button" disabled={idx === 0} onClick={onMoveUp} title="Move up" className="p-1 disabled:opacity-30 hover:text-[color:var(--accent)]" data-testid={`ctrl-up-${idx}`}><ArrowUp size={13}/></button>
        <button type="button" disabled={idx === total - 1} onClick={onMoveDown} title="Move down" className="p-1 disabled:opacity-30 hover:text-[color:var(--accent)]" data-testid={`ctrl-down-${idx}`}><ArrowDown size={13}/></button>
        <button type="button" onClick={onCopy} title="Duplicate" className="p-1 hover:text-[color:var(--accent)]" data-testid={`ctrl-copy-${idx}`}><CopyIcon size={13}/></button>
        <button type="button" onClick={onDelete} title="Delete" className="p-1 hover:text-rose-500" data-testid={`ctrl-del-${idx}`}><Trash2 size={13}/></button>
      </div>

      <div className="pl-6 pr-8">
        <BlockView
          block={block}
          editable
          onChange={onChange}
        />
      </div>
    </div>
  );
}
