// Ancestry components and approximate population mixes.
// IMPORTANT: no primary paper publishes a clean %-table for these named groups. Values are midpoints of
// ranges synthesised from the published bounds — Kerdoncuff et al. 2025 (Cell; AASI 19–69%, Iranian-related
// 27–68%, steppe 0–45%), Narasimhan et al. 2019 (Science; ANI ≥70% Indus-cline, ASI ≥55%), Tätte et al. 2019
// (Munda ~22–25% SE-Asian) — and are shown in the app as ranges with a "rough" badge.
export const COMPONENTS = [
  { key: 'aasi', name: 'AASI — first South Asians', short: 'AASI', color: '#e0884a' },
  { key: 'iran', name: 'Iranian-related (Indus cline)', short: 'Iranian-related', color: '#3fc1a5' },
  { key: 'steppe', name: 'Steppe (Indo-Aryan-associated)', short: 'Steppe', color: '#7d97ff' },
  { key: 'east', name: 'East / Southeast Asian-related', short: 'E/SE Asian', color: '#e8609a' },
];

// r: ranges [lo,hi] per component; mix: midpoints (normalised at use). conf: 'rough' | 'moderate'
export const POPS = [
  { id: 'kalash', name: 'Kalash', region: 'Chitral, Pakistan', lon: 71.7, lat: 35.7, lang: 'Indo-Aryan (Dardic)', r: { aasi: [5, 15], iran: [45, 60], steppe: [25, 40], east: [0, 1] }, note: 'Highest “ANI” in the north-west; strong genetic drift in a small isolated population. The video’s “about half steppe” is too high — published models give ~25–40%.' },
  { id: 'pashtun', name: 'Pashtun', region: 'Khyber Pakhtunkhwa / Afghanistan', lon: 70.5, lat: 33.6, lang: 'Iranian', r: { aasi: [5, 15], iran: [50, 65], steppe: [20, 35], east: [0, 3] }, note: 'No primary source supports the video’s “up to 20% Anatolian farmer via BMAC”; three-way models fit without it.' },
  { id: 'baloch', name: 'Baloch & Brahui', region: 'Balochistan', lon: 66, lat: 28.5, lang: 'Iranian / Dravidian (Brahui)', r: { aasi: [5, 15], iran: [60, 75], steppe: [10, 20], east: [0, 3] }, note: 'Brahui are genetically almost identical to their Baloch neighbours — evidence that language and ancestry can part ways.' },
  { id: 'jat', name: 'Punjabi (Jat)', region: 'Punjab', lon: 75.5, lat: 30.3, lang: 'Indo-Aryan', r: { aasi: [15, 25], iran: [45, 55], steppe: [20, 30], east: [0, 1] } },
  { id: 'pandit', name: 'Kashmiri Pandit', region: 'Kashmir', lon: 74.8, lat: 34.1, lang: 'Indo-Aryan (Kashmiri)', r: { aasi: [10, 20], iran: [45, 55], steppe: [25, 35], east: [0, 1] }, caste: 'brahmin', note: 'One of the priestly groups with steppe ancestry above what the regional cline predicts.' },
  { id: 'nepali', name: 'Nepali hill (Khas, Bahun-Chhetri)', region: 'Nepal hills', lon: 84, lat: 28.2, lang: 'Indo-Aryan', r: { aasi: [25, 35], iran: [35, 45], steppe: [15, 25], east: [5, 20] } },
  { id: 'gujarati', name: 'Gujarati', region: 'Gujarat', lon: 72.3, lat: 22.6, lang: 'Indo-Aryan', r: { aasi: [30, 40], iran: [45, 55], steppe: [10, 20], east: [0, 2] } },
  { id: 'marathi', name: 'Marathi (non-Brahmin)', region: 'Maharashtra', lon: 75.2, lat: 19, lang: 'Indo-Aryan', r: { aasi: [35, 45], iran: [45, 50], steppe: [8, 15], east: [0, 1] } },
  { id: 'upb', name: 'UP / Bihar (non-elite castes)', region: 'Ganga plain', lon: 82.5, lat: 26.2, lang: 'Indo-Aryan', r: { aasi: [40, 55], iran: [35, 45], steppe: [5, 15], east: [0, 3] } },
  { id: 'upbr', name: 'UP / Bihar Brahmin & Bhumihar', region: 'Ganga plain', lon: 81.6, lat: 26.9, lang: 'Indo-Aryan', r: { aasi: [25, 35], iran: [40, 50], steppe: [20, 30], east: [0, 2] }, caste: 'brahmin', field: false,
    note: 'Brahmin_Tiwari and Bhumihar_Bihar are the strongest outliers among 140 groups in Narasimhan 2019 — more steppe relative to Indus-cline ancestry than any regional model predicts.' },
  { id: 'bengali', name: 'Bengali', region: 'Bengal', lon: 88.4, lat: 23.3, lang: 'Indo-Aryan', r: { aasi: [35, 45], iran: [35, 45], steppe: [10, 15], east: [5, 15] }, note: 'East Asian-related admixture into West Bengal is dated to ~520 CE (Kerdoncuff 2025).' },
  { id: 'odia', name: 'Odia', region: 'Odisha', lon: 84.8, lat: 20.4, lang: 'Indo-Aryan', r: { aasi: [40, 50], iran: [40, 45], steppe: [8, 15], east: [0, 5] } },
  { id: 'assamese', name: 'Assamese (caste Hindu)', region: 'Assam', lon: 92.4, lat: 26.2, lang: 'Indo-Aryan', r: { aasi: [25, 35], iran: [25, 35], steppe: [5, 15], east: [20, 50] }, note: 'Very heterogeneous.' },
  { id: 'naga', name: 'Naga', region: 'Nagaland', lon: 94.3, lat: 26, lang: 'Tibeto-Burman', r: { aasi: [0, 10], iran: [0, 10], steppe: [0, 1], east: [80, 95] } },
  { id: 'munda', name: 'Munda & Santal', region: 'Jharkhand', lon: 85.3, lat: 23.4, lang: 'Austroasiatic', r: { aasi: [50, 60], iran: [15, 25], steppe: [0, 5], east: [20, 30] }, conf: 'moderate',
    note: 'The SE-Asian share (~22–25%, Tätte 2019) is well measured. The video’s “75% AASI” overstates it.' },
  { id: 'telugu', name: 'Telugu (non-Brahmin)', region: 'Andhra / Telangana', lon: 79.5, lat: 16.8, lang: 'Dravidian', r: { aasi: [45, 55], iran: [40, 50], steppe: [3, 10], east: [0, 1] } },
  { id: 'kannada', name: 'Kannada (non-Brahmin)', region: 'Karnataka', lon: 76, lat: 14.4, lang: 'Dravidian', r: { aasi: [45, 55], iran: [40, 50], steppe: [3, 10], east: [0, 1] } },
  { id: 'malayali', name: 'Malayali', region: 'Kerala', lon: 76.4, lat: 10.1, lang: 'Dravidian', r: { aasi: [40, 50], iran: [40, 50], steppe: [5, 15], east: [0, 1] } },
  { id: 'tamil', name: 'Tamil (non-Brahmin)', region: 'Tamil Nadu', lon: 78.7, lat: 10.9, lang: 'Dravidian', r: { aasi: [45, 60], iran: [35, 50], steppe: [0, 10], east: [0, 1] } },
  { id: 'tambr', name: 'Tamil Brahmin', region: 'Tamil Nadu', lon: 79.4, lat: 11.2, lang: 'Dravidian', r: { aasi: [25, 35], iran: [45, 55], steppe: [15, 25], east: [0, 1] }, caste: 'brahmin', field: false,
    note: 'Speaks a Dravidian language and shares most ancestry with Tamil neighbours, yet carries more steppe ancestry — language, caste and ancestry are three different things.' },
  { id: 'paniya', name: 'Paniya / Irula / Palliyar', region: 'Western Ghats', lon: 76.4, lat: 11.6, lang: 'Dravidian', r: { aasi: [55, 70], iran: [30, 45], steppe: [0, 1], east: [0, 1] }, conf: 'moderate',
    note: 'Near-direct descendants of the “ASI”, with ~0% steppe ancestry. The highest AASI shares in India (up to ~69%).' },
  { id: 'sinhala', name: 'Sinhalese', region: 'Sri Lanka', lon: 80.7, lat: 7.4, lang: 'Indo-Aryan', r: { aasi: [35, 45], iran: [40, 50], steppe: [8, 15], east: [0, 3] }, note: 'Genetically closest to South Indians and Bengalis, though speaking an Indo-Aryan language.' },
];
for (const p of POPS) {
  const m = {}; let s = 0;
  for (const k in p.r) { m[k] = (p.r[k][0] + p.r[k][1]) / 2; s += m[k]; }
  for (const k in m) m[k] /= s;
  p.mix = m; p.conf = p.conf || 'rough';
}

// Ancient snapshot c. 2500 BCE. Indus points follow Rakhigarhi I6113 and the Indus Periphery Cline
// (45–82% Iranian-related, 11–50% AASI). Peninsular points are SCHEMATIC: no ancient genomes exist there yet;
// Narasimhan 2019 infers AASI-rich groups with little Iranian-related ancestry still lived there.
const ANCIENT = [
  { lon: 76.1, lat: 29.3, mix: { aasi: 0.35, iran: 0.65 } },
  { lon: 72.9, lat: 30.6, mix: { aasi: 0.3, iran: 0.7 } },
  { lon: 68.1, lat: 27.3, mix: { aasi: 0.28, iran: 0.72 } },
  { lon: 70.2, lat: 23.9, mix: { aasi: 0.35, iran: 0.65 } },
  { lon: 67.6, lat: 29.4, mix: { aasi: 0.2, iran: 0.8 } },
  { lon: 62, lat: 31, mix: { aasi: 0.05, iran: 0.95 } },
  { lon: 78, lat: 22, mix: { aasi: 0.85, iran: 0.15 } },
  { lon: 77, lat: 15, mix: { aasi: 0.9, iran: 0.1 } },
  { lon: 78.5, lat: 10, mix: { aasi: 0.95, iran: 0.05 } },
  { lon: 84, lat: 24, mix: { aasi: 0.9, iran: 0.1 } },
  { lon: 81, lat: 27, mix: { aasi: 0.75, iran: 0.25 } },
  { lon: 80.7, lat: 7.5, mix: { aasi: 0.95, iran: 0.05 } },
];

export const FIELDS = {
  today: { points: POPS.filter(p => p.field !== false).map(p => ({ lon: p.lon, lat: p.lat, mix: p.mix, name: p.name.split(' (')[0].split(' / ')[0] })), maxDist: 7.5, alpha: 0.78, pies: true },
  ancient: { points: ANCIENT, maxDist: 8, alpha: 0.72 },
};
