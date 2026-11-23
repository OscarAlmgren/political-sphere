// Explanations for the two ends of each axis, the "where do the numbers come from" notes, and a data-driven
// "how it shows up" summary per country. Text exists in Swedish (sv) and English (en); callers pass the language.
// Pure data/logic: no DOM, no Three.js.

export const AXIS_KEYS = ['x', 'y', 'z', 'w'];

/** key = axis letter + sign, e.g. 'y-' is the TAN end of the sociocultural axis. */
export const POLES = {
  en: {
    'x-': {
      title: 'State redistribution',
      aka: 'economic left',
      summary: 'Favours a large public role in the economy: progressive taxes, strong welfare and public services, union power and market regulation.',
      typical: ['Higher taxes on income and wealth', 'Universal public health care and education', 'Rent controls, minimum wages, public ownership'],
    },
    'x+': {
      title: 'Free market',
      aka: 'economic right',
      summary: 'Favours markets and private enterprise with a smaller state: lower taxes, deregulation and individual responsibility.',
      typical: ['Tax cuts and balanced budgets', 'Privatisation and deregulation', 'Flexible labour markets and school or health-care choice'],
    },
    'y-': {
      title: 'TAN: Traditional, Authoritarian, Nationalist',
      aka: 'socio-cultural right',
      summary: 'Stresses national identity and sovereignty, traditional values and social order, and firm authority.',
      typical: ['Restrictive immigration and tighter border control', 'Tougher law and order', 'Traditional family values; scepticism of the EU and other supranational bodies'],
    },
    'y+': {
      title: 'GAL: Green, Alternative, Libertarian',
      aka: 'socio-cultural left',
      summary: 'Stresses environmental protection, diversity and personal freedom.',
      typical: ['Ambitious climate policy', 'Minority and LGBTQ+ rights, liberal asylum policy', 'Civil liberties and internationalism'],
    },
    'z-': {
      title: 'Institutionalist / technocratic',
      aka: 'trusts the system',
      summary: 'Trusts established institutions, expertise and process: parliaments, courts, civil services, central banks and international bodies.',
      typical: ['Compromise and coalition-building', 'Independent courts and central banks', 'Policy shaped by expert commissions and evidence'],
    },
    'z+': {
      title: 'Anti-establishment / populist',
      aka: 'people vs. elites',
      summary: 'Frames politics as “the people against the elite” and distrusts parties, media, experts and bureaucracy; favours direct or strongman politics.',
      typical: ['Outsider, anti-elite campaigning', 'Referendums and direct democracy', 'Attacks on courts, media or “Brussels”'],
    },
    'w-': {
      title: 'Incrementalist / pragmatic',
      aka: 'gradual change',
      summary: 'Prefers gradual, negotiated reform and continuity; wary of sweeping change.',
      typical: ['Step-by-step reforms and broad compromises', 'Defending stability and existing arrangements', 'Piloting changes before scaling them up'],
    },
    'w+': {
      title: 'Radical / accelerationist',
      aka: 'fast, deep change',
      summary: 'Wants fast, fundamental change and is willing to break with norms or the existing system.',
      typical: ['Sweeping or “shock” reforms', 'Constitutional or system overhaul', 'Confrontational rhetoric and deliberate polarisation'],
    },
  },
  sv: {
    'x-': {
      title: 'Statlig omfördelning',
      aka: 'ekonomisk vänster',
      summary: 'Förordar en stor offentlig roll i ekonomin: progressiv beskattning, stark välfärd och offentlig service, fackligt inflytande och marknadsreglering.',
      typical: ['Högre skatter på inkomst och förmögenhet', 'Allmän offentlig sjukvård och utbildning', 'Hyresreglering, minimilöner och offentligt ägande'],
    },
    'x+': {
      title: 'Fri marknad',
      aka: 'ekonomisk höger',
      summary: 'Förordar marknader och privata företag med en mindre stat: lägre skatter, avreglering och eget ansvar.',
      typical: ['Skattesänkningar och balanserade budgetar', 'Privatiseringar och avregleringar', 'Flexibla arbetsmarknader och valfrihet i skola och vård'],
    },
    'y-': {
      title: 'TAN: traditionell, auktoritär, nationalistisk',
      aka: 'sociokulturell höger',
      summary: 'Betonar nationell identitet och suveränitet, traditionella värderingar, social ordning och stark auktoritet.',
      typical: ['Restriktiv invandring och striktare gränskontroll', 'Hårdare tag mot brott', 'Traditionella familjevärderingar; skepsis mot EU och andra överstatliga organ'],
    },
    'y+': {
      title: 'GAL: grön, alternativ, libertariansk',
      aka: 'sociokulturell vänster',
      summary: 'Betonar miljöskydd, mångfald och personlig frihet.',
      typical: ['Ambitiös klimatpolitik', 'Minoritets- och hbtq-rättigheter, generös asylpolitik', 'Medborgerliga fri- och rättigheter samt internationalism'],
    },
    'z-': {
      title: 'Institutionalistisk / teknokratisk',
      aka: 'litar på systemet',
      summary: 'Litar på etablerade institutioner, expertis och processer: parlament, domstolar, förvaltning, centralbanker och internationella organ.',
      typical: ['Kompromisser och koalitionsbyggande', 'Oberoende domstolar och centralbanker', 'Politik utformad av utredningar och experter'],
    },
    'z+': {
      title: 'Antietablissemang / populism',
      aka: 'folket mot eliten',
      summary: 'Beskriver politik som ”folket mot eliten” och misstror partier, medier, experter och byråkrati; förordar direkt eller starkledarstyrd politik.',
      typical: ['Kampanjer som outsider mot eliten', 'Folkomröstningar och direktdemokrati', 'Angrepp på domstolar, medier eller ”Bryssel”'],
    },
    'w-': {
      title: 'Stegvis / pragmatisk',
      aka: 'gradvis förändring',
      summary: 'Föredrar gradvisa, förhandlade reformer och kontinuitet; är försiktig med omvälvande förändringar.',
      typical: ['Reformer steg för steg och breda överenskommelser', 'Värnar stabilitet och befintliga ordningar', 'Prövar förändringar i liten skala innan de genomförs fullt ut'],
    },
    'w+': {
      title: 'Radikal / accelerationistisk',
      aka: 'snabb, djup förändring',
      summary: 'Vill ha snabb, grundläggande förändring och är beredd att bryta mot normer eller det befintliga systemet.',
      typical: ['Genomgripande eller ”chockartade” reformer', 'Konstitutionell eller systemomvälvande förändring', 'Konfrontativ retorik och medveten polarisering'],
    },
  },
};

/**
 * "Where do the numbers come from?" Plain, specific statements about how the data was produced.
 * Keep these accurate: party X/Y/Z/W values are hand-assigned estimates, not imported from any dataset.
 * Section ids: positions | seats | weighted | trust.
 */
export const DATA_NOTES = {
  en: {
    title: 'Where the numbers come from',
    aka: 'Data sources, method and limits',
    sections: [
      {
        id: 'positions',
        heading: 'Party positions (X, Y, Z, W)',
        paragraphs: [
          'These are rough estimates assigned by hand, with AI assistance (Claude), from general knowledge of each party’s platform and public profile. They are not measurements and they are not copied or computed from a survey or dataset. No per-party sources are attached to them.',
        ],
        bullets: [
          'X (economic) and Y (GAL–TAN): the two scales are modelled on the dimensions used by the Chapel Hill Expert Survey (CHES): economic left–right and GAL–TAN. Only the scale definitions follow CHES; the individual values were not taken from it.',
          'Z (institutional) and W (tempo): these are this app’s own dimensions. No established dataset exists for them, so the values are purely subjective judgements.',
          'Each value is between −1 and +1 and rounded to the nearest 0.05.',
          'All countries share one scale, but each party was judged mostly against its own country’s politics. “Right” or “populist” in one country is not exactly the same as in another, so cross-country comparisons are the weakest part.',
          'Coalitions and mergers are modelled as one entity when the election was fought that way (for example SPOLU in Czechia and the Centrist Reform Alliance in Japan). Positions reflect parties roughly as of their latest election.',
        ],
      },
      {
        id: 'seats',
        heading: 'Seats (election results)',
        paragraphs: [
          'Seat counts are the mandates won in each country’s latest national election for the main (lower) chamber, gathered in November 2026. Where available they come from the national election authority or parliament; otherwise from Wikipedia, the Robert Schuman Foundation’s European Elections Monitor and news agencies (AP, Reuters, Al Jazeera).',
        ],
        bullets: [
          'Totals were checked against the size of the chamber. Where sources differed by a seat or two, the figure most sources gave was used.',
          'France (by parliamentary group), Argentina (chamber composition) and the United States (House called, not yet final) are approximate and flagged below when selected.',
          'Small parties are not all listed, so the listed seats can add up to less than the chamber size. A party with 0 seats is on the chart but holds none (or ran inside another party’s list).',
        ],
      },
      {
        id: 'weighted',
        heading: 'Weighted numbers and match scores',
        paragraphs: [],
        bullets: [
          'Seat-weighted lean of a parliament on an axis = Σ(seats × party value) ÷ Σ(seats), over the listed parties that hold seats. Unlisted small parties are left out.',
          'Match % = (1 − d ÷ 4) × 100, where d is the straight-line (Euclidean) distance between your point and a party in all four dimensions, and 4 is the largest possible distance. Cosine similarity compares direction only and is undefined at the origin.',
          'Bubble size under “Adjust for election result” is based on seat share: area grows in proportion to the share of seats.',
        ],
      },
      {
        id: 'governments',
        heading: 'Governments',
        paragraphs: [
          'Governing parties and outside supporters were gathered in November 2026 from news agencies, Wikipedia and government or parliament sites. Each country shows when it was last checked; some are older than others, and a few (for example France) were not re-checked recently.',
        ],
        bullets: [
          '“Supports from outside” means a party backs the government without holding cabinet posts, for example through a confidence-and-supply, budget or legislative agreement. One-off or informal votes are not counted.',
          'Caretaker governments (where no new government has been approved yet) are flagged. Governing parties that are not on the chart are listed in text but not drawn.',
          'The lines are a visual aid: solid lines form a tree linking the governing parties by closeness in the four dimensions, and dashed lines run from outside supporters to the prime minister’s party. They do not show who negotiated with whom.',
        ],
      },
      {
        id: 'trust',
        heading: 'How much to trust it',
        paragraphs: [
          'Reasonable for the broad picture: which parties cluster together, and the relative ordering of parties within a country. Not reliable for exact distances, small differences, cross-country precision, or anything on the Z and W axes. Treat it as a discussion aid, not research.',
          'Every value lives in countries.js, one line per party, and is easy to inspect and correct. The tests check that the data is well-formed, not that the estimates are right.',
        ],
        bullets: [],
      },
    ],
  },
  sv: {
    title: 'Varifrån siffrorna kommer',
    aka: 'Datakällor, metod och begränsningar',
    sections: [
      {
        id: 'positions',
        heading: 'Partiernas positioner (X, Y, Z, W)',
        paragraphs: [
          'Det här är grova uppskattningar som tilldelats för hand, med hjälp av AI (Claude), utifrån allmän kunskap om varje partis program och offentliga profil. De är inte mätningar och de är inte kopierade eller beräknade från någon undersökning eller databas. Inga källor är knutna till enskilda partier.',
        ],
        bullets: [
          'X (ekonomi) och Y (GAL–TAN): de två skalorna är modellerade efter de dimensioner som används i Chapel Hill Expert Survey (CHES): ekonomisk vänster–höger och GAL–TAN. Det är bara skaldefinitionerna som följer CHES; de enskilda värdena har inte hämtats därifrån.',
          'Z (institutionell) och W (tempo): det här är appens egna dimensioner. Det finns ingen etablerad databas för dem, så värdena är helt subjektiva bedömningar.',
          'Varje värde ligger mellan −1 och +1 och är avrundat till närmaste 0,05.',
          'Alla länder delar en skala, men varje parti har främst bedömts mot sitt eget lands politik. ”Höger” eller ”populistisk” i ett land är inte exakt detsamma som i ett annat, så jämförelser mellan länder är den svagaste delen.',
          'Koalitioner och sammanslagningar modelleras som en enhet när valet fördes så (till exempel SPOLU i Tjeckien och Centrist Reform Alliance i Japan). Positionerna speglar partierna ungefär vid deras senaste val.',
        ],
      },
      {
        id: 'seats',
        heading: 'Mandat (valresultat)',
        paragraphs: [
          'Mandatsiffrorna är de mandat som vanns i varje lands senaste nationella val till den främsta (nedre) kammaren, insamlade i november 2026. Där det varit möjligt kommer de från landets valmyndighet eller parlament; annars från Wikipedia, Robert Schuman Foundations European Elections Monitor och nyhetsbyråer (AP, Reuters, Al Jazeera).',
        ],
        bullets: [
          'Summorna har kontrollerats mot kammarens storlek. Där källorna skilde sig med något mandat har den siffra som flest källor angav använts.',
          'Frankrike (per partigrupp i parlamentet), Argentina (kammarens sammansättning) och USA (representanthuset utropat men inte slutgiltigt) är ungefärliga och markeras nedan när de är valda.',
          'Små partier är inte alla med, så de angivna mandaten kan summera till mindre än kammarens storlek. Ett parti med 0 mandat finns med i diagrammet men har inga mandat (eller ställde upp på ett annat partis lista).',
        ],
      },
      {
        id: 'weighted',
        heading: 'Viktade siffror och matchningspoäng',
        paragraphs: [],
        bullets: [
          'Ett parlaments mandatviktade läge på en axel = Σ(mandat × partiets värde) ÷ Σ(mandat), över de listade partier som har mandat. Ej listade småpartier lämnas utanför.',
          'Matchning % = (1 − d ÷ 4) × 100, där d är det raka (euklidiska) avståndet mellan din punkt och ett parti i alla fyra dimensioner, och 4 är största möjliga avstånd. Cosinuslikhet jämför bara riktning och är odefinierad i origo.',
          'Bubbelstorleken under ”Anpassa efter valresultat” bygger på mandatandel: ytan växer i proportion till andelen mandat.',
        ],
      },
      {
        id: 'governments',
        heading: 'Regeringar',
        paragraphs: [
          'Regeringspartier och stödpartier utifrån har samlats in i november 2026 från nyhetsbyråer, Wikipedia och regerings- eller parlamentssajter. För varje land visas när uppgiften senast kontrollerades; vissa är äldre än andra, och några (till exempel Frankrike) har inte kontrollerats på sistone.',
        ],
        bullets: [
          '”Stöd utifrån” betyder att ett parti stödjer regeringen utan att ha ministerposter, till exempel genom ett förtroende-, budget- eller sakpolitiskt avtal. Enstaka eller informella omröstningar räknas inte.',
          'Övergångsregeringar (där ingen ny regering ännu godkänts) markeras. Regeringspartier som inte finns på diagrammet nämns i text men ritas inte.',
          'Linjerna är ett visuellt hjälpmedel: heldragna linjer bildar ett träd som binder ihop regeringspartierna efter närhet i de fyra dimensionerna, och streckade linjer går från stödpartier utifrån till statsministerns parti. De visar inte vem som förhandlat med vem.',
        ],
      },
      {
        id: 'trust',
        heading: 'Hur mycket man kan lita på det',
        paragraphs: [
          'Rimligt för helhetsbilden: vilka partier som ligger nära varandra och partiernas inbördes ordning inom ett land. Inte tillförlitligt för exakta avstånd, små skillnader, exakta jämförelser mellan länder eller något på Z- och W-axlarna. Se det som ett diskussionsunderlag, inte forskning.',
          'Varje värde finns i countries.js, en rad per parti, och är lätt att granska och rätta. Testerna kontrollerar att datan är korrekt uppbyggd, inte att uppskattningarna stämmer.',
        ],
        bullets: [],
      },
    ],
  },
};

export const getPole = (axis, sign, lang) => (POLES[lang] ?? POLES.en)[poleKey(axis, sign)];
export const getDataNotes = (lang) => DATA_NOTES[lang] ?? DATA_NOTES.en;

export const poleKey = (axis, sign) => `${AXIS_KEYS[axis]}${sign < 0 ? '-' : '+'}`;

/** X and Y follow established dimensions; Z and W are this app's own additions. */
export const isCustomAxis = (axis) => axis >= 2;

/** How strongly a signed lean points toward a pole: 'neutral' | 'slightly' | 'moderately' | 'strongly' (translate via strength.* keys). */
export function strengthWord(m) {
  const a = Math.abs(m);
  if (a < 0.1) return 'neutral';
  if (a < 0.3) return 'slightly';
  if (a < 0.55) return 'moderately';
  return 'strongly';
}

/**
 * How a pole shows up in one country's party system, computed from the dataset:
 *  - leaders: the parties furthest toward that pole (lean >= minLean), strongest first
 *  - weighted: seat-weighted mean lean toward the pole across listed parties (null without seat data)
 * `lean` is signed so that positive = toward the pole you asked about.
 */
export function countryLean(country, axis, sign, { minLean = 0.2, top = 3 } = {}) {
  const lean = (p) => p.vec[axis] * sign;
  const leaders = country.parties
    .filter((p) => lean(p) >= minLean)
    .sort((a, b) => lean(b) - lean(a))
    .slice(0, top)
    .map((party) => ({ party, lean: lean(party) }));

  const seated = country.parties.filter((p) => (p.seats ?? 0) > 0);
  const total = seated.reduce((s, p) => s + p.seats, 0);
  const weighted = total > 0 ? seated.reduce((s, p) => s + p.seats * lean(p), 0) / total : null;
  return { leaders, weighted };
}
