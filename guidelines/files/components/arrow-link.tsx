// SecondLane · Arrow link · guidelines v0.1 (8 Nov)
// A quiet link to a related page. The label names the destination ("Read all insights").
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { cx } from "./cx";

export type ArrowLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  size?: "md" | "sm";
  children: ReactNode;
};

export function ArrowLink({ size = "md", className, children, ...rest }: ArrowLinkProps) {
  return (
    <a
      className={cx(
        "group inline-flex items-center whitespace-nowrap py-3 font-sans font-medium text-fg",
        "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-focus",
        size === "md" ? "gap-2.5 text-[17px] leading-[1.2]" : "gap-2 text-[15px]",
        className,
      )}
      {...rest}
    >
      {children}
      <svg
        aria-hidden="true"
        viewBox="0 0 16 16"
        className={cx(
          "shrink-0 fill-none stroke-arrow stroke-[1.5] transition-transform duration-180 group-hover:translate-x-1 motion-reduce:transition-none",
          size === "md" ? "size-4" : "size-3.5",
        )}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2 8h12M9 3l5 5-5 5" />
      </svg>
    </a>
  );
}
