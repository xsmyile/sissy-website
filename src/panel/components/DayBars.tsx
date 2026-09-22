import type { ReactElement } from "react";
import type { DayStrip, ProviderId } from "../types";

interface DayBarsProps {
  strip: DayStrip;
  tint: ProviderId;
  pointed: string | null;
  /** Given only on the operable panel; an inert one draws the resting strip. */
  point?: (day: string | null) => void;
}

/**
 * `PanelDayBars`: what the last few days cost, one bar each, with a dot on
 * the baseline for a day Sissy was not running. Geometry from
 * `DayBarGeometry`: a 52 pt plot, a bar 62% of its slot, today at 45%.
 *
 * The strip carries no axis, so the header is where a value is read: the
 * pointed day's title and figures replace the window's while the pointer is on
 * its slot, and that day's label comes forward to pair the two.
 */
export function DayBars({ strip, tint, pointed, point }: DayBarsProps): ReactElement {
  const shown = strip.days.find((day) => day.id === pointed);
  return (
    <div className="panel-daybars">
      <div className="panel-daybars-head">
        <span>{shown?.title ?? strip.label}</span>
        <span>{shown?.figures ?? strip.total}</span>
      </div>
      <div className="panel-daybars-plot" onPointerLeave={point && (() => point(null))}>
        {strip.days.map((day) => (
          <div
            className="panel-day-column"
            key={day.id}
            data-today={day.isToday || undefined}
            data-pointed={day.id === pointed || undefined}
            onPointerEnter={point && (() => point(day.id))}
          >
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
