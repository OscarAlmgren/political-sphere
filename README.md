# Political Sphere 4D

Interactive 3D political sphere. Every party (and a movable "You" marker) is a vector `[x, y, z, w]` in [-1, 1]⁴. X/Y/Z are space; W is colour (blue → violet → red-orange) and a subtle size change. No build step; Three.js loads from jsDelivr (pinned in the import map in `index.html`).

**Live site:** https://oscaralmgren.github.io/political-sphere/ (Swedish by default, `?lang=en` for English). Contributions are welcome, see [Contributing](#contributing).

## Run

```sh
caddy run --config Caddyfile   # serves this folder on :8080 with no-cache headers
# app:   http://localhost:8080/
# tests: http://localhost:8080/tests.html   (title becomes PASS / FAIL)
# no-WebGL fallback preview: http://localhost:8080/?nowebgl
```

Any static server works, but ES modules do not load from `file://`. The included `Caddyfile` sends `Cache-Control: no-cache`; without that, a browser can keep serving old copies of the JavaScript modules after a reload and the page ends up half old, half new (for example showing raw keys like `gov.title`).

**Cache busting on release:** `index.html` maps every local module (and the stylesheet) to a versioned URL (`?v=…`), so a release can never mix old and new files, even behind GitHub Pages' 10-minute cache. When you change any `.js` or `.css` file, bump the version before releasing: `sed -i '' 's/20261123a/NEWVERSION/g' index.html` (use a new value such as `20261201a`). Add a new local module to the import map in `index.html` too.

## Countries

35 countries are included: the Nordics (SE, NO, DK, FI, IS), all 27 EU members, the UK, Argentina, Japan, the US, Canada and India. Pick up to two at a time. Country A is drawn as spheres (●) and country B as diamonds (◆). The leaderboard shows the top 3 parties per selected country. The "You" marker is hidden by default; tick "Show “You” marker" to show it.

**Election-result sizing:** "Adjust for election result" sizes each party bubble by its share of seats in its country's latest election (bubble area is proportional to seat share, parties with no seats stay small). Seat counts live in `countries.js` next to each party, with the election name and chamber size per country. They reflect results as of Nov 2026; France, Argentina and the US are flagged approximate in the UI because only group-level, composition-level or not-yet-final figures were available. Parties that merged or ran on a joint list are modelled as one entity (for example SPOLU in Czechia, the Centrist Reform Alliance in Japan).

**Axis explainers:** click an axis label in the 3D view, or a pole label under a slider (the only way to reach the W axis), for a short explanation of that end of the axis. The box also lists, for each selected country, the parties furthest toward that end and the seat-weighted lean of its parliament. These examples are computed from the data, not hand-written case studies.

**Grid lines:** the outer box and each grid plane (Economic × Sociocultural = X–Y, Economic × Institutional = X–Z, Sociocultural × Institutional = Y–Z) have their own checkbox. On load only the outer box is shown; the three axes through the origin are always visible.

**Governments:** the "Show governing parties" toggle draws each selected country's government. Governing parties are linked by solid green lines (a minimum spanning tree by 4D closeness, so N−1 lines instead of every pair) and ringed in green; the prime minister's party has a thicker ring and a ★ in the list. Parties that back the government from outside without cabinet posts (confidence-and-supply, budget or legislative agreements) get an amber ring and dashed lines to the prime minister's party. The panel lists the members, outside supporters, parties not on the chart, caretaker status and when the country was last checked. Data lives in `governments.js`; formation can lag, so check the "as of" date. Lines show closeness, not who negotiated with whom.

**Data transparency:** the "Where do these numbers come from?" button (under the countries) opens a box explaining the method: party X/Y/Z/W values are hand-assigned estimates made with AI assistance (not imported from a survey; only the X and Y scale definitions follow CHES), seat counts come from the latest national election, and how seat-weighted lean and match % are calculated. The text lives in `explain.js` (`DATA_NOTES`).

**Languages:** the UI is in Swedish by default, with English available from the dropdown in the panel header (it shows the country code and flag: SE and GB). `?lang=en` opens the page in English. Strings live in `i18n.js` (`STRINGS`), the longer axis and data explanations in `explain.js`. Static markup uses `data-i18n` attributes; tests check that Swedish and English have identical keys and placeholders. To add a language, add an entry to `LANGS` and `STRINGS` (plus `COUNTRY_NAMES_SV`-style country names and the pole/data-note text). Party names, abbreviations and election chamber names such as Bundestag or Sejm are left in their original form.

Each party label in the 3D view has a small country flag (SVGs from `flag-icons`, pinned to 7.6.0 on jsDelivr). If a flag fails to load, the label just shows the abbreviation.

Party data lives in `countries.js` as `[abbr, name, colour, [x, y, z, w], seats]` rows inside one `country(...)` entry per country (see [Adding or correcting data](#adding-or-correcting-data)).

## Axes

| Axis | −1 | +1 |
|---|---|---|
| X Economic | State redistribution (left) | Free market (right) |
| Y Sociocultural | TAN | GAL |
| Z Institutional | Institutionalist / technocratic | Anti-establishment / populist |
| W Tempo | Incrementalist / pragmatic | Radical / accelerationist |

Match % is `(1 − d/4) × 100` (4 is the maximum 4D distance). Cosine similarity is `null` (shown as "—") when either vector is the zero vector.

Party positions are illustrative estimates. X and Y loosely follow Chapel Hill Expert Survey dimensions (galtan inverted so GAL = +1); Z and W are subjective.

## Linked data

The page carries hidden semantic metadata (nothing visible changes):

- **Static JSON-LD in `index.html`**: a `WebApplication` and a `Dataset`, so crawlers see them without running JavaScript.
- **Runtime JSON-LD graph** (`lod.js`): once the page is idle it adds `<script type="application/ld+json" id="ld-graph">` to `<head>`. It describes every country, chamber, election, party and government with schema.org types (`Country`, `GovernmentOrganization`, `Event`, `PoliticalParty`, `Observation`). Each party position is one `Observation` (`observationAbout` the party, `measuredProperty` the axis, `value` −1…+1); seats are one more, dated to the election. Labels carry both languages (`sv`, `en`). Inspect it with `JSON.parse(document.getElementById('ld-graph').textContent)`.
- **Axis vocabulary** (`vocab/axes.jsonld`): a SKOS concept scheme with the four axes and their eight poles, labelled in Swedish and English and linked to Wikidata concepts. The axis URIs used by the observations resolve here. Only `closeMatch` / `relatedMatch` are used, never `exactMatch`: the positions are estimates, and the metadata says so (`measurementTechnique`).
- **Identifiers** (`ids.js`): Wikidata QIDs for countries, chambers, elections and parties (`COUNTRY_IDS` also holds the ISO alpha-3 code that links each country to the EU Publications Office authority list), and [Party Facts](https://partyfacts.herokuapp.com/) ids for parties (Party Facts in turn links to ParlGov, CHES and the Manifesto Project). `null` means "looked for, none exists"; the tests require every country and party to have an entry.

All `@id`s are minted under `https://oscaralmgren.github.io/political-sphere/` (the `BASE` constant in `lod.js`). If the site moves, change that one constant and the same prefix in `vocab/axes.jsonld` and the static block in `index.html`.

## Files

- `math.js`: pure 4D math and W→colour/scale mapping (no DOM, no Three.js)
- `data.js`: axis metadata, the "You" marker, slice radius, country limit
- `countries.js`: all countries, their party vectors and latest-election seats
- `governments.js`: current governments (members, prime minister's party, outside supporters, caretaker status, last-checked month)
- `explain.js`: axis-pole explanations, data notes (sv/en) and the per-country lean calculation
- `i18n.js`: translations (sv/en), language list, country names and election-label formatting
- `table.js`: DOM helpers and the parties table (also used by the fallback)
- `ids.js`: Wikidata and Party Facts identifiers for countries and parties (data only)
- `lod.js`: builds the JSON-LD graph from the data and injects it into `<head>`
- `vocab/axes.jsonld`: SKOS vocabulary for the four axes, their poles and the seats measure
- `app.js`: scene, interaction and HUD wiring
- `tests.html`, `tests/math.test.js`: in-browser tests (math, data integrity, explanations, translations)

## Contributing

Corrections to party positions or seat counts, new countries or languages, bug fixes and accessibility improvements are all welcome.

### Branches

| Branch | Purpose |
|---|---|
| `main` | What is live on GitHub Pages. **Protected:** no direct pushes, no force pushes, and it only accepts pull requests from `test` (the required check "Only test may merge into main" fails for any other source branch, including forks). |
| `test` | Staging. Changes from `dev` are verified here (tests pass, manual check in both languages) before release. |
| `dev` | Integration. **All pull requests target `dev`.** |

Flow: fork the repo → create a branch from `dev` (for example `data/fix-norway-seats`, `fix/tooltip-overflow`, `feat/danish-ui`) → open a pull request **into `dev`, not `main`** (GitHub may default to `main`, so check the base branch) → a maintainer merges `dev` into `test`, verifies it, then merges `test` into `main`, which publishes the site.

### Before you open a pull request

1. Serve the folder with any static server (see [Run](#run)) and open `/tests.html`: the tab title must read `PASS`.
2. Check the change in both Swedish and English (`?lang=en`), on desktop and on a narrow (phone-sized) window.
3. Keep it dependency-free: plain ES modules, no build step, no new runtime libraries. Three.js and the flag icons are pinned to exact versions on the CDN.
4. Keep the pull request focused and describe what changed and why. Fill in the pull request template.
5. Keep keyboard and screen-reader support, touch targets of at least 44px, and `prefers-reduced-motion` behaviour intact.

### Adding or correcting data

All party data is in `countries.js`. A country is one entry:

```js
country('SE', 'Sweden', 'nordic', { chamber: 'Riksdag', date: '2026-09', total: 349 }, [
  ['S', 'Socialdemokraterna', '#ee2020', [-0.35, 0.20, -0.65, -0.60], 99],  // [abbr, name, colour, [x, y, z, w], seats]
  // …
]),
```

- **Seat counts:** cite an official source (the national election authority or parliament, otherwise a reputable news agency) in the pull request. Seats are for the latest national election of the main chamber. Listed seats may not exceed `total` (the tests check this). Use `approx: 'group' | 'composition' | 'notfinal'` in the election object when a figure is not exact.
- **Party positions (X, Y, Z, W):** these are subjective estimates, not measurements (see "Where do these numbers come from?" in the app). If you want to change one, explain your reasoning and what it is based on, for example the party programme, the Chapel Hill Expert Survey or a published analysis. Values range from −1 to +1; abbreviations must be unique within a country.
- **New country:** add the entry (ISO 3166-1 alpha-2 code, which also selects the flag), its Swedish name in `COUNTRY_NAMES_SV` and, where there is a generic English chamber name, a Swedish one in `CHAMBERS_SV` (both in `i18n.js`), an entry in `COUNTRY_IDS` in `ids.js` (Wikidata QIDs of the country, chamber and election, ISO alpha-3), and update the country count asserted in `tests/math.test.js`.
- **New party:** besides the row in `countries.js`, add `'CC:ABBR': { wd: 'Q…', pf: 123 }` to `PARTY_IDS` in `ids.js` (Wikidata QID and Party Facts id, or `null` where none exists) and cite the Wikidata item in the pull request.
- **Governments:** edit the country's entry in `governments.js` (`parties`, `pm`, `support`, `unlisted`, `status`, `verified`) with a source in the pull request. `support` is only for parties that back the government from outside under an agreement, not one-off votes. A new country needs an entry here too (the tests check that every country has one and that all abbreviations exist).
- **Coalitions and mergers:** if a list ran as one entity in the election, model it as one party.

### Translations

User-facing text lives in `STRINGS` in `i18n.js` (and the longer explanations in `explain.js`). Every key must exist in both `sv` and `en` with the same `{placeholders}`: the tests fail otherwise. To add a language, add it to `LANGS` and `STRINGS`, translate the country names and chamber names, and add the axis-pole and data-note text in `explain.js`. Party names and abbreviations are kept in their original form.

### Reporting problems

Open an issue with the browser and version, the language, the steps to reproduce, and a screenshot if it is visual.
