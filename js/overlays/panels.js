// Full-width interactive panels: language trees, river of beliefs, deva/asura inversion, Tamil tiṇai, claims check.
import * as d3 from 'd3';
import { byKeyOrTopic, stripHTML } from '../media.js';
const h = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
const tipEl = () => document.getElementById('tip');
function showTip(ev, html) { const t = tipEl(); t.innerHTML = html; t.style.left = Math.min(innerWidth - 300, ev.clientX + 14) + 'px'; t.style.top = (ev.clientY + 12) + 'px'; t.classList.add('on'); }
function hideTip() { tipEl().classList.remove('on'); }

// ------------------------------------------------------------------ language trees
const IE = { n: 'Proto-Indo-Anatolian', d: -4400, col: '#f6d58e', tip: 'Caucasus–Lower Volga, c. 4400–4000 BCE (Lazaridis 2025). Bayesian word-clocks put the root earlier (~6100 BCE, Heggarty 2023) — an open disagreement.', c: [
  { n: 'Anatolian', d: -4200, col: '#5fd0ff', c: [
    { n: 'Hittite', d: -1900, e: -1180, tip: 'Earliest attested IE words: Kanesh tablets c. 1900 BCE.' }, { n: 'Luwian', d: -1600, e: -600 }, { n: 'Lycian, Lydian, Carian', d: -600, e: -300 }] },
  { n: 'Late PIE (Yamnaya)', d: -3500, col: '#7d97ff', c: [
    { n: 'Tocharian', d: -3300, col: '#ff8f8f', c: [{ n: 'Tocharian A', d: 400, e: 900 }, { n: 'Tocharian B', d: 400, e: 900 }] },
    { n: 'Greek–Armenian', d: -2500, col: '#5fd0ff', c: [{ n: 'Greek', d: -1450, tip: 'Linear B c. 1450 BCE.' }, { n: 'Phrygian', d: -800, e: 500 }, { n: 'Armenian', d: 405, tip: 'Alphabet 405 CE.' }] },
    { n: 'Albanian', d: 1462, col: '#5fd0ff', tip: 'Attested only from 1462 CE.' },
    { n: 'Italo-Celtic', d: -2600, col: '#c58bff', c: [
      { n: 'Italic', d: -2000, c: [{ n: 'Latin → Romance', d: -600, c: [{ n: 'Spanish', d: 900, s: '~558M' }, { n: 'Portuguese', d: 900, s: '~265M' }, { n: 'French', d: 850, s: '~310M' }, { n: 'Italian', d: 950 }, { n: 'Romanian', d: 1000 }] }, { n: 'Oscan–Umbrian', d: -500, e: 100 }] },
      { n: 'Celtic', d: -1300, c: [{ n: 'Gaulish', d: -500, e: 500 }, { n: 'Irish & Gaelic', d: 400 }, { n: 'Welsh & Breton', d: 600 }] }] },
    { n: 'Germanic', d: -2300, col: '#7ee0b0', tip: 'Proto-Germanic c. 500 BCE (Grimm’s law).', c: [{ n: 'Gothic', d: 350, e: 800 }, { n: 'Norse → Scandinavian', d: 200 }, { n: 'German & Dutch', d: 700, s: '~135M (German)' }, { n: 'English', d: 450, s: '~1.5 bn incl. L2' }] },
    { n: 'Balto-Slavic', d: -2200, col: '#ffd36e', c: [{ n: 'Baltic', d: -1200, c: [{ n: 'Lithuanian', d: 1547 }, { n: 'Latvian', d: 1550 }, { n: 'Old Prussian', d: 1350, e: 1700 }] }, { n: 'Slavic', d: 500, c: [{ n: 'Russian & East Slavic', d: 1000, s: '~255M (Russian)' }, { n: 'Polish & Czech', d: 1000 }, { n: 'South Slavic', d: 863, tip: 'Old Church Slavonic, 863 CE.' }] }] },
    { n: 'Indo-Iranian', d: -2200, col: '#ffcf6e', tip: 'Sintashta, c. 2100 BCE.', c: [
      { n: 'Iranian', d: -1800, col: '#62d2c4', c: [{ n: 'Avestan', d: -1200, e: -300 }, { n: 'Persian', d: -520, s: '~80M' }, { n: 'Pashto, Balochi, Kurdish', d: 900 }, { n: 'Scythian → Ossetian', d: -900 }] },
      { n: 'Nuristani', d: -1500 },
      { n: 'Indo-Aryan', d: -1800, c: [{ n: 'Mitanni Indo-Aryan', d: -1500, e: -1300, tip: 'Numerals and gods in Syria, c. 1400 BCE.' },
        { n: 'Vedic Sanskrit', d: -1500, c: [
          { n: 'Hindi–Urdu', d: 1000, s: '~609M Hindi + ~240M Urdu' }, { n: 'Bengali', d: 1000, s: '~285M' }, { n: 'Punjabi', d: 1000 }, { n: 'Marathi', d: 1000, s: '~99M' },
          { n: 'Gujarati', d: 1100 }, { n: 'Odia & Assamese', d: 1100 }, { n: 'Nepali', d: 1300 }, { n: 'Sinhala', d: -500, tip: 'Brought to Lanka by c. 300 BCE.' }, { n: 'Romani', d: 500, tip: 'Left India c. 500–1000 CE.' }] }] }] }] }] };

const DRAV = { n: 'Proto-Dravidian', d: -2500, col: '#ff9e5e', tip: 'Kolipakam et al. 2018: ~4,500 years ago (95% range ~4500–1000 BCE). Homeland unresolved.', c: [
  { n: 'North Dravidian', d: -2000, c: [{ n: 'Brahui', d: 1000, s: '~2–2.8M (Pakistan)', tip: 'Relic or medieval migrant? Debated.' }, { n: 'Kurukh (Oraon)', d: 1000, s: '~2.0M' }, { n: 'Malto', d: 1000, s: '~0.2M' }] },
  { n: 'Central Dravidian', d: -1500, c: [{ n: 'Kolami', d: 1000, s: '~0.13M' }, { n: 'Parji', d: 1000, s: '~0.05M' }, { n: 'Ollari & Gadaba', d: 1000, s: 'tiny' }] },
  { n: 'South-Central', d: -1500, c: [{ n: 'Telugu', d: 575, s: '~81M (India)', tip: 'First inscription c. 575 CE.' }, { n: 'Gondi', d: 1000, s: '~3.0M' }, { n: 'Koya', d: 1000, s: '~0.36M' }, { n: 'Kui & Kuvi', d: 1000, s: '~1.1M' }, { n: 'Konda, Pengo, Manda', d: 1000, s: 'tiny' }] },
  { n: 'South Dravidian', d: -1500, c: [
    { n: 'Tamil–Malayalam', d: -500, c: [{ n: 'Tamil', d: -200, s: '~69M (India), ~80M world', tip: 'Tamil-Brahmi from c. 3rd–2nd c. BCE (earlier dates contested).' }, { n: 'Malayalam', d: 900, s: '~35M' }] },
    { n: 'Kannada', d: -300, s: '~44M', tip: 'Halmidi inscription c. 450 CE.' }, { n: 'Tulu', d: 700, s: '~1.85M' }, { n: 'Kodava', d: 800, s: '~0.11M' }, { n: 'Nilgiri: Toda, Kota, Badaga, Irula', d: 800, s: 'small' }] }] };

function treeScale(W) {
  return d3.scaleLinear().domain([-4600, -1000, 0, 2026]).range([30, W * 0.4, W * 0.56, W - 230]);
}
function drawTree(svgHost, root, W, api) {
  svgHost.innerHTML = '';
  const leaves = []; (function walk(n, depth) { n.depth = depth; if (!n.c) leaves.push(n); else n.c.forEach(c => { c.col = c.col || n.col; walk(c, depth + 1); }); })(root, 0);
  const rowH = 20, H = leaves.length * rowH + 60;
  const x = treeScale(W);
  leaves.forEach((l, i) => { l.y = 40 + i * rowH; });
  (function posY(n) { if (n.c) { n.c.forEach(posY); n.y = (n.c[0].y + n.c[n.c.length - 1].y) / 2; } })(root);
  const svg = d3.select(svgHost).append('svg').attr('width', W).attr('height', H);
  // axis
  const ticks = [-4000, -3000, -2000, -1000, 0, 1000, 2000];
  svg.append('g').selectAll('g').data(ticks).join('g').each(function (t) {
    const g = d3.select(this);
    g.append('line').attr('x1', x(t)).attr('x2', x(t)).attr('y1', 20).attr('y2', H).attr('stroke', 'rgba(255,255,255,0.06)');
    g.append('text').attr('x', x(t)).attr('y', 14).attr('text-anchor', 'middle').attr('fill', '#8f8a7c').attr('font-size', 10).attr('font-family', 'JetBrains Mono').text(t < 0 ? `${-t} BCE` : t === 0 ? '1 CE' : t);
  });
  const nowLine = svg.append('line').attr('y1', 20).attr('y2', H).attr('stroke', '#f6d58e').attr('stroke-width', 1.5).attr('opacity', 0.7);
  const links = [], nodes = [];
  (function walk(n) { nodes.push(n); if (n.c) n.c.forEach(c => { links.push([n, c]); walk(c); }); })(root);
  const g = svg.append('g');
  links.forEach(([p, c], i) => {
    const x0 = x(p.d), x1 = x(c.d);
    const path = `M${x0},${p.y} C${(x0 + x1) / 2},${p.y} ${(x0 + x1) / 2},${c.y} ${x1},${c.y}`;
    const el = g.append('path').attr('d', path).attr('fill', 'none').attr('stroke', c.col).attr('stroke-width', 1.8).attr('opacity', 0.85);
    const L = el.node().getTotalLength();
    el.attr('stroke-dasharray', L).attr('stroke-dashoffset', L).transition().delay(c.depth * 260).duration(700).ease(d3.easeCubicOut).attr('stroke-dashoffset', 0);
  });
  nodes.forEach(n => {
    const end = n.c ? null : (n.e ?? 2026);
    if (end != null) {
      const ln = g.append('line').attr('x1', x(n.d)).attr('x2', x(n.d)).attr('y1', n.y).attr('y2', n.y).attr('stroke', n.col).attr('stroke-width', n.e ? 1.2 : 2.4).attr('stroke-dasharray', n.e ? '3 3' : null).attr('opacity', n.e ? 0.55 : 0.9);
      ln.transition().delay(n.depth * 260 + 500).duration(900).attr('x2', x(end));
      const lab = g.append('text').attr('x', x(end) + 6).attr('y', n.y + 4).attr('fill', n.e ? '#8f8a7c' : '#efe6d2').attr('font-size', 12).attr('opacity', 0)
        .text(n.n + (n.e ? ' †' : ''));
      if (n.s) lab.append('tspan').attr('fill', n.col).attr('font-size', 10.5).text('  ' + n.s);
      lab.transition().delay(n.depth * 260 + 1100).duration(500).attr('opacity', 1);
    } else {
      g.append('text').attr('x', x(n.d) - 4).attr('y', n.y - 6).attr('text-anchor', 'end').attr('fill', n.col).attr('font-size', 11).attr('font-weight', 600).attr('opacity', 0)
        .text(n.n).transition().delay(n.depth * 260 + 300).duration(500).attr('opacity', 1);
    }
    g.append('circle').attr('cx', x(n.d)).attr('cy', n.y).attr('r', n.c ? 4.5 : 3).attr('fill', n.col).attr('stroke', '#0b0f18').attr('stroke-width', 1.5)
      .style('cursor', 'pointer').attr('opacity', 0).on('mousemove', ev => showTip(ev, `<b>${n.n}</b><div class="d">${n.d < 0 ? -n.d + ' BCE' : n.d + ' CE'}${n.e ? ' – extinct ' + (n.e < 0 ? -n.e + ' BCE' : n.e + ' CE') : ''}</div>${n.tip || ''}${n.s ? `<div>${n.s} speakers</div>` : ''}`)).on('mouseleave', hideTip)
      .transition().delay(n.depth * 260).duration(300).attr('opacity', 1);
  });
  return y => nowLine.attr('x1', x(Math.max(-4600, y))).attr('x2', x(Math.max(-4600, y)));
}
export const tree = {
  title: 'Family trees of languages', kicker: 'Language explorer', icon: '🌳',
  desc: 'Watch Indo-European and Dravidian grow from a single root into the languages spoken today.',
  mount(el, api, arg) {
    const wrap = h('div', 'ov-scroll');
    const tabs = h('div', 'pill-row');
    const note = h('p', 'small muted');
    const host = h('div', 'tree-host');
    wrap.append(tabs, note, host); el.appendChild(wrap);
    let setNow = null;
    const TABS = {
      ie: ['Indo-European', IE, 'Branch dates follow the steppe model (Anthony 2007; Lazaridis 2025). † = extinct. Dates for branch points are approximate; speaker figures are total L1+L2 (Ethnologue 2025) where given.'],
      drav: ['Dravidian', DRAV, 'Root after Kolipakam et al. 2018. Inner split dates are rough and statistically weakly supported. Speaker figures: Census of India 2011 mother tongue.'],
    };
    function show(k) {
      [...tabs.children].forEach(b => b.classList.toggle('on', b.dataset.k === k));
      note.textContent = TABS[k][2];
      setNow = drawTree(host, TABS[k][1], Math.max(900, host.clientWidth || el.clientWidth - 40), api);
      setNow(api.year);
    }
    for (const [k, v] of Object.entries(TABS)) { const b = h('button', 'pill', v[0]); b.dataset.k = k; b.onclick = () => show(k); tabs.appendChild(b); }
    requestAnimationFrame(() => show(arg || 'ie'));
    return { onYear: y => setNow && setNow(y), setArg: a => show(a || 'ie') };
  },
};

// ------------------------------------------------------------------ river of beliefs
const STREAMS = [
  { n: 'Proto-Indo-European religion', c: '#f6d58e', w: 14, p: [[-4200, 7], [-3000, 7]], t: 'Sky Father, Dawn, the Twins, the serpent-slayer, fire, cattle, horse sacrifice, poets who win “imperishable fame”.' },
  { n: 'Germanic & Norse', c: '#7ee0b0', w: 6, p: [[-3000, 7], [-2300, 1], [1000, 1]], t: 'Týr, Thor, Odin, Freyr. Christianised: Saxons 772–804, Iceland c. 1000, Sweden c. 1100. Revived as Ásatrú (recognised in Iceland 1973).' },
  { n: 'Baltic & Slavic', c: '#ffd36e', w: 6, p: [[-3000, 7], [-2200, 2], [1387, 2]], t: 'Perkūnas, Perun, Dievas, Saulė. Lithuania was Europe’s last pagan state (baptised 1387). Revived as Romuva.' },
  { n: 'Celtic', c: '#c58bff', w: 5, p: [[-3000, 7], [-2100, 3], [450, 3]], t: 'Taranis, Brigid, Nechtan. Ireland Christianised from the 5th c.' },
  { n: 'Greek', c: '#5fd0ff', w: 6, p: [[-3000, 7], [-2200, 4], [392, 4]], t: 'Zeus, Eos, the Dioskouroi, Hestia. Pagan sacrifice banned 391–392 CE.' },
  { n: 'Roman', c: '#9fb7ff', w: 6, p: [[-3000, 7], [-2000, 5], [392, 5]], t: 'Jupiter, Aurora, Vesta, Castor & Pollux, the October Horse.' },
  { n: 'Judaism', c: '#e7e2c9', w: 6, p: [[-1100, 6], [2026, 6]], t: 'Not Indo-European — but Persian rule after 539 BCE brought contact with Zoroastrian ideas.' },
  { n: 'Christianity', c: '#f2f0e6', w: 9, p: [[30, 6], [392, 4.4], [1000, 3.4], [2026, 3.4]], t: 'Replaces the Greek, Roman, Celtic, Germanic and Baltic religions between the 4th and 14th centuries.' },
  { n: 'Islam', c: '#9fe0a8', w: 9, p: [[610, 6], [800, 7.4], [2026, 7.4]], t: 'Arrives in Sindh 712 CE; becomes South Asia’s second-largest faith.' },
  { n: 'Indo-Iranian religion', c: '#ffcf6e', w: 10, p: [[-3000, 7], [-2200, 8.6], [-1800, 8.6]], t: 'Mitra, Varuṇa, Indra, Soma/Haoma, Ṛta/Aša — shared before India and Iran split.' },
  { n: 'Zoroastrianism', c: '#62d2c4', w: 7, p: [[-1800, 8.6], [-1200, 9.6], [2026, 9.6]], t: 'Zarathustra (c. 1500–1000 BCE, debated): one good Lord, Ahura Mazdā; daēvas become demons; judgment, saviour, resurrection.' },
  { n: 'Influence on Judaism', c: '#62d2c4', w: 2, dash: true, p: [[-539, 9.6], [-300, 6.2]], t: 'Debated: angels and demons, resurrection, final judgment, “paradise” (Avestan pairi-daēza).' },
  { n: 'Mithras cult', c: '#62d2c4', w: 2.5, dash: true, p: [[60, 9.6], [180, 5.2], [400, 5.2]], t: 'Roman mystery cult using Mithra’s name; how Iranian it really was is debated.' },
  { n: 'Manichaeism', c: '#62d2c4', w: 2.5, p: [[240, 9.6], [500, 10.4], [1500, 10.4]], t: 'Mani (216–274/277) fuses Zoroastrian, Christian and Buddhist ideas. Uyghur state religion 762.' },
  { n: 'Vedic → Brahmanical', c: '#ffcf6e', w: 10, p: [[-1800, 8.6], [-1200, 11.5], [-500, 11.5]], t: 'Rigveda (c. 1500–1200 BCE), Brāhmaṇas, Upaniṣads.' },
  { n: 'Indus religion', c: '#4fc3a1', w: 7, dash: true, p: [[-2700, 13.5], [-1500, 13.5], [-500, 12.2]], t: 'Ritual baths, sacred pipal, fire pits, horned figures. Continuity into Hinduism is plausible but unprovable.' },
  { n: 'Tamil / Sangam religion', c: '#ff9e5e', w: 7, p: [[-500, 14.6], [300, 14.6], [700, 12.4]], t: 'Murukaṉ, Māyōṉ, Koṟṟavai; possession dances, hero stones. Fuses with Sanskritic gods; gives birth to bhakti.' },
  { n: 'Folk, village & Adivasi traditions', c: '#d98a6b', w: 5, p: [[-4200, 16], [2026, 16]], t: 'Village goddesses, guardian deities, ancestor and hero worship, forest and mountain spirits — continuous, and constantly absorbed into “Hinduism”.' },
  { n: 'absorbed', c: '#d98a6b', w: 2, dash: true, p: [[0, 16], [800, 12.6]], t: 'Sanskritisation: local deities become forms of Pārvatī, Durgā, Viṣṇu or Śiva.' },
  { n: 'Hinduism', c: '#ffcf6e', w: 16, p: [[-500, 11.8], [300, 12], [2026, 12]], t: 'Purāṇic and temple Hinduism: Śaiva, Vaiṣṇava, Śākta and Smārta streams; Āgamas; bhakti from the 6th c.' },
  { n: 'Jainism', c: '#e8e0a0', w: 5, p: [[-500, 11.6], [-250, 17.3], [2026, 17.3]], t: 'Mahāvīra (died c. 425 BCE or later), 24th Tīrthaṅkara.' },
  { n: 'Buddhism', c: '#c9a3ff', w: 10, p: [[-450, 11.6], [-200, 18.6], [2026, 18.6]], t: 'The Buddha (died c. 420–368 BCE per current scholarship). Spreads to Sri Lanka, Central Asia, China, Korea, Japan, Tibet and Southeast Asia; nearly vanishes from India by c. 1200, revived by Ambedkar in 1956.' },
  { n: 'Sikhism', c: '#ffb347', w: 6, p: [[1469, 12.4], [1600, 14.2], [2026, 14.2]], t: 'Guru Nānak (1469–1539). Draws on the Sant/bhakti tradition; Kabīr’s verses are in the Guru Granth.' },
  { n: 'Sufi contact', c: '#9fe0a8', w: 2, dash: true, p: [[1200, 7.4], [1469, 12.8]], t: 'Sant and Sufi devotion shared a world.' },
];
export const river = {
  title: 'The river of beliefs', kicker: 'How religions branched & braided', icon: '≋',
  desc: 'One animated diagram: from Proto-Indo-European religion and the Indus to Hinduism, Zoroastrianism, Buddhism, Jainism, Sikhism — and what they absorbed.',
  mount(el, api) {
    const wrap = h('div', 'ov-scroll');
    wrap.appendChild(h('p', 'small muted', 'Width ≈ rough historical weight, not a measurement. Dashed = influence or continuity that is debated. Hover any stream.'));
    const host = h('div', 'river-host'); wrap.appendChild(host); el.appendChild(wrap);
    const W = Math.max(980, el.clientWidth - 40), H = 560;
    const x = d3.scaleLinear().domain([-4200, -1000, 0, 1000, 2026]).range([20, W * 0.38, W * 0.58, W * 0.78, W - 20]);
    const y = d3.scaleLinear().domain([0.5, 19.2]).range([24, H - 20]);
    const svg = d3.select(host).append('svg').attr('width', W).attr('height', H);
    [-4000, -3000, -2000, -1000, 0, 500, 1000, 1500, 2000].forEach(t => {
      svg.append('line').attr('x1', x(t)).attr('x2', x(t)).attr('y1', 14).attr('y2', H).attr('stroke', 'rgba(255,255,255,0.05)');
      svg.append('text').attr('x', x(t)).attr('y', 10).attr('text-anchor', 'middle').attr('fill', '#8f8a7c').attr('font-size', 10).attr('font-family', 'JetBrains Mono').text(t < 0 ? `${-t} BCE` : t === 0 ? '1 CE' : t);
    });
    const line = d3.line().x(d => x(d[0])).y(d => y(d[1])).curve(d3.curveMonotoneX);
    const g = svg.append('g');
    STREAMS.forEach((s, i) => {
      const pd = line(s.p);
      const base = g.append('path').attr('d', pd).attr('fill', 'none').attr('stroke', s.c).attr('stroke-width', s.w).attr('stroke-linecap', 'round').attr('opacity', s.dash ? 0.5 : 0.35).attr('stroke-dasharray', s.dash ? '6 6' : null);
      const L = base.node().getTotalLength();
      if (!s.dash) base.attr('stroke-dasharray', `${L} ${L}`).attr('stroke-dashoffset', L).transition().delay(i * 90).duration(1400).attr('stroke-dashoffset', 0);
      const flow = g.append('path').attr('d', pd).attr('fill', 'none').attr('stroke', s.c).attr('stroke-width', Math.max(1.2, s.w * 0.35)).attr('stroke-linecap', 'round').attr('class', 'river-flow').attr('opacity', 0);
      flow.transition().delay(i * 90 + 1200).duration(600).attr('opacity', s.dash ? 0.6 : 0.95);
      const hit = g.append('path').attr('d', pd).attr('fill', 'none').attr('stroke', 'transparent').attr('stroke-width', Math.max(12, s.w + 6)).style('cursor', 'pointer');
      hit.on('mousemove', ev => { showTip(ev, `<b>${s.n === 'absorbed' ? 'Absorption into Hinduism' : s.n}</b><div class="d">from ${s.p[0][0] < 0 ? -s.p[0][0] + ' BCE' : s.p[0][0] + ' CE'}</div>${s.t}`); base.attr('opacity', 0.75); })
        .on('mouseleave', () => { hideTip(); base.attr('opacity', s.dash ? 0.5 : 0.35); });
      if (s.n !== 'absorbed' && !s.n.startsWith('Influence') && !s.n.startsWith('Sufi')) {
        const [sx, sy] = s.p[s.p.length > 2 ? 1 : 0];
        g.append('text').attr('x', x(sx) + 6).attr('y', y(sy) - s.w / 2 - 4).attr('fill', s.c).attr('font-size', 11.5).attr('font-weight', 600).attr('opacity', 0).text(s.n)
          .style('paint-order', 'stroke').attr('stroke', '#0b0f18').attr('stroke-width', 3)
          .transition().delay(i * 90 + 800).duration(500).attr('opacity', 0.95);
      }
    });
    const nowLine = svg.append('line').attr('y1', 14).attr('y2', H).attr('stroke', '#f6d58e').attr('stroke-width', 1.5).attr('opacity', 0.75);
    const setNow = yy => { const v = Math.max(-4200, Math.min(2026, yy)); nowLine.attr('x1', x(v)).attr('x2', x(v)); };
    setNow(api.year);
    return { onYear: setNow };
  },
};

// ------------------------------------------------------------------ deva / asura inversion
const INV = [
  ['deva', 'god, shining one', 'good', 'daēva', 'demon', 'bad'],
  ['asura', 'early: “lord” (Varuṇa); later: demon', 'mixed', 'ahura', 'Lord — Ahura Mazdā, the one good god', 'good'],
  ['Indra', 'king of the gods, serpent-slayer', 'good', 'Indra', 'a demon (Vendīdād 10.9)', 'bad'],
  ['Nāsatyas', 'the healing horse-twins', 'good', 'Nåŋhaiθiia', 'a demon', 'bad'],
  ['Śarva (Rudra)', 'archer god, later Śiva', 'good', 'Saurva', 'a demon', 'bad'],
  ['Vṛtrahan', '“slayer of Vṛtra” — Indra’s title', 'good', 'Vərəθraγna', 'god of victory in his own right → Bahrām', 'good'],
  ['Mitra', 'god of contract', 'good', 'Miθra', 'god of contract & light', 'good'],
  ['Soma', 'sacred pressed drink, a god', 'good', 'Haoma', 'sacred pressed drink, a yazata', 'good'],
  ['Ṛta', 'cosmic truth & order', 'good', 'Aša', 'truth & order', 'good'],
  ['Yama', 'first mortal, king of the dead', 'good', 'Yima', 'golden-age king', 'good'],
];
export const inversion = {
  title: 'The Great Inversion', kicker: 'India and Iran: one vocabulary, two verdicts', icon: '⇄',
  desc: 'Devas are gods in India and demons in Iran; Ahura is God in Iran while asuras became demons in India. Flip the cards.',
  mount(el) {
    const wrap = h('div', 'ov-scroll');
    wrap.innerHTML = `<p class="small">Vedic Sanskrit and Avestan are so close that whole Avestan lines can be turned into Sanskrit by sound-rules. Yet the two traditions sorted the same divine names into opposite camps. <span class="muted">The fact is solid; the cause (a “religious schism”, Zarathustra’s reform, or slow drift) is debated.</span></p>
      ${stripHTML(['rigveda', 'avesta-ms-j2', 'indra-airavata-mathura', 'faravahar-persepolis', 'yazd-atash-behram', 'mithra-taq-e-bostan'].flatMap(k => byKeyOrTopic(k).slice(0, 1)), { size: 's', cap: false })}
      <div class="inv-head"><span>Vedic India</span><button class="act" id="invFlip">⇄ Cross the Hindu Kush</button><span>Avestan Iran</span></div><div class="inv-grid"></div>`;
    const grid = wrap.querySelector('.inv-grid');
    INV.forEach((r, i) => {
      const row = h('div', 'inv-row');
      row.innerHTML = `<div class="inv-card ${r[2]}"><b>${r[0]}</b><span>${r[1]}</span></div><div class="inv-arrow">→</div>
        <div class="inv-flip" style="transition-delay:${i * 0.12}s"><div class="inv-face front"><b>?</b></div><div class="inv-face back ${r[5]}"><b>${r[3]}</b><span>${r[4]}</span></div></div>`;
      grid.appendChild(row);
    });
    el.appendChild(wrap);
    const btn = wrap.querySelector('#invFlip');
    btn.onclick = () => wrap.classList.toggle('flipped');
    setTimeout(() => wrap.classList.add('flipped'), 900);
    return {};
  },
};

// ------------------------------------------------------------------ tiṇai
const TINAI = [
  { k: 'kurinji', img: ['murugan-thanjavur', 's-palani'], n: 'Kuṟiñci', land: 'Mountains', flower: 'Kuṟiñci (blooms once in 12 years)', time: 'Cold season · midnight', people: 'Hunters, honey-gatherers, millet growers', love: 'Lovers’ union',
    god: 'Cēyōṉ / Murukaṉ', godT: '“The red one”, spear-bearing god of the hills, worshipped in frenzied veṟiyāṭṭu possession dances.', later: 'Skanda–Kārttikeya, son of Śiva', conf: 'strong', sky: ['#20314a', '#5a4a6a'], land2: '#3b4b3a' },
  { k: 'mullai', img: ['krishna-chola-honolulu', 'krishna-thanjavur'], n: 'Mullai', land: 'Forest & pasture', flower: 'Mullai (jasmine)', time: 'Rainy season · evening', people: 'Herders (Āyar)', love: 'Patient waiting',
    god: 'Māyōṉ / Māl', godT: '“The dark one”, a cowherd god who dances the kuravai with Nappiṉṉai.', later: 'Kṛṣṇa–Viṣṇu (Tirumāl)', conf: 'strong', sky: ['#1d2b3c', '#3c5560'], land2: '#2f4a32' },
  { k: 'marutam', img: ['indra-airavata-mathura', 'indra-edinburgh'], n: 'Marutam', land: 'Riverine farmland', flower: 'Marutam (Terminalia arjuna)', time: 'All seasons · dawn', people: 'Farmers (Uḻavar)', love: 'Sulking, infidelity',
    god: 'Vēntaṉ', godT: '“The king” — of the gods, or perhaps a deified king.', later: 'Indra (Indra festival at Pukār)', conf: 'moderate', sky: ['#2b3f52', '#c29a63'], land2: '#4a5a2c' },
  { k: 'neytal', img: ['varuna-bhojeshwar', 'varuna-lacma'], n: 'Neytal', land: 'Seashore', flower: 'Neytal (blue water-lily)', time: 'All seasons · sunset', people: 'Fishers, salt-makers (Paratavar)', love: 'Anxious pining',
    god: 'Varuṇaṉ / Kaṭalōṉ', godT: 'Lord of the sea.', later: 'Varuṇa — already a sea god in later Hindu texts', conf: 'moderate', sky: ['#3a2840', '#d0805a'], land2: '#2a4c66' },
  { k: 'palai', img: ['mahishasuramardini-mamallapuram', 'mahishasuramardini-2'], n: 'Pālai', land: 'Parched, drought-struck land', flower: 'Pālai (Wrightia tinctoria)', time: 'Summer · midday', people: 'Raiders and travellers (Maṟavar, Eyiṉar)', love: 'Separation',
    god: 'Koṟṟavai', godT: 'Goddess of war and victory, riding a stag, given blood offerings.', later: 'Durgā, slayer of the buffalo-demon', conf: 'moderate', sky: ['#5a3a20', '#e0a050'], land2: '#7a5a34' },
];
function scene(t) {
  const [s0, s1] = t.sky, L = t.land2;
  const shapes = {
    kurinji: `<path d="M0 120 L45 50 L80 95 L120 30 L170 100 L210 60 L240 120Z" fill="${L}"/><path d="M120 30 L132 48 L108 48Z" fill="#e8e0d0" opacity=".7"/>`,
    mullai: `<rect y="95" width="240" height="25" fill="${L}"/>${[20, 50, 85, 160, 195, 225].map((x, i) => `<g transform="translate(${x},${70 + (i % 2) * 8})"><rect x="-2" y="10" width="4" height="25" fill="#3a2a1a"/><circle r="${13 + (i % 3) * 3}" cy="4" fill="#355a36"/></g>`).join('')}<g class="rain">${Array.from({ length: 14 }, (_, i) => `<line x1="${i * 18}" y1="0" x2="${i * 18 - 6}" y2="16" stroke="#9fc4e0" opacity=".5"/>`).join('')}</g>`,
    marutam: `<rect y="78" width="240" height="42" fill="${L}"/>${Array.from({ length: 8 }, (_, i) => `<path d="M${i * 32} 120 L${i * 32 + 14} 80" stroke="#8aa04a" stroke-width="2" opacity=".6"/>`).join('')}<path d="M0 95 Q120 85 240 100" stroke="#5aa0d0" stroke-width="5" fill="none" opacity=".8"/><circle cx="190" cy="40" r="14" fill="#f6d58e" opacity=".85"/>`,
    neytal: `<rect y="80" width="240" height="40" fill="${L}"/><g class="waves"><path d="M0 86 Q15 80 30 86 T60 86 T90 86 T120 86 T150 86 T180 86 T210 86 T240 86" stroke="#9fd4f0" fill="none" opacity=".7"/></g><circle cx="120" cy="80" r="20" fill="#f0a060" opacity=".85"/><path d="M150 78 L175 78 L170 84 L155 84Z" fill="#2a1a10"/><line x1="162" y1="78" x2="162" y2="60" stroke="#2a1a10"/>`,
    palai: `<rect y="90" width="240" height="30" fill="${L}"/><path d="M30 90 L36 60 L42 90" fill="#4a3018"/><path d="M180 90 C182 70 186 60 196 55 M186 70 L176 62" stroke="#4a3018" stroke-width="3" fill="none"/><circle cx="120" cy="30" r="18" fill="#ffe4a0"/>`,
  };
  return `<svg viewBox="0 0 240 120" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="g-${t.k}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${s0}"/><stop offset="1" stop-color="${s1}"/></linearGradient></defs><rect width="240" height="120" fill="url(#g-${t.k})"/>${shapes[t.k]}</svg>`;
}
export const tinai = {
  title: 'The five landscapes (tiṇai)', kicker: 'Tamil Sangam world', icon: '⛰',
  desc: 'Classical Tamil poetry mapped love, land and gods together. See each landscape’s god — and the Sanskritic god it later merged with.',
  mount(el, api, arg) {
    const wrap = h('div', 'ov-scroll');
    wrap.innerHTML = `<p class="small">The <i>Tolkāppiyam</i> and the Sangam anthologies (core c. 1st–3rd c. CE; dates debated) assign every love poem a landscape, a season, a flower — and a god. Four gods are named in the grammar itself; Koṟṟavai is linked to the dry land in commentary and in the <i>Cilappatikāram</i>. Click a landscape.</p>`;
    const row = h('div', 'tinai-row'); wrap.appendChild(row);
    const detail = h('div', 'tinai-detail'); wrap.appendChild(detail);
    el.appendChild(wrap);
    function pick(k) {
      const t = TINAI.find(x => x.k === k);
      [...row.children].forEach(c => c.classList.toggle('on', c.dataset.k === k));
      detail.innerHTML = `<div class="td-grid"><div><h3>${t.n} — ${t.land}</h3>
        <dl><dt>Flower</dt><dd>${t.flower}</dd><dt>Time</dt><dd>${t.time}</dd><dt>People</dt><dd>${t.people}</dd><dt>Mood of love</dt><dd>${t.love}</dd></dl></div>
        <div class="merge"><div class="m-a"><small>Tamil god</small><b>${t.god}</b><span>${t.godT}</span></div><div class="m-arrow"><i></i><em>merges with</em></div><div class="m-b"><small>Sanskritic identification</small><b>${t.later}</b><span class="chip ${t.conf}">${t.conf}</span></div></div></div>${stripHTML(t.img.flatMap(k => byKeyOrTopic(k).slice(0, 1)), { size: 'l', cap: false })}`;
      detail.classList.remove('enter'); void detail.offsetWidth; detail.classList.add('enter');
    }
    TINAI.forEach(t => {
      const c = h('button', 'tinai-card', `${scene(t)}<div class="tc-l"><b>${t.n}</b><span>${t.land}</span></div>`);
      c.dataset.k = t.k; c.onclick = () => pick(t.k); row.appendChild(c);
    });
    pick(arg || 'kurinji');
    api.flyTo({ lon: 78.2, lat: 10.6, zoom: 9 }, 2000);
    return { setArg: a => pick(a || 'kurinji') };
  },
};

// ------------------------------------------------------------------ claims check
const CLAIMS = [
  { c: 'The AASI arrived ~60,000 years ago and make up ~40% of South Asian DNA; Munda groups are ~75% AASI.', v: 'Oversimplified', k: 'debated',
    e: 'Genetic split from Africans is ≥ ~54,000 years; settlement most likely ~50–45,000 years ago. ~40% on average is plausible (individual range 19–69%). Munda groups carry ~22–25% Southeast Asian ancestry, so ~50–60% AASI is more realistic.', s: 'Kerdoncuff 2025 Cell; Narasimhan 2019 Science; Tätte 2019' },
  { c: 'Around 10,000 years ago Zagros hunter-gatherers or farmers migrated in and mixed with AASI to form the Indus population.', v: 'Partly wrong', k: 'fringe',
    e: 'The Iranian-related lineage split from Zagros groups >12,000 years ago — before farming — and the Rakhigarhi genome has no Zagros-farmer ancestry. Its mixing with AASI is dated ~5400–3700 BCE, not 10,000 years ago. A Central-Asian (Sarazm-like) source fits modern Indians best.', s: 'Shinde 2019 Cell; Narasimhan 2019; Kerdoncuff 2025' },
  { c: 'Indo-Aryans arrived 3,500–4,000 years ago from the steppe via Central Asia — a migration, not an invasion.', v: 'Supported', k: 'strong',
    e: 'Steppe ancestry reaches Central Asia by ~2100 BCE; Swat admixture is dated ~1900–1500 BCE; nationwide 2000–900 BCE. No archaeological sign of a single violent conquest; the Indus cities had already declined.', s: 'Narasimhan 2019; Kerdoncuff 2025' },
  { c: 'ANI = Zagros + steppe; ASI = Zagros + AASI; Indus people were the ancestors of the ASI.', v: 'Oversimplified', k: 'debated',
    e: 'Both ANI (≥70% Indus-cline) and ASI (≥55% Indus-cline) descend largely from Indus-related people. The Indus population was ancestral to North and South alike.', s: 'Narasimhan 2019' },
  { c: 'Light skin came mostly with Iranian-related ancestry, not steppe; it didn’t exist in most of South Asia before the Indus collapse.', v: 'Speculative / inconsistent', k: 'fringe',
    e: 'The main light-skin allele (SLC24A5) is shared with Europeans, ~22–28,000 years old, and under selection in the north-west but not the south. Pigmentation is polygenic. If it came with Iranian-related ancestry it was present long before the collapse — the claim contradicts itself.', s: 'Basu Mallick 2013 PLoS Genetics' },
  { c: 'Strict caste endogamy began ~2,500 years ago, around the Gupta Empire.', v: 'Wrong date', k: 'fringe',
    e: 'The Gupta Empire (c. 320–550 CE) was ~1,600 years ago. Genetics puts the end of widespread mixing at ~1,900 years ago and upper-caste endogamy at ~1,575 years ago — so “Gupta era” fits, “2,500 years” does not.', s: 'Moorjani 2013 AJHG; Basu 2016 PNAS' },
  { c: 'Varṇa in the Rigveda was horizontal and not hereditary.', v: 'Oversimplified', k: 'debated',
    e: 'The four-varṇa scheme appears only in the late Puruṣa Sūkta (RV 10.90); early Rigvedic society was more fluid. But hereditary priestly lineages (Vasiṣṭha, Viśvāmitra) already exist in the oldest books.', s: 'Jamison & Brereton 2014' },
  { c: 'Brahmins in many regions have more steppe ancestry than their neighbours; Dalit groups more AASI.', v: 'Supported', k: 'strong',
    e: 'Brahmin, Pandit and Bhumihar groups are the strongest outliers (5 of the 6 most extreme of 140 groups). Caste-rank correlates with ANI share — with exceptions and large regional variation.', s: 'Narasimhan 2019; Reich 2009; Moorjani 2013' },
  { c: 'The Kalash are about half steppe; Pashtuns have up to 20% Anatolian farmer ancestry via BMAC.', v: 'Overstated / unsupported', k: 'fringe',
    e: 'Kalash models give ~25–40% steppe. Narasimhan 2019 finds the BMAC was not a major source for South Asians, and models fit without an Anatolian term.', s: 'Narasimhan 2019' },
  { c: 'North India has higher skin-cancer rates than South India.', v: 'Oversimplified', k: 'debated',
    e: 'Melanoma is highest in the north, non-melanoma highest in the north-east/east; all Indian rates are very low globally.', s: 'ICMR cancer registry analyses (2012–14 data)' },
  { c: 'The Delhi Sultanate and then the British intensified colourism and casteism.', v: 'British: supported · Sultanate: speculative', k: 'moderate',
    e: 'Colonial censuses from 1871 — especially Risley’s 1901 caste ranking using nose measurements — codified and hardened caste. For the Sultanate there is opinion, but no quantitative evidence.', s: 'Dirks, Castes of Mind (2001)' },
  { c: '“Aryan” and “Dravidian” are races.', v: 'Wrong', k: 'fringe',
    e: 'Both are language-family labels. Every major South Asian group mixes the same ancient sources in different proportions; Tamil Brahmins speak Dravidian with more steppe ancestry, Brahui speak Dravidian with Baloch ancestry, Sinhalese speak Indo-Aryan with South-Indian-like ancestry.', s: 'All of the above' },
];
export const claims = {
  title: 'What the videos got right', kicker: 'Claim check', icon: '✓',
  desc: 'Every major claim in the four YouTube videos, rated against the primary research.',
  mount(el) {
    const wrap = h('div', 'ov-scroll');
    wrap.innerHTML = `<p class="small muted">Click a card to see the evidence. Ratings use the primary papers, not the videos’ summaries.</p>`;
    const grid = h('div', 'claims-grid'); wrap.appendChild(grid); el.appendChild(wrap);
    CLAIMS.forEach((c, i) => {
      const card = h('button', 'claim', `<div class="cl-front"><span class="chip ${c.k}">${c.v}</span><p>“${c.c}”</p><small>tap for evidence →</small></div><div class="cl-back"><span class="chip ${c.k}">${c.v}</span><p>${c.e}</p><small>${c.s}</small></div>`);
      card.style.animationDelay = (i * 0.06) + 's';
      card.onclick = () => card.classList.toggle('open');
      grid.appendChild(card);
    });
    return {};
  },
};
