// Translations (Swedish = default, English) and small helpers. No Three.js.
//
// Static markup uses data attributes, applied by retranslate():
//   data-i18n="key"                 -> textContent  (optional data-i18n-args='{"name":"value"}')
//   data-i18n-title="key"           -> title attribute
//   data-i18n-aria-label="key"      -> aria-label attribute
//   data-i18n-country="SE"          -> textContent = country name in the current language
// Argument values starting with "@" are themselves translation keys, resolved at render time.

import { COUNTRY_BY_CODE } from './countries.js';

/** Language menu: shows the country code and flag. */
export const LANGS = [
  { lang: 'sv', code: 'SE', flag: 'se', name: 'Svenska' },
  { lang: 'en', code: 'GB', flag: 'gb', name: 'English' },
];
export const DEFAULT_LANG = 'sv';

export const STRINGS = {
  sv: {
    'app.title': 'Politisk kompass 4D',
    'app.subtitle': 'Politiska partier som vektorer i ℝ⁴',
    'lang.label': 'Språk',
    'hud.collapse': 'Minimera panelen',
    'hud.expand': 'Maximera panelen',
    'hud.aria': 'Kontroller och resultat',
    'stage.aria': 'Interaktiv politisk 3D-kompass. En tabell över alla partier finns i sidopanelen.',
    'you.label': 'Du',

    'countries.title': 'Länder',
    'countries.hint': 'välj upp till 2',
    'countries.choose': 'Välj länder',
    'country.full': 'Max {max} länder åt gången: avmarkera ett först',
    'country.remove': 'Ta bort {country}',
    'country.slotNone': '{slot}: inget valt',
    'group.nordic': 'Norden',
    'group.eu': 'Europeiska unionen',
    'group.other': 'Övriga',

    'parties.table': 'Alla partier (tabell)',
    'data.button': 'ⓘ Varifrån kommer siffrorna?',

    'you.title': 'Din position',
    'you.show': 'Visa markören ”Du”',
    'you.hint': 'Markören är dold. Träffar och skivläge använder fortfarande värdena nedan.',
    'you.reset': 'Återställ till origo',

    'view.title': 'Vy',
    'view.reset': 'Återställ vy',
    'view.xy': 'Ekonomi × GAL–TAN',
    'view.xz': 'Ekonomi × Institutionell',
    'view.yz': 'GAL–TAN × Institutionell',

    'grid.title': 'Rutnät',
    'grid.box': 'Yttre kub',
    'grid.box.tip': 'Kubens kontur och dess svaga ton',
    'grid.xy': 'X–Y-plan',
    'grid.xz': 'X–Z-plan',
    'grid.yz': 'Y–Z-plan',
    'grid.xy.tip': 'Z = 0',
    'grid.xz.tip': 'Y = 0',
    'grid.yz.tip': 'X = 0',
    'grid.floor': 'Golv',
    'grid.floor.tip': 'Y = −1, där falllinjerna landar',
    'grid.hideAll': 'Dölj alla rutnät',
    'grid.showAll': 'Visa alla rutnät',

    'size.title': 'Bubbelstorlek',
    'size.party': 'Partibubblor',
    'size.you': 'Bubblan ”Du”',
    'size.seats': 'Anpassa efter valresultat',
    'size.note': 'Bubblans yta följer varje partis andel av mandaten i landets senaste val; partier utan mandat förblir små.',
    'size.approx': ' Mandatsiffrorna är ungefärliga för: {names}.',

    'legend.title': 'W-axelns färg',
    'legend.aria': 'Färgskala från blått (stegvis) via violett till rödorange (radikal)',
    'legend.neg': '−1 Stegvis',
    'legend.pos': '+1 Radikal',

    'slice.title': 'W-skivläge',
    'slice.off': 'Markera enheter inom ±{r} från ditt W',
    'slice.on': '{n} av {m} partier inom ±{r} från ditt W',

    'matches.title': 'Närmaste träffar',
    'matches.in': 'i ℝ⁴',
    'matches.cosHint': 'Cosinuslikhet är odefinierad i origo. Flytta ett reglage så att ”Du” får en riktning.',
    'matches.pick': 'Välj ett land ovan för att se dess närmaste partier.',
    'matches.distance': 'Avstånd',
    'matches.match': 'Matchning',
    'matches.cosine': 'Cosinus',

    'foot': 'Matchning % = (1 − d/4) × 100, där 4 är det största möjliga 4D-avståndet. Cosinus jämför bara riktning. Land A ritas som sfärer (●), land B som diamanter (◆). Partiernas positioner är grova, illustrativa uppskattningar, inte mätningar. Se ”Varifrån kommer siffrorna?” ovan.',

    'axis.x.name': 'Ekonomi',
    'axis.x.neg': 'Statlig omfördelning',
    'axis.x.pos': 'Fri marknad',
    'axis.y.name': 'Sociokulturell',
    'axis.y.neg': 'TAN',
    'axis.y.pos': 'GAL',
    'axis.z.name': 'Institutionell',
    'axis.z.neg': 'Institutionalist',
    'axis.z.pos': 'Antietablissemang',
    'axis.w.name': 'Tempo',
    'axis.w.neg': 'Stegvis',
    'axis.w.pos': 'Radikal',
    'slider.poleNeg': '{pole} (−1)',
    'slider.polePos': '(+1) {pole}',
    'slider.poleTip': 'Vad betyder det här?',

    'table.ctry': 'Land',
    'table.party': 'Parti',
    'table.seats': 'Mandat',
    'table.dist': 'Avst.',
    'table.match': 'Match',
    'table.cos': 'Cos',

    'tooltip.seats': '{seats} av {total} mandat ({pct}%) · {election}',
    'tooltip.match': '{pct}% matchning med dig · avstånd {d}',
    'notice.contextLost': 'Grafikkontexten förlorades. Försöker återställa…',

    'explain.close': 'Stäng förklaringen',
    'ex.axisLine': '{name}-axeln ({mark}) · {aka}',
    'ex.typical': 'Typiska ståndpunkter',
    'ex.custom': 'Den här dimensionen är en egen tillbyggnad i appen (inte en etablerad statsvetenskaplig skala), så partiernas positioner på den är subjektiva uppskattningar.',
    'ex.inCountries': 'I de valda länderna',
    'ex.pick': 'Välj ett land för att se hur det ser ut där.',
    'ex.furthest': 'Längst mot den här änden: {list}.',
    'ex.seatsShort': '{n} mandat',
    'ex.none': 'Inget listat parti ligger tydligt vid den här änden.',
    'ex.weighted': 'Parlamentet som helhet (mandatviktat): {phrase} ({value}).',
    'ex.neutral': 'ungefär neutralt på den här axeln',
    'ex.towards': '{strength} mot {pole}',
    'strength.slightly': 'svagt',
    'strength.moderately': 'måttligt',
    'strength.strongly': 'starkt',
    'ex.computed': 'Exemplen är beräknade från de uppskattade partipositionerna och valmandaten i appen, inte handskrivna fallstudier.',

    'data.pick': 'Välj ett land för att se vilket val dess mandatsiffror kommer från.',
    'data.listed': '{label} · {listed} av {total} mandat finns i diagrammet ({n} partier).',
    'data.approx': 'Mandatsiffrorna för det här landet är ungefärliga.',

    'approx.group': 'ungefärligt, per partigrupp',
    'approx.composition': 'ungefärligt, kammarens sammansättning',
    'approx.notfinal': 'ungefärligt, inte slutgiltigt',

    'fallback.title': 'Politisk kompass 4D',
    'fallback.reasonWebgl': 'WebGL2 finns inte i den här webbläsaren eller är avstängt.',
    'fallback.reasonLoad': '3D-scenen kunde inte startas ({err}). Three.js laddas från ett CDN, så kontrollera anslutningen och ladda om.',
    'fallback.intro': '3D-vyn kräver WebGL2. Här är partivektorerna i stället (X ekonomi, Y GAL+/TAN−, Z antietablissemang+, W radikal+):',
    'fallback.country': 'Land',
    'fallback.loadFail': 'Det gick inte att ladda partidatan.',
    'noscript': 'Den här appen kräver att JavaScript är aktiverat.',
  },

  en: {
    'app.title': 'Political Compass 4D',
    'app.subtitle': 'Political parties as vectors in ℝ⁴',
    'lang.label': 'Language',
    'hud.collapse': 'Minimise panel',
    'hud.expand': 'Maximise panel',
    'hud.aria': 'Controls and results',
    'stage.aria': 'Interactive 3D political compass. A table of all parties is available in the side panel.',
    'you.label': 'You',

    'countries.title': 'Countries',
    'countries.hint': 'pick up to 2',
    'countries.choose': 'Choose countries',
    'country.full': 'Only {max} countries at a time: deselect one first',
    'country.remove': 'Remove {country}',
    'country.slotNone': '{slot}: none selected',
    'group.nordic': 'Nordic',
    'group.eu': 'European Union',
    'group.other': 'Other',

    'parties.table': 'All parties (table)',
    'data.button': 'ⓘ Where do these numbers come from?',

    'you.title': 'Your position',
    'you.show': 'Show “You” marker',
    'you.hint': 'Marker hidden. Matches and slice mode still use the values below.',
    'you.reset': 'Reset to origin',

    'view.title': 'View',
    'view.reset': 'Reset view',
    'view.xy': 'Economic × GAL–TAN',
    'view.xz': 'Economic × Institutional',
    'view.yz': 'GAL–TAN × Institutional',

    'grid.title': 'Grid lines',
    'grid.box': 'Outer box',
    'grid.box.tip': 'The cube outline and its faint tint',
    'grid.xy': 'X–Y plane',
    'grid.xz': 'X–Z plane',
    'grid.yz': 'Y–Z plane',
    'grid.xy.tip': 'Z = 0',
    'grid.xz.tip': 'Y = 0',
    'grid.yz.tip': 'X = 0',
    'grid.floor': 'Floor',
    'grid.floor.tip': 'Y = −1, where drop-lines land',
    'grid.hideAll': 'Hide all grids',
    'grid.showAll': 'Show all grids',

    'size.title': 'Bubble size',
    'size.party': 'Party bubbles',
    'size.you': '“You” bubble',
    'size.seats': 'Adjust for election result',
    'size.note': 'Bubble area follows each party’s share of seats in its country’s latest election; parties without seats stay small.',
    'size.approx': ' Seat figures are approximate for: {names}.',

    'legend.title': 'W-axis colour',
    'legend.aria': 'Colour gradient from blue (incrementalist) through violet to red-orange (radical)',
    'legend.neg': '−1 Incrementalist',
    'legend.pos': '+1 Radical',

    'slice.title': 'W-slice mode',
    'slice.off': 'Highlight entities within ±{r} of your W',
    'slice.on': '{n} of {m} parties within ±{r} of your W',

    'matches.title': 'Closest matches',
    'matches.in': 'in ℝ⁴',
    'matches.cosHint': 'Cosine similarity is undefined at the origin. Move a slider to give “You” a direction.',
    'matches.pick': 'Pick a country above to see its closest parties.',
    'matches.distance': 'Distance',
    'matches.match': 'Match',
    'matches.cosine': 'Cosine',

    'foot': 'Match % = (1 − d/4) × 100, where 4 is the largest possible 4D distance. Cosine compares direction only. Country A is drawn as spheres (●), country B as diamonds (◆). Party positions are rough illustrative estimates, not measurements. See “Where do these numbers come from?” above.',

    'axis.x.name': 'Economic',
    'axis.x.neg': 'State redistribution',
    'axis.x.pos': 'Free market',
    'axis.y.name': 'Sociocultural',
    'axis.y.neg': 'TAN',
    'axis.y.pos': 'GAL',
    'axis.z.name': 'Institutional',
    'axis.z.neg': 'Institutionalist',
    'axis.z.pos': 'Anti-establishment',
    'axis.w.name': 'Tempo',
    'axis.w.neg': 'Incrementalist',
    'axis.w.pos': 'Radical',
    'slider.poleNeg': '{pole} (−1)',
    'slider.polePos': '(+1) {pole}',
    'slider.poleTip': 'What does this mean?',

    'table.ctry': 'Ctry',
    'table.party': 'Party',
    'table.seats': 'Seats',
    'table.dist': 'Dist',
    'table.match': 'Match',
    'table.cos': 'Cos',

    'tooltip.seats': '{seats} of {total} seats ({pct}%) · {election}',
    'tooltip.match': '{pct}% match with you · distance {d}',
    'notice.contextLost': 'Graphics context lost. Trying to recover…',

    'explain.close': 'Close explanation',
    'ex.axisLine': '{name} axis ({mark}) · {aka}',
    'ex.typical': 'Typical positions',
    'ex.custom': 'This dimension is one of this app’s own additions (not a standard political-science scale), so party positions on it are subjective estimates.',
    'ex.inCountries': 'In the selected countries',
    'ex.pick': 'Select a country to see how this plays out there.',
    'ex.furthest': 'Furthest toward this end: {list}.',
    'ex.seatsShort': '{n} seats',
    'ex.none': 'No listed party sits clearly at this end.',
    'ex.weighted': 'Parliament overall (seat-weighted): {phrase} ({value}).',
    'ex.neutral': 'roughly neutral on this axis',
    'ex.towards': '{strength} toward {pole}',
    'strength.slightly': 'slightly',
    'strength.moderately': 'moderately',
    'strength.strongly': 'strongly',
    'ex.computed': 'Examples are computed from the estimated party positions and election seats in this app, not hand-written case studies.',

    'data.pick': 'Select a country to see which election its seat counts come from.',
    'data.listed': '{label} · {listed} of {total} seats are on the chart ({n} parties).',
    'data.approx': 'Seat figures for this country are approximate.',

    'approx.group': 'approx., by parliamentary group',
    'approx.composition': 'approx., chamber composition',
    'approx.notfinal': 'approx., not final',

    'fallback.title': 'Political Compass 4D',
    'fallback.reasonWebgl': 'WebGL2 is not available in this browser, or it is disabled.',
    'fallback.reasonLoad': 'The 3D scene could not start ({err}). Three.js is loaded from a CDN, so check your connection and reload.',
    'fallback.intro': 'The 3D view needs WebGL2. Here are the party vectors instead (X economic, Y GAL+/TAN−, Z anti-establishment+, W radical+):',
    'fallback.country': 'Country',
    'fallback.loadFail': 'Could not load the party data.',
    'noscript': 'This app needs JavaScript enabled.',
  },
};

/** Swedish names for the countries (English names live in countries.js). */
const COUNTRY_NAMES_SV = {
  SE: 'Sverige', NO: 'Norge', DK: 'Danmark', FI: 'Finland', IS: 'Island',
  AT: 'Österrike', BE: 'Belgien', BG: 'Bulgarien', HR: 'Kroatien', CY: 'Cypern', CZ: 'Tjeckien', EE: 'Estland',
  FR: 'Frankrike', DE: 'Tyskland', GR: 'Grekland', HU: 'Ungern', IE: 'Irland', IT: 'Italien', LV: 'Lettland',
  LT: 'Litauen', LU: 'Luxemburg', MT: 'Malta', NL: 'Nederländerna', PL: 'Polen', PT: 'Portugal', RO: 'Rumänien',
  SK: 'Slovakien', SI: 'Slovenien', ES: 'Spanien', GB: 'Storbritannien', AR: 'Argentina', JP: 'Japan',
  US: 'USA', CA: 'Kanada', IN: 'Indien',
};

/** Generic English chamber names -> Swedish. Native names (Bundestag, Sejm, …) are left as they are. */
const CHAMBERS_SV = {
  Riksdag: 'Riksdagen', Storting: 'Stortinget', Folketing: 'Folketinget', Althing: 'Alltinget',
  Chamber: 'Deputeradekammaren', 'National Assembly': 'Nationalförsamlingen',
  'House of Representatives': 'Representanthuset', 'Chamber of Deputies': 'Deputeradekammaren',
  Parliament: 'Parlamentet', Assembly: 'Republikens församling', 'National Council': 'Nationalrådet',
  Congress: 'Deputeradekongressen', 'House of Commons': 'Underhuset',
};

const MONTHS = {
  sv: ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'],
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
};

/* ------------------------------------------------------------------ state */
let current = DEFAULT_LANG;
const listeners = new Set();

export const getLang = () => current;
export const onLangChange = (fn) => listeners.add(fn);

/** Language from ?lang=sv|en, otherwise Swedish. */
export function initialLang() {
  const q = typeof location !== 'undefined' ? new URLSearchParams(location.search).get('lang') : null;
  return q && STRINGS[q] ? q : DEFAULT_LANG;
}

export function setLang(lang) {
  if (!STRINGS[lang] || lang === current) return;
  current = lang;
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lang;
    document.title = t('app.title');
    retranslate();
  }
  listeners.forEach((fn) => fn(lang));
}

/** Set the language without notifying listeners (used once at startup). */
export function useLang(lang) {
  if (!STRINGS[lang]) return;
  current = lang;
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lang;
    document.title = t('app.title');
  }
}

/** Translate a key. {placeholders} come from args; an arg starting with "@" is itself a key. */
export function t(key, args) {
  const s = STRINGS[current][key] ?? STRINGS.en[key] ?? key;
  if (!args) return s;
  return s.replace(/\{(\w+)\}/g, (_, k) => {
    const v = args[k];
    if (v === undefined || v === null) return '';
    return typeof v === 'string' && v.startsWith('@') ? t(v.slice(1)) : String(v);
  });
}

export function countryName(c) {
  const country = typeof c === 'string' ? COUNTRY_BY_CODE.get(c) : c;
  return current === 'sv' ? (COUNTRY_NAMES_SV[country.code] ?? country.name) : country.name;
}

/** "Riksdagen, sep 2026 (ungefärligt, …)" from { chamber, date: 'YYYY-MM', approx }. */
export function electionLabel(e) {
  const [year, month] = e.date.split('-');
  const chamber = current === 'sv' ? (CHAMBERS_SV[e.chamber] ?? e.chamber) : e.chamber;
  const base = `${chamber}, ${MONTHS[current][Number(month) - 1]} ${year}`;
  return e.approx ? `${base} (${t(`approx.${e.approx}`)})` : base;
}

/* ------------------------------------------------------------ DOM helpers */
/** Translate an element's text now and keep it in step with the language. */
export function tr(el, key, args) {
  el.dataset.i18n = key;
  if (args) el.dataset.i18nArgs = JSON.stringify(args);
  else delete el.dataset.i18nArgs;
  el.textContent = t(key, args);
  return el;
}

export function trAttr(el, attr, key) {
  el.dataset[attr === 'title' ? 'i18nTitle' : 'i18nAriaLabel'] = key;
  el.setAttribute(attr, t(key));
  return el;
}

export function trCountry(el, code) {
  el.dataset.i18nCountry = code;
  el.textContent = countryName(code);
  return el;
}

/** Re-apply the current language to every tagged element under `root`. */
export function retranslate(root = document) {
  root.querySelectorAll('[data-i18n]').forEach((n) => {
    n.textContent = t(n.dataset.i18n, n.dataset.i18nArgs ? JSON.parse(n.dataset.i18nArgs) : undefined);
  });
  root.querySelectorAll('[data-i18n-title]').forEach((n) => n.setAttribute('title', t(n.dataset.i18nTitle)));
  root.querySelectorAll('[data-i18n-aria-label]').forEach((n) => n.setAttribute('aria-label', t(n.dataset.i18nAriaLabel)));
  root.querySelectorAll('[data-i18n-country]').forEach((n) => { n.textContent = countryName(n.dataset.i18nCountry); });
}
