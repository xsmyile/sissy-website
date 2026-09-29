import type { ReactElement, ReactNode } from "react";

/**
 * `PanelGroup`: one block of a page, drawn as a platter, with an optional
 * label above it on the popover itself. The label and the rows share a left
 * edge, the gutter, whether they sit on the platter or off it.
 *
 * A fill and a hairline edge rather than glass, because the app keeps glass for
 * the controls and navigation that float above content.
 */
export function PanelGroup({
  label,
  className,
  children,
}: {
  label?: ReactNode;
  className?: string;
  children: ReactNode;
}): ReactElement {
  const platter = className === undefined ? "panel-platter" : `panel-platter ${className}`;
  return (
    <div className="panel-group">
      {label}
      <div className={platter}>{children}</div>
    </div>
  );
}

/** A page's platters, inset from the popover's edge and spaced apart. */
export function Platters({ children }: { children: ReactNode }): ReactElement {
  return <div className="panel-platters">{children}</div>;
}
