// Small DOM helpers + the parties table. Used by the HUD ("All parties") and by the no-WebGL fallback.
import { getClosestMatches } from './math.js';
import { t } from './i18n.js';

/** el('div', 'cls', 'text') -> element. Text is set via textContent (never parsed as HTML). */
export function el(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text !== undefined) n.textContent = text;
  return n;
}

const FLAG_BASE = 'https://cdn.jsdelivr.net/npm/flag-icons@7.6.0/flags/4x3/';

/** Small SVG flag for an ISO 3166 alpha-2 code (flag-icons, loaded from the CDN). Removes itself if it fails to load. */
export function flagImg(code) {
  const img = el('img', 'flag');
  img.src = `${FLAG_BASE}${code.toLowerCase()}.svg`;
  img.alt = ''; // decorative: the country name is in the tooltip
  img.decoding = 'async';
  img.draggable = false;
  img.addEventListener('error', () => img.remove());
  return img;
}

/** Signed 2-decimal number with a real minus sign, e.g. "+0.35" / "−0.80". */
export const fmtSigned = (v) => (v >= 0 ? '+' : '−') + Math.abs(v).toFixed(2);

/**
 * Renders a table of entities into `container`.
 * With `userVec`, rows are sorted by 4D distance and show distance / match % / cosine; without it, plain coordinates.
 */
export function renderPartyTable(container, entities, userVec = null) {
  const rows = userVec
    ? getClosestMatches(userVec, entities)
    : entities.map((entity) => ({ entity }));
  const multi = new Set(entities.map((e) => e.country)).size > 1; // add a country column when comparing two

  const table = el('table', 'party-table');
  const head = el('tr');
  const hasSeats = entities.some((e) => e.seats != null);
  const cols = [...(multi ? [t('table.ctry')] : []), t('table.party'), 'X', 'Y', 'Z', 'W', ...(hasSeats ? [t('table.seats')] : [])];
  if (userVec) cols.push(t('table.dist'), t('table.match'), t('table.cos'));
  cols.forEach((c) => head.appendChild(el('th', null, c)));
  table.appendChild(el('thead')).appendChild(head);

  const body = el('tbody');
  for (const r of rows) {
    const tr = el('tr');
    if (multi) tr.appendChild(el('td', null, r.entity.country));
    const name = el('td');
    const chip = el('span', 'chip', r.entity.abbr);
    chip.style.setProperty('--c', r.entity.partyColor);
    name.append(chip, document.createTextNode(' ' + r.entity.name));
    tr.appendChild(name);
    r.entity.vec.forEach((v) => tr.appendChild(el('td', 'num', fmtSigned(v))));
    if (hasSeats) tr.appendChild(el('td', 'num', r.entity.seats == null ? '—' : String(r.entity.seats)));
    if (userVec) {
      tr.appendChild(el('td', 'num', r.distance.toFixed(2)));
      tr.appendChild(el('td', 'num', r.matchPct.toFixed(0) + '%'));
      tr.appendChild(el('td', 'num', r.cosine === null ? '—' : r.cosine.toFixed(2)));
    }
    body.appendChild(tr);
  }
  table.appendChild(body);

  const wrap = el('div', 'table-wrap');
  wrap.appendChild(table);
  container.replaceChildren(wrap);
}
