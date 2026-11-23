import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { AXES, YOU, SLICE_RADIUS, MAX_COUNTRIES } from './data.js';
import { COUNTRIES, COUNTRY_GROUPS, COUNTRY_BY_CODE, DEFAULT_COUNTRY } from './countries.js';
import { getClosestMatches, wToColor, wToScale, seatScale } from './math.js';
import { getPole, getDataNotes, isCustomAxis, strengthWord, countryLean } from './explain.js';
import { el, flagImg, fmtSigned, renderPartyTable } from './table.js';
import { LANGS, t, tr, trAttr, trCountry, getLang, setLang, onLangChange, countryName, electionLabel } from './i18n.js';

const $ = (id) => document.getElementById(id);
const stage = $('stage');
const hud = $('hud');
const tooltip = $('tooltip');
const reduceMotionMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
const desktopMQ = window.matchMedia('(min-width: 768px)');

const toThreeColor = ([r, g, b]) => new THREE.Color().setRGB(r, g, b, THREE.SRGBColorSpace);
const css = ([r, g, b]) => `rgb(${Math.round(r * 255)} ${Math.round(g * 255)} ${Math.round(b * 255)})`;

/* ------------------------------------------------------------------ state */
const state = {
  you: [...YOU.vec],
  size: { party: 1, you: 1 }, // bubble size multipliers (HUD "Display" sliders)
  slots: [DEFAULT_COUNTRY, null], // selected country codes: slot 0 = A (spheres), slot 1 = B (diamonds)
  showYou: false, // the "You" marker starts hidden; tick the checkbox to show it
  bySeats: false, // size party bubbles by seat share in the latest election
  explain: null,  // { type: 'axis', axis, sign } or { type: 'data' } while the explainer box is open
  slice: false,
  pinned: null, // entity id pinned by click/tap
  hover: null,  // entity id under the mouse
};
let matchById = new Map();

/* --------------------------------------------------------------- renderer */
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
renderer.domElement.className = 'gl';
stage.prepend(renderer.domElement);

const labelRenderer = new CSS2DRenderer();
labelRenderer.domElement.classList.add('labels');
stage.prepend(labelRenderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
camera.position.set(3.4, 2.5, 4.2);
scene.add(new THREE.AmbientLight(0xffffff, 1.0));
const sun = new THREE.DirectionalLight(0xffffff, 2.2);
sun.position.set(3, 5, 4);
scene.add(sun);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = !reduceMotionMQ.matches;
controls.dampingFactor = 0.08;
controls.rotateSpeed = 0.8;
controls.zoomSpeed = 0.8;
controls.enablePan = false;
controls.minDistance = 2.5;
controls.maxDistance = 14;
reduceMotionMQ.addEventListener('change', () => { controls.enableDamping = !reduceMotionMQ.matches; });

/* ------------------------------------------------------------ space / axes */
const gridPlanes = {}; // box | xy | xz | yz | floor -> object3D, toggled from the HUD
function buildSpace() {
  const g = new THREE.Group();
  const box = new THREE.BoxGeometry(2, 2, 2);

  // Outer box: translucent faces + edges, shown/hidden together from the HUD.
  const outerBox = new THREE.Group();
  outerBox.add(new THREE.Mesh(box, new THREE.MeshBasicMaterial({
    color: 0x6f86ff, transparent: true, opacity: 0.05, side: THREE.BackSide, depthWrite: false,
  })));
  outerBox.add(new THREE.LineSegments(new THREE.EdgesGeometry(box), new THREE.LineBasicMaterial({
    color: 0x9db0ff, transparent: true, opacity: 0.55,
  })));
  g.add(outerBox);

  const grid = (opacity) => {
    const gr = new THREE.GridHelper(2, 10, 0x8ea2ff, 0x8ea2ff);
    gr.material.transparent = true;
    gr.material.opacity = opacity;
    gr.material.depthWrite = false;
    return gr;
  };
  const gXZ = grid(0.16);                         // y = 0 (horizontal)
  const gXY = grid(0.16); gXY.rotation.x = Math.PI / 2; // z = 0
  const gYZ = grid(0.16); gYZ.rotation.z = Math.PI / 2; // x = 0
  const floor = grid(0.26); floor.position.y = -1;      // Y = -1 floor where drop-lines land
  g.add(gXZ, gXY, gYZ, floor);
  Object.assign(gridPlanes, { box: outerBox, xy: gXY, xz: gXZ, yz: gYZ, floor });
  // Default view: only the outer box. The grid planes are opt-in from the HUD.
  for (const k of ['xy', 'xz', 'yz', 'floor']) gridPlanes[k].visible = false;

  // The three axes through the origin are separate from the grids, so they stay visible when grids are hidden.
  const axisMat = new THREE.LineBasicMaterial({ color: 0xe4eaff, transparent: true, opacity: 0.9 });
  for (let i = 0; i < 3; i++) {
    const a = [0, 0, 0], b = [0, 0, 0];
    a[i] = -1; b[i] = 1;
    g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(...a), new THREE.Vector3(...b)]), axisMat));
  }

  // Axis-end labels: crisp HTML text projected by CSS2DRenderer (sharp on HiDPI). Clickable: opens the explainer.
  AXES.slice(0, 3).forEach((ax, i) => {
    [-1, 1].forEach((sign) => {
      const div = el('button', 'axis-label');
      div.type = 'button';
      div.addEventListener('click', () => openExplainer(i, sign, div));
      div.append(
        el('span', 'k', (sign < 0 ? '−' : '+') + ax.key.toUpperCase()),
        tr(el('span', 't'), `axis.${ax.key}.${sign < 0 ? 'neg' : 'pos'}`),
      );
      const obj = new CSS2DObject(div);
      const p = [0, 0, 0];
      p[i] = sign * 1.14;
      obj.position.set(...p);
      g.add(obj);
    });
  });
  scene.add(g);
}
buildSpace();

/* ---------------------------------------------------------------- entities */
const sphereGeo = new THREE.SphereGeometry(0.055, 32, 20);
const diamondGeo = new THREE.OctahedronGeometry(0.078); // country B's marker shape
const hitGeo = new THREE.SphereGeometry(0.13, 12, 8); // generous touch target
const dotGeo = new THREE.CircleGeometry(0.03, 20).rotateX(-Math.PI / 2);
const ringGeo = new THREE.RingGeometry(0.085, 0.1, 48);
const pickables = []; // hit meshes of currently visible entities (rebuilt by refreshPickables)

function createEntity(e, isYou = false) {
  const group = new THREE.Group();

  const mat = new THREE.MeshStandardMaterial({ roughness: 0.35, metalness: 0.05, transparent: true, emissiveIntensity: 0.3 });
  const sphere = new THREE.Mesh(sphereGeo, mat);

  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(6), 3));
  const lineMat = new THREE.LineBasicMaterial({ transparent: true, opacity: 0.6 });
  const line = new THREE.Line(lineGeo, lineMat);
  line.frustumCulled = false; // vertices are rewritten on update; the cached bounding sphere would go stale

  const dotMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.6, depthWrite: false });
  const dot = new THREE.Mesh(dotGeo, dotMat);

  const hit = new THREE.Mesh(hitGeo, new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }));
  hit.userData.id = e.id;

  const labelEl = el('div', 'entity-label' + (isYou ? ' you' : ''), e.abbr);
  labelEl.style.color = e.partyColor;
  if (isYou) tr(labelEl, 'you.label'); // "You" / "Du"
  if (e.country) labelEl.prepend(flagImg(e.country)); // flag next to the party abbreviation (not for "You")
  const label = new CSS2DObject(labelEl);

  group.add(line, dot, sphere, hit, label);

  let ring = null;
  if (isYou) {
    ring = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0.9 }));
    group.add(ring);
  }
  scene.add(group);
  return { e, isYou, slot: 0, group, sphere, mat, line, lineMat, dot, dotMat, hit, labelEl, label, ring };
}

/** Slot A parties are spheres, slot B parties are diamonds (colour/size are reserved for W). */
function setSlot(obj, slot) {
  obj.slot = slot;
  obj.sphere.geometry = slot === 1 ? diamondGeo : sphereGeo;
  obj.labelEl.classList.toggle('slot-b', slot === 1);
}

function updateEntity(obj, vec) {
  const [x, y, z, w] = vec;
  const col = toThreeColor(wToColor(w));
  obj.group.position.set(x, y, z);
  obj.mat.color.copy(col);
  obj.mat.emissive.copy(col);
  obj.lineMat.color.copy(col);
  obj.dotMat.color.copy(col);
  // Party size: W-based by default, or seat share of the latest election. "You" always uses the W-based size.
  const base = !obj.isYou && state.bySeats ? seatScale(obj.e.seats, obj.e.total) : wToScale(w);
  const s = base * (obj.isYou ? 1.3 : 1) * (obj.isYou ? state.size.you : state.size.party);
  obj.sphere.scale.setScalar(s);
  obj.dot.scale.setScalar(Math.max(1, s));
  obj.hit.scale.setScalar(Math.max(1, (0.055 * s * 1.2) / 0.13)); // keep the pick target at least as big as the bubble
  // Drop-line to the Y = -1 floor (group-local coordinates).
  const pos = obj.line.geometry.attributes.position;
  pos.setXYZ(0, 0, 0, 0);
  pos.setXYZ(1, 0, -1 - y, 0);
  pos.needsUpdate = true;
  obj.dot.position.set(0, -1 - y + 0.004, 0);
  obj.label.position.set(0, 0.12 * s + 0.03, 0);
}

function setDim(obj, dim) {
  obj.mat.opacity = dim ? 0.18 : 1;
  obj.lineMat.opacity = dim ? 0.07 : 0.6;
  obj.dotMat.opacity = dim ? 0.07 : 0.6;
  obj.labelEl.classList.toggle('dim', dim);
}

const youObj = createEntity(YOU, true);
const entityById = new Map([[YOU.id, youObj]]);

// Outline around the clicked (pinned) bubble: one shared unit ring, billboarded and sized to the bubble each frame.
const selRing = new THREE.Mesh(
  new THREE.RingGeometry(0.86, 1, 64),
  new THREE.MeshBasicMaterial({ color: 0xffd84a, side: THREE.DoubleSide, transparent: true, opacity: 0.95, depthTest: false }),
);
selRing.renderOrder = 10;
selRing.visible = false;
scene.add(selRing);
const entitiesByCountry = new Map(); // code -> party entity objects; created on first selection, then just hidden/shown

function ensureCountry(code) {
  if (entitiesByCountry.has(code)) return;
  const objs = COUNTRY_BY_CODE.get(code).parties.map((p) => {
    const o = createEntity(p);
    updateEntity(o, p.vec);
    entityById.set(p.id, o);
    return o;
  });
  entitiesByCountry.set(code, objs);
}

/** Entity objects of the currently selected countries (slot order). */
function activeObjs() {
  return state.slots.flatMap((code) => (code ? entitiesByCountry.get(code) ?? [] : []));
}

function refreshPickables() {
  pickables.length = 0;
  for (const o of entityById.values()) if (o.group.visible) pickables.push(o.hit);
  // Drop a hover/pin that points at something no longer shown.
  for (const k of ['pinned', 'hover']) {
    if (state[k] && !entityById.get(state[k])?.group.visible) state[k] = null;
  }
}

/* ---------------------------------------------------- layout / camera fit */
let fitted = false;
const free = { w: 0, h: 0 }; // canvas area not covered by the HUD

/** Camera distance that frames the whole cube (plus label room) in the free area. */
function fitDistance() {
  const halfV = THREE.MathUtils.degToRad(camera.fov / 2);
  const halfH = Math.atan(Math.tan(halfV) * (free.w / free.h));
  const radius = 2.1; // cube half-diagonal plus label room
  return Math.min(controls.maxDistance, Math.max(5.2, radius / Math.sin(Math.min(halfV, halfH))));
}

function layout() {
  const w = stage.clientWidth, h = stage.clientHeight;
  if (!w || !h) return;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(w, h);
  labelRenderer.setSize(w, h);
  camera.aspect = w / h;

  // The HUD overlays the canvas, so shift the projection to centre the cube in the free area.
  const r = hud.getBoundingClientRect();
  const desktop = desktopMQ.matches;
  const freeW = desktop ? w - (r.width + 16) : w;
  const freeH = desktop ? h : h - r.height;
  if (desktop) camera.setViewOffset(w, h, (r.width + 16) / 2, 0, w, h);
  else camera.setViewOffset(w, h, 0, r.height / 2, w, h);
  camera.updateProjectionMatrix();

  free.w = freeW;
  free.h = freeH;
  if (!fitted && freeW > 0 && freeH > 40) {
    fitted = true;
    camera.position.setLength(fitDistance());
  }
}
new ResizeObserver(layout).observe(stage);
new ResizeObserver(layout).observe(hud);
desktopMQ.addEventListener('change', layout);

/* ------------------------------------------------------------- HUD: build */
const slidersEl = $('sliders');
const sliderRefs = AXES.map((ax, i) => {
  const id = `slider-${ax.key}`;
  const row = el('div', 'slider-row');

  const head = el('div', 'slider-head');
  const label = el('label', 'slider-label');
  label.htmlFor = id;
  label.append(el('span', 'axis-key', ax.key.toUpperCase()), tr(el('span', 'axis-name'), `axis.${ax.key}.name`));
  const out = el('output', 'slider-val', '+0.00');
  out.htmlFor = id;
  head.append(label, out);

  const input = el('input');
  input.type = 'range';
  input.id = id;
  input.min = '-1';
  input.max = '1';
  input.step = '0.05';
  input.value = '0';
  input.addEventListener('input', () => {
    state.you[i] = Math.round(parseFloat(input.value) * 100) / 100;
    render();
  });

  // Pole labels under the slider open the explainer (this is the way to reach the W axis, which has no 3D labels).
  const poleBtn = (sign) => {
    const b = tr(el('button', 'pole-btn'), sign < 0 ? 'slider.poleNeg' : 'slider.polePos', { pole: `@axis.${ax.key}.${sign < 0 ? 'neg' : 'pos'}` });
    b.type = 'button';
    trAttr(b, 'title', 'slider.poleTip');
    b.addEventListener('click', () => openExplainer(i, sign, b));
    return b;
  };
  const poles = el('div', 'poles');
  poles.append(poleBtn(-1), poleBtn(1));
  row.append(head, input, poles);
  slidersEl.appendChild(row);
  return { ax, input, out };
});

// W gradient: same OKLab interpolation as the spheres, sampled for legend and the W slider track.
const gradient = 'linear-gradient(to right, ' + Array.from({ length: 11 }, (_, k) => {
  const w = -1 + k * 0.2;
  return `${css(wToColor(w))} ${k * 10}%`;
}).join(', ') + ')';
$('w-legend').style.background = gradient;
sliderRefs[3].input.style.setProperty('--track', gradient);

// Display: bubble size sliders (multipliers on top of the W-based scale).
function applySizes() {
  // Hidden countries are re-updated when they are next shown (see applyCountrySelection).
  activeObjs().forEach((p) => updateEntity(p, p.e.vec));
  updateEntity(youObj, state.you);
}
[
  { key: 'party', labelKey: 'size.party' },
  { key: 'you', labelKey: 'size.you' },
].forEach(({ key, labelKey }) => {
  const id = `size-${key}`;
  const row = el('div', 'slider-row');
  const head = el('div', 'slider-head');
  const lab = el('label', 'slider-label');
  lab.htmlFor = id;
  lab.append(tr(el('span', 'axis-name'), labelKey));
  const out = el('output', 'slider-val', '1.0×');
  out.htmlFor = id;
  head.append(lab, out);

  const input = el('input');
  input.type = 'range';
  input.id = id;
  input.min = '0.4';
  input.max = '3';
  input.step = '0.1';
  input.value = '1';
  input.addEventListener('input', () => {
    const v = Math.round(parseFloat(input.value) * 10) / 10;
    state.size[key] = v;
    out.textContent = v.toFixed(1) + '×';
    applySizes();
  });
  row.append(head, input);
  $('display-controls').appendChild(row);
});

// Grid plane toggles. Axis lines through the origin are not part of these grids and always stay on.
const gridBoxes = [];
['box', 'xy', 'xz', 'yz', 'floor'].forEach((key) => {
  const wrap = el('label', 'check');
  trAttr(wrap, 'title', `grid.${key}.tip`);
  const box = el('input');
  box.type = 'checkbox';
  box.checked = gridPlanes[key].visible;
  box.addEventListener('change', () => { gridPlanes[key].visible = box.checked; syncGridAll(); });
  gridBoxes.push({ key, box });
  wrap.append(box, tr(el('span'), `grid.${key}`));
  $('grid-toggles').appendChild(wrap);
});

// All on/off: hides every grid if any is showing, otherwise shows them all.
const gridAllBtn = el('button', 'btn');
gridAllBtn.type = 'button';
function syncGridAll() {
  tr(gridAllBtn, gridBoxes.some(({ box }) => box.checked) ? 'grid.hideAll' : 'grid.showAll');
}
gridAllBtn.addEventListener('click', () => {
  const show = !gridBoxes.some(({ box }) => box.checked);
  gridBoxes.forEach(({ key, box }) => { box.checked = show; gridPlanes[key].visible = show; });
  syncGridAll();
});
$('grid-toggles').appendChild(gridAllBtn);
syncGridAll();

/* Countries: up to MAX_COUNTRIES at once. Slot A draws spheres, slot B draws diamonds. */
const SLOT_GLYPH = ['●', '◆']; // ● ◆
const SLOT_NAME = ['A', 'B'];
const countryButtons = new Map();
for (const grp of COUNTRY_GROUPS) {
  const members = COUNTRIES.filter((c) => c.group === grp.id);
  if (!members.length) continue;
  const box = el('div', 'country-group');
  box.appendChild(tr(el('h3', 'group-label'), `group.${grp.id}`));
  const chips = el('div', 'chip-list');
  for (const c of members) {
    const b = trCountry(el('button', 'country-btn'), c.code);
    b.type = 'button';
    b.setAttribute('aria-pressed', 'false');
    b.addEventListener('click', () => toggleCountry(c.code));
    countryButtons.set(c.code, b);
    chips.appendChild(b);
  }
  box.appendChild(chips);
  $('country-list').appendChild(box);
}

function toggleCountry(code) {
  const i = state.slots.indexOf(code);
  if (i >= 0) {
    state.slots[i] = null;
  } else {
    const free = state.slots.indexOf(null);
    if (free < 0) return; // already MAX_COUNTRIES selected
    state.slots[free] = code;
  }
  applyCountrySelection();
}

function syncCountryUI() {
  const full = state.slots.every(Boolean);
  countryButtons.forEach((b, code) => {
    const slot = state.slots.indexOf(code);
    b.setAttribute('aria-pressed', String(slot >= 0));
    b.dataset.slot = slot >= 0 ? String(slot) : '';
    b.disabled = full && slot < 0;
    b.title = b.disabled ? t('country.full', { max: MAX_COUNTRIES }) : '';
  });
  $('country-slots').replaceChildren(...state.slots.map((code, i) => {
    const row = el('div', 'slot-row');
    row.append(
      el('span', 'slot-glyph', SLOT_GLYPH[i]),
      el('span', 'slot-name', code ? `${SLOT_NAME[i]}: ${countryName(code)}` : t('country.slotNone', { slot: SLOT_NAME[i] })),
    );
    if (code) {
      const x = el('button', 'slot-clear', '×');
      x.type = 'button';
      x.setAttribute('aria-label', t('country.remove', { country: countryName(code) }));
      x.addEventListener('click', () => toggleCountry(code));
      row.appendChild(x);
    }
    return row;
  }));
}

/** Create/show the selected countries' parties, hide the rest, then refresh everything that depends on them. */
function applyCountrySelection() {
  for (const code of state.slots) if (code) ensureCountry(code);
  for (const [code, objs] of entitiesByCountry) {
    const slot = state.slots.indexOf(code);
    for (const o of objs) {
      o.group.visible = slot >= 0;
      if (slot >= 0) { setSlot(o, slot); updateEntity(o, o.e.vec); } // re-apply: size sliders may have moved while hidden
    }
  }
  refreshPickables();
  syncCountryUI();
  render();
  if (state.explain) renderExplainer(); // keep the open explainer in step with the selected countries
}

/* Explainer box: an axis end (click an axis label in 3D or a pole label under a slider) or the data notes. */
const explainer = $('explainer');
let explainerTrigger = null;

function showExplainer(trigger) {
  explainerTrigger = trigger ?? null;
  renderExplainer();
  explainer.hidden = false;
  $('explainer-close').focus({ preventScroll: true });
}
function openExplainer(axis, sign, trigger) {
  state.explain = { type: 'axis', axis, sign };
  showExplainer(trigger);
}
function openDataExplainer(trigger) {
  state.explain = { type: 'data' };
  showExplainer(trigger);
}
$('data-info').addEventListener('click', (ev) => openDataExplainer(ev.currentTarget));

function closeExplainer() {
  if (explainer.hidden) return;
  explainer.hidden = true;
  state.explain = null;
  explainerTrigger?.focus?.({ preventScroll: true });
  explainerTrigger = null;
}
$('explainer-close').addEventListener('click', closeExplainer);

function renderExplainer() {
  if (state.explain.type === 'data') return renderDataExplainer();
  const { axis, sign } = state.explain;
  const lang = getLang();
  const pole = getPole(axis, sign, lang);
  const opposite = getPole(axis, -sign, lang);
  const ax = AXES[axis];

  $('explainer-title').textContent = pole.title;
  $('explainer-aka').textContent = t('ex.axisLine', {
    name: `@axis.${ax.key}.name`, mark: (sign < 0 ? '−' : '+') + ax.key.toUpperCase(), aka: pole.aka,
  });

  const body = [el('p', null, pole.summary)];
  body.push(el('h3', null, t('ex.typical')));
  const ul = el('ul');
  pole.typical.forEach((line) => ul.appendChild(el('li', null, line)));
  body.push(ul);
  if (isCustomAxis(axis)) body.push(el('p', 'note', t('ex.custom')));

  body.push(el('h3', null, t('ex.inCountries')));
  const codes = state.slots.filter(Boolean);
  if (!codes.length) body.push(el('p', 'note', t('ex.pick')));
  codes.forEach((code) => {
    const c = COUNTRY_BY_CODE.get(code);
    const { leaders, weighted } = countryLean(c, axis, sign);
    const block = el('div', 'ex-country');
    const head = el('div', 'ex-head');
    head.append(flagImg(code), el('span', null, `${SLOT_GLYPH[state.slots.indexOf(code)]} ${countryName(c)}`));
    block.appendChild(head);

    block.appendChild(el('p', null, leaders.length
      ? t('ex.furthest', {
        list: leaders.map(({ party }) =>
          `${party.abbr} (${fmtSigned(party.vec[axis])}${party.seats ? ', ' + t('ex.seatsShort', { n: party.seats }) : ''})`).join(', '),
      })
      : t('ex.none')));

    if (weighted !== null) {
      const word = strengthWord(weighted);
      const phrase = word === 'neutral'
        ? t('ex.neutral')
        : t('ex.towards', { strength: t(`strength.${word}`), pole: weighted > 0 ? pole.title : opposite.title });
      block.appendChild(el('p', null, t('ex.weighted', { phrase, value: fmtSigned(weighted * sign) })));
    }
    body.push(block);
  });
  body.push(el('p', 'note', t('ex.computed')));
  $('explainer-body').replaceChildren(...body);
}

/** The "Where the numbers come from" box: fixed method notes plus the data actually used for the selected countries. */
function renderDataExplainer() {
  const notes = getDataNotes(getLang());
  $('explainer-title').textContent = notes.title;
  $('explainer-aka').textContent = notes.aka;

  const body = [];
  for (const s of notes.sections) {
    body.push(el('h3', null, s.heading));
    s.paragraphs.forEach((line) => body.push(el('p', null, line)));
    if (s.bullets.length) {
      const ul = el('ul');
      s.bullets.forEach((line) => ul.appendChild(el('li', null, line)));
      body.push(ul);
    }
    // Right after the seats section: the exact election used for each selected country.
    if (s.id === 'seats') {
      const codes = state.slots.filter(Boolean);
      if (!codes.length) body.push(el('p', 'note', t('data.pick')));
      codes.forEach((code) => {
        const c = COUNTRY_BY_CODE.get(code);
        const listed = c.parties.reduce((sum, p) => sum + p.seats, 0);
        const block = el('div', 'ex-country');
        const head = el('div', 'ex-head');
        head.append(flagImg(code), el('span', null, `${SLOT_GLYPH[state.slots.indexOf(code)]} ${countryName(c)}`));
        block.append(
          head,
          el('p', null, t('data.listed', { label: electionLabel(c.election), listed, total: c.election.total, n: c.parties.length })),
        );
        if (c.election.approx) block.appendChild(el('p', 'note', t('data.approx')));
        body.push(block);
      });
    }
  }
  $('explainer-body').replaceChildren(...body);
}

// Election-result sizing: bubble area follows each party's seat share in its country's latest election.
$('seat-toggle').addEventListener('change', (e) => {
  state.bySeats = e.target.checked;
  applySizes();
  render();
});

// Show/hide the "You" marker. Sliders, matches and slice mode keep using your position either way.
$('you-toggle').addEventListener('change', (e) => {
  state.showYou = e.target.checked;
  youObj.group.visible = state.showYou;
  refreshPickables();
  render();
});

$('reset').addEventListener('click', () => { state.you = [...YOU.vec]; render(); });
$('slice-toggle').addEventListener('change', (e) => { state.slice = e.target.checked; render(); });

const partiesDetails = $('all-parties');
partiesDetails.addEventListener('toggle', () => { if (partiesDetails.open) renderPartyTable($('party-table'), activeObjs().map((o) => o.e), state.you); });

$('hud-toggle').addEventListener('click', () => {
  const collapsed = hud.classList.toggle('collapsed');
  $('hud-toggle').setAttribute('aria-expanded', String(!collapsed));
  trAttr($('hud-toggle'), 'aria-label', collapsed ? 'hud.expand' : 'hud.collapse');
});
if (!desktopMQ.matches && window.innerHeight < 600) $('hud-toggle').click(); // short phones start collapsed

/* ----------------------------------------------------------------- render */
function leaning(ax, v) {
  if (Math.abs(v) < 0.05) return t('ex.neutral');
  return `${Math.abs(v) >= 0.5 ? t('strength.strongly') + ' ' : ''}${t(`axis.${ax.key}.${v < 0 ? 'neg' : 'pos'}`)}`;
}

function render() {
  const you = state.you;
  youObj.group.visible = state.showYou;
  $('you-hint').hidden = state.showYou;
  updateEntity(youObj, you);
  const active = activeObjs();
  const matches = getClosestMatches(you, active.map((o) => o.e));
  matchById = new Map(matches.map((m) => [m.entity.id, m]));

  sliderRefs.forEach(({ ax, input, out }, i) => {
    if (parseFloat(input.value) !== you[i]) input.value = String(you[i]);
    out.textContent = fmtSigned(you[i]);
    input.setAttribute('aria-valuetext', `${fmtSigned(you[i])}, ${leaning(ax, you[i])}`);
  });

  // W-slice: dim entities outside ±SLICE_RADIUS of the user's W (instead of hiding them, to keep spatial context).
  let inSlice = 0;
  for (const p of active) {
    const outside = Math.abs(p.e.vec[3] - you[3]) > SLICE_RADIUS + 1e-9;
    if (!outside) inSlice++;
    setDim(p, state.slice && outside);
  }
  $('slice-count').textContent = state.slice
    ? t('slice.on', { n: inSlice, m: active.length, r: SLICE_RADIUS })
    : t('slice.off', { r: SLICE_RADIUS });

  // Leaderboard: top 3 in full 4D, per selected country.
  const stat = (k, v) => { const s = el('span'); s.append(document.createTextNode(k + ' '), el('b', null, v)); return s; };
  const sections = state.slots.map((code, slot) => {
    if (!code) return null;
    const sec = el('section', 'lb-country');
    sec.appendChild(el('h3', 'lb-head', `${SLOT_GLYPH[slot]} ${countryName(code)}`));
    const ol = el('ol');
    matches.filter((m) => m.entity.country === code).slice(0, 3).forEach((m, idx) => {
      const li = el('li');
      const name = el('div', 'lb-name');
      const chip = el('span', 'chip', m.entity.abbr);
      chip.style.setProperty('--c', m.entity.partyColor);
      name.append(chip, document.createTextNode(m.entity.name));
      const stats = el('div', 'lb-stats');
      stats.append(
        stat(t('matches.distance'), m.distance.toFixed(2)),
        stat(t('matches.match'), m.matchPct.toFixed(0) + '%'),
        stat(t('matches.cosine'), m.cosine === null ? '—' : m.cosine.toFixed(2)),
      );
      li.append(el('span', 'rank', String(idx + 1)), name, stats);
      ol.appendChild(li);
    });
    sec.appendChild(ol);
    return sec;
  }).filter(Boolean);
  $('leaderboard').replaceChildren(...(sections.length ? sections : [el('p', 'hint', t('matches.pick'))]));
  $('cos-hint').hidden = matches.length === 0 || matches.every((m) => m.cosine !== null);

  // Note under the seat toggle: which selected countries have approximate seat figures.
  const approx = state.slots.filter(Boolean).map((c) => COUNTRY_BY_CODE.get(c)).filter((c) => c.election.approx).map((c) => countryName(c));
  $('seat-note').textContent = t('size.note') + (approx.length ? t('size.approx', { names: approx.join(', ') }) : '');

  if (partiesDetails.open) renderPartyTable($('party-table'), active.map((o) => o.e), you);
}

/* ------------------------------------------------- hover / click / tooltip */
const raycaster = new THREE.Raycaster();
const ndc = new THREE.Vector2();
const tmp = new THREE.Vector3();
const el3d = renderer.domElement;
let lastPtr = null;
let hoverDirty = false;
let down = null;

function pick(clientX, clientY) {
  const r = el3d.getBoundingClientRect();
  ndc.set(((clientX - r.left) / r.width) * 2 - 1, -((clientY - r.top) / r.height) * 2 + 1);
  raycaster.setFromCamera(ndc, camera);
  const hit = raycaster.intersectObjects(pickables, false)[0];
  return hit ? hit.object.userData.id : null;
}

el3d.addEventListener('pointermove', (ev) => {
  if (ev.pointerType === 'touch') return; // touch has no hover; taps pin instead
  lastPtr = { x: ev.clientX, y: ev.clientY };
  hoverDirty = true;
});
el3d.addEventListener('pointerleave', () => { lastPtr = null; state.hover = null; hoverDirty = false; stage.classList.remove('hovering'); });
el3d.addEventListener('pointerdown', (ev) => { down = { x: ev.clientX, y: ev.clientY }; });
el3d.addEventListener('pointercancel', () => { down = null; });
el3d.addEventListener('pointerup', (ev) => {
  if (!down) return;
  const moved = Math.hypot(ev.clientX - down.x, ev.clientY - down.y);
  down = null;
  if (moved > 6) return; // it was an orbit drag, not a click/tap
  const id = pick(ev.clientX, ev.clientY);
  state.pinned = id && id !== state.pinned ? id : null;
});
document.addEventListener('keydown', (ev) => {
  if (ev.key !== 'Escape') return;
  if (!$('explainer').hidden) closeExplainer(); // Esc closes the explainer first, then clears a pinned bubble
  else state.pinned = null;
});

let ttKey = '';
function updateTooltip() {
  const id = state.hover ?? state.pinned;
  const obj = id && entityById.get(id);
  if (!obj) { if (!tooltip.hidden) tooltip.hidden = true; ttKey = ''; return; }

  const vec = obj.isYou ? state.you : obj.e.vec;
  const m = matchById.get(id);
  const key = getLang() + id + vec.join();
  if (key !== ttKey) {
    ttKey = key;
    const parts = [el('div', 'tt-name', obj.isYou ? t('you.label') : `${obj.e.name} (${obj.e.abbr})`),
      ...(obj.isYou ? [] : [el('div', 'tt-extra', countryName(obj.e.country))]),
      el('div', 'tt-coords', `(${vec.map(fmtSigned).join(', ')})`)];
    if (!obj.isYou && obj.e.seats != null) {
      parts.push(el('div', 'tt-extra', t('tooltip.seats', {
        seats: obj.e.seats,
        total: obj.e.total,
        pct: ((100 * obj.e.seats) / obj.e.total).toFixed(1),
        election: electionLabel(COUNTRY_BY_CODE.get(obj.e.country).election),
      })));
    }
    if (m) parts.push(el('div', 'tt-extra', t('tooltip.match', { pct: m.matchPct.toFixed(0), d: m.distance.toFixed(2) })));
    tooltip.replaceChildren(...parts);
  }
  tooltip.hidden = false;

  // Anchor to the sphere's projected position so it follows while orbiting.
  const w = stage.clientWidth, h = stage.clientHeight;
  tmp.copy(obj.group.position).project(camera);
  const sx = (tmp.x * 0.5 + 0.5) * w, sy = (-tmp.y * 0.5 + 0.5) * h;
  const tw = tooltip.offsetWidth, th = tooltip.offsetHeight;
  const x = Math.max(8, Math.min(w - tw - 8, sx + 16));
  const y = Math.max(8, Math.min(h - th - 8, sy - th - 8));
  tooltip.style.transform = `translate(${x}px, ${y}px)`;
}

/* ------------------------------------------------------------- view presets */
// Camera looks at the origin from `dir`. Screen right/up noted per view; the cube is symmetric so only labels matter.
// Views are defined by spherical angles (theta = azimuth around the Y axis, phi = angle from straight up), so the
// transition is continuous and every view always ends with the same screen orientation, whichever way you came from.
// (Interpolating plain directions leaves the spin around the vertical undefined at the poles, which made the top
// view flip 180 degrees at the very end.)
const HOME_SPH = new THREE.Spherical().setFromVector3(new THREE.Vector3(3.4, 2.5, 4.2));
const TOP_PHI = 0.001; // not exactly 0: keeps the azimuth well-defined while looking straight down
const VIEWS = [
  { id: 'xy', label: 'X–Y', theta: 0, phi: Math.PI / 2 },   // camera on +Z: X right, Y up
  { id: 'xz', label: 'X–Z', theta: 0, phi: TOP_PHI },   // from above: X right, Z down
  { id: 'yz', label: 'Y–Z', theta: -Math.PI / 2, phi: Math.PI / 2 },  // camera on -X: Z right, Y up
];
for (const v of VIEWS) v.dir = new THREE.Vector3().setFromSphericalCoords(1, v.phi, v.theta); // for the "still on this view?" check
let activeView = null;
let tween = null;
const viewButtons = new Map();

function setActiveView(id) {
  activeView = id;
  viewButtons.forEach((btn, vid) => btn.setAttribute('aria-pressed', String(vid === id)));
}

/** Animate the camera to spherical angles (theta, phi) at distance `dist`, taking the shortest way round in azimuth. */
function flyTo(theta, phi, dist) {
  const from = new THREE.Spherical().setFromVector3(camera.position.clone().sub(controls.target));
  if (reduceMotionMQ.matches) {
    tween = null;
    camera.position.setFromSphericalCoords(dist, phi, theta).add(controls.target);
    return;
  }
  const TWO_PI = Math.PI * 2;
  const dTheta = ((((theta - from.theta + Math.PI) % TWO_PI) + TWO_PI) % TWO_PI) - Math.PI; // shortest signed angle
  tween = { from, dTheta, to: { phi, r: dist }, t0: null, dur: 650 };
}

function stepTween(now) {
  if (!tween) return;
  if (tween.t0 === null) tween.t0 = now;
  const k = Math.min(1, (now - tween.t0) / tween.dur);
  const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2; // easeInOutCubic
  const { from, dTheta, to } = tween;
  camera.position
    .setFromSphericalCoords(from.radius + (to.r - from.radius) * e, from.phi + (to.phi - from.phi) * e, from.theta + dTheta * e)
    .add(controls.target);
  if (k >= 1) tween = null;
}

controls.addEventListener('start', () => { tween = null; }); // user grabbed the view: stop animating

const viewBox = $('view-buttons');
const resetBtn = tr(el('button', 'btn btn-wide'), 'view.reset');
resetBtn.type = 'button';
resetBtn.addEventListener('click', () => { setActiveView(null); flyTo(HOME_SPH.theta, HOME_SPH.phi, fitDistance()); });
viewBox.appendChild(resetBtn);
for (const v of VIEWS) {
  const b = el('button', 'btn');
  b.type = 'button';
  b.setAttribute('aria-pressed', 'false');
  b.append(el('b', null, v.label), tr(el('small'), `view.${v.id}`));
  b.addEventListener('click', () => { setActiveView(v.id); flyTo(v.theta, v.phi, fitDistance()); });
  viewButtons.set(v.id, b);
  viewBox.appendChild(b);
}

/* ----------------------------------------------------------- language menu */
// Custom listbox (a native <select> cannot show flags). Shows the country code and flag: "SE [flag]".
(function buildLangMenu() {
  const btn = $('lang-btn');
  const menu = el('ul', 'lang-menu');
  menu.setAttribute('role', 'listbox');
  trAttr(menu, 'aria-label', 'lang.label');
  menu.hidden = true;

  const opts = LANGS.map((l) => {
    const li = el('li', 'lang-opt');
    li.setAttribute('role', 'option');
    li.tabIndex = -1;
    li.dataset.lang = l.lang;
    li.append(flagImg(l.flag), el('span', 'code', l.code), el('span', 'name', l.name));
    li.addEventListener('click', () => choose(l.lang));
    return li;
  });
  menu.append(...opts);
  $('app').appendChild(menu); // outside the HUD: it has overflow/backdrop-filter that would clip a fixed menu

  const current = () => LANGS.find((l) => l.lang === getLang());
  function syncButton() {
    const cur = current();
    btn.replaceChildren(flagImg(cur.flag), el('span', 'code', cur.code), el('span', 'caret', '▾'));
    opts.forEach((o) => o.setAttribute('aria-selected', String(o.dataset.lang === getLang())));
  }
  const isOpen = () => !menu.hidden;

  function open() {
    menu.hidden = false;
    btn.setAttribute('aria-expanded', 'true');
    const r = btn.getBoundingClientRect();
    const mh = menu.offsetHeight, mw = menu.offsetWidth;
    const below = r.bottom + 6 + mh <= window.innerHeight - 8;
    menu.style.top = `${below ? r.bottom + 6 : Math.max(8, r.top - 6 - mh)}px`;
    menu.style.left = `${Math.max(8, Math.min(window.innerWidth - mw - 8, r.right - mw))}px`;
    (opts.find((o) => o.getAttribute('aria-selected') === 'true') ?? opts[0]).focus();
  }
  function close(refocus) {
    if (!isOpen()) return;
    menu.hidden = true;
    btn.setAttribute('aria-expanded', 'false');
    if (refocus) btn.focus();
  }
  function choose(lang) {
    close(true);
    setLang(lang);
  }

  btn.addEventListener('click', () => (isOpen() ? close(true) : open()));
  btn.addEventListener('keydown', (ev) => {
    if (ev.key === 'ArrowDown' || ev.key === 'ArrowUp') { ev.preventDefault(); open(); }
  });
  menu.addEventListener('keydown', (ev) => {
    const i = opts.indexOf(document.activeElement);
    if (ev.key === 'ArrowDown') { ev.preventDefault(); opts[(i + 1) % opts.length].focus(); }
    else if (ev.key === 'ArrowUp') { ev.preventDefault(); opts[(i - 1 + opts.length) % opts.length].focus(); }
    else if (ev.key === 'Home') { ev.preventDefault(); opts[0].focus(); }
    else if (ev.key === 'End') { ev.preventDefault(); opts[opts.length - 1].focus(); }
    else if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); if (i >= 0) choose(opts[i].dataset.lang); }
    else if (ev.key === 'Escape') { ev.preventDefault(); ev.stopPropagation(); close(true); }
    else if (ev.key === 'Tab') close(false);
  });
  document.addEventListener('pointerdown', (ev) => {
    if (isOpen() && !menu.contains(ev.target) && !btn.contains(ev.target)) close(false);
  });
  window.addEventListener('resize', () => close(false));

  syncButton();
  onLangChange(syncButton);
}());

// Everything built from JS (not just tagged with data-i18n) is refreshed when the language changes.
onLangChange(() => {
  ttKey = '';
  syncCountryUI();
  render();
  if (state.explain) renderExplainer();
});

/* --------------------------------------------------------------- main loop */
const _off = new THREE.Vector3();
function frame(now) {
  stepTween(now);
  controls.update();

  // Un-highlight the preset once the user has orbited away from it.
  if (activeView && !tween) {
    const view = VIEWS.find((v) => v.id === activeView);
    _off.copy(camera.position).sub(controls.target).normalize();
    if (_off.angleTo(view.dir) > 0.03) setActiveView(null);
  }

  if (hoverDirty && lastPtr) {
    hoverDirty = false;
    state.hover = pick(lastPtr.x, lastPtr.y);
    stage.classList.toggle('hovering', !!state.hover);
  }

  if (youObj.ring) {
    youObj.ring.quaternion.copy(camera.quaternion); // billboard
    const pulse = reduceMotionMQ.matches ? 1 : 1 + 0.12 * Math.sin(now / 380);
    youObj.ring.scale.setScalar(pulse * youObj.sphere.scale.x);
  }

  // Selection outline follows the pinned bubble (hidden when nothing is pinned or it is hidden).
  const sel = state.pinned ? entityById.get(state.pinned) : null;
  if (sel && sel.group.visible) {
    const baseR = sel.slot === 1 && !sel.isYou ? 0.078 : 0.055; // diamond vs sphere radius
    selRing.visible = true;
    selRing.position.copy(sel.group.position);
    selRing.quaternion.copy(camera.quaternion);
    selRing.scale.setScalar(baseR * sel.sphere.scale.x * 1.45 + 0.012);
  } else {
    selRing.visible = false;
  }

  updateTooltip();
  renderer.render(scene, camera);
  labelRenderer.render(scene, camera);
}

/* ------------------------------------------------------- context loss path */
const notice = $('notice');
el3d.addEventListener('webglcontextlost', (ev) => {
  ev.preventDefault(); // allow restoration
  renderer.setAnimationLoop(null);
  notice.textContent = t('notice.contextLost');
  notice.hidden = false;
});
el3d.addEventListener('webglcontextrestored', () => {
  notice.hidden = true;
  renderer.setAnimationLoop(frame);
});

/* -------------------------------------------------------------------- go */
// Start from whatever the checkboxes show, so the UI and the scene can never disagree (e.g. after a browser restores form state).
state.showYou = $('you-toggle').checked;
state.slice = $('slice-toggle').checked;
state.bySeats = $('seat-toggle').checked;
youObj.group.visible = state.showYou; // before applyCountrySelection, so a hidden "You" is not pickable

layout();
applyCountrySelection(); // creates the default country's parties, syncs the picker, renders
renderer.setAnimationLoop(frame);
