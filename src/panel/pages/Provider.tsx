import type { ReactElement } from "react";
import { DayBlock } from "../components/DayBlock";
import { ChevronRight } from "../components/Glyph";
import { Identity } from "../components/Identity";
import { PageHeader } from "../components/PageHeader";
import { ProjectsSection } from "../components/ProjectRow";
import { ShareBar } from "../components/ShareBar";
import { SEPARATOR } from "../format";
import { BACK, type OpenPage, OVERVIEW } from "../page";
import type { EffortReading, HeaderReading, ProviderPage } from "../types";

const EFFORT_HELP = "Show each model's split by effort";
const EFFORT_TARGET = "effort";

interface ProviderProps {
  page: ProviderPage;
  header: HeaderReading;
  open?: OpenPage;
}

/**
 * `PanelProviderPage`: what one account is doing. Identity, the limits it is
 * closest to, its day against the week behind it with the split by model
 * under it, its own projects, the week's effort in one row, and the vendor's
 * own status line at the foot. The credits bar is not drawn, because the
 * fixture's accounts hold no credits.
 */
export function Provider({ page, header, open }: ProviderProps): ReactElement {
  return (
    <>
      <PageHeader
        title={page.name}
        subtitle={`updated ${header.updated}`}
        provider={page.provider}
        backLabel="Back to today"
        back={open && (() => open(OVERVIEW, BACK))}
      />
      <Identity identity={page.identity} />
      <div className="panel-divider" />
      <div className="panel-section panel-limits">
        <div className="panel-label">
          Limits
          <span className="panel-caption panel-label-end">{page.limitsCaption}</span>
        </div>
        {page.windows.map((window) => (
          <div
            className="panel-window"
            key={window.id}
            data-binding={window.id === page.binding || undefined}
          >
            <div className="panel-line">
              <span className="panel-window-label">{window.label}</span>
              <span className="panel-window-reading">{window.reading}</span>
            </div>
            <ShareBar
              share={window.usedFraction}
              tint={page.provider}
              expected={window.expectedFraction}
            />
            <div className="panel-caption">{window.caption}</div>
          </div>
        ))}
      </div>
      <div className="panel-divider" />
      <DayBlock
        today={page.today}
        models={page.models}
        strip={page.strip}
        tint={page.provider}
        pointable={open !== undefined}
      />
      {page.projects.length > 0 && (
        <>
          <div className="panel-divider" />
          <ProjectsSection label="By project" rows={page.projects} count={page.projectCount} />
        </>
      )}
      {page.effort !== null && (
        <>
          <div className="panel-divider" />
          <EffortLine
            reading={page.effort}
            press={
              open &&
              (() =>
                open(
                  { kind: "effort", provider: page.provider, account: page.account },
                  EFFORT_TARGET,
                ))
            }
          />
        </>
      )}
      <div className="panel-divider" />
      <div className="panel-status">
        <span className="panel-status-dot" />
        <span className="panel-status-label">{page.status.label}</span>
        <span className="panel-caption">·</span>
        <span className="panel-caption">{page.status.checked}</span>
        <ChevronRight className="panel-chevron" />
      </div>
    </>
  );
}

/**
 * `PanelProviderPage.effort`: the week's leading effort and its share, under
 * the projects because it answers for the strip's week and not for the day
 * being pointed at. A door only where the page behind it has more to say; the
 * app gives the door a help string and nothing else, so its visible text is
 * its name.
 */
function EffortLine({
  reading,
  press,
}: {
  reading: EffortReading;
  press?: () => void;
}): ReactElement {
  const opens = reading.rows !== null;
  const content = (
    <>
      <span className="panel-label">By effort</span>
      <span className="panel-caption panel-label-end">{`${reading.lead}${SEPARATOR}${reading.window}`}</span>
      {opens && <ChevronRight className="panel-chevron" />}
    </>
  );
  if (!opens || press === undefined) {
    return <div className="panel-effort-line">{content}</div>;
  }
  return (
    <button
      type="button"
      className="panel-effort-line panel-live"
      data-target={EFFORT_TARGET}
      title={EFFORT_HELP}
      onClick={press}
    >
      {content}
    </button>
  );
}
