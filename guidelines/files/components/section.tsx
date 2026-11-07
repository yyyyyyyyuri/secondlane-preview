// SecondLane · Section and SectionHead · guidelines v0.1
// Every page is a stack of full-width sections. The theme sets every role token inside it.
import { useId, type HTMLAttributes, type ReactNode } from "react";
import { cx } from "./cx";
import { Eyebrow } from "./eyebrow";

export type Theme = "green" | "linen" | "white";

export type SectionProps = HTMLAttributes<HTMLElement> & {
  theme?: Theme;
  /** Remove the vertical padding (full-bleed bands, heroes). */
  flush?: boolean;
  children: ReactNode;
};

export function Section({ theme = "green", flush = false, className, children, ...rest }: SectionProps) {
  return (
    <section
      data-theme={theme}
      className={cx("scroll-mt-24 bg-bg text-fg", !flush && "py-section", className)}
      {...rest}
    >
      <div className="wrap">{children}</div>
    </section>
  );
}

export type SectionHeadProps = {
  eyebrow?: string;
  title: ReactNode;
  standfirst?: ReactNode;
  /** split: title left, standfirst right (default) · stacked · centred (Access, FAQs) */
  layout?: "split" | "stacked" | "centred";
  /** Optional link under the title, e.g. <ArrowLink>. */
  action?: ReactNode;
  /** Pass to <Section aria-labelledby> so the section is named by its title. */
  id?: string;
};

export function SectionHead({ eyebrow, title, standfirst, layout = "split", action, id }: SectionHeadProps) {
  const autoId = useId();
  const titleId = id ?? autoId;
  return (
    <header
      className={cx(
        "mb-10 grid gap-6 md:mb-18",
        layout === "split" && "md:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] md:items-end md:gap-18",
        layout === "centred" && "mx-auto max-w-[760px] text-center",
      )}
    >
      <div className="flex flex-col gap-3.5">
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <h2 id={titleId} className="text-h2">
          {title}
        </h2>
        {action && <div className="mt-4">{action}</div>}
      </div>
      {standfirst && <p className={cx("text-lead text-fg-lead max-w-[34em]", layout === "centred" && "mx-auto")}>{standfirst}</p>}
    </header>
  );
}
