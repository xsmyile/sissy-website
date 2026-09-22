/**
 * The few sentences the panel composes from its readings.
 *
 * Mirrors the corresponding functions in `UsageFormat`
 * (`app/Sissy/Panel/UsageFormat.swift`); each one is named after the Swift
 * function it copies.
 */

import type { AgentsLine, ForgeHost, GaugeRow, HeaderReading, Period } from "./types";

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
  const noun = line.running === 1 ? "agent" : "agents";
  return `${line.running} ${noun}${SEPARATOR}${line.footprint}`;
}

export function projectsCount(count: number): string {
  return count === 1 ? "1 project" : `${count} projects`;
}

export function projectFigures(tokens: string, cost: string): string {
  return `${tokens}${SEPARATOR}${cost}`;
}

export function headlineMeta(tokens: string, burn: string | null): string {
  return burn === null ? tokens : `${tokens}${SEPARATOR}${burn}`;
}

/** The name a forge answers to on a row and in a control. */
export function forgeName(host: ForgeHost): string {
  return host === "github" ? "GitHub" : "GitLab";
}

/**
 * The heading over the forge rows, naming the window they are over for the
 * reason the project section names its own day: the block under a control is
 * the one that has to say which choice it is answering.
 */
export function forgeSectionLabel(period: Period): string {
  const window = period === "All" ? "all time" : period.toLowerCase();
  return `Contributions${SEPARATOR}${window}`;
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
