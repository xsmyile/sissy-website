# AGENTS.md

The landing page for [Sissy](https://github.com/xsmyile/sissy), the macOS menu
bar app. One static page, no backend. The app's own source lives in the app
repository and is the reference for everything the site draws.

## Repository layout

- `src/pages/index.astro`: the one page, composed of the sections below.
- `src/components/`: Astro sections and controls. `Hero`, `Limits`, `Accounts`,
  `Agents`, `DiskNetwork`, `Git`, `Privacy`, `Detail`, `Install` and `Footer`
  are the page in order, which is the order the panel's tabs read in: the
  Usage tab's gauges and the accounts behind them, Sessions and Mac, Disk and
  Network, then the repositories. `Section` is the frame the middle ones share
  (eyebrow, title, lede, an `aside` slot under them, an `after` slot across
  both columns, a `split`, `reverse` or `stack` layout, and the `tier` that
  says how it arrives); `CropPair` lays one crop over the edge of another with a
  caption each; `Nav`, `MenuBar`, `DownloadButton`, `Command`, `Disclosure` and
  `Inline` are the pieces. `Nav` is rendered inside `Hero`, not beside it, and
  `MenuBar` inside `Install`. Each carries its own scoped `<style>`.
- `src/panel/`: the replica of the app's panel, in React. `Panel.tsx` switches
  on the page and, on the Overview, on the tab; `page.ts` carries which page
  that is and how one is opened. `pages/` holds one component per page or tab
  (Overview, which is the Usage tab, Sessions, Mac, Disk, Network, Forge,
  Provider, Effort, Identities), `components/` the pieces they share,
  `PanelGroup` the platter every block sits on and `TabBar` the modules, `data.ts` the one fixture every number
  on the replica comes from. Beside `Panel` it exports the crops a page section
  enlarges one block with: `LimitsCrop`, `ProjectsCrop`, `ForgeCrop`,
  `IdentityCrop`, `IdentitiesCrop`, `SessionsNowCrop`, `MacCrop`, `DiskCrop`
  and `NetworkCrop`, each
  the same markup the page it belongs to draws, in the panel's own frame and
  never operable. `HeroPanel.tsx` is the only hydrated island: it
  owns the page state, the focus, the blink and the tilt. Every other use of
  the panel is rendered to static HTML. `motion.ts` carries the blink's timing
  and `blink.ts` plays it on whatever eyes a surface hands it.
- `src/settings/`: the replica of the parts of the Settings window the page
  shows, in React and never operable. `Settings.tsx` exports `ProvidersCrop`
  (Settings ▸ Providers, drawn in `Accounts`) and `ForgeSettingsCrop` (the
  first section of Settings ▸ Forge, drawn in `Git`), `CredentialRow.tsx` the
  row every linked account and forge connection takes, and `settings.css` the
  grouped `Form`. Its fixture is `DEMO_SETTINGS` in `src/panel/data.ts`,
  derived from the panel's own readings.
- `src/motion/`: how the page arrives, and the only script it ships besides the
  island. `reveal.ts` reads a section's `data-tier`, hides what is still below
  the fold, and springs the parts in on `motion`'s `inView`; `settle.ts` puts
  back what an animation wrote inline, a frame after it finishes, because
  motion commits its last frame after the promise resolves.
- `src/content/`: every string and URL the page shows. `site.ts` is the hero,
  the nav and the constants; `sections.ts` is the copy of each section below
  it, written with the README's own light markup
  (backticks for code, asterisks for emphasis), which `inline.ts` parses and
  `Inline.astro` renders. Copy changes happen here, not in components.
- `src/styles/`: `tokens.css` is the palette, `global.css` the reset.
- `src/assets/brand/`: Sissy's silhouette, its eye, and the icon, derived from
  the app's `AppIcon.icon/Assets/SissyProfile.svg`. Not MIT; see its
  `LICENSE.md`. `src/assets/marks/` holds the vendor and forge marks the panel
  draws (Claude, Codex, GitHub, GitLab), each with `fill="currentColor"` on its
  root so the sprite's symbol takes the colour of the row it sits on.
- `public/`: favicons and touch icons rendered from the icon, `sprite.svg`,
  which `scripts/build-sprite.mjs` generates from `src/assets`, and
  `appcast.xml`, the app's update feed, once the first release has written it.

## Common commands

```bash
npm run dev       # dev server
npm run build     # static build into dist/
npm run check     # astro check, then biome check
npm run format    # biome format --write
npm run sprite    # regenerate public/sprite.svg after editing src/assets
```

## Conventions

- **No runtime requests to third parties.** Fonts are downloaded at build time
  by Astro's fonts API and served from the site's own origin. The app's whole
  pitch is that nothing leaves the machine; the site does not undercut it.

- **Biome lints the frontmatter of `.astro` files as a module**, so unused
  import and variable rules are off for them in `biome.json`. Everything else
  is on.

- **Screenshots for review come from the Playwright headless shell**
  (`~/Library/Caches/ms-playwright/chromium_headless_shell-*`), not from the
  Playwright or DevTools MCP screenshot tools, which time out on this page, and
  not from desktop Chrome, which will not open a window narrower than about
  500 px.

## Topic rules

The rest of the conventions live in `.claude/rules/`, one file per topic.
Claude Code loads each by its `paths:` frontmatter; every other agent reads
the file for the paths it is about to edit before editing them, because these
are the maintenance contract, not background.

| File | Governs |
|---|---|
| `.claude/rules/panel-replica.md` | `src/panel/**`, `src/settings/**`, `src/components/Hero.astro`: the mirror pairs, the fixture's invariants, the `--pt` measure and the replica's colours |
| `.claude/rules/hero.md` | `src/components/Hero.astro`, `src/components/Install.astro`, `src/components/MenuBar.astro`, `src/panel/HeroPanel.tsx`, `src/panel/blink.ts`, `src/panel/motion.ts`: the scene, the blink, the operable panel and its hint |
| `.claude/rules/arrival-motion.md` | `src/motion/**`, `src/components/Section.astro`, `src/panel/HeroPanel.tsx`: the tiers and how a section arrives |
| `.claude/rules/page-sections.md` | `src/pages/**`, `src/components/**`: what each section draws and how its crops overlap |
| `.claude/rules/page-style.md` | `src/styles/**`, `src/components/**`: the palette, the footer, links |
| `.claude/rules/content.md` | `src/content/**`: where copy comes from, and the money note |
| `.claude/rules/glyphs.md` | `src/panel/components/Glyph.tsx`, `src/panel/panel.css`: the SF Symbols and how to convert one |
| `.claude/rules/appcast.md` | `public/appcast.xml`: the signed update feed nobody edits by hand |
