import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Audio} from '@remotion/media';
import {loadFont} from '@remotion/fonts';
import tSingle from './timeline/single.json';
import tPart1 from './timeline/part1.json';
import tPart2 from './timeline/part2.json';
import tPart3 from './timeline/part3.json';
import dims from '../public/photos/dims.json';
import assets from './assets.json';
import fontManifest from './fonts.json';
import {MapScene} from './MapScene';
import credits from '../public/photos/credits.json';
import {CARDS, PERIODS, SIM, Card, PHOTO_ANNO} from './visuals';

// Fonts subset to the characters used in this video (tools/fetch_fonts.py): M PLUS Rounded 1c and Noto Sans JP
const ROUNDED = 'CFRounded';
const SANS = 'CFSans';
(fontManifest as {family: string; weight: string; url: string; unicodeRange: string | null}[]).forEach((ft) =>
  loadFont({family: ft.family === 'rounded' ? ROUNDED : SANS, url: staticFile(ft.url), weight: ft.weight, ...(ft.unicodeRange ? {unicodeRange: ft.unicodeRange} : {})}),
);

export const CREDITS_SEC = 16;

type Line = {type: 'line'; spk: 'z' | 'm'; style?: string; text: string; v: string; chapter: string; audio: string; start: number; dur: number; mouth?: string};
type Chapter = {type: 'chapter'; num: string; title: string; sub: string; start: number; dur: number};
type Item = Line | Chapter;
type Tl = {total: number; items: unknown[]};
const TIMELINES: Record<string, Tl> = {single: tSingle as Tl, part1: tPart1 as Tl, part2: tPart2 as Tl, part3: tPart3 as Tl};
export const PART_TITLES: Record<string, string> = {single: '中欧正面 1949–1991', part1: '前編　二つの同盟が向かい合うまで', part2: '中編　作戦と計画', part3: '後編　もし戦っていたら'};

const C = {
  bg: '#10161d', panel: '#182129', ink: '#eef1f3', muted: '#9aa6b2', line: '#2b3742',
  wp: '#d0453a', nato: '#3d7fc4', z: '#5fae3c', m: '#d4508f', gold: '#d9b45a',
};
const SPK = {z: {name: 'ずんだもん', color: C.z}, m: {name: '四国めたん', color: C.m}};
const ease = Easing.bezier(0.16, 1, 0.3, 1);
const fade = (f: number, d: number, n = 12) =>
  interpolate(f, [0, n, d - n, d], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

// ---------- visual segments: consecutive lines sharing a visual ----------
type Seg = {v: string; start: number; end: number};
type Data = {items: Item[]; total: number; segs: Seg[]};
const buildData = (tl: Tl): Data => {
  const items = tl.items as Item[];
  const total = tl.total;
  const segs: Seg[] = [];
  items.forEach((it, i) => {
    if (it.type === 'chapter') return;
    const prev = segs[segs.length - 1];
    const prevItem = items[i - 1];
    if (prev && prev.v === it.v && prevItem?.type === 'line') return;
    segs.push({v: it.v, start: it.start, end: 0});
  });
  segs.forEach((sg, i) => {
    const nextChap = items.find((it) => it.type === 'chapter' && it.start > sg.start);
    const next = segs[i + 1];
    const cands = [next?.start, nextChap?.start, total].filter((x): x is number => typeof x === 'number');
    sg.end = Math.min(...cands);
  });
  return {items, total, segs};
};
const DATA: Record<string, Data> = Object.fromEntries(Object.entries(TIMELINES).map(([k, t]) => [k, buildData(t)]));
export const durationOf = (part: string) => DATA[part].total + CREDITS_SEC * 30;

// ---------- photo with Ken Burns and credit ----------
const Photo: React.FC<{id: string; dur: number; idx: number}> = ({id, dur, idx}) => {
  const f = useCurrentFrame();
  const cr = (credits as Record<string, {artist: string; license: string}>)[id];
  const zoomIn = idx % 2 === 0;
  return (
    <AbsoluteFill style={{overflow: 'hidden', backgroundColor: '#000'}}>
      <Img src={staticFile(`photos/${id}.jpg`)} style={{position: 'absolute', inset: -40, width: 'calc(100% + 80px)', height: 'calc(100% + 80px)', objectFit: 'cover', filter: 'blur(28px) brightness(0.45)'}} />
      <AbsoluteFill
        style={{
          scale: interpolate(f, [0, dur], zoomIn ? [1, 1.07] : [1.07, 1], {extrapolateRight: 'clamp'}),
          translate: interpolate(f, [0, dur], idx % 3 === 0 ? ['-10px 0px', '10px -6px'] : ['8px 4px', '-8px 0px'], {extrapolateRight: 'clamp'}),
        }}
      >
        <Img src={staticFile(`photos/${id}.jpg`)} style={{width: '100%', height: '100%', objectFit: 'contain'}} />
        {(PHOTO_ANNO[id] ?? []).map((a, i) => {
          const [iw, ih] = (dims as Record<string, number[]>)[id] ?? [1920, 780];
          const k = Math.min(1920 / iw, 780 / ih);
          const ox = (1920 - iw * k) / 2, oy = (780 - ih * k) / 2;
          const x = ox + a.x * iw * k, y = oy + a.y * ih * k, r = a.r * iw * k;
          const o = interpolate(f, [20 + i * 10, 34 + i * 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
          return (
            <div key={i} style={{position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: '50%', border: `6px solid ${C.gold}`, opacity: o, boxShadow: '0 0 0 3px rgba(0,0,0,0.5)', scale: interpolate(o, [0, 1], [1.3, 1])}}>
              <div style={{position: 'absolute', left: r * 2 + 12, top: r - 26, whiteSpace: 'nowrap', fontFamily: SANS, fontWeight: 900, fontSize: 38, color: C.gold, textShadow: '0 2px 8px #000, 0 0 3px #000'}}>{a.label}</div>
            </div>
          );
        })}
      </AbsoluteFill>
      {cr && (
        <div style={{position: 'absolute', right: 18, bottom: 14, fontFamily: SANS, fontSize: 19, color: 'rgba(255,255,255,0.85)', backgroundColor: 'rgba(0,0,0,0.55)', padding: '4px 12px', borderRadius: 4, maxWidth: 1100}}>
          写真：{cr.artist}／{cr.license}／Wikimedia Commons
        </div>
      )}
    </AbsoluteFill>
  );
};

// ---------- simulator screenshot(s) with notes ----------
const Sim: React.FC<{id: string; dur: number}> = ({id, dur}) => {
  const f = useCurrentFrame();
  const s = SIM[id];
  const [a, b] = s.imgs;
  const notes = (
    <div style={{display: 'flex', flexDirection: 'column', gap: 14}}>
      <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 44, color: C.ink, lineHeight: 1.25}}>{s.caption}</div>
      {(s.notes || []).map((n, i) => (
        <div key={i} style={{fontFamily: SANS, fontWeight: 700, fontSize: 32, color: C.ink, opacity: interpolate(f, [10 + i * 12, 24 + i * 12], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}), display: 'flex', gap: 12}}>
          <span style={{color: C.gold}}>▸</span>
          <span>{n}</span>
        </div>
      ))}
    </div>
  );
  const frame = (src: string, style: React.CSSProperties) => (
    <div style={{backgroundColor: '#f6f4ee', borderRadius: 10, padding: 10, boxShadow: '0 10px 40px rgba(0,0,0,0.5)', display: 'flex', ...style}}>
      <Img src={staticFile(`sim/${src}`)} style={{width: '100%', height: '100%', objectFit: 'contain'}} />
    </div>
  );
  const tall = a.startsWith('map') || ['p1964.png', 'p1979.png', 'r1985.png', 'r1985s.png', 'river_d41_map.png', 'r1976_map.png'].includes(a);
  if (s.pan) {
    return (
      <AbsoluteFill style={{flexDirection: 'row', padding: '30px 80px', gap: 60, alignItems: 'center'}}>
        <div style={{width: 640, height: 720, overflow: 'hidden', borderRadius: 10, backgroundColor: '#f6f4ee', boxShadow: '0 10px 40px rgba(0,0,0,0.5)'}}>
          <Img src={staticFile(`sim/${a}`)} style={{width: 640, translate: interpolate(f, [20, dur - 20], ['0px 0px', '0px -1500px'], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.quad)})}} />
        </div>
        <div style={{flex: 1}}>{notes}</div>
      </AbsoluteFill>
    );
  }
  if (tall) {
    return (
      <AbsoluteFill style={{flexDirection: 'row', padding: '24px 80px', gap: 50, alignItems: 'center'}}>
        {frame(a, {height: 740, width: 680})}
        <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 30, height: 740, justifyContent: b ? 'flex-start' : 'center'}}>
          {notes}
          {b && frame(b, {flex: 1, minHeight: 0})}
        </div>
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{padding: '24px 90px', gap: 22, flexDirection: 'column'}}>
      <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 44, color: C.ink}}>{s.caption}</div>
      {frame(a, {height: b ? 300 : s.notes ? 360 : 600, width: '100%'})}
      {b && frame(b, {flex: 1, minHeight: 0, width: '100%'})}
      {!b && s.notes && (
        <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
          {s.notes.map((n, i) => (
            <div key={i} style={{fontFamily: SANS, fontWeight: 700, fontSize: i === 0 ? 30 : 34, color: i === 0 ? C.muted : C.ink, opacity: interpolate(f, [10 + i * 12, 24 + i * 12], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>
              {i > 0 && <span style={{color: C.gold}}>▸ </span>}
              {n}
            </div>
          ))}
        </div>
      )}
    </AbsoluteFill>
  );
};

// ---------- cards ----------
const Heading: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 56, color: C.ink, borderLeft: `10px solid ${C.gold}`, paddingLeft: 24, lineHeight: 1.2}}>{children}</div>
);
const appear = (f: number, i: number) => ({
  opacity: interpolate(f, [8 + i * 8, 22 + i * 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
  translate: interpolate(f, [8 + i * 8, 22 + i * 8], ['0px 24px', '0px 0px'], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease}),
});

const CardView: React.FC<{card: Card}> = ({card}) => {
  const f = useCurrentFrame();
  const pad: React.CSSProperties = {padding: '40px 110px', gap: 34, flexDirection: 'column'};
  switch (card.kind) {
    case 'title':
      return (
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', gap: 26, background: `radial-gradient(circle at 50% 40%, #233140, ${C.bg})`}}>
          <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 128, color: C.ink, letterSpacing: 6, ...appear(f, 0)}}>{card.title}</div>
          <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 52, color: C.gold, ...appear(f, 1)}}>{card.sub}</div>
          <div style={{fontFamily: SANS, fontSize: 34, color: C.muted, ...appear(f, 2)}}>{card.foot}</div>
        </AbsoluteFill>
      );
    case 'periods':
    case 'period': {
      const hi = card.kind === 'period' ? card.i : -1;
      const strip = (
        <div style={{display: 'flex', gap: 14}}>
          {PERIODS.map((p, i) => (
            <div key={i} style={{flex: 1, padding: '16px 18px', borderRadius: 8, backgroundColor: i === hi ? C.gold : C.panel, color: i === hi ? '#111' : C.ink, border: `2px solid ${i === hi ? C.gold : C.line}`, opacity: hi < 0 || i === hi ? 1 : 0.5, ...(hi < 0 ? appear(f, i) : {})}}>
              <div style={{fontFamily: SANS, fontSize: 26, fontWeight: 700, opacity: 0.8}}>{['Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ', 'Ⅴ'][i]}　{p.yr}</div>
              <div style={{fontFamily: SANS, fontSize: 36, fontWeight: 900}}>{p.name}</div>
            </div>
          ))}
        </div>
      );
      if (hi < 0)
        return (
          <AbsoluteFill style={{...pad, justifyContent: 'center'}}>
            <Heading>五つの時期で東西を対照する</Heading>
            {strip}
            <div style={{fontFamily: SANS, fontSize: 34, color: C.muted, ...appear(f, 6)}}>核兵器の位置づけが変わるたびに、地上戦の考え方も変わった</div>
          </AbsoluteFill>
        );
      const p = PERIODS[hi];
      const col = (title: string, color: string, items: string[]) => (
        <div style={{flex: 1, backgroundColor: C.panel, borderTop: `8px solid ${color}`, borderRadius: 8, padding: '24px 30px', display: 'flex', flexDirection: 'column', gap: 18}}>
          <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 34, color}}>{title}</div>
          {items.map((t, i) => (
            <div key={i} style={{fontFamily: SANS, fontWeight: 700, fontSize: 33, color: C.ink, lineHeight: 1.35, ...appear(f, i + 1)}}>・{t}</div>
          ))}
        </div>
      );
      return (
        <AbsoluteFill style={pad}>
          {strip}
          <div style={{display: 'flex', gap: 30, flex: 1}}>
            {col('ソ連・ワルシャワ条約機構', C.wp, p.e)}
            {col('NATO・米国', C.nato, p.w)}
          </div>
        </AbsoluteFill>
      );
    }
    case 'table':
      return (
        <AbsoluteFill style={pad}>
          <Heading>{card.title}</Heading>
          <div style={{display: 'grid', gridTemplateColumns: card.cols ?? '170px 400px 1fr 110px', fontFamily: SANS, fontSize: 30, color: C.ink}}>
            {card.head.map((h) => (
              <div key={h} style={{fontWeight: 900, color: C.muted, padding: '8px 12px', borderBottom: `2px solid ${C.line}`}}>{h}</div>
            ))}
            {card.rows.map((r, i) =>
              r.map((c, j) => (
                <div key={`${i}-${j}`} style={{padding: '12px 12px', borderBottom: `1px solid ${C.line}`, fontWeight: j === 1 ? 700 : 400, color: j === 3 && c !== '—' && c !== '通常' ? C.wp : C.ink, ...appear(f, i)}}>{c}</div>
              )),
            )}
          </div>
          {card.note && <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 32, color: C.gold, ...appear(f, card.rows.length + 1)}}>{card.note}</div>}
        </AbsoluteFill>
      );
    case 'facts':
      return (
        <AbsoluteFill style={{...pad, justifyContent: 'center'}}>
          <Heading>{card.title}</Heading>
          {card.sub && <div style={{fontFamily: SANS, fontSize: 34, color: C.muted}}>{card.sub}</div>}
          <div style={{display: 'flex', gap: 22}}>
            {card.facts.map(([big, small], i) => (
              <div key={i} style={{flex: 1, backgroundColor: C.panel, borderRadius: 10, padding: '30px 26px', border: `2px solid ${C.line}`, ...appear(f, i + 1)}}>
                <div style={{fontFamily: SANS, fontWeight: 900, fontSize: big.length > 9 ? 40 : 54, color: C.wp}}><CountUp text={big} f={f - 8 - i * 8} /></div>
                <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 32, color: C.ink, marginTop: 10}}>{small}</div>
              </div>
            ))}
          </div>
          {card.note && <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 34, color: C.gold, ...appear(f, 6)}}>{card.note}</div>}
        </AbsoluteFill>
      );
    case 'bars':
      return (
        <AbsoluteFill style={{...pad, justifyContent: 'center'}}>
          <Heading>{card.title}</Heading>
          {card.rows.map((r, i) => (
            <div key={i} style={{display: 'grid', gridTemplateColumns: '460px 1fr', alignItems: 'center', gap: 24, ...appear(f, i)}}>
              <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 34, color: C.ink}}>{r.label}</div>
              <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
                {[['入れる前', r.before, C.muted], ['入れた後', r.after, C.wp]].map(([lab, v, col]) => (
                  <div key={lab as string} style={{display: 'flex', alignItems: 'center', gap: 16}}>
                    <div style={{fontFamily: SANS, fontSize: 24, color: C.muted, width: 110}}>{lab}</div>
                    <div style={{height: 34, borderRadius: 4, backgroundColor: col as string, width: interpolate(f, [10 + i * 10, 40 + i * 10], [0, Math.max(4, (v as number) * 15)], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease})}} />
                    <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 34, color: col as string}}>{v}%</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 32, color: C.gold, ...appear(f, 5)}}>{card.note}</div>
        </AbsoluteFill>
      );
    case 'people':
      return (
        <AbsoluteFill style={{...pad, justifyContent: 'center'}}>
          <Heading>{card.title}</Heading>
          {card.people.map((p, i) => (
            <div key={i} style={{display: 'flex', gap: 30, alignItems: 'center', backgroundColor: C.panel, borderRadius: 10, padding: '24px 30px', ...appear(f, i + 1)}}>
              <div style={{width: 330}}>
                <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 42, color: C.ink}}>{p.name}</div>
                <div style={{fontFamily: SANS, fontSize: 28, color: C.muted}}>{p.year}</div>
              </div>
              <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 34, color: C.ink, lineHeight: 1.4}}>{p.claim}</div>
            </div>
          ))}
        </AbsoluteFill>
      );
    case 'echelon': {
      const box = (title: string, sub: string, i: number, color: string) => (
        <div style={{flex: 1, backgroundColor: C.panel, border: `3px solid ${color}`, borderRadius: 12, padding: '26px 24px', ...appear(f, i)}}>
          <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 40, color}}>{title}</div>
          <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 28, color: C.ink, marginTop: 12, lineHeight: 1.4}}>{sub}</div>
        </div>
      );
      const arrow = (i: number) => <div style={{fontSize: 70, color: C.gold, alignSelf: 'center', ...appear(f, i)}}>◀</div>;
      return (
        <AbsoluteFill style={{padding: '40px 110px', gap: 34, flexDirection: 'column', justifyContent: 'center'}}>
          <Heading>梯団：成功した方向に、後ろから流し込む</Heading>
          <div style={{display: 'flex', gap: 18, alignItems: 'stretch'}}>
            {box('NATOの防御', '前方防衛の陣地', 0, C.nato)}
            {arrow(1)}
            {box('第一梯団', '攻撃して防御に穴を開ける', 2, C.wp)}
            {arrow(3)}
            {box('第二梯団', 'うまくいった方向へ投入して戦果を広げる（交代要員ではない）', 4, C.wp)}
            {arrow(5)}
            {box('戦略梯団', 'ソ連西部の軍管区から数日〜数週間で到着', 6, C.muted)}
          </div>
          <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 32, color: C.gold, ...appear(f, 8)}}>作戦機動グループ（OMG）は、突破口から作戦の初めに飛び込み、敵の後方を崩す</div>
        </AbsoluteFill>
      );
    }
    case 'quote':
      return (
        <AbsoluteFill style={{...pad, justifyContent: 'center'}}>
          <Heading>{card.title}</Heading>
          {card.body.map((t, i) => (
            <div key={i} style={{fontFamily: SANS, fontWeight: 700, fontSize: 38, color: C.ink, lineHeight: 1.45, ...appear(f, i + 1)}}>
              <span style={{color: C.gold}}>▸ </span>
              {t}
            </div>
          ))}
        </AbsoluteFill>
      );
  }
};

const Visual: React.FC<{seg: Seg; idx: number}> = ({seg, idx}) => {
  const f = useCurrentFrame();
  const dur = seg.end - seg.start;
  const [kind, id] = seg.v.split(':');
  return (
    <AbsoluteFill style={{opacity: fade(f, dur, 10)}}>
      {kind === 'p' && <Photo id={id} dur={dur} idx={idx} />}
      {kind === 's' && <Sim id={id} dur={dur} />}
      {kind === 'c' && <CardView card={CARDS[id]} />}
      {kind === 'map' && <MapScene id={id} dur={dur} fontSans={SANS} />}
    </AbsoluteFill>
  );
};

// ---------- chapter card ----------
const ChapterCard: React.FC<{c: Chapter}> = ({c}) => {
  const f = useCurrentFrame();
  const label = c.num === '序' ? 'PROLOGUE' : c.num === '終' ? 'EPILOGUE' : `CHAPTER ${c.num}`;
  return (
    <AbsoluteFill style={{backgroundColor: C.bg, alignItems: 'center', justifyContent: 'center', gap: 24, opacity: fade(f, c.dur, 10)}}>
      <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 34, letterSpacing: 10, color: C.gold, ...appear(f, 0)}}>{label}</div>
      <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 104, color: C.ink, ...appear(f, 1)}}>{c.title}</div>
      <div style={{width: interpolate(f, [10, 40], [0, 520], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease}), height: 4, backgroundColor: C.gold}} />
      <div style={{fontFamily: SANS, fontWeight: 700, fontSize: 42, color: C.muted, ...appear(f, 3)}}>{c.sub}</div>
    </AbsoluteFill>
  );
};

// ---------- characters (optional, src/assets.json) ----------
type CharCfg = {closed: string; open: string; height?: number};
const CHARS = (assets as {chars: null | Record<'z' | 'm', CharCfg>}).chars;
const BGM = (assets as {bgm: null | {file: string; volume?: number; duck?: number}}).bgm;
const SUB_SIDE = CHARS ? 380 : 70;

const Chars: React.FC<{items: Item[]}> = ({items}) => {
  const f = useCurrentFrame();
  if (!CHARS) return null;
  const cur = items.find((it): it is Line => it.type === 'line' && f >= it.start && f < it.start + it.dur);
  return (
    <>
      {(['m', 'z'] as const).map((k) => {
        const c = CHARS[k];
        const speaking = cur?.spk === k;
        const mf = speaking && cur?.mouth ? cur.mouth[Math.max(0, Math.min(cur.mouth.length - 1, f - cur.start))] === '1' : false;
        const bob = speaking ? Math.sin(f / 5) * 3 : 0;
        return (
          <Img key={k} src={staticFile(mf ? c.open : c.closed)}
            style={{position: 'absolute', bottom: -10, [k === 'm' ? 'left' : 'right']: 10, height: c.height ?? 520, translate: `0px ${bob}px`, filter: speaking ? 'none' : 'brightness(0.72)', scale: k === 'm' ? '1 1' : '1 1'}} />
        );
      })}
    </>
  );
};

// ---------- subtitles ----------
const Subtitle: React.FC<{l: Line}> = ({l}) => {
  const f = useCurrentFrame();
  const sp = SPK[l.spk];
  const size = l.text.length > 62 ? 40 : l.text.length > 44 ? 44 : 50;
  return (
    <AbsoluteFill style={{top: 'auto', height: 230, bottom: 0, padding: `0 ${SUB_SIDE}px 26px`, justifyContent: 'flex-end', opacity: interpolate(f, [0, 5], [0, 1], {extrapolateRight: 'clamp'})}}>
      <div style={{display: 'flex', alignItems: 'flex-start', gap: 22}}>
        <div style={{flexShrink: 0, marginTop: 6, fontFamily: ROUNDED, fontWeight: 800, fontSize: 30, color: '#fff', backgroundColor: sp.color, padding: '8px 18px', borderRadius: 999}}>{sp.name}</div>
        <div style={{fontFamily: ROUNDED, fontWeight: 800, fontSize: size, lineHeight: 1.38, color: '#fff', WebkitTextStroke: `10px ${sp.color}`, paintOrder: 'stroke fill', textShadow: '0 3px 10px rgba(0,0,0,0.5)'}}>{l.text}</div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- credits ----------
const Credits: React.FC<{segs: Seg[]}> = ({segs}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const used = new Set(segs.filter((sg) => sg.v.startsWith('p:')).map((sg) => sg.v.slice(2)));
  const photos = Object.entries(credits as Record<string, {title: string; artist: string; license: string}>).filter(([k]) => used.has(k));
  const lines: [string, string][] = [
    ['音声', 'VOICEVOX:ずんだもん　VOICEVOX:四国めたん'],
    ['シミュレーター', '中欧正面 1949–1991（このリポジトリの index.html）'],
    ['史料・研究', 'PHP（ETH Zurich）、National Security Archive、Mastny & Byrne『A Cardboard Castle?』、Pałka（2017）、Uhl（2006）、Luňák（2001）、Heuser（1993）、Mearsheimer（1982）、Posen（1984/85）、Cohen（1988）、Odom（1998）、FM100-5、OTA『核戦争の影響』（1979）'],
    ['地図', 'Natural Earth（world-atlas 2.0.2）。内独国境・河川・侵攻軸は概略'],
    ...(BGM ? [['音楽', BGM.file] as [string, string]] : []),
    ...photos.map(([, c]) => ['写真', `${c.title.replace('File:', '')} ／ ${c.artist} ／ ${c.license}`] as [string, string]),
    ['写真の出典', 'すべて Wikimedia Commons。CC BY／CC BY-SA の写真は各ライセンスに従い、作者名を表示しています'],
    ['注意', 'シミュレーターの数字は相対比較のための簡易モデルの結果で、実際の戦闘結果や確率を示すものではありません'],
  ];
  const H = lines.length * 74 + 900;
  return (
    <AbsoluteFill style={{backgroundColor: C.bg, overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 260, right: 260, top: 0, translate: interpolate(f, [0, CREDITS_SEC * fps], ['0px 1080px', `0px ${-H + 900}px`])}}>
        <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 64, color: C.ink, marginBottom: 50, textAlign: 'center'}}>クレジット</div>
        {lines.map(([k, v], i) => (
          <div key={i} style={{display: 'grid', gridTemplateColumns: '240px 1fr', gap: 30, marginBottom: 22, fontFamily: SANS, fontSize: 25, lineHeight: 1.45}}>
            <div style={{color: C.gold, fontWeight: 700, textAlign: 'right'}}>{k}</div>
            <div style={{color: C.ink}}>{v}</div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ---------- main ----------
export const PartVideo: React.FC<{part: string}> = ({part}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {items, total, segs} = DATA[part];
  const chapter = [...items].reverse().find((it): it is Chapter => it.type === 'chapter' && it.start <= f);
  // frames where someone is speaking, for ducking the music
  const speaking = (fr: number) => items.some((it) => it.type === 'line' && fr >= it.start - 6 && fr < it.start + it.dur + 6);
  return (
    <AbsoluteFill style={{backgroundColor: C.bg}}>
      {BGM && (
        <Audio src={staticFile(BGM.file)} loop
          volume={(fr) => (fr > total ? (BGM.volume ?? 0.14) : speaking(fr) ? (BGM.duck ?? 0.05) : (BGM.volume ?? 0.14))} />
      )}
      {/* visual area */}
      <AbsoluteFill style={{top: 70, bottom: 230, height: 'auto'}}>
        {segs.map((sg, i) => (
          <Sequence key={i} from={sg.start} durationInFrames={Math.max(1, sg.end - sg.start)} name={sg.v} premountFor={30}>
            <Visual seg={sg} idx={i} />
          </Sequence>
        ))}
      </AbsoluteFill>
      {/* header */}
      {chapter && chapter.num !== '序' && (
        <div style={{position: 'absolute', left: 70, top: 18, fontFamily: SANS, fontWeight: 700, fontSize: 28, color: C.muted}}>
          {chapter.num === '終' ? '終章' : `第${chapter.num}章`}　{chapter.title}
        </div>
      )}
      <div style={{position: 'absolute', right: 70, top: 18, fontFamily: SANS, fontWeight: 700, fontSize: 26, color: C.muted, letterSpacing: 2}}>{PART_TITLES[part]}</div>
      <Chars items={items} />
      {/* subtitles and audio */}
      {items.map((it, i) =>
        it.type === 'line' ? (
          <Sequence key={i} from={it.start} durationInFrames={it.dur + 8} name={`${it.spk}:${it.text.slice(0, 14)}`} premountFor={30}>
            <Audio src={staticFile(it.audio)} />
            <Subtitle l={it} />
          </Sequence>
        ) : (
          <Sequence key={i} from={it.start} durationInFrames={it.dur} name={`章 ${it.title}`}>
            <ChapterCard c={it} />
          </Sequence>
        ),
      )}
      <Sequence from={total} durationInFrames={CREDITS_SEC * fps} name="クレジット">
        <Credits segs={segs} />
      </Sequence>
    </AbsoluteFill>
  );
};

// ---------- number count-up for card figures ----------
const CountUp: React.FC<{text: string; f: number}> = ({text, f}) => {
  const m = text.match(/^([^0-9]*)([0-9][0-9,.]*)(.*)$/);
  if (!m) return <>{text}</>;
  const raw = m[2].replace(/,/g, '');
  const target = parseFloat(raw);
  if (!isFinite(target) || /[.]/.test(raw)) return <>{text}</>;
  const v = Math.round(interpolate(f, [0, 28], [0, target], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)}));
  const shown = m[2].includes(',') ? v.toLocaleString('en-US') : String(v);
  return <>{m[1]}{shown}{m[3]}</>;
};
