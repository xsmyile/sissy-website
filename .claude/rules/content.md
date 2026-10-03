---
paths:
  - "src/content/**"
---

# Copy and the money

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
  the artwork her face, so the site says *"The silhouette is drawn from her."*,
  and so does the README since it took the same edit. Where the
  README says nothing, the app's own copy is the source rather than a sentence
  invented here: `Accounts` takes the `Use in CLI` warning from
  `ClaudeAccountSwitchCopy`, because a session already running putting its own
  account back is the part a reader cannot work out, and a site that sold the
  switch without it would be selling a footgun. Code and emphasis do not nest
  in this markup, and `inline.ts` fails the build rather than printing the
  delimiters.

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
