import type { ReactElement } from "react";
import { ChevronRight, ChevronUpDown } from "../components/Glyph";
import { PageHeader } from "../components/PageHeader";
import { ProviderMark } from "../components/Sprite";
import { agentsFolded, agentsRunning, cpuLoad } from "../format";
import { BACK, type OpenPage, OVERVIEW } from "../page";
import type { AgentProcess, MemoryChart, StatsPage } from "../types";

/** `PanelStats.busyLoad`: most of a core, where a row's load takes the one colour. */
const BUSY_LOAD = 0.8;
/** `AgentMemoryChart.bandOpacities`: the accent for each standing band, dearest first. */
const BAND_OPACITIES = [1, 0.78, 0.6, 0.45, 0.33, 0.24];
const REST_OPACITY = 0.2;
const PLOT_HEIGHT = 44;
const TICK_HEIGHT = 4;
const TICK_GAP = 2;
const CHART_HEIGHT = PLOT_HEIGHT + TICK_HEIGHT + TICK_GAP;
/** `CPULane`: 36 cells across 70 pt, each as deep as its mean load. */
const LANE_WIDTH = 70;
const LANE_HEIGHT = 9;
const LANE_CELLS = 36;
const LANE_FLOOR = 0.12;
const LANE_GAP = 0.5;
const LANE_CELL_INDICES = Array.from({ length: LANE_CELLS }, (_, cell) => cell);

/**
 * `PanelStats`: how many agents have run, and what the ones running now are
 * holding. The counted half leads under its own window, what the cache did
 * for that window follows it, and the live half comes last.
 */
export function Stats({ page, open }: { page: StatsPage; open?: OpenPage }): ReactElement {
  const { live, counted } = page;
  const underTheHood = counted.cache.share !== null || counted.longestTurn !== null;
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
            <Reading value={counted.worked} caption="active" />
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
        {underTheHood && (
          <>
            <div className="panel-divider" />
            <div className="panel-stats-block">
              <div className="panel-label">Under the hood</div>
              <div className="panel-figures-row">
                <Reading value={counted.cache.share} caption="of input from cache" />
                <Reading value={counted.longestTurn} caption="longest turn" />
              </div>
              {counted.cache.share !== null && (
                <div className="panel-caption">
                  {counted.cache.saved} saved by the cache at list price
                </div>
              )}
            </div>
          </>
        )}
        <div className="panel-divider" />
        <div className="panel-stats-block">
          <div className="panel-label">Now</div>
          <div className="panel-stats-live">
            <div className="panel-money">{agentsRunning(live.line)}</div>
            {live.chart && <Chart chart={live.chart} />}
            <div className="panel-caption">{live.caption}</div>
            {live.load && <div className="panel-caption">{live.load}</div>}
            <div className="panel-stats-rows">
              {live.processes.map((process, band) => (
                <ProcessRow key={process.id} process={process} band={band} />
              ))}
              {live.folded && (
                <div className="panel-disclosure">
                  <ChevronRight />
                  {agentsFolded(live.folded)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Figure({ count, singular, plural }: { count: number; singular: string; plural: string }) {
  return <Reading value={`${count}`} caption={count === 1 ? singular : plural} />;
}

/** `PanelStats.reading`: a figure over its caption, a dash where it has no reading. */
function Reading({ value, caption }: { value: string | null; caption: string }) {
  return (
    <div className="panel-figure">
      <div className="panel-money" data-empty={value === null ? true : undefined}>
        {value ?? "—"}
      </div>
      <div className="panel-caption">{caption}</div>
    </div>
  );
}

function ProcessRow({ process, band }: { process: AgentProcess; band: number }) {
  return (
    <div className="panel-line">
      <ProviderMark provider={process.provider} />
      <span className="panel-process">{process.name}</span>
      {process.lane.length > 0 && <Lane lane={process.lane} band={band} />}
      {process.cpuLoad !== null && (
        <span className="panel-value panel-load" data-busy={process.cpuLoad >= BUSY_LOAD}>
          {cpuLoad(process.cpuLoad)} ·
        </span>
      )}
      <span className="panel-value">{process.figures}</span>
    </div>
  );
}

const bandOpacity = (band: number | null): number =>
  band === null ? REST_OPACITY : (BAND_OPACITIES[band] ?? REST_OPACITY);

/**
 * `AgentMemoryChart`: the retained hour, split by agent and stacked from the
 * axis in the list's order, scaled from zero, with a tick under each sample
 * where a standing agent started.
 */
function Chart({ chart }: { chart: MemoryChart }) {
  const count = chart.bands[0]?.values.length ?? 0;
  const edges: number[][] = [new Array<number>(count).fill(0)];
  for (const band of chart.bands) {
    const floor = edges[edges.length - 1] ?? [];
    edges.push(floor.map((value, index) => value + (band.values[index] ?? 0)));
  }
  const peak = Math.max(...(edges[edges.length - 1] ?? []), 1);
  const y = (value: number): string => (PLOT_HEIGHT * (1 - value / peak)).toFixed(2);
  const areas = chart.bands.map((band, position) => {
    const upper = (edges[position + 1] ?? []).map((value, index) => `${index},${y(value)}`);
    const lower = (edges[position] ?? []).map((value, index) => `${index},${y(value)}`);
    const rest = band.process === null;
    return (
      <polygon
        key={band.process ?? "rest"}
        points={[...upper, ...lower.reverse()].join(" ")}
        data-rest={rest || undefined}
        fillOpacity={bandOpacity(rest ? null : position)}
      />
    );
  });
  return (
    <div className="panel-chart">
      <svg
        className="panel-chart-plot"
        viewBox={`0 0 ${Math.max(count - 1, 1)} ${CHART_HEIGHT}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {areas}
        {chart.starts.map((start) => (
          <line
            key={start}
            className="panel-chart-tick"
            x1={start}
            x2={start}
            y1={PLOT_HEIGHT + TICK_GAP}
            y2={CHART_HEIGHT}
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
      <div className="panel-chart-axis">
        <span>{chart.span}</span>
        <span>peak {chart.peak}</span>
      </div>
    </div>
  );
}

/** `CPULane`: one agent's hour as cells whose depth is its load, none before it started. */
function Lane({ lane, band }: { lane: (number | null)[]; band: number }) {
  const cellWidth = LANE_WIDTH / LANE_CELLS;
  const cells = LANE_CELL_INDICES.map((cell) => {
    const from = Math.floor((cell * lane.length) / LANE_CELLS);
    const to = Math.max(Math.floor(((cell + 1) * lane.length) / LANE_CELLS), from + 1);
    const readings = lane.slice(from, to).filter((load): load is number => load !== null);
    if (readings.length === 0) return null;
    const load = readings.reduce((sum, value) => sum + value, 0) / readings.length;
    const depth = LANE_FLOOR + (1 - LANE_FLOOR) * Math.min(load, 1);
    return (
      <rect
        key={cell}
        x={cell * cellWidth}
        y={0}
        width={Math.max(cellWidth - LANE_GAP, LANE_GAP)}
        height={LANE_HEIGHT}
        fillOpacity={bandOpacity(band) * depth}
      />
    );
  });
  return (
    <svg className="panel-lane" viewBox={`0 0 ${LANE_WIDTH} ${LANE_HEIGHT}`} aria-hidden="true">
      {cells}
    </svg>
  );
}
