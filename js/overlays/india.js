// "India today" dashboard and the "Lineages" explorer (Brahmin and other community lines).
// Sources: Census of India 2011; Anthropological Survey of India (People of India); Bihar caste survey 2023;
// Reich 2009, Moorjani 2013, Nakatsuka 2017, Narasimhan 2019, Kerdoncuff 2025; Witzel; Veluthat; Deshpande 2010.
import { byKey, byKeyOrTopic, sized, stripHTML } from '../media.js';
const STEP_IMG = {
  'Kurukshetra': 's-kuru', 'Hastinapura': 's-hastina', 'Mithila (Videha)': 's-janak', 'Kannauj (Madhyadeśa)': 'l-kannauj', 'Kannauj': 'l-kannauj', 'Sangam Madurai': 's-madurai',
  'Talagunda (Kadamba)': 'l-talagunda', 'Kanchi (Pallava grants)': 'l-kanchi', 'Karandai plates (Chola)': 's-thanjavur', 'Srirangam → Iyengars': 's-srirangam',
  'Agastya crosses the Vindhyas': 'agastya-bihar', 'Pothigai hill': 'agastya-kerala', 'Udupi': 's-udupi', 'Mahodayapuram (Chera)': 'l-kerala-plates', 'Payyannur': 'l-payyannur',
  'Pune — Peshwas': 'l-shaniwar', 'Vadnagar (Nāgar)': 'l-vadnagar', 'Mount Abu — Agnikula': 'l-abu', 'Agroha (Agarwal)': 'l-agroha', 'Shekhawati → Calcutta (Marwaris)': 'l-shekhawati',
  'Chettinad → Rangoon, Penang, Saigon': 'l-chettinad', 'Bhima-Koregaon & Mahad': 'l-koregaon', 'Ayyankali’s cart march': 'l-ayyankali', 'Deekshabhoomi, Nagpur': 'l-deeksha',
  'Toda (Nilgiris)': 'l-toda', 'Gond': 'l-gond', 'Bhil': 'l-pithora', 'Santal & Munda': 'l-sohrai', 'Naga, Mizo, Bodo…': 'l-hornbill', 'Onge & Jarawa (Andaman)': 's-andaman',
  'Iran → Parsis': 'yazd-atash-behram', 'Jafarabad / Janjira': 'l-janjira', 'East Africa → Siddis': 'l-malikambar', 'Bene Israel (Konkan)': 'l-benei', 'Cochin Jews': 'l-jewplates',
  'Tibetans (Dharamsala)': 'l-dharamsala', 'Orakandi (Matua)': 'l-matua', 'Faxian’s account': 's-patali', 'Cochin': 'l-paradesi', 'Kashmir': 's-kalash', 'Chittorgarh': 'l-chittor',
};
const stepImg = st => { const k = STEP_IMG[st.n]; return k ? byKeyOrTopic(k)[0] || null : null; };
const h = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
const nf = new Intl.NumberFormat('en-US');

function counter(el, to, ms = 1600, dec = 0) {
  const t0 = performance.now();
  const step = now => { const k = Math.min(1, (now - t0) / ms); const e = 1 - Math.pow(1 - k, 3); el.textContent = dec ? (to * e).toFixed(dec) : nf.format(Math.round(to * e)); if (k < 1) requestAnimationFrame(step); };
  requestAnimationFrame(step);
  // also settle when rAF is paused (hidden pane)
  setTimeout(() => { el.textContent = dec ? to.toFixed(dec) : nf.format(to); }, ms + 400);
}

const RELIGION = [['Hindu', 79.8, '#ffcf6e', '966.3M'], ['Muslim', 14.23, '#9fe0a8', '172.2M'], ['Christian', 2.3, '#f2f0e6', '27.8M'], ['Sikh', 1.72, '#ffb347', '20.8M'], ['Buddhist', 0.7, '#c9a3ff', '8.4M'], ['Jain', 0.37, '#e8e0a0', '4.5M'], ['Other incl. Sarna & tribal', 0.66, '#d98a6b', '7.9M'], ['Not stated', 0.24, '#666', '2.9M']];
const FAMILIES = [['Indo-Aryan (Indo-European)', 78.05, '#7d97ff'], ['Dravidian', 19.64, '#ff9e5e'], ['Austroasiatic', 1.11, '#8bd36a'], ['Tibeto-Burman', 1.01, '#d98be8'], ['Others & isolates', 0.19, '#9fb7c9']];
const TOPLANG = [['Hindi*', 528.3], ['Bengali', 97.2], ['Marathi', 83.0], ['Telugu', 81.1], ['Tamil', 69.0], ['Gujarati', 55.5], ['Urdu', 50.8], ['Kannada', 43.7], ['Odia', 37.5], ['Malayalam', 34.8]];
const DRAVLANG = new Set(['Telugu', 'Tamil', 'Kannada', 'Malayalam']);
const BIHAR = [['Extremely Backward Classes', 36.01, '#e0884a'], ['Backward Classes (OBC)', 27.13, '#f0b070'], ['Scheduled Castes', 19.65, '#d97070'], ['Unreserved (“general”)', 15.52, '#7d97ff'], ['Scheduled Tribes', 1.68, '#8bd36a']];

export const india = {
  title: 'India today', kicker: 'The present the journey explains', icon: '🇮🇳',
  desc: '1.4 billion people, 4,635 communities, 19,569 mother tongues, six language families, every major faith — in numbers.',
  mount(el) {
    const wrap = h('div', 'ov-scroll india');
    wrap.innerHTML = `
      <div class="big-stats">
        <div class="bs"><b data-n="4635">0</b><span>communities identified by the People of India survey (1985–92)</span></div>
        <div class="bs"><b data-n="19569">0</b><span>raw mother-tongue names in Census 2011 → 1,369 mother tongues → <b>121</b> languages with ≥10,000 speakers</span></div>
        <div class="bs"><b data-n="705">0</b><span>Scheduled Tribes (8.6% of India) — and <b>1,241</b> Scheduled Castes (16.6%)</span></div>
        <div class="bs"><b data-n="81">0</b><span>of 263 groups studied have founder events stronger than Finns or Ashkenazi Jews (Nakatsuka 2017)</span></div>
      </div>
      <div class="ind-grid">
        <section><h4>Language families (share of speakers, 2011)</h4><div class="stack" id="famStack"></div><div class="legend-inline" id="famLeg"></div>
          <p class="small muted">One family arrived ~3,500 years ago from Central Asia; one probably grew up within South Asia ~4,500 years ago; two arrived from the east. Plus isolates: Nihali (~2,000 speakers), the Andamanese families.</p></section>
        <section><h4>Largest mother tongues (millions, 2011)</h4><div id="langBars" class="hbars"></div><p class="small muted">*“Hindi” groups ~56 varieties incl. Bhojpuri (~50M) and Rajasthani — a contested grouping. <span class="k-drav">■</span> Dravidian <span class="k-ie">■</span> Indo-Aryan</p></section>
        <section><h4>Religion (Census 2011, 1.21 bn)</h4><div class="donut-wrap"><svg id="relDonut" viewBox="0 0 200 200"></svg><div id="relLeg" class="legend-inline col"></div></div></section>
        <section><h4>Caste — the only fresh count: Bihar 2023</h4><div class="stack" id="biharStack"></div><div class="legend-inline col" id="biharLeg"></div>
          <p class="small muted">13.07 crore people; largest single caste Yadav (14.27%); Brahmin ~3.7%. India’s last full national caste count was 1931 — <b>Census 2027</b> (enumeration Feb 2027) will be the first since.</p></section>
        <section class="wide"><h4>What the genomes say about India today</h4>
          <ul class="facts">
            <li><b>Three ancient layers in almost everyone:</b> AASI (19–69%), Iranian-related (27–68%), steppe (0–45%) — plus East/Southeast-Asian-related ancestry in the east and north-east. <span class="muted">Kerdoncuff 2025, 2,762 genomes</span></li>
            <li><b>A gradient, not races:</b> steppe ancestry peaks in the north-west and in priestly groups; AASI peaks in the south and among tribal groups; East Asian ancestry in the north-east. <span class="muted">Reich 2009; Narasimhan 2019</span></li>
            <li><b>Mixed, then frozen:</b> groups mixed freely ~4,200–1,900 years ago, then stopped — endogamy has kept thousands of groups genetically distinct for ~2,000 years. <span class="muted">Moorjani 2013</span></li>
            <li><b>A health consequence:</b> Indian homozygosity is 2–9× European or East Asian levels, ~90% due to founder events and endogamy; e.g. the Vysya (~3.2M) carry ~100× the rate of a dangerous anaesthetic reaction. <span class="muted">Nakatsuka 2017; Kerdoncuff 2025</span></li>
            <li><b>Archaic cousins:</b> ~2% Neanderthal + Denisovan DNA, with India showing the most variable Neanderthal ancestry of any population studied. <span class="muted">Kerdoncuff 2025</span></li>
          </ul></section>
      </div>`;
    const mosaic = ['l-mithila', 'l-gond', 'l-pithora', 'l-sohrai', 'l-hornbill', 'l-toda', 's-kannur', 's-varanasi', 's-madurai', 's-amritsar', 'l-paradesi', 'l-bylakuppe'].map(k => byKeyOrTopic(k)[0]).filter(Boolean);
    wrap.insertAdjacentHTML('afterbegin', stripHTML(mosaic, { size: 'm', cap: false }));
    el.appendChild(wrap);
    wrap.querySelectorAll('[data-n]').forEach(b => counter(b, +b.dataset.n));
    const stack = (id, legId, data) => {
      const s = wrap.querySelector(id), lg = wrap.querySelector(legId);
      data.forEach(([n, v, c], i) => {
        const seg = h('i'); seg.style.background = c; seg.style.width = '0%'; seg.title = `${n}: ${v}%`; s.appendChild(seg);
        setTimeout(() => { seg.style.width = v + '%'; }, 100 + i * 120);
        lg.appendChild(h('span', '', `<i style="background:${c}"></i>${n} <b>${v}%</b>`));
      });
    };
    stack('#famStack', '#famLeg', FAMILIES);
    stack('#biharStack', '#biharLeg', BIHAR);
    const lb = wrap.querySelector('#langBars');
    TOPLANG.forEach(([n, v], i) => {
      const r = h('div', 'hb', `<span>${n}</span><div><i style="background:${DRAVLANG.has(n) ? '#ff9e5e' : '#7d97ff'}"></i></div><b>${v}</b>`);
      lb.appendChild(r); setTimeout(() => { r.querySelector('i').style.width = (v / 528.3 * 100) + '%'; }, 200 + i * 80);
    });
    // donut
    const svg = wrap.querySelector('#relDonut'); let a0 = -Math.PI / 2; const R = 80, r = 50;
    RELIGION.forEach(([n, v, c, m], i) => {
      const a1 = a0 + v / 100 * Math.PI * 2;
      const large = a1 - a0 > Math.PI ? 1 : 0;
      const p = (a, rr) => [100 + Math.cos(a) * rr, 100 + Math.sin(a) * rr];
      const [x0, y0] = p(a0, R), [x1, y1] = p(a1, R), [x2, y2] = p(a1, r), [x3, y3] = p(a0, r);
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', `M${x0},${y0} A${R},${R} 0 ${large} 1 ${x1},${y1} L${x2},${y2} A${r},${r} 0 ${large} 0 ${x3},${y3}Z`);
      path.setAttribute('fill', c); path.style.opacity = 0; path.style.transition = `opacity .5s ${i * 0.12}s`;
      path.innerHTML = `<title>${n}: ${v}% (${m})</title>`;
      svg.appendChild(path); setTimeout(() => { path.style.opacity = 1; }, 30);
      a0 = a1;
      wrap.querySelector('#relLeg').appendChild(h('span', '', `<i style="background:${c}"></i>${n} <b>${v}%</b> <em>${m}</em>`));
    });
    return {};
  },
};

// ------------------------------------------------------------------ lineages
// type: H = documentary/epigraphic history, T = community tradition/legend, G = genetic finding
export const LINES = [
  { id: 'vedic', group: 'Brahmin lines', n: 'Vedic core → east', color: '#ffcf6e', cam: { lon: 81, lat: 27.5, zoom: 4.2 },
    intro: 'Priestly families organised the hymns in the Kuru state and carried the sacred fire east with later Vedic culture. Each family belongs to a gotra (traditionally descended from seven or eight ṛṣis — Vasiṣṭha, Viśvāmitra, Gautama, Bharadvāja, Atri, Jamadagni, Kaśyapa, + Agastya) and a Vedic school (śākhā).',
    steps: [
      { at: [76.85, 29.97], n: 'Kurukshetra', d: 'c. 1200 BCE', t: 'H', x: 'Kuru core; Saṃhitās collected (Witzel).' },
      { at: [78.01, 29.16], n: 'Hastinapura', d: 'c. 1100 BCE', t: 'H', x: 'Painted Grey Ware Kuru town.' },
      { at: [79.13, 28.37], n: 'Ahichchhatra (Pañcāla)', d: 'c. 1000–800 BCE', t: 'H', x: 'Pañcāla — later remembered as a source of Brahmins for the south (Kadamba tradition).' },
      { at: [84.9, 26.2], n: 'Crossing the Sadānīrā', d: 'c. 800–600 BCE', t: 'T', x: 'Śatapatha Brāhmaṇa: Videgha Māthava carries Agni east across the Gandak.' },
      { at: [85.92, 26.73], n: 'Mithila (Videha)', d: 'c. 700 BCE →', t: 'H', x: 'Origin of the Maithil Brahmins; genealogical registers (panjī) codified c. 14th c.' },
    ] },
  { id: 'bengal', group: 'Brahmin lines', n: 'Into Bengal', color: '#ffd98e', cam: { lon: 87, lat: 25, zoom: 4.4 },
    intro: 'Copper-plate land grants show Brahmins being settled in Bengal and Assam from the 5th century — some explicitly “from Madhyadeśa” (the Ganga heartland). The famous story of five Brahmins from Kannauj is a later legend.',
    steps: [
      { at: [79.92, 27.05], n: 'Kannauj (Madhyadeśa)', d: '', t: 'T', x: 'Legend: King Ādiśūra invites five Kānyakubja Brahmins. No such king is attested in inscriptions; the story is in 15th–18th c. genealogies.' },
      { at: [89.0, 24.6], n: 'Dhanaidaha plate', d: '433 CE', t: 'H', x: 'Earliest Brahmin land grant in Bengal.' },
      { at: [89.8, 23.6], n: 'Faridpur plates', d: '6th c.', t: 'H', x: 'A Vājasaneyi Bharadvāja grantee.' },
      { at: [91.8, 24.6], n: 'Nidhanpur (Kāmarūpa)', d: '7th c.', t: 'H', x: 'Bhāskaravarman settles 200+ Brahmins of many gotras and Vedas.' },
      { at: [88.3, 23.4], n: 'Rāḍhi & Vārendra; Kulinism', d: '12th c. → later', t: 'T', x: 'Kulin hierarchy attributed to Ballāla Sena (c. 1160–79), probably crystallised later.' },
    ] },
  { id: 'south', group: 'Brahmin lines', n: 'South: Tamil country & Karnataka', color: '#ffb36e', cam: { lon: 78, lat: 13.5, zoom: 4.6 },
    intro: 'Brahmins (antaṇar, pārppār) already appear in Sangam poems. From the 4th century, Pallava, Pandya and Chola kings granted whole villages (brahmadeya, caturvedimaṅgalam) to Brahmins — land grants that pulled priestly families south and anchored Sanskrit learning in Tamil country.',
    steps: [
      { at: [77.0, 22.5], n: 'Agastya crosses the Vindhyas', d: 'myth', t: 'T', x: 'Culture-hero of Tamil grammar, settling on Pothigai hill.' },
      { at: [77.25, 8.6], n: 'Pothigai hill', d: 'myth', t: 'T', x: '' },
      { at: [78.12, 9.93], n: 'Sangam Madurai', d: 'c. 1st–4th c. CE', t: 'H', x: 'Poems mention Brahmins performing sacrifices.' },
      { at: [75.25, 14.42], n: 'Talagunda (Kadamba)', d: 'c. 455 CE', t: 'H', x: 'Founder Mayūraśarman is a Brahmin who studied at Kanchi.' },
      { at: [79.7, 12.83], n: 'Kanchi (Pallava grants)', d: '4th–8th c.', t: 'H', x: 'Kūram and Kāśākuḍi plates; agrahāras spread across Tondaimandalam.' },
      { at: [79.75, 12.62], n: 'Uttaramerur', d: '919–921 CE', t: 'H', x: 'Rules for electing a Brahmin village assembly — carved in stone.' },
      { at: [79.13, 10.78], n: 'Karandai plates (Chola)', d: 'c. 1020 CE', t: 'H', x: 'A single grant to 1,080 Brahmins.' },
      { at: [78.69, 10.86], n: 'Srirangam → Iyengars', d: '11th–15th c.', t: 'H', x: 'Śrīvaiṣṇavas following Rāmānuja; later Vaḍakalai/Tenkalai split. Iyers are Smārtas linked to Śṛṅgeri and Kanchi.' },
    ] },
  { id: 'kerala', group: 'Brahmin lines', n: 'Kerala: Nambudiris & Tulu Nadu', color: '#ffc58e', cam: { lon: 75.8, lat: 11.5, zoom: 6 },
    intro: 'Tradition says Paraśurāma raised Kerala from the sea and settled 64 Brahmin villages (32 Tulu, 32 Malayali). Inscriptions confirm Brahmin settlements from the 9th century under the Cheras of Mahodayapuram.',
    steps: [
      { at: [74.75, 13.34], n: 'Udupi', d: '13th c.', t: 'H', x: 'Shivalli Brahmins; Madhva (1238–1317) and his eight maṭhas.' },
      { at: [75.2, 12.1], n: 'Payyannur', d: '9th c. →', t: 'H', x: 'Northernmost of the 32 grāmas.' },
      { at: [75.36, 12.04], n: 'Taliparamba', d: '', t: 'H', x: '' },
      { at: [75.97, 10.76], n: 'Sukapuram', d: '', t: 'H', x: '' },
      { at: [76.2, 10.22], n: 'Mahodayapuram (Chera)', d: '9th c.', t: 'H', x: 'Firm epigraphic evidence of Brahmin villages begins here.' },
      { at: [76.57, 9.38], n: 'Tiruvalla', d: '', t: 'H', x: '' },
    ] },
  { id: 'saraswat', group: 'Brahmin lines', n: 'Saraswats: river → Kashmir → Konkan', color: '#e8e08e', cam: { lon: 75, lat: 22, zoom: 3 },
    intro: 'Saraswats take their name from the Sarasvatī river. One branch is the Kashmiri Pandits; another, in tradition, was brought by Paraśurāma to Goa; the Portuguese Inquisition (from the 1560s) then scattered Goan Saraswats down the coast to Kerala.',
    steps: [
      { at: [75.0, 29.5], n: 'Sarasvatī–Ghaggar', d: 'origin', t: 'T', x: '' },
      { at: [74.8, 34.08], n: 'Kashmir', d: 'attested by Kalhaṇa, 1148', t: 'H', x: 'Kashmiri Pandits; 1990 exodus of ~100,000–150,000 to Jammu and Delhi.' },
      { at: [74.0, 15.4], n: 'Goa (Gauḍa Sārasvata)', d: 'Sahyādrikhaṇḍa', t: 'T', x: '96 families brought from “Trihotra”.' },
      { at: [74.88, 12.87], n: 'Mangalore', d: '1560s →', t: 'H', x: 'Flight from the Inquisition and temple destruction.' },
      { at: [74.53, 14.03], n: 'Shirali (Chitrapur math)', d: '1708', t: 'H', x: 'Chitrapur Saraswats.' },
      { at: [76.27, 9.97], n: 'Cochin', d: '16th–17th c.', t: 'H', x: 'Konkani GSB community of Kerala.' },
    ] },
  { id: 'deccan', group: 'Brahmin lines', n: 'Maharashtra & Gujarat', color: '#f0d0a0', cam: { lon: 74, lat: 19.5, zoom: 5 },
    intro: 'Deśasthas are the old Brahmins of the Deccan plateau. Chitpāvans have a shipwreck origin legend and rose to power only with the Peshwas from 1713. Claims of a “foreign” origin for Chitpāvans or Nāgars are unsupported.',
    steps: [
      { at: [75.33, 17.68], n: 'Pandharpur (Deśastha)', d: '', t: 'H', x: 'Old Deccan Brahmin heartland.' },
      { at: [73.52, 17.53], n: 'Chiplun (Chitpāvan)', d: 'legend', t: 'T', x: 'Paraśurāma revives shipwrecked bodies on a pyre.' },
      { at: [73.86, 18.52], n: 'Pune — Peshwas', d: '1713 →', t: 'H', x: 'Chitpāvan Peshwas rule the Maratha state.' },
      { at: [72.64, 23.78], n: 'Vadnagar (Nāgar)', d: '', t: 'T', x: 'Patron deity Hāṭakeśvara.' },
    ] },
  { id: 'rajput', group: 'Other lines', n: 'Rajputs, Jats & Gujjars', color: '#ff8f8f', cam: { lon: 74, lat: 26.5, zoom: 4.2 },
    intro: 'Rajput clans emerged between the 7th and 10th centuries from diverse lineages, through “Rajputisation” — gaining land, power and Kshatriya status. The Agnikula fire-birth legend is medieval; the 19th-century “Hun origin” theory has weak support.',
    steps: [
      { at: [72.71, 24.59], n: 'Mount Abu — Agnikula', d: 'c. 1000 / 16th c. text', t: 'T', x: 'Four clans born from a sacrificial fire.' },
      { at: [75.78, 23.18], n: 'Ujjain — Gurjara-Pratihāras', d: '8th c.', t: 'H', x: 'Nāgabhaṭa I.' },
      { at: [79.92, 27.05], n: 'Kannauj', d: '836–885', t: 'H', x: 'Mihira Bhoja’s imperial capital.' },
      { at: [68.4, 25.4], n: 'Sindh — Jats', d: '7th–8th c.', t: 'H', x: '“Jatt/Zutt” pastoralists in Arab sources.' },
      { at: [76.0, 29.0], n: 'Punjab & Haryana', d: '11th–17th c.', t: 'H', x: 'Jats move north-east; many become Sikh.' },
    ] },
  { id: 'peasant', group: 'Other lines', n: 'Land & merchants', color: '#8bd3c0', cam: { lon: 78, lat: 19, zoom: 2.8 },
    intro: 'The great agrarian and trading communities of today mostly crystallised in the medieval period — from Kakatiya-era Reddys and Kammas to Vellalars of the Kaveri delta and Nairs of Kerala — while merchant networks reached across oceans.',
    steps: [
      { at: [75.62, 29.33], n: 'Agroha (Agarwal)', d: 'legend + mound', t: 'T', x: 'King Agrasena and 18 gotras; excavated early-historic town.' },
      { at: [75.1, 27.6], n: 'Shekhawati → Calcutta (Marwaris)', d: '18th–19th c.', t: 'H', x: '' },
      { at: [88.36, 22.57], n: 'Calcutta', d: '19th c.', t: 'H', x: '' },
      { at: [80.25, 16.25], n: 'Kondavidu (Reddy kingdom)', d: '1325–1448', t: 'H', x: 'Also Kammas of Kammanadu.' },
      { at: [81.74, 16.65], n: 'Penugonda (Komati / Vysya)', d: '', t: 'G', x: 'Founder event >100 generations old — one of the strongest in India.' },
      { at: [79.1, 10.8], n: 'Kaveri delta (Vellalar)', d: 'Sangam–Chola', t: 'H', x: '' },
      { at: [78.78, 10.1], n: 'Chettinad → Rangoon, Penang, Saigon', d: '19th–20th c.', t: 'H', x: 'Nattukottai Chettiar banking networks.' },
    ] },
  { id: 'dalit', group: 'Other lines', n: 'Dalit history & resistance', color: '#d97070', cam: { lon: 79, lat: 18, zoom: 3 },
    intro: 'Untouchability is first visible in texts c. 6th c. BCE (Chāndogya Upaniṣad’s Caṇḍāla), hardens in the Dharmasūtras and Manusmṛti, and is observed by the Chinese pilgrim Faxian c. 400 CE. Modern Dalit movements fought it — and Ambedkar led a mass conversion to Buddhism in 1956.',
    steps: [
      { at: [85.14, 25.61], n: 'Faxian’s account', d: 'c. 400 CE', t: 'H', x: 'Caṇḍālas live apart and strike wood to announce themselves.' },
      { at: [73.4, 18.08], n: 'Bhima-Koregaon & Mahad', d: '1818 · 1927', t: 'H', x: 'Mahar soldiers; Ambedkar’s Mahad water satyagraha.' },
      { at: [76.95, 8.5], n: 'Ayyankali’s cart march', d: '1893', t: 'H', x: 'Pulaya defiance of road bans in Travancore.' },
      { at: [79.1, 12.9], n: 'Iyothee Thass', d: '1890s', t: 'H', x: 'Paraiyar Tamil-Buddhist movement.' },
      { at: [89.9, 23.3], n: 'Orakandi (Matua)', d: '19th c.', t: 'H', x: 'Namaśūdra movement of Harichand Thakur.' },
      { at: [79.07, 21.13], n: 'Deekshabhoomi, Nagpur', d: '14 Oct 1956', t: 'H', x: 'Ambedkar and ~400,000–500,000 people become Buddhist.' },
    ] },
  { id: 'adivasi', group: 'Other lines', n: 'Adivasi peoples', color: '#8bd36a', cam: { lon: 84, lat: 18, zoom: 2.5 },
    intro: '705 Scheduled Tribes (104 million people). Many carry the highest shares of the oldest ancestry in India; others brought Austroasiatic or Tibeto-Burman languages. Their languages span all four families.',
    steps: [
      { at: [92.5, 10.7], n: 'Onge & Jarawa (Andaman)', d: '~50,000 yrs', t: 'G', x: 'Closest living proxies for AASI ancestry; ~100 and ~400 people.' },
      { at: [76.7, 11.4], n: 'Toda (Nilgiris)', d: '', t: 'H', x: '~1,600 people; Dravidian.' },
      { at: [80.5, 21.5], n: 'Gond', d: '', t: 'H', x: '~13M; Dravidian (Gondi).' },
      { at: [74.5, 22.5], n: 'Bhil', d: '', t: 'H', x: '~17M — largest ST; Indo-Aryan (Bhili).' },
      { at: [84.6, 23.4], n: 'Oraon (Kurukh)', d: '', t: 'H', x: '~3.7M; a northern Dravidian language.' },
      { at: [87.2, 24.3], n: 'Santal & Munda', d: '~2000–3800 yrs ago', t: 'G', x: 'Austroasiatic; East Asian paternal lineages (O-M95) + local maternal.' },
      { at: [94.1, 25.6], n: 'Naga, Mizo, Bodo…', d: '', t: 'G', x: 'Tibeto-Burman; mostly East Asian-related ancestry.' },
    ] },
  { id: 'diaspora', group: 'Other lines', n: 'Those who came later', color: '#9fd4ff', cam: { lon: 70, lat: 20, zoom: 2.2 },
    intro: 'India also absorbed later arrivals. Genetics confirms several origin traditions — and dates them.',
    steps: [
      { at: [54.4, 31.9], n: 'Iran → Parsis', d: '8th–10th c.', t: 'G', x: 'Closest to Iranians; mixing with Indians ~1,200 years ago, via Iranian men and Indian women.' },
      { at: [72.8, 20.2], n: 'Sanjan', d: 'Qissa-i Sanjan (1599)', t: 'T', x: 'Landing tradition.' },
      { at: [39.3, -6.8], n: 'East Africa → Siddis', d: '13th–19th c.', t: 'G', x: 'Bantu-related ancestry; admixture ~200 years ago (Shah 2011).' },
      { at: [71.37, 20.87], n: 'Jafarabad / Janjira', d: '', t: 'H', x: 'Siddi states; Malik Ambar of Ahmednagar (1548–1626).' },
      { at: [72.87, 18.65], n: 'Bene Israel (Konkan)', d: 'Jewish admixture ~650–1,050 yrs ago', t: 'G', x: 'Mostly Indian ancestry with Middle-Eastern Jewish admixture.' },
      { at: [76.27, 9.97], n: 'Cochin Jews', d: 'copper plates c. 1000 CE', t: 'H', x: '' },
      { at: [76.32, 32.22], n: 'Tibetans (Dharamsala)', d: '1959 →', t: 'H', x: '~70–90,000 in India; also Bylakuppe.' },
    ] },
];

export function lineBeams(line) {
  return { color: line.color, stagger: 0.45, items: line.steps.map((s, i) => ({ from: i ? line.steps[i - 1].at : s.at, to: s.at, label: s.n, img: stepImg(s), sub: `${s.d ? s.d + ' · ' : ''}${{ H: 'history', T: 'tradition', G: 'genetics' }[s.t]}`, color: s.t === 'T' ? '#c9bfa8' : line.color, weak: s.t === 'T', tip: s.x, lift: 0.6 })) };
}

export const lineages = {
  title: 'Lineages', kicker: 'Brahmin and other lines', icon: '⤳', dock: true,
  desc: 'Follow Brahmin families east, south and down the coast — and the paths of Rajputs, Jats, merchants, Dalit movements, Adivasis, Parsis, Siddis and others.',
  mount(el, api, arg) {
    const wrap = h('div', 'ov-scroll');
    wrap.innerHTML = `<p class="small muted">Solid lines = inscriptions or documents. Dashed grey = community tradition or legend. Genetics marked as such. Hover the cards on the map for details.</p>`;
    const groups = {}; for (const l of LINES) (groups[l.group] ||= []).push(l);
    const pillsWrap = h('div'); wrap.appendChild(pillsWrap);
    for (const [g, ls] of Object.entries(groups)) {
      pillsWrap.appendChild(h('div', 'small muted', g));
      const row = h('div', 'pill-row'); pillsWrap.appendChild(row);
      ls.forEach(l => { const b = h('button', 'pill', l.n); b.dataset.id = l.id; b.onclick = () => pick(l.id); row.appendChild(b); });
    }
    const card = h('div', 'line-card'); wrap.appendChild(card);
    el.appendChild(wrap);
    function pick(id) {
      const l = LINES.find(x => x.id === id);
      pillsWrap.querySelectorAll('.pill').forEach(b => b.classList.toggle('on', b.dataset.id === id));
      const ims = l.steps.map(stepImg).filter(Boolean);
      card.innerHTML = `<p>${l.intro}</p>${stripHTML(ims, { size: 's', cap: false })}<ol class="steps">${l.steps.map(s => `<li><span class="tag t-${s.t}">${{ H: 'history', T: 'tradition', G: 'genetics' }[s.t]}</span><b>${s.n}</b> <em>${s.d}</em>${s.x ? `<div>${s.x}</div>` : ''}</li>`).join('')}</ol>`;
      card.classList.remove('enter'); void card.offsetWidth; card.classList.add('enter');
      api.setBeams(lineBeams(l));
      api.flyTo(l.cam, 1800);
    }
    pick(arg || 'vedic');
    return { setArg: a => pick(a || 'vedic'), unmount: () => api.setBeams(null) };
  },
};
