"""Synthesize the script with a local VOICEVOX engine (http://127.0.0.1:50021) and write src/timeline.json.
Usage: python3 -I tools/tts.py   (VOICEVOX: docker run -d --network host voicevox/voicevox_engine:cpu-latest)"""
import json, os, re, subprocess, urllib.request, urllib.parse, hashlib
HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ENGINE = 'http://127.0.0.1:50021'
SPK = {'z': 3, 'm': 2}            # ずんだもん（ノーマル）, 四国めたん（ノーマル）
SPEED = {'z': 1.15, 'm': 1.12}
FPS = 30; GAP = 0.28; CHAPTER = 3.2
READ = [('REFORGER 82', 'リフォージャー はちじゅうに'), ('REFORGER 85', 'リフォージャー はちじゅうご'), ('REFORGER', 'リフォージャー'),
        ('ザーパド81', 'ザーパド はちじゅういち'), ('パーシングII', 'パーシングツー'), ('NATO', 'ナトー'), ('OMG', 'オーエムジー'),
        ('FOFA', 'フォーファ'), ('POMCUS', 'ポムカス'), ('PMP', 'ピーエムピー'), ('INF', 'アイエヌエフ'), ('T-80', 'ティー・ハチジュウ'),
        ('M1', 'エムワン'), ('第2梯団', 'だいにていだん'), ('梯団', 'ていだん'), ('在独', 'ざいどく'), ('内独国境', 'ないどくこっきょう'),
        ('渡河', 'とか'), ('核の敷居', 'かくのしきい'), ('敷居', 'しきい'), ('米ソ', 'べいそ'), ('物見やぐら', 'ものみやぐら'),
        ('第四次中東戦争', 'だいよじちゅうとうせんそう'), ('空挺', 'くうてい'), ('自動車化狙撃師団', 'じどうしゃかそげきしだん'),
        ('地雷原', 'じらいげん'), ('柵', 'さく'), ('浮き橋', 'うきはし'), ('主攻', 'しゅこう'), ('質や', 'しつや'), ('届く分', 'とどくぶん')]
def reading(t):
    for a, b in READ: t = t.replace(a, b)
    return t
def post(path, params, body=None):
    u = ENGINE + path + '?' + urllib.parse.urlencode(params)
    req = urllib.request.Request(u, data=body if body is not None else b'', method='POST', headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(req, timeout=120) as r: return r.read()
def dur(p): return float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', p]))
items = []; chap = None
for raw in open(os.path.join(HERE, 'script', 'script.txt'), encoding='utf-8'):
    raw = raw.rstrip('\n')
    if not raw.strip() or raw.startswith('# '): continue
    f = raw.split('|')
    if f[0] == '#': chap = {'num': f[1], 'title': f[2], 'sub': f[3]}; items.append({'type': 'chapter', **chap}); continue
    items.append({'type': 'line', 'spk': f[0], 'v': f[1] or None, 'text': '|'.join(f[2:]), 'chapter': chap['title'] if chap else ''})
os.makedirs(os.path.join(HERE, 'public', 'audio'), exist_ok=True)
t = 0.6; out = []; vis = None; n = 0
for it in items:
    if it['type'] == 'chapter':
        out.append({**it, 'start': round(t * FPS), 'dur': round(CHAPTER * FPS)}); t += CHAPTER; continue
    n += 1; vis = it['v'] or vis
    key = hashlib.md5((it['spk'] + reading(it['text']) + str(SPEED[it['spk']])).encode()).hexdigest()[:10]
    wav = os.path.join(HERE, 'public', 'audio', f'{n:03d}_{key}.wav')
    if not os.path.exists(wav):
        q = json.loads(post('/audio_query', {'speaker': SPK[it['spk']], 'text': reading(it['text'])}))
        q['speedScale'] = SPEED[it['spk']]; q['prePhonemeLength'] = 0.05; q['postPhonemeLength'] = 0.08; q['outputSamplingRate'] = 48000
        open(wav, 'wb').write(post('/synthesis', {'speaker': SPK[it['spk']]}, json.dumps(q).encode()))
    d = dur(wav)
    out.append({'type': 'line', 'spk': it['spk'], 'text': it['text'], 'v': vis, 'chapter': it['chapter'],
                'audio': 'audio/' + os.path.basename(wav), 'start': round(t * FPS), 'dur': round(d * FPS)})
    t += d + GAP
total = round((t + 1.5) * FPS)
# remove stale audio
keep = {os.path.basename(o['audio']) for o in out if o['type'] == 'line'}
for f in os.listdir(os.path.join(HERE, 'public', 'audio')):
    if f not in keep: os.remove(os.path.join(HERE, 'public', 'audio', f))
json.dump({'fps': FPS, 'total': total, 'items': out}, open(os.path.join(HERE, 'src', 'timeline.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
print(f'{n} lines, {total / FPS / 60:.1f} min')
