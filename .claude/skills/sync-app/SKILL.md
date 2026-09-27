---
name: sync-app
description: Bring the site up to date with what changed in the Sissy app since the last sync. Reads the app's commits since the recorded baseline, sorts them onto the mirror pairs in AGENTS.md and the README, proposes site changes for approval, then implements the approved ones and moves the baseline. Use when the user asks what is new in Sissy, to sync the site with the app, or to update the replica after an app release.
argument-hint: "[app ref, default origin/master]"
---

# Sync the site with the app

The site mirrors the app file for file (see the mirror pairs in `AGENTS.md`),
so every app change that touches a mirrored file, a user-facing string or the
README is a candidate site change. This skill finds them, proposes, and
implements only what the user approves.

## 1. Resolve the range

- **Baseline**: the app commit the site is aligned to, in `baseline` beside this
  file. Never infer it from dates: the app rebases, and its commit dates are
  not in order.
- **App repo**: `$SISSY_APP_REPO` if set, otherwise ask the user for the path to
  a local clone of `xsmyile/sissy`. Run `git -C <repo> fetch origin` and use
  `origin/master` unless the user passed a ref. Never check out or change
  anything in that clone.
- If the user has no clone, read the range with
  `gh api repos/xsmyile/sissy/compare/<baseline>...master` instead.
- If `baseline` equals the target, say the site is in sync and stop.

## 2. Sort the changes

List `git log --oneline <baseline>..<target>` and the files each commit touches.
Put every commit in exactly one bucket:

| Bucket | What lands in it | Site impact |
|---|---|---|
| Mirror | `app/Sissy/Panel/*.swift`, `Settings/ProvidersSettingsView.swift`, `Settings/ForgeSettings.swift`, `Settings/SettingsCredentialRow.swift`, `SissyMenuBarMotion.swift`, any other file named as a pair in `AGENTS.md` | The site file of that pair must change, plus `src/panel/data.ts` if a new field appears |
| Copy | `*Copy` enums, `UsageFormat` wording, `README.md` | A string the site quotes, the Privacy host table, Install, the footer |
| Feature | A `feat:` that adds something a user sees but no mirrored file shows yet | A proposal: where it would go on the page, or why it should not |
| Ignore | Release, CI, tests, build, login window, engine internals with no visible effect | Nothing; list them in one line so the user sees they were read |

For each Mirror and Copy commit, read the diff, not the subject. For the README,
diff `README.md` across the range and check every sentence the site narrows
(`src/content/`) and the Privacy host table row by row.

## 3. Propose

Give the user a short table: change, bucket, proposed site edit, files. Mark each
Mirror edit as required (the replica would otherwise draw something the app no
longer draws) and each Feature as optional with a recommendation. Say plainly
when a fixture change would ripple, for example a window value that changes
the Overview's gauge or the binding window.

Then ask with AskUserQuestion, multiSelect, one option per proposal (group them
if there are more than four). Implement nothing before the answer.

## 4. Implement what was approved

- Follow `AGENTS.md`: read the Swift, keep the fixture internally consistent,
  copy lives in `src/content/`, new SF Symbols go through the glyph pipeline and
  an IoU check, never drawn by hand.
- Add or update the mirror-pair sentence in `AGENTS.md` when a new pair appears.
- `npm run check`, `npm run build`, then screenshot every section that changed
  from `astro preview` with the Playwright headless shell (the recipe is in
  `AGENTS.md` and the screenshot notes), at 1440 and 390 wide.
- Write the target commit's short hash into `baseline` in the same change set,
  so the next run starts where this one stopped. Move it even when the user
  approved nothing: the commits were read and declined.
- Report what changed, what was declined, and anything the app's README should
  say that it does not (the user owns the README).
