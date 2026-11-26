// Run the simulator model for the map scenes and write src/map/runs.json and src/map/geo.json.
// Usage (from video/): node tools/sim_runs.js   (needs ../node_modules: npm install in the repo root)
const fs=require('fs'),path=require('path');
const ROOT=path.resolve(__dirname,'../..'),OUT=path.resolve(__dirname,'../src/map');
global.d3g=require(ROOT+'/node_modules/d3-geo');
const M=require(ROOT+'/src/model.js');M.prepAxes();
const main=fs.readFileSync(ROOT+'/src/part_main.js','utf8');
const BASE=eval('('+main.match(/const BASE=(\{.*?\});/)[1]+')');
const PRESETS=eval('('+main.slice(main.indexOf('const PRESETS=')+14,main.indexOf('let P={};')).trim().replace(/;$/,'')+')');
const CORPS=eval('('+main.match(/const CORPS=(\[.*?\]);/)[1]+')'),CITIES=eval('('+main.match(/const CITIES=(\[.*?\]);/)[1]+')');
const geoSrc=fs.readFileSync(ROOT+'/src/part_geo.js','utf8');
const G=new Function(geoSrc+';return {IGB,GDR,RIVERS};')();
const nk={n1:40,k1:10,n2:400,k2:200,n3:300,k3:150};
const P=(pre,o={})=>({...BASE,nuc:'flex',wpDoc:'conv',natoDoc:'ALB',...PRESETS[pre].p,...o,nk});
const RUNS={
 r1961:P('p1961'), r1964:P('p1964'), r1979:P('p1979'),
 r1985:P('p1985'), r1985s:P('p1985s'), r1985f:P('p1985f'),
 r1985ig:P('p1985',{nukeMode:'ignore'}), r1976ig:P('p1976',{nukeMode:'ignore'}),
 r1985off:P('p1985',{nukeMode:'ignore',logi:false,rivers:false}),
 r1985esc:P('p1985',{nukeMode:'esc',consult:2}),
 r1985au:P('p1985',{nukeMode:'ignore',austria:'violate'}),
 r1985chem:P('p1985',{nukeMode:'ignore',chem:true}),
 d0:P('p1985'),
};
const r1=v=>Math.round(v*10)/10;
const runs={};
for(const [id,p] of Object.entries(RUNS)){
  const z=M.run(p);
  runs[id]={days:z.days,stop:z.stop,nucT:z.nucT,thrDay:z.thrDay,reached:z.reached,nsOut:z.nsOut,
    ax:z.ax.map(x=>({id:x.a.id,failed:!!x.failed,h:x.hist.map(h=>[r1(h.pen),h.xing?1:0,h.rv||0,h.sw==null?null:r1(h.sw),r1(h.wp),r1(h.nato),h.R==null?null:Math.round(h.R*100)/100,h.omg?1:0])})),
    nukes:z.nukes,berlin:{on:z.berlin.on,fell:z.berlin.fell},austria:{on:z.austria.on,thru:z.austria.thru},
    ns:z.nsHist.map(r1),air:z.sHist.map(v=>Math.round(v*100)),civ:z.civHist.map(v=>Math.round(v)),
    log:z.log.map(l=>[l[0],l[1],l[2]])};
  console.log(id,'days',z.days,'stop',z.stop,'reached',JSON.stringify(z.reached));
}
const axes=M.AXES.map(a=>({id:a.id,short:a.short,name:a.name,amph:!!a.amph,seaKm:a.seaKm,path:a.path.map(q=>[q[0],q[1],q[2]]),cum:a.cum.map(r1),len:r1(a.len),rivers:a.rivers}));
fs.writeFileSync(OUT+'/runs.json',JSON.stringify(runs));
fs.writeFileSync(OUT+'/geo.json',JSON.stringify({eu:require(ROOT+'/src/data/eu.json'),igb:G.IGB,gdr:G.GDR,rivers:G.RIVERS,corps:CORPS,cities:CITIES,axes}));
console.log('runs.json',fs.statSync(OUT+'/runs.json').size,'geo.json',fs.statSync(OUT+'/geo.json').size);
