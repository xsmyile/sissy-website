export const SITE_NAME = "Sissy";
export const SITE_TITLE = "Sissy · The numbers you keep checking, in the macOS menu bar";
export const SITE_DESCRIPTION =
  "What Claude Code and Codex cost today, how close each account is to a rate limit, and where the work went. One panel in the macOS menu bar, read from the logs already on your Mac. No account, no telemetry.";

export const TAGLINE = "The numbers you keep checking, one click away.";
export const LEDE =
  "What Claude Code and Codex cost today, and how close each account is to a rate limit. One panel in the macOS menu bar.";

export const GITHUB_URL = "https://github.com/xsmyile/sissy";
export const DOWNLOAD_URL = `${GITHUB_URL}/releases/latest/download/Sissy.dmg`;
export const BREW_COMMAND = "brew install --cask xsmyile/sissy/sissy";
export const BREW_CASK = "xsmyile/sissy/sissy";

export const REQUIREMENTS = [
  { strong: "macOS 26", rest: " or later" },
  { strong: "", rest: "Apple Silicon or Intel" },
  { strong: "", rest: "No account, no telemetry" },
] as const;

/**
 * Four destinations, which is what the bar holds before it wraps. `How it
 * works` gave its place up to `Accounts`: the detail tier is the section
 * nobody navigates to, and the accounts are the reason a reader with two of
 * them is still on the page.
 */
export const NAV_LINKS = [
  { label: "Limits", href: "#limits" },
  { label: "Accounts", href: "#accounts" },
  { label: "Privacy", href: "#privacy" },
  { label: "Install", href: "#install" },
] as const;

/**
 * The one nav destination that leaves the page, so it is a mark set apart from
 * the links that do not: the octocat names GitHub without spending a word, the
 * way the footer's band does.
 */
export const NAV_MARK = {
  label: "Sissy on GitHub",
  href: GITHUB_URL,
  symbol: "mark-github",
} as const;

export const HERO_PANEL_LABEL = "Sissy's panel";

/**
 * What the panel invites. The README says every row with a chevron opens the
 * page behind it, which is true of the app; the replica draws chevrons on two
 * rows it leaves inert, so the invitation names the routes this panel has
 * rather than a rule the page would break twice.
 */
export const PANEL_INVITATION =
  "A provider's row opens that account, and the agents line opens the page behind it.";

/**
 * What the money on the panel is. Sissy counts the tokens out of the logs and
 * prices them at each model's published rate, which is not the same number as
 * the one a vendor charged: the app keeps the two apart everywhere
 * (`FrameBuilder.ProviderCredits`), and a page that shows the figure in its
 * hero owes the same distinction where the figure is first seen, not in a
 * detail section under a disclosure.
 */
export const COST_NOTE =
  "The cost is what Sissy counted at published rates, not what a vendor charged.";

export const SCROLL_CUE = "See the numbers";

export const MENU_BAR_CLOCK = "Mon 21 Sep  14:32";

export const SPRITE_URL = "/sprite.svg";
export const symbolHref = (id: string): string => `${SPRITE_URL}#${id}`;
