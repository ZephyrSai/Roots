// Canvas globe/map engine: camera flights, time-aware layers, animated migration flows,
// a smooth ancestry "gradient field", hit-testing and custom draw layers.
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import { yearToU, smooth, ease } from './time.js';

const TAU = Math.PI * 2;
const DEG = Math.PI / 180;

function hash(n) { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); }
function noise1(seed, a) { // smooth periodic noise on a circle
  let v = 0;
  for (let k = 1; k <= 3; k++) v += Math.sin(a * (k + 1) + hash(seed * 7 + k) * TAU) * (0.55 / k);
  return v;
}
function hexToRgb(h) { const n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
function rgba(h, a) { const [r, g, b] = hexToRgb(h); return `rgba(${r},${g},${b},${a})`; }
const lin = c => { c /= 255; return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
const unlin = c => 255 * (c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055);

// Catmull-Rom resample of a lon/lat polyline into ~n points (in lon/lat space; fine for regional paths).
function resample(path, n = 72) {
  if (path.length < 2) return path.slice();
  const P = path;
  const pts = [];
  const seg = P.length - 1;
  for (let i = 0; i < seg; i++) {
    const p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(P.length - 1, i + 2)];
    const steps = Math.max(2, Math.round(n / seg));
    for (let s = 0; s < steps; s++) {
      const t = s / steps, t2 = t * t, t3 = t2 * t;
      const f = (a, b, c, d) => 0.5 * ((2 * b) + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
      pts.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])]);
    }
  }
  pts.push(P[P.length - 1]);
  // cumulative length (approx, degrees with lat scaling)
  const L = [0];
  for (let i = 1; i < pts.length; i++) {
    const dx = (pts[i][0] - pts[i - 1][0]) * Math.cos(pts[i][1] * DEG), dy = pts[i][1] - pts[i - 1][1];
    L.push(L[i - 1] + Math.hypot(dx, dy));
  }
  const tot = L[L.length - 1] || 1;
  return { pts, L: L.map(v => v / tot), len: tot };
}
function along(rs, s) { // point at fraction s along a resampled path
  const { pts, L } = rs;
  if (s <= 0) return pts[0];
  if (s >= 1) return pts[pts.length - 1];
  let lo = 0, hi = L.length - 1;
  while (hi - lo > 1) { const m = (lo + hi) >> 1; if (L[m] < s) lo = m; else hi = m; }
  const f = (s - L[lo]) / ((L[hi] - L[lo]) || 1);
  return [pts[lo][0] + (pts[hi][0] - pts[lo][0]) * f, pts[lo][1] + (pts[hi][1] - pts[lo][1]) * f];
}

export class WorldMap {
  constructor(canvas) {
    this.cv = canvas;
    this.ctx = canvas.getContext('2d');
    this.base = document.createElement('canvas');
    this.bctx = this.base.getContext('2d');
    this.fieldCv = document.createElement('canvas');
    this.fctx = this.fieldCv.getContext('2d', { willReadFrequently: true });
    this.dpr = Math.min(2, window.devicePixelRatio || 1);
    this.cam = { lon: 60, lat: 25, zoom: 1 };
    this.flight = null;
    this.insets = { left: 0, right: 0, top: 0, bottom: 0 };
    this.year = -72000;
    this.u = 0;
    this.focus = null;
    this.data = { sites: [], cultures: [], flows: [], rivers: [], mountains: [], labels: [] };
    this.layers = [];          // custom draw layers: fn(ctx, map, t)
    this.field = null;         // ancestry gradient field
    this.fieldDirty = true;
    this.fieldAlpha = 0;
    this.baseDirty = true;
    this.hover = null;
    this.t = 0;
    this.opts = { borders: false, labels: true, graticule: true };
    this.onHover = () => {}; this.onClick = () => {};
    this.proj = d3.geoOrthographic().clipAngle(90).precision(0.4);
    this.path = d3.geoPath(this.proj);
    this._labelBoxes = [];
    this._bindPointer();
  }

  async load() {
    const base = 'https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/';
    const [l110, l50, c50] = await Promise.all([
      fetch(base + 'land-110m.json').then(r => r.json()),
      fetch(base + 'land-50m.json').then(r => r.json()),
      fetch(base + 'countries-50m.json').then(r => r.json()),
    ]);
    this.land110 = topojson.feature(l110, l110.objects.land);
    this.land50 = topojson.feature(l50, l50.objects.land);
    this.borders = topojson.mesh(c50, c50.objects.countries, (a, b) => a !== b);
    this.graticule = d3.geoGraticule10();
    // speckle texture for land
    const tex = document.createElement('canvas'); tex.width = tex.height = 128;
    const tc = tex.getContext('2d');
    for (let i = 0; i < 900; i++) {
      const a = Math.random() * 0.16;
      tc.fillStyle = Math.random() < 0.5 ? `rgba(255,236,200,${a})` : `rgba(0,0,0,${a})`;
      tc.fillRect(Math.random() * 128, Math.random() * 128, 1 + Math.random() * 1.5, 1 + Math.random() * 1.5);
    }
    this.landPattern = this.bctx.createPattern(tex, 'repeat');
    this.resize();
  }

  setData(d) {
    this.data = Object.assign({ sites: [], cultures: [], flows: [], rivers: [], mountains: [], labels: [] }, d);
    for (const f of this.data.flows) f._rs = resample(f.path, f.samples || 80);
    for (const r of this.data.rivers) r._rs = resample(r.path, 60);
    for (const m of this.data.mountains) m._rs = resample(m.path, 40);
    for (const c of this.data.cultures) c.seed = c.seed ?? (hash(c.id.length * 13 + c.lon) * 100);
    this.byId = new Map();
    for (const k of ['sites', 'cultures', 'flows', 'rivers', 'labels']) for (const x of this.data[k]) if (x.id) this.byId.set(x.id, Object.assign(x, { _kind: k }));
    this.baseDirty = true;
  }

  resize() {
    const w = this.cv.clientWidth, h = this.cv.clientHeight;
    this.w = w; this.h = h;
    for (const c of [this.cv, this.base]) { c.width = Math.round(w * this.dpr); c.height = Math.round(h * this.dpr); }
    this.fieldCv.width = Math.ceil(w / 5); this.fieldCv.height = Math.ceil(h / 5);
    this.baseDirty = true; this.fieldDirty = true;
    this._applyCam();
  }
  setInsets(ins) { Object.assign(this.insets, ins); this.baseDirty = true; this.fieldDirty = true; this._applyCam(); }
  radius(zoom = this.cam.zoom) {
    const vw = this.w - this.insets.left - this.insets.right, vh = this.h - this.insets.top - this.insets.bottom;
    return zoom * Math.min(vw, vh) * 0.46;
  }
  _applyCam() {
    const { lon, lat, zoom } = this.cam;
    const cx = this.insets.left + (this.w - this.insets.left - this.insets.right) / 2;
    const cy = this.insets.top + (this.h - this.insets.top - this.insets.bottom) / 2;
    this.proj.rotate([-lon, -lat, 0]).scale(this.radius(zoom)).translate([cx, cy]);
    this.center = [cx, cy];
  }

  flyTo(cam, ms = 2200) {
    const from = { ...this.cam };
    const to = { lon: cam.lon ?? from.lon, lat: cam.lat ?? from.lat, zoom: cam.zoom ?? from.zoom };
    const interp = d3.geoInterpolate([from.lon, from.lat], [to.lon, to.lat]);
    const dist = d3.geoDistance([from.lon, from.lat], [to.lon, to.lat]); // radians
    const z0 = Math.log(from.zoom), z1 = Math.log(to.zoom);
    // zoom out a little when travelling far at high zoom ("up and over")
    const hop = Math.min(1.4, dist * 1.6) * Math.min(1, Math.max(from.zoom, to.zoom) / 3);
    if (ms <= 0 || (dist < 1e-4 && Math.abs(z1 - z0) < 1e-3)) { this.cam = to; this.flight = null; this._applyCam(); this.baseDirty = this.fieldDirty = true; return; }
    this.flight = { t0: this.t, ms: ms / 1000, step: (k) => {
      const e = ease(k);
      const [lon, lat] = interp(e);
      const z = Math.exp(z0 + (z1 - z0) * e - hop * Math.sin(Math.PI * e));
      this.cam = { lon, lat, zoom: z };
    } };
  }

  // --- interaction: drag to rotate, wheel to zoom
  _bindPointer() {
    const cv = this.cv;
    let drag = null;
    cv.addEventListener('pointerdown', e => {
      drag = { x: e.clientX, y: e.clientY, cam: { ...this.cam }, moved: false };
      cv.setPointerCapture(e.pointerId);
    });
    cv.addEventListener('pointermove', e => {
      const r = cv.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      if (drag) {
        const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
        if (Math.abs(dx) + Math.abs(dy) > 3) drag.moved = true;
        if (drag.moved) {
          const k = 180 / Math.PI / this.radius();
          this.flight = null;
          this.cam.lon = drag.cam.lon - dx * k;
          this.cam.lat = Math.max(-80, Math.min(80, drag.cam.lat + dy * k));
          this._applyCam(); this.baseDirty = this.fieldDirty = true;
          this._userMoved = true;
        }
        return;
      }
      const hit = this.hitTest(x, y);
      if ((hit && hit.id) !== (this.hover && this.hover.id)) { this.hover = hit; cv.style.cursor = hit ? 'pointer' : 'grab'; }
      this.onHover(hit, x, y);
    });
    cv.addEventListener('pointerup', e => {
      if (drag && !drag.moved) {
        const r = cv.getBoundingClientRect();
        const hit = this.hitTest(e.clientX - r.left, e.clientY - r.top);
        this.onClick(hit, e.clientX - r.left, e.clientY - r.top);
      }
      drag = null;
    });
    cv.addEventListener('pointerleave', () => { this.hover = null; this.onHover(null); });
    cv.addEventListener('wheel', e => {
      e.preventDefault();
      this.flight = null;
      this.cam.zoom = Math.max(0.8, Math.min(28, this.cam.zoom * Math.exp(-e.deltaY * 0.0015)));
      this._applyCam(); this.baseDirty = this.fieldDirty = true; this._userMoved = true;
    }, { passive: false });
  }

  project(lon, lat) {
    const p = this.proj([lon, lat]);
    if (!p) return null;
    const r = this.proj.rotate();
    if (d3.geoDistance([lon, lat], [-r[0], -r[1]]) > Math.PI / 2 - 0.02) return null;
    return p;
  }

  // visibility of a time-bounded item at the current year, in [0,1]
  vis(item) {
    const u = this.u;
    const a = item.from == null ? -1 : yearToU(item.from);
    const b = item.to == null ? 2 : yearToU(item.to);
    const persist = item.persist ?? 0.0;
    const fin = smooth(a - 0.012, a, u);
    const fout = 1 - smooth(b + persist, b + persist + 0.018, u);
    return fin * fout;
  }
  focusK(item) {
    if (!this.focus) return 1;
    if (this.focus.has(item.id)) return 1;
    if (item._kind === 'flows') return 0.07;
    return item.keep ? 0.5 : 0.2;
  }

  setYear(y) { this.year = y; this.u = yearToU(y); }
  setFocus(ids) { this.focus = Array.isArray(ids) ? new Set(ids) : null; }
  setField(f) { this.field = f; this.fieldDirty = true; }

  // ---------- rendering
  _drawBase() {
    const c = this.bctx, d = this.dpr;
    c.setTransform(d, 0, 0, d, 0, 0);
    c.clearRect(0, 0, this.w, this.h);
    const p = d3.geoPath(this.proj, c);
    const [cx, cy] = this.center, R = this.proj.scale();
    if (!(R > 1) || !(this.w > 0)) return;
    // atmosphere glow
    const g = c.createRadialGradient(cx, cy, R * 0.98, cx, cy, R * 1.12);
    g.addColorStop(0, 'rgba(120,170,255,0.18)'); g.addColorStop(1, 'rgba(120,170,255,0)');
    c.fillStyle = g; c.beginPath(); c.arc(cx, cy, R * 1.12, 0, TAU); c.fill();
    // ocean
    const og = c.createRadialGradient(cx - R * 0.3, cy - R * 0.35, R * 0.1, cx, cy, R);
    og.addColorStop(0, '#16324a'); og.addColorStop(0.7, '#0c1b2b'); og.addColorStop(1, '#081220');
    c.fillStyle = og; c.beginPath(); p({ type: 'Sphere' }); c.fill();
    if (this.opts.graticule) {
      c.beginPath(); p(this.graticule); c.strokeStyle = 'rgba(160,200,255,0.06)'; c.lineWidth = 0.6; c.stroke();
    }
    const moving = !!this.flight || this._userMoved;
    const land = (moving || this.cam.zoom < 1.6) ? this.land110 : this.land50;
    // coastal glow
    c.beginPath(); p(land);
    c.strokeStyle = 'rgba(232,200,140,0.10)'; c.lineWidth = 5; c.lineJoin = 'round'; c.stroke();
    const lg = c.createRadialGradient(cx - R * 0.3, cy - R * 0.4, R * 0.1, cx, cy, R);
    lg.addColorStop(0, '#3d4233'); lg.addColorStop(1, '#262a22');
    c.fillStyle = lg; c.fill();
    c.fillStyle = this.landPattern; c.fill();
    c.strokeStyle = 'rgba(214,196,150,0.42)'; c.lineWidth = 0.7; c.stroke();
    if (this.opts.borders) {
      c.beginPath(); p(this.borders); c.strokeStyle = 'rgba(255,255,255,0.12)'; c.setLineDash([2, 3]); c.lineWidth = 0.6; c.stroke(); c.setLineDash([]);
    }
    // mountains as ridge chevrons
    c.lineWidth = 1; c.strokeStyle = 'rgba(230,215,180,0.30)';
    const sz = Math.max(3, Math.min(9, R / 160));
    for (const m of this.data.mountains) {
      const n = Math.max(6, Math.round(m._rs.len * R / 260));
      for (let i = 0; i <= n; i++) {
        const q = along(m._rs, i / n);
        const pp = this.project(q[0], q[1]); if (!pp) continue;
        const j = hash(i + m.path.length * 3) * 0.6 + 0.7;
        const off = (hash(i * 3.1 + 2) - 0.5) * sz * 1.6;
        c.beginPath();
        c.moveTo(pp[0] - sz * j, pp[1] + sz * 0.5 + off);
        c.lineTo(pp[0], pp[1] - sz * 0.6 * j + off);
        c.lineTo(pp[0] + sz * j, pp[1] + sz * 0.5 + off);
        c.stroke();
      }
    }
    this._baseLand = land;
  }

  _computeField() {
    const f = this.field; if (!f) return;
    const cv = this.fieldCv, c = this.fctx;
    const W = cv.width, H = cv.height, sx = this.w / W, sy = this.h / H;
    const img = c.createImageData(W, H);
    const comps = f.components; // [{key,color}]
    const cl = comps.map(k => hexToRgb(k.color).map(lin));
    const pts = f.points.map(p => ({ lon: p.lon, lat: p.lat, w: comps.map(k => (p.mix[k.key] || 0)) }));
    const maxD = f.maxDist || 7;
    for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) {
      const ll = this.proj.invert([i * sx + sx / 2, j * sy + sy / 2]);
      if (!ll || isNaN(ll[0])) continue;
      const r = this.proj.rotate();
      if (d3.geoDistance(ll, [-r[0], -r[1]]) > Math.PI / 2) continue;
      let sw = 0, dmin = 1e9; const acc = comps.map(() => 0);
      const cosl = Math.cos(ll[1] * DEG);
      for (const p of pts) {
        const dx = (ll[0] - p.lon) * cosl, dy = ll[1] - p.lat;
        const d2 = dx * dx + dy * dy;
        if (d2 < dmin) dmin = d2;
        const w = 1 / Math.pow(d2 + 0.6, 1.6);
        sw += w; for (let k = 0; k < acc.length; k++) acc[k] += w * p.w[k];
      }
      const a = smooth(maxD, maxD * 0.35, Math.sqrt(dmin));
      if (a <= 0) continue;
      let tot = 0; for (const v of acc) tot += v; tot = tot || 1;
      let R = 0, G = 0, B = 0;
      for (let k = 0; k < acc.length; k++) { const q = acc[k] / tot; R += q * cl[k][0]; G += q * cl[k][1]; B += q * cl[k][2]; }
      // boost saturation so blends stay readable
      const Lm = (R + G + B) / 3, sat = 1.7;
      R = Math.max(0, Lm + (R - Lm) * sat); G = Math.max(0, Lm + (G - Lm) * sat); B = Math.max(0, Lm + (B - Lm) * sat);
      const o = (j * W + i) * 4;
      img.data[o] = unlin(R); img.data[o + 1] = unlin(G); img.data[o + 2] = unlin(B); img.data[o + 3] = 255 * a;
    }
    c.putImageData(img, 0, 0);
    // mask to land
    c.save(); c.globalCompositeOperation = 'destination-in';
    c.setTransform(1 / sx, 0, 0, 1 / sy, 0, 0);
    c.beginPath(); d3.geoPath(this.proj, c)(this.land50); c.fillStyle = '#000'; c.fill();
    c.restore();
    this.fieldDirty = false;
  }

  frame(dt) {
    this.t += dt;
    if (this.flight) {
      const k = Math.min(1, (this.t - this.flight.t0) / this.flight.ms);
      this.flight.step(k); this._applyCam(); this.baseDirty = true; this.fieldDirty = true;
      if (k >= 1) { this.flight = null; this.baseDirty = true; }
    }
    if (this._userMoved && !this._moveTimer) {
      this._moveTimer = setTimeout(() => { this._userMoved = false; this._moveTimer = null; this.baseDirty = true; }, 180);
    }
    if (this.baseDirty) { this._drawBase(); this.baseDirty = false; }
    const settled = !this.flight && !this._userMoved;
    if (this.field && this.fieldDirty && settled) this._computeField();
    const wantField = this.field && settled && !this.fieldDirty ? 1 : 0;
    this.fieldAlpha += (wantField - this.fieldAlpha) * Math.min(1, dt * 4);
    this.render();
  }

  render() {
    const c = this.ctx, d = this.dpr, t = this.t;
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.clearRect(0, 0, this.cv.width, this.cv.height);
    c.drawImage(this.base, 0, 0);
    c.setTransform(d, 0, 0, d, 0, 0);
    const R = this.proj.scale();
    if (this.fieldAlpha > 0.01 && this.field) {
      c.save(); c.globalAlpha = this.fieldAlpha * (this.field.alpha ?? 0.85);
      c.imageSmoothingEnabled = true; c.imageSmoothingQuality = 'high';
      c.drawImage(this.fieldCv, 0, 0, this.w, this.h); c.restore();
    }
    this._labelBoxes = [];
    if (this.fieldAlpha > 0.05 && this.field && this.field.pies) this._drawPies(c, R);
    this._drawRivers(c, t, R);
    this._drawCultures(c, t, R);
    this._drawFlows(c, t, R);
    for (const L of this.layers) L(c, this, t);
    this._drawSites(c, t, R);
    if (this.opts.labels) this._drawLabels(c, R);
  }

  _drawPies(c, R) {
    const comps = this.field.components, a = this.fieldAlpha;
    const r = Math.max(6, Math.min(12, R / 120));
    for (const p of this.field.points) {
      if (!p.name) continue;
      const q = this.project(p.lon, p.lat); if (!q) continue;
      let a0 = -Math.PI / 2;
      for (const k of comps) {
        const v = p.mix[k.key] || 0; if (v <= 0) continue;
        c.beginPath(); c.moveTo(q[0], q[1]); c.arc(q[0], q[1], r, a0, a0 + v * TAU); c.closePath();
        c.fillStyle = rgba(k.color, 0.95 * a); c.fill(); a0 += v * TAU;
      }
      c.beginPath(); c.arc(q[0], q[1], r, 0, TAU); c.strokeStyle = `rgba(8,12,20,${0.9 * a})`; c.lineWidth = 1.5; c.stroke();
      this._tryLabel(c, p.name, q[0] + r + 4, q[1] + 4, '600 11px Inter', '#fff3da', a);
    }
  }

  _strokePath(c, rs, s0 = 0, s1 = 1, step = 0.01) {
    let pen = false;
    for (let s = s0; s <= s1 + 1e-6; s += step) {
      const q = along(rs, Math.min(s, s1)); const p = this.project(q[0], q[1]);
      if (!p) { pen = false; continue; }
      if (!pen) { c.moveTo(p[0], p[1]); pen = true; } else c.lineTo(p[0], p[1]);
    }
  }

  _drawRivers(c, t, R) {
    for (const r of this.data.rivers) {
      const v = this.vis(r) * (r.dry ? r.dryK(this.year) : 1); if (v < 0.02) continue;
      const fk = this.focusK(r);
      c.beginPath(); this._strokePath(c, r._rs, 0, 1, 0.012);
      c.lineCap = 'round'; c.lineJoin = 'round';
      c.strokeStyle = `rgba(90,170,230,${0.55 * v * Math.max(fk, 0.6)})`;
      c.lineWidth = Math.max(1, Math.min(3, R / 400)) * (r.w || 1);
      c.stroke();
      // animated shimmer
      c.setLineDash([2, 14]); c.lineDashOffset = -t * 22;
      c.strokeStyle = `rgba(200,235,255,${0.55 * v * fk})`; c.lineWidth *= 0.8; c.stroke();
      c.setLineDash([]);
      r._screenMid = (() => { const q = along(r._rs, r.labelAt ?? 0.45); return this.project(q[0], q[1]); })();
      r._v = v * fk;
    }
  }

  _blobPts(cu, t) {
    const N = 40, pts = [];
    const cos = Math.cos(cu.lat * DEG), rot = (cu.rot || 0) * DEG;
    const grow = cu._grow ?? 1;
    for (let i = 0; i < N; i++) {
      const a = (i / N) * TAU;
      const r = (1 + 0.16 * noise1(cu.seed, a) + 0.025 * Math.sin(t * 0.9 + a * 3 + cu.seed)) * grow;
      const x = cu.rx * r * Math.cos(a), y = cu.ry * r * Math.sin(a);
      const xr = x * Math.cos(rot) - y * Math.sin(rot), yr = x * Math.sin(rot) + y * Math.cos(rot);
      const p = this.project(cu.lon + xr / cos, cu.lat + yr);
      if (p) pts.push(p);
    }
    return pts;
  }
  _drawCultures(c, t, R) {
    for (const cu of this.data.cultures) {
      const v = this.vis(cu); if (v < 0.02) { cu._pts = null; continue; }
      const fk = this.focusK(cu);
      cu._grow = 0.35 + 0.65 * v;
      const pts = this._blobPts(cu, t); cu._pts = pts.length > 8 ? pts : null;
      if (!cu._pts) continue;
      const ctr = this.project(cu.lon, cu.lat) || pts[0];
      c.beginPath();
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i], q = pts[(i + 1) % pts.length];
        const mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2;
        if (i === 0) c.moveTo(mx, my); else c.quadraticCurveTo(p[0], p[1], mx, my);
      }
      const p0 = pts[0], p1 = pts[1]; c.quadraticCurveTo(p0[0], p0[1], (p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2);
      c.closePath();
      const rr = Math.max(...pts.map(p => Math.hypot(p[0] - ctr[0], p[1] - ctr[1])));
      const g = c.createRadialGradient(ctr[0], ctr[1], 0, ctr[0], ctr[1], rr);
      const fd = 1 - 0.6 * this.fieldAlpha;
      g.addColorStop(0, rgba(cu.color, 0.38 * v * fk * fd)); g.addColorStop(1, rgba(cu.color, 0.10 * v * fk * fd));
      c.fillStyle = g; c.fill();
      c.strokeStyle = rgba(cu.color, 0.75 * v * fk); c.lineWidth = 1.2;
      if (cu.dashed) c.setLineDash([5, 4]);
      c.stroke(); c.setLineDash([]);
      cu._ctr = ctr; cu._v = v * fk;
    }
  }

  _flowGrowth(f) {
    if (f.from == null || f.to == null) return 1;
    return Math.max(0, Math.min(1, (this.year - f.from) / Math.max(1, f.to - f.from)));
  }
  _drawFlows(c, t, R) {
    for (const f of this.data.flows) {
      const v = this.vis(f); if (v < 0.02) { f._tip = null; continue; }
      const fk = this.focusK(f);
      const g = Math.max(0.02, this._flowGrowth(f));
      const w = (f.width || 1) * Math.max(1.2, Math.min(3.2, R / 300));
      const col = f.color;
      c.lineCap = 'round'; c.lineJoin = 'round';
      c.beginPath(); this._strokePath(c, f._rs, 0, g, 0.008);
      c.strokeStyle = rgba(col, 0.18 * v * fk); c.lineWidth = w * 4; c.stroke();
      c.strokeStyle = rgba(col, 0.75 * v * fk); c.lineWidth = w; c.stroke();
      // arrow head at tip
      const tip = along(f._rs, g), pre = along(f._rs, Math.max(0, g - 0.02));
      const P = this.project(tip[0], tip[1]), Q = this.project(pre[0], pre[1]);
      if (P && Q) {
        const a = Math.atan2(P[1] - Q[1], P[0] - Q[0]), s = w * 3.2;
        c.beginPath(); c.moveTo(P[0] + Math.cos(a) * s, P[1] + Math.sin(a) * s);
        c.lineTo(P[0] + Math.cos(a + 2.5) * s, P[1] + Math.sin(a + 2.5) * s);
        c.lineTo(P[0] + Math.cos(a - 2.5) * s, P[1] + Math.sin(a - 2.5) * s);
        c.closePath(); c.fillStyle = rgba(col, 0.95 * v * fk); c.fill();
        f._tip = P; f._v = v * fk;
      } else f._tip = null;
      // moving people/particles
      c.save(); c.globalCompositeOperation = 'lighter';
      const n = f.particles ?? Math.round(10 + f._rs.len / 2);
      const spd = (f.speed || 1) * 0.06 * Math.min(2.5, 25 / Math.max(5, f._rs.len)) ;
      for (let i = 0; i < n; i++) {
        const s = ((i / n) + t * spd + hash(i) * 0.03) % 1;
        if (s > g) continue;
        const q = along(f._rs, s); const p = this.project(q[0], q[1]); if (!p) continue;
        const jit = (hash(i * 7.7) - 0.5) * w * 2.2;
        const fade = Math.min(1, s / 0.05) * Math.min(1, (g - s) / 0.03 + 0.2);
        c.fillStyle = rgba('#ffffff', 0.85 * v * fk * fade);
        c.beginPath(); c.arc(p[0] + jit * 0.3, p[1] + jit, w * 0.55 + 0.6, 0, TAU); c.fill();
        c.fillStyle = rgba(col, 0.5 * v * fk * fade);
        c.beginPath(); c.arc(p[0] + jit * 0.3, p[1] + jit, w * 1.6 + 1.2, 0, TAU); c.fill();
      }
      c.restore();
    }
  }

  _drawSites(c, t, R) {
    for (const s of this.data.sites) {
      const v = this.vis(s); if (v < 0.02) { s._p = null; continue; }
      const fk = this.focusK(s);
      const p = this.project(s.lon, s.lat); s._p = p; if (!p) continue;
      s._v = v * fk;
      const col = s.color || '#f3d08a';
      const r = (s.major ? 4.2 : 3.2) * (0.6 + 0.4 * Math.min(1, R / 900));
      if ((this.focus && this.focus.has(s.id)) || (!this.focus && s.major)) {
        const ph = ((t * 0.45 + hash(s.lon) ) % 1);
        c.beginPath(); c.arc(p[0], p[1], r + ph * 16, 0, TAU);
        c.strokeStyle = rgba(col, (1 - ph) * 0.7 * v); c.lineWidth = 1.4; c.stroke();
      }
      c.beginPath();
      if (s.kind === 'city') c.rect(p[0] - r, p[1] - r, r * 2, r * 2);
      else if (s.kind === 'text' || s.kind === 'inscription') { c.moveTo(p[0], p[1] - r * 1.3); c.lineTo(p[0] + r * 1.2, p[1]); c.lineTo(p[0], p[1] + r * 1.3); c.lineTo(p[0] - r * 1.2, p[1]); c.closePath(); }
      else if (s.kind === 'temple') { for (let k = 0; k < 10; k++) { const a = -Math.PI / 2 + k * Math.PI / 5, rr = k % 2 ? r * 0.6 : r * 1.5; c.lineTo(p[0] + Math.cos(a) * rr, p[1] + Math.sin(a) * rr); } c.closePath(); }
      else if (s.kind === 'fossil') { c.moveTo(p[0], p[1] - r * 1.3); c.lineTo(p[0] + r * 1.2, p[1] + r); c.lineTo(p[0] - r * 1.2, p[1] + r); c.closePath(); }
      else c.arc(p[0], p[1], r, 0, TAU);
      c.fillStyle = rgba(col, 0.95 * v * fk); c.fill();
      c.strokeStyle = `rgba(10,14,20,${0.9 * v * fk})`; c.lineWidth = 1.2; c.stroke();
    }
  }

  _tryLabel(c, text, x, y, font, color, alpha, align = 'left', pad = 2, force = false) {
    c.font = font;
    const w = c.measureText(text).width, h = parseInt(font.match(/(\d+)px/)[1], 10);
    let bx = align === 'center' ? x - w / 2 : x; const by = y - h * 0.8;
    const box = [bx - pad, by - pad, bx + w + pad, by + h + pad];
    if (!force) for (const b of this._labelBoxes) if (!(box[2] < b[0] || box[0] > b[2] || box[3] < b[1] || box[1] > b[3])) return false;
    this._labelBoxes.push(box);
    c.textAlign = align; c.textBaseline = 'alphabetic';
    c.lineWidth = 3.2; c.strokeStyle = `rgba(6,10,16,${0.85 * alpha})`; c.strokeText(text, x, y);
    c.fillStyle = color.startsWith('#') ? rgba(color, alpha) : color; c.fillText(text, x, y);
    return true;
  }

  _drawLabels(c, R) {
    const focus = this.focus;
    const items = [];
    for (const s of this.data.sites) if (s._p && s._v > 0.3) items.push({ pri: (focus && focus.has(s.id) ? 100 : 0) + (s.major ? 10 : 0), kind: 's', o: s });
    for (const cu of this.data.cultures) if (cu._pts && cu._v > 0.3) items.push({ pri: (focus && focus.has(cu.id) ? 90 : 0) + 5, kind: 'c', o: cu });
    for (const f of this.data.flows) if (f._tip && f._v > 0.3 && f.name) items.push({ pri: (focus && focus.has(f.id) ? 95 : 0) + 4, kind: 'f', o: f });
    for (const r of this.data.rivers) if (r._screenMid && r._v > 0.3 && R > 700) items.push({ pri: 1, kind: 'r', o: r });
    for (const l of this.data.labels) { const v = this.vis(l); if (v > 0.3 && (!l.minR || R > l.minR) && (!l.maxR || R < l.maxR)) items.push({ pri: -5, kind: 'l', o: l, v }); }
    items.sort((a, b) => b.pri - a.pri);
    for (const it of items) {
      const o = it.o;
      if (it.kind === 's') {
        const big = focus && focus.has(o.id);
        this._tryLabel(c, o.name, o._p[0] + 8, o._p[1] + 4, `${big ? 600 : 500} ${big ? 13 : 11.5}px Inter`, big ? '#fff4dc' : '#e9dcc0', Math.min(1, o._v * 1.2));
      } else if (it.kind === 'c') {
        this._tryLabel(c, o.name.toUpperCase(), o._ctr[0], o._ctr[1] + 4, `italic 600 ${focus && focus.has(o.id) ? 15 : 13}px "Cormorant Garamond"`, o.color, Math.min(1, o._v * 1.4), 'center');
      } else if (it.kind === 'f') {
        this._tryLabel(c, o.name, o._tip[0] + 10, o._tip[1] - 8, `600 12px Inter`, o.color, Math.min(1, o._v * 1.3));
      } else if (it.kind === 'r') {
        this._tryLabel(c, o.name, o._screenMid[0] + 6, o._screenMid[1], `italic 500 12px "Cormorant Garamond"`, '#8cc8ee', o._v * 0.9);
      } else if (it.kind === 'l') {
        const p = this.project(o.lon, o.lat); if (!p) continue;
        this._tryLabel(c, o.text, p[0], p[1], o.font || `italic 500 14px "Cormorant Garamond"`, o.color || 'rgba(190,210,230,0.55)', it.v, 'center');
      }
    }
  }

  hitTest(x, y) {
    let best = null, bd = 12;
    for (const s of this.data.sites) if (s._p && s._v > 0.3) {
      const d = Math.hypot(s._p[0] - x, s._p[1] - y); if (d < bd) { bd = d; best = s; }
    }
    if (best) return best;
    for (const f of this.data.flows) if (f._tip && f._v > 0.3) {
      const g = this._flowGrowth(f);
      for (let s = 0; s <= g; s += 0.02) {
        const q = along(f._rs, s); const p = this.project(q[0], q[1]); if (!p) continue;
        const d = Math.hypot(p[0] - x, p[1] - y); if (d < 8) return f;
      }
    }
    for (const h of this.hitLayers || []) { const r = h(x, y); if (r) return r; }
    let inside = null;
    for (const cu of this.data.cultures) if (cu._pts && cu._v > 0.3 && pip(cu._pts, x, y)) inside = cu;
    return inside;
  }
}

function pip(poly, x, y) {
  let ins = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j];
    if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) ins = !ins;
  }
  return ins;
}

export { resample, along, rgba, hexToRgb };
