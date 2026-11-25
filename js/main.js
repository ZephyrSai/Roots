import { WorldMap } from './map.js';
import { yearToU, uToYear, fmtYear, fmtRange, ERAS, ease, T_MIN, T_MAX } from './time.js';
import { WORLD } from './data/world.js';
import { CHAPTERS } from './data/chapters.js';
import { FIELDS, COMPONENTS } from './data/ancestry.js';
import { beamsLayer, setBeams, beamsHit } from './layers.js';
import { OVERLAYS } from './overlays/index.js';
import { pick, byKey, byTopic, sized, stripHTML } from './media.js';

const $ = s => document.querySelector(s);
const map = new WorldMap($('#map'));
const state = { ci: 0, si: 0, mode: 'story', playing: false, yearTween: null, overlay: null, started: false };
window.__roots = { map, state };

// ------------------------------------------------------------------ layout
function layoutInsets() {
  const narrow = innerWidth < 760;
  const storyOpen = state.mode === 'story' && !narrow && state.started;
  const ovOpen = !!state.overlay && !narrow;
  map.setInsets({
    left: storyOpen ? parseInt(getComputedStyle(document.documentElement).getPropertyValue('--story-w')) + 24 : 0,
    top: 56,
    bottom: narrow && state.mode === 'story' ? innerHeight * 0.46 + 70 : 78,
    right: ovOpen && state.overlayDock ? 396 : 0,
  });
}
addEventListener('resize', () => { map.resize(); layoutInsets(); buildTimelineTicks(); });

// ------------------------------------------------------------------ chapter nav
function buildNav() {
  const nav = $('#chapNav'); nav.innerHTML = '';
  CHAPTERS.forEach((ch, i) => {
    const b = document.createElement('button');
    b.innerHTML = `<span class="n">${String(i + 1).padStart(2, '0')}</span><span class="t">${ch.short || ch.title}</span>`;
    b.title = ch.title;
    b.onclick = () => { setMode('story'); goStep(i, 0); };
    nav.appendChild(b);
  });
}
function updateNav() {
  [...$('#chapNav').children].forEach((b, i) => { b.classList.toggle('on', i === state.ci); b.classList.toggle('done', i < state.ci); });
  const on = $('#chapNav').children[state.ci]; on && on.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
}

// ------------------------------------------------------------------ steps
function legendHTML(kind) {
  const L = {
    ancestry: ['Ancestral components', COMPONENTS.map(c => [c.color, c.name])],
    ancestry3: ['Ancestral components', COMPONENTS.filter(c => c.key !== 'east').map(c => [c.color, c.name])],
    lang: ['Language families', [['#7d97ff', 'Indo-European'], ['#ff9e5e', 'Dravidian'], ['#8bd36a', 'Austroasiatic (Munda)'], ['#d98be8', 'Tibeto-Burman'], ['#c8b98a', 'Afro-Asiatic / Semitic'], ['#9fb7c9', 'Isolates & others']]],
    ie: ['Indo-European branches', [['#7d97ff', 'Indo-Iranian'], ['#5fd0ff', 'Greek / Anatolian'], ['#c58bff', 'Italic & Celtic'], ['#7ee0b0', 'Germanic'], ['#ffd36e', 'Balto-Slavic'], ['#ff8f8f', 'Tocharian']]],
    flows: ['Movements', [['#e0884a', 'First South Asians (AASI)'], ['#3fc1a5', 'Iranian-related'], ['#7d97ff', 'Steppe / Indo-European'], ['#e8609a', 'East / Southeast Asian']]],
    belief: ['Traditions', [['#ffcf6e', 'Vedic / Hindu'], ['#ff9e5e', 'Tamil / Dravidian'], ['#62d2c4', 'Iranian / Zoroastrian'], ['#c9a3ff', 'Buddhist / Jain'], ['#9fb7ff', 'Greek / Roman'], ['#7ee0b0', 'Germanic / Norse']]],
  }[kind];
  if (!L) return '';
  return `<h4>${L[0]}</h4>` + L[1].map(([c, n]) => `<div class="row"><i style="background:${c};color:${c}"></i>${n}</div>`).join('');
}

function goStep(ci, si, opts = {}) {
  ci = Math.max(0, Math.min(CHAPTERS.length - 1, ci));
  const ch = CHAPTERS[ci];
  si = Math.max(0, Math.min(ch.steps.length - 1, si));
  const changedCh = ci !== state.ci || !state.shown;
  state.ci = ci; state.si = si; state.shown = true;
  const st = ch.steps[si];
  $('#chNum').textContent = `Chapter ${ci + 1} / ${CHAPTERS.length}`;
  $('#chEra').textContent = st.era || ch.era || '';
  if (changedCh) { $('#chTitle').textContent = ch.title; }
  const body = $('#stepBody');
  const ims = st.imgs ? pick(st.imgs, 8) : pick((st.focus || []).filter(id => /^[sc]-/.test(id)), 6);
  body.innerHTML = (st.h ? `<h3>${st.h}</h3>` : '') + (st.chips ? `<div class="chips">${st.chips.map(c => `<span class="chip ${c[0]}">${c[1]}</span>`).join('')}</div>` : '') + stripHTML(ims) + st.html;
  body.classList.remove('enter'); void body.offsetWidth; body.classList.add('enter');
  $('.story-inner').scrollTop = 0;
  // actions
  const acts = $('#stepActions'); acts.innerHTML = '';
  for (const a of st.actions || []) {
    if (a.overlay === 'gallery' && a.arg && !byTopic(a.arg).length) continue;
    const ov = OVERLAYS[a.overlay];
    const b = document.createElement('button'); b.className = 'act';
    b.innerHTML = `<span class="ico">${a.icon || (ov && ov.icon) || '✦'}</span>${a.label || (ov && ov.title)}`;
    b.onclick = () => openOverlay(a.overlay, a.arg);
    acts.appendChild(b);
  }
  // dots
  const dots = $('#stepDots'); dots.innerHTML = '';
  ch.steps.forEach((_, i) => { const d = document.createElement('button'); if (i === si) d.className = 'on'; d.onclick = () => goStep(ci, i); dots.appendChild(d); });
  $('#prevBtn').disabled = ci === 0 && si === 0;
  const last = ci === CHAPTERS.length - 1 && si === ch.steps.length - 1;
  $('#nextBtn').textContent = si === ch.steps.length - 1 ? (last ? 'The end' : 'Next chapter →') : 'Next →';
  $('#nextBtn').disabled = last;
  updateNav();
  // map
  if (st.cam) map.flyTo(st.cam, opts.instant ? 0 : (st.flyMs || 2400));
  map._userMoved = false;
  map.setFocus(st.focus || (st.field || st.beams || st.year >= 1900 ? [] : null));
  map.setField(st.field ? { ...FIELDS[st.field], components: COMPONENTS } : null);
  setBeams(st.beams || null);
  const y = st.year ?? map.year;
  const y0 = st.yearFrom ?? (Math.abs(yearToU(y) - map.u) > 0.004 ? map.year : y);
  tweenYear(y0, y, st.yearMs || 2600);
  const lg = $('#legend'); const h = legendHTML(st.legend); lg.innerHTML = h; lg.classList.toggle('empty', !h);
  if (st.overlay) openOverlay(st.overlay, st.overlayArg); else if (state.overlay && !opts.keepOverlay) closeOverlay();
  hideInfo();
  try { history.replaceState(null, '', `#c${ci + 1}.${si + 1}`); } catch (e) {}
}
function next() {
  const ch = CHAPTERS[state.ci];
  if (state.si < ch.steps.length - 1) goStep(state.ci, state.si + 1);
  else if (state.ci < CHAPTERS.length - 1) goStep(state.ci + 1, 0);
}
function prev() {
  if (state.si > 0) goStep(state.ci, state.si - 1);
  else if (state.ci > 0) goStep(state.ci - 1, CHAPTERS[state.ci - 1].steps.length - 1);
}
$('#nextBtn').onclick = next; $('#prevBtn').onclick = prev;

// ------------------------------------------------------------------ time
function tweenYear(from, to, ms) {
  setPlaying(false);
  if (Math.abs(yearToU(from) - yearToU(to)) < 1e-4) { state.yearTween = null; setYear(to); return; }
  state.yearTween = { u0: yearToU(from), u1: yearToU(to), t0: performance.now(), ms };
  setYear(from);
}
function setYear(y) {
  map.setYear(y);
  const u = yearToU(y);
  $('#playhead').style.left = (u * 100) + '%';
  $('#phLabel').textContent = fmtYear(y, true);
  $('#yearBig').textContent = fmtYear(y);
  if (state.overlay && state.overlayApi && state.overlayApi.onYear) state.overlayApi.onYear(y);
}
function buildTimeline() {
  const bands = $('#eraBands'); bands.innerHTML = '';
  for (const e of ERAS) {
    const d = document.createElement('div');
    const w = (yearToU(e.to) - yearToU(e.from)) * 100;
    d.style.width = w + '%'; d.style.background = `linear-gradient(180deg, ${e.tint}, ${e.tint}88)`;
    d.textContent = e.name; d.title = `${e.name}: ${fmtRange(e.from, e.to)}`;
    bands.appendChild(d);
  }
  buildTimelineTicks();
  const track = $('#track');
  let drag = false;
  const setFromEvent = e => {
    const r = track.getBoundingClientRect();
    const u = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
    state.yearTween = null; setPlaying(false);
    setYear(uToYear(u));
  };
  track.addEventListener('pointerdown', e => { drag = true; track.setPointerCapture(e.pointerId); setFromEvent(e); });
  track.addEventListener('pointermove', e => { if (drag) setFromEvent(e); });
  track.addEventListener('pointerup', () => { drag = false; });
}
function buildTimelineTicks() {
  const ticks = $('#ticks'); ticks.innerHTML = '';
  const marks = [[-65000, '65k'], [-10000, '10k ya'], [-7000, '7000 BCE'], [-3300, '3300'], [-2600, ''], [-1900, '1900'], [-1500, '1500'], [-1000, '1000 BCE'], [-500, '500'], [0, '1 CE'], [500, '500'], [1000, '1000'], [1500, '1500'], [2000, '2000']];
  const wide = innerWidth > 1100;
  for (const [y, l] of marks) {
    const u = yearToU(y);
    const t = document.createElement('div'); t.className = 'tk' + (l ? ' big' : ''); t.style.left = (u * 100) + '%'; ticks.appendChild(t);
    if (l && (wide || y % 1000 === 0)) { const s = document.createElement('div'); s.className = 'tl'; s.style.left = (u * 100) + '%'; s.textContent = l; ticks.appendChild(s); }
  }
}
function setPlaying(p) {
  state.playing = p;
  $('#playBtn').classList.toggle('on', p);
  $('#playBtn').textContent = p ? '❚❚' : '▶';
}
$('#playBtn').onclick = () => { if (!state.playing && map.u >= 0.999) setYear(T_MIN); state.yearTween = null; setPlaying(!state.playing); };

// ------------------------------------------------------------------ hover / info
const tip = $('#tip');
map.onHover = (hit, x, y) => {
  if (!hit) { tip.classList.remove('on'); return; }
  const dates = hit.from != null ? fmtRange(hit.from, hit.to) : '';
  const im = hit.img || byKey(hit.id)[0];
  tip.innerHTML = `${im ? `<img class="tthumb" src="${sized(im, 320)}" alt="">` : ''}<b>${hit.name || hit.label || hit.text}</b>${dates ? `<div class="d">${dates}</div>` : ''}${hit.tip || hit.short || ''}`;
  tip.style.left = Math.min(innerWidth - 300, x + 16) + 'px'; tip.style.top = (y + 14) + 'px';
  tip.classList.add('on');
};
map.onClick = hit => { if (hit && (hit.desc || hit.tip)) showInfo(hit); else hideInfo(); };
function showInfo(h) {
  const el = $('#info');
  el.innerHTML = `<button class="icon-btn x" title="Close">✕</button><div class="d">${h.from != null ? fmtRange(h.from, h.to) : ''}</div><h3>${h.name || h.label}</h3>${stripHTML(h.img ? [h.img] : byKey(h.id), { cap: false })}${h.conf ? `<div class="chips"><span class="chip ${h.conf}">${h.conf}</span></div>` : ''}<div>${h.desc || h.tip || ''}</div>${h.src ? `<div class="ov-note">Source: ${h.src}</div>` : ''}`;
  el.querySelector('.x').onclick = hideInfo;
  el.classList.remove('hidden');
}
function hideInfo() { $('#info').classList.add('hidden'); }

// ------------------------------------------------------------------ overlays
const api = {
  map, setYear: (y, ms = 1800) => tweenYear(map.year, y, ms), flyTo: (c, ms) => map.flyTo(c, ms),
  setBeams, setFocus: ids => map.setFocus(ids), get year() { return map.year; }, fmtYear,
};
function openOverlay(id, arg) {
  const ov = OVERLAYS[id]; if (!ov) return;
  if (state.overlay === id && state.overlayApi && state.overlayApi.setArg) { state.overlayApi.setArg(arg); return; }
  closeOverlay(true);
  state.overlay = id;
  $('#ovKicker').textContent = ov.kicker || 'Interactive';
  $('#ovTitle').textContent = ov.title;
  const body = $('#ovBody'); body.innerHTML = '';
  state.overlayDock = !!ov.dock;
  $('#overlay').classList.toggle('dock', !!ov.dock);
  $('#overlay').classList.remove('hidden');
  $('#tools').classList.add('hidden');
  state.overlayApi = ov.mount(body, api, arg) || {};
  layoutInsets();
}
function closeOverlay(silent) {
  if (!state.overlay) return;
  try { state.overlayApi && state.overlayApi.unmount && state.overlayApi.unmount(); } catch (e) { console.error(e); }
  state.overlay = null; state.overlayApi = null; state.overlayDock = false;
  $('#overlay').classList.add('hidden');
  if (!silent) layoutInsets();
}
$('#ovClose').onclick = () => closeOverlay();
function buildTools() {
  const list = $('#toolList'); list.innerHTML = '';
  for (const [id, ov] of Object.entries(OVERLAYS)) {
    const b = document.createElement('button');
    b.innerHTML = `<span class="ico">${ov.icon}</span><span><b>${ov.title}</b><span class="s">${ov.desc}</span></span>`;
    b.onclick = () => openOverlay(id);
    list.appendChild(b);
  }
}
$('#toolsBtn').onclick = () => $('#tools').classList.toggle('hidden');

// ------------------------------------------------------------------ modes & toggles
function setMode(m) {
  state.mode = m;
  document.body.classList.toggle('explore', m === 'explore');
  [...$('#modeSeg').children].forEach(b => b.classList.toggle('on', b.dataset.mode === m));
  if (m === 'explore') { map.setFocus(null); setBeams(null); map.setField(null); $('#legend').innerHTML = legendHTML('flows'); $('#legend').classList.remove('empty'); }
  else if (state.shown) goStep(state.ci, state.si);
  layoutInsets();
}
$('#modeSeg').onclick = e => { const b = e.target.closest('button'); if (b) { startJourney(false); setMode(b.dataset.mode); } };
$('#labelsBtn').onclick = () => { map.opts.labels = !map.opts.labels; $('#labelsBtn').classList.toggle('off', !map.opts.labels); };
$('#bordersBtn').onclick = () => { map.opts.borders = !map.opts.borders; map.baseDirty = true; $('#bordersBtn').classList.toggle('off', !map.opts.borders); };
$('#bordersBtn').classList.add('off');
$('#homeBtn').onclick = () => { setMode('story'); goStep(0, 0); };

addEventListener('keydown', e => {
  if (e.target.matches('input, textarea, select')) return;
  if (e.key === 'Escape') { if (state.overlay) closeOverlay(); else { hideInfo(); $('#tools').classList.add('hidden'); } return; }
  if (!state.started) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); startJourney(true); } return; }
  if (state.overlay && state.overlayApi && state.overlayApi.capturesKeys) return;
  if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') { e.preventDefault(); if (state.mode === 'story') next(); }
  else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); if (state.mode === 'story') prev(); }
  else if (e.key === 'p' || e.key === 'P') $('#playBtn').click();
  else if (e.key === 'l' || e.key === 'L') $('#labelsBtn').click();
  else if (e.key === 'b' || e.key === 'B') $('#bordersBtn').click();
  else if (e.key === 't' || e.key === 'T') $('#toolsBtn').click();
  else if (e.key === 'e' || e.key === 'E') setMode(state.mode === 'story' ? 'explore' : 'story');
});

// ------------------------------------------------------------------ intro
function startJourney(story = true) {
  if (state.started) return;
  state.started = true;
  $('#intro').classList.add('gone');
  $('#story').classList.remove('collapsed');
  map.opts.labels = true;
  state.idleSpin = false;
  layoutInsets();
  if (story) { setMode('story'); goStep(state.ci, state.si); }
  else setMode('explore');
}
$('#beginBtn').onclick = () => startJourney(true);
$('#exploreBtn').onclick = () => { startJourney(false); map.flyTo({ lon: 55, lat: 32, zoom: 1.7 }, 2400); tweenYear(T_MIN, -1500, 6000); };

// ------------------------------------------------------------------ loop
let last = performance.now();
function step(dt) {
  if (state.yearTween) {
    const tw = state.yearTween;
    const k = Math.min(1, (performance.now() - tw.t0) / tw.ms);
    setYear(uToYear(tw.u0 + (tw.u1 - tw.u0) * ease(k)));
    if (k >= 1) state.yearTween = null;
  } else if (state.playing) {
    const u = Math.min(1, map.u + dt * 0.018);
    setYear(uToYear(u));
    if (u >= 1) setPlaying(false);
  }
  if (state.idleSpin && !map.flight) { map.cam.lon += dt * 4; map._applyCam(); map.baseDirty = true; }
  map.frame(dt);
  if (state.overlayApi && state.overlayApi.frame) state.overlayApi.frame(dt);
}
function loop(now) {
  const dt = Math.min(0.12, Math.max(0, (now - last) / 1000)); last = now;
  try { step(dt); } catch (e) { console.error(e); }
  requestAnimationFrame(loop);
}
// manual ticking for hidden panes / tests
window.__roots.tick = (n = 1, dt = 1 / 60) => { for (let i = 0; i < n; i++) { if (state.yearTween) state.yearTween.t0 -= dt * 1000; step(dt); } last = performance.now(); };
window.__roots.go = (c, s) => goStep(c, s, { instant: true });
window.__roots.open = openOverlay;

// ------------------------------------------------------------------ boot
(async function boot() {
  try {
    await map.load();
  } catch (e) {
    $('#loading span').textContent = 'Could not load map data (needs internet for the base map).'; console.error(e); return;
  }
  map.setData(WORLD);
  map.layers.push(beamsLayer);
  map.hitLayers = [beamsHit(map)];
  buildNav(); buildTimeline(); buildTools();
  map.cam = { lon: 62, lat: 22, zoom: 1.02 }; map._applyCam();
  layoutInsets();
  setYear(-1500);
  state.idleSpin = true;
  map.opts.labels = false;
  // deep link #c3.2
  const m = location.hash.match(/^#c(\d+)\.(\d+)/);
  if (m) { state.ci = +m[1] - 1; state.si = +m[2] - 1; }
  $('#loading').classList.add('gone');
  requestAnimationFrame(loop);
  if (m) startJourney(true);
})();
