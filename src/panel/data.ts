import type { PanelSnapshot, ProjectRow } from "./types";

const SISSY: ProjectRow = {
  id: "sissy",
  owner: "xsmyile",
  repo: "sissy",
  forge: "github",
  tokens: "799.9M",
  cost: "$528.94",
  share: 0.568,
};

const HOMEBREW: ProjectRow = {
  id: "homebrew-sissy",
  owner: "xsmyile",
  repo: "homebrew-sissy",
  forge: "github",
  tokens: "321.5M",
  cost: "$198.01",
  share: 0.212,
};

const ACME_API: ProjectRow = {
  id: "acme-api",
  owner: "acme",
  repo: "api",
  forge: "gitlab",
  tokens: "264.7M",
  cost: "$188.02",
  share: 0.202,
};

const ACME_WEB: ProjectRow = {
  id: "acme-web",
  owner: "acme",
  repo: "web",
  forge: "gitlab",
  tokens: "18.7M",
  cost: "$17.06",
  share: 0.018,
};

/**
 * One day of demo readings, internally consistent: the three accounts sum to
 * the headline, each account's projects sum to its day, each project's rows
 * across the accounts sum to its line on the Overview, and the stats page
 * counts the same three processes the Overview's agents line does. Every
 * account's gauge reads the window `binding` would pick for its page.
 *
 * The day strip obeys `UsagePanelSnapshot.dayStrip`: a bar is its day's cost
 * over the costliest day's, and the total under the label is the bars above it
 * summed. A window's reset is what is left of it at its own pace mark.
 */
export const DEMO_SNAPSHOT: PanelSnapshot = {
  header: { updated: "21s ago", awake: "<1m" },
  headline: { period: "Today", cost: "$932.03", tokens: "1404.8M tokens", burn: "60.8M/h" },
  usedToday: 2,
  meteringProviders: 2,
  gaugeRows: [
    {
      id: "claude-xsmyile",
      provider: "claude-code",
      account: "xsmyile",
      name: "Claude · Xsmyile",
      window: "Weekly",
      usedFraction: 0.69,
      expectedFraction: 0.52,
    },
    {
      id: "claude-acme",
      provider: "claude-code",
      account: "acme",
      name: "Claude · Acme Inc",
      window: "Weekly",
      usedFraction: 0.16,
      expectedFraction: 0.31,
    },
    {
      id: "codex",
      provider: "codex",
      account: null,
      name: "Codex",
      window: "Weekly",
      usedFraction: 0.46,
      expectedFraction: 0.55,
    },
  ],
  agents: { running: 3, footprint: "1.42 GB" },
  projects: [SISSY, HOMEBREW, ACME_API, ACME_WEB],
  forge: [
    {
      id: "github",
      host: "github",
      login: "xsmyile",
      contributions: "47",
      merged: "6",
      issues: "3",
      comments: "18",
      notice: "read 4m ago",
    },
    {
      id: "gitlab",
      host: "gitlab",
      login: "acme-dev",
      contributions: "112",
      merged: "4",
      issues: "9",
      comments: "31",
      notice: "read 12m ago",
    },
  ],
  providerPages: [
    {
      provider: "claude-code",
      account: "xsmyile",
      name: "Claude",
      identity: {
        email: "dev@example.com",
        organization: "Xsmyile",
        plan: "Max 20x",
        hasPicker: true,
      },
      limitsCaption: "Read 14:31",
      binding: "weekly",
      windows: [
        {
          id: "session",
          label: "Session",
          reading: "31%",
          usedFraction: 0.31,
          expectedFraction: 0.43,
          caption: "12% in reserve · Lasts until reset · resets in 2h 51m",
        },
        {
          id: "weekly",
          label: "Weekly",
          reading: "69%",
          usedFraction: 0.69,
          expectedFraction: 0.52,
          caption: "17% in deficit · Runs out in 1d 15h · resets in 3d 8h",
        },
      ],
      today: "1043.2M · $712.40",
      strip: {
        label: "Last 7 days · 6 of 7 days",
        total: "$3987.14",
        days: [
          { id: "tue", label: "Tue", fraction: 0.61, isToday: false },
          { id: "wed", label: "Wed", fraction: 1, isToday: false },
          { id: "thu", label: "Thu", fraction: 0.13, isToday: false },
          { id: "fri", label: "Fri", fraction: 0.78, isToday: false },
          { id: "sat", label: "Sat", fraction: null, isToday: false },
          { id: "sun", label: "Sun", fraction: 0.33, isToday: false },
          { id: "mon", label: "Mon", fraction: 0.62, isToday: true },
        ],
      },
      projects: [
        { ...SISSY, tokens: "612.4M", cost: "$410.22", share: 0.576 },
        { ...HOMEBREW, tokens: "290.0M", cost: "$179.34", share: 0.252 },
        { ...ACME_API, tokens: "140.8M", cost: "$122.84", share: 0.172 },
      ],
      status: { label: "All Systems Operational", checked: "checked 21s ago" },
    },
    {
      provider: "claude-code",
      account: "acme",
      name: "Claude",
      identity: {
        email: "dev@acme.example",
        organization: "Acme Inc",
        plan: "Team Premium",
        hasPicker: true,
      },
      limitsCaption: "Read 14:31",
      binding: "weekly",
      windows: [
        {
          id: "session",
          label: "Session",
          reading: "9%",
          usedFraction: 0.09,
          expectedFraction: 0.43,
          caption: "34% in reserve · Lasts until reset · resets in 2h 51m",
        },
        {
          id: "weekly",
          label: "Weekly",
          reading: "16%",
          usedFraction: 0.16,
          expectedFraction: 0.31,
          caption: "15% in reserve · Lasts until reset · resets in 4d 19h",
        },
      ],
      today: "142.6M · $82.24",
      strip: {
        label: "Last 7 days · 5 of 7 days",
        total: "$743.00",
        days: [
          { id: "tue", label: "Tue", fraction: 0.44, isToday: false },
          { id: "wed", label: "Wed", fraction: 0.71, isToday: false },
          { id: "thu", label: "Thu", fraction: 1, isToday: false },
          { id: "fri", label: "Fri", fraction: null, isToday: false },
          { id: "sat", label: "Sat", fraction: null, isToday: false },
          { id: "sun", label: "Sun", fraction: 0.18, isToday: false },
          { id: "mon", label: "Mon", fraction: 0.29, isToday: true },
        ],
      },
      projects: [
        { ...ACME_API, tokens: "123.9M", cost: "$65.18", share: 0.793 },
        { ...ACME_WEB, share: 0.207 },
      ],
      status: { label: "All Systems Operational", checked: "checked 21s ago" },
    },
    {
      provider: "codex",
      account: null,
      name: "Codex",
      identity: {
        email: "dev@example.com",
        organization: null,
        plan: "Pro",
        hasPicker: false,
      },
      limitsCaption: "Read 14:29",
      binding: "weekly",
      windows: [
        {
          id: "session",
          label: "Session",
          reading: "38%",
          usedFraction: 0.38,
          expectedFraction: 0.61,
          caption: "23% in reserve · Lasts until reset · resets in 1h 57m",
        },
        {
          id: "weekly",
          label: "Weekly",
          reading: "46%",
          usedFraction: 0.46,
          expectedFraction: 0.55,
          caption: "9% in reserve · Lasts until reset · resets in 3d 3h",
        },
      ],
      today: "219.0M · $137.39",
      strip: {
        label: "Last 7 days · 4 of 7 days",
        total: "$938.27",
        days: [
          { id: "tue", label: "Tue", fraction: null, isToday: false },
          { id: "wed", label: "Wed", fraction: 0.52, isToday: false },
          { id: "thu", label: "Thu", fraction: 0.87, isToday: false },
          { id: "fri", label: "Fri", fraction: 1, isToday: false },
          { id: "sat", label: "Sat", fraction: null, isToday: false },
          { id: "sun", label: "Sun", fraction: null, isToday: false },
          { id: "mon", label: "Mon", fraction: 0.41, isToday: true },
        ],
      },
      projects: [
        { ...SISSY, tokens: "187.5M", cost: "$118.72", share: 0.864 },
        { ...HOMEBREW, tokens: "31.5M", cost: "$18.67", share: 0.136 },
      ],
      status: { label: "All Systems Operational", checked: "checked 34s ago" },
    },
  ],
  stats: {
    live: {
      line: { running: 3, footprint: "1.42 GB" },
      samples: [
        0.62, 0.64, 0.71, 0.69, 0.74, 0.8, 0.79, 0.86, 0.84, 0.9, 0.95, 1, 0.94, 0.88, 0.88,
      ],
      peak: "1.61 GB",
      caption: "since 09:12 · 4.88 GB with what they started",
      processes: [
        { id: "sissy", provider: "claude-code", name: "sissy", figures: "612 MB · 2h 14m" },
        { id: "api", provider: "claude-code", name: "api", figures: "498 MB · 41m" },
        { id: "homebrew", provider: "codex", name: "homebrew-sissy", figures: "310 MB · 1h 03m" },
      ],
    },
    counted: {
      period: "Today",
      sessions: 14,
      agents: 37,
      worked: "5h15",
      blocks: [
        [0.326, 0.347],
        [0.358, 0.378],
        [0.383, 0.444],
        [0.453, 0.469],
        [0.479, 0.521],
        [0.531, 0.545],
        [0.552, 0.576],
        [0.582, 0.597],
        [0.601, 0.606],
      ],
      caption: "9 blocks · 1h12 of it sub-agents · $178/h",
      byProvider: [
        {
          id: "claude-code",
          provider: "claude-code",
          name: "Claude",
          figures: "9 sessions · 28 agents · 4h51",
        },
        { id: "codex", provider: "codex", name: "Codex", figures: "5 sessions · 9 agents · 2h04" },
      ],
    },
  },
};
