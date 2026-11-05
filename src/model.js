/* ===== shared model (also embedded in page) ===== */
// unit: [name, garrison, DE, arrival(day relative to mobilization start; WP: day of war)]
const AXES=[
 {id:'zea',short:'シェラン',name:'シェラン島・バルト海峡',amph:true,terrain:0.8,sea:'ケーゲ湾（上陸）',
  natoCmd:'LANDZEALAND（デンマーク）',wpCmd:'ポーランド沿岸方面軍の上陸部隊・バルト艦隊',
  path:[[13.55,54.45,'リューゲン島（出撃）'],[12.25,55.40,'ケーゲ湾（上陸）'],[12.57,55.68,'コペンハーゲン'],[12.60,56.03,'ヘルシンゲル']],
  wp:[['ポーランド第7ルジツァ上陸師団','グダニスク',0.6,0],['ポーランド第6ポモージェ空挺師団','クラクフ',0.5,0],['ソ連バルト艦隊 第336親衛海軍歩兵旅団','バルチースク',0.25,0]],
  nato:[['第1シェラン旅団','ホルベク',0.3,1],['第2シェラン旅団','ヴォーディングボー',0.3,1],['シェラン戦闘団1〜4（予備役）','シェラン各地',0.4,3],['ホームガード','シェラン',0.2,1]]},
 {id:'jut',short:'LANDJUT',name:'シュレースヴィヒ＝ホルシュタイン・ユトランド',terrain:0.85,
  natoCmd:'LANDJUT（レンツブルク）',wpCmd:'東独第5軍 → ポーランド方面軍',
  path:[[11.41,53.63,'シュヴェリーン'],[10.69,53.87,'リューベック'],[10.13,54.32,'キール'],[9.67,54.30,'レンツブルク（キール運河）'],[9.43,54.79,'フレンスブルク'],[9.47,55.49,'コリング'],[10.20,56.15,'オーフス']],
  wp:[['東独 第8自動車化狙撃師団','シュヴェリーン',1.0,0],['東独 第9戦車師団','エッゲジン',1.0,0],['ポーランド方面軍 第一梯団＝ポモージェ軍管区の軍（第8・第12・第15自狙師団、第16・第20戦車師団）','ポモージェ軍管区',5.0,3]],
  nato:[['西独 第6装甲擲弾兵師団','ノイミュンスター',1.0,0],['デンマーク ユトランド師団（第1〜3旅団）','フレゼリシア',0.8,1],['西独 第51・第61郷土防衛旅団','シュレースヴィヒ＝ホルシュタイン',0.4,2],['英 第1歩兵旅団（UK機動部隊）','英本土',0.3,5],['米 第9歩兵師団','フォート・ルイス',1.0,12]]},
 {id:'nl1',short:'蘭I',name:'リューネブルク〜ブレーメン（蘭第1軍団）',terrain:0.9,
  natoCmd:'NORTHAG 蘭第1軍団（アペルドールン）',wpCmd:'在独ソ連軍 第2親衛戦車軍（北翼）',
  path:[[11.86,53.07,'ペルレベルク'],[11.10,53.10,'ダンネンベルク'],[10.41,53.25,'リューネブルク'],[9.40,53.11,'ローテンブルク'],[8.80,53.08,'ブレーメン'],[8.21,53.14,'オルデンブルク'],[6.57,53.22,'フローニンゲン'],[4.90,52.37,'アムステルダム'],[4.30,52.08,'ハーグ']],
  wp:[['第16親衛戦車師団','ノイシュトレリッツ',1.0,0],['第21自動車化狙撃師団','ペルレベルク',1.0,0]],
  nato:[['蘭 第41機甲旅団（前方配置）','ゼードルフ',0.35,0],['米 第2機甲師団 第3旅団（前方配置）','ガルシュテット',0.35,1],['蘭 第1師団','アーネム',0.8,2],['蘭 第4師団','ハルデルウェイク',0.8,2],['蘭 第5師団（予備役）','アペルドールン',0.7,4],['蘭 第101歩兵旅団（予備役）','ストルーエ',0.25,4]]},
 {id:'ge1',short:'西独I',name:'ユルツェン〜ツェレ（西独第1軍団）',terrain:0.95,
  natoCmd:'NORTHAG 西独第1軍団（ミュンスター）',wpCmd:'在独ソ連軍 第2親衛戦車軍（南翼）・第3打撃軍の一部',
  path:[[11.15,52.85,'ザルツヴェーデル'],[10.56,52.96,'ユルツェン'],[10.08,52.62,'ツェレ'],[9.21,52.64,'ニーンブルク'],[8.05,52.28,'オスナブリュック'],[6.89,52.22,'エンスヘーデ'],[5.90,51.98,'アーネム（ライン）'],[5.12,52.09,'ユトレヒト'],[4.48,51.92,'ロッテルダム']],
  wp:[['第94親衛自動車化狙撃師団（第2親衛戦車軍）','シュヴェリーン',1.0,0],['第207自動車化狙撃師団（第2親衛戦車軍）','シュテンダール',1.0,0],['第12親衛戦車師団（第3打撃軍）','ノイルピン',1.0,0]],
  nato:[['西独 第1装甲師団','ハノーファー',1.0,0],['西独 第3装甲師団','ブクステフーデ',1.0,0],['西独 第11装甲擲弾兵師団','オルデンブルク',1.0,1],['西独 第7装甲師団','ウンナ',1.0,1],['西独 第27空挺旅団','リップシュタット',0.3,0]]},
 {id:'uk1',short:'英I',name:'ヘルムシュテット〜ハノーファー南（英第1軍団）',terrain:1.0,
  natoCmd:'NORTHAG 英第1軍団（ビーレフェルト）',wpCmd:'在独ソ連軍 第3打撃軍（主攻）',
  path:[[11.63,52.13,'マクデブルク'],[11.00,52.23,'ヘルムシュテット'],[10.52,52.27,'ブラウンシュヴァイク'],[9.95,52.15,'ヒルデスハイム'],[9.36,52.10,'ハーメルン'],[8.53,52.02,'ビーレフェルト'],[7.63,51.96,'ミュンスター'],[6.62,51.66,'ヴェーゼル（ライン）'],[5.48,51.44,'アイントホーフェン'],[4.40,51.22,'アントワープ'],[3.72,51.05,'ヘント'],[1.86,50.95,'カレー（仏国境の先）']],
  wp:[['第7親衛戦車師団','ロスラウ',1.0,0],['第10親衛戦車師団','アルテングラボウ',1.0,0],['第47親衛戦車師団','ヒラースレーベン',1.0,0]],
  nato:[['英 第1機甲師団','フェルデン',1.0,0],['英 第4機甲師団（第19旅団は英本土から）','ヘルフォルト',0.9,1],['英 第3機甲師団','ゾースト',1.0,1],['英 第2歩兵師団','ヨーク（英本土）',0.8,3]]},
 {id:'be1',short:'白I',name:'ゲッティンゲン〜カッセル（ベルギー第1軍団）',terrain:0.75,
  natoCmd:'NORTHAG ベルギー第1軍団（ケルン）',wpCmd:'東独第3軍',
  path:[[10.79,51.50,'ノルトハウゼン'],[9.93,51.53,'ゲッティンゲン'],[9.48,51.31,'カッセル'],[8.75,51.72,'パーダーボルン'],[7.47,51.51,'ドルトムント'],[6.77,51.23,'デュッセルドルフ（ライン）'],[6.08,50.78,'アーヘン'],[5.57,50.63,'リエージュ'],[4.35,50.85,'ブリュッセル'],[3.06,50.63,'リール（仏国境）'],[2.35,48.86,'パリ']],
  wp:[['東独 第4自動車化狙撃師団','エアフルト',1.0,0],['東独 第11自動車化狙撃師団','ハレ',1.0,0]],
  nato:[['ベルギー 第16機甲師団','ネーハイム＝ヒュステン',1.0,0],['ベルギー 第1歩兵師団','リエージュ（本国）',0.8,2]]},
 {id:'ge3',short:'西独III',name:'エシュヴェーゲ〜ギーセン（西独第3軍団）',terrain:0.7,
  natoCmd:'CENTAG 西独第3軍団（コブレンツ）',wpCmd:'在独ソ連軍 第8親衛軍・第1親衛戦車軍の一部',
  path:[[10.45,51.21,'ミュールハウゼン'],[10.05,51.19,'エシュヴェーゲ'],[9.71,50.87,'バート・ヘルスフェルト'],[9.27,50.75,'アルスフェルト'],[8.68,50.58,'ギーセン'],[7.60,50.36,'コブレンツ（ライン）'],[6.13,49.61,'ルクセンブルク'],[5.78,49.52,'ロンウィ（仏国境）'],[4.03,49.26,'ランス'],[2.35,48.86,'パリ']],
  wp:[['第57親衛自動車化狙撃師団（第8親衛軍）','ナウムブルク',1.0,0],['第20親衛自動車化狙撃師団（第1親衛戦車軍）','グリマ',1.0,0]],
  nato:[['西独 第2装甲擲弾兵師団','カッセル',1.0,0],['西独 第5装甲師団','ディーツ',1.0,1],['西独 第26空挺旅団','ザールルイ',0.3,1]]},
 {id:'us5',short:'米V',name:'フルダ・ギャップ（米第5軍団）',terrain:0.65,
  natoCmd:'CENTAG 米第5軍団（フランクフルト）',wpCmd:'在独ソ連軍 第8親衛軍（主力）',
  path:[[10.32,50.97,'アイゼナハ'],[9.68,50.55,'フルダ'],[8.92,50.13,'ハーナウ'],[8.68,50.11,'フランクフルト'],[8.27,50.00,'マインツ（ライン）'],[7.77,49.44,'カイザースラウテルン'],[7.00,49.23,'ザールブリュッケン（仏国境）'],[6.18,49.12,'メス'],[5.38,49.16,'ヴェルダン'],[4.03,49.26,'ランス'],[2.35,48.86,'パリ']],
  wp:[['第79親衛戦車師団','イェーナ',1.0,0],['第39親衛自動車化狙撃師団','オールドルフ',1.0,0],['第27親衛自動車化狙撃師団','ハレ',1.0,0]],
  nato:[['米 第11機甲騎兵連隊','フルダ',0.4,0],['米 第3機甲師団','フランクフルト',1.0,0],['米 第8歩兵師団（機械化）','バート・クロイツナハ',1.0,0],['米 第4歩兵師団（機械化）・第194機甲旅団・第197歩兵旅団（REFORGER）','米本土',1.6,10]]},
 {id:'us7',short:'米VII',name:'ホーフ・コーブルク〜ニュルンベルク（米第7軍団）',terrain:0.65,
  natoCmd:'CENTAG 米第7軍団（シュトゥットガルト）',wpCmd:'在独ソ連軍 第1親衛戦車軍・東独第7戦車師団・チェコスロヴァキア第1軍',
  path:[[12.13,50.50,'プラウエン'],[11.92,50.31,'ホーフ'],[11.58,49.94,'バイロイト'],[11.08,49.45,'ニュルンベルク'],[10.57,49.30,'アンスバッハ'],[9.22,49.14,'ハイルブロン'],[8.40,49.01,'カールスルーエ（ライン）'],[8.18,48.97,'ラウターブール（仏国境）'],[6.18,48.69,'ナンシー'],[4.07,48.30,'トロワ'],[2.35,48.86,'パリ']],
  wp:[['第11親衛戦車師団','ドレスデン',1.0,0],['第9戦車師団','リーザ',1.0,0],['東独 第7戦車師団','ドレスデン',1.0,0],['チェコスロヴァキア 第1戦車師団','スラニー',1.0,0],['チェコスロヴァキア 第19・第20自動車化狙撃師団','プルゼニ・カルロヴィ・ヴァリ',2.0,0]],
  nato:[['米 第2機甲騎兵連隊','ニュルンベルク',0.4,0],['米 第1機甲師団','アンスバッハ',1.0,0],['米 第3歩兵師団（機械化）','ヴュルツブルク',1.0,0],['西独 第12装甲師団（第3軍団）','ファイツヘーヒハイム',1.0,1],['カナダ 第4機械化旅団群','ラール',0.3,1],['米 第1歩兵師団（機械化、REFORGER）','フォート・ライリー',1.0,10]]},
 {id:'ge2',short:'西独II',name:'ケム〜レーゲンスブルク〜ドナウ（西独第2軍団）',terrain:0.65,
  natoCmd:'CENTAG 西独第2軍団（ウルム）',wpCmd:'チェコスロヴァキア第4軍・第1軍の一部',
  path:[[13.38,49.75,'プルゼニ'],[12.66,49.22,'カム'],[12.10,49.02,'レーゲンスブルク'],[11.42,48.76,'インゴルシュタット'],[9.99,48.40,'ウルム'],[7.75,48.58,'ストラスブール（ライン・仏国境）'],[6.02,47.24,'ブザンソン'],[4.84,45.76,'リヨン']],
  wp:[['チェコスロヴァキア 第4・第9戦車師団','ハヴリーチクーフ・ブロト・ターボル',2.0,0],['チェコスロヴァキア 第3・第15自動車化狙撃師団','クロムニェジーシュ・チェスケー・ブジェヨヴィツェ',2.0,0],['チェコスロヴァキア 第2自動車化狙撃師団','スシツェ',1.0,0]],
  nato:[['西独 第4装甲擲弾兵師団','レーゲンスブルク',1.0,0],['西独 第10装甲師団','ジグマリンゲン',1.0,1],['西独 第1山岳師団','ガルミッシュ＝パルテンキルヒェン',0.8,1],['西独 第1空挺師団','ブルッフザール',0.6,1]]}
];
// echelon reinforcements: [name, DE, day, targetAxisIds(null=best)]
// [name, DE, day, targets(null = main effort), minYear]
const WP_ECH=[
 ['在独ソ連軍 第34親衛砲兵師団・第35親衛空中強襲旅団（主攻正面の火力・空中機動）',1.0,1,null],
 ['ソ連空挺軍の空挺師団1〜2個（NATO後方の渡河点・飛行場へ降下）',1.5,2,null],
 ['在独ソ連軍の第2梯団 第20親衛軍（第25戦車・第32親衛戦車・第90親衛戦車・第35自狙師団）',4,2,['nl1','ge1','uk1','be1']],
 ['ソ連中央軍集団（チェコスロヴァキア駐留：第15親衛戦車・第31戦車・第18親衛自狙・第30親衛自狙・第48自狙師団。1968年以降）',5,3,['us7','ge2'],1968],
 ['ソ連北部軍集団（ポーランド駐留：第20戦車・第6親衛自狙師団）',2,3,['jut','nl1']],
 ['ポーランド方面軍 第2梯団＝シロンスク軍管区の軍（第5・第10・第11戦車師団、第2・第4自狙師団）',5,5,['jut','nl1']],
 ['チェコスロヴァキア東部軍管区（第13・第14戦車師団、低充足）',2,6,['us7','ge2']],
 ['ポーランド方面軍 第3梯団＝ワルシャワ軍管区の師団（第1・第3・第9自狙師団）',3,8,['jut','nl1']],
 ['東独 動員師団（第6・第10・第17師団＝第3軍の予備、M+2までに動員）',1.8,2,['be1','ge3','us7']],
 ['東独 動員師団（第19・第20師団＝第5軍の予備、M+2までに動員）',1.2,2,['jut','nl1']]
];
// strategic second echelon from the western USSR: [name, DE, offset from wp2Day]
const WP_STRAT=[
 ['戦略第2梯団 第1波（白ロシア軍管区：第5親衛戦車軍・第7戦車軍・第28軍、バルト軍管区：第11親衛軍）',14,0],
 ['戦略第2梯団 第2波（カルパチア軍管区：第8戦車軍・第13軍・第38軍、キエフ軍管区ほか）',16,5],
 ['戦略予備 第3波（モスクワ・ヴォルガ・ウラル軍管区などの低充足師団を動員。約20個師団を練度・装備の差で師団換算15とする）',15,22]
];
const NATO_RES=[
 ['西独 郷土軍の郷土防衛旅団（予備役主体、師団換算2）',2,5,null],
 ['米第3軍団（第1騎兵・第2機甲・第5歩兵（機械化）師団、第3機甲騎兵連隊）＝NORTHAG予備。装備は欧州に事前集積（POMCUS）、人員は空輸',3.4,12,['nl1','ge1','uk1','be1']],
 ['仏 第1軍（西独駐留の第2軍団：第1・第3・第5機甲師団）',2.5,3,['ge3','us5','us7','ge2'],'france'],
 ['仏 緊急展開部隊（FAR）',1.2,6,['ge3','us5','us7','ge2'],'france'],
 ['英 領土軍・本土予備の旅団群（師団換算1.5）',1.5,15,['jut','nl1','ge1','uk1']],
 ['米本土からの第2波（現役師団と州兵のラウンドアウト旅団、師団換算3）。重装備は大西洋の船団で輸送',3,22,null,'sea'],
 ['米 州兵師団の動員（師団換算4、装備と練度の差を織り込む）。大西洋の船団で輸送',4,45,null,'sea']
];
const FRONTAGE=8, DAYS=60;
// air order of battle by era: WP numbers relative to NATO (=1), NATO quality multiplier
const AIR_ERA=e=>e<1970?{w:1.5,q:1.3,shelter:0.15}:e<1980?{w:1.8,q:1.6,shelter:0.45}:{w:1.9,q:2.0,shelter:0.65};
const DPW=kt=>1035*Math.pow(kt,2/3)*1.2; // civilian deaths per weapon (Carte Blanche anchor x 1980s density)
const KM=(a,b)=>d3g.geoDistance(a,b)*6371;
function prepAxes(){AXES.forEach(a=>{a.cum=[0];for(let i=1;i<a.path.length;i++)a.cum.push(a.cum[i-1]+KM(a.path[i-1],a.path[i]));a.len=a.cum[a.cum.length-1];
  const ri=a.path.findIndex(p=>p[2].includes('ライン'));a.rhine=ri>=0?a.cum[ri]:null;a.seaKm=a.amph?a.cum[1]:0;
  const fi=a.path.findIndex(p=>p[2].includes('仏国境'));a.fr=fi>=0?a.cum[fi]:null;a.paris=a.path[a.path.length-1][2]==='パリ';});}
function run(p){
  if(p.intel!=null)p={...p,natoLag:(p.intel||0)+(p.decide||0)};
  p={...p,warning:Math.max(0,p.wpMob-p.natoLag),ignore:p.nukeMode==='ignore'};
  const M=p.wpMob, nk=p.nk||{n1:40,k1:10,n2:400,k2:200,n3:300,k3:150};
  const ax=AXES.map(a=>({a,wp:0,nato:0,pen:0,omg:0,omgUsed:false,landed:!a.amph,hist:[],fogW:1,fogN:1}));
  const land=ax.filter(x=>!x.a.amph);
  let mainAx=p.main&&p.main!=='auto'?ax.find(x=>x.a.id===p.main):null;
  const best=(c)=>c.reduce((m,x)=>x.pen>m.pen?x:m,c[0]);
  const weakest=(c)=>c.reduce((m,x)=>x.nato<m.nato?x:m,c[0]);
  const pick=(c,live)=>(mainAx&&c.includes(mainAx))?mainAx:(live?best(c):weakest(c));
  const log=[[0,'start',`D日。WPは開戦の${M}日前に動員を始め、NATOはその${p.natoLag}日後に動員を決めた（NATOの準備は${p.warning}日）。${p.nuc==='early'?'WPの想定ではNATOが先に核を使う。':'WPが通常戦力で攻勢を開始。'}`]];
  let stop=null, thrDay=null, reached={}, nucT=null, civ={w:0,e:0}, wpBoost=0, useDay=null, rhineX=false, frHome=false, frWarn=false, phase2Log=false;
  // West Berlin
  const B={on:p.berlin&&p.berlin!=='none',assault:p.berlin==='assault',wp:p.berlin==='assault'?2.9:0.8,al:1.0,fell:null,ret:false,hist:[]};
  let gaHeld=B.assault?1:0;
  // Austrian corridor
  const AU={on:p.austria==='violate',wp:6,def:1.5,thru:null};
  const chemN=p.chem?1-(p.chemN??15)/100:1, chemW=p.chem?1-(p.chemW??5)/100:1, chemDelay=p.chem?Math.round(p.chemDelay??2):0;
  const rng=p.seed?mulberry(p.seed):null; const gauss=()=>{let u=0,v=0;while(!u)u=rng();v=rng();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);};
  const bDef=2.5*(p.bDef||1), aDef=2.2*(p.aDef||1);
  let parisDay=null, calaisDay=null;
  const nukes=[]; // [day, axisId, kind] for the map
  const ae=AIR_ERA(p.era); let airN=1, airW=ae.w*(p.airW||1); const airQ=p.airQ||ae.q; let sGot=false;
  const natoArr=(u,d)=>u[3]<=p.warning+d;
  ax.forEach(x=>{x.nato=x.a.nato.filter(u=>natoArr(u,0)).reduce((s,u)=>s+u[2],0)*p.scaleNato;
    if(x.a.amph){x.amphPool=x.a.wp.reduce((s,u)=>s+u[2],0);}else{x.wp=x.a.wp.filter(u=>u[3]<=M).reduce((s,u)=>s+u[2],0);}});
  if(rng)ax.forEach(x=>{x.fogW=Math.exp(0.10*gauss());x.fogN=Math.exp(0.10*gauss());});
  const pre=[];
  WP_ECH.forEach(e=>{if(e[4]&&p.era<e[4])return;if(e[2]>M)return;const c=e[3]?ax.filter(x=>e[3].includes(x.a.id)):land;const t=pick(c,false);const v=e[1]-(e[0].includes('第20親衛軍')?gaHeld:0);t.wp+=v;pre.push(`${t.a.short}+${v}`);});
  WP_STRAT.forEach(w=>{if(p.wp2Day+w[2]>M)return;const tot=w[1]*p.wp2;const first=mainAx||weakest(land);const second=weakest(land.filter(x=>x!==first));first.wp+=tot*0.7;second.wp+=tot*0.3;pre.push(`戦略第2梯団（${first.a.short}・${second.a.short}）+${tot.toFixed(0)}`);});
  if(pre.length)log.push([0,'2nd',`開戦までに展開を終えた後続部隊：${pre.join('、')}（師団換算）`]);
  if(B.on)log.push([0,B.assault?'omg':'nato',B.assault?'東独軍と在独ソ連軍が西ベルリンの攻略にかかる（東独第1自動車化狙撃師団・ソ連第6独立親衛自狙旅団・国境警備隊に第20親衛軍の1個師団、計約3万人）。守るのは米英仏の守備隊と警察、約1万2千人':'西ベルリンは攻略せず包囲にとどめる。包囲に師団換算0.8を張り付ける']);
  log.push([0,'nato',AU.on?'WPがオーストリアの中立を破り、ソ連南部軍集団（4個師団）とハンガリー軍がウィーンからリンツを経てバイエルンを目指す':'オーストリアの中立は守られる（1964年計画も、3日目までにオーストリアが中立を保った場合の部隊配置を定めていた）']);
  ax.forEach(x=>x.hist.push({pen:0,wp:x.wp,nato:x.nato,R:null,omg:false}));
  const sHist=[airN*airQ/(airN*airQ+airW)], civHist=[0];
  let nato0=ax.reduce((s,x)=>s+x.nato,0);
  const addNato=(d)=>{ax.forEach(x=>x.a.nato.forEach(u=>{if(u[3]>0&&u[3]===p.warning+d){x.nato+=u[2]*p.scaleNato;if(u[2]>=0.8&&d>0)log.push([d,'nato',`${u[0]}が${x.a.short}の担当区域に到着`]);}}));};
  const warDay=(m)=>{const d=m-M;return d>0?d+(p.natoDoc==='ALB'?2:0):0;};
  const seaDelay=Math.round((1-p.sea)*8), seaFrac=0.4+0.6*p.sea;
  function firstUse(d){if(nucT)return;nucT=d;const t=best(land);const veto=!!p.frgVeto;
    t.wp*=veto?0.7:0.5;t.halt=veto?1:2;const c=nk.n1*DPW(nk.k1);if(veto)civ.e+=c;else{civ.w+=c*0.6;civ.e+=c*0.4;}nukes.push([d,t.a.id,veto?'e':'f']);
    log.push([d,'nuc',veto?`西ドイツが自国領内での使用を拒んだため、NATOは東独領内の後続部隊と渡河点を狙って核を初使用（${nk.n1}発×${nk.k1}kt）。${t.a.short}軸のWPは3割を失い、1日前進が止まる`:`NATOが${t.a.short}正面で核を選択的に初使用（${nk.n1}発×${nk.k1}kt）。この正面のWP部隊は半減し、2日間前進が止まる`]);
    if(p.nukeMode==='fu')log.push([d,'nuc','（仮定）WPは報復せず、通常戦が続く。ソ連の核ドクトリンとは合わない、楽観的な想定']);}
  for(let d=1;d<=DAYS;d++){
    addNato(d);
    // ---- air war ----
    if(d<=3&&p.airOp>0){const gl=0.12*p.airOp*(1-ae.shelter);airN*=1-gl;airW*=1-0.05*p.airOp*(0.5+0.5*Math.min(1,p.warning/3));
      if(d===3)log.push([d,'omg',`WPの初期航空作戦が一段落。NATOの航空戦力は${Math.round(airN*100)}%が残存（掩体の整備で地上撃破を抑えた度合いは時代による）`]);}
    if(d===1&&p.norway){airN*=0.94;log.push([d,'nato','WPが北ノルウェーにも攻撃。NATOは米空軍8個・英空軍1個飛行隊と英蘭の海兵旅団、米海兵旅団（装備はトロンハイム近郊の洞窟に事前集積）を北翼へ回す。中欧の航空戦力が6%減る']);}
    if(d===1&&p.chem)log.push([d,'omg',`WPが化学兵器を使う。NATO部隊は防護装備を着けたまま戦うことになり戦闘力が${Math.round((1-chemN)*100)}%落ち、飛行場と港の機能低下で航空戦力の効率が鈍り、増援の到着が${chemDelay}日遅れる。WPも汚染地帯の通過で${Math.round((1-chemW)*100)}%落ちる`]);
    let EN=airN*airQ*chemN, EW=airW, s=EN/(EN+EW);
    airW*=1-0.08*s; airN*=1-0.08*(1-s)*0.6;
    EN=airN*airQ*chemN; EW=airW; s=EN/(EN+EW);
    if(!sGot&&s>=0.6){sGot=true;log.push([d,'nato',`NATOが航空優勢を確保（指数${Math.round(s*100)}）。WPの後続部隊と補給線への航空阻止が本格化`]);}
    const interdict=0.03*Math.max(0,s-0.45);
    if(interdict>0)land.forEach(x=>{x.wp*=1-interdict;});
    const casN=1+0.3*(s-0.5), casW=1+0.3*(0.5-s);
    const deepEff=Math.min(1,s/0.6);
    // ---- WP arrivals ----
    ax.forEach(x=>{if(x.a.amph)return;x.a.wp.forEach(u=>{if(u[3]>M&&u[3]-M===d){x.wp+=u[2];log.push([d,'2nd',`${u[0]}が${x.a.short}軸に投入`]);}})});
    WP_ECH.forEach(e=>{if(e[4]&&p.era<e[4])return;if(e[2]<=M||warDay(e[2])!==d)return;
      const c=e[3]?ax.filter(x=>e[3].includes(x.a.id)):land;const t=pick(c,true);
      const ded=p.natoDoc==='ALB'?p.deep*deepEff:0;t.wp+=(e[1]-(e[0].includes('第20親衛軍')?gaHeld:0))*(1-ded);log.push([d,'2nd',`${e[0]}を${mainAx===t?'主攻正面の':'突破の進んだ'}${t.a.short}軸へ投入${ded>0?'（縦深攻撃で一部減殺）':''}`]);});
    WP_STRAT.forEach(w=>{const m=p.wp2Day+w[2];if(m<=M||warDay(m)!==d)return;const ded=p.natoDoc==='ALB'?p.deep*deepEff:0;const tot=w[1]*p.wp2*(1-ded);
      const first=mainAx||best(land);const second=best(land.filter(x=>x!==first));first.wp+=tot*0.7;second.wp+=tot*0.3;
      log.push([d,'2nd',`${w[0]}が到着（師団換算${tot.toFixed(1)}）。7割を${first.a.short}軸、3割を${second.a.short}軸へ集中${ded>0?`。縦深攻撃で${Math.round(ded*100)}%を減殺`:''}`]);});
    // ---- NATO reinforcements (sea-dependent ones depend on the Atlantic) ----
    NATO_RES.forEach(r=>{if(r[4]==='france'&&!p.france)return;const arr=r[2]+(r[4]==='sea'?seaDelay:0)+chemDelay;
      if(arr===p.warning+d||(arr<=p.warning&&d===1)){const cand=r[3]?ax.filter(x=>r[3].includes(x.a.id)):land;const t=cand.reduce((m,x)=>x.pen>m.pen?x:m,cand[0]);
        const v=(r[1]-(p.norway&&r[0].startsWith('英 領土軍')?0.3:0))*p.scaleNato*(r[4]==='sea'?seaFrac:1);t.nato+=v;
        log.push([d,'nato',`${r[0]}が最も押された${t.a.short}正面へ${r[4]==='sea'?`（船団の損失で${Math.round(seaFrac*100)}%が到着、${seaDelay}日遅れ）`:''}`]);}});
    if(d===20&&p.sea<0.6)log.push([d,'nato','欧州の弾薬・燃料の備蓄（15〜20日分）が尽き始め、大西洋の船団頼みになる。NATOの戦闘力が落ちる']);
    const supplyN=d>20?(0.75+0.25*p.sea):1;
    // ---- nuclear events ----
    if(p.nuc==='early'&&d===1){ax.forEach(x=>{x.nato*=0.5;x.wp*=0.7});airN*=0.5;airW*=0.7;civ.w+=nk.n2*DPW(nk.k2);civ.e+=nk.n3*DPW(nk.k3);land.forEach(x=>{nukes.push([1,x.a.id,'w']);nukes.push([1,x.a.id,'e']);});
      log.push([d,'nuc',`双方が戦域核を大規模に応酬（核パネルの段階2・3の規模）。NATO戦力は半減、WPも3割を失う（モデル上の仮定）`]);}
    if(nucT&&p.nukeMode==='esc'&&d===nucT+1){ax.forEach(x=>{x.nato*=0.55;});airN*=0.4;wpBoost=3;civ.w+=nk.n2*DPW(nk.k2);land.forEach(x=>nukes.push([d,x.a.id,'w']));
      log.push([d,'nuc',`WPが戦域核で大規模に反撃（${nk.n2}発×${nk.k2}kt）。NATOの核貯蔵所・飛行場・司令部・港湾が狙われ、NATO戦力は45%、航空戦力は60%を失う`]);}
    if(nucT&&p.nukeMode==='esc'&&d===nucT+2){land.forEach(x=>{x.wp*=0.7;nukes.push([d,x.a.id,'e']);});airW*=0.6;civ.e+=nk.n3*DPW(nk.k3);
      log.push([d,'nuc',`NATOが東欧へ戦域核で反撃（${nk.n3}発×${nk.k3}kt）。WPの後続部隊と輸送拠点が狙われる。ここから先の戦略核の応酬は核パネルの段階4`]);}
    // ---- West Berlin ----
    if(B.on&&B.assault&&!B.fell){const Rb=B.wp/(B.al*bDef*p.natoQ);B.al-=B.al*0.07*Math.pow(Rb,0.7);B.wp-=B.wp*0.03*Math.pow(1/Rb,0.6);
      if(B.al<0.15){B.fell=d;log.push([d,'omg',`西ベルリンが陥落（開戦${d}日目）。守備隊は兵力の3倍近い攻撃を受け、市街戦の末に抵抗を終える`]);}}
    if(B.fell&&!B.ret&&d>=B.fell+2&&gaHeld>0){B.ret=true;const t=best(land.filter(x=>['nl1','ge1','uk1','be1'].includes(x.a.id)));t.wp+=gaHeld*0.8;gaHeld=0;log.push([d,'2nd',`ベルリン攻略に使った第20親衛軍の師団が前線へ戻り、${t.a.short}軸に投入`]);}
    B.hist.push(B.on?(B.assault?(B.fell?0:B.al):1):null);
    // ---- Austrian corridor ----
    if(AU.on&&!AU.thru&&d>=2){const Ra=AU.wp/(AU.def*aDef);AU.def-=AU.def*0.06*Math.pow(Ra,0.7);AU.wp-=AU.wp*0.025*Math.pow(1/Ra,0.6);
      if(d===2)log.push([d,'omg','オーストリア連邦軍が領域防衛（シュパノッキの「空間防御」）で山地と要所に拠って遅滞戦闘に入る']);
      if(AU.def<0.3){AU.thru=d;const g=ax.find(x=>x.a.id==='ge2');g.wp+=AU.wp*0.8;g.flank=true;log.push([d,'2nd',`オーストリアを抜けたWP部隊（師団換算${(AU.wp*0.8).toFixed(1)}）がパッサウ方面からバイエルンに入り、西独第2軍団の南翼を突く`]);}}
    // amphibious
    ax.forEach(x=>{if(!x.a.amph||x.landed)return;if(d===p.landDay){if(p.baltic<0.35){x.landed=true;x.failed=true;x.wp=0;log.push([d,'nato',`シェラン島への上陸が失敗。NATOの海空戦力がバルト海出口を押さえ、上陸部隊の大半が洋上で失われる`]);}
      else{x.landed=true;x.wp=x.amphPool*Math.min(1,p.baltic+0.2);x.pen=x.a.seaKm;log.push([d,'omg',`ケーゲ湾に上陸、空挺部隊が降下（師団換算${x.wp.toFixed(2)}）。バルト海出口の制圧を目指す`]);}}});
    const posture=p.warning>=3?1.2:(p.warning>=1?1.1:1.0);
    for(const x of ax){
      if(x.a.amph&&(!x.landed||x.failed)){x.hist.push({pen:x.pen,wp:x.wp,nato:x.nato,R:null,omg:false});continue;}
      const river=(x.a.rhine&&x.pen>=x.a.rhine-20&&x.pen<x.a.rhine)?1.5:1;
      const natoEff=Math.max(0.05,x.fogN*x.nato*p.natoQ*posture*river*casN*supplyN*chemN*(x.flank?0.85:1)*(p.natoDoc==='AD'&&d<=4?1.15:1)*(x.omg>0?0.85:1));
      const front=x.a.amph?99:FRONTAGE;const wpEff=Math.max(0.01,Math.min(x.wp,front)*x.fogW*p.wpQ*casW*chemW); const R=wpEff/natoEff;
      let adv;
      if(R>1.1)adv=x.a.terrain*12*(R-1.1);else if(R>=0.8)adv=x.a.terrain*1.5;else adv=d>=4?-x.a.terrain*8*(0.8-R)/0.8*(p.natoDoc==='ALB'?1:0.5):0;
      if(p.nuc==='early'&&d<=3)adv*=1.6;
      if(wpBoost>0&&adv>0)adv*=1.6;
      if(x.halt>0){adv=Math.min(adv,0);x.halt--;}
      if(adv>0)adv*=1/(1+x.pen/500);
      if(rng&&adv>0)adv*=Math.exp(0.3*gauss()-0.045);
      if(p.wpDoc==='conv'&&!x.omgUsed&&!x.a.amph&&R>1.6&&x.pen>15){x.omgUsed=true;x.omg=4;log.push([d,'omg',`${x.a.short}軸でOMGを投入。NATO後方の指揮所・補給・渡河点を狙う`]);}
      const omgNow=x.omg>0; if(omgNow){adv*=1.6;x.omg--;}
      if(adv<0&&x.pen>x.a.seaKm&&!x.cntr){x.cntr=true;log.push([d,'nato',`${x.a.short}正面で戦力比が逆転し、NATOが反撃に転じる`]);}
      adv=Math.min(60,adv); x.pen=Math.min(x.a.len,Math.max(x.a.seaKm,x.pen+adv));
      const pin=R<0.8;
      const wl=Math.min(x.wp,front)*0.03*Math.pow(natoEff/wpEff,0.6)*(p.natoDoc==='AD'&&d<=4?1.2:1)*(pin?0.35:1);
      const nl=x.nato*0.032*Math.pow(R,0.7)*(pin?0.6:1);
      if(pin&&!x.pinLog&&d>=2){x.pinLog=true;log.push([d,'nato',`${x.a.short}正面ではWPの攻撃が頓挫し、拘束攻撃に切り替わる`]);}
      x.wp=Math.max(0.01,x.wp-wl); x.nato=Math.max(0.05,x.nato-nl);
      if(x.a.rhine&&x.pen>=x.a.rhine&&!reached[x.a.id]){reached[x.a.id]=d;log.push([d,'2nd',`${x.a.short}軸でライン川に到達`]);}
      if(x.a.amph&&x.pen>=x.a.cum[2]&&!reached[x.a.id]){reached[x.a.id]=d;log.push([d,'2nd','コペンハーゲンに到達。バルト海峡が開く']);}
      if(x.a.rhine&&x.pen>=x.a.rhine&&!rhineX){rhineX=true;}
      if(x.a.fr&&x.pen>=x.a.fr-15&&!frHome){frHome=true;x.nato+=4*p.scaleNato;log.push([d,'nato',`${x.a.short}軸がフランス国境に迫る。NATO統合軍事機構の外にあっても、フランスは本土の第1軍（第1・第3軍団）と予備役を投入して自国を守る（師団換算4）`]);}
      if(p.frNuke&&x.a.fr&&x.pen>=x.a.fr+20&&!frWarn){frWarn=true;x.wp*=0.8;x.halt=2;civ.w+=10*DPW(25);nukes.push([d,x.a.id,'f']);
        log.push([d,'nuc',`WP軍がフランス領に入ったため、フランスが「最後の警告」として前戦略核（プリュトン級、25kt×10発と仮定）を使う。次は戦略核による報復という意思表示で、その後の展開はモデルの外`]);}
      if(x.a.paris&&x.pen>=x.a.len&&!x.parisLog){x.parisLog=true;if(!parisDay)parisDay=d;log.push([d,'nuc',`${x.a.short}軸でパリに到達`]);}
      if(x.a.id==='uk1'&&x.pen>=x.a.len&&!x.chLog){x.chLog=true;calaisDay=d;log.push([d,'2nd','英仏海峡の港（カレー）に到達。英国からの増援路が脅かされる']);}
      x.hist.push({pen:x.pen,wp:x.wp,nato:x.nato,R,omg:omgNow});
    }
    // army-group reserves: quiet sectors release a share of their forces to the most threatened sector
    {const thr=land.filter(x=>x.hist[x.hist.length-1].R!=null);if(thr.length){const hot=thr.reduce((m,x)=>(x.hist[x.hist.length-1].R>m.hist[m.hist.length-1].R?x:m),thr[0]);
      if(hot.hist[hot.hist.length-1].R>1.3){let moved=0;thr.forEach(x=>{const r=x.hist[x.hist.length-1].R;if(x!==hot&&r<0.6&&x.nato>1.5){const m=x.nato*0.04;x.nato-=m;moved+=m;}});
        if(moved>0){hot.nato+=moved*0.8;if(!hot.latLog){hot.latLog=true;log.push([d,'nato',`NATOが手薄でない正面から予備を引き抜き、${hot.a.short}正面へ回す（軍集団の予備運用）`]);}}}}}
    if(wpBoost>0)wpBoost--;
    if(rhineX&&p.phase2&&p.phase2!=='same'){const set=p.phase2==='paris'?land.filter(x=>x.a.paris):land.filter(x=>['uk1','ge1','nl1'].includes(x.a.id));
      if(set.length){const nm=best(set);if(nm!==mainAx){mainAx=nm;if(!phase2Log){phase2Log=true;log.push([d,'2nd',`ライン川を越えたWPは主攻を${p.phase2==='paris'?'パリ':'英仏海峡の港とベネルクス'}へ向け直す。後続の梯団は${nm.a.short}軸へ`]);}}}}
    if(useDay&&d===useDay)firstUse(d);
    sHist.push(s); civHist.push(civ.w+civ.e);
    const natoT=ax.reduce((s,x)=>s+x.nato,0);
    const mxX=land.reduce((m,x)=>x.pen>m.pen?x:m,land[0]);
    if(p.nuc==='flex'&&!p.ignore&&!useDay&&!nucT&&(mxX.pen>=p.threshold||natoT<0.5*nato0&&d>3)){
      const why=mxX.pen>=p.threshold?`${mxX.a.short}軸の突破が${Math.round(mxX.pen)}kmに達した`:'NATOの戦力が当初の半分を割った';
      if(p.nukeMode==='stop'){stop=d;log.push([d,'nuc',`${why}。NATOは核使用の判断を迫られる（柔軟反応の敷居）。通常戦のモデルはここで止まる`]);break;}
      if(!useDay){const cd=p.consult||0;useDay=d+cd;thrDay=d;log.push([d,'nuc',`${why}。NATOは核使用の判断に入る${cd>0?`。西ドイツを含む同盟国との協議に${cd}日かかり、その間も戦闘は続く`:''}`]);if(cd===0)firstUse(d);}
    }
  }
  return {ax,log,stop,days:stop||DAYS,reached,sHist,civHist,nucT,thrDay,nukes,berlin:B,austria:AU,parisDay,calaisDay};
}
function mulberry(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
/* Monte Carlo: jitter the uncertain inputs around the user's settings */
const MC_RANGES=[
  ['natoQ','NATOの質的係数','×0.8〜1.2'],['wpQ','WPの質','×0.85〜1.15'],['airQ','NATO機の質','×0.75〜1.25'],['airOp','WPの初期航空作戦','±15ポイント'],
  ['sea','大西洋の制海','±15ポイント'],['baltic','バルト海の制海','±15ポイント'],['deep','縦深攻撃の効果','×0.5〜1.5'],
  ['wpMob','WPの動員開始','±2日'],['intel','動員の察知','−1〜+2日'],['decide','同盟の決定','−1〜+2日'],['consult','核の協議','−1〜+2日'],['wp2Day','戦略第2梯団の到着','−2〜+3日'],
  ['chemN','化学兵器の効果','×0.5〜1.5（使用時）'],['bDef','西ベルリンの市街戦防御','×0.7〜1.4'],['aDef','オーストリアの山地防御','×0.7〜1.4'],
  ['fog','軸ごとの戦力見積もりの誤差','各軸±10%（対数正規）'],['day','日々の前進の振れ','±30%（対数正規）']];
function jitter(p,r){const U=(a,b)=>a+(b-a)*r(),I=(a,b)=>a+Math.floor(r()*(b-a+1)),cl=(v,a,b)=>Math.max(a,Math.min(b,v));
  const q={...p};q.natoQ=p.natoQ*U(0.8,1.2);q.wpQ=(p.wpQ||1)*U(0.85,1.15);q.airQ=(p.airQ||2)*U(0.75,1.25);q.airOp=cl(p.airOp+U(-.15,.15),0,1);
  q.sea=cl(p.sea+U(-.15,.15),0,1);q.baltic=cl(p.baltic+U(-.15,.15),0,1);q.deep=p.deep*U(0.5,1.5);
  q.wpMob=Math.max(0,p.wpMob+I(-2,2));q.intel=Math.max(0,(p.intel||0)+I(-1,2));q.decide=Math.max(0,(p.decide||0)+I(-1,2));q.consult=Math.max(0,(p.consult||0)+I(-1,2));
  q.wp2Day=Math.max(3,p.wp2Day+I(-2,3));q.chemN=(p.chemN??15)*U(0.5,1.5);q.chemW=(p.chemW??5)*U(0.5,1.5);q.bDef=U(0.7,1.4);q.aDef=U(0.7,1.4);return q;}
function mc(p,n,seed){const r=mulberry(seed||12345);const out=[];
  for(let i=0;i<n;i++){const q=jitter(p,r);q.seed=1+Math.floor(r()*1e9);const z=run(q);
    out.push({thr:z.stop||z.thrDay||null,use:z.nucT,berlin:z.berlin.fell,aust:z.austria.thru,reached:z.reached,paris:z.parisDay,calais:z.calaisDay,
      rhine:(r=>r.length?Math.min(...r):null)(Object.entries(z.reached).filter(([k])=>k!=='zea').map(([,v])=>v))});}
  return out;}
if(typeof module!=='undefined')module.exports={AXES,run,prepAxes,WP_ECH,NATO_RES,WP_STRAT,DPW,AIR_ERA,mc,jitter,MC_RANGES};
