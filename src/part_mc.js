/* ---------- uncertainty: Monte Carlo over the user's settings ---------- */
var MC={tok:0,timer:null,A:null,B:null,n:0};
const SENS_KEYS=[['natoQ','NATOの質的係数'],['wpQ','WPの質'],['airQ','NATO機の質'],['airOp','WPの初期航空作戦'],['sea','大西洋の制海'],['baltic','バルト海の制海'],
  ['deep','縦深攻撃の効果'],['wpMob','WPの動員開始'],['intel','動員の察知'],['decide','同盟の決定'],['wp2Day','戦略第2梯団の到着'],['chemN','化学兵器の効果'],['natSpread','NATO各国の質の差'],['natoFr','多国籍の摩擦'],['wpRelK','非ソ連軍の信頼性の不足'],['wpDecay','非ソ連軍の抗戦意欲の低下'],['tJit','ソ連潜水艦の脅威'],['bDef','西ベルリンの市街戦防御'],['aDef','オーストリアの山地防御']];
function mcSchedule(){if(!MC||!$('mcauto').checked)return;clearTimeout(MC.timer);MC.timer=setTimeout(mcStart,450);}
function mcStart(){
  const tok=++MC.tok;const n=+$('mcn').value;const t0=performance.now();
  const wantA=P.nuc==='flex'&&P.nukeMode!=='ignore';
  const base={...P,nk:P.nk};const sets=[];if(wantA)sets.push(['A',base]);sets.push(['B',{...base,nukeMode:'ignore'}]);
  const res={A:wantA?[]:null,B:[]};let si=0,i=0;const rng=mulberry(20251105);
  $('mcstat').textContent='計算中…';$('mcbox').classList.add('busy');
  const step=()=>{if(tok!==MC.tok)return;const end=performance.now()+24;
    while(si<sets.length&&performance.now()<end){const [k,p]=sets[si];const q=jitter(p,rng);q.seed=1+Math.floor(rng()*1e9);const z=run(q);
      const rh=Object.entries(z.reached).filter(([id])=>id!=='zea').map(([,v])=>v);
      res[k].push({q,thr:z.stop||z.thrDay||null,use:z.nucT,berlin:z.berlin.fell,aust:z.austria.thru,norw:z.norway.lost,reached:z.reached,paris:z.parisDay,calais:z.calaisDay,rhine:rh.length?Math.min(...rh):null});
      if(++i>=n){i=0;si++;}}
    if(si<sets.length){$('mcstat').textContent=`計算中… ${Math.round(100*(si*n+i)/(sets.length*n))}%`;setTimeout(step,0);return;}
    MC.A=res.A;MC.B=res.B;MC.n=n;$('mcbox').classList.remove('busy');
    $('mcstat').textContent=`${n}回 × ${sets.length}通り・${((performance.now()-t0)/1000).toFixed(1)}秒`;mcDraw();};
  step();
}
const qtl=(a,f)=>{const s=a.filter(v=>v!=null).sort((x,y)=>x-y);return s.length?s[Math.min(s.length-1,Math.floor(f*s.length))]:null;};
const pct=(a,f)=>{const c=a.filter(f).length;const v=Math.round(100*c/a.length);return c>0&&v===0?'&lt;1':(c<a.length&&v===100?'&gt;99':v);};
function spear(x,y){const rk=a=>{const s=a.map((v,i)=>[v,i]).sort((p,q)=>p[0]-q[0]);const r=new Array(a.length);let k=0;
    while(k<s.length){let j=k;while(j+1<s.length&&s[j+1][0]===s[k][0])j++;const avg=(k+j)/2;for(let m=k;m<=j;m++)r[s[m][1]]=avg;k=j+1;}return r;};
  const a=rk(x),b=rk(y),n=a.length,ma=(n-1)/2;let sab=0,sa=0,sb=0;for(let i=0;i<n;i++){sab+=(a[i]-ma)*(b[i]-ma);sa+=(a[i]-ma)**2;sb+=(b[i]-ma)**2;}return sa&&sb?sab/Math.sqrt(sa*sb):0;}
function tile(lab,p,sub,cls){return `<div class="mct ${cls||''}"><div class="mcp mono">${p==null?'—':p+'<small>%</small>'}</div><div class="mcl">${lab}</div>${sub?`<div class="mcs">${sub}</div>`:''}</div>`;}
const band=(arr)=>{const m=qtl(arr,.5);if(m==null)return '';const lo=qtl(arr,.1),hi=qtl(arr,.9);return `中央値 D+${m}${lo!=null&&hi!=null&&lo!==hi?`（8割が D+${lo}〜${hi}）`:''}`;};
function mcDraw(){
  const A=MC.A,B=MC.B;if(!B)return;const T=[];
  if(A){const th=A.filter(r=>r.thr).map(r=>r.thr);T.push(tile('D+60までに核の敷居に達する',pct(A,r=>r.thr),band(th),'nuke'));
    if(P.nukeMode==='fu'||P.nukeMode==='esc')T.push(tile('NATOが核を初使用する',pct(A,r=>r.use),band(A.filter(r=>r.use).map(r=>r.use)),'nuke'));}
  const lbl=P.nuc==='early'?'核の同時使用の想定で60日間':'核を使わず60日間通常戦が続いた場合';
  T.push(`<div class="mcsep">${lbl}</div>`);
  T.push(tile('いずれかの軸がライン川に届く',pct(B,r=>r.rhine),band(B.filter(r=>r.rhine).map(r=>r.rhine)),'wp'));
  T.push(tile('英仏海峡の港（カレー）に届く',pct(B,r=>r.calais),band(B.filter(r=>r.calais).map(r=>r.calais)),'wp'));
  T.push(tile('パリに届く',pct(B,r=>r.paris),band(B.filter(r=>r.paris).map(r=>r.paris)),'wp'));
  T.push(tile('コペンハーゲンに届く',pct(B,r=>r.reached.zea),band(B.filter(r=>r.reached.zea).map(r=>r.reached.zea)),''));
  if(P.berlin==='assault')T.push(tile('西ベルリンが陥落する',pct(B,r=>r.berlin),band(B.filter(r=>r.berlin).map(r=>r.berlin)),''));
  if(P.norway)T.push(tile('北ノルウェーの飛行場が落ちる',pct(B,r=>r.norw),band(B.filter(r=>r.norw).map(r=>r.norw)),''));
  if(P.austria==='violate')T.push(tile('オーストリアを抜ける',pct(B,r=>r.aust),band(B.filter(r=>r.aust).map(r=>r.aust)),''));
  $('mctiles').innerHTML=T.join('');
  mcChart();mcSens();mcAxes();
  $('mcranges').innerHTML=MC_RANGES.map(r=>`<li><b>${r[1]}</b> ${r[2]}</li>`).join('');
}
const MCH={w:640,h:260,l:44,r:110,t:16,b:30};
function mcChart(){
  const svg=d3.select('#mcchart');svg.selectAll('*').remove();const A=MC.A,B=MC.B;
  const xs=d3.scaleLinear([0,60],[MCH.l,MCH.w-MCH.r]),ys=d3.scaleLinear([0,100],[MCH.h-MCH.b,MCH.t]);
  [0,25,50,75,100].forEach(t=>{svg.append('line').attr('x1',MCH.l).attr('x2',MCH.w-MCH.r).attr('y1',ys(t)).attr('y2',ys(t)).style('stroke','var(--line)');
    svg.append('text').attr('x',MCH.l-6).attr('y',ys(t)+4).attr('text-anchor','end').attr('font-size',11).style('fill','var(--muted)').style('font-family','var(--f-mono)').text(t+'%');});
  [0,10,20,30,40,50,60].forEach(t=>svg.append('text').attr('x',xs(t)).attr('y',MCH.h-MCH.b+18).attr('text-anchor','middle').attr('font-size',11).style('fill','var(--muted)').style('font-family','var(--f-mono)').text('D+'+t));
  const cdf=(arr,get)=>d3.range(61).map(d=>100*arr.filter(r=>{const v=get(r);return v!=null&&v<=d;}).length/arr.length);
  const S=[];if(A)S.push({k:'核の敷居',c:'var(--nuke)',v:cdf(A,r=>r.thr)});
  S.push({k:'ライン川到達',c:'var(--wp)',v:cdf(B,r=>r.rhine)});S.push({k:'パリ到達',c:'var(--wp)',dash:'6 4',v:cdf(B,r=>r.paris)});
  const line=d3.line().x((v,i)=>xs(i)).y(v=>ys(v)).curve(d3.curveStepAfter);
  // end labels, nudged apart
  const ends=S.map(s=>({s,y:ys(s.v[60])}));ends.sort((a,b)=>a.y-b.y);for(let i=1;i<ends.length;i++)if(ends[i].y-ends[i-1].y<14)ends[i].y=ends[i-1].y+14;
  S.forEach(s=>{svg.append('path').attr('d',line(s.v)).style('fill','none').style('stroke',s.c).attr('stroke-width',2).attr('stroke-dasharray',s.dash||null).attr('stroke-linejoin','round');});
  ends.forEach(e=>{svg.append('text').attr('x',MCH.w-MCH.r+8).attr('y',e.y+4).attr('font-size',11.5).style('fill','var(--ink)').text(`${e.s.k} ${Math.round(e.s.v[60])}%`);
    svg.append('line').attr('x1',MCH.w-MCH.r+1).attr('x2',MCH.w-MCH.r+6).attr('y1',ys(e.s.v[60])).attr('y2',e.y).style('stroke',e.s.c).attr('stroke-width',2).attr('stroke-dasharray',e.s.dash?'2 2':null);});
  const cur=svg.append('line').attr('y1',MCH.t).attr('y2',MCH.h-MCH.b).style('stroke','var(--muted)').attr('stroke-width',1).style('display','none');
  const dots=S.map(s=>svg.append('circle').attr('r',4).style('fill',s.c).style('stroke','var(--panel)').attr('stroke-width',2).style('display','none'));
  const tip=$('mctip');
  svg.append('rect').attr('x',MCH.l).attr('y',MCH.t).attr('width',MCH.w-MCH.r-MCH.l).attr('height',MCH.h-MCH.t-MCH.b).style('fill','transparent')
    .on('pointermove',ev=>{const [mx]=d3.pointer(ev);const d=Math.max(0,Math.min(60,Math.round(xs.invert(mx))));cur.attr('x1',xs(d)).attr('x2',xs(d)).style('display',null);
      S.forEach((s,i)=>dots[i].attr('cx',xs(d)).attr('cy',ys(s.v[d])).style('display',null));
      tip.hidden=false;tip.innerHTML=`<b>D+${d}まで</b>`+S.map(s=>`<div><span class="sw" style="border-top:2px ${s.dash?'dashed':'solid'} ${s.c}"></span>${s.k}<span class="mono">${Math.round(s.v[d])}%</span></div>`).join('');
      const box=$('mcchart').getBoundingClientRect();const px=xs(d)/MCH.w*box.width;tip.style.left=(px>box.width*0.55?px-tip.offsetWidth-12:px+12)+'px';tip.style.top='8px';})
    .on('pointerleave',()=>{cur.style('display','none');dots.forEach(c=>c.style('display','none'));tip.hidden=true;});
}
function mcSens(){
  const useA=!!MC.A;const set=useA?MC.A:MC.B;const y=set.map(r=>(useA?r.thr:r.rhine)??61);
  const keys=SENS_KEYS.filter(([k])=>!(k==='chemN'&&!P.chem)&&!(k==='bDef'&&P.berlin!=='assault')&&!(k==='aDef'&&P.austria!=='violate')&&!(k==='deep'&&P.natoDoc!=='ALB')&&!(['natSpread','natoFr','wpRelK','wpDecay'].includes(k)&&!P.nat));
  if(new Set(y).size<2){$('mcsens').innerHTML=`<p class="mcnote">${useA?'核の敷居に達する日':'ライン川に届く日'}がどの試行でも同じで、比べられない。</p>`;return;}
  const rows=keys.map(([k,l])=>({k,l,r:spear(set.map(z=>z.q[k]),y)})).sort((a,b)=>Math.abs(b.r)-Math.abs(a.r)).slice(0,6);
  const what=useA?'核の敷居':'ライン川到達';
  $('mcsens').innerHTML=`<p class="mcnote">各数字と「${what}の日」の順位相関（−1〜1）。絶対値が大きいほど結果を左右している。</p>`+rows.map(o=>`<div class="sbar"><div class="sl">${o.l}</div><div class="st"><div class="sf" style="width:${Math.round(Math.abs(o.r)*100)}%"></div></div><div class="sv mono">${o.r>=0?'+':'−'}${Math.abs(o.r).toFixed(2)}</div><div class="sd">${Math.abs(o.r)<0.1?'ほぼ影響なし':(o.r>0?`大きいほど${what}が遅れる`:`大きいほど${what}が早まる`)}</div></div>`).join('');
}
function mcAxes(){
  const B=MC.B;const rows=AXES.map(a=>{const ds=B.map(r=>r.reached[a.id]).filter(v=>v!=null);const goal=a.amph?'コペンハーゲン':(a.rhine?'ライン川':null);
    const pr=Math.round(100*ds.length/B.length);return {a,goal,p:pr,pt:ds.length>0&&pr===0?'&lt;1':(ds.length<B.length&&pr===100?'&gt;99':pr),m:qtl(ds,.5),lo:qtl(ds,.1),hi:qtl(ds,.9)};}).filter(o=>o.goal);
  $('mcaxt').innerHTML=`<thead><tr><th>軸</th><th>目標</th><th>60日以内に届く割合</th><th>届いた日（中央値と8割の幅）</th></tr></thead><tbody>`+
    rows.map(o=>`<tr><td>${o.a.short}</td><td>${o.goal}</td><td class="mono"><span class="pbar"><span style="width:${o.p}%"></span></span> ${o.pt}%</td><td class="mono">${o.m!=null?`D+${o.m}${o.lo!==o.hi?`（D+${o.lo}〜${o.hi}）`:''}`:'—'}</td></tr>`).join('')+'</tbody>';
}
$('mcrun').onclick=mcStart;$('mcn').onchange=mcStart;$('mcauto').onchange=()=>{if($('mcauto').checked)mcStart();};
mcStart();
