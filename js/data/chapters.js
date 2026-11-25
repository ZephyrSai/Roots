// The story. Each step sets camera, year (tweened from the previous year so migrations animate), focus,
// optional ancestry field, map beams and interactive actions.
import { godBeams, wordBeams } from './gods.js';
import { LINES, lineBeams } from '../overlays/india.js';

const INDIA = { lon: 80, lat: 22, zoom: 3.0 };
const SA = { lon: 74, lat: 25, zoom: 2.3 };
const WORLD = { lon: 62, lat: 14, zoom: 1.0 };
const INDUS = { lon: 71, lat: 27.3, zoom: 5 };
const STEPPE = { lon: 48, lat: 47, zoom: 2.6 };
const EURASIA = { lon: 38, lat: 45, zoom: 1.95 };
const CENTRAL = { lon: 64, lat: 41, zoom: 2.5 };
const SOUTH = { lon: 77.5, lat: 13.5, zoom: 5.2 };
const TAMIL = { lon: 78.3, lat: 10.5, zoom: 8.5 };
const lb = id => lineBeams(LINES.find(l => l.id === id));

export const CHAPTERS = [
  // ---------------------------------------------------------------- 1
  { title: 'India, today', short: 'India today', era: 'Now',
    steps: [
      { cam: INDIA, year: 2026, legend: 'lang', focus: ['c-munda', 'c-tb', 's-brahui', 's-andaman'], imgs: ["s-varanasi","s-madurai","l-mithila","l-gond","l-hornbill","l-pithora","l-toda","s-kannur"],
        html: `<p class="big">1.4 billion people. 4,635 communities. 19,569 names for a mother tongue. Six language families. Every major religion on Earth.</p>
          <p>No other country holds this much human diversity inside one border. A Kashmiri Pandit, a Tamil fisher, a Santal farmer in Jharkhand and a Naga villager speak languages from <b>four unrelated families</b> — yet three of them share most of their ancient ancestors.</p>
          <p>This journey explains how that came to be: who arrived when, how words and gods travelled, how beliefs braided — and how groups mixed for thousands of years and then, quite suddenly, stopped.</p>`,
        actions: [{ overlay: 'india', label: 'India today in numbers' }] },
      { cam: INDIA, year: 2026, field: 'today', legend: 'ancestry',
        h: 'A gradient, not races',
        html: `<p>Colour the map by ancestry and there are no borders — only a smooth gradient of four ancient streams:</p>
          <ul><li><span class="sw" style="background:var(--aasi)"></span><b>AASI</b> — the first South Asians, highest in the south and among tribal groups.</li>
          <li><span class="sw" style="background:var(--iran)"></span><b>Iranian-related</b> — the bulk of the Indus civilisation’s ancestry, everywhere.</li>
          <li><span class="sw" style="background:var(--steppe)"></span><b>Steppe</b> — arriving ~2000–1000 BCE, highest in the north-west and among priestly groups.</li>
          <li><span class="sw" style="background:var(--east)"></span><b>East/Southeast Asian</b> — in the north-east and among Munda speakers.</li></ul>
          <p>A Punjabi and a Tamil differ in the <em>proportions</em>, not the ingredients.</p>`,
        chips: [['strong', 'Narasimhan 2019 · Kerdoncuff 2025']], actions: [{ overlay: 'mixer' }] },
      { cam: INDIA, year: 2026, legend: 'lang', focus: ['c-munda', 'c-tb'],
        h: 'Languages don’t follow genes', imgs: ["tbrahmi", "ashoka-edict-gujarra", "rigveda", "s-brahui"],
        html: `<p><b>Indo-Aryan</b> (78% of Indians) is a cousin of English, Persian and Greek. <b>Dravidian</b> (19.6%) — Tamil, Telugu, Kannada, Malayalam and some 20 others — is unrelated to it. <b>Austroasiatic</b> (Santali, Mundari, Khasi) and <b>Tibeto-Burman</b> (Bodo, Meitei, Naga languages) each have about 1%.</p>
          <p>So “Aryan” and “Dravidian” are names of <b>language families</b>, not peoples. The Brahui of Balochistan speak a Dravidian language but are genetically almost identical to their Baloch neighbours. Sri Lanka’s Sinhalese speak Indo-Aryan but sit genetically beside South Indians.</p>`,
        chips: [['strong', 'Census 2011']], actions: [{ overlay: 'tree', label: 'See the language family trees' }] },
      { cam: WORLD, year: 2026, flyMs: 3200,
        h: 'To understand today, go back 72,000 years', imgs: ["s-bhim", "great-bath", "trundholm-1", "s-thanjavur"],
        html: `<p>Press <b>Next</b> (or →) to begin. The timeline at the bottom moves with the story — drag it at any time, or switch to <b>Free explore</b> to roam the map through time.</p>
          <p class="note">Confidence badges throughout: <span class="chip strong">strong</span> <span class="chip moderate">moderate</span> <span class="chip debated">debated</span> <span class="chip fringe">fringe/unsupported</span></p>` },
    ] },
  // ---------------------------------------------------------------- 2
  { title: 'First footsteps', short: 'First people', era: '~60,000 – 40,000 years ago',
    steps: [
      { cam: { lon: 55, lat: 15, zoom: 1.5 }, year: -54000, yearFrom: -66000, focus: ['f-ooa', 's-toba', 's-jwala'], legend: 'flows',
        h: 'Out of Africa',
        html: `<p>Modern humans leave Africa — most likely across the narrow Bab-el-Mandeb strait and along the coast of Arabia. Every non-African alive today descends mostly from this dispersal, dated genetically to <b>~54,000 years ago or later</b>.</p>
          <p>Earlier, ~74,000 years ago, the Toba super-volcano buried India in ash. Stone tools at Jwalapuram sit both below and above it — someone survived, but whether they were modern humans is debated. Genetics finds at most a trace (0–3%) of any earlier wave.</p>`,
        chips: [['strong', 'Kerdoncuff 2025'], ['debated', 'Jwalapuram toolmakers']] },
      { cam: { lon: 88, lat: 10, zoom: 1.6 }, year: -45000, yearFrom: -54000, focus: ['f-coast', 'f-aasi-in', 'f-sahul', 'f-north', 'c-aasi', 's-andaman', 's-fahien'], legend: 'flows',
        h: 'The AASI: India’s first people',
        html: `<p>One branch spreads through the subcontinent, probably ~50–45,000 years ago. Geneticists call their descendants the <b>AASI — Ancient Ancestral South Indians</b> (despite the name, they lived everywhere in South Asia).</p>
          <p>The same southern dispersal reaches Southeast Asia and Australia; another branch turns north-west to become West Eurasians. No AASI skeleton has yet yielded DNA — the closest living proxies are the <b>Onge and Jarawa of the Andaman Islands</b>.</p>
          <p>Today, AASI ancestry is <b>19–69%</b> of every Indian’s genome. Indian genomes also carry ~2% Neanderthal and Denisovan DNA picked up on the way.</p>`,
        chips: [['strong', 'Narasimhan 2019 · Kerdoncuff 2025']] },
      { cam: SA, year: -30000, focus: ['s-bhim', 'c-aasi'],
        h: 'Forty thousand years of foragers',
        html: `<p>For most of human history in India, people hunted, fished and gathered. At <b>Bhimbetka</b> in central India they painted rock shelters for tens of thousands of years — dancers, hunters, animals.</p>
          <p>The video series is right that these were the founding population. It overstates how long ago (~60,000 is the high end) and slightly overstates their share in Munda speakers, who also carry ~22–25% Southeast Asian ancestry.</p>`,
        chips: [['moderate', 'Arrival date ~50–45 ka']], actions: [{ overlay: 'claims' }] },
    ] },
  // ---------------------------------------------------------------- 3
  { title: 'Seeds from the west', short: 'Farming', era: '~12,000 – 3300 BCE',
    steps: [
      { cam: { lon: 60, lat: 30, zoom: 2.6 }, year: -7000, yearFrom: -12000, focus: ['c-zagros', 'f-iran', 's-ganj'], legend: 'flows',
        h: 'An Iranian-related people',
        html: `<p>A second ancestral stream comes from the Iranian plateau and southern Central Asia. It is related to the first goat-herders of the Zagros mountains — but the branch that reached South Asia <b>split off more than 12,000 years ago, before farming began</b>.</p>
          <p>Its mixing with AASI groups is dated to <b>~5400–3700 BCE</b>. A 2025 study of 2,762 Indian genomes finds the best-fitting source is a Central Asian population (Sarazm, Tajikistan).</p>
          <p class="note">The videos’ “Zagros farmers ~10,000 years ago” is partly wrong — see the claim check.</p>`,
        chips: [['strong', 'Shinde 2019 · Narasimhan 2019'], ['moderate', 'source region']] },
      { cam: { lon: 64, lat: 30, zoom: 3.2 }, year: -6000, yearFrom: -7600, focus: ['c-mehrgarh', 's-mehrgarh', 'f-wheat'],
        h: 'Mehrgarh: crops travel further than people',
        html: `<p>From ~7000 BCE, villagers at <b>Mehrgarh</b> grow wheat and barley (first domesticated in the Near East), herd sheep and goats — and domesticate the humped <b>zebu</b> cow themselves. They drilled teeth: the oldest known dentistry.</p>
          <p>Yet ancient South Asian genomes have almost <b>no Anatolian-farmer ancestry</b> — unlike Europe, where farmers replaced foragers. In South Asia, farming spread more as an idea than as a migration.</p>`,
        chips: [['strong', 'Shinde 2019']] },
    ] },
  // ---------------------------------------------------------------- 4
  { title: 'The Indus world', short: 'Indus', era: '3300 – 1300 BCE',
    steps: [
      { cam: INDUS, year: -2400, yearFrom: -3400, focus: ['c-ivc', 's-harappa', 's-mohenjo', 's-rakhi', 's-dholavira', 's-lothal', 's-kalibangan', 's-ganwer', 'r-ghaggar', 'r-indus'], field: 'ancient', legend: 'ancestry3',
        h: 'The largest civilisation of its age',
        html: `<p>Mature Harappan cities (<b>c. 2600–1900 BCE</b>) stretched over ~1 million km² — larger than Egypt and Mesopotamia combined: grid streets, covered drains, standard weights, the <b>Great Bath</b> at Mohenjo-daro.</p>
          <p>The only Harappan genome yet sequenced (a woman from <b>Rakhigarhi</b>, c. 2500 BCE) is a mix of <span class="k-iran">Iranian-related</span> and <span class="k-aasi">AASI</span> ancestry — with <b>no steppe and no Anatolian-farmer ancestry</b>. Eleven migrants from the Indus buried in Central Asia and Iran share the profile: 45–82% Iranian-related, 11–50% AASI.</p>
          <p class="note">Map shading = schematic ancestry c. 2500 BCE. Indus points follow the genomes; the peninsula is inferred (no ancient DNA there yet).</p>`,
        chips: [['strong', 'Shinde 2019 Cell'], ['moderate', 'n = 1 + 11 outliers']] },
      { cam: { lon: 62, lat: 29, zoom: 2.3 }, year: -2300, focus: ['s-ur', 's-shortugai', 's-gonur', 's-sokhta', 's-sutkagen', 'c-bmac'],
        h: 'Meluhha: trading with Mesopotamia',
        html: `<p>Mesopotamian texts speak of ships from <b>Meluhha</b> — almost certainly the Indus. Sargon of Akkad (c. 2300 BCE) boasts of them; one cylinder seal belongs to a “Meluhha interpreter”. Indus seals and carnelian beads turn up at Ur; a Harappan outpost at Shortugai mined lapis lazuli on the Oxus.</p>`,
        chips: [['strong', 'Archaeology & cuneiform']] },
      { cam: INDUS, year: -2200, focus: ['s-mohenjo', 's-kalibangan', 's-lothal', 'c-ivc'],
        h: 'An unread script, unnamed gods', imgs: ["pashupati-seal", "unicorn-seal-delhi", "seals", "mother-goddess-indus", "great-bath", "dancing-girl"],
        html: `<p>Some 4,000–5,000 inscribed objects carry ~400 signs — usually just five signs long. With no bilingual inscription, the <b>Indus script is undeciphered</b>. Tamil Nadu offered a US$1 million prize in 2025; it is unclaimed.</p>
          <p>The leading language guess is <b>Dravidian</b> (Parpola, Mahadevan: the fish sign as Tamil <i>mīn</i>, “fish” and “star”). Others propose a lost language — or that it isn’t writing at all.</p>
          <p>Religious clues: ritual bathing, sacred pipal leaves, fire pits at Kalibangan and Lothal, female figurines, and the horned, cross-legged “Paśupati” seal. A “proto-Śiva” is tempting but unprovable.</p>`,
        chips: [['debated', 'Dravidian reading'], ['debated', 'Paśupati = proto-Śiva']], actions: [{ overlay: 'gallery', arg: 'indus', label: 'Seals, figurines & the Great Bath' }] },
      { cam: { lon: 75, lat: 26, zoom: 3.6 }, year: -1500, yearFrom: -2000, focus: ['c-lateh', 'f-ivc-e', 'f-ivc-s', 'r-ghaggar'], legend: 'flows',
        h: 'Not destroyed — dispersed', imgs: ["s-rakhi", "s-harappa", "s-dholavira"],
        html: `<p>After ~1900 BCE the cities empty. A 2025 study finds <b>four multi-century river droughts</b> between ~2450 and 1400 BCE; the Ghaggar-Hakra dried. People moved — east into the Ganga plain, south into Gujarat and the Deccan — and became villagers.</p>
          <p>This matters: the Indus population is the <b>common ancestor of North and South Indians alike</b>. Most South Asians carry 40–70% Indus-related ancestry. The old “Aryan invasion destroyed the Indus” story is wrong on timing — the decline came first.</p>`,
        chips: [['strong', 'Narasimhan 2019'], ['moderate', 'Solanki 2025 (droughts)']] },
    ] },
  // ---------------------------------------------------------------- 5
  { title: 'Horses, wagons and a mother tongue', short: 'The steppe', era: '4500 – 2000 BCE',
    steps: [
      { cam: STEPPE, year: -4000, yearFrom: -4700, focus: ['c-clv', 's-khval', 'c-maykop', 'f-anat'], legend: 'ie',
        h: 'Where Indo-European began',
        html: `<p>Two thousand kilometres north-west, on the grasslands between the Caucasus and the Volga, lived the <b>Caucasus–Lower Volga people</b> (c. 4500–3500 BCE). A 2025 study of 435 ancient genomes makes them the best candidates for speakers of <b>Proto-Indo-Anatolian</b> — the ancestor of Hittite and of every other Indo-European language.</p>
          <p>The Anatolian branch (Hittite) split off first and went south — across the Caucasus or round the Black Sea (debated).</p>`,
        chips: [['moderate', 'Lazaridis et al. 2025 Nature']] },
      { cam: STEPPE, year: -2900, yearFrom: -3600, focus: ['c-yamnaya', 's-mykh', 'f-yam-w', 'f-afan', 'c-afan'], legend: 'ie',
        h: 'The Yamnaya',
        html: `<p>Around 3600–3400 BCE, a few villages on the lower Dnipro (Mykhailivka) gave rise to the <b>Yamnaya</b>: herders living from ox-drawn wagons, burying chiefs under mounds (kurgans). They expanded explosively — west to Hungary, east to the Altai (Afanasievo, likely ancestors of the Tocharians).</p>
          <p>Shared words prove the speakers knew <b>wheels, wagons, axles, wool and the horse</b>. (Horses weren’t yet ridden widely: the modern domestic horse spreads only after ~2200 BCE.)</p>`,
        chips: [['strong', 'Haak 2015 · Nikitin 2025'], ['strong', 'Librado 2021 (horses)']], actions: [{ overlay: 'words', arg: 'wheel', label: 'Trace the word “wheel”' }] },
      { cam: { lon: 22, lat: 50, zoom: 2.2 }, year: -2200, yearFrom: -3000, focus: ['c-cw', 'c-bb', 'f-cw', 'f-bb', 'f-italic', 'f-greek', 'f-nordic', 'f-slav', 's-amesbury'], legend: 'ie',
        h: 'Into Europe',
        html: `<p>Corded Ware people (~75% steppe ancestry) carry the languages that become Germanic and Balto-Slavic. Bell Beaker people reach Britain c. 2450 BCE and replace ~90% of its gene pool within centuries. Italic, Celtic and Greek follow.</p>
          <p>That is why <b>English, Latin, Greek and Lithuanian</b> share so many words with Sanskrit.</p>`,
        chips: [['strong', 'Olalde 2018 · Haak 2015']], actions: [{ overlay: 'tree', arg: 'ie' }] },
    ] },
  // ---------------------------------------------------------------- 6
  { title: 'Chariots to the Seven Rivers', short: 'Indo-Aryans', era: '2100 – 1200 BCE',
    steps: [
      { cam: { lon: 60, lat: 49, zoom: 2.8 }, year: -1800, yearFrom: -2500, focus: ['f-fat', 'c-sint', 's-sintashta', 's-arkaim', 'f-andr', 'c-andr'], legend: 'flows',
        h: 'Sintashta: the first chariots',
        html: `<p>Descendants of Corded Ware people move east to the southern Urals. At <b>Sintashta</b> (c. 2100–1800 BCE) they build fortified towns and bury the earliest <b>spoke-wheeled chariots</b> with sacrificed horses — rites that echo the Vedic horse sacrifice.</p>
          <p>Their language is almost certainly <b>Proto-Indo-Iranian</b>, ancestor of both Sanskrit and Persian. The Andronovo herders carry it across Kazakhstan.</p>`,
        chips: [['strong', 'Anthony 2007 · Narasimhan 2019']] },
      { cam: CENTRAL, year: -1600, yearFrom: -2000, focus: ['f-bmac', 'c-bmac', 's-gonur', 'f-mitanni', 'c-mitanni', 's-washu'], legend: 'flows',
        h: 'Through the Oxus oases — and as far as Syria',
        html: `<p>By ~2100 BCE steppe migrants appear at the walled oasis towns of the <b>BMAC</b>, borrowing words (perhaps even the Soma cult). One group heads west: in Syria, the <b>Mitanni</b> kings bear Indo-Aryan names, count in Indo-Aryan (<i>aika, tera, panza, satta</i> — Sanskrit <i>eka, tri, pañca, sapta</i>) and in a treaty of <b>c. 1380 BCE</b> swear by <b>Mitra, Varuṇa, Indra and the Nāsatyas</b>.</p>
          <p>Those are Rigvedic gods, attested in writing <em>before</em> the Rigveda itself.</p>`,
        chips: [['strong', 'Hittite archives']] },
      { cam: { lon: 71, lat: 32, zoom: 3.8 }, year: -1300, yearFrom: -1750, focus: ['f-ia', 'c-swat', 's-swat', 'c-rv', 'f-iranian'], legend: 'flows',
        h: 'A migration, not an invasion', imgs: ["s-swat", "rigveda", "land-khyber"],
        html: `<p>Steppe ancestry reaches the <b>Swat valley</b> — admixture dated ~1900–1500 BCE — and then the Punjab, the <b>Sapta Sindhu</b> (“seven rivers”) of the Rigveda, composed c. 1500–1200 BCE. Another branch becomes the Iranians.</p>
          <p>Steppe ancestry in India today is <b>male-biased</b> (Y-haplogroup R1a-Z93), pointing to men marrying into local groups. But there is no archaeological sign of a conquest — and by now the Indus cities were long gone.</p>
          <p class="note">The videos are right here: the “invasion” is debunked, the migration is not.</p>`,
        chips: [['strong', 'Narasimhan 2019']] },
      { cam: { lon: 81, lat: 27.5, zoom: 4 }, year: -650, yearFrom: -1200, focus: ['f-vedic-e', 'c-kuru', 's-kuru', 's-hastina', 's-janak', 'c-magadha'],
        h: 'East along the Ganga',
        html: `<p>Later Vedic culture spreads from the Kuru–Pañcāla heartland to Videha and Magadha. The Śatapatha Brāhmaṇa preserves a memory of it: Videgha Māthava carrying the fire god Agni east across the river Sadānīrā.</p>
          <p>Along the way the newcomers’ language absorbed local words and sounds — Sanskrit’s retroflex consonants (ṭ, ḍ, ṇ) are absent from its Iranian sister and probably come from Dravidian or other local languages.</p>`,
        chips: [['moderate', 'Witzel']], actions: [{ overlay: 'lineages', arg: 'vedic', label: 'Follow the Brahmin families east' }] },
    ] },
  // ---------------------------------------------------------------- 7
  { title: 'Mixed, then frozen', short: 'Caste & DNA', era: '2000 BCE – 500 CE',
    steps: [
      { cam: INDIA, year: -500, yearFrom: -1900, focus: ['f-ivc-s', 'f-ivc-e', 'f-aa', 'f-tb', 'c-munda', 'c-tb'], legend: 'flows',
        h: 'Two new ancestral populations',
        html: `<p>In the 2nd millennium BCE two blends formed:</p>
          <ul><li><b>ANI — Ancestral North Indians</b>: Indus-related people (≥70%) mixed with steppe newcomers.</li>
          <li><b>ASI — Ancestral South Indians</b>: Indus-related people (≥55%) mixed with AASI-rich groups of the peninsula.</li></ul>
          <p>Almost every Indian is a mixture of ANI and ASI. Meanwhile Austroasiatic speakers arrive from Southeast Asia (~2000–3800 years ago, mostly men) and Tibeto-Burman speakers come over the Himalaya.</p>`,
        chips: [['strong', 'Narasimhan 2019 · Tätte 2019']] },
      { cam: INDIA, year: 450, yearFrom: -300, focus: ['c-gupta'], field: 'today', legend: 'ancestry',
        h: 'Then the mixing stopped',
        html: `<p>DNA shows ANI and ASI mixing freely from ~4,200 to ~1,900 years ago — and then a sharp switch to <b>endogamy</b>, marriage only within one’s group. For upper castes the switch is dated to ~70 generations ago (~4th–6th c. CE), around the <b>Gupta</b> era.</p>
          <p>Since then, thousands of groups have stayed genetically distinct: 81 of 263 studied have founder events stronger than Finns or Ashkenazi Jews. Caste became written into the genome.</p>
          <p class="note">The video says “2,500 years ago, around the Gupta Empire” — the era is right, the number is wrong (Gupta ≈ 1,600 years ago).</p>`,
        chips: [['strong', 'Moorjani 2013'], ['moderate', 'Basu 2016 dating']] },
      { cam: INDIA, year: 2026, yearFrom: 600, field: 'today', legend: 'ancestry',
        h: 'Caste and ancestry today',
        html: `<p>Within the same region, groups traditionally higher in caste rank tend to have more ANI and steppe ancestry. The strongest outliers among 140 groups are <b>Brahmin</b> and <b>Bhumihar</b> communities — even <b>Tamil Brahmins</b>, who speak a Dravidian language, carry more steppe ancestry than their neighbours.</p>
          <p>But the steppe share is a minority even there (~15–30%). A Tamil Brahmin is genetically far closer to a Tamil non-Brahmin than to any European. The varṇa scheme itself appears only in a late Rigvedic hymn (the Puruṣa Sūkta, RV 10.90).</p>`,
        chips: [['strong', 'Narasimhan 2019 · Reich 2009']], actions: [{ overlay: 'mixer', arg: 'tambr', label: 'Compare castes in the mixer' }] },
    ] },
  // ---------------------------------------------------------------- 8
  { title: 'The Dravidian story', short: 'Dravidian', era: '~2500 BCE – 300 CE',
    steps: [
      { cam: { lon: 75, lat: 20, zoom: 2.8 }, year: -1500, yearFrom: -2600, focus: ['f-drav', 's-brahui', 'c-sneo', 's-sanga', 's-budihal', 'c-ivc', 'c-lateh'], legend: 'lang',
        h: 'An Indian-born language family',
        html: `<p>Statistical comparison of 20 Dravidian languages dates their common ancestor, <b>Proto-Dravidian</b>, to <b>~4,500 years ago</b> (with a wide range). Unlike Indo-Aryan, it probably grew up <em>inside</em> South Asia. Where exactly is open:</p>
          <ul><li><b>Indus / north-west</b> — Dravidian readings of the script; Mesopotamian <i>pīru</i> “elephant” borrowed from Dravidian <i>pīlu</i>; Brahui in Balochistan. <span class="chip debated">debated</span></li>
          <li><b>Peninsular</b> — reconstructed crop words (millets, horsegram, mung, cattle) fit the Deccan’s <b>Southern Neolithic</b> ash-mound herders (c. 3000–1200 BCE). <span class="chip moderate">moderate</span></li>
          <li><b>Elamo-Dravidian</b> (a link to ancient Elam in Iran) — <span class="chip fringe">weak</span></li></ul>
          <p>Both main ideas can be true: northern and southern Dravidian zones that later contracted.</p>`,
        chips: [['moderate', 'Kolipakam 2018']], actions: [{ overlay: 'tree', arg: 'drav', label: 'Dravidian family tree' }] },
      { cam: { lon: 70, lat: 27, zoom: 3.4 }, year: 1200, focus: ['s-brahui', 'c-ivc'],
        h: 'The Brahui puzzle',
        html: `<p>Brahui, spoken by ~2–2.8 million people in Balochistan, is a Dravidian language 1,500 km from its nearest sister. Is it a <b>relic</b> of an ancient north-western Dravidian world — or did its speakers migrate from central India after ~1000 CE (it lacks old Iranian loanwords)?</p>
          <p>Genetically the Brahui are almost identical to the Baloch — a reminder that people can change language without changing ancestry.</p>`,
        chips: [['debated', 'Relic vs migrant']] },
      { cam: SOUTH, year: -300, yearFrom: -1300, focus: ['c-meg', 's-adich', 's-sivagalai', 's-keeladi', 's-kodumanal', 'r-vaigai', 'r-kaveri'],
        h: 'Iron, urns and the first Tamil writing',
        html: `<p>The peninsula enters the Iron Age with megaliths and urn burials (Adichanallur, Sivagalai). In 2025 Tamil Nadu reported iron at Sivagalai dated to ~3345 BCE — older than iron anywhere. Other dates from the same graves are far younger, and the report isn’t peer-reviewed. <span class="chip debated">claimed</span></p>
          <p>At <b>Keeladi</b> on the Vaigai, an urban settlement with Tamil-Brahmi graffiti is dated by the state to the 6th c. BCE — a dating now caught in a dispute with the Archaeological Survey of India. Securely, Tamil-Brahmi inscriptions appear by the <b>3rd–2nd c. BCE</b>.</p>`,
        chips: [['debated', 'Keeladi & Sivagalai dates'], ['strong', 'Tamil-Brahmi by 2nd c. BCE']] },
      { cam: TAMIL, year: 150, yearFrom: -300, focus: ['c-sangam', 's-madurai', 's-arikamedu', 's-puliman', 's-keeladi'],
        h: 'Words flowing both ways',
        html: `<p>Sanskrit borrowed from Dravidian: <i>ulūkhala</i> “mortar” (Tamil <i>ural</i>), <i>khala</i> “threshing floor” (<i>kaḷam</i>), <i>kāṇa</i> “one-eyed” (<i>kaṇ</i>, eye), <i>mīna</i> “fish” (<i>mīn</i>), <i>nīra</i> “water” (<i>nīr</i>) — and probably its retroflex sounds.</p>
          <p>Tamil borrowed from Sanskrit and Prakrit: <i>aracaṉ</i> “king” (<i>rājan</i>), <i>ulakam</i> “world” (<i>loka</i>), <i>kālam</i> “time” (<i>kāla</i>). Sangam poetry (core c. 1st–3rd c. CE) already mixes both worlds — Brahmins appear in it as <i>antaṇar</i>.</p>`,
        chips: [['moderate', 'Burrow & Emeneau; Witzel 1999']], actions: [{ overlay: 'words', arg: 'name', label: 'Why Tamil isn’t a cognate' }] },
    ] },
  // ---------------------------------------------------------------- 9
  { title: 'Words that remember', short: 'Cognates', era: '1786 → today',
    steps: [
      { cam: EURASIA, year: 2026, beams: wordBeams('father'),
        h: '“Father”, from Ireland to India', imgs: ["rigveda", "avesta-ms-j2", "s-knossos", "behistun"],
        html: `<p>In 1786 William Jones noticed that Sanskrit, Greek and Latin were too alike to be chance: <i>pitṛ́, patḗr, pater</i>. English <i>father</i> fits too, through a regular sound change (Grimm’s law: <b>p → f</b>, <b>t → th</b>, <b>k → h</b>).</p>
          <p>Tamil <i>appā / tantai</i> doesn’t fit — not because it’s different people, but because it is a different language family.</p>`,
        chips: [['strong', 'Comparative linguistics']], actions: [{ overlay: 'words' }] },
      { cam: EURASIA, year: 2026, beams: wordBeams('horse'),
        h: 'Satem and centum',
        html: `<p>PIE <i>*ḱ</i> became <b>s/ś</b> in the east (Sanskrit <i>śata</i>, Avestan <i>satəm</i>, Lithuanian <i>šimtas</i> “hundred”) but stayed <b>k</b> in the west (Latin <i>centum</i>, Greek <i>hekatón</i>). Hence <i>áśva</i> vs <i>equus</i> for “horse”. Tocharian in China and Hittite in Turkey are “centum” — so this is a sound change, not an east/west family split.</p>` },
      { cam: { lon: 30, lat: 40, zoom: 1.4 }, year: 2026,
        h: 'How “Aryan” was stolen', imgs: ["behistun", "s-persepolis", "faravahar-persepolis"],
        html: `<p><i>Ārya</i> was the Vedic and Avestan people’s word for themselves — “noble, one of us”. Darius called himself “an Aryan, of Aryan lineage”; <b>Iran</b> means “(land) of the Aryans”. (Ireland is <em>not</em> related.)</p>
          <p>In the 19th century European writers turned a language label into a “race”. Max Müller, who had popularised the phrase, later recanted: speaking of an Aryan race is as wrong as speaking of a “dolichocephalic grammar”. Nazi race law took the misuse to its end point. The same racialised thinking produced the idea of a “Dravidian race”.</p>`,
        chips: [['strong', 'History of scholarship']] },
    ] },
  // ---------------------------------------------------------------- 10
  { title: 'The Sky Father’s family', short: 'Gods', era: '~4000 BCE → today',
    steps: [
      { cam: EURASIA, year: -1000, beams: godBeams('dyeus'),
        h: 'Dyauṣ Pitā = Zeus Patēr = Jupiter', imgs: ["dyeus"],
        html: `<p>Reconstruct the vocabulary and a family of gods appears. <b>*Dyḗus Ph₂tḗr</b>, “Father Sky”, survives as Vedic <b>Dyauṣ Pitā</b>, Greek <b>Zeus Patēr</b>, Roman <b>Jupiter</b> (<i>Dyeu-pater</i>), Baltic <b>Dievas</b>. In Hittite his name simply became the word for “god”.</p>
          <p>In India he faded into a distant ancestor; in Greece and Rome he became king.</p>`,
        chips: [['strong', 'West 2007']], actions: [{ overlay: 'gods', arg: 'dyeus', label: 'Explore the divine family' }, { overlay: 'gallery', arg: 'dyeus', label: 'Faces of the gods' }] },
      { cam: EURASIA, year: -1000, beams: godBeams('dawn'),
        h: 'Dawn and the horse-twins', imgs: ["eos-kephalos-niobid", "aurora-fragonard", "ashvins-harivamsha", "dioscuri-campidoglio", "trundholm-1", "surya-edinburgh", "helios-troy-metope", "konark-wheel"],
        html: `<p><b>Uṣas</b>, “daughter of the Sky”, is Greek <b>Ēōs</b> and Roman <b>Aurora</b>. Her brothers the <b>Aśvins</b> — horse-riding twins who rescue sailors — are the Greek <b>Dioskouroi</b> and the Lithuanian <b>Ašvieniai</b>. The Sun, Sūrya, is Hēlios, Sōl and the Norse Sól.</p>`,
        actions: [{ overlay: 'gallery', arg: 'dawn', label: 'See Dawn in art' }, { overlay: 'gallery', arg: 'twins', label: 'See the Twins' }, { overlay: 'gallery', arg: 'sun', label: 'See the Sun' }] },
      { cam: EURASIA, year: -1000, beams: godBeams('dragon'),
        h: '“He slew the serpent”', imgs: ["dragon"],
        html: `<p>The poets inherited whole phrases. Indra <i>áhann áhim</i> — “slew the serpent” Vṛtra and freed the waters; the Iranian hero Θraētaona <i>jana aži</i>; Zeus kills Typhon, Thor fights the world-serpent, the Hittite storm god kills Illuyanka.</p>
          <p>Achilles seeks <i>kléos áphthiton</i>, “imperishable fame”; the Rigveda prays for <i>śrávas ákṣitam</i> — the same words.</p>`,
        chips: [['strong', 'Watkins 1995']], actions: [{ overlay: 'gallery', arg: 'dragon', label: 'Serpent-slayers in art' }, { overlay: 'gallery', arg: 'thunder', label: 'Thunder gods' }] },
      { cam: EURASIA, year: -1000, beams: godBeams('yemo'),
        h: 'The first sacrifice', imgs: ["yemo"],
        html: `<p>“Twin” (<i>*Yemo</i>) and “Man” (<i>*Manu</i>): Vedic <b>Yama</b>, first mortal and lord of the dead, and <b>Manu</b>, father of humankind; Iranian <b>Yima</b>; the Norse giant <b>Ymir</b>, whose body becomes earth and sky — as the cosmic man of the <b>Puruṣa Sūkta</b> becomes the world and the four varṇas.</p>
          <p>Dumézil read a three-part ideology — priests, warriors, producers — into these myths, mirroring the varṇas. Useful, but debated.</p>`,
        chips: [['moderate', 'Lincoln 1975'], ['debated', 'Dumézil']], actions: [{ overlay: 'gallery', arg: 'yemo', label: 'Yama, Yima, Ymir in art' }] },
    ] },
  // ---------------------------------------------------------------- 11
  { title: 'The Great Inversion', short: 'Deva & Ahura', era: '~1500 BCE → today',
    steps: [
      { cam: { lon: 64, lat: 32, zoom: 2.6 }, year: -1000, beams: godBeams('deiwos'), focus: ['c-ach', 'f-iranian'],
        h: 'Gods in India, demons in Iran', imgs: ["avesta-ms-j2", "faravahar-persepolis", "yazd-atash-behram", "indra-airavata-mathura"],
        html: `<p>Vedic and Avestan share a vocabulary — yet sort it into opposite camps. In India <b>deva</b> means god; in Iran <b>daēva</b> means demon, and Indra and the Nāsatyas are named among them. In Iran <b>Ahura</b> Mazdā is the one good Lord; in India the <b>asuras</b> slowly become demons.</p>
          <p>Mitra, Soma/Haoma, Ṛta/Aša and Yama/Yima stay on the same side in both.</p>`,
        chips: [['strong', 'Fact'], ['debated', 'Cause']], actions: [{ overlay: 'inversion', label: 'Flip the cards: India ⇄ Iran' }] },
      { cam: { lon: 40, lat: 33, zoom: 1.7 }, year: 200, yearFrom: -600, focus: ['c-ach', 's-persepolis', 's-behistun', 'f-mithras', 's-ostia', 's-ctesiphon'],
        h: 'Zarathustra’s long shadow', imgs: ["mithra-taq-e-bostan", "mithras-vienna", "faravahar-persepolis", "s-ctesiphon", "s-ostia"],
        html: `<p>Zarathustra (probably c. 1500–1000 BCE; debated) taught one good god, a cosmic struggle of truth against the lie, individual judgment at a bridge, a coming saviour and bodily resurrection. After Cyrus freed the Jews in 539 BCE, ideas like these — and the word “paradise” (Avestan <i>pairi-daēza</i>) — appear in Jewish texts, and through them in Christianity and Islam. How much was borrowed is <b>debated</b>.</p>
          <p>Rome’s soldiers worshipped <b>Mithras</b> under Mithra’s name — a new cult with Persian branding, most scholars now think.</p>`,
        chips: [['debated', 'Degree of influence']] },
      { cam: { lon: 64, lat: 25, zoom: 3 }, year: 950, yearFrom: 650, focus: ['f-zoro-india', 's-sanjan', 's-yazd'],
        h: 'The Parsis come to Gujarat', imgs: ["yazd-atash-behram", "sasanian-fire-altar-shapur2", "s-sanjan"],
        html: `<p>After the Arab conquest of Iran, Zoroastrian refugees landed at <b>Sanjan</b> (date debated: 716, 785 or 936 CE). DNA confirms the story: Parsis are closest to Iranians, with Indian mixing ~1,200 years ago — Iranian fathers, many Indian mothers.</p>`,
        chips: [['strong', 'Chaubey 2017']] },
    ] },
  // ---------------------------------------------------------------- 12
  { title: 'The braid: how Hinduism formed', short: 'Hinduism', era: '2600 BCE → today',
    steps: [
      { cam: TAMIL, year: 200, focus: ['c-sangam', 's-palani', 's-tiruchendur', 's-madurai'],
        h: 'The five landscapes and their gods', imgs: ["murugan-thanjavur", "krishna-chola-honolulu", "indra-airavata-mathura", "varuna-bhojeshwar", "mahishasuramardini-mamallapuram", "hero-stone-salem"],
        html: `<p>Classical Tamil poetry gives every landscape a god: <b>Murukaṉ</b> of the mountains, dark <b>Māyōṉ</b> of the pastures, <b>Vēntaṉ</b> of the farmland, <b>Varuṇaṉ</b> of the sea, and the war-goddess <b>Koṟṟavai</b> of the parched land.</p>
          <p>Over the next centuries Murukaṉ merges with Skanda, Māyōṉ with Kṛṣṇa–Viṣṇu, Koṟṟavai with Durgā.</p>`,
        chips: [['strong', 'Tolkāppiyam; Zvelebil, Hart']], overlay: 'tinai', actions: [{ overlay: 'tinai', label: 'The five landscapes' }, { overlay: 'gallery', arg: 'tamil', label: 'Tamil gods in bronze & stone' }] },
      { cam: SOUTH, year: 900, yearFrom: 300, focus: ['c-pallava', 'c-chola', 's-mamalla', 's-chidam', 's-srirangam', 's-thanjavur', 's-kannur', 's-samaya'],
        h: 'Many streams, one river', imgs: ["nataraja-lacma", "ayyanar-horses", "theyyam-muchilottu", "hero-stone-reddipatty", "s-thanjavur", "s-mamalla", "agni-chennai"],
        html: `<p>Hinduism is a confluence: Vedic sacrifice and its gods (Agni, Indra, Rudra); possible Indus practices (bathing, sacred trees); Tamil and other regional gods; village goddesses like Mariyammaṉ; hero-stones and possession rites (Theyyam still lives in Kerala); and temple worship of images by the Āgamas.</p>
          <p>Local gods were absorbed as forms of Śiva, Viṣṇu or the Goddess (“Sanskritisation”) — and local practice reshaped Sanskritic religion in turn. Śiva himself fuses Vedic Rudra with non-Vedic traits.</p>`,
        actions: [{ overlay: 'river' }] },
      { cam: INDIA, year: 1550, yearFrom: 600, focus: ['f-bhakti', 's-chidam', 's-srirangam', 's-sriper', 's-udupi', 's-alandi', 's-varanasi', 's-nabadwip', 's-nankana', 's-kalady'],
        h: 'Bhakti: a Tamil gift to all of India', imgs: ["appar-chennai", "sambandar-guimet", "l-iyengar", "s-srirangam", "s-varanasi", "guru-nanak-janamsakhi"],
        html: `<p>Between the 6th and 9th centuries, the Tamil <b>Āḻvārs</b> (12 Vaiṣṇava poet-saints, one of them a woman, Āṇṭāḷ) and <b>Nāyaṉmārs</b> (63 Śaiva saints) sang a personal, emotional devotion — in Tamil, open to all castes.</p>
          <p>It travelled north: Rāmānuja, Basava and Jñāneśvar, then Kabīr, Mīrābāī, Caitanya and Tulsīdās — and Guru Nānak (b. 1469), founder of Sikhism, whose scripture includes Kabīr’s verses.</p>`,
        chips: [['strong', 'Bhakti movement']] },
    ] },
  // ---------------------------------------------------------------- 13
  { title: 'Branches across Asia', short: 'Branches', era: '500 BCE → 1500 CE',
    steps: [
      { cam: { lon: 84, lat: 25.5, zoom: 6 }, year: -400, yearFrom: -600, focus: ['c-magadha', 's-lumbini', 's-bodhgaya', 's-sarnath', 's-pavapuri', 's-patali'],
        h: 'The renouncers', imgs: ["sarnath-lion", "ashoka-edict-gujarra", "mahavira-brussels", "s-bodhgaya", "s-lumbini"],
        html: `<p>In the eastern Ganga plain, outside the Vedic heartland, wandering ascetics (<b>śramaṇas</b>) questioned sacrifice and caste. The <b>Buddha</b> (died c. 420–368 BCE by current reckoning) and <b>Mahāvīra</b> founded Buddhism and Jainism; the Ājīvikas taught fate.</p>
          <p>Emperor <b>Aśoka</b> (r. c. 268–232 BCE) carved edicts in the earliest securely dated Indian script, Brāhmī — the ancestor of Devanagari, Tamil, Telugu, Tibetan, Thai and Khmer scripts.</p>`,
        chips: [['moderate', 'Dates of the Buddha']] },
      { cam: { lon: 95, lat: 22, zoom: 1.3 }, year: 850, yearFrom: -270, focus: ['f-bud-sl', 'f-bud-silk', 'f-bud-ea', 'f-bud-tib', 'f-sea', 'f-java', 's-anura', 's-dunhuang', 's-nara', 's-borobudur', 's-angkor', 's-prambanan', 's-oceo', 's-samye'], legend: 'belief',
        h: 'Out of India',
        html: `<p>Buddhism reaches Sri Lanka (c. 250 BCE), the Silk Road and China (1st c. CE), Korea (372), Japan (538/552) and Tibet (7th–8th c.). Merchants and Brahmins carry Śiva and Viṣṇu across the Bay of Bengal — Funan, Champa, Java, Bali — culminating in <b>Angkor Wat</b> (c. 1113–1150).</p>` },
      { cam: { lon: 70, lat: 34, zoom: 4 }, year: 150, yearFrom: -200, focus: ['c-indogreek', 'c-kushan', 's-taxila', 's-hadda', 's-aikh', 's-vidisha'],
        h: 'Where Greek and Indian gods met', imgs: ["herakles-vajrapani", "agathocles-balarama", "heliodorus-pillar", "kanishka-buddha-ashmolean", "huvishka-oesho", "gandhara-buddha-guimet", "shukongojin-todaiji"],
        html: `<p>In Gandhāra, Greek kings minted the first images of Kṛṣṇa (Agathocles, c. 180 BCE). A Greek envoy, Heliodorus, raised a pillar to Vāsudeva at Vidisha (c. 113 BCE). Kushan coins show Śiva (Oešo), Mithra, the Buddha and the Mesopotamian Nana side by side.</p>
          <p>Gandhāran sculptors gave the Buddha a Greek robe — and turned <b>Herakles into Vajrapāṇi</b>, the Buddha’s protector, who reached Japan as the temple guardian Shukongōshin.</p>`,
        chips: [['strong', 'Coins, inscriptions, sculpture']], actions: [{ overlay: 'gallery', arg: 'crossover', label: 'Greek ⇄ Indian art' }] },
    ] },
  // ---------------------------------------------------------------- 14
  { title: 'Lineages: Brahmins and other lines', short: 'Lineages', era: '1200 BCE → today',
    steps: [
      { cam: { lon: 81, lat: 27.5, zoom: 4.2 }, year: 2026, beams: lb('vedic'),
        h: 'The priestly families', imgs: ["rigveda", "s-kuru", "s-janak", "l-mithila"],
        html: `<p>Brahmin families trace themselves to <b>gotras</b> — lineages of seven or eight legendary ṛṣis — and to Vedic schools (śākhās). Gotra lists are codified by the 6th–4th c. BCE; the ban on marrying within a gotra appears in the Dharmasūtras (c. 3rd–1st c. BCE).</p>
          <p>From the Kuru heartland they spread east with later Vedic culture to Mithila — origin of the Maithil Brahmins.</p>
          <p class="note">Solid beams = documentary evidence. Dashed grey = tradition or legend.</p>`,
        chips: [['strong', 'Witzel; Brough 1953']], actions: [{ overlay: 'lineages', arg: 'vedic', label: 'Open the lineage explorer' }] },
      { cam: { lon: 78, lat: 15, zoom: 3.6 }, year: 2026, beams: lb('south'),
        h: 'Land grants pulled Brahmins south', imgs: ["l-pallava-plates", "l-kanchi", "l-talagunda", "s-thanjavur", "l-iyengar", "l-sringeri", "l-kerala-plates"],
        html: `<p>The south has its legend — Agastya crossing the Vindhyas — and its evidence: Sangam poems mention Brahmins; then Pallava, Pandya and Chola kings granted whole villages (<i>brahmadeya</i>) to Brahmin families. At Uttaramerur (919–921 CE) the village assembly’s election rules are carved in stone; one Chola grant settles 1,080 Brahmins.</p>
          <p>Iyengars follow Rāmānuja’s Śrīvaiṣṇavism; Iyers are Smārtas. In Kerala, the <b>Nambudiris</b>’ 32 villages appear in inscriptions from the 9th century.</p>`,
        chips: [['strong', 'Copper plates & inscriptions']], actions: [{ overlay: 'lineages', arg: 'kerala', label: 'Nambudiris & Saraswats' }] },
      { cam: { lon: 75, lat: 22, zoom: 3 }, year: 2026, beams: lb('saraswat'),
        h: 'Saraswats, Chitpāvans and the five-and-five', imgs: ["l-shaniwar", "l-vadnagar", "s-udupi", "s-kalash"],
        html: `<p>Medieval texts split Brahmins into <b>Pañca-Gauḍa</b> (north of the Vindhyas: Sārasvata, Kānyakubja, Gauḍa, Utkala, Maithila) and <b>Pañca-Drāviḍa</b> (Drāviḍa, Karṇāṭa, Telaṅga, Mahārāṣṭra, Gurjara). Saraswats spread from the north-west to Kashmir and — in tradition — to Goa, then fled the Portuguese Inquisition down to Kerala.</p>
          <p>Genetically, Brahmins carry the most steppe ancestry of any Indian group — R1a reaches ~35% or more in some samples — yet most of their ancestry is the same local mix as their neighbours.</p>`,
        chips: [['debated', 'Earliest source of the 5+5 scheme'], ['strong', 'Genetics']] },
      { cam: INDIA, year: 2026, beams: lb('dalit'),
        h: 'The other lines', imgs: ["l-chittor", "l-abu", "l-shekhawati", "l-chettinad", "l-ambedkar", "l-ayyankali", "l-koregaon", "l-deeksha"],
        html: `<p>Rajput clans emerged in the 7th–10th centuries; Jats appear in Sindh in Arab sources and moved into Punjab; Reddys, Kammas, Vellalars and Nairs rose as landed elites in medieval kingdoms; Agarwal, Marwari and Chettiar merchants built networks reaching Burma and Malaya.</p>
          <p>Untouchability shows up in texts from c. 6th c. BCE and in Faxian’s report c. 400 CE. Modern Dalit movements — Ayyankali, Iyothee Thass, the Matuas, Ambedkar — fought it; on 14 Oct 1956 ~400,000–500,000 people converted to Buddhism with Ambedkar at Nagpur.</p>`,
        actions: [{ overlay: 'lineages', arg: 'rajput', label: 'Rajputs, merchants, Adivasis…' }] },
      { cam: { lon: 72, lat: 15, zoom: 1.8 }, year: 2026, beams: lb('diaspora'),
        h: 'Those who came later', imgs: ["s-sanjan", "l-janjira", "l-malikambar", "l-paradesi", "l-jewplates", "l-benei", "l-bylakuppe", "l-dharamsala"],
        html: `<p>India kept absorbing newcomers, and DNA confirms many of their stories: <b>Parsis</b> from Iran, <b>Siddis</b> of East African (Bantu-related) descent, <b>Bene Israel</b> and <b>Cochin Jews</b>, Turkic and Central Asian elites, <b>Tibetans</b> after 1959. South Asian Muslims are overwhelmingly of local ancestry, like their neighbours.</p>`,
        chips: [['strong', 'Shah 2011 · Chaubey 2017 · Waldman 2016']] },
    ] },
  // ---------------------------------------------------------------- 15
  { title: 'Colour, caste and the colonial lens', short: 'Colour', era: '1200 → today',
    steps: [
      { cam: INDIA, year: 1400, yearFrom: 1150, focus: ['c-sultan'],
        h: 'Where colourism came from',
        html: `<p>One of the videos argues colourism has ancient roots in migrations and caste, and was intensified by Turkic and then British rulers. What holds up?</p>
          <ul><li>Lighter-skin alleles are more common in the north-west and in groups with more West Eurasian ancestry, and caste rank partly tracks ancestry — so a link between colour and caste <em>could</em> have formed. Whether ancient Indians actually ranked people by colour is speculation (the Rigvedic <i>varṇa</i> “colour” is disputed). Many beloved gods — Kṛṣṇa, Rāma, Kālī — are dark.</li>
          <li>For a Sultanate-era shift there is opinion, not quantitative evidence.</li></ul>`,
        chips: [['debated', 'Ancient roots'], ['fringe', 'Sultanate cause — unmeasured']] },
      { cam: INDIA, year: 1931, yearFrom: 1860, focus: ['c-raj'],
        h: 'The census that hardened caste', imgs: ["l-census"],
        html: `<p>From 1871 the British counted India by caste. In 1901 Census Commissioner H.H. Risley tried to <b>rank castes</b> by “social precedence” and linked caste to race with nose measurements — triggering waves of petitions for higher rank. Caste became an administrative category tied to jobs and power.</p>
          <p>The last full caste count was 1931. India’s <b>Census 2027</b> will count caste again for the first time since.</p>`,
        chips: [['strong', 'Dirks, Castes of Mind (2001)']], actions: [{ overlay: 'claims', label: 'Check every claim from the videos' }] },
    ] },
  // ---------------------------------------------------------------- 16
  { title: 'Threads, and back to today', short: 'Threads', era: 'Always',
    steps: [
      { cam: { lon: 45, lat: 37, zoom: 1.4 }, year: 1700, yearFrom: 500, focus: ['f-pancha', 'f-num', 's-baghdad', 's-pisa'],
        h: 'Stories and numbers that travelled', imgs: ["s-baghdad"],
        html: `<p>The <b>Pañcatantra</b> fables went from Sanskrit to Pahlavi (c. 570), Arabic (<i>Kalīla wa-Dimna</i>, c. 750), Latin and at last La Fontaine (1678). Indian <b>numerals and zero</b> (Brahmagupta, 628) went via Baghdad (al-Khwārizmī, c. 825) to Fibonacci in Pisa (1202).</p>` },
      { cam: { lon: 85, lat: 36, zoom: 1.2 }, year: 1700, yearFrom: 0, focus: ['f-wind', 'f-josaphat', 's-hadda'],
        h: 'A Greek wind god in Japan; the Buddha as a saint', imgs: ["boreas-munich", "kanishka-oado", "fujin-raijin-sotatsu"],
        html: `<p>The Greek north wind <b>Boreas</b>, cloak billowing, became the Kushan wind god Oado and then Japan’s <b>Fūjin</b>. The Buddha’s life story, retold via Arabic and Georgian, became the Christian legend of <b>Saint Josaphat</b> — <i>Josaphat</i> from <i>Bodhisattva</i>.</p>`,
        chips: [['strong', 'Josaphat'], ['moderate', 'Boreas → Fūjin']] },
      { cam: INDIA, year: 2026, yearFrom: 1800, field: 'today', legend: 'ancestry',
        h: 'One family, many tongues', imgs: ["l-mithila", "l-gond", "l-pithora", "l-sohrai", "l-hornbill", "s-kannur", "s-varanasi", "s-madurai"],
        html: `<p class="big">Every Indian carries the first footsteps out of Africa, the Indus farmers, and — in some measure — the herders of the steppe.</p>
          <p>Languages came from three directions and one grew at home. Gods were inherited from Eurasian ancestors and from India’s own hills, seashores and villages, then braided into faiths that spread across Asia. Groups mixed for two thousand years and then stopped — not because of who they were, but because of rules about who could marry whom.</p>
          <p>“Aryan” and “Dravidian” are names of languages. The people are one long, braided family.</p>`,
        actions: [{ overlay: 'india', label: 'India today' }, { overlay: 'mixer', label: 'Ancestry mixer' }, { overlay: 'claims', label: 'Claim check' }, { overlay: 'gallery', label: 'Faces of the gods' }, { overlay: 'credits', label: 'Image credits' }] },
    ] },
];
