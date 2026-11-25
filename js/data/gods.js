// Comparative mythology & cognates. Sources: West, Indo-European Poetry and Myth (2007); Mallory & Adams (2006);
// Watkins, How to Kill a Dragon (1995); Lincoln (1975, 1976); Jamison & Brereton (2014).
import { byTopic } from '../media.js';
export const PIE_HOME = [44, 48];
const TRAD_RE = { vedic: /vedic|hindu|india/i, iran: /iran|zoro|avest|persia/i, greek: /greek/i, roman: /roman|latin/i, norse: /norse|viking|scandin|german/i, ags: /anglo|german/i,
  celtic: /celt|irish|gaul/i, gaul: /gaul|celt/i, baltic: /balt|lithuan/i, latvia: /latvi|balt/i, slavic: /slav/i, hittite: /hitt|anatol|luwi/i, armenia: /armen/i, albania: /alban/i, illyria: /illyr/i, mitanni: /mitanni|hurri/i };
export function godImage(godId, trad, label) {
  const list = byTopic(godId).filter(im => TRAD_RE[trad] && TRAD_RE[trad].test(im.tradition || ''));
  const word = (label || '').split(/[\s/(]/)[0].toLowerCase();
  return list.find(im => (im.caption || '').toLowerCase().includes(word)) || list[0] || null;
}
export const TRAD = {
  vedic: { name: 'Vedic India', at: [75.5, 30], color: '#ffcf6e' },
  iran: { name: 'Avestan Iran', at: [59, 33.5], color: '#62d2c4' },
  greek: { name: 'Greece', at: [22.3, 38.6], color: '#5fd0ff' },
  roman: { name: 'Rome', at: [12.5, 41.9], color: '#9fb7ff' },
  norse: { name: 'Norse', at: [14.5, 60.5], color: '#7ee0b0' },
  ags: { name: 'Anglo-Saxon', at: [-1.5, 52.5], color: '#7ee0b0' },
  celtic: { name: 'Celtic', at: [-7.5, 53.3], color: '#c58bff' },
  gaul: { name: 'Gaul', at: [2.5, 46.5], color: '#c58bff' },
  baltic: { name: 'Lithuania', at: [24, 55.3], color: '#ffd36e' },
  latvia: { name: 'Latvia', at: [25, 57], color: '#ffd36e' },
  slavic: { name: 'Slavs', at: [31.5, 52.5], color: '#ffd36e' },
  hittite: { name: 'Hittites', at: [34.6, 40], color: '#5fd0ff' },
  armenia: { name: 'Armenia', at: [44.5, 40.2], color: '#5fd0ff' },
  albania: { name: 'Albania', at: [20, 41.2], color: '#5fd0ff' },
  illyria: { name: 'Illyria', at: [18.5, 43.5], color: '#5fd0ff' },
  mitanni: { name: 'Mitanni', at: [40.1, 36.85], color: '#ffcf6e' },
};

export const GODS = [
  { id: 'dyeus', pie: '*Dyḗus Ph₂tḗr', en: 'Sky Father', conf: 'strong',
    blurb: 'The bright daytime sky, father and witness of oaths. The single best-reconstructed Indo-European god. In India he faded into the background (Dyauṣ, paired with Earth, Pṛthivī), while in Greece and Rome he became king of the gods.',
    r: [['vedic', 'Dyauṣ Pitā', 'Rigveda: “Father Sky”'], ['greek', 'Zeus Patēr', '“Father Zeus”'], ['roman', 'Iuppiter', '< *Dyeu-pater; also Diespiter'], ['illyria', 'Dei-pátrous', 'Illyrian'], ['baltic', 'Dievas', 'sky god'], ['latvia', 'Dievs', ''], ['hittite', 'šīuš', 'became the word for “god”']] },
  { id: 'dawn', pie: '*H₂éwsōs', en: 'Dawn', conf: 'strong',
    blurb: 'Dawn, daughter of the Sky — over 20 Rigvedic hymns praise Uṣas. In several traditions she is reluctant, delayed or imprisoned and must be released each morning or year.',
    r: [['vedic', 'Uṣas', '“daughter of Dyaus”'], ['iran', 'Ušah', 'Avestan'], ['greek', 'Ēōs', ''], ['roman', 'Aurora', ''], ['baltic', 'Aušrinė', 'morning star'], ['ags', 'Ēostre', 'only in Bede — debated', true]] },
  { id: 'twins', pie: '*Diwós suHnú', en: 'Divine Twins', conf: 'strong',
    blurb: 'Horse-riding twin “sons of the Sky” who rescue people at sea and court the Sun-maiden. In Iran the Nāsatyas were demoted to a demon — a clue to the deva/asura split.',
    r: [['vedic', 'Aśvins / Nāsatyas', '“divó napātā”'], ['mitanni', 'Nāsatyas', 'treaty, c. 1380 BCE'], ['iran', 'Nåŋhaiθiia', 'demoted to a demon!'], ['greek', 'Dioskouroi', 'Castor & Polydeukes'], ['roman', 'Castor & Pollux', 'temple 484 BCE'], ['baltic', 'Ašvieniai', 'horse twins'], ['latvia', 'Dieva dēli', '“sons of God”'], ['norse', 'Alcis', 'Tacitus — weaker', true]] },
  { id: 'sun', pie: '*Séh₂ul', en: 'Sun', conf: 'strong',
    blurb: 'The all-seeing Sun crossing the sky in a chariot — and the Sun-maiden whose wedding the twins attend (Sūryā in Rigveda 10.85; Saulės dukrytė in Baltic songs).',
    r: [['vedic', 'Sūrya', 'and Sūryā, the Sun-maiden'], ['iran', 'Hvarə Xšaēta', '“shining sun” → Khorshid'], ['greek', 'Hēlios', ''], ['roman', 'Sōl', ''], ['norse', 'Sól', 'female'], ['baltic', 'Saulė', 'female'], ['celtic', 'haul (Welsh)', 'sun']] },
  { id: 'thunder', pie: '*Perkʷunos', en: 'Thunder-striker', conf: 'moderate',
    blurb: 'A storm god with hammer or club who fights the serpent. The name survives clearly only in the north-west (Baltic, Slavic, Norse); in India the role belongs to Indra and his vajra.',
    r: [['baltic', 'Perkūnas', ''], ['latvia', 'Pērkons', ''], ['slavic', 'Perun', ''], ['norse', 'Fjǫrgyn → Þórr', 'Thor’s mother bears the name'], ['vedic', 'Parjanya / Indra', 'name debated; role clear', true], ['gaul', 'Taranis', 'role, not name', true], ['hittite', 'Tarḫunz', 'role, not name', true], ['greek', 'Zeus Keraunios', 'role', true]] },
  { id: 'fire', pie: '*H₁n̥gʷnis', en: 'Living Fire', conf: 'moderate',
    blurb: 'Fire as a living agent — the messenger who carries offerings to the gods. The word is secure; whether PIE speakers worshipped him as a god is less certain.',
    r: [['vedic', 'Agni', 'god of the fire altar'], ['roman', 'ignis', 'word'], ['baltic', 'Ugnis', 'holy fire'], ['slavic', 'ogon’', 'word'], ['latvia', 'Uguns māte', '“Mother Fire”'], ['iran', 'Ātar', 'different root — fire temples', true]] },
  { id: 'hearth', pie: 'Hearth goddess', en: 'Keeper of the hearth', conf: 'debated',
    blurb: 'A virgin keeper of the household and state fire. Hestia and Vesta are probably cognate; a shared PIE goddess is debated.',
    r: [['greek', 'Hestia', ''], ['roman', 'Vesta', 'and the Vestal Virgins'], ['baltic', 'Gabija', 'hearth fire'], ['celtic', 'Brigid’s fire', 'Kildare; role only', true], ['vedic', 'Gārhapatya fire', 'household fire; role only', true]] },
  { id: 'pushan', pie: '*Péh₂usōn', en: 'Protector of herds', conf: 'debated',
    blurb: 'A pastoral god of roads, goats and guiding souls.',
    r: [['vedic', 'Pūṣan', 'goat-drawn chariot'], ['greek', 'Pān', 'Arcadian Paōn — goats, flocks']] },
  { id: 'napat', pie: '*H₂epom Népōts', en: 'Grandson of the Waters', conf: 'moderate',
    blurb: 'Fire hidden inside water — a shining being in a sacred lake or spring.',
    r: [['vedic', 'Apām Napāt', 'Rigveda 2.35'], ['iran', 'Apąm Napāt', 'guards the royal glory in Lake Vourukasha'], ['roman', 'Neptūnus', 'debated', true], ['celtic', 'Nechtan', 'well that bursts into the Boyne — debated', true]] },
  { id: 'earth', pie: '*Dʰéǵʰōm Méh₂tēr', en: 'Earth Mother', conf: 'moderate',
    blurb: 'The broad, fertile Earth, consort of the Sky.',
    r: [['vedic', 'Pṛthivī Mātā', '“the Broad One”'], ['iran', 'Zam', ''], ['greek', 'Chthōn', '(Gaia is not cognate)'], ['baltic', 'Žemyna', ''], ['slavic', 'Mati Syra Zemlja', '“moist mother earth”'], ['hittite', 'Dagan-zipa', '“earth spirit”'], ['albania', 'Dhe', 'earth']] },
  { id: 'yemo', pie: '*Yemo & *Manu', en: 'Twin & Man: the first sacrifice', conf: 'moderate',
    blurb: 'A primordial pair: “Twin” is sacrificed and his body becomes the world; “Man” is ancestor of humans. India’s Puruṣa Sūkta (RV 10.90) dismembers a cosmic man into world and varṇas; the Norse giant Ymir’s body becomes earth, sky and sea.',
    r: [['vedic', 'Yama & Manu', 'first mortal, king of the dead'], ['iran', 'Yima', 'son of Vīvaŋhvant'], ['norse', 'Ymir', 'body becomes the world'], ['ags', 'Tuisto → Mannus', 'Tacitus, Germania'], ['roman', 'Remus', 'killed by Romulus — debated', true]] },
  { id: 'mitra', pie: 'Mitra', en: 'The Contract', conf: 'strong',
    blurb: 'Personified contract and friendship. Clearly Indo-Iranian; whether it is older is debated. The Roman Mithras borrowed the name — how much else is argued over.',
    r: [['vedic', 'Mitra', 'paired with Varuṇa'], ['mitanni', 'Mi-it-ra', 'treaty, c. 1380 BCE'], ['iran', 'Miθra → Mihr', 'Yašt 10'], ['armenia', 'Mihr', ''], ['roman', 'Mithras', 'Roman mystery cult — link debated', true]] },
  { id: 'dragon', pie: '*gʷʰent h₁ógʷʰim', en: '“He slew the serpent”', conf: 'strong',
    blurb: 'Not a god but a formula (Watkins): the hero-god kills the serpent that blocks the waters or steals the cattle. The verb and noun line up word-for-word in Vedic “áhann áhim” and Avestan “jana aži”.',
    r: [['vedic', 'Indra ⚔ Vṛtra', '“áhann áhim”'], ['iran', 'Θraētaona ⚔ Aži Dahāka', '3-headed serpent'], ['greek', 'Zeus ⚔ Typhon', 'also Apollo ⚔ Python'], ['norse', 'Thor ⚔ Jǫrmungandr', 'world serpent'], ['hittite', 'Tarḫunz ⚔ Illuyanka', ''], ['slavic', 'Perun ⚔ Veles', ''], ['armenia', 'Vahagn', '“dragon-reaper”']] },
  { id: 'deiwos', pie: '*deywós', en: '“Celestial one” — the word for god', conf: 'strong',
    blurb: 'The ordinary word for “god”, from the root for shining daylight. Look at Iran: there, daēva means demon. And English keeps it in Tuesday — Týr’s day.',
    r: [['vedic', 'deva', 'god'], ['iran', 'daēva', 'DEMON'], ['roman', 'deus', 'god'], ['norse', 'Týr / tívar', '“gods” → Tuesday'], ['baltic', 'dievas', 'god'], ['celtic', 'día / duw', 'Irish / Welsh'], ['hittite', 'šiuš', 'god']] },
];

export function godBeams(id) {
  const g = GODS.find(x => x.id === id); if (!g) return null;
  return {
    src: PIE_HOME, srcLabel: g.pie, srcSub: g.en, color: '#f6d58e', stagger: 0.18,
    items: g.r.map(([t, label, sub, weak]) => ({ to: TRAD[t].at, label, sub: `${TRAD[t].name}${sub ? ' · ' + sub : ''}`, color: TRAD[t].color, weak: !!weak, img: godImage(id, t, label) })),
  };
}

// ---------- cognates (Indo-European agent report; standard etymologies)
export const LANGS = {
  skt: { name: 'Sanskrit', at: [75.5, 30], color: '#ffcf6e' },
  hin: { name: 'Hindi', at: [80, 26.5], color: '#ffcf6e' },
  per: { name: 'Persian', at: [53, 32.5], color: '#62d2c4' },
  grk: { name: 'Greek', at: [22.3, 38.6], color: '#5fd0ff' },
  lat: { name: 'Latin', at: [12.5, 41.9], color: '#c58bff' },
  eng: { name: 'English', at: [-1.5, 52.5], color: '#7ee0b0' },
  iri: { name: 'Old Irish', at: [-7.5, 53.3], color: '#c58bff' },
  lit: { name: 'Lithuanian', at: [24, 55.3], color: '#ffd36e' },
  rus: { name: 'Russian', at: [37.6, 55.7], color: '#ffd36e' },
  hit: { name: 'Hittite', at: [34.6, 40], color: '#5fd0ff' },
  tam: { name: 'Tamil', at: [78.7, 10.9], color: '#ff9e5e' },
};
// each: [lang, word, cognate?]
export const WORDS = [
  { id: 'mother', en: 'mother', pie: '*méh₂tēr', w: [['skt', 'mātṛ́', 1], ['hin', 'mātā', 1], ['per', 'mādar', 1], ['grk', 'mḗtēr', 1], ['lat', 'māter', 1], ['eng', 'mother', 1], ['iri', 'máthair', 1], ['rus', 'mat’', 1], ['lit', 'mótė', 1], ['tam', 'ammā / tāy', 0]] },
  { id: 'father', en: 'father', pie: '*ph₂tḗr', note: 'Grimm’s law: PIE p → Germanic f (pater → father). Irish lost the p entirely: athair.',
    w: [['skt', 'pitṛ́', 1], ['hin', 'pitā', 1], ['per', 'pedar', 1], ['grk', 'patḗr', 1], ['lat', 'pater', 1], ['eng', 'father', 1], ['iri', 'athair', 1], ['lit', 'tėvas', 0], ['tam', 'appā / tantai', 0]] },
  { id: 'brother', en: 'brother', pie: '*bʰréh₂tēr', w: [['skt', 'bhrā́tṛ', 1], ['hin', 'bhāī', 1], ['per', 'barādar', 1], ['grk', 'phrā́tēr', 1], ['lat', 'frāter', 1], ['eng', 'brother', 1], ['iri', 'bráthair', 1], ['lit', 'brolis', 1], ['rus', 'brat', 1], ['tam', 'aṇṇaṉ / tampi', 0]] },
  { id: 'three', en: 'three', pie: '*tréyes', note: 'Grimm’s law: t → th (trēs → three).', w: [['skt', 'tráyas', 1], ['hin', 'tīn', 1], ['per', 'se', 1], ['grk', 'treîs', 1], ['lat', 'trēs', 1], ['eng', 'three', 1], ['iri', 'trí', 1], ['lit', 'trỹs', 1], ['rus', 'tri', 1], ['hit', 'teri-', 1], ['tam', 'mūṉṟu', 0]] },
  { id: 'night', en: 'night', pie: '*nókʷts', w: [['skt', 'nákt-', 1], ['grk', 'núx', 1], ['lat', 'nox', 1], ['eng', 'night', 1], ['iri', 'nocht', 1], ['lit', 'naktìs', 1], ['rus', 'noč’', 1], ['hit', 'nekut-', 1], ['hin', 'rāt', 0], ['tam', 'iravu', 0]] },
  { id: 'name', en: 'name', pie: '*h₁nómn̥', w: [['skt', 'nā́man', 1], ['hin', 'nām', 1], ['per', 'nām', 1], ['grk', 'ónoma', 1], ['lat', 'nōmen', 1], ['eng', 'name', 1], ['iri', 'ainm', 1], ['rus', 'imja', 1], ['hit', 'lāman', 1], ['tam', 'peyar (nāmam = loan)', 0]] },
  { id: 'god', en: 'god / sky', pie: '*deywós', note: 'In Persian the same word (dīv) means demon — see the Great Inversion.', w: [['skt', 'devá', 1], ['hin', 'devtā', 1], ['per', 'dīv (demon!)', 1], ['grk', 'Zeús', 1], ['lat', 'deus', 1], ['eng', 'Tues-day', 1], ['iri', 'día', 1], ['lit', 'diẽvas', 1], ['hit', 'šiu-', 1], ['tam', 'kaṭavuḷ / iṟaivaṉ', 0]] },
  { id: 'horse', en: 'horse', pie: '*h₁éḱwos', note: 'Satem vs centum: Sanskrit aśva (ś) vs Latin equus (k).', w: [['skt', 'áśva', 1], ['per', 'asb', 1], ['grk', 'híppos', 1], ['lat', 'equus', 1], ['eng', 'eoh (Old Eng.)', 1], ['iri', 'ech', 1], ['lit', 'ašvà (mare)', 1], ['hin', 'ghoṛā', 0], ['tam', 'kutirai', 0]] },
  { id: 'wheel', en: 'wheel', pie: '*kʷékʷlos', note: 'A word for a wheeled vehicle shared across the family — one argument that PIE is no older than the wheel (~3500 BCE).', w: [['skt', 'cakrá', 1], ['per', 'čarx', 1], ['grk', 'kúklos', 1], ['eng', 'wheel', 1], ['rus', 'koleso', 1], ['hin', 'cakkā', 1], ['lat', 'rota', 0], ['tam', 'cakkaram = loan (native uruḷ-)', 0]] },
  { id: 'fire', en: 'fire', pie: '*h₁n̥gʷnis', w: [['skt', 'agní', 1], ['lat', 'ignis', 1], ['lit', 'ugnìs', 1], ['rus', 'ogon’', 1], ['hin', 'āg', 1], ['grk', 'pûr (other root)', 0], ['eng', 'fire (other root)', 0], ['tam', 'tī / neruppu', 0]] },
  { id: 'king', en: 'king', pie: '*h₃rḗǵs', w: [['skt', 'rā́jan', 1], ['hin', 'rājā', 1], ['lat', 'rēx', 1], ['iri', 'rí', 1], ['eng', '-ric (rich)', 1], ['tam', 'kō / vēntaṉ (aracaṉ = loan)', 0]] },
];

export function wordBeams(id) {
  const w = WORDS.find(x => x.id === id); if (!w) return null;
  return {
    src: PIE_HOME, srcLabel: w.pie, srcSub: `“${w.en}”`, color: '#f6d58e', stagger: 0.12,
    items: w.w.map(([l, word, cog]) => ({ to: LANGS[l].at, from: cog ? null : LANGS[l].at, label: word, sub: LANGS[l].name + (cog ? '' : ' · not cognate'), color: cog ? LANGS[l].color : '#8f8a7c', weak: !cog, lift: cog ? 1 : 0 })),
  };
}
