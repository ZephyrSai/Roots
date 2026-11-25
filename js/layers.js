// "Beams": animated arcs from a source (e.g. a reconstructed PIE god on the steppe) to its
// descendants across the map, each ending in a glowing name card. Used by god / word / thread views.
import { rgba } from './map.js';
import { sized } from './media.js';
const imgCache = new Map();
function avatar(im) {
  const url = sized(im, 120);
  let el = imgCache.get(url);
  if (!el) { el = new Image(); el.src = url; imgCache.set(url, el); }
  return el.complete && el.naturalWidth ? el : null;
}

let beams = null, t0 = 0, clock = 0;
export function setBeams(b) {
  beams = b && b.items && b.items.length ? b : null;
  t0 = clock;
}

function bez(a, c, b, t) {
  const u = 1 - t;
  return [u * u * a[0] + 2 * u * t * c[0] + t * t * b[0], u * u * a[1] + 2 * u * t * c[1] + t * t * b[1]];
}

const cards = [];
export function beamsLayer(ctx, map, t) {
  clock = t;
  cards.length = 0;
  if (!beams) return;
  const age = t - t0;
  const src = beams.src ? map.project(beams.src[0], beams.src[1]) : null;
  // source node
  if (src && beams.srcLabel) {
    const pulse = (t * 0.7) % 1;
    ctx.beginPath(); ctx.arc(src[0], src[1], 10 + pulse * 26, 0, Math.PI * 2);
    ctx.strokeStyle = rgba(beams.color || '#f6d58e', (1 - pulse) * 0.7); ctx.lineWidth = 1.5; ctx.stroke();
    ctx.beginPath(); ctx.arc(src[0], src[1], 7, 0, Math.PI * 2);
    ctx.fillStyle = beams.color || '#f6d58e'; ctx.fill();
  }
  const items = beams.items;
  items.forEach((it, i) => {
    const from = it.from ? map.project(it.from[0], it.from[1]) : src;
    const to = map.project(it.to[0], it.to[1]);
    if (!from || !to) return;
    const delay = (it.delay ?? i * (beams.stagger ?? 0.22)) + 0.3;
    const k = Math.max(0, Math.min(1, (age - delay) / 1.1));
    if (k <= 0) return;
    const ke = 1 - Math.pow(1 - k, 3);
    const dx = to[0] - from[0], dy = to[1] - from[1], d = Math.hypot(dx, dy) || 1;
    const lift = Math.min(160, d * 0.32) * (it.lift ?? 1);
    const c = [(from[0] + to[0]) / 2 - dy / d * lift * 0.25, (from[1] + to[1]) / 2 - lift];
    const col = it.color || beams.color || '#f6d58e';
    ctx.lineCap = 'round';
    ctx.beginPath();
    for (let s = 0; s <= ke + 1e-6; s += 0.025) { const p = bez(from, c, to, Math.min(s, ke)); s === 0 ? ctx.moveTo(p[0], p[1]) : ctx.lineTo(p[0], p[1]); }
    ctx.strokeStyle = rgba(col, 0.16); ctx.lineWidth = 7; ctx.stroke();
    ctx.strokeStyle = rgba(col, it.weak ? 0.45 : 0.85); ctx.lineWidth = it.weak ? 1.2 : 1.8;
    if (it.weak) ctx.setLineDash([4, 5]);
    ctx.stroke(); ctx.setLineDash([]);
    // travelling sparks
    if (k >= 1) {
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      for (let j = 0; j < 3; j++) {
        const s = ((t * 0.35 + j / 3 + i * 0.13) % 1);
        const p = bez(from, c, to, s);
        ctx.fillStyle = rgba(col, 0.9 * Math.sin(s * Math.PI));
        ctx.beginPath(); ctx.arc(p[0], p[1], 2.4, 0, Math.PI * 2); ctx.fill();
      }
      ctx.restore();
    }
    if (k > 0.85) cards.push({ it, x: to[0], y: to[1], a: (k - 0.85) / 0.15, col });
  });
  // source label first, so cards avoid it
  const placed = [];
  if (src && beams.srcLabel) {
    ctx.font = 'italic 600 19px "Cormorant Garamond"';
    const w = ctx.measureText(beams.srcLabel).width;
    const bx = src[0] - w / 2 - 12, by = src[1] + 14, bh = beams.srcSub ? 44 : 28;
    ctx.fillStyle = 'rgba(8,12,20,0.88)'; roundRect(ctx, bx, by, w + 24, bh, 9); ctx.fill();
    ctx.strokeStyle = rgba(beams.color || '#f6d58e', 0.8); ctx.stroke();
    ctx.fillStyle = beams.color || '#f6d58e'; ctx.textAlign = 'center';
    ctx.fillText(beams.srcLabel, src[0], src[1] + 34);
    if (beams.srcSub) { ctx.font = '11px Inter'; ctx.fillStyle = '#c9bfa8'; ctx.fillText(beams.srcSub, src[0], src[1] + 50); }
    ctx.textAlign = 'left';
    placed.push([bx, by, w + 24, bh]);
  }
  const W = map.w - map.insets.right - 6, L = map.insets.left + 6, T = map.insets.top + 4, B = map.h - map.insets.bottom - 4;
  const hits = (x, y, w, h) => placed.find(p => !(x + w < p[0] || x > p[0] + p[2] || y + h < p[1] || y > p[1] + p[3]));
  for (const cd of cards) {
    const { it } = cd;
    ctx.font = '600 13px Inter';
    const w1 = ctx.measureText(it.label).width;
    ctx.font = '11px Inter';
    const w2 = it.sub ? ctx.measureText(it.sub).width : 0;
    const av = it.img ? avatar(it.img) : null;
    const h = it.img ? 44 : (it.sub ? 38 : 24), pad = it.img ? h - 2 : 0;
    const w = Math.max(w1, w2) + 18 + pad;
    const cands = [[10, -h - 6], [10, 6], [-w - 10, -h - 6], [-w - 10, 6], [-w / 2, -h - 14], [-w / 2, 14]];
    let best = null;
    for (const [dx, dy] of cands) {
      let x = Math.max(L, Math.min(W - w, cd.x + dx)), y = Math.max(T, Math.min(B - h, cd.y + dy));
      if (!hits(x, y, w, h)) { best = [x, y]; break; }
    }
    if (!best) {
      let x = Math.max(L, Math.min(W - w, cd.x + 10)), y = Math.max(T, Math.min(B - h, cd.y - h - 6));
      for (let k = 0; k < 12; k++) { const hh = hits(x, y, w, h); if (!hh) break; y = hh[1] + hh[3] + 3; }
      best = [x, y];
    }
    const [x, y] = best;
    placed.push([x, y, w, h]);
    ctx.globalAlpha = cd.a;
    ctx.beginPath(); ctx.arc(cd.x, cd.y, 4, 0, Math.PI * 2); ctx.fillStyle = cd.col; ctx.fill();
    const ax = Math.max(x, Math.min(x + w, cd.x)), ay = Math.max(y, Math.min(y + h, cd.y));
    ctx.beginPath(); ctx.moveTo(cd.x, cd.y); ctx.lineTo(ax, ay); ctx.strokeStyle = rgba(cd.col, 0.5); ctx.lineWidth = 1; ctx.stroke();
    ctx.fillStyle = 'rgba(8,12,20,0.9)'; ctx.strokeStyle = rgba(cd.col, 0.8);
    roundRect(ctx, x, y, w, h, 7); ctx.fill(); ctx.stroke();
    if (it.img) {
      ctx.save(); roundRect(ctx, x + 4, y + 4, h - 8, h - 8, 6); ctx.clip();
      if (av) { const s0 = Math.min(av.naturalWidth, av.naturalHeight); ctx.drawImage(av, (av.naturalWidth - s0) / 2, (av.naturalHeight - s0) / 2, s0, s0, x + 4, y + 4, h - 8, h - 8); }
      else { ctx.fillStyle = rgba(cd.col, 0.25); ctx.fill(); }
      ctx.restore();
    }
    const ty = it.img ? 3 : 0;
    ctx.fillStyle = '#fff3da'; ctx.font = '600 13px Inter'; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
    ctx.fillText(it.label, x + 9 + pad, y + 16 + ty);
    if (it.sub) { ctx.fillStyle = rgba(cd.col, 0.95); ctx.font = '11px Inter'; ctx.fillText(it.sub, x + 9 + pad, y + 31 + ty); }
    ctx.globalAlpha = 1;
    cd.box = [x, y, w, h];
  }
}
export function beamsHit() {
  return (x, y) => {
    for (const cd of cards) if (cd.box) {
      const [bx, by, w, h] = cd.box;
      if (x >= bx && x <= bx + w && y >= by && y <= by + h) return { id: 'beam:' + cd.it.label, name: cd.it.label, tip: cd.it.tip || cd.it.sub || '', desc: cd.it.tip || cd.it.sub, img: cd.it.img };
    }
    return null;
  };
}
function roundRect(c, x, y, w, h, r) {
  c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath();
}
