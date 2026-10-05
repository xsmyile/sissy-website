import type { ReactElement } from "react";
import { headerSubtitle } from "../format";
import type { HeaderReading } from "../types";
import { Calendar, CupAndHeatWaves, Gearshape } from "./Glyph";
import { Cat } from "./Sprite";

/**
 * The Overview's header: Sissy, when the reading landed, and the app's own
 * switches. The period is the calendar, one control for every tab that reads
 * a window, and drawn disabled on a tab that reads the moment rather than
 * hidden, so the header does not move under the pointer between tabs.
 */
export function PanelHeader({
  reading,
  readsPeriod,
}: {
  reading: HeaderReading;
  readsPeriod: boolean;
}): ReactElement {
  const held = reading.awake !== null;
  return (
    <div className="panel-header">
      <Cat className="panel-cat" />
      <div>
        <div className="panel-title">Sissy</div>
        <div className="panel-subtitle">{headerSubtitle(reading)}</div>
      </div>
      <div className="panel-controls">
        <span className="panel-glass panel-glass-quiet" data-disabled={!readsPeriod || undefined}>
          <Calendar />
        </span>
        <span className={held ? "panel-glass panel-glass-held" : "panel-glass panel-glass-quiet"}>
          <CupAndHeatWaves />
        </span>
        <span className="panel-glass">
          <Gearshape />
        </span>
      </div>
    </div>
  );
}
