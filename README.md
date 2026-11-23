# Political Compass 4D

Interactive 3D political compass. Every party (and a movable "You" marker) is a vector `[x, y, z, w]` in [-1, 1]⁴. X/Y/Z are space; W is colour (blue → violet → red-orange) and a subtle size change. No build step; Three.js loads from jsDelivr (pinned in the import map in `index.html`).

## Run

```sh
caddy file-server --listen :8080
# app:   http://localhost:8080/
# tests: http://localhost:8080/tests.html   (title becomes PASS / FAIL)
# no-WebGL fallback preview: http://localhost:8080/?nowebgl
```

Any static server works, but ES modules do not load from `file://`.

## Countries

35 countries are included: the Nordics (SE, NO, DK, FI, IS), all 27 EU members, the UK, Argentina, Japan, the US, Canada and India. Pick up to two at a time. Country A is drawn as spheres (●) and country B as diamonds (◆). The leaderboard shows the top 3 parties per selected country. The "You" marker is hidden by default; tick "Show “You” marker" to show it.

**Election-result sizing:** "Adjust for election result" sizes each party bubble by its share of seats in its country's latest election (bubble area is proportional to seat share, parties with no seats stay small). Seat counts live in `countries.js` next to each party, with the election name and chamber size per country. They reflect results as of Nov 2026; France, Argentina and the US are flagged approximate in the UI because I could only find group-level, composition-level or not-yet-final figures. Parties that merged or ran on a joint list are modelled as one entity (for example SPOLU in Czechia, the Centrist Reform Alliance in Japan).

**Axis explainers:** click an axis label in the 3D view, or a pole label under a slider (the only way to reach the W axis), for a short explanation of that end of the axis. The box also lists, for each selected country, the parties furthest toward that end and the seat-weighted lean of its parliament. These examples are computed from the data, not hand-written case studies.

**Grid lines:** the outer box and each grid plane (X–Y, X–Z, Y–Z, floor) have their own checkbox. On load only the outer box is shown; the three axes through the origin are always visible.

**Data transparency:** the "Where do these numbers come from?" button (under the countries) opens a box explaining the method: party X/Y/Z/W values are hand-assigned estimates made with AI assistance (not imported from a survey; only the X and Y scale definitions follow CHES), seat counts come from the latest national election, and how seat-weighted lean and match % are calculated. The text lives in `explain.js` (`DATA_NOTES`).

**Languages:** the UI is in Swedish by default, with English available from the dropdown in the panel header (it shows the country code and flag: SE and GB). `?lang=en` opens the page in English. Strings live in `i18n.js` (`STRINGS`), the longer axis and data explanations in `explain.js`. Static markup uses `data-i18n` attributes; tests check that Swedish and English have identical keys and placeholders. To add a language, add an entry to `LANGS` and `STRINGS` (plus `COUNTRY_NAMES_SV`-style country names and the pole/data-note text). Party names, abbreviations and election chamber names such as Bundestag or Sejm are left in their original form.

Each party label in the 3D view has a small country flag (SVGs from `flag-icons`, pinned to 7.6.0 on jsDelivr). If a flag fails to load, the label just shows the abbreviation.

Party data lives in `countries.js` as `[abbr, name, colour, [x, y, z, w]]` rows, so adding a country is one `country(...)` entry.

## Axes

| Axis | −1 | +1 |
|---|---|---|
| X Economic | State redistribution (left) | Free market (right) |
| Y Sociocultural | TAN | GAL |
| Z Institutional | Institutionalist / technocratic | Anti-establishment / populist |
| W Tempo | Incrementalist / pragmatic | Radical / accelerationist |

Match % is `(1 − d/4) × 100` (4 is the maximum 4D distance). Cosine similarity is `null` (shown as "—") when either vector is the zero vector.

Party positions are illustrative estimates. X and Y loosely follow Chapel Hill Expert Survey dimensions (galtan inverted so GAL = +1); Z and W are subjective.

## Files

- `math.js`: pure 4D math and W→colour/scale mapping (no DOM, no Three.js)
- `data.js`: axis metadata, the "You" marker, slice radius, country limit
- `countries.js`: all countries, their party vectors and latest-election seats
- `explain.js`: axis-pole explanations, data notes (sv/en) and the per-country lean calculation
- `i18n.js`: translations (sv/en), language list, country names and election-label formatting
- `table.js`: DOM helpers and the parties table (also used by the fallback)
- `app.js`: scene, interaction and HUD wiring
- `tests.html`, `tests/math.test.js`: in-browser tests for `math.js`
