import React, {useMemo} from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {geoConicConformal, geoInterpolate, geoPath, GeoPermissibleObjects} from 'd3-geo';
import {feature, mesh} from 'topojson-client';
import geoRaw from './map/geo.json';
import runsRaw from './map/runs.json';
import {MAPS, MapAnno} from './maps';

type Axis = {id: string; short: string; name: string; amph: boolean; seaKm: number; path: [number, number, string][]; cum: number[]; len: number; rivers: {km: number; n: string; c: number; rhine?: boolean}[]};
type Run = {
  days: number; stop: number | null; nucT: number | null; thrDay: number | null; nsOut: number | null;
  ax: {id: string; failed: boolean; h: [number, number, number, number | null, number, number, number | null, number][]}[];
  nukes: [number, string, string][]; berlin: {on: boolean; fell: number | null}; austria: {on: boolean; thru: number | null};
  ns: number[]; air: number[]; civ: number[]; log: [number, string, string][];
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const GEO = geoRaw as any;
const RUNS = runsRaw as unknown as Record<string, Run>;
const AXES = GEO.axes as Axis[];

const C = {
  water: '#0d1a26', land: '#2b3641', pact: '#3b2c33', gdr: '#4b2b31', border: '#56636f', river: '#3f7fb3',
  wp: '#e2483c', nato: '#4f95e0', ink: '#eef1f3', muted: '#9aa6b2', gold: '#e0bb5c', nuke: '#f0a028', panel: '#151d25',
};
const PACT = new Set(['Poland', 'Czechia', 'Slovakia', 'Hungary']);
const KIND: Record<string, string> = {nato: C.nato, '2nd': C.wp, omg: C.wp, nuc: C.nuke, start: C.muted};

const posAt = (a: Axis, km: number): [number, number] => {
  km = Math.max(0, Math.min(a.len, km));
  let i = 1;
  while (i < a.cum.length - 1 && a.cum[i] < km) i++;
  const t = (km - a.cum[i - 1]) / Math.max(1e-6, a.cum[i] - a.cum[i - 1]);
  return geoInterpolate([a.path[i - 1][0], a.path[i - 1][1]], [a.path[i][0], a.path[i][1]])(Math.max(0, Math.min(1, t))) as [number, number];
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const MapScene: React.FC<{id: string; dur: number; fontSans: string}> = ({id, dur, fontSans}) => {
  const f = useCurrentFrame();
  const spec = MAPS[id];
  const run = spec.run ? RUNS[spec.run] : null;
  const panel = spec.panel !== 'none';
  const W = panel ? 1240 : 1920;
  const H = 780;
  const proj = useMemo(() => {
    const [x0, y0, x1, y1] = spec.focus ?? [2.0, 45.4, 17.2, 56.4];
    return geoConicConformal().parallels([47, 55]).rotate([-10, 0]).fitExtent([[10, 10], [W - 10, H - 10]], {type: 'MultiPoint', coordinates: [[x0, y0], [x1, y1], [x0, y1], [x1, y0]]});
  }, [spec.focus, W]);
  const gp = useMemo(() => geoPath(proj), [proj]);
  const base = useMemo(() => {
    const countries = (feature(GEO.eu, GEO.eu.objects.c) as unknown as {features: {properties: {name: string}}[]}).features;
    const borders = mesh(GEO.eu, GEO.eu.objects.c, (a, b) => a !== b);
    return {
      countries: countries.map((c) => ({d: gp(c as unknown as GeoPermissibleObjects) ?? '', pact: PACT.has(c.properties.name)})),
      borders: gp(borders) ?? '',
      gdr: gp(GEO.gdr) ?? '',
      igb: gp({type: 'LineString', coordinates: GEO.igb}) ?? '',
      rivers: Object.entries(GEO.rivers as Record<string, [number, number][]>).map(([n, c]) => ({n, d: gp({type: 'LineString', coordinates: c}) ?? ''})),
      routes: AXES.map((a) => gp({type: 'LineString', coordinates: a.path.map((p) => [p[0], p[1]])}) ?? ''),
    };
  }, [gp]);

  // current (fractional) day
  const d0 = spec.from ?? 0;
  const d1 = Math.min(spec.to ?? d0, run ? run.days : 0);
  const day = interpolate(f, [18, Math.max(19, dur - 30)], [d0, d1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.quad)});
  const di = Math.floor(day);
  const dt = day - di;
  const hAt = (k: number) => Math.min(k, (run?.ax[0].h.length ?? 1) - 1);
  const pt = (lonlat: [number, number]) => proj(lonlat) ?? [0, 0];
  const fadeIn = (s: number) => interpolate(f, [s, s + 12], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  const showAxes = spec.axes !== false && run;
  const anno = (a: MapAnno, i: number) => {
    const s = a.at ?? 10 + i * 14;
    const o = fadeIn(s);
    const col = a.color === 'nato' ? C.nato : a.color === 'gold' ? C.gold : a.color === 'ink' ? C.ink : C.wp;
    if (a.type === 'arrow') {
      const pts = a.pts.map(pt);
      const prog = interpolate(f, [s, s + 30], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
      // polyline length for dash animation
      let L = 0;
      for (let k = 1; k < pts.length; k++) L += Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1]);
      const [ex, ey] = pts[pts.length - 1];
      const [px, py] = pts[pts.length - 2];
      const ang = Math.atan2(ey - py, ex - px);
      const hx = 26 * Math.cos(ang), hy = 26 * Math.sin(ang);
      return (
        <g key={i} opacity={o}>
          <path d={'M' + pts.map((p) => p.join(',')).join('L')} fill="none" stroke={col} strokeWidth={a.width ?? 12} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={L} strokeDashoffset={L * (1 - prog)} opacity={0.9} />
          {prog > 0.95 && <path d={`M${ex + hx * 0.4},${ey + hy * 0.4} L${ex - hx - hy * 0.7},${ey - hy + hx * 0.7} L${ex - hx + hy * 0.7},${ey - hy - hx * 0.7}Z`} fill={col} />}
          {a.label && <Label x={pts[a.labelAt ?? 0][0] + (a.dx ?? 0)} y={pts[a.labelAt ?? 0][1] + (a.dy ?? -18)} text={a.label} color={col} size={a.size ?? 30} font={fontSans} />}
        </g>
      );
    }
    if (a.type === 'circle') {
      const [x, y] = pt(a.at_ll);
      const r = (a.r ?? 60) * interpolate(f, [s, s + 14], [0.6, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.back(2))});
      return (
        <g key={i} opacity={o}>
          <circle cx={x} cy={y} r={r} fill={col} fillOpacity={0.12} stroke={col} strokeWidth={5} />
          {a.label && <Label x={x + (a.dx ?? r + 10)} y={y + (a.dy ?? 10)} text={a.label} color={col} size={a.size ?? 30} font={fontSans} />}
        </g>
      );
    }
    const [x, y] = pt(a.at_ll);
    return <g key={i} opacity={o}><Label x={x} y={y} text={a.text} color={col} size={a.size ?? 30} font={fontSans} anchor={a.anchor} /></g>;
  };

  // events up to the current day
  const events = run && panel ? run.log.filter((l) => l[0] <= di && (spec.kinds ? spec.kinds.includes(l[1]) : true) && l[0] >= (spec.logFrom ?? 1)) : [];
  const shown = events.slice(-5);
  const maxPen = run ? Math.max(...run.ax.filter((x) => x.id !== 'zea').map((x) => lerp(x.h[hAt(di)][0], x.h[hAt(di + 1)][0], dt))) : 0;

  return (
    <AbsoluteFill style={{backgroundColor: C.water}}>
      <svg width={W} height={H} style={{position: 'absolute', left: 0, top: 0}}>
        {base.countries.map((c, i) => <path key={i} d={c.d} fill={c.pact ? C.pact : C.land} />)}
        <path d={base.gdr} fill={C.gdr} />
        <path d={base.borders} fill="none" stroke={C.border} strokeWidth={1.2} />
        {base.rivers.map((r) => <path key={r.n} d={r.d} fill="none" stroke={C.river} strokeWidth={r.n === 'ライン' || r.n === 'エルベ' ? 4 : 2.6} strokeLinejoin="round" />)}
        <path d={base.igb} fill="none" stroke={C.ink} strokeWidth={3} strokeDasharray="10 5" />
        {spec.corps !== false &&
          (GEO.corps as [string, number, number][]).map(([n, lo, la]) => {
            const [x, y] = pt([lo, la]);
            return (
              <g key={n}>
                <circle cx={x} cy={y} r={7} fill={C.nato} stroke={C.water} strokeWidth={2} />
                <Label x={x - 12} y={y + 9} text={n} color={C.nato} size={22} font={fontSans} anchor="end" />
              </g>
            );
          })}
        {showAxes &&
          AXES.map((a, i) => {
            const xh = run!.ax[i];
            const h0 = xh.h[hAt(di)], h1 = xh.h[hAt(di + 1)];
            const pen = lerp(h0[0], h1[0], dt);
            const hi = !spec.highlight || spec.highlight.includes(a.id);
            const n = Math.max(2, Math.ceil(pen / 6));
            const pts = Array.from({length: n + 1}, (_, k) => posAt(a, (pen * k) / n));
            const showProg = !(a.amph && (pen <= a.seaKm || xh.failed));
            const [hx, hy] = pt(posAt(a, pen));
            const sw = h0[3];
            return (
              <g key={a.id} opacity={hi ? 1 : 0.35}>
                <path d={base.routes[i]} fill="none" stroke={C.wp} strokeWidth={2} strokeDasharray="3 6" opacity={0.6} />
                {spec.rivers !== false &&
                  a.rivers.map((rv, k) => {
                    const [x, y] = pt(posAt(a, rv.km));
                    const done = k < h0[2];
                    const now = k === h0[2] && h0[1] === 1;
                    return <circle key={k} cx={x} cy={y} r={[0, 5, 6.5, 8][rv.c]} fill={done ? C.wp : C.water} stroke={now ? C.gold : done ? C.water : C.river} strokeWidth={now ? 4 : 2.5} />;
                  })}
                {showProg && pen > 0.5 && <path d={gp({type: 'LineString', coordinates: pts}) ?? ''} fill="none" stroke={C.wp} strokeWidth={11} strokeLinecap="round" opacity={0.92} />}
                {showProg && pen > 0.5 && (
                  <g>
                    <circle cx={hx} cy={hy} r={11} fill={C.wp} stroke={C.ink} strokeWidth={3} />
                    <Label x={hx + 15} y={hy + 9} text={`${Math.round(a.amph ? pen - a.seaKm : pen)}km${h0[1] ? ' 渡河中' : ''}${spec.supply && sw != null && sw < 1 ? ' 補給切れ' : ''}`} color={h0[1] ? C.gold : C.ink} size={24} font={fontSans} />
                  </g>
                )}
              </g>
            );
          })}
        {run &&
          run.nukes.filter((nk) => nk[0] <= day).map(([nd, axId, k], i) => {
            const a = AXES.find((x) => x.id === axId)!;
            const xh = run.ax[AXES.indexOf(a)];
            const pen = xh.h[hAt(nd)][0];
            const ll = k === 'f' ? posAt(a, pen) : k === 'w' ? posAt(a, Math.min(a.len, pen + 70)) : ([a.path[0][0] + 0.9, a.path[0][1]] as [number, number]);
            const [x, y] = pt(ll);
            const r = (k === 'f' ? 26 : 36) * interpolate(day - nd, [0, 0.4], [0.3, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
            return <circle key={i} cx={x} cy={y} r={r} fill={C.nuke} fillOpacity={k === 'f' ? 0.45 : 0.25} stroke={C.nuke} strokeWidth={3} strokeDasharray={k === 'f' ? undefined : '6 5'} />;
          })}
        {run && run.berlin.on && (() => {
          const [x, y] = pt([13.38, 52.5]);
          const fell = run.berlin.fell != null && day >= run.berlin.fell;
          return (
            <g>
              <circle cx={x} cy={y} r={14} fill="none" stroke={fell ? C.wp : C.nato} strokeWidth={4} />
              {spec.berlinLabel && <Label x={x + 20} y={y + 30} text={fell ? `西ベルリン陥落 D+${run.berlin.fell}` : '西ベルリン：抵抗中'} color={fell ? C.wp : C.nato} size={22} font={fontSans} />}
            </g>
          );
        })()}
        {(spec.anno ?? []).map(anno)}
      </svg>
      {panel && (
        <div style={{position: 'absolute', left: W, top: 0, width: 1920 - W, height: H, backgroundColor: C.panel, padding: '28px 36px', display: 'flex', flexDirection: 'column', gap: 18, fontFamily: fontSans}}>
          <div style={{fontWeight: 900, fontSize: 36, color: C.ink, lineHeight: 1.25}}>{spec.title}</div>
          {run && (
            <div style={{display: 'flex', alignItems: 'baseline', gap: 24}}>
              <div style={{fontWeight: 900, fontSize: 84, color: C.gold, fontVariantNumeric: 'tabular-nums'}}>D+{di}</div>
              <div style={{fontWeight: 700, fontSize: 28, color: C.muted}}>最大突破 <span style={{color: C.ink, fontSize: 36}}>{Math.round(maxPen)}km</span></div>
            </div>
          )}
          {spec.notes?.map((n, i) => (
            <div key={i} style={{fontWeight: 700, fontSize: 28, color: C.ink, opacity: fadeIn(8 + i * 10), lineHeight: 1.35}}>
              <span style={{color: C.gold}}>▸ </span>
              {n}
            </div>
          ))}
          <div style={{display: 'flex', flexDirection: 'column', gap: 10, marginTop: 6}}>
            {shown.map((l, i) => (
              <div key={`${l[0]}-${i}-${l[2].slice(0, 8)}`} style={{display: 'flex', gap: 12, fontSize: 22, lineHeight: 1.4, color: C.ink, borderLeft: `5px solid ${KIND[l[1]] ?? C.muted}`, paddingLeft: 12}}>
                <span style={{color: C.gold, fontWeight: 900, flexShrink: 0}}>D+{l[0]}</span>
                <span>{l[2].length > 74 ? l[2].slice(0, 73) + '…' : l[2]}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

const Label: React.FC<{x: number; y: number; text: string; color: string; size: number; font: string; anchor?: 'start' | 'middle' | 'end'}> = ({x, y, text, color, size, font, anchor}) => (
  <text x={x} y={y} fill={color} fontSize={size} fontFamily={font} fontWeight={900} textAnchor={anchor ?? 'start'} paintOrder="stroke" stroke="#0b1118" strokeWidth={6} strokeLinejoin="round">
    {text}
  </text>
);
