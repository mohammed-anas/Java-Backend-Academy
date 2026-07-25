import { useEffect, useRef, useState } from "react";
import { Heart, Share2, Link as LinkIcon, X, Check } from "lucide-react";
import { toast } from "sonner";
import { getLikeCount, isLikedByMe, toggleLike } from "./library";

/**
 * PostActions — Like + Share widget shown on the article page.
 *
 * Props:
 *   slug        (string, required)  — the post slug (unique)
 *   title       (string)            — used in share text
 *   url         (string, optional)  — canonical share URL (defaults to window.location.href)
 *   compact     (boolean)           — smaller styling for cards (optional)
 */
export default function PostActions({ slug, title = "", url, compact = false }) {
  const [count, setCount] = useState(() => getLikeCount(slug));
  const [liked, setLiked] = useState(() => isLikedByMe(slug));
  const [burst, setBurst] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  // Keep in sync if slug changes
  useEffect(() => {
    setCount(getLikeCount(slug));
    setLiked(isLikedByMe(slug));
  }, [slug]);

  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");
  const shareText = title ? `${title} — Java Hub Academy` : "Java Hub Academy article";

  const handleLike = () => {
    const res = toggleLike(slug);
    setCount(res.count);
    setLiked(res.liked);
    if (res.liked) {
      setBurst(true);
      window.setTimeout(() => setBurst(false), 550);
    }
  };

  const nativeShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: shareText, text: shareText, url: shareUrl });
      } catch (_) { /* user cancelled */ }
      return true;
    }
    return false;
  };

  const handleShareClick = async () => {
    const ok = await nativeShare();
    if (!ok) setShareOpen(true);
  };

  return (
    <div
      data-testid={`post-actions-${slug}`}
      className={`inline-flex items-center gap-2 ${compact ? "" : ""}`}
    >
      <LikeButton
        slug={slug}
        count={count}
        liked={liked}
        burst={burst}
        onClick={handleLike}
        compact={compact}
      />
      <ShareButton
        slug={slug}
        onClick={handleShareClick}
        compact={compact}
      />

      {shareOpen && (
        <ShareModal
          onClose={() => setShareOpen(false)}
          url={shareUrl}
          title={title}
          shareText={shareText}
        />
      )}
    </div>
  );
}

/* ------------------------- Buttons ------------------------- */

function LikeButton({ slug, count, liked, burst, onClick, compact }) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-testid={`btn-like-${slug}`}
      aria-pressed={liked}
      aria-label={liked ? `Unlike (currently ${count})` : `Like (currently ${count})`}
      className={`relative inline-flex items-center gap-2 rounded-full border border-[color:var(--line-strong)] px-3.5 ${
        compact ? "py-1 text-[12px]" : "py-1.5 text-[13px]"
      } font-mono-tech tracking-[0.14em] transition-all
        ${liked
          ? "text-rose-500 border-rose-400/70 bg-rose-500/8 hover:bg-rose-500/12"
          : "text-[color:var(--ink)] hover:text-rose-500 hover:border-rose-400/60"}
      `}
    >
      <Heart
        size={compact ? 13 : 14}
        strokeWidth={2.2}
        className={`${liked ? "fill-current" : ""} transition-transform ${burst ? "scale-125" : ""}`}
      />
      <span className="tabular-nums">{count}</span>
      <span className="uppercase text-[10px] tracking-[0.24em] hidden sm:inline">
        {liked ? "Liked" : "Like"}
      </span>
      {burst && <SparkleBurst />}
    </button>
  );
}

function ShareButton({ slug, onClick, compact }) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-testid={`btn-share-${slug}`}
      aria-label="Share this article"
      className={`inline-flex items-center gap-2 rounded-full border border-[color:var(--line-strong)] px-3.5 ${
        compact ? "py-1 text-[12px]" : "py-1.5 text-[13px]"
      } font-mono-tech tracking-[0.14em] transition-colors hover:text-[color:var(--accent)] hover:border-[color:var(--accent)]/60`}
    >
      <Share2 size={compact ? 13 : 14} strokeWidth={2.2} />
      <span className="uppercase text-[10px] tracking-[0.24em] hidden sm:inline">Share</span>
    </button>
  );
}

function SparkleBurst() {
  return (
    <span aria-hidden className="pointer-events-none absolute inset-0 grid place-items-center">
      <span className="absolute w-8 h-8 rounded-full bg-rose-500/30 animate-ping" />
    </span>
  );
}

/* ------------------------- Share modal ------------------------- */

function ShareModal({ onClose, url, title, shareText }) {
  const [copied, setCopied] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    // Preselect the URL for quick copy
    inputRef.current?.focus();
    inputRef.current?.select();
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const enc = encodeURIComponent;
  const targets = [
    {
      id: "whatsapp",
      label: "WhatsApp",
      href: `https://wa.me/?text=${enc(`${shareText}\n\n${url}`)}`,
      brand: "#25D366",
      Icon: WhatsAppIcon,
    },
    {
      id: "twitter",
      label: "Twitter / X",
      href: `https://twitter.com/intent/tweet?text=${enc(shareText)}&url=${enc(url)}`,
      brand: "#0F1419",
      Icon: XIcon,
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`,
      brand: "#0A66C2",
      Icon: LinkedInIcon,
    },
    {
      id: "facebook",
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`,
      brand: "#1877F2",
      Icon: FacebookIcon,
    },
  ];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied");
      window.setTimeout(() => setCopied(false), 1600);
    } catch (_) {
      // Fallback: select and prompt manual copy
      inputRef.current?.select();
      toast.error("Clipboard blocked — press Cmd/Ctrl+C");
    }
  };

  return (
    <div
      className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm grid place-items-center p-4"
      onClick={onClose}
      data-testid="share-modal"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl border border-[color:var(--line-strong)] bg-[color:var(--bg)] shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-[color:var(--line)]">
          <div>
            <div className="text-sm font-medium">Share this article</div>
            {title && (
              <div className="text-[11px] text-[color:var(--ink-2)] truncate max-w-[28ch]">
                {title}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/10"
            aria-label="Close share dialog"
            data-testid="share-close"
          >
            <X size={14} />
          </button>
        </div>

        {/* Copy link row */}
        <div className="px-5 py-4">
          <label className="block text-[10.5px] font-mono-tech tracking-[0.24em] uppercase text-[color:var(--ink-2)] mb-2">
            Link
          </label>
          <div className="flex gap-2">
            <input
              ref={inputRef}
              readOnly
              value={url}
              className="flex-1 min-w-0 bg-transparent border border-[color:var(--line-strong)] rounded-md px-3 py-2 text-[12.5px] font-mono-tech outline-none focus:border-[color:var(--accent)]"
              data-testid="share-url-input"
            />
            <button
              type="button"
              onClick={copy}
              className={`text-xs inline-flex items-center gap-1.5 px-3 rounded-md border ${
                copied
                  ? "border-emerald-500 text-emerald-500"
                  : "border-[color:var(--line-strong)] hover:text-[color:var(--accent)] hover:border-[color:var(--accent)]/60"
              }`}
              data-testid="share-copy-link"
            >
              {copied ? <><Check size={13} /> Copied</> : <><LinkIcon size={13} /> Copy</>}
            </button>
          </div>
        </div>

        {/* Social targets */}
        <div className="px-5 pb-5">
          <div className="text-[10.5px] font-mono-tech tracking-[0.24em] uppercase text-[color:var(--ink-2)] mb-2">
            Share to
          </div>
          <div className="grid grid-cols-2 gap-2">
            {targets.map(({ id, label, href, brand, Icon }) => (
              <a
                key={id}
                href={href}
                target="_blank"
                rel="noreferrer"
                data-testid={`share-${id}`}
                className="group inline-flex items-center gap-2 justify-center px-3 py-2.5 rounded-md border border-[color:var(--line-strong)] hover:border-[color:var(--accent)]/60 transition-colors text-sm"
              >
                <span
                  className="w-6 h-6 grid place-items-center rounded-full text-white"
                  style={{ background: brand }}
                >
                  <Icon size={12} />
                </span>
                <span>{label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------- Brand icons (inline SVG) ------------------------- */

function WhatsAppIcon({ size = 12 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.5 14.4c-.3-.1-1.7-.8-1.9-.9-.3-.1-.5-.1-.7.1-.2.3-.8.9-1 1.1-.2.2-.4.2-.6.1-.3-.1-1.2-.4-2.2-1.3-.8-.7-1.4-1.6-1.5-1.9-.2-.3 0-.4.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5-.1-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5H8c-.2 0-.5.1-.8.4-.3.3-1.1 1-1.1 2.5s1.1 2.9 1.3 3.1c.2.2 2.2 3.4 5.3 4.6.7.3 1.3.5 1.8.6.8.2 1.5.2 2 .1.6-.1 1.7-.7 2-1.4.3-.7.3-1.2.2-1.4-.1-.1-.3-.2-.6-.3zM12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.3 5L2 22l5.2-1.4c1.5.8 3.1 1.2 4.8 1.2 5.5 0 10-4.5 10-10S17.5 2 12 2z"/>
    </svg>
  );
}
function XIcon({ size = 12 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}
function LinkedInIcon({ size = 12 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.05-1.86-3.05-1.86 0-2.15 1.45-2.15 2.95v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.63-1.86 3.36-1.86 3.59 0 4.25 2.36 4.25 5.42v6.33zM5.34 7.43a2.06 2.06 0 1 1 0-4.11 2.06 2.06 0 0 1 0 4.11zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .78 0 1.74v20.51C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.75V1.74C24 .78 23.2 0 22.22 0z"/>
    </svg>
  );
}
function FacebookIcon({ size = 12 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z"/>
    </svg>
  );
}
