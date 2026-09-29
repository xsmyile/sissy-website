---
paths:
  - "src/panel/components/Glyph.tsx"
  - "src/panel/panel.css"
---

# Glyphs

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
