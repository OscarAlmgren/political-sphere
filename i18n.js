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
    'app.title': 'Politiska sfären 4D',
    'app.subtitle': 'Så fungerar sfären ⓘ',
    'lang.label': 'Språk',
    'hud.collapse': 'Minimera panelen',
    'hud.expand': 'Maximera panelen',
    'hud.aria': 'Kontroller och resultat',
    'stage.aria': 'Interaktiv politisk 3D-sfär. En tabell över alla partier finns i sidopanelen.',
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
    'you.hint': 'Markören är dold. Träffar och markeringen av lika förändringstakt använder fortfarande värdena nedan.',
    'you.reset': 'Nollställ värden',

    'view.title': 'Vy',
    'view.reset': 'Återställ vy',
    'view.xy': 'Ekonomi × GAL–TAN',
    'view.xz': 'Ekonomi × Institutionell',
    'view.yz': 'GAL–TAN × Institutionell',

    'grid.title': 'Rutnät',
    'grid.box': 'Yttre kub',
    'grid.box.tip': 'Kubens kontur och dess svaga ton',
    'grid.xy': 'Ekonomi × Sociokulturell',
    'grid.xz': 'Ekonomi × Institutionell',
    'grid.yz': 'Sociokulturell × Institutionell',
    'grid.xy.tip': 'X–Y-plan, mitten av Z (Z = 0)',
    'grid.xz.tip': 'X–Z-plan, mitten av Y (Y = 0)',
    'grid.yz.tip': 'Y–Z-plan, mitten av X (X = 0)',
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

    'slice.title': 'Visa lika förändringstakt',
    'slice.off': 'Markera enheter inom ±{r} från din förändringstakt',
    'slice.on': '{n} av {m} partier inom ±{r} från din förändringstakt',

    'matches.title': 'Närmaste träffar',
    'matches.in': 'i ℝ⁴',
    'matches.moveHint': 'Ändra reglage på någon av värdena nedan för att se vilka partier du är närmast',
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

    'compare.title': 'Jämförelse mellan länder',
    'compare.body': 'Varje lands partier har främst placerats utifrån det egna landets politik, så de två länderna går inte att lägga exakt över varandra. Se avstånden mellan dem som en grov fingervisning, inte som exakta mått.',
    'compare.more': 'Så togs siffrorna fram',
    'compare.dontShow': 'Visa inte detta igen',
    'compare.close': 'Stäng',

    'welcome.title': 'Välkommen till den politiska sfären i 4D',
    'welcome.intro': 'Varje parti är en punkt i en 3D-ruta, och den fjärde dimensionen syns som färg och storlek. Rutan är interaktiv, så utforska den själv:',
    'welcome.i1.k': 'Rotera och zooma',
    'welcome.i1.t': 'Dra i rutan för att vrida den. Scrolla eller nyp för att zooma.',
    'welcome.i2.k': 'Klicka på partierna',
    'welcome.i2.t': 'Klicka på ett parti, antingen bollen eller etiketten, för att se dess position och fästa informationen. Håll muspekaren över för en snabbtitt.',
    'welcome.i3.k': 'Klicka på axlarna',
    'welcome.i3.t': 'Klicka på en axeletikett i rutan, till exempel +X eller −Y, för en förklaring av vad den änden av axeln står för.',
    'welcome.i4.k': 'Byt vy',
    'welcome.i4.t': 'Välj upp till två länder i panelen och använd vyknapparna för att titta rakt in i rutan i 2D.',
    'welcome.start': 'Börja utforska',

    'intro.title': 'Så fungerar den politiska sfären',
    'intro.close': 'Stäng',
    'intro.step': 'Steg {n} av {total}',
    'intro.prev': 'Föregående',
    'intro.next': 'Nästa',
    'intro.done': 'Klar',
    'intro.left': 'Vänster',
    'intro.right': 'Höger',
    'intro.parties': 'Varje prick är ett parti',
    'intro.1.h': '1D · Vänster–höger',
    'intro.1.p': 'Det klassiska sättet att ordna politik är en enda linje, från vänster (statlig omfördelning) till höger (fri marknad). Varje parti får en plats på linjen. Det här är X-axeln: ekonomi.',
    'intro.2.h': '2D · Lägg till GAL–TAN',
    'intro.2.p': 'En linje räcker inte. Två partier som tycker lika om ekonomin kan tycka väldigt olika om värderingar. Därför får vi en andra axel, Y: GAL–TAN. GAL står för grön, alternativ, libertariansk och TAN för traditionell, auktoritär, nationalistisk. Nu bor varje parti på en yta.',
    'intro.3.h': '3D · Lägg till antietablissemang',
    'intro.3.p': 'Den tredje axeln, Z, mäter förhållandet till etablissemanget: från institutionalist (tillit till parlament, myndigheter och etablerade spelregler) till antietablissemang (misstro mot eliten). Det är en egen tillbyggnad i appen. Nu är varje parti en punkt i en ruta som du kan vrida på.',
    'intro.4.h': '4D · Tempo som färg',
    'intro.4.p': 'Den fjärde dimensionen, W, går inte att rita som rymd, så den visas som färg (och en liten skillnad i storlek). Blått är stegvis förändring, rödorange är radikal förändring. Tillsammans är varje parti en vektor [x, y, z, w] i ℝ⁴.',

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

    'gov.title': 'Regering',
    'gov.show': 'Visa regeringspartier',
    'gov.legend.gov': 'I regeringen',
    'gov.legend.support': 'Stödjer utifrån',
    'gov.legend.pm': 'Statsministerns parti',
    'gov.pick': 'Välj ett land för att se dess regering.',
    'gov.members': 'Regering:',
    'gov.support': 'Stöd utifrån:',
    'gov.unlisted': 'Inte på diagrammet: {list}',
    'gov.verified': 'Läge {date}',
    'gov.status.caretaker': 'Övergångsregering',
    'gov.hint': 'Heldragna linjer binder ihop regeringspartierna (ett träd efter närhet i ℝ⁴). Streckade linjer går från stödpartier utifrån till statsministerns parti. Linjerna visar inte vem som förhandlat med vem.',
    'gov.role.pm': 'I regeringen (statsministerns parti)',
    'gov.role.gov': 'I regeringen',
    'gov.role.support': 'Stödjer regeringen utifrån',

    'approx.group': 'ungefärligt, per partigrupp',
    'approx.composition': 'ungefärligt, kammarens sammansättning',
    'approx.notfinal': 'ungefärligt, inte slutgiltigt',

    'fallback.title': 'Politiska sfären 4D',
    'fallback.reasonWebgl': 'WebGL2 finns inte i den här webbläsaren eller är avstängt.',
    'fallback.reasonLoad': '3D-scenen kunde inte startas ({err}). Three.js laddas från ett CDN, så kontrollera anslutningen och ladda om.',
    'fallback.intro': '3D-vyn kräver WebGL2. Här är partivektorerna i stället (X ekonomi, Y GAL+/TAN−, Z antietablissemang+, W radikal+):',
    'fallback.country': 'Land',
    'fallback.loadFail': 'Det gick inte att ladda partidatan.',
    'noscript': 'Den här appen kräver att JavaScript är aktiverat.',
  },

  en: {
    'app.title': 'The Political Sphere 4D',
    'app.subtitle': 'How the sphere works ⓘ',
    'lang.label': 'Language',
    'hud.collapse': 'Minimise panel',
    'hud.expand': 'Maximise panel',
    'hud.aria': 'Controls and results',
    'stage.aria': 'Interactive 3D political sphere. A table of all parties is available in the side panel.',
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
    'you.hint': 'Marker hidden. Matches and the equal-pace highlight still use the values below.',
    'you.reset': 'Reset values',

    'view.title': 'View',
    'view.reset': 'Reset view',
    'view.xy': 'Economic × GAL–TAN',
    'view.xz': 'Economic × Institutional',
    'view.yz': 'GAL–TAN × Institutional',

    'grid.title': 'Grid lines',
    'grid.box': 'Outer box',
    'grid.box.tip': 'The cube outline and its faint tint',
    'grid.xy': 'Economic × Sociocultural',
    'grid.xz': 'Economic × Institutional',
    'grid.yz': 'Sociocultural × Institutional',
    'grid.xy.tip': 'X–Y plane, middle of Z (Z = 0)',
    'grid.xz.tip': 'X–Z plane, middle of Y (Y = 0)',
    'grid.yz.tip': 'Y–Z plane, middle of X (X = 0)',
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

    'slice.title': 'Show equal pace of change',
    'slice.off': 'Highlight entities within ±{r} of your pace of change',
    'slice.on': '{n} of {m} parties within ±{r} of your pace of change',

    'matches.title': 'Closest matches',
    'matches.in': 'in ℝ⁴',
    'matches.moveHint': 'Change a slider on any of the values below to see which parties you are closest to',
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

    'compare.title': 'Comparing countries',
    'compare.body': 'Each country’s parties were placed mainly against that country’s own politics, so the two countries can’t be laid perfectly on top of each other. Read the distances between them as a rough guide, not an exact measurement.',
    'compare.more': 'How the numbers were made',
    'compare.dontShow': 'Don’t show this again',
    'compare.close': 'Close',

    'welcome.title': 'Welcome to the 4D political sphere',
    'welcome.intro': 'Every party is a point in a 3D box, and the fourth dimension shows as colour and size. The box is interactive, so explore it yourself:',
    'welcome.i1.k': 'Rotate and zoom',
    'welcome.i1.t': 'Drag the box to turn it. Scroll or pinch to zoom.',
    'welcome.i2.k': 'Click the parties',
    'welcome.i2.t': 'Click a party, either the bubble or its label, to see its position and pin the details. Hover for a quick peek.',
    'welcome.i3.k': 'Click the axes',
    'welcome.i3.t': 'Click an axis label in the box, such as +X or −Y, for an explanation of what that end of the axis stands for.',
    'welcome.i4.k': 'Change the view',
    'welcome.i4.t': 'Pick up to two countries in the panel and use the view buttons to look straight into the box in 2D.',
    'welcome.start': 'Start exploring',

    'intro.title': 'How the political sphere works',
    'intro.close': 'Close',
    'intro.step': 'Step {n} of {total}',
    'intro.prev': 'Previous',
    'intro.next': 'Next',
    'intro.done': 'Done',
    'intro.left': 'Left',
    'intro.right': 'Right',
    'intro.parties': 'Each dot is a party',
    'intro.1.h': '1D · Left–right',
    'intro.1.p': 'The classic way to order politics is a single line, from left (state redistribution) to right (free market). Every party gets a place on the line. This is the X axis: economics.',
    'intro.2.h': '2D · Add GAL–TAN',
    'intro.2.p': 'One line is not enough. Two parties that agree on the economy can disagree sharply on values. So we add a second axis, Y: GAL–TAN. GAL stands for green, alternative, libertarian, and TAN for traditional, authoritarian, nationalist. Now every party lives on a plane.',
    'intro.3.h': '3D · Add anti-establishment',
    'intro.3.p': 'The third axis, Z, measures the relationship to the establishment: from institutionalist (trust in parliament, agencies and the established rules of the game) to anti-establishment (distrust of the elite). This one is the app\'s own addition. Now every party is a point in a box you can turn around.',
    'intro.4.h': '4D · Tempo as colour',
    'intro.4.p': 'The fourth dimension, W, cannot be drawn as space, so it is shown as colour (and a slight difference in size). Blue is incremental change, red-orange is radical change. Together, every party is a vector [x, y, z, w] in ℝ⁴.',

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

    'gov.title': 'Government',
    'gov.show': 'Show governing parties',
    'gov.legend.gov': 'In government',
    'gov.legend.support': 'Supports from outside',
    'gov.legend.pm': 'Prime minister’s party',
    'gov.pick': 'Select a country to see its government.',
    'gov.members': 'Government:',
    'gov.support': 'Outside support:',
    'gov.unlisted': 'Not on the chart: {list}',
    'gov.verified': 'As of {date}',
    'gov.status.caretaker': 'Caretaker government',
    'gov.hint': 'Solid lines connect the governing parties (a tree by closeness in ℝ⁴). Dashed lines run from outside supporters to the prime minister’s party. The lines do not show who negotiated with whom.',
    'gov.role.pm': 'In government (prime minister’s party)',
    'gov.role.gov': 'In government',
    'gov.role.support': 'Supports the government from outside',

    'approx.group': 'approx., by parliamentary group',
    'approx.composition': 'approx., chamber composition',
    'approx.notfinal': 'approx., not final',

    'fallback.title': 'Political Sphere 4D',
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

/** "nov 2026" / "Nov 2026" from 'YYYY-MM'. */
export function monthLabel(ym) {
  const [year, month] = ym.split('-');
  return `${MONTHS[current][Number(month) - 1]} ${year}`;
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
