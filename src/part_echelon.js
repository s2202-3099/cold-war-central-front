/* ---------- §3 echelon diagram ---------- */
(function(){
  const s=d3.select('#echelon');const g=s.append('g');
  const T=(x,y,t,o={})=>g.append('text').attr('x',x).attr('y',y).text(t).attr('font-size',o.size||13).attr('fill',o.fill||'var(--ink)').attr('text-anchor',o.anchor||'middle').attr('font-family',o.font||'var(--f-body)').attr('font-weight',o.w||400);
  // zones
  g.append('rect').attr('x',0).attr('y',0).attr('width',900).attr('height',300).attr('fill','var(--panel)');
  g.append('rect').attr('x',0).attr('y',0).attr('width',430).attr('height',300).attr('fill','var(--wp-soft)').attr('fill-opacity',.6);
  g.append('rect').attr('x',430).attr('y',0).attr('width',470).attr('height',300).attr('fill','var(--nato-soft)').attr('fill-opacity',.6);
  g.append('line').attr('x1',430).attr('x2',430).attr('y1',0).attr('y2',300).attr('stroke','var(--ink)').attr('stroke-width',2.5).attr('stroke-dasharray','8 4');
  T(430,292,'国境（FLOT）',{size:11,font:'var(--f-mono)'});
  T(20,24,'← ワ条約機構の縦深',{anchor:'start',size:12,fill:'var(--wp)',font:'var(--f-mono)'});T(880,24,'NATOの縦深 →',{anchor:'end',size:12,fill:'var(--nato)',font:'var(--f-mono)'});
  // NATO zones
  [['援護地域',470,525],['主防御地域',530,700],['後方地域',705,890]].forEach(([n,a,b],i)=>{g.append('rect').attr('x',a).attr('y',44).attr('width',b-a).attr('height',212).attr('fill','none').attr('stroke','var(--nato)').attr('stroke-opacity',.5).attr('stroke-dasharray',i===1?'none':'4 3');T((a+b)/2,64,n,{size:12,fill:'var(--nato)'});});
  // battle positions
  [[580,120],[640,170],[600,215],[660,100]].forEach(([x,y])=>{g.append('path').attr('d',`M${x-16},${y+8} A18,18 0 0 1 ${x+16},${y+8}`).attr('fill','none').attr('stroke','var(--nato)').attr('stroke-width',2.5);});
  T(615,248,'陣地からの火力で第一梯団を消耗',{size:11,fill:'var(--nato)'});
  // WP echelons
  const box=(x,y,w,h,t,sub)=>{g.append('rect').attr('x',x).attr('y',y).attr('width',w).attr('height',h).attr('fill','var(--paper)').attr('stroke','var(--wp)').attr('stroke-width',2);T(x+w/2,y+h/2-2,t,{size:12.5,fill:'var(--wp)',w:700});if(sub)T(x+w/2,y+h/2+14,sub,{size:10.5,fill:'var(--muted)'});};
  box(300,95,110,56,'第一梯団','突破口を開く');box(300,175,110,50,'第一梯団','');
  box(150,120,110,56,'OMG','突破口から縦深へ');
  box(20,110,110,76,'第二梯団','成功方向へ投入');
  // arrows
  const arr=(d,c,w,dash)=>g.append('path').attr('d',d).attr('fill','none').attr('stroke',c).attr('stroke-width',w).attr('stroke-dasharray',dash||'none').attr('marker-end','url(#ah-'+(c.includes('wp')?'r':'b')+')');
  const defs=s.append('defs');[['r','var(--wp)'],['b','var(--nato)']].forEach(([k,c])=>defs.append('marker').attr('id','ah-'+k).attr('viewBox','0 0 10 10').attr('refX',8).attr('refY',5).attr('markerWidth',7).attr('markerHeight',7).attr('orient','auto').append('path').attr('d','M0,0L10,5L0,10z').attr('fill',c));
  arr('M410,123 L455,123','var(--wp)',3);
  arr('M260,148 C340,148 380,148 440,140 C520,128 600,140 760,150','var(--wp)',3.5,'9 5');
  T(760,175,'OMG：核手段・指揮所・飛行場・渡河点',{size:11,fill:'var(--wp)',anchor:'end'});
  arr('M130,150 L148,150','var(--wp)',2.5);
  // deep attack
  arr('M840,92 C640,20 260,20 85,100','var(--nato)',2.5,'3 4');
  T(470,30,'縦深攻撃（エアランド・バトル／FOFA）：接触前の後続梯団を航空・長射程火力で叩き、遅らせる',{size:11.5,fill:'var(--nato)'});
})();
