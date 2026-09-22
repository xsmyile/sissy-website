import "./panel.css";
import type { ReactElement, ReactNode } from "react";
import { ForgeSection } from "./components/ForgeSection";
import { Identity } from "./components/Identity";
import { ProjectsSection } from "./components/ProjectRow";
import { type OpenPage, OVERVIEW, pageIdentity } from "./page";
import { Identities, IdentitiesBlock } from "./pages/Identities";
import { Overview } from "./pages/Overview";
import { Provider } from "./pages/Provider";
import { Stats } from "./pages/Stats";
import type { AccountIdentity, PanelPage, PanelSnapshot } from "./types";

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
    case "identities":
      return <Identities rows={snapshot.identities} focus={page.focus} open={open} />;
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
    <Crop label={label}>
      <ProjectsSection label="By project · today" rows={snapshot.projects} />
    </Crop>
  );
}

/**
 * The Overview's contributions block on its own.
 *
 * Both connected accounts, because the block draws one row per connection and
 * the two are never summed: each vendor counts its own thing, so a total
 * across them would be a third number belonging to neither.
 */
export function ForgeCrop({
  snapshot,
  label,
}: {
  snapshot: PanelSnapshot;
  label: string;
}): ReactElement {
  return (
    <Crop label={label}>
      <ForgeSection rows={snapshot.forge} period={snapshot.headline.period} />
    </Crop>
  );
}

/**
 * The identities page's block on its own, unfolded, so the one repository
 * that disagrees is read against the ones that agree.
 */
export function IdentitiesCrop({
  snapshot,
  label,
}: {
  snapshot: PanelSnapshot;
  label: string;
}): ReactElement {
  return (
    <Crop label={label}>
      <IdentitiesBlock rows={snapshot.identities} focus={null} showsAll />
    </Crop>
  );
}

/**
 * One account's identity block on its own, which is where both the picker and
 * the switch live.
 *
 * It takes the identity rather than the snapshot, because the block only says
 * what it is for on an account the CLI is not signed in as, and picking that
 * one is the caller's business.
 */
export function IdentityCrop({
  identity,
  label,
}: {
  identity: AccountIdentity;
  label: string;
}): ReactElement {
  return (
    <Crop label={label}>
      <Identity identity={identity} />
    </Crop>
  );
}

/** One block of a page, drawn in the panel's own frame and never operable. */
function Crop({ label, children }: { label: string; children: ReactNode }): ReactElement {
  return (
    <div className="panel-wrap">
      <div className="panel" role="img" aria-label={label}>
        {children}
      </div>
    </div>
  );
}
