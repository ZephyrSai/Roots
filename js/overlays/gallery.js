// "Faces of the gods" gallery and image credits.
import { IMAGES, byTopic, sized, credit, register } from '../media.js';
import { GODS } from '../data/gods.js';

const h = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const TRAD_COL = [[/vedic|hindu|india|sanskrit/i, '#ffcf6e'], [/tamil|dravid|chola|pallava/i, '#ff9e5e'], [/iran|zoro|avest|persia|sasan/i, '#62d2c4'], [/greek|helleni/i, '#5fd0ff'], [/roman|latin|etrus/i, '#9fb7ff'],
  [/norse|german|viking|anglo|scandin/i, '#7ee0b0'], [/celt|gaul|irish/i, '#c58bff'], [/balt|lithuan|latvi|slav/i, '#ffd36e'], [/hitt|anatol|luwi|mitanni|hurri/i, '#5fd0ff'],
  [/buddh|gandh|kushan|jain|japan|chin/i, '#c9a3ff'], [/indus|harapp/i, '#4fc3a1']];
export const tradColor = t => (TRAD_COL.find(([re]) => re.test(t || '')) || [0, '#c9bfa8'])[1];

const EXTRA = [
  { id: 'indus', en: 'Indus clues' }, { id: 'tamil', en: 'Tamil gods' }, { id: 'iran', en: 'Iran & Mitanni' },
  { id: 'crossover', en: 'Greek ⇄ Indian' }, { id: 'buddhist', en: 'Buddhist, Jain & Sikh' },
];

export const gallery = {
  title: 'Faces of the gods', kicker: 'In stone, bronze, clay and paint', icon: '🖼',
  desc: 'Museum objects and monuments: the same god as Greeks, Romans, Norse, Balts and Vedic Indians carved him — plus Indus seals, Tamil bronzes and Gandhāran crossovers.',
  mount(el, api, arg) {
    const wrap = h('div', 'ov-scroll');
    const pills = h('div', 'pill-row');
    const intro = h('div', 'gal-intro');
    const grid = h('div', 'gal-grid');
    wrap.append(pills, intro, grid); el.appendChild(wrap);
    const topics = [...GODS.map(g => ({ id: g.id, en: g.en, g })), ...EXTRA].filter(t => byTopic(t.id).length);
    if (!topics.length) { grid.innerHTML = '<p class="muted">No images loaded.</p>'; return {}; }
    function pick(id) {
      const t = topics.find(x => x.id === id) || topics[0];
      [...pills.children].forEach(b => b.classList.toggle('on', b.dataset.id === t.id));
      const list = byTopic(t.id);
      const g = register(list);
      intro.innerHTML = t.g ? `<div><div class="gc-pie">${esc(t.g.pie)}</div><div class="gc-en">${esc(t.g.en)}</div><p class="small">${esc(t.g.blurb)}</p></div><span class="chip ${t.g.conf}">${t.g.conf}</span>` : `<div><div class="gc-pie">${esc(t.en)}</div></div>`;
      grid.innerHTML = list.map((im, i) => `<button class="gcard" data-lb="${g}" data-i="${i}" style="--d:${i * 0.06}s">
        <div class="gimg"><img loading="lazy" src="${esc(sized(im, 480))}" alt="${esc(im.caption)}"></div>
        <div class="gtxt"><div class="gtr" style="color:${tradColor(im.tradition)}">${esc(im.tradition || '')}${im.conf && im.conf !== 'strong' ? ` · <span class="chip ${im.conf}" style="font-size:8.5px;padding:0 5px">${im.conf}</span>` : ''}</div>
        <div class="gcap">${esc(im.caption)}</div><div class="gcr">${esc(credit(im))}</div></div></button>`).join('');
      // gentle 3D tilt
      grid.querySelectorAll('.gcard').forEach(c => {
        c.onmousemove = e => { const r = c.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5; c.style.transform = `perspective(700px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-3px)`; };
        c.onmouseleave = () => { c.style.transform = ''; };
      });
      wrap.scrollTop = 0;
    }
    for (const t of topics) { const b = h('button', 'pill', `${esc(t.en)} <span class="muted">${byTopic(t.id).length}</span>`); b.dataset.id = t.id; b.onclick = () => pick(t.id); pills.appendChild(b); }
    pick(arg || topics[0].id);
    return { setArg: a => pick(a) };
  },
};

export const credits = {
  title: 'Image credits', kicker: 'Wikimedia Commons · free licences', icon: '©',
  desc: 'Every photograph and its author, licence and source page.',
  mount(el) {
    const wrap = h('div', 'ov-scroll');
    const seen = new Set();
    const rows = IMAGES.filter(im => !seen.has(im.file) && seen.add(im.file));
    wrap.innerHTML = `<p class="small muted">${rows.length} images, hot-linked from Wikimedia Commons under public-domain or Creative Commons licences. Click a title to see the full licence and author details.</p>
      <div class="credits-list">${rows.map(im => `<div><a href="${esc(im.page)}" target="_blank" rel="noopener">${esc(im.file.replace(/^File:/, ''))}</a><br>${esc(im.caption || '')}<br><span class="muted">${esc(credit(im))}</span></div>`).join('')}</div>`;
    el.appendChild(wrap);
    return {};
  },
};
