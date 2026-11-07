// SecondLane · Card · guidelines v0.1
// One card style for verticals, insights and LP advantages. The title is the link; its hit area covers the card.
import type { ReactNode } from "react";
import { cx } from "./cx";

export type CardProps = {
  title: string;
  body?: ReactNode;
  /** Eyebrow-style meta at the bottom of the text: audience, "Report · 12 Nov 2026" … */
  meta?: string;
  image?: { src: string; alt?: string };
  /** Omit for the static "feature" variant (no link, no lift). */
  href?: string;
  className?: string;
};

export function Card({ title, body, meta, image, href, className }: CardProps) {
  const linked = typeof href === "string";
  return (
    <article
      className={cx(
        "relative flex flex-col gap-4.5 rounded-md border border-border-card bg-bg px-6.5 pt-7.5 pb-6.5 text-fg",
        linked && "card-lift has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-3 has-[a:focus-visible]:outline-focus",
        className,
      )}
    >
      <h3 className="text-h3">
        {linked ? (
          <a href={href} className="outline-none after:absolute after:inset-0 after:content-['']">
            {title}
          </a>
        ) : (
          title
        )}
      </h3>
      {body && <p className="text-[18px] leading-[1.45] text-fg-muted">{body}</p>}
      {meta && <span className="eyebrow">{meta}</span>}
      {image && (
        <div className="-mx-6.5 -mb-6.5 mt-auto aspect-[5/4] overflow-hidden rounded-b-[7px]">
          <img src={image.src} alt={image.alt ?? ""} loading="lazy" decoding="async" className="size-full object-cover" />
        </div>
      )}
    </article>
  );
}
