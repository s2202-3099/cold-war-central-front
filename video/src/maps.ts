// Map scenes referenced from the scripts as map:ID. Runs come from tools/sim_runs.js (src/map/runs.json).
export type LL = [number, number];
export type MapAnno =
  | {type: 'arrow'; pts: LL[]; label?: string; labelAt?: number; color?: 'wp' | 'nato' | 'gold' | 'ink'; width?: number; at?: number; dx?: number; dy?: number; size?: number}
  | {type: 'circle'; at_ll: LL; r?: number; label?: string; color?: 'wp' | 'nato' | 'gold' | 'ink'; at?: number; dx?: number; dy?: number; size?: number}
  | {type: 'text'; at_ll: LL; text: string; color?: 'wp' | 'nato' | 'gold' | 'ink'; at?: number; size?: number; anchor?: 'start' | 'middle' | 'end'};

export type MapSpec = {
  run?: string; from?: number; to?: number;
  focus?: [number, number, number, number]; // lon0, lat0, lon1, lat1
  panel?: 'events' | 'none';
  title?: string; notes?: string[];
  highlight?: string[]; anno?: MapAnno[];
  axes?: boolean; corps?: boolean; rivers?: boolean; supply?: boolean; civ?: boolean; berlinLabel?: boolean;
  kinds?: string[]; logFrom?: number;
};

const P = {
  berlin: [13.38, 52.5] as LL, hamburg: [10.0, 53.55] as LL, hannover: [9.73, 52.37] as LL, frankfurt: [8.68, 50.11] as LL,
  magdeburg: [11.63, 52.13] as LL, ruhr: [7.1, 51.45] as LL, nordhausen: [10.79, 51.5] as LL, goettingen: [9.93, 51.53] as LL, kassel: [9.48, 51.31] as LL,
  paderborn: [8.75, 51.72] as LL, eisenach: [10.32, 50.98] as LL, fulda: [9.68, 50.55] as LL, plauen: [12.13, 50.5] as LL, hof: [11.92, 50.31] as LL,
  bayreuth: [11.58, 49.94] as LL, nuremberg: [11.08, 49.45] as LL, schwerin: [11.41, 53.63] as LL, luebeck: [10.69, 53.87] as LL, kiel: [10.13, 54.32] as LL,
  prague: [14.42, 50.08] as LL, dresden: [13.74, 51.05] as LL, vienna: [16.37, 48.21] as LL, linz: [14.29, 48.31] as LL, passau: [13.46, 48.57] as LL,
  munich: [11.58, 48.14] as LL, besancon: [6.02, 47.24] as LL, memmingen: [10.18, 47.99] as LL, mosbach: [9.15, 49.35] as LL, lyon: [4.84, 45.76] as LL,
};
const NORTH: [number, number, number, number] = [6.0, 50.6, 12.8, 55.2];
const SOUTH: [number, number, number, number] = [5.5, 46.8, 15.5, 51.2];

export const MAPS: Record<string, MapSpec> = {
  // ---------------- 前編（歴史） ----------------
  zones: {
    panel: 'none', axes: false, corps: false, rivers: false, focus: [4.5, 46.8, 16.5, 55.3],
    anno: [
      {type: 'text', at_ll: [8.4, 52.6], text: '英国占領地区', color: 'nato', size: 40, at: 6},
      {type: 'text', at_ll: [10.2, 49.2], text: '米国占領地区', color: 'nato', size: 40, at: 14},
      {type: 'text', at_ll: [7.4, 48.3], text: '仏国', color: 'nato', size: 40, at: 22},
      {type: 'text', at_ll: [12.2, 51.4], text: 'ソ連占領地区', color: 'wp', size: 40, at: 30},
      {type: 'circle', at_ll: P.berlin, r: 26, label: 'ベルリン（四か国で分割）', color: 'gold', at: 40, size: 32},
    ],
  },
  airlift: {
    panel: 'none', axes: false, corps: false, rivers: false, focus: [6.5, 49.3, 15.5, 54.6],
    anno: [
      {type: 'arrow', pts: [P.hamburg, P.berlin], label: '北の回廊', color: 'nato', width: 9, at: 6, labelAt: 0, dy: -24},
      {type: 'arrow', pts: [P.hannover, P.berlin], label: '中央の回廊', color: 'nato', width: 9, at: 20, labelAt: 0, dy: 34},
      {type: 'arrow', pts: [P.frankfurt, P.berlin], label: '南の回廊', color: 'nato', width: 9, at: 34, labelAt: 0, dy: 40},
      {type: 'circle', at_ll: P.berlin, r: 30, label: '西ベルリン', color: 'gold', at: 50, size: 34},
    ],
  },
  prague68: {
    panel: 'none', axes: false, corps: false, rivers: false, focus: [9.0, 47.0, 21.5, 53.5],
    anno: [
      {type: 'arrow', pts: [P.dresden, P.prague], label: '東独から', color: 'wp', at: 6, labelAt: 0, dy: -20},
      {type: 'arrow', pts: [[17.03, 51.11], [15.8, 50.6], P.prague], label: 'ポーランドから', color: 'wp', at: 16, labelAt: 0, dy: -20},
      {type: 'arrow', pts: [[19.04, 47.6], [17.1, 48.6], [15.6, 49.4], P.prague], label: 'ハンガリーから', color: 'wp', at: 26, labelAt: 0, dx: -60, dy: 40},
      {type: 'circle', at_ll: P.prague, r: 30, label: 'プラハ　1968年8月', color: 'gold', at: 40, size: 34, dy: 60, dx: -80},
      {type: 'text', at_ll: [16.6, 49.3], text: '→ 以後ソ連中央軍集団（5個師団）が駐留', color: 'wp', at: 60, size: 30},
    ],
  },
  // ---------------- 中編（作戦と計画） ----------------
  corridors: {
    panel: 'none', run: 'd0', from: 0, to: 0, axes: false, rivers: false, focus: [5.5, 48.6, 14.8, 54.6],
    anno: [
      {type: 'arrow', pts: [P.magdeburg, P.hannover, P.ruhr], label: '北ドイツ平原', color: 'wp', at: 6, labelAt: 1, dy: -30, size: 36},
      {type: 'arrow', pts: [P.nordhausen, P.goettingen, P.kassel, P.paderborn], label: 'ゲッティンゲン回廊', color: 'wp', at: 22, labelAt: 2, dx: -330, dy: 10, size: 32},
      {type: 'arrow', pts: [P.eisenach, P.fulda, P.frankfurt], label: 'フルダ・ギャップ', color: 'wp', at: 38, labelAt: 1, dx: -290, dy: 8, size: 36},
      {type: 'arrow', pts: [P.plauen, P.hof, P.bayreuth, P.nuremberg], label: 'ホーフ回廊', color: 'wp', at: 54, labelAt: 2, dx: 20, dy: 10, size: 32},
    ],
  },
  layercake: {
    panel: 'events', run: 'd0', from: 0, to: 0, axes: false, rivers: false, title: '前方防衛の配置（1980年代）',
    notes: ['北部軍集団（NORTHAG）：蘭・西独・英・ベルギー', '中部軍集団（CENTAG）：西独・米・米・西独', '北翼はLANDJUT（西独・デンマーク）', '帯のように並ぶので「レイヤーケーキ」'],
  },
  fuldaop: {
    panel: 'none', run: 'd0', from: 0, to: 0, axes: false, rivers: true, focus: [8.4, 49.9, 11.4, 51.4],
    anno: [
      {type: 'circle', at_ll: [9.95, 50.73], r: 26, label: 'OPアルファ（第11機甲騎兵連隊）', color: 'gold', at: 6, size: 30},
      {type: 'arrow', pts: [P.eisenach, P.fulda, P.frankfurt], label: '第8親衛軍の想定進路', color: 'wp', at: 24, labelAt: 0, dx: 20, dy: -20, size: 30},
      {type: 'text', at_ll: [8.7, 50.25], text: '米第5軍団（フランクフルト）', color: 'nato', at: 44, size: 30},
    ],
  },
  r1961: {run: 'r1961', from: 0, to: 6, focus: [7.5, 52.8, 14.5, 57.0], highlight: ['jut', 'zea'], title: '1961年ブーリャ演習型（核の同時使用）', notes: ['計画：5日でデンマークを制圧'], kinds: ['2nd', 'omg', 'nuc']},
  r1964: {
    run: 'r1964', from: 0, to: 12, focus: [4.5, 46.4, 15.5, 51.6], highlight: ['ge2', 'us7'], title: '1964年計画型（核131発）', notes: ['計画の線：7〜8日目にブザンソン'], kinds: ['2nd', 'omg', 'nuc'],
    anno: [{type: 'arrow', pts: [P.bayreuth, P.mosbach, P.besancon, P.lyon], label: '計画の主攻', color: 'gold', width: 7, at: 6, labelAt: 2, dx: 20, dy: -14, size: 30}],
  },
  r1979: {run: 'r1979', from: 0, to: 15, title: '1979年「ライン川まで7日間」型', notes: ['計画：7日でライン川'], kinds: ['2nd', 'omg', 'nuc']},
  berlin: {
    panel: 'none', run: 'd0', from: 0, to: 0, axes: false, corps: false, rivers: false, focus: [11.8, 51.8, 15.0, 53.2],
    anno: [
      {type: 'circle', at_ll: P.berlin, r: 60, label: '西ベルリン：米英仏の守備隊 約1万2千人', color: 'nato', at: 6, size: 30, dy: -80, dx: -260},
      {type: 'arrow', pts: [[13.9, 52.15], [13.5, 52.42]], label: '東独軍・ソ連軍 約3万人', color: 'wp', at: 22, labelAt: 0, dx: -40, dy: 50, size: 30},
      {type: 'arrow', pts: [[12.6, 52.7], [13.2, 52.55]], color: 'wp', at: 30},
    ],
  },
  austria: {
    run: 'r1985au', from: 0, to: 20, focus: [8.5, 46.6, 17.4, 50.6], highlight: ['ge2'], title: 'オーストリアの中立を破る場合', notes: ['ソ連南部軍集団とハンガリー軍', 'オーストリア軍の「空間防御」で遅滞'], kinds: ['omg', '2nd'],
    anno: [{type: 'arrow', pts: [P.vienna, P.linz, P.passau], label: 'ウィーン→リンツ→パッサウ', color: 'wp', width: 9, at: 10, labelAt: 0, dx: -200, dy: 50, size: 28}],
  },
  // ---------------- 後編（検証） ----------------
  r1985: {run: 'r1985', from: 0, to: 33, title: '1985年型：WPは10日前に動員、NATOの準備7日', kinds: ['2nd', 'omg', 'nuc', 'nato'], logFrom: 1},
  r1985s: {run: 'r1985s', from: 0, to: 12, title: '1985年 短期警報の奇襲', notes: ['動員から2日で開戦、NATOの準備は1日'], kinds: ['2nd', 'omg', 'nuc', 'nato']},
  r1985f: {run: 'r1985f', from: 0, to: 30, title: '1985年 全面動員のうえでの攻勢', notes: ['動員14日、NATOの準備10日'], kinds: ['2nd', 'nuc']},
  rivers: {run: 'r1976ig', from: 14, to: 44, focus: NORTH, highlight: ['uk1', 'be1', 'jut'], title: '1976年型・核なし：川で止まる', kinds: ['2nd'], logFrom: 14},
  supply: {run: 'r1976ig', from: 36, to: 60, supply: true, title: '1976年型・核なし：息切れ', kinds: ['2nd', 'nato'], logFrom: 36},
  r1985ig: {run: 'r1985ig', from: 0, to: 60, title: '1985年型・核を使わず60日', kinds: ['2nd', 'nato', 'omg'], logFrom: 1},
  chem: {run: 'r1985chem', from: 0, to: 45, supply: true, title: '1985年型・核なし＋化学兵器', kinds: ['2nd', 'nato', 'omg'], logFrom: 1},
  esc: {run: 'r1985esc', from: 30, to: 38, civ: true, title: '核の敷居の先：エスカレーション', kinds: ['nuc'], logFrom: 30},
  berlinfall: {run: 'r1985ig', from: 10, to: 20, focus: [10.5, 51.0, 15.5, 53.8], berlinLabel: true, highlight: ['nl1', 'ge1', 'uk1'], title: '西ベルリンの攻略', kinds: ['omg', '2nd'], logFrom: 10},
};
