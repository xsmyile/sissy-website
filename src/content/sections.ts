import { GITHUB_URL } from "./site";

/** The Overview's first gauge, drawn at page scale. Every figure comes from that row. */
export const PACE = {
  id: "pace",
  rowId: "claude-xsmyile",
  body: "The mark on the bar is where even spending would have reached by now, so being ahead of pace is visible instead of calculated.",
  paceLabel: "Pace at this hour",
} as const;

export const LIMITS = {
  id: "limits",
  eyebrow: "Rate limits",
  title: "See how close you are before the CLI stops you.",
  lede: "The Overview shows one gauge per account, on the window it is closest to running out of.",
  body: "The session and the week, each with what is used, how far off pace it is, when it runs out at this rate and when it resets. Under them, today against the days before it, and this account's own projects.",
  panelLabel: "Sissy's panel, one account's page",
} as const;

export const AGENTS_SCENE = {
  id: "agents",
  eyebrow: "Agents",
  title: "What is running right now, and what it holds.",
  lede: "A rate limit and the Mac's memory are the two things that stop work now, so the Overview keeps one line about agents next to the gauges. Click it for the page behind it.",
  points: [
    {
      title: "Now",
      body: "Every running session with its memory and how long it has been up, named after the repository it is working in. The line above is the footprint over time; the sentence under it is what those processes started alongside themselves.",
    },
    {
      title: "Sessions and agents",
      body: "How many the day has had, how long it was worked, and when: the strip is the day as blocks of activity, with the sub-agents' share and the cost of an hour in the caption.",
    },
  ],
  panelLabel: "Sissy's Agents page",
} as const;

export const PRIVACY = {
  id: "privacy",
  eyebrow: "Privacy",
  title: "Your session logs never leave the machine.",
  lede: "Sissy reads the logs Claude Code and Codex already write on your Mac and does the arithmetic there. It has no account of its own, no analytics and no crash reporting, and it binds no port.",
  facts: [
    {
      title: "Nothing to grant",
      body: "The first launch asks for nothing: no Full Disk Access, no keychain dialog, no prompt of any kind.",
    },
    {
      title: "Every request has a switch",
      body: "Sissy does connect out, for readings you asked for: each vendor's usage endpoint, the public price list, a forge you connected, a status page. Each one has its own off switch.",
    },
    {
      title: "Off until you say so",
      body: "Anything that costs a permission, or writes into another program's files, is off until you switch it on and says what it will do first.",
    },
  ],
  detailsSummary: "Every host Sissy talks to, and how to switch each one off",
  columns: { host: "Host", purpose: "For", off: "Off" },
  hosts: [
    {
      host: "`raw.githubusercontent.com`",
      purpose: "LiteLLM's public price list, daily",
      off: "`remotePricing: false`",
    },
    {
      host: "`api.anthropic.com`",
      purpose: "Usage and profile, with Claude Code's own token",
      off: "Switch the Claude Code provider off",
    },
    {
      host: "`claude.ai`",
      purpose: "Usage and credits for a Claude account you linked",
      off: "Unlink the account",
    },
    {
      host: "`chatgpt.com`",
      purpose: "The Codex usage endpoint",
      off: "Switch the Codex provider off, or unlink",
    },
    {
      host: "`auth.openai.com`",
      purpose: "Signing a Codex account in, and renewing that credential afterwards",
      off: "Unlink the account",
    },
    {
      host: "`api.github.com`, or the Enterprise or GitLab host you connected",
      purpose: "Your own activity counts",
      off: "Disconnect it in Settings ▸ Forge",
    },
    {
      host: "`status.claude.com`, `status.openai.com`",
      purpose: "Each vendor's public status page",
      off: "`statusChecks: false`",
    },
  ],
  keepsTitle: "What Sissy keeps",
  keeps:
    "One day-by-model archive under `~/Library/Application Support/Sissy/history/`: totals, repository paths, session counts and how long each day was worked. Never prompts, and never a line of your logs. Settings names the folder, deletes it on a button, and `historyRetentionDays` bounds it, with `0` recording nothing.",
  writesTitle: "What it writes elsewhere",
  writes:
    "Off by default. *Name projects even when Sissy is off* adds one line to `~/.claude/settings.json` and one to `~/.codex/hooks.json`, and takes both out when you switch it off. *Use in CLI* writes the Claude account you picked into the slot the CLI reads its credential from.",
  securityLink: {
    label: "SECURITY.md has the full surface: what Sissy reads, runs and holds",
    href: `${GITHUB_URL}/blob/master/SECURITY.md`,
  },
} as const;

/**
 * By project and How it works, as one block: the two are the page's detail
 * tier, and eight sections of the same shape was the complaint that started
 * the redesign.
 */
export const DETAIL = {
  id: "how",
  eyebrow: "How it works",
  title: "One process, reading the logs as they land.",
  lede: "No daemon, no socket, no second half to keep in step. Quit Sissy and the counting stops.",
  projects: {
    title: "Where the day went, by repository.",
    body: "Each row is one repository with what it cost today, and the band behind it is that repository's share of the day. A worktree counts against the repository it was cut from, so one project is one row, whichever CLI did the work.",
    note: "The label is the way to the whole list. Rows carry the forge's mark when the repository has one, and the path stays on the hover.",
    panelLabel: "The Overview's By project block, enlarged",
  },
  points: [
    {
      title: "Priced as it lands",
      body: "Sissy watches the log directories and prices each turn as it lands. The readings that are not a log tail, such as limits, forge counters and vendor status, are polls beside it.",
    },
    {
      title: "Picks up where it left off",
      body: "Counting happens while Sissy runs and resumes where it stopped, so *Start at login* is what keeps a day complete.",
    },
    {
      title: "No price table in the source",
      body: "Rates come from LiteLLM at runtime, with a snapshot compiled in as the offline floor, so a CLI that ships a new model prices correctly without a Sissy release. `ccusage` prices from LiteLLM too, which is why the two agree.",
    },
  ],
  readsSummary: "What it reads, and where",
  sources: [
    {
      name: "Claude Code",
      where: "`~/.claude/projects/**/*.jsonl`, or wherever `claudeDataDir` points",
    },
    { name: "Codex", where: "`~/.codex/sessions/**/rollout-*.jsonl`, honoring `CODEX_HOME`" },
    {
      name: "GitHub, GitLab",
      where: "Each vendor's API, with a token you connect in Settings ▸ Forge",
    },
    {
      name: "Your repositories",
      where: "`git`, to resolve a project and read its commit identity",
    },
  ],
  readsNote:
    "Both CLIs report the same things: tokens, cost, the per-repository split, the sessions and agents behind them, every rate-limit window, the plan and the credits. Claude Code is on unless you switch it off; Codex is picked up whenever its session directory exists.",
} as const;

export const INSTALL = {
  id: "install",
  eyebrow: "Install",
  title: "Put the numbers in the menu bar.",
  requirements: "macOS 26 or later, Apple Silicon or Intel. Free and open source.",
  reassurance:
    "The app is Developer ID signed and notarized, so there is no `xattr` workaround and no right-click → Open. The first launch asks for nothing.",
  menuBar:
    "Sissy lives in the menu bar, not the Dock. Left-click the icon for the panel, right-click for a short menu. There is no number in the menu bar.",
  github: { label: "Source on GitHub", href: GITHUB_URL },
  uninstallSummary: "Uninstall",
  uninstallCommand: "brew uninstall --cask sissy",
  uninstall:
    "Or drag Sissy out of Applications. Either way the counting stops: no daemon to kill, no power assertion still held, nothing listening anywhere.",
} as const;

export const FOOTER = {
  cat: "Named after my cat: she naps, judges, demands cuddles (a lot of cuddles), and is, objectively, fabulous. The silhouette is drawn from her.",
  license:
    "The source code is MIT. Sissy's name and her artwork are not, and NOTICE says what that means. Fork it, ship it, sell it; just not wearing her face.",
  docs: [
    { label: "Releases", href: `${GITHUB_URL}/releases` },
    { label: "Security", href: `${GITHUB_URL}/blob/master/SECURITY.md` },
    { label: "Credits", href: `${GITHUB_URL}/blob/master/CREDITS.md` },
    { label: "Notice", href: `${GITHUB_URL}/blob/master/NOTICE` },
  ],
  marks: [{ label: "Sissy on GitHub", href: GITHUB_URL, symbol: "mark-github" }],
} as const;
