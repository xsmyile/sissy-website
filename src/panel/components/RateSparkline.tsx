import type { ReactElement } from "react";
import type { RateSeries } from "../types";

/** `RateSparkline.plotHeight`, in points and so in the plot's own units. */
const PLOT_HEIGHT = 44;
/** Half of `lineWidth`, which keeps a line at the peak or at zero inside the plot. */
const LINE_INSET = 0.75;

/**
 * `RateSparkline`: two rates over the last two minutes as lines, the second
 * under the first, on a scale that never drops below `floor`, so a quiet link
 * stays flat instead of being stretched into noise. The app's hover is not
 * mirrored: the legend stays on the window's two ends.
 */
export function RateSparkline({
  rates,
  floor,
  label,
}: {
  rates: RateSeries;
  floor: number;
  label: string;
}): ReactElement {
  const span = Math.max(rates.first.length - 1, 1) * rates.interval;
  const peak = Math.max(...rates.first, ...rates.second, floor);
  const line = (values: number[]): string =>
    values
      .map((value, index) => {
        const x = index * rates.interval;
        const y = LINE_INSET + (PLOT_HEIGHT - 2 * LINE_INSET) * (1 - value / peak);
        return `${x},${y.toFixed(2)}`;
      })
      .join(" ");
  return (
    <div className="panel-sparkline" role="img" aria-label={label}>
      <svg
        className="panel-sparkline-plot"
        viewBox={`0 0 ${span} ${PLOT_HEIGHT}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <line
          className="panel-sparkline-baseline"
          x1={0}
          x2={span}
          y1={PLOT_HEIGHT}
          y2={PLOT_HEIGHT}
          vectorEffect="non-scaling-stroke"
        />
        <polyline
          className="panel-sparkline-second"
          points={line(rates.second)}
          vectorEffect="non-scaling-stroke"
        />
        <polyline
          className="panel-sparkline-first"
          points={line(rates.first)}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div className="panel-sparkline-axis" aria-hidden="true">
        <span>2 min ago</span>
        <span>now</span>
      </div>
    </div>
  );
}

/** A figure with the swatch of the line it reads, as the two above a sparkline are. */
export function RateFigure({
  text,
  series,
}: {
  text: string;
  series: "first" | "second";
}): ReactElement {
  return (
    <span className="panel-rate-figure">
      <span className="panel-rate-swatch" data-series={series} />
      {text}
    </span>
  );
}
