#!/usr/bin/env python3
"""Search Wikimedia Commons for freely licensed images, politely (one request at a time).

Usage: python3 -I tools/search_commons.py queries.json out.json
queries.json: [[key, srsearch, caption, n], ...]; caption may use {t} for the cleaned file title.
"""
import html, json, re, sys, time, urllib.error, urllib.parse, urllib.request

API = 'https://commons.wikimedia.org/w/api.php'
UA = 'RootsEducationalAtlas/1.0 (local educational project)'
OK_LIC = re.compile(r'^(public domain|pd|cc0|cc by(-sa)?( \d\.\d)?|cc-by(-sa)?|attribution|no restrictions)', re.I)
SKIP = re.compile(r'\.(svg|pdf|djvu|tif|tiff|ogg|webm|ogv|gif)$|logo|icon|flag|map of|location', re.I)


def get(params):
    req = urllib.request.Request(API + '?' + urllib.parse.urlencode(params), headers={'User-Agent': UA})
    for attempt in range(8):
        try:
            with urllib.request.urlopen(req, timeout=40) as r:
                return json.load(r)
        except urllib.error.HTTPError as e:
            if e.code not in (429, 503):
                raise
            wait = int(e.headers.get('Retry-After') or 0) or 6 * (attempt + 1)
            print(f'  rate-limited, waiting {wait}s', file=sys.stderr, flush=True)
            time.sleep(min(wait, 60))
    return {}


def clean(t):
    t = re.sub(r'^File:', '', t)
    t = re.sub(r'\.\w{3,4}$', '', t)
    t = re.sub(r'[_]+', ' ', t)
    t = re.sub(r'\b(IMG|DSC|DSCN|P)\s?\d+\b', '', t)
    t = re.sub(r'\(\d{6,}\)', '', t)
    return re.sub(r'\s+', ' ', t).strip(' -,')


def main(qfile, ofile):
    queries = json.load(open(qfile))
    out = []
    for key, q, cap, n in queries:
        d = get({'action': 'query', 'format': 'json', 'generator': 'search', 'gsrnamespace': 6,
                 'gsrsearch': q + ' filetype:bitmap', 'gsrlimit': 12, 'prop': 'imageinfo',
                 'iiprop': 'extmetadata|size', 'iiextmetadatafilter': 'LicenseShortName'})
        pages = sorted((d.get('query', {}).get('pages', {}) or {}).values(), key=lambda p: p.get('index', 99))
        got = 0
        for p in pages:
            t = p['title']
            ii = (p.get('imageinfo') or [{}])[0]
            lic = (ii.get('extmetadata', {}).get('LicenseShortName', {}) or {}).get('value', '')
            if SKIP.search(t) or not OK_LIC.search(html.unescape(re.sub('<[^>]+>', '', lic or ''))):
                continue
            if (ii.get('width') or 0) < 500:
                continue
            out.append({'key': key, 'file': t, 'caption': cap.replace('{t}', clean(t))})
            got += 1
            if got >= n:
                break
        print(f'{key:16s} {got}/{n}  {q}', flush=True)
        time.sleep(1.6)
    json.dump(out, open(ofile, 'w'), ensure_ascii=False, indent=0)
    print('wrote', len(out))


if __name__ == '__main__':
    main(*sys.argv[1:3])
