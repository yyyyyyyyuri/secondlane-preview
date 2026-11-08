// SecondLane · Eyebrow · guidelines v0.1 (8 Nov)
// Small uppercase label above a title. Yellow on green, terracotta on linen (via --eyebrow).
import type { HTMLAttributes } from "react";
import { cx } from "./cx";

export function Eyebrow({ className, ...rest }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={cx("eyebrow block", className)} {...rest} />;
}
