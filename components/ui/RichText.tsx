/**
 * Copy written in the admin's rich text editor.
 *
 * Two kinds of value arrive here. Anything written since the editor
 * landed is HTML. Everything written before it is plain text, sometimes
 * carrying newlines that were meant as paragraph breaks — the
 * cancellation clauses do exactly that. Rendering plain text as HTML
 * would collapse those breaks, so each is rendered as what it is.
 *
 * Safety: the HTML is sanitised in rahgeer-be on the way in, against an
 * allowlist of what the editor can produce (apps/common/richtext.py).
 * The admin API is the only path content takes into the database, so it
 * is cleaned once there rather than by every reader. Nothing here should
 * start rendering HTML from a source that does not pass through it.
 */

const HTML_TAG = /<[^>]+>/;

export function looksLikeHtml(value: string): boolean {
  return HTML_TAG.test(value);
}

export function RichText({
  value,
  className = "",
}: {
  value: string | null | undefined;
  className?: string;
}) {
  const text = value ?? "";
  if (!text.trim()) return null;

  if (!looksLikeHtml(text)) {
    // Plain text, newlines and all — exactly as it has always rendered.
    return <div className={`whitespace-pre-line ${className}`}>{text}</div>;
  }

  return (
    <div
      className={`rich-text ${className}`}
      dangerouslySetInnerHTML={{ __html: text }}
    />
  );
}
