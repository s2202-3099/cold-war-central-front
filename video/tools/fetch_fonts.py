"""Download Google Fonts subset to exactly the characters used in the video (one woff2 per family/weight).
Usage: python3 -I tools/fetch_fonts.py   (re-run after changing the script or visuals)"""
import json, os, re, urllib.request, urllib.parse
HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UA = {'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36'}
chars = set()
import glob
for p in glob.glob(os.path.join(HERE, 'src', 'timeline', '*.json')):
    for it in json.load(open(p, encoding='utf-8'))['items']:
        for k in ('text', 'title', 'sub', 'chapter'):
            chars |= set(it.get(k, ''))
for f in ['src/visuals.ts', 'src/Video.tsx', 'src/maps.ts', 'src/MapScene.tsx', 'src/map/runs.json', 'src/map/geo.json', 'public/photos/credits.json']:
    chars |= set(json.dumps(json.load(open(os.path.join(HERE, f), encoding='utf-8')), ensure_ascii=False) if f.endswith('.json') else open(os.path.join(HERE, f), encoding='utf-8').read())
chars |= set('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz%+-–—・、。「」（）／：？！…ⅠⅡⅢⅣⅤ▸ ')
text = ''.join(sorted(c for c in chars if c.isprintable()))
FONTS = [('M PLUS Rounded 1c', 'rounded', [800]), ('Noto Sans JP', 'sans', [400, 700, 900])]
import glob as _g
for old in _g.glob(os.path.join(HERE, 'public', 'fonts', '*.woff2')): os.remove(old)
manifest = []
for fam, key, weights in FONTS:
    for w in weights:
        chunks = [text[i:i + 400] for i in range(0, len(text), 400)]
        for n, chunk in enumerate(chunks):
            u = 'https://fonts.googleapis.com/css2?' + urllib.parse.urlencode({'family': f'{fam}:wght@{w}', 'text': chunk, 'display': 'block'})
            css = urllib.request.urlopen(urllib.request.Request(u, headers=UA), timeout=60).read().decode()
            srcs = re.findall(r'url\((https://[^)]+)\)', css)
            assert len(srcs) == 1, (fam, w, n, len(srcs))
            dst = f'fonts/{key}-{w}-{n}.woff2'
            open(os.path.join(HERE, 'public', dst), 'wb').write(urllib.request.urlopen(urllib.request.Request(srcs[0], headers=UA), timeout=60).read())
            rng = ', '.join(f'U+{ord(c):X}' for c in chunk)
            manifest.append({'family': key, 'weight': str(w), 'url': dst, 'unicodeRange': rng})
        faces = chunks
        print(fam, w, len(faces), 'files')
json.dump(manifest, open(os.path.join(HERE, 'src', 'fonts.json'), 'w'), indent=0)
print(len(text), 'characters')
