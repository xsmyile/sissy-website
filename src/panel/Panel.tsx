import "./panel.css";
import type { ReactElement } from "react";
import { ProjectsSection } from "./components/ProjectRow";
import { type OpenPage, OVERVIEW, pageIdentity } from "./page";
import { Overview } from "./pages/Overview";
import { Provider } from "./pages/Provider";
import { Stats } from "./pages/Stats";
import type { PanelPage, PanelSnapshot } from "./types";

interface PanelProps {
  snapshot: PanelSnapshot;
  page?: PanelPage;
  label?: string;
  open?: OpenPage;
}

function renderPage(page: PanelPage, snapshot: PanelSnapshot, open?: OpenPage) {
  switch (page.kind) {
    case "overview":
      return <Overview snapshot={snapshot} open={open} />;
    case "provider": {
      const found = snapshot.providerPages.find(
        (entry) => entry.provider === page.provider && entry.account === page.account,
      );
      if (found === undefined) {
        throw new Error(`The fixture has no page for "${pageIdentity(page)}"`);
      }
      return <Provider page={found} header={snapshot.header} open={open} />;
    }
    case "stats":
      return <Stats page={snapshot.stats} open={open} />;
  }
}

/**
 * The popover itself. Given `open` it is operable, with the routes the app has
 * and nothing else; without one it is a drawing of the same state, which is
 * what every surface below the hero wants.
 */
export function Panel({
  snapshot,
  page = OVERVIEW,
  label = "Sissy's panel",
  open,
}: PanelProps): ReactElement {
  const body = (
    <div className="panel-page" key={pageIdentity(page)}>
      {renderPage(page, snapshot, open)}
    </div>
  );
  return (
    <div className="panel-wrap">
      {open === undefined ? (
        <section className="panel" role="img" aria-label={label}>
          {body}
        </section>
      ) : (
        <section className="panel" aria-label={label}>
          {body}
        </section>
      )}
    </div>
  );
}

/** The Overview's projects block on its own, for a surface that enlarges it. */
export function ProjectsCrop({
  snapshot,
  label,
}: {
  snapshot: PanelSnapshot;
  label: string;
}): ReactElement {
  return (
    <div className="panel-wrap">
      <div className="panel" role="img" aria-label={label}>
        <ProjectsSection label="By project · today" rows={snapshot.projects} />
      </div>
    </div>
  );
}
