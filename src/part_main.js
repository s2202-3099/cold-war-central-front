
const CORPS=[['LANDZEALAND',11.75,55.42],['LANDJUT',9.75,54.45],['蘭I',10.25,52.98],['西独I',10.45,52.62],['英I',10.25,52.2],['白I',9.85,51.6],['西独III',9.85,51.0],['米V',9.62,50.62],['米VII',11.05,50.05],['西独II',12.45,49.12]];
const CITIES=[['ベルリン',13.40,52.52],['ボン',7.10,50.73],['パリ',2.35,48.86],['プラハ',14.42,50.08],['ウィーン',16.37,48.21],['ミュンヘン',11.58,48.14],['ハンブルク',10.0,53.55]];
prepAxes();

/* ---------- map ---------- */
const svg=d3.select('#map'); const W=800,MH=880; svg.attr('viewBox',`0 0 ${W} ${MH}`);
const bbox={type:'MultiPoint',coordinates:[[2.0,45.4],[17.2,56.4],[2.0,56.4],[17.2,45.4]]};
const proj=d3.geoConicConformal().parallels([47,55]).rotate([-10,0]).fitExtent([[0,0],[W,MH]],bbox).clipExtent([[0,0],[W,MH]]);
const gp=d3.geoPath(proj);
const countries=topojson.feature(EU,EU.objects.c).features;
const PACT=new Set(['Poland','Czechia','Slovakia','Hungary']);
const gBase=svg.append('g');
gBase.selectAll('path.c').data(countries).join('path').attr('d',gp).style('fill',d=>PACT.has(d.properties.name)?'var(--land-pact)':'var(--land)');
gBase.append('path').datum(GDR).attr('d',gp).style('fill','var(--land-gdr)');
gBase.append('path').datum(topojson.mesh(EU,EU.objects.c,(a,b)=>a!==b&&!((a.properties.name==='Czechia'&&b.properties.name==='Slovakia')||(b.properties.name==='Czechia'&&a.properties.name==='Slovakia'))))
  .attr('d',gp).style('fill','none').style('stroke','var(--muted)').attr('stroke-width',0.7).attr('stroke-opacity',.7);
Object.entries(RIVERS).forEach(([n,c])=>gBase.append('path').datum({type:'LineString',coordinates:c}).attr('d',gp).style('fill','none').style('stroke','var(--water)').attr('stroke-width',n==='ライン'||n==='エルベ'?3:2).attr('stroke-linejoin','round'));
gBase.append('path').datum({type:'LineString',coordinates:IGB}).attr('d',gp).style('fill','none').style('stroke','var(--ink)').attr('stroke-width',2.4).attr('stroke-dasharray','7 3');
const lab=(t,lon,lat,o={})=>{const [x,y]=proj([lon,lat]);gBase.append('text').attr('x',x+(o.dx||0)).attr('y',y+(o.dy||0)).text(t).attr('font-size',o.size||13).style('fill',o.fill||'var(--muted)').style('font-family',o.font||'var(--f-body)').attr('text-anchor',o.anchor||'start').attr('font-weight',o.w||400).attr('letter-spacing',o.ls||0);};
lab('西ドイツ',7.9,50.3,{size:17,w:700,ls:3});lab('東ドイツ',12.6,51.9,{size:17,fill:'var(--wp)',w:700,ls:3});
lab('ポーランド',15.6,53.0,{size:15,fill:'var(--wp)',w:700});lab('チェコスロヴァキア',14.0,49.45,{size:15,fill:'var(--wp)',w:700});
lab('フランス',3.6,47.9,{size:15,w:700});lab('オランダ',5.0,52.75,{size:13,w:700});lab('ベルギー',3.9,50.85,{size:13,w:700});lab('デンマーク',8.6,55.95,{size:13,w:700});lab('オーストリア',13.6,47.35,{size:13,w:700});lab('スイス',7.3,46.65,{size:13,w:700});
lab('北海',5.0,54.6,{size:14,fill:'var(--ink)',ls:4});lab('バルト海',14.2,55.3,{size:13,fill:'var(--ink)',ls:3});
CITIES.forEach(([n,lo,la])=>{const [x,y]=proj([lo,la]);gBase.append('circle').attr('cx',x).attr('cy',y).attr('r',3).style('fill','var(--ink)');lab(n,lo,la,{dx:5,dy:-4,size:12,fill:'var(--ink)'});});
CORPS.forEach(([n,lo,la])=>{const [x,y]=proj([lo,la]);gBase.append('circle').attr('cx',x).attr('cy',y).attr('r',4.5).style('fill','var(--nato)');gBase.append('text').attr('x',x-7).attr('y',y+4).attr('text-anchor','end').attr('font-size',11).style('font-family','var(--f-mono)').style('fill','var(--nato)').attr('font-weight',500).attr('paint-order','stroke').style('stroke','var(--land)').attr('stroke-width',3).text(n);});
const gAx=svg.append('g');
AXES.forEach(a=>{
  const coords=a.path.map(p=>[p[0],p[1]]);
  gAx.append('path').datum({type:'LineString',coordinates:coords}).attr('d',gp).style('fill','none').style('stroke','var(--wp)').attr('stroke-width',1.2).attr('stroke-dasharray',a.amph?'1 5':'2 4').attr('stroke-opacity',.75);
  a.path.slice(1).forEach(p=>{const [x,y]=proj([p[0],p[1]]);gAx.append('circle').attr('cx',x).attr('cy',y).attr('r',2).style('fill','var(--wp)').attr('fill-opacity',.6);});
  a.prog=gAx.append('path').style('fill','none').style('stroke','var(--wp)').attr('stroke-width',6).attr('stroke-linecap','round').attr('stroke-opacity',.85);
  a.head=gAx.append('g');a.head.append('circle').attr('r',7).style('fill','var(--wp)').style('stroke','var(--paper)').attr('stroke-width',2);
  a.headT=a.head.append('text').attr('x',10).attr('y',4).attr('font-size',11.5).style('font-family','var(--f-mono)').style('fill','var(--wp)').attr('font-weight',500).attr('paint-order','stroke').style('stroke','var(--paper)').attr('stroke-width',3);
  a.omgMark=a.head.append('text').attr('x',-9).attr('y',-10).attr('font-size',10).style('font-family','var(--f-mono)').style('fill','var(--wp)').attr('font-weight',700).attr('paint-order','stroke').style('stroke','var(--paper)').attr('stroke-width',3);
});
const nukeLayer=svg.append('g');
const auLayer=svg.append('g');const AU_PATH=[[17.11,48.15],[16.37,48.21],[15.62,48.20],[14.29,48.31],[13.46,48.57]];
const berlinG=svg.append('g');{const [bx,by]=proj([13.38,52.50]);berlinG.attr('transform',`translate(${bx},${by})`);berlinG.append('circle').attr('r',9).attr('class','bring').style('fill','none').attr('stroke-width',2.5);
  berlinG.append('text').attr('class','blab').attr('x',12).attr('y',16).attr('font-size',11).style('font-family','var(--f-mono)').attr('paint-order','stroke').style('stroke','var(--paper)').attr('stroke-width',3);}
function posAt(a,km){km=Math.max(0,Math.min(a.len,km));let i=1;while(i<a.cum.length-1&&a.cum[i]<km)i++;
  const t=(km-a.cum[i-1])/Math.max(1e-6,a.cum[i]-a.cum[i-1]);return d3.geoInterpolate(a.path[i-1],a.path[i])(Math.max(0,Math.min(1,t)));}
function placeAt(a,km){let n=a.path[0][2];for(let i=0;i<a.path.length;i++){if(a.cum[i]<=km+1)n=a.path[i][2];}return n;}

/* ---------- presets ---------- */
const BASE={airQ:2.0,airOp:0.7,sea:0.6,nukeMode:'stop',wpMob:10,intel:1,decide:2,consult:2,frgVeto:false,frNuke:true,berlin:'assault',austria:'neutral',norway:false,chem:false,preShift:true,mask:0.3,crossAG:false,bagnall:true,nat:true,natSpread:1,natoFr:10,wpRelK:1,wpDecay:15,sovNavy:'bastion',fwd:true,noReinf:true,chemN:15,chemW:5,chemDelay:2,phase2:'paris',natoQ:1.2,wp2Day:8,wp2:1,deep:0.25,threshold:120,ignore:false,scaleNato:1,wpQ:1,france:true,baltic:0.5,landDay:2,main:'uk1',era:1985};
const PRESETS={
 p1961:{label:'1961 ブーリャ演習型',p:{nuc:'early',wpDoc:'nuc',natoDoc:'AD',natoQ:0.9,airQ:1.3,sea:0.7,wpMob:3,intel:0,decide:0,wp2Day:7,wp2:0.8,deep:0,scaleNato:0.85,sovNavy:'sloc',fwd:false,baltic:0.8,era:1961,main:'auto'},nuke:'n1961',
  desc:'1968年以前なのでソ連中央軍集団はまだない。ベルリン危機下の連合演習。NATOの核攻撃に反撃して核を同時使用し、西欧へ突進する。当時のNATOは大量報復の時代で、FM100-5のドクトリン区別はまだない（モデルでは近い挙動の側を使う）。',
  target:{axis:'jut',km:'end',day:5,text:'ポーランド沿岸方面軍：5日でデンマーク制圧'}},
 p1964:{label:'1964 チェコスロヴァキア計画型',p:{nuc:'early',wpDoc:'nuc',natoDoc:'AD',natoQ:0.95,airQ:1.3,sea:0.7,wpMob:3,intel:0,decide:0,wp2Day:7,wp2:0.8,deep:0,scaleNato:0.9,sovNavy:'sloc',fwd:false,baltic:0.7,era:1964,main:'ge2'},nuke:'n1964',
  desc:'主攻は南ドイツ（チェコスロヴァキア方面軍）。1968年以前なのでソ連中央軍集団はない。西側の大規模核攻撃で開戦し、核131発を使って南ドイツから仏東部へ。計画上は7〜8日目にラングル〜ブザンソンの線。',
  target:{axis:'ge2',place:'ブザンソン',day:8,text:'1964年計画：7〜8日目にブザンソンの線'}},
 p1979:{label:'1979「ライン川まで7日間」型',p:{nuc:'early',wpDoc:'nuc',natoDoc:'AD',natoQ:1.1,airQ:1.6,wpMob:4,intel:0,decide:0,fwd:false,baltic:0.6,era:1979,main:'auto'},nuke:'n1979',
  desc:'NATOの核先制攻撃を受けて反撃し、7日でライン川に達する想定。NATOはアクティブ・ディフェンスの時代。',
  target:{axis:'uk1',place:'ライン',day:7,text:'演習名どおり7日でライン川'}},
 p1976:{label:'1976 通常攻勢 対 アクティブ・ディフェンス',p:{nuc:'flex',wpDoc:'conv',natoDoc:'AD',natoQ:1.15,airQ:1.6,wpMob:7,intel:1,decide:1,fwd:false,era:1976},nuke:'nflex',
  desc:'柔軟反応のもとで通常戦段階が続く場合。NATOは第一会戦に火力を集中するが、後続梯団への手当てがない。'},
 p1985:{label:'1985 オガルコフ期 対 エアランド・バトル',p:{nuc:'flex',wpDoc:'conv',natoDoc:'ALB',natoQ:1.2,wpMob:10,intel:1,decide:2},nuke:'nflex',
  desc:'WPが10日前に動員を始め、NATOは3日遅れて動員する（準備7日）。WPは第3打撃軍を主攻とする通常攻勢をかける。NATOは縦深攻撃で第2梯団を遅らせ、減殺する。'},
 p1985s:{label:'1985 短期警報の奇襲',p:{nuc:'flex',wpDoc:'conv',natoDoc:'ALB',natoQ:1.2,wpMob:2,intel:1,decide:0},nuke:'nflex',
  desc:'WPは2日前に動員を始めて在独・東欧の常駐部隊だけで攻める「立ち上がり攻撃」。NATOは1日しか準備できず、本国から来る蘭・白・英の師団が間に合わない。西側の悲観論が最も恐れた型。'},
 p1985f:{label:'1985 全面動員のうえでの攻勢',p:{nuc:'flex',wpDoc:'conv',natoDoc:'ALB',natoQ:1.2,wpMob:14,intel:2,decide:2},nuke:'nflex',
  desc:'WPが2週間かけて戦略第2梯団まで前方に集めてから攻める。NATOも10日の準備を得る。兵力差は最大になるが、NATOの増援も間に合う。'},
};
let P={};

/* ---------- UI ---------- */
const $=id=>document.getElementById(id);
(function(){const m=$('main');[['auto','自動（最も進んだ軸へ）'],...AXES.filter(a=>!a.amph).map(a=>[a.id,a.name])].forEach(([v,t])=>{const o=document.createElement('option');o.value=v;o.textContent=t;m.appendChild(o);});})();
const sel=$('preset');Object.entries(PRESETS).forEach(([k,v])=>{const o=document.createElement('option');o.value=k;o.textContent=v.label;sel.appendChild(o);});
const FIELDS=['mask','natSpread','natoFr','wpRelK','wpDecay','wpMob','intel','decide','consult','chemN','chemW','chemDelay','natoQ','airQ','airOp','sea','wp2Day','deep','threshold','baltic'];
const fmt={wpMob:v=>v+'日前',intel:v=>v+'日',mask:v=>(+v).toFixed(1),natSpread:v=>'×'+(+v).toFixed(2),natoFr:v=>'−'+v+'%',wpRelK:v=>'×'+(+v).toFixed(2),wpDecay:v=>'−'+v+'%',chemN:v=>'−'+v+'%',chemW:v=>'−'+v+'%',chemDelay:v=>v+'日',decide:v=>v+'日',consult:v=>v+'日',natoQ:v=>'×'+(+v).toFixed(2),airQ:v=>'×'+(+v).toFixed(1),airOp:v=>Math.round(v*100)+'%',sea:v=>Math.round(v*100)+'%',wp2Day:v=>'M+'+v,deep:v=>Math.round(v*100)+'%',threshold:v=>v+'km',baltic:v=>Math.round(v*100)+'%'};
function applyPreset(k){P={...BASE,...PRESETS[k].p};FIELDS.forEach(f=>{$(f).value=P[f];});$('main').value=P.main;$('wpDoc-'+P.wpDoc).checked=true;$('natoDoc-'+P.natoDoc).checked=true;$('france').checked=P.france;$('nukeMode').value=P.nukeMode;['frgVeto','frNuke','norway','chem','nat','fwd','noReinf','preShift','crossAG','bagnall'].forEach(k=>$(k).checked=!!P[k]);['berlin','austria','phase2','sovNavy'].forEach(k=>$(k).value=P[k]);$('pdesc').textContent=PRESETS[k].desc;}
function readForm(){FIELDS.forEach(f=>{P[f]=+$(f).value;$('v-'+f).textContent=fmt[f]($(f).value);});P.natoLag=P.intel+P.decide;$('v-prep').textContent=Math.max(0,P.wpMob-P.natoLag)+'日';
  P.main=$('main').value;P.wpDoc=document.querySelector('input[name=wpDoc]:checked').value;P.natoDoc=document.querySelector('input[name=natoDoc]:checked').value;
  P.nuc=P.wpDoc==='nuc'?'early':'flex';P.france=$('france').checked;P.nukeMode=$('nukeMode').value;['frgVeto','frNuke','norway','chem','nat','fwd','noReinf','preShift','crossAG','bagnall'].forEach(k=>P[k]=$(k).checked);['berlin','austria','phase2','sovNavy'].forEach(k=>P[k]=$(k).value);P.nk=readNk();
  $('threshold').disabled=P.nuc==='early';$('nukeMode').disabled=P.nuc==='early';$('consult').disabled=P.nuc==='early'||!['fu','esc'].includes(P.nukeMode);$('frgVeto').disabled=$('consult').disabled;$('deep').disabled=P.natoDoc!=='ALB';['chemN','chemW','chemDelay'].forEach(k=>$(k).disabled=!P.chem);['natSpread','natoFr','wpRelK','wpDecay'].forEach(k=>$(k).disabled=!P.nat);$('noReinf').disabled=!P.norway;$('fwd').disabled=P.era<1981;$('bagnall').disabled=P.era<1984;['mask','crossAG'].forEach(k=>$(k).disabled=!P.preShift);}
let R=null, day=0, timer=null, openAxis=null;
function readNk(){const g=(id,d)=>{const v=+(document.getElementById(id)||{}).value;return isFinite(v)&&v>0?v:d;};return {n1:g('n1',40),k1:g('k1',10),n2:g('n2',400),k2:g('k2',200),n3:g('n3',300),k3:g('k3',150)};}
function recompute(keepDay){const atEnd=R&&day>=R.days;readForm();R=run(P);if(!keepDay)day=0;else if(atEnd)day=R.days;day=Math.min(day,R.days);draw();drawChart();drawAir();chartCursor();if(typeof mcSchedule==='function')mcSchedule();}
function H(x){return x.hist[Math.min(day,x.hist.length-1)];}
function draw(){
  $('dlabel').textContent=day;$('day').value=day;$('dnow').textContent='D+'+day;$('dstop').textContent=R.stop?`D+${R.stop}で核の敷居・停止`:R.nucT?`D+${R.nucT}に核を初使用`:'D+60まで計算';$('day').style.setProperty('--stop',(R.days/60*100)+'%');
  R.ax.forEach(x=>{const h=H(x);const a=x.a;
    const n=Math.max(2,Math.ceil(h.pen/8));const pts=d3.range(n+1).map(i=>posAt(a,h.pen*i/n));
    a.prog.attr('d',(a.amph&&h.pen<=0)?null:gp({type:'LineString',coordinates:pts})).attr('stroke-dasharray',a.amph?'2 7':null);
    const [hx,hy]=proj(posAt(a,h.pen));a.head.attr('transform',`translate(${hx},${hy})`);
    a.headT.text(a.amph?(h.pen>=a.seaKm&&x.landed!==false&&h.wp>0.02?`上陸 +${Math.round(h.pen-a.seaKm)}km`:(day>=P.landDay&&x.failed?'上陸失敗':'')):(h.pen>0?`${Math.round(h.pen)}km`:''));
    a.omgMark.text(h.omg?'OMG':'');});
  {const B=R.berlin;const st=!B.on?'':B.assault?(B.fell&&day>=B.fell?`西ベルリン陥落 D+${B.fell}`:'西ベルリン：守備隊が抵抗中'):'西ベルリン：包囲';
    const col=!B.on?'var(--muted)':B.assault&&B.fell&&day>=B.fell?'var(--wp)':'var(--nato)';berlinG.select('.bring').style('stroke',col);berlinG.select('.blab').text(st).style('fill',col);}
  auLayer.selectAll('*').remove();if(R.austria.on&&day>=2){const t=R.austria.thru;const frac=t?1:Math.min(1,(day-1)/12);const n=AU_PATH.length;const pts=[];
    const tot=d3.sum(d3.range(1,n),i=>d3.geoDistance(AU_PATH[i-1],AU_PATH[i]));let acc=0,lim=tot*(t&&day>=t?1:frac);pts.push(AU_PATH[0]);
    for(let i=1;i<n;i++){const sg=d3.geoDistance(AU_PATH[i-1],AU_PATH[i]);if(acc+sg<=lim){pts.push(AU_PATH[i]);acc+=sg;}else{pts.push(d3.geoInterpolate(AU_PATH[i-1],AU_PATH[i])((lim-acc)/sg));break;}}
    auLayer.append('path').datum({type:'LineString',coordinates:AU_PATH}).attr('d',gp).style('fill','none').style('stroke','var(--wp)').attr('stroke-dasharray','2 4').attr('stroke-opacity',.7);
    auLayer.append('path').datum({type:'LineString',coordinates:pts}).attr('d',gp).style('fill','none').style('stroke','var(--wp)').attr('stroke-width',5).attr('stroke-opacity',.8).attr('stroke-linecap','round');}
  nukeLayer.selectAll('*').remove();
  R.nukes.filter(n=>n[0]<=day).forEach(([nd,id,k])=>{const x=R.ax.find(z=>z.a.id===id);const h=x.hist[Math.min(nd,x.hist.length-1)];
    let pt=k==='f'?posAt(x.a,h.pen):k==='w'?posAt(x.a,Math.min(x.a.len,h.pen+70)):[x.a.path[0][0]+0.9,x.a.path[0][1]];
    const [cx,cy]=proj(pt);const r=k==='f'?14:20;
    nukeLayer.append('circle').attr('cx',cx).attr('cy',cy).attr('r',r).style('fill','var(--nuke)').attr('fill-opacity',k==='f'?.35:.18).style('stroke','var(--nuke)').attr('stroke-width',k==='f'?2:1).attr('stroke-dasharray',k==='f'?null:'3 3');});
  const rows=R.ax.map(x=>{const h=H(x);const a=x.a;const pen=a.amph?Math.max(0,h.pen-a.seaKm):h.pen;
    return `<tr data-ax="${a.id}" tabindex="0" class="${openAxis===a.id?'sel':''}"><td><b>${a.name}</b><br><span class="sub">${a.wpCmd} ／ ${a.natoCmd}</span></td><td>${Math.round(pen)}<span class="bar" style="width:${Math.min(60,pen/6)}px"></span></td><td>${a.amph&&h.pen<a.seaKm?'—':placeAt(a,h.pen)}</td><td>${h.wp.toFixed(1)}</td><td>${h.nato.toFixed(1)}</td><td>${h.R?h.R.toFixed(2):'—'}</td></tr>`;}).join('');
  $('axt').innerHTML=`<thead><tr><th>軸（WP ／ NATO）</th><th>前進km</th><th>到達点</th><th>WP</th><th>NATO</th><th>戦力比</th></tr></thead><tbody>${rows}</tbody>`;
  $('log').innerHTML=R.log.filter(l=>l[0]<=day).map(l=>`<li><span class="d">D+${l[0]}</span><span class="k-${l[1]}">${l[2]}</span></li>`).join('');
  verdict(); chartCursor();
}
$('axt').addEventListener('click',e=>{const tr=e.target.closest('tr[data-ax]');if(!tr)return;openOrbat(tr.dataset.ax);});
$('axt').addEventListener('keydown',e=>{if(e.key!=='Enter')return;const tr=e.target.closest('tr[data-ax]');if(tr)openOrbat(tr.dataset.ax);});
function openOrbat(id){openAxis=id;document.querySelectorAll('#orbatList details').forEach(d=>d.open=d.dataset.ax===id);const d=document.querySelector(`#orbatList details[data-ax="${id}"]`);if(d)d.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});draw();}
function verdict(){
  const v=$('verdict');const k=sel.value;const pre=PRESETS[k];const parts=[];
  const land=R.ax.filter(x=>!x.a.amph);const mx=land.reduce((m,x)=>H(x).pen>m.p?{p:H(x).pen,n:x.a.short}:m,{p:0,n:''});
  const zea=R.ax.find(x=>x.a.amph);const zh=H(zea);
  const zTxt=zea.failed&&day>=P.landDay?'シェラン島への上陸は失敗した。':(zh.pen>=zea.a.cum[2]?'シェラン島ではコペンハーゲンに達し、バルト海峡が開いた。':(zh.pen>=zea.a.seaKm?'シェラン島では上陸拠点を保っている。':''));
  if(R.stop&&day>=R.stop){v.className='verdict nuke';parts.push(`<b>D+${R.stop}で核の敷居に達した。</b>${mx.n}軸の突破が最も深い（${Math.round(mx.p)}km）。${zTxt}柔軟反応のもとでは、ここから先はNATOの核使用をめぐる政治判断になる。<a href="#nuke">核パネルで続きを見る</a>`);}
  else if(P.nuc==='early'){v.className='verdict nuke';parts.push(`<b>核を同時に使う想定。</b>${zTxt}核の効果と民間人被害は通常戦のモデルの外にあり、<a href="#nuke">核パネル</a>で推計する。地図に表示しているのは、計画が前提とした「核で開いた突破口を戦車が走る」部分だけである。`);}
  else if(R.nucT&&day>=R.nucT){v.className='verdict nuke';const fu=R.nukes.find(n=>n[2]==='f');const fax=fu?R.ax.find(z=>z.a.id===fu[1]).a.short:'';
    const thr=R.thrDay??R.nucT;const vt=P.frgVeto?'':`${fax}正面で`;parts.push(`<b>D+${thr}に核の敷居に達し、${R.nucT>thr?`${R.nucT-thr}日の同盟内協議を経てD+${R.nucT}に`:''}NATOが${vt}核を選択的に初使用した。</b>${P.frgVeto?'西ドイツが自国領内での使用を拒んだため、目標は東独領内の後方に限られた。':''}${P.nukeMode==='esc'?`D+${R.nucT+1}にWPが戦域核で大規模に反撃し、D+${R.nucT+2}にNATOが東欧へ反撃した。`:'WPは報復しないという仮定で、通常戦が続く。'}D+${day}時点の最大突破は${mx.n}軸の${Math.round(mx.p)}km。${zTxt}`);}
  else{v.className='verdict';const stopTxt=R.stop?`D+${R.stop}に核の敷居に達する。`:R.nucT?(R.thrDay!=null&&R.thrDay<R.nucT?`D+${R.thrDay}${day>=R.thrDay?'に核の敷居に達し、NATOは同盟国と協議している。':'に核の敷居に達する。'}核の初使用はD+${R.nucT}。`:`D+${R.nucT}に核の敷居に達し、NATOが核を初使用する。`):P.nukeMode==='ignore'?'核を使わない仮定で、60日間通常戦が続く。':'60日間、核の敷居に達しない。';parts.push(`<b>${R.nucT&&day<R.nucT?'通常戦の段階。':'通常戦が続く想定。'}</b>${stopTxt}D+${day}時点の最大突破は${mx.n||'—'}軸の${Math.round(mx.p)}km。${zTxt}`);}
  if(pre.target&&P.wpDoc==='nuc'){const t=pre.target;const x=R.ax.find(z=>z.a.id===t.axis);const km=t.km==='end'?x.a.len:(t.place==='ライン'?x.a.rhine:x.a.cum[x.a.path.findIndex(p=>p[2].includes(t.place))]);
    const dd=x.hist.findIndex(h=>h.pen>=km-1);parts.push(`計画の目標は「${t.text}」。モデルでは${dd>0?`D+${dd}に到達`:'60日以内に到達しない'}${dd>0&&dd<=t.day?'（計画どおり）':dd>0?'（計画より遅い）':''}。`);}
  if(R.berlin.on&&R.berlin.assault)parts.push(R.berlin.fell&&day>=R.berlin.fell?`西ベルリンはD+${R.berlin.fell}に陥落した。`:'西ベルリンの守備隊は抵抗を続けている。');
  if(R.norway.on){const N=R.norway;const kd=N.hist[Math.min(day,N.hist.length-1)]||0;parts.push(N.lost&&day>=N.lost?`北ノルウェーではD+${N.lost}にバルドゥフォスとトロムソが落ち、大西洋の船団がソ連海軍航空隊の圏内に入った。`:`北ノルウェーではWPが国境から約${Math.round(kd)}km進んだ${kd>=480?'（リュンゲン線で防御中）':''}。`);}
  if(R.austria.on)parts.push(R.austria.thru&&day>=R.austria.thru?`オーストリアを抜けた部隊がD+${R.austria.thru}にバイエルンへ入った。`:'オーストリアで遅滞戦闘が続いている。');
  const cv=R.civHist[Math.min(day,R.civHist.length-1)]||0;
  if(cv>0)parts.push(`<b>D+${day}までの推計民間人死者（短期）：約${cv>=1e8?(cv/1e8).toFixed(1)+'億':Math.round(cv/1e4).toLocaleString('ja-JP')+'万'}人</b>（核パネルの発数・威力の設定とカルト・ブランシュの比率による。戦略核は含まない）。`);
  const sv=R.sHist[Math.min(day,R.sHist.length-1)];parts.push(`航空優勢指数は${Math.round(sv*100)}（${sv>=0.6?'NATOが優勢':sv<=0.4?'WPが優勢':'拮抗'}）。`);
  v.innerHTML=parts.join(' ');
}
/* chart */
const CH={w:640,h:300,l:42,r:96,t:14,b:30};const csvg=d3.select('#chart');
function drawChart(){
  csvg.selectAll('*').remove();
  const xs=d3.scaleLinear([0,60],[CH.l,CH.w-CH.r]);const pens=R.ax.map(x=>x.hist.map(h=>x.a.amph?Math.max(0,h.pen-x.a.seaKm):h.pen));
  const mxp=Math.max(100,d3.max(pens,p=>d3.max(p)));
  const ys=d3.scaleLinear([0,Math.ceil(mxp/100)*100],[CH.h-CH.b,CH.t]);
  ys.ticks(5).forEach(t=>{csvg.append('line').attr('x1',CH.l).attr('x2',CH.w-CH.r).attr('y1',ys(t)).attr('y2',ys(t)).style('stroke','var(--line)');csvg.append('text').attr('x',CH.l-6).attr('y',ys(t)+4).attr('text-anchor','end').attr('font-size',11).style('fill','var(--muted)').style('font-family','var(--f-mono)').text(t);});
  [0,10,20,30,40,50,60].forEach(t=>csvg.append('text').attr('x',xs(t)).attr('y',CH.h-CH.b+18).attr('text-anchor','middle').attr('font-size',11).style('fill','var(--muted)').style('font-family','var(--f-mono)').text('D+'+t));
  if(P.nuc==='flex'&&!P.ignore){csvg.append('line').attr('x1',CH.l).attr('x2',CH.w-CH.r).attr('y1',ys(P.threshold)).attr('y2',ys(P.threshold)).style('stroke','var(--nuke)').attr('stroke-dasharray','5 4').attr('stroke-width',1.5);
    csvg.append('text').attr('x',CH.l+4).attr('y',ys(P.threshold)-5).attr('font-size',11).style('fill','var(--nuke)').text('核の敷居');}
  const order=pens.map((p,i)=>({i,last:p[p.length-1]})).sort((a,b)=>b.last-a.last);const top=new Set(order.slice(0,4).map(o=>o.i));
  const ends=[];
  pens.forEach((p,i)=>{const hot=top.has(i)&&p[p.length-1]>5;
    csvg.append('path').datum(p).attr('d',d3.line().x((v,j)=>xs(j)).y(v=>ys(v))).style('fill','none').style('stroke',hot?'var(--wp)':'var(--muted)').attr('stroke-width',hot?2.2:1).attr('stroke-opacity',hot?0.9:0.45);
    if(hot)ends.push({y:ys(p[p.length-1]),x:xs(p.length-1),n:R.ax[i].a.short,yy:ys(p[p.length-1])});});
  ends.sort((a,b)=>a.y-b.y);for(let i=1;i<ends.length;i++)if(ends[i].y-ends[i-1].y<13)ends[i].y=ends[i-1].y+13;
  ends.forEach(e=>{csvg.append('circle').attr('cx',e.x).attr('cy',e.yy).attr('r',3).style('fill','var(--wp)');csvg.append('text').attr('x',CH.w-CH.r+8).attr('y',e.y+4).attr('font-size',11.5).style('fill','var(--ink)').text(e.n);});
  csvg.append('text').attr('x',CH.w-CH.r+8).attr('y',CH.h-CH.b).attr('font-size',10.5).style('fill','var(--muted)').text('灰色＝その他');
  csvg.append('line').attr('id','cur').attr('y1',CH.t).attr('y2',CH.h-CH.b).style('stroke','var(--ink)').attr('stroke-width',1);
  CH.xs=xs;chartCursor();
}
function chartCursor(){if(!CH.xs)return;csvg.select('#cur').attr('x1',CH.xs(day)).attr('x2',CH.xs(day));asvg.select('#acur').attr('x1',CH.xs(day)).attr('x2',CH.xs(day));}
const asvg=d3.select('#airchart');
function drawAir(){asvg.selectAll('*').remove();const xs=d3.scaleLinear([0,60],[CH.l,CH.w-CH.r]);const ys=d3.scaleLinear([0,100],[110,8]);
  [0,50,100].forEach(t=>{asvg.append('line').attr('x1',CH.l).attr('x2',CH.w-CH.r).attr('y1',ys(t)).attr('y2',ys(t)).style('stroke','var(--line)').attr('stroke-dasharray',t===50?'4 3':null);asvg.append('text').attr('x',CH.l-6).attr('y',ys(t)+4).attr('text-anchor','end').attr('font-size',10.5).style('fill','var(--muted)').style('font-family','var(--f-mono)').text(t);});
  asvg.append('path').datum(R.sHist).attr('d',d3.line().x((v,i)=>xs(i)).y(v=>ys(v*100))).style('fill','none').style('stroke','var(--nato)').attr('stroke-width',2);
  asvg.append('path').datum(R.seaHist).attr('d',d3.line().x((v,i)=>xs(i)).y(v=>ys(v*100))).style('fill','none').style('stroke','var(--nato)').attr('stroke-width',2).attr('stroke-dasharray','5 4');
  {let ya=ys(R.sHist[R.sHist.length-1]*100)+4, yb=ys(R.seaHist[R.seaHist.length-1]*100)+4;if(Math.abs(ya-yb)<13){if(ya<=yb)yb=ya+13;else ya=yb+13;}
   asvg.append('text').attr('x',CH.w-CH.r+8).attr('y',ya).attr('font-size',11).style('fill','var(--ink)').text('航空優勢');
   asvg.append('text').attr('x',CH.w-CH.r+8).attr('y',yb).attr('font-size',11).style('fill','var(--ink)').text('制海（破線）');}
  const cmax=d3.max(R.civHist)||0;if(cmax>0){const yc=d3.scaleLinear([0,cmax],[110,8]);asvg.append('path').datum(R.civHist).attr('d',d3.line().curve(d3.curveStepAfter).x((v,i)=>xs(i)).y(v=>yc(v))).style('fill','none').style('stroke','var(--nuke)').attr('stroke-width',2);
    asvg.append('text').attr('x',CH.w-CH.r+8).attr('y',20).attr('font-size',11).style('fill','var(--nuke)').text('民間人死者');asvg.append('text').attr('x',CH.w-CH.r+8).attr('y',34).attr('font-size',10).style('fill','var(--nuke)').style('font-family','var(--f-mono)').text('最大'+Math.round(cmax/1e4).toLocaleString('ja-JP')+'万');}
  if(R.nucT){asvg.append('line').attr('x1',xs(R.nucT)).attr('x2',xs(R.nucT)).attr('y1',8).attr('y2',110).style('stroke','var(--nuke)').attr('stroke-width',1);}
  asvg.append('line').attr('id','acur').attr('y1',8).attr('y2',110).style('stroke','var(--ink)').attr('stroke-width',1);}
function stopPlay(){clearInterval(timer);timer=null;$('play').textContent='再生';}
$('play').onclick=()=>{if(timer){stopPlay();return;}if(day>=R.days)day=0;$('play').textContent='一時停止';timer=setInterval(()=>{day++;if(day>=R.days){day=R.days;draw();stopPlay();return;}draw();},matchMedia('(prefers-reduced-motion: reduce)').matches?900:450);};
$('reset').onclick=()=>{stopPlay();day=0;draw();};
$('day').oninput=e=>{stopPlay();day=Math.min(+e.target.value,R.days);draw();};
$('dprev').onclick=()=>{stopPlay();day=Math.max(0,day-1);draw();};
$('dnext').onclick=()=>{stopPlay();day=Math.min(R.days,day+1);draw();};
sel.onchange=()=>{stopPlay();applyNPreset(PRESETS[sel.value].nuke);applyPreset(sel.value);recompute(false);day=R.days;draw();};
$('ctrl').addEventListener('input',e=>{if(e.target.id==='preset')return;stopPlay();recompute(true);});
$('ctrl').addEventListener('submit',e=>e.preventDefault());

/* ---------- ORBAT list ---------- */
(function(){
  const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');
  const li=(u,side)=>`<tr><td>${esc(u[0])}</td><td>${esc(u[1])}</td><td class="num">${u[2].toFixed(2)}</td><td class="num">${side==='nato'?(u[3]===0?'常駐':'動員'+u[3]+'日'):(u[3]===0?'常駐':'M+'+u[3])}</td></tr>`;
  const tot=arr=>arr.reduce((s,u)=>s+u[2],0).toFixed(1);
  $('orbatList').innerHTML=AXES.map(a=>`<details data-ax="${a.id}" class="ob"><summary><span class="obn">${a.name}</span><span class="obt"><span style="color:var(--wp)">WP ${tot(a.wp)}</span> ／ <span style="color:var(--nato)">NATO ${tot(a.nato)}</span></span></summary>
   <div class="obg"><div><h5 style="color:var(--wp)">${a.wpCmd}</h5><table class="axt ob-t"><thead><tr><th>部隊</th><th>平時の駐屯地</th><th>師団換算</th><th>投入</th></tr></thead><tbody>${a.wp.map(u=>li(u,'wp')).join('')}</tbody></table></div>
   <div><h5 style="color:var(--nato)">${a.natoCmd}</h5><table class="axt ob-t"><thead><tr><th>部隊</th><th>平時の駐屯地</th><th>師団換算</th><th>到着</th></tr></thead><tbody>${a.nato.map(u=>li(u,'nato')).join('')}</tbody></table></div></div>
   <p class="obnote">地形係数 ${a.terrain}${a.amph?'。上陸はD+'+BASE.landDay+'。バルト海の制海・制空が35%未満なら失敗し、それ以上なら上陸できる兵力がその割合に応じて増える':''}。経路：${a.path.map(p=>p[2]).join(' → ')}</p></details>`).join('');
  $('echTable').innerHTML=`<thead><tr><th>陣営</th><th>部隊</th><th>師団換算</th><th>投入日</th><th>投入先</th></tr></thead><tbody>`+
   WP_ECH.map(e=>`<tr><td style="color:var(--wp)">WP</td><td>${e[0]}</td><td>${e[1]}</td><td>M+${e[2]}</td><td>${e[3]?e[3].map(id=>AXES.find(a=>a.id===id).short).join('・')+'のうち主攻正面か、最も進んだ軸':'主攻正面（自動なら最も進んだ軸）'}${e[4]?'。'+e[4]+'年以降のみ':''}</td></tr>`).join('')+
   WP_STRAT.map(w=>`<tr><td style="color:var(--wp)">WP</td><td>${w[0]}</td><td>${w[1]}</td><td>第1波の到着日${w[2]?'＋'+w[2]+'日':''}（スライダー）</td><td>主攻正面に7割、次に進んだ軸に3割</td></tr>`).join('')+
   `<tr><td style="color:var(--wp)">WP</td><td>西ベルリン攻略部隊：東独第1自動車化狙撃師団、ソ連第6独立親衛自狙旅団、国境警備隊、第20親衛軍の1個師団（計約3万人）</td><td>2.9</td><td>D日</td><td>西ベルリン（陥落の2日後に第20親衛軍の師団が前線へ戻る）</td></tr>`+
   `<tr><td style="color:var(--nato)">NATO</td><td>西ベルリン守備隊：米ベルリン旅団（3個歩兵大隊、M1A1 30両）、英ベルリン歩兵旅団（3個大隊、チーフテン14両）、仏ベルリン駐留軍、警察（計約1万2千人）</td><td>1.0</td><td>常駐</td><td>西ベルリン（市街戦で防御力2.5倍）</td></tr>`+
   `<tr><td style="color:var(--wp)">WP</td><td>オーストリア回廊：ソ連南部軍集団（第13親衛戦車・第2戦車・第253自狙・第93親衛自狙師団、約6.5万人）とハンガリー軍の一部</td><td>6</td><td>D+2〜</td><td>オーストリアを抜けて西独第2軍団の南翼へ（中立を破る場合のみ）</td></tr>`+
   `<tr><td style="color:var(--wp)">WP</td><td>北ノルウェー：ソ連第6軍（第45・第54自動車化狙撃師団）、北方艦隊の第61独立海軍歩兵旅団、レニングラード軍管区の後続（D+10）</td><td>2.5＋1.5</td><td>D日〜</td><td>フィンマルクからトロムス、バルドゥフォス・トロムソの飛行場へ（北ノルウェーを選んだ場合のみ）</td></tr>`+
   `<tr><td style="color:var(--nato)">NATO</td><td>北ノルウェー：ノルウェー北部旅団・郷土防衛隊、ACE機動部隊（D+3）、英第3コマンド旅団と蘭海兵隊（D+6、海路）、米海兵遠征旅団（D+8、装備はトロンデラーグに事前集積）</td><td>0.7＋1.25</td><td>D日〜</td><td>リュンゲン線で防御（山地・極地で防御力2.4倍、リュンゲン線ではさらに1.8倍）</td></tr>`+
   `<tr><td style="color:var(--nato)">中立</td><td>オーストリア連邦軍（領域防衛）</td><td>1.5</td><td>—</td><td>山地と要所での遅滞戦闘（防御力2.2倍）</td></tr>`+
   NATO_RES.map(r=>`<tr><td style="color:var(--nato)">NATO</td><td>${r[0]}</td><td>${r[1]}</td><td>動員${r[2]}日</td><td>${r[3]?r[3].map(id=>AXES.find(a=>a.id===id).short).join('・')+'のうち':'全陸上軸のうち'}最も押された正面${r[4]==='france'?'（フランス参戦時のみ）':r[4]==='sea'?'（大西洋の制海に左右される）':''}</td></tr>`).join('')+`</tbody>`;
})();

/* ---------- nuclear panel ---------- */
const NPRESETS={
 n1955:{label:'1955 カルト・ブランシュ型（検証用）',s:{stage:2,n1:67,k1:15,n2:268,k2:15,n3:50,k3:15,s4:'cf'},desc:'演習の数字（15kt×268発を西独上空で）を段階2に入れたもの。推計の起点になる数字を確かめるための設定。'},
 nflex:{label:'柔軟反応の段階的拡大（1980年代）',s:{stage:1,n1:40,k1:10,n2:400,k2:200,n3:300,k3:150,s4:'cf'},desc:'NATOが戦場で数十発を使い、WPが戦域核で応じ、NATOが東欧へ反撃し、最後に米ソが戦略核を撃ち合うまでを一段ずつ上げられる。初期値は段階1。'},
 n1961:{label:'1961 ブーリャ演習型',s:{stage:3,n1:21,k1:100,n2:300,k2:300,n3:65,k3:105,s4:'cf'},desc:'演習ではNATOがポーランド領内にミサイル65発（計約6.8Mt）を使う。段階3の数字はこれに合わせた。WP側の反撃の規模は文書から確定できないので仮置き。'},
 n1964:{label:'1964 計画型（全面核戦争）',s:{stage:4,n1:40,k1:20,n2:700,k2:300,n3:500,k3:200,s4:'full'},desc:'チェコスロヴァキア方面軍だけで131発。これを中欧の全方面軍に広げ、戦略核の全面応酬まで進めた最悪の場合。'},
 n1979:{label:'1979「ライン川まで7日間」型',s:{stage:3,n1:40,k1:20,n2:30,k2:250,n3:300,k3:150,s4:'cf'},desc:'WP側は約7.5Mt（250kt×30発で近似）。NATOの攻撃でポーランド民間人最大200万人という文書の想定と、段階3の推計を見比べられる。'}
};
const NF=['n1','k1','n2','k2','n3','k3','stage'];
const nfmt={n1:v=>v+'発',k1:v=>v+'kt',n2:v=>v+'発',k2:v=>v+'kt',n3:v=>v+'発',k3:v=>v+'kt',stage:v=>['通常戦のみ','選択的初使用','WPの戦域反撃','NATOの戦域反撃','戦略核の応酬'][v]};
const nsel=$('npreset');Object.entries(NPRESETS).forEach(([k,v])=>{const o=document.createElement('option');o.value=k;o.textContent=v.label;nsel.appendChild(o);});
function applyNPreset(k){const s=NPRESETS[k].s;NF.forEach(f=>$(f).value=s[f]);$('s4-'+s.s4).checked=true;nsel.value=k;$('ndesc').textContent=NPRESETS[k].desc;nupdate();}
// DPW (deaths per weapon, incl. 1980s density) comes from the model
const DENS=1;
function nupdate(){
  const v={};NF.forEach(f=>{v[f]=+$(f).value;$('v-'+f).textContent=nfmt[f](v[f]);});v.s4=document.querySelector('input[name=s4]:checked').value;
  ['n1','k1'].forEach(f=>$(f).disabled=v.stage<1);['n2','k2'].forEach(f=>$(f).disabled=v.stage<2);['n3','k3'].forEach(f=>$(f).disabled=v.stage<3);document.querySelectorAll('input[name=s4]').forEach(r=>r.disabled=v.stage<4);
  document.querySelectorAll('#stageNames span').forEach((s,i)=>s.classList.toggle('on',i<=v.stage));
  const REG=['西ドイツ','その他の西欧','東欧（東独・ポーランド・チェコ）','米国','ソ連'];
  const reg=REG.map(n=>({n,lo:0,mid:0,hi:0}));const rows=[];let mt=0;
  const add=(i,mid)=>{reg[i].mid+=mid;reg[i].lo+=mid*0.5;reg[i].hi+=mid*2;};
  if(v.stage>=1){const d=v.n1*DPW(v.k1)*DENS;add(0,d*0.6);add(2,d*0.4);mt+=v.n1*v.k1/1000;rows.push(['1 NATOの選択的初使用',`${v.n1}発×${v.k1}kt`,d,'戦場（西独60%・東独40%）']);}
  if(v.stage>=2){const d=v.n2*DPW(v.k2)*DENS;add(0,d*0.65);add(1,d*0.35);mt+=v.n2*v.k2/1000;rows.push(['2 WPの戦域核反撃',`${v.n2}発×${v.k2}kt`,d,'核貯蔵所・飛行場・司令部・港湾（西独65%・その他西欧35%）']);}
  if(v.stage>=3){const d=v.n3*DPW(v.k3)*DENS;add(2,d);mt+=v.n3*v.k3/1000;rows.push(['3 NATOの戦域核反撃',`${v.n3}発×${v.k3}kt`,d,'東独・ポーランド・チェコの部隊と輸送拠点']);}
  if(v.stage>=4){if(v.s4==='cf'){reg[3].lo+=1e6;reg[3].mid+=8e6;reg[3].hi+=20e6;reg[4].lo+=2.6e6;reg[4].mid+=7e6;reg[4].hi+=13e6;rows.push(['4 戦略核（対兵力のみ）','OTA ケース3','—','米国 100万〜2,000万人、ソ連 人口の1%未満〜5%（OTA 1979）']);}
    else{reg[3].lo+=70e6;reg[3].mid+=110e6;reg[3].hi+=160e6;reg[4].lo+=52e6;reg[4].mid+=78e6;reg[4].hi+=105e6;rows.push(['4 戦略核（軍事・工業・都市）','OTA ケース4','—','米国 人口の35〜77%（7,000万〜1億6,000万人）、ソ連 人口の20〜40%（OTA 1979）']);}}
  const total={lo:d3.sum(reg,r=>r.lo),mid:d3.sum(reg,r=>r.mid),hi:d3.sum(reg,r=>r.hi)};
  const M=n=>n>=1e8?(n/1e8).toFixed(2).replace(/\.?0+$/,'')+'億':n>=1e4?Math.round(n/1e4).toLocaleString('ja-JP')+'万':Math.round(n).toLocaleString('ja-JP');
  $('nsum').innerHTML=v.stage===0?`<b>核は使われていない。</b>通常戦のシミュレーターの範囲にとどまる。段階を上げると推計が出る。`:
   `<div class="big"><span class="mono">推計死者（短期）</span><b>${M(total.mid)}人</b><span>幅 ${M(total.lo)}〜${M(total.hi)}人</span></div><div class="big"><span class="mono">戦域核の総威力</span><b>${mt.toFixed(1)} Mt</b><span>段階1〜3の合計${v.stage>=4?'。戦略核は別':''}</span></div>`+
   `<p class="ni">${v.stage>=4?'戦略核の段階はOTAの推計幅で、モデルの計算ではない。':'カルト・ブランシュの比率による粗い推計で、目標の選び方と風向きで大きく変わる。'}${mt>=50||v.stage>=4?'TTAPS（1983）は、都市の火災が大量の煙を出せば地表の寒冷化（核の冬）が起こりうると論じた。その影響は数字に入っていない。':''}</p>`;
  $('ntable').innerHTML=`<thead><tr><th>段階</th><th>規模</th><th>推計死者（中央値）</th><th>主な目標・根拠</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td><td class="num">${typeof r[2]==='number'?M(r[2])+'人':r[2]}</td><td style="white-space:normal">${r[3]}</td></tr>`).join('')||'<tr><td colspan="4">核は使われていない</td></tr>'}</tbody>`;
  // chart
  const ns=d3.select('#nchart');ns.selectAll('*').remove();const L=200,Rr=620,T=16,rowH=44;
  const xmax=Math.max(1e6,d3.max(reg,r=>r.hi));const xs=d3.scaleLinear([0,xmax],[L,Rr]).nice();
  xs.ticks(4).forEach(t=>{ns.append('line').attr('x1',xs(t)).attr('x2',xs(t)).attr('y1',T-4).attr('y2',T+rowH*5).style('stroke','var(--line)');ns.append('text').attr('x',xs(t)).attr('y',T+rowH*5+16).attr('text-anchor','middle').attr('font-size',11).style('fill','var(--muted)').style('font-family','var(--f-mono)').text(t===0?'0':M(t));});
  reg.forEach((r,i)=>{const y=T+i*rowH+rowH/2;ns.append('text').attr('x',L-10).attr('y',y+4).attr('text-anchor','end').attr('font-size',12).style('fill','var(--ink)').text(r.n);
    if(r.hi>0){ns.append('rect').attr('x',xs(r.lo)).attr('y',y-9).attr('width',Math.max(2,xs(r.hi)-xs(r.lo))).attr('height',18).style('fill','var(--nuke)').attr('fill-opacity',.28);
      ns.append('line').attr('x1',xs(r.mid)).attr('x2',xs(r.mid)).attr('y1',y-12).attr('y2',y+12).style('stroke','var(--nuke)').attr('stroke-width',3);
      ns.append('text').attr('x',Math.min(Rr-2,xs(r.hi)+6)).attr('y',y+4).attr('font-size',11).style('fill','var(--ink)').style('font-family','var(--f-mono)').attr('text-anchor',xs(r.hi)+60>Rr?'end':'start').attr('dy',xs(r.hi)+60>Rr?-14:0).text(M(r.mid));}
    else ns.append('text').attr('x',L+4).attr('y',y+4).attr('font-size',11).style('fill','var(--muted)').text('—');});
}
$('nctrl').addEventListener('input',e=>{if(e.target.id==='npreset')return;nupdate();if(R)recompute(true);});
nsel.onchange=()=>{applyNPreset(nsel.value);if(R)recompute(true);};
$('nctrl').addEventListener('submit',e=>e.preventDefault());

applyNPreset('nflex');sel.value='p1985';applyPreset('p1985');recompute(false);day=R.days;draw();
