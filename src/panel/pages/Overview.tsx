import { type ReactElement, useId } from "react";
import { ChevronRight } from "../components/Glyph";
import { PanelGroup, Platters } from "../components/PanelGroup";
import { ProjectsSection } from "../components/ProjectRow";
import { Row } from "../components/Row";
import { ShareBar } from "../components/ShareBar";
import { ProviderMark } from "../components/Sprite";
import { gaugeReading, headlineMeta, providersLabel } from "../format";
import type { OpenPage } from "../page";
import type { GaugeRow, PanelSnapshot } from "../types";

interface OverviewProps {
  snapshot: PanelSnapshot;
  open?: OpenPage;
}

/** `PanelOverview.legendHelp`, which is how a live row names itself. */
const legendHelp = (row: GaugeRow): string => `Open ${row.name}`;

/**
 * `PanelOverview`, the Usage tab: what the period costs, whether there is room
 * to keep working, and where the day went, each on a platter of its own. The
 * app draws the identity line here only while no forge is connected, and the
 * fixture has two, so the line is the Forge tab's.
 */
export function Overview({ snapshot, open }: OverviewProps): ReactElement {
  const { headline, gaugeRows, projects, projectCount } = snapshot;
  const ids = useId();
  const readingId = (id: string): string => `${ids}${id}`;
  return (
    <Platters>
      <PanelGroup>
        <div className="panel-money">{headline.cost}</div>
        <div className="panel-meta">
          {headlineMeta(headline.period, headline.tokens, headline.burn)}
        </div>
      </PanelGroup>
      <PanelGroup
        className="panel-gauges"
        label={
          <div className="panel-label">
            <span className="panel-label-text">
              {providersLabel(snapshot.usedToday, snapshot.meteringProviders)}
            </span>
          </div>
        }
      >
        {gaugeRows.map((row) => (
          <Row
            key={row.id}
            className="panel-row panel-gauge"
            target={row.id}
            title={legendHelp(row)}
            label={legendHelp(row)}
            describedBy={readingId(row.id)}
            press={
              open &&
              (() =>
                open({ kind: "provider", provider: row.provider, account: row.account }, row.id))
            }
          >
            <div className="panel-line">
              <ProviderMark provider={row.provider} />
              <span className="panel-name">{row.name}</span>
              <span className="panel-value" id={open && readingId(row.id)}>
                {gaugeReading(row)}
              </span>
              <ChevronRight className="panel-chevron" />
            </div>
            <ShareBar
              share={row.usedFraction}
              tint={row.provider}
              expected={row.expectedFraction}
            />
          </Row>
        ))}
      </PanelGroup>
      {projects.length > 0 && (
        <ProjectsSection label="By project · today" rows={projects} count={projectCount} />
      )}
    </Platters>
  );
}
