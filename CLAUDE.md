# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Interactive 3D "political sphere" in four dimensions: every party (plus a movable "You" marker) is a vector `[x, y, z, w]` in [-1, 1]⁴. X/Y/Z are drawn as space, W as colour and a subtle size change. UI is Swedish by default (`?lang=en` for English). Plain ES modules, **no build step, no package.json, no npm dependencies**: Three.js and `flag-icons` load from jsDelivr, pinned to exact versions in the import map in `index.html`. Do not add dependencies or a build step.

## Commands

```sh
caddy run --config Caddyfile   # serves the repo root on :8080 with Cache-Control: no-cache
# app:                 http://localhost:8080/
# tests:               http://localhost:8080/tests.html   (browser tab title becomes PASS / FAIL)
# no-WebGL fallback:   http://localhost:8080/?nowebgl
```

- Any static server works, but ES modules don't load from `file://`. Use the no-cache Caddyfile, otherwise the browser mixes stale and fresh modules (symptom: raw keys like `gov.title` in the UI).
- **There is no lint and no CLI test runner.** Tests are one file, `tests/math.test.js`, run in the browser by `tests.html` through a hand-rolled `test(name, fn)` / `assert` harness (no framework, no way to run a single test). To iterate on one, temporarily comment out others or use the browser console.
- Despite the filename, the tests cover far more than math: data integrity of `countries.js`/`governments.js`, translation key parity, explainer text, etc.

## Architecture

Module graph (all in the repo root, flat):

- `math.js` — pure 4D math, W→colour/scale mapping, minimum spanning tree. No DOM, no Three.js.
- `data.js` — axis metadata, the `YOU` marker, `SLICE_RADIUS`, `MAX_COUNTRIES` (2).
- `countries.js` — all party vectors and latest-election seat counts, built via a `country(code, name, group, election, rows)` helper; party rows are `[abbr, name, colour, [x,y,z,w], seats]`. Exports `COUNTRIES`, `COUNTRY_BY_CODE`, `COUNTRY_GROUPS`.
- `governments.js` — per-country current government (`parties`, `pm`, `support`, `unlisted`, `status`, `verified`), keyed by the same ISO codes; abbreviations must exist in `countries.js`.
- `i18n.js` — `STRINGS` (sv/en), `t()`, `LANGS`, country/chamber name translation, `electionLabel`. Imports `countries.js`.
- `explain.js` — longer bilingual text (axis-pole explainers, "where do these numbers come from" `DATA_NOTES`) and `countryLean` (seat-weighted lean per axis).
- `table.js` — DOM helpers (`el`, `flagImg`) and the party table, also used by the no-WebGL fallback.
- `ids.js` — data only: `COUNTRY_IDS` (Wikidata QIDs of country/chamber/election, ISO alpha-3) and `PARTY_IDS` (`'SE:V': { wd, pf }`, Wikidata QID + Party Facts id). Keys are the party `id`s from `countries.js`; `null` means "looked for, none exists".
- `lod.js` — `buildGraph()` (pure, no DOM) turns the data into one JSON-LD graph (schema.org + SKOS axis URIs); `injectGraph()` adds it to `<head>` when idle. Loaded by the inline bootstrap in `index.html`, not by `app.js`, so the no-WebGL fallback gets it and a failure can't break the app. Party positions are `schema:Observation` nodes because `additionalProperty` is not valid on `Organization`.
- `vocab/axes.jsonld` — hand-written SKOS scheme: the 4 axes, 8 poles and a `#seats` measure. Labels must equal the `axis.*` strings in `i18n.js` (tests check). Only `closeMatch`/`relatedMatch`, never `exactMatch`: the positions are estimates.
- `app.js` (~1100 lines) — the whole scene, interaction and HUD wiring: one module-level `state` object, Three.js scene + `CSS2DRenderer` labels, rebuild functions (e.g. `rebuildGovernment`) that redraw from `state`, and `onLangChange` re-rendering.

Things that span files:

- **Slots, not a list:** at most two countries are selected at once. Slot 0 (A) renders as spheres, slot 1 (B) as diamonds; `state.slots` holds country codes.
- **i18n is two-layer:** static markup in `index.html` uses `data-i18n*` attributes (applied by `retranslate`); dynamic text goes through `t()`/`tr()`/`trAttr()`/`trCountry()` and must be re-run on `onLangChange`. Party names/abbreviations and chamber names like Bundestag are intentionally left untranslated.
- **Match %** is `(1 − d/4) × 100` (4 = max 4D distance); cosine similarity is `null` (shown "—") for a zero vector.
- Party positions are illustrative, hand-assigned estimates, not survey data; seats are for the latest national election of the main chamber (`approx: 'group' | 'composition' | 'notfinal'` flags inexact countries).
- Governments are drawn as a minimum spanning tree (N−1 solid lines) over 4D distance between governing parties; outside supporters get dashed lines to the PM's party.

## Gotchas when changing things

- **Cache busting:** `index.html` maps every local module and the stylesheet to a `?v=…` URL. When you change any `.js`/`.css` for a release, bump the version everywhere with `sed -i '' 's/OLDVERSION/NEWVERSION/g' index.html` (take OLDVERSION from the current import map; the README's example value is out of date). A **new local module must also be added to the import map**.
- **Adding a country** touches several files: the `country(...)` entry in `countries.js`, `COUNTRY_NAMES_SV` (and `CHAMBERS_SV` if needed) in `i18n.js`, an entry in `governments.js`, an entry in `COUNTRY_IDS` and one `PARTY_IDS` entry per party in `ids.js`, and the country count asserted in `tests/math.test.js` (tests enforce all of these). Adding a single party also needs its `PARTY_IDS` entry. Changing an axis label or pole means updating `vocab/axes.jsonld` too. The `@id` base URL is the `BASE` constant in `lod.js` (repeated in `vocab/axes.jsonld` and the static JSON-LD in `index.html`).
- **Adding/changing a string:** every key must exist in both `sv` and `en` with identical `{placeholders}`; tests fail otherwise. Adding a language means `LANGS` + `STRINGS` + country names + `explain.js` pole/data-note text.
- Listed seats per country must not exceed the election `total`; party abbreviations must be unique within a country; vector values within [-1, 1].
- Preserve keyboard/screen-reader support, ≥44px touch targets and `prefers-reduced-motion` behaviour.

## Git workflow

Branches: `dev` (integration, **all PRs target `dev`**) → `test` (staging) → `main` (live on GitHub Pages, protected). A required CI check (`.github/workflows/main-source.yml`) rejects any PR into `main` that doesn't come from `test`, including forks. Branch off `dev`, never push to `main`. PRs use `.github/pull_request_template.md` (data changes need a cited source; verify `/tests.html` shows PASS and check both `sv` and `?lang=en`).
