---
paths:
  - "src/components/Hero.astro"
  - "src/components/Install.astro"
  - "src/components/MenuBar.astro"
  - "src/panel/HeroPanel.tsx"
  - "src/panel/blink.ts"
  - "src/panel/motion.ts"
---

# The hero and its operable panel

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
  tilting it every time. The tilt keeps the rotation and both shadows,
  which is enough for it to be felt. On a wide scene her eye lands under the
  download button, so the one light on the page falls on the one thing the
  page asks for. **On a
  narrow scene she is anchored beside that button** (`anchor-name: --download`)
  rather than placed by a percentage: a percentage of a hero whose height is its
  copy put the eye behind the headline at every width measured from 360 to
  900 px, 2026-10-03, and beside the button it is still the light on the one
  thing the page asks for. The ambient cannot read an anchor, so on that scene
  `--eye-x` and `--eye-y` follow the button in pixels instead (it ends 225 px
  in at every narrow width, and its centre sits 305 to 414 px down), which is
  close enough for a gradient that soft. A browser without anchor positioning
  keeps the percentage. Her interior is untouched, because the replica stays
  in macOS neutrals.

- **She blinks when numbers land, and never otherwise.** `blink` is
  `SissyMenuBarMotion.blink` — *"Sissy noticing new numbers"* — so the page
  plays it when a figure arrives, on the app's own timing and
  `dataBlinkCooldown`, never on a loop. The page blinks on the panel's first
  presentation, when the menu bar's Sissy at the foot of the page has brought
  it back into view, and when the panel opens a page or a tab, which is a
  deliberate widening of the app's rule — the app blinks on a data frame —
  because opening one is when new figures reach the screen here. It does not blink on the pace band
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
  whether its rows are buttons. The routes are the six tabs, the three gauge
  rows, the commit identity line on the Forge tab,
  the `By effort` row where it is a door, and the back control, and nothing
  else — the period, the picker, refresh, settings, the projects label,
  `Show all`, the sessions' `By repository` fold, `Copy the fix`, Codex's
  `Use…` and the Disk tab's `Clean…` stay drawn and dead, because spending a
  reset or clearing a cache is a write and not a route. The Disk and Network
  pages are drawn as the app opens them, on the background log's last two
  minutes, and do not sample: a fixture has no link to read, and the
  sparklines' hover is not mirrored. The tab and the page are two
  states, as `UsagePanelView` keeps them, so Back from a page returns to the
  tab it was opened from and is named after it, `Back to Forge` from the
  identities page. A tab keeps focus when it is pressed, and its hover names
  it without the app's ⌘ digit, which on a web page belongs to the browser. The
  identity line opens its page on the repository it names, as the app does
  when exactly one is wrong. `By effort` is a door only where the app makes it
  one, when some model leads on another effort or leads by less than
  `effortWholeShare`: Codex's row opens and Claude's two do not, which is the
  split the app's own docs measured. Back returns focus to the row each page
  was opened from, one level at a time. The one gesture that is not
  a route is the day strip's hover, which the same switch turns on: pointing at
  a bar swaps the strip's header and the model pills to that day, as
  `PanelDayBlock` does, and an inert strip keeps the window's header over
  today's pills. The Sessions chart's hover is not mirrored: its caption stays
  the hour's, and the lanes draw no cursor. A gauge row is named
  the way the app names it, with `legendHelp` as an accessibility label and the
  reading beside it as a description, so the name does not swallow the figures.
  The identity row takes no label at all, because the app gives it
  a help string and nothing else: its visible text is its name, which is also what
  keeps the accessible name and the visible label the same words. Focus lands
  on the new page's back control when one opens and returns to the row it came
  from on Back. The island renders inert until it has mounted, so the served
  HTML and the first client render agree and a page without JavaScript shows
  the same Overview with nothing on it that looks pressable. **One row pulses
  until it has been tried.** A replica reads as a screenshot until something
  says otherwise, and the invitation under it is words, so the island marks
  one door at a time with `data-hint`, which the hero draws as a ring and a
  wash in the page's accent, outside the row: the first account, then the
  Sessions tab, then the identity line, each giving way to the next once its
  kind of door has been opened, and nothing once all three have. A door on
  the tab on screen comes first, and a door on another tab is marked through
  that tab only until that tab has been seen: the reader starts on Usage, so
  from Forge or Mac the pulse never calls them back to the accounts, and once
  every tab holding a door has been seen it goes quiet. It led them back once,
  and a pulse that follows you around reads as nagging rather than as an
  invitation. On a tab the ring is the tab's
  own capsule and the pulse breathes inside it, because a ring grown outward
  spills past the bar's rounded end and reads as larger than the tab. It is the
  site's own gesture, set on the DOM rather than passed through the pages,
  because the app has no such thing. Under Reduce Motion the ring stays and
  does not pulse. **The menu bar's Sissy is the way back to the panel.** In
  macOS a click on the status item opens the popover, and the popover on this
  page is the hero's, so the icon in `Install`'s menu bar links to `#panel`.
  The press puts the panel back on the Usage tab at once, as the app reopens, while it is off
  screen, and scrolls it to the middle of the viewport; nothing else moves
  until `scrollend` (or a two-second fallback), when she blinks and focus lands
  on the first gauge row. An arrival started on the panel coming into view
  played during the scroll's long deceleration and read as a late glitch,
  which is why it waits. The icon is drawn unpressed, lit on hover and pressed
  on click, as a status item is, and the sentence beside the menu bar says
  what it does. Without JavaScript the link is a plain anchor. It is the only
  control in that menu bar; the rest stays hidden from assistive technology as
  decoration.
