"""Build the single-file page from src/.
  python3 build.py   ->  index.html (standalone, for GitHub Pages)
                         dist/artifact.html (fragment without <html>/<head>, as published to claude.ai)
"""
import re, os
ROOT=os.path.dirname(os.path.abspath(__file__)); SRC=os.path.join(ROOT,'src')+os.sep
s=open(SRC+'page.src.html',encoding='utf8').read()
geo=open(SRC+'data/eu.json',encoding='utf8').read()
a=s.index('<section id="sim">'); b=s.index('<section id="ops">')
s=s[:a]+open(SRC+'sim_section.html',encoding='utf8').read()+'\n'+s[b:]
s=s.replace('<a href="#sim">2 シミュレーター</a>','<a href="#sim">2 シミュレーター</a><a href="#orbat">2-2 戦闘序列</a><a href="#eras">2-4 時代別の編成</a><a href="#divisions">2-5 主な師団</a><a href="#nuke">2-3 核</a>')
s=s.replace('<span>簡易シミュレーター</span>','<span>10軸・師団単位の戦闘序列</span><span>核エスカレーション推計</span>')
s=s.replace('このページは、その変化を時期ごとに対照し、簡易モデルで「計画が想定した戦争」を動かして確かめる。','このページは、その変化を時期ごとに対照し、1980年代の戦闘序列にもとづく簡易モデルで「計画が想定した戦争」を動かし、核が使われた場合の民間人の被害を公表研究の数字から推計する。')
old_model=s[s.index('<p><b>戦力</b>'):s.index('</div>\n  <ol class="src">')]
new_model='''<p><b>戦力</b>：各軸の部隊は、NATO側は1989年の北部・中部軍集団とBALTAPの戦時編成、ワ条約機構側は在独ソ連軍・東独軍・ポーランド軍・チェコスロヴァキア軍・ソ連中央軍集団・北部軍集団の平時の配置にもとづく（§2-2）。1個師団を1.0、旅団・連隊を0.25〜0.4とした。全体の規模はNATOの1984年評価（WP約95個師団、うち61個が高即応）に合わせ、ソ連西部の軍管区から来る戦略第2梯団を2波・計30師団換算とした。ワ条約機構側の軸への割り当ては計画文書ではなく、駐屯地と西側の一般的な見積もりから置いた想定である。1968年より前のシナリオではソ連中央軍集団を除く。</p>
    <p><b>計算</b>：WPの実効戦力をNATOの実効戦力（質的係数×防御態勢）で割った比が1.1を超えると、超過分に比例して前進する（地形係数を掛け、1日90kmが上限）。WPは後続の梯団と戦略第2梯団を主攻正面へ集中し（戦略第2梯団は7割を主攻、3割を次に進んだ軸）、戦力比が0.8を割った正面では拘束攻撃に切り替えて損耗を抑える。NATOの部隊は動員開始からの到着日に担当区域へ入る。シェラン島はD+2に上陸し、バルト海の制海・制空が35%未満なら失敗する。D+60までの後半には、西独郷土軍、仏緊急展開部隊、英領土軍、米本土からの第2波（M+22）と州兵師団（M+45）、ワ条約機構側はソ連内陸の低充足師団を動員した戦略予備の第3波（第1波の22日後）が加わる。航空戦は、時代ごとのWP機の数（NATOを1として1960年代1.5、1970年代1.8、1980年代1.9）とNATO機の質の係数から、毎日の空戦で双方の航空戦力が減っていく形で計算する。WPは開戦から3日間、NATOの飛行場を叩く初期航空作戦を行い、掩体の整備が進んだ時代ほど地上での損害が小さい。その結果の航空優勢指数に応じて、NATOの航空阻止がWPの全兵力を毎日削り、近接航空支援が双方の戦闘力を増減させる。縦深攻撃の効果も航空優勢がないと落ちる。大西洋の制海が低いほど、船で来る米国の増援は量が減り（最低40%）、到着が遅れる（最大8日）。D+20以降は欧州の備蓄が尽き、制海が低いとNATOの戦闘力が下がる（USNI Proceedings 1988の、備蓄15〜20日・船団の大損害という見積もりによる）。NATOは戦力比に余裕のある正面から毎日4%を引き抜き、最も危うい正面へ回す。WPの前進は突破が深くなるほど補給線が延びて鈍り、ライン川の手前20kmではNATOの防御力を1.5倍とした。核の同時使用では初日に双方が大損害を受け、3日間前進が加速する。数字は相対比較のためのもので、実際の戦闘結果を表すものではない。</p>
    <p><b>師団の重み</b>：ソ連の師団は西側の師団より小さく、ポーゼンらの装甲師団換算（ADE）ではソ連戦車師団は米機甲師団の6〜7割程度とされた。このモデルでは両軍の師団を同じ1.0と数え、その差をNATOの質的係数（標準1.2）と防御態勢（1.2）で表している。ワ条約機構の強みは1個師団の重さではなく、師団の数と、後続を途切れなく投入できる梯団の厚みにある。</p>
    <p><b>核の敷居と分岐</b>：柔軟反応のもとでNATOが核使用を検討する条件を、陸上のいずれかの軸の突破距離が「核の敷居」を超えるか、NATOの戦力が当初の半分を割ることと置いた。「計算を止める」を選ぶと、そこから先は政治判断として扱わない。初使用の分岐では、最も深く抜かれた正面のWP部隊を半減させて2日間止め、翌日にWPが戦域核で反撃（NATO戦力45%減・航空戦力60%減、その後3日間WPの前進が加速）、その翌日にNATOが東欧へ反撃（WP戦力30%減）する。被害の規模は核パネルの設定を使う。戦略核の応酬は陸戦の計算に入れていない。</p>
    <p><b>核の推計</b>：段階1〜3は、カルト・ブランシュ（1955）の「15kt×268発で死者170万人」から1発あたりの死者を求め、威力の2/3乗で拡大縮小し、人口密度の増加を1.2倍として掛けた。幅は0.5〜2倍。段階4はOTA（1979）の推計幅を使う。放射性降下物の長期影響、医療の崩壊、気候への影響は含まない。</p>
    <p><b>国ごとの差</b>：同盟全体の質的係数に加えて、部隊ごとに国の係数を掛けた。NATOは1980年代で米1.05、西独1.05、英1.0、加1.0、仏0.95、蘭0.85、ベルギー0.8、デンマーク0.8とした。蘭・ベルギーは主力の多くが本国にあり、徴集兵の服役期間が短く、動員と前方展開に日数がかかった。西独は1950年代の創設期を0.8、米は1970年代のベトナム後の「空洞化した陸軍」を0.85とした。この差の大きさはスライダーで0〜2倍に変えられる。担当国以外の部隊（LANDJUTのデンマーク師団、蘭第1軍団正面の米旅団、米第7軍団正面の西独・カナダ部隊、他の正面から回した予備）が占める割合に応じて、教範・装備・通信の違いによる摩擦（標準10%）で戦闘力を下げる。</p>
    <p>ワルシャワ条約機構側は、非ソ連軍の開戦時の政治的信頼性を時期ごとに置いた。東独軍は0.95（1950年代は0.85）。ポーランド軍は0.9（1960年代）から0.85（1970年代）を経て、連帯運動と戒厳令のあとの1980年代は0.7。チェコスロヴァキア軍は0.9から、1968年の軍事介入のあとは0.7、1980年代は0.75とした。信頼性の不足はスライダーで0〜2倍に変えられる。戦争が長引くと非ソ連軍の抗戦意欲はさらに落ちる（標準でD+45までに最大15%）。前進が止まった正面では1.5倍、順調に進む正面では半分、NATOが核を使ったあとは1.5倍の速さで落ちる。数字は西側の研究（RAND、米陸軍の信頼性研究）の定性的な評価を、このモデルの都合で数に置き換えたものである。</p>
    <p><b>警報期間中の再配置</b>：NATOは警報期間（WPの動員開始からNATOが動員を決めるまでの差）の間に、捉えたWPの集中に合わせて予備を寄せる。寄せられるのは同じ軍集団の中だけで、WPの見積もりが平均の7割未満の正面から1日4%（上限35%）を引き抜き、見積もりが平均の1.3倍を超える正面へ、集中の大きさに応じて配る（移動中の損耗で9割が着く）。他国の正面へ入った部隊には多国籍の摩擦がかかる。NATOが捉える集中は、ソ連の欺瞞（マスキロフカ）の強さに応じて各正面の平均へぼやけ、察知が遅いほど見積もりの誤差も大きくなる。軍集団をまたぐ移動（CENTAGとNORTHAGの間、1日3%・上限25%、着くのは8割）は選択にした。警報開始後に到着する予備も、開戦前なら最も脅かされた正面へ送る。1984年以降は、北部軍集団司令官バグナルが持ち込んだ軍集団の作戦予備と反撃の構想を選べる。選ぶと、北部軍集団の中の予備の移動が速くなり（開戦前は1日6%・上限45%、開戦後は1日7%で着くのは9割）、戦力比が逆転した正面での押し返しが1.3倍になる。</p>
    <p><b>大西洋と北翼</b>：大西洋の制海は固定値ではなく、ソ連潜水艦と海軍航空隊の脅威と、GIUKギャップの対潜障壁・船団護衛による消耗のせめぎ合いとして日ごとに動く。1982年のCIAの国家情報評価が示したように、ソ連海軍が戦略原潜の「要塞」の防衛を優先する場合、通商破壊に回る潜水艦は少ない。通商破壊を優先すると、開戦直後の船団の損失は大きいが、障壁での消耗で脅威はしだいに下がる。米海軍の前方戦略（1981年以降、空母をノルウェー海へ）は、ソ連の潜水艦を要塞の防衛に引きつけ、障壁での消耗を早め、北ノルウェーにも航空支援を与える。米国からの増援は出港した日の制海で到着の割合（40〜100%）と遅れ（0〜8日）が決まる。D+20以降の補給は、直近10日の制海の平均に左右される。</p>
    <p>北ノルウェーの戦いは、ソ連第6軍と北方艦隊の海軍歩兵（師団換算2.5、D+10に1.5を追加）に対し、ノルウェー北部旅団（0.7）と、北翼への増援（ACE機動部隊、英蘭海兵、トロンデラーグに装備を事前集積した米海兵旅団、計1.25）で戦う。山地と極地の防御を2.4倍、リュンゲン線ではさらに1.8倍とした。バルドゥフォスとトロムソの飛行場が落ちると、ソ連の海軍航空隊が大西洋の船団を狙えるようになり、GIUKギャップの障壁も弱まる。増援を送らなければ北翼は持たないが、中欧の航空戦力と英国の予備はそのぶん厚くなる。全欧州戦域を一体で扱ったわけではなく、南翼（イタリア・ギリシャ・トルコ）と地中海は含まない。</p>
    <p><b>西ベルリン</b>：東独軍の攻略計画（1993年に報道された「ツェントルム」作戦。東独第1自動車化狙撃師団と国境警備隊を主力に約3万2千人）と、米英仏の守備隊（約1万2千人）を置いた。攻略側は師団換算2.9（第20親衛軍から1個師団を引き抜く）、守備側は1.0で、市街戦の防御力を2.5倍とした。陥落の2日後、引き抜いた師団が北部の正面へ戻る（0.8に目減り）。「包囲にとどめる」では引き抜きは小さく、守備隊は戦わずに残る。</p>
    <p><b>側面</b>：オーストリアの中立を破るシナリオでは、ソ連南部軍集団（4個師団）とハンガリー軍の一部（師団換算6）がD+2からウィーン〜リンツ〜パッサウを進み、オーストリア連邦軍（1.5、シュパノッキの領域防衛にならい防御力2.2倍）が遅滞する。抜けた部隊の8割が西独第2軍団の正面に加わり、その正面のNATOは側背を突かれて戦闘力が15%落ちる。北ノルウェーへの攻撃は、NATO航空戦力の約6%と英国の増援の一部をそちらへ吸い出す形で表した。</p>
    <p><b>化学兵器</b>：ソ連の作戦構想は化学兵器の使用を組み込んでいた。使用時の効果はスライダーで変えられ、標準はNATOの戦闘力を15%（防護装備での戦闘）、WPを5%（自軍の汚染地帯の通過）下げ、港と飛行場の機能低下でNATOの増援を2日遅らせる。防護装備での戦闘力低下は研究によって2〜5割と幅があり、このモデルの前進の式は戦力比の小さな差を大きく増幅するので、結果はこの数字に敏感である。民間人への被害は数えていない。</p>
    <p><b>不確実性</b>：評価の割れていた数字（両軍の質、航空戦、制海、警報期間、第2梯団の到着、縦深攻撃、化学兵器の効果、ベルリンとオーストリアの防御）を一様分布の幅で揺らし、各軸の戦力見積もりに±10%、日々の前進に±30%の誤差（対数正規）を加えて、同じ設定を数百回回す。核の敷居で止める設定では、同時に「核を使わず60日間続けた場合」も回して、ライン川・英仏海峡・パリへの到達の割合を出す。「結果を左右する不確実性」は、揺らした各数字と到達日のスピアマン順位相関である。確率はこのモデルと仮定した幅のもとでの割合で、現実の戦争の確率ではない。幅を広げれば確率は散らばり、狭めれば一点の結果に近づく。</p>
    <p><b>政治判断</b>：NATOの準備期間は「情報がWPの動員を察知するまで」と「同盟が動員を決めるまで」の和とした。核の敷居に達してから実際に使うまでには、西ドイツを含む同盟国との協議の日数がかかる（1962年のアテネ・ガイドライン以来、使用前の協議が原則だった）。西ドイツが自国領内での使用を拒む設定では、初使用は東側の領土に限られ、効果は7割、停止は1日で、民間人の死者は東側に出る。</p>
    <p><b>ライン川の先</b>：各軸はライン川で止まらず、北はオランダの港湾とアントワープ・カレー、中部と南部はフランス国境を越えてパリやリヨンへ延びる。WPがライン川を越えると、主攻をパリへ向かう軸（または英仏海峡の港へ向かう軸）のうち最も進んだものへ切り替える。フランスは統合軍事機構の外にあっても、国境に迫られた時点で本土防衛の部隊（師団換算4）を投入し、国境の20km内側まで抜かれると「最後の警告」として戦術核（25kt×10発）を使う設定にできる。フランスの核ドクトリンは「プレストラテジック」な警告射撃のあとに戦略核での報復を示唆していたが、このモデルは警告射撃の段階だけを扱う。</p>
  '''
s=s.replace(old_model,new_model)
s=s.replace('    <li>地図：Natural Earth（world-atlas 2.0.2）。内独国境と河川は概略線。</li>','''    <li>戦闘序列：Wikipedia「NORTHAG wartime structure in 1989」「CENTAG wartime structure in 1989」「Allied Forces Baltic Approaches」「Outline of the Danish Armed Forces at the end of the Cold War」「Group of Soviet Forces in Germany」「Central Group of Forces」「Soviet Army」、orbat.info「Warsaw Pact Order of Battle June 1989」、"Warsaw Pact Deployment on the Central Front II"（warhistory.org、NATO 1984年評価の数字）。</li>
    <li>"Capabilities of Soviet General Purpose Forces"（NIE、1966年頃）, <i>FRUS 1964–68</i> vol. X, doc. 98. <a href="https://history.state.gov/historicaldocuments/frus1964-68v10/d98" target="_blank" rel="noopener">history.state.gov</a></li>
    <li>"Carte Blanche (NATO exercise)," Wikipedia（Der Spiegel 1955の報道ほか）。</li>
    <li>U.S. Congress, Office of Technology Assessment, <i>The Effects of Nuclear War</i>, 1979. <a href="https://www.atomicarchive.com/resources/documents/effects/ota/chapter-1-2.html" target="_blank" rel="noopener">atomicarchive.com</a></li>
    <li>National Security Archive, "U.S. War Plans Would Kill an Estimated 108 Million Soviets, 104 Million Chinese, and 2.6 Million Poles" (SIOP-62), 2011. <a href="https://unredacted.com/2011/11/08/u-s-war-plans-would-kill-an-estimated-108-million-soviets-104-million-chinese-and-2-3-million-poles-more-evidence-on-siop-62-and-the-origins-of-overkill/" target="_blank" rel="noopener">unredacted.com</a></li>
    <li>"Square Leg," Wikipedia（Openshaw & Steadman の推計）。</li>
    <li>World Health Organization, <i>Effects of Nuclear War on Health and Health Services</i>, 2nd ed., WHA40/11, 1987. <a href="https://www.mapw.org.au/wp-content/uploads/2023/02/WHA40_11_eng.pdf" target="_blank" rel="noopener">mapw.org.au</a></li>
    <li>"Soviet Sub vs. Resupply NATO," <i>U.S. Naval Institute Proceedings</i>, December 1988. <a href="https://www.usni.org/magazines/proceedings/1988/december/soviet-sub-vs-resupply-nato" target="_blank" rel="noopener">usni.org</a></li>
    <li>Elizabeth Pond, "The weapons balance tilts toward the East," <i>Christian Science Monitor</i>, 12 Oct 1983（カーバーの推計と米国防総省のネット・アセスメント）. <a href="https://csmonitor.com/1983/1012/101213.html" target="_blank" rel="noopener">csmonitor.com</a></li>
    <li>師団の来歴：Wikipedia「10th Guards Uralsko-Lvovskaya Tank Division」「79th Guards Tank Division」「39th Guards Motor Rifle Division」「16th Guards Tank Division」「Land Forces of the National People's Army」「7th Coastal Defense Brigade」「3rd Armored Division (United States)」「Observation Post Alpha」「6th Panzergrenadier Division (Bundeswehr)」「First Division "7 December"」「Pentomic」、usarmygermany.com「Combat Divisions in the European Theater」、baor-locations.org「History of BAOR」。</li>
    <li>R. P. Turco et al. (TTAPS), "Nuclear Winter: Global Consequences of Multiple Nuclear Explosions," <i>Science</i> 222, 1983.</li>
    <li>"East Germany Planned To Seize West Berlin," <i>The Seattle Times</i>, 1993（ツェントルム作戦の報道）.</li>
    <li>Wikipedia「Berlin Brigade」「Berlin Infantry Brigade」「Southern Group of Forces」「Emil Spannocchi」「Allied Forces North Norway」、GlobalSecurity.org "Southern Group of Forces".</li>
    <li>NATO, Final Communiqué of the Ministerial Meeting, Athens, May 1962（核使用の協議に関するアテネ・ガイドライン）.</li>
    <li>CIA, NIE 11-15-82/D, "Soviet Naval Strategy and Programs through the 1990s," 1983（ソ連海軍の要塞防衛の優先）. <a href="https://www.cia.gov/readingroom/document/0000268225" target="_blank" rel="noopener">CIA Reading Room</a></li>
    <li>RAND, <i>East European Military Reliability</i>, R-3480. <a href="https://www.rand.org/pubs/reports/R3480.html" target="_blank" rel="noopener">rand.org</a></li>
    <li>"The Reliability of the Warsaw Treaty Organization: Can the Soviet Union Depend on Its Northern Tier Allies?," DTIC ADA156829. <a href="https://apps.dtic.mil/sti/html/tr/ADA156829/index.html" target="_blank" rel="noopener">DTIC</a></li>
    <li>Wikipedia「Marine Corps Prepositioning Program–Norway」（米海兵旅団の装備の事前集積）。</li>
    <li>フランスの核ドクトリン：Wikipedia「Force de frappe」「Pluton (missile)」。</li>
    <li>地図：Natural Earth（world-atlas 2.0.2）。内独国境と河川は概略線。</li>''')
css_add=open(SRC+'css_add.css',encoding='utf8').read()
s=s.replace('@media (prefers-reduced-motion:reduce)',css_add+'@media (prefers-reduced-motion:reduce)')
s=s.replace('aspect-ratio:1/1.02','aspect-ratio:800/880')
geoPart=open(SRC+'part_geo.js',encoding='utf8').read()
geoPart=re.sub(r"const CORPS=.*?\n","",geoPart); geoPart=re.sub(r"const CITIES=.*?\n","",geoPart)
model=open(SRC+'model.js',encoding='utf8').read().replace('/* ===== shared model (also embedded in page) ===== */','/* ---------- model: ORBAT & simulation ---------- */')
script='const EU = '+geo+';\nconst d3g=d3;\n'+open(SRC+'part_periods.js',encoding='utf8').read()+'\n'+geoPart+'\n'+model+'\n'+open(SRC+'part_main.js',encoding='utf8').read()+'\n'+open(SRC+'part_eras.js',encoding='utf8').read()+'\n'+open(SRC+'part_echelon.js',encoding='utf8').read()+'\n'+open(SRC+'part_mc.js',encoding='utf8').read()
i=s.index('<script>\n'); j=s.index('</script>',i)
s=s[:i+9]+script+'\n'+s[j:]
s=s.replace(".attr('fill',",".style('fill',").replace(".attr('stroke',",".style('stroke',").replace(".attr('font-family',",".style('font-family',")
s=s.replace('<td style="white-space:normal">${r[3]}</td>','<td style="white-space:normal;text-align:left">${r[3]}</td>').replace("<th>主な目標・根拠</th>","<th style=\"text-align:left\">主な目標・根拠</th>")
os.makedirs(os.path.join(ROOT,'dist'),exist_ok=True)
open(os.path.join(ROOT,'dist','artifact.html'),'w',encoding='utf8').write(s)
i=s.index('</style>')+len('</style>')
page=('<!doctype html>\n<html lang="ja">\n<head>\n<meta charset="utf-8">\n'
      '<meta name="viewport" content="width=device-width,initial-scale=1">\n'
      '<meta name="description" content="冷戦期の中欧正面における、ソ連・ワルシャワ条約機構とNATOの戦略・作戦・計画を時期ごとに対照し、師団単位の戦闘序列で戦争を動かすシミュレーター。">\n'
      +s[:i]+'\n</head>\n<body>\n'+s[i:]+'\n</body>\n</html>\n')
open(os.path.join(ROOT,'index.html'),'w',encoding='utf8').write(page)
print(len(s))
print(len(s))
print(len(s))
