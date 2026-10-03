---
paths:
  - "src/styles/**"
  - "src/components/**"
---

# Page palette, footer and links

- **The palette is the seal point Siamese the app is named after.** Graphite
  ground from the icon's gradient, cream text from her coat, the pale glacial
  blue of her eyes as the one accent. Coral `#d97757` appears only inside the
  replica, as Claude's provider tint, never as a page colour.

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

- **Type sizes come from `tokens.css`, not from the component.** Six steps
  (`--text-xs` to `--text-xl`, 12 to 17 px) and one uppercase label
  (`--label-size`, `--label-weight`, `--label-tracking`), which the section
  eyebrow, the legend, the scroll cue and the Privacy table heads share. A
  new size snaps to a step; the replica's own measures stay in `src/panel`.
