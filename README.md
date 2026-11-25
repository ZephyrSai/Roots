# Roots — Tongues, Genes & Gods

An animated, map-driven journey through 72,000 years of South Asian and Indo-European history. It opens and closes on India today and covers:

- who arrived when (AASI, Iranian-related, steppe, East/Southeast Asian);
- how the Dravidian and Indo-Aryan languages took shape;
- how Indo-European gods share a family tree;
- how religions branched and braided;
- how Brahmin and other community lines spread.

## Run

Live: **https://zephyrsai.github.io/Roots/**

To run locally, serve the folder with any static server, for example:

```bash
python3 -m http.server 8814
```

Then open http://localhost:8814. You need internet access, because d3, topojson, the world-atlas base map and the images load from jsDelivr and Wikimedia.

## Controls

- `←` / `→` / space: step through the story.
- Drag the timeline to move through time.
- `P`: play through time.
- Drag the globe to spin it; scroll to zoom.
- `T`: tools.
- `E`: switch between Story and Free explore.
- `L`: labels. `B`: modern borders.
- Deep links: `#c4.2` opens chapter 4, step 2.

## Structure

| File | What |
|---|---|
| `js/map.js` | Canvas globe engine: camera flights and time-aware cultures, flows (moving particles), sites and rivers. Also draws the ancestry gradient field with population pies, and handles label collision and hit-testing. |
| `js/layers.js` | "Beams": animated arcs with name cards, used for gods, cognates and lineages. |
| `js/data/world.js` | Every site, culture, migration flow, river and mountain range, with dates and confidence levels. |
| `js/data/chapters.js` | The story: 16 chapters, 53 steps. |
| `js/data/ancestry.js` | Ancestry components and the population ranges. |
| `js/data/gods.js` | PIE deities and their reflexes, plus the cognate table. |
| `js/overlays/*` | Interactive tools: India today, ancestry mixer, lineages, language trees, word explorer, divine family, Great Inversion, five tiṇai, river of beliefs, claim check. |

For QA in a hidden browser pane, use `__roots.go(chapter, step)` and `__roots.tick(frames)`.

## Images

There are 313 unique images, used 322 times, all from Wikimedia Commons under public-domain, CC0, CC BY or CC BY-SA licences. They are hot-linked, not copied into the project. Each one carries the author and licence in the lightbox and on the **Image credits** page (`credits` overlay).

- `tools/image-candidates/*.json`: the candidate lists (the gods and myth search, the sites search, and my own sequential search for religion and lineage places).
- `tools/validate_images.py`: checks every file and its licence against the Commons API, then writes `js/data/images.js`. Run it like this:

  ```bash
  python3 -I tools/validate_images.py tools/image-candidates/gods_imgs.json tools/image-candidates/sites_imgs.json tools/image-candidates/more_clean.json
  ```

- `tools/search_commons.py`: a polite one-at-a-time search for adding more images.
- `js/media.js`: lookups, the `ALIAS` map that connects images to map sites and cultures, and the lightbox. Wikimedia only serves standard thumbnail widths (120/250/330/500/960), so `sized()` snaps to one of those. A width such as 360px fails.

Where the images appear:
- photo strips on 49 of the 53 story steps;
- thumbnails in map tooltips and site cards;
- photo avatars on the god, word and lineage beam cards;
- the "Faces of the gods" gallery (21 topics);
- the lineage steps, the five tiṇai, and the India-today mosaic.

Every image card shows a confidence level for its identification. For example, the Paśupati seal and the Eyrarland "Thor" are marked debated.

Gaps, where no free image was found:
- the Mitanni treaty tablet;
- ancient images of Dievas, Aušrinė and Uṣas;
- Ašvieniai roof ornaments;
- Pūṣan;
- the Kalibangan fire altar (only GODL-India licensed);
- Sanganakallu and Budihal;
- the Uttaramerur inscription;
- Liber Abaci.

Perun and Perkūnas have only modern statues, which are labelled as such.

## How confident is each claim?

Badges throughout the app:
- **strong**: consensus.
- **moderate**.
- **debated**.
- **fringe / unsupported**.

In Lineages, dashed grey marks community tradition or legend. Solid lines mark inscriptions or documents.

The population percentages in the mixer are **rough ranges, not published point values**. No primary paper gives a clean percentage table for named groups, so they are synthesised from the published bounds and shown with a "rough" badge.

## Main sources

**Genetics**
- Narasimhan et al. 2019 *Science*
- Shinde et al. 2019 *Cell* (Rakhigarhi)
- Kerdoncuff et al. 2025 *Cell* (2,762 LASI-DAD genomes)
- Reich et al. 2009 *Nature*
- Moorjani et al. 2013 *AJHG*
- Basu et al. 2016 *PNAS*
- Nakatsuka et al. 2017 *Nat Genet*
- Tätte et al. 2019 *Sci Rep*
- Basu Mallick et al. 2013 *PLoS Genet*
- Chaubey 2017 *Genome Biol* (Parsis)
- Shah 2011 / Narang 2011 (Siddis)
- Waldman 2016 (Bene Israel)

**Indo-European**
- Lazaridis et al. 2025 *Nature* (Caucasus–Lower Volga)
- Nikitin et al. 2025 *Nature*
- Haak 2015
- Olalde 2018
- Librado 2021 / 2024 (horses)
- Heggarty 2023 *Science* (alternative dating)
- Anthony 2007

**Dravidian and Indus**
- Kolipakam et al. 2018 *R Soc Open Sci*
- Southworth 2005
- Krishnamurti 2003
- Mukhopadhyay 2021 *HSSC*
- Parpola; Mahadevan
- Farmer, Sproat & Witzel 2004
- Solanki et al. 2025 (droughts)
- Keeladi and Sivagalai reports, shown as contested

**Myth and religion**
- West 2007 *Indo-European Poetry and Myth*
- Mallory & Adams 2006
- Watkins 1995
- Lincoln 1975 / 1976
- Jamison & Brereton 2014
- Dumézil (with critiques)
- Boyce; Beck 2006 (Mithras)
- Zvelebil; Hart (Sangam)
- Srinivas 1952
- Coedès 1968

**India today**
- Census of India 2011 (languages, religion, SC/ST)
- Anthropological Survey of India, *People of India* (4,635 communities)
- Bihar caste survey 2023
- Census 2027 schedule
- Witzel (Kuru); Brough 1953 (gotra)
- Veluthat (Nambudiris)
- Deshpande 2010 (Pañca-Gauḍa / Drāviḍa)
- Dirks 2001 (colonial census)

## The source videos

Four popular YouTube videos on Aryans, Dravidians, South Asian genetics and colourism were checked claim by claim in the **Claim check** tool:
- Several claims hold up: the migration was not an invasion; Brahmin groups carry higher steppe ancestry.
- Several are oversimplified: AASI timing; the makeup of ANI and ASI.
- Some are wrong:
  - the "2,500 years ago, Gupta" date;
  - "Zagros farmers 10,000 years ago";
  - "Kalash half steppe";
  - "Pashtuns 20% Anatolian".

## Not done yet / ideas

- Sound.
- A per-population "thread back through time" animation.
- More ancient-DNA points once new South Indian genomes are published.
- An offline copy of the CDN libraries.
