// SecondLane · Text field · guidelines v0.1 (8 Nov)
// Visible label, linen input on every theme, help or error text wired up for screen readers.
import { useId, type InputHTMLAttributes } from "react";
import { cx } from "./cx";

export type FieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "className"> & {
  label: string;
  hint?: string;
  /** Error message. When set, the field shows its error state and the message replaces the hint. */
  error?: string;
  className?: string;
};

export function Field({ label, hint, error, id, className, ...input }: FieldProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const noteId = `${inputId}-note`;
  const note = error ?? hint;
  return (
    <div className={cx("flex w-full max-w-[360px] flex-col gap-2", className)}>
      <label htmlFor={inputId} className="font-sans text-label uppercase text-fg-muted">
        {label}
      </label>
      <input
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={note ? noteId : undefined}
        className={cx(
          "h-13 w-full rounded-sm border bg-field-bg px-4 font-sans text-[17px] text-green outline-none",
          "transition-[border-color,box-shadow] duration-150 placeholder:text-moss",
          "hover:border-green focus:border-focus-field focus:shadow-[0_0_0_4px_var(--focus-ring)]",
          "disabled:opacity-50",
          error ? "border-danger-border" : "border-field-border",
        )}
        {...input}
      />
      {note && (
        <p id={noteId} className={cx("text-caption", error ? "text-danger" : "text-fg-muted")}>
          {note}
        </p>
      )}
    </div>
  );
}
