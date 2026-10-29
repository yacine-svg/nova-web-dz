import type { ElementType } from "react";

/**
 * Heading split into masked words, so ScrollFX can make each word rise in and sink out.
 * Screen readers get the plain text through aria-label.
 */
export default function SplitTitle({
  text,
  as: Tag = "h2",
  className = "",
  id,
}: {
  text: string;
  as?: ElementType;
  className?: string;
  id?: string;
}) {
  const words = text.split(" ");
  return (
    <Tag className={className} id={id} aria-label={text} data-fx="title">
      {words.map((w, i) => (
        <span key={`${w}-${i}`} aria-hidden="true">
          <span className="sw">
            <span className="sw__i">{w}</span>
          </span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </Tag>
  );
}
