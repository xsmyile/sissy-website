import type { ReactElement } from "react";
import type { BarTint } from "../types";

interface ShareBarProps {
  share: number;
  tint: BarTint;
  expected?: number;
}

const STUB = "var(--panel-bar-stub)";
const MARK_INSET = "calc(var(--panel-bar-gap) / 2)";

const percent = (fraction: number): string => `${(fraction * 100).toFixed(2)}%`;

export function ShareBar({ share, tint, expected }: ShareBarProps): ReactElement {
  const width = share > 0 ? `max(${STUB}, ${percent(share)})` : "0";
  return (
    <div className="panel-bar">
      <div className="panel-bar-fill" data-tint={tint} style={{ width }} />
      {expected !== undefined && (
        <div
          className="panel-bar-mark"
          data-pace={share <= expected ? "ahead" : "behind"}
          style={{ left: `clamp(${MARK_INSET}, ${percent(expected)}, calc(100% - ${MARK_INSET}))` }}
        />
      )}
    </div>
  );
}
