import type { ReactElement, ReactNode } from "react";

/**
 * A row the panel can open, or the same row drawn and inert.
 *
 * An inert row gets none of what a live one carries: no title, no pointer,
 * nothing focusable, because a chevron the app draws is not a promise the
 * site makes.
 *
 * A gauge row is named the way the app names it, with `legendHelp` as an
 * accessibility label, and keeps its reading as a description so the name does
 * not swallow the figures beside it. The identity line takes no label, because
 * the app gives it a help string and nothing else: its visible text is its
 * name, which is also what keeps the name and the label the same words.
 */
export function Row({
  className,
  target,
  title,
  label,
  describedBy,
  press,
  children,
}: {
  className: string;
  target: string;
  title: string;
  label?: string;
  describedBy?: string;
  press?: () => void;
  children: ReactNode;
}): ReactElement {
  if (press === undefined) {
    return <div className={className}>{children}</div>;
  }
  return (
    <button
      type="button"
      className={`${className} panel-live`}
      data-target={target}
      title={title}
      aria-label={label}
      aria-describedby={describedBy}
      onClick={press}
    >
      {children}
    </button>
  );
}
