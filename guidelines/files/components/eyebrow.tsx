// SecondLane · Eyebrow · guidelines v0.1
// Small uppercase label above a title. Yellow on green, rust on linen and white (via --eyebrow).
import type { HTMLAttributes } from "react";
import { cx } from "./cx";

export function Eyebrow({ className, ...rest }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={cx("eyebrow block", className)} {...rest} />;
}
