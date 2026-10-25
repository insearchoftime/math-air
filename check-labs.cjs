// Run with Node.js. Numerical checks use known answers and geometric invariants.
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const context = {window:{},document:{documentElement:{lang:'en'},getElementById:()=>null}};
vm.createContext(context);
if(fs.existsSync(__dirname+'/embeddings-data.js'))vm.runInContext(fs.readFileSync(__dirname+'/embeddings-data.js','utf8'),context);
vm.runInContext(fs.readFileSync(__dirname+'/learning-labs.js','utf8'),context);
const {math:m,data}=context.window.MathAirLabs;
const near=(a,b,tolerance=1e-8)=>assert.ok(Math.abs(a-b)<tolerance,a+' != '+b);
near(m.cosine([1,0],[0,1]),0);
near(m.cosine([2,3],[-4,-6]),-1);
near(m.cosine([2,3],[4,6]),1);
assert.equal(m.cosine([0,0],[1,0]),null);
near(m.length(m.normalize([3,4])),1);
near(m.dot(m.normalize([3,4]),m.normalize([4,-3])),0);
near(m.cosine([3,7],[5,-2]),m.cosine([30,70],[.5,-.2]));
const grouped=m.kmeans([[1,0],[.99,.01],[0,1],[.01,.99],[0,0]],2);
assert.equal(grouped.labels[0],grouped.labels[1]);
assert.equal(grouped.labels[2],grouped.labels[3]);
assert.notEqual(grouped.labels[0],grouped.labels[2]);
assert.equal(grouped.labels[4],-1);
const projected=m.pca([[1,2],[2,1],[3,4],[4,3],[0,0]]);
near(projected.retained,1);
assert.equal(projected.coords[4],null);
for(let i=0;i<4;i++)for(let j=0;j<4;j++){
  const input=[[1,2],[2,1],[3,4],[4,3]];
  const original=Math.hypot(input[i][0]-input[j][0],input[i][1]-input[j][1]);
  const p=projected.coords;
  near(Math.hypot(p[i][0]-p[j][0],p[i][1]-p[j][1]),original,1e-6);
}
const display=context.window.MathAirLabs.display;
const coincident=[[1,2],[1,2],[1,2],[1,2],[1,2],[3,4],null];
const originalCoordinates=JSON.stringify(coincident);
const offsets=display.coincidentOffsets(coincident);
assert.equal(JSON.stringify(coincident),originalCoordinates);
for(let i=0;i<5;i++)for(let j=i+1;j<5;j++)
  assert.ok(Math.hypot(offsets[i].x-offsets[j].x,offsets[i].y-offsets[j].y)>27.99);
assert.equal(offsets[5].x,0);assert.equal(offsets[5].y,0);
assert.equal(offsets[6].x,0);assert.equal(offsets[6].y,0);
context.window.MathAirLabs.render('ru');
for(const [n,expected] of [[0,'0 фрагментов'],[1,'1 фрагмент'],[2,'2 фрагмента'],[4,'4 фрагмента'],[5,'5 фрагментов'],[11,'11 фрагментов'],[14,'14 фрагментов'],[21,'21 фрагмент'],[24,'24 фрагмента'],[111,'111 фрагментов']])
  assert.equal(display.counted(n),expected);
assert.equal(display.counted(1,'point'),'1 точка');
assert.equal(display.counted(3,'point'),'3 точки');
context.window.MathAirLabs.render('en');
assert.equal(display.counted(1),'1 fragment');assert.equal(display.counted(2),'2 fragments');
assert.equal(new Set(data.map(d=>d.id)).size,24);
for(const d of data){
  assert.equal(d.text.ru.length,2);assert.equal(d.text.en.length,2);
  assert.equal(d.vectors.length,2);
  for(const v of d.vectors){assert.equal(v.length,4);v.forEach(x=>assert.ok(Number.isFinite(x)&&x>=0));}
}
if(context.window.MathAirEmbeddings){
  const e=context.window.MathAirEmbeddings;
  for(const lang of ['ru','en'])for(const unit of ['episode','reply'])for(const d of data){
    const v=e[lang][unit][d.id];assert.equal(v.length,384);
    v.forEach(x=>assert.ok(Number.isFinite(x)));
    near(m.length(v),1,1e-6);
  }
}
const html=fs.readFileSync(__dirname+'/index.html','utf8');
for(const s of html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g))new vm.Script(s[1]);
console.log('PASS: cosine, normalization, zero vectors, k-means, PCA distances, coincident-point display, count inflections, corpus and script syntax'+(context.window.MathAirEmbeddings?', 96 unit embeddings':''));
