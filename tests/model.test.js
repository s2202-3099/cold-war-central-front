// Model regression + Monte Carlo summary. Run: npm install && npm test
const path=require('path'),fs=require('fs'),assert=require('assert');
global.d3g=require('d3-geo');
const M=require('../src/model.js'); M.prepAxes();
const src=fs.readFileSync(path.join(__dirname,'../src/part_main.js'),'utf8');
const BASE=eval('('+src.match(/const BASE=(\{.*?\});/)[1]+')');
eval(src.slice(src.indexOf('const PRESETS={'),src.indexOf('let P={};')).replace('const PRESETS','global.PRESETS'));
const nk={n1:40,k1:10,n2:400,k2:200,n3:300,k3:150};
const P=(pre,o={})=>({...BASE,nuc:'flex',wpDoc:'conv',natoDoc:'ALB',...PRESETS[pre].p,...o,nk});

// deterministic baselines
const r=M.run(P('p1985'));
console.log('1985 standard: threshold D+'+r.stop+', West Berlin falls D+'+r.berlin.fell);
assert.ok(r.stop>=15&&r.stop<=35,'1985 threshold should land in the D+15..35 band');
const ig=M.run(P('p1985',{nukeMode:'ignore'}));
console.log('1985 no-nuclear: Rhine reached',JSON.stringify(ig.reached));
const fu=M.run(P('p1985',{nukeMode:'fu',consult:5}));
assert.strictEqual(fu.nucT-fu.thrDay,5,'first use should follow the threshold by the consultation delay');

// Monte Carlo summary
const q=(a,f)=>{const s=a.filter(v=>v!=null).sort((x,y)=>x-y);return s.length?s[Math.floor(f*(s.length-1))]:'-';};
function mc(tag,p,n=300){const a=M.mc(p,n,7);const pc=f=>Math.round(100*a.filter(f).length/n)+'%';
  console.log(tag.padEnd(24),'threshold',pc(x=>x.thr),'median D+'+q(a.map(x=>x.thr),.5),'| Rhine',pc(x=>x.rhine),'Calais',pc(x=>x.calais),'Paris',pc(x=>x.paris));return a;}
mc('1985 stop',P('p1985'));
const a=mc('1985 no-nuclear',P('p1985',{nukeMode:'ignore'}));
mc('1985 no-nuclear + chem',P('p1985',{nukeMode:'ignore',chem:true}));
assert.ok(a.filter(x=>x.rhine).length>0,'some runs should reach the Rhine');
console.log('ok');
