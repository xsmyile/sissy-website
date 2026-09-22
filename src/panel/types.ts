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
  projects: ProjectRow[];
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

export interface PanelSnapshot {
  header: HeaderReading;
  headline: Headline;
  usedToday: number;
  meteringProviders: number;
  gaugeRows: GaugeRow[];
  agents: AgentsLine;
  projects: ProjectRow[];
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
  | { kind: "stats" };
