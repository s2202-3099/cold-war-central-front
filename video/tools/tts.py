"""Synthesize a script with a local VOICEVOX engine (http://127.0.0.1:50021) and write src/timeline/<part>.json.
Usage: python3 -I tools/tts.py part1   (script/part1.txt -> public/audio/part1/*.wav, src/timeline/part1.json)
VOICEVOX: docker run -d --network host voicevox/voicevox_engine:cpu-latest
Speaker field: z / m, optionally with a style: z:なみだめ, m:ツンツン"""
import json, os, re, subprocess, sys, urllib.request, urllib.parse, hashlib
PART = sys.argv[1] if len(sys.argv) > 1 else 'single'
HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ENGINE = 'http://127.0.0.1:50021'
SPK = {'z': 3, 'm': 2}            # ずんだもん（ノーマル）, 四国めたん（ノーマル）
STYLE = {'z': {'ノーマル': 3, 'あまあま': 1, 'ツンツン': 7, 'セクシー': 5, 'ささやき': 22, 'ヒソヒソ': 38, 'ヘロヘロ': 75, 'なみだめ': 76},
         'm': {'ノーマル': 2, 'あまあま': 0, 'ツンツン': 6, 'セクシー': 4, 'ささやき': 36, 'ヒソヒソ': 37}}
SPEED = {'z': 1.15, 'm': 1.12}
FPS = 30; GAP = 0.28; CHAPTER = 3.2
READ = [('FM100-5', 'エフエム ひゃくのご'), ('MC48', 'エムシー ヨンジュウハチ'), ('縦深', 'じゅうしん'), ('米第', 'べいだい'),
        ('陸の上の島', 'りくのうえのしま'), ('山や要所', 'やまやようしょ'), ('山や森', 'やまやもり'), ('迫れば', 'せまれば'), ('ノルウェー海', 'ノルウェーかい'),
        ('その間', 'そのあいだ'), ('叩きながら', 'たたきながら'), ('その分', 'そのぶん'), ('攻め時', 'せめどき'), ('0.6日', 'れいてんろくにち'),
        ('1.5日', 'いってんごにち'), ('北翼', 'ほくよく'),
        ('REFORGER 82', 'リフォージャー はちじゅうに'), ('REFORGER 85', 'リフォージャー はちじゅうご'), ('REFORGER', 'リフォージャー'),
        ('ザーパド81', 'ザーパド はちじゅういち'), ('パーシングII', 'パーシングツー'), ('NATO', 'ナトー'), ('OMG', 'オーエムジー'),
        ('FOFA', 'フォーファ'), ('POMCUS', 'ポムカス'), ('PMP', 'ピーエムピー'), ('INF', 'アイエヌエフ'), ('T-80', 'ティー・ハチジュウ'),
        ('M1', 'エムワン'), ('第2梯団', 'だいにていだん'), ('梯団', 'ていだん'), ('在独', 'ざいどく'), ('内独国境', 'ないどくこっきょう'),
        ('渡河', 'とか'), ('核の敷居', 'かくのしきい'), ('敷居', 'しきい'), ('米ソ', 'べいそ'), ('物見やぐら', 'ものみやぐら'),
        ('第四次中東戦争', 'だいよじちゅうとうせんそう'), ('空挺', 'くうてい'), ('自動車化狙撃師団', 'じどうしゃかそげきしだん'),
        ('2＋4', 'ツープラスフォー'), ('A-10', 'エーテン'), ('BMP', 'ビーエムピー'), ('CENTAG', 'セントアグ'), ('NORTHAG', 'ノーサグ'), ('CFE', 'シーエフイー'),
        ('GIUK', 'ジーアイユーケー'), ('MC14/2', 'エムシー じゅうよんのに'), ('MC14/3', 'エムシー じゅうよんのさん'),
        ('MLRS', 'エムエルアールエス'), ('M2', 'エムツー'), ('OPアルファ', 'オーピーアルファ'), ('SIOP-62', 'サイオップ ろくじゅうに'), ('SS-20', 'エスエス にじゅう'),
        ('T-64', 'ティー・ロクジュウヨン'), ('T-72', 'ティー・ナナジュウニ'), ('U-2', 'ユーツー'), ('ブンデスヴェーア', 'ブンデスヴェーア'),
        ('地雷原', 'じらいげん'), ('柵', 'さく'), ('浮き橋', 'うきはし'), ('主攻', 'しゅこう'), ('質や', 'しつや'), ('届く分', 'とどくぶん')]
def reading(t):
    for a, b in READ: t = t.replace(a, b)
    return t
def post(path, params, body=None):
    u = ENGINE + path + '?' + urllib.parse.urlencode(params)
    req = urllib.request.Request(u, data=body if body is not None else b'', method='POST', headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(req, timeout=120) as r: return r.read()
def dur(p): return float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', p]))
def mouth(wav):
    """Per-frame mouth-open flags (for lip sync): RMS of each 1/30 s window above a threshold."""
    raw = subprocess.check_output(['ffmpeg', '-v', 'error', '-i', wav, '-ac', '1', '-ar', '12000', '-f', 's16le', '-'])
    import array
    a = array.array('h'); a.frombytes(raw); n = 12000 // FPS
    rms = [(sum(x * x for x in a[i:i + n]) / max(1, len(a[i:i + n]))) ** 0.5 for i in range(0, len(a), n)]
    peak = max(rms) if rms else 1
    return ''.join('1' if r > peak * 0.18 else '0' for r in rms)
SCRIPT = os.path.join(HERE, 'script', ('script' if PART == 'single' else PART) + '.txt')
AUDIO = os.path.join(HERE, 'public', 'audio', PART)
items = []; chap = None
for raw in open(SCRIPT, encoding='utf-8'):
    raw = raw.rstrip('\n')
    if not raw.strip() or raw.startswith('# '): continue
    f = raw.split('|')
    if f[0] == '#': chap = {'num': f[1], 'title': f[2], 'sub': f[3]}; items.append({'type': 'chapter', **chap}); continue
    spk, _, style = f[0].partition(':')
    assert spk in SPK and (not style or style in STYLE[spk]), raw
    items.append({'type': 'line', 'spk': spk, 'style': style or 'ノーマル', 'v': f[1] or None, 'text': '|'.join(f[2:]), 'chapter': chap['title'] if chap else ''})
os.makedirs(AUDIO, exist_ok=True)
t = 0.6; out = []; vis = None; n = 0
for it in items:
    if it['type'] == 'chapter':
        out.append({**it, 'start': round(t * FPS), 'dur': round(CHAPTER * FPS)}); t += CHAPTER; continue
    n += 1; vis = it['v'] or vis
    sid = STYLE[it['spk']][it['style']]
    key = hashlib.md5((str(sid) + reading(it['text']) + str(SPEED[it['spk']])).encode()).hexdigest()[:10]
    wav = os.path.join(AUDIO, f'{n:03d}_{key}.wav')
    if not os.path.exists(wav):
        q = json.loads(post('/audio_query', {'speaker': sid, 'text': reading(it['text'])}))
        q['speedScale'] = SPEED[it['spk']]; q['prePhonemeLength'] = 0.05; q['postPhonemeLength'] = 0.08; q['outputSamplingRate'] = 48000
        open(wav, 'wb').write(post('/synthesis', {'speaker': sid}, json.dumps(q).encode()))
    d = dur(wav)
    out.append({'type': 'line', 'spk': it['spk'], 'style': it['style'], 'text': it['text'], 'v': vis, 'chapter': it['chapter'],
                'audio': f'audio/{PART}/' + os.path.basename(wav), 'start': round(t * FPS), 'dur': round(d * FPS), 'mouth': mouth(wav)})
    t += d + GAP
total = round((t + 1.5) * FPS)
keep = {os.path.basename(o['audio']) for o in out if o['type'] == 'line'}
for f in os.listdir(AUDIO):
    if f not in keep: os.remove(os.path.join(AUDIO, f))
os.makedirs(os.path.join(HERE, 'src', 'timeline'), exist_ok=True)
json.dump({'fps': FPS, 'total': total, 'items': out}, open(os.path.join(HERE, 'src', 'timeline', PART + '.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
print(f'{PART}: {n} lines, {sum(len(o["text"]) for o in out if o["type"] == "line")} chars, {total / FPS / 60:.1f} min')
