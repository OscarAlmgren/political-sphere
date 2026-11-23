// Pure 4D vector math + W-axis encoding helpers. No DOM, no Three.js.

/** Largest possible distance between two points of [-1, 1]^4 (opposite corners). */
export const MAX_DISTANCE_4D = 4;
const EPS = 1e-9;

export function euclideanDistance4D(a, b) {
  let s = 0;
  for (let i = 0; i < 4; i++) {
    const d = a[i] - b[i];
    s += d * d;
  }
  return Math.sqrt(s);
}

/** Cosine similarity in [-1, 1], or null when either vector has ~zero length (direction undefined). */
export function cosineSimilarity4D(a, b) {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < 4; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  na = Math.sqrt(na);
  nb = Math.sqrt(nb);
  if (na < EPS || nb < EPS) return null;
  return Math.max(-1, Math.min(1, dot / (na * nb)));
}

/** Distance -> match percentage: 100 at distance 0, 0 at the maximum distance (4). */
export function matchPercent(distance) {
  return Math.max(0, Math.min(100, (1 - distance / MAX_DISTANCE_4D) * 100));
}

/**
 * Entities sorted by ascending 4D Euclidean distance to userVec.
 * Entities are `{ vec: [x, y, z, w], ... }`. Input array is not mutated.
 */
export function getClosestMatches(userVec, entities) {
  return entities
    .map((entity) => {
      const distance = euclideanDistance4D(userVec, entity.vec);
      return {
        entity,
        distance,
        matchPct: matchPercent(distance),
        cosine: cosineSimilarity4D(userVec, entity.vec),
      };
    })
    .sort((p, q) => p.distance - q.distance);
}

/**
 * Minimum spanning tree (Prim's algorithm) over n items: returns n - 1 edges as [i, j] index pairs, linking every
 * item to the tree through its cheapest connection. `dist(i, j)` is the edge weight. Used to draw a tidy node graph
 * between the parties of a government (a tree, not every-pair spaghetti).
 */
export function minimumSpanningTree(n, dist) {
  if (n < 2) return [];
  const inTree = new Array(n).fill(false);
  const best = new Array(n).fill(Infinity);
  const from = new Array(n).fill(-1);
  best[0] = 0;
  const edges = [];
  for (let k = 0; k < n; k++) {
    let u = -1;
    for (let i = 0; i < n; i++) if (!inTree[i] && (u === -1 || best[i] < best[u])) u = i;
    inTree[u] = true;
    if (from[u] >= 0) edges.push([from[u], u]);
    for (let v = 0; v < n; v++) {
      if (inTree[v]) continue;
      const d = dist(u, v);
      if (d < best[v]) { best[v] = d; from[v] = u; }
    }
  }
  return edges;
}

export function clamp(v, lo = -1, hi = 1) {
  return Math.max(lo, Math.min(hi, v));
}

export function clampVec4(v) {
  return v.map((c) => clamp(c));
}

export function isValidVec4(v) {
  return Array.isArray(v) && v.length === 4 && v.every((c) => Number.isFinite(c) && c >= -1 && c <= 1);
}

/* ---------- W-axis encoding: colour (OKLab gradient) and scale ---------- */

const srgbToLinear = (c) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
const linearToSrgb = (c) => (c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055);

function srgbToOklab([r, g, b]) {
  const lr = srgbToLinear(r), lg = srgbToLinear(g), lb = srgbToLinear(b);
  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}

function oklabToSrgb([L, a, b]) {
  const l = Math.pow(L + 0.3963377774 * a + 0.2158037573 * b, 3);
  const m = Math.pow(L - 0.1055613458 * a - 0.0638541728 * b, 3);
  const s = Math.pow(L - 0.0894841775 * a - 1.291485548 * b, 3);
  const lin = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
  return lin.map((c) => clamp(linearToSrgb(clamp(c, 0, 1)), 0, 1));
}

/** Gradient stops as sRGB 0..1: cool blue (w=-1) -> neutral violet (w=0) -> vibrant red/orange (w=+1). */
export const W_STOPS_HEX = { cool: '#2f6bff', neutral: '#8b5cf6', hot: '#ff4d1a' };

const hexToRgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
const STOPS_LAB = [W_STOPS_HEX.cool, W_STOPS_HEX.neutral, W_STOPS_HEX.hot].map((h) => srgbToOklab(hexToRgb(h)));

/** w in [-1, 1] -> [r, g, b] (sRGB, 0..1), interpolated in OKLab so the midpoint stays a clean violet. */
export function wToColor(w) {
  const t = (clamp(w) + 1) / 2; // 0..1
  const seg = t < 0.5 ? 0 : 1;
  const u = t < 0.5 ? t * 2 : (t - 0.5) * 2;
  const A = STOPS_LAB[seg], B = STOPS_LAB[seg + 1];
  return oklabToSrgb([0, 1, 2].map((i) => A[i] + (B[i] - A[i]) * u));
}

/**
 * Bubble scale from election result: area grows with seat share (radius ~ sqrt(share)).
 * A party holding 15% of the seats is 1.0x; a majority party is ~2x; a 0-seat party stays visible at 0.35x.
 */
export function seatScale(seats, total) {
  const share = total > 0 ? Math.max(0, seats ?? 0) / total : 0;
  return clamp(Math.sqrt(share / 0.15), 0.35, 2.2);
}

/** Subtle size modulation: 0.9 at w=-1 up to 1.15 at w=+1. */
export function wToScale(w) {
  return 0.9 + ((clamp(w) + 1) / 2) * 0.25;
}
