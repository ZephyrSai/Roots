// Docked overlays that drive the map: divine family, word explorer, ancestry mixer.
import { GODS, godBeams, WORDS, wordBeams, LANGS } from '../data/gods.js';
import { POPS, COMPONENTS, FIELDS } from '../data/ancestry.js';
import { byTopic, stripHTML } from '../media.js';

const h = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
const CONF = { strong: 'strong', moderate: 'moderate', debated: 'debated', fringe: 'fringe' };

export const gods = {
  title: 'The Sky Father’s family', kicker: 'Comparative mythology', icon: '⚡', dock: true,
  desc: 'Pick a reconstructed Indo-European god and watch its descendants light up from Ireland to India.',
  mount(el, api, arg) {
    const wrap = h('div', 'ov-scroll');
    wrap.appendChild(h('p', 'small muted', 'Reconstructed from names and stories that line up across daughter traditions. Dashed beams = role matches but the name doesn’t, or the link is disputed.'));
    const pills = h('div', 'pill-row'); wrap.appendChild(pills);
    const card = h('div', 'god-card'); wrap.appendChild(card);
    el.appendChild(wrap);
    let cur;
    function pick(id) {
      cur = id; const g = GODS.find(x => x.id === id);
      [...pills.children].forEach(b => b.classList.toggle('on', b.dataset.id === id));
      card.innerHTML = `<div class="gc-pie">${g.pie}</div><div class="gc-en">${g.en}</div><div class="chips"><span class="chip ${CONF[g.conf]}">${g.conf} reconstruction</span></div><p>${g.blurb}</p>
        <div class="refl">${g.r.map(r => `<div class="rf${r[3] ? ' weak' : ''}"><b>${r[1]}</b><span>${r[2] || ''}</span></div>`).join('')}</div>
        ${byTopic(id).length ? `<h4 class="dock-h">In stone, bronze &amp; paint</h4>${stripHTML(byTopic(id), { size: 'm' })}<button class="act" data-gal="${id}">🖼 Open the full gallery</button>` : ''}`;
      const gb = card.querySelector('[data-gal]'); if (gb) gb.onclick = () => window.__roots.open('gallery', id);
      card.classList.remove('enter'); void card.offsetWidth; card.classList.add('enter');
      api.setBeams(godBeams(id));
      api.flyTo({ lon: 38, lat: 46, zoom: 2.0 }, 1800);
    }
    for (const g of GODS) { const b = h('button', 'pill', g.en); b.dataset.id = g.id; b.onclick = () => pick(g.id); pills.appendChild(b); }
    pick(arg || 'dyeus');
    return { setArg: a => pick(a || 'dyeus'), unmount: () => api.setBeams(null) };
  },
};

export const words = {
  title: 'Words that remember', kicker: 'Cognate explorer', icon: 'Aa', dock: true,
  desc: 'See “mother”, “three”, “name” or “god” travel from the steppe into a dozen languages — and why Tamil doesn’t join in.',
  mount(el, api, arg) {
    const wrap = h('div', 'ov-scroll');
    wrap.appendChild(h('p', 'small muted', 'Coloured beams are cognates — inherited from one Proto-Indo-European word. Grey points are unrelated words. Tamil belongs to a different family altogether.'));
    const pills = h('div', 'pill-row'); wrap.appendChild(pills);
    const tbl = h('div', 'word-tbl'); wrap.appendChild(tbl);
    el.appendChild(wrap);
    function pick(id) {
      const w = WORDS.find(x => x.id === id);
      [...pills.children].forEach(b => b.classList.toggle('on', b.dataset.id === id));
      tbl.innerHTML = `<div class="gc-pie">${w.pie}</div><div class="gc-en">“${w.en}”</div>${w.note ? `<p class="note">${w.note}</p>` : ''}` +
        w.w.map(([l, word, cog]) => `<div class="wr${cog ? '' : ' no'}"><span class="ln" style="color:${cog ? LANGS[l].color : '#8f8a7c'}">${LANGS[l].name}</span><b>${word}</b>${cog ? '' : '<i>unrelated</i>'}</div>`).join('');
      tbl.classList.remove('enter'); void tbl.offsetWidth; tbl.classList.add('enter');
      api.setBeams(wordBeams(id));
      api.flyTo({ lon: 42, lat: 40, zoom: 1.6 }, 1800);
    }
    for (const w of WORDS) { const b = h('button', 'pill', w.en); b.dataset.id = w.id; b.onclick = () => pick(w.id); pills.appendChild(b); }
    pick(arg || 'father');
    return { setArg: a => pick(a || 'father'), unmount: () => api.setBeams(null) };
  },
};

// ---------------------------------------------------------------- ancestry mixer
export const mixer = {
  title: 'What are we made of?', kicker: 'Ancestry mixer', icon: '◐', dock: true,
  desc: 'Click any South Asian group to see its blend of the four ancestral streams. Compare castes in the same region.',
  mount(el, api, arg) {
    const wrap = h('div', 'ov-scroll');
    wrap.innerHTML = `<p class="small muted">Approximate ranges, synthesised from published bounds (Narasimhan 2019, Kerdoncuff 2025, Tätte 2019). Treat every number as <b>rough ±5–10 points</b>; the pattern matters more than the digits.</p>`;
    const cv = document.createElement('canvas'); cv.className = 'mix-cv'; cv.width = 680; cv.height = 440;
    wrap.appendChild(cv);
    const info = h('div', 'mix-info'); wrap.appendChild(info);
    const cmpRow = h('div', 'pill-row');
    cmpRow.innerHTML = '<span class="small muted" style="width:100%">Same region, different caste:</span>';
    [['tamil', 'tambr', 'Tamil vs Tamil Brahmin'], ['upb', 'upbr', 'Bihar/UP vs Brahmin & Bhumihar']].forEach(([a, b, l]) => {
      const bt = h('button', 'pill', l); bt.onclick = () => { pick(a); setTimeout(() => compare(b), 50); }; cmpRow.appendChild(bt);
    });
    wrap.appendChild(cmpRow);
    const list = h('div', 'pop-list'); wrap.appendChild(list);
    el.appendChild(wrap);
    const ctx = cv.getContext('2d');
    // particles
    const N = 360;
    const parts = Array.from({ length: N }, (_, i) => ({ x: 340 + (Math.random() - 0.5) * 300, y: 220 + (Math.random() - 0.5) * 300, vx: 0, vy: 0, k: 0, tk: 0, i }));
    let cur = null, cmp = null, t = 0;
    function targets(pop, cx, cy, R) {
      // assign particles by component share, arranged in a ring sector per component
      const order = COMPONENTS.map(c => c.key);
      let acc = 0; const sectors = [];
      for (const k of order) { const v = pop.mix[k] || 0; sectors.push([k, acc, acc + v]); acc += v; }
      return sectors.map(([k, a, b]) => ({ k, a: a * Math.PI * 2 - Math.PI / 2, b: b * Math.PI * 2 - Math.PI / 2, share: b - a, cx, cy, R }));
    }
    function assign() {
      const groups = [];
      if (cur) groups.push(targets(cur, cmp ? 190 : 340, 215, cmp ? 120 : 165));
      if (cmp) groups.push(targets(cmp, 490, 215, 120));
      const per = Math.floor(N / groups.length);
      parts.forEach((p, i) => {
        const g = groups[Math.min(groups.length - 1, Math.floor(i / per))]; const j = i % per;
        let cum = 0, sec = g[0]; const f = j / per;
        for (const s of g) { if (f >= cum && f < cum + s.share) { sec = s; break; } cum += s.share; }
        const local = sec.share > 0 ? (f - cum) / sec.share : 0;
        const ang = sec.a + (sec.b - sec.a) * local;
        const rr = sec.R * (0.45 + 0.55 * ((j * 0.618) % 1));
        p.tx = sec.cx + Math.cos(ang) * rr; p.ty = sec.cy + Math.sin(ang) * rr; p.k = COMPONENTS.findIndex(c => c.key === sec.k);
      });
    }
    function bars(pop) {
      return COMPONENTS.map(c => { const r = pop.r[c.key]; return `<div class="bar"><span>${c.short}</span><div class="trk"><i style="left:${r[0]}%;width:${Math.max(1, r[1] - r[0])}%;background:${c.color}"></i><em style="left:${(pop.mix[c.key] * 100).toFixed(0)}%"></em></div><b>${r[0]}–${r[1]}%</b></div>`; }).join('');
    }
    function render() {
      const a = cur, b = cmp;
      info.innerHTML = `<div class="mi-row">${[a, b].filter(Boolean).map(p => `<div class="mi"><h4>${p.name}</h4><div class="small muted">${p.region} · ${p.lang}${p.caste ? ' · priestly caste' : ''}</div><div class="chips"><span class="chip ${p.conf === 'moderate' ? 'moderate' : 'debated'}">${p.conf}</span></div>${bars(p)}${p.note ? `<p class="small">${p.note}</p>` : ''}</div>`).join('')}</div>`;
    }
    function pick(id) {
      cur = POPS.find(p => p.id === id); cmp = null; assign(); render();
      [...list.children].forEach(b => b.classList.toggle('on', b.dataset.id === id));
      api.flyTo({ lon: cur.lon, lat: cur.lat, zoom: 3.2 }, 1600);
      api.setFocus([]);
    }
    function compare(id) { cmp = POPS.find(p => p.id === id); assign(); render(); }
    for (const p of POPS) {
      const b = h('button', 'pop', `<span class="dots">${COMPONENTS.map(c => `<i style="background:${c.color};width:${(p.mix[c.key] * 100).toFixed(0)}%"></i>`).join('')}</span><span>${p.name}</span>`);
      b.dataset.id = p.id; b.onclick = () => pick(p.id); list.appendChild(b);
    }
    const prevField = api.map.field;
    api.map.setField({ ...FIELDS.today, components: COMPONENTS });
    pick(arg || 'tamil');
    function frame(dt) {
      t += dt;
      ctx.clearRect(0, 0, cv.width, cv.height);
      ctx.globalCompositeOperation = 'lighter';
      for (const p of parts) {
        const ax = (p.tx - p.x) * 6, ay = (p.ty - p.y) * 6;
        p.vx = (p.vx + ax * dt) * 0.86; p.vy = (p.vy + ay * dt) * 0.86;
        p.x += p.vx * dt * 8 + Math.sin(t * 1.3 + p.i) * 0.15; p.y += p.vy * dt * 8 + Math.cos(t * 1.1 + p.i * 1.7) * 0.15;
        const col = COMPONENTS[p.k] ? COMPONENTS[p.k].color : '#fff';
        ctx.fillStyle = col + '55'; ctx.beginPath(); ctx.arc(p.x, p.y, 6, 0, 6.283); ctx.fill();
        ctx.fillStyle = col; ctx.beginPath(); ctx.arc(p.x, p.y, 2.4, 0, 6.283); ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';
      ctx.font = '600 30px "Cormorant Garamond"'; ctx.textAlign = 'center'; ctx.fillStyle = '#fff3da';
      if (cur) ctx.fillText(cur.name.split(' (')[0], cmp ? 190 : 340, 215 + 8);
      if (cmp) ctx.fillText(cmp.name.split(' &')[0], 490, 215 + 8);
    }
    return { frame, setArg: a => pick(a || 'tamil'), unmount: () => api.map.setField(prevField) };
  },
};
