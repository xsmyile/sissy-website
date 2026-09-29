import "./panel.css";
import type { ReactElement, ReactNode } from "react";
import { ForgeSection } from "./components/ForgeSection";
import { Identity } from "./components/Identity";
import { PanelGroup, Platters } from "./components/PanelGroup";
import { PanelHeader } from "./components/PanelHeader";
import { ProjectsSection } from "./components/ProjectRow";
import { TAB_TITLES, TabBar } from "./components/TabBar";
import { HOME_TAB, type OpenPage, OVERVIEW, pageIdentity, type SelectTab } from "./page";
import { Effort } from "./pages/Effort";
import { Forge } from "./pages/Forge";
import { Identities, IdentitiesBlock } from "./pages/Identities";
import { Mac } from "./pages/Mac";
import { Overview } from "./pages/Overview";
import { Provider, ProviderHeader, ProviderLimits } from "./pages/Provider";
import { Sessions } from "./pages/Sessions";
import type {
  AccountIdentity,
  PanelPage,
  PanelSnapshot,
  PanelTab,
  ProviderId,
  ProviderPage,
} from "./types";

interface PanelProps {
  snapshot: PanelSnapshot;
  page?: PanelPage;
  tab?: PanelTab;
  label?: string;
  open?: OpenPage;
  select?: SelectTab;
  /** The Sessions tab's fold, which a surface that enlarges the tab may draw open. */
  showsAllProcesses?: boolean;
}

/** `PanelTab.readsPeriod`: the Mac, the disk and the network read the moment. */
const READS_PERIOD: ReadonlySet<PanelTab> = new Set(["usage", "sessions", "forge"]);

function providerPage(
  page: { provider: ProviderId; account: string | null },
  snapshot: PanelSnapshot,
): ProviderPage {
  const found = snapshot.providerPages.find(
    (entry) => entry.provider === page.provider && entry.account === page.account,
  );
  if (found === undefined) {
    throw new Error(`The fixture has no page for "${page.provider}:${page.account ?? ""}"`);
  }
  return found;
}

/** `UsagePanelView.homeHelp`: the way back names the tab it returns to. */
function homeHelp(tab: PanelTab): string {
  return tab === HOME_TAB ? "Back to today" : `Back to ${TAB_TITLES[tab]}`;
}

/** `UsagePanelView.home`: the selected tab's own page. */
function home(
  tab: PanelTab,
  snapshot: PanelSnapshot,
  showsAllProcesses: boolean,
  open?: OpenPage,
): ReactElement {
  switch (tab) {
    case "usage":
      return <Overview snapshot={snapshot} open={open} />;
    case "sessions":
      return <Sessions block={snapshot.sessions} showsAllProcesses={showsAllProcesses} />;
    case "mac":
      return <Mac block={snapshot.mac} />;
    case "forge":
      return <Forge snapshot={snapshot} open={open} />;
    case "disk":
    case "network":
      throw new Error(`The replica draws no page for the "${tab}" tab`);
  }
}

function renderPage(
  page: PanelPage,
  tab: PanelTab,
  snapshot: PanelSnapshot,
  showsAllProcesses: boolean,
  open?: OpenPage,
) {
  switch (page.kind) {
    case "overview":
      return home(tab, snapshot, showsAllProcesses, open);
    case "provider":
      return <Provider page={providerPage(page, snapshot)} header={snapshot.header} open={open} />;
    case "effort": {
      const found = providerPage(page, snapshot);
      const reading = found.effort;
      if (reading === null || reading.rows === null) {
        throw new Error(`The fixture's "${pageIdentity(page, tab)}" has no effort page to open`);
      }
      return <Effort page={found} reading={{ ...reading, rows: reading.rows }} open={open} />;
    }
    case "identities":
      return (
        <Identities
          rows={snapshot.identities}
          focus={page.focus}
          reading={snapshot.identitiesReading}
          backLabel={homeHelp(tab)}
          open={open}
        />
      );
  }
}

/**
 * The popover itself. Given `open` it is operable, with the routes the app has
 * and nothing else; without one it is a drawing of the same state, which is
 * what every surface below the hero wants. `tab` is which module the Overview
 * shows, kept beside the page as the app keeps it, so a page one level in
 * returns to the tab it was opened from.
 *
 * The header and the tab bar stand outside the keyed page, because they stay
 * put while a tab changes under them and the selection slides between tabs.
 */
export function Panel({
  snapshot,
  page = OVERVIEW,
  tab = HOME_TAB,
  label = "Sissy's panel",
  open,
  select,
  showsAllProcesses = false,
}: PanelProps): ReactElement {
  const body = (
    <>
      {page.kind === "overview" && (
        <div className="panel-header-block">
          <PanelHeader reading={snapshot.header} readsPeriod={READS_PERIOD.has(tab)} />
          <TabBar tabs={snapshot.tabs} selected={tab} select={select} />
        </div>
      )}
      <div className="panel-page" key={pageIdentity(page, tab)}>
        {renderPage(page, tab, snapshot, showsAllProcesses, open)}
      </div>
    </>
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

/**
 * The top of one account's page: whose page it is, and the limits under it,
 * with Codex's resets where the account has them. The header stays because
 * it is what says which vendor the windows belong to.
 */
export function LimitsCrop({
  snapshot,
  provider,
  account,
  label,
}: {
  snapshot: PanelSnapshot;
  provider: ProviderId;
  account: string | null;
  label: string;
}): ReactElement {
  const page = providerPage({ provider, account }, snapshot);
  return (
    <Crop label={label}>
      <ProviderHeader page={page} header={snapshot.header} />
      <Platters>
        <ProviderLimits page={page} />
      </Platters>
    </Crop>
  );
}

/** The Usage tab's projects block on its own, for a surface that enlarges it. */
export function ProjectsCrop({
  snapshot,
  label,
}: {
  snapshot: PanelSnapshot;
  label: string;
}): ReactElement {
  return (
    <Crop label={label}>
      <Platters>
        <ProjectsSection
          label="By project · today"
          rows={snapshot.projects}
          count={snapshot.projectCount}
        />
      </Platters>
    </Crop>
  );
}

/**
 * The Forge tab's contributions block on its own.
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
      <Platters>
        <ForgeSection rows={snapshot.forge} period={snapshot.headline.period} />
      </Platters>
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
      <Platters>
        <IdentitiesBlock rows={snapshot.identities} focus={null} showsAll />
      </Platters>
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
      <Platters>
        <PanelGroup>
          <Identity identity={identity} />
        </PanelGroup>
      </Platters>
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
