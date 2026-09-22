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

export interface AgentProcess {
  id: string;
  provider: ProviderId;
  name: string;
  figures: string;
}

export interface ProviderCount {
  id: string;
  provider: ProviderId;
  name: string;
  figures: string;
}

/** `AgentsBlock`, as `PanelStats` draws it: the live half and the counted one. */
export interface StatsPage {
  /** `agentsReading`: when the count on screen was taken, under the page's title. */
  reading: string;
  live: {
    line: AgentsLine;
    samples: number[];
    peak: string;
    caption: string;
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
  };
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
 * `IdentityLine`: the Overview's one line about commit identity, drawn on
 * every frame. `repository` is the row the page opens on, set only when
 * exactly one repository is wrong.
 */
export interface IdentityLine {
  state: IdentityLineState;
  summary: string;
  repository: string | null;
}

export interface PanelSnapshot {
  header: HeaderReading;
  headline: Headline;
  usedToday: number;
  meteringProviders: number;
  gaugeRows: GaugeRow[];
  agents: AgentsLine;
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
  stats: StatsPage;
}

/**
 * Which surface the panel shows. Mirrors `UsagePanelView.Page`; the site adds
 * a case only when it draws that page.
 */
export type PanelPage =
  | { kind: "overview" }
  | { kind: "provider"; provider: ProviderId; account: string | null }
  | { kind: "effort"; provider: ProviderId; account: string | null }
  | { kind: "stats" }
  | { kind: "identities"; focus: string | null };
