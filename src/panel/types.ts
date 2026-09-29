/**
 * The shape of what the panel replica draws.
 *
 * Mirrors `UsagePanelSnapshot` in the app repository
 * (`app/Sissy/Panel/UsagePanelSnapshot.swift`), field for field where the site
 * draws the field, and nothing the site does not draw. Display figures are
 * carried already formatted, the way `UsageFormat` would print them, because
 * the site never derives a number; the fractions a bar is drawn from stay
 * numeric because the bar's geometry needs them.
 *
 * When a page of the app changes, diff this file against the Swift one first.
 */

export type ProviderId = "claude-code" | "codex";

export type ForgeHost = "github" | "gitlab";

/**
 * `ForgeCounter`: the three figures beside a forge row's contribution total,
 * each of which `forgeCounters` can switch off. One switched off is not drawn
 * and, in the app, not fetched either.
 */
export type ForgeCounter = "merged" | "issues" | "comments";

export type BarTint = ProviderId | "share";

export type Period = "Today" | "7 days" | "30 days" | "All";

export interface HeaderReading {
  updated: string;
  awake: string | null;
}

export interface Headline {
  period: Period;
  cost: string;
  tokens: string;
  burn: string | null;
}

/** One rate-limit window as `WindowRow` carries it, with its pace worded. */
export interface WindowRow {
  id: string;
  label: string;
  reading: string;
  usedFraction: number;
  expectedFraction: number;
  caption: string;
}

export interface GaugeRow {
  id: string;
  provider: ProviderId;
  account: string | null;
  name: string;
  window: string;
  usedFraction: number;
  expectedFraction: number;
}

export interface AgentsLine {
  running: number;
  footprint: string;
}

export interface ProjectRow {
  id: string;
  owner: string | null;
  repo: string;
  forge: ForgeHost | null;
  tokens: string;
  cost: string;
  share: number;
}

/**
 * `AccountRow` and the plan, as the provider page's identity block prints them.
 *
 * The organisation and the plan share one line and either can be the only
 * thing on it: a personal account names no organisation, and an API-key user
 * is on no plan. The picker is governed separately, by how many accounts of
 * that vendor there are.
 */
export interface AccountIdentity {
  email: string;
  organization: string | null;
  plan: string;
  /** More than one account of this vendor, which is what draws the picker. */
  hasPicker: boolean;
  /**
   * `ClaudeAccount.isSignedIn`: the account the CLI is on, which is the one
   * whose future spend lands in the day beside it. It draws the `· in CLI`
   * badge, and only where there is more than one account to distinguish it
   * from.
   */
  inCLI: boolean;
  /**
   * `ClaudeAccount.isSwitchable`: Sissy holds a sign-in for this account and
   * the vendor lets it be written. It draws the `Use in CLI` button, which the
   * app shows only on an account the CLI is not already on, so the accident it
   * used to be is gone by construction rather than by dialog. Codex accounts
   * are read and never signed in with, so theirs is false.
   */
  switchable: boolean;
}

/**
 * `ModelRow`: one pill under the day strip, the model's name with its vendor
 * prefix and release date off, and its share of the day with what it cost.
 */
export interface ModelRow {
  id: string;
  name: string;
  reading: string;
}

/**
 * One bar of `DayStrip`; `fraction` is null on a day Sissy was not running.
 *
 * `title` and `figures` are what the strip's header swaps in while the pointer
 * is on the bar, and `models` what the pills under it swap to. A day with no
 * reading has no models, and the pills say nothing rather than keeping the
 * last day that had some.
 */
export interface DayBar {
  id: string;
  label: string;
  fraction: number | null;
  isToday: boolean;
  title: string;
  figures: string;
  models: ModelRow[];
}

export interface DayStrip {
  label: string;
  total: string;
  days: DayBar[];
}

export interface StatusLine {
  label: string;
  checked: string;
}

/**
 * `EffortSegment`: one effort's share of one model's spend over the window,
 * and the words the legend gives it. `effort` is null on spend whose lines
 * named no effort, which is drawn last and never in the provider's tint.
 */
export interface EffortSegment {
  id: string;
  effort: string | null;
  share: number;
  label: string;
}

/**
 * `EffortRow`: one model on the effort page, its segments dearest first.
 * `detail` is the hover and the accessibility label, what each effort cost and
 * how many turns it took.
 */
export interface EffortRow {
  id: string;
  name: string;
  total: string;
  detail: string;
  segments: EffortSegment[];
}

/**
 * The provider page's `By effort` row: `EffortSummary`'s lead over
 * `effortWindow`'s days, and the page it opens.
 *
 * `rows` is null where the row is not a door, which is when every model leads
 * on the provider's own leading effort by `effortWholeShare` or more: a page
 * of full bars would answer what the row already did.
 */
export interface EffortReading {
  lead: string;
  window: string;
  rows: EffortRow[] | null;
}

/**
 * `UsagePanelSnapshot.ResetsRow`: how many resets the account holds, the
 * vendor's name for the soonest and when it lapses, and whether a press would
 * spend one now. `usable` is false while OpenAI would apply none, which keeps
 * the count on the page and the button off it.
 */
export interface ResetsRow {
  headline: string;
  caption: string;
  usable: boolean;
}

/** `ProviderRow`, as `PanelProviderPage` draws it for one account. */
export interface ProviderPage {
  provider: ProviderId;
  account: string | null;
  name: string;
  identity: AccountIdentity;
  limitsCaption: string;
  windows: WindowRow[];
  /**
   * `UsagePanelSnapshot.binding`: the window this account is closest to
   * running out of, carried rather than worked out. The rule reads the
   * projected exhaustion of each window, which is not a figure this fixture
   * holds, so deriving it here could only ever approximate the app.
   */
  binding: string;
  /**
   * `ProviderRow.resets`: what the vendor lets this account spend to clear its
   * windows early. Null for every provider but Codex, and for an account
   * holding none, which draws no block at all.
   */
  resets: ResetsRow | null;
  today: string;
  /** Today's split by model, which the pills draw while the pointer is on no bar. */
  models: ModelRow[];
  strip: DayStrip;
  /** `ProviderRow.projects`: two repositories and the fold, past three. */
  projects: ProjectRow[];
  /** `ProviderRow.projectCount`: every project of the day, which the label counts. */
  projectCount: number;
  /** Null when the window named no effort, which draws no row at all. */
  effort: EffortReading | null;
  status: StatusLine;
}

/**
 * `AgentsBlock.Process`: one running session, as a row. `band` is its band on
 * the chart and the tint its lane takes, null for a session pooled into the
 * chart's grey rest.
 */
export interface AgentProcess {
  id: string;
  provider: ProviderId;
  name: string;
  band: number | null;
  /** Cores' worth of CPU since the sweep before, null on the sweep that first saw it. */
  cpuLoad: number | null;
  /** Its load at each sample of the chart, null where it was not running yet. */
  lane: (number | null)[];
  figures: string;
}

/** `MemoryChart.Band`: one standing row's memory, or the rest's where `process` is null. */
export interface MemoryBand {
  process: string | null;
  /** Megabytes at each sample, oldest first. */
  values: number[];
}

/**
 * `MemoryChart`: the retained hour, stacked by session, the dearest band at the
 * axis. `starts` are the samples where a standing session first appears after
 * the chart began; `span` and `peak` are the axis's two ends as printed.
 */
export interface MemoryChart {
  bands: MemoryBand[];
  starts: number[];
  span: string;
  peak: string;
}

/** `CacheReading`, as the page prints it; `share` is null for a window that sent nothing. */
export interface CacheReading {
  share: string | null;
  saved: string;
}

export interface ProviderCount {
  id: string;
  provider: ProviderId;
  name: string;
  figures: string;
}

/** `AgentsBlock`, as `PanelSessions` draws it: the counted half and the live one. */
export interface SessionsBlock {
  /** `agentsReading`: when the live half's sweep was taken, on its own label. */
  reading: string;
  live: {
    line: AgentsLine;
    /** Null until a second sample lands: one point is not a line. */
    chart: MemoryChart | null;
    caption: string;
    /** `UsageFormat.agentsLoad`, null for a reading with no counters. */
    load: string | null;
    /** Every running session, which the tab keeps behind one closed row. */
    processes: AgentProcess[];
  };
  counted: {
    period: Period;
    sessions: number;
    agents: number;
    worked: string;
    blocks: [number, number][];
    caption: string;
    byProvider: ProviderCount[];
    cache: CacheReading;
    /** `ActivityTotals.longestTurnMilliseconds` as `turnDuration` prints it. */
    longestTurn: string | null;
  };
}

/** `MacHealthLevel`: the kernel's word for memory, and the disk's grade against RAM. */
export type MacLevel = "normal" | "warn" | "critical";

/** `UsagePanelSnapshot.MacApp`: one app and what it holds, the agents left out. */
export interface MacApp {
  id: string;
  name: string;
  footprint: string;
}

/**
 * `UsagePanelSnapshot.MacBlock`, as `PanelMac` draws it. `caption` is the free
 * share and the sample's age as the headline's second line prints them.
 */
export interface MacBlock {
  memory: string;
  pressure: MacLevel | null;
  caption: string;
  swap: string;
  load: string;
  uptime: string;
  heaviest: MacApp[];
}

/**
 * One connected forge account, as `ForgeRowView` draws it: the contribution
 * total bare, the other three behind their own mark, and the age of the
 * reading under them.
 *
 * The two rows are never summed. Each vendor counts its own thing — GitHub its
 * contribution total, GitLab the events it recorded — so a total across them
 * would be a third number belonging to neither.
 */
export interface ForgeRow {
  id: string;
  host: ForgeHost;
  login: string;
  contributions: string;
  merged: string;
  issues: string;
  comments: string;
  /** `UsageFormat.forgeNotice`, which on a healthy row is how old the figures are. */
  notice: string;
}

/**
 * `IdentityMark`: a tick, a warning, or a dash for a repository that was read
 * and not judged, because an empty mark would be a verdict.
 */
export type IdentityMark = "agrees" | "unexpected" | "unjudged";

/**
 * `IdentityRow`: who would sign the next commit in one repository, and, on a
 * row that needs correcting, what its forge expects and where the wrong value
 * comes from. `fix` is the `git config --unset-all` command, present only
 * where the override is the repository's own.
 */
export interface IdentityRow {
  id: string;
  name: string;
  mark: IdentityMark;
  author: string;
  origin: string | null;
  expectation: string | null;
  fix: string | null;
}

/** `IdentityLineState`: nothing read is its own state, never an agreement. */
export type IdentityLineState = "unread" | "clean" | "findings";

/**
 * `IdentityLine`: the one line about commit identity, drawn on every frame, on
 * the Forge tab once a forge is connected. `repository` is the row the page opens on, set only when
 * exactly one repository is wrong.
 */
export interface IdentityLine {
  state: IdentityLineState;
  summary: string;
  repository: string | null;
}

/** `PanelTab`: a module with a page of its own, in the order the tab bar draws them. */
export type PanelTab = "usage" | "sessions" | "mac" | "disk" | "network" | "forge";

/**
 * `PanelTabBadge`: what a tab says about its page while another is open, as the
 * colour its symbol takes and the line its hover adds.
 */
export interface TabBadge {
  tint: "orange" | "red";
  reason: string;
}

/** One tab of `PanelTab.visible`, with the badge `PanelTab.badge` gives it. */
export interface TabEntry {
  tab: PanelTab;
  badge: TabBadge | null;
}

export interface PanelSnapshot {
  header: HeaderReading;
  headline: Headline;
  tabs: TabEntry[];
  usedToday: number;
  meteringProviders: number;
  gaugeRows: GaugeRow[];
  /**
   * `UsagePanelSnapshot.projects`: past three, the two busiest and one row
   * folding the rest, which names no owner and no forge.
   */
  projects: ProjectRow[];
  /** `UsagePanelSnapshot.projectCount`: every project of the day, folded ones included. */
  projectCount: number;
  /** Every repository read, the ones that disagree with their forge first. */
  identities: IdentityRow[];
  identityLine: IdentityLine;
  /** `identitiesReading`: when the repositories were last read, under the page's title. */
  identitiesReading: string;
  forge: ForgeRow[];
  providerPages: ProviderPage[];
  sessions: SessionsBlock;
  mac: MacBlock;
}

/**
 * Which surface the panel shows. Mirrors `UsagePanelView.Page`; the site adds
 * a case only when it draws that page. `overview` is the selected tab's own
 * page, and which tab that is lives beside the page rather than in it, as the
 * app keeps it, so the way back lands on the tab a page was opened from.
 */
export type PanelPage =
  | { kind: "overview" }
  | { kind: "provider"; provider: ProviderId; account: string | null }
  | { kind: "effort"; provider: ProviderId; account: string | null }
  | { kind: "identities"; focus: string | null };
