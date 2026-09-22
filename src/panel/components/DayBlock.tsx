import { type ReactElement, useState } from "react";
import type { DayStrip, ModelRow, ProviderId } from "../types";
import { DayBars } from "./DayBars";

interface DayBlockProps {
  today: string;
  models: ModelRow[];
  strip: DayStrip;
  tint: ProviderId;
  /** Whether the pointer drives the strip, which only the hero's panel lets it. */
  pointable: boolean;
}

/**
 * `PanelDayBlock`: today's figure, the days behind it for scale, and the
 * split by model of whichever of them the pointer is on.
 *
 * The pointed day is read by both the strip's header and the pills, so the
 * state sits above both. Today's figure never moves, and today's split is the
 * resting answer; a pointed day with no reading shows no pills at all.
 */
export function DayBlock({ today, models, strip, tint, pointable }: DayBlockProps): ReactElement {
  const [pointed, setPointed] = useState<string | null>(null);
  const shown =
    pointed === null ? models : (strip.days.find((day) => day.id === pointed)?.models ?? models);
  return (
    <div className="panel-section panel-day">
      <div className="panel-label">
        Today
        <span className="panel-label-end panel-figures">{today}</span>
      </div>
      <DayBars
        strip={strip}
        tint={tint}
        pointed={pointed}
        point={pointable ? setPointed : undefined}
      />
      {shown.length > 0 && (
        <div className="panel-pills">
          {shown.map((model) => (
            <ModelPill key={model.id} row={model} />
          ))}
        </div>
      )}
    </div>
  );
}

/** `ModelPill`: the model's name over its share of the day and what it cost. */
function ModelPill({ row }: { row: ModelRow }): ReactElement {
  return (
    <span className="panel-pill">
      <span className="panel-pill-name">{row.name}</span>
      <span className="panel-pill-reading">{row.reading}</span>
    </span>
  );
}
