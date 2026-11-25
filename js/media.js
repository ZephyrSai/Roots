// Image helpers: lookup by key/topic, thumbnail strips, lightbox with credits.
import { IMAGES } from './data/images.js';

export { IMAGES };
// Gallery images that also illustrate a map site / culture / step.
const ALIAS = {
  's-vidisha': ['heliodorus-pillar'], 's-hadda': ['herakles-vajrapani', 'vajrapani-bm', 'buddha-herakles-tyche'], 's-borobudur': ['borobudur'], 's-prambanan': ['prambanan'],
  's-angkor': ['angkor-churning'], 's-mohenjo': ['great-bath', 'priest-king', 'dancing-girl', 'pashupati-seal'], 's-sarnath': ['sarnath-lion'], 's-yazd': ['yazd-atash-behram', 'yazd-faravahar'],
  's-persepolis': ['faravahar-persepolis'], 's-ostia': ['mithras-vienna'], 's-thanjavur': ['murugan-thanjavur'], 's-mamalla': ['mahishasuramardini-mamallapuram'],
  's-chidam': ['nataraja-lacma'], 's-washu': ['kikkuli'], 'c-mitanni': ['kikkuli'], 'c-hittite': ['yazilikaya-a', 'illuyanka-malatya'], 's-hattusa': ['yazilikaya-a'],
  'c-ivc': ['priest-king', 'seals', 'great-bath', 'dancing-girl', 'weights'], 'c-lateh': ['s-rakhi'], 'c-kushan': ['kanishka-buddha-ashmolean', 'huvishka-oesho', 'kanishka-miiro', 'kanishka-nana', 'kanishka-oado'],
  'c-indogreek': ['agathocles-balarama', 's-aikh'], 'c-nba': ['trundholm-1'], 's-uppsala': ['mjolnir-scania'], 'c-rv': ['rigveda'], 'c-kuru': ['pgw', 's-kuru'], 'c-gupta': ['indra-airavata-mathura', 'prithvi-udayagiri'],
  'c-pallava': ['l-kanchi', 'mahishasuramardini-mamallapuram'], 'c-chola': ['nataraja-lacma', 's-thanjavur', 'appar-chennai'], 'c-raj': ['l-census'], 'c-maurya': ['sarnath-lion', 'ashoka-edict-gujarra'],
  'c-magadha': ['s-bodhgaya', 'mahavira-brussels'], 's-pavapuri': ['mahavira-brussels'], 'c-sint': ['s-sintashta'], 'c-andr': ['land-steppe'], 'c-clv': ['s-khval'], 'c-ach': ['behistun'],
  's-kalibangan': ['c-ivc'], 'c-swat': ['s-swat'], 'c-sneo': ['dolmen'], 's-kucha': ['c-toch'], 'c-sangam': ['tbrahmi'], 's-keeladi': ['tbrahmi'], 's-anura': ['tbrahmi'],
  's-dunhuang': [], 's-nara': ['shukongojin-todaiji', 'nio-todaiji'], 's-mehrgarh': [], 'c-mehrgarh': ['s-mehrgarh'], 'c-rome': ['jupiter-hermitage', 'mithras-louvre'], 'c-myc': ['s-mycenae', 's-knossos'],
  'c-celt': ['taranis-chatelet'], 'c-zagros': ['s-ganj'], 'c-aasi': ['s-bhim', 's-andaman'], 's-ctesiphon': [], 's-kannur': ['theyyam-muchilottu', 'theyyam-kannangattu'],
  's-palani': ['murugan-thanjavur'], 's-sriper': ['l-iyengar'], 's-srirangam': ['l-iyengar'], 's-kalash': [], 's-sanjan': ['l-navsari'], 's-nankana': ['guru-nanak-janamsakhi'],
  'c-munda': ['l-sohrai'], 'c-tb': ['l-hornbill'], 'c-sultan': [], 's-brahui': [], 'c-bmac': ['s-gonur'], 's-gonur': ['c-bmac'],
};
const direct = k => IMAGES.filter(im => im.key === k);
export const byKey = k => { const seen = new Set(), out = []; for (const kk of [k, ...(ALIAS[k] || [])]) for (const im of direct(kk)) if (!seen.has(im.file)) { seen.add(im.file); out.push(im); } return out; };
export const byTopic = t => IMAGES.filter(im => im.topic === t);
export const byKeyOrTopic = k => { const a = byKey(k); return a.length ? a : byTopic(k); };
export function pick(keys = [], max = 6) {
  const out = [], seen = new Set();
  for (const k of keys) for (const im of byKeyOrTopic(k)) if (!seen.has(im.file)) { seen.add(im.file); out.push(im); }
  return out.slice(0, max);
}
// Commons thumbnails can be re-requested at any width by editing the "960px-" segment.
// Wikimedia only serves standard thumbnail widths; snap to one (never above the 960px we validated).
const BUCKETS = [120, 250, 330, 500, 960];
export function sized(im, w = 330) {
  const u = im.thumb || im.full || '';
  if (!u.includes('/thumb/')) return u;
  const b = BUCKETS.find(x => x >= w) || 960;
  return u.replace(/\/\d+px-/, `/${b}px-`);
}
export const credit = im => `${im.artist ? im.artist + ' · ' : ''}${im.license || ''}`;

const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const groups = new Map(); let gid = 0;
export function register(list) { const id = 'g' + (++gid); groups.set(id, list); return id; }

export function stripHTML(list, { size = 'm', cap = true } = {}) {
  if (!list || !list.length) return '';
  const g = register(list);
  return `<div class="istrip ${size}">${list.map((im, i) => `<button class="ithumb" data-lb="${g}" data-i="${i}" style="--d:${i * 0.07}s" title="${esc(im.caption)}">
    <img loading="lazy" src="${esc(sized(im, size === 's' ? 200 : 360))}" alt="${esc(im.caption)}">${cap ? `<span>${esc(im.tradition || '')}</span>` : ''}</button>`).join('')}</div>`;
}

// ---- lightbox
let lb, cur = { list: [], i: 0 };
function ensure() {
  if (lb) return;
  lb = document.createElement('div'); lb.className = 'lightbox hidden';
  lb.innerHTML = `<button class="lb-x icon-btn" title="Close (Esc)">✕</button><button class="lb-prev">‹</button><button class="lb-next">›</button>
    <figure><div class="lb-imgwrap"><img alt=""><div class="lb-spin"></div></div><figcaption><div class="lb-trad"></div><div class="lb-cap"></div><div class="lb-meta"></div></figcaption></figure>`;
  document.body.appendChild(lb);
  lb.querySelector('.lb-x').onclick = close;
  lb.querySelector('.lb-prev').onclick = () => show(cur.i - 1);
  lb.querySelector('.lb-next').onclick = () => show(cur.i + 1);
  lb.addEventListener('click', e => { if (e.target === lb) close(); });
  addEventListener('keydown', e => {
    if (lb.classList.contains('hidden')) return;
    if (e.key === 'Escape') { close(); e.stopImmediatePropagation(); }
    else if (e.key === 'ArrowLeft') { show(cur.i - 1); e.stopImmediatePropagation(); e.preventDefault(); }
    else if (e.key === 'ArrowRight' || e.key === ' ') { show(cur.i + 1); e.stopImmediatePropagation(); e.preventDefault(); }
  }, true);
}
function show(i) {
  const n = cur.list.length; if (!n) return;
  cur.i = (i + n) % n; const im = cur.list[cur.i];
  const img = lb.querySelector('img');
  lb.classList.add('loading');
  img.onload = () => lb.classList.remove('loading');
  img.src = sized(im, 960); img.alt = im.caption || '';
  lb.querySelector('.lb-trad').textContent = [im.tradition, im.conf ? `identification: ${im.conf}` : ''].filter(Boolean).join(' · ');
  lb.querySelector('.lb-cap').textContent = im.caption || '';
  lb.querySelector('.lb-meta').innerHTML = `${esc(credit(im))} · <a href="${esc(im.page)}" target="_blank" rel="noopener">Wikimedia Commons ↗</a> <span class="lb-n">${cur.i + 1} / ${n}</span>`;
  lb.querySelector('.lb-prev').style.display = lb.querySelector('.lb-next').style.display = n > 1 ? '' : 'none';
}
export function openLightbox(list, i = 0) { ensure(); cur = { list, i }; lb.classList.remove('hidden'); document.body.classList.add('lb-open'); show(i); }
function close() { lb.classList.add('hidden'); document.body.classList.remove('lb-open'); }
export const lightboxOpen = () => lb && !lb.classList.contains('hidden');

document.addEventListener('click', e => {
  const b = e.target.closest('[data-lb]'); if (!b) return;
  const list = groups.get(b.dataset.lb); if (list) { e.preventDefault(); openLightbox(list, +b.dataset.i || 0); }
});
