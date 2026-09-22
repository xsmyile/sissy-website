import type { ReactElement } from "react";
import type { DayStrip, ProviderId } from "../types";

/**
 * `PanelDayBars`: what the last few days cost, one bar each, with a dot on
 * the baseline for a day Sissy was not running. Geometry from
 * `DayBarGeometry`: a 52 pt plot, a bar 62% of its slot, today at 45%.
 */
export function DayBars({ strip, tint }: { strip: DayStrip; tint: ProviderId }): ReactElement {
  return (
    <div className="panel-daybars">
      <div className="panel-daybars-head">
        <span>{strip.label}</span>
        <span>{strip.total}</span>
      </div>
      <div className="panel-daybars-plot">
        {strip.days.map((day) => (
          <div className="panel-day-column" key={day.id} data-today={day.isToday || undefined}>
            <div className="panel-day-slot">
              {day.fraction === null ? (
                <span className="panel-day-absent" />
              ) : (
                <span
                  className="panel-day-bar"
                  data-tint={tint}
                  style={{ height: `${(day.fraction * 100).toFixed(1)}%` }}
                />
              )}
            </div>
            <span className="panel-day-label">{day.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
