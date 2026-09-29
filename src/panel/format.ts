/**
 * The few sentences the panel composes from its readings.
 *
 * Mirrors the corresponding functions in `UsageFormat`
 * (`app/Sissy/Panel/UsageFormat.swift`); each one is named after the Swift
 * function it copies.
 */

import type { AgentsLine, ForgeHost, GaugeRow, HeaderReading, IdentityMark, Period } from "./types";

export const SEPARATOR = " · ";

export function headerSubtitle(reading: HeaderReading): string {
  const updated = `updated ${reading.updated}`;
  return reading.awake === null ? updated : `${updated}${SEPARATOR}awake ${reading.awake}`;
}

export function providersRecap(used: number, metering: number): string {
  return `${used} of ${metering} used today`;
}

export function providersLabel(used: number, metering: number): string {
  return `By provider${SEPARATOR}${providersRecap(used, metering)}`;
}

export function gaugeReading(row: GaugeRow): string {
  return `${row.window}${SEPARATOR}${Math.round(row.usedFraction * 100)}%`;
}

export function agentsRunning(line: AgentsLine): string {
  const noun = line.running === 1 ? "session" : "sessions";
  return `${line.running} ${noun}${SEPARATOR}${line.footprint}`;
}

/** The one row the running sessions fold behind. */
export const SESSIONS_DISCLOSURE = "By repository";

/** The counted half's label, naming the window its figures are over. */
export function sessionsSectionLabel(period: Period): string {
  return `Sessions and sub-agents${SEPARATOR}${periodHeading(period).toLowerCase()}`;
}

/** One session's CPU as a percentage of one core, which is why it can pass 100%. */
export function cpuLoad(cores: number): string {
  return `${Math.round(cores * 100)}%`;
}

export function projectsCount(count: number): string {
  return count === 1 ? "1 project" : `${count} projects`;
}

export function projectFigures(tokens: string, cost: string): string {
  return `${tokens}${SEPARATOR}${cost}`;
}

/** How a window is named where it heads a reading rather than sits in a picker. */
export function periodHeading(period: Period): string {
  return period === "All" ? "All time" : period;
}

/** `PanelOverview.subline`: the window always, then the tokens, then the pace on today. */
export function headlineMeta(period: Period, tokens: string, burn: string | null): string {
  const parts = [periodHeading(period), tokens];
  if (burn !== null) parts.push(burn);
  return parts.join(SEPARATOR);
}

/** The name a forge answers to on a row and in a control. */
export function forgeName(host: ForgeHost): string {
  return host === "github" ? "GitHub" : "GitLab";
}

/**
 * The heading over one forge's section: whose figures, and the window they are
 * over, for the reason the project section names its own day: the block under
 * a control is the one that has to say which choice it is answering. The
 * replica connects one account per vendor, so the vendor's name is always
 * enough and the host never has to stand in for it.
 */
export function forgeSectionLabel(host: ForgeHost, period: Period): string {
  return `${forgeName(host)}${SEPARATOR}${periodHeading(period).toLowerCase()}`;
}

/** What the mark beside the merge count means, in the vendor's own noun. */
export function forgeMergedHelp(host: ForgeHost): string {
  return host === "github"
    ? "Pull requests you opened and had merged"
    : "Merge requests you opened and had merged";
}

/** Opened, not open: a count of what happened inside the window the label names. */
export function forgeIssuesHelp(host: ForgeHost): string {
  return `Issues you opened on ${forgeName(host)}`;
}

/** Each vendor's own scope, because the two are not the same set. */
export function forgeCommentsHelp(host: ForgeHost): string {
  return host === "github"
    ? "Comments you wrote on issues and pull requests"
    : "Comments you wrote on issues and merge requests";
}

/** `identityFooter`: the count of what was read, on the page's label row. */
export function identityFooter(checked: number): string {
  return `${checked} ${checked === 1 ? "repository" : "repositories"} checked`;
}

/** `identityDisclosure`: the control that opens the rows the page did not need to show. */
export function identityDisclosure(all: number): string {
  return `Show all ${all}`;
}

/**
 * `identityVerdict`: the sentence the identities page leads with. "Every
 * repository" only when every one was judged and agrees, because one read and
 * not judged has no verdict to claim.
 */
export function identityVerdict(unexpected: number, unjudged: number): string {
  if (unexpected === 1) return "1 repository commits under an unexpected name.";
  if (unexpected > 1) return `${unexpected} repositories commit under an unexpected name.`;
  return unjudged === 0
    ? "Every repository commits under the name its forge expects."
    : "No repository commits under an unexpected name.";
}

/** `identityCount`: one of the recap's counts, beside the mark it counts. */
export function identityCount(mark: IdentityMark, count: number): string {
  return `${count} ${identityVerdictWord(mark)}`;
}

function identityVerdictWord(mark: IdentityMark): string {
  switch (mark) {
    case "unexpected":
      return "unexpected";
    case "agrees":
      return "as expected";
    case "unjudged":
      return "not judged";
  }
}
