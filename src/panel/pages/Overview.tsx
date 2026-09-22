import { type ReactElement, type ReactNode, useId } from "react";
import { ForgeSection } from "../components/ForgeSection";
import { ChevronRight, ChevronUpDown } from "../components/Glyph";
import { IdentityLineMark } from "../components/IdentityMark";
import { PanelHeader } from "../components/PanelHeader";
import { ProjectsSection } from "../components/ProjectRow";
import { ShareBar } from "../components/ShareBar";
import { ProviderMark } from "../components/Sprite";
import { agentsRunning, gaugeReading, headlineMeta, providersLabel } from "../format";
import type { OpenPage } from "../page";
import type { GaugeRow, PanelSnapshot } from "../types";

interface OverviewProps {
  snapshot: PanelSnapshot;
  open?: OpenPage;
}

/** `PanelOverview.legendHelp`, which is how a live row names itself. */
const legendHelp = (row: GaugeRow): string => `Open ${row.name}`;

const AGENTS_HELP = "How many sessions and agents have run, and what they are holding now";
const AGENTS_TARGET = "agents";
const IDENTITY_HELP = "Show every repository's commit identity";
const IDENTITY_TARGET = "identities";

export function Overview({ snapshot, open }: OverviewProps): ReactElement {
  const { header, headline, gaugeRows, agents, projects, identityLine, forge } = snapshot;
  const ids = useId();
  const readingId = (id: string): string => `${ids}${id}`;
  return (
    <>
      <PanelHeader reading={header} />
      <div className="panel-divider" />
      <div className="panel-headline">
        <div>
          <div className="panel-money">{headline.cost}</div>
          <div className="panel-meta">{headlineMeta(headline.tokens, headline.burn)}</div>
        </div>
        <span className="panel-popup">
          {headline.period}
          <ChevronUpDown />
        </span>
      </div>
      {gaugeRows.length > 0 && (
        <>
          <div className="panel-divider" />
          <div className="panel-section">
            <div className="panel-label">
              {providersLabel(snapshot.usedToday, snapshot.meteringProviders)}
            </div>
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
                    open(
                      { kind: "provider", provider: row.provider, account: row.account },
                      row.id,
                    ))
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
          </div>
        </>
      )}
      <div className="panel-divider" />
      <Row
        className="panel-agents"
        target={AGENTS_TARGET}
        title={AGENTS_HELP}
        press={open && (() => open({ kind: "stats" }, AGENTS_TARGET))}
      >
        <span>{agentsRunning(agents)}</span>
        <ChevronRight className="panel-chevron" />
      </Row>
      {projects.length > 0 && (
        <>
          <div className="panel-divider" />
          <ProjectsSection label="By project · today" rows={projects} />
        </>
      )}
      <div className="panel-divider" />
      <Row
        className="panel-agents panel-identity-line"
        target={IDENTITY_TARGET}
        title={IDENTITY_HELP}
        press={
          open &&
          (() => open({ kind: "identities", focus: identityLine.repository }, IDENTITY_TARGET))
        }
      >
        <IdentityLineMark state={identityLine.state} />
        <span className="panel-identity-summary" data-state={identityLine.state}>
          {identityLine.summary}
        </span>
        <ChevronRight className="panel-chevron" />
      </Row>
      {forge.length > 0 && (
        <>
          <div className="panel-divider" />
          <ForgeSection rows={forge} period={headline.period} />
        </>
      )}
    </>
  );
}

/**
 * A row the panel can open, or the same row drawn and inert.
 *
 * An inert row gets none of what a live one carries — no title, no pointer,
 * nothing focusable — because a chevron the app draws is not a promise the
 * site makes.
 *
 * A gauge row is named the way the app names it, with `legendHelp` as an
 * accessibility label, and keeps its reading as a description so the name does
 * not swallow the figures beside it. The agents and identity rows take no
 * label, because the app gives each a help string and nothing else: its
 * visible text is its name, which is also what keeps the name and the label
 * the same words.
 */
function Row({
  className,
  target,
  title,
  label,
  describedBy,
  press,
  children,
}: {
  className: string;
  target: string;
  title: string;
  label?: string;
  describedBy?: string;
  press?: () => void;
  children: ReactNode;
}): ReactElement {
  if (press === undefined) {
    return <div className={className}>{children}</div>;
  }
  return (
    <button
      type="button"
      className={`${className} panel-live`}
      data-target={target}
      title={title}
      aria-label={label}
      aria-describedby={describedBy}
      onClick={press}
    >
      {children}
    </button>
  );
}
