---
paths:
  - "src/motion/**"
  - "src/components/Section.astro"
  - "src/panel/HeroPanel.tsx"
---

# Arrival motion

- **The rhythm is three tiers, and the motion is the tier.** Limits, Accounts,
  Keep awake, Git, Privacy and Install carry the decision and rise on arrival; Agents
  supports them and barely settles; How it works does not move. A section does not
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
  departure.** The band's 69 counting up while its bar draws is the app's
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
