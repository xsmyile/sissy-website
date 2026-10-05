---
paths:
  - "src/panel/**"
  - "src/settings/**"
  - "src/components/Hero.astro"
---

# The panel replica

- **The panel replica mirrors the app, file for file, and the mirror is the
  maintenance path.** `src/panel/types.ts` mirrors `UsagePanelSnapshot.swift`,
  `Panel.tsx` mirrors `UsagePanelView.Page`, `pages/Overview.tsx` mirrors
  `PanelOverview.swift`, `pages/Provider.tsx` mirrors `PanelProviderPage.swift`,
  `pages/Effort.tsx` mirrors `PanelEffortPage.swift`, `pages/Sessions.tsx`
  mirrors `PanelSessions.swift`, `pages/Mac.tsx` mirrors `PanelMac.swift`,
  `pages/Forge.tsx` mirrors `PanelForge.swift` and `PanelIdentityLine`,
  `pages/Disk.tsx` mirrors `PanelDisk.swift`, `PanelDiskActivity.swift` and
  `PanelDiskCleanup.swift`, `pages/Network.tsx` mirrors `PanelNetwork.swift`,
  `components/RateSparkline.tsx` mirrors `PanelRateSparkline.swift`,
  `components/TabBar.tsx` mirrors `PanelTabs.swift`,
  `components/PanelGroup.tsx` mirrors `PanelGroup` and `PanelPlatter`,
  `pages/Identities.tsx` mirrors
  `PanelIdentities.swift` under `identitiesHeader`, `components/DayBlock.tsx`
  mirrors `PanelDayBlock.swift` and `ModelPill`, `components/ForgeSection.tsx`
  mirrors `ForgeRowView` and `metrics.css` mirrors `PanelMetrics`, both in
  `PanelComponents.swift`, `components/WindowRow.tsx` mirrors
  `WindowRowView` there too, which the provider page's limits and the Actions
  block both draw, `components/Actions.tsx` mirrors `PanelActions`
  and `ActionsRowView` in `PanelForge.swift`, and `ForgeSection.tsx` also
  mirrors `ForgeSectionLabel` in `PanelForge.swift`, `format.ts` mirrors the
  `UsageFormat` functions it names, `motion.ts` mirrors
  `SissyMenuBarMotion.swift`. `src/settings/Settings.tsx` mirrors
  `ProvidersSettingsView.swift`, the first section of `ForgeSettings.swift`
  and `AwakeSettingsView.swift`, and `CredentialRow.tsx` mirrors `SettingsCredentialRow.swift`. When the app
  changes a page, diff those pairs first, then update `data.ts`. Do not restyle
  the replica from a screenshot; read the Swift. The one exception is what the
  Swift leaves to the system: the grouped `Form`'s card, separators, switch,
  closed pop-up picker, section header and type sizes are not declared
  anywhere in the app, so `settings.css` takes them
  from a `Form` with the same rows rendered offscreen at 2x in the dark
  appearance, which is the system's drawing rather than a screenshot of it.

- **One point is `--pt`.** Every panel measure is `calc(N * var(--pt))` with N
  the value `PanelMetrics` declares. A surface that wants the panel larger sets
  `--panel-pt` on an ancestor; nothing else scales it. The hero's is
  `clamp(0.68px, calc(0.16svh - 0.28px), 1.25px)`: above native size on any
  ordinary screen, because the replica is the subject of the hero and not an
  illustration beside the headline, and tied to the viewport because the scene
  owes the fold a whole hero and the panel is the tallest thing in it, so it is
  what gives way. The budget is a share of the height **minus a constant**, not
  a plain fraction, because the hero's furniture — nav, words, cue, gaps —
  costs the same on every screen: a plain fraction keeps the panel growing on a
  short window where that constant is most of the fold, and the cue is what
  falls off the bottom. Measured on the wide scene, with the tab bar under the
  header and the Usage tab open, it clears the fold from 600 px of viewport
  height up; the
  stacked scene puts the panel under the words and makes no such claim. That size is what the words being one block in their own column
  buys: the title no longer spans the scene with the panel taking what is left
  under it, so the panel has a column for the whole height of the stack.

- **The fixture stays internally consistent, and it carries every figure
  rather than working one out.** The three accounts sum to the headline, each
  account's projects sum to its day, each project's rows across the accounts
  sum to its line on the Usage tab or to the fold standing for it there, each
  account's efforts sum to its strip's models over the covered days, and the
  sessions on the Sessions tab each belong to a project on their own
  vendor's pages. The tabs' badges are fields, and the Forge tab's orange
  is the identity line's finding. A day strip obeys
  `UsagePanelSnapshot.dayStrip`: a bar is its day's cost over the costliest
  day's, and the total under the label is the bars above it summed. A window's
  reset is what is left of it at its own pace mark, and its reserve or deficit
  is the gap between the two fractions. The binding window is a field, not a
  derivation — the app picks it by projected exhaustion, which is not a figure
  this fixture holds. `meteringProviders` is 2 whatever the account count is:
  three account pages, two vendors. Codex's session sits at 94%, past the point
  OpenAI applies a reset, because that is the only state in which the app draws
  `Use…`: a Codex further from its limits would show the count and a hint and
  no button. The GitHub row's Actions month is September, so every owner's
  pace mark sits where the fixture's clock is in it, and only owners on
  GitHub have a row: Group 935 is on GitLab, so the organisation whose CI has
  stopped is Victis. Settings is derived rather than written: every linked account is
  one the panel has a page for, and every forge connection is a row of the
  contributions block, titled by its host. Settings ▸ Awake holds what the
  header's cup says: a hold in force, so `Always`, with no limit, the screen
  and the lid both kept.

- **The replica stays in macOS neutrals; the page is the brand.** The panel's
  colours are the popover material's, its font stack starts with the system
  font, and the cat's eye inside it is `systemBlue`, because the app draws it so
  (`SissyArtwork.holdTint`). The page around it uses `tokens.css`.

- **Rows the replica does not navigate are drawn faithfully and left inert.**
  A chevron on a row is what the app draws; it is not a promise the site makes.
  The forge sections are drawn, one per connected account and one account per
  vendor, and they are never summed — each vendor counts its own thing, so a total across
  them would be a third number belonging to neither. The credits stay omitted
  rather than faked. A project list past three rows keeps two and folds the
  rest into one row that names no owner and no forge, and its label counts
  every project rather than the rows, which is why `projectCount` is a field.
  The identity block draws both halves
  of one state and never both at once: `Use in CLI` on an account the CLI is
  not on, the `· in CLI` badge on the one it is and only where a second account
  exists to tell it from, which is what `inCLI` and `switchable` carry.
