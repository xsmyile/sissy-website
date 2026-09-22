import type { IdentityRow, PanelSnapshot, ProjectRow } from "./types";

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
 * `projectsFolded`: what the Overview draws in place of `acme/api` and
 * `acme/web` once the day has more than three projects, their figures summed.
 */
const FOLDED: ProjectRow = {
  id: "folded",
  owner: null,
  repo: "2 more projects",
  forge: null,
  tokens: "283.4M",
  cost: "$205.08",
  share: 0.22,
};

const PERSONAL = "Smyile <dev@example.com>";
const WORK = "Acme Dev <dev@acme.example>";

/**
 * Six repositories, ordered the way `makeIdentities` orders them: the one that
 * disagrees first, then by name. Acme's GitLab account has three, two of them
 * committing as the work identity, which is what makes that name the
 * expectation and `acme/web`, set to the personal one in its own config, the
 * finding. Only a local override carries a fix.
 */
const IDENTITIES: IdentityRow[] = [
  {
    id: "acme-web",
    name: "acme/web",
    mark: "unexpected",
    author: PERSONAL,
    origin: "local · /Users/dev/work/acme-web/.git/config",
    expectation: "gitlab.com · 2 repositories there commit as Acme Dev",
    fix: "git -C '/Users/dev/work/acme-web' config --unset-all user.name && git -C '/Users/dev/work/acme-web' config --unset-all user.email",
  },
  ...[
    ["acme-api", "acme/api", WORK],
    ["acme-infra", "acme/infra", WORK],
    ["homebrew-sissy", "xsmyile/homebrew-sissy", PERSONAL],
    ["sissy", "xsmyile/sissy", PERSONAL],
    ["sissy-website", "xsmyile/sissy-website", PERSONAL],
  ].map(
    ([id, name, author]): IdentityRow => ({
      id,
      name,
      mark: "agrees",
      author,
      origin: null,
      expectation: null,
      fix: null,
    }),
  ),
];

/**
 * One day of demo readings, internally consistent: the three accounts sum to
 * the headline, each account's projects sum to its day, each project's rows
 * across the accounts sum to its line on the Overview, or to the fold that
 * stands for it there, and the stats page
 * counts the same three processes the Overview's agents line does. Every
 * repository the identities page reads is one Sissy has seen an agent in, and
 * the Overview's line names the one that disagrees. Every
 * account's gauge reads the window `binding` would pick for its page.
 *
 * The day strip obeys `UsagePanelSnapshot.dayStrip`: a bar is its day's cost
 * over the costliest day's, and the total under the label is the bars above it
 * summed. A window's reset is what is left of it at its own pace mark.
 *
 * Every account's effort reading is of its strip's window: each model's
 * efforts sum to what the pills give that model across the covered days, and
 * the lead is the provider's dearest effort over the strip's total. Claude's
 * models each lead on `xhigh` above `effortWholeShare`, so its rows are not
 * doors; Codex's lead on two different efforts, so its row opens.
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
  projects: [SISSY, HOMEBREW, FOLDED],
  projectCount: 4,
  identities: IDENTITIES,
  identityLine: {
    state: "findings",
    summary: "acme/web commits under an unexpected name",
    repository: "acme-web",
  },
  identitiesReading: "checked 3m ago",
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
        inCLI: true,
        switchable: true,
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
      models: [
        { id: "claude-opus-5", name: "opus-5", reading: "84% · $601.22" },
        { id: "claude-fable-5-1", name: "fable-5-1", reading: "11% · $78.50" },
        { id: "claude-sonnet-5", name: "sonnet-5", reading: "5% · $32.68" },
      ],
      strip: {
        label: "Last 7 days · 6 of 7 days",
        total: "$3987.14",
        days: [
          {
            id: "tue",
            label: "Tue",
            fraction: 0.61,
            isToday: false,
            title: "Tue, Sep 15",
            figures: "1024.6M · $700.90",
            models: [
              { id: "claude-opus-5", name: "opus-5", reading: "94% · $659.03" },
              { id: "claude-sonnet-5", name: "sonnet-5", reading: "6% · $41.87" },
            ],
          },
          {
            id: "wed",
            label: "Wed",
            fraction: 1,
            isToday: false,
            title: "Wed, Sep 16",
            figures: "1688.1M · $1149.03",
            models: [
              { id: "claude-opus-5", name: "opus-5", reading: "87% · $1003.20" },
              { id: "claude-fable-5-1", name: "fable-5-1", reading: "10% · $112.61" },
              { id: "claude-sonnet-5", name: "sonnet-5", reading: "3% · $33.22" },
            ],
          },
          {
            id: "thu",
            label: "Thu",
            fraction: 0.13,
            isToday: false,
            title: "Thu, Sep 17",
            figures: "211.9M · $149.37",
            models: [{ id: "claude-opus-5", name: "opus-5", reading: "100% · $149.37" }],
          },
          {
            id: "fri",
            label: "Fri",
            fraction: 0.78,
            isToday: false,
            title: "Fri, Sep 18",
            figures: "1302.5M · $896.24",
            models: [
              { id: "claude-opus-5", name: "opus-5", reading: "91% · $812.40" },
              { id: "claude-fable-5-1", name: "fable-5-1", reading: "9% · $83.84" },
            ],
          },
          {
            id: "sat",
            label: "Sat",
            fraction: null,
            isToday: false,
            title: "Sat, Sep 19",
            figures: "Sissy was not running",
            models: [],
          },
          {
            id: "sun",
            label: "Sun",
            fraction: 0.33,
            isToday: false,
            title: "Sun, Sep 20",
            figures: "548.3M · $379.20",
            models: [
              { id: "claude-opus-5", name: "opus-5", reading: "80% · $302.11" },
              { id: "claude-sonnet-5", name: "sonnet-5", reading: "20% · $77.09" },
            ],
          },
          {
            id: "mon",
            label: "Mon",
            fraction: 0.62,
            isToday: true,
            title: "Mon, Sep 21",
            figures: "1043.2M · $712.40",
            models: [
              { id: "claude-opus-5", name: "opus-5", reading: "84% · $601.22" },
              { id: "claude-fable-5-1", name: "fable-5-1", reading: "11% · $78.50" },
              { id: "claude-sonnet-5", name: "sonnet-5", reading: "5% · $32.68" },
            ],
          },
        ],
      },
      projects: [
        { ...SISSY, tokens: "612.4M", cost: "$410.22", share: 0.576 },
        { ...HOMEBREW, tokens: "290.0M", cost: "$179.34", share: 0.252 },
        { ...ACME_API, tokens: "140.8M", cost: "$122.84", share: 0.172 },
      ],
      projectCount: 3,
      effort: { lead: "xhigh 99%", window: "6 of 7 days", rows: null },
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
        inCLI: false,
        switchable: true,
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
      models: [
        { id: "claude-sonnet-5", name: "sonnet-5", reading: "71% · $58.40" },
        { id: "claude-opus-5", name: "opus-5", reading: "29% · $23.84" },
      ],
      strip: {
        label: "Last 7 days · 5 of 7 days",
        total: "$743.00",
        days: [
          {
            id: "tue",
            label: "Tue",
            fraction: 0.44,
            isToday: false,
            title: "Tue, Sep 15",
            figures: "216.4M · $124.78",
            models: [{ id: "claude-sonnet-5", name: "sonnet-5", reading: "100% · $124.78" }],
          },
          {
            id: "wed",
            label: "Wed",
            fraction: 0.71,
            isToday: false,
            title: "Wed, Sep 16",
            figures: "349.1M · $201.35",
            models: [
              { id: "claude-sonnet-5", name: "sonnet-5", reading: "70% · $140.95" },
              { id: "claude-opus-5", name: "opus-5", reading: "30% · $60.40" },
            ],
          },
          {
            id: "thu",
            label: "Thu",
            fraction: 1,
            isToday: false,
            title: "Thu, Sep 17",
            figures: "491.7M · $283.59",
            models: [
              { id: "claude-opus-5", name: "opus-5", reading: "70% · $198.51" },
              { id: "claude-sonnet-5", name: "sonnet-5", reading: "30% · $85.08" },
            ],
          },
          {
            id: "fri",
            label: "Fri",
            fraction: null,
            isToday: false,
            title: "Fri, Sep 18",
            figures: "Sissy was not running",
            models: [],
          },
          {
            id: "sat",
            label: "Sat",
            fraction: null,
            isToday: false,
            title: "Sat, Sep 19",
            figures: "Sissy was not running",
            models: [],
          },
          {
            id: "sun",
            label: "Sun",
            fraction: 0.18,
            isToday: false,
            title: "Sun, Sep 20",
            figures: "88.5M · $51.04",
            models: [{ id: "claude-sonnet-5", name: "sonnet-5", reading: "100% · $51.04" }],
          },
          {
            id: "mon",
            label: "Mon",
            fraction: 0.29,
            isToday: true,
            title: "Mon, Sep 21",
            figures: "142.6M · $82.24",
            models: [
              { id: "claude-sonnet-5", name: "sonnet-5", reading: "71% · $58.40" },
              { id: "claude-opus-5", name: "opus-5", reading: "29% · $23.84" },
            ],
          },
        ],
      },
      projects: [
        { ...ACME_API, tokens: "123.9M", cost: "$65.18", share: 0.793 },
        { ...ACME_WEB, share: 0.207 },
      ],
      projectCount: 2,
      effort: { lead: "xhigh 97%", window: "5 of 7 days", rows: null },
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
        inCLI: false,
        switchable: false,
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
      models: [
        { id: "gpt-6-astra", name: "gpt-6-astra", reading: "88% · $121.40" },
        { id: "gpt-6-mini", name: "gpt-6-mini", reading: "12% · $15.99" },
      ],
      strip: {
        label: "Last 7 days · 4 of 7 days",
        total: "$938.27",
        days: [
          {
            id: "tue",
            label: "Tue",
            fraction: null,
            isToday: false,
            title: "Tue, Sep 15",
            figures: "Sissy was not running",
            models: [],
          },
          {
            id: "wed",
            label: "Wed",
            fraction: 0.52,
            isToday: false,
            title: "Wed, Sep 16",
            figures: "277.8M · $174.25",
            models: [{ id: "gpt-6-astra", name: "gpt-6-astra", reading: "100% · $174.25" }],
          },
          {
            id: "thu",
            label: "Thu",
            fraction: 0.87,
            isToday: false,
            title: "Thu, Sep 17",
            figures: "464.7M · $291.53",
            models: [
              { id: "gpt-6-astra", name: "gpt-6-astra", reading: "92% · $268.20" },
              { id: "gpt-6-mini", name: "gpt-6-mini", reading: "8% · $23.33" },
            ],
          },
          {
            id: "fri",
            label: "Fri",
            fraction: 1,
            isToday: false,
            title: "Fri, Sep 18",
            figures: "534.2M · $335.10",
            models: [{ id: "gpt-6-astra", name: "gpt-6-astra", reading: "100% · $335.10" }],
          },
          {
            id: "sat",
            label: "Sat",
            fraction: null,
            isToday: false,
            title: "Sat, Sep 19",
            figures: "Sissy was not running",
            models: [],
          },
          {
            id: "sun",
            label: "Sun",
            fraction: null,
            isToday: false,
            title: "Sun, Sep 20",
            figures: "Sissy was not running",
            models: [],
          },
          {
            id: "mon",
            label: "Mon",
            fraction: 0.41,
            isToday: true,
            title: "Mon, Sep 21",
            figures: "219.0M · $137.39",
            models: [
              { id: "gpt-6-astra", name: "gpt-6-astra", reading: "88% · $121.40" },
              { id: "gpt-6-mini", name: "gpt-6-mini", reading: "12% · $15.99" },
            ],
          },
        ],
      },
      projects: [
        { ...SISSY, tokens: "187.5M", cost: "$118.72", share: 0.864 },
        { ...HOMEBREW, tokens: "31.5M", cost: "$18.67", share: 0.136 },
      ],
      projectCount: 2,
      effort: {
        lead: "medium 48%",
        window: "4 of 7 days",
        rows: [
          {
            id: "gpt-6-astra",
            name: "gpt-6-astra",
            total: "$898.95 · 216 turns",
            detail:
              "medium $440.49 · 118 turns · high $332.61 · 64 turns · xhigh $89.90 · 11 turns · low $35.95 · 23 turns",
            segments: [
              { id: "medium", effort: "medium", share: 0.49, label: "medium 49%" },
              { id: "high", effort: "high", share: 0.37, label: "high 37%" },
              { id: "xhigh", effort: "xhigh", share: 0.1, label: "xhigh 10%" },
              { id: "low", effort: "low", share: 0.04, label: "low 4%" },
            ],
          },
          {
            id: "gpt-6-mini",
            name: "gpt-6-mini",
            total: "$39.32 · 46 turns",
            detail: "low $27.52 · 37 turns · medium $11.80 · 9 turns",
            segments: [
              { id: "low", effort: "low", share: 0.7, label: "low 70%" },
              { id: "medium", effort: "medium", share: 0.3, label: "medium 30%" },
            ],
          },
        ],
      },
      status: { label: "All Systems Operational", checked: "checked 34s ago" },
    },
  ],
  stats: {
    reading: "counted 12s ago",
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
