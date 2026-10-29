/** Original procedural meshes and PBR maps, visually informed by the real botryoidal quartz specimen observations.
 * No image-to-3D service, photogrammetry, image projection or downloaded assets.
 * Run: node tools/build-grape-drusy-v3.mjs (no npm dependencies).
 */
import * as T from '../prototype/vendor/three.module.js';
import {mkdirSync,writeFileSync,readFileSync} from 'node:fs';
import {deflateSync} from 'node:zlib';
import {fileURLToPath} from 'node:url';
const base=fileURLToPath(new URL('../prototype/assets/',import.meta.url));
for(const d of ['textures','models'])mkdirSync(base+d,{recursive:true});
const TAU=Math.PI*2,clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
function hash(x,y,z=0){let n=Math.sin(x*127.1+y*311.7+z*74.7+81.42)*43758.5453;return n-Math.floor(n);}
function noise(x,y,z=0){let a=Math.floor(x),b=Math.floor(y),c=Math.floor(z),u=x-a,v=y-b,w=z-c;u=u*u*(3-2*u);v=v*v*(3-2*v);w=w*w*(3-2*w);const mix=(a,b,t)=>a+(b-a)*t;return mix(mix(mix(hash(a,b,c),hash(a+1,b,c),u),mix(hash(a,b+1,c),hash(a+1,b+1,c),u),v),mix(mix(hash(a,b,c+1),hash(a+1,b,c+1),u),mix(hash(a,b+1,c+1),hash(a+1,b+1,c+1),u),v),w);}
function fbm(x,y,z=0){return .55*noise(x,y,z)+.28*noise(x*2.07+4,y*2.07+8,z*2.07)+.12*noise(x*5.1,y*5.1,z*5.1)+.05*noise(x*13,y*13,z*13);}
function random(seed){return()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};}
const crcTable=Array.from({length:256},(_,n)=>{for(let i=0;i<8;i++)n=(n&1)?0xedb88320^(n>>>1):n>>>1;return n>>>0;});
function crc(buf){let c=0xffffffff;for(const v of buf)c=crcTable[(c^v)&255]^(c>>>8);return(c^0xffffffff)>>>0;}
function chunk(name,data){const tag=Buffer.from(name),out=Buffer.alloc(12+data.length);out.writeUInt32BE(data.length);tag.copy(out,4);data.copy(out,8);out.writeUInt32BE(crc(Buffer.concat([tag,data])),8+data.length);return out;}
function png(w,h,rgba){const header=Buffer.alloc(13);header.writeUInt32BE(w);header.writeUInt32BE(h,4);header[8]=8;header[9]=6;const scan=Buffer.alloc(h*(w*4+1));for(let y=0;y<h;y++)Buffer.from(rgba.buffer,y*w*4,w*4).copy(scan,y*(w*4+1)+1);return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',header),chunk('IDAT',deflateSync(scan,{level:9})),chunk('IEND',Buffer.alloc(0))]);}
function outerRadius(v){return 1.49*(1+.38*(fbm(Math.abs(v.x)*3+5,v.y*3+8,Math.abs(v.z)*3+4)-.5)+.025*(noise(Math.abs(v.x)*28,v.y*28,Math.abs(v.z)*28)-.5)+.032*Math.cos(v.y*5)+.055*Math.sin(v.y*2.1));}
function geo(p,uv,ix){const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));if(ix)g.setIndex(ix);g.computeVertexNormals();return g;}
class GLB {
 constructor(){this.doc={asset:{version:'2.0',generator:'Geode Hunter original procedural asset builder v1'},scene:0,scenes:[{nodes:[]}],nodes:[],meshes:[],materials:[],textures:[],images:[],samplers:[{magFilter:9729,minFilter:9987,wrapS:10497,wrapT:10497}],accessors:[],bufferViews:[],buffers:[{byteLength:0}]};this.parts=[];this.length=0;this.textureCache=new Map();}
 bytes(bytes,target){const padding=(4-this.length%4)%4;if(padding){this.parts.push(Buffer.alloc(padding));this.length+=padding;}const i=this.doc.bufferViews.length;this.doc.bufferViews.push({buffer:0,byteOffset:this.length,byteLength:bytes.length,...(target?{target}:{})});this.parts.push(bytes);this.length+=bytes.length;return i;}
 texture(bytes){if(this.textureCache.has(bytes))return this.textureCache.get(bytes);const image=this.doc.images.push({bufferView:this.bytes(bytes),mimeType:'image/png'})-1;const index=this.doc.textures.push({sampler:0,source:image})-1;this.textureCache.set(bytes,index);return index;}
 material(name,color,maps,roughness=1,extra={}){let pbr={baseColorFactor:[...color,1],metallicFactor:0,roughnessFactor:roughness};let m={name,pbrMetallicRoughness:pbr,...extra};if(maps){pbr.baseColorTexture={index:this.texture(maps.base)};pbr.metallicRoughnessTexture={index:this.texture(maps.roughness)};m.normalTexture={index:this.texture(maps.normal),scale:name==='Weathered_shell'?.65:.28};}return this.doc.materials.push(m)-1;}
 mesh(name,g,material){const attributes={};for(const [key,semantic,size] of [['position','POSITION',3],['normal','NORMAL',3],['uv','TEXCOORD_0',2],['color','COLOR_0',3]]){if(!g.attributes[key])continue;const values=g.attributes[key].array,entry={bufferView:this.bytes(Buffer.from(values.buffer,values.byteOffset,values.byteLength),34962),componentType:5126,count:values.length/size,type:size===2?'VEC2':'VEC3'};if(key==='position'){const box=new T.Box3().setFromBufferAttribute(g.attributes.position);entry.min=box.min.toArray();entry.max=box.max.toArray();}attributes[semantic]=this.doc.accessors.push(entry)-1;}
 const primitive={attributes,material};if(g.index){const arr=new Uint32Array(g.index.array);primitive.indices=this.doc.accessors.push({bufferView:this.bytes(Buffer.from(arr.buffer),34963),componentType:5125,count:arr.length,type:'SCALAR'})-1;}
 const mesh=this.doc.meshes.push({name,primitives:[primitive]})-1;return this.node({name,mesh});}
 node(node){return this.doc.nodes.push(node)-1;}
 save(path){this.doc.buffers[0].byteLength=this.length;let json=Buffer.from(JSON.stringify(this.doc));json=Buffer.concat([json,Buffer.alloc((4-json.length%4)%4,32)]);let bin=Buffer.concat(this.parts);bin=Buffer.concat([bin,Buffer.alloc((4-bin.length%4)%4)]);const header=Buffer.alloc(12),jhead=Buffer.alloc(8),bhead=Buffer.alloc(8);header.writeUInt32LE(0x46546c67);header.writeUInt32LE(2,4);header.writeUInt32LE(12+8+json.length+8+bin.length,8);jhead.writeUInt32LE(json.length);jhead.writeUInt32LE(0x4e4f534a,4);bhead.writeUInt32LE(bin.length);bhead.writeUInt32LE(0x004e4942,4);writeFileSync(path,Buffer.concat([header,jhead,json,bhead,bin]));return 12+8+json.length+8+bin.length;}
}

// Grape-only revision. Read the frozen original: exteriors remain byte-identical.
const oldBytes=readFileSync(base+'models/botryoidal-chalcedony-study-v1.glb'),jl=oldBytes.readUInt32LE(12),old=JSON.parse(oldBytes.subarray(20,20+jl)),bin=oldBytes.subarray(28+jl);
function oldView(i){const v=old.bufferViews[i];return bin.subarray(v.byteOffset,v.byteOffset+v.byteLength);}
function originalGeometry(name){const node=old.nodes.find(n=>n.name===name),p=old.meshes[node.mesh].primitives[0],g=new T.BufferGeometry();for(const [semantic,key,size]of [['POSITION','position',3],['NORMAL','normal',3],['TEXCOORD_0','uv',2]]){const a=old.accessors[p.attributes[semantic]],b=oldView(a.bufferView);g.setAttribute(key,new T.Float32BufferAttribute(new Float32Array(b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength)),size));}if(p.indices!==undefined){const a=old.accessors[p.indices],b=oldView(a.bufferView);g.setIndex(new T.Uint32BufferAttribute(new Uint32Array(b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength)),1));}return g;}
const oldShell=old.materials.find(m=>m.name==='Weathered_shell'),oldMap=i=>oldView(old.images[old.textures[i].source].bufferView),shellMaps={base:oldMap(oldShell.pbrMetallicRoughness.baseColorTexture.index),normal:oldMap(oldShell.normalTexture.index),roughness:oldMap(oldShell.pbrMetallicRoughness.metallicRoughnessTexture.index)};

// Two scales: a continuous fused botryoidal body, and minute faceted quartz overgrowth.
// The real-photo references are linked in docs; they are not projected or redistributed.
function drusyMaps(){
 const N=512,color=new Uint8Array(N*N*4),normal=new Uint8Array(color.length),rough=new Uint8Array(color.length);
 for(let y=0;y<N;y++)for(let x=0;x<N;x++){
  const i=(y*N+x)*4,u=x/4.2,v=y/4.2,cx=Math.floor(u),cy=Math.floor(v);let best=Infinity,cell=[0,0];
  for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){const xx=cx+a,yy=cy+b,d=(u-xx-hash(xx,yy,8))**2+(v-yy-hash(xx,yy,13))**2;if(d<best){best=d;cell=[xx,yy];}}
  const sx=(hash(...cell,23)-.5)*.48,sy=(hash(...cell,31)-.5)*.48,len=Math.hypot(sx,sy,1),f=hash(...cell,19);
  for(let k=0;k<3;k++){color[i+k]=242+f*12;rough[i+k]=125+hash(...cell,47)*105;}
  normal[i]=(sx/len*.5+.5)*255;normal[i+1]=(sy/len*.5+.5)*255;normal[i+2]=(1/len*.5+.5)*255;color[i+3]=rough[i+3]=normal[i+3]=255;
 }
 const maps={base:png(N,N,color),normal:png(N,N,normal),roughness:png(N,N,rough)};
 for(const [name,bytes]of Object.entries(maps))writeFileSync(base+`textures/grape-drusy-v3-${name}.png`,bytes);return maps;
}
function bowl(x,y){const r=Math.min(1,Math.hypot(x/1.22,y/1.32));return .83*Math.pow(Math.max(0,1-r*r),.64);}
function cavity(side){
 const p=[],uv=[],ix=[],c=[],N=65,rnd=random(8801+side*91);
 for(let j=0;j<=N;j++)for(let i=0;i<=N;i++){
  const u=-1+i/N*2,v=-1+j/N*2,x=1.22*u*Math.sqrt(1-v*v/2),y=1.32*v*Math.sqrt(1-u*u/2),z=bowl(x,y)+.008*(rnd()-.5);
  p.push(x,y,z);uv.push(x/2.5+.5,y/2.7+.5);const shade=.73+.1*noise(x*4+5,y*4+9);c.push(shade,shade,shade);
 }
 for(let j=0;j<N;j++)for(let i=0;i<N;i++){const a=j*(N+1)+i,b=a+N+1;ix.push(a,b,a+1,b,b+1,a+1);}
 const g=geo(p,uv,ix);g.setAttribute('color',new T.Float32BufferAttribute(c,3));return g;
}
function rimGeometry(){
 const p=[],uv=[],c=[],ix=[],N=192,M=10;
 for(let j=0;j<=M;j++)for(let i=0;i<=N;i++){
  const a=i/N*TAU,f=j/M,v=new T.Vector3(Math.cos(a),Math.sin(a),0),inner=Math.hypot(v.x*1.22,v.y*1.32/1.06),outer=outerRadius(v),r=inner+(outer-inner)*f;
  p.push(v.x*r,v.y*r*1.06,0);uv.push(v.x*r*.6+.5,v.y*r*.6+.5);const col=new T.Color('#aaa0b0').lerp(new T.Color('#7d7a72'),Math.pow(f,3)).multiplyScalar(.94+.06*noise(Math.cos(a)*8+f,Math.sin(a)*8));c.push(col.r,col.g,col.b);
 }
 for(let j=0;j<M;j++)for(let i=0;i<N;i++){const a=j*(N+1)+i,b=a+N+1;ix.push(a,b,a+1,b,b+1,a+1);}
 const g=geo(p,uv,ix);g.setAttribute('color',new T.Float32BufferAttribute(c,3));return g;
}
function nodules(side){
 const rnd=random(120703+side*377),out=[];
 const add=(x,y,r)=>out.push({x,y,z:bowl(x,y)-r*(.18+rnd()*.58),r,stretch:[.86+rnd()*.28,.85+rnd()*.30,.74+rnd()*.28]});
 // Irregular, variable-sized parent lobes; no rows, polar rings, or empty center.
 for(let i=0;i<2800;i++){const a=rnd()*TAU,d=Math.sqrt(rnd())*.97,x=Math.cos(a)*1.22*d,y=Math.sin(a)*1.32*d,r=.075+Math.pow(rnd(),1.3)*.17;
  if(out.some(v=>Math.hypot(x-v.x,y-v.y)<.67*(r+v.r)))continue;add(x,y,r);
 }
 // Fill only uncovered wall patches with smaller intergrown lobes. Samples are random, not a grid.
 for(let i=0;i<18000;i++){const a=rnd()*TAU,d=Math.sqrt(rnd())*.95,x=Math.cos(a)*1.22*d,y=Math.sin(a)*1.32*d;
  if(out.some(v=>((x-v.x)/(v.r*v.stretch[0]))**2+((y-v.y)/(v.r*v.stretch[1]))**2<.88))continue;add(x,y,.07+rnd()*.065);
 }
 return out;
}
const smoothMin=(a,b,k=.012)=>{const h=Math.max(k-Math.abs(a-b),0)/k;return Math.min(a,b)-h*h*k*.25;};
function sphereField(p,s){return (Math.hypot((p.x-s.x)/s.stretch[0],(p.y-s.y)/s.stretch[1],(p.z-s.z)/s.stretch[2])-s.r);}
function scalar(p,nodes){let d=1;for(const s of nodes)d=smoothMin(d,sphereField(p,s));return d;}
// Marching tetrahedra welds touching lobes into one continuous scalar-field skin.
function fusedBody(nodes){
 const low=[-1.45,-1.6,-.22],dims=[88,96,48],step=[2.9/88,3.2/96,1.38/48],sx=dims[0]+1,sy=dims[1]+1,sz=dims[2]+1,field=new Float32Array(sx*sy*sz).fill(.20),index=(x,y,z)=>(z*sy+y)*sx+x;
 for(const s of nodes){const pad=s.r*1.25+.07,bounds=[s.x,s.y,s.z].map((v,k)=>[Math.max(0,Math.floor((v-pad-low[k])/step[k])),Math.min(dims[k],Math.ceil((v+pad-low[k])/step[k]))]);
  for(let z=bounds[2][0];z<=bounds[2][1];z++)for(let y=bounds[1][0];y<=bounds[1][1];y++)for(let x=bounds[0][0];x<=bounds[0][1];x++){
   const p={x:low[0]+x*step[0],y:low[1]+y*step[1],z:low[2]+z*step[2]},i=index(x,y,z),d=sphereField(p,s);field[i]=smoothMin(field[i],d);
  }
 }
 const positions=[],normals=[],uv=[],colors=[],corners=[[0,0,0],[1,0,0],[1,1,0],[0,1,0],[0,0,1],[1,0,1],[1,1,1],[0,1,1]],tetra=[[0,5,1,6],[0,1,2,6],[0,2,3,6],[0,3,7,6],[0,7,4,6],[0,4,5,6]];
 function gradient(x,y,z){const at=(x,y,z)=>field[index(clamp(x,0,dims[0]),clamp(y,0,dims[1]),clamp(z,0,dims[2]))];return new T.Vector3((at(x+1,y,z)-at(x-1,y,z))/step[0],(at(x,y+1,z)-at(x,y-1,z))/step[1],(at(x,y,z+1)-at(x,y,z-1))/step[2]).normalize();}
 function emit(a,b,c){const normal=new T.Vector3().subVectors(b.p,a.p).cross(new T.Vector3().subVectors(c.p,a.p)),avg=a.n.clone().add(b.n).add(c.n);if(normal.dot(avg)<0)[b,c]=[c,b];for(const v of [a,b,c]){
   positions.push(...v.p.toArray());normals.push(...v.n.toArray());uv.push(v.p.x*.66+.5,v.p.y*.66+.5);const f=noise(v.p.x*3+4,v.p.y*3+8,v.p.z*4),mix=clamp((f-.43)*3),col=new T.Color('#83708c').lerp(new T.Color('#b4a4be'),mix);if(noise(v.p.x*3+9,v.p.y*3+7)>.70)col.lerp(new T.Color('#7e8b80'),.25);colors.push(col.r,col.g,col.b);
  }}
 for(let z=0;z<dims[2];z++)for(let y=0;y<dims[1];y++)for(let x=0;x<dims[0];x++){
  const values=corners.map(([dx,dy,dz])=>field[index(x+dx,y+dy,z+dz)]);if(values.every(v=>v>=0)||values.every(v=>v<0))continue;
  const vertices=corners.map(([dx,dy,dz],i)=>({d:values[i],p:new T.Vector3(low[0]+(x+dx)*step[0],low[1]+(y+dy)*step[1],low[2]+(z+dz)*step[2]),n:gradient(x+dx,y+dy,z+dz)}));
  const edge=(a,b)=>{const t=a.d/(a.d-b.d);return{p:a.p.clone().lerp(b.p,t),n:a.n.clone().lerp(b.n,t).normalize()};};
  for(const t of tetra){const inside=t.filter(i=>values[i]<0),outside=t.filter(i=>values[i]>=0);if(!inside.length||!outside.length)continue;
   if(inside.length===1){const a=inside[0];emit(...outside.map(b=>edge(vertices[a],vertices[b])));}
   else if(inside.length===3){const a=outside[0];emit(...inside.map(b=>edge(vertices[a],vertices[b])));}
   else {const [a,b]=inside,[c,d]=outside,p=edge(vertices[a],vertices[c]),q=edge(vertices[a],vertices[d]),r=edge(vertices[b],vertices[c]),s=edge(vertices[b],vertices[d]);emit(p,q,r);emit(q,s,r);}
  }
 }
 const g=geo(positions,uv);g.setAttribute('normal',new T.Float32BufferAttribute(normals,3));g.setAttribute('color',new T.Float32BufferAttribute(colors,3));return g;
}
// Small prismatic overgrowth; millimetre-scale appearance, not a second layer of big beads.
function crystal(){const p=[],uv=[],verts=[];for(const h of [0,.62])for(let i=0;i<6;i++){const a=i/6*TAU;verts.push([Math.cos(a),h,Math.sin(a)]);}verts.push([.05,1,-.04]);function tri(a,b,c){for(const i of [a,b,c]){const v=verts[i];p.push(...v);uv.push(v[0]*.5+.5,v[1]);}}for(let i=0;i<6;i++){const n=(i+1)%6;tri(i,i+6,n);tri(n,i+6,n+6);tri(i+6,12,n+6);}return geo(p,uv);}
function merge(list){const p=[],n=[],uv=[],colors=[];for(const g of list){p.push(...g.attributes.position.array);n.push(...g.attributes.normal.array);uv.push(...g.attributes.uv.array);if(g.attributes.color)colors.push(...g.attributes.color.array);}const g=geo(p,uv);g.setAttribute('normal',new T.Float32BufferAttribute(n,3));if(colors.length)g.setAttribute('color',new T.Float32BufferAttribute(colors,3));return g;}
function mineralColor(p){const f=noise(p.x*3+4,p.y*3+8,p.z*4),mix=clamp((f-.43)*3),col=new T.Color('#83708c').lerp(new T.Color('#b4a4be'),mix);if(noise(p.x*3+9,p.y*3+7)>.70)col.lerp(new T.Color('#7e8b80'),.25);return col;}
function overgrowth(nodes,side,body){
 const groups=Array.from({length:5},()=>[]),rnd=random(99217+side*1031),shape=crystal(),dummy=new T.Object3D(),pos=body.attributes.position,norm=body.attributes.normal,indices=body.index.array,areas=[];let total=0,count=0;
 const vertex=i=>new T.Vector3().fromBufferAttribute(pos,i),normal=i=>new T.Vector3().fromBufferAttribute(norm,i);
 for(let i=0;i<indices.length;i+=3){const a=vertex(indices[i]),b=vertex(indices[i+1]),c=vertex(indices[i+2]);total+=b.sub(a).cross(c.sub(a)).length()*.5;areas.push(total);}
 for(let sample=0;sample<13000;sample++){
  const target=rnd()*total;let lo=0,hi=areas.length-1;while(lo<hi){const mid=(lo+hi)>>1;if(areas[mid]<target)lo=mid+1;else hi=mid;}const a=indices[lo*3],b=indices[lo*3+1],c=indices[lo*3+2],u=Math.sqrt(rnd()),v=rnd(),p=vertex(a).multiplyScalar(1-u).addScaledVector(vertex(b),u*(1-v)).addScaledVector(vertex(c),u*v),n=normal(a).multiplyScalar(1-u).addScaledVector(normal(b),u*(1-v)).addScaledVector(normal(c),u*v).normalize();
  if(n.z>.35&&rnd()>.10)continue;const patch=noise(p.x*18+8,p.y*18+2,p.z*18);if(rnd()>(patch>.48?.90:.40))continue;
  let best=Infinity,radius=.08;for(const s of nodes){const d=Math.abs(sphereField(p,s));if(d<best){best=d;radius=s.r;}}
  dummy.position.copy(p).addScaledVector(n,-.0005);dummy.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),n);dummy.rotateY(rnd()*TAU);const w=radius*(.020+rnd()*.016),length=radius*(.027+rnd()*.025);dummy.scale.set(w,length,w*(.72+rnd()*.3));dummy.updateMatrix();const g=shape.clone().applyMatrix4(dummy.matrix),col=mineralColor(p),colors=[];for(let i=0;i<g.attributes.position.count;i++)colors.push(col.r,col.g,col.b);g.setAttribute('color',new T.Float32BufferAttribute(colors,3));groups[count%5].push(g);count++;
 }return{groups:groups.map(merge),count};
}
// Share identical surface vertices; preserve sharp crystal-face normals as separate vertices.
function indexed(g){
 const keys=Object.keys(g.attributes),arrays=Object.fromEntries(keys.map(k=>[k,[]])),lookup=new Map(),indices=[];
 for(let i=0;i<g.attributes.position.count;i++){
  const values=keys.flatMap(k=>{const a=g.attributes[k];return Array.from({length:a.itemSize},(_,j)=>a.array[i*a.itemSize+j]);}),key=values.map(v=>Math.round(v*100000)).join(',');let id=lookup.get(key);
  if(id===undefined){id=lookup.size;lookup.set(key,id);for(const k of keys){const a=g.attributes[k];for(let j=0;j<a.itemSize;j++)arrays[k].push(a.array[i*a.itemSize+j]);}}indices.push(id);
 }
 const out=new T.BufferGeometry();for(const k of keys)out.setAttribute(k,new T.Float32BufferAttribute(arrays[k],g.attributes[k].itemSize));out.setIndex(indices);return out;
}
function coverage(nodes){let total=0,covered=0,center=0,centerCovered=0;for(let y=-1.2;y<=1.2;y+=.035)for(let x=-1.1;x<=1.1;x+=.035){const r=Math.hypot(x/1.22,y/1.32);if(r>.9)continue;total++;const yes=nodes.some(s=>((x-s.x)/(s.r*s.stretch[0]))**2+((y-s.y)/(s.r*s.stretch[1]))**2<.95);if(yes)covered++;if(r<.35){center++;if(yes)centerCovered++;}}return{samples:total,ratio:covered/total,centerRatio:centerCovered/center};}
const builder=new GLB(),maps=drusyMaps(),shell=builder.material('Weathered_shell',[1,1,1],shellMaps),wall=builder.material('Mineral_cavity',new T.Color('#aaa4b5').toArray(),maps,.85),band=builder.material('Cut_mineral_bands',[.9,.9,.9],shellMaps,.85,{doubleSided:true}),body=builder.material('Fused_botryoidal_body',[1,1,1],maps,.38,{extensions:{KHR_materials_ior:{ior:1.54},KHR_materials_clearcoat:{clearcoatFactor:.13,clearcoatRoughnessFactor:.24},KHR_materials_transmission:{transmissionFactor:.06}}});
builder.doc.materials[body].normalTexture.scale=.50;builder.doc.materials[wall].normalTexture.scale=.16;
const coat=['#cec5d6','#b9adc8','#e1dce5','#bab4c4','#c5cabc'].map((color,i)=>builder.material('Drusy_quartz_overgrowth_'+i,[1,1,1],null,.16+i*.025,{extensions:{KHR_materials_ior:{ior:1.54},KHR_materials_transmission:{transmissionFactor:.30},KHR_materials_clearcoat:{clearcoatFactor:.15,clearcoatRoughnessFactor:.13}}}));builder.doc.extensionsUsed=['KHR_materials_ior','KHR_materials_transmission','KHR_materials_clearcoat'];
const closed=builder.node({name:'Closed',children:[builder.mesh('Closed_front',originalGeometry('Closed_front'),shell),builder.mesh('Closed_back',originalGeometry('Closed_back'),shell)]}),halves=[],report=[];
for(let side=0;side<2;side++){
 const nodes=nodules(side),bodyGeometry=indexed(fusedBody(nodes)),druse=overgrowth(nodes,side,bodyGeometry),parts=[builder.mesh('Outer_shell_'+side,originalGeometry('Outer_shell_'+side),shell),builder.mesh('Cavity_'+side,cavity(side),wall),builder.mesh('Mineral_layers_'+side,rimGeometry(),band),builder.mesh('Botryoidal_fused_'+side,bodyGeometry,body)];druse.groups.forEach((g,i)=>parts.push(builder.mesh('Crystals_'+side+'_'+i,indexed(g),coat[i])));
 halves.push(builder.node({name:side?'Open_Right':'Open_Left',children:parts,...(side?{rotation:[0,1,0,0]}:{})}));report.push({nodules:nodes.length,coverage:coverage(nodes),bodyTriangles:bodyGeometry.index.count/3,microcrystals:druse.count,coatingTriangles:druse.groups.reduce((n,g)=>n+g.attributes.position.count/3,0)});console.log(side,report[side]);
}
builder.doc.scenes[0].nodes=[closed,...halves];builder.doc.extras={status:'Original procedural reconstruction, not a scan',revision:'grape-drusy-v3',cutPlane:'z=0',openRotationY:[-2.62,2.62],textureResolution:512,structure:'Continuous SDF fused lobes with faceted quartz overgrowth',report,reference:'Real specimen photographs and habit descriptions in docs/MINERAL_DENSITY_REVISION.md',conceptOnly:'09-grape-drusy-direction-v03.png is an AI image, not a texture or scan'};
const bytes=builder.save(base+'models/botryoidal-chalcedony-study-v3.glb');writeFileSync(base+'models/grape-drusy-v3-manifest.json',JSON.stringify({generator:'tools/build-grape-drusy-v3.mjs',bytes,report,status:'Procedural 3D study, not a scan'},null,2)+'\n');console.log({bytes});
