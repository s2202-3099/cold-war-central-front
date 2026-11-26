// Screen contents referenced from script/script.txt (p: photo, s: simulator screenshot, c: card)

export type SimVisual = {
  imgs: string[]; // files in public/sim
  caption: string;
  notes?: string[];
  pan?: boolean; // tall image: scroll from top to bottom
};

export const SIM: Record<string, SimVisual> = {
  map_d0: {
    imgs: ['map_d0.png'],
    caption: '1985年の配置（開戦の日）',
    notes: ['青い点＝NATO軍団の担当区域', '黒い破線＝内独国境', '赤い点線＝WP軍の侵攻軸', '北から蘭・西独・英・白・西独・米・米・西独'],
  },
  p1964: {
    imgs: ['p1964.png'],
    caption: '1964年計画型（核の同時使用）・D+8',
    notes: ['計画：7〜8日目にブザンソンの線', 'モデル：60日以内に届かない', '赤い円＝核攻撃の位置'],
  },
  p1979: {
    imgs: ['p1979.png'],
    caption: '1979年「ライン川まで7日間」型・D+7',
    notes: ['計画：7日でライン川', 'モデル：60日以内に届かない', 'デンマーク制圧（1961年型）：計画5日 → モデル8日'],
  },
  ctrl: {
    imgs: ['ctrl.png'],
    caption: 'シミュレーターの操作パネル',
    notes: ['WPの動員：開戦の10日前', 'NATOの準備：7日（察知1日＋決定2日）', '核の敷居：最大突破120km', 'ドクトリン：エアランド・バトル＋FOFA'],
    pan: true,
  },
  r1985: {
    imgs: ['r1985.png', 'r1985_chart.png'],
    caption: '1985年型・D+33で核の敷居',
    notes: ['英I軸（ヘルムシュテット〜ハノーファー）が最も深い', '赤い破線＝核の敷居（120km）'],
  },
  r1985s: {
    imgs: ['r1985s.png'],
    caption: '1985年 短期警報の奇襲・D+12で核の敷居',
    notes: ['WPの動員から2日で開戦', 'NATOの準備は1日', '本国から来る蘭・白・英の師団が間に合わない'],
  },
  river_d41: {
    imgs: ['river_d41_map.png', 'river_d41.png'],
    caption: '1976年型（核なし）・D+41',
    notes: ['英I軸がヴェーザー川を渡河中', '地図の丸＝渡河点（塗り＝渡河済み）'],
  },
  r1976_logi: {
    imgs: ['r1976_map.png', 'r1976_logi.png'],
    caption: '1976年型（核なし）・D+60',
    notes: ['D+37 NATOの欧州の備蓄が尽きる', 'D+51 英I・白I軸がライン川に到達', 'D+53〜 WPが軸ごとに息切れ'],
  },
  mc: {
    imgs: ['mc_tiles.png'],
    caption: '不確実性：1985年型・核なし・400回',
    notes: ['結果を左右する数字（ライン川到達の日との順位相関）', '1位 NATOの質的係数 ＋0.48', '2位 WPの質 −0.33', '3位 NATO機の質 ＋0.28', '4位 WPの補給輸送力 −0.13'],
  },
};

export type Card =
  | {kind: 'title'; title: string; sub: string; foot: string}
  | {kind: 'periods'; hi?: number}
  | {kind: 'period'; i: number}
  | {kind: 'table'; title: string; head: string[]; rows: string[][]; note?: string}
  | {kind: 'facts'; title: string; sub?: string; facts: [string, string][]; note?: string}
  | {kind: 'bars'; title: string; rows: {label: string; before: number; after: number}[]; note: string}
  | {kind: 'people'; title: string; people: {name: string; year: string; claim: string}[]}
  | {kind: 'quote'; title: string; body: string[]};

export const PERIODS = [
  {yr: '1949–53', name: 'スターリン期',
    e: ['大戦型の大規模な地上軍で西欧を圧する', '核は1949年に初実験、まだ作戦の前提ではない', '1951年のポーランドの計画は防御的と評される'],
    w: ['1949年 NATO発足', '米国の核独占と戦略爆撃に依存', 'ライン川以西での防御が現実的な線']},
  {yr: '1954–66', name: '核の全面化',
    e: ['フルシチョフ期の核ロケット戦争論', '核で開いた突破口に戦車を突進させる', 'ブーリャ演習（1961）、1964年計画（核131発）'],
    w: ['MC14/2（1957）の大量報復', '戦術核の大量配備（デイビー・クロケットなど）', '西独連邦軍の創設（1955）で前方防衛へ']},
  {yr: '1967–76', name: '柔軟反応',
    e: ['通常戦の段階がありうるという議論が現れる', '核の脅威下で分散と高速機動を重視', '演習は引き続き核使用を想定'],
    w: ['MC14/3（1968）の柔軟反応', '軍団区域を並べた前方防衛（レイヤーケーキ）', 'アクティブ・ディフェンス（FM100-5、1976）']},
  {yr: '1977–86', name: 'オガルコフ期',
    e: ['参謀総長オガルコフの「軍事技術革命」', 'OMG構想（ザーパド81で演練）', '西方戦域総司令部（1984）'],
    w: ['INF配備の二重決定（1979）', 'エアランド・バトル（1982・86）', '後続部隊攻撃 FOFA（1984）、REFORGER']},
  {yr: '1987–91', name: '防衛ドクトリンと解体',
    e: ['ワ条約機構が防衛的ドクトリンを採択（1987）', 'ゴルバチョフの一方的削減（1988）', '1991年に条約機構が解散'],
    w: ['INF条約（1987）、CFE条約（1990）', 'ドイツ統一（1990）', '中欧正面そのものが消える']},
];

export const CARDS: Record<string, Card> = {
  title: {kind: 'title', title: '中欧正面 1949–1991', sub: '冷戦期の戦略・計画と、もし戦っていたら', foot: '公開された東側文書と、簡易シミュレーターで確かめる'},
  periods: {kind: 'periods'},
  p1: {kind: 'period', i: 0},
  p2: {kind: 'period', i: 1},
  p3: {kind: 'period', i: 2},
  p4: {kind: 'period', i: 3},
  p5: {kind: 'period', i: 4},
  plans: {
    kind: 'table',
    title: '公開された計画と演習',
    head: ['年', '文書・演習', '想定と時間表', '核'],
    rows: [
      ['1951', 'ポーランド軍の計画', 'NATOの侵攻を食い止める防御的な計画', '—'],
      ['1961.3', 'チェコスロヴァキア方面軍演習', '6〜7日目にディジョン〜リヨンの線', '核'],
      ['1961.9–10', 'ブーリャ（嵐）演習', 'NATOの核攻撃に反撃、デンマーク・オランダを制圧', '核'],
      ['1964.10', 'チェコスロヴァキア戦争計画', '7〜8日目にブザンソン、その後リヨンへ', '131発'],
      ['1979', '「ライン川まで7日間」', 'NATOの核先制攻撃に反撃し7日でライン川', '核'],
      ['1981.9', 'ザーパド81', 'OMG構想を初めて演練', '通常'],
      ['1987.5', '政治諮問委員会', '厳格に防衛的なドクトリンを採択', '—'],
    ],
    note: '共通の筋書き：戦争はNATOの攻撃で始まり、東側はただちに反攻に移る',
  },
  buria: {
    kind: 'facts',
    title: 'ブーリャ（嵐）演習　1961年9〜10月',
    sub: '全加盟国軍が連合で参加した初の演習',
    facts: [['約43.7万名', 'ポーランド沿岸方面軍'], ['シェラン島', '空挺と上陸作戦'], ['11日まで', 'デンマークを制圧'], ['13日まで', 'オランダを制圧']],
    note: '想定の起点：10月6日、NATOの核攻撃',
  },
  plan1964: {
    kind: 'facts',
    title: '1964年 チェコスロヴァキア戦争計画',
    sub: '西側の大規模な核攻撃で開戦する前提',
    facts: [['1日目', 'バイロイト〜パッサウ'], ['4日目', 'モスバッハ〜メミンゲン'], ['7〜8日目', 'ラングル〜ブザンソン'], ['その後', 'リヨンへ']],
    note: '使う核：131発',
  },
  mccompare: {
    kind: 'bars',
    title: '1985年型・核なし・400回　川と補給を入れる前と後',
    rows: [
      {label: 'いずれかの軸がライン川', before: 51, after: 26},
      {label: '英仏海峡の港（カレー）', before: 25, after: 2},
      {label: 'パリ', before: 11, after: 1},
    ],
    note: '深く進む結果ほど大きく減る＝遠くへ行くほど補給が持たない',
  },
  debate: {
    kind: 'people',
    title: '評価論争 ── NATOは持ちこたえられたか',
    people: [
      {name: 'ミアシャイマー', year: '1982', claim: 'ソ連は突破正面で決定的な優勢を作れず、速戦即決できない'},
      {name: 'ポーゼン', year: '1984/85', claim: '質と補充を加味した動的比較では、NATOの不利は通説ほどではない'},
      {name: 'コーエン', year: '1988', claim: '楽観論は都合のよい前提を選んでいる'},
    ],
  },
  intent: {
    kind: 'quote',
    title: '計画の中身と、意図の解釈',
    body: ['東側の計画はいつも「NATOが先に攻撃する」筋書きで書かれた', '本気の脅威認識か、正当化の定型か ── 研究者の見方は分かれる', '1983年 エイブル・アーチャー：相互の脅威認識が誤認を生みうることを示した'],
  },
  end: {
    kind: 'quote',
    title: 'シミュレーターで試してみる',
    body: ['ブラウザで index.html を開けば動く', '警報の日数、橋の爆破の成功率、補給の輸送力を変えてみる', '数字は相対比較のためのもので、予測ではない'],
  },
};
