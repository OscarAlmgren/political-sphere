// Current governments, gathered in November 2026 from news agencies, Wikipedia and government/parliament sites.
//
// For each country:
//   parties   abbreviations (as in countries.js) of the parties IN the government. Only parties that are on the chart.
//   pm        abbreviation of the prime minister's (or president's) party, or null if that party is not on the chart / not partisan
//   support   parties that back the government from outside it, without cabinet posts (confidence-and-supply, budget or
//             legislative agreements). One-off or informal votes are not counted.
//   unlisted  governing or supporting parties that are not on the chart (shown as text only)
//   status    'caretaker' when no new government has been approved yet and the outgoing one continues
//   verified  'YYYY-MM' of the most recent source found for this country (some are older than others)
//   note      { sv, en } one-line context, only where it matters

export const GOVERNMENTS_GATHERED = '2026-11';

export const GOVERNMENTS = {
  SE: {
    parties: ['M', 'KD', 'L'], pm: 'M', support: ['SD'], status: 'caretaker', verified: '2026-11',
    note: {
      en: 'Caretaker government: after the September 2026 election the Riksdag had not yet approved a new prime minister. SD supports the three Tidö parties under the Tidö agreement.',
      sv: 'Övergångsregering: efter valet i september 2026 hade riksdagen ännu inte godkänt en ny statsminister. SD stödjer de tre Tidöpartierna enligt Tidöavtalet.',
    },
  },
  NO: {
    parties: ['Ap'], pm: 'Ap', support: ['SV', 'Sp', 'R', 'MDG'], verified: '2025-12',
    note: {
      en: 'Labour governs alone as a minority. SV, Sp, Rødt and MDG backed the 2026 budget (budget cooperation, not a standing agreement).',
      sv: 'Arbeiderpartiet styr ensamt i minoritet. SV, Sp, Rødt och MDG stödde 2026 års budget (budgetsamarbete, inget stående avtal).',
    },
  },
  DK: {
    parties: ['A', 'F', 'B', 'M'], pm: 'A', support: [], verified: '2026-06',
    note: { en: 'Four-party minority government, formed in June 2026.', sv: 'Minoritetsregering med fyra partier, bildad i juni 2026.' },
  },
  FI: { parties: ['KOK', 'PS', 'RKP', 'KD'], pm: 'KOK', support: [], verified: '2026-10' },
  IS: { parties: ['S', 'C', 'FF'], pm: 'S', support: [], verified: '2026-09' },

  AT: { parties: ['ÖVP', 'SPÖ', 'NEOS'], pm: 'ÖVP', support: [], verified: '2025-03' },
  BE: { parties: ['N-VA', 'MR', 'Engagés', 'Vooruit', 'cd&v'], pm: 'N-VA', support: [], verified: '2025-02' },
  BG: { parties: ['PB'], pm: 'PB', support: [], verified: '2026-05' },
  HR: {
    parties: ['HDZ', 'DP'], pm: 'HDZ', support: [], unlisted: ['national minority parties'], verified: '2026-10',
    note: { en: 'HDZ and DP govern with support from several national-minority parties, which are not on the chart.', sv: 'HDZ och DP styr med stöd av flera nationella minoritetspartier, som inte finns på diagrammet.' },
  },
  CY: {
    parties: ['DIKO'], pm: null, support: [], verified: '2026-05',
    note: { en: 'Presidential system: the president is independent. DIKO is the only parliamentary party left in his government.', sv: 'Presidentstyre: presidenten är partilös. DIKO är det enda parlamentspartiet som finns kvar i hans regering.' },
  },
  CZ: { parties: ['ANO', 'SPD', 'AUTO'], pm: 'ANO', support: [], verified: '2026-01' },
  EE: { parties: ['RE', 'E200'], pm: 'RE', support: [], verified: '2025-03' },
  FR: {
    parties: ['REN', 'MoDem', 'HOR'], pm: 'REN', support: ['PS'], unlisted: ['UDI'], verified: '2026-02',
    note: {
      en: 'Minority government under Lecornu. The Socialists have so far avoided voting it down. Not re-checked after early 2026.',
      sv: 'Minoritetsregering under Lecornu. Socialisterna har hittills avstått från att fälla den. Inte omkontrollerad efter tidigt 2026.',
    },
  },
  DE: { parties: ['CDU/CSU', 'SPD'], pm: 'CDU/CSU', support: [], verified: '2026-05' },
  GR: { parties: ['ND'], pm: 'ND', support: [], verified: '2026-10' },
  HU: { parties: ['Tisza'], pm: 'Tisza', support: [], verified: '2026-05' },
  IE: {
    parties: ['FF', 'FG'], pm: 'FF', support: [], unlisted: ['independent TDs'], verified: '2026-09',
    note: { en: 'The coalition is backed by independent TDs (not parties).', sv: 'Koalitionen stöds av oberoende ledamöter (inga partier).' },
  },
  IT: { parties: ['FdI', 'Lega', 'FI'], pm: 'FdI', support: [], unlisted: ['Noi Moderati'], verified: '2026-11' },
  LV: {
    parties: ['AS', 'NA'], pm: 'AS', support: [], verified: '2026-11',
    note: {
      en: 'Post-election coalition as reported by Reuters on 17 November 2026; other partners are not confirmed.',
      sv: 'Koalition efter valet enligt Reuters den 17 november 2026; övriga partier är inte bekräftade.',
    },
  },
  LT: {
    parties: ['LSDP', 'DSVL', 'LVŽS'], pm: 'LSDP', support: [], verified: '2026-06',
    note: { en: 'Dawn of Nemunas was dropped in June 2026. The Farmers and Greens Union now operates as the Farmers and Christian Families Union.', sv: 'Dawn of Nemunas lämnade regeringen i juni 2026. Bonde- och gröna förbundet verkar nu som Bonde- och kristna familjers förbund.' },
  },
  LU: { parties: ['CSV', 'DP'], pm: 'CSV', support: [], verified: '2026-10' },
  MT: { parties: ['PL'], pm: 'PL', support: [], verified: '2026-06' },
  NL: {
    parties: ['D66', 'VVD', 'CDA'], pm: 'D66', support: [], verified: '2026-02',
    note: { en: 'Minority cabinet without a formal support partner: majorities are found case by case.', sv: 'Minoritetsregering utan formellt stödparti: majoriteter söks från fall till fall.' },
  },
  PL: {
    parties: ['KO', 'PSL', 'Lewica', 'PL2050'], pm: 'KO', support: [], unlisted: ['Centrum (breakaway club)'], verified: '2026-10',
    note: { en: 'Fragile majority: Poland 2050 has split and a breakaway club (Centrum) is not on the chart.', sv: 'Skör majoritet: Polska 2050 har splittrats och en utbrytargrupp (Centrum) finns inte på diagrammet.' },
  },
  PT: {
    parties: ['PSD', 'CDS-PP'], pm: 'PSD', support: [], verified: '2025-12',
    note: { en: 'The AD alliance (PSD and CDS) governs as a minority. The PS abstained on the 2026 budget (no formal agreement).', sv: 'Alliansen AD (PSD och CDS) styr i minoritet. PS lade ned sina röster i 2026 års budget (inget formellt avtal).' },
  },
  RO: {
    parties: ['PNL', 'USR', 'UDMR'], pm: 'PNL', support: [], status: 'caretaker', verified: '2026-09',
    note: {
      en: 'Caretaker: the Bolojan government fell in May 2026 and parliament rejected a new prime minister-designate on 30 September. No new government is confirmed.',
      sv: 'Övergångsregering: Bolojans regering föll i maj 2026 och parlamentet förkastade en ny statsministerkandidat den 30 september. Ingen ny regering är bekräftad.',
    },
  },
  SK: { parties: ['Smer', 'Hlas', 'SNS'], pm: 'Smer', support: [], verified: '2026-05' },
  SI: {
    parties: ['SDS', 'NSi', 'DEM'], pm: 'SDS', support: ['RES'], unlisted: ['SLS', 'Fokus'], verified: '2026-06',
    note: { en: 'Resni.ca backs the government from outside without cabinet posts. SLS and Fokus also govern but are not on the chart.', sv: 'Resni.ca stödjer regeringen utifrån utan ministerposter. SLS och Fokus ingår också men finns inte på diagrammet.' },
  },
  ES: {
    parties: ['PSOE', 'Sumar'], pm: 'PSOE', support: ['ERC', 'Bildu', 'PNV'], verified: '2026-09',
    note: { en: 'PSOE–Sumar coalition, backed in parliament by ERC, EH Bildu and PNV. Junts has distanced itself.', sv: 'PSOE–Sumar-koalition, stödd i parlamentet av ERC, EH Bildu och PNV. Junts har tagit avstånd.' },
  },

  GB: {
    parties: ['Lab'], pm: 'Lab', support: [], verified: '2026-07',
    note: { en: 'Starmer resigned in 2026; Labour still governs under a new leader.', sv: 'Starmer avgick 2026; Labour styr fortfarande under en ny ledare.' },
  },
  AR: {
    parties: ['LLA'], pm: 'LLA', support: ['PRO', 'UCR'], verified: '2026-07',
    note: { en: 'LLA governs; PRO and UCR are legislative allies, and the cabinet chief is a former PRO politician.', sv: 'LLA styr; PRO och UCR är allierade i kongressen, och kabinettschefen är en tidigare PRO-politiker.' },
  },
  JP: {
    parties: ['LDP', 'Ishin'], pm: 'LDP', support: [], verified: '2026-10',
    note: { en: 'LDP–Ishin coalition (Ishin joined the cabinet in 2026).', sv: 'LDP–Ishin-koalition (Ishin gick in i regeringen 2026).' },
  },
  US: {
    parties: ['Rep'], pm: 'Rep', support: [], verified: '2026-11',
    note: { en: 'The executive branch: a Republican administration. Democrats take over the House in January 2027.', sv: 'Den verkställande makten: en republikansk administration. Demokraterna tar över representanthuset i januari 2027.' },
  },
  CA: {
    parties: ['Lib'], pm: 'Lib', support: [], verified: '2026-04',
    note: { en: 'Liberal majority since April 2026 (by-elections and floor-crossings).', sv: 'Liberal majoritet sedan april 2026 (fyllnadsval och partiövergångar).' },
  },
  IN: {
    parties: ['BJP'], pm: 'BJP', support: [], unlisted: ['TDP', 'JD(U)', 'other NDA allies'], verified: '2024-06',
    note: { en: 'The NDA alliance led by the BJP; its allies are not on the chart.', sv: 'NDA-alliansen under ledning av BJP; dess allierade finns inte på diagrammet.' },
  },
};

export const GOVERNMENT_BY_CODE = new Map(Object.entries(GOVERNMENTS).map(([code, g]) => [code, {
  unlisted: [], status: null, note: null, ...g,
}]));
