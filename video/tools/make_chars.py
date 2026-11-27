"""Compose character sprites from 坂本アヒル's PSDTool-style PSDs (ずんだもん 2.3, 四国めたん 2.1).
Usage: python3 -I tools/make_chars.py <zundamon.psd> <metan.psd>
Writes public/chars/<z|m>_<expr>_<closed|open|blink>.png (height 1100) and prints the sets.
PSDTool rules: '*name' = one of the siblings (radio), '!name' = always shown."""
import os, sys
from psd_tools import PSDImage
HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(HERE, 'public', 'chars'); os.makedirs(OUT, exist_ok=True)

def compose(psd, chosen, extra_on=(), extra_off=()):
    """chosen: list of '/'-joined paths of '*' layers to show. extra_on/off: names of plain layers to force."""
    def walk(group, path):
        for l in group:
            p = f'{path}/{l.name}' if path else l.name
            if l.name.startswith('*'):
                l.visible = any(c == p or c.startswith(p + '/') for c in chosen)
            elif l.name.startswith('!'):
                l.visible = True
            elif l.name in extra_on:
                l.visible = True
            elif l.name in extra_off:
                l.visible = False
            if l.is_group(): walk(l, p)
    walk(psd, '')
    img = psd.composite(force=True)
    bbox = img.getbbox()
    return img.crop(bbox) if bbox else img

def save(img, name, h=1100):
    w = round(img.width * h / img.height)
    img.resize((w, h)).save(os.path.join(OUT, name + '.png'))
    print(name, w, h)

Z_BASE = ['*服装1/*いつもの服', '*服装1/!左腕/*基本', '*服装1/!右腕/*基本', '!顔色/*ほっぺ', '!枝豆/*枝豆通常']
Z_EYE = ['!目/*目セット/*普通白目', '!目/*目セット/!黒目/*普通目']
Z = {  # expression: (eyes, brows, closed mouth, open mouth, extra layers on)
    'normal': (Z_EYE, '!眉/*普通眉', '!口/*むふ', '!口/*ほあ', ()),
    'namidame': (Z_EYE, '!眉/*困り眉1', '!口/*むー', '!口/*お', ('涙',)),
    'amaama': (['!目/*にっこり'], '!眉/*普通眉', '!口/*むふ', '!口/*ほあー', ()),
    'herohero': (['!目/*ぐるぐる'], '!眉/*困り眉2', '!口/*んー', '!口/*んあー', ('汗1',)),
    'tsuntsun': (['!目/*目セット/*ジト白目', '!目/*目セット/!黒目/*目逸らし'], '!眉/*怒り眉', '!口/*むー', '!口/*お', ()),
}
M_BASE = ['*白ロリ服/!右腕/*普通', '*白ロリ服/!左腕/*普通', '!顔色/*普通']
M = {
    'normal': (['!目/*目セット/*普通白目', '!目/*目セット/!黒目/*普通目'], '!眉/*ごきげん', '!口/*ほほえみ', '!口/*わあー', ()),
    'sasayaki': (['!目/*目セット/*普通白目', '!目/*目セット/!黒目/*普通目'], '!眉/*こまり', '!口/*む', '!口/*お', ()),
}
SYMBOLS = ('涙', '汗1', '汗2', '汗3', '汗', 'アヒルちゃん', 'かげり', 'パーカー裏地', 'まんじゅう', 'まんじゅう袋', 'うさみみ', '髪留めフリル')

zpsd, mpsd = PSDImage.open(sys.argv[1]), PSDImage.open(sys.argv[2])
for key, (psd, base, table, blink_eye) in {'z': (zpsd, Z_BASE, Z, ['!目/*UU']), 'm': (mpsd, M_BASE, M, ['!目/*目閉じ'])}.items():
    for expr, (eyes, brow, mc, mo, on) in table.items():
        off = tuple(s for s in SYMBOLS if s not in on)
        save(compose(psd, base + eyes + [brow, mc], on, off), f'{key}_{expr}_closed')
        save(compose(psd, base + eyes + [brow, mo], on, off), f'{key}_{expr}_open')
        save(compose(psd, base + blink_eye + [brow, mc], on, off), f'{key}_{expr}_blink')
