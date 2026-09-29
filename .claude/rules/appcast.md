---
paths:
  - "public/appcast.xml"
---

# The update feed

- **`public/appcast.xml` is the app's update feed, and only the app's release
  workflow writes it.** `release.yml` in the app repository adds each release to
  it with Sparkle's `generate_appcast` and pushes it here, and every copy of Sissy
  checks it daily. The feed and each item carry an EdDSA signature the app
  verifies, so an edit by hand or a rewrite by the build makes every installed
  Sissy refuse it; Biome already skips `public/`. It is served `no-cache` so a release
  reaches the next check rather than the next cache expiry.
