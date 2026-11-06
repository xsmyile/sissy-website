import { type ReactElement, useId } from "react";
import { ArrowRight01 } from "../components/Glyph";
import { PanelGroup, Platters } from "../components/PanelGroup";
import { ProjectsSection } from "../components/ProjectRow";
import { Row } from "../components/Row";
import { ShareBar } from "../components/ShareBar";
import { ProviderMark } from "../components/Sprite";
import { accountsCaption, gaugeReading, gaugeTitle, headlineMeta, providersLabel } from "../format";
import type { OpenPage } from "../page";
import type { GaugeRow, PanelSnapshot, ProviderId } from "../types";

interface OverviewProps {
  snapshot: PanelSnapshot;
  open?: OpenPage;
}

/** `PanelOverview.legendHelp`, which is how a live row names itself. */
const legendHelp = (row: GaugeRow): string => `Open ${gaugeTitle(row)}`;

/** `PanelOverview.VendorGroup`: one vendor's rows, in the order the snapshot lists them. */
interface VendorGroup {
  provider: ProviderId;
  rows: GaugeRow[];
}

/** `PanelOverview.vendorGroups`, so a vendor with several accounts is named once. */
function vendorGroups(rows: GaugeRow[]): VendorGroup[] {
  const groups: VendorGroup[] = [];
  for (const row of rows) {
    const group = groups.find((entry) => entry.provider === row.provider);
    if (group === undefined) groups.push({ provider: row.provider, rows: [row] });
    else group.rows.push(row);
  }
  return groups;
}

/**
 * `PanelOverview`, the Usage tab: what the period costs, whether there is room
 * to keep working, and where the day went, each on a platter of its own. The
 * app draws the identity line here only while no forge is connected, and the
 * fixture has two, so the line is the Forge tab's.
 *
 * The period is the `Today` preset, so the headline draws neither the way back
 * to today nor the strip of days a longer window puts under the figure, and the
 * providers keep their gauges rather than the spend a window of past days shows.
 */
export function Overview({ snapshot, open }: OverviewProps): ReactElement {
  const { headline, gaugeRows, projects, projectCount } = snapshot;
  const ids = useId();
  const readingId = (id: string): string => `${ids}${id}`;
  const gauge = (row: GaugeRow, grouped: boolean): ReactElement => (
    <Row
      key={row.id}
      className="panel-row panel-gauge"
      target={row.id}
      title={legendHelp(row)}
      label={legendHelp(row)}
      describedBy={readingId(row.id)}
      press={
        open &&
        (() => open({ kind: "provider", provider: row.provider, account: row.account }, row.id))
      }
    >
      <div className="panel-line">
        {!grouped && <ProviderMark provider={row.provider} />}
        <span className="panel-name">{grouped ? (row.qualifier ?? row.name) : row.name}</span>
        {grouped && row.plan !== null && <span className="panel-badge">{row.plan}</span>}
        <span className="panel-value" id={open && readingId(row.id)}>
          {gaugeReading(row)}
        </span>
        <ArrowRight01 className="panel-chevron" />
      </div>
      <div className="panel-gauge-bar">
        <ShareBar share={row.usedFraction} tint={row.provider} expected={row.expectedFraction} />
        <div className="panel-gauge-reset">{row.resets}</div>
      </div>
    </Row>
  );
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
        {vendorGroups(gaugeRows).map((group) => {
          const [first] = group.rows;
          const grouped = group.rows.length > 1;
          return (
            <div className="panel-vendor" key={group.provider}>
              {grouped && first !== undefined && (
                <div className="panel-line">
                  <ProviderMark provider={group.provider} />
                  <span className="panel-vendor-name">{first.name}</span>
                  <span className="panel-value">{accountsCaption(first.accountCount)}</span>
                </div>
              )}
              {group.rows.map((row) => gauge(row, grouped))}
            </div>
          );
        })}
      </PanelGroup>
      {projects.length > 0 && (
        <ProjectsSection label="By project · today" rows={projects} count={projectCount} />
      )}
    </Platters>
  );
}
