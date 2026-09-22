# AGENTS.md

The landing page for [Sissy](https://github.com/xsmyile/sissy), the macOS menu
bar app. One static page, no backend. The app's own source lives in the app
repository and is the reference for everything the site draws.

## Repository layout

- `src/pages/index.astro`: the one page, composed of the sections below.
- `src/components/`: Astro sections and controls. `Hero`, `Pace`, `Limits`,
  `Agents`, `Privacy`, `Detail`, `Install` and `Footer` are the page in order;
  `Section` is the frame the middle ones share (eyebrow, title, lede, an
  `aside` slot under them, a `split`, `reverse` or `stack` layout, and the
  `tier` that says how it arrives); `Nav`, `MenuBar`, `DownloadButton`,
  `Command`, `Disclosure` and `Inline` are the pieces. `Nav` is rendered inside
  `Hero`, not beside it, and `MenuBar` inside `Install`. Each carries its own
  scoped `<style>`.
- `src/panel/`: the replica of the app's panel, in React. `Panel.tsx` switches
  on the page, `page.ts` carries which page that is and how one is opened,
  `pages/` holds one component per page (Overview, Provider, Stats),
  `components/` the pieces they share, `data.ts` the one fixture every number
  on the replica comes from. `HeroPanel.tsx` is the only hydrated island: it
  owns the page state, the focus, the blink and the tilt. Every other use of
  the panel is rendered to static HTML. `motion.ts` carries the blink's timing
  and `blink.ts` plays it on whatever eyes a surface hands it.
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
- `public/`: favicons and touch icons rendered from the icon, and `sprite.svg`,
  which `scripts/build-sprite.mjs` generates from `src/assets`.

## Common commands

```bash
npm run dev       # dev server
npm run build     # static build into dist/
npm run check     # astro check, then biome check
npm run format    # biome format --write
npm run sprite    # regenerate public/sprite.svg after editing src/assets
```

## Conventions

- **The panel replica mirrors the app, file for file, and the mirror is the
  maintenance path.** `src/panel/types.ts` mirrors `UsagePanelSnapshot.swift`,
  `Panel.tsx` mirrors `UsagePanelView.Page`, `pages/Overview.tsx` mirrors
  `PanelOverview.swift`, `pages/Provider.tsx` mirrors `PanelProviderPage.swift`,
  `pages/Stats.tsx` mirrors `PanelStats.swift`, `components/ForgeSection.tsx`
  mirrors `ForgeRowView`, `metrics.css` mirrors
  `PanelMetrics`, both in `PanelComponents.swift`, `format.ts` mirrors the
  `UsageFormat` functions it names, `motion.ts` mirrors
  `SissyMenuBarMotion.swift`. When the app changes a page, diff those pairs
  first, then update `data.ts`. Do not restyle the replica from a screenshot;
  read the Swift.
- **One point is `--pt`.** Every panel measure is `calc(N * var(--pt))` with N
  the value `PanelMetrics` declares. A surface that wants the panel larger sets
  `--panel-pt` on an ancestor; nothing else scales it. The hero's is
  `clamp(0.72px, calc(0.16svh - 0.2px), 1.25px)`: above native size on any
  ordinary screen, because the replica is the subject of the hero and not an
  illustration beside the headline, and tied to the viewport because the scene
  owes the fold a whole hero and the panel is the tallest thing in it, so it is
  what gives way. The budget is a share of the height **minus a constant**, not
  a plain fraction, because the hero's furniture — nav, words, cue, gaps —
  costs the same on every screen: a plain fraction keeps the panel growing on a
  short window where that constant is most of the fold, and the cue is what
  falls off the bottom. Measured, it clears the fold from 600 px of viewport
  height up. That size is what the words being one block in their own column
  buys: the title no longer spans the scene with the panel taking what is left
  under it, so the panel has a column for the whole height of the stack.
- **The hero is Sissy, and her eye is the one light.** On a wide scene she sits
  in the bottom-left corner at the size of her head, cut only by the two edges
  of that corner: a crop from one corner reads as a choice, where the crop on
  three sides she had before read as an accident. Every measure in the scene is
  anchored to where her eye sits in that drawing (`--eye-x`, `--eye-y`, and the
  `60.5% 54%` origin the lid turns on), not placed by hand — the scene's
  ambient included, which is why moving her moves the gradient with her. The
  panel catches that light on the edge facing her and throws its shadow the
  other way, which means the lit edge moves with her: she is below the panel's
  left corner on a wide scene, so its left and bottom edges take the rim and
  the shadow goes up and right, and above its right on a narrow one, where the
  pair swaps back. **How bright that rim is belongs to the light alone**: it
  carried the pointer's tilt as well until the two gestures were found
  multiplying on one value, where a blink cut the rim to 42% of wherever the
  pointer had left it, between 0.12 and 0.32. That collision is the normal case
  rather than an edge one, because the panel blinks when it opens a page and
  opening a page means clicking a row, so the pointer is on the panel and
  tilting it every time. The tilt keeps the rotation and both drop shadows,
  which is enough for it to be felt. Her eye lands under the download button, so
  the one light on the page falls on the one thing the page asks for. Her
  interior is untouched, because the replica stays in macOS neutrals.
- **She blinks when numbers land, and never otherwise.** `blink` is
  `SissyMenuBarMotion.blink` — *"Sissy noticing new numbers"* — so the page
  plays it when a figure arrives, on the app's own timing and
  `dataBlinkCooldown`, never on a loop. The page blinks on the panel's first
  presentation and when the panel opens a page, which is a deliberate widening
  of the app's rule — the app blinks on a data frame — because opening a page
  is when new figures reach the screen here. It does not blink on the pace band
  scrolling back into view: an unchanged figure re-entering the viewport is not
  new data. A hidden tab is what "readings stop"
  means here, so the eye closes and rests shut until the tab is back, which is
  `eyeClose` and `eyeOpen`. Asleep she never blinks, because a blink would
  claim something is arriving while nothing is (`PanelSissyBlinkGate`). The
  catalogue's 24 frames are traced at the menu bar's 22 px and are not
  mirrored; the page redraws the lid on the app's clock, the way `Glyph.tsx`
  redraws the symbols the panel needs. **The blink and the halves run on
  different clocks**, as they do in the app: `eyeClose` and `eyeOpen` are
  measured off the frames they carry at 60 fps, while a blink runs all 24 in
  `blinkDuration`, which is a frame short of that. The two sets of numbers are
  not meant to reconcile, so `motion.ts` carries both and the stylesheet picks
  the pair the gesture calls for.
- **One panel is operable, and only along routes the app has.** The hero's is
  the only one; every other panel on the page is the same markup rendered
  inert. A panel is given `open` or it is not, and that single switch decides
  whether its rows are buttons. The routes are the three gauge rows, the agents
  line and the back control, and nothing else — the picker, refresh, settings,
  the projects label and the day bars stay drawn and dead. A gauge row is named
  the way the app names it, with `legendHelp` as an accessibility label and the
  reading beside it as a description, so the name does not swallow the figures.
  The agents row takes no label at all, because the app gives that one a help
  string and nothing else: its visible text is its name, which is also what
  keeps the accessible name and the visible label the same words. Focus lands
  on the new page's back control when one opens and returns to the row it came
  from on Back. The island renders inert until it has mounted, so the served
  HTML and the first client render agree and a page without JavaScript shows
  the same Overview with nothing on it that looks pressable.
- **The fixture stays internally consistent, and it carries every figure
  rather than working one out.** The three accounts sum to the headline, each
  account's projects sum to its day, each project's rows across the accounts
  sum to its line on the Overview, and the processes on the Stats page each
  belong to a project on their own account's page. A day strip obeys
  `UsagePanelSnapshot.dayStrip`: a bar is its day's cost over the costliest
  day's, and the total under the label is the bars above it summed. A window's
  reset is what is left of it at its own pace mark, and its reserve or deficit
  is the gap between the two fractions. The binding window is a field, not a
  derivation — the app picks it by projected exhaustion, which is not a figure
  this fixture holds. `meteringProviders` is 2 whatever the account count is:
  three account pages, two vendors.
- **The rhythm is three tiers, and the motion is the tier.** Pace, Privacy and
  Install carry the decision and rise on arrival; Limits and Agents support it
  and barely settle; the merged detail block does not move. A section does not
  arrive as one object: `reveal.ts` springs its parts in, and the tier is
  whether they land as a sequence or as one settle. That difference is
  categorical rather than a matter of degree, because sections arrive seconds
  apart and are never seen side by side, so a lead's parts travel 44px and wait
  100ms between them while a support's travel 6px at 20ms. Measured 150ms into
  the arrival, a lead's four parts sit at 16, 38, 44 and 44px with the last two
  still invisible, and a support's five sit between 2 and 5px: one is read as
  an order, the other as a single arrival. The pair this replaced was 26px
  against 10px and 50ms against 40ms, which is one gesture at two sizes and put
  the hierarchy in the attribute rather than on the screen. The still tier is a
  value in `TIERS` rather than a name it happens to lack, so a tier that is not
  one of the three is a typo and not a section that meant to stand. Under
  Reduce Motion, read once as the page boots, nothing is touched at all, and a
  section with any part of it already on screen is left alone, so a script that
  never runs leaves the finished page rather than content parked at
  `opacity: 0` waiting for an observer that will not come.
- **The figure counts and the panel springs, and only the second is a
  departure.** The pace band's 69 counting up while its bar draws is the app's
  own behaviour at page scale: `PanelOverview` puts `.animation(.default,
  value:)` on the headline cost and `.contentTransition(.numericText())` on the
  counts it draws, and `PanelComponents` springs a bar whenever its share
  changes. Opening a panel page is half mirrored: `UsagePanelView` sets the
  page's frame to its measured height, so the popover really does resize and
  `usePanelTransition` springs that height, but the app cuts between the pages
  themselves — it declares no transition on `page` at all. The incoming page's
  rise is the site's own, taken because a hard cut reads as a fault on a web
  page where in a popover it reads as a popover. Neither runs under Reduce
  Motion.
- **The replica stays in macOS neutrals; the page is the brand.** The panel's
  colours are the popover material's, its font stack starts with the system
  font, and the cat's eye inside it is `systemBlue`, because the app draws it so
  (`SissyArtwork.holdTint`). The page around it uses `tokens.css`.
- **The palette is the seal point Siamese the app is named after.** Graphite
  ground from the icon's gradient, cream text from her coat, the pale glacial
  blue of her eyes as the one accent. Coral `#d97757` appears only inside the
  replica, as Claude's provider tint, never as a page colour.
- **Every string comes from `site.ts` or the README.** Copy is lifted from the
  app's README, in its voice. No em dashes. Where the README describes the app
  rather than the replica, the site narrows it rather than repeating it: the
  panel's invitation names the routes this panel has, because the README's
  "every row with a chevron" is true of the app and false of a replica that
  draws two chevrons it leaves inert. The download link is
  `releases/latest/download/Sissy.dmg`, which the app's release workflow
  publishes as a versionless asset. The footer's cat line is the one place the
  site corrects the README instead of narrowing it: *"The icon is her"* claims
  a likeness the drawing is not, and the licence line under it already calls
  the artwork her face, so the site says *"The silhouette is drawn from her."*
  The app's README wants the same edit at its own copy of that line.
- **The page says what the money is, where the money is.** The headline figure
  is Sissy's own count of the tokens priced at the published rates, and
  the app keeps that apart from what a vendor charged everywhere it draws both
  (`ProviderCredits` is documented as deliberately not comparable with
  `ProviderSlice.cost`). The README never spells the distinction out, so
  `COST_NOTE` does, and it sits in the hero rather than in Detail: a figure of
  that size admitted only under a disclosure is admitted too late. It goes in
  the words column and not under the panel because the panel column is what the
  fold is measured against, and the words have room to spare on every screen
  the cue survives.

- **The footer's last band splits words from marks.** The four documents stay
  words, because no glyph says *Notice*; GitHub is a mark, because the octocat
  needs no caption and a second account joins that group rather than needing a
  new shelf. No external-link arrow on any of them: every link down there
  leaves the site, so a mark on all of them distinguishes nothing.
- **A link brightens; it does not grow a box.** Every hover on the page moves
  one colour, `--text-2` to `--text` or `--accent` to `--accent-bright`, and
  the octocat in the nav and in the footer hovers the same way. The box those
  two marks used to grow was the only chip on the page, and a chip under one
  link and no other says the icon is a button when it is a link. The hit area
  stays the size the box was; only the paint is gone.
- **The glyphs are the app's own symbols, converted.** `Glyph.tsx` carries the
  outline of each SF Symbol as macOS draws it, at the point size and weight
  `UsagePanelView` gives that symbol, so a glyph on the page is the glyph in
  the app rather than a drawing that resembles one. It replaced a set of
  hand-drawn look-alikes that were wrong the way a redrawing is always wrong:
  the cup was a mug seen from the side where the symbol is a cup seen from
  above its rim, and every glyph was squared off at one size where the symbols
  are neither one size nor square. **A viewBox unit is a hundredth of a
  point**, which is what makes the box the symbol's own extent —
  `cup.and.saucer.fill` at 11 pt covers 14.40 x 10.80 pt and its viewBox is
  `0 0 1440 1080` — so `panel.css` sets a width against `data-glyph`, leaves
  the height to the box, and the proportion cannot drift from the drawing. The
  extents are not interchangeable: the app gives the cup 11 pt and the gear 12
  and says why, *"an outline gear reads lighter than a filled cup at every
  size, and a filled one only catches up at 12."* `chevron.up.chevron.down` is
  the one the site sizes itself, because the app draws it inside a `Picker` and
  names no point size for it. To redo a glyph, render
  `NSImage(systemSymbolName:)` at that symbol's size and weight large enough to
  trace, take the outline, and scale it so a unit is a hundredth of a point;
  nothing in that file is drawn by hand, so nothing in it should be edited by
  hand. **This puts Apple's artwork on a page that is not an Apple platform**,
  which the SF Symbols licence does not cover. It is a deliberate choice rather
  than an oversight, and the one place the site knowingly spends someone else's
  licence rather than narrowing what it shows.
- **Rows the replica does not navigate are drawn faithfully and left inert.**
  A chevron on a row is what the app draws; it is not a promise the site makes.
  The forge block is drawn, with one connected account per vendor, and its two
  rows are never summed — each vendor counts its own thing, so a total across
  them would be a third number belonging to neither. The identity alert and the
  credits stay omitted rather than faked.
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
