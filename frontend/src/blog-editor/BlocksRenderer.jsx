import BlockView from "./BlockView";

/**
 * BlocksRenderer — pure read-only render of a blocks array.
 * Used by the public /blog/:slug page.
 */
export default function BlocksRenderer({ blocks = [] }) {
  return (
    <div className="blog-render space-y-5">
      {blocks.map((b) => (
        <div key={b.id || Math.random()}>
          <BlockView block={b} editable={false} />
        </div>
      ))}
    </div>
  );
}
