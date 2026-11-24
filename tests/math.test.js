import {
  euclideanDistance4D, cosineSimilarity4D, matchPercent, getClosestMatches,
  wToColor, wToScale, seatScale, clampVec4, isValidVec4, W_STOPS_HEX,
} from '../math.js';
import { POLES, DATA_NOTES, getPole, getDataNotes, poleKey, isCustomAxis, strengthWord, countryLean, AXIS_KEYS } from '../explain.js';
import { STRINGS, LANGS, DEFAULT_LANG, t, useLang, countryName, electionLabel } from '../i18n.js';
import { COUNTRIES, COUNTRY_BY_CODE, COUNTRY_GROUPS } from '../countries.js';
import { GOVERNMENTS, GOVERNMENT_BY_CODE } from '../governments.js';
import { minimumSpanningTree } from '../math.js';
import { COUNTRY_IDS, PARTY_IDS } from '../ids.js';
import { buildGraph, BASE, VOCAB, axisId, seatsId, datasetId, methodId, partyId, observationId } from '../lod.js';

const PARTIES = COUNTRY_BY_CODE.get('SE').parties;

const results = [];
const near = (a, b, eps = 1e-6) => Math.abs(a - b) <= eps;
function test(name, fn) {
  try { fn(); results.push({ name, ok: true }); }
  catch (e) { results.push({ name, ok: false, err: e.message }); }
}
function assert(cond, msg = 'assertion failed') { if (!cond) throw new Error(msg); }
/** Same as test(), for tests that fetch files. Awaited at top level, so the results are complete before they are drawn. */
async function testAsync(name, fn) {
  try { await fn(); results.push({ name, ok: true }); }
  catch (e) { results.push({ name, ok: false, err: e.message }); }
}

test('distance: identical vectors = 0', () => assert(euclideanDistance4D([0.1, 0.2, 0.3, 0.4], [0.1, 0.2, 0.3, 0.4]) === 0));
test('distance: opposite corners = 4', () => assert(near(euclideanDistance4D([-1, -1, -1, -1], [1, 1, 1, 1]), 4)));
test('distance: 4D Pythagorean (1,2,2,4)->5', () => assert(near(euclideanDistance4D([0, 0, 0, 0], [0.2, 0.4, 0.4, 0.8]), 1)));
test('cosine: parallel = 1', () => assert(near(cosineSimilarity4D([1, 0, 0, 0], [0.5, 0, 0, 0]), 1)));
test('cosine: antiparallel = -1', () => assert(near(cosineSimilarity4D([1, 1, 0, 0], [-1, -1, 0, 0]), -1)));
test('cosine: orthogonal = 0', () => assert(near(cosineSimilarity4D([1, 0, 0, 0], [0, 0, 0, 1]), 0)));
test('cosine: zero vector -> null', () => {
  assert(cosineSimilarity4D([0, 0, 0, 0], [1, 1, 1, 1]) === null);
  assert(cosineSimilarity4D([1, 1, 1, 1], [0, 0, 0, 0]) === null);
});
test('matchPercent: 0 -> 100, 4 -> 0, 2 -> 50', () => {
  assert(matchPercent(0) === 100); assert(matchPercent(4) === 0); assert(near(matchPercent(2), 50));
});
test('getClosestMatches: sorted ascending, exact match first at 100%', () => {
  const sd = PARTIES.find((p) => p.id === 'SE:SD');
  const res = getClosestMatches([...sd.vec], PARTIES);
  assert(res[0].entity.id === 'SE:SD' && res[0].distance === 0 && res[0].matchPct === 100);
  for (let i = 1; i < res.length; i++) assert(res[i - 1].distance <= res[i].distance, 'not sorted');
  assert(res.length === PARTIES.length);
});
test('getClosestMatches: does not mutate input', () => {
  const before = PARTIES.map((p) => p.id).join();
  getClosestMatches([0, 0, 0, 0], PARTIES);
  assert(PARTIES.map((p) => p.id).join() === before);
});
test('getClosestMatches: origin has null cosine, finite distance', () => {
  const r = getClosestMatches([0, 0, 0, 0], PARTIES)[0];
  assert(r.cosine === null && Number.isFinite(r.distance));
});
const hexToRgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
test('wToColor: endpoints and midpoint match stops', () => {
  const pairs = [[-1, W_STOPS_HEX.cool], [0, W_STOPS_HEX.neutral], [1, W_STOPS_HEX.hot]];
  for (const [w, hex] of pairs) {
    const c = wToColor(w), e = hexToRgb(hex);
    assert(c.every((v, i) => near(v, e[i], 0.01)), `w=${w}`);
  }
});
test('wToColor: output within 0..1 across range', () => {
  for (let w = -1; w <= 1; w += 0.05) assert(wToColor(w).every((v) => v >= 0 && v <= 1));
});
test('wToScale: 0.9 .. 1.15, monotonic', () => {
  assert(near(wToScale(-1), 0.9) && near(wToScale(1), 1.15) && wToScale(0) > wToScale(-0.5));
});
test('clampVec4 / isValidVec4', () => {
  assert(clampVec4([2, -3, 0.5, 1]).join() === '1,-1,0.5,1');
  assert(isValidVec4([0, 0, 0, 0]) && !isValidVec4([0, 0, 0]) && !isValidVec4([0, 0, 0, 1.5]) && !isValidVec4([0, 0, 0, NaN]));
});
test('data: Sweden has the 8 Riksdag parties', () => {
  assert(PARTIES.length === 8 && PARTIES.every((p) => isValidVec4(p.vec)));
});

const EU27 = ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE'];
test('countries: all 27 EU members, Nordics, UK, AR, JP, US, CA, IN present', () => {
  for (const code of [...EU27, 'NO', 'IS', 'GB', 'AR', 'JP', 'US', 'CA', 'IN']) assert(COUNTRY_BY_CODE.has(code), `missing ${code}`);
  assert(COUNTRIES.length === 35, `expected 35 countries, got ${COUNTRIES.length}`);
});
test('countries: unique codes, valid groups, Nordic = SE NO DK FI IS', () => {
  assert(new Set(COUNTRIES.map((c) => c.code)).size === COUNTRIES.length, 'duplicate country code');
  const groups = new Set(COUNTRY_GROUPS.map((g) => g.id));
  assert(COUNTRIES.every((c) => groups.has(c.group)), 'unknown group');
  assert(COUNTRIES.filter((c) => c.group === 'nordic').map((c) => c.code).sort().join() === 'DK,FI,IS,NO,SE');
});
test('countries: every party vector is a valid 4D vector', () => {
  for (const c of COUNTRIES) for (const p of c.parties) assert(isValidVec4(p.vec), `${p.id} invalid`);
});
test('countries: party ids globally unique, abbreviations unique within a country, every country has 2+ parties', () => {
  const ids = COUNTRIES.flatMap((c) => c.parties.map((p) => p.id));
  assert(new Set(ids).size === ids.length, 'duplicate party id');
  for (const c of COUNTRIES) {
    assert(c.parties.length >= 2, `${c.code} has too few parties`);
    assert(new Set(c.parties.map((p) => p.abbr)).size === c.parties.length, `${c.code} duplicate abbr`);
    assert(c.parties.every((p) => p.country === c.code && /^#[0-9a-f]{6}$/i.test(p.partyColor)), `${c.code} bad field`);
  }
});

test('countries: seats never exceed the chamber and cover most of it', () => {
  for (const c of COUNTRIES) {
    const sum = c.parties.reduce((s, p) => s + p.seats, 0);
    assert(c.parties.every((p) => Number.isInteger(p.seats) && p.seats >= 0 && p.total === c.election.total), `${c.code} bad seats`);
    assert(sum <= c.election.total, `${c.code}: ${sum} seats > ${c.election.total}`);
    assert(sum / c.election.total >= 0.75, `${c.code}: only ${sum} of ${c.election.total} seats listed`);
  }
});
test('countries: Sweden 2026, S largest with 99 of 349', () => {
  const se = COUNTRY_BY_CODE.get('SE');
  assert(se.election.total === 349 && se.parties.reduce((s, p) => s + p.seats, 0) === 349);
  const top = [...se.parties].sort((a, b) => b.seats - a.seats)[0];
  assert(top.abbr === 'S' && top.seats === 99);
});

test('seatScale: 15% share = 1x, 0 seats floor, majority ~2x, monotonic', () => {
  assert(near(seatScale(15, 100), 1));
  assert(seatScale(0, 100) === 0.35 && seatScale(null, 100) === 0.35 && seatScale(5, 0) === 0.35);
  assert(seatScale(60, 100) > 1.9 && seatScale(100, 100) === 2.2);
  assert(seatScale(99, 349) > seatScale(70, 349) && seatScale(70, 349) > seatScale(19, 349));
});

test('explain: all 8 poles defined with content, in every language', () => {
  for (const lang of Object.keys(STRINGS)) for (const axis of [0, 1, 2, 3]) for (const sign of [-1, 1]) {
    const p = getPole(axis, sign, lang);
    assert(p && p.title && p.aka && p.summary && p.typical.length >= 3, `missing pole ${lang} ${axis}${sign}`);
  }
  assert(Object.keys(POLES.sv).sort().join() === Object.keys(POLES.en).sort().join(), 'sv and en poles differ');
  assert(poleKey(1, -1) === 'y-' && poleKey(3, 1) === 'w+');
  assert(!isCustomAxis(0) && !isCustomAxis(1) && isCustomAxis(2) && isCustomAxis(3));
});
test('explain: Sweden TAN end is led by SD then KD; weighted lean is finite', () => {
  const r = countryLean(COUNTRY_BY_CODE.get('SE'), 1, -1);
  assert(r.leaders[0].party.abbr === 'SD' && r.leaders[1].party.abbr === 'KD', 'wrong leaders');
  assert(r.leaders.every((l) => l.lean >= 0.2) && Number.isFinite(r.weighted));
});
test('explain: pole with no strong party returns no leaders; signs mirror', () => {
  assert(countryLean(COUNTRY_BY_CODE.get('MT'), 2, 1).leaders.length === 0);
  const se = COUNTRY_BY_CODE.get('SE');
  assert(near(countryLean(se, 0, 1).weighted, -countryLean(se, 0, -1).weighted));
});
test('explain: data notes are honest about how party values were made (en)', () => {
  const notes = getDataNotes('en');
  const text = JSON.stringify(notes);
  assert(notes.sections.length >= 4 && notes.sections.every((s) => s.id && s.heading));
  assert(text.includes('assigned by hand') && text.includes('not copied or computed from a survey'), 'must say values are hand-assigned estimates');
  assert(text.includes('Seat-weighted lean') && text.includes('Match %'), 'must explain the weighted numbers and match score');
});
test('explain: data notes are honest about how party values were made (sv)', () => {
  const notes = getDataNotes('sv');
  const text = JSON.stringify(notes);
  assert(text.includes('tilldelats för hand') && text.includes('inte kopierade eller beräknade'), 'sv must say values are hand-assigned estimates');
  assert(text.includes('mandatviktade') && text.includes('Matchning %'), 'sv must explain the weighted numbers and match score');
  assert(notes.sections.map((s) => s.id).join() === DATA_NOTES.en.sections.map((s) => s.id).join(), 'section ids differ between languages');
});
test('explain: strengthWord thresholds', () => {
  assert(strengthWord(0.05) === 'neutral' && strengthWord(-0.2) === 'slightly' && strengthWord(0.4) === 'moderately' && strengthWord(-0.8) === 'strongly');
});

const placeholders = (s) => (s.match(/\{\w+\}/g) ?? []).sort().join();
test('i18n: Swedish is the default; sv and en have identical keys and placeholders', () => {
  assert(DEFAULT_LANG === 'sv');
  const sv = Object.keys(STRINGS.sv).sort(), en = Object.keys(STRINGS.en).sort();
  const missingInEn = sv.filter((k) => !(k in STRINGS.en)), missingInSv = en.filter((k) => !(k in STRINGS.sv));
  assert(!missingInEn.length && !missingInSv.length, `key mismatch: en lacks [${missingInEn}] sv lacks [${missingInSv}]`);
  for (const k of sv) {
    assert(STRINGS.sv[k].trim() && STRINGS.en[k].trim(), `empty string for ${k}`);
    assert(placeholders(STRINGS.sv[k]) === placeholders(STRINGS.en[k]), `placeholder mismatch in ${k}`);
  }
});
test('i18n: language menu shows country code + flag for each language', () => {
  assert(LANGS.map((l) => l.lang).join() === 'sv,en' && LANGS[0].code === 'SE' && LANGS[0].flag === 'se' && LANGS[1].flag === 'gb');
  assert(LANGS.every((l) => STRINGS[l.lang]));
});
test('i18n: t() fills placeholders and resolves @key arguments; missing keys fall back to the key', () => {
  useLang('en');
  assert(t('slice.on', { n: 3, m: 8, r: 0.4 }) === '3 of 8 parties within ±0.4 of your pace of change');
  assert(t('slider.poleNeg', { pole: '@axis.y.neg' }) === 'TAN (−1)');
  assert(t('no.such.key') === 'no.such.key');
  useLang('sv');
  assert(t('slice.on', { n: 3, m: 8, r: 0.4 }) === '3 av 8 partier inom ±0.4 från din förändringstakt');
  assert(t('slider.polePos', { pole: '@axis.x.pos' }) === '(+1) Fri marknad');
});
test('i18n: country names and election labels follow the language', () => {
  useLang('sv');
  assert(countryName('GB') === 'Storbritannien' && countryName(COUNTRY_BY_CODE.get('DE')) === 'Tyskland');
  assert(electionLabel(COUNTRY_BY_CODE.get('SE').election) === 'Riksdagen, sep 2026');
  assert(electionLabel(COUNTRY_BY_CODE.get('GB').election) === 'Underhuset, jul 2024');
  assert(electionLabel(COUNTRY_BY_CODE.get('FR').election).includes('ungefärligt'));
  useLang('en');
  assert(countryName('GB') === 'United Kingdom' && electionLabel(COUNTRY_BY_CODE.get('SE').election) === 'Riksdag, Sep 2026');
  assert(electionLabel(COUNTRY_BY_CODE.get('US').election).includes('not final'));
  useLang('sv');
});
test('i18n: every country has a Swedish name and a structured election', () => {
  useLang('sv');
  for (const c of COUNTRIES) {
    assert(countryName(c).length > 1, `no name for ${c.code}`);
    assert(/^\d{4}-(0[1-9]|1[0-2])$/.test(c.election.date) && c.election.chamber && c.election.total > 0, `bad election for ${c.code}`);
  }
  assert(COUNTRIES.filter((c) => countryName(c) === c.name).length <= 6, 'too many untranslated country names');
});

test('mst: n-1 edges linking the nearest neighbours (points on a line)', () => {
  const xs = [0, 1, 3, 7];
  const edges = minimumSpanningTree(xs.length, (i, j) => Math.abs(xs[i] - xs[j]));
  assert(edges.length === 3, 'expected 3 edges');
  const key = (e) => [...e].sort((a, b) => a - b).join('-');
  assert(edges.map(key).sort().join() === '0-1,1-2,2-3', `got ${edges.map(key)}`);
});
test('mst: no edges for fewer than two items; connected for any size', () => {
  assert(minimumSpanningTree(0, () => 1).length === 0 && minimumSpanningTree(1, () => 1).length === 0);
  const n = 6, pts = [[0, 0], [5, 0], [5, 5], [0, 5], [2, 2], [9, 9]];
  const edges = minimumSpanningTree(n, (i, j) => Math.hypot(pts[i][0] - pts[j][0], pts[i][1] - pts[j][1]));
  assert(edges.length === n - 1);
  const seen = new Set([0]);
  for (let k = 0; k < n; k++) for (const [a, b] of edges) { if (seen.has(a)) seen.add(b); if (seen.has(b)) seen.add(a); }
  assert(seen.size === n, 'tree is not connected');
});

test('governments: every country has one, with parties that exist on the chart', () => {
  for (const code of Object.keys(GOVERNMENTS)) assert(COUNTRY_BY_CODE.has(code), `unknown country ${code}`);
  for (const c of COUNTRIES) {
    const g = GOVERNMENT_BY_CODE.get(c.code);
    assert(g, `no government for ${c.code}`);
    const abbrs = new Set(c.parties.map((p) => p.abbr));
    for (const a of [...g.parties, ...g.support]) assert(abbrs.has(a), `${c.code}: unknown party ${a}`);
    assert(g.parties.length >= 1, `${c.code}: empty government`);
    assert(g.pm === null || g.parties.includes(g.pm), `${c.code}: pm ${g.pm} is not in the government`);
    assert(!g.parties.some((a) => g.support.includes(a)), `${c.code}: a party is both in government and outside support`);
    assert(/^\d{4}-(0[1-9]|1[0-2])$/.test(g.verified), `${c.code}: bad verified date`);
    assert(g.status === null || g.status === 'caretaker', `${c.code}: unknown status`);
    if (g.note) assert(g.note.en && g.note.sv, `${c.code}: note needs both languages`);
  }
});
test('governments: known cases (Sweden caretaker with SD support, Slovenia with Resni.ca, single-party Malta)', () => {
  const se = GOVERNMENT_BY_CODE.get('SE');
  assert(se.status === 'caretaker' && se.parties.join() === 'M,KD,L' && se.support.join() === 'SD' && se.pm === 'M');
  assert(GOVERNMENT_BY_CODE.get('SI').support.join() === 'RES');
  assert(GOVERNMENT_BY_CODE.get('MT').parties.join() === 'PL');
  assert(GOVERNMENT_BY_CODE.get('CY').pm === null);
});

/* ---------------------------------------------------------------- linked data (ids.js, lod.js, vocab/axes.jsonld) */
const QID = /^Q[1-9]\d*$/;

test('ids: every country and party has an entry, with every field present (null = deliberately no identifier)', () => {
  assert(Object.keys(COUNTRY_IDS).length === COUNTRIES.length, 'COUNTRY_IDS and COUNTRIES differ in size');
  for (const c of COUNTRIES) {
    const ci = COUNTRY_IDS[c.code];
    assert(ci, `no COUNTRY_IDS entry for ${c.code}`);
    for (const f of ['wd', 'iso3', 'chamber', 'election']) assert(f in ci, `${c.code}: COUNTRY_IDS is missing "${f}"`);
    for (const p of c.parties) {
      assert(p.id in PARTY_IDS, `no PARTY_IDS entry for ${p.id}`);
      for (const f of ['wd', 'pf']) assert(f in PARTY_IDS[p.id], `${p.id}: PARTY_IDS is missing "${f}"`);
    }
  }
  const known = new Set(COUNTRIES.flatMap((c) => c.parties.map((p) => p.id)));
  for (const k of Object.keys(PARTY_IDS)) assert(known.has(k), `PARTY_IDS has an entry for a party that does not exist: ${k}`);
});
test('ids: formats (Wikidata QIDs, ISO 3166-1 alpha-3, Party Facts integers) and no duplicates', () => {
  for (const [code, ci] of Object.entries(COUNTRY_IDS)) {
    assert(QID.test(ci.wd), `${code}: bad country QID ${ci.wd}`);
    assert(QID.test(ci.chamber), `${code}: bad chamber QID ${ci.chamber}`);
    assert(/^[A-Z]{3}$/.test(ci.iso3), `${code}: bad ISO alpha-3 ${ci.iso3}`);
    assert(ci.election === null || QID.test(ci.election), `${code}: bad election QID ${ci.election}`);
  }
  // Unique within a country. The same party may legitimately sit in two countries (Sinn Féin in IE and GB).
  for (const c of COUNTRIES) {
    const wds = [], pfs = [];
    for (const p of c.parties) {
      const pi = PARTY_IDS[p.id];
      assert(pi.wd === null || QID.test(pi.wd), `${p.id}: bad Wikidata QID ${pi.wd}`);
      assert(pi.pf === null || (Number.isInteger(pi.pf) && pi.pf > 0), `${p.id}: bad Party Facts id ${pi.pf}`);
      if (pi.wd) wds.push(pi.wd);
      if (pi.pf) pfs.push(pi.pf);
    }
    assert(new Set(wds).size === wds.length, `${c.code}: duplicate party QID ${wds.find((q, i) => wds.indexOf(q) !== i)}`);
    assert(new Set(pfs).size === pfs.length, `${c.code}: duplicate Party Facts id ${pfs.find((q, i) => pfs.indexOf(q) !== i)}`);
  }
});

test('lod: unique @ids; every party has its four axis observations (equal to its vector) and a seats observation', () => {
  const g = buildGraph()['@graph'];
  const ids = g.map((n) => n['@id']);
  assert(new Set(ids).size === ids.length, `duplicate @id: ${ids.find((q, i) => ids.indexOf(q) !== i)}`);
  const byId = new Map(g.map((n) => [n['@id'], n]));
  for (const c of COUNTRIES) {
    for (const p of c.parties) {
      const node = byId.get(partyId(c.code, p.abbr));
      assert(node && node['@type'] === 'PoliticalParty', `${p.id}: no PoliticalParty node`);
      AXIS_KEYS.forEach((k, i) => {
        const o = byId.get(observationId(c.code, p.abbr, k));
        assert(o && o['@type'] === 'Observation', `${p.id}: no ${k} observation`);
        assert(o.value === p.vec[i], `${p.id}: ${k} is ${o.value}, expected ${p.vec[i]}`);
        assert(o.observationAbout['@id'] === node['@id'] && o.measuredProperty['@id'] === axisId(k), `${p.id}: ${k} observation points at the wrong party or axis`);
      });
      const s = byId.get(observationId(c.code, p.abbr, 'seats'));
      if (p.seats == null) assert(!s, `${p.id}: seats observation without seats`);
      else assert(s && s.value === p.seats && s.maxValue === c.election.total && s.measuredProperty['@id'] === seatsId, `${p.id}: bad seats observation`);
    }
  }
});
test('lod: every reference into this site resolves to a node (or to a known axis / the seats concept)', () => {
  const g = buildGraph()['@graph'];
  const have = new Set(g.map((n) => n['@id']));
  const vocab = new Set([...AXIS_KEYS.map(axisId), seatsId]);
  const bad = [];
  (function walk(v) {
    if (Array.isArray(v)) return v.forEach(walk);
    if (!v || typeof v !== 'object') return;
    const keys = Object.keys(v);
    if (keys.length === 1 && keys[0] === '@id' && v['@id'].startsWith(BASE) && !have.has(v['@id']) && !vocab.has(v['@id'])) bad.push(v['@id']);
    Object.values(v).forEach(walk);
  })(g);
  assert(!bad.length, `dangling references: ${bad.slice(0, 5).join(', ')}`);
  assert(have.has(datasetId) && have.has(methodId), 'dataset or method node missing');
});
test('lod: governments only point at parties that exist, one government node per country', () => {
  const g = buildGraph()['@graph'];
  const have = new Set(g.map((n) => n['@id']));
  const govs = g.filter((n) => n['@type'] === 'GovernmentOrganization' && n['@id'].includes('#government-'));
  assert(govs.length === COUNTRIES.length, `${govs.length} government nodes for ${COUNTRIES.length} countries`);
  for (const gov of govs) for (const role of gov.member) {
    const m = role.member;
    assert(m['@id'] ? have.has(m['@id']) : m.name, `${gov['@id']}: role points at nothing`);
  }
});
test('lod: the graph survives a JSON round trip unchanged', () => {
  const g = buildGraph();
  assert(JSON.stringify(JSON.parse(JSON.stringify(g))) === JSON.stringify(g));
});

await testAsync('vocab: axes.jsonld defines 4 axes and 8 poles whose labels equal the UI strings (sv and en)', async () => {
  const res = await fetch(new URL('../vocab/axes.jsonld', import.meta.url));
  assert(res.ok, `vocab/axes.jsonld: HTTP ${res.status}`);
  const doc = await res.json();
  const byId = new Map(doc['@graph'].map((n) => [n['@id'], n]));
  const label = (node, lang) => {
    const l = [].concat(node['skos:prefLabel']).find((x) => x['@language'] === lang);
    return l && l['@value'];
  };
  for (const k of AXIS_KEYS) {
    const axis = byId.get(axisId(k));
    assert(axis, `axes.jsonld has no #${k}`);
    for (const lang of ['sv', 'en']) assert(label(axis, lang) === STRINGS[lang][`axis.${k}.name`], `#${k} ${lang} label differs from axis.${k}.name`);
    for (const pole of ['neg', 'pos']) {
      const node = byId.get(`${VOCAB}#${k}-${pole}`);
      assert(node, `axes.jsonld has no #${k}-${pole}`);
      assert([].concat(node['skos:broader']).some((b) => b['@id'] === axisId(k)), `#${k}-${pole} is not broader-linked to #${k}`);
      for (const lang of ['sv', 'en']) assert(label(node, lang) === STRINGS[lang][`axis.${k}.${pole}`], `#${k}-${pole} ${lang} label differs from axis.${k}.${pole}`);
    }
  }
  assert(byId.has(seatsId), 'axes.jsonld has no #seats');
  for (const n of doc['@graph']) assert(!('skos:exactMatch' in n), `${n['@id']} uses skos:exactMatch: the axes are estimates, only close/related/broad matches are honest`);
});
await testAsync('index.html: the static JSON-LD block parses and shares its @ids with the runtime graph', async () => {
  const html = await (await fetch(new URL('../index.html', import.meta.url))).text();
  const m = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  assert(m, 'no static JSON-LD block');
  const doc = JSON.parse(m[1]);
  const ids = doc['@graph'].map((n) => n['@id']);
  assert(ids.includes(datasetId), 'static block lacks the dataset @id');
  assert(doc['@graph'].some((n) => n['@type'] === 'WebApplication'), 'static block lacks the WebApplication');
});

const failed = results.filter((r) => !r.ok);
const out = document.getElementById('out');
for (const r of results) {
  const li = document.createElement('li');
  li.className = r.ok ? 'ok' : 'bad';
  li.textContent = `${r.ok ? 'PASS' : 'FAIL'} — ${r.name}${r.err ? ': ' + r.err : ''}`;
  out.appendChild(li);
}
document.getElementById('summary').textContent = `${results.length - failed.length}/${results.length} passed`;
document.title = failed.length ? 'FAIL' : 'PASS';
