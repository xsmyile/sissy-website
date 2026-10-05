import type { ReactElement } from "react";
import type { BarTint, WindowRow } from "../types";
import { ShareBar } from "./ShareBar";

/**
 * `WindowRowView`: a window's label and reading, its bar with the pace mark,
 * and the caption under it. The binding window reads a step louder, in the
 * label's weight and colour, which is what says which one the row is about.
 */
export function WindowRowView({
  window,
  tint,
  binding,
}: {
  window: WindowRow;
  tint: BarTint;
  binding: boolean;
}): ReactElement {
  return (
    <div className="panel-window" data-binding={binding || undefined}>
      <div className="panel-line">
        <span className="panel-window-label">{window.label}</span>
        <span className="panel-window-reading">{window.reading}</span>
      </div>
      <ShareBar share={window.usedFraction} tint={tint} expected={window.expectedFraction} />
      <div className="panel-caption">{window.caption}</div>
    </div>
  );
}
