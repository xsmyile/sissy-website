import type { ReactElement } from "react";
import { headerSubtitle } from "../format";
import type { HeaderReading } from "../types";
import { CupAndSaucer, Gearshape } from "./Glyph";
import { Cat } from "./Sprite";

export function PanelHeader({ reading }: { reading: HeaderReading }): ReactElement {
  const held = reading.awake !== null;
  return (
    <div className="panel-header">
      <Cat className="panel-cat" />
      <div>
        <div className="panel-title">Sissy</div>
        <div className="panel-subtitle">{headerSubtitle(reading)}</div>
      </div>
      <div className="panel-controls">
        <span className={held ? "panel-glass panel-glass-held" : "panel-glass"}>
          <CupAndSaucer />
        </span>
        <span className="panel-glass">
          <Gearshape />
        </span>
      </div>
    </div>
  );
}
