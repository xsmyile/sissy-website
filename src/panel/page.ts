import type { PanelPage } from "./types";

export const OVERVIEW: PanelPage = { kind: "overview" };

/**
 * Opens a page from a control on the one showing, naming the control it came
 * from so the surface that owns the state can put focus back on it.
 *
 * A panel given one is operable; a panel without one is drawn and inert, which
 * is what every surface but the hero's wants.
 */
export type OpenPage = (page: PanelPage, from: string) => void;

/** The control a page returns to, and the one Back is named after. */
export const BACK = "back";

/** One string per distinct page, so an account change re-keys the page like a kind change does. */
export function pageIdentity(page: PanelPage): string {
  return page.kind === "provider" || page.kind === "effort"
    ? `${page.kind}:${page.provider}:${page.account ?? ""}`
    : page.kind;
}
