import type { CSSProperties, ReactElement } from "react";
import { PageHeader } from "../components/PageHeader";
import { BACK, type OpenPage } from "../page";
import type { EffortRow, EffortSegment, ProviderPage } from "../types";

interface EffortProps {
  page: ProviderPage;
  rows: EffortRow[];
  open?: OpenPage;
}

/**
 * `PanelEffortPage`: at what effort one provider's week was worked, a bar per
 * model split by effort, dearest first, in the provider's tint, with the run
 * as its legend. Every bar is the full width, because each is all of its own
 * model's spend; what each model spent is written beside its name instead.
 *
 * Its header is `providerHeader` pointing back at the provider page, which
 * names no reading under the title.
 */
export function Effort({ page, rows, open }: EffortProps): ReactElement {
  return (
    <>
      <PageHeader
        title={page.name}
        provider={page.provider}
        backLabel={`Back to ${page.name}`}
        back={
          open &&
          (() => open({ kind: "provider", provider: page.provider, account: page.account }, BACK))
        }
      />
      <div className="panel-effort-head">
        <span className="panel-label">By effort</span>
        <span className="panel-caption panel-label-end">{page.effort?.window}</span>
      </div>
      <div className="panel-effort-models" data-tint={page.provider}>
        {rows.map((row) => (
          <EffortModel row={row} key={row.id} />
        ))}
      </div>
    </>
  );
}

function EffortModel({ row }: { row: EffortRow }): ReactElement {
  const half = Math.ceil(row.segments.length / 2);
  return (
    <div
      className="panel-effort-model"
      role="img"
      title={row.detail}
      aria-label={`${row.name} · ${row.detail}`}
    >
      <div className="panel-effort-name-line" aria-hidden="true">
        <span className="panel-effort-name">{row.name}</span>
        <span className="panel-caption">{row.total}</span>
      </div>
      <div className="panel-effort-bar" aria-hidden="true">
        {row.segments.map((segment, rank) => (
          <span
            className="panel-effort-segment"
            key={segment.id}
            data-unattributed={segment.effort === null || undefined}
            style={{ ...rankStyle(rank), "--share": segment.share } as CSSProperties}
          />
        ))}
      </div>
      <div className="panel-effort-legend" aria-hidden="true">
        <LegendLine segments={row.segments.slice(0, half)} from={0} />
        <LegendLine segments={row.segments.slice(half)} from={half} />
      </div>
    </div>
  );
}

/**
 * One half of the legend. The two halves share a line while they fit and the
 * second drops under the first when they do not, which is the `ViewThatFits`
 * the app splits at the same point.
 */
function LegendLine({ segments, from }: { segments: EffortSegment[]; from: number }): ReactElement {
  return (
    <span className="panel-effort-legend-line">
      {segments.map((segment, index) => (
        <span className="panel-effort-key" key={segment.id}>
          <span
            className="panel-effort-swatch"
            data-unattributed={segment.effort === null || undefined}
            style={rankStyle(from + index)}
          />
          <span className="panel-caption">{segment.label}</span>
        </span>
      ))}
    </span>
  );
}

/**
 * `PanelEffortPage.rankOpacity`: the tint's strength by rank rather than by
 * the effort's name, because the two vendors' ladders do not map onto one
 * another. The last strength repeats past four.
 */
const RANK_OPACITY = [1, 0.7, 0.45, 0.28];

function rankStyle(rank: number): CSSProperties {
  return {
    "--rank-opacity": RANK_OPACITY[Math.min(rank, RANK_OPACITY.length - 1)],
  } as CSSProperties;
}
