import type { ReactElement } from "react";
import { ChevronUpDown } from "../components/Glyph";
import { PageHeader } from "../components/PageHeader";
import { ProviderMark } from "../components/Sprite";
import { agentsRunning } from "../format";
import { BACK, type OpenPage, OVERVIEW } from "../page";
import type { StatsPage } from "../types";

const SPARKLINE_WIDTH = 100;
const SPARKLINE_HEIGHT = 26;

/**
 * `PanelStats`: how many agents have run, and what the ones running now are
 * holding. The live half first, then the counted one under its own window.
 */
export function Stats({ page, open }: { page: StatsPage; open?: OpenPage }): ReactElement {
  const { live, counted } = page;
  return (
    <>
      <PageHeader
        title="Agents"
        subtitle={page.reading}
        backLabel="Back to today"
        back={open && (() => open(OVERVIEW, BACK))}
      />
      <div className="panel-stats">
        <div className="panel-stats-block">
          <div className="panel-label">Now</div>
          <div className="panel-stats-live">
            <div className="panel-money">{agentsRunning(live.line)}</div>
            <div className="panel-sparkline-row">
              <Sparkline samples={live.samples} />
              <span className="panel-caption">{live.peak}</span>
            </div>
            <div className="panel-caption">{live.caption}</div>
            <div className="panel-stats-rows">
              {live.processes.map((process) => (
                <div className="panel-line" key={process.id}>
                  <ProviderMark provider={process.provider} />
                  <span className="panel-process">{process.name}</span>
                  <span className="panel-value">{process.figures}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="panel-divider" />
        <div className="panel-stats-block">
          <div className="panel-label">
            Sessions and agents
            <span className="panel-popup panel-popup-small panel-label-end">
              {counted.period}
              <ChevronUpDown />
            </span>
          </div>
          <div className="panel-figures-row">
            <Figure count={counted.sessions} singular="session" plural="sessions" />
            <Figure count={counted.agents} singular="agent" plural="agents" />
            <div className="panel-figure">
              <div className="panel-money">{counted.worked}</div>
              <div className="panel-caption">active</div>
            </div>
          </div>
          <div className="panel-activity">
            <div className="panel-activity-strip">
              {counted.blocks.map(([start, end]) => (
                <span
                  key={start}
                  className="panel-activity-block"
                  style={{ left: `${start * 100}%`, width: `${(end - start) * 100}%` }}
                />
              ))}
            </div>
            <div className="panel-caption">{counted.caption}</div>
          </div>
          <div className="panel-stats-rows">
            {counted.byProvider.map((row) => (
              <div className="panel-line" key={row.id}>
                <ProviderMark provider={row.provider} />
                <span className="panel-process">{row.name}</span>
                <span className="panel-value">{row.figures}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function Figure({ count, singular, plural }: { count: number; singular: string; plural: string }) {
  return (
    <div className="panel-figure">
      <div className="panel-money">{count}</div>
      <div className="panel-caption">{count === 1 ? singular : plural}</div>
    </div>
  );
}

/** The memory series as an unfilled line, scaled from zero. */
function Sparkline({ samples }: { samples: number[] }) {
  const peak = Math.max(...samples, Number.EPSILON);
  const step = samples.length > 1 ? SPARKLINE_WIDTH / (samples.length - 1) : 0;
  const points = samples
    .map((value, index) => {
      const x = (index * step).toFixed(2);
      const y = (SPARKLINE_HEIGHT * (1 - value / peak)).toFixed(2);
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg
      className="panel-sparkline"
      viewBox={`0 0 ${SPARKLINE_WIDTH} ${SPARKLINE_HEIGHT}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
