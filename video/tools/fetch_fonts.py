"""Download Google Fonts subset to exactly the characters used in the video (one woff2 per family/weight).
Usage: python3 -I tools/fetch_fonts.py   (re-run after changing the script or visuals)"""
import json, os, re, urllib.request, urllib.parse
HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UA = {'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36'}
chars = set()
tl = json.load(open(os.path.join(HERE, 'src', 'timeline.json'), encoding='utf-8'))
for it in tl['items']:
    for k in ('text', 'title', 'sub', 'chapter'):
        chars |= set(it.get(k, ''))
for f in ['src/visuals.ts', 'src/Video.tsx', 'public/photos/credits.json']:
    chars |= set(open(os.path.join(HERE, f), encoding='utf-8').read())
chars |= set('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz%+-–—・、。「」（）／：？！…ⅠⅡⅢⅣⅤ▸ ')
text = ''.join(sorted(c for c in chars if c.isprintable()))
FONTS = [('M PLUS Rounded 1c', 'rounded', [800]), ('Noto Sans JP', 'sans', [400, 700, 900])]

for fam, key, weights in FONTS:
    for w in weights:
        u = 'https://fonts.googleapis.com/css2?' + urllib.parse.urlencode({'family': f'{fam}:wght@{w}', 'text': text, 'display': 'block'})
        css = urllib.request.urlopen(urllib.request.Request(u, headers=UA), timeout=60).read().decode()
        srcs = re.findall(r'url\((https://[^)]+)\)', css)
        assert len(srcs) == 1, css[:300]
        dst = f'fonts/{key}-{w}.woff2'
        open(os.path.join(HERE, 'public', dst), 'wb').write(urllib.request.urlopen(urllib.request.Request(srcs[0], headers=UA), timeout=60).read())
        pass
        print(fam, w, os.path.getsize(os.path.join(HERE, 'public', dst)), 'bytes')
print(len(text), 'characters')
