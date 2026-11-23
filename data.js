// Axis metadata, the "You" marker and shared constants. Party data lives in countries.js.

export const AXES = [
  { key: 'x', name: 'Economic', neg: 'State redistribution', pos: 'Free market', negShort: 'Left', posShort: 'Right' },
  { key: 'y', name: 'Sociocultural', neg: 'TAN', pos: 'GAL', negShort: 'TAN', posShort: 'GAL' },
  { key: 'z', name: 'Institutional', neg: 'Institutionalist', pos: 'Anti-establishment', negShort: 'Technocratic', posShort: 'Populist' },
  { key: 'w', name: 'Tempo', neg: 'Incrementalist', pos: 'Radical', negShort: 'Pragmatic', posShort: 'Accelerationist' },
];

export const YOU = { id: 'YOU', name: 'You', abbr: 'You', partyColor: '#ffffff', vec: [0, 0, 0, 0] };

export const SLICE_RADIUS = 0.4;

/** At most this many countries can be plotted at once (slot 0 = A, drawn as spheres; slot 1 = B, drawn as diamonds). */
export const MAX_COUNTRIES = 2;
