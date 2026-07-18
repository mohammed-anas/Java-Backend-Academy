import { useEffect, useRef, useState } from "react";
import { Bold, Italic, Underline, Strikethrough, Link as LinkIcon, Sigma, AlignLeft, AlignCenter, AlignRight } from "lucide-react";

/**
 * InlineToolbar
 * Floating toolbar that shows on text selection inside `data-blog-editor`.
 * Uses document.execCommand for classic formatting.
 * The active block is the container of the current selection — we look up its
 * `data-block-index` via DOM traversal and inform the parent via onAlign().
 */
export default function InlineToolbar({ containerRef, onAlign }) {
  const barRef = useRef(null);
  const [pos, setPos] = useState(null); // {top,left} or null when hidden

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const hide = () => setPos(null);
    const compute = () => {
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return hide();
      const range = sel.getRangeAt(0);
      const node = range.commonAncestorContainer;
      const host = node.nodeType === 1 ? node : node.parentElement;
      if (!host || !el.contains(host)) return hide();
      const rect = range.getBoundingClientRect();
      if (!rect || (rect.width === 0 && rect.height === 0)) return hide();
      setPos({ top: rect.top + window.scrollY - 46, left: rect.left + window.scrollX + rect.width / 2 });
    };

    const onDown = (e) => {
      if (barRef.current && barRef.current.contains(e.target)) return;
    };
    const onUp = () => setTimeout(compute, 0);
    const onKey = () => setTimeout(compute, 0);
    const onScroll = () => setTimeout(compute, 0);

    document.addEventListener("mousedown", onDown);
    document.addEventListener("mouseup", onUp);
    document.addEventListener("keyup", onKey);
    document.addEventListener("selectionchange", onUp);
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onScroll);

    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseup", onUp);
      document.removeEventListener("keyup", onKey);
      document.removeEventListener("selectionchange", onUp);
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onScroll);
    };
  }, [containerRef]);

  const cmd = (name, arg) => {
    try { document.execCommand(name, false, arg); } catch (_) { /* no-op */ }
    // trigger input on the focused editable to persist
    const el = document.activeElement;
    if (el && el.isContentEditable) {
      el.dispatchEvent(new Event("input", { bubbles: true }));
    }
  };

  const wrapSelectionEquation = () => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const text = sel.toString();
    if (!text) return;
    const html = `<span data-eq="1">${text}</span>`;
    cmd("insertHTML", html);
  };

  const insertLink = () => {
    const url = window.prompt("Enter URL", "https://");
    if (!url) return;
    cmd("createLink", url);
    // add target=_blank via a small hack
    const sel = window.getSelection();
    if (sel && sel.anchorNode) {
      const a = sel.anchorNode.parentElement?.closest("a");
      if (a) { a.target = "_blank"; a.rel = "noreferrer"; }
    }
  };

  const findBlockIndex = () => {
    const sel = window.getSelection();
    const node = sel?.anchorNode;
    const host = node?.nodeType === 1 ? node : node?.parentElement;
    const wrap = host?.closest("[data-block-index]");
    if (!wrap) return -1;
    return parseInt(wrap.getAttribute("data-block-index"), 10);
  };

  const applyAlign = (dir) => {
    const idx = findBlockIndex();
    if (idx >= 0) onAlign?.(idx, dir);
  };

  if (!pos) return null;

  return (
    <div
      ref={barRef}
      style={{ top: pos.top, left: pos.left, transform: "translate(-50%, 0)" }}
      className="fixed z-50 flex items-center gap-1 rounded-lg border border-[color:var(--line-strong)] bg-[color:var(--bg)] shadow-lg px-1 py-1"
      onMouseDown={(e) => e.preventDefault() /* keep selection */}
    >
      <IconBtn onClick={() => cmd("bold")} title="Bold  Ctrl-B"><Bold size={14}/></IconBtn>
      <IconBtn onClick={() => cmd("italic")} title="Italic  Ctrl-I"><Italic size={14}/></IconBtn>
      <IconBtn onClick={() => cmd("underline")} title="Underline  Ctrl-U"><Underline size={14}/></IconBtn>
      <IconBtn onClick={() => cmd("strikeThrough")} title="Strikethrough"><Strikethrough size={14}/></IconBtn>
      <span className="w-px self-stretch bg-[color:var(--line-strong)] mx-1" />
      <IconBtn onClick={insertLink} title="Link"><LinkIcon size={14}/></IconBtn>
      <IconBtn onClick={wrapSelectionEquation} title="Inline equation"><Sigma size={14}/></IconBtn>
      <span className="w-px self-stretch bg-[color:var(--line-strong)] mx-1" />
      <IconBtn onClick={() => applyAlign("left")} title="Align left"><AlignLeft size={14}/></IconBtn>
      <IconBtn onClick={() => applyAlign("center")} title="Align center"><AlignCenter size={14}/></IconBtn>
      <IconBtn onClick={() => applyAlign("right")} title="Align right"><AlignRight size={14}/></IconBtn>
    </div>
  );
}

function IconBtn({ children, onClick, title }) {
  return (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); onClick?.(); }}
      className="h-7 w-7 inline-flex items-center justify-center rounded-md hover:bg-black/5 dark:hover:bg-white/10 text-[color:var(--ink)]"
      title={title}
      aria-label={title}
    >
      {children}
    </button>
  );
}
