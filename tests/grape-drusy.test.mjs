import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';import {createHash} from 'node:crypto';
const root=new URL('../prototype/assets/models/',import.meta.url);
function glb(file){const b=readFileSync(new URL(file,root)),l=b.readUInt32LE(12);return{d:JSON.parse(b.subarray(20,20+l)),bin:b.subarray(28+l)};}
function attr(g,name,key){const n=g.d.nodes.find(n=>n.name===name),p=g.d.meshes[n.mesh].primitives[0],a=g.d.accessors[p.attributes[key]],v=g.d.bufferViews[a.bufferView];return{a,bytes:g.bin.subarray(v.byteOffset,v.byteOffset+v.byteLength)};}
const old=glb('botryoidal-chalcedony-study-v1.glb'),now=glb('botryoidal-chalcedony-study-v2.glb');
test('grape revision preserves paired exteriors and the accepted white V2 asset',()=>{
 for(const name of ['Closed_front','Closed_back','Outer_shell_0','Outer_shell_1'])for(const key of ['POSITION','NORMAL','TEXCOORD_0'])assert.deepEqual(attr(now,name,key).bytes,attr(old,name,key).bytes);
 assert.equal(createHash('sha256').update(readFileSync(new URL('white-druse-study-v2.glb',root))).digest('hex'),'da0c7bc00b890b771e680d5091f89396ed3e49b75129f14ca196b02d5a0e422d');
 assert.notDeepEqual(attr(now,'Cavity_0','POSITION').bytes,attr(old,'Cavity_0','POSITION').bytes);
});
test('drusy quartz geometry is attached to the fused body, rather than floating sparkles',()=>{
 for(const side of [0,1]){
  const body=attr(now,'Botryoidal_fused_'+side,'POSITION'),cells=new Map(),size=.06;
  function p(b,i){return[0,4,8].map(k=>b.readFloatLE(i*12+k));}
  for(let i=0;i<body.a.count;i++){const v=p(body.bytes,i),key=v.map(x=>Math.floor(x/size)).join(',');if(!cells.has(key))cells.set(key,[]);cells.get(key).push(v);}
  let count=0;
  for(let group=0;group<5;group++){
   const coat=attr(now,`Crystals_${side}_${group}`,'POSITION');assert.ok(coat.a.count>1000);
   for(let i=0;i<coat.a.count;i+=127){const v=p(coat.bytes,i),cell=v.map(x=>Math.floor(x/size));let best=Infinity;
    for(let x=-1;x<=1;x++)for(let y=-1;y<=1;y++)for(let z=-1;z<=1;z++)for(const q of cells.get([cell[0]+x,cell[1]+y,cell[2]+z].join(','))||[])best=Math.min(best,Math.hypot(...v.map((x,k)=>x-q[k])));
    assert.ok(best<.055,`coating too far from body: ${best}`);count++;
   }
  }assert.ok(count>200);
 }
 const coats=now.d.materials.filter(m=>m.name.startsWith('Drusy_quartz_overgrowth'));assert.equal(coats.length,5);assert.ok(coats.every(m=>m.pbrMetallicRoughness.metallicFactor===0&&!m.emissiveFactor&&m.pbrMetallicRoughness.roughnessFactor<.3));
});
