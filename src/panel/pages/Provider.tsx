import type { ReactElement } from "react";
import { DayBars } from "../components/DayBars";
import { ChevronRight } from "../components/Glyph";
import { Identity } from "../components/Identity";
import { PageHeader } from "../components/PageHeader";
import { ProjectsSection } from "../components/ProjectRow";
import { ShareBar } from "../components/ShareBar";
import { BACK, type OpenPage, OVERVIEW } from "../page";
import type { HeaderReading, ProviderPage } from "../types";

interface ProviderProps {
  page: ProviderPage;
  header: HeaderReading;
  open?: OpenPage;
}

/**
 * `PanelProviderPage`: what one account is doing. Identity, the limits it is
 * closest to, its day against the week behind it, its own projects, and the
 * vendor's own status line at the foot.
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
      <div className="panel-section panel-day">
        <div className="panel-label">
          Today
          <span className="panel-label-end panel-figures">{page.today}</span>
        </div>
        <DayBars strip={page.strip} tint={page.provider} />
      </div>
      {page.projects.length > 0 && (
        <>
          <div className="panel-divider" />
          <ProjectsSection label="By project" rows={page.projects} />
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
