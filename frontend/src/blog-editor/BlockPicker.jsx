import { useEffect, useState } from "react";
import { BLOCK_CATALOGUE, makeBlock, makeDateBlockPreset } from "./schema";

/**
 * BlockPicker — "add block" dialog. Grouped list, search, keyboard-friendly.
 */
export default function BlockPicker({ open, onClose, onInsert }) {
  const [q, setQ] = useState("");
  useEffect(() => { if (open) setQ(""); }, [open]);
  if (!open) return null;

  const filter = (items) => {
    if (!q.trim()) return items;
    const s = q.toLowerCase();
    return items.filter((it) => it.label.toLowerCase().includes(s) || it.type.toLowerCase().includes(s));
  };

  const insert = (item) => {
    let b = makeBlock(item.type);
    if (item.propsOverride) b = { ...b, props: { ...b.props, ...item.propsOverride } };
    if (item.type === "date" && item.dateOverride) {
      b = { ...b, content: makeDateBlockPreset(item.dateOverride) };
    }
    onInsert(b);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-start justify-center p-4 sm:p-8"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-2xl border border-[color:var(--line-strong)] bg-[color:var(--bg)] shadow-2xl overflow-hidden mt-16"
      >
        <div className="border-b border-[color:var(--line)] px-4 py-3">
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search blocks…  (heading, code, image, table, youtube, date…)"
            className="w-full bg-transparent outline-none text-sm"
          />
        </div>
        <div className="max-h-[60vh] overflow-y-auto py-2">
          {BLOCK_CATALOGUE.map((group) => {
            const items = filter(group.items);
            if (!items.length) return null;
            return (
              <div key={group.group} className="px-2 py-1">
                <div className="px-2 py-1 text-[10.5px] font-mono-tech tracking-[0.24em] uppercase text-[color:var(--ink-2)]">{group.group}</div>
                {items.map((it, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => insert(it)}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-left"
                  >
                    <span className="w-8 h-8 grid place-items-center rounded-md border border-[color:var(--line-strong)] text-sm">{it.icon}</span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-sm font-medium truncate">{it.label}</span>
                      {it.hint && <span className="block text-xs text-[color:var(--ink-2)] truncate">{it.hint}</span>}
                    </span>
                  </button>
                ))}
              </div>
            );
          })}
        </div>
        <div className="border-t border-[color:var(--line)] px-4 py-2 text-[11px] text-[color:var(--ink-2)]">
          Press <kbd className="px-1.5 py-0.5 rounded border border-[color:var(--line-strong)]">Esc</kbd> to close.
        </div>
      </div>
    </div>
  );
}
