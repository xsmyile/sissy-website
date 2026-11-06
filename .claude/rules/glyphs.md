---
paths:
  - "src/panel/components/Glyph.tsx"
  - "src/panel/panel.css"
---

# Glyphs

- **The glyphs are the app's own symbols, converted.** The app draws every glyph
  from Hugeicons' free Stroke Rounded set, compiled by its
  `scripts/generate-glyphs.py` into custom SF Symbols, one drawing and one
  weight each. `Glyph.tsx` carries that drawing, at the point size
  `UsagePanelView` and its neighbours give that glyph, so a glyph on the page is
  the glyph in the app rather than a drawing that resembles one. **A viewBox unit
  is a hundredth of a point**, which is what makes the box the symbol's own
  extent: `Coffee02` at 14 pt covers 15.28 x 14.55 pt and its viewBox is
  `0 0 1528 1455`, so `panel.css` sets a width against `data-glyph`, leaves the
  height to the box, and the proportion cannot drift from the drawing. The
  extents are not interchangeable: the app gives the cup 14 pt and the gear 12
  and says why, the cup fills less of its square, so at 14 it carries the ink the
  gear does at 12. To redo a glyph or add one: take its `Regular-S` paths from
  `app/Sissy/Resources/Assets.xcassets/Glyphs/<Name>.symbolset/`, which are
  absolute `M`, `L`, `C` and `Z` with a `translate` on the group. Measure the ink
  by compiling that catalogue with `xcrun actool` into a bundle, drawing
  `NSImage(symbolName:bundle:variableValue:)` at the point size times 40 over
  white, and cropping to the ink. Scale the paths to that box, and compare the
  two with pixel IoU: 0.98 or better, the thin outlines' edges being what is left.
  Nothing in that file is drawn by hand, so nothing in it should be edited by
  hand. Hugeicons is MIT, and its notice ships from
  `public/THIRD-PARTY-NOTICES.md`.

- **`chevron.up.chevron.down` is the one SF Symbol left**, in the closed pickers
  and on the identity block's menu, because there the system draws it rather than
  the app: its `Picker` and `menuIndicator` name no glyph and no point size, so
  the site sizes it itself. It keeps the old recipe: render
  `NSImage(systemSymbolName:)`, trace it, scale it. **That one puts Apple's
  artwork on a page that is not an Apple platform**, which the SF Symbols licence
  does not cover. It is a deliberate choice, and the one place the site knowingly
  spends someone else's licence rather than narrowing what it shows.
