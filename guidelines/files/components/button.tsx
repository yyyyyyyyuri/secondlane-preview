// SecondLane · Button · guidelines v0.1 (8 Nov)
// Primary (yellow), outline and solid variants in two sizes. Hover is a 4px glow ring, never a lighter or darker shade. Renders <a> when given href, otherwise <button>.
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cx } from "./cx";

type Variant = "primary" | "outline" | "solid";
type Size = "md" | "sm";

const base =
  "inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-sm border font-sans text-button " +
  "transition-[background-color,border-color,box-shadow,transform] duration-180 ease-out " +
  "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-focus " +
  "active:translate-y-px aria-disabled:pointer-events-none aria-disabled:opacity-40";

const variants: Record<Variant, string> = {
  primary:
    "border-accent bg-accent text-on-accent hover:shadow-[0_0_0_4px_var(--accent-glow)] active:shadow-none",
  outline: "border-border-strong bg-transparent text-fg hover:border-fg hover:bg-fg/8",
  solid: "border-action bg-action text-on-action hover:shadow-[0_0_0_4px_var(--action-glow)] active:shadow-none",
};

const sizes: Record<Size, string> = {
  md: "h-13 px-6.5",
  sm: "h-11.5 px-5.5 text-[15px]",
};

type Common = {
  variant?: Variant;
  size?: Size;
  /** Shows a spinner, locks the button and announces it as busy. Change the label to the ongoing verb ("Sending"). */
  loading?: boolean;
  /** Stretch to the container width (stacked buttons below 900px). */
  block?: boolean;
  children: ReactNode;
  className?: string;
};

export type ButtonProps =
  | (Common & { href: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children">)
  | (Common & { href?: undefined } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">);

function Spinner() {
  return (
    <span
      aria-hidden="true"
      className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent motion-reduce:animate-none"
    />
  );
}

export function Button(props: ButtonProps) {
  const { variant = "primary", size = "md", loading = false, block = false, children, className, ...rest } = props;
  const classes = cx(base, variants[variant], sizes[size], block && "w-full", className);
  const content = (
    <>
      {loading && <Spinner />}
      {children}
    </>
  );

  if (typeof rest.href === "string") {
    const { href, ...anchor } = rest as AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };
    return (
      <a href={href} className={classes} aria-busy={loading || undefined} {...anchor}>
        {content}
      </a>
    );
  }

  const { type = "button", disabled, ...button } = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button
      type={type}
      className={classes}
      aria-busy={loading || undefined}
      aria-disabled={disabled || loading || undefined}
      disabled={disabled}
      {...button}
    >
      {content}
    </button>
  );
}
