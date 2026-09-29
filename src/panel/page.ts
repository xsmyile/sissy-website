import type { PanelPage, PanelTab } from "./types";

export const OVERVIEW: PanelPage = { kind: "overview" };

/** The tab the panel opens on, which the app resets to on every showing. */
export const HOME_TAB: PanelTab = "usage";

/**
 * Opens a page from a control on the one showing, naming the control it came
 * from so the surface that owns the state can put focus back on it.
 *
 * A panel given one is operable; a panel without one is drawn and inert, which
 * is what every surface but the hero's wants.
 */
export type OpenPage = (page: PanelPage, from: string) => void;

/** Selects a tab from the tab bar, which leaves focus on the tab pressed. */
export type SelectTab = (tab: PanelTab) => void;

/** The control a page returns to, and the one Back is named after. */
export const BACK = "back";

/** The control a tab is pressed on, which is where focus stays once it is selected. */
export const tabTarget = (tab: PanelTab): string => `tab:${tab}`;

/**
 * One string per distinct page, so an account change re-keys the page like a
 * kind change does, and a tab change re-keys the Overview.
 */
export function pageIdentity(page: PanelPage, tab: PanelTab): string {
  switch (page.kind) {
    case "overview":
      return `${page.kind}:${tab}`;
    case "provider":
    case "effort":
      return `${page.kind}:${page.provider}:${page.account ?? ""}`;
    case "identities":
      return page.kind;
  }
}
