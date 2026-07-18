import { useEffect, useRef, useState } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";
import { Copy, Check, ExternalLink, Download } from "lucide-react";

/**
 * BlockView: renders one block from the schema.
 * Used in BOTH the editor (editable=true) and the public post (editable=false).
 * When editable, `onChange(nextBlock)` will fire.
 */

/* ---------- inline HTML sanitiser + equation renderer ---------- */

const ALLOWED = /^(strong|b|em|i|u|s|del|code|a|br|span)$/i;

/** Post-process an HTML string to:
 *  1. render inline equations (span[data-eq]) with KaTeX,
 *  2. strip everything outside the allow-list.
 * Returns HTML string.
 */
function processInlineHtml(html = "") {
  if (typeof window === "undefined") return html;
  const tmp = document.createElement("div");
  tmp.innerHTML = html;

  const walk = (el) => {
    // Render equation spans
    if (el.tagName === "SPAN" && el.getAttribute("data-eq") === "1") {
      const src = el.textContent || "";
      try {
        const rendered = katex.renderToString(src, { throwOnError: false, output: "html" });
        const wrap = document.createElement("span");
        wrap.className = "inline-eq";
        wrap.innerHTML = rendered;
        el.replaceWith(wrap);
        return;
      } catch (_) {
        // leave as-is
      }
    }
    // Strip disallowed tags but keep children
    if (el.tagName && !ALLOWED.test(el.tagName)) {
      const parent = el.parentNode;
      while (el.firstChild) parent.insertBefore(el.firstChild, el);
      parent.removeChild(el);
      return;
    }
    // Sanitize link
    if (el.tagName === "A") {
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noreferrer");
    }
    // Recurse
    Array.from(el.children).forEach(walk);
  };

  Array.from(tmp.children).forEach(walk);
  return tmp.innerHTML;
}

/** contentEditable that reports HTML changes without re-rendering while typing */
function InlineEditable({ html, onChange, placeholder, className, tag = "div", align = "left", onFocus }) {
  const ref = useRef(null);
  // set initial content only once (avoid caret jumping)
  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== (html || "")) {
      ref.current.innerHTML = html || "";
    }
  }, []); // eslint-disable-line
  const Tag = tag;
  return (
    <Tag
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      spellCheck
      onInput={(e) => onChange(e.currentTarget.innerHTML)}
      onFocus={onFocus}
      data-placeholder={placeholder || ""}
      className={"blog-ce " + (className || "")}
      style={{ textAlign: align }}
    />
  );
}

/* ---------- YouTube / Google Drive URL helpers ---------- */

function youtubeEmbed(url = "") {
  const m1 = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{6,})/);
  const id = m1 ? m1[1] : null;
  return id ? `https://www.youtube.com/embed/${id}` : null;
}

function driveEmbed(url = "") {
  const m = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (m) return `https://drive.google.com/file/d/${m[1]}/preview`;
  const m2 = url.match(/docs\.google\.com\/(document|spreadsheets|presentation)\/d\/([^/]+)/);
  if (m2) return `https://docs.google.com/${m2[1]}/d/${m2[2]}/preview`;
  return url; // let iframe try it
}

/* ---------- Block ---------- */

export default function BlockView({ block, editable = false, onChange, onFocus }) {
  const [copied, setCopied] = useState(false);
  const b = block;
  const set = (patch) => onChange && onChange({ ...b, ...patch });
  const setContent = (content) => set({ content });
  const setProps = (props) => set({ props: { ...b.props, ...props } });

  const align = b.props?.align || "left";

  /* ----- Heading ----- */
  if (b.type === "heading") {
    const level = Math.min(6, Math.max(1, b.props?.level || 2));
    const Tag = `h${level}`;
    const cls = {
      1: "text-4xl sm:text-5xl font-serif-editorial tracking-tight leading-[1.05]",
      2: "text-3xl sm:text-4xl font-serif-editorial tracking-tight leading-[1.1]",
      3: "text-2xl sm:text-3xl font-serif-editorial tracking-tight leading-[1.15]",
      4: "text-xl sm:text-2xl font-serif-editorial tracking-tight leading-tight",
      5: "text-lg sm:text-xl font-semibold tracking-tight leading-snug",
      6: "text-base sm:text-lg font-semibold uppercase tracking-[0.14em]",
    }[level];
    return editable ? (
      <InlineEditable
        tag={Tag}
        align={align}
        html={b.content}
        onChange={setContent}
        onFocus={onFocus}
        placeholder={`Heading ${level}`}
        className={cls + " mt-2"}
      />
    ) : (
      <Tag className={cls + " mt-2"} style={{ textAlign: align }}
        dangerouslySetInnerHTML={{ __html: processInlineHtml(b.content) }} />
    );
  }

  /* ----- Paragraph ----- */
  if (b.type === "paragraph") {
    return editable ? (
      <InlineEditable
        html={b.content}
        onChange={setContent}
        onFocus={onFocus}
        placeholder="Type text… (Ctrl-B bold · Ctrl-I italic · Ctrl-U underline)"
        className="leading-[1.75] text-[17px] text-[color:var(--ink)]/90"
        align={align}
      />
    ) : (
      <p className="leading-[1.75] text-[17px] text-[color:var(--ink)]/90" style={{ textAlign: align }}
        dangerouslySetInnerHTML={{ __html: processInlineHtml(b.content) }} />
    );
  }

  /* ----- Quote ----- */
  if (b.type === "quote") {
    return (
      <blockquote className="border-l-4 border-[color:var(--accent)] pl-5 italic text-[color:var(--ink)]/80"
        style={{ textAlign: align }}>
        {editable ? (
          <InlineEditable html={b.content} onChange={setContent} onFocus={onFocus} placeholder="Quote…" align={align} />
        ) : (
          <span dangerouslySetInnerHTML={{ __html: processInlineHtml(b.content) }} />
        )}
      </blockquote>
    );
  }

  /* ----- Callout ----- */
  if (b.type === "callout") {
    const tones = {
      amber: "bg-amber-50 border-amber-200 text-amber-950 dark:bg-amber-900/20 dark:border-amber-700/50 dark:text-amber-100",
      blue: "bg-sky-50 border-sky-200 text-sky-950 dark:bg-sky-900/20 dark:border-sky-700/50 dark:text-sky-100",
      green: "bg-emerald-50 border-emerald-200 text-emerald-950 dark:bg-emerald-900/20 dark:border-emerald-700/50 dark:text-emerald-100",
      red: "bg-rose-50 border-rose-200 text-rose-950 dark:bg-rose-900/20 dark:border-rose-700/50 dark:text-rose-100",
      slate: "bg-slate-50 border-slate-200 text-slate-900 dark:bg-slate-800/40 dark:border-slate-600/50 dark:text-slate-100",
    };
    return (
      <div className={`rounded-xl border p-4 sm:p-5 flex gap-3 items-start ${tones[b.props?.tone || "amber"]}`}>
        {editable ? (
          <input
            className="w-8 h-8 text-xl bg-transparent border-0 outline-none text-center"
            value={b.props?.icon || "💡"}
            onChange={(e) => setProps({ icon: e.target.value.slice(0, 2) })}
            aria-label="Callout icon"
          />
        ) : (
          <span className="text-xl leading-none pt-0.5">{b.props?.icon || "💡"}</span>
        )}
        <div className="flex-1 min-w-0">
          {editable && (
            <div className="mb-2 flex flex-wrap gap-1.5">
              {Object.keys(tones).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setProps({ tone: t })}
                  className={`text-[10px] font-mono-tech tracking-[0.16em] uppercase px-2 py-0.5 rounded-full border ${
                    (b.props?.tone || "amber") === t ? "bg-black/70 text-white border-black" : "opacity-70 hover:opacity-100"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          )}
          {editable ? (
            <InlineEditable html={b.content} onChange={setContent} onFocus={onFocus} placeholder="Callout text…" />
          ) : (
            <div dangerouslySetInnerHTML={{ __html: processInlineHtml(b.content) }} />
          )}
        </div>
      </div>
    );
  }

  /* ----- Divider ----- */
  if (b.type === "divider") {
    return <hr className="border-0 border-t border-dashed border-[color:var(--line-strong)] my-2" />;
  }

  /* ----- Code ----- */
  if (b.type === "code") {
    return (
      <div className="rounded-xl border border-[color:var(--line-strong)] bg-[color:var(--bg-2)] overflow-hidden">
        <div className="flex items-center justify-between px-3 py-1.5 border-b border-[color:var(--line)] bg-black/5 dark:bg-white/5">
          {editable ? (
            <input
              value={b.props?.lang || ""}
              onChange={(e) => setProps({ lang: e.target.value })}
              placeholder="language"
              className="bg-transparent font-mono-tech text-[10.5px] tracking-[0.24em] uppercase text-[color:var(--ink-2)] outline-none w-32"
            />
          ) : (
            <span className="font-mono-tech text-[10.5px] tracking-[0.24em] uppercase text-[color:var(--ink-2)]">
              {b.props?.lang || "code"}
            </span>
          )}
          <button
            type="button"
            onClick={() => {
              navigator.clipboard?.writeText(b.content || "");
              setCopied(true);
              setTimeout(() => setCopied(false), 1200);
            }}
            className="text-[color:var(--ink-2)] hover:text-[color:var(--ink)] inline-flex items-center gap-1 text-xs"
            aria-label="Copy code"
          >
            {copied ? <><Check size={12}/> Copied</> : <><Copy size={12}/> Copy</>}
          </button>
        </div>
        {editable ? (
          <textarea
            value={b.content || ""}
            onChange={(e) => setContent(e.target.value)}
            onFocus={onFocus}
            spellCheck={false}
            rows={Math.min(24, Math.max(4, (b.content || "").split("\n").length + 1))}
            className="w-full bg-transparent font-mono-tech text-sm px-4 py-3 outline-none resize-none"
            placeholder="paste code…"
          />
        ) : (
          <pre className="px-4 py-3 overflow-x-auto text-sm"><code className="font-mono-tech">{b.content || ""}</code></pre>
        )}
      </div>
    );
  }

  /* ----- Equation ----- */
  if (b.type === "equation") {
    const inline = !!b.props?.inline;
    const rendered = (() => {
      try { return katex.renderToString(b.content || "", { throwOnError: false, displayMode: !inline }); }
      catch (e) { return `<span style="color:tomato">${(e && e.message) || "equation error"}</span>`; }
    })();
    return (
      <div className={inline ? "" : "text-center"}>
        {editable && (
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <label className="text-[10.5px] font-mono-tech tracking-[0.24em] uppercase text-[color:var(--ink-2)] inline-flex items-center gap-1">
              <input type="checkbox" checked={inline} onChange={(e) => setProps({ inline: e.target.checked })} />
              inline
            </label>
            <input
              value={b.content || ""}
              onChange={(e) => setContent(e.target.value)}
              onFocus={onFocus}
              placeholder="LaTeX  e.g.  E = mc^2"
              className="flex-1 bg-transparent border border-[color:var(--line-strong)] rounded-md px-3 py-1.5 font-mono-tech text-sm outline-none"
            />
          </div>
        )}
        <span
          className={inline ? "inline-eq" : "block py-2"}
          dangerouslySetInnerHTML={{ __html: rendered }}
        />
      </div>
    );
  }

  /* ----- Bulleted / Numbered / Todo lists ----- */
  if (b.type === "bulletList" || b.type === "numberList" || b.type === "todoList") {
    const items = Array.isArray(b.content) ? b.content : [];
    const isTodo = b.type === "todoList";
    const isNum = b.type === "numberList";
    const updateItem = (idx, patch) => setContent(items.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
    const addItem = () => setContent([...items, isTodo ? { text: "", checked: false } : { text: "" }]);
    const removeItem = (idx) => setContent(items.filter((_, i) => i !== idx));
    const Wrap = isNum ? "ol" : "ul";
    return (
      <Wrap className={`${isNum ? "list-decimal" : isTodo ? "list-none" : "list-disc"} pl-6 space-y-1.5 text-[17px] leading-[1.7]`}>
        {items.map((it, idx) => (
          <li key={idx} className="pl-1">
            <div className="flex items-start gap-2">
              {isTodo && (
                <input
                  type="checkbox"
                  checked={!!it.checked}
                  onChange={(e) => editable && updateItem(idx, { checked: e.target.checked })}
                  disabled={!editable && false /* readers can still tick — visual only */}
                  className="mt-1.5 accent-[color:var(--accent)]"
                />
              )}
              <div className="flex-1 min-w-0" style={{ textDecoration: isTodo && it.checked ? "line-through" : "none", opacity: isTodo && it.checked ? 0.55 : 1 }}>
                {editable ? (
                  <InlineEditable
                    html={it.text}
                    onChange={(v) => updateItem(idx, { text: v })}
                    onFocus={onFocus}
                    placeholder="List item…"
                  />
                ) : (
                  <span dangerouslySetInnerHTML={{ __html: processInlineHtml(it.text) }} />
                )}
              </div>
              {editable && (
                <button
                  type="button"
                  onClick={() => removeItem(idx)}
                  className="text-[color:var(--ink-2)] hover:text-rose-500 text-xs opacity-0 group-hover:opacity-100"
                  aria-label="Remove item"
                >
                  ✕
                </button>
              )}
            </div>
          </li>
        ))}
        {editable && (
          <li className="list-none pl-0 pt-1">
            <button
              type="button"
              onClick={addItem}
              className="text-[11px] font-mono-tech tracking-[0.24em] uppercase text-[color:var(--ink-2)] hover:text-[color:var(--accent)]"
            >
              + add item
            </button>
          </li>
        )}
      </Wrap>
    );
  }

  /* ----- Table ----- */
  if (b.type === "table") {
    const rows = b.content?.rows || [];
    const setRows = (r) => setContent({ rows: r });
    const setCell = (r, c, v) => {
      const nr = rows.map((row, i) => (i === r ? row.map((cell, j) => (j === c ? v : cell)) : row));
      setRows(nr);
    };
    const addRow = () => setRows([...rows, rows[0]?.map(() => "") || [""]]);
    const addCol = () => setRows(rows.map((row) => [...row, ""]));
    const delRow = (i) => setRows(rows.filter((_, idx) => idx !== i));
    const delCol = (j) => setRows(rows.map((row) => row.filter((_, idx) => idx !== j)));
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full border border-[color:var(--line-strong)] rounded-lg overflow-hidden text-sm">
          <tbody>
            {rows.map((row, r) => (
              <tr key={r} className={r === 0 ? "bg-black/5 dark:bg-white/5 font-semibold" : ""}>
                {row.map((cell, c) => (
                  <td key={c} className="border border-[color:var(--line)] px-3 py-2 align-top">
                    {editable ? (
                      <InlineEditable
                        html={cell}
                        onChange={(v) => setCell(r, c, v)}
                        onFocus={onFocus}
                        placeholder={r === 0 ? "Header" : "cell"}
                      />
                    ) : (
                      <span dangerouslySetInnerHTML={{ __html: processInlineHtml(cell) }} />
                    )}
                  </td>
                ))}
                {editable && (
                  <td className="px-2 py-2 border-0 whitespace-nowrap">
                    <button type="button" onClick={() => delRow(r)} className="text-[10px] text-rose-500 hover:underline" title="Delete row">– row</button>
                  </td>
                )}
              </tr>
            ))}
            {editable && (
              <tr>
                {(rows[0] || []).map((_, c) => (
                  <td key={c} className="px-2 py-1 text-center">
                    <button type="button" onClick={() => delCol(c)} className="text-[10px] text-rose-500 hover:underline" title="Delete column">– col</button>
                  </td>
                ))}
              </tr>
            )}
          </tbody>
        </table>
        {editable && (
          <div className="mt-2 flex flex-wrap gap-2">
            <button type="button" onClick={addRow} className="text-[11px] font-mono-tech tracking-[0.24em] uppercase text-[color:var(--ink-2)] hover:text-[color:var(--accent)]">+ row</button>
            <button type="button" onClick={addCol} className="text-[11px] font-mono-tech tracking-[0.24em] uppercase text-[color:var(--ink-2)] hover:text-[color:var(--accent)]">+ column</button>
          </div>
        )}
      </div>
    );
  }

  /* ----- Image ----- */
  if (b.type === "image") {
    const src = b.content?.src || "";
    const handleFile = (file) => {
      if (!file) return;
      const rd = new FileReader();
      rd.onload = () => setContent({ ...b.content, src: rd.result });
      rd.readAsDataURL(file);
    };
    return (
      <figure className="my-2" style={{ textAlign: b.props?.align || "center" }}>
        {src ? (
          <img src={src} alt={b.content?.alt || "figure"} className="max-w-full h-auto rounded-lg inline-block" />
        ) : editable ? (
          <label className="block border-2 border-dashed border-[color:var(--line-strong)] rounded-xl py-8 px-4 text-center cursor-pointer hover:bg-black/[0.02] dark:hover:bg-white/[0.03]">
            <div className="text-sm text-[color:var(--ink-2)]">Click to upload image (stored as base64 inside your JSON)</div>
            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
          </label>
        ) : null}
        {editable && src && (
          <div className="mt-2 flex flex-wrap gap-2 items-center justify-center">
            <label className="text-[11px] font-mono-tech tracking-[0.24em] uppercase text-[color:var(--ink-2)] hover:text-[color:var(--accent)] cursor-pointer">
              replace
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
            </label>
            <button type="button" onClick={() => setContent({ ...b.content, src: "" })} className="text-[11px] font-mono-tech tracking-[0.24em] uppercase text-rose-500">remove</button>
          </div>
        )}
        {editable ? (
          <input
            type="text"
            value={b.content?.caption || ""}
            onChange={(e) => setContent({ ...b.content, caption: e.target.value })}
            placeholder="Caption (optional)"
            className="mt-2 w-full max-w-[60ch] text-center bg-transparent border-0 border-b border-transparent focus:border-[color:var(--line-strong)] outline-none text-sm text-[color:var(--ink-2)] italic"
          />
        ) : b.content?.caption ? (
          <figcaption className="mt-2 text-sm text-[color:var(--ink-2)] italic">{b.content.caption}</figcaption>
        ) : null}
      </figure>
    );
  }

  /* ----- Attachment ----- */
  if (b.type === "attachment") {
    const has = !!b.content?.data;
    const onFile = (f) => {
      if (!f) return;
      const rd = new FileReader();
      rd.onload = () => setContent({ name: f.name, mime: f.type, data: rd.result });
      rd.readAsDataURL(f);
    };
    return (
      <div className="rounded-xl border border-[color:var(--line-strong)] p-4 flex items-center gap-3">
        <span className="text-2xl">📎</span>
        {has ? (
          <>
            <div className="flex-1 min-w-0">
              <div className="truncate text-sm font-medium">{b.content.name || "attachment"}</div>
              <div className="text-[11px] text-[color:var(--ink-2)]">{b.content.mime || "file"}</div>
            </div>
            <a href={b.content.data} download={b.content.name} className="btn-ghost text-xs inline-flex items-center gap-1"><Download size={12}/> Download</a>
            {editable && <button type="button" onClick={() => setContent({ name: "", mime: "", data: "" })} className="text-rose-500 text-xs">Remove</button>}
          </>
        ) : editable ? (
          <label className="flex-1 cursor-pointer text-sm text-[color:var(--ink-2)]">
            Click to attach any file (stored as base64)
            <input type="file" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
          </label>
        ) : (
          <span className="text-[color:var(--ink-2)] text-sm">Empty attachment</span>
        )}
      </div>
    );
  }

  /* ----- PDF ----- */
  if (b.type === "pdf") {
    const has = !!b.content?.data;
    const onFile = (f) => {
      if (!f) return;
      const rd = new FileReader();
      rd.onload = () => setContent({ name: f.name, data: rd.result });
      rd.readAsDataURL(f);
    };
    return (
      <div className="rounded-xl border border-[color:var(--line-strong)] overflow-hidden">
        <div className="flex items-center gap-2 px-3 py-2 border-b border-[color:var(--line)] bg-black/5 dark:bg-white/5">
          <span className="text-lg">📄</span>
          <div className="flex-1 min-w-0 truncate text-sm">{b.content?.name || "PDF"}</div>
          {has && <a href={b.content.data} download={b.content.name} className="text-xs inline-flex items-center gap-1 hover:text-[color:var(--accent)]"><Download size={12}/> Download</a>}
          {editable && (
            <label className="text-xs cursor-pointer hover:text-[color:var(--accent)] ml-2">
              {has ? "Replace" : "Upload PDF"}
              <input type="file" accept="application/pdf" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
            </label>
          )}
        </div>
        {has ? (
          <iframe title={b.content?.name || "pdf"} src={b.content.data} className="w-full h-[520px]" />
        ) : editable ? (
          <label className="block cursor-pointer py-10 text-center text-sm text-[color:var(--ink-2)]">
            Click to upload PDF (stored as base64 inside your JSON)
            <input type="file" accept="application/pdf" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
          </label>
        ) : (
          <div className="py-10 text-center text-sm text-[color:var(--ink-2)]">No PDF attached</div>
        )}
      </div>
    );
  }

  /* ----- Embed (YouTube / Google Drive) ----- */
  if (b.type === "embed") {
    const provider = b.props?.provider || "youtube";
    const url = b.content?.url || "";
    const src = provider === "gdrive" ? driveEmbed(url) : youtubeEmbed(url);
    return (
      <div className="my-2">
        {editable && (
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <select
              value={provider}
              onChange={(e) => setProps({ provider: e.target.value })}
              className="border border-[color:var(--line-strong)] rounded-md bg-transparent text-sm px-2 py-1"
            >
              <option value="youtube">YouTube</option>
              <option value="gdrive">Google Drive</option>
            </select>
            <input
              value={url}
              onChange={(e) => setContent({ url: e.target.value })}
              onFocus={onFocus}
              placeholder={provider === "gdrive" ? "https://drive.google.com/file/d/…" : "https://www.youtube.com/watch?v=…"}
              className="flex-1 border border-[color:var(--line-strong)] rounded-md bg-transparent text-sm px-3 py-1 outline-none"
            />
            {url && (
              <a href={url} target="_blank" rel="noreferrer" className="text-xs text-[color:var(--ink-2)] inline-flex items-center gap-1"><ExternalLink size={12}/> open</a>
            )}
          </div>
        )}
        {src ? (
          <div className="relative w-full overflow-hidden rounded-xl border border-[color:var(--line-strong)]" style={{ aspectRatio: "16 / 9" }}>
            <iframe
              title={provider}
              src={src}
              className="absolute inset-0 w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-[color:var(--line-strong)] py-8 text-center text-sm text-[color:var(--ink-2)]">
            {provider === "gdrive" ? "Paste a Google Drive share link" : "Paste a YouTube URL"}
          </div>
        )}
      </div>
    );
  }

  /* ----- Date pill ----- */
  if (b.type === "date") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-[color:var(--line-strong)] text-xs font-mono-tech tracking-[0.14em] uppercase text-[color:var(--ink-2)]">
        <span aria-hidden>📅</span>
        {b.content?.display || "Date"}
        <span className="text-[color:var(--ink-3)] normal-case tracking-normal">· {b.content?.iso || ""}</span>
      </span>
    );
  }

  return null;
}
