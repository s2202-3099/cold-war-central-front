"""Fallback when the Commons API is rate-limited: fetch files straight from upload.wikimedia.org
(the path is derived from the MD5 of the file name) and take licence/author from CREDITS below,
which were copied from each file's Commons metadata."""
import hashlib, json, os, subprocess, time, urllib.request, urllib.parse
HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(HERE, 'public', 'photos')
UA = {'User-Agent': 'educational-video-research/1.0 (python-urllib)'}
import importlib.util
spec = importlib.util.spec_from_file_location('fp', os.path.join(HERE, 'tools', 'photo_list.py')); fp = importlib.util.module_from_spec(spec); spec.loader.exec_module(fp)
def url(title, w=None):
    name = title[5:].replace(' ', '_'); h = hashlib.md5(name.encode()).hexdigest(); q = urllib.parse.quote(name)
    base = f'https://upload.wikimedia.org/wikipedia/commons'
    return f'{base}/thumb/{h[0]}/{h[:2]}/{q}/{w}px-{q}' + ('.png' if name.lower().endswith(('.svg',)) else '') if w else f'{base}/{h[0]}/{h[:2]}/{q}'
def get(u, path):
    with urllib.request.urlopen(urllib.request.Request(u, headers=UA), timeout=120) as r, open(path, 'wb') as f: f.write(r.read())
cp = os.path.join(OUT, 'credits.json'); credits = json.load(open(cp, encoding='utf-8')) if os.path.exists(cp) else {}
for k, (title, lic, artist) in fp.PHOTOS.items():
    dst = os.path.join(OUT, k + '.jpg')
    if os.path.exists(dst) and k in credits: continue
    tmp = dst + '.src'; ok = False
    for u in (url(title, 1920), url(title)):
        for i in range(3):
            try: get(u, tmp); ok = True; break
            except Exception as e: err = e; time.sleep(8 * (i + 1))
        if ok: break
    if not ok: print('FAIL', k, err); continue
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', tmp, '-vf', "scale='min(1920,iw)':-2", '-q:v', '3', dst], check=True); os.remove(tmp)
    credits[k] = {'title': title, 'page': 'https://commons.wikimedia.org/wiki/' + urllib.parse.quote(title.replace(' ', '_')), 'license': lic, 'artist': artist}
    json.dump(credits, open(cp, 'w', encoding='utf-8'), ensure_ascii=False, indent=1); print(k, lic); time.sleep(2)
