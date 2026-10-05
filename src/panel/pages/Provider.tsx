import type { ReactElement } from "react";
import { DayBlock } from "../components/DayBlock";
import { ChevronRight } from "../components/Glyph";
import { Identity } from "../components/Identity";
import { PageHeader } from "../components/PageHeader";
import { PanelGroup, Platters } from "../components/PanelGroup";
import { ProjectsSection } from "../components/ProjectRow";
import { WindowRowView } from "../components/WindowRow";
import { SEPARATOR } from "../format";
import { BACK, type OpenPage, OVERVIEW } from "../page";
import type { EffortReading, HeaderReading, ProviderPage, ResetsRow } from "../types";

const EFFORT_HELP = "Show each model's split by effort";
const RESETS_LABEL = "Resets";
const RESETS_USE = "Use…";
const RESETS_NOT_YET = "Ready once a window is nearly used up";
const EFFORT_TARGET = "effort";

interface ProviderProps {
  page: ProviderPage;
  header: HeaderReading;
  open?: OpenPage;
}

/**
 * `PanelProviderPage`: what one account is doing, a platter per question.
 * Identity; the limits it is closest to, with Codex's resets under the windows
 * they clear; its day against the week behind it with the split by model
 * under it; its own projects; and the two doors, the week's effort and the
 * vendor's own status line. The credits are not drawn, because the fixture's
 * accounts hold none.
 */
export function Provider({ page, header, open }: ProviderProps): ReactElement {
  return (
    <>
      <ProviderHeader page={page} header={header} back={open && (() => open(OVERVIEW, BACK))} />
      <Platters>
        <PanelGroup>
          <Identity identity={page.identity} />
        </PanelGroup>
        <ProviderLimits page={page} />
        <PanelGroup>
          <DayBlock
            today={page.today}
            models={page.models}
            strip={page.strip}
            tint={page.provider}
            pointable={open !== undefined}
          />
        </PanelGroup>
        {page.projects.length > 0 && (
          <ProjectsSection label="By project" rows={page.projects} count={page.projectCount} />
        )}
        <PanelGroup className="panel-doors">
          {page.effort !== null && (
            <>
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
              <div className="panel-divider" />
            </>
          )}
          <div className="panel-status">
            <span className="panel-status-dot" />
            <span className="panel-status-label">{page.status.label}</span>
            <span className="panel-caption">·</span>
            <span className="panel-caption">{page.status.checked}</span>
            <ChevronRight className="panel-chevron" />
          </div>
        </PanelGroup>
      </Platters>
    </>
  );
}

/** `providerHeader`: the way back, whose page this is, and when it was read. */
export function ProviderHeader({
  page,
  header,
  back,
}: {
  page: ProviderPage;
  header: HeaderReading;
  back?: () => void;
}): ReactElement {
  return (
    <PageHeader
      title={page.name}
      subtitle={`updated ${header.updated}`}
      provider={page.provider}
      backLabel="Back to today"
      back={back}
    />
  );
}

/**
 * `PanelProviderPage.capacityGroup`: each window with its bar, its pace mark
 * and its caption, and Codex's resets under the windows they clear, on one
 * platter.
 */
export function ProviderLimits({ page }: { page: ProviderPage }): ReactElement {
  return (
    <PanelGroup className="panel-capacity">
      <div className="panel-limits">
        <div className="panel-label">
          Limits
          <span className="panel-caption panel-label-end">{page.limitsCaption}</span>
        </div>
        {page.windows.map((window) => (
          <WindowRowView
            key={window.id}
            window={window}
            tint={page.provider}
            binding={window.id === page.binding}
          />
        ))}
      </div>
      {page.resets !== null && (
        <>
          <div className="panel-divider" />
          <Resets resets={page.resets} />
        </>
      )}
    </PanelGroup>
  );
}

/**
 * `PanelProviderPage.resets`: the count, the soonest reset's name and lapse,
 * and `Use…` while the vendor would apply one. The app's press only asks, in
 * the page itself; here the button is drawn and inert like `Copy the fix`,
 * because spending is not a route.
 */
function Resets({ resets }: { resets: ResetsRow }): ReactElement {
  return (
    <div className="panel-resets">
      <div className="panel-label">
        {RESETS_LABEL}
        <span className="panel-label-end panel-resets-headline">{resets.headline}</span>
      </div>
      <div className="panel-line">
        <span className="panel-caption panel-resets-caption">{resets.caption}</span>
        {resets.usable && <span className="panel-small-button">{RESETS_USE}</span>}
      </div>
      {!resets.usable && <div className="panel-resets-hint">{RESETS_NOT_YET}</div>}
    </div>
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
