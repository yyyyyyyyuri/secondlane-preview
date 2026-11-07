/** Joins class names, skipping falsy values. Swap for clsx + tailwind-merge if the project uses them. */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
