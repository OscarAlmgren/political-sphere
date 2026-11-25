// Linked-data (JSON-LD) description of everything on the sphere: the dataset, the four axes, countries, chambers,
// elections, parties (with their positions and seats) and governments. It is invisible metadata for crawlers and
// LOD tools; nothing in the visible UI depends on it.
//
// Vocabularies: schema.org (structure), SKOS (the axes, in vocab/axes.jsonld), Wikidata and Party Facts (identity
// links, from ids.js), the EU Publications Office country authority. Pure data + logic: buildGraph() touches no DOM so
// tests.html can import it; only injectGraph() writes to the page.
import { COUNTRIES } from './countries.js';
import { GOVERNMENT_BY_CODE, GOVERNMENTS_GATHERED } from './governments.js';
import { AXIS_KEYS } from './explain.js';
import { STRINGS, COUNTRY_NAMES_SV, CHAMBERS_SV } from './i18n.js';
import { COUNTRY_IDS, PARTY_IDS } from './ids.js';

/** Where the app lives; every @id below is minted under it. If the site moves, change this one constant. */
export const BASE = 'https://oscaralmgren.github.io/political-sphere/';
export const VOCAB = `${BASE}vocab/axes.jsonld`;

const WD = 'http://www.wikidata.org/entity/';
const PF = 'https://partyfacts.herokuapp.com/data/partycodes/';
const EU_COUNTRY = 'http://publications.europa.eu/resource/authority/country/';

/* ---- identifiers (exported so the tests can check that every @id is unique and resolvable) ---- */
export const axisId = (key) => `${VOCAB}#${key}`;
export const seatsId = `${VOCAB}#seats`;
export const datasetId = `${BASE}#dataset`;
export const methodId = `${BASE}#method`;
export const countryId = (code) => `${BASE}#country-${code}`;
export const chamberId = (code) => `${BASE}#chamber-${code}`;
export const electionId = (code) => `${BASE}#election-${code}`;
export const governmentId = (code) => `${BASE}#government-${code}`;
export const partyId = (code, abbr) => `${BASE}#party-${code}-${encodeURIComponent(abbr)}`;
export const observationId = (code, abbr, what) => `${BASE}#obs-${code}-${encodeURIComponent(abbr)}-${what}`;

const ref = (id) => ({ '@id': id });
const both = (en, sv) => (sv && sv !== en ? [{ '@language': 'en', '@value': en }, { '@language': 'sv', '@value': sv }] : en);
const compact = (obj) => Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined && v !== null && !(Array.isArray(v) && !v.length)));

// Prefixes for compact ids ("ps:party-SE-V" instead of the full URL). The site prefix alone was ~40% of the graph before
// this; a JSON-LD processor expands the compact ids to exactly the absolute ids the helpers above return.
const PREFIXES = {
  ps: `${BASE}#`,
  axes: `${VOCAB}#`,
  wd: WD,
  pf: PF,
  eu: EU_COUNTRY,
};

export const CONTEXT = {
  '@vocab': 'https://schema.org/',
  skos: 'http://www.w3.org/2004/02/skos/core#',
  dct: 'http://purl.org/dc/terms/',
  ...PREFIXES,
};

const PREFIX_LIST = Object.entries(PREFIXES);

/** Absolute id -> compact id, if it starts with one of our prefixes. */
const shortenId = (id) => {
  for (const [name, ns] of PREFIX_LIST) if (id.startsWith(ns) && id.length > ns.length) return `${name}:${id.slice(ns.length)}`;
  return id;
};

/** Compact id -> absolute id (what a JSON-LD processor does). Ids that are already absolute pass through. */
export function expandId(id) {
  const i = id.indexOf(':');
  const ns = i > 0 ? PREFIXES[id.slice(0, i)] : undefined;
  return ns ? ns + id.slice(i + 1) : id;
}

/**
 * Shortens every "@id" string inside a JSON value, in place (copying ~1,700 nodes cost about 10 ms; this costs ~1 ms).
 * Only used on the nodes buildGraph() has just created, so nothing shared is modified.
 */
const shortenIds = (v) => {
  if (Array.isArray(v)) {
    for (const x of v) shortenIds(x);
  } else if (v && typeof v === 'object') {
    for (const k in v) {
      const x = v[k];
      if (k === '@id' && typeof x === 'string') v[k] = shortenId(x);
      else if (x && typeof x === 'object') shortenIds(x);
    }
  }
  return v;
};

const METHOD = {
  en: 'Hand-assigned, illustrative estimates made with AI assistance from general knowledge of each party’s platform. They are not survey measurements and not copied from a dataset. The X and Y scales are modelled on the Chapel Hill Expert Survey (economic left–right and GAL–TAN); Z and W are this app’s own subjective dimensions.',
  sv: 'Handplacerade, illustrativa uppskattningar gjorda med AI-stöd utifrån allmän kännedom om varje partis politik. De är inte enkätmätningar och inte hämtade ur något dataset. Skalorna X och Y är modellerade efter Chapel Hill Expert Survey (ekonomisk vänster–höger och GAL–TAN). Z och W är appens egna subjektiva dimensioner.',
};

function datasetNode() {
  const n = COUNTRIES.length;
  return {
    '@id': datasetId,
    '@type': 'Dataset',
    name: both('Political Sphere 4D: party positions', 'Politiska sfären 4D: partiernas positioner'),
    description: both(
      `Illustrative estimates of where political parties in ${n} countries sit on four axes (economic, sociocultural, institutional, tempo), each from −1 to +1, with latest-election seat counts and current governments. The positions are not survey measurements.`,
      `Illustrativa uppskattningar av var partier i ${n} länder står på fyra axlar (ekonomi, sociokulturell, institutionell, tempo), var och en från −1 till +1, med mandat i senaste valet och nuvarande regeringar. Positionerna är inga enkätmätningar.`,
    ),
    url: BASE,
    inLanguage: ['sv', 'en'],
    dateModified: GOVERNMENTS_GATHERED,
    measurementTechnique: ref(methodId),
    citation: { '@type': 'CreativeWork', name: 'Chapel Hill Expert Survey (CHES): scale definitions for X and Y', url: 'https://www.chesdata.eu/' },
    spatialCoverage: COUNTRIES.map((c) => ref(countryId(c.code))),
    variableMeasured: AXIS_KEYS.map((k) => ({
      '@type': 'PropertyValue',
      propertyID: ref(axisId(k)),
      name: both(STRINGS.en[`axis.${k}.name`], STRINGS.sv[`axis.${k}.name`]),
      minValue: -1,
      maxValue: 1,
    })),
  };
}

function methodNode() {
  return {
    '@id': methodId,
    '@type': 'CreativeWork',
    name: both('How the party positions were made', 'Hur partiernas positioner togs fram'),
    description: both(METHOD.en, METHOD.sv),
  };
}

function countryNodes(c) {
  const ids = COUNTRY_IDS[c.code] ?? {};
  const sameAs = [ids.wd && WD + ids.wd, ids.iso3 && EU_COUNTRY + ids.iso3].filter(Boolean);
  const chamberName = both(c.election.chamber, CHAMBERS_SV[c.election.chamber]);
  const nodes = [
    compact({
      '@id': countryId(c.code), '@type': 'Country',
      name: both(c.name, COUNTRY_NAMES_SV[c.code]),
      identifier: { '@type': 'PropertyValue', propertyID: 'ISO 3166-1 alpha-2', value: c.code },
      sameAs: sameAs.map(ref),
    }),
    compact({
      '@id': chamberId(c.code), '@type': 'GovernmentOrganization',
      name: chamberName,
      additionalType: ref(`${WD}Q11204`), // Wikidata: legislature
      description: both('Main national legislative chamber', 'Nationell lagstiftande huvudkammare'),
      areaServed: ref(countryId(c.code)),
      sameAs: ids.chamber ? [ref(WD + ids.chamber)] : undefined,
    }),
    compact({
      '@id': electionId(c.code), '@type': 'Event',
      name: both(`${c.name} general election ${c.election.date.slice(0, 4)}`, `Val i ${COUNTRY_NAMES_SV[c.code] ?? c.name} ${c.election.date.slice(0, 4)}`),
      startDate: c.election.date,
      location: ref(countryId(c.code)),
      about: ref(chamberId(c.code)),
      description: c.election.approx ? `Seat figures are approximate (${c.election.approx}).` : undefined,
      sameAs: ids.election ? [ref(WD + ids.election)] : undefined,
    }),
  ];
  return nodes;
}

function partyNodes(c) {
  const election = c.election;
  const out = [];
  for (const p of c.parties) {
    const ids = PARTY_IDS[p.id] ?? {};
    const pid = partyId(c.code, p.abbr);
    out.push(compact({
      '@id': pid, '@type': 'PoliticalParty',
      name: p.name,
      alternateName: p.abbr,
      areaServed: ref(countryId(c.code)),
      identifier: ids.pf ? { '@type': 'PropertyValue', propertyID: 'Party Facts', value: String(ids.pf) } : undefined,
      sameAs: [ids.wd && ref(WD + ids.wd), ids.pf && ref(`${PF}${ids.pf}/`)].filter(Boolean),
    }));
    // One Observation per axis (schema.org has no Organization property for numeric attributes; additionalProperty is not allowed there).
    AXIS_KEYS.forEach((k, i) => out.push({
      '@id': observationId(c.code, p.abbr, k), '@type': 'Observation',
      observationAbout: ref(pid), measuredProperty: ref(axisId(k)),
      value: p.vec[i], minValue: -1, maxValue: 1, measurementTechnique: ref(methodId),
    }));
    if (p.seats != null) out.push({
      '@id': observationId(c.code, p.abbr, 'seats'), '@type': 'Observation',
      observationAbout: ref(pid), measuredProperty: ref(seatsId),
      value: p.seats, minValue: 0, maxValue: election.total, observationDate: election.date,
    });
  }
  return out;
}

function governmentNode(c) {
  const g = GOVERNMENT_BY_CODE.get(c.code);
  if (!g) return [];
  const party = (abbr) => ref(partyId(c.code, abbr));
  const roles = [
    ...g.parties.map((a) => ({ '@type': 'Role', roleName: a === g.pm ? ['governing party', 'prime minister’s party'] : 'governing party', member: party(a) })),
    ...g.support.map((a) => ({ '@type': 'Role', roleName: 'supports the government from outside', member: party(a) })),
    // Parties that are not on the chart have no node of their own, so they are kept as plain-text names.
    ...(g.unlisted ?? []).map((name) => ({ '@type': 'Role', roleName: 'governing or supporting party not on the chart', member: { '@type': 'Organization', name } })),
  ];
  // The government notes already say "Caretaker government: …" where it matters, so the status only fills in when there is no note.
  const caretaker = g.status === 'caretaker' ? { en: 'Caretaker government.', sv: 'Övergångsregering.' } : { en: '', sv: '' };
  const text = g.note ?? caretaker;
  return [compact({
    '@id': governmentId(c.code), '@type': 'GovernmentOrganization',
    name: `Government of ${c.name}`,
    areaServed: ref(countryId(c.code)),
    description: text.en ? both(text.en, text.sv) : undefined,
    member: roles,
    'dct:modified': g.verified, // month this country was last checked; schema.org has no date property on Organization
  })];
}

/** The whole graph as one JSON-LD document. Labels carry both languages, so it never has to be rebuilt on a language switch. */
export function buildGraph() {
  return {
    '@context': CONTEXT,
    '@graph': shortenIds([
      datasetNode(),
      methodNode(),
      ...COUNTRIES.flatMap((c) => [...countryNodes(c), ...partyNodes(c), ...governmentNode(c)]),
    ]),
  };
}

/** Adds the graph to <head> as <script type="application/ld+json" id="ld-graph">, when the browser is idle. */
export function injectGraph() {
  if (typeof document === 'undefined' || document.getElementById('ld-graph')) return;
  const run = () => {
    if (document.getElementById('ld-graph')) return;
    const s = document.createElement('script');
    s.type = 'application/ld+json';
    s.id = 'ld-graph';
    s.textContent = JSON.stringify(buildGraph());
    document.head.appendChild(s);
  };
  (typeof requestIdleCallback === 'function' ? requestIdleCallback : (fn) => setTimeout(fn, 1))(run);
}
